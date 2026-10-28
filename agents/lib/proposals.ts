// A designer proposal is a list of ops on web/content. This turns it into a patched copy of
// the build, a reviewable diff, and a bot regression result. Nothing touches web/ until a
// person runs `proposals.ts apply`.
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { PROPOSALS, REPO } from "./config.ts";

const require = createRequire(import.meta.url);
const { validateContent, flatten } = require("../../test/metrics.js") as {
  validateContent(content: any): string[];
  flatten(o: object): Record<string, number>;
};

export interface Op { op: "add_event" | "replace_event" | "set"; target: "events" | "game"; id: string | null; path: string | null; json: string }
export interface Proposal {
  id: string; title: string; kind: string; addresses: string[]; rationale: string; ops: Op[];
  prediction: { metric: string; direction: "up" | "down" | "unchanged"; expected: string; why: string };
}
export interface Status {
  status: "awaiting_approval" | "failed_regression" | "invalid" | "approved" | "rejected";
  errors: string[];
  regression?: { pass: boolean; output: string };
  prediction?: { metric: string; before: number | null; after: number | null; direction: string; matched: boolean | null };
  audit?: unknown;
  reason?: string;
  updatedAt: string;
}

const WEB = path.join(REPO, "web");
const FX_KEYS = new Set(["reputation", "standing", "integrity", "competence", "wealth", "heat", "cep", "appraisal"]);
const REQ_KEYS = new Set(["minRank", "maxRank", "minStats", "maxStats", "minAge", "maxAge", "flagsAll", "flagsNone", "origin", "originNot", "notDuringBond",
  "ministry", "economy", "electionDue", "cooldown", "rival"]);
// Everything web/engine.js reads on a card. A field missing here is refused in a proposal.
const EVENT_KEYS = new Set(["id", "title", "body", "requires", "weight", "once", "priority", "triggered", "choices",
  "alternates", "variants", "standout", "noMontage", "montageLines", "montageEffects", "autoPlay", "cooldown", "rivalCard"]);
const CHOICE_KEYS = new Set(["text", "effects", "setFlags", "clearFlags", "outcome", "schedule", "requiresStat", "setRank", "election",
  "standout", "pip", "resetWarnings", "readFolder", "folder", "privateSector", "nationalBonus", "nationalBonusRisk", "newMinistry", "markSeen", "rival"]);

export const dirOf = (id: string) => path.join(PROPOSALS, id);
export const readJson = (f: string) => JSON.parse(fs.readFileSync(f, "utf8"));
// The repo's content files are 2-space JSON with no trailing newline.
const serialize = (o: unknown) => JSON.stringify(o, null, 2);

export function loadContent(root = WEB) {
  return { game: readJson(path.join(root, "content/game.json")), events: readJson(path.join(root, "content/events.json")) as any[] };
}

function validateEvent(e: any): string[] {
  const errs: string[] = [];
  const at = `event ${e?.id ?? "?"}`;
  if (!e || typeof e !== "object") return [`${at}: not an object`];
  for (const k of Object.keys(e)) if (!EVENT_KEYS.has(k)) errs.push(`${at}: unknown field ${k}`);
  if (!/^[a-z][a-z0-9_]*$/.test(e.id ?? "")) errs.push(`${at}: id must be snake_case`);
  if (!e.title || !e.body) errs.push(`${at}: needs title and body`);
  // a triggered event may take requires: it then waits, still scheduled, until they hold
  for (const k of Object.keys(e.requires || {})) if (!REQ_KEYS.has(k)) errs.push(`${at}: unknown requirement ${k}`);
  if (!Array.isArray(e.choices) || e.choices.length < 1 || e.choices.length > 4) errs.push(`${at}: needs 1-4 choices`);
  for (const [i, c] of (e.choices || []).entries()) {
    for (const k of Object.keys(c)) if (!CHOICE_KEYS.has(k)) errs.push(`${at} choice ${i}: unknown field ${k}`);
    for (const k of Object.keys(c.effects || {})) if (!FX_KEYS.has(k)) errs.push(`${at} choice ${i}: unknown effect ${k}`);
    for (const s of c.schedule || []) if (!s.eventId || !(s.inYears > 0)) errs.push(`${at} choice ${i}: schedule needs eventId and inYears > 0`);
  }
  return errs;
}

