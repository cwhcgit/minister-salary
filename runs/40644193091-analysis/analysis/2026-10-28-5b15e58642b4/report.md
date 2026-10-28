# Playtest findings, 2026-10-28

Build `5b15e58642b4`. Cohorts: 2026-10-28-blind-general-51b32cb29042, 2026-10-28-blind-insider-51b32cb29042, 2026-10-28-blind-international-51b32cb29042, 2026-10-28-lineage-51b32cb29042. Analyst cost $2.04.

The loop's best moments are strong: the tea, vetting and election (Act II interest 4.2–4.7), the fired consequence events (up to 4.7) and the DECLASSIFIED ending card, which every cohort singles out. What costs the most fun is the single-option 'As usual' year. It makes up a fifth to a quarter of all turns, rates at bland-canary level, and drives most skipped years and most 'not right now' answers (critical, F1). Next come: Standing, which falls without explanation and teaches players that honesty is punished (F2); a ceiling that is decoded only after the run, with lineage players unable to turn knowledge into results (PM by life 50/0/17/33/33%, F3); a Perm Sec plateau where politics is dangled and never reached for low-Standing players (F4); early losses that are mostly luck for scholars and two-tap exits for grads (F5); long-fuse consequences that never fire in about 20% of cases despite promises in the text (F6); a CEP safeguard that shows a raiser after the ceiling in only 48–70% of first-timer runs (F7); and morally obvious choices that saturate Integrity at 100 (F8). Among known gaps, content size (filler repeats) hurts most (5), then unused flags and the run-ending election loss (4 each). The balance invariant holds, but scholar and grad are statistically tied under knows-the-win. Caveats: the bot baseline is from build 5b15e58642b4 while all cohorts ran 51b32cb29042, so two-way confirmations assume the content did not change between builds. No predictions were supplied to check. All canaries passed. CEP cruelty, the title (outsiders pick Minister Salary before play, almost everyone picks Confirmed & Substantive after) and Act III turn length need real players; current evidence leans against quarters and toward compressing quiet years.

## Findings, ranked

### F1. 'As usual' single-option years make up a fifth to a quarter of all turns and are the dullest content in the game

critical · high confidence · new · confirmed by bots and agents · Every year gives the player something worth reading

Events `__montage:the_work`, `__montage:the_quiet_year`, `__montage:the_appraisal_talk`, `__montage:the_pq`, `__montage:the_walkabout`, `__montage:the_mps_night`, `__montage:the_townhall`, `__montage:late_night`, `__montage:budget_round`, `ally_returns` · choices `the_pq A (montage)`, `the_walkabout A (montage)`, `the_mps_night A (montage)`, `ally_returns A (only option)` · stats —

- *agent*: Montage turns are about 23% of blind-general turns (~510/2180), 21.5% of insider (~431/2005), 27% of international (~485/1797) and 21.5% of lineage (~257/1193). Their mean interest is 2.0–3.15, close to the bland canary (1.96–2.15). The same events score far higher when they offer a real choice: the_pq is 2.25 as a montage but 3.24 with options, and the_walkabout is 2.88 versus 3.84 (blind-general).
- *agent*: Skipped years cluster in Act III, where the montages are: 40/38/19/26 Act III skips against 9/9/25/4 in Act I. Diary 'skip' and 'worst' entries cite one-option years far more than anything else ('a choice screen with no choice felt pointless', 'the last decade was too much tapping the only option'). Most 'not right now' replay answers name the length and the samey late years.
- *bot*: The share of turns that are repeat filler is 43.3% in Act I and 36.1% in Act III for the first-timer bot, and 37.7% in Act III for the optimiser (52.9% counting all repeats). The bots' dead-turn counter misses these turns (deadShare at most 0.4% for the first-timer), so the baseline is under-reporting the problem.

**Recommendation:** Stop presenting repeated habit years as a choice screen with one button. Either collapse consecutive habit years into a single time-skip beat ('Three years pass. As usual: …') with the pay and appraisal summary, or keep at least two options on every repeat. Treat a one-option screen as a content bug, and give ally_returns a real second choice. Also update the bot's dead-turn definition so it counts single-option turns as dead.

