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

export type TurnSchema = "player" | "veteran" | "breaker";
export type DiarySchema = "player" | "lineage" | "veteran" | "breaker";

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
}

export const PERSONAS: Persona[] = [
  { id: "blind-insider", name: "Rachel Goh", file: "blind-insider.md", blind: true, model: "claude-sonnet-5-5", effort: "low",
    runs: 50, turnSchema: "player", diarySchema: "player", canaries: true, titleProbe: true, cohortCapUsd: 12,
    answers: "Does the satire land for insiders? Is the jargon accurate?" },
  { id: "blind-general", name: "Darren Lim", file: "blind-general.md", blind: true, model: "claude-sonnet-5-5", effort: "low",
    runs: 50, turnSchema: "player", diarySchema: "player", canaries: true, titleProbe: true, cohortCapUsd: 12,
    answers: "Is it funny and followable without insider knowledge?" },
  { id: "blind-international", name: "Maya Torres", file: "blind-international.md", blind: true, model: "claude-sonnet-5-5", effort: "low",
    runs: 50, turnSchema: "player", diarySchema: "player", canaries: true, titleProbe: true, cohortCapUsd: 12,
    answers: "Does it work abroad? Is the title opaque?" },
  { id: "lineage", name: "Sam Ong", file: "lineage.md", blind: true, model: "claude-sonnet-5-5", effort: "medium",
    runs: 100, lineage: { lineages: 20, runsEach: 5 }, turnSchema: "player", diarySchema: "lineage",
    canaries: true, titleProbe: false, cohortCapUsd: 25,
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
  diaryMaxTokens: 8000
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
