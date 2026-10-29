# Content plan: from 88 cards to about 300

When this plan was written, a second playthrough shared about 60% of its cards with the first, so
the game was mostly seen after one or two careers. This plan grows it to about 300 cards. The new
cards come as themed packs, story chains, alternate scenes and traits, written by parallel writer
agents to one rulebook, [`WRITING_RULES.md`](WRITING_RULES.md). This plan sets the targets and the
process; the cards themselves are written pack by pack.

The plan started from `fun/next` (09a28e5): 88 cards in `events.json`, 7 batchmate cards in
`rival.json`, 11 endings. On `main` today (02b7626): 180 cards (105 in `events.json`, 75 in packs),
the same 7 batchmate cards, 12 endings. Re-run the numbers with `node test/variety.js`,
`node test/contexts.js` and `node test/similarity.js`.

## 1. Where the plan started, and where it is now

| Kind | Cards at 09a28e5 | Now | Notes |
| --- | --- | --- | --- |
| Drawable pool, civil service only | 32 | 64 | repeatable fillers: 12 of the 47 pool cards then, 12 of 103 now |
| Drawable pool, politics (MP and up) | 14 | 36 | |
| Drawable pool, spans both | 1 | 3 | |
| Structural (tea, vetting, election, re-election, succession) | 5 | 5 | in every political career |
| Consequences and callbacks | 29 | 47 | fire only after a choice |
| Alternate scenes (rank variants) | 7 | 17 | a scheduled card's `alternates` |
| The end of a career (`endgame`) | 0 | 8 | drawn by the engine, never at random |
| Origin-only | 3 (poly) | 9 | poly 3, scholar 5, graduate 1 |
| Batchmate (`rival.json`) | 7 | 7 | only with the start-screen option |

Where the pool cards can appear, by rank band (a card can cover several bands):

| Rank band | Pool cards reachable at 09a28e5 | Now |
| --- | --- | --- |
| Management Executive, Senior ME (0-1) | 12 | 37 |
| Assistant Director, Deputy Director (2-3) | 31 | 50 |
| Director, Senior Director (4-5) | 30 | 49 |
| Deputy Secretary, Permanent Secretary (6-7) | 16 | 31 |
| MP, Parliamentary Secretary, Senior Parliamentary Secretary (8-10) | 8 | 29 |
| Minister of State up to Prime Minister (11-16) | 14 | 24 |

**Gaps.** These are the places a returning player will notice repetition first. Figures in
italics are today's.
- **The first years:** 12 cards for ranks 0-1, which every career passes through. *(Now 37.)*
- **The top of the service:** 16 cards for Deputy Secretary and Permanent Secretary. *(Now 31;
  its own pack is not written.)*
- **Backbench to Senior Parliamentary Secretary:** 8 cards. *(Now 29.)*
- **Ministry content:** ten ministries exist; four of them (Health, Manpower, National
  Development, Education) have three cards each, from `fun/variety`.
- **One crisis card** in the whole game (`the_crisis`).
- **Life outside work** is two cards (`bto_queue`, `late_night`).
- **No traits.** Scholars and graduates now have an opening card, and scholars The Bond.
- **Few new sources of Heat** outside the original compromise cards.

## 2. The packs

Each pack is one file, `web/content/packs/<pack>.json` (section 6). The table's counts are new
distinct cards. Alternate scenes are extra and counted in section 5.

| Pack | New cards | Rank and act bands | Pushes both ways | Written |
| --- | --- | --- | --- | --- |
| Ministries (10 packs, one per ministry) | 50 (5 each; 12 of them come from `fun/variety`) | service 2-7, office holders 11-16; split where the text differs | Standing vs Integrity; Competence vs Reputation; Heat both | the 12 from `fun/variety`, in `events.json` |
| The first years | 12 | 0-1 | Competence vs Standing; Integrity both | 13 (`first_years`) |
| Postings and statutory boards | 12 | 2-6 | Competence vs Standing; ceiling up via proving grounds | |
| Overseas postings | 8 | 3-6 | Competence and ceiling vs Standing (out of sight) | |
| The top of the service | 10 | 6-7 | Standing vs Integrity; Reputation both | |
| Backbench and junior office | 12 | 8-10 | Reputation vs Standing (with the Whip) | 12 (`backbench`) |
| Cabinet life and portfolios | 10 | 11-16 | Standing vs Integrity; Reputation both; National Bonus | |
| Crises | 12 | 3-16, split service/office | Competence and Reputation vs Heat; ceiling for standouts | |
| Life outside work | 12 | all, by age | Integrity vs Wealth; Competence (time) both | |
| Scandals and Heat | 8 | 3-16 | Heat up and down; Folder items | |
| Grassroots and constituency | 8 | 4-16 | Reputation vs Standing; Integrity both | |
| Traits (6 traits x 4 cards) | 24 | by trait | each trait's own axis | not built |
| Story chains (section 3) | 35 | across acts | see each chain | 25 cards, 5 chains (`chains`) |
| **New total** | **213** | | | |