### F2. Standing drifts down unexplained through Act III, and players read it as the game punishing honesty

major · high confidence · new · confirmed by bots and agents · Every stat is pushed in both directions by real choices

Events `re_election`, `the_pq`, `the_townhall`, `the_mps_night`, `the_walkabout`, `the_bonus_reveal`, `pofma_moment`, `the_indicators` · choices `the_bonus_reveal C`, `the_townhall A`, `pofma_moment B`, `re_election A` · stats `standing`, `reputation`, `competence`

- *agent*: 'Why does STAND keep dropping' is the single most common entry in confusedBy across every Act III event in all four cohorts, usually next to an 'outstanding' appraisal and a promotion. Diary 'worst' entries repeatedly describe watching STAND slide 'with no lever'. heldBackBy answers overwhelmingly conclude that 'honesty cost me STAND'. Players also say at Year 1 that REP, STAND and COMP are never explained.
- *bot*: Standing has the highest down-share of the four visible stats: 36.5% for the first-timer (reputation 27.5%, integrity 24.1%, competence 26.3%) and 24.6% for the optimiser. statDirection shows 46 standing-down choices against 16–28 for the other stats.

**Recommendation:** Give every Standing loss a cause on screen, as an in-world line ('The Minister's office notes the question. Standing −6'), and say once, early and in euphemism, what Standing is (the machine's trust in you). If there is a passive Act III drift, either remove it or attribute it in the text. Check that candour choices don't cost Standing so uniformly that 'honest' and 'promotable' always point in opposite directions.

### F3. The ceiling is decoded only on the ending card; in-run hints are unreadable and CEP rises are invisible

major · medium confidence · new · The ceiling is felt but not stated

Events `cep_discovery`, `ally_returns`, `scholar_returns`, `reshuffle`, `cny_lohei`, `the_counter`, `second_look`, `the_bonus_reveal` · choices `reshuffle A`, `ally_returns A`, `scholar_returns A`, `cny_lohei A`, `the_counter A` · stats `cep`

- *agent*: Blind agents notice the rumour lines ('steady', 'safe pair of hands', 'seated facing the door', the Harvard programme, the third column) but say they 'only understood it from the ending card'. Several tone-break entries call 'steady' over their heads. Callbacks of the form 'the ending card says this raised my ceiling … I never saw it in play' are a common felt_earned=false pattern, for example grad-10007, grad-11017, poly-10613 and scholar-10007 in blind-general.
- *agent*: Learning across lives does not convert into results. Lineage PM rate by life is 50%, 0%, 16.7%, 33.3%, 33.3%, and mean final rank is 14.2, 14.3, 11.0, 13.2, 14.0. Lineage theories about what raises the ceiling are often contradicted on the next life ('the walk-every-block habit apparently did nothing this life', 'the key event never turned up in 46 years'). The DECLASSIFIED card is still the most-praised element in every cohort.

**Recommendation:** Keep CEP hidden but make each step legible at the moment it happens. When a CEP-raising choice resolves, show a distinct euphemism in that year's outcome ('Your name has been moved to a different list'). Make the 'ceiling refused' rumour vary with how many times it has fired so it escalates. Consider a mid-run 'partial declassification' at Perm Sec or on winning the seat. The discovery should happen while there is still time to act on it.

### F4. Politics stays out of reach for low-Standing players stuck at Perm Sec while the 'different life' rumour repeats for decades

major · medium confidence · new · confirmed by bots and agents · Endings make you want to collect another one

Events `tea_session`, `grassroots_invite`, `mps_duty`, `__montage:late_night`, `__montage:budget_round` · choices `grassroots_invite A`, `mps_duty A` · stats `standing`, `reputation`

- *agent*: 18 of 50 blind-international runs ended at Permanent Secretary (11 of 16 poly, 7 of 17 grad), almost all never invited to tea. Diaries call it a 'bait and switch': 'I spent 40 years waiting for it and never saw it', 'the different-life rumour ran for over a decade and no approach ever came'. The international cohort's endingFair is 46%, the lowest of the blind cohorts. Its chaseNext is dominated by 'the politics route', so the itch is real but the game does not show how to scratch it.
- *bot*: The first-timer bot ends at Perm Sec in 175/800 poly runs (21.9%) and 70/800 grad runs (8.8%). The tea requires rank 4–7, Standing ≥ 54 and Reputation ≥ 44. Standing is the stat most often pushed down (see F2).

