# Writing rules

Every rule for writing Minister Salary's cards, lines and stories, in one place. This file is the
only source: `docs/CONTENT_PLAN.md` (how packs are planned and written) and `docs/DESIGN.md`
section 12 (tone) link here instead of restating rules. When a rule changes, change it here.

Each rule says what to do and why, gives a before → after example where one helps, and says how it
is checked: by a named test, or by editor review only. Editor review means the supervisor's and the
owner's reads. The content auditor (`node agents/audit.ts`) also flags tone and accuracy, and the fun
cohorts flag lines that broke tone (`off_tone`) or that they could not follow (`unclear`).

| Test | What it catches | Runs |
| --- | --- | --- |
| `node test/contexts.js` | Lines that contradict where a card fires; cast, parts and player-token mistakes in every context; a colleague calling you by `{player.formal}` or `{player.full}` | By hand, per the pack checklist. Its static checks also run in CI, inside `test/harness.test.js` |
| `node test/similarity.js` | Near-duplicate cards, worn phrases, worn sentence openers | CI |
| `node harness/leak-check.js`, `node agents/leak-check.ts` | Anything on screen the player must not see: numbers, ids, raw tokens, the wrong honorific; hidden terms in blind playtesters' prompts | CI |
| `node test/harness.test.js` | Every part combination and second-showing scene; batchmate cards; the stat words; the end of a career; grade wordings; gender as text only | CI |
| `node test/sim.js regress` | Missing text, outcomes or scheduled cards; consequences dropped. It also reports dominated choices and stats pushed one way, without failing | CI |
| `node test/jargon.js` | A player meeting a term before any of its entry points (`web/content/jargon.json`) | Being added |
| `node test/castlines.js` | A person named outside a card without saying who they are | Being added |
| `node test/repeats.js` | A sentence shown twice in one career (from 1,800 played careers), outside a short list of structural lines | CI |
| Pages "Validate content" step | Duplicate ids, missing scheduled cards, a choice without text or an outcome | On every deploy |

## 1. Voice and tone

**1.1 Institutions are real; people are invented.** Ministries, grades, schemes, CPF, GRCs and the bonus formula are real and modelled accurately; every named person is fictional.
- Why: accuracy is the joke, and the game must stay shippable in the country it is about.
- Check: editor review only.

**1.2 Punch at the machinery, never at a person.** The comedy is in the process: the euphemism, the acronym, the twelve-page paper that concludes further study is needed.
- Why: a joke about a stupid person is cheap and cruel; a joke about a process is recognised.
- Example: "Your director is too lazy to read it." → "Your director asks for the paper to be shorter, then for an annex with everything that was cut."
- Check: editor review only.

**1.3 Deadpan.** State it and move on. The funniest line is a number in a table.
- Why: the institution's calm is the joke; a laugh track kills it.
- Check: editor review only (winking is rule 8.2).

**1.4 Clear setup, light punchline.** The setup gives every fact the joke needs; the punchline then lands in as few words as possible and never explains itself.
- Why: in the owner's words, "too explicit makes it no longer funny"; too cryptic, and nobody gets it.
- Example: too cryptic: "It also lifts one of the four indicators in your own bonus formula. Both things are true, and nobody, ever, mentions the second one." Too explicit: "That is also one of the four targets, so your own bonus goes up too. Everyone can see this. Nobody ever says it out loud." Right: "... and it works: the lowest incomes rise. Your bonus rises too, but no one talks about it."
- Check: editor review only.

**1.5 Accuracy is the joke.** Grades, titles, acronyms, pay, electoral rules and processes are right, and facts that change (pay, thresholds, targets, scheme names) match today's values. Check each fact against a primary or official source (PSD, MOF, the Parliament website, statutes, ministry sites) and put the source in the pack's PR, one line per fact.
- Why: a Singaporean player recognising a real appraisal phrase is worth more than any punchline.
- Example: political pay follows the 2026 framework (MR4 $1.8m, PM 2× MR4).
- Check: `test/harness.test.js` checks the ladder's pay and age floors against the published figures; every other fact, editor review only.

**1.6 Affection.** Write as someone who knows the system, not someone sneering at it from outside.
- Why: critical and affectionate go together; contempt does not.
- Check: editor review only.

**1.7 Singaporean voice.** Use local names and terms as locals say them (HDB, PUB, NParks, GRC, RC, void deck, the Whip), never with a dictionary-style gloss: no brackets, no "which means". A term becomes clear through the story (rule 2.6).
- Why: a gloss steps out of the world; the story can explain a term without leaving it.
- Example: "your HDB (public housing) flat" → "the three-room HDB flat you grew up in".
- Check: editor review only.

