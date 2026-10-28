# Content plan: from 88 cards to about 300

Today a second playthrough shares about 60% of its cards with the first, so the game is mostly
seen after one or two careers. This plan grows it to about 300 cards. The new cards come as themed
packs, story chains, alternate scenes and traits, written by parallel writer agents to one quality bar.
It sets the targets and the process; the cards themselves are written pack by pack.

Measured on `fun/next` (09a28e5): 88 cards in `events.json`, 7 batchmate cards in `rival.json`,
11 endings. Re-run the numbers with `node test/variety.js` (once `fun/variety` lands),
`node test/contexts.js` and `node test/similarity.js`.

## 1. What exists today

| Kind | Cards | Notes |
| --- | --- | --- |
| Drawable pool, civil service only | 32 | 12 of the 47 pool cards are repeatable fillers |
| Drawable pool, politics (MP and up) | 14 | |
| Drawable pool, spans both | 1 | |
| Structural (tea, vetting, election, re-election, succession) | 5 | in every political career |
| Consequences and callbacks | 29 | fire only after a choice |
| Alternate scenes (rank variants) | 7 | of `ally_returns` and `scholar_returns` |
| Origin-only (poly) | 3 | none for scholar or grad |
| Batchmate (`rival.json`) | 7 | only with the start-screen option |

Where the pool cards can appear, by rank band (a card can cover several bands):

| Rank band | Pool cards reachable |
| --- | --- |
| Management Executive, Senior ME (0-1) | 12 |
| Assistant Director, Deputy Director (2-3) | 31 |
| Director, Senior Director (4-5) | 30 |
| Deputy Secretary, Permanent Secretary (6-7) | 16 |
| MP, Parliamentary Secretary, Senior Parliamentary Secretary (8-10) | 8 |
| Minister of State up to Prime Minister (11-16) | 14 |

**Gaps.** These are the places a returning player will notice repetition first.
- **The first years:** 12 cards for ranks 0-1, which every career passes through.
- **The top of the service:** 16 cards for Deputy Secretary and Permanent Secretary.
- **Backbench to Senior Parliamentary Secretary:** 8 cards.
- **No ministry content:** ten ministries exist, but only `fun/variety` adds cards for four of them.
- **One crisis card** in the whole game (`the_crisis`).
- **Life outside work** is two cards (`bto_queue`, `late_night`).
- **No traits,** and no origin content for scholars or graduates.
- **Few new sources of Heat** outside the original compromise cards.

## 2. The packs

Each pack is one file, `web/content/packs/<pack>.json` (section 6). The table's counts are new
distinct cards. Alternate scenes are extra and counted in section 5.

| Pack | New cards | Rank and act bands | Pushes both ways |
| --- | --- | --- | --- |
| Ministries (10 packs, one per ministry) | 50 (5 each; 12 of them come from `fun/variety`) | service 2-7, office holders 11-16; split where the text differs | Standing vs Integrity; Competence vs Reputation; Heat both |
| The first years | 12 | 0-1 | Competence vs Standing; Integrity both |
| Postings and statutory boards | 12 | 2-6 | Competence vs Standing; ceiling up via proving grounds |
| Overseas postings | 8 | 3-6 | Competence and ceiling vs Standing (out of sight) |
| The top of the service | 10 | 6-7 | Standing vs Integrity; Reputation both |
| Backbench and junior office | 12 | 8-10 | Reputation vs Standing (with the Whip) |
| Cabinet life and portfolios | 10 | 11-16 | Standing vs Integrity; Reputation both; National Bonus |
| Crises | 12 | 3-16, split service/office | Competence and Reputation vs Heat; ceiling for standouts |
| Life outside work | 12 | all, by age | Integrity vs Wealth; Competence (time) both |
| Scandals and Heat | 8 | 3-16 | Heat up and down; Folder items |
| Grassroots and constituency | 8 | 4-16 | Reputation vs Standing; Integrity both |
| Traits (6 traits x 4 cards) | 24 | by trait | each trait's own axis |
| Story chains (section 3) | 35 | across acts | see each chain |
| **New total** | **213** | | |

That's 95 today plus 213 new: **about 308 distinct cards**, before alternate scenes.

### Seeds (one-line premises; writers turn these into cards)

**Ministries**, five each. All institutions are real; all people are invented. The four `fun/variety`
covers (Health, Manpower, National Development, Education) need two more each.
- **Finance:** the Budget lockdown week; a ministry asks for a supplementary budget in October; the
  reserves question nobody may answer in public; GST vouchers' wording; a fiscal rule a Minister
  wants to "interpret".
- **Trade and Industry:** an investment pitch against a neighbour's tax holiday; a free trade agreement
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

Each trait gives a small stat nudge, sets a flag (`trait_<id>`) and unlocks four cards that need it.
Traits must never be required to win, and every origin can take every trait.
- **Thick Skin:** candour costs a little less Standing; cards about public criticism.
- **Knows Everyone's Birthday:** Standing grows quietly; cards about informal networks (and their Heat).
- **Spreadsheet Person:** Competence edge; cards where the numbers tell a story someone wants untold.
- **Speaks Three Languages:** Reputation edge in constituency cards; dialogue and grassroots cards.
- **Former SAF Regular:** a mid-career entrant (any gender); starts older with Competence; MINDEF-adjacent cards.
- **Former Teacher:** a mid-career entrant; Integrity edge; Education ministry and school cards.