**Recommendation:** Make the rumour at ranks 6–7 point, in euphemism, at what the gate wants ('The people who get asked to tea are usually better known outside the building'). Have the Perm Sec ending card name the closed door explicitly in DECLASSIFIED (standing and reputation at the moment it mattered). Replace the decade of single-option Perm Sec years with a time-skip (F1).

### F5. Early losses are mostly luck for scholars, and grads can be shown the door after two taps

major · high confidence · new · confirmed by bots and agents · Failure pacing: losable early only through active choices

Events `the_election`, `the_work`, `postit_workshop`, `bto_queue` · choices `the_election A`, `the_election B`, `bto_queue B`, `postit_workshop A` · stats `reputation`, `standing`, `competence`

- *bot*: First-timer scholar early losses (3.8%) are 90% not by choice (27 luck, 2 choice+luck, 1 choice). For the optimiser, scholar early losses are 9.5% (76.3% luck) and grad early losses are 2.1% (100% luck). Grad first-timer early losses are 12.6%, mostly choice+luck (85/101). The Quiet Conversation ending appears in 106/800 grad first-timer runs.
- *agent*: Blind-international scholars lost the ward in 7 of 17 runs, mostly at Y9–17 around age 34–37. Diaries: 'the loss felt decided by a hidden number', 'it ended at 34 after one choice'. grad-10209 (international) hit The Quiet Conversation at age 24 after two years, and grad-12229 (lineage) after four: 'It ended at 24 after two taps, with no warning.' The fixed 48.2% loss figure, repeated across runs, reads as scripted.

**Recommendation:** For the first election, either raise the GRC floor so that a scholar who has made no bad choices almost never loses, or make the loss margin respond visibly to Reputation. Show the odds-relevant stat on the election card. Protect the first ~3 years from a two-D exit, for example by requiring a prior warning year before The Quiet Conversation can fire. Vary the loss margin text.

### F6. Long-fuse consequences often never arrive, even when the text has promised them

major · high confidence · new · confirmed by bots and agents · Choices carry weight, because some come back

Events `ally_returns`, `scholar_returns`, `leak_resurfaces`, `tender_questions`, `the_leak`, `leadership_programme`, `the_scholar` · choices `the_leak C`, `leadership_programme A`, `the_scholar A` · stats —

- *bot*: First-timer fire rates are 79.1% for ally_returns (51 of 244 still pending at run end), 77.3% for scholar_returns (30/132), 77.9% for leak_resurfaces (42/190) and 82.6% for tender_questions. pofma_vindicated and speech_vindicated fire late about 25–30% of the time when they collide.
- *agent*: Agents are told outright to wait ('eleven years later she is a Deputy Secretary', 'you will wait eleven years'), and several report it never came: 'I was told it would resolve in eleven years and it never did' (grad-10714, international) and 'No Y41 consequence ever showed up' (poly-10209, international). The eleven-year flash-forward line itself confused many agents ('did the game skip ahead?'). The consequences that do fire are among the best-rated events: bonus_vindicated 4.0–4.71, tender_questions 4.5, leak_resurfaces 4.25, scholar_returns 4.0.

**Recommendation:** Clamp each consequence's delay to the player's remaining career, or bring pending consequences forward once retirement or election risk approaches, so that a scheduled payoff almost never dies pending. Drop the literal 'eleven years later' foreshadow from outcome text, or make sure it can always be honoured. Prefer firing a weaker version early over not firing at all.

### F7. CEP raisers are often not drawn after the player hits the ceiling, so the safeguard does not hold

major · medium confidence · new · confirmed by bots and agents · The ceiling is felt but not stated

Events `reshuffle`, `succession`, `ally_returns`, `second_look`, `leadership_programme`, `cny_lohei` · choices `reshuffle A`, `succession A`, `ally_returns A` · stats `cep`

