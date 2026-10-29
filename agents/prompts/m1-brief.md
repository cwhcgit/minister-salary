# PLAYTEST BRIEF: Minister Salary

## What it is
"Minister Salary" is a satirical, turn-based, text-only career simulator in the style of BitLife. It is set in Singapore's public service and politics. You start as a civil servant and try to become Prime Minister. One tap is one in-game year, and a full run is about 25-45 minutes and 35-50 turns. The score is lifetime earnings (Wealth). The ending you reach is the collectible, and replaying is the point.

## Why we are playtesting
The current web build is the M1 playtest harness. It exists to answer one question before any money goes into a native Android (Kotlin/Compose) version: **is the loop fun?** Art, sound and polish are deliberately absent. "If it's not fun with no art, it won't be fun with art." Judge the loop, the choices, the pacing and the writing, not the presentation.

## Ways in
- Live build: https://cwhcgit.github.io/minister-salary/ (deploys from `main`)
- Local: `cd web && python3 -m http.server`, then open the page (it must be served over HTTP, not file://)
- `test/sim.js` is a working example of a scripted player that drives the game rules directly in Node, without a browser. It has 3 bots × 3 origins. Run it with `node test/sim.js 800`.

## The player's experience, per turn
1. **Event card:** a short deadpan scenario with 2-4 choices. Some choices are locked behind a stat minimum; the screen gives an in-world reason, not the number. The four stats are hidden during play and revealed on the ending card.
2. **Outcome screen:**
   - what happened
   - the year's pay package
   - the performance appraisal, shown only as an HR euphemism and never as a grade
   - any promotion, warning or rumour lines
3. Tap **"Confirm Another Year"**. You age one year.
4. At the end comes an **ending card**: title, epitaph, final rank, age, lifetime earnings, integrity, and a share button.

## Stats
- **Visible (0-100):**
  - Reputation: public recognition. Gates electability.
  - Standing: how much the machine trusts you. Gates promotion and the invitation into politics.
  - Integrity: private conscience.
  - Competence: whether you can do the job. The biggest driver of appraisals.
- **Wealth:** always on screen. It is the score, not a gate. The salary figures *are* the satire.
- **Hidden:**
  - **CEP (Currently Estimated Potential):** an invisible ceiling on how high you can be promoted, fixed early by your origin. It only rises through specific standout events, never through grinding stats. It is surfaced only through rumour and euphemism ("Your reporting officer describes your trajectory as 'steady'"). **Learning to read these hints is the skill the game teaches.**
  - **Heat:** invisible scandal exposure from cut corners, telegraphed by flavour text ("A journalist has been asking around…"). If it gets too high, everything surfaces at once.
- Promotion needs strong appraisals plus enough years in grade (more at senior ranks), and is blocked at your CEP. Repeated weak appraisals lead to a sideways transfer, or to being eased out.

## Career shape
- **Act I, civil service** (8 rungs): Management Executive (MX13, ~$46k) up to Permanent Secretary (~$1M). Perm Sec is the top; there is no promotion above it.
- **Act II, the crossing:** if you are senior enough, with high Standing and Reputation, you get "invited to tea". If you go, a vetting follows, then an election:
  - GRC (team seat): safer.
  - SMC (single seat): riskier, needs Reputation 60.
  - Losing the election ends the run.
  - Declining the tea is its own ending path.
- **Act III, politics:** MP ($259k), Parliamentary Secretary and Senior Parliamentary Secretary (one merged pay grade, $810k), Minister of State, Senior Minister of State, Minister ($1.8M), senior Minister, DPM, **PM ($3.6M)**. Figures follow the 2026 political salary review.
- Retirement age is 65 in the civil service and 72 in politics.

## Origins (the meritocracy joke expressed as balance)
| Origin | Start | Ceiling | Difficulty |
|---|---|---|---|
| President's Scholar | Assistant Director, age 25, one year in grade instead of two until Director, 6-year bond (no politics while bonded) | high | Easy |
| Local Graduate | bottom rung, age 23 | median | Normal |
| Poly, then night classes | bottom rung, age 27, high integrity, has exclusive events | low | Hard |

## Endings (12)
1. Prime Minister (the win)
2. Permanent Secretary
3. You Found Your Level (retired below Permanent Secretary)
4. The Tea Was Declined
5. Lost the Ward
6. Everything Surfaced (scandal)
7. The Quiet Conversation (eased out)
8. Backbench Lifer (retired as an MP)
9. Never Quite Cabinet (retired as a junior office-holder)
10. Retired, Honourably (retired as a Minister or above)
11. The Consultancy (left for the private sector)
12. The Invitation Lapsed (invited into politics, then dropped)

## Content size
- 49 events, 122 choices. Most events happen once per run. 9 repeatable filler events keep each year populated.
- 7 "consequence" events are scheduled years after an earlier choice, e.g. a figure you fudged is audited 4 years later, or someone you mentored returns 11 years later. This is meant to be the game's highest-value feature.
- A typical run sees about 18-30 distinct events.

## What "fun" means here (design intent, to judge against)
- **Every year gives the player something worth reading.** A turn that produces nothing is a content failure.
- **Choices carry weight, because some come back** years later.
- **Every stat is pushed in both directions by real choices.** A stat that only ever goes up doesn't earn its place, and neither does an obviously dominant choice.
- **The ceiling is felt but not stated.** Players should slowly work out CEP from euphemisms, and finding that out should feel like discovery, not unfairness.
- **The win is rare by accident and reachable by skill.** Replaying with knowledge should visibly change the outcome.
- **Endings make you want to collect another one.**
- **Core fantasy:** climbing a ladder whose rungs are invisible to you, and discovering the rules only by paying for them.

**Information hygiene for testers:** the hidden mechanics *are* the game. Agents meant to simulate real first-time players should NOT be told about CEP, Heat or the win route. They should only know what's on screen. Informed "veteran" agents are a separate persona.

## Balance invariant
The origin difficulty order **scholar easiest → grad → poly hardest** must hold for random and win-seeking play. A content change that inverts it is wrong. The PM ending should stay rare by accident and reachable by skill.

The current baseline is regenerated for every build by `node test/sim.js --json` and lives in `reports/baseline/`, stamped with the build hash. The first-timer bot is seeded, so its numbers no longer vary between runs. The stat-optimiser has grad above scholar; this is known and accepted. These bots measure balance, not fun. That gap is what this playtest fills.

## Tone rules (judge all writing against these)
1. Institutions are real and accurately modelled (ministries, MX grades, CEP, CPF, GRC/SMC, POFMA, the bonus formula). **Every person is invented. No real politician is named, depicted or caricatured.**
2. Punch at the machinery, never at individuals.
3. Deadpan. The game never winks.
4. Accuracy is the joke. Use real acronyms and real appraisal phrasing.
5. Write with affection, as an insider would.

## Known gaps (don't report these as new findings, but do report how much they hurt)
- **Most choices leave no lasting mark.** 15 story flags get set, but only "declined the tea" changes anything later. The only callbacks are the 7 scheduled consequence events. Flag-driven follow-up content is unwritten.
- Content is about 49 events against a target of 120+, so filler repeats are expected.
- In the design but not built yet:
  - minor flavour beats
  - Traits
  - choosing a ministry (it is currently random and cosmetic)
  - a raw-numbers toggle
  - a minister's bonus driven by their own policy choices (it currently tracks Reputation)
  - a legacy score multiplier
  - an ending gallery
  - a way back after losing an election
- Heat doesn't make old things more likely to resurface; resurfacing chances are fixed when the choice is made.
- Out of scope for v1 by decision: an Opposition career branch, multiplayer, monetisation, iOS, a 5th "Network" stat.

## Open design questions playtesting should answer
1. **Turn length:** one year per turn is clean, but a promotion year and a coasting year feel the same. Would politics (Act III) play better in quarters?
2. **Is CEP too cruel?** Does a hidden hard ceiling read as pointed satire, or just as unfair? The intended safeguard is that at least one CEP-raising event is always reachable.
3. **Failure pacing:** a run should be losable early, but only through active choices, never bad luck. Does it hold?
4. **Title:** "Minister Salary" vs "Confirmed & Substantive" (funnier to insiders, opaque to everyone else).