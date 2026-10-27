# Phase 0 baseline: what the bots already show

Build `8a46ab061b5e` (engine + content at the harness commit). 800 seeded runs per bot per origin, 7,200 in all, from `node test/sim.js 800 --json reports/baseline/bot-metrics.json`. No credits spent. This is the "before" for every designer proposal and the bot half of the first analyst report. Agent cohorts have not run yet.

Ranked by how much each costs the player. Known gaps from the brief are scored, not reported as new.

## New findings

**1. Two consequences due in the same year: the second is silently lost, including the vetting and the election.** `pickEvent` in `web/engine.js` removes every due consequence but fires only the first. `the_vetting` is lost in 2-3% of tea acceptances (first-timer 32 of 968; stat-optimiser 69 of 2,399), and `the_election` in another 2-3%. In the optimiser runs these were lost to `tender_questions` (90 times) and `scholar_returns` (43). A player who accepted tea then never stands for election, and since the tea session is one-time, it never comes back: the run quietly drops out of Act II with no sign anything happened. Suggested fix, for approval: keep the unfired consequences due and fire them in the following years.

**2. The phone labels the hidden values.** Log lines are tagged with their engine kind, uppercased on screen: a CEP hint appears as `CEP  Your reporting officer describes your trajectory as "steady".` and the journalist line as `HEAT  A journalist has been asking around…`. The design says CEP is "surfaced only as rumour, euphemism and inference" and Heat is "invisible". The harness mirrors the phone exactly, so blind agents will see these tags too. Decide before the lineage cohort, whose whole question is when CEP gets inferred: if the tags are unintended, rename them in `web/ui.js` (for example to RUMOUR and WORD), and `test/screen.test.js` keeps the harness in step. To test without them in the meantime: `runner.ts play … --tags none`.

**3. Thirteen choices are strictly worse than a sibling on every stat**, with no hidden payoff in most cases: `the_crisis` B and C (A also raises CEP), `mps_duty` B and C, `secondment` B and C, `new_ro` C, `the_scholar` B, `tender_questions` B, `the_townhall` B, `forum_letter` C (sets a flag nothing reads), `the_vetting` B (minimal answers: worse on every stat, Heat included). Criterion: no obviously dominant choice.

**4. Early losses before 40 are mostly luck for scholars.** First-timer scholars lose early in 2.3% of runs, and 15 of those 18 are a lost GRC: the vetting and election come in years 7-9, straight after the bond, and the GRC roll alone decides it. Optimising scholars lose early in 11% of runs (48 after choosing the riskier single seat, 40 to the GRC roll). Grad early losses are almost all choices plus noise (two D grades). Open question 3 leans "only through active choices"; for scholars, today it is mostly the roll.

**5. The CEP safeguard holds least for scholars.** Of first-timer runs that hit the ceiling, a CEP-raising event was still reachable afterwards in 49% for scholars, 72% for grads and 85% for poly. Most CEP-raising events stop at rank 6, so a scholar capped at rank 6 or 7 has almost nothing left. Optimising play reaches it even less (36-52%), because it climbs to the ceiling fastest. Open question 2.

## Known gaps, measured

| gap | measure | how much it hurts |
|---|---|---|
| Flag-driven follow-ups | 15 flags are set by choices; no event's `requires` reads any of them. Only `declined_tea` is read, by the engine. | 15 of 122 choices set a flag, and 14 of those flags are never read by anything: a callback the choice implies that never comes. Only the 7 scheduled consequences come back. |
| Act III is thin | 62-65% of Act III years are a filler event the player has already seen (all three bots); for optimising play 13-16% are repeat filler with no visible stat change at all. A win-seeking run spends 22 of its years in Act III. | The longest act for anyone who gets there, and the most repetitive. Agent interest by act will say whether it reads as dead. |
| One-directional stats | Visible stats all move both ways (Reputation is the most lopsided: 42 up, 15 down; Competence 50 up, 15 down). CEP goes up 16 times and down once. | Mild for the visible four. |

## What holds

- Origin invariant: first-timer PM scholar 6.1% [4.7-8.0] > grad 2.0% [1.2-3.2] > poly 0% [0-0.5]; win-seeking 78.8% > 67.4% > 22.9%. Regression passes.
- Run length: median 38-42 turns; 91-95% of first-timer runs fall in 35-50.
- Reach: every event appears in at least 1% of runs and every choice is picked at least once.
- Consequences that are scheduled mostly land: 80-100% fire before the run ends, apart from the collisions above.

The first-timer win rates differ from the old README table (8.6 / 1.6 / 0) only because its choices are now seeded; the two optimising bots match the old numbers exactly.
