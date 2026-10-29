// Agent playtest runner. One request per turn, cached prompt prefix, spend and turn caps.
//
//   node agents/runner.ts list
//   node agents/runner.ts play <persona...|fun|calibration|blind|all> [options]
//       --dry-run          play 3 runs (2 sessions; 1 per calibration persona) per persona and print
//                          the projected cohort cost, then stop
//       --mock             no API calls: a scripted stand-in plays (free; tests the pipeline)
//       --runs N           override the persona's run count (sessions, for a fun persona)
//       --careers N        fun personas: most careers in a session (default: the persona's, 5)
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
import { ANALYSIS, CALIBRATION, DEFAULTS, PERSONAS, REPORTS, runPlan, sessionPlan, type Persona } from "./lib/config.ts";
import { H, type Build } from "./lib/harness.ts";
import { credentialSource, mockLlm, pool, realLlm, Spend, type Llm } from "./lib/llm.ts";
import { playRun, type Ctx, type RunResult, type Spec } from "./lib/play.ts";
import { leakGate, read, sha, systemPrompt } from "./lib/prompts.ts";
import { readRun, runFiles, summarizeCohort } from "./lib/report.ts";
import { calibrationMarkdown, compareCalibration, funLines, funMarkdown, isSessionCohort, summarizeSessions, type FunSummary } from "./lib/funreport.ts";
import { playSession, type SessionCtx, type SessionResult } from "./lib/session.ts";
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
  for (const p of PERSONAS) {
    const what = p.fun
      ? `${String(p.runs).padStart(3)} sessions × ≤${p.fun.careers} careers, quit at ${p.fun.quitLine}, repeats ×${p.fun.repeatMultiplier}`
      : `${String(p.runs).padStart(3)} runs`;
    log(`${p.id.padEnd(20)} ${p.blind ? "blind " : "full  "} ${p.model.padEnd(18)} ${what}  cap ${usd(p.cohortCapUsd)}  ${p.answers}`);
  }
  log(`${"calibration".padEnd(20)} ${CALIBRATION.sessions.map(c => `${c.persona} ×${c.sessions}`).join(", ")}; canaries in every career; cap ${usd(CALIBRATION.capUsd)}`);
  log(`\ntotal of cohort caps: ${usd(PERSONAS.reduce((n, p) => n + p.cohortCapUsd, 0))}`);
}

function pick(names: string[]): Persona[] {
  if (!names.length) throw new Error("name a persona, 'fun', 'calibration', 'blind' or 'all' (see: node agents/runner.ts list)");
  if (names.includes("all")) return PERSONAS;
  if (names.includes("fun")) return PERSONAS.filter(p => p.fun);
  if (names.includes("blind")) return PERSONAS.filter(p => p.blind && !p.lineage && !p.fun);
  return names.map(n => { const p = PERSONAS.find(x => x.id === n); if (!p) throw new Error(`no persona ${n}`); return p; });
}

interface Job { persona: Persona; runs?: number; tag?: string; canaryCareers?: number; dryCount?: number }
interface Opts { dry: boolean; mock: boolean; concurrency: number; maxTurns: number; tags: "phone" | "none"; buildRoot?: string; careers?: number; date: string; llm: Llm }

async function play() {
  const dry = has("--dry-run"), mock = has("--mock");
  const runsOpt = opt("--runs"), careersOpt = opt("--careers");
  let maxUsd = +(opt("--max-usd") ?? Infinity);
  const o: Opts = {
    dry, mock, concurrency: +(opt("--concurrency") ?? DEFAULTS.concurrency), maxTurns: +(opt("--max-turns") ?? DEFAULTS.maxTurns),
    tags: (opt("--tags") ?? "phone") as "phone" | "none", buildRoot: opt("--build"), careers: careersOpt ? +careersOpt : undefined,
    date: new Date().toISOString().slice(0, 10), llm: mock ? mockLlm(7) : realLlm()
  };
  const calibration = argv.includes("calibration");
  let jobs: Job[];
  if (calibration) {
    if (argv.length > 1) throw new Error("calibration runs on its own");
    if (runsOpt) log("note: --runs is ignored by calibration (its session counts are fixed in lib/config.ts)");
    maxUsd = Math.min(maxUsd, CALIBRATION.capUsd);
    jobs = CALIBRATION.sessions.map(c => ({ persona: PERSONAS.find(p => p.id === c.persona)!, runs: c.sessions, tag: "cal", canaryCareers: Infinity, dryCount: 1 }));
  } else jobs = pick(argv).map(p => ({ persona: p, runs: runsOpt ? +runsOpt : undefined }));
  if (!mock) log(`credentials: ${credentialSource()}`);

  let spentAll = 0;
  const fun: Array<{ dir: string; summary: FunSummary }> = [];
  for (const job of jobs) {
    const cap = Math.min(job.persona.cohortCapUsd, maxUsd - spentAll);
    if (job.persona.fun) {
      const r = await playFunCohort(job, o, cap);
      spentAll += r.spent;
      fun.push(r);
    } else spentAll += await playLegacyCohort(job, o, cap);
  }
  if (calibration) {
    const c = compareCalibration(fun.map(f => f.summary));
    const hash = H.loadBuild({ root: o.buildRoot }).hash;
    const dir = path.join(REPORTS, "cohorts", `${o.date}-calibration-${hash}${dry ? "-dry" : ""}${mock ? "-mock" : ""}`);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "calibration.json"), JSON.stringify({ ...c, cohorts: fun.map(f => path.basename(f.dir)) }, null, 1) + "\n");
    fs.writeFileSync(path.join(dir, "calibration.md"), calibrationMarkdown(c));
    log(`\n=== calibration: ${c.verdict} ===`);
    for (const [m, x] of Object.entries<any>(c.models))
      log(`  calibration ${m}: bland ${x.bland.meanDelta ?? "-"} vs ${x.meanModelDelta ?? "-"} overall (${x.bland.passed ? "pass" : "fail"}); wink ${x.wink.flagged}/${x.wink.shown} (${x.wink.passed ? "pass" : "fail"}); $${x.costPerSession} a session`);
    if (c.agreement) log(`  calibration agreement on ${c.agreement.sharedCards} cards: Pearson ${c.agreement.pearson ?? "-"}, mean gap ${c.agreement.meanAbsGap ?? "-"}, same sign ${c.agreement.signAgreement ?? "-"}%`);
    log(`  → ${path.relative(process.cwd(), dir)}`);
  }
  log(`\ntotal spent: ${usd(spentAll)}${mock ? " (mock: computed from fake token counts)" : ""}`);
}

