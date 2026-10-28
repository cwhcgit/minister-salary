// Fun-session cohorts: summary.json and a short report.md. The headline numbers are behaviour
// (taps and careers before the player quits), then where the fun went (the curve by tap and a
// score per card from the model's own deltas, never the rule deltas), then the canary check
// and the cost. Canaries are held out of every aggregate except the check itself.
import fs from "node:fs";
import path from "node:path";
import { PRICES, type ModelId } from "./config.ts";
import { costOf, type Usage } from "./llm.ts";

type Line = Record<string, any>;
const readJsonl = (f: string): Line[] => fs.readFileSync(f, "utf8").split("\n").filter(Boolean).map(l => JSON.parse(l));
export function sessionFiles(dir: string): string[] {
  const d = path.join(dir, "sessions");
  return fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith(".jsonl")).sort().map(f => path.join(d, f)) : [];
}
export const isSessionCohort = (dir: string) => fs.existsSync(path.join(dir, "sessions"));

const r2 = (x: number) => +x.toFixed(2);
const mean = (xs: number[]) => (xs.length ? r2(xs.reduce((a, b) => a + b, 0) / xs.length) : null);
const pct = (n: number, d: number) => (d ? +(100 * n / d).toFixed(1) : null);
const quantile = (xs: number[], q: number) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b), i = (s.length - 1) * q, lo = Math.floor(i), hi = Math.ceil(i);
  return r2(s[lo] + (s[hi] - s[lo]) * (i - lo));
};
const count = (xs: string[]) => Object.fromEntries(Object.entries(xs.reduce((m: Record<string, number>, x) => ((m[x] = (m[x] || 0) + 1), m), {}))
  .sort((a, b) => b[1] - a[1]));
const usd = (x: number) => +x.toFixed(5);

// The canaries pass when the bland card is marked down, clearly below the player's usual, and
// the winking card is flagged off-tone in at least half its showings, well above the base rate.
export const CANARY_RULES = { blandMaxMean: -1, blandBelowOverall: 2, winkMinRate: 0.5, winkAboveBase: 0.3 };

function histogram(xs: number[], width: number) {
  const out: Record<string, number> = {};
  for (const x of [...xs].sort((a, b) => a - b)) {
    const lo = Math.floor((x - 1) / width) * width + 1, k = `${lo}-${lo + width - 1}`;
    out[k] = (out[k] || 0) + 1;
  }
  return out;
}

// Price a token count on any model in the pricing table.
export function project(u: Usage, models: ModelId[] = ["claude-haiku-5-5", "claude-sonnet-5-5"]) {
  return Object.fromEntries(models.map(m => [m, usd(costOf(m, u))]));
}
const scale = (u: Usage, k: number): Usage => ({ input: Math.round(u.input * k), output: Math.round(u.output * k), cacheWrite: Math.round(u.cacheWrite * k),
  cacheRead: Math.round(u.cacheRead * k), thinking: Math.round((u.thinking ?? 0) * k) });

