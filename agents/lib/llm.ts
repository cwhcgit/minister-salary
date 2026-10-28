// One structured request to Claude, its cost from the API's own usage fields, and a mock
// with the same shape for running the whole pipeline offline.
//
// Request layout, for prompt caching: the system prompt (persona + game description,
// identical for every turn of a cohort) carries a cache breakpoint; an optional second
// stable block (a lineage's notes from earlier lives) carries another; the volatile part
// (the agent's notes and the current screen) comes last, uncached.
import Anthropic from "@anthropic-ai/sdk";
import { HAS_FALLBACK, PRICES, type Effort, type ModelId } from "./config.ts";

export interface Block { text: string; cache?: boolean }
export interface CallOpts {
  model: ModelId;
  effort: Effort;
  system: string;
  user: Block[];
  schema: Record<string, unknown>;
  maxTokens: number;
  stream?: boolean;     // for long outputs (analyst, designer)
}
export interface Usage { input: number; output: number; cacheWrite: number; cacheRead: number }
export interface CallResult<T> {
  data: T | null;       // null on refusal, truncation or unparseable output
  text: string;
  stop: string;
  refusal: { category: string | null; explanation: string | null } | null;
  servedBy: string;
  usage: Usage;
  cost: number;
}
export interface Llm {
  call<T>(opts: CallOpts): Promise<CallResult<T>>;
  mock: boolean;
}

export function costOf(model: ModelId, u: Usage, batch = false): number {
  const p = PRICES[model];
  const c = (u.input * p.input + u.output * p.output + u.cacheWrite * p.cacheWrite + u.cacheRead * p.cacheRead) / 1e6;
  return batch ? c / 2 : c;
}

interface UsageLike { input_tokens: number; output_tokens: number; cache_creation_input_tokens: number | null; cache_read_input_tokens: number | null }
interface MessageLike {
  model: string;
  content: Array<{ type: string; text?: string }>;
  stop_reason: string | null;
  stop_details?: { category?: string | null; explanation?: string | null } | null;
  usage: UsageLike;
}

export function usageOf(u: UsageLike): Usage {
  return { input: u.input_tokens, output: u.output_tokens, cacheWrite: u.cache_creation_input_tokens ?? 0, cacheRead: u.cache_read_input_tokens ?? 0 };
}

export function buildParams(o: CallOpts): Anthropic.Beta.MessageCreateParamsNonStreaming {
  const fallback = HAS_FALLBACK[o.model];
  return {
    model: o.model,
    max_tokens: o.maxTokens,
    system: [{ type: "text", text: o.system, cache_control: { type: "ephemeral" } }],
    messages: [{
      role: "user",
      content: o.user.map(b => b.cache
        ? { type: "text" as const, text: b.text, cache_control: { type: "ephemeral" as const } }
        : { type: "text" as const, text: b.text })
    }],
    output_config: { effort: o.effort, format: { type: "json_schema", schema: o.schema } },
    // On a safety decline, re-run on Anthropic's recommended model for that category.
    ...(fallback ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {})
  };
}

export function parseMessage<T>(model: ModelId, msg: MessageLike, batch = false): CallResult<T> {
  const text = msg.content.map(b => (b.type === "text" ? b.text ?? "" : "")).join("");
  const usage = usageOf(msg.usage);
  let data: T | null = null;
  if (msg.stop_reason !== "refusal" && msg.stop_reason !== "max_tokens") {
    try { data = JSON.parse(text) as T; } catch { data = null; }
  }
  const sd = msg.stop_reason === "refusal" ? msg.stop_details : null;
  return {
    data, text, stop: msg.stop_reason ?? "unknown",
    refusal: sd ? { category: sd.category ?? null, explanation: sd.explanation ?? null } : null,
    servedBy: msg.model, usage, cost: costOf(model, usage, batch)
  };
}

// --- credentials -------------------------------------------------------------
// Paid runs authenticate from GitHub Actions with Workload Identity Federation, so no API key
// exists anywhere. The zero-argument client reads ANTHROPIC_FEDERATION_RULE_ID,
// ANTHROPIC_ORGANIZATION_ID, ANTHROPIC_SERVICE_ACCOUNT_ID, ANTHROPIC_WORKSPACE_ID and
// ANTHROPIC_IDENTITY_TOKEN_FILE, exchanges the identity token on the first request, and
// re-reads the file each time its access token needs refreshing
// (.github/scripts/anthropic-wif.sh keeps the file fresh). PLAYTEST_ANTHROPIC_API_KEY is still
// honoured for a run outside Actions.

// Any of these would be used instead of federation. Checked by presence, since some SDK
// releases treat an empty ANTHROPIC_API_KEY as set.
const KEY_VARS = ["ANTHROPIC_API_KEY", "PLAYTEST_ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN", "ANTHROPIC_PROFILE"];
const WIF_VARS = ["ANTHROPIC_FEDERATION_RULE_ID", "ANTHROPIC_ORGANIZATION_ID", "ANTHROPIC_IDENTITY_TOKEN_FILE"];
export const RETRIES = { maxRetries: 4 };   // per request: 429 / 5xx / connection errors, with backoff

