# Harness

Drives the web build's rules engine (`web/engine.js`) headlessly, for the bots in `test/sim.js` and the agents in `agents/`. No dependencies.

```js
const H = require("./harness");
let run = H.newRun("grad", 42, { name: "Tan Wei Ming", gender: "m" });   // the start screen; a blank name is drawn
H.screenText(run);                       // what the phone shows: the only thing a blind agent gets
H.choices(run);                          // [{ id: "A", text, available, requires }]
run = H.step(run, "B");                  // returns a new run; refuses locked choices
H.trace(run);                            // everything else, per turn and per run
H.replay({ buildHash, origin, seed, name, gender, choices: ["B", "A", …] });   // exact replay
```

## Two records, kept apart

**Screen** (`screen`, `screenText`): the event card, with locked choices shown with their in-world reason exactly as the UI shows them; last year's outcome, pay package, appraisal euphemism, and promotion, warning and rumour lines; the header with rank, age, year, ministry and wealth (the four stats are hidden during play, and a stat value on a play screen counts as a leak); the ending card, which reveals the four stats with their verdicts. On the phone a year is two screens (outcome, then the next event). The agent view joins them under one header; `{ view: "event" }` and `{ view: "outcome" }` give each alone. `test/screen.test.js` plays careers through the real DOM and checks every field against this, so the two cannot drift apart unnoticed.

The screen never contains CEP or Heat values, flags, choice effects, scheduled events, event ids or RNG rolls. `test/harness.test.js` enforces this with a field allowlist, and `harness/leak-check.js` scans thousands of generated screens.

**Trace** (`trace`): per turn, the event and where it came from (random draw, priority, a consequence firing, or the empty-pool fallback), the choice and its effects, every sibling's effects and availability, stats before and after, flags set and cleared, consequences scheduled, missed or dropped, the appraisal score and its noise, the promotion check and why it passed or failed, and the election roll. Per run: origin, seed, choices, final state, pending consequences, and the cause chain behind the ending (`endingCause`), which classifies a loss as `choice`, `choice+luck`, `luck` or `drift`.

The engine reports the appraisal, promotion and election details through a `trace` object it returns from `advance()`. The UI ignores it, and it changes no state and no random draw.

## Builds

The player's name and gender (`{ name, gender }`, a key of `game.json` `player.genders`; default
its `default`, Female) are text only: they
fill the `{player}` tokens and keep the cast's and the batchmate's names clear of the player's, and
never touch the run's dice. The same seed plays the same career as Female and as Male; the name
and gender are part of the replay key only so that the screens replay word for word.

`loadBuild({ root, canaries })` loads an engine and content set and hashes them. Every run carries the hash, and `replay` refuses a run recorded on a different build. `root` points at any copy of `web/`, such as a proposal's patched build. `canaries: true` adds the two planted events in `canaries.json`: one deliberately bland, one that winks at the player. Agent cohorts use them to check that the agents rate honestly.
