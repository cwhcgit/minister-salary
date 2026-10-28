// Agent playtest runner. One request per turn, cached prompt prefix, spend and turn caps.
//
//   node agents/runner.ts list
//   node agents/runner.ts play <persona...|blind|all> [options]
//       --dry-run          play 3 runs per persona and print the projected cohort cost, then stop
//       --mock             no API calls: a scripted stand-in plays (free; tests the pipeline)
//       --runs N           override the persona's run count
//       --max-usd X        cap for this whole invocation, on top of each cohort's own cap
//       --concurrency N    games in flight at once (default 4)
//       --max-turns N      per-run turn cap (default 60)
//       --tags phone|none  log tag labels as the phone shows them (default), or drop them
//       --build DIR        play another web/ root, e.g. a proposal's patched copy
//   node agents/runner.ts summarize <cohort dir>   rebuild summary.json from the run logs
//   node agents/runner.ts score <cohort dir> [--no-batch] [--mock]
//       code each diary's "what held you back" answer (Haiku, Batch API) and re-summarize
//
// Credentials: paid runs go through .github/workflows/cohort.yml, which authenticates with
// workload identity federation (no API key anywhere). See lib/llm.ts for the lookup order.
import fs from "node:fs";
import path from "node:path";
import { ANALYSIS, DEFAULTS, PERSONAS, REPORTS, runPlan, type Persona } from "./lib/config.ts";
import { H, type Build } from "./lib/harness.ts";
import { credentialSource, mockLlm, pool, realLlm, Spend, type Llm } from "./lib/llm.ts";
import { playRun, type Ctx, type RunResult, type Spec } from "./lib/play.ts";
import { leakGate, read, sha, systemPrompt } from "./lib/prompts.ts";
import { readRun, runFiles, summarizeCohort } from "./lib/report.ts";
import { runBatch } from "./lib/batch.ts";
import { DIARY_CODE } from "./lib/schemas.ts";

const argv = process.argv.slice(2);
const opt = (k: string) => { const i = argv.indexOf(k); return i >= 0 ? argv.splice(i, 2)[1] : undefined; };
const has = (k: string) => { const i = argv.indexOf(k); return i >= 0 ? (argv.splice(i, 1), true) : false; };
const log = (s: string) => console.log(s);
const usd = (x: number) => `$${x.toFixed(x < 1 ? 4 : 2)}`;

async function main() {
  const cmd = argv.shift();
  if (cmd === "list" || !cmd) return list();
  if (cmd === "play") return play();
  if (cmd === "summarize") return summarize(argv[0]);
  if (cmd === "score") return score();
  throw new Error(`unknown command ${cmd}`);
}

function list() {
  for (const p of PERSONAS)
    log(`${p.id.padEnd(20)} ${p.blind ? "blind " : "full  "} ${p.model.padEnd(18)} ${String(p.runs).padStart(3)} runs  cap ${usd(p.cohortCapUsd)}  ${p.answers}`);
  log(`\ntotal of cohort caps: ${usd(PERSONAS.reduce((n, p) => n + p.cohortCapUsd, 0))}`);
}

function pick(names: string[]): Persona[] {
  if (!names.length) throw new Error("name a persona, 'blind' or 'all' (see: node agents/runner.ts list)");
  if (names.includes("all")) return PERSONAS;
  if (names.includes("blind")) return PERSONAS.filter(p => p.blind && !p.lineage);
  return names.map(n => { const p = PERSONAS.find(x => x.id === n); if (!p) throw new Error(`no persona ${n}`); return p; });
}

