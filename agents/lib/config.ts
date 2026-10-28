// Personas, models, prices and caps. Everything a cohort is configured by lives here,
// so a change in spend or scope is one reviewable diff.
import path from "node:path";
import { fileURLToPath } from "node:url";

export const AGENTS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const REPO = path.resolve(AGENTS, "..");
// Overridable so tests can write somewhere disposable.
export const REPORTS = process.env.PLAYTEST_REPORTS ? path.resolve(process.env.PLAYTEST_REPORTS) : path.join(REPO, "reports");
export const PROPOSALS = process.env.PLAYTEST_PROPOSALS ? path.resolve(process.env.PLAYTEST_PROPOSALS) : path.join(REPO, "proposals");

export type ModelId = "claude-sonnet-5-5" | "claude-haiku-5-5" | "claude-opus-5-5" | "claude-fable-5-1";
export type Effort = "low" | "medium" | "high" | "xhigh" | "max";

// $ per million tokens (standard API rates; cache write = 5-minute TTL). Batch is half.
// https://platform.claude.com/docs/en/about-claude/pricing — re-check before trusting a forecast.
export const PRICES: Record<ModelId, { input: number; output: number; cacheWrite: number; cacheRead: number }> = {
  "claude-sonnet-5-5": { input: 2.0, output: 10.0, cacheWrite: 2.5, cacheRead: 0.1 },
  "claude-haiku-5-5": { input: 0.1, output: 0.5, cacheWrite: 0.125, cacheRead: 0.01 },
  "claude-opus-5-5": { input: 4.0, output: 20.0, cacheWrite: 5.0, cacheRead: 0.2 },
  "claude-fable-5-1": { input: 10.0, output: 50.0, cacheWrite: 12.5, cacheRead: 0.25 }
};

// Server-side refusal fallback ("default" routing). Haiku 5.5 has none.
export const HAS_FALLBACK: Record<ModelId, boolean> = {
  "claude-sonnet-5-5": true, "claude-haiku-5-5": false, "claude-opus-5-5": true, "claude-fable-5-1": true
};

export type TurnSchema = "player" | "veteran" | "breaker" | "fun";
export type DiarySchema = "player" | "lineage" | "veteran" | "breaker" | "fun";
// "disabled" (Haiku 5.5, effort high or below) and "between_tools" (Sonnet 5.5, effort low to
// high) turn thinking off; play turns are short reactions and do not need it. Unset: the
// model's default, which for Haiku 5.5 is thinking on.
export type Thinking = "disabled" | "between_tools" | "adaptive";

// The fun meter (lib/meter.ts). The runner applies the rule deltas; the model only gives its
// own reaction to each screen, and sees the meter's value on every turn.
export interface FunConfig {
  start: number;              // where the meter starts, once per session
  cap: number;                // ceiling
  quitLine: number;           // at or below this after a tap, the player puts the phone down
  decay: number;              // taken off every tap
  maxDelta: number;           // the model's own delta is clamped to -maxDelta..+maxDelta
  verdicts: Record<string, number>; // the model picks a verdict; this maps it to its delta
  repeatSteps: number[];      // a full card already seen this session costs these, compounding
  repeatMultiplier: number;   // scales repeatSteps (rounded to whole points)
  freshToReset: number;       // this many fresh cards in a row reset the repeat streak
  careers: number;            // most careers in one session
  origins: "rotate" | "keep"; // the next career's origin: the next one along, or the same again
}
export const FUN_DEFAULTS: FunConfig = {
  start: 50, cap: 100, quitLine: 25, decay: 2, maxDelta: 10,
  verdicts: { fine: 0, skimmed: -2, annoyed: -5, smiled: 2, tell_a_friend: 6 },
  repeatSteps: [5, 10, 15], repeatMultiplier: 1,
  freshToReset: 3, careers: 5, origins: "rotate"
};

export interface Persona {
  id: string;
  name: string;                // the player name on the ending card
  file: string;                // persona prompt, relative to agents/personas
  blind: boolean;              // true: screen view only. false: mechanics brief + full trace
  model: ModelId;
  effort: Effort;
  runs: number;                // total runs per cohort
  lineage?: { lineages: number; runsEach: number };
  turnSchema: TurnSchema;
  diarySchema: DiarySchema;
  canaries: boolean;           // plant the bland and the winking canary events
  titleProbe: boolean;         // ask about the two titles before play
  cohortCapUsd: number;        // the runner stops launching runs past this
  answers: string;
  thinking?: Thinking;         // unset: the model's default
  fun?: FunConfig;             // set: plays fun-meter sessions, and `runs` counts sessions
}

