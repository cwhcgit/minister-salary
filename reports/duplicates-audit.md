# One decision, once: the audit of duplicate decisions

Every card a career can meet, read for the decision it poses, then checked against simulated careers for which ones a single career actually meets together. "Today" is `main` after PR #48 (2163272); "after" is the branch `fun/one-decision-once`. Each count is the share of 7,200 careers that are shown two or more cards posing the group's decision in full.

## Summary

- **187 cards read** (105 in `events.json`, 75 in the packs, 7 in `rival.json`), each given a one-line decision signature (appendix).
- **28 groups a single career can meet** (two added since, with the flying saucer): 19 groups of different cards that pose one decision, and 9 repeatable cards (alone or with their siblings) whose later showings posed their decision again as if new.
- **The biggest**, by share of careers that met the decision twice today: effort 68.5%; candour_up 43.6%; work_life 24.8%; bad_number 24.3%; ceiling_ask 16.4%; footing 13.2%; house_brief 11.0%; private_offer 10.2%.
- **Careers that meet at least one decision twice: 94.3% today, 0.0% after.**
- Resolved three ways: an exclusive group (a career meets the first card of the group it is shown, and never the others); a series (a card that repeats does so as a habit: shown in full once or twice, the second time asking whether to keep the habit, then passing by itself); or a rewrite, where a weak duplicate would have starved its group's best card or broken a story, and became a different decision.

## Method

1. **Signatures.** Every card in `events.json`, the packs and `rival.json` got a one-line signature: the situation, what is decided, and the axes its choices span ("honesty vs flattery about a bad number, upwards"). Alternates of one consequence (`ally_returns_*`, `pilot_audit_*`) count as one card; a card whose parts give it two roles (`bench_adjournment`: the mover, or the minister replying) was read in each role; every version of a repeatable card was read as a card of its own, since the player meets them as different cards.
2. **Clustering.** Signatures were tagged with the decision they pose and the setting. Two cards cluster when they pose the same decision in a similar setting, or when one option is shared ("ask for the hard ministry nobody wants"), as the brief asked: close matches count. Every cluster was then read again and judged: a group, or a likeness weighed and kept apart (the last section says why).
3. **Co-occurrence.** The harness played 600 careers per origin with random play and with the win-seeking bot, alone and with a batchmate (7,200 careers, seeds `i*7+3`), on `main` and on the branch, and counted every card shown in full. A group counts once per career however many pairs it holds. A consequence's matching beat is counted as the card that poses the decision (`pilot_results` for The Pilot, `bond_bank` for The Bond), though the group is claimed through the chain's first card.
4. **The test.** `test/duplicates.js` (in CI) plays 1,800 more careers on its own seeds and fails on any career shown two cards of a group, or a card shown in full more often than its series allows.

## Groups a career now meets once (exclusive groups)

The first card of a group a career is shown claims the group; the others are never drawn, and a consequence that would fire one is struck. Draw order decides which card a career meets.