- *bot*: After the first-timer hits the ceiling, a CEP-raising choice is reachable in 62.1% of scholar, 80.7% of grad and 88.0% of poly runs, and actually shown in only 47.6%, 58.6% and 70.4%. Only 84.8% of grad first-timer runs ever see a raiser reachable (many end early). The key political raisers are rare draws: reshuffle reach 11.7% and succession 8.4% for the first-timer.
- *agent*: Lineage players who know a raiser exists still miss it: 'the nomination event never turned up in 46 years' (scholar-11825-L3), and 'this time I didn't even get the Y42 Succession event' (poly-12936-L5). These runs are coded unfair.

**Recommendation:** Promote at least one CEP-raising event per career phase to priority status, so it fires the first year the player is at their ceiling and meets its rank range, as the tea session already does. Then the safeguard becomes 'always shown after ceiling', not 'possible to draw'. Re-run the safeguard metric to confirm shownAfterCeilingRate is close to 100%.

### F8. Many choices have an obvious right answer, and Integrity saturates at 100

major · high confidence · new · confirmed by bots and agents · Every stat is pushed in both directions; no obviously dominant choice

Events `maiden_speech`, `reshuffle`, `pofma_moment`, `inconvenient_figure`, `forum_letter`, `the_tender`, `town_council`, `the_vetting`, `headhunter_early`, `headhunter_mid`, `headhunter_political` · choices `maiden_speech B`, `reshuffle A`, `pofma_moment B`, `inconvenient_figure C`, `forum_letter C`, `the_tender C`, `town_council B`, `headhunter_early A`, `headhunter_mid A`, `headhunter_political A` · stats `integrity`, `competence`, `wealth`

- *bot*: The optimiser picks one option over 90% of the time on 53 events. Four 'Take it' options are formally dominated. Competence goes up 97.5% of the time under optimal play. Only 6 choices touch Wealth at all, although Wealth is the score.
- *agent*: Blind agents converge almost unanimously: maiden_speech B 56/56, reshuffle A 67/67, pofma_moment B 70/70, inconvenient_figure C 56/57, the_vetting A 118/124. Notes routinely label the alternatives 'obviously a trap' (forum_letter C, the_tender C, town_council B, the_leak C). Integrity at 100 appears in most ending cards. chaseNext answers ask for a 'corrupt' or 'money' route to see what the clean run cost, which suggests the clean path never felt costly enough to be a real choice.

**Recommendation:** Give the dishonest or self-serving option a real, visible short-term upside (Standing, Wealth or a promotion now), so the honest option costs something the player feels. Add Integrity costs to some later 'safe' options so 100 is not a resting state. Put Wealth on more choices so the score is something the player plays for.

### F9. Consequential choices rely on local terms non-Singaporean players cannot read (GRC vs single seat, BTO, COS, Pingat)

minor · medium confidence · new · Core fantasy: discovering the rules only by paying for them

Events `the_election`, `bto_queue`, `cos_speech`, `national_day_award`, `cny_lohei`, `town_council`, `pofma_moment` · choices `the_election A`, `the_election B`, `bto_queue B` · stats `reputation`

- *agent*: Blind-international has Act I lowShare 23.3% and 25 skipped Act I years, against 9 for the other blind cohorts. Almost every confusedBy entry for bto_queue, the_election, cos_speech and town_council asks what the term means. scholar-11320 picked the single seat 'without knowing what GRC meant' and the run ended on it. The same cohort rated Act II at 4.73, so the drama lands once the meaning is clear.

**Recommendation:** Keep the real acronyms, since accuracy is the joke, but add a one-line in-world gloss on first use for choice-relevant terms only. For example, the election card could say the team seat is safer and the single seat needs you to be known. Whether to court non-Singaporean players at all is a designer call.

### F10. On-screen text contradicts the game state

minor · high confidence · new · Tone rule 4: accuracy is the joke

Events `cos_speech`, `mps_duty`, `maiden_speech`, `late_night`, `bto_queue`, `ally_returns`, `bonus_vindicated`, `succession` · choices `cos_speech C`, `mps_duty C` · stats `heat`