**1.8 Vary the joke's shape.** Rotate between the number, the euphemism decoded, the institutional detail as punchline, the quiet consequence, the reversal and the understatement. No more than two cards per pack end on a ", which is ..." clause or open with "It is a ...".
- Why: a joke template wears out by the third time a player sees it.
- Check: editor review; `test/similarity.js` fails a sentence opener shared by 14 or more cards.

**1.9 No worn phrases or near-duplicates.** A pack adds no new near-duplicate and pushes no phrase or opener over its warning count. The limits: two bodies, two outcomes, two Meanwhile lines or two epitaphs sharing word 4-grams (Jaccard 0.22 warns, 0.5 fails); a phrase of 4-6 words with two content words, across 4 cards warns, 10 fails; a 3-word sentence opener across 6 cards warns, 14 fails. Text is read as assembled, with names filled in; a card's own versions and alternates count as one card.
- Why: repetition is what a returning player notices first.
- Check: `test/similarity.js` (fails at the hard limits; the warnings are for the editor).

## 2. Plain English

**2.1 Understood on the first read.** A player who has never worked in government understands every card the first time through.
- Why: on a phone nobody rereads; a line that needs decoding is skipped, and so is its joke.
- Check: editor review only; the fun cohorts' `unclear` flags point at lines that failed (`agents/README.md`).

**2.2 Setup first.** The body's first sentence says what is happening, explicitly; the next says why it matters to you; then the joke. The logic of the situation is on the screen: what the document is, who approves it, what happens if it goes wrong.
- Why: the joke only lands once the player knows what is at stake.
- Example (approved by the owner): "You are taking notes at a meeting between the Permanent Secretary and three agencies. Forty minutes in, the Permanent Secretary says, calmly, that the vendor has done this to two other agencies. The notes are yours, and are cleared before they go out." → "You're taking the minutes at a meeting between the Permanent Secretary and three agencies about a project that is already behind. Forty minutes in, the Permanent Secretary says, calmly, that the vendor building it has already failed two other agencies the same way. Nobody wants that in writing: if it's in the minutes, someone will one day ask why the ministry hired them anyway. You write the draft, and the Permanent Secretary's office approves it before it goes out."
- Check: editor review only.

**2.3 Deadpan is fine, but never a sentence that is words and means nothing.** Explicit beats clever.
- Why: a player who cannot tell what happened cannot find it funny.
- Example (approved by the owner): "Within the month you are put on one, as a member. It is a start, and it is minuted as one." → "A month later you're put on one, as an ordinary member. Your reporting officer calls it a good first step."
- Check: editor review only.

**2.4 No sentence that needs decoding.** No comma-stacked fragments, and no line that only works once you already know what it means.
- Why: each one costs the reader a second pass.
- Example: "There are six, numbered, and copied to a name you do not recognise." → "There are six of them, numbered, and each is copied to someone you have never heard of."
- Check: editor review only.

**2.5 Every pronoun has an obvious referent on the same screen.** No "it", "the second one" or "his" that the reader has to hunt for.
- Why: a reader who has to hunt for what "it" means has stopped following the story.
- Example: "Your name travels further outside the building than it did." → "More people outside the building know your name than before."
- Check: editor review only.

**2.6 Jargon is good, if it is introduced first.** Any specialised knowledge a general player may not have counts: acronyms, and institutions and procedures such as Hansard, Question Time, the Meet-the-People Session and POFMA. Each term has entry points: cards whose story makes its meaning clear. The player always meets a term at an entry point first; after that, any card may use it freely. The terms and their entry points are listed in `web/content/jargon.json`.
- Why: the owner's words: "we don't imagine our players as people who know the words right off the bat, but jargon is perfectly acceptable if it's INTRODUCED FIRST. It's in fact good: highly immersive."
- Example: an entry point says "You have resigned from the civil service to stand for Parliament: to run in the election, as the party's candidate." A later card can then say "does not stand again".
- Check: `test/jargon.js` plays simulated careers and fails when a player meets a term before any of its entry points.

**2.7 Insider shorthand that is not a term is rewritten in plain words.**
- Why: it is not a word the player can learn once at an entry point; it is an insider's way of skipping the description.
- Example: "an announcement in March, with a backdrop" → "a press conference in March, with the Minister, a stage and a banner".
- Check: editor review only.

**2.8 Say consequences plainly.** An outcome says what happened and what it means for you. Use ", which is ..." endings rarely.
- Why: the player has to know what their choice did.
- Example: "You are given the file, which is a compliment." → "You are given the file. Your reporting officer calls it a vote of confidence."
- Check: editor review only.

