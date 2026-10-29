// Structured-output schemas. Every object closes with additionalProperties: false and lists
// every property in required (nullable ones use anyOf with null), as structured outputs
// require. No numeric or length constraints: the API does not enforce them, so ranges are
// enums and lengths are asked for in the prompt and checked in code.
import type { DiarySchema, TurnSchema } from "./config.ts";

type S = Record<string, unknown>;
const str: S = { type: "string" };
const bool: S = { type: "boolean" };
const int: S = { type: "integer" };
const nullable = (s: S): S => ({ anyOf: [s, { type: "null" }] });
const obj = (properties: Record<string, S>): S =>
  ({ type: "object", properties, required: Object.keys(properties), additionalProperties: false });
const arr = (items: S): S => ({ type: "array", items });
const oneOf = (...values: Array<string | number>): S => ({ type: typeof values[0] === "number" ? "integer" : "string", enum: values });

const CHOICE = oneOf("A", "B", "C", "D");
const SCALE = oneOf(1, 2, 3, 4, 5);

// Notes are append-only: one line a turn (`remember`), and a full rewrite (`rewrite_notes`)
// only when the runner says they have outgrown their cap. Rewriting 300 words every turn
// would make output tokens most of the bill.
const NOTES = { remember: str, rewrite_notes: nullable(str) };

// A fun-meter turn: the whole reply is ~35 tokens. The model names what it reacted to, then
// picks a verdict (the runner maps it to a delta: small models gave a numeric scale ~90% ups),
// then its choice. Properties are generated in this order.
export const FUN_VERDICTS = ["fine", "skimmed", "annoyed", "smiled", "tell_a_friend"] as const;
export const funTurnSchema = (verdicts: readonly string[] = FUN_VERDICTS): S => obj({
  reason: str,
  verdict: oneOf(...verdicts),
  choice: CHOICE,
  off_tone: nullable(str),
  unclear: nullable(str)
});

export const TURN: Record<TurnSchema, S> = {
  fun: funTurnSchema(),
  player: obj({
    choice: CHOICE,
    why: str,
    interest: SCALE,
    felt_weighty: bool,
    confused_by: nullable(str),
    note: nullable(str),
    ...NOTES
  }),
  veteran: obj({ choice: CHOICE, why: str, ...NOTES }),
  breaker: obj({ choice: CHOICE, why: str, exploit_note: nullable(str), ...NOTES })
};

const moment = obj({ year: int, what: str });
const toneBreak = obj({
  line: str,
  problem: oneOf("winked", "mean_to_a_person", "resembles_real_politician", "inaccurate_detail", "other"),
  note: str
});

const playerDiary = {
  best_moment: moment,
  worst_moment: moment,
  skip_year: obj({ year: nullable(int), why: str }),
  callbacks_noticed: arr(obj({ earlier_choice: str, came_back_as: str, felt_earned: bool })),
  held_back_by: str,
  ending_fair: bool,
  ending_fair_why: str,
  chase_next: str,
  play_again_now: bool,
  play_again_why: str,
  tone_breaks: arr(toneBreak),
  title_fit: oneOf("Minister Salary", "Confirmed & Substantive", "neither"),
  title_fit_why: str,
  overall_interest: SCALE
};

export const DIARY: Record<DiarySchema, S> = {
  // the fun session's exit survey, asked once: when the player quits or the session ends
  fun: obj({ quit_reason: str, best_card: str, worst_card: str }),
  player: obj(playerDiary),
  lineage: obj({ ...playerDiary, notes_for_next_life: str }),
  veteran: obj({
    won: bool,
    what_decided_it: str,
    was_the_win_reachable_by_skill: bool,
    hardest_gate: str,
    luck_vs_skill: str
  }),
  breaker: obj({
    exploits: arr(obj({
      name: str,
      how: str,
      severity: oneOf("game_breaking", "major", "minor", "cosmetic"),
      events: arr(str),
      reproducible: bool
    })),
    degenerate_loops: arr(str),
    notes: str
  })
};

export const TITLE_PROBE: S = obj({
  would_tap: oneOf("Minister Salary", "Confirmed & Substantive", "neither"),
  why: str,
  expect_minister_salary: str,
  expect_confirmed_substantive: str
});

// Coding of free-text diary answers, for comparing across runs and lives.
export const DIARY_CODE: S = obj({
  infers_hidden_ceiling: bool,
  ceiling_feeling: oneOf("discovery", "unfair", "resigned", "not_mentioned"),
  blames: oneOf("own_choices", "luck", "the_system", "origin", "unclear"),
  evidence: str
});

// --- analysis agents --------------------------------------------------------

export const AUDIT: S = obj({
  findings: arr(obj({
    event_id: str,
    field: str,             // e.g. "body", "choices[1].outcome", "endings.quiet.epitaph"
    line: str,              // the exact text
    rule: oneOf("1_people_invented", "2_machinery_not_persons", "3_deadpan", "4_accuracy", "5_affection", "6_immersion"),
    problem: str,
    severity: oneOf("must_fix", "should_fix", "consider"),
    suggested_fix: str
  })),
  accuracy_checks: arr(obj({ claim: str, status: oneOf("accurate", "inaccurate", "unverifiable"), note: str })),
  summary: str
});

const evidence = obj({ source: oneOf("bot", "agent", "both"), detail: str });

export const ANALYST: S = obj({
  findings: arr(obj({
    id: str,                 // F1, F2, ...
    title: str,
    criterion: str,          // which fun criterion or open question it bears on
    kind: oneOf("new", "known_gap_severity"),
    events: arr(str),
    choices: arr(str),       // "event_id:A"
    stats: arr(str),
    evidence: arr(evidence),
    confirmed_both_ways: bool,
    confidence: oneOf("high", "medium", "low"),
    severity: oneOf("critical", "major", "minor"),
    recommendation: str
  })),
  criteria: arr(obj({ criterion: str, answer: str, verdict: oneOf("met", "partly", "not_met", "unknown"), evidence: str })),
  open_questions: arr(obj({ question: str, evidence: str, leaning: str, confidence: oneOf("high", "medium", "low"), needs_humans: bool })),
  known_gaps: arr(obj({ gap: str, frequency: str, interest_drop: str, hurt_score: oneOf(1, 2, 3, 4, 5), evidence: str })),
  cohort_validity: arr(obj({ cohort: str, canaries_passed: bool, discount_praise: bool, note: str })),
  prediction_checks: arr(obj({ proposal: str, metric: str, predicted: str, observed: str, came_true: oneOf("yes", "no", "partly", "untested") })),
  summary: str
});

export const DESIGNER: S = obj({
  proposals: arr(obj({
    id: str,                 // short kebab-case
    title: str,
    kind: oneOf("balance", "new_event", "event_edit"),
    addresses: arr(str),     // analyst finding ids
    rationale: str,
    ops: arr(obj({
      op: oneOf("add_event", "replace_event", "set"),
      target: oneOf("events", "game"),
      id: nullable(str),     // event id for replace_event / set on events
      path: nullable(str),   // dotted path for set, e.g. "choices.1.effects.standing" or "minYearsInGrade"
      json: str              // the event object, or the new value, as JSON text
    })),
    prediction: obj({ metric: str, direction: oneOf("up", "down", "unchanged"), expected: str, why: str })
  })),
  notes: str
});