(The engine change for traits, a start-screen pick plus a `trait` option to `newGame`, is
small and separate. It follows the batchmate option's pattern.)

## 3. Story chains

Each chain is 3-5 cards over years. A choice sets a flag; the next card is scheduled with `inYears`
and a chance; branches are mutually exclusive flags. Each chain feeds the Folder (a compromise) or
Declassified (a line naming the chain) at least once. Ten chains, 35 cards (the existing election card serves as one beat of The Boundary).

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
| **The Bond** (scholar only) | the overseas master's offer (bond extended) → a bank offers to pay the bond (2y) → you sponsor the next cohort (10y) | `extended_bond` / `bought_out` / `stayed_bonded` | Scholar origin content (none exists today) |

## 4. Rules for alternate scenes

A card gets two or three alternate scenes when it appears in more than about 40% of runs
(`test/variety.js`), or when it is structural (tea, vetting, election, succession).
- **Mechanically identical.** Every scene keeps the same id family, requires, choice count and order,
  effects, flags, schedules and election kinds. Only the body, outcomes and choice wording change. Callbacks,
  the Folder and the harness all see one card.
- **Different scene, same decision.** A different room, person, weather or document, not a reworded
  sentence. Sibling scenes should stay below 0.35 on the similarity check's 4-gram measure. The
  check exempts families from worn-phrase counts but not from this.
- **Fixed per run.** The scene is picked deterministically per run (seeded), so a replay shows the same
  scene. Rank variants (the existing `alternates` field) still pick by state.

## 5. The quality bar (every card, every pack)

1. **The five tone rules:**
   - Institutions are real and accurately modelled; people are invented, and no real politician is
     named, depicted or caricatured.
   - Punch at the machinery, never at persons.
   - Deadpan; never wink.
   - Accuracy is the joke.
   - Write with affection.
2. **Accuracy.** Check every institutional fact against a primary or official source (PSD, MOF, the
   Parliament website, statutes, ministry sites). Put the source in the pack's PR description, one line
   per fact. Facts that change (pay, thresholds, targets, names of schemes) must match today's values.
   Example: political pay follows the 2026 framework (MR4 $1.8m, PM 2x MR4).
3. **Immersion.** Every line must make sense in every situation the card can fire in. Run
   `node test/contexts.js`; zero contradictions. The player is gender-neutral, with no assumed
   family; a batchmate's or colleague's pronoun is fixed per person.
4. **Genuine choices.** At least two choices, each costing something. No choice may be worse on
   every stat (check with the bot dominance metric in `node test/sim.js`). Use three choices when the
   third is a real third way, not a "do nothing" filler.
5. **Length.** Today's median body is 30 words (90th percentile 45) and the median outcome 25
   (90th percentile 36). Keep bodies to 25-45 words and outcomes to 15-35. Choice text is one line,
   up to about 12 words.
6. **Vary the joke's structure.** Rotate between:
   - the number;
   - the euphemism decoded;
   - the institutional detail as punchline;
   - the quiet consequence;
   - the reversal;
   - the understatement.

   No more than two cards per pack may end on a ", which is ..." clause or open with "It is a ...".
7. **Similarity.** `node test/similarity.js` must pass. A pack must not add a new near-duplicate,
   and must not push a phrase or opener over its warning count.

## 6. How packs are stored and loaded

A pack is `web/content/packs/<id>.json`:
`{ "id": "<id>", "title": "...", "events": [ cards in the events.json format ] }`.
- **Loading order:** packs are listed in `web/content/packs/manifest.json` and loaded in that order
  after `events.json`, by `web/packs.js`. The phone (`ui.js`), the harness and the Pages content check
  all assemble through it.
- **Tagging and checks:** each card is tagged with its pack. A duplicate id anywhere (events,
  packs, batchmate cards), a malformed pack or a missing pack file stops the build.
- **Offline:** the service worker caches the listed packs for offline play.
- **Starter file:** `example.json` is an empty pack to copy.

## 7. Writing workflow (parallel writer agents)

**Order.** Gaps first, then the packs that multiply variety:
1. The first years.
2. Ministries (the six `fun/variety` does not cover first).
3. Backbench and junior office.
4. The top of the service.
5. Crises.
6. Story chains.
7. Life outside work.
8. Postings and overseas.
9. Cabinet life.
10. Scandals.
11. Grassroots.
12. Traits, once the trait mechanism lands.

**One agent per pack, one file per pack, one branch per batch of packs.** Writers never edit
`events.json`, `game.json` or another pack's file, so they can run in parallel without conflicts.

**Pack checklist** (the writer completes it in the PR description):
- [ ] Cards match the pack's band, count and both-ways stat targets; seeds used or replaced with better ones.
- [ ] Every fact sourced (one line each); no real people.
- [ ] `node test/contexts.js` passes, with zero contradictions.
- [ ] `node test/similarity.js` passes, with no new near-duplicates.
- [ ] Dominance check: no dominated choice.
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