That's 95 at the start plus 213 new: **about 308 distinct cards**, before alternate scenes.

Three packs outside this table have also been written: **Openings** (`openings`, 2 cards: the
scholar's and the graduate's first year), **Strange Years** (`strange`, 15 cards: one impossible
premise, processed as routine, in about a third of careers) and **The end of a career**
(`endgame`, 8 cards; DESIGN.md section 4).

### Seeds (one-line premises; writers turn these into cards)

**Ministries**, five each. All institutions are real; all people are invented. The four `fun/variety`
covered (Health, Manpower, National Development, Education; three cards each) need two more each.
- **Finance:** the Budget lockdown week; a ministry asks for a supplementary budget in October; the
  reserves question nobody may answer in public; GST vouchers' wording; a fiscal rule a Minister
  wants to "interpret".
- **Energy, Trade and Industry:** an investment pitch against a neighbour's tax holiday; a free trade agreement
  chapter on rules of origin; a plant closure announced on a Friday; Budget day productivity grants
  nobody applies for; a supply-chain scare.
- **Manpower:** a dormitory inspection; the Employment Pass salary threshold review; a Workplace
  Fairness complaint about your own division; tripartite talks at 2am; a heat-stress rule for outdoor
  work.
- **Education:** PSLE scoring bands and the parents' Facebook group; school mergers; a teacher's
  workload survey; a Direct School Admission complaint from someone you know; the ranking that was
  abolished and still exists.
- **Health:** a hospital bed crunch; a MediShield Life premium review; a drug subsidy decision with a
  name attached; eldercare beds near a void deck that residents oppose; a clinic's data breach.
- **Home Affairs:** a Home Team recruitment shortfall; a drug policy question at a dialogue; a casino
  exclusion appeal; a prison rehabilitation scheme nobody wants in their estate; a police camera rollout.
- **National Development:** a BTO launch with long waiting times; an en-bloc dispute; a void deck repurposed;
  a heritage building and a road; the Ethnic Integration Policy quota letter (handled with care and accuracy).
- **Transport:** a rail disruption at peak hour (also in Crises); COE bidding and a Minister's car; a
  cycling path nobody uses; the fare review formula; a new line's opening date slipping.
- **Sustainability and the Environment:** a hawker centre management model; the carbon tax rate; a
  flash flood at an underpass; Semakau landfill's remaining years; a dengue cluster in your estate.
- **Social and Family Development:** ComCare eligibility for a case at Meet-the-People; a baby bonus
  campaign slogan; a family violence protection order system upgrade; volunteer burnout at a family
  service centre; an assistance scheme with three application forms.

**The first years:** the induction programme's icebreaker; your first minute paper returned with one word;
the email you sent to "all"; the shared pantry's labelled yoghurt; a supervisor who takes credit; the
first time you are cc'd on something important.

**Postings and statutory boards:** a board whose CEO is a former general; a statutory board's annual
report photo shoot; a cluster reorganisation that moves you to an industry you know nothing about; a
sandbox regulator role; a corporatisation question.

**Overseas postings:** the embassy's National Day reception budget; a trade negotiation at 3am in another
time zone; an expatriate family question kept gender-neutral and optional; the posting that delays your ranking;
a visiting delegation that wants to see a hawker centre.

**The top of the service:** chairing a board of a statutory board you once worked in; a Committee of
Inquiry's terms of reference; Permanent Secretary succession planning, including your own; the ethics of
a post-retirement job offer; a speech written for you by someone who writes like you did.

**Backbench and junior office:** your first adjournment motion; a constituent's video going viral; the
Whip's text before a vote; a Government Parliamentary Committee report nobody reads; the Mayor's portfolio
(District Mayors are real and accurately modelled).

**Cabinet life:** the Cabinet paper with a "for decision" you disagree with; a reshuffle rumour; the
National Day Rally slide you are asked to cut; a ministerial statement on a U-turn; a junior office holder
who leaks.

**Crises:** a rail disruption at peak hour; a flash flood; haze at PSI levels that close schools;
a pandemic year (Multi-Ministry Taskforce, without real people); a government data breach and its Committee
of Inquiry; a supply shock on eggs or rice.

