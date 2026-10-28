// Prompt assembly and the leak gate. No SDK import, so the leak check runs without
// installing anything.
//
// Cache order for every play request: system (persona + game description + how to play)
// → a lineage's notes from earlier lives → the agent's own notes → the current screen.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { AGENTS, REPO, type Persona } from "./config.ts";
import { Leak, type Build } from "./harness.ts";

export const read = (rel: string) => fs.readFileSync(path.join(AGENTS, rel), "utf8").trim();
export const sha = (s: string) => crypto.createHash("sha256").update(s).digest("hex").slice(0, 12);

// Numbers the veteran and the breaker need, read from the build so they never go stale.
export function mechanicsAppendix(build: Build): string {
  const C = build.content;
  const rank = (r: number) => `${r} ${C.ladder[r].title}`;
  const req = (q: any = {}) => {
    const p: string[] = [];
    if (q.minRank !== undefined || q.maxRank !== undefined) p.push(`rank ${q.minRank ?? 0}-${q.maxRank ?? 16}`);
    for (const [k, v] of Object.entries(q.minStats || {})) p.push(`${k} ≥ ${v}`);
    if (q.origin) p.push(`origin ${q.origin.join("/")}`);
    if (q.originNot) p.push(`not ${q.originNot.join("/")}`);
    if (q.notDuringBond) p.push("not during bond");
    return p.join(", ") || "any";
  };
  const lines = ["### Appendix, generated from this build", "", "Ladder: " + C.ladder.map((_: any, i: number) => rank(i)).join("; ") + ".", ""];
  const floors = C.ladder.map((L: any, i: number) => ({ L, i })).filter(({ L }: any) => L.minAge)
    .map(({ L, i }: any) => `${rank(i)} ${L.minAge}${L.minAgeExceptional !== undefined ? ` (${L.minAgeExceptional} for an exceptional file)` : ""}`);
  if (floors.length) lines.push(`Age floors: ${floors.join("; ")}. A file becomes exceptional after ${C.exceptionalAfter || 2} standout choices below rank 8.`, "");
  lines.push("Origins: " + C.origins.map((o: any) => `${o.id} starts at rank ${o.startRank}, age ${o.startAge}, CEP ${o.cep[0]}-${o.cep[1]}${o.bondYears ? `, bond ${o.bondYears} years` : ""}${o.fastLane ? `, ${o.fastLane.yearsInGrade} year in grade below rank ${o.fastLane.untilRank}` : ""}`).join("; ") + ".", "");
  for (const id of ["tea_session", "succession"]) {
    const e = C.events.find((x: any) => x.id === id);
    if (e) lines.push(`${e.title} (${id}) requires: ${req(e.requires)}.`);
  }
  lines.push("", "CEP-raising choices:");
  for (const e of C.events) e.choices.forEach((c: any, i: number) => {
    const cep = (c.effects || {}).cep || 0;
    if (cep > 0) lines.push(`- ${e.id} "${e.title}" choice ${"ABCD"[i]} (CEP +${cep})${e.triggered ? ": a consequence only" : `: ${req(e.requires)}`}${c.requiresStat ? `; needs ${Object.entries(c.requiresStat).map(([k, v]) => `${k} ${v}`).join(", ")}` : ""}`);
  });
  return lines.join("\n");
}

export const mechanics = (build: Build) => read("prompts/mechanics-brief.md") + "\n\n" + mechanicsAppendix(build);

export function systemPrompt(p: Persona, build: Build): string {
  let persona = read(`personas/${p.file}`);
  if (!p.blind) persona = persona.replace("{{MECHANICS}}", mechanics(build));
  const play = read(`prompts/play-${p.turnSchema}.md`).replaceAll("{{MAX}}", String(p.fun?.maxDelta ?? 10));
  return `${persona}\n\n## The game, as its store page describes it\n\n${read("prompts/store-page.md")}\n\n## How you play\n\n${play}`;
}

export const diaryPrompt = (p: Persona) => read(`prompts/diary-${p.diarySchema}.md`);

export const TITLES = ["Minister Salary", "Confirmed & Substantive"];
export function titleProbePrompt(flip: boolean): string {
  const [a, b] = flip ? [TITLES[1], TITLES[0]] : TITLES;
  const store = read("prompts/store-page.md").replace(/Minister Salary/g, "This game");
  return read("prompts/title-probe.md").replace("{{STORE}}", store).replace("{{TITLE_1}}", a).replace("{{TITLE_2}}", b);
}

const wrap = (tag: string, body: string) => `<${tag}>\n${body}\n</${tag}>`;

export function turnBlocks(o: { lineageNotes?: string; memory: string; screen: string; trace?: string }) {
  const blocks: Array<{ text: string; cache?: boolean }> = [];
  if (o.lineageNotes) blocks.push({ text: wrap("notes_from_earlier_lives", o.lineageNotes), cache: true });
  let text = wrap("my_notes", o.memory || "(empty: this is your first year)") + "\n\n" + wrap("screen", o.screen);
  if (o.trace) text += "\n\n" + wrap("trace", o.trace);
  blocks.push({ text });
  return blocks;
}