function gate(p: Persona, build: Build) {
  const leaks = leakGate(p, build);
  if (leaks.length) {
    for (const l of leaks) log(`  ✗ ${l.file}${l.line ? `:${l.line}` : ""} ${l.why}: "${l.match}"`);
    throw new Error(`${p.id}: blind prompts leak hidden information; fix them before launching`);
  }
}

async function playFunCohort(job: Job, o: Opts, cap: number): Promise<{ spent: number; dir: string; summary: FunSummary }> {
  const p = job.persona;
  const builds = { plain: H.loadBuild({ root: o.buildRoot }), canary: H.loadBuild({ root: o.buildRoot, canaries: p.canaries }) };
  gate(p, builds.canary);
  const system = systemPrompt(p, builds.plain);
  const careers = o.careers ?? p.fun!.careers;
  const plan = sessionPlan(p, job.runs ?? p.runs, careers);
  const sessions = o.dry ? plan.slice(0, job.dryCount ?? DEFAULTS.drySessions) : plan;
  const spend = new Spend(cap);
  const canaryCareers = job.canaryCareers ?? DEFAULTS.canaryCareers;
  const cohort = `${o.date}-${p.id}-${builds.plain.hash}${job.tag ? `-${job.tag}` : ""}${o.dry ? "-dry" : ""}${o.mock ? "-mock" : ""}`;
  const outDir = path.join(REPORTS, "cohorts", cohort);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "system-prompt.txt"), system + "\n");
  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify({
    cohort, kind: "fun-sessions", persona: p, buildHash: builds.plain.hash, canaryBuildHash: builds.canary.hash, buildRoot: builds.plain.root,
    canaries: p.canaries, canaryCareers: Number.isFinite(canaryCareers) ? canaryCareers : "all", systemHash: sha(system),
    sessions: sessions.length, plannedSessions: plan.length, careers, capUsd: cap, maxTurns: o.maxTurns, tags: o.tags, concurrency: o.concurrency,
    dryRun: o.dry, mock: o.mock, calibration: job.tag === "cal", createdAt: new Date().toISOString()
  }, null, 1) + "\n");

  log(`\n=== ${p.id}: ${sessions.length} sessions of up to ${careers} careers on ${p.model} (${p.effort}${p.thinking ? `, thinking ${p.thinking}` : ""}), build ${builds.plain.hash}, quit at ${p.fun!.quitLine}, cap ${usd(cap)}${o.mock ? ", MOCK" : ""} ===`);
  const ctx: SessionCtx = { cohort, persona: p, playerName: p.name, playerGender: p.gender, builds, llm: o.llm, spend, outDir, maxTurns: o.maxTurns, careers,
    canaryCareers, tags: o.tags, system, systemHash: sha(system), log };
  let streak = 0, stop = false;
  const results = await pool(sessions, o.concurrency, async (spec, i): Promise<SessionResult | null> => {
    if (stop || spend.exhausted) return null;
    const r = await playSession(ctx, spec);
    streak = r.aborted?.startsWith("error") ? streak + 1 : 0;
    if (streak >= 3) { stop = true; log("  ! three errors in a row; stopping this cohort"); }
    log(`  [${i + 1}/${sessions.length}] session ${spec.index + 1}: ${r.aborted ?? (r.quit ? `quit at tap ${r.taps} in career ${r.quitAt!.career}` : `played all ${r.careersPlayed} careers, ${r.taps} taps`)}, fun ${r.meter}, ${usd(r.cost)}`);
    return r;
  });

  const summary = summarizeSessions(outDir);
  fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 1) + "\n");
  fs.writeFileSync(path.join(outDir, "report.md"), funMarkdown(summary));
  const done = results.filter((r): r is SessionResult => !!r && !r.aborted);
  const perSession = done.length ? done.reduce((n, r) => n + r.cost, 0) / done.length : 0;
  log(`  spent ${usd(spend.spent)} over ${spend.calls} requests; ${usd(perSession)} per completed session`);
  log(`  ${done.length}/${sessions.length} sessions completed, ${results.filter(r => r?.aborted).length} aborted, ${summary.autoPicks} auto-picked turns, ${summary.refusals} refusals`);
  for (const l of funLines(summary)) log(`  ${l}`);
  if (o.dry) {
    const full = job.runs ?? p.runs, projected = perSession * full;
    log(`  projected full cohort: ${full} sessions × ${usd(perSession)} = ${usd(projected)} (cap ${usd(p.cohortCapUsd)})${projected > p.cohortCapUsd ? "  ← over the cap: the runner would stop early" : ""}`);
  }
  log(`  → ${path.relative(process.cwd(), outDir)}`);
  return { spent: spend.spent, dir: outDir, summary };
}

