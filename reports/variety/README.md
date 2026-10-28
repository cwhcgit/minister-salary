# Variety, endings and age floors (branch `fun/variety`)

Builds on `fun/next` (PR #10) and should merge after it. Build `164ca0906992`; the comparison column is
`fun/next` at `09a28e5`. Regenerate with

- `node test/sim.js regress 800 --json reports/variety/bot-metrics.json --baseline reports/baseline/bot-metrics.json`
- `node test/variety.js 120 4 --json reports/variety/variety.json` (`variety-fun-next.json` is the same
  script run on `fun/next`)

## Endings

- The ending card's labels follow the ending: Final position / Took office at for Prime Minister, Left the
  service as or Left Parliament as for the consultancy, Resigned as for a scandal, Last held for being eased
  out, Lost the seat as, Retired as otherwise.
- The Declassified file is one idea per line, about fifteen words or fewer: your ceiling, the party's
  estimate, the move that raised it (or the first one that would have), the rumours, why the tea never came
  (the one stat that fell furthest short), choices that were noted, the exception, what stopped you,
  exposure, the batchmate (where they finished and who outranked whom, their ceiling, head to head, what
  they say), legacy.
- "What stopped you" names appraisals when the ceiling was not what stopped a career.
- Legacy lines of their own for the quiet, scandal and consultancy endings; all legacy lines shortened.
- New ending, Never Quite Cabinet: retiring as Parliamentary Secretary to Senior Minister of State used to
  show Backbench Lifer ("Never a portfolio"). On `fun/next` that ending came up in 149 of 4,800 first-timer
  runs, every one of them a Minister of State or Senior Minister of State. Backbench Lifer now means
  retiring as an MP.

## No early exits without a choice

The first D brings a warning and, the next year, the improvement plan card (A Word from the Whip in
politics). Two Ds in a row end the run only after that card, and never in the first four years or the
first six cards.

| First-timer, 800 runs per origin, alone and with a batchmate (4,800 runs) | `fun/next` | this branch |
| --- | --- | --- |
| Quiet Conversation endings | 126 (2.6%) | 21 (0.4%) |
| Fewest taps in a run that ended without the player choosing to leave | 2 | 6 |
| Runs under 6 taps not chosen (only the headhunter's offer, taken, ends sooner) | 95 | 0 |
| Early losses before 40, scholar / grad / poly (sim, 800 runs) | 3.8% / 7.5% / 0% | 4.4% / 1.0% / 0% |

The remaining scholar early losses are lost elections, after the player accepted tea and chose the seat.

## Age floors and the exceptional chain

Director 28; Deputy Secretary 35, or 33 for an exceptional file; Permanent Secretary 40, or 38 for an
exceptional file, and never below 38. Two standout choices in the service (the crisis statement, the honest
Lo Hei answer, making your own case to the board, or being proved right later: a vindicated paper, a
secondment that worked) mark the file exceptional.

| 800 runs per origin, scholar / grad / poly | marked exceptional | floor actually lowered |
| --- | --- | --- |
| first-timer | 16.5% / 12.5% / 15.3% | 11.8% / 0.1% / 0% |
| knows the win | 14.1% / 17.3% / 26.6% | 6.1% / 1.8% / 0% |
| knows the win + batchmate | 13.9% / 10.8% / 25.3% | 2.5% / 0.3% / 0% |

Youngest Permanent Secretary seen: 38 (40 without the chain). Youngest Deputy Secretary: 33.

## Variety

Versions (the same mechanics in a different scene): five each for The Work and The Appraisal
Conversation; three each for Public Sector Transformation, The Ballot, the tea, the vetting, the election,
A Year Without Incident, 11:40pm, Tuesday Night, The Walkabout, The Parliamentary Question, The Ministry
Townhall and The Improvement Plan. A card shown again in the same run moves on to its next version.
Ministry decks: three cards each for Health, Manpower, National Development and Education. Freshness: the
phone remembers its last two runs; their cards weigh 0.35, their versions are shown last.

| 120 players x 4 careers, freshness on | `fun/next` | this branch |
| --- | --- | --- |
| Cards in the pool | 88 | 102 |
| Next run repeats, by scene (random bot: grad / poly / scholar) | 54% / 58% / 42% | 20% / 27% / 18% |
| Next run repeats, by card id (same) | 54% / 58% / 42% | 46% / 51% / 34% |
| Full cards that replay a scene from earlier in the same run (same) | 16% / 10% / 10% | 1% / 0% / 2% |
| Scenes in more than 60% of runs (random bot) | 6 / 9 / 3 | 0 / 1 / 0 |
| Next run repeats, by scene (sensible bot) | 63% / 62% / 62% | 19% / 24% / 29% |

Still in more than 60% of runs for a player who reaches office: the political one-off cards (The Bonus,
The Correction Direction, The Reshuffle, The Town Council) and the Budget card. The political deck is
small; it needs more cards, not more versions.

## Balance (`node test/sim.js regress 800`, passes)

| PM rate, scholar / grad / poly | `fun/next` | this branch |
| --- | --- | --- |
| first-timer | 3.3% / 1.1% / 0% | 3.8% / 0.8% / 0.1% |
| knows the win | 51.5% / 47.1% / 21.3% | 51.6% / 46.9% / 22.4% |
| first-timer + batchmate | 2.8% / 0.4% / 0.1% | 1.8% / 0.3% / 0.1% |
| knows the win + batchmate | 39.9% / 34.3% / 11% | 39.4% / 33.0% / 9.9% |

Knows the win, poly with a batchmate, is 9.9% on the 800 fixed seeds and 11.5% over 2,400 (`fun/next`:
12.2% over 2,400); the difference is seed noise. The dominated-choice count is back to the 5 headhunter
artifacts.