function setPath(obj: any, dotted: string, value: unknown) {
  const keys = dotted.split(".");
  let o = obj;
  for (const k of keys.slice(0, -1)) {
    if (o[k] === undefined) o[k] = {};
    o = o[k];
    if (typeof o !== "object" || o === null) throw new Error(`path ${dotted}: ${k} is not an object`);
  }
  const last = keys[keys.length - 1];
  if (value === null) delete o[last]; else o[last] = value;
}

export function applyOps(content: { game: any; events: any[] }, ops: Op[]): { content: { game: any; events: any[] }; errors: string[]; touched: string[] } {
  const c = structuredClone(content);
  const errors: string[] = [], touched: string[] = [];
  for (const [i, op] of ops.entries()) {
    let value: any;
    try { value = JSON.parse(op.json); } catch { errors.push(`op ${i}: json does not parse`); continue; }
    try {
      if (op.op === "add_event") {
        if (c.events.some(e => e.id === value?.id)) throw new Error(`event ${value?.id} already exists`);
        c.events.push(value); touched.push(value.id);
      } else if (op.op === "replace_event") {
        const k = c.events.findIndex(e => e.id === op.id);
        if (k < 0) throw new Error(`no event ${op.id}`);
        if (value?.id !== op.id) throw new Error(`replacement must keep id ${op.id}`);
        c.events[k] = value; touched.push(op.id!);
      } else if (op.op === "set") {
        if (!op.path) throw new Error("set needs a path");
        if (op.target === "game") setPath(c.game, op.path, value);
        else {
          const e = c.events.find(x => x.id === op.id);
          if (!e) throw new Error(`no event ${op.id}`);
          setPath(e, op.path, value); touched.push(op.id!);
        }
      } else throw new Error(`unknown op ${op.op}`);
    } catch (e) { errors.push(`op ${i} (${op.op}): ${(e as Error).message}`); }
  }
  for (const id of new Set(touched)) errors.push(...validateEvent(c.events.find(e => e.id === id)));
  errors.push(...validateContent({ ...c.game, events: c.events }));
  return { content: c, errors, touched: [...new Set(touched)] };
}

// A full copy of web/ with the proposal applied, so bots and agents can play it before
// anyone approves it: node test/sim.js regress --content proposals/<id>/build
export function writeBuild(id: string, content: { game: any; events: any[] }): string {
  const out = path.join(dirOf(id), "build");
  fs.rmSync(out, { recursive: true, force: true });
  fs.cpSync(WEB, out, { recursive: true });
  fs.writeFileSync(path.join(out, "content/game.json"), serialize(content.game));
  fs.writeFileSync(path.join(out, "content/events.json"), serialize(content.events));
  return out;
}