- *agent*: cos_speech says 'saying there is nothing is not an available option', yet option C is exactly that; nearly every agent who saw it in every cohort flagged it. Other recurring mismatches: mps_duty offers a 'young family' at age 50–61; maiden_speech says 'thirty years in the service' at age 35; late_night says the concert was at eight when it is now 11:40pm; the ally_returns pronoun (he/she) differs from the nominated officer. Also reported: 'promoted to Deputy Prime Minister again'; a header that stays MR3 after becoming DPM, with the final card saying Minister; Backbench Lifer ('never a portfolio') for a Minister of State; and the ending card's 'At 85, everything surfaces at once' read as age 85 by about 14 of 50 international agents.

**Recommendation:** Fix the text bugs. Make cos_speech's framing and option C agree. Gate the family line on age and on whether a family exists. Compute years of service. Write the Heat line as 'Exposure peaked at X/100. At 85, …'. Keep the header and ending title in sync with rank. Reword Backbench Lifer for ranks 9–12.

### F11. Insiders flag the ladder's pace and labels as unrealistic

minor · medium confidence · new · Tone rule 1 and 4: institutions accurately modelled

Events `the_appraisal_talk`, `postit_workshop`, `cep_discovery`, `bto_queue`, `the_vetting`, `the_election` · choices `cep_discovery A` · stats —

- *agent*: The insider cohort repeatedly flags: Perm Sec at 30–33 for scholars; a graduate stuck at MX13 for 8–12 years; inverted-looking MX and MR numbering; 'Staff Grade' shown as a rung; the cep_discovery event having an officer ask what CEP is; BTO 'run by' whatever ministry the player is in; 'retired' at 34 after losing an election; 'Ward' used for a GRC. This is the cohort with the highest interest (3.58) and the one 49/50 of whom chose 'Confirmed & Substantive', so they are the audience most likely to share the game.

**Recommendation:** Slow the scholar rise to Perm Sec, or make its speed an explicit joke. Name the non-retirement exits correctly ('left the service'). Make ministry-specific lines conditional on the ministry. Have the CEP reveal acknowledge that the officer knows the term but not their own number.

### F12. Ending-card epitaphs read as winks, twice per card

minor · medium confidence · new · Tone rule 3: deadpan, the game never winks

Events — · choices — · stats —

- *agent*: 'You served. The service continued… highest compliment the system can pay', 'Your file is clean enough to be boring. In this building, that is a compliment.' and 'The formula pays you twice the entry-grade minister's salary…' are flagged as winks in dozens of runs across all cohorts, often both on the same card. Insiders also call the 2× formula claim inaccurate. 'It was never going to be about you anyway' is read as dismissing the player's agency after a lost ward.

**Recommendation:** Allow at most one dry line per ending card and rotate several variants so a single line does not recur across runs. Restate the PM pay formula accurately. Rewrite the Lost the Ward line so it states the swing rather than telling the player their effort did not count.

## Fun criteria