**2.9 Card bodies run 30-60 words: setup, then stakes, then the joke.** A body assembled from parts keeps to the same length.
- Why: the setup comes before brevity, but a card is read on a phone.
- Check: editor review only (no test counts words).

**2.10 Outcomes run 15-40 words. Choice text is one line, up to about 12 words.**
- Why: a choice is read at a glance; the outcome is the payoff, not a second card.
- Check: editor review only.

**2.11 A Meanwhile line is one sentence of glance-able payoff, at most about 20 words.**
- Why: it stands for a whole year with no decision in it.
- Check: editor review only.

## 3. Story logic and continuity

**3.1 Every line fits every situation the card can fire in:** who you are (rank, age, origin, what you did) and what has happened in the run.
- Why: one contradiction breaks the world for the rest of the career.
- Example: "Your director asks ..." on a card that also fires for Directors → "{senior}, your reporting officer, asks ...".
- Check: `test/contexts.js` fails "reporting officer", "your RO", "your director", "your division", "clearance" and "the ranking exercise" on a card that fires in politics; "your director" for a Director or above; "your Permanent Secretary" for a Permanent Secretary; and "the Whip", "your ward", "your constituents", "your GRC", "Question Time" and "by-election" on a card that fires in the service. Everything else, editor review.

**3.2 No number the run can contradict.** No fixed count of years, calendar year, age or stage of life that the elapsed time or the player's age can contradict.
- Why: a card can fire years apart in different careers.
- Example: "In 2029, the tender ..." → "Years ago, the tender ...".
- Check: editor review only.

**3.3 Nothing appears out of nowhere.** A choice or an outcome never mentions a thing, person, file or topic the card has not set up.
- Why: the player cannot follow a reference to something they were never shown.
- Example: a body about a budget paper, then "The annex is never found." → "The costing table you cut is never found."
- Check: editor review only.

**3.4 A follow-up names its cause and reads as continuous with the card before it.** It opens by saying in plain words what it follows from, and the cause's outcome plants the hook by naming the person or thing.
- Why: years pass between the two; the player has to recognise it when it returns.
- Example: "{peer} is back." → "Years ago, on the leadership programme, you covered for {peer}. ..."
- Check: editor review only.

**3.5 A callback needs its cause.** A card that remembers a choice requires the flag that choice set; it never recalls a choice the player did not make.
- Why: "as you promised" to someone who refused is a lie the player catches.
- Check: `test/contexts.js` for callbacks that name a cast member (a static check, also in CI); editor review for the rest.

**3.6 Linked cards agree.** A consequence and its cause, and a card and its versions and alternates, describe the same person, place and fact the same way.
- Why: the player reads them as one story.
- Check: editor review only.

**3.7 Write for where the player will be.** A consequence that may fall due after a promotion, a move into politics or a move between ministries has `alternates` written for those places, and a story that starts in a ministry checks `moved_ministry` before it carries on there.
- Why: a promotion-board callback must never land on a Minister.
- Check: `test/harness.test.js` checks that every alternate exists and fires only through its card; whether the alternates cover every place is editor review.

**3.8 A card's versions change only words.** A version (`variants`) changes the title, body, choice text and outcomes. Its requirements, its choices and their order, effects, flags, schedules and election kinds stay the card's own.
- Why: callbacks, the Folder and the harness see one card.
- Check: the engine reads nothing else from a version.

