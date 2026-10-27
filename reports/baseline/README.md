# Bot baseline

Build `170fce4cadfa`. 800 seeded runs per bot per origin, 7,200 in all. Regenerate with `node test/sim.js --json` after any change to the engine or content; `bot-metrics.json` carries the build hash. No credits spent. This is the "before" for every designer proposal and the bot half of each analyst report.

Since the Phase 0 baseline (build `8a46ab061b5e`): consequences that fall due in the same year now carry over to the following years instead of being dropped, and the CEP and Heat log lines are tagged RUMOUR on the phone.

Ranked by how much each costs the player. Known gaps from the brief are scored, not reported as new.

## Findings

**1. Thirteen choices are strictly worse than a sibling on every stat**, with no hidden payoff in most cases: `the_crisis` B and C (A also raises CEP), `mps_duty` B and C, `secondment` B and C, `new_ro` C, `the_scholar` B, `tender_questions` B, `the_townhall` B, `forum_letter` C (sets a flag nothing reads), `the_vetting` B (minimal answers: worse on every stat, Heat included). Criterion: no obviously dominant choice.

**2. Early losses before 40 are mostly luck for scholars.** First-timer scholars lose early in 2.3% of runs, and 15 of those 18 are a lost GRC: the vetting and election come in years 7-9, straight after the bond, and the GRC roll alone decides it. Optimising scholars lose early in 11.6% of runs (51 after choosing the riskier single seat, 42 to the GRC roll). Grad early losses are almost all choices plus noise (two D grades). Open question 3 asks for losses only through active choices; for scholars, today it is mostly the roll.

**3. The CEP safeguard holds least for scholars.** Of first-timer runs that hit the ceiling, a CEP-raising event was still reachable afterwards in 49% for scholars, 71% for grads and 84% for poly. Most CEP-raising events stop at rank 6, so a scholar capped at rank 6 or 7 has almost nothing left. Optimising play reaches one even less often (36-52%), because it climbs to the ceiling fastest. Open question 2.

## Fixed since Phase 0

**Consequences no longer get lost.** Before, when two fell due in the same year, the second vanished, including the vetting and the election. Now one fires a year and the rest wait their turn, earliest first. No consequence is dropped in any of the 7,200 runs (the regression now fails if one is). The vetting now follows tea in 98.9% of first-timer runs (was 95.6%) and the election follows the vetting in 98.2% (was 95.8%); the remainder are runs that retire first. 32 vettings and 22 elections arrive a year late. The stranded players used to retire as Permanent Secretary: that ending disappears from both optimising bots (24-49 runs per origin before, none now), and their PM rates rise slightly.

## Known gaps, measured

| gap | measure | how much it hurts |
|---|---|---|
| Most choices leave no lasting mark | 15 of 122 choices set a flag, and 14 of those flags are never read by anything. Only the 7 scheduled consequences come back. | Every flag-setting choice implies a callback that never comes. |
| Filler repeats (49 events against 120+) | 62-65% of Act III years are a filler event the player has already seen (all three bots); for optimising play 13-16% are repeat filler with no visible stat change at all. A win-seeking run spends 23 of its years in Act III. | Act III is the longest act for anyone who gets there, and the most repetitive. Agent interest by act will say whether it reads as dead. |
| CEP only goes up | 16 choices raise CEP, one lowers it. The four visible stats all move both ways (Reputation is the most lopsided: 42 up, 15 down; Competence 50 up, 15 down). | Mild for the visible four. |

## What holds

- Origin invariant: first-timer PM scholar 6.4% [4.9-8.3] > grad 2.0% [1.2-3.2] > poly 0% [0-0.5]; win-seeking 82.3% > 69.3% > 24.0%. Regression passes.
- Run length: first-timer median 38-42 turns; 90-95% of runs fall in 35-50.
- Reach: every event appears in at least 1% of runs and every choice is picked at least once.
- Consequences land: 79-99% fire before the run ends; the rest are pending when the career ends.