**Life outside work:** gender-neutral; no assumed partner or children unless chosen. A parent's
diagnosis and caregiving leave; CPF top-ups for a parent; a reunion dinner where a relative asks your grade;
a resale flat valuation; your own health screening result; reservist (NS) duty, but only as a trait or
origin option, never assumed.

**Scandals and Heat:** a gift that is slightly too valuable; a relative's business with a ministry;
a WhatsApp group screenshot; a speeding ticket in an official car; an old social media post resurfacing.

**Grassroots and constituency:** a grassroots adviser's dinner seating plan; a Residents' Committee
election nobody contests; a hawker who wants a rental waiver; the community club's Mid-Autumn budget;
the block party that needs a permit.

### Traits (chosen at the start, one per run; 6 traits x 4 cards)

**Not built.** The game has no traits yet, and the start screen does not offer one. The plan:
each trait gives a small stat nudge, sets a flag (`trait_<id>`) and unlocks four cards that need it,
within rule 5.14 of [`WRITING_RULES.md`](WRITING_RULES.md).
- **Thick Skin:** candour costs a little less Standing; cards about public criticism.
- **Knows Everyone's Birthday:** Standing grows quietly; cards about informal networks (and their Heat).
- **Spreadsheet Person:** Competence edge; cards where the numbers tell a story someone wants untold.
- **Speaks Three Languages:** Reputation edge in constituency cards; dialogue and grassroots cards.
- **Former SAF Regular:** a mid-career entrant (any gender); starts older with Competence; MINDEF-adjacent cards.
- **Former Teacher:** a mid-career entrant; Integrity edge; Education ministry and school cards.

