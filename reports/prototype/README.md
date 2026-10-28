# Prototype: making it fun (branch `fun/prototype`)

Bot metrics for the prototype build, against `reports/baseline/` (the current game). Regenerate with
`node test/sim.js regress 800 --json reports/prototype/bot-metrics.json --baseline reports/baseline/bot-metrics.json`.
The full proposal and reasoning live in the "Making It Fun" doc; this file only records the numbers.

| Measure (800 seeded runs per bot per origin) | Current game | Prototype |
| --- | --- | --- |
| PM rate, first-timer (scholar / grad / poly) | 6.4% / 2% / 0% | 6.5% / 2.1% / 0.3% |
| PM rate, knows the win | 82.3% / 69.3% / 24% | 51.9% / 48.8% / 25.8% |
| PM rate, stat-optimiser | 15.1% / 22.1% / 11.3% | 61% / 33.3% / 4.4% |
| Choices worse on every stat | 13 | 4 |
| Act I / II / III turns per run (first-timer) | 31.12 / 1.58 / 7.8 | 27.24 / 1.35 / 4.91 |
| CEP-raising event reachable after hitting the ceiling (scholar / grad / poly) | 49% / 71.3% / 83.8% | 61% / 80.1% / 86.8% |
| Early losses (before 40) not caused by a choice, scholar | 83.3% | 90% |
| Endings reached (first-timer, all origins) | 9 | 11 |

Random first-timers: about 11.5 montage years and 2.3 full-card repeats per run, against roughly 14 full-card repeats before.

Notes:
- The 4 "dominated" choices are all "Take it" on the headhunter cards. The bots score a choice by its listed
  effects and cannot see the private-sector lump sum, so these are measurement artifacts, not design problems.
- Random first-timers take the headhunter's offer in about a third of runs (`consultancy` endings). Whether
  real players do is the first thing a cohort on this build should measure.
- The stat-optimiser now favours scholars strongly (61% PM). Scholars are meant to be easy mode; worth
  watching rather than fixing until real players have played it.

## The batchmate (start-screen option, branch `fun/rival`)

`node test/sim.js` also plays the first-timer and knows-the-win bots with a batchmate, on the same seeds.
`regress` checks the batchmate never makes the game easier (95% intervals must not separate upwards), the
origin order holds with a batchmate, and poly + batchmate is the hardest of the six combinations.

| PM rate, knows the win | scholar | grad | poly |
| --- | --- | --- | --- |
| alone | 51.1% | 49.9% | 24.5% |
| with a batchmate | 43.8% | 31.6% | 11.6% |

The ranking exercise decides about 2.1-2.4 promotions per skilled career (the player wins 36-47%), and
1.1-1.4 for random first-timers. Scholars lose the least: they have so many spare years that a lost ranking
rarely costs the top job.