// --- fun-meter sessions: what the runner adds around the screen ----------------------
// One conversation per career. Each user turn is the screen as the harness renders it, then
// one line with the meter. Kept here so the leak gate checks every word the runner sends.

export const meterLine = (v: number) => `Your fun: ${Math.round(v)}/100.`;

export function funTurnText(o: { screen: string; meter: number; opener?: string | null; ending?: boolean }): string {
  const tail = o.ending ? `The career is over. ${meterLine(o.meter)} Reply as usual, with choice A.` : meterLine(o.meter);
  return (o.opener ? o.opener + "\n\n" : "") + wrap("screen", o.screen) + "\n" + tail;
}

// origin and ending are the names the start and ending cards show
export interface CareerRecap { origin: string; ending: string | null; taps: number }
const careerWords = (c: CareerRecap) =>
  `${c.origin}, ${c.ending ? `ended "${c.ending}"` : "cut off before its end"} after ${c.taps} taps`;

// The first message of career k > 1: which career this is, and how the earlier ones went.
export function funOpener(k: number, earlier: CareerRecap[]): string | null {
  if (k === 0) return null;
  return `New career, number ${k + 1} this session. Earlier this session: ${earlier.map((c, i) => `${i + 1}) ${careerWords(c)}`).join("; ")}.`;
}

export interface RecapMoment { title: string; delta: number; reason: string }
// The exit survey is its own short request: the session's careers and the screens that moved
// the player most, in the player's own words at the time. (A new schema would invalidate the
// career conversation's cache anyway, so re-sending the whole conversation buys nothing.)
export function funSurveyText(o: { careers: CareerRecap[]; quit: boolean; tops: RecapMoment[]; bottoms: RecapMoment[]; last: RecapMoment[]; flagged: string[] }): string {
  const m = (x: RecapMoment) => `"${x.title}" (${x.delta > 0 ? "+" : ""}${x.delta}: ${x.reason})`;
  const lines = [
    `Careers: ${o.careers.map((c, i) => `${i + 1}) ${careerWords(c)}`).join("; ")}.`,
    `Screens that lifted you most: ${o.tops.length ? o.tops.map(m).join("; ") : "none"}.`,
    `Screens that dragged most: ${o.bottoms.length ? o.bottoms.map(m).join("; ") : "none"}.`,
    `Your last screens: ${o.last.map(m).join("; ") || "none"}.`
  ];
  if (o.flagged.length) lines.push(`Lines you flagged as off: ${o.flagged.map(x => `"${x}"`).join("; ")}.`);
  const stop = o.quit ? "Your fun ran out, so you put the phone down." : "That was the last career this session; you are putting the phone down.";
  return `${wrap("session", lines.join("\n"))}\n\n${stop}\n\n${read("prompts/diary-fun.md")}`;
}

// When a reply could not be used even after a retry, the runner picks for the player and says so.
export const lostReplyText = (choice: string) => `(No reply could be read for that screen; choice ${choice} was made for you.)`;
export const retryText = (problem: string, available: string[]) =>
  `Your last reply could not be used: ${problem}. The available choices are ${available.join(", ")}. Reply again with one JSON object.`;

// Everything the runner itself writes into a fun session, rendered with sample values.
export function funTemplates(): string {
  const careers: CareerRecap[] = [{ origin: "Sample Origin", ending: "Sample Ending", taps: 21 }, { origin: "Other Origin", ending: null, taps: 9 }];
  const moment = { title: "Sample Card", delta: 3, reason: "sample reason" };
  return [
    funTurnText({ screen: "(screen)", meter: 47 }),
    funTurnText({ screen: "(screen)", meter: 31, ending: true, opener: funOpener(2, careers) }),
    funSurveyText({ careers, quit: true, tops: [moment], bottoms: [moment], last: [moment], flagged: ["sample line"] }),
    funSurveyText({ careers, quit: false, tops: [], bottoms: [], last: [], flagged: [] }),
    lostReplyText("B"),
    retryText("choice D is not available", ["A", "B"])
  ].join("\n\n");
}

// Fails a blind cohort before launch if any prompt it will send carries hidden terms or
// copies the mechanics brief, the playtest brief or the design doc.
export function leakGate(p: Persona, build: Build): Array<{ file: string; line: number | null; why: string; match: string }> {
  if (!p.blind) return [];
  const secret = [
    { name: "prompts/mechanics-brief.md", text: mechanics(build) },
    { name: "prompts/m1-brief.md", text: read("prompts/m1-brief.md") },
    { name: "docs/DESIGN.md", text: fs.readFileSync(path.join(REPO, "docs/DESIGN.md"), "utf8") }
  ];
  const pub = [read("prompts/store-page.md")];
  const parts: Array<[string, string]> = [
    [`system prompt (personas/${p.file} + store page + play-${p.turnSchema}.md)`, systemPrompt(p, build)],
    [`prompts/diary-${p.diarySchema}.md`, diaryPrompt(p)]
  ];
  if (p.titleProbe) parts.push(["prompts/title-probe.md", titleProbePrompt(false)]);
  if (p.fun) parts.push(["runner-written lines (meter, career opener, ending, exit survey)", funTemplates()]);
  return parts.flatMap(([file, text]) => Leak.checkPrompt(text, { secret, public: pub }).map(h => ({ file, ...h })));
}
