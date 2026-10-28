// One structured request to Claude, its cost from the API's own usage fields, and a mock
// with the same shape for running the whole pipeline offline.
//
// Request layout, for prompt caching. Single requests (`user`): the system prompt (persona +
// game description, identical for every turn of a cohort) carries a cache breakpoint; an
// optional second stable block (a lineage's notes from earlier lives) carries another; the
// volatile part comes last, uncached. Conversations (`messages`, the fun sessions): the
// system breakpoint, plus top-level automatic caching, which puts a breakpoint on the last
// block and moves it forward as the conversation grows, so each turn reads everything before
// it from the cache and writes only the new screen.
import crypto from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import { HAS_FALLBACK, PRICES, type Effort, type ModelId, type Thinking } from "./config.ts";

export interface Block { text: string; cache?: boolean }
export interface Msg { role: "user" | "assistant"; content: Block[] }
export interface CallOpts {
  model: ModelId;
  effort: Effort;
  system: string;
  user?: Block[];       // one user message, or
  messages?: Msg[];     // a whole conversation
  autoCache?: boolean;  // top-level cache_control: a breakpoint on the last block
  thinking?: Thinking;  // unset: the model's default
  schema: Record<string, unknown>;
  maxTokens: number;
  stream?: boolean;     // for long outputs (analyst, designer)
}
// thinking: the part of `output` that was thinking (already counted in output)
export interface Usage { input: number; output: number; cacheWrite: number; cacheRead: number; thinking?: number }
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

interface UsageLike {
  input_tokens: number; output_tokens: number; cache_creation_input_tokens: number | null; cache_read_input_tokens: number | null;
  output_tokens_details?: { thinking_tokens?: number | null } | null;
}
interface MessageLike {
  model: string;
  content: Array<{ type: string; text?: string }>;
  stop_reason: string | null;
  stop_details?: { category?: string | null; explanation?: string | null } | null;
  usage: UsageLike;
}

export function usageOf(u: UsageLike): Usage {
  return { input: u.input_tokens, output: u.output_tokens, cacheWrite: u.cache_creation_input_tokens ?? 0, cacheRead: u.cache_read_input_tokens ?? 0,
    thinking: u.output_tokens_details?.thinking_tokens ?? 0 };
}

const textBlock = (b: Block) => b.cache
  ? { type: "text" as const, text: b.text, cache_control: { type: "ephemeral" as const } }
  : { type: "text" as const, text: b.text };

export function buildParams(o: CallOpts): Anthropic.Beta.MessageCreateParamsNonStreaming {
  const fallback = HAS_FALLBACK[o.model];
  return {
    model: o.model,
    max_tokens: o.maxTokens,
    system: [{ type: "text", text: o.system, cache_control: { type: "ephemeral" } }],
    messages: o.messages
      ? o.messages.map(m => ({ role: m.role, content: m.content.map(textBlock) }))
      : [{ role: "user", content: (o.user ?? []).map(textBlock) }],
    ...(o.autoCache ? { cache_control: { type: "ephemeral" as const } } : {}),
    ...(o.thinking ? { thinking: { type: o.thinking } } : {}),
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

const MIN_CACHE_TOKENS = 512;   // Haiku 5.5, Sonnet 5.5, Opus 5.5
const LOOKBACK = 20;            // blocks a breakpoint looks back for an earlier write

// Token counts the way the API would report them for this request, given what earlier
// requests wrote to the cache: breakpoints on the system prompt, on blocks marked `cache`,
// and (autoCache) on the last block; a hit reads the longest written prefix, the rest up to
// the last breakpoint is written, anything after it is plain input. About 4 characters a token.
export function mockUsage(o: CallOpts, written: Set<string>): Omit<Usage, "output"> {
  const msgs: Msg[] = o.messages ?? [{ role: "user", content: o.user ?? [] }];
  const blocks = [{ text: o.system, bp: true }, ...msgs.flatMap(m => m.content.map(b => ({ text: `${m.role}\u0000${b.text}`, bp: !!b.cache })))];
  if (o.autoCache) blocks[blocks.length - 1].bp = true;
  const cum: number[] = [], keys: string[] = [];
  let n = 0, h = o.model + "\u0000" + JSON.stringify(o.schema);
  for (const b of blocks) {
    cum.push(n += Math.ceil(b.text.length / 4));
    keys.push(h = crypto.createHash("sha256").update(h).update("\u0000").update(b.text).digest("hex"));
  }
  const bps = blocks.map((b, i) => (b.bp ? i : -1)).filter(i => i >= 0);
  let hit = -1;
  for (const b of bps) for (let j = b; j >= Math.max(0, b - LOOKBACK + 1); j--) if (written.has(keys[j])) { hit = Math.max(hit, j); break; }
  const read = hit >= 0 ? cum[hit] : 0;
  const cacheable = bps.filter(b => cum[b] >= MIN_CACHE_TOKENS);
  for (const b of cacheable) written.add(keys[b]);
  const end = cacheable.length ? Math.max(read, cum[cacheable[cacheable.length - 1]]) : read;
  return { input: n - end, cacheWrite: end - read, cacheRead: read, thinking: 0 };
}

// Fills any schema with plausible values. Fun-session fields get scripted values: a delta that
// drifts a little upward, about-ten-word reasons, the bland canary marked down and the winking
// one flagged, so the whole report (canary check included) has something real to chew on.
function fill(schema: any, r: () => number, key: string, ctx: { choices: string[]; text: string }): unknown {
  if (key === "off_tone")
    return /Is This Satire\?/.test(ctx.text) ? "Somewhere, a narrator nods knowingly." : r() < 0.05 ? "a line that read like a wink" : null;
  if (schema.anyOf) return r() < 0.7 ? null : fill(schema.anyOf[0], r, key, ctx);
  if (key === "choice" && ctx.choices.length) return ctx.choices[Math.floor(r() * ctx.choices.length)];
  if (key === "delta" && schema.enum) {
    const max = Math.max(...schema.enum);
    const d = /The Quarterly Return/.test(ctx.text) ? -6 : Math.round(r() * 8 - 2.5);
    return Math.max(-max, Math.min(max, d));
  }
  if (key === "reason") return "mock: the line about the appraisal wording landed, mostly";
  if (key === "quit_reason") return "mock: the same cards kept coming back and the careers started to blur together";
  if (key === "best_card" || key === "worst_card") {
    const titles = [...ctx.text.matchAll(/"([^"]+)" \(/g)].map(m => m[1]);
    return (key === "best_card" ? titles[0] : titles[titles.length - 1]) ?? "mock card";
  }
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
  const written = new Set<string>();
  return {
    mock: true,
    async call<T>(o: CallOpts) {
      const lastUser = o.messages ? [...o.messages].reverse().find(m => m.role === "user")!.content : o.user ?? [];
      const userText = lastUser.map(b => b.text).join("\n");
      // available choices: "  A) text" lines on the screen without an [unavailable: ...] marker
      const screen = userText.split("<screen>")[1]?.split("</screen>")[0] ?? "";
      let choices = [...screen.matchAll(/^ {2}([A-D])\) (.*)$/gm)].filter(m => !m[2].includes("[unavailable")).map(m => m[1]);
      if (!choices.length && /with choice A\./.test(userText)) choices = ["A"];
      const data = fill(o.schema, r, "", { choices, text: userText }) as T;
      const text = JSON.stringify(data);
      const noThinking = o.thinking === "disabled" || o.thinking === "between_tools";
      const usage: Usage = { ...mockUsage(o, written), output: Math.ceil(text.length / 4) + (noThinking ? 5 : 60) };
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
