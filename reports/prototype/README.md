# Prototype: making it fun (branch `fun/next`)

Bot metrics for the prototype build (`b79b80b69452`), against `reports/baseline/` (the game on `main`).
Regenerate with
`node test/sim.js regress 800 --json reports/prototype/bot-metrics.json --baseline reports/baseline/bot-metrics.json`.
The full proposal and reasoning live in the "Making It Fun" doc; this file only records the numbers.

`fun/next` carries, in order: flag callbacks and the immersion sweep (`fun/callbacks`), the optional
batchmate (`fun/rival`), the paid playtest's fixes (years without a decision pass by themselves, candour
made legible, Budget cards, quiet re-elections, probation grace, audit fixes), and an accuracy pass
(the 2026 political salary review, age floors, the scholar's start, the Meet-the-People Session).

| Measure (800 seeded runs per bot per origin) | Current game | Prototype |
| --- | --- | --- |
| PM rate, first-timer (scholar / grad / poly) | 6.4% / 2% / 0% | 4.1% / 0.9% / 0.5% |
| PM rate, knows the win | 82.3% / 69.3% / 24% | 46.3% / 42% / 21.8% |
| PM rate, first-timer with a batchmate | — | 3.3% / 0.4% / 0% |
| PM rate, knows the win with a batchmate | — | 35.6% / 31% / 10.9% |
| PM rate, stat-optimiser | 15.1% / 22.1% / 11.3% | 0% / 0% / 0% |
| Choices worse on every stat | 13 | 5 |
| Taps per run, median (first-timer, scholar / grad / poly) | 39 / 42 / 38 | 21 / 22 / 22 |
| Years per run, median (first-timer) | 39 / 42 / 38 | 40 / 42 / 38 |
| Act I / II / III, first-timer: taps + years that passed by themselves | 31.12 / 1.58 / 7.8 taps | 16.9 + 11.0 / 1.3 + 0.2 / 2.9 + 2.0 |
| CEP-raising event reachable after hitting the ceiling (scholar / grad / poly) | 49% / 71.3% / 83.8% | 66.7% / 73.3% / 76.9% |
| Early losses (before 40) not caused by a choice, scholar | 83.3% | 90.6% |
| Endings reached (first-timer, all origins) | 9 | 10 (11 with a batchmate) |

Notes:
- The 5 "dominated" choices are all "Take it" / "Resign your seat and take it" on the headhunter cards.
  The bots score a choice by its listed effects and cannot see the private-sector lump sum, so these are
  measurement artifacts, not design problems.
- The stat-optimiser reaches PM in no run: since the batchmate merge, a greedy bot backs the other
  candidate in the succession (the bigger Standing gain), which gives the top job away. Knows-the-win is
  the bot that checks the win is reachable.
- With a batchmate every origin is harder for both bots, and poly with a batchmate is the hardest mode.

## Years that pass by themselves

A repeat filler the player has already answered (their habit), a safe re-election (Reputation 60+, Heat
under 40) and an empty year no longer cost a tap. They appear as "Meanwhile" lines in the next outcome
screen, with that year's pay and appraisal compressed to one line; pay, appraisal and promotion still run
every year. Per run (400 runs per origin):

| | First-timer | Knows the win |
| --- | --- | --- |
| Taps / years (mean) | 21.2 / 34.4 | 25.9 / 39.8 |
| Years passed by themselves | 13.2 (habit 12.5, safe re-election 0.65) | 13.9 (habit 9.6, safe re-election 4.3) |
| Re-election shown as a card (seat at risk) | 0.23 | 0.06 |
| A "safe" re-election lost anyway | 2.8% of them | 2.7% of them |

## The other mechanisms (per run)

| | First-timer | Knows the win |
| --- | --- | --- |
| The Indicators (strong / downturn / election year) | 0.38 (0.19 / 0.09 / 0.10) | 1.79 (0.88 / 0.43 / 0.47) |
| Indicators fires where the bonus paid less than promised | 25.6% | 12.8% |
| Appraisals with "however" (a noted choice) | 0.76 | 0 |
| Declassified explains the missing tea invitation | 19.8% of runs | 0% |
| Probation grace (a second D in the first four years) | 0.021 | 0.001 |
| Board-seat offer, single seat / GRC | 0.011 / 0.19 | 0.014 / 0.61 |

The Indicators come up at most once per three-year Budget cycle, as a weighted draw. A priority card
every cycle (4.4 a run for a politician) crowded out the CEP-raising draws and cut knows-the-win poly
from 21% to 14%; it also repeated one card four times a career. Each bot prefers a different option, and
no option is worse on every stat.

## Accuracy pass

- Political pay follows the 2026 review (accepted 8 Sep 2026, effective 15 Oct 2026): MR4 $1.8M, PM $3.6M
  (2x MR4), MR3 $2.34M (1.3x), Parliamentary and Senior Parliamentary Secretary one grade at $810k (0.45x),
  MP $259k ($18,500 a month x 14). MOS $1.26M, SMS $1.53M and DPM $2.88M keep the old multiples.
  `test/harness.test.js` pins the multiples.
- Age floors: Deputy Secretary 35, Permanent Secretary 38 (plausible floors, not official rules).
- President's Scholars start as Assistant Directors at 25, one year in grade instead of two until
  Director, no double jumps. Director at 27 at the fastest, median 28 (knows the win) to 30 (first-timer).
  PM rates before and after this change, 800 runs: first-timer scholar 4.3% → 4.1%, knows the win
  48.0% → 46.3% (1,600 runs on matched builds: 47.1% → 47.7%, against grad 42.3%).