(The engine change for traits, a start-screen pick plus a `trait` option to `newGame`, is
small and separate. It follows the batchmate option's pattern.)

## 3. Story chains

Each chain is written to rule 3.14 of [`WRITING_RULES.md`](WRITING_RULES.md): 3-5 cards over years,
linked by flags. Ten chains, 35 cards (the existing election card serves as one beat of The Boundary).

| Chain | Beats (years apart) | Flags and branches | Pays off in |
| --- | --- | --- | --- |
| **The Pilot** | design a pilot (AD) → its evaluation (2y) → the scale-up and who gets the credit (2y) → an audit (4y) | `pilot_honest` / `pilot_flattered`; credit shared or taken | Folder (flattered evaluation); Declassified ceiling line |
| **The Whistleblower** | a junior raises a concern → you protect, ignore or escalate (now) → an inquiry (3y) → they come back senior (8y) | `protected_source` / `ignored_concern` / `escalated` | Folder (ignored); legacy |
| **The Merger** | two statutory boards merge, you run integration → the headcount question (1y) → the new board's first crisis (2y) → the case study (5y) | `merger_cut_deep` / `merger_kept_people` | Competence vs Integrity; ceiling |
| **The Hawker Centre** | a management model tender (service) → stallholders' rents (2y) → it is in your ward (politics) → the opening ceremony | `chose_operator_model` / `chose_cooperative`; crosses service to politics | Reputation; a callback in the constituency |
| **The Old Flat** | a parent's flat and a lift upgrading vote → a fall and caregiving (3y) → selling or keeping the flat (4y) | `kept_flat` / `sold_flat`; caregiving leave taken or not | Wealth vs Integrity; legacy |
| **The Data Leak** | a breach in a system you own → the Committee of Inquiry (1y) → testimony → the reforms carry your name or not (2y) | `testified_fully` / `testified_narrowly` | Heat; Folder; Declassified exposure line |
| **The Protégé** | you mentor someone → they disagree with you in public (4y) → they outrank you (6y) | `backed_protege` / `checked_protege` | Standing; legacy; batchmate-like rivalry without the option |
| **The U-Turn** | you defend a policy in the House → it is reversed (2y) → you deliver the ministerial statement → Hansard remembers (5y) | `defended_hard` / `hedged` | Reputation vs Standing |
| **The Boundary** | the Electoral Boundaries Review Committee redraws your seat → your team is formed (1y) → the campaign → the result | `asked_for_smc` / `stayed_in_grc` | Election odds; a seat-specific re-election card |
| **The Bond** (scholar only) | the overseas master's offer (bond extended) → a bank offers to pay the bond (2y) → you sponsor the next cohort (10y) | `extended_bond` / `bought_out` / `stayed_bonded` | Scholar origin content (there was none when this was planned) |

**Written so far** (`web/content/packs/chains.json`): The Pilot, The Whistleblower, The Protégé, The U-Turn
and The Bond, with 25 cards in all, counting alternates. Changes from the table:
- The Protégé's beats are at 3 and 4 years. Its last beat is the promotion panel that would put the protégé level with you.
- The U-Turn starts with a Parliamentary Secretary or Senior Parliamentary Secretary answering questions. The Minister usually delivers the statement, and you decide what its paragraph four says about you. When the U-Turn started at any office holder's rank, its beats took the years in which the reshuffle is drawn, and the knows-the-win rate fell about 4 points.
- The Bond's mentor beat is 8 years after the bank's offer.
- Flag names start with the chain's name (`whistle_protected`, `protege_backed`, `bond_kept`), not
  the table's; the pack file is the source.

Measured over 400 runs per bot per origin, a chain is started in 4-17% of careers, and 50-67% of started chains reach their last beat. The Bond is started in about 20% of scholar careers.

**Engine hooks for chains.**
- **Declassified.** `declassifiedFlags` in `game.json` is a list of `{ "label", "requires", "text" }`. At the end of a run, for each label, the first entry whose `requires` hold adds one line, after Exposure (order them by rule 3.14).
- **A move between ministries.** When a choice moves the player to another ministry (`newMinistry`), the engine sets `moved_ministry`. A chain that starts in a ministry can require it to be absent at its first beat. A later beat then knows whether the player is still there.
- **The bond.** A choice's `bond: N` adds N years to the bond, served after any bond still running, and `notDuringBond` cards wait for them. `requires.duringBond` holds only while a bond runs.

## 4. Alternate scenes, series and Meanwhile lines

A card gets two or three alternate scenes when it appears in more than about 40% of runs
(`test/variety.js`), or when it is structural (tea, vetting, election, succession). Write them to
rules 3.8 and 3.9 of [`WRITING_RULES.md`](WRITING_RULES.md): the same decision, mechanically
identical, in a different scene.
- **Deterministic.** Scenes live in a card's `variants` list. The first showing in a run is picked from
  the seed, preferring a scene the phone has not shown in its last two runs; a card shown again in the
  same run (a repeat card) moves on to its next scene. The freshness memory is part
  of the replay key, so a replay shows the same scenes. Rank variants (the existing `alternates` field)
  still pick by state.

**Series: one decision that comes back.** Some sibling cards are one decision made in different
weather: the National Bonus and the Budgets after it (the Indicators in a strong year, in a downturn
and before an election); the improvement plan and the Whip's word. Each card says
`"series": { "key": "indicators", "full": 2 }`, and each choice names its `"stance"` (the same stance
names on every card of the series). The series is shown in full `full` times a career: the National
Bonus card and one Budget; the improvement plan and the Whip's word say `"full": 99`, so they are
always shown in full. A card with `"opens": true` in its series is the series' first showing, drawn only
before the series has begun: the National Bonus card opens the Indicators (it is a priority card), so
every Budget card is a second showing, which names the choice made on it and never explains the bonus
again. After that, a card of the series passes as a Meanwhile year: the
habit (the stance last chosen) is applied in full, mechanics included (the National Bonus it sets,
the cooldown), with a Meanwhile line for that card and stance. The second full showing may have its own scene, `"again"`, written per stance in
`again.scenes`: the habit is the default and is shown first, and the question is whether to break it,
knowing it will not be asked again. `again.keep` and `again.change` are added to the effects of keeping
the habit and of breaking it, so the second time has its own stakes (rule 5.12).

**Repeatable cards are series.** A card that can come up more than once in a career (the work, a
quiet year, the appraisal conversation, a late night, a Parliamentary Question, the walkabout) is a
series of its own or with its siblings, so it never asks its question again as if new (rule 5.15):
`"series": { "key": "effort", "full": 2, "spend": true }` and `"noMontage": true`, with a `stance` on
each choice. Shown in full twice, its second showing (`again`) asks whether to keep the habit; with
`"full": 1`, it is shown once and then passes. Sibling cards that pose the same decision share the
series: the work and a quiet year are one series (substance, visibility or rest), a late night and
approved leave another (work or life), and the graduate's and the scholar's first cards open the series
the new reporting officer closes (`"opens": true`). With `spend`, a card whose lines for the habit
have all been shown is not drawn again that run; without it (the Budgets, which set the National
Bonus every cycle), a series takes its lines again in order.

**Meanwhile lines.** A series card keeps its lines in `montageLines`, keyed by stance; a safe
re-election has its own list (`autoPlay.lines`). A run never shows the same line twice: each card and
habit takes its lines in an order drawn from the seed, preferring lines the phone has not shown in its
last two runs. Write at least four per stance (more for a card drawn often), to rules 2.11, 3.12 and
3.13. (A repeatable card outside a series, keyed by choice index, still works for an old save: it
comes back in full every fourth time, in a scene the run has not shown. No card is written that way now.)

**One decision, once.** Before a new card goes in, check its decision against the cards it can meet in
one career (the audit in `reports/duplicates-audit.md` lists every decision by group). When the new card
poses a decision another card already poses, close matches included, give both `"exclusive": "<group>"`
(a chain through its first card), or rewrite the new one until its decision is different. When the new
card would come earlier in a career than the group's best card and starve it, rewrite rather than
exclude. Rule 5.15 has the details; `node test/duplicates.js` checks the result.

## 5. The quality bar (every card, every pack)

Every card meets every rule in [`WRITING_RULES.md`](WRITING_RULES.md): voice and tone, Plain
English, story logic and continuity, the cast, choices and consequences, realism and satire, what
the player is shown, and the never list. The rulebook names the test that checks each rule, or says
it is editor review only, and the pack checklist (section 7) runs those tests. Rules are not
repeated here, so the two files cannot disagree.

### 5a. Plain English (the owner's rule, from playing on a phone)

Now group 2 of [`WRITING_RULES.md`](WRITING_RULES.md), with the owner's before-and-after examples:
setup first, nothing that needs decoding, every pronoun pointing at something on the same screen,
jargon introduced from the story before it is used, and consequences said plainly. Its parts about following a story across cards are rules 3.3 and 3.4
(nothing out of nowhere; a follow-up names its cause), 4.3 and 4.4 (people named, introduced and
tagged), 4.8 (no pronoun for an office) and 6.4 (the header's ministry).

## 6. How packs are stored and loaded

A pack is `web/content/packs/<id>.json`:
`{ "id": "<id>", "title": "...", "events": [ cards in the events.json format ] }`.
- **Loading order:** packs are listed in `web/content/packs/manifest.json` and loaded in that order
  after `events.json`, by `web/packs.js`. The phone (`ui.js`) and the harness assemble through it;
  the Pages content check reads the same manifest.
- **Tagging and checks:** each card is tagged with its pack. A duplicate id anywhere (events,
  packs, batchmate cards), a malformed pack, a missing pack file or a malformed player table
  (`player` in `game.json`) stops the build.
- **Offline:** the service worker caches the listed packs for offline play.
- **Starter file:** `example.json` is an empty pack to copy.
- **Hidden witnesses:** a card's `witnesses` field lists who could plausibly know what the player
  did there, by kind (`witnesses.types` in `game.json`): `{ "by": { "<type>": { "chance", "react",
  "requires"? } } }`, with one reaction per choice, from -5 to +4. Service cards take the service's
  kinds (`countersigner`, `owner`, `panel`, `floor`, `ministersOffice`, `agencies`); politics cards
  take the politics kinds (`leadership`, `whips`, `branch`, `pressGallery`, `officials`,
  `fellowMPs`); a card shown on both ladders may list both. Rule 5.6 says which cards get them.

## 7. Writing workflow (parallel writer agents)

**Order.** Gaps first, then the packs that multiply variety:
1. The first years. *(Written.)*
2. Ministries (the six `fun/variety` does not cover first).
3. Backbench and junior office. *(Written.)*
4. The top of the service.
5. Crises.
6. Story chains. *(Five of ten written.)*
7. Life outside work.
8. Postings and overseas.
9. Cabinet life.
10. Scandals.
11. Grassroots.
12. Traits, once the trait mechanism lands (not built).

**One agent per pack, one file per pack, one branch per batch of packs.** Writers never edit
`events.json`, `game.json` or another pack's file, so they can run in parallel without conflicts.

**Pack checklist** (the writer completes it in the PR description):
- [ ] Cards match the pack's band, count and both-ways stat targets; seeds used or replaced with better ones.
- [ ] Every card read against [`WRITING_RULES.md`](WRITING_RULES.md), including the rules checked by editor review only.
- [ ] Every fact sourced (one line each); no real people.
- [ ] Every new term of jargon listed in `web/content/jargon.json` with its entry points, and `node test/jargon.js` passes.
- [ ] Every card has its hidden witnesses where a believable one exists (rule 5.6), from its own ladder's kinds, with helping and hurting roughly level; cards left without are named, with the reason.
- [ ] `node test/contexts.js` passes, with zero contradictions.
- [ ] `node test/similarity.js` passes, with no new near-duplicates.
- [ ] Every card's decision checked against the audit's groups (rule 5.15): a card that poses one joins its group with `exclusive`, or is rewritten; `node test/duplicates.js` passes.
- [ ] `node test/harness.test.js` passes; `node test/sim.js` lists no new dominated choice.
- [ ] Balance: `node test/sim.js regress 800` passes, alone and with the batchmate.
- [ ] Two careers played through that hit the pack's cards; every screen read.

**Review.** Three steps:
1. The content auditor (Opus, about $0.20 a pass) audits the pack, with immersion as rule 6. All
   must-fix findings are fixed.
2. The supervisor reads a sample: every card in a small pack, and a third of a large one.
3. The owner reads three cards per pack, chosen by the supervisor as the riskiest for tone or accuracy.

Packs merge only after the owner's read.

**Measuring.** After every two packs, rerun `test/variety.js`. The targets: a second run shares
at most about 40% of its cards with the first, and no card that isn't structural appears in more
than about 60% of runs. Then rerun a blind agent cohort when credits allow.

## 8. The run's cast and card parts

A second career should not replay the first. Two engine features multiply what one card can be,
without letting the game contradict itself. Both are text-first: they never use the run's dice, and
a card that uses them plays exactly as it did before, mechanically.

### The cast

Every run draws a small set of recurring people from the seed: names, pronouns and ages, from the
pool in `web/content/game.json` (`cast.names`; invented, across communities, never a real public
figure, never sharing a name with the batchmate or with each other). The same peer can carry your
intake's story across a career; the next run has different people.

| Role | Who | Present while | Grade |
| --- | --- | --- | --- |
| `peer` | an officer from your intake | always (stays in the service if you leave it) | moves up alongside you; at their own pace once you are in politics |
| `junior` | an officer who reports to you | you are in the service, from your first promotion | one or two grades below you, never level with you |
| `senior` | a mentor or boss figure | you are in the service below Permanent Secretary | two or three grades above you; moves on when you reach their grade |
| `journalist` | a journalist on the public-service beat | always | correspondent, then senior correspondent, then political editor |
| `grassroots` | a grassroots leader in your ward | you are in Parliament | CCC, RC or CCMC chairman |
| `mp` | a fellow MP | you are in Parliament | Member of Parliament, or higher if a choice promotes them |

**Tokens.** `{peer}` is the name as the role calls them (a peer or junior by given name, a senior or
grassroots leader as "Ms Chua" or "Mdm Rohani", a journalist by full name). Fields:
`{peer.full}`, `{peer.given}`, `{peer.formal}`, `{peer.title}` (their grade now, from their rank),
`{peer.aTitle}` ("an Assistant Director"), `{peer.years}` ("three years" in the role),
`{peer.they}`, `{peer.them}`, `{peer.their}`. Capitalise the role or the field for a capital:
`{Peer.They}`. The engine introduces a person on the first card they appear on (each role's `intro`
in `cast.roles`); how to leave room for that, and the rules for pronouns and grades, are rules 4.4,
4.6 and 4.7 of [`WRITING_RULES.md`](WRITING_RULES.md).

**Drawing.** A card that names a role in its own text can only be drawn while that role is filled.
`requires.cast` adds conditions on the person: `{ "peer": { "flagsAll": [...], "flagsNone": [...],
"minRank": 3, "maxRank": 6, "minYears": 2 } }`, or `{ "peer": false }` for a vacant role.

**Choices.** A choice may change the person the card named:
`"cast": { "peer": { "flags": ["owes_you"], "unflags": ["fell_out"], "promote": 1, "leave": "private sector" } }`.
Flags stay with that person; `promote` moves them up a grade at once; `leave` ends their part in the
run. A choice only changes someone the card actually named as shown (another version of the card, or
a part option that did not mention them, leaves them alone). Useful flags: `owes_you`, `fell_out`,
`you_said_no`, plus one per thing you did ("lost_the_box", "kept_late").

**Lifecycle.** People retire, are caught up with (a senior), are promoted to your grade (a junior),
or stay behind when you leave the service. A role refills after `refillYears` with a new person who
has no history: flags never pass to a successor, so a callback that requires a flag can only ever
name the person it remembers. An outcome screen carries at most one line about these changes
(`cast.lines`): someone you have history with first, then the peer, senior, journalist, junior,
grassroots leader and fellow MP, a departure before an arrival; nobody who arrives and leaves within
one screen is mentioned. Each kind of line has three or four versions, taken in an order drawn from
the seed; neither a line nor any sentence in it is shown twice in a career, by this pool or any
other (rule 3.13). Write new ones there, to rules 3.13 and 4.5.

**Worked example: the junior.** `late_night` names the junior and records how you treated them:

```json
"body": "It's 11:40pm, and your paper has come back for the fourth time with comments from the people who have to clear it. It's due upstairs in the morning. {junior} is still at {junior.their} desk, waiting to see what you decide. The dinner you promised to be home for was at eight.",
"choices": [
  { "text": "Finish it tonight.", "cast": { "junior": { "flags": ["kept_late"] } },
    "outcome": "It's cleared at 1:20am, with {junior} proofreading the annexes. You're both thanked in one email of one word. ..." },
  { "text": "Go. Send it in the morning.", "cast": { "junior": { "flags": ["sent_home"] } },
    "outcome": "You send {junior} home first, and make it home yourself in time for dessert. ..." }
]
```

Years later, `the_ask` remembers it, but only for that same person (a part option, below):
`{ "id": "junior_late", "prefer": true, "text": "{junior}, who once proofread your annexes until 1:20am,",
"requires": { "cast": { "junior": { "flagsAll": ["kept_late"] } } } }`. A scheduled callback works the
same way: `budget_committee` requires `{ "cast": { "peer": { "flagsAll": ["lost_the_box"] } } }`, so it
fires only while the peer you beat to the box is still your peer; if they have gone, it never fires.

### The player

The start screen asks for a name and a gender (both remembered on the phone). The choices are the
table `player.genders` in `game.json`: each has a `label` (the button), an `honorific`, its pronouns
and any other token fields, and a `pool` (the `cast.names` pronoun a blank name is drawn from). A
blank name is drawn for the run from that pool. Like the cast, both are text only: they
never use the run's dice, and the same seed plays the same career either way. Nobody in the run shares
a word of the player's name: a cast member or batchmate who would is given another name.

**Tokens.** People say the player's name differently by who they are and where they are, so the one
name field gives three forms (there is no second box on the start screen):

| Token | "Lim Wei Ling", Female | Who says it |
| --- | --- | --- |
| `{player.given}` | Wei Ling | colleagues, peers, your reporting officer or anyone senior speaking to you directly, friends, the batchmate |
| `{player.formal}` | Ms Lim | officials in a formal or serious setting (an inquiry, HR in writing, a minister in a meeting), residents, the press |
| `{player.full}` | Ms Lim Wei Ling | documents and the record: Hansard and the House, award lists, plaques and nameplates, a paper's footer, a letter's address line |

The honorific is the choice's, or one typed with the name ("Dr Tan Wei Ling" is "Dr Tan" formally).
A drawn name takes the pool's own `given` and `formal` (`cast.names`). A typed name is read by the
lists in `player.names` (`game.json`), for Singapore's naming conventions; it is sensible rather than
perfect, and every form is made of the words typed, so the text is never broken:

- a Chinese surname first (`chineseSurnames`, in Hanyu Pinyin and dialect spellings): "Lim Wei Ling" is Wei Ling, Ms Lim;
- a surname last, Western order: "Charmaine Ang" is Charmaine, Ms Ang; "Charmaine Tan Wei Ling" is Charmaine, Ms Tan; "Marcus de Souza" is Marcus, Mr de Souza; a last word in no list is read as a surname too;
- bin or binte, s/o or d/o (`patronymics`): no surname, so formal uses the given name: "Nurul Huda binte Rahmat" is Nurul Huda, Ms Nurul Huda; a Malay first name (`noSurname`) reads the same without bin; "Muhammad", "Mohd" and "Siti" are left off the given name (`dropFromGiven`);
- a father's name last (`fatherNames`): "Kavya Rajan" is Kavya, Ms Kavya, and Ms Kavya Rajan in full; an Indian family name last (`surnames`: Pillai, Nair, Kaur...) is a surname;
- a Chinese given name alone (`chineseGiven`): "Jia Hui" is Jia Hui, Ms Jia Hui;
- a single word is all three forms.

`{player}` on its own is still filled (the name as entered), but content always says which form it
means, and the lint fails it. `{player.<field>}` is that field of the player's choice:
`{player.they}`, `{player.them}`, `{player.their}` today, and any field added to every choice in the
table (except `name`, `given`, `formal` and `full`, the name's own). Capitalise the role or the field
for a capital: `{Player.They}`.

**Where.** The game says "you", so the player is named only where someone else names or addresses
them, and lightly: the papers and the Forum page, Hansard and the House, a document's footer, an
official addressing the player ("Thank you, {player.formal}. That was very complete."), a colleague
("So, {player.given}, what do you actually think we're getting wrong?"), the batchmate, a cast line,
the ending card and the Declassified file. The tokens are filled in card bodies, outcomes, choice
text and titles, the batchmate's lines, cast lines, Folder items, the ending card and the
Declassified file; never in montage or autoplay lines. Which form to use, and why the tokens stay
out of choice text anyway, are rules 4.1, 4.2 and 4.7 of [`WRITING_RULES.md`](WRITING_RULES.md).

### Card parts

A card may declare `parts`: named slots, each with interchangeable options. The card's title, body,
choices and outcomes use `{slot}` (the option's `text`), `{Slot}` (capitalised) or `{slot.field}`
(any other string on the option). Each showing assembles one combination.

- **Which combination.** Options whose `requires` hold (rank, `act`, flags, `cast`, and earlier slots'
  picks via `"parts": { "want": ["reference", "read"] }`), in an order drawn from the seed, preferring
  options this phone has not shown in its last two runs and this run has not shown yet. `"prefer": true`
  wins ties (use it for callbacks). A card is only drawn when some combination fits.
- **Conditional text.** A slot written `{ "pick": "first", "options": [...] }` takes the first option
  that fits, in order: the way to name someone only if they are still there, with a fallback.
- **Stakes.** An option may add to the card's choices (`"effects": { "*": {...}, "1": { "standing": -3 } }`)
  or scale them (`"scale": { "heat": 1.5 }`), so who is asking changes the price, within rule 5.4.
- **With variants and alternates.** Parts are shared by every version of the card, and a version's
  text may use them. A scheduled card's `alternates` are chosen first, then its parts.
- **Not in** montage lines, autoplay lines, a repeatable card's title, or the Folder: nothing fills
  them there.

**Worked example: Reply All.** Three slots of three options make 27 scenes from one card:

```json
"parts": {
  "sent": [ { "id": "draft", "text": "your draft reply, with your notes to yourself still in square brackets", "fix": "Your correction is two lines long. ..." },
            { "id": "attachment", "text": "last year's figures, attached instead of this year's", "fix": "..." },
            { "id": "aside", "text": "the words \"Is this serious?\" in a reply meant for one person", "fix": "..." } ],
  "to": [ { "id": "division", "text": "the whole division", "joke": "..." },
          { "id": "agencies", "text": "forty-one agencies", "joke": "..." },
          { "id": "minister", "text": "the Minister's office", "joke": "...", "effects": { "0": { "standing": -1 }, "2": { "standing": -3 } } } ],
  "noticed": [ { "id": "peer", "text": "{peer} messages you within the minute: \"Check your sent folder.\"" },
               { "id": "senior", "text": "{senior} replies to all, \"Noted, thanks,\" which keeps the thread alive into the weekend." },
               { "id": "nobody", "text": "Nobody says anything. Everyone has read it." } ]
},
"body": "At 4:52pm on a Friday, you accidentally send {to} {sent}. Email recalls rarely work, and on Monday everyone will remember whose name was on it. {noticed}",
"choices": [ { "text": "Send a short correction to everyone, now.", "outcome": "{sent.fix}", ... },
             { "text": "Recall it, and hope.", "outcome": "The recall reaches the people who had not opened it. ...", ... },
             { "text": "Reply all once more, with an apology and a joke.", "outcome": "{to.joke}", ... } ]
```

Every combination must read well (rule 3.10), and an assembled body or outcome keeps to the usual
lengths (rules 2.9 and 2.10).

### Checks

- `node test/contexts.js` re-renders every cast or parts card in every context it was seen to fire in
  (rank, act, origin, who holds each role and what they remember), with every version and every part
  combination that fits there (a sample when there are more than 64), and lints the text: no raw
  `{token}`, nobody vacant or departed named, every grade beside a name right for that person's rank,
  a senior above you and a junior below, names unique in the run, and every callback that names a role
  checking that it is the person the earlier choice was about.
- `node test/contexts.js` plays its careers as Female and as Male, under typed names and drawn ones;
  it fails on a player token with an unknown field, a gendered word addressing the player, the wrong
  honorific before the player's name or surname, and a cast member or batchmate who shares a word of
  it. From the content alone, it fails `{player}` on its own and a colleague calling you by
  `{player.formal}` or `{player.full}` (rule 4.1 says how it decides who is speaking).
- `test/harness.test.js` reads a table of sample names into their three forms, and every name in the
  cast pool as the pool reads it.
- `node harness/leak-check.js` fails on any raw `{token}` on screen, and on the wrong honorific before
  the player's name; `node agents/leak-check.ts` plays each blind persona's careers under its own name
  and gender and checks every screen the same way.
- `node test/similarity.js` reads cards as assembled, with names filled by placeholders.
- `node test/variety.js` reports next-run overlap by card, by version (card, variant and parts) and by
  scene (version and the people it names).
- The trace records, per turn, the part options used (`event.parts`) and the people named (`event.cast`).
