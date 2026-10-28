# Prototype: making it fun (now with flag callbacks, branch `fun/callbacks`)

Bot metrics for the prototype build, against `reports/baseline/` (the current game). Regenerate with
`node test/sim.js regress 800 --json reports/prototype/bot-metrics.json --baseline reports/baseline/bot-metrics.json`.
The full proposal and reasoning live in the "Making It Fun" doc; this file only records the numbers.

| Measure (800 seeded runs per bot per origin) | Current game | Prototype |
| --- | --- | --- |
| PM rate, first-timer (scholar / grad / poly) | 6.4% / 2% / 0% | 5.8% / 1.1% / 0.1% |
| PM rate, knows the win | 82.3% / 69.3% / 24% | 50% / 40.4% / 20.1% |
| PM rate, stat-optimiser | 15.1% / 22.1% / 11.3% | 52.6% / 24.5% / 3.8% |
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

Flag callbacks (`fun/callbacks`): 15 new triggered cards, one per story flag, plus a second choice on
`ally_returns` and `scholar_returns`. A random first-timer sees 1.5 callbacks per run (76% of runs see at
least one), against 0.3 of the old consequence cards. Scheduled consequences now wait until their own
`requires` hold (a promotion-board callback never lands on a Minister) and are never dropped. Knows-the-win
PM rates move by about as much as the merged game moves between seed sets (grad 49% vs 43% on two seed
sets for the same build); poly holds at about 20%.