**3.9 A version is a new scene, not a reworded sentence.** A different room, person, weather or document. Sibling versions stay below 0.35 on the 4-gram measure of rule 1.9.
- Why: the point of a version is that a second career sees something new.
- Check: editor review only (`test/similarity.js` does not compare a card's versions with each other).

**3.10 Every combination of a card's parts reads well.** Write each option to read beside every option of every other slot, or tie them with `requires.parts`. Slot names are lower case and never a cast role, a batchmate token or `player`; every option has every field the text asks for.
- Why: the player sees one combination and must never see the seams.
- Check: `test/contexts.js` static checks (also in CI); `test/harness.test.js` renders every combination and fails on a raw token.

**3.11 Use only tokens that are filled where you put them.** Cards fill `{ministry}`, the cast's fields (`name`, `full`, `given`, `formal`, `title`, `aTitle`, `they`, `them`, `their`, `years`), the player's tokens and the card's own part slots. The ending, legacy and Declassified lines fill only the player's tokens; a cast line fills its own person's fields and the player's. Nothing fills a part token in a Meanwhile line, an autoplay line, a repeatable card's title or a Folder item.
- Why: an unfilled token reaches the screen raw.
- Check: `test/contexts.js` static checks (also in CI); the leak checks fail any raw token on screen.

**3.12 Meanwhile lines stand alone.** No tokens of any kind; never count ("another", not "a second"); never claim a result the year's own lines may contradict (the pay line shows the bonus).
- Why: the line can come in any year, in any order.
- Example: "A second year of Budget meetings." → "Another year of Budget meetings."
- Check: `test/contexts.js` static check for tokens (also in CI); editor review for the rest.

**3.13 Write enough lines that none repeats, and never a sentence twice.** A career never shows the same sentence twice, from any pool the engine takes lines from: the batchmate's news, cast lines, the stats in words, rumours, warnings, heads-ups, Meanwhile lines, appraisal quotes, review lines. Write each pool longer than the most a career uses it, with one or two to spare, and never let two lines share a sentence, in one pool or across pools. A line whose words change with what it reports (a `{title}`, `{next}` or `{grade}` in every sentence) can come back for a different one; any other line comes once. At least four Meanwhile lines per habit, enough for a long career on a series card, three or four versions of each cast line, and a version of a card for every time a career can show it in full.
- Why: a player who sees the same sentence twice stops believing the world is written for them. The engine remembers every sentence its pools have shown in a career: when a pool runs out it falls back to a plain line in words that change with the news (engineLines.rivalFallback for the batchmate), or says nothing, and a card shown in full again takes its next version.
- Example: the batchmate promoted twice in one career, both times "The group chat from your first year hears about it before you do." → nine small scenes for the news, each used once.
- Check: `node test/repeats.js` (CI) plays 1,800 careers and fails a sentence of four words or more shown twice in one career, outside a short allowlist of structural lines (the pay line, a year without a decision, a formal warning's terms, the note that a choice counts at appraisal, a promotion's note on pay); `test/contexts.js` and `test/harness.test.js` fail a cast line shown twice; pool sizes are editor review.

**3.14 A story chain is 3-5 cards over years.** Each beat is set up by a flag and scheduled with `inYears` and a chance; branches are mutually exclusive flags; the chain feeds the Folder (a compromise) or Declassified (a line naming the chain) at least once. Order a chain's Declassified entries from the furthest point the story can reach to the nearest.
- Why: a chain is named at the end by where it finished.
- Check: `test/harness.test.js` checks that Declassified names each story once, after Exposure; the rest is editor review.

## 4. Characters and the cast

**4.1 The player is "you", and is named the way the speaker would say it.** The player's name appears only where someone else names or addresses them, inside the quote or document that carries it. The one name field gives three forms; pick one by who is speaking, and where:
- `{player.given}` ("Wei Ling"): colleagues, peers, your reporting officer or anyone senior speaking to you directly, friends, the batchmate, a farewell card.
- `{player.formal}` ("Ms Lim"; "Ms Nurul Huda" for a name with no surname): officials in a formal or serious setting (an inquiry, HR in writing, a minister in a meeting), residents, the press and its headlines.
- `{player.full}` ("Ms Lim Wei Ling"): documents and the record: Hansard and the House, award lists, plaques and nameplates, a paper's footer, a letter's address line.

Never `{player}` on its own: say which form. Keep the player's tokens out of choice text.
- Why: the game is in the second person, and Declassified may quote an untaken choice as it is written, token and all. And the form is part of the scene: in the owner's words, "a serious situation or official situation have the full name or Ms {surname}, but your superior or peers or colleagues most likely just call you 'Wei Ling'."
- Example: "{player} walks into the room." → "You walk into the room." And: "{peer} messages you: "Nice one, {player.formal}."" → "... "Nice one, {player.given}."" And: the Forum page "headlined "{player.formal} candid on scheme flaw""; a Member begins "As {player.full} said in this House".
- Check: `test/contexts.js` (static, also in CI) fails `{player}` on its own, and, as a heuristic, a quote holding `{player.formal}` or `{player.full}` in a clause that names a colleague: a service colleague's, a fellow MP's or the batchmate's token, or a word such as "colleague", "batchmate", "reporting officer", "peers" or "friend" (the clause runs from the sentence's start to its end, so it holds the speaker of `X says, "..."`); in a cast line of a colleague's role, every quote is theirs. A line that also uses `{player.given}` is contrasting the forms on purpose and passes. A senior official speaking to you is editor review. `test/contexts.js` and the leak checks also fail an unknown player token or the wrong honorific.

**4.2 The player's name and gender are text only.** One line uses the tokens. Never two versions of a line, and nothing gated on gender: no card, choice or requirement.
- Why: nothing but text reads the gender, so the same seed plays the same career under every choice.
- Check: `test/harness.test.js` (the same seed plays identically as Female and as Male); `test/contexts.js` plays every choice, with typed and drawn names.