async function play() {
  const dry = has("--dry-run"), mock = has("--mock");
  const runsOpt = opt("--runs"), maxUsd = +(opt("--max-usd") ?? Infinity);
  const concurrency = +(opt("--concurrency") ?? DEFAULTS.concurrency);
  const maxTurns = +(opt("--max-turns") ?? DEFAULTS.maxTurns);
  const tags = (opt("--tags") ?? "phone") as "phone" | "none";
  const buildRoot = opt("--build");
  const personas = pick(argv);
  const llm: Llm = mock ? mockLlm(7) : realLlm();
  if (!mock) log(`credentials: ${credentialSource()}`);
  let spentAll = 0;
  const date = new Date().toISOString().slice(0, 10);

  for (const p of personas) {
    const build: Build = H.loadBuild({ root: buildRoot, canaries: p.canaries });
    const leaks = leakGate(p, build);
    if (leaks.length) {
      for (const l of leaks) log(`  ✗ ${l.file}${l.line ? `:${l.line}` : ""} ${l.why}: "${l.match}"`);
      throw new Error(`${p.id}: blind prompts leak hidden information; fix them before launching`);
    }
    const system = systemPrompt(p, build);
    const plan = runPlan(p, runsOpt ? +runsOpt : p.runs);
    const runs = dry ? plan.slice(0, DEFAULTS.dryRunsPerPersona) : plan;
    const cap = Math.min(p.cohortCapUsd, maxUsd - spentAll);
    const spend = new Spend(cap);
    const cohort = `${date}-${p.id}-${build.hash}${dry ? "-dry" : ""}${mock ? "-mock" : ""}`;
    const outDir = path.join(REPORTS, "cohorts", cohort);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "system-prompt.txt"), system + "\n");
    fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify({
      cohort, persona: p, buildHash: build.hash, buildRoot: build.root, canaries: build.canaries, systemHash: sha(system),
      runs: runs.length, plannedRuns: plan.length, capUsd: cap, maxTurns, tags, concurrency, dryRun: dry, mock,
      createdAt: new Date().toISOString()
    }, null, 1) + "\n");

    log(`\n=== ${p.id}: ${runs.length} runs on ${p.model} (${p.effort}), build ${build.hash}, cap ${usd(cap)}${mock ? ", MOCK" : ""} ===`);
    const ctx: Ctx = { cohort, persona: p, playerName: p.name, build, llm, spend, outDir, maxTurns, tags, system, systemHash: sha(system), log };
    const results = p.lineage ? await playLineages(ctx, runs, concurrency) : await playAll(ctx, runs, concurrency);

    const summary = summarizeCohort(outDir);
    fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 1) + "\n");
    spentAll += spend.spent;
    const done = results.filter(r => r && !r.aborted);
    const perRun = done.length ? done.reduce((n, r) => n + r.cost, 0) / done.length : 0;
    log(`  spent ${usd(spend.spent)} over ${spend.calls} requests; ${usd(perRun)} per completed run; cache reads ${summary.cost.cacheReadShare}% of input tokens`);
    log(`  ${done.length}/${runs.length} runs completed, ${results.filter(r => r?.aborted).length} aborted, ${summary.autoPicks} auto-picked turns, ${summary.refusals} refusals`);
    for (const l of cohortLines(summary)) log(`  ${l}`);
    if (dry) {
      const projected = perRun * p.runs;
      log(`  projected full cohort: ${p.runs} runs × ${usd(perRun)} = ${usd(projected)} (cap ${usd(p.cohortCapUsd)})${projected > p.cohortCapUsd ? "  ← over the cap: the runner would stop early" : ""}`);
    }
    log(`  → ${path.relative(process.cwd(), outDir)}`);
  }
  log(`\ntotal spent: ${usd(spentAll)}${mock ? " (mock: computed from fake token counts)" : ""}`);
}

// Independent runs, several at once. Three errors in a row stop the cohort.
async function playAll(ctx: Ctx, specs: Spec[], n: number): Promise<RunResult[]> {
  let streak = 0, stop = false;
  return pool(specs, n, async (spec, i) => {
    if (stop || ctx.spend.exhausted) return { file: "", spec, ending: null, turns: 0, cost: 0, notesForNextLife: null, aborted: "not started", autoPicks: 0, refusals: 0 };
    const r = await playRun(ctx, spec);
    streak = r.aborted?.startsWith("error") ? streak + 1 : 0;
    if (streak >= 3) { stop = true; log("  ! three errors in a row; stopping this cohort"); }
    log(`  [${i + 1}/${specs.length}] ${spec.origin} seed ${spec.seed}: ${r.ending ?? r.aborted} after ${r.turns} turns, ${usd(r.cost)}`);
    return r;
  });
}