| Group | The shared decision | Cards | Two or more, today → after | Most common pairs today | Notes |
| --- | --- | --- | --- | --- | --- |
| `bad_number` | Your scheme's number is bad: present it straight, or flattered (to a superior or the public) | `bench_gpc`, `inconvenient_figure`, `moh_premiums`, `pilot_design` (for `pilot_results`), ~~`opening_scholar`~~ (rewritten), ~~`the_townhall`~~ (rewritten) | 24.3% → 0.0% | `inconvenient_figure` + `opening_scholar` 7.7%, `opening_scholar` + `the_townhall` 5.5%, `opening_scholar` + `pilot_results` 5.3% | The Pilot joins through `pilot_design`. `opening_scholar` and the townhall's survey version were rewritten instead (below). |
| `announce` | The Minister needs something to announce: oversell it, dress it up, or hold back | `cos_speech`, `moh_beds`, `pilot_design` (for `pilot_results`) | 3.4% → 0.0% | `cos_speech` + `pilot_results` 2.2%, `cos_speech` + `moh_beds` 0.86%, `moh_beds` + `pilot_results` 0.38% | `pilot_design` is in both this group and `bad_number`. |
| `house_brief` | Answer in the House: concede the point (or correct the record), or read the officials' brief | `bench_adjournment`, `bench_cut`, `the_pq`, `uturn_questions`, `whistle_return_pol` | 11.0% → 0.0% | `bench_adjournment` + `the_pq` 3.5%, `the_pq` + `uturn_questions` 3.5%, `bench_cut` + `the_pq` 2.9% | `the_pq` is a series too. `bench_adjournment` and `bench_cut` pose it only in their reply role (rank 9+: `{ "group", "requires": { "minRank": 9 } }`). `whistle_return_pol` ends its chain, so striking it cuts nothing. |
| `viral_post` | A post or headline goes viral, partly wrong: correct its errors, or concede what it got right | `mnd_million`, `moh_waiting`, `pofma_moment` | 7.9% → 0.0% | `moh_waiting` + `pofma_moment` 4.0%, `mnd_million` + `pofma_moment` 3.9%, `mnd_million` + `moh_waiting` 0.32% | `moh_waiting` and `mnd_million` meet only after a reshuffle into the other ministry. |
| `private_offer` | Leave for private-sector money | `bond_masters` (for `bond_bank`), `headhunter_early`, `headhunter_mid`, `headhunter_political`, `headhunter_political_grc` | 10.2% → 0.0% | `headhunter_early` + `headhunter_mid` 3.6%, `headhunter_early` + `headhunter_political` 2.5%, `headhunter_mid` + `headhunter_political` 2.4% | The Bond joins through `bond_masters` (its beat 2 is the bank's offer). Fewer careers end in the consultancy: a career that declined one offer is not asked again. |
| `hard_job` | Ask for the hard job nobody wants | `reshuffle`, ~~`farewell_drinks`~~ (rewritten), ~~`first_cabinet`~~ (rewritten) | 6.5% → 0.0% | `farewell_drinks` + `reshuffle` 5.4%, `first_cabinet` + `reshuffle` 1.1%, `farewell_drinks` + `first_cabinet` 0.03% | Resolved by rewriting `farewell_drinks` and `first_cabinet`: as a group, the early `farewell_drinks` starved the reshuffle, and the win bot's graduate PM rate fell about 9 points. |
| `not_yet` | Back someone who will overtake you, or say "not yet" | `protege_panel`, `rival_views` | 0.08% → 0.0% | `protege_panel` + `rival_views` 0.08% | `rival_views` is also in `peer_review`; `protege_panel` ends its chain. |
| `peer_review` | Your batchmate's file or work: help, stay out, or undercut | `rival_360`, `rival_annex`, `rival_views` | 4.2% → 0.0% | `rival_360` + `rival_annex` 3.1%, `rival_annex` + `rival_views` 0.90%, `rival_360` + `rival_views` 0.68% | The batchmate's help / stay out / undercut triad. |
| `one_slot` | One career-making slot between you and someone else: put yourself forward, or step aside | `leadership_programme`, `reorg`, `rival_posting` | 2.1% → 0.0% | `leadership_programme` + `reorg` 1.5%, `leadership_programme` + `rival_posting` 0.32%, `reorg` + `rival_posting` 0.31% | `succession` and `rival_first` pose the same decision at the top, and are kept: they are the career's climax (kept-apart list). |
| `credit_taken` | Someone else gets the credit for your work: let it go, or reclaim it | `and_team`, `consultant_report` | 8.5% → 0.0% | `and_team` + `consultant_report` 8.5% |  |
| `candour_up` | Someone senior asks you straight: the true answer, the expected one, or something useful | `postit_workshop`, `station_four`, ~~`cny_lohei`~~ (rewritten) | 43.6% → 0.0% | `postit_workshop` + `station_four` 30.4%, `cny_lohei` + `postit_workshop` 20.8%, `cny_lohei` + `station_four` 12.1% | `cny_lohei` (the third card) was rewritten: as a group member it came last in a career, and its standout moment (a ceiling raise) was starved; the win bot's graduate PM rate fell about 4 points. |
| `declare` | You sit in judgement on someone you know: declare it, or not | `bench_tea`, `promotion_board`, `the_tender` | 2.3% → 0.0% | `bench_tea` + `the_tender` 2.1%, `promotion_board` + `the_tender` 0.15%, `bench_tea` + `promotion_board` 0.06% |  |
| `mentor_hardway` | A newer officer's work: teach them, let them learn the hard way, or do it yourself | `real_sop`, `the_scholar` | 1.2% → 0.0% | `real_sop` + `the_scholar` 1.2% |  |
| `own_up` | Your good deed surfaces without your name: put your name to it, or stay quiet | `bonus_vindicated`, `committee_vindicated`, `figure_vindicated`, `for_the_record_audit`, `officer_a` | 1.4% → 0.0% | `figure_vindicated` + `for_the_record_audit` 0.49%, `committee_vindicated` + `for_the_record_audit` 0.32%, `for_the_record_audit` + `officer_a` 0.22% | Consequences that end their stories. |
| `share_credit` | You are credited for what others did: keep the credit, or pass it on | `block_party`, `national_day_award`, `pofma_vindicated` | 2.2% → 0.0% | `national_day_award` + `pofma_vindicated` 1.8%, `block_party` + `national_day_award` 0.28%, `block_party` + `pofma_vindicated` 0.26% | Consequences that end their stories, and the Pingat. `model_ward` is kept apart (below). |
| `floor_question` | An awkward question from the floor at a public dialogue: answer it, or take it offline | `moe_psle`, `mom_retirement` | 0.0% → 0.0% | never together | Ministry decks: meet only after a reshuffle into the other ministry. |
| `ceiling_ask` | Ask to be told your ceiling | `cep_discovery`, ~~`the_appraisal_talk`~~ (rewritten) | 16.4% → 0.0% | `cep_discovery` + `the_appraisal_talk` 16.4% | Resolved by rewriting the appraisal's ceiling question to "where you stand" (two of its versions already asked that). |
| `saucer_post_early` | The flying saucer's first deleted post from the Minister: how you handle its fallout at work | `strange_saucer_tax`, `strange_saucer_kopi` | new | never together | Added with the flying saucer (strange.json). Not two decisions found alike: the group is how the chain shows one early post of two. The meeting with the Minister schedules both, the tax post at 50% first; whichever fires claims the group and the other is struck. The kopi post reads on either ladder, so the group never waits. |
| `saucer_post_late` | The flying saucer's later deleted post: the clarification, or the journalist's call | `strange_saucer_visitors` (and `_pol`), `strange_saucer_sky` (and `_pol`) | new | never together | As above: each scheduled at 30%, so about half the careers that meet the Minister see a second post, and none sees three. Each card has a politics version in the group. |

## Cards that repeat (series)

Every repeatable card is now a series (`series` with `spend`, `noMontage`, a `stance` on each choice). A series is shown in full `full` times a career; with `full: 2` its second showing is a scene of its own that names the habit, puts it first and asks whether to keep it (`again.keep` / `again.change`); every later draw passes as a year with a Meanwhile line for the habit, and once those lines are spent the card is not drawn again. Sibling cards that posed one decision share a series. Today, each of these cards came back in full every fourth draw while it had a scene left, posing its question as new.

| Series | The decision | Cards | `full` | Shown it as new twice or more, today → after | Second showing (the habit question), after |
| --- | --- | --- | --- | --- | --- |
| `effort` | This year's work: substance, visibility or rest | `the_work`, `the_quiet_year` | 2 | 68.5% → 0.0% | 84.4% |
| `footing` | How you go about getting on: the hard work first, the right people, or your head down | `opening_grad` and `opening_scholar` (opens), `new_ro` | 2 | 13.2% → 0.0% | 23.7% |
| `house` | (the_pq's own scenes) a Parliamentary Question: answer straight, read the brief, or write | `the_pq` | 2 | 1.3% → 0.0% | 17.0% |
| `work_life` | Work or life: finish it tonight (cancel the leave), or go home (go) | `late_night`, `approved_leave` | 2 | 24.8% → 0.0% | 36.1% |
| `appraisal` | (its own scenes) the appraisal conversation: ask where you stand, be more visible, or ask what needs doing | `the_appraisal_talk` | 2 | 6.6% → 0.0% | 40.8% |
| `mps_night` | (its own scenes) Meet-the-People night: everyone, the hardest cases, or the speech | `the_mps_night` | 1 | 2.8% → 0.0% | - |
| `walkabout` | (its own scenes) the walkabout: hear them out, keep moving, or call back | `the_walkabout` | 1 | 1.4% → 0.0% | - |
| `townhall` | (its own scenes) the townhall's awkward question: face it, or deflect | `the_townhall` | 1 | 0.79% → 0.0% | - |
| `budget_round` | (its own scenes) the budget bid: big, exact, or absorb | `budget_round` | 1 | 0.0% → 0.0% | - |

How each repeatable card is handled:
- `the_work` and `the_quiet_year`: one series, `effort` (substance, visibility, rest), shown in full twice. Its second showing asks, on whichever card comes second, whether to keep the habit, and is written about the habit, not the card it was set on.
- `the_pq`: series `house`, shown in full twice; the second showing is "The Parliamentary Question, Again". It is also in `house_brief`, so the other cards that pose its decision do not come.
- `late_night`: series `work_life` with `approved_leave` (work or life), shown in full twice.
- `the_appraisal_talk`: series `appraisal`, shown in full twice.
- `the_mps_night`, `the_walkabout`, `the_townhall`, `budget_round`: series of one, `full: 1`. They came back in full in under 3% of careers today, so they pass from their second draw on, and need no second-showing scene.
- `new_ro` (a once card) closes the `footing` series that the graduate's and the scholar's first cards open: for those careers it is the habit question.

## Rewrites

A weak duplicate became a different decision where excluding it would have starved its group's best card or emptied an origin's start. Text and, where the decision changed, effects; witness reactions were checked and changed only where they no longer made sense.

### `opening_scholar`

Why: the opener posed the bad-number decision (bad_number); it now opens the footing series.

- `body`: "You came back from your overseas degree four months ago and were posted to the {ministry} as an Assistant Director. Your reporting officer is {senior}, {senior.aTitle}. Today {senior} hands you your first real job: a paper for the Minister, due in two weeks, on a scheme whose numbers are bad. A scholar's first paper gets read closely." → "You came back from your overseas degree four months ago and were posted to the {ministry} as an Assistant Director. Your reporting officer is {senior}, {senior.aTitle}. Today {senior} hands you your first real job: a paper for the Minister, due in two weeks, on why a scheme isn't reaching the people it was built for. The officers who run its counters have done it for years, and nobody has asked them. A scholar's first paper gets read closely."
- `choices.0.text`: "Write that the scheme isn't working, and show the numbers." → "Spend the first week at the counters."
- `choices.0.outcome`: "Your paper says plainly that the scheme isn't working, and shows why. {senior} sends it up unchanged. The Minister's office asks who wrote it: half of them want to meet you, and half want to know why nobody stopped you." → "You spend five mornings behind the counters, and the paper says what the counter staff have known for years, with numbers. {senior} sends it up unchanged. The Minister's office asks who wrote it, and why it reads as if the writer had been there."
- `choices.0.effects`: `{"integrity": 5, "competence": 4, "standing": -3}` → `{"competence": 6, "integrity": 2, "standing": -3}`
- `choices.1.text`: "Write it the way the Minister's office will want to read it." → "Ask a scholar from your year, now in the Minister's office, what the Minister wants."
- `choices.1.outcome`: "Your paper says the scheme is "gaining traction", which is true of its two good months. It goes up on time and comes back with a tick. {senior} says nothing, and doesn't give you a difficult file again for a year." → "Your friend in the Minister's office tells you what the Minister likes to read, and in what order. The paper lands well and comes back with a tick. {senior}, who wasn't asked, notices that nobody asked."
- `choices.1.effects`: `{"standing": 5, "integrity": -4}` → `{"standing": 5, "competence": 1, "integrity": -2}`
- `choices.2.text`: "Ask {senior} what the Minister already thinks, first." → "Write it from the files, and hand it in early."
- `choices.2.outcome`: "{senior} tells you what the Minister thinks, and which numbers to lead with. The paper lands well. You've learned how papers get written here, and you're not sure you like it." → "The files are thorough, and so is your paper: correct, and a day early. It goes up with a tick and comes back with no comment, which for a first paper is a comment."
- `choices.2.effects`: `{"standing": 3, "competence": 2, "integrity": -2}` → `{"competence": 3, "standing": 2, "reputation": -1}`
- `witnesses.by.ministersOffice.react`: `[-3, -2, 2]` → `[-2, 2, 1]`

### `cny_lohei`

Why: candour_up: the same decision as station_four and postit_workshop.

- `body`: "It's the division's Chinese New Year lunch, and the Permanent Secretary is at your table. After eleven minutes of lo hei, tossing the yusheng salad as high as chopsticks allow and shouting good wishes, the Permanent Secretary turns to you and asks, properly: "So, {player.given}, what do you actually think we're getting wrong?"" → "It's the division's Chinese New Year lunch, and the Permanent Secretary is at your table. After eleven minutes of lo hei, tossing the yusheng salad as high as chopsticks allow and shouting wishes for abundance, the Permanent Secretary turns to you and asks, properly: "So, {player.given}, if your division had to stop one thing this year, what should it be?" The first project that comes to mind is your own."
- `choices.0.text`: "Tell the Permanent Secretary, specifically, with an example." → "Your own project. Say why."
- `choices.0.outcome`: "You have about ninety seconds, and you use all of them. Halfway through, the Permanent Secretary stops eating to listen, and at the end says, "Say that again on Thursday, to the committee." The people who decide promotions will be in that room." → "You have about ninety seconds, and you spend all of them on why your own work should stop. The Permanent Secretary stops eating to listen, and at the end says, "Say that again on Thursday, to the committee." The people who decide promotions will be in that room."
- `choices.0.effects`: `{"reputation": 8, "competence": 7, "cep": 2, "standing": -3}` → `{"reputation": 8, "competence": 6, "cep": 2, "standing": -4}`
- `choices.1.text`: "Say something safe about communications." → "Another division's project. Say why."
- `choices.1.outcome`: ""Mm," says the Permanent Secretary, and turns to the person on the other side. That's the end of it, and you both know it." → "It's a reasonable answer, well argued, and the Permanent Secretary nods. The other division's project is reviewed in March. Its director never finds out who suggested it, and you never ask whether yours would have been next."
- `choices.1.effects`: `{"standing": 4, "competence": -2}` → `{"standing": 5, "competence": 2, "integrity": -5}`
- `choices.2.text`: "Ask the Permanent Secretary the same question." → "Say that everything the division does matters."
- `choices.2.outcome`: "The answer is long, thoughtful and very good, and you learn a great deal. You've told the Permanent Secretary nothing about yourself, though, and that was what the question was for." → ""Mm," says the Permanent Secretary, and turns to the person on the other side. That's the end of it, and you both know it."
- `choices.2.effects`: `{"standing": 6, "reputation": -2}` → `{"standing": 4, "competence": -2}`

### `farewell_drinks`

Why: hard_job: shared 'ask for the hardest posting' with reshuffle and first_cabinet.

- `body`: "Your friend in HR, the one who explained your CEP to you over lunch years ago, is leaving the service. At the farewell drinks, on a second glass, your friend tells you how yours gets reviewed: every year, by people who mostly read your last two postings. The hard postings, your friend says, get read twice." → "Your friend in HR, the one who explained your CEP to you over lunch years ago, is leaving the service. At the farewell drinks, on a second glass, your friend tells you how yours gets reviewed: every year, by people who mostly read your last two postings, and who like officers who have run something, not just written about it. So far, yours have all been papers."
- `choices.0.text`: "Ask for the hardest posting going." → "Ask to run something at your next posting."
- `choices.0.outcome`: "You ask the next morning. HR says it will note your interest, and does: your next posting is a difficult one, and it gets read twice." → "You ask the next morning. HR says it will note your interest, and does: your next posting comes with nine officers, a hotline and a backlog, and it gets read twice."

### `first_cabinet`

Why: hard_job: shared 'ask for the hard portfolio nobody wants' with reshuffle.

- `choices.1.text`: "Ask for the hard portfolio nobody wants." → "Ask, at the table, for the portfolio you were promised."
- `choices.1.outcome`: "The Prime Minister had been hoping someone would ask, and agrees before you finish the sentence." → "The Prime Minister gives it to you before the next item on the agenda, and the whole table watches a debt being paid in full. It's a good portfolio. Everyone will remember how you got it."
- `choices.1.effects`: `{"reputation": 6, "competence": 4, "standing": -2}` → `{"competence": 4, "reputation": 3, "standing": -2, "integrity": -2}`

### `the_townhall`

Why: bad_number: the survey version asked which number to put first.

- `variants.1`: `{"title": "The Survey Results", "body": "Your ministry's staff survey is back, and you are presenting it at the townhall. Most numbers went up. One fell a long way: whether officers feel safe raising concerns. Four hundred of them will see which number you put first.", "choices": [{"text": "Put that number on the first slide.", "outcome": "The first slide is the bad number, in large type, and you ` → `{"title": "The Extra Floor", "body": "You are hosting your ministry's townhall: four hundred officers and a roving microphone. An officer asks why headquarters added a floor of staff this year, while every division was told to absorb its work. It's true, the room knows it, and everyone is waiting to see what you do with it.", "choices": [{"text": "Say it's true, and say why.", "outcome": "You say `

### `the_appraisal_talk`

Why: ceiling_ask: the same ask as cep_discovery.

- `choices.0.text`: "Ask directly what your ceiling is." → "Ask directly where you stand."
- `choices.0.outcome`: ""Ceilings aren't really something we discuss," {senior} says, kindly. It's a complete answer." → ""Rankings aren't really something we discuss," {senior} says, kindly. It's a complete answer."
- `variants.2.choices.0.text`: "Ask, while there's time, where your ceiling is." → "Ask, while there's time, where you stand."
- `variants.3.choices.0.text`: "Ask what the comment means for your ceiling." → "Ask what the comment means for your grade."
- `variants.3.choices.0.outcome`: "{senior} says it's "a development point, not a ceiling point", and then that ceilings aren't discussed. Both halves are true, and only one of them was an answer." → "{senior} says it's "a development point, not a grading point", and then that grades aren't discussed before the ranking meeting. Both halves are true, and only one of them was an answer."
- `montageLines.0`: `["At your appraisal you ask how high you can rise, and are told it's \"not a helpful way to think about it\", the most precise answer yet.", "Your appraisal: forty minutes, six competency areas, and one question from you, about how far you can rise, that nobody writes down.", "At your appraisal you ask how far you can go, and are offered a coaching session on curiosity.", "You ask at your appraisa` → `["At your appraisal you ask where you stand, and are told it's \"not a helpful way to think about it\", the most precise answer yet.", "Your appraisal: forty minutes, six competency areas, and one question from you, about where you stand, that nobody writes down.", "At your appraisal you ask where you stand, and are offered a coaching session on curiosity.", "You ask at your appraisal where you st`

### `the_ask`

Why: jargon: 'ranking' before its entry point.

- `parts.asker.5.yes`: "{senior} remembers it at your next ranking meeting, the only room where it counts." → "{senior} remembers it in the meeting that decides your grade, the only room where it counts."

### `bench_letters`

Why: the volunteer could share the player's surname (Ang).

- `parts.writer.0.text`: "Mr Ang, twenty-six years at the folding table" → "Mr Boey, twenty-six years at the folding table"
- `parts.writer.0.short`: "Mr Ang" → "Mr Boey"

### `ps_successor`

Why: fills years the change emptied.

- New card: "The Box Marked Successor".

Second-showing scenes were written for every series with `full: 2` (19 scenes on `the_work`, `the_quiet_year`, `new_ro`, `the_pq`, `late_night`, `approved_leave` and `the_appraisal_talk`), and four Meanwhile lines or more for each habit `approved_leave` can pass on. These add decisions, so they are not listed as rewrites.

## Likenesses weighed and kept apart

Close matches count, so each of these was weighed. They stay apart because the decision differs, because the cards are a consequence and its cause, or because the card is structural. Shares are careers shown both cards, today → after.

- `forum_letter` + `pofma_moment` (7.3% → 7.0%): An accurate letter (admit it, or the standard reply) against a post that is partly wrong (correct the errors, or concede the point). The letter has no error to correct, and its third option is a misuse of records.
- `dialogue_session` + `inconvenient_figure` (4.5% → 4.1%): Whose frame the public's feedback goes in (add a pillar, spread it, publish it raw) against a bad performance number. Judged different; the closest call in the audit.
- `the_townhall` + `the_walkabout` (27.3% → 28.6%): Facing a rude question in front of your officers against how much time one voter gets.
- `bto_queue` + `town_council` (9.8% → 11.1%): A friend's early word for your own flat against a waived tender for residents' lift.
- `pm_cabinet` + `reshuffle` (15.2% → 14.8%): As Prime Minister, whom to give the hardest ministry against asking for it yourself.
- `secondment` + `reshuffle` (5.0% → 5.2%): Fix, coast or refuse a troubled board against the reshuffle's ask.
- `reorg` + `succession` (4.9% → 4.7%): The succession (and `rival_first`, its batchmate version) is the career's climax: kept. `reorg`, `leadership_programme` and `rival_posting` are one group among themselves.
- `pilot_national` + `succession` (4.2% → 3.4%): The Pilot's rollout (run it, or hand it over) is the bridge to its audit; striking it would let a flattered number escape its consequence.
- `bench_whip` + `maiden_speech` (5.8% → 5.3%): The maiden speech says what kind of Member you will be (every Member's first card); the Whip's text is one vote.
- `model_ward` + `pofma_vindicated` (11.9% → 9.5%): The party's paper credits your walkabouts for a swing: the decision is what to teach new candidates, the paper's story or what actually worked; sending them to your volunteers is one option of three. It was in `share_credit` in a first draft, which struck it in a quarter of the careers that had earned it with an election swing; on a second read its decision is honesty about what worked, not credit.
- `the_ribbon` + `model_ward` (3.5% → 4.1%): The ribbon is about how long you stay; handing over the scissors is one option of three.
- `the_appraisal_talk` + `the_work` (59.7% → 57.6%): Both have a "be seen" option; the appraisal is what you ask your reporting officer for, the work is how you do the year's project.
- `opening_grad` + `the_work` (31.8% → 29.8%): Getting on (harder work, the right people, head down) against how you do a project; `opening_grad` and `new_ro` are their own series, `footing`.
- `cep_discovery` + `the_appraisal_talk` (24.7% → 24.0%): Kept apart by the rewrite: the appraisal now asks where you stand this year, not for the ceiling.
- `second_look` + `the_appraisal_talk` (14.6% → 14.1%): Making your own case to a board against asking your reporting officer.
- `the_counter` + `station_four` (17.0% → 11.7%): Telling your team why a design will fail (the poly's opener) against answering the Minister about your own exhibit.
- `cos_speech` + `station_four` (8.1% → 4.6%): Telling the Minister early that nothing is ready against "not yet, Minister" at a visit. Loose: one is planning, one is a question on the spot.
- `whistle_spreadsheet` + `whistle_return` (5.0% → 5.5%): A mirror by design: the junior you once dealt with asks what you would do now. Same for `bond_bank` + `bond_mentor` and the vetting + `younger_officer` (the advice cards).
- `strange_hansard` + `the_pq` (1.4% → 1.3%): A Strange Year: Hansard prints what you meant.
- `budget_round` + `strange_loop` (0.51% → 0.56%): A Strange Year parodies the budget meeting; its choices are about the loop.
- `internet_laptop` + `town_council` (5.8% → 6.7%): Breaking a rule for speed, at the bottom and at the Town Council: different stakes and different people.
- `ps_successor` + `pm_successor` (0.0% → 0.07%): The new card: merit against legacy in choosing a successor. The Prime Minister's card is about the process (let them choose, name one, keep it open).
- `cny_lohei` + `budget_round` (8.0% → 8.1%): The rewritten lunch: what to stop, against how much to bid.
- **Consequences that come back** (`come_clean`): `figure_resurfaces`, `tender_questions`, `leak_resurfaces`, `two_names`, `raw_data`, `citizens_panel`, `pilot_audit`, `uturn_statement` and others all ask "own up, or keep covering?" Each is the return of a different compromise the player made, named on the card (rule 3.4), and striking one would let that compromise go unpunished (rule 5.10). Today 9.6% of careers meet two; kept. This is the judgement call most worth a second look.
- **Never in one career**: `succession` / `rival_first`, `endgame_last_service` / `endgame_last_politics`, `endgame_renewal` / `endgame_stay`, the Strange Year cards (one a career), `headhunter_political` / `headhunter_political_grc` (one per seat type).

## Balance and fullness

**`node test/sim.js regress 400`** (PM rate, 95% CI; main → branch):

| Bot | scholar | grad | poly |
| --- | --- | --- | --- |
| first-timer | 5% [3.3-7.6] → 4.3% [2.7-6.7] | 0.5% [0.1-1.8] → 0.3% [0-1.4] | 0.5% [0.1-1.8] → 0% [0-1] |
| knows the win | 48.5% [43.6-53.4] → 51.3% [46.4-56.1] | 42.8% [38-47.6] → 37.5% [32.9-42.3] | 21% [17.3-25.3] → 20.3% [16.6-24.5] |
| first-timer + batchmate | 1.5% [0.7-3.2] → 2% [1-3.9] | 0% [0-1] → 0% [0-1] | 0% [0-1] → 0% [0-1] |
| knows the win + batchmate | 36.5% [31.9-41.3] → 34.3% [29.8-39] | 24.5% [20.5-28.9] → 23% [19.1-27.4] | 11% [8.3-14.4] → 12.8% [9.8-16.4] |

Per act (first-timer | knows the win): taps per career, years passed by themselves, repeated cards (share of taps on a card already shown in full), dead turns; main → branch, 400 runs:

| Act | first-timer | knows the win |
| --- | --- | --- |
| I | 22.07 → 21.34 taps; 7.05 → 8.59 passed; 5.6% → 6.2% repeated; 0.01 → 0 dead | 14.27 → 14.83 taps; 1.7 → 1.4 passed; 0.6% → 4.9% repeated; 0 → 0 dead |
| II | 1.12 → 1.04 taps; 0.11 → 0.11 passed; 0% → 0% repeated; 0 → 0 dead | 2.99 → 2.99 taps; 0 → 0 passed; 0% → 0% repeated; 0 → 0 dead |
| III | 2.98 → 2.86 taps; 1.27 → 1.31 passed; 2.2% → 4.6% repeated; 0 → 0 dead | 14.4 → 14.1 taps; 7.09 → 7.04 passed; 0.9% → 2.7% repeated; 0 → 0 dead |

**`node test/sim.js regress 1200`** (PM rate, 95% CI; main → branch):

| Bot | scholar | grad | poly |
| --- | --- | --- | --- |
| first-timer | 4% [3-5.3] → 5.1% [4-6.5] | 0.2% [0-0.6] → 0.3% [0.1-0.7] | 0.2% [0-0.6] → 0.1% [0-0.5] |
| knows the win | 46.7% [43.9-49.5] → 49.2% [46.3-52] | 42.1% [39.3-44.9] → 38.7% [36-41.5] | 20.1% [17.9-22.4] → 20.1% [17.9-22.4] |
| first-timer + batchmate | 2% [1.3-3] → 2.9% [2.1-4] | 0.2% [0-0.6] → 0.1% [0-0.5] | 0% [0-0.3] → 0% [0-0.3] |
| knows the win + batchmate | 32.6% [30-35.3] → 33.4% [30.8-36.1] | 25.2% [22.8-27.7] → 22.8% [20.5-25.2] | 11.9% [10.2-13.9] → 11% [9.4-12.9] |

Per act (first-timer | knows the win): taps per career, years passed by themselves, repeated cards (share of taps on a card already shown in full), dead turns; main → branch, 1200 runs:

| Act | first-timer | knows the win |
| --- | --- | --- |
| I | 22.19 → 21.34 taps; 6.99 → 8.48 passed; 5.4% → 6.2% repeated; 0.01 → 0 dead | 14.18 → 14.89 taps; 1.67 → 1.42 passed; 0.5% → 4.9% repeated; 0 → 0 dead |
| II | 1.13 → 1.04 taps; 0.1 → 0.1 passed; 0% → 0% repeated; 0 → 0 dead | 2.99 → 2.99 taps; 0 → 0 passed; 0% → 0% repeated; 0 → 0 dead |
| III | 2.96 → 2.89 taps; 1.24 → 1.31 passed; 2.9% → 4.9% repeated; 0 → 0 dead | 14.37 → 14.01 taps; 7.2 → 7.06 passed; 0.9% → 2.6% repeated; 0 → 0 dead |

Fullness, from the 7,200 audit careers (main → branch): 29.11 → 28.76 taps per career; 8.56 → 9.19 years that passed by themselves; careers with a run of five or more such years in a row 16.0% → 27.6% (ten or more: 0.5% → 9.2%). At Permanent Secretary, the grade careers stay in longest, 4.9 → 4.68 taps and 3.86 → 4.61 passed years per career that reaches it. Those years used to be filled by the same few cards coming back in full; one new card (`ps_successor`) fills part of the gap.

On fresh seeds (`i*11+5`, 1,500 graduate careers, knows the win, alone): main 38.8%, branch 37.5%. The regress seeds show a larger dip for that one cell (42.1% → 38.7% at 1,200); the intervals overlap at both sizes, and the regression rule passes.

"Repeated" counts a tap on a card already shown in full. It rises because a series' second showing is the same card: it now asks whether to keep the habit, where before the card came back every fourth draw to ask its first question again. The share of careers that meet a decision twice is the measure of the change (94% → 0%).

The cost is long stays. A career that waits years in one grade (a Permanent Secretary who does not go to tea, an officer still on the first rungs at forty) used to be filled by the same cards coming back in full; now its years pass by themselves, with a Meanwhile line each (28 more lines were written for the two cards such a stay leans on). New cards for those stays are the remedy, written against this audit: the content plan's unwritten "top of the service" pack is where they belong. Three candidates written for this change were dropped because each came too close to a group here (an underspend card to the budget bid, a union representative to Meet-the-People duty, a records purge to the minutes no one wants).

## Appendix: every card's decision signature

`G`: the groups and series it is in after the change. Rewritten and new cards give the signature as it now reads.

| Card | Decision signature | G |
| --- | --- | --- |
| `inconvenient_figure` | Your scheme's usage figure is bad and your senior wants it shown as a range: the number, the range, or the number with a recovery plan (honesty vs flattery about a bad number, upwards). | bad_number |
| `consultant_report` | Consultants sell your own ignored idea back to the ministry: let them have it, circulate your old minute, or question their data (reclaim credit vs keep the peace). | credit_taken |
| `postit_workshop` | Transformation offsite post-its: write what everyone thinks, produce an acronym, or volunteer for the implementation plan (candour vs buzzwords vs taking on the work). | candour_up |
| `cep_discovery` | A friend in HR has seen your secret ceiling estimate: ask what it says, or let it go (knowing vs propriety). | ceiling_ask |
| `leadership_programme` | One nomination for the leadership programme: yourself, the expected scholar, or the quiet officer who does the work (put yourself forward vs defer vs fairness). | one_slot |
| `the_crisis` | An oil spill that isn't your division's: write the statement, run the ops room, or stay at your desk (visible help vs hard help vs staying in your lane). |  |
| `forum_letter` | An angry, accurate Forum letter about your scheme: the standard reply, admit it and say what changes, or look the writer up (candour vs boilerplate vs misuse of records). |  |
| `overseas_posting` | A three-year overseas posting against an elderly mother at home: take it, turn it down, or defer (career vs family). |  |
| `the_tender` | You chair a tender where the better bid is an old colleague's firm: award it, recuse yourself, or give it to the other bidder (declare a connection vs act on merit vs play safe). | declare |
| `mps_duty` | A friend asks a civil servant to help at an MP's Meet-the-People Session: every week, a few times to be seen, or decline to stay neutral (service vs visibility vs neutrality). |  |
| `the_scholar` | The scholar you supervise brings a bad first paper: say so and teach, clear it and let them learn the hard way, or rewrite it yourself (teach vs hard way vs do it yourself). | mentor_hardway |
| `the_leak` | An inquiry into a leaked paper you were sent: cooperate, quietly find the leaker, or (it was you) say nothing (loyalty vs curiosity vs conscience). |  |
| `national_day_award` | A medal for a scheme your team delivered: accept it, or accept and ask for the team to be recognised (share credit you were given). | share_credit |
| `cny_lohei` | Rewritten: the Permanent Secretary asks at lunch what your division should stop doing: your own project, another division's, or nothing (give up your own turf vs protect it). |  |
| `the_committee` | You minute a deadlocked inter-ministry committee: write a paper that forces a decision, keep minuting, or tell a journalist (force it vs stay safe vs leak). |  |
| `bto_queue` | Your fourth flat ballot: ballot again, ask a friend at HDB for early word, or buy resale (fairness vs using a connection). |  |
| `cos_speech` | The Minister wants something new for the Committee of Supply speech and nothing is ready: offer an unfinished pilot, rebrand an old scheme, or say there is nothing (oversell vs dress up vs hold back). | announce |
| `reorg` | A reorganisation: one director post between you and a peer, and your officers need postings: fight for your people, take the post, or run the transition (team vs self). | one_slot |
| `dialogue_session` | A national conversation's feedback fits none of the Minister's three pillars: add a fourth, spread it across the three, or publish it raw (report findings straight vs fit them to the frame). |  |
| `new_ro` | A new reporting officer: make yourself indispensable on the hardest file, be useful to their people, or keep your head down (substance vs networking vs lying low). | series footing |
| `secondment` | A secondment to a statutory board in trouble: go and fix it, go and coast, or refuse and stay visible (the hard posting vs the visible one). |  |
| `grassroots_invite` | A party adviser hints you might stand one day: say you've thought about it, or laugh it off (signal interest vs stay out). |  |
| `figure_resurfaces` | Follow-up of the figure: auditors ask for the original number: send it and explain the slide, or say the raw file wasn't kept (come clean vs cover up). |  |
| `tender_questions` | Follow-up of the tender: a PQ annex lists your award: let your reasons stand, or ask a friend to leave yours out (stand on the record vs cover up). |  |
| `leak_resurfaces` | Follow-up of a leak: a reporter rebuilds the story: decline to comment, or tell your superior first (cover vs confess). |  |
| `ally_returns` | Follow-up of the nomination (one card, alternates by rank): the officer you once put forward can help you now: let them decide, or say first that they owe you nothing (accept a returned favour vs clear the debt). |  |
| `ally_returns_junior` | Follow-up of the nomination (one card, alternates by rank): the officer you once put forward can help you now: let them decide, or say first that they owe you nothing (accept a returned favour vs clear the debt). |  |
| `ally_returns_ds` | Follow-up of the nomination (one card, alternates by rank): the officer you once put forward can help you now: let them decide, or say first that they owe you nothing (accept a returned favour vs clear the debt). |  |
| `ally_returns_ps` | Follow-up of the nomination (one card, alternates by rank): the officer you once put forward can help you now: let them decide, or say first that they owe you nothing (accept a returned favour vs clear the debt). |  |
| `ally_returns_pol` | Follow-up of the nomination (one card, alternates by rank): the officer you once put forward can help you now: let them decide, or say first that they owe you nothing (accept a returned favour vs clear the debt). |  |
| `scholar_returns` | Follow-up of the scholar (one card, alternates by rank): the scholar you taught thanks you: say it was worth it, or say the paper was still bad (warmth vs candour). |  |
| `scholar_returns_peer` | Follow-up of the scholar (one card, alternates by rank): the scholar you taught thanks you: say it was worth it, or say the paper was still bad (warmth vs candour). |  |
| `scholar_returns_ps` | Follow-up of the scholar (one card, alternates by rank): the scholar you taught thanks you: say it was worth it, or say the paper was still bad (warmth vs candour). |  |
| `scholar_returns_pol` | Follow-up of the scholar (one card, alternates by rank): the scholar you taught thanks you: say it was worth it, or say the paper was still bad (warmth vs candour). |  |
| `tea_session` | The party invites you to tea: go, or decline (politics vs the service). |  |
| `the_vetting` | The party's background check: disclose everything, or answer only what is asked (candour vs caution about your own file). |  |
| `the_election` | The party fields you: a GRC team or a single seat (shared vs own risk and credit). |  |
| `maiden_speech` | Your maiden speech: about your ward, about the one thing you believe, or praising a policy you doubted (safe vs conviction vs loyalty). |  |
| `town_council` | A broken lift: tender properly, waive the tender for a grassroots friend's contractor, or patch it while the tender runs (process vs speed vs compromise). |  |
| `the_bonus_reveal` | Series opener (indicators, PR #45): the National Bonus: fund the lowest incomes, fund GDP, or ask whether ministers should be paid on targets they move. |  |
| `pofma_moment` | A viral post is wrong in two places and right in one: issue a correction direction on the two, or publicly concede the third (correct the errors vs concede the point). | viral_post |
| `reshuffle` | The Prime Minister asks where you'd like to go in a reshuffle: the hard ministry nobody wants, or stay (ambition vs comfort). | hard_job |
| `succession` | The succession is down to you and one other: put yourself forward, or back the other for a senior portfolio (the top job vs the deal). |  |
| `the_work` | This year's project, under the ministry's name: do it well, do it and be seen, or coast (substance vs visibility vs rest). | series effort |
| `the_appraisal_talk` | The appraisal conversation, told to be more visible: ask where you stand this year, agree to be visible, or ask what needs doing (no longer asks for your ceiling). | series appraisal |
| `late_night` | Late, with a paper due and a promise at home: finish it tonight, or go and send it in the morning (work vs life). | series work_life |
| `budget_round` | Budget season with no growth: bid big, bid exactly what you need, or absorb the work (ambition vs honesty vs self-denial). | series budget_round |
| `the_mps_night` | Your weekly Meet-the-People Session runs long: see every resident, write the hardest cases yourself, or leave to finish your speech (presence vs depth vs Parliament). | series mps_night |
| `the_walkabout` | A walkabout, and one voter with a lot to say: hear them out on camera, keep moving, or take their number and call tonight (presence vs schedule vs off-camera follow-up). | series walkabout |
| `the_pq` | A Parliamentary Question with an unflattering honest answer: answer it straight, read the officials' brief, or promise a full written answer (concede in the House vs read the brief). | house_brief, series house |
| `the_townhall` | The townhall's awkward question: take it on, or deflect (its survey version, which asked which number to put first, is now a question about headquarters' extra floor). | series townhall |
| `the_quiet_year` | A year without incident: fix something nobody asked for, build your network, or rest (substance vs visibility vs rest). | series effort |
| `the_counter` | Poly opener: the only ex-counter officer on a redesign team: say why it will fail, or let the pilot show them (speak up vs wait). |  |
| `the_night_degree` | Poly: the last paper of a night degree in the busiest month: sit it, or defer (yourself vs work). |  |
| `old_colleague` | Poly: an old counter colleague now chairs the committees that notice people: speak to them, or leave it (use a connection vs pride). |  |
| `second_look` | A promotion board takes a second look at your ceiling: make your case in writing, or let the record speak (self-advocacy vs modesty). |  |
| `figure_vindicated` | Follow-up of the figure: a review cites your honest number and asks who presented it: say it was you, or say it was a team effort (claim it vs share it). | own_up |
| `minute_vindicated` | Follow-up of the report: the consultants' version failed as your paragraph four said: let it speak, or offer to fix it (vindication vs repair). |  |
| `cos_vindicated` | Follow-up of Committee of Supply: you were right to say nothing was ready: bring the pilot now, or let the Minister draw the conclusion (press the advantage vs restraint). |  |
| `dialogue_vindicated` | Follow-up of the engagement exercise: a think tank uses your raw feedback: reply with one line, or write the follow-up (restraint vs more work). |  |
| `committee_vindicated` | Follow-up of the committee: your decision paper is adopted with your name in the footer: leave it, or take it off (claim it vs anonymity). | own_up |
| `pofma_vindicated` | Follow-up of the correction: the scheme is amended on the point you conceded, and a reporter asks: take it on the record, or credit the post's author (claim it vs share it). | share_credit |
| `speech_vindicated` | Follow-up of a frank speech: a newer Member quotes you from Hansard: send them a note, or say nothing (acknowledge vs modesty). |  |
| `bonus_vindicated` | Follow-up of the bonus question: a salary review adopts your question, unattributed: submit under your name, or let it work unnamed (claim it vs anonymity). | own_up |
| `secondment_verdict` | Follow-up of the secondment: the board is fixed: ask to come back, or stay to finish it (visibility vs completion). |  |
| `re_election` | A general election in your seat: campaign on the record, or walk every block (record vs legwork). |  |
| `the_indicators` | Series (indicators, PR #45): the Budget plan in a strong year. |  |
| `the_indicators_downturn` | Series (indicators, PR #45): the Budget plan in a downturn. |  |
| `the_indicators_election` | Series (indicators, PR #45): the Budget plan before an election. |  |
| `headhunter_early` | A bank's recruiter: take the money and resign, mention it to HR, or decline (leave for private-sector money). | private_offer |
| `headhunter_mid` | A consultancy wants you near the top: take it, decline and say why, or decline and keep the letter (leave for private-sector money). | private_offer |
| `headhunter_political` | A conglomerate's board seat after politics (single seat): leave at the next election, or decline (leave for private-sector money). | private_offer |
| `headhunter_political_grc` | The same board seat for a GRC Member (the two are one card by seat type) (leave for private-sector money). | private_offer |
| `citizens_panel` | Follow-up of the Forum letter: the writer you looked up sits on a citizens' panel: tell him, thank him publicly, or stay away (confess vs charm vs avoid). |  |
| `promotion_board` | Follow-up of the reorganisation: an officer you protected sits on your promotion board: ask HR whether to declare it, or say nothing (declare a connection vs not). | declare |
| `small_favour` | Follow-up of the flat: the friend who tipped you off asks a favour for a nephew: make sure someone looks, forward it declaring the link, or refuse (repay a favour vs propriety). |  |
| `block_party` | Follow-up of Meet-the-People: a resident tells your old appeal story to forty neighbours: let her tell it, or say her case was good (accept credit vs deflect it). | share_credit |
| `budget_committee` | Follow-up of the reorganisation: the peer whose post you took chairs your budget committee: apologise, bid on merit, or work the committee (amends vs merit vs manoeuvre). |  |
| `farewell_drinks` | Rewritten: your HR friend says the panel likes officers who have run something: ask to run something at your next posting, or just thank them (a change of track vs gratitude). |  |
| `interview_panel` | Follow-up of the leak: the peer you know leaked sits on your interview panel: compete on the record, or let them know you know (fair vs leverage). |  |
| `two_names` | Follow-up of the rebranded scheme: a reporter asks which name to use: say both are right, or admit it was renamed (cover vs candour). |  |
| `raw_data` | Follow-up of the smoothed feedback: a think tank asks for the raw data: release it, or resend the report (come clean vs cover). |  |
| `officer_a` | Follow-up of the recusal: your memo is taught anonymously as Officer A: tell them it was you, or finish your lunch (claim it vs anonymity). | own_up |
| `lanterns` | Follow-up of the adviser: an invitation to meet the MP at a lantern festival: go and stack chairs, or plead a deadline (signal interest vs work). |  |
| `first_cabinet` | Rewritten option: the Prime Minister you backed owes you: ask for nothing, or ask, at the table, for the portfolio you were promised (restraint vs collecting the debt). |  |
| `other_life` | Follow-up of declining tea: someone who went is a Minister thanking your work on TV: send congratulations, or go back to the file (grace vs getting on). |  |
| `younger_officer` | Follow-up of the vetting: a younger officer invited to tea asks you: say go and keep the folder thin, or tell them about your folder (advise the next one: steer vs tell your story). |  |
| `model_ward` | Follow-up of the swing: the party credits your walkabouts and wants you to teach new candidates: teach the walkabout, teach what worked, or send them to your volunteers (accept the credit vs give it). |  |
| `improvement_plan` | Series (plan): an improvement plan after a D: sign and meet every target, ask for a transfer, or dispute the D. |  |
| `whip_word` | Series (plan): the Whip's word after a D, the politics alternate of the improvement plan. |  |
| `moh_beds` | MOH: a paper on transitional care for a Minister who wants something to announce: beds with the nurses costed, beds without, or discharge planning instead (complete vs announceable vs alternative). | announce |
| `moh_premiums` | MOH: how to present a premium increase: the full number with subsidies beside it, phased so no year looks large, or ask the actuaries first (present a bad number straight vs softened). | bad_number |
| `moh_waiting` | MOH, office holder: a viral post on a six-hour wait, with one factual error: visit the ward unannounced, answer with figures and correct the error, or say the wait was too long (correct the error vs concede the point). | viral_post |
| `mom_dorms` | MOM: new dormitory standards against operators and employers: hold them and phase the deadline, hold both, or soften (principle vs pace). |  |
| `mom_wages` | MOM: the Progressive Wage ladder for a new sector: steeper, gentler, or ask the workers (union vs employers vs workers). |  |
| `mom_retirement` | MOM, office holder: a cleaner's question at a dialogue isn't on your slides: answer it, take it offline, or pass it to the union (face the question vs deflect). | floor_question |
| `mnd_classification` | MND: where the Standard/Plus/Prime line falls between three identical blocks: apply the criteria, follow the road, or send it up (rule vs sense vs escalate). |  |
| `mnd_lease` | MND: residents ask what happens when their lease runs out: meet them, write back, or invite them to consultation (presence vs paper vs process). |  |
| `mnd_million` | MND, office holder: a $1.5m flat headline misleads: show with numbers how rare it is, talk supply, or say you understand the worry (correct the misleading point vs concede the feeling). | viral_post |
| `moe_mergers` | MOE: which schools merge: on the numbers, keep the oldest names, or keep both names (rule vs sentiment vs compromise). |  |
| `moe_banding` | MOE: a principal's timetabling problem: fund the software, send a guidebook, or spend a week in the school (money vs paper vs presence). |  |
| `moe_psle` | MOE, office holder: a dialogue for parents where a twelve-year-old asks why there is an exam: answer the child first, take questions in order, or explain the scoring (face the awkward question vs procedure). | floor_question |
| `the_ask` | A colleague asks a favour: yes and do it properly, yes and make sure it's seen, or no and say why (generosity vs visibility vs honesty). |  |
| `the_ribbon` | You cut a ribbon in your ward: stay to the end, cut and go, or hand the scissors to the person whose work it was (presence vs schedule vs credit). |  |
| `reply_all` | You've emailed the wrong people: correct it to everyone now, recall it and hope, or reply all with a joke (own the mistake vs hide it vs charm). |  |
| `opening_scholar` | Scholar opener, rewritten: your first paper for the Minister is on why a scheme isn't reaching people: spend a week at the counters, ask a batchmate in the Minister's office what the Minister wants, or write it from the files and hand it in early (the hard work first, the right people, or your head down). Opens the footing series. | series footing |
| `opening_grad` | Graduate opener: a peer already gets the meetings you don't: ask for harder work, ask the peer how to get in, or keep your head down (substance vs networking vs lying low). | series footing |
| `strange_letter` | Strange (one per career): a SECRET letter from your future self: return it unopened, open it, or apply for clearance. |  |
| `strange_envelope` | Strange follow-up: cleared at last, the letter says 'Take the leave': take it, or file it. |  |
| `strange_envelope_pol` | Strange follow-up (politics alternate of the envelope). |  |
| `strange_snow` | Strange: snow in Toa Payoh and a continuity plan by 5pm: copy the haze section, write it properly, or say it won't recur. |  |
| `strange_ghost` | Strange: a ghost's compliment in the satisfaction survey: count it, don't, or refer it. |  |
| `strange_merlion` | Strange: the Merlion speaks; which agency leads: STB, ask the Merlion, or a working group. |  |
| `strange_merlion_cleared` | Strange follow-up: the Merlion's cleared talking points: go, or ask for the transcript. |  |
| `strange_appraisal` | Strange: the HR system wants you as its reporting officer: rate it honestly, rate it higher, or put it on a plan. |  |
| `strange_clone` | Strange: a second you; one desk: the tie-breaker, give the other you the posting nobody wants, or a job-share. |  |
| `strange_loop` | Strange: the same budget meeting nine times: perfect the bid, say what you think, or mention the loop. |  |
| `strange_moon` | Strange: comments on declining a moon: nil, ask about ice, or offer a venue. |  |
| `strange_dragon` | Strange: a dragon at your Meet-the-People Session: write its appeal, table it at the Town Council, or call a site visit. |  |
| `strange_hansard` | Strange: Hansard prints what you meant: ask for a correction, let it stand, or publish both. |  |
| `strange_thoughts` | Strange: everyone hears your thoughts at the meeting on item seven: think about the agenda, let them hear, or adjourn. |  |
| `strange_gold` | Strange: a gold bar breeds nightly: raise the expected return, leave the framework, or fund a scheme. |  |
| `one_word` | First years: your paper comes back with one word in the margin: rewrite it, ask what it means, or send it back unchanged (diligence vs asking vs standing firm). |  |
| `fridge_friday` | First years: clearing the office fridge: bin the senior's yoghurt by the rule, leave it, or email the floor (rule vs deference vs diplomacy). |  |
| `and_team` | First years: your RO sends your work up under their own name and gets thanked 'and team': ask for names next time, tell the Deputy Secretary who did it, or say nothing (reclaim credit vs keep the peace). | credit_taken |
| `copied_in` | First years: copied in by mistake on a plan that abolishes a peer's job: tell the peer, say nothing, or tell the sender (loyalty vs confidentiality vs procedure). |  |
| `copied_in_file` | First-years follow-up: the peer finds the cc line: explain over kopi, or cite Official (Closed) (amends vs rules). |  |
| `copied_in_repaid` | First-years follow-up: the peer you warned shows you next year's postings face down: turn it over, or leave it (return the favour vs propriety). |  |
| `for_the_record` | First years: a senior says something nobody wants minuted: minute it, leave it out, or minute it and flag it (accuracy vs discretion). |  |
| `for_the_record_audit` | First-years follow-up: the audit wants the note-taker: confirm and own it, or confirm and say nothing more. | own_up |
| `lucky_draw` | First years: the D&D lucky draw: draw straight, take the directors out, or spend the prize on food (fairness vs crowd-pleasing vs practicality). |  |
| `internet_laptop` | First years: a file you can't open on a work laptop: break the IT rule, ask the vendor, or retype it (speed vs rules vs effort). |  |
| `station_four` | First years: the Minister asks whether your exhibit actually works: say not yet, give the briefing answer, or say what would make it work (candour to the top vs the safe answer). | candour_up |
| `real_sop` | First years: a new junior gets the out-of-date official procedures; you have your own one-page version: give them your page, let them learn it the way you did, or rewrite the official one around yours (teach vs hard way vs do it yourself). | mentor_hardway |
| `approved_leave` | First years: your approved leave clashes with a seminar slide only you can present: cancel, go, or present by video (work vs life). | series work_life |
| `bench_whip` | The Whip's text before a bill you think is wrong: vote the line, speak against then vote for (or lobby the Minister), or ask for the whip to be lifted (loyalty vs conscience). |  |
| `bench_adjournment` | Adjournment motion. As mover (rank 8): speak twenty minutes, cut to five, or send the speech ahead. As the reply (rank 9-10): concede the point the Member is right about, read the officials' draft, or agree the exchange beforehand (concede in the House vs read the brief). | house_brief |
| `bench_cut` | A $100 token cut at Committee of Supply. As mover (rank 8): ask for the ward, the harder question, or the committee's question. As the reply (rank 9-10): promise a study, answer the harder cut properly, or read the officials' drafted replies (answer properly vs read the brief). | house_brief |
| `bench_gpc` | A closed briefing where slide nine leaves out the scheme's weakest number: raise it, let it pass, or take it up privately (present a bad number straight vs leave it out). | bad_number |
| `bench_letters` | Your best letter writer embellishes residents' appeals: stop it and correct, leave it, or sign every letter yourself (honesty vs results vs control). |  |
| `bench_site` | A needed facility in your ward residents oppose: stand beside it, ask for other sites, or back it for a trade (duty vs votes vs bargain). |  |
| `bench_arrears` | Town Council arrears going to court, with one name you know: approve, take the one name off, or change it for everyone (rule vs favour vs reform). |  |
| `bench_next_ward` | Another MP's residents keep coming to you: keep seeing them, send them back with notes, or propose a joint session (residents vs colleague). |  |
| `bench_other_candidate` | The opposition candidate you beat keeps campaigning: match them, do the work, or invite them for kopi (campaign vs work vs grace). |  |
| `bench_date` | Your Minister promises a date your officials say is wrong, on camera: correct it now, tell them in the car, or make the officials meet it (correct a superior in public vs privately vs make it true). |  |
| `bench_stand_in` | A stand-in speech with the Minister's childhood in the first person: read it as written, cut it, or tell your own (script vs edit vs your own words). |  |
| `bench_tea` | You sit on the party's tea panel and the candidate is a peer you started with: declare and step aside, declare and sit, or sit and say nothing (declare a connection vs not). | declare |
| `pilot_design` | Pilot chain, beat 1: choose the pilot's three sites: the likeliest to work, the hardest, or by lottery with a control (rig the test vs learn vs measure). Heads the chain whose beat 2 is pilot_results. | bad_number (through pilot_results), announce (through pilot_results) |
| `pilot_results` | Pilot chain, beat 2: the Minister's Committee of Supply speech needs one number from your pilot: the most impressive one alone, the number with its paragraph, or ask for another year (oversell a number vs present it straight vs hold back). | poses bad_number and announce (claimed through pilot_design) |
| `pilot_national` | Pilot chain, beat 3: the national rollout: run it yourself, hand it to a peer's team, or hand it over if the speech thanks yours (own it vs hand over vs credit). |  |
| `pilot_national_top` | Pilot chain, beat 3 (senior alternate). |  |
| `pilot_national_pol` | Pilot chain, beat 3 (politics alternate): say in your speech you designed it, say nothing, or ask about its weak spot (claim it vs anonymity vs substance). |  |
| `pilot_audit` | Pilot chain, beat 4 (flattered): the audit traces a shortfall to your number: own it, or point to the caveats (come clean vs cover). |  |
| `pilot_audit_clean` | Pilot chain, beat 4 (honest): the audit praises your forecast: send it to the team by name, or upstairs with your note (share credit vs claim it). |  |
| `pilot_audit_pol` | Pilot chain, beat 4 (flattered, politics): a reporter has your name: say it was yours, or 'in due course' (come clean vs cover). |  |
| `pilot_audit_clean_pol` | Pilot chain, beat 4 (honest, politics): a reporter writes it up: name the team, or talk about what you learned (share credit vs claim it). |  |
| `whistle_spreadsheet` | Whistleblower chain, beat 1: a junior shows you forty-one purchases kept under the line: take it up as your own finding, leave it, or report it naming the junior (protect vs ignore vs procedure). |  |
| `whistle_panel` | Whistleblower chain, beat 2: the review panel (branches by what you did): name or shield the junior; admit you were shown or not recall; argue for the junior or not. |  |
| `whistle_panel_pol` | Whistleblower chain, beat 2 (politics alternate). |  |
| `whistle_return` | Whistleblower chain, beat 3: the junior, now senior, faces the same spreadsheet and asks what you'd do: protect, use the channel, or 'leave it with me' (advise the next one). |  |
| `whistle_return_pol` | Whistleblower chain, beat 3 (politics alternate): paragraph two of tomorrow's PQ reply isn't quite true and the junior, now a director, has told you so: correct it though it's due tomorrow, or read it as drafted (correct the record vs read the brief). | house_brief |
| `protege_ask` | Protégé chain, beat 1: a junior asks you to mentor them: yes with the truth, yes with the hardest file, or no (mentor vs decline). |  |
| `protege_dissent` | Protégé chain, beat 2: your protégé corrects your paper in front of forty: concede, hold your line, or say you asked them to (concede in public vs hold vs spin). |  |
| `protege_panel` | Protégé chain, beat 3: your protégé is up for promotion and will overtake you: back them without reservation, or say 'not yet, one more year' (back someone who'll overtake you vs not yet). | not_yet |
| `uturn_questions` | U-turn chain, beat 1: nine PQs on a policy, and the officials' draft says it 'remains under review': strike it (the policy stays), keep it, or answer with figures only (commit vs hedge vs neutral), in the House. | house_brief |
| `uturn_reversal` | U-turn chain, beat 2: Cabinet will reverse the policy you defended: argue to keep it, agree, or propose a phase-out (conviction vs going along vs face-saving). |  |
| `uturn_statement` | U-turn chain, beat 3: the statement quotes your old replies: say plainly they were wrong, leave it, or cut it (admit vs neutral vs bury). |  |
| `uturn_hansard` | U-turn chain, beat 4: a colleague quotes your reversed reply as a model: tell them, or let it stand. |  |
| `bond_masters` | Bond chain, beat 1 (scholars): a sponsored master's with two more bond years: go, decline for your division, or study part-time at your own cost (career vs commitment). | private_offer (through bond_bank) |
| `bond_bank` | Bond chain, beat 2 (scholars): a bank will pay your bond damages to hire you: let it, or keep the deed (leave for private-sector money). | poses private_offer (claimed through bond_masters) |
| `bond_mentor` | Bond chain, beat 3: your own scholar has the same bank offer and asks what you did: tell the truth, tell them to stay, or tell them to go (advise the next one). |  |
| `bond_mentor_pol` | Bond chain, beat 3 (politics alternate): your old school asks you about the bond: tell your story, sell the bond, or leave it out (advise the next ones). |  |
| `endgame_last_service` | The last year in the service: write the handover, push one last thing, or clear your desk (one card with endgame_last_politics: a career has one last year). |  |
| `endgame_renewal` | Renewal: the party asks you not to stand again: agree and announce it, ask to stand once more, or agree if you can introduce your successor (alternate of endgame_stay). |  |
| `endgame_stay` | One more term: the party wants you to stay: stand once more, or make way (alternate of endgame_renewal). |  |
| `endgame_last_politics` | The last year in politics: the same three as the service's last year (a career has one last year). |  |
| `pm_cabinet` | PM tenure: your Cabinet: keep the team, bring in new names, or give the hardest ministry to the colleague who nearly beat you. |  |
| `pm_rally` | PM tenure: your first National Day Rally: one big thing, all nine, or something hard. |  |
| `pm_successor` | PM tenure: settling your successor: let them choose, name your choice, or keep it open. |  |
| `pm_step_down` | PM tenure: stepping down: Senior Minister, back to your ward, or the handover. |  |
| `rival_360` | Batchmate: you write your batchmate's anonymous 360 feedback: true and useful, true and damaging, or 'No comments' (help vs undercut vs abstain). | peer_review |
| `rival_annex` | Batchmate: your batchmate's paper has a wrong annex: call them tonight, say nothing, or raise it at the meeting (help vs abstain vs undercut). | peer_review |
| `rival_posting` | Batchmate: one career-making posting, two nominees, you and your batchmate: withdraw, let HR decide, or lobby the Director (step aside vs put yourself forward). | one_slot |
| `rival_views` | Batchmate: the panel asks your view of your batchmate, shortlisted for a post above you both: back them warmly, briefly, or suggest another year (back someone who'll overtake you vs 'not yet'; a peer assessment). | not_yet, peer_review |
| `rival_ward` | Batchmate: your batchmate asks you to walk their troubled ward on your own walkabout morning: go, send volunteers, or stay (loyalty vs your own ward). |  |
| `rival_first` | Batchmate: the succession comes down to you and your batchmate (stands in for the succession card; never both). |  |
| `rival_name` | Batchmate: your batchmate, now senior, puts your name forward for a task force: accept, or decline to go up on your own file (accept a favour vs independence). |  |
| `ps_successor` | New: name your successor as Permanent Secretary: the sharper one who would undo half your work, or the loyal one who would keep it (merit vs legacy). |  |
| `the_underspend` | New: your ministry will end the year under budget: give the money back, approve the divisions' shopping lists, or bring next year's projects forward (honesty vs the baseline vs planning). |  |
| `union_rep` | New (long-serving juniors): the union needs a representative for your ministry: take it seriously, take it to be noticed, or decline (service vs visibility vs your own career). |  |
| `records_purge` | New (long-serving juniors): files past their retention date must be deleted, including drafts that show a policy was known not to work: delete them, ask to keep them, or copy them for yourself (the rule vs the record vs a private copy). |  |
