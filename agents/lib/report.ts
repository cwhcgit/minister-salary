// Turns a cohort's JSONL runs into one summary the analyst can read in full. Canary events
// are held out of every aggregate and reported only as the validity check.
import fs from "node:fs";
import path from "node:path";

type Line = Record<string, any>;
export function readRun(file: string): Line[] {
  return fs.readFileSync(file, "utf8").split("\n").filter(Boolean).map(l => JSON.parse(l));
}
export function runFiles(dir: string): string[] {
  const d = path.join(dir, "runs");
  return fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith(".jsonl")).sort().map(f => path.join(d, f)) : [];
}

const mean = (xs: number[]) => (xs.length ? +(xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(2) : null);
const pct = (n: number, d: number) => (d ? +(100 * n / d).toFixed(1) : null);
const count = (xs: string[]) => xs.reduce((m: Record<string, number>, x) => ((m[x] = (m[x] || 0) + 1), m), {});
const sample = <T>(xs: T[], n: number) => xs.filter(Boolean).slice(0, n);

// How the winking canary is recognised: a complaint in the note on that very turn, or a
// diary tone break that quotes or describes that event rather than some other line.
const WINK_NOTE = /\bjoke\b|satire|narrator|\bwink|punchline|fourth wall|\bmeta\b|self-aware|breaks? (the )?tone/i;
const WINK_QUOTE = /bit of a joke|a game, almost|holding a phone|narrator nods|get it\?|she winks|get the joke|laugh along|is this satire/i;

export function summarizeCohort(dir: string) {
  const files = runFiles(dir);
  const runs = files.map(readRun);
  const meta = runs[0]?.find(l => l.type === "meta") ?? {};
  const isCanary = (id: string) => id.startsWith("canary_");

  const ev: Record<string, { shown: number; firstShown: number; interest: number[]; firstInterest: number[]; repeatInterest: number[];
    weighty: number; confused: string[]; notes: string[]; picks: Record<string, number>; act: string }> = {};
  const acts: Record<string, { turns: number; interest: number[]; low: number; skipped: number }> = {};
  const canary = { bland: { shown: 0, interest: [] as number[] }, wink: { shown: 0, flagged: 0 } };
  const allInterest: number[] = [];
  const diaries: Line[] = [], probes: Line[] = [], endings: Record<string, string[]> = {};
  let cost = 0, turns = 0, autoPicks = 0, refusals = 0, aborted = 0, cacheRead = 0, inputAll = 0;
  const lives: Record<number, { runs: number; pm: number; finalRank: number[]; wealth: number[] }> = {};
  const codes = fs.existsSync(path.join(dir, "diary-codes.json")) ? JSON.parse(fs.readFileSync(path.join(dir, "diary-codes.json"), "utf8")) : {};

  for (const [ri, lines] of runs.entries()) {
    const m = lines.find(l => l.type === "meta") ?? {};
    const sum = lines.find(l => l.type === "summary") ?? {};
    const diary = lines.find(l => l.type === "diary");
    const tlines = lines.filter(l => l.type === "turn");
    const yearAct: Record<number, string> = {};
    let winkTurn: Line | undefined;
    for (const l of lines) if (l.usage) { cacheRead += l.usage.cacheRead; inputAll += l.usage.input + l.usage.cacheRead + l.usage.cacheWrite; }
    cost += sum.cost || 0; autoPicks += sum.autoPicks || 0; refusals += sum.refusals || 0; if (sum.aborted) aborted++;
    (endings[m.origin] ||= []).push(sum.ending ?? "aborted");

    for (const t of tlines) {
      turns++;
      const id = t.trace.event.id, act = t.trace.act, a = t.agent || {};
      yearAct[t.year] = act;
      if (id === "canary_bland") { canary.bland.shown++; if (a.interest) canary.bland.interest.push(a.interest); continue; }
      if (id === "canary_wink") { canary.wink.shown++; winkTurn = t; continue; }
      if (isCanary(id)) continue;
      const e = ev[id] ||= { shown: 0, firstShown: 0, interest: [], firstInterest: [], repeatInterest: [], weighty: 0, confused: [], notes: [], picks: {}, act };
      e.shown++;
      if (!t.trace.event.repeat) e.firstShown++;
      if (a.interest) { e.interest.push(a.interest); allInterest.push(a.interest); (t.trace.event.repeat ? e.repeatInterest : e.firstInterest).push(a.interest); }
      if (a.felt_weighty) e.weighty++;
      if (a.confused_by) e.confused.push(a.confused_by);
      if (a.note) e.notes.push(a.note);
      e.picks[t.choice] = (e.picks[t.choice] || 0) + 1;
      const A = acts[act] ||= { turns: 0, interest: [], low: 0, skipped: 0 };
      A.turns++;
      if (a.interest) { A.interest.push(a.interest); if (a.interest <= 2) A.low++; }
    }

    if (diary?.answer) {
      const d = diary.answer;
      diaries.push({ run: path.basename(files[ri], ".jsonl"), origin: m.origin, ending: sum.ending, life: m.life, ...d, code: codes[path.basename(files[ri], ".jsonl")] ?? null });
      const skipAct = d.skip_year?.year ? acts[yearAct[d.skip_year.year]] : undefined;
      if (skipAct) skipAct.skipped++;
      if (winkTurn) {
        const onTurn = WINK_NOTE.test(`${winkTurn.agent?.note ?? ""} ${winkTurn.agent?.confused_by ?? ""}`);
        const inDiary = (d.tone_breaks || []).some((x: Line) => WINK_QUOTE.test(`${x.line} ${x.note}`));
        if (onTurn || inDiary) canary.wink.flagged++;
      }
    }
    const probe = lines.find(l => l.type === "title_probe");
    if (probe?.answer) probes.push({ ...probe.answer, titleFirst: probe.titleFirst });

    if (m.life) {
      const L = lives[m.life] ||= { runs: 0, pm: 0, finalRank: [], wealth: [] };
      L.runs++; if (sum.ending === "pm") L.pm++;
      if (sum.final) { L.finalRank.push(sum.final.rank); L.wealth.push(sum.final.wealth); }
    }
  }

  const cohortMean = mean(allInterest);
  const blandMean = mean(canary.bland.interest);
  const blandOk = blandMean !== null && cohortMean !== null && blandMean <= Math.min(2.5, cohortMean - 0.5);
  const winkOk = canary.wink.shown > 0 && canary.wink.flagged / canary.wink.shown >= 0.5;
  const pd = diaries.filter(d => typeof d.play_again_now === "boolean");

  return {
    cohort: meta.cohort, persona: meta.persona, model: meta.model, buildHash: meta.buildHash, mock: !!meta.mock,
    runs: runs.length, turns, aborted, autoPicks, refusals,
    cost: { total: +cost.toFixed(4), perRun: runs.length ? +(cost / runs.length).toFixed(4) : null, cacheReadShare: pct(cacheRead, inputAll) },
    endings: Object.fromEntries(Object.entries(endings).map(([o, xs]) => [o, count(xs)])),
    interest: { mean: cohortMean, byAct: Object.fromEntries(Object.entries(acts).map(([k, a]) => [k, {
      turns: a.turns, mean: mean(a.interest), lowShare: pct(a.low, a.interest.length), skippedYears: a.skipped }])) },
    events: Object.fromEntries(Object.entries(ev).sort((a, b) => (mean(a[1].interest) ?? 0) - (mean(b[1].interest) ?? 0)).map(([id, e]) => [id, {
      act: e.act, shown: e.shown, meanInterest: mean(e.interest), firstTimeInterest: mean(e.firstInterest), repeatInterest: mean(e.repeatInterest),
      weightyShare: pct(e.weighty, e.shown), picks: e.picks, confusedBy: sample(e.confused, 6), notes: sample(e.notes, 6) }])),
    behaviour: {
      playAgainNow: pct(pd.filter(d => d.play_again_now).length, pd.length),
      endingFair: pct(diaries.filter(d => d.ending_fair).length, diaries.length),
      chaseNext: diaries.map(d => d.chase_next).filter(Boolean),
      overallInterest: mean(diaries.map(d => d.overall_interest).filter(Boolean))
    },
    callbacks: diaries.flatMap(d => (d.callbacks_noticed || []).map((c: Line) => ({ run: d.run, ...c }))),
    heldBackBy: diaries.map(d => ({ run: d.run, life: d.life ?? null, origin: d.origin, ending: d.ending, answer: d.held_back_by, code: d.code })),
    toneBreaks: diaries.flatMap(d => (d.tone_breaks || []).map((t: Line) => ({ run: d.run, ...t }))),
    title: { beforePlay: count(probes.map(p => `${p.would_tap} (listed first: ${p.titleFirst})`)), beforePlayExpectations: sample(probes.map(p => ({ ms: p.expect_minister_salary, cs: p.expect_confirmed_substantive })), 8),
             afterPlay: count(diaries.map(d => d.title_fit).filter(Boolean)) },
    canaries: { bland: { shown: canary.bland.shown, meanInterest: blandMean, cohortMeanInterest: cohortMean, passed: blandOk },
                wink: { shown: canary.wink.shown, flagged: canary.wink.flagged, passed: winkOk },
                passed: blandOk && winkOk },
    lives: Object.keys(lives).length ? Object.fromEntries(Object.entries(lives).map(([k, L]) => [k, {
      runs: L.runs, pmRate: pct(L.pm, L.runs), meanFinalRank: mean(L.finalRank), medianWealth: L.wealth.sort((a, b) => a - b)[L.wealth.length >> 1] ?? null }])) : null,
    diaries: diaries.map(d => ({ run: d.run, origin: d.origin, ending: d.ending, life: d.life ?? null, best: d.best_moment, worst: d.worst_moment,
      skip: d.skip_year, fair: d.ending_fair_why, again: d.play_again_why, exploits: d.exploits, won: d.won, what_decided_it: d.what_decided_it,
      reachable: d.was_the_win_reachable_by_skill, hardest_gate: d.hardest_gate }))
  };
}