export function summarizeSessions(dir: string) {
  const files = sessionFiles(dir);
  const logs = files.map(readJsonl);
  const meta = logs[0]?.find(l => l.type === "meta") ?? {};
  const cfg = meta.fun ?? {};
  const model: ModelId = meta.model;

  type Card = { title: string | null; act: string | null; shown: number; sessions: Set<number>; deltas: number[]; first: number[]; again: number[];
    rule: number[]; offTone: string[]; reasons: Array<{ d: number; r: string }>; quits: number };
  const cards: Record<string, Card> = {};
  const endings: Record<string, { title: string | null; shown: number; deltas: number[]; reasons: string[] }> = {};
  const curve: Record<number, { meter: number[]; model: number[]; quits: number }> = {};
  const canary = { bland: [] as number[], wink: { shown: 0, flagged: 0 } };
  const allModel: number[] = [], ruleRepeat: number[] = [];
  let tapsAll = 0, offToneTaps = 0, repeatTaps = 0, longReasons = 0, replied = 0, autoPicks = 0, refusals = 0, aborted = 0;
  let careersStarted = 0, careersFinished = 0, careersCut = 0;
  const endingCounts: string[] = [];
  const tapsToQuit: number[] = [], tapsNoQuit: number[] = [], runsToQuit: string[] = [], quitCards: string[] = [];
  const quitReasons: string[] = [], best: string[] = [], worst: string[] = [];
  const tok: Usage = { input: 0, output: 0, cacheWrite: 0, cacheRead: 0, thinking: 0 };
  const costBy = { turns: 0, survey: 0 };
  let cost = 0, sessionsDone = 0;

  for (const [si, lines] of logs.entries()) {
    const sum = lines.find(l => l.type === "summary") ?? {};
    cost += sum.cost || 0; autoPicks += sum.autoPicks || 0; refusals += sum.refusals || 0;
    if (sum.aborted) aborted++; else sessionsDone++;
    for (const l of lines) if (l.usage) {
      for (const k of ["input", "output", "cacheWrite", "cacheRead", "thinking"] as const) tok[k] = (tok[k] ?? 0) + (l.usage[k] ?? 0);
      if (l.type === "survey") costBy.survey += l.cost || 0; else costBy.turns += l.cost || 0;
    }
    const seenHere = new Set<string>();
    for (const l of lines) {
      if (l.type === "career_start") careersStarted++;
      if (l.type === "career_end") {
        if (l.ending) { careersFinished++; endingCounts.push(l.ending); }
        if (l.cut) careersCut++;
      }
      if (l.type === "survey" && l.answer) {
        if (l.answer.quit_reason) quitReasons.push(l.answer.quit_reason);
        if (l.answer.best_card) best.push(l.answer.best_card);
        if (l.answer.worst_card) worst.push(l.answer.worst_card);
      }
      if (l.type !== "turn") continue;
      tapsAll++;
      const id: string = l.card.id, m = l.meter, a = l.agent;
      const C = curve[l.tap] ||= { meter: [], model: [], quits: 0 };
      C.meter.push(m.after);
      if (m.quit) C.quits++;
      if (!a) continue;   // auto-picked: no reaction to score
      replied++;
      if (a.off_tone) offToneTaps++;
      if ((l.reasonWords ?? 0) > 12) longReasons++;
      if (id === "canary_bland") { canary.bland.push(m.model); continue; }
      if (id === "canary_wink") { canary.wink.shown++; if (a.off_tone) canary.wink.flagged++; continue; }
      if (id.startsWith("canary_")) continue;
      C.model.push(m.model);
      allModel.push(m.model);
      ruleRepeat.push(m.repeat);
      if (m.isRepeat) repeatTaps++;
      if (l.ending) {
        const E = endings[id] ||= { title: l.card.title, shown: 0, deltas: [], reasons: [] };
        E.shown++; E.deltas.push(m.model); if (E.reasons.length < 4) E.reasons.push(`${m.model > 0 ? "+" : ""}${m.model} ${a.reason}`);
        continue;
      }
      const c = cards[id] ||= { title: l.card.title, act: l.trace?.act ?? null, shown: 0, sessions: new Set(), deltas: [], first: [], again: [], rule: [], offTone: [], reasons: [], quits: 0 };
      c.shown++; c.sessions.add(si); c.deltas.push(m.model); c.rule.push(m.repeat);
      (seenHere.has(id) ? c.again : c.first).push(m.model);
      seenHere.add(id);
      if (a.off_tone) c.offTone.push(a.off_tone);
      c.reasons.push({ d: m.model, r: a.reason });
    }
    if (sum.quit && sum.quitAt) {
      tapsToQuit.push(sum.quitAt.tap); runsToQuit.push(String(sum.quitAt.career)); quitCards.push(sum.quitAt.card);
      if (cards[sum.quitAt.card]) cards[sum.quitAt.card].quits++;
    } else if (!sum.aborted) { tapsNoQuit.push(sum.taps ?? 0); runsToQuit.push("never"); }
  }

  const overall = mean(allModel);
  const blandMean = mean(canary.bland);
  const offToneRate = replied ? offToneTaps / replied : 0;
  const winkRate = canary.wink.shown ? canary.wink.flagged / canary.wink.shown : null;
  const blandOk = blandMean !== null && overall !== null && blandMean <= Math.min(CANARY_RULES.blandMaxMean, overall - CANARY_RULES.blandBelowOverall);
  const winkOk = winkRate !== null && winkRate >= CANARY_RULES.winkMinRate && winkRate - offToneRate >= CANARY_RULES.winkAboveBase;

  const cardRows = Object.entries(cards).map(([id, c]) => {
    const ex = [...c.reasons].sort((a, b) => Math.abs(b.d) - Math.abs(a.d)).slice(0, 3).map(x => `${x.d > 0 ? "+" : ""}${x.d} ${x.r}`);
    return { id, title: c.title, act: c.act, shown: c.shown, sessions: c.sessions.size, meanDelta: mean(c.deltas), firstDelta: mean(c.first),
      repeatDelta: mean(c.again), meanRepeatRule: mean(c.rule), offTone: c.offTone.length, offToneLines: c.offTone.slice(0, 3), quits: c.quits, reasons: ex };
  }).sort((a, b) => (b.meanDelta ?? 0) - (a.meanDelta ?? 0) || b.shown - a.shown);
  // Rank cards seen at least twice when there are enough of them; otherwise everything.
  const minShown = cardRows.filter(c => c.shown >= 2).length >= 20 ? 2 : 1;
  const ranked = cardRows.filter(c => c.shown >= minShown);
  const maxTap = Math.max(0, ...Object.keys(curve).map(Number));
  const careersPerSession = sessionsDone ? careersStarted / Math.max(1, logs.length) : 0;
  const perSessionTok = logs.length ? scale(tok, 1 / logs.length) : tok;
  const perCareerTok = careersStarted ? scale(tok, 1 / careersStarted) : tok;
  const perTapTok = tapsAll ? scale(tok, 1 / tapsAll) : tok;
  const split = (() => {
    const p = PRICES[model] ?? PRICES["claude-haiku-5-5"];
    const parts = { input: tok.input * p.input, cacheWrite: tok.cacheWrite * p.cacheWrite, cacheRead: tok.cacheRead * p.cacheRead, output: tok.output * p.output };
    const all = Object.values(parts).reduce((a, b) => a + b, 0);
    return Object.fromEntries(Object.entries(parts).map(([k, v]) => [k, pct(v, all)]));
  })();

  return {
    kind: "fun-sessions" as const,
    cohort: meta.cohort, persona: meta.persona, model, thinking: meta.thinking, buildHashes: meta.buildHashes, mock: !!meta.mock, fun: cfg,
    sessions: logs.length, aborted, taps: tapsAll, autoPicks, refusals,
    retention: {
      quitSessions: tapsToQuit.length, quitShare: pct(tapsToQuit.length, sessionsDone),
      tapsToQuit: { median: quantile(tapsToQuit, 0.5), p25: quantile(tapsToQuit, 0.25), p75: quantile(tapsToQuit, 0.75),
        min: tapsToQuit.length ? Math.min(...tapsToQuit) : null, max: tapsToQuit.length ? Math.max(...tapsToQuit) : null, histogram: histogram(tapsToQuit, 10) },
      neverQuit: { sessions: tapsNoQuit.length, medianTaps: quantile(tapsNoQuit, 0.5) },
      runsToQuit: { median: quantile(runsToQuit.filter(x => x !== "never").map(Number), 0.5), distribution: count(runsToQuit) },
      careers: { started: careersStarted, finished: careersFinished, finishedShare: pct(careersFinished, careersStarted), cutAtTurnCap: careersCut,
        perSession: r2(careersPerSession), endings: count(endingCounts) }
    },
    deltas: {
      meanModel: overall, meanRepeatRule: mean(ruleRepeat), decayPerTap: -(cfg.decay ?? 0),
      positiveShare: pct(allModel.filter(x => x > 0).length, allModel.length), zeroShare: pct(allModel.filter(x => x === 0).length, allModel.length),
      negativeShare: pct(allModel.filter(x => x < 0).length, allModel.length), repeatTapShare: pct(repeatTaps, allModel.length),
      offToneRate: pct(offToneTaps, replied), reasonsOver12Words: pct(longReasons, replied)
    },
    funCurve: Array.from({ length: maxTap }, (_, i) => {
      const C = curve[i + 1] ?? { meter: [], model: [], quits: 0 };
      return { tap: i + 1, playing: C.meter.length, meanMeter: mean(C.meter), meanModelDelta: mean(C.model), quits: C.quits };
    }),
    cards: { minShownToRank: minShown, top: ranked.slice(0, 10), bottom: ranked.slice(-10).reverse(), all: cardRows },
    quitCards: Object.entries(count(quitCards)).map(([id, n]) => ({ id, title: cards[id]?.title ?? endings[id]?.title ?? null, quits: n })),
    endings: Object.fromEntries(Object.entries(endings).map(([id, e]) => [id, { title: e.title, shown: e.shown, meanDelta: mean(e.deltas), reasons: e.reasons }])),
    canaries: {
      bland: { shown: canary.bland.length, meanDelta: blandMean, overallMeanDelta: overall, passed: blandOk },
      wink: { shown: canary.wink.shown, flagged: canary.wink.flagged, offToneRate: winkRate === null ? null : pct(canary.wink.flagged, canary.wink.shown),
        baseOffToneRate: pct(offToneTaps, replied), passed: winkOk },
      rules: CANARY_RULES, passed: blandOk && winkOk
    },
    survey: { quitReasons: quitReasons.slice(0, 15), bestCard: count(best), worstCard: count(worst) },
    cost: {
      total: usd(cost), perTap: tapsAll ? usd(cost / tapsAll) : null, perCareer: careersStarted ? usd(cost / careersStarted) : null,
      perSession: logs.length ? usd(cost / logs.length) : null, surveyShare: pct(costBy.survey, cost),
      tokens: tok, tokensPerSession: perSessionTok, tokensPerTap: perTapTok,
      cacheReadShare: pct(tok.cacheRead, tok.input + tok.cacheRead + tok.cacheWrite),
      costSplit: split,
      // What these token counts would cost on each model. From a mock run, the counts are
      // estimates (~4 characters a token, scripted ~35-token replies, no thinking).
      projection: {
        perTap: project(perTapTok), perCareer: project(perCareerTok), perSession: project(perSessionTok),
        fullSession: project(scale(perCareerTok, cfg.careers ?? 5))   // every career played to the end
      }
    }
  };
}

