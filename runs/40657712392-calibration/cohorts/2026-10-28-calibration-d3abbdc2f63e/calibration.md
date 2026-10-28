# Calibration

Haiku does NOT mark the bland canary down and flags the wink.

| model | sessions | taps | mean delta | bland canary | wink flagged | base off-tone | median taps to quit | cost a session |
|---|---|---|---|---|---|---|---|---|
| claude-haiku-5-5 | 8 | 310 | 1.84 | -0.73 (n 11, fail) | 13/13 (pass) | 9.99% | 37.5 | $0.00646 |
| claude-sonnet-5-5 | 3 | 118 | 1.74 | -1.5 (n 4, pass) | 5/5 (pass) | 8.5% | 40 | $0.09853 |

Card by card, on 65 cards both models saw: Pearson 0.02, mean gap 1.3 points, same sign 83.1%.

| card | Haiku | Sonnet | gap |
|---|---|---|---|
| The Parliamentary Question | 5 | 0 | 5 |
| An Invitation to Tea | 5 | 1 | 4 |
| A Small Favour | -0.5 | 3.5 | -4 |
| The Adviser Suggests Something | -0.4 | 3 | -3.4 |
| The Correction Direction | -0.33 | 3 | -3.33 |
| Hansard | 2 | -1 | 3 |
| Public Sector Transformation | 3 | 0.5 | 2.5 |
| The Work | 1.33 | -1 | 2.33 |