const fun = (o: Partial<FunConfig> = {}): FunConfig => ({ ...FUN_DEFAULTS, ...o });

export const PERSONAS: Persona[] = [
  // Fun-meter sessions: lean turns, one conversation per career, careers back to back until
  // the meter runs out. `runs` is sessions. Blind: the screen and the meter, nothing else.
  { id: "fun-casual", name: "Jia Hui", file: "fun-casual.md", blind: true, model: "claude-haiku-5-5", effort: "low", thinking: "disabled",
    runs: 100, turnSchema: "fun", diarySchema: "fun", canaries: true, titleProbe: false, cohortCapUsd: 2,
    fun: fun({ quitLine: 35, repeatMultiplier: 1.5, origins: "keep" }),
    answers: "How long does a casual mobile player keep tapping, and what makes them stop?" },
  { id: "fun-insider", name: "Rachel Goh", file: "fun-insider.md", blind: true, model: "claude-haiku-5-5", effort: "low", thinking: "disabled",
    runs: 100, turnSchema: "fun", diarySchema: "fun", canaries: true, titleProbe: false, cohortCapUsd: 2,
    fun: fun({ quitLine: 25 }),
    answers: "Does the satire hold an insider, and which lines break tone or get the service wrong?" },
  { id: "fun-completionist", name: "Marcus Tan", file: "fun-completionist.md", blind: true, model: "claude-haiku-5-5", effort: "low", thinking: "disabled",
    runs: 100, turnSchema: "fun", diarySchema: "fun", canaries: true, titleProbe: false, cohortCapUsd: 2,
    fun: fun({ quitLine: 15 }),
    answers: "Do callbacks and endings pull a patient player through several careers?" },
  { id: "fun-critic", name: "Priya Nair", file: "fun-critic.md", blind: true, model: "claude-sonnet-5-5", effort: "low", thinking: "between_tools",
    runs: 15, turnSchema: "fun", diarySchema: "fun", canaries: true, titleProbe: false, cohortCapUsd: 4,
    fun: fun({ quitLine: 25 }),
    answers: "Calibration: does a sharper (and dearer) reader agree with the Haiku players card by card?" },
  { id: "fun-critic-haiku", name: "Priya Nair", file: "fun-critic.md", blind: true, model: "claude-haiku-5-5", effort: "low", thinking: "disabled",
    runs: 40, turnSchema: "fun", diarySchema: "fun", canaries: true, titleProbe: false, cohortCapUsd: 1,
    fun: fun({ quitLine: 25 }),
    answers: "Calibration: the same critic on Haiku, to compare models card by card without a persona difference." },
  { id: "blind-insider", name: "Rachel Goh", file: "blind-insider.md", blind: true, model: "claude-sonnet-5-5", effort: "low",
    runs: 50, turnSchema: "player", diarySchema: "player", canaries: true, titleProbe: true, cohortCapUsd: 14,
    answers: "Does the satire land for insiders? Is the jargon accurate?" },
  { id: "blind-general", name: "Darren Lim", file: "blind-general.md", blind: true, model: "claude-sonnet-5-5", effort: "low",
    runs: 50, turnSchema: "player", diarySchema: "player", canaries: true, titleProbe: true, cohortCapUsd: 14,
    answers: "Is it funny and followable without insider knowledge?" },
  { id: "blind-international", name: "Maya Torres", file: "blind-international.md", blind: true, model: "claude-sonnet-5-5", effort: "low",
    runs: 50, turnSchema: "player", diarySchema: "player", canaries: true, titleProbe: true, cohortCapUsd: 14,
    answers: "Does it work abroad? Is the title opaque?" },
  { id: "lineage", name: "Sam Ong", file: "lineage.md", blind: true, model: "claude-sonnet-5-5", effort: "medium",
    runs: 30, lineage: { lineages: 6, runsEach: 5 }, turnSchema: "player", diarySchema: "lineage",
    canaries: true, titleProbe: false, cohortCapUsd: 10,
    answers: "Does knowledge visibly improve outcomes? When is CEP inferred, and does it feel like discovery or unfairness?" },
  { id: "veteran", name: "Veteran", file: "veteran.md", blind: false, model: "claude-haiku-5-5", effort: "low",
    runs: 200, turnSchema: "veteran", diarySchema: "veteran", canaries: false, titleProbe: false, cohortCapUsd: 5,
    answers: "Is the win reachable by skill on every origin?" },
  { id: "breaker", name: "QA", file: "breaker.md", blind: false, model: "claude-sonnet-5-5", effort: "medium",
    runs: 30, turnSchema: "breaker", diarySchema: "breaker", canaries: false, titleProbe: false, cohortCapUsd: 10,
    answers: "Safe Heat farming, vetting or election exploits, degenerate loops" }
];

