// Typed view of the CommonJS harness in ../../harness. The harness is the only way agents
// touch the game; nothing here reads engine state directly except traceView, which is
// for the non-blind personas.
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export interface Build { hash: string; root: string; canaries: boolean; content: any; engine: any }
export interface ChoiceView { id: string; text: string; available: boolean; requires: string | null }
export interface Run {
  buildHash: string; origin: string; seed: number; name: string;
  turn: number; phase: "event" | "ending";
  S: any; choiceList: string[]; turns: TurnRecord[];
}
export interface TurnRecord {
  turn: number; year: number; age: number; act: "I" | "II" | "III";
  event: { id: string; source: string; repeat: boolean; filler: boolean; once: boolean; variant?: number };
  choice: { id: string; effects: Record<string, number>; available: string[] };
  delta: Record<string, number>;
  before: Record<string, number>; after: Record<string, number>;
  appraisal: { grade: string; score: number; noise: number; base: number } | null;
  promotion: { result: string; why: string } | null;
  ending: string | null;
  [k: string]: unknown;
}
export interface Trace {
  buildHash: string; origin: string; seed: number; name: string; choices: string[];
  ending: string | null; endingCause: { kind: string; driver: string; chain: unknown[] } | null; recent?: string[];
  start: { cep: number; ministry: string; stats: Record<string, number> };
  final: Record<string, any>; turns: TurnRecord[];
}

interface HarnessModule {
  loadBuild(opts?: { root?: string; canaries?: boolean }): Build;
  getBuild(hash?: string): Build;
  newRun(origin: string, seed: number, opts?: { build?: Build; name?: string; recent?: string[] }): Run;
  screen(run: Run, opts?: { view?: string }): unknown;
  screenText(run: Run, opts?: { tags?: "phone" | "none"; view?: string }): string;
  choices(run: Run): ChoiceView[];
  step(run: Run, choiceId: string | number): Run;
  trace(run: Run): Trace;
  replay(spec: { buildHash?: string; origin: string; seed: number; name?: string; choices: string[]; recent?: string[] }, opts?: { build?: Build }): Run;
  rng(seed: number): () => number;
}
interface LeakModule {
  checkPrompt(text: string, opts: { secret?: Array<{ name: string; text: string }>; public?: string[] }): Array<{ line: number | null; why: string; match: string }>;
  checkScreen(text: string, build: Build, terms?: string[]): Array<{ why: string; match: string }>;
  screenTerms(build: Build): string[];
}

export const H = require("../../harness/index.js") as HarnessModule;
export const Leak = require("../../harness/leak-check.js") as LeakModule;

const LETTERS = "ABCDEFGH";
const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);

// What the veteran and the breaker see on top of the screen: the hidden values, each
// choice's real effects and consequences, and why last year's promotion did or did not
// happen. Never shown to a blind persona.
export function traceView(run: Run): string {
  const b = H.getBuild(run.buildHash);
  const S = run.S, C = b.content;
  const title = (r: number) => `${C.ladder[r].title} (${C.ladder[r].grade})`;
  const lines: string[] = [];
  lines.push(`Rank ${S.rank}: ${title(S.rank)}. CEP ${S.cep}: ${S.cep > S.rank ? `ceiling at rank ${S.cep}, ${title(Math.min(16, S.cep))}` : "AT CEILING: promotion blocked until CEP rises"}.`);
  lines.push(`Stats (hidden from blind players): Reputation ${S.reputation}, Standing ${S.standing}, Integrity ${S.integrity}, Competence ${S.competence}.`);
  lines.push(`Heat ${S.heat}/100 (journalist rumours from 55; scandal ending at 85 at year end).`);
  lines.push(`Years in grade ${S.yearsInGrade}. Consecutive C grades ${S.consecutiveC}, consecutive D grades ${S.consecutiveD}.`
    + (S.bondYears && S.year <= S.bondYears ? ` Bonded until year ${S.bondYears}.` : ""));
  lines.push(`Flags: ${S.flags.length ? S.flags.join(", ") : "none"}.`);
  lines.push(`Pending consequences: ${S.scheduled.length ? S.scheduled.map((x: any) => `${x.eventId} in year ${x.fireYear}`).join(", ") : "none"}.`);
  const last = run.turns[run.turns.length - 1];
  if (last && last.appraisal)
    lines.push(`Last year: grade ${last.appraisal.grade} (score ${last.appraisal.score.toFixed(1)}, of which noise ${signed(+last.appraisal.noise.toFixed(1))}); promotion: ${last.promotion ? last.promotion.why : "n/a"}.`);
  if (run.phase === "event") {
    const ev = b.engine.eventOf ? b.engine.eventOf(C, S) : S.currentEvent === "__quiet" ? b.engine.QUIET : C.events.find((e: any) => e.id === S.currentEvent);
    lines.push(`This event: ${ev.id}${ev.triggered ? " (a consequence of an earlier choice)" : ""}.`);
    ev.choices.forEach((c: any, i: number) => {
      const fx = Object.entries(c.effects || {}).map(([k, v]) => `${k} ${signed(v as number)}`).join(", ") || "no stat change";
      const extra = [
        c.requiresStat && `requires ${Object.entries(c.requiresStat).map(([k, v]) => `${k} ${v}`).join(", ")}`,
        c.setFlags && `sets ${c.setFlags.join(", ")}`,
        c.schedule && c.schedule.map((s: any) => `schedules ${s.eventId} in ${s.inYears}y at ${Math.round(100 * (s.chance ?? 1))}%`).join("; "),
        c.election && `election (${c.election})`
      ].filter(Boolean).join("; ");
      lines.push(`  ${LETTERS[i]}) ${fx}${extra ? `; ${extra}` : ""}`);
    });
  }
  return lines.join("\n");
}