**4.3 People are named and consistent.** Your reporting officer is always `{senior}` ("your reporting officer, {senior}"). Never an unnamed "supervisor", and never "from your intake".
- Why: a recurring person is how a career becomes a story.
- Check: editor review only.

**4.4 A person's first card introduces them in full; later cards tag them.** On every later card, their first mention carries a short role tag ("Nurul Huda, your fellow MP,"), unless they were on the card just before. The engine adds both (`introduce()` in `engine.js`, from each role's `intro` and `tag` in `cast.roles`), so write `{mp}`, in a place where "Name, who ..., " reads naturally (a subject or an object, not inside a list). Or write your own appositive, followed by a comma, and the engine leaves it alone. A possessive ("{mp}'s ward") takes neither: the next plain mention does, or, with none, a tag that is a noun phrase goes in front ("your fellow MP Nurul Huda's ward"). The batchmate gets a tag too ("your batchmate").
- Why: players forget names within a few cards.
- Check: `test/harness.test.js` checks where the engine puts the introduction and the tag, and that the card right after never repeats it; `test/contexts.js` fails an empty field (", ,", a doubled space, a space before a comma or full stop) in assembled text; the rest is editor review.

**4.5 A person named outside a card says who they are.** In a note, a Meanwhile line or a review page, the name is followed at once by an appositive giving who they are to the player.
- Why: there is no card around the line to say who they are.
- Example: "Lau Chee Meng files a last story for the Straits Times after 33 years at the paper." → "Lau Chee Meng, the Straits Times journalist who has covered your career, files a last story after 33 years at the paper."
- Check: `test/castlines.js`.

**4.6 Grades of people come from tokens.** Never write a grade out next to a cast member. Use `{role.title}`, or `{role.aTitle}`, which also picks "a" or "an".
- Why: people are promoted; a written grade goes wrong at some rank.
- Example: "{senior}, the Deputy Secretary, ..." → "{senior}, now {senior.aTitle}, ...".
- Check: `test/contexts.js` (a static check, also in CI; every render also checks that a grade beside a name is that person's, and flags "a" before a title that starts with a vowel).

**4.7 Pronouns follow the person.** A cast member's, the batchmate's and the player's pronouns come from their tokens. A subject pronoun comes only before a past-tense verb; otherwise use the name.
- Why: "{peer.they} is" and "{peer.they} are" cannot both be right.
- Example: "{peer.they} is late." → "{peer} is late." ("{peer.they} said no." is fine.)
- Check: `test/contexts.js` (a static check, also in CI).

**4.8 No gendered pronoun for an office.** An unnamed official, the Minister, the Permanent Secretary, the Whip and the Prime Minister get no "he" or "she", unless the office holder is the player, who gets the player's tokens.
- Why: two cards could disagree about the same person.
- Example: "The Minister says he will look at it." → "The Minister says the ministry will look at it."
- Check: editor review only.

**4.9 A callback names only the person it remembers.** A card that depends on what happened with a cast member checks that person's flags (`requires.cast`). Flags stay with the person, never with a successor in the role.
- Why: the role may hold someone new by then.
- Check: `test/contexts.js` (a static check, also in CI; renders confirm that the person named is the one the choice was about).

**4.10 People act in character,** for their role and for their history with you in this run.
- Why: a peer you cut out of a promotion does not ask you for a favour as if nothing happened.
- Check: editor review only.

**4.11 Name only the roles the card needs.** A card that names a role is drawn only while someone holds it.
- Why: the engine keeps the run's people congruent (a senior above you, a junior below, nobody under their rung's age floor, nobody departed, no two sharing a word of a name), but a role you name and do not need keeps the card out for nothing.
- Check: `test/contexts.js` checks the people's congruence; the choice of roles is editor review.

**4.12 Batchmate tokens only on batchmate cards, and batchmate lines only where they fit.** `{rival}`, `{they}` and the like appear only on the batchmate's own cards (`rival.json`).
- Why: most careers have no batchmate, and a line about the Whip is wrong while the batchmate is still in the service.
- Check: `test/contexts.js` (the tokens, and each batchmate line against the contexts and statuses it was shown in); the leak checks fail an unfilled batchmate token.

**4.13 Folder items never name a cast role.**
- Why: the Folder is read years later, when the role may hold someone else.
- Check: `test/contexts.js` (a static check, also in CI).

**4.14 Names are invented.** The name pools are fictional, across communities, and never a real public figure.
- Why: see rule 8.1.
- Check: editor review only (`test/contexts.js` checks that names never repeat within a run).

