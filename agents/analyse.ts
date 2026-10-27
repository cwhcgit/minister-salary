// Analyst: joins bot metrics with cohort summaries into a ranked findings report.
//
//   node agents/analyse.ts [cohort dir...] [--metrics FILE] [--proposals id,id] [--mock]
//
// With no --metrics, runs the bots (node test/sim.js 800) on the current build first.
// --proposals names approved proposals whose predictions this cohort should check.
import fs from "node:fs";
import path from "node:path";
import { PROPOSALS, REPORTS } from "./lib/config.ts";
import { H } from "./lib/harness.ts";
import { mockLlm, realLlm } from "./lib/llm.ts";
import { mechanics } from "./lib/prompts.ts";
import { summarizeCohort } from "./lib/report.ts";
import { analyse, analysisMarkdown } from "./lib/analysis.ts";
import { botMetrics, readJson } from "./lib/proposals.ts";

const argv = process.argv.slice(2);
const opt = (k: string) => { const i = argv.indexOf(k); return i >= 0 ? argv.splice(i, 2)[1] : undefined; };
const has = (k: string) => { const i = argv.indexOf(k); return i >= 0 ? (argv.splice(i, 1), true) : false; };
const mock = has("--mock");
const metricsFile = opt("--metrics");
const proposalIds = (opt("--proposals") ?? "").split(",").filter(Boolean);
const cohortDirs = argv;

const build = H.loadBuild();
const current = new Set([build.hash, H.loadBuild({ canaries: true }).hash]);   // canaries change the hash
const date = new Date().toISOString().slice(0, 10);
const outDir = path.join(REPORTS, "analysis", `${date}-${build.hash}${mock ? "-mock" : ""}`);
fs.mkdirSync(outDir, { recursive: true });

let metrics: any;
if (metricsFile) { metrics = readJson(metricsFile); fs.copyFileSync(metricsFile, path.join(outDir, "bot-metrics.json")); }
else {
  console.log("running bot metrics (800 runs per bot per origin)…");
  metrics = botMetrics(path.join(outDir, "bot-metrics.json"));
}
// per-choice pick counts are for the designer; the analyst reads the aggregates
for (const b of Object.values<any>(metrics.bots)) delete b.choicePicks;

const cohorts = cohortDirs.map(d => {
  const s = summarizeCohort(d);
  fs.writeFileSync(path.join(d, "summary.json"), JSON.stringify(s, null, 1) + "\n");
  if (s.buildHash && !current.has(s.buildHash)) console.log(`  ! ${d} was played on build ${s.buildHash}, not the current content (${[...current].join(" or ")})`);
  return s;
});
const predictions = proposalIds.map(id => {
  const p = readJson(path.join(PROPOSALS, id, "proposal.json"));
  const st = readJson(path.join(PROPOSALS, id, "status.json"));
  return { id, title: p.title, prediction: p.prediction, botCheck: st.prediction ?? null, status: st.status };
});

const llm = mock ? mockLlm(5) : realLlm();
console.log(`analysing ${cohorts.length} cohorts${predictions.length ? ` and ${predictions.length} predictions` : ""}…`);
const r = await analyse(llm, { metrics, cohorts, predictions, mechanics: mechanics(build) });
if (!r.data) { console.error(`✗ no usable analysis (stop: ${r.stop})`); process.exit(1); }
fs.writeFileSync(path.join(outDir, "analysis.json"), JSON.stringify(r.data, null, 1) + "\n");
fs.writeFileSync(path.join(outDir, "report.md"), analysisMarkdown(r.data, { date, buildHash: build.hash, cohorts: cohorts.map(c => c.cohort), cost: r.cost }));
console.log(`${r.data.findings.length} findings, $${r.cost.toFixed(2)} → ${path.relative(process.cwd(), path.join(outDir, "report.md"))}`);