export type FunSummary = ReturnType<typeof summarizeSessions>;

export function funLines(s: FunSummary): string[] {
  const R = s.retention, c = s.canaries, P = s.cost.projection;
  const money = (o: Record<string, number>) => Object.entries(o).map(([m, v]) => `${m.replace("claude-", "")} $${v.toFixed(4)}`).join(", ");
  return [
    `canaries ${c.passed ? "PASSED" : "FAILED"}: bland shown ${c.bland.shown}, mean delta ${c.bland.meanDelta ?? "-"} vs overall ${c.bland.overallMeanDelta ?? "-"} (${c.bland.passed ? "pass" : "fail"}); wink flagged ${c.wink.flagged}/${c.wink.shown}, base off-tone rate ${c.wink.baseOffToneRate ?? "-"}% (${c.wink.passed ? "pass" : "fail"})`,
    `fun: quit in ${R.quitSessions}/${s.sessions - s.aborted} sessions; taps to quit median ${R.tapsToQuit.median ?? "-"} (p25 ${R.tapsToQuit.p25 ?? "-"}, p75 ${R.tapsToQuit.p75 ?? "-"}); runs to quit ${JSON.stringify(R.runsToQuit.distribution)}`,
    `careers: ${R.careers.finished}/${R.careers.started} finished (${R.careers.finishedShare ?? "-"}%); mean model delta ${s.deltas.meanModel ?? "-"}, repeat rule ${s.deltas.meanRepeatRule ?? "-"}, decay ${s.deltas.decayPerTap} a tap`,
    `cost per tap $${s.cost.perTap ?? "-"}, per career $${s.cost.perCareer ?? "-"}, per session $${s.cost.perSession ?? "-"}; cache reads ${s.cost.cacheReadShare ?? "-"}% of input tokens`,
    `projected per session at these token counts: ${money(P.perSession)}; a full ${s.fun.careers ?? 5}-career session: ${money(P.fullSession)}`
  ];
}

