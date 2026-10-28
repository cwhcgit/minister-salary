// Content auditor: one pass over every player-visible line against the five tone rules.
// Run once per content version, before the first cohort.
//
//   node agents/audit.ts [--no-batch] [--mock] [--canaries] [--build DIR]
//
// Batch API by default (half price; usually done within the hour). --canaries includes the
// two planted canary events, to confirm the auditor catches the winking one.
import fs from "node:fs";
import path from "node:path";
import { REPORTS } from "./lib/config.ts";
import { H } from "./lib/harness.ts";
import { credentialSource, mockLlm, realLlm } from "./lib/llm.ts";
import { audit, auditMarkdown } from "./lib/analysis.ts";

const argv = process.argv.slice(2);
const has = (k: string) => argv.includes(k);
const opt = (k: string) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };

const build = H.loadBuild({ root: opt("--build"), canaries: has("--canaries") });
const llm = has("--mock") ? mockLlm(11) : realLlm();
if (!llm.mock) console.log(`credentials: ${credentialSource()}`);
const { events, ...game } = build.content;
const engineSrc = fs.readFileSync(path.join(build.root, "engine.js"), "utf8");
console.log(`auditing ${events.length} events on build ${build.hash}${has("--no-batch") ? "" : " via the Batch API"}…`);
const r = await audit(llm, game, events, { batch: !has("--no-batch"), log: console.log, engineSrc });
if (!r?.data) { console.error(`✗ no usable audit (stop: ${r?.stop})`); process.exit(1); }
const dir = path.join(REPORTS, "audit");
fs.mkdirSync(dir, { recursive: true });
const base = path.join(dir, `${build.hash}${llm.mock ? "-mock" : ""}`);
fs.writeFileSync(base + ".json", JSON.stringify(r.data, null, 1) + "\n");
fs.writeFileSync(base + ".md", auditMarkdown(r.data, build.hash));
const must = r.data.findings.filter((f: any) => f.severity === "must_fix").length;
console.log(`${r.data.findings.length} findings (${must} must fix), $${r.cost.toFixed(2)} → ${path.relative(process.cwd(), base)}.md`);