// Analysis agents. Designer can be switched to claude-fable-5-1 with --model.
export const ANALYSIS = {
  auditor: { model: "claude-opus-5-5" as ModelId, effort: "high" as Effort },
  analyst: { model: "claude-opus-5-5" as ModelId, effort: "high" as Effort },
  designer: { model: "claude-opus-5-5" as ModelId, effort: "high" as Effort },
  diaryScorer: { model: "claude-haiku-5-5" as ModelId, effort: "low" as Effort }
};

export const DEFAULTS = {
  maxTurns: 60,          // per run; a run that hits it is logged as "turn_cap"
  concurrency: 4,        // games in flight at once; raise only within your rate limits
  dryRunsPerPersona: 3,
  notesWordCap: 300,     // the agent's own "my life so far" notes; past this it is asked to rewrite them
  notesHardCap: 450,     // oldest lines dropped beyond this if it does not
  turnMaxTokens: 4000,   // thinking + the JSON reply
  diaryMaxTokens: 8000,
  funTurnMaxTokens: 400,   // a fun turn's reply is ~35 tokens; thinking is off
  surveyMaxTokens: 400,
  drySessions: 2,          // a dry run of a session persona plays this many sessions
  canaryCareers: 1         // canaries are planted in a session's first career only (calibration: all)
};

// Calibration: the Haiku players and the Sonnet critic on the same seeds, canaries in every
// career, to check that Haiku marks the bland canary down and flags the wink, and that its
// card-by-card scores agree with the critic's. ~$1 in all (see README).
export const CALIBRATION = {
  sessions: [
    { persona: "fun-casual", sessions: 3 },
    { persona: "fun-insider", sessions: 3 },
    { persona: "fun-completionist", sessions: 2 },
    { persona: "fun-critic", sessions: 3 }
  ],
  capUsd: 2
};

// One seed set shared by every persona, so differences come from the persona, not luck.
export const ORIGINS = ["scholar", "grad", "poly"] as const;
export type Origin = (typeof ORIGINS)[number];
export const seedFor = (i: number) => 10_007 + i * 101;

// Run k of a cohort: origins split evenly, seeds shared across cohorts.
export function runPlan(p: Persona, runs = p.runs): Array<{ origin: Origin; seed: number; lineage?: number; life?: number }> {
  if (p.lineage) {
    const each = p.lineage.runsEach;
    const lineages = Math.max(1, Math.round(runs / each));
    const out = [];
    for (let l = 0; l < lineages; l++)
      for (let k = 0; k < each; k++) out.push({ origin: ORIGINS[l % 3], seed: seedFor(l * each + k), lineage: l, life: k + 1 });
    return out;
  }
  return Array.from({ length: runs }, (_, k) => ({ origin: ORIGINS[k % 3], seed: seedFor(Math.floor(k / 3)) }));
}

// Session s of a fun cohort: its careers' origins and seeds. Seeds are shared by every fun
// persona (session s, career k gets the same seed everywhere), so cohorts differ by persona.
export interface SessionSpec { index: number; careers: Array<{ origin: Origin; seed: number }> }
export function sessionPlan(p: Persona, sessions = p.runs, careers = p.fun?.careers ?? FUN_DEFAULTS.careers): SessionSpec[] {
  const keep = p.fun?.origins === "keep";
  return Array.from({ length: sessions }, (_, s) => ({
    index: s,
    careers: Array.from({ length: careers }, (_, k) => ({ origin: ORIGINS[(keep ? s : s + k) % 3], seed: seedFor(1000 + s * 50 + k) }))
  }));
}
