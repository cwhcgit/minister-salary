# Bot baseline

Build `a1e326216fc3` (`main` at 02b7626: 180 cards, 7 batchmate cards, 12 endings). 800 seeded runs
per bot per origin, alone and with a batchmate: 12,000 in all. Regenerate with
`node test/sim.js regress 800 --json` after any change to the engine or content; `bot-metrics.json`
carries the build hash. No credits spent. This is the "before" for every designer proposal and the
bot half of each analyst report.

The three bots: the first-timer picks at random, the stat-optimiser takes the choice that raises its
stats most, and "knows the win" chases the ceiling and the top job.

Ranked by how much each costs the player.

## Findings

**1. Early losses are still mostly luck, and only for scholars.** A loss before 40 (an election, a
scandal, or being eased out) happens in 3% of first-timer scholar runs, and 23 of those 24 are an
election lost on the roll, right after the bond. Optimising scholars lose early in 6.6-7.1% of runs,
about 95% of them by luck. Graduates and poly entrants never lose before 40. Open question 3 asks
for losses only through choices; for scholars, it is still mostly the roll.

**2. The ceiling safeguard holds for about four careers in five.** Of first-timer runs that hit the
ceiling, a CEP-raising card was still reachable afterwards in 76% for scholars, 81% for graduates
and 83% for poly; it was shown in 55%, 45% and 60%, and taken in 32%, 28% and 51%. For a win-seeking
scholar it is reachable in only 14%: they reach their ceiling high up, where few cards raise it.
Open question 2.

**3. Some cards are almost never seen.** In 12,000 runs, `whip_word` and `whistle_panel_pol` never
appear, and 18 more appear in under 1% of runs: the `ally_returns` and `scholar_returns` families,
`improvement_plan` (0.6%), `promotion_board` (0.7%), `headhunter_political` (0.6%), two U-Turn and
Pilot alternates in politics, and `strange_envelope_pol`.

**4. Slow consequences often outlive the career.** None is ever dropped, but some are still
pending when the run ends: `younger_officer` fires in 4% of the runs that schedule it,
`interview_panel` in 21%, `block_party` in 30% and `model_ward` in 35%.

**5. Choices leave marks that nothing reads yet.** 159 of 492 choices set a flag; 21 of the 110
flags they set are read by no card, Declassified line, Folder item or legacy line. Most are record
flags on chain beats and the Prime Minister's tenure (`pilot_met`, `uturn_quoted`, `pm_rally_big`).

**6. The ceiling only goes up.** 45 choices raise CEP and one lowers it. The four stats all move
both ways (Competence is the most lopsided: 197 up, 52 down; Reputation 177 up, 62 down).

**7. Two choices are worse than a sibling on every stat, both "Take it." on the headhunter cards**
(`headhunter_early` A, below C; `headhunter_mid` A, below B and C). Neither is real: taking the offer
ends the career with a lump sum, which the dominance check does not count.

## Since the last baseline (build `170fce4cadfa`)

- Thirteen dominated choices are down to the two above.
- Act III no longer repeats itself: 62-65% of its years used to be a card the player had already
  seen; now a repeatable card already played passes as a year without a decision, and 2-4% of
  Act III's cards are repeats.
- The game grew from 49 cards and 122 choices to 187 cards (the batchmate's 7 included) and 492
  choices, so finding 5 is not comparable with the old "14 of 15 flags never read".

## What holds

- Regression passes: origin order, the top job rare by accident, every run ends, no consequence
  dropped.
- Origin order (PM rate, 95% interval): first-timer scholar 3.5% [2.4-5] > graduate 0.3% [0.1-0.9]
  > poly 0% [0-0.5]; knows the win 45.9% > 39.0% > 20.6%.
- The batchmate makes it harder: knows the win with a batchmate reaches PM in 33.6%, 25.3% and
  10.3%.
- Run length (first-timer): a median 24 cards for scholars (many leave early for the private
  sector), 29 for graduates and 28 for poly, over a median 39, 41 and 37 years.
