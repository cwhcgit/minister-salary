// The three agents that turn runs into decisions: content auditor, analyst, designer.
// None of them changes the game. Their output is a report, or proposals awaiting approval.
import { ANALYSIS, type ModelId } from "./config.ts";
import { runBatch } from "./batch.ts";
import type { CallResult, Llm } from "./llm.ts";
import { read } from "./prompts.ts";
import { ANALYST, AUDIT, DESIGNER } from "./schemas.ts";

const S = (x: unknown) => x as Record<string, unknown>;
const wrap = (tag: string, body: string) => `<${tag}>\n${body}\n</${tag}>`;

// What a player can read, plus ids to point at. Effects and requirements are left out:
// the audit is about the words.
export function playerVisibleContent(game: any, events: any[], engineSrc?: string) {
  return {
    events: events.map(e => ({
      id: e.id, ...(e.canary ? { canary: e.canary } : {}), title: e.title, body: e.body,
      choices: e.choices.map((c: any) => ({ text: c.text, outcome: c.outcome }))
    })),
    game: {
      ladder: game.ladder.map((r: any) => ({ title: r.title, grade: r.grade, org: r.org, pay: r.pay })),
      ministries: game.ministries,
      origins: game.origins.map((o: any) => ({ id: o.id, name: o.name, blurb: o.blurb, difficulty: o.difficulty })),
      appraisalEuphemisms: game.grades.map((g: any) => g.label),
      cepHints: game.cepHints,
      endings: game.endings.map((e: any) => ({ id: e.id, title: e.title, epitaph: e.epitaph })),
      // lines the engine writes itself (log lines, the empty-year card)
      engineLines: engineSrc ? [...engineSrc.matchAll(/"([A-Z][^"\n]{24,})"/g)].map(m => m[1]) : []
    }
  };
}

export async function audit(llm: Llm, game: any, events: any[], o: { batch: boolean; log: (s: string) => void; context?: string; model?: ModelId; engineSrc?: string }) {
  const model = o.model ?? ANALYSIS.auditor.model;
  const content = JSON.stringify(playerVisibleContent(game, events, o.engineSrc), null, 1);
  const user = [{ text: (o.context ? wrap("context", o.context) + "\n\n" : "") + wrap("content", content) }];
  const opts = { model, effort: ANALYSIS.auditor.effort, system: read("prompts/auditor.md"), user, schema: S(AUDIT), maxTokens: 32000, stream: true };
  const res = await runBatch<any>(llm, [{ id: "audit", opts }], o.log, o.batch);
  return res.audit as CallResult<any>;
}

export function auditMarkdown(a: any, buildHash: string): string {
  const esc = (s: string) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
  const rows = (a.findings || []).map((f: any) =>
    `| ${f.severity} | \`${f.event_id}\` ${f.field} | ${esc(f.line)} | ${f.rule} | ${esc(f.problem)} | ${esc(f.suggested_fix)} |`);
  const acc = (a.accuracy_checks || []).map((c: any) => `| ${c.status} | ${esc(c.claim)} | ${esc(c.note)} |`);
  return [
    `# Content audit, build ${buildHash}`, "", a.summary || "", "",
    "| severity | where | line | rule | problem | suggested fix |", "|---|---|---|---|---|---|", ...rows, "",
    "## Accuracy checks", "", "| status | claim | note |", "|---|---|---|", ...acc, ""
  ].join("\n");
}

export async function analyse(llm: Llm, o: { metrics: object; cohorts: object[]; predictions?: object[]; mechanics: string }) {
  const parts = [
    wrap("brief", read("prompts/m1-brief.md")),
    wrap("mechanics", o.mechanics),
    wrap("bot_metrics", JSON.stringify(o.metrics)),
    wrap("cohorts", o.cohorts.map(c => JSON.stringify(c)).join("\n\n"))
  ];
  if (o.predictions?.length) parts.push(wrap("predictions", JSON.stringify(o.predictions, null, 1)));
  return llm.call<any>({ model: ANALYSIS.analyst.model, effort: ANALYSIS.analyst.effort, system: read("prompts/analyst.md"),
    user: [{ text: parts.join("\n\n") }], schema: S(ANALYST), maxTokens: 64000, stream: true });
}