// The original cohorts: independent runs (or lineages) with notes, 1-5 interest and a diary.
async function playLegacyCohort(job: Job, o: Opts, cap: number): Promise<number> {
  const p = job.persona;
  const build: Build = H.loadBuild({ root: o.buildRoot, canaries: p.canaries });
  gate(p, build);
  const system = systemPrompt(p, build);
  const plan = runPlan(p, job.runs ?? p.runs);
  const runs = o.dry ? plan.slice(0, DEFAULTS.dryRunsPerPersona) : plan;
  const spend = new Spend(cap);
  const cohort = `${o.date}-${p.id}-${build.hash}${o.dry ? "-dry" : ""}${o.mock ? "-mock" : ""}`;
  const outDir = path.join(REPORTS, "cohorts", cohort);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "system-prompt.txt"), system + "\n");
  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify({
    cohort, persona: p, buildHash: build.hash, buildRoot: build.root, canaries: build.canaries, systemHash: sha(system),
    runs: runs.length, plannedRuns: plan.length, capUsd: cap, maxTurns: o.maxTurns, tags: o.tags, concurrency: o.concurrency, dryRun: o.dry, mock: o.mock,
    createdAt: new Date().toISOString()
  }, null, 1) + "\n");

  log(`\n=== ${p.id}: ${runs.length} runs on ${p.model} (${p.effort}), build ${build.hash}, cap ${usd(cap)}${o.mock ? ", MOCK" : ""} ===`);
  const ctx: Ctx = { cohort, persona: p, playerName: p.name, playerGender: p.gender, build, llm: o.llm, spend, outDir, maxTurns: o.maxTurns, tags: o.tags, system, systemHash: sha(system), log };
  const results = p.lineage ? await playLineages(ctx, runs, o.concurrency) : await playAll(ctx, runs, o.concurrency);

  const summary = summarizeCohort(outDir);
  fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 1) + "\n");
  const done = results.filter(r => r && !r.aborted);
  const perRun = done.length ? done.reduce((n, r) => n + r.cost, 0) / done.length : 0;
  log(`  spent ${usd(spend.spent)} over ${spend.calls} requests; ${usd(perRun)} per completed run; cache reads ${summary.cost.cacheReadShare}% of input tokens`);
  log(`  ${done.length}/${runs.length} runs completed, ${results.filter(r => r?.aborted).length} aborted, ${summary.autoPicks} auto-picked turns, ${summary.refusals} refusals`);
  for (const l of cohortLines(summary)) log(`  ${l}`);
  if (o.dry) {
    const projected = perRun * p.runs;
    log(`  projected full cohort: ${p.runs} runs × ${usd(perRun)} = ${usd(projected)} (cap ${usd(p.cohortCapUsd)})${projected > p.cohortCapUsd ? "  ← over the cap: the runner would stop early" : ""}`);
  }
  log(`  → ${path.relative(process.cwd(), outDir)}`);
  return spend.spent;
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
  if (isSessionCohort(dir)) {
    const f = summarizeSessions(dir);
    fs.writeFileSync(path.join(dir, "summary.json"), JSON.stringify(f, null, 1) + "\n");
    fs.writeFileSync(path.join(dir, "report.md"), funMarkdown(f));
    log(`${f.sessions} sessions, $${f.cost.total} → ${path.join(dir, "summary.json")}`);
    for (const l of funLines(f)) log(`  ${l}`);
    return;
  }
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