**4.15 A card that hands a role to someone new never names the newcomer.** A card with `"replaces": ["senior"]` (`new_ro`) gives the role to a new person whichever choice is made, as the sideways move after three Cs does for the reporting officer and the junior. In the card's own text `{senior}` is still the person leaving. The newcomer has no name or pronouns until they arrive, and the engine introduces them on the first card that names them, so the card says "the new reporting officer" or "the newcomer", never "he" or "she".
- Why: the newcomer is drawn after the choice, so a pronoun on the card could contradict the next one.
- Check: `test/harness.test.js` (the old holder leaves the story, and a newcomer holds the role from the next card); the wording, editor review.

## 5. Choices, rewards and consequences

**5.1 Every card is a real decision.** At least two choices, each costing something. A third only when it is a real third way, not a "do nothing" filler.
- Why: a card with no real decision is a failure of content; years with nothing to decide pass by themselves.
- Check: editor review only.

**5.2 Every choice is clear, and none is steered.** The player knows exactly what is being asked and what each option means. Options are described evenly: no odds, no "the safer choice".
- Why: the player is choosing, not being told which answer is right.
- Example: "You can run in a GRC as one of a team of five, the safer choice, or alone in a single seat: riskier, and entirely yours." → "Join the GRC team: share the risk, and the credit." / "Run alone in a single seat: all the risk, and all the credit."
- Check: editor review only.

**5.3 No dominated choice.** No choice is worse than another on every stat (lower Heat is better).
- Why: a player who spots one stops reading the others.
- Check: `test/harness.test.js` fails one on a batchmate card, in any part combination or in any second-showing scene; `node test/sim.js` reports the rest without failing.

**5.4 Stakes from parts stay small.** A part option may add to or scale a choice's effects, so who is asking changes the price, but no combination may leave a choice dominated.
- Why: the card's decision must survive every combination.
- Check: `test/harness.test.js`.

**5.5 No reward without a cause.** Standing and Competence (what makes your grade) move only when someone could have seen it. Integrity can move in private; Reputation needs an audience. Doing nothing can pay off or cost you, but only through someone who plausibly noticed.
- Why: a stat that moves when nobody was looking feels like the game cheating.
- Example: "You fix the figures alone at midnight. Nobody knows." with Standing up → the same line with Integrity up; or "{senior} sees the timestamp on the file." with Standing up.
- Check: editor review only.

**5.6 Witnesses are never named,** during play or at the end. Someone may notice, and it may help or hurt you; hurting matters most. A card lists who could plausibly know what you did (its `witnesses` field), from the kinds of witness in `game.json` (`witnesses.types`), each judging by its own motive, so the same act can help with one and hurt with another. In the service they are the countersigning officer, the office that owns the information, the ranking panel, the people around you, the Minister's office and other agencies; in politics, the party's leadership, the Whip's office, your branch and its volunteers, the press gallery, the officials who work with you, and your fellow MPs. Each kind sees only what is done on its own ladder, and the service's judgement lapses once you have left for politics. A judgement lands in a later appraisal, sometimes with an anonymous line on the review page; the review's "why" line is left as it is. Witnesses never appear in Declassified or anywhere else in the ending: players work it out on their own.
- Writing them: give a card witnesses wherever a believable one exists, and none where nobody could know (something private or outside work, or a card that says nobody knew); keep each card's helping and hurting roughly level, with reactions from -5 to +4. A review line names no person, title or role, and a politics line never says "upstairs" or "the building".
- Why: in the owner's words, "In real life you hardly ever know who promoted you, or why."
- Example: "The Deputy Secretary saw your paper and put your name forward." → "Someone upstairs seems to have read your paper." In politics: "The Whip has noted your speech." → "You hear, from nobody in particular, that you've been described as "a free spirit"."
- Check: `test/contexts.js` (no name, title, role word, number or token in a review line; no service words in a politics line; no witness on a ladder its card never reaches); `test/harness.test.js` (the ending reads the same with or without witnesses); which witnesses a card lists, editor review.

**5.7 Push every stat both ways.** A pack moves each stat it touches up and down through real choices.
- Why: a stat pushed one way does not earn its place.
- Check: `node test/sim.js` reports each stat's direction (not a CI failure); editor review against the pack's targets.

**5.8 Only a standout moment raises the ceiling.** `cep` goes on choices that would mark a file, never on grinding.
- Why: learning which moments count is the skill the game teaches.
- Check: editor review only.

**5.9 Compromises go in the Folder.** A choice a background check would find (burying, spinning, a favour) sets a flag listed in `folder` in `game.json`, written as a noun phrase.
- Why: the vetting reads every compromise back.
- Check: editor review only.

**5.10 Choices come back.** Plant consequences with `schedule`, years later and with a chance. A consequence waits, still scheduled, until its requirements hold.
- Why: a choice in year 6 detonating in year 14 is what makes choices feel heavy.
- Check: `node test/sim.js regress` fails if a consequence is ever silently dropped.