export function analysisMarkdown(a: any, meta: { date: string; buildHash: string; cohorts: string[]; cost: number }): string {
  const list = (xs: string[]) => (xs?.length ? xs.map(x => `\`${x}\``).join(", ") : "—");
  const out = [
    `# Playtest findings, ${meta.date}`, "",
    `Build \`${meta.buildHash}\`. Cohorts: ${meta.cohorts.join(", ") || "none (bot metrics only)"}. Analyst cost $${meta.cost.toFixed(2)}.`, "",
    a.summary || "", "", "## Findings, ranked", ""
  ];
  for (const f of a.findings || []) {
    out.push(`### ${f.id}. ${f.title}`, "",
      `${f.severity} · ${f.confidence} confidence · ${f.kind === "new" ? "new" : "known gap"}${f.confirmed_both_ways ? " · confirmed by bots and agents" : ""} · ${f.criterion}`, "",
      `Events ${list(f.events)} · choices ${list(f.choices)} · stats ${list(f.stats)}`, "");
    for (const e of f.evidence || []) out.push(`- *${e.source}*: ${e.detail}`);
    out.push("", `**Recommendation:** ${f.recommendation}`, "");
  }
  out.push("## Fun criteria", "", "| criterion | verdict | answer | evidence |", "|---|---|---|---|");
  for (const c of a.criteria || []) out.push(`| ${c.criterion} | ${c.verdict} | ${c.answer} | ${c.evidence} |`);
  out.push("", "## Open questions", "");
  for (const q of a.open_questions || []) out.push(`**${q.question}** ${q.leaning} (${q.confidence}${q.needs_humans ? ", confirm with real players" : ""}). ${q.evidence}`, "");
  out.push("## Known gaps: how much they hurt", "", "| gap | hurt (1-5) | frequency | interest drop | evidence |", "|---|---|---|---|---|");
  for (const g of a.known_gaps || []) out.push(`| ${g.gap} | ${g.hurt_score} | ${g.frequency} | ${g.interest_drop} | ${g.evidence} |`);
  out.push("", "## Cohort validity", "");
  for (const v of a.cohort_validity || []) out.push(`- ${v.cohort}: canaries ${v.canaries_passed ? "passed" : "FAILED"}${v.discount_praise ? ", praise discounted" : ""}. ${v.note}`);
  if ((a.prediction_checks || []).length) {
    out.push("", "## Predictions", "", "| proposal | metric | predicted | observed | came true |", "|---|---|---|---|---|");
    for (const p of a.prediction_checks) out.push(`| ${p.proposal} | ${p.metric} | ${p.predicted} | ${p.observed} | ${p.came_true} |`);
  }
  return out.join("\n") + "\n";
}

export async function design(llm: Llm, o: { analysis: object; metrics: object; game: any; events: any[]; mechanics: string; model?: ModelId; previous?: object[] }) {
  const parts = [
    wrap("brief", read("prompts/m1-brief.md")),
    wrap("mechanics", o.mechanics),
    wrap("analysis", JSON.stringify(o.analysis)),
    wrap("bot_metrics", JSON.stringify(o.metrics)),
    wrap("game_json", JSON.stringify(o.game)),
    wrap("events_json", JSON.stringify(o.events))
  ];
  if (o.previous?.length) parts.push(wrap("previous_proposals", JSON.stringify(o.previous, null, 1)));
  return llm.call<any>({ model: o.model ?? ANALYSIS.designer.model, effort: ANALYSIS.designer.effort, system: read("prompts/designer.md"),
    user: [{ text: parts.join("\n\n") }], schema: S(DESIGNER), maxTokens: 64000, stream: true });
}