// Names the credential this process will use, and refuses a mixed or incomplete setup.
// PLAYTEST_REQUIRE_WIF (set by the workflows) makes federation the only acceptable source.
export function credentialSource(env: NodeJS.ProcessEnv = process.env): string {
  const keys = KEY_VARS.filter(k => k in env);
  const wif = WIF_VARS.every(k => env[k]);
  if (env.PLAYTEST_REQUIRE_WIF && !wif)
    throw new Error(`PLAYTEST_REQUIRE_WIF is set, but ${WIF_VARS.filter(k => !env[k]).join(", ")} is not`);
  if ((wif || env.PLAYTEST_REQUIRE_WIF) && keys.length)
    throw new Error(`workload identity federation is configured, but ${keys.join(", ")} is also set and would be used instead; unset it`);
  if (wif) return "workload identity federation";
  if (env.PLAYTEST_ANTHROPIC_API_KEY) return "PLAYTEST_ANTHROPIC_API_KEY";
  return "the SDK's default lookup (ANTHROPIC_API_KEY, ANTHROPIC_AUTH_TOKEN or an `ant auth login` profile)";
}

// One client per process, so one token cache: each access token costs one exchange, and a
// single-use identity token is never presented twice by two clients.
let shared: Anthropic | null = null;
export function client(): Anthropic {
  if (shared) return shared;
  credentialSource();
  const key = process.env.PLAYTEST_ANTHROPIC_API_KEY;
  shared = key ? new Anthropic({ apiKey: key }) : new Anthropic();
  return shared;
}

export function realLlm(): Llm {
  const c = client();
  return {
    mock: false,
    async call<T>(o: CallOpts) {
      const params = buildParams(o);
      const msg = o.stream
        ? await c.beta.messages.stream(params, RETRIES).finalMessage()
        : await c.beta.messages.create(params, RETRIES);
      return parseMessage<T>(o.model, msg);
    }
  };
}


// --- mock ------------------------------------------------------------------
// Fills any schema with plausible values, picks only available choices, and reports
// token usage shaped like a cached cohort. Costs are fake but computed the real way.

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function fill(schema: any, r: () => number, key: string, ctx: { choices: string[] }): unknown {
  if (schema.anyOf) return r() < 0.7 ? null : fill(schema.anyOf[0], r, key, ctx);
  if (key === "choice" && ctx.choices.length) return ctx.choices[Math.floor(r() * ctx.choices.length)];
  if (schema.enum) return schema.enum[Math.floor(r() * schema.enum.length)];
  switch (schema.type) {
    case "object": return Object.fromEntries(Object.entries(schema.properties).map(([k, s]) => [k, fill(s, r, k, ctx)]));
    case "array": return Array.from({ length: Math.floor(r() * 3) }, () => fill(schema.items, r, key, ctx));
    case "boolean": return r() < 0.5;
    case "integer": return 1 + Math.floor(r() * 30);
    case "string": return key === "json" ? "null" : `mock ${key}`;
    default: return null;
  }
}

export function mockLlm(seed = 1): Llm {
  const r = mulberry(seed);
  const warmed = new Set<string>();
  return {
    mock: true,
    async call<T>(o: CallOpts) {
      const userText = o.user.map(b => b.text).join("\n");
      // available choices: "  A) text" lines on the screen without an [unavailable: ...] marker
      const screen = userText.split("<screen>")[1]?.split("</screen>")[0] ?? "";
      const choices = [...screen.matchAll(/^ {2}([A-D])\) (.*)$/gm)].filter(m => !m[2].includes("[unavailable")).map(m => m[1]);
      const data = fill(o.schema, r, "", { choices }) as T;
      const text = JSON.stringify(data);
      const sys = Math.ceil(o.system.length / 4), vol = Math.ceil(userText.length / 4);
      const key = o.model + o.system;
      const usage: Usage = { input: vol, output: Math.ceil(text.length / 4) + 60, cacheWrite: warmed.has(key) ? 0 : sys, cacheRead: warmed.has(key) ? sys : 0 };
      warmed.add(key);
      await new Promise(res => setTimeout(res, 1));
      return { data, text, stop: "end_turn", refusal: null, servedBy: o.model + " (mock)", usage, cost: costOf(o.model, usage) };
    }
  };
}

// --- spend -------------------------------------------------------------------

export class Spend {
  spent = 0;
  calls = 0;
  readonly cap: number;
  constructor(cap: number) { this.cap = cap; }
  add(r: { cost: number }) { this.spent += r.cost; this.calls++; }
  get exhausted() { return this.spent >= this.cap; }
}

export class CapReached extends Error {}

// Runs fn over items with at most n in flight.
export async function pool<T, R>(items: T[], n: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => { while (next < items.length) { const i = next++; out[i] = await fn(items[i], i); } };
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, worker));
  return out;
}