export function funMarkdown(s: FunSummary): string {
  const R = s.retention, esc = (x: unknown) => String(x ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
  const money = (x: number | null) => (x === null ? "-" : `$${x.toFixed(4)}`);
  const cardTable = (rows: any[]) => ["| card | shown | mean | first | repeat | off-tone | quits | reasons |", "|---|---|---|---|---|---|---|---|",
    ...rows.map(c => `| ${esc(c.title ?? c.id)} \`${c.id}\` | ${c.shown} | ${c.meanDelta} | ${c.firstDelta ?? "-"} | ${c.repeatDelta ?? "-"} | ${c.offTone} | ${c.quits} | ${esc(c.reasons.join("; "))} |`)];
  const curveTaps = s.funCurve.filter(x => x.tap === 1 || x.tap % 5 === 0 || x.quits > 0 && x.tap <= 10);
  const out = [
    `# Fun sessions: ${s.cohort}`, "",
    `${s.persona} on ${s.model}${s.thinking ? ` (thinking ${s.thinking})` : ""}. ${s.sessions} sessions${s.aborted ? ` (${s.aborted} aborted)` : ""}, ${s.taps} taps. ` +
      `Quit line ${s.fun.quitLine}, repeats ×${s.fun.repeatMultiplier}, decay ${s.fun.decay} a tap, up to ${s.fun.careers} careers.${s.mock ? " **Mock run: scripted replies.**" : ""}`, "",
    "## Retention", "",
    `- Quit in ${R.quitSessions} of ${s.sessions - s.aborted} sessions (${R.quitShare ?? "-"}%). Taps to quit: median ${R.tapsToQuit.median ?? "-"}, p25-p75 ${R.tapsToQuit.p25 ?? "-"}-${R.tapsToQuit.p75 ?? "-"}, range ${R.tapsToQuit.min ?? "-"}-${R.tapsToQuit.max ?? "-"}.`,
    `- Taps to quit, by tens: ${Object.entries(R.tapsToQuit.histogram).map(([k, v]) => `${k}: ${v}`).join(", ") || "-"}. Never quit: ${R.neverQuit.sessions} (median ${R.neverQuit.medianTaps ?? "-"} taps).`,
    `- Careers started before quitting: ${Object.entries(R.runsToQuit.distribution).map(([k, v]) => `${k}: ${v}`).join(", ") || "-"}.`,
    `- Careers finished: ${R.careers.finished} of ${R.careers.started} (${R.careers.finishedShare ?? "-"}%), ${R.careers.cutAtTurnCap} cut at the turn cap. Endings: ${Object.entries(R.careers.endings).map(([k, v]) => `${k} ${v}`).join(", ") || "-"}.`,
    `- Per tap: model delta ${s.deltas.meanModel ?? "-"} on average (${s.deltas.positiveShare ?? "-"}% up, ${s.deltas.zeroShare ?? "-"}% zero, ${s.deltas.negativeShare ?? "-"}% down); repeat rule ${s.deltas.meanRepeatRule ?? "-"} (${s.deltas.repeatTapShare ?? "-"}% of taps were repeats); decay ${s.deltas.decayPerTap}.`, "",
    "## Fun curve", "", "| tap | still playing | mean meter | mean model delta | quit here |", "|---|---|---|---|---|",
    ...curveTaps.map(x => `| ${x.tap} | ${x.playing} | ${x.meanMeter ?? "-"} | ${x.meanModelDelta ?? "-"} | ${x.quits} |`), "",
    `## Cards: the model's own delta (rule deltas excluded; ranked when shown ${s.cards.minShownToRank}+ times)`, "",
    "### Top 10", "", ...cardTable(s.cards.top), "", "### Bottom 10", "", ...cardTable(s.cards.bottom), "",
    "### Where players quit", "", ...(s.quitCards.length ? s.quitCards.map(q => `- ${esc(q.title ?? q.id)} \`${q.id}\`: ${q.quits}`) : ["- nobody quit"]), "",
    "## Endings", "", "| ending | shown | mean delta | reasons |", "|---|---|---|---|",
    ...Object.entries(s.endings).map(([id, e]) => `| ${esc(e.title)} \`${id}\` | ${e.shown} | ${e.meanDelta} | ${esc(e.reasons.join("; "))} |`), "",
    "## Canaries", "",
    `${s.canaries.passed ? "PASSED" : "FAILED"}. Bland: shown ${s.canaries.bland.shown}, mean delta ${s.canaries.bland.meanDelta ?? "-"} against ${s.canaries.bland.overallMeanDelta ?? "-"} overall (needs ≤ ${CANARY_RULES.blandMaxMean} and ${CANARY_RULES.blandBelowOverall} under the overall mean): ${s.canaries.bland.passed ? "pass" : "fail"}. ` +
      `Wink: flagged off-tone ${s.canaries.wink.flagged} of ${s.canaries.wink.shown} (${s.canaries.wink.offToneRate ?? "-"}%) against a base rate of ${s.canaries.wink.baseOffToneRate ?? "-"}% (needs ${100 * CANARY_RULES.winkMinRate}%+ and ${100 * CANARY_RULES.winkAboveBase} points over base): ${s.canaries.wink.passed ? "pass" : "fail"}.`, "",
    "## Exit survey", "",
    `- Best card: ${Object.entries(s.survey.bestCard).slice(0, 5).map(([k, v]) => `${esc(k)} (${v})`).join(", ") || "-"}`,
    `- Worst card: ${Object.entries(s.survey.worstCard).slice(0, 5).map(([k, v]) => `${esc(k)} (${v})`).join(", ") || "-"}`,
    ...s.survey.quitReasons.slice(0, 8).map(q => `- "${esc(q)}"`), "",
    "## Cost", "",
    `Total ${money(s.cost.total)}: ${money(s.cost.perTap)} a tap, ${money(s.cost.perCareer)} a career, ${money(s.cost.perSession)} a session (exit survey ${s.cost.surveyShare ?? "-"}% of it). Cache reads are ${s.cost.cacheReadShare ?? "-"}% of input tokens.`, "",
    "| tokens | input | cache write | cache read | output | of which thinking |", "|---|---|---|---|---|---|",
    `| all | ${s.cost.tokens.input} | ${s.cost.tokens.cacheWrite} | ${s.cost.tokens.cacheRead} | ${s.cost.tokens.output} | ${s.cost.tokens.thinking ?? 0} |`,
    `| per session | ${s.cost.tokensPerSession.input} | ${s.cost.tokensPerSession.cacheWrite} | ${s.cost.tokensPerSession.cacheRead} | ${s.cost.tokensPerSession.output} | ${s.cost.tokensPerSession.thinking ?? 0} |`,
    `| cost share on ${s.model} | ${s.cost.costSplit.input}% | ${s.cost.costSplit.cacheWrite}% | ${s.cost.costSplit.cacheRead}% | ${s.cost.costSplit.output}% | |`, "",
    "| projected at these token counts | per tap | per career | per session | full session |", "|---|---|---|---|---|",
    ...Object.keys(s.cost.projection.perSession).map(m => `| ${m} | ${money(s.cost.projection.perTap[m])} | ${money(s.cost.projection.perCareer[m])} | ${money(s.cost.projection.perSession[m])} | ${money(s.cost.projection.fullSession[m])} |`), ""
  ];
  return out.join("\n");
}

// --- calibration: Haiku players against the Sonnet critic ------------------------------

const pearson = (xs: number[], ys: number[]) => {
  const n = xs.length;
  if (n < 3) return null;
  const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
  return sxx && syy ? r2(sxy / Math.sqrt(sxx * syy)) : null;
};

export function compareCalibration(summaries: FunSummary[]) {
  const byModel: Record<string, FunSummary[]> = {};
  for (const s of summaries) (byModel[s.model] ||= []).push(s);
  const pooled = Object.fromEntries(Object.entries(byModel).map(([m, ss]) => {
    const w = (f: (s: FunSummary) => number | null, n: (s: FunSummary) => number) => {
      let a = 0, d = 0;
      for (const s of ss) { const v = f(s); if (v !== null) { a += v * n(s); d += n(s); } }
      return d ? r2(a / d) : null;
    };
    const blandShown = ss.reduce((n, s) => n + s.canaries.bland.shown, 0);
    const winkShown = ss.reduce((n, s) => n + s.canaries.wink.shown, 0), winkFlagged = ss.reduce((n, s) => n + s.canaries.wink.flagged, 0);
    const taps = ss.reduce((n, s) => n + s.taps, 0);
    const overall = w(s => s.deltas.meanModel, s => s.taps);
    const bland = w(s => s.canaries.bland.meanDelta, s => s.canaries.bland.shown);
    const base = w(s => s.deltas.offToneRate, s => s.taps);
    const winkRate = winkShown ? winkFlagged / winkShown : null;
    const cards: Record<string, { sum: number; n: number; title: string | null }> = {};
    for (const s of ss) for (const c of s.cards.all) if (c.meanDelta !== null) {
      const x = cards[c.id] ||= { sum: 0, n: 0, title: c.title };
      x.sum += c.meanDelta * c.shown; x.n += c.shown;
    }
    return [m, {
      cohorts: ss.map(s => s.cohort), sessions: ss.reduce((n, s) => n + s.sessions, 0), taps,
      meanModelDelta: overall, offToneRate: base,
      bland: { shown: blandShown, meanDelta: bland, passed: bland !== null && overall !== null && bland <= Math.min(CANARY_RULES.blandMaxMean, overall - CANARY_RULES.blandBelowOverall) },
      wink: { shown: winkShown, flagged: winkFlagged, rate: winkRate === null ? null : pct(winkFlagged, winkShown),
        passed: winkRate !== null && winkRate >= CANARY_RULES.winkMinRate && winkRate - (base ?? 0) / 100 >= CANARY_RULES.winkAboveBase },
      tapsToQuitMedian: quantile(ss.flatMap(s => s.retention.tapsToQuit.median === null ? [] : [s.retention.tapsToQuit.median]), 0.5),
      costPerSession: ss.length ? usd(ss.reduce((n, s) => n + s.cost.total, 0) / Math.max(1, ss.reduce((n, s) => n + s.sessions, 0))) : null,
      cards: Object.fromEntries(Object.entries(cards).map(([id, x]) => [id, { title: x.title, n: x.n, mean: r2(x.sum / x.n) }]))
    }];
  }));
  const [a, b] = ["claude-haiku-5-5", "claude-sonnet-5-5"].map(m => pooled[m]);
  let agreement = null;
  if (a && b) {
    const shared = Object.keys(a.cards).filter(id => b.cards[id]);
    const xs = shared.map(id => a.cards[id].mean), ys = shared.map(id => b.cards[id].mean);
    const gaps = shared.map(id => ({ id, title: a.cards[id].title, haiku: a.cards[id].mean, sonnet: b.cards[id].mean, gap: r2(a.cards[id].mean - b.cards[id].mean) }))
      .sort((p, q) => Math.abs(q.gap) - Math.abs(p.gap));
    agreement = { sharedCards: shared.length, pearson: pearson(xs, ys), meanAbsGap: mean(gaps.map(g => Math.abs(g.gap))),
      signAgreement: pct(shared.filter(id => Math.sign(a.cards[id].mean) === Math.sign(b.cards[id].mean)).length, shared.length),
      biggestGaps: gaps.slice(0, 8) };
  }
  const strip = (x: any) => x && { ...x, cards: undefined };
  return { models: Object.fromEntries(Object.entries(pooled).map(([m, x]) => [m, strip(x)])), agreement,
    verdict: a ? (a.bland.passed && a.wink.passed ? "Haiku passes both canaries" : `Haiku ${a.bland.passed ? "marks the bland canary down" : "does NOT mark the bland canary down"} and ${a.wink.passed ? "flags the wink" : "does NOT flag the wink"}`) : "no Haiku sessions" };
}

export function calibrationMarkdown(c: ReturnType<typeof compareCalibration>): string {
  const out = ["# Calibration", "", c.verdict + ".", "", "| model | sessions | taps | mean delta | bland canary | wink flagged | base off-tone | median taps to quit | cost a session |", "|---|---|---|---|---|---|---|---|---|"];
  for (const [m, x] of Object.entries<any>(c.models))
    out.push(`| ${m} | ${x.sessions} | ${x.taps} | ${x.meanModelDelta ?? "-"} | ${x.bland.meanDelta ?? "-"} (n ${x.bland.shown}, ${x.bland.passed ? "pass" : "fail"}) | ${x.wink.flagged}/${x.wink.shown} (${x.wink.passed ? "pass" : "fail"}) | ${x.offToneRate ?? "-"}% | ${x.tapsToQuitMedian ?? "-"} | $${x.costPerSession ?? "-"} |`);
  if (c.agreement) {
    const g = c.agreement;
    out.push("", `Card by card, on ${g.sharedCards} cards both models saw: Pearson ${g.pearson ?? "-"}, mean gap ${g.meanAbsGap ?? "-"} points, same sign ${g.signAgreement ?? "-"}%.`, "",
      "| card | Haiku | Sonnet | gap |", "|---|---|---|---|", ...g.biggestGaps.map(x => `| ${x.title ?? x.id} | ${x.haiku} | ${x.sonnet} | ${x.gap} |`));
  }
  return out.join("\n") + "\n";
}