**5.11 Every choice is complete.** Every card has choices, every choice has text and an outcome, and every card a choice schedules exists.
- Why: anything missing breaks the screen or the story.
- Check: `node test/sim.js regress` and the Pages content check.

**5.12 A series is one decision in different weather.** Every card of a series uses the same stance names. A second showing (`again`) makes the habit the default and gives keeping and breaking it their own stakes (`again.keep`, `again.change`). When a series has an opening card (`"opens": true`, as the National Bonus card opens the Indicators), the opening card explains the stakes once; every second showing names the choice made on it and never explains them again.
- Why: the second time is the real question: will you change course, knowing you will not be asked again?
- Check: `test/harness.test.js` (each second-showing scene renders whole, habit first, with no dominated choice; after the National Bonus card, every Budget card is a second showing that names its choice).

**5.13 Let the engine say a choice counts at appraisal.** Use the `appraisal` effect; the outcome screen then says the choice will count, for or against.
- Why: the line is the engine's, so the outcome stays free for what happened.
- Check: editor review only.

**5.14 Traits (not built) never decide a career.** No trait is required to win, and every origin can take every trait.
- Why: a trait is flavour and a small edge, not a key.
- Check: editor review only.

## 6. Realism and satire

**6.1 Believability lives in motive, not physics.** Impossible things may happen, but nobody ever acts against their own incentives or their institution's habits.
- Why: an impossible premise is a joke; an impossible motive is a mistake.
- Example: a ruling-party MP founding a society for anarchists to "settle" opposition voices sounds realistic and is still unbelievable. A minister calmly handling a sky that turned green is fine.
- Check: editor review only.

**6.2 The impossible is processed as routine.** A Strange Year changes the physics, never the machinery: the registry still logs the envelope. About a third of careers meet one, and none meets more than one: every premise card requires `strange_met` to be absent and sets it on every choice.
- Why: the joke is the institution's calm.
- Check: editor review only.

**6.3 Being stuck in a grade for years is fine, if it is believable.** Say it in the house style.
- Why: it happens, and the service has words for it.
- Example: the board describes you as "ready, in time".
- Check: editor review only.

**6.4 In the service, the player always works for a ministry.** The header names it; never put a CEO or a statutory board above the player.
- Why: the header must agree with every card.
- Example: "Your CEO wants a briefing." → "{senior}, your reporting officer, wants a briefing."
- Check: editor review only.

**6.5 Assume nothing about the player's origin or age.** A scholar starts as an Assistant Director, bonded; a poly entrant can be a Management Executive in their fifties.
- Why: every origin reaches most cards.
- Example: "As the newest officer in the division, ..." on a card for ranks 0-1 → "As the most junior officer at the meeting, ...".
- Check: editor review; `node test/contexts.js --table` lists the origins and ages each card fires at.

**6.6 Ages are real.** The service retires at 64. The party asks a Member not to stand at the first general election after they turn 65 (the Renewal card, the year before). A Minister or higher with strong Standing may stay to 70, a hard stop. Prime Minister is the last role, held for a short tenure; Senior Minister appears only as flavour.
- Why: accuracy is the joke, and a career should end when a real one would.
- Check: `test/harness.test.js` (the end of a career).

## 7. What the player is shown

**7.1 Each event gets its own screen.** A card's outcome is separate from the year's review, so an outcome never announces the grade, the pay or a promotion.
- Why: the review that follows says those, and the two must not disagree.
- Example: "You get an A this year." → "Your director thanks you in front of the division."
- Check: editor review only.

**7.2 Stats are hidden during play.** Never a stat's number or an effect's number on a play screen.
- Why: inferring them is the game; numbers turn it into a spreadsheet.
- Check: the leak checks (a stat value or effect number during play).

**7.3 The four stat words appear sometimes, never on every card.** The engine names them in an appraisal's "why" line, only in a year that needs explaining, and in a quiet line after a big swing, at most once every three cards. A card's own outcome does not narrate a stat going up or down.
- Why: a word that comes now and then is a clue; on every card it is a scoreboard.
- Check: `test/harness.test.js` (swing lines at least three cards apart, no numbers in the stat words); outcomes, editor review.

**7.4 Appraisal weightings, fractions and the grade a promotion takes are never stated.** Players learn what a promotion takes, or don't; a heads-up may say the ranking is coming and that the year counts, never which grade it needs.
- Why: the player infers what the appraisal values, as officers do.
- Example: "Competence counts for half your grade." → "Your appraisal looks at your competence, your standing upstairs and your reputation outside the building."
- Check: editor review; `test/harness.test.js` fails a "why" line with a number.