| criterion | verdict | answer | evidence |
|---|---|---|---|
| Every year gives the player something worth reading | partly | Partly. True dead turns are near zero, but about a fifth to a quarter of agent turns are single-option 'As usual' years rated at canary level, concentrated in Act III and at Perm Sec. | Bot deadShare is at most 0.4% for the first-timer and 6.7% for the optimiser in Act III. Montage share is 21.5–27% of turns, at interest 2.0–3.15 against a bland canary of 1.96–2.15. Act III skipped years: 40/38/19/26. |
| Choices carry weight, because some come back years later | partly | Partly. The scheduled consequences are the best content in the game when they fire, but about 20% of long-fuse ones never arrive, and most flagged threads (board seat, Director's joke, daughter, Forum promise) never return. | bonus_vindicated 4.0–4.71, tender_questions 4.5; ally_returns, scholar_returns and leak_resurfaces fire 77–79%; many felt_earned=false callbacks name the declined board seat. |
| Every stat is pushed in both directions by real choices; no obviously dominant choice | partly | Partly. No visible stat is one-directional (CEP is one-directional by design). In practice Integrity saturates at 100, Competence almost never falls under good play, Wealth is barely a lever, and most dilemmas have an obvious right answer. | statDirection: only cep is oneDirectional. Optimiser picks >90% on 53 events; competence upShare 97.5%; 6 wealth choices. Agents unanimous on maiden_speech B, reshuffle A, pofma_moment B. |
| The ceiling is felt but not stated | partly | Felt, yes; read, mostly no. Players notice the stall and the rumours but decode them only on the DECLASSIFIED card. Once it is decoded, most lineage players experience it as discovery. | Lineage ceiling_feeling: discovery 18/30, unfair 8, resigned 3. Blind tone-break notes say 'steady' only made sense on the ending card. The safeguard shows a raiser after the ceiling in only 47.6–70.4% of first-timer runs. |
| The win is rare by accident and reachable by skill; replaying with knowledge changes the outcome | partly | For bots, yes. For agents, it is not rare for sincere first-timers, and knowledge gained from ending cards does not reliably improve the result. | Bot PM rates: first-timer 5.8/1.9/0.1%, optimiser 61/34/4.6%, knows-the-win 51.1/49.9/24.5%. Blind agents reached PM in 20/150 runs (13%). Lineage PM by life: 50, 0, 16.7, 33.3, 33.3%. |
| Endings make you want to collect another one | partly | The desire is there (specific, varied chaseNext targets), but it is deferred: most players will not start another run now because a run feels long and samey. | playAgainNow: blind-general 4%, insider 24%, international 44%, lineage 96.7% (persona-driven). Diaries' 'again' answers cite length and repetition. chaseNext centres on the corrupt route, politics and PM. |
| Core fantasy: climbing a ladder whose rungs are invisible, discovering the rules by paying for them | partly | The payment happens; the discovery mostly arrives after the run. Act II (tea, vetting, election) is the strongest stretch of the fantasy. | Act II interest 4.19–4.73 with 0% low ratings; the DECLASSIFIED card is the most-praised element; lineage cannot reliably convert what it learns. |
| Balance invariant: scholar easiest → grad → poly hardest for random and win-seeking play | met | Holds, but thinly for knows-the-win, where scholar and grad are statistically tied. Note that the bot baseline is from build 5b15e58642b4 while the cohorts ran 51b32cb29042. | First-timer 5.8 > 1.9 > 0.1; optimiser 61 > 34 > 4.6; knows-the-win 51.1 [47.7–54.6] ≈ 49.9 [46.4–53.3] > 24.5. |

## Open questions

**Turn length: would Act III play better in quarters?** Do not move to quarters; that would multiply the identical turns. Instead let quiet years compress into multi-year skips and keep one turn per event year. A promotion year and a coasting year would then feel different because coasting years go by fast. (medium, confirm with real players). Act III is where skipped years concentrate (40/38/19/26) and where montages and repeats dominate (optimiser Act III 23.3 turns per run, 52.9% repeat share). Lineage describe 'dead DPM years' spent waiting. The complaint is too many identical years, not too little resolution within a year.

**Is CEP too cruel?** It reads as satire once decoded, and the reveal card is loved. The cruelty comes from (a) hints that are unreadable in play and (b) raisers that are never drawn. Fix those (F3, F7) before deciding whether the hard ceiling itself is too cruel. (medium, confirm with real players). Lineage, who decode it: 18/30 discovery, 8/30 unfair. Blind endingFair is 84% (general) and 90% (insider) but 46% for international, where the hints are unreadable and many stall at Perm Sec. The raiser-after-ceiling safeguard only shows an option in 47.6–70.4% of first-timer runs.

**Failure pacing: is early loss only ever caused by active choices?** The invariant fails for scholars at the first election and is fragile for grads in years 1–4. Harden both (F5). (high). No. 90% of scholar first-timer early losses and 76% of optimiser scholar early losses are luck, mostly the first election. Grad optimiser early losses are 100% luck (n=17). Agents lost to the luck of the first election (international scholars 7/17 lostward) and to two-turn Quiet Conversations.

**Title: 'Minister Salary' vs 'Confirmed & Substantive'** Minister Salary for store-page acquisition with outsiders, with Confirmed & Substantive as a subtitle or in-game phrase. The after-play flip shows C&S describes the game better, but agents who have already played do not measure discovery. (medium, confirm with real players). Before play, every blind-general and international agent chose Minister Salary whichever title was listed first; they read C&S as dry HR paperwork they would scroll past. Insiders chose C&S before play. After play, 43/50, 49/50, 45/50 and 29/30 chose C&S. MS sets expectations of money, scandal and bribes that a clean first run rarely delivers.

## Known gaps: how much they hurt

| gap | hurt (1-5) | frequency | interest drop | evidence |
|---|---|---|---|---|
| Content size (~49 events vs 120+): filler repeats | 5 | Every run. Repeats are 43% of Act I and 36–38% of Act III bot turns; the_indicators and re_election recur 3–6 times in a political career. | Large. Repeat interest falls below first-time interest (the_indicators 3.49→3.06, the_pq 3.30→2.86, the_walkabout 3.91→3.43 in blind-general). Repeats are the most common diary 'skip' after the montages. | Bot repeatFillerShare; repeat-vs-first interest in all cohorts; diaries ('Indicators again, fourth time'). Works together with F1, which is about how the repeats are presented. |
| Most choices leave no lasting mark (flags unused except declined tea) | 4 | Most runs. The declined board seat alone is reported as never returning in about 13 of 50 blind-general runs; the Director's joke, daughter's concert, Forum promise and contractor's cousin recur across all cohorts. | Moderate to large at the end of a run. Unresolved threads are the main complaint in 'was the ending fair' answers and pull international endingFair down to 46%. | felt_earned=false callbacks clustered on headhunter_political, the Director's satire question, late_night, forum_letter and town_council; diaries 'several things I was watching never paid off'. |
| No way back after losing an election | 4 | Common: lostward in 12/50 insider, 7/17 international scholar and 5/30 lineage runs; 6.4% of first-timer and 18.7% of optimiser bot runs. | Large. It ends decades of play on one roll, often cited as the diary 'worst', with the line 'it was never about you anyway'. | Bot lostward counts; diaries for poly-11320, scholar-11118 and scholar-10916 (international/insider). |
| Minister's bonus tracks Reputation, not policy | 3 | Every Act III run that reaches the indicators or bonus events. | Moderate. 'Same choice, same result, bonus exactly on target' recurs as a reason to skip the_indicators. | the_indicators repeat interest 2.75–3.35; diaries in all cohorts. |
| Raw-numbers toggle not built | 2 | Frequent early: agents cannot rank appraisal phrases ('is meeting requirements worse than solid and dependable?'). | Small to moderate; it mostly adds to stat confusion (F2). | confusedBy on the_work, postit_workshop and the_appraisal_talk. |
| Choosing a ministry (random/cosmetic) | 2 | Occasional; noticed after the reshuffle. | Small. 'Asked for the hard ministry, got Education' and handover text naming housing/health/transport for a different posting read as bugs. | succession and reshuffle confusedBy entries (insider, lineage). |
| Ending gallery not built | 2 | Every replay decision. | Small but missed: players invent targets that don't exist (the 'at 85 everything surfaces' ending) and don't know which endings exist. | International chaseNext entries about the '85' ending. |
| Heat doesn't make old things more likely to resurface | 2 | Only in the few runs with corner-cutting. | Small. Players with a confessed leak saw exposure of 30–57 and nothing happen, which feeds the 'threads never pay off' complaint. | poly-10209 and poly-11219 (international) diaries. |

## Cohort validity

- 2026-10-28-blind-general-51b32cb29042: canaries passed. Bland canary 2.15 vs cohort mean 3.29; wink flagged 34/47. Ratings are generous relative to behaviour (mean 3.29 but only 4% would play again now), so behaviour is weighted over scores. Ran on build 51b32cb29042, not the bot baseline's 5b15e58642b4.
- 2026-10-28-blind-insider-51b32cb29042: canaries passed. Bland 2.07 vs 3.60; wink 44/46. Highest interest; praise rests heavily on recognising the in-jokes. This cohort is also the most sensitive to accuracy errors (F11).
- 2026-10-28-blind-international-51b32cb29042: canaries passed. Bland 2.03 vs 3.44; wink 35/45. Lowest endingFair (46%) and the most jargon confusion; still the highest play-again-now among blind cohorts (44%), driven by an unfinished politics route.
- 2026-10-28-lineage-51b32cb29042: canaries passed. Bland 1.96 vs 3.20; wink 28/28. playAgainNow of 96.7% comes from the persona and is not evidence that endings pull players back. Ceiling-coding and life-over-life outcomes are the useful signals.