// Diff of the canonical forms, so formatting noise in the originals never hides the change.
export function diffAgainstWeb(build: string): string {
  const tmp = fs.mkdtempSync(path.join(path.dirname(build), ".base-"));
  let out = "";
  try {
    for (const f of ["game.json", "events.json"]) {
      const base = path.join(tmp, f);
      fs.writeFileSync(base, serialize(readJson(path.join(WEB, "content", f))) + "\n");
      const mine = path.join(tmp, f + ".new");
      fs.writeFileSync(mine, fs.readFileSync(path.join(build, "content", f), "utf8") + "\n");
      const r = spawnSync("diff", ["-u", "-L", `a/web/content/${f}`, "-L", `b/web/content/${f}`, base, mine], { encoding: "utf8" });
      out += r.stdout;
    }
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  return out;
}

export function regress(build: string, jsonOut: string, baseline?: string, runs = 400): { pass: boolean; output: string } {
  const args = [path.join(REPO, "test/sim.js"), "regress", String(runs), "--content", build, "--json", jsonOut];
  if (baseline && fs.existsSync(baseline)) args.push("--baseline", baseline);
  const r = spawnSync(process.execPath, args, { encoding: "utf8", maxBuffer: 64 << 20 });
  return { pass: r.status === 0, output: (r.stdout + r.stderr).trim() };
}

export function botMetrics(jsonOut: string, root?: string, runs = 800): Record<string, any> {
  const args = [path.join(REPO, "test/sim.js"), String(runs), "--json", jsonOut];
  if (root) args.push("--content", root);
  execFileSync(process.execPath, args, { stdio: "ignore", maxBuffer: 64 << 20 });
  return readJson(jsonOut);
}

export function checkPrediction(p: Proposal, before: Record<string, any> | null, after: Record<string, any>) {
  const b = before ? flatten(before)[p.prediction.metric] ?? null : null;
  const a = flatten(after)[p.prediction.metric] ?? null;
  let matched: boolean | null = null;
  if (a !== null && b !== null) {
    matched = p.prediction.direction === "up" ? a > b : p.prediction.direction === "down" ? a < b : Math.abs(a - b) < 1e-9;
  }
  return { metric: p.prediction.metric, before: b, after: a, direction: p.prediction.direction, matched };
}

export function writeStatus(id: string, s: Omit<Status, "updatedAt">) {
  fs.writeFileSync(path.join(dirOf(id), "status.json"), JSON.stringify({ ...s, updatedAt: new Date().toISOString() }, null, 1) + "\n");
}

export function proposalMarkdown(p: Proposal, s: Omit<Status, "updatedAt">, diff: string): string {
  const pr = s.prediction;
  return [
    `# ${p.title}`,
    "",
    `**${p.id}** · ${p.kind} · addresses ${p.addresses.join(", ") || "—"} · status **${s.status}**`,
    "",
    p.rationale,
    "",
    "## Prediction",
    "",
    `\`${p.prediction.metric}\` goes **${p.prediction.direction}**: ${p.prediction.expected}. ${p.prediction.why}`,
    pr && pr.after !== null ? `\nBot regression measured: ${pr.before ?? "?"} → ${pr.after}${pr.matched === null ? "" : pr.matched ? " (as predicted)" : " (NOT as predicted)"}` : "\nNot a bot metric: checked on the next blind cohort.",
    "",
    "## Checks",
    "",
    s.errors.length ? s.errors.map(e => `- ✗ ${e}`).join("\n") : "- ✓ ops apply cleanly and the content validates",
    s.regression ? `- ${s.regression.pass ? "✓ bot regression passes" : "✗ bot regression FAILS: back to the designer"}` : "",
    s.audit ? "- content audit of new or changed events: see `audit.json`" : "",
    "",
    "## Diff",
    "",
    "```diff",
    diff.trim() || "(no change)",
    "```",
    "",
    "Approve with `node agents/proposals.ts apply " + p.id + "`, or reject with `node agents/proposals.ts reject " + p.id + " <reason>`.",
    ""
  ].join("\n");
}

// Apply, build, diff and regress one proposal, measuring the base build and the patched
// build with the same number of bot runs so every metric is comparable.
export function materialize(p: Proposal, runs = 400) {
  const applied = applyOps(loadContent(), p.ops);
  if (applied.errors.length) return { applied, diff: "", status: { status: "invalid" as const, errors: applied.errors } };
  const out = writeBuild(p.id, applied.content);
  const diff = diffAgainstWeb(out);
  fs.writeFileSync(path.join(dirOf(p.id), "change.diff"), diff);
  const before = path.join(dirOf(p.id), "metrics-before.json"), after = path.join(dirOf(p.id), "metrics.json");
  regress(WEB, before, undefined, runs);
  const reg = regress(out, after, before, runs);
  return { applied, diff, status: {
    status: reg.pass ? "awaiting_approval" as const : "failed_regression" as const, errors: [] as string[], regression: reg,
    prediction: checkPrediction(p, readJson(before), readJson(after)) } as Omit<Status, "updatedAt"> };
}

