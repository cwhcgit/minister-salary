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
  lines.push("Origins: " + C.origins.map((o: any) => `${o.id} starts at rank ${o.startRank}, age ${o.startAge}, CEP ${o.cep[0]}-${o.cep[1]}${o.bondYears ? `, bond ${o.bondYears} years` : ""}`).join("; ") + ".", "");
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
  const play = read(`prompts/play-${p.turnSchema}.md`);
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
  return parts.flatMap(([file, text]) => Leak.checkPrompt(text, { secret, public: pub }).map(h => ({ file, ...h })));
}