// Lineages run in parallel; lives within one lineage run in order, each starting with the
// notes its earlier lives wrote for it, and nothing else.
async function playLineages(ctx: Ctx, specs: Spec[], n: number): Promise<RunResult[]> {
  const byLineage = new Map<number, Spec[]>();
  for (const s of specs) byLineage.set(s.lineage!, [...(byLineage.get(s.lineage!) ?? []), s]);
  const endingTitle = (id: string | null) => ctx.build.content.endings.find((e: any) => e.id === id)?.title ?? "(the run was cut short)";
  const out = await pool([...byLineage.values()], n, async lives => {
    const results: RunResult[] = [];
    const notes: string[] = [];
    for (const spec of lives) {
      if (ctx.spend.exhausted) break;
      const r = await playRun(ctx, { ...spec, lineageNotes: notes.length ? notes.join("\n\n") : undefined });
      results.push(r);
      log(`  lineage ${spec.lineage} life ${spec.life} (${spec.origin}): ${r.ending ?? r.aborted}, ${usd(r.cost)}`);
      if (r.aborted) break;
      notes.push(`Life ${spec.life} (${endingTitle(r.ending)}):\n${r.notesForNextLife ?? "(no notes)"}`);
    }
    return results;
  });
  return out.flat();
}

// The lines worth reading in a job log: the validity check first, then behaviour.
export function cohortLines(s: ReturnType<typeof summarizeCohort>): string[] {
  const c = s.canaries, b = s.behaviour;
  const acts = Object.entries(s.interest.byAct).map(([k, a]) => `${k} ${a.mean} (${a.lowShare}% low, ${a.skippedYears} skipped)`).join(", ");
  return [
    `canaries ${c.passed ? "PASSED" : "FAILED"}: bland shown ${c.bland.shown}, mean interest ${c.bland.meanInterest ?? "-"} vs cohort ${c.bland.cohortMeanInterest ?? "-"} (${c.bland.passed ? "pass" : "fail"}); wink flagged ${c.wink.flagged}/${c.wink.shown} (${c.wink.passed ? "pass" : "fail"})`,
    `interest by act: ${acts}`,
    `behaviour: play again now ${b.playAgainNow ?? "-"}%, ending fair ${b.endingFair ?? "-"}%, overall interest ${b.overallInterest ?? "-"}; title after play ${JSON.stringify(s.title.afterPlay)}`
  ];
}

function summarize(dir: string) {
  if (!dir) throw new Error("usage: summarize <cohort dir>");
  const s = summarizeCohort(dir);
  fs.writeFileSync(path.join(dir, "summary.json"), JSON.stringify(s, null, 1) + "\n");
  log(`${s.runs} runs, $${s.cost.total} → ${path.join(dir, "summary.json")}`);
  for (const l of cohortLines(s)) log(`  ${l}`);
}

async function score() {
  const mock = has("--mock"), noBatch = has("--no-batch");
  const dir = argv[0];
  if (!dir) throw new Error("usage: score <cohort dir>");
  const llm = mock ? mockLlm(3) : realLlm();
  const system = read("prompts/diary-scorer.md");
  const items = runFiles(dir).flatMap(f => {
    const d = readRun(f).find(l => l.type === "diary");
    if (!d?.answer?.held_back_by) return [];
    const text = JSON.stringify({ held_back_by: d.answer.held_back_by, ending_fair_why: d.answer.ending_fair_why, worst_moment: d.answer.worst_moment,
      notes_for_next_life: d.answer.notes_for_next_life ?? null }, null, 1);
    return [{ id: path.basename(f, ".jsonl"), opts: { model: ANALYSIS.diaryScorer.model, effort: ANALYSIS.diaryScorer.effort, system,
      user: [{ text: `<diary>\n${text}\n</diary>` }], schema: DIARY_CODE as Record<string, unknown>, maxTokens: 1500 } }];
  });
  log(`coding ${items.length} diaries${mock ? " (mock)" : noBatch ? "" : " via the Batch API"}`);
  const res = await runBatch<Record<string, unknown>>(llm, items, log, !noBatch);
  const codes = Object.fromEntries(Object.entries(res).map(([k, r]) => [k, r.data]));
  const cost = Object.values(res).reduce((n, r) => n + r.cost, 0);
  fs.writeFileSync(path.join(dir, "diary-codes.json"), JSON.stringify(codes, null, 1) + "\n");
  log(`spent ${usd(cost)}`);
  summarize(dir);
}

main().catch(e => { console.error(`✗ ${e.message}`); process.exit(1); });