**7.5 The ending reveals all four stats in plain words,** each with what it was and what it did to the run.
- Why: the end is where the player learns the rules they were paying for.
- Check: `test/harness.test.js`.

**7.6 A choice the player cannot take is not shown.** A choice with `requiresStat` is left off the card while the player lacks the stat, so the player cannot tell it is there: no greyed-out button, no reason, no number. A card is only drawn while it has at least two choices to show, so give every card at least two choices that need no stat: otherwise it waits until the player has the stats, and a scheduled card that waits stalls its story.
- Why: in the owner's words, "For the hidden options that require a certain stat to be met, do not show them at all, unless the stat is met." A greyed-out button tells the player exactly what they are missing.
- Example: the election card's single seat needs a strong reputation, so the card also offers two GRC choices that anyone can take.
- Check: `test/harness.test.js` (no card on screen with fewer than two choices, the hidden one nowhere on the screen, the buttons mapped to the card's own choices), `test/ui.test.js` and `test/screen.test.js`.

**7.7 The ceiling and Heat show only as rumour and euphemism.** Never a number for either, until Declassified at the end.
- Why: they are the hidden values the player learns to read.
- Check: the leak checks.

**7.8 Each grade wording quotes exactly one phrase,** in double quotes, and no two wordings quote the same phrase. The review shows the letter first, then the wording; a career never gets the same wording twice, and once a grade's wordings are all used, the review gives the letter alone.
- Why: the quoted phrase is the euphemism the player learns to decode; one each keeps every wording distinct, and a joke told once is a joke, told five times a form letter.
- Check: `test/harness.test.js`; `node test/repeats.js`.

**7.9 Pay is always shown against last year.** The engine writes it on each year's review page; a card never states the player's pay or bonus.
- Why: the change is what the player feels, and only the engine knows the figure.
- Check: editor review only, for cards.

**7.10 Foreboding comes first, and never lies.** Retirement and the payouts are signalled before they come: the end of a career two years and one year ahead; a ranking, the invitation to tea and an election in a seat at risk, the year before.
- Why: an ending or a promotion should never arrive out of nowhere (rule 3.3).
- Check: `test/harness.test.js` (no heads-up or foreboding line lies).

**7.11 A blind playtester's prompt reveals no more than the phone.** No CEP, Heat or hidden values by name, no engine field names, effect numbers, stat thresholds, win routes or dice, and no run of seven words copied from the mechanics brief, the playtest brief or `docs/DESIGN.md` that is not also on the store page.
- Why: a blind playtester stands in for a real player, who knows only the screen.
- Check: `agents/leak-check.ts` (CI). It reads `docs/DESIGN.md` as a secret document, so run it after editing that file.

**7.12 Lifetime earnings never go down.** A card can tell a story about spending money (a resale flat, a master's at night), but it never takes money from the total. Why: the number is a score of what you earned, and a purchase is not interesting enough to cost you it. Checked by `validateContent` in `test/metrics.js`, which rejects a negative `wealth` effect.

## 8. Never

**8.1 Never a real politician or public figure, even renamed.** No recognisable career path, famous quote, signature trait or event from the news.
- Why: it breaks rule 1.1 and makes the game unshippable.
- Example: a pandemic year with a Multi-Ministry Taskforce, and none of its real members.
- Check: editor review only (the content auditor's first check).

**8.2 Never wink.** No nudge that this is satire, no line that explains its own joke, no line that steps outside the world.
- Why: see rule 1.3.
- Check: editor review only. (The planted "canary" checks that the agent players catch a wink, not that content has none.)

**8.3 Never a gendered word for the player.** No "sir", "madam", "he" or "she" for the player; only the player's tokens.
- Why: the player chooses (rule 4.2).
- Example: "Thank you, sir." → "Thank you, {player.formal}."
- Check: `test/contexts.js` ("sir", "madam", "ma'am", and the wrong honorific); the leak checks (the wrong honorific).

**8.4 Never assume the player's partner, children, religion, ethnicity or national service.**
- Why: the player is never asked.
- Example: "Your wife asks when you'll be home." → "Your phone shows three missed calls from home."
- Check: `test/contexts.js` ("wife", "husband", "girlfriend", "boyfriend"); editor review for the rest.

**8.5 Never anything internal on screen.** No raw `{token}`, card or flag id, JSON, "undefined" or "NaN".
- Why: it breaks the world at once.
- Check: the leak checks and `test/harness.test.js`.

**8.6 Never end on "It is noted."**
- Why: it says nothing; the engine now says when a choice counts at appraisal (rule 5.13).
- Check: editor review only.
