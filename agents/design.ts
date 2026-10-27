// Designer: turns an analysis into proposals, each a diff plus a prediction, bot-tested and
// (for new or changed events) content-audited before a person sees it.
//
//   node agents/design.ts <analysis dir> [--model claude-fable-5-1] [--mock] [--no-audit]
//
// Writes proposals/<date>-<id>/ with proposal.md (read this), proposal.json, change.diff,
// status.json, metrics.json, audit.json and build/ (the patched copy of web/).
import fs from "node:fs";
import path from "node:path";
import { PROPOSALS, type ModelId } from "./lib/config.ts";
import { H } from "./lib/harness.ts";
import { mockLlm, realLlm } from "./lib/llm.ts";
import { mechanics } from "./lib/prompts.ts";
import { audit, design } from "./lib/analysis.ts";
import { dirOf, loadContent, materialize, proposalMarkdown, readJson, writeStatus, type Proposal } from "./lib/proposals.ts";

const argv = process.argv.slice(2);
const opt = (k: string) => { const i = argv.indexOf(k); return i >= 0 ? argv.splice(i, 2)[1] : undefined; };
const has = (k: string) => { const i = argv.indexOf(k); return i >= 0 ? (argv.splice(i, 1), true) : false; };
const mock = has("--mock"), noAudit = has("--no-audit");
const model = opt("--model") as ModelId | undefined;
const dir = argv[0];
if (!dir) { console.error("usage: design.ts <analysis dir>"); process.exit(1); }

const analysis = readJson(path.join(dir, "analysis.json"));
const metricsFile = path.join(dir, "bot-metrics.json");
const metrics = fs.existsSync(metricsFile) ? readJson(metricsFile) : null;
const build = H.loadBuild();
const content = loadContent();
const llm = mock ? mockLlm(9) : realLlm();
const date = new Date().toISOString().slice(0, 10);

// Proposals that failed the regression or were rejected go back to the designer with the reason.
const previous = fs.existsSync(PROPOSALS) ? fs.readdirSync(PROPOSALS).flatMap(d => {
  const f = path.join(PROPOSALS, d, "status.json");
  if (!fs.existsSync(f)) return [];
  const st = readJson(f), pr = readJson(path.join(PROPOSALS, d, "proposal.json"));
  if (!["failed_regression", "rejected", "invalid"].includes(st.status)) return [];
  return [{ id: d, title: pr.title, ops: pr.ops, status: st.status, reason: st.reason ?? null, errors: st.errors,
    regression: st.regression && !st.regression.pass ? st.regression.output.split("\n").filter((l: string) => /✗|!/.test(l)) : null }];
}) : [];
console.log(`asking the designer${previous.length ? ` (with ${previous.length} earlier proposals that failed or were rejected)` : ""}…`);
const r = await design(llm, { analysis, metrics: metrics ?? {}, game: content.game, events: content.events, mechanics: mechanics(build), model, previous });
if (!r.data) { console.error(`✗ no usable proposals (stop: ${r.stop})`); process.exit(1); }
console.log(`${r.data.proposals.length} proposals, $${r.cost.toFixed(2)}`);

for (const raw of r.data.proposals as Proposal[]) {
  const id = `${date}-${raw.id.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}`;
  const p = { ...raw, id };
  fs.mkdirSync(dirOf(id), { recursive: true });
  fs.writeFileSync(path.join(dirOf(id), "proposal.json"), JSON.stringify(p, null, 1) + "\n");
  const { applied, diff, status } = materialize(p);
  const changed = applied.content.events.filter(e => applied.touched.includes(e.id));
  if (status.status === "awaiting_approval" && changed.length && !noAudit) {
    const a = await audit(llm, applied.content.game, changed, { batch: false, log: console.log,
      context: "These events are proposed additions or edits. Audit them as you would the shipped content." });
    if (a?.data) { fs.writeFileSync(path.join(dirOf(id), "audit.json"), JSON.stringify(a.data, null, 1) + "\n"); status.audit = { findings: a.data.findings.length }; }
  }
  writeStatus(id, status);
  fs.writeFileSync(path.join(dirOf(id), "proposal.md"), proposalMarkdown(p, status, diff));
  console.log(`  ${status.status.padEnd(18)} ${id}: ${p.title}${status.errors.length ? `  (${status.errors[0]})` : ""}`);
}
