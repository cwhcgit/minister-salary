# Writing rules

Every rule for writing Minister Salary's cards, lines and stories, in one place. This file is
the single source: `docs/CONTENT_PLAN.md` (how packs are planned and written) and
`docs/DESIGN.md` section 12 (tone) link here instead of restating the rules. When a rule
changes, change it here.

Each rule says what to do, why, gives a before → after example where one helps, and says how it
is checked: by a test, or by editor review only (the supervisor's and the owner's reads; the
content auditor, `node agents/audit.ts`, also flags tone and accuracy).

| Test | What it catches | Runs |
| --- | --- | --- |
| `node test/contexts.js` | Lines that contradict where a card fires; cast, parts and player-token mistakes in every context | By hand, per the pack checklist. Its static checks also run in CI, inside `test/harness.test.js` |
| `node test/similarity.js` | Near-duplicate cards, worn phrases, worn sentence openers | CI |
| `node harness/leak-check.js`, `node agents/leak-check.ts` | Anything on screen the player must not see: numbers, ids, raw tokens, the wrong honorific | CI |
| `node test/harness.test.js` | Every part combination and second-showing scene; the stat words; the end of a career; grade wordings; gender as text only | CI |
| `node test/sim.js` | Dominated choices and stats pushed one way (reported, not a failure) | CI runs `regress`, which fails on broken content, balance and lost consequences |

## 1. Voice and tone

**1.1 Institutions are real; people are invented.** Ministries, grades, schemes, CPF, GRCs and the bonus formula are real and modelled accurately; every named person is fictional.
- Why: accuracy is the joke, and the game must stay shippable in the country it is about.
- Check: editor review only.

**1.2 Punch at the machinery, never at a person.** The comedy is in the process: the euphemism, the acronym, the twelve-page paper that concludes further study is needed.
- Why: a joke about a stupid person is cheap and cruel; a joke about a process is recognised.
- Example: "Your director is too lazy to read it." → "Your director asks for the paper to be shorter, then for an annex with everything that was cut."
- Check: editor review only.

**1.3 Deadpan.** State it and move on. The funniest line is a number in a table.
- Why: the game's confidence is the joke; a laugh track kills it.
- Check: editor review only.

**1.4 Accuracy is the joke.** Grades, titles, acronyms, pay, electoral rules and processes are right, and facts that change (pay, thresholds, targets, scheme names) match today's values. Check every fact against a primary or official source (PSD, MOF, the Parliament website, statutes, ministry sites) and put the source in the pack's PR, one line per fact.
- Why: a Singaporean player recognising a real appraisal phrase is worth more than any punchline.
- Example: political pay follows the 2026 framework (MR4 $1.8m, PM 2× MR4).
- Check: `test/harness.test.js` checks the ladder's pay and age floors against the published figures; every other fact, editor review only.

**1.5 Affection.** Write as someone who knows the system, not someone sneering at it from outside.
- Why: critical and affectionate are compatible; contempt is not.
- Check: editor review only.

**1.6 Singaporean voice.** Use local names and terms as locals say them (HDB, PUB, NParks, GRC, RC, void deck, the Whip), with no glosses.
- Why: a gloss breaks the voice, and foreign players can look things up.
- Example: "your HDB (public housing) flat" → "your HDB flat".
- Check: editor review only.

**1.7 Vary the joke's shape.** Rotate between the number, the euphemism decoded, the institutional detail as punchline, the quiet consequence, the reversal and the understatement. No more than two cards per pack end on a ", which is ..." clause or open with "It is a ...".
- Why: a joke template wears out by the third time a player sees it.
- Check: editor review; `test/similarity.js` fails a sentence opener shared by 14 or more cards.

**1.8 No worn phrases or near-duplicates.** A pack adds no new near-duplicate and pushes no phrase or opener over its warning count. The limits: two bodies or two outcomes sharing word 4-grams (Jaccard 0.22 warns, 0.5 fails); a 4-6 word phrase across 4 cards warns, 10 fails; a 3-word sentence opener across 6 cards warns, 14 fails. Text is read as assembled, with names filled in.
- Why: repetition is what a returning player notices first.
- Check: `test/similarity.js` (fails at the hard limits; warnings are for the editor).

## 2. Plain English

**2.1 Understood on the first read.** A player who has never worked in government understands every card the first time through.
- Why: on a phone nobody rereads; a line that needs decoding is skipped, and so is the joke.
- Check: editor review only. The fun cohorts flag lines they could not follow (`unclear`, `agents/README.md`).

**2.2 Setup first.** The body's first sentence says what is happening, explicitly; the next says why it matters to you; only then the joke. The logic of the situation is on the screen: what the document is, who approves it, what happens if it goes wrong.
- Why: the joke only lands once the player knows what is at stake.
- Example (approved by the owner): "You are taking notes at a meeting between the Permanent Secretary and three agencies. Forty minutes in, the Permanent Secretary says, calmly, that the vendor has done this to two other agencies. The notes are yours, and are cleared before they go out." → "You're taking the minutes at a meeting between the Permanent Secretary and three agencies about a project that is already behind. Forty minutes in, the Permanent Secretary says, calmly, that the vendor building it has already failed two other agencies the same way. Nobody wants that in writing: if it's in the minutes, someone will one day ask why the ministry hired them anyway. You write the draft, and the Permanent Secretary's office approves it before it goes out."
- Check: editor review only.

**2.3 Explicit beats clever.** Deadpan is fine, but never a sentence that is words and means nothing.
- Why: a player who cannot tell what happened cannot find it funny.
- Example (approved by the owner): "Within the month you are put on one, as a member. It is a start, and it is minuted as one." → "A month later you're put on one, as an ordinary member. Your reporting officer calls it a good first step."
- Check: editor review only.

**2.4 No sentence that needs decoding.** No comma-stacked fragments, and no pronoun without a clear noun.
- Why: each one costs the reader a second pass.
- Example: "There are six, numbered, and copied to a name you do not recognise." → "There are six of them, numbered, and each is copied to someone you have never heard of." And "the vendor has done this" → "the vendor has failed two other agencies the same way".
- Check: editor review only.

**2.5 Say consequences plainly.** An outcome says what happened and what it means for you. Use ", which is ..." endings rarely.
- Why: the player has to know what their choice did.
- Example: "You are given the file, which is a compliment." → "You are given the file. Your reporting officer calls it a vote of confidence."
- Check: editor review only.

**2.6 Card bodies run 30-60 words: setup, then stakes, then the joke.** A body assembled from parts keeps to the same length.
- Why: setup comes before brevity, but a card is read on a phone.
- Check: editor review only (no test counts words).

**2.7 Outcomes run 15-40 words; choice text is one line, up to about 12 words.**
- Why: the choice is read at a glance; the outcome is the payoff, not a second card.
- Check: editor review only.

**2.8 A Meanwhile line is one sentence of glance-able payoff, at most about 20 words.**
- Why: it stands for a whole year with no decision in it.
- Check: editor review only.

## 3. Story logic and continuity

**3.1 Every line fits every situation the card can fire in.** Who you are (rank, age, origin, what you did) and what has happened in the run.
- Why: one contradiction breaks the world for the rest of the career.
- Example: "Your director asks ..." on a card that also fires for Directors → "{senior}, your reporting officer, asks ...".
- Check: `test/contexts.js` fails civil-service words ("reporting officer", "your director", "your division", "the ranking exercise") on cards that fire in politics, "your director" at Director and above, "your Permanent Secretary" for a Permanent Secretary, and political words ("the Whip", "your ward", "your GRC", "Question Time") on cards that fire in the service. Everything else, editor review.

**3.2 No number the run can contradict.** No fixed count of years, calendar year, age or stage of life that the elapsed time or the player's age can contradict.
- Why: a card can fire years apart in different careers.
- Example: "In 2029, the tender ..." → "Years ago, the tender ...".
- Check: editor review only.

**3.3 Nothing appears out of nowhere.** A choice or outcome never mentions a thing, person, file or topic the card has not set up.
- Why: the player cannot follow a reference to something they were never shown.
- Example: body about a budget paper; outcome "The annex is never found." → "The costing table you cut is never found."
- Check: editor review only.

**3.4 A follow-up names its cause.** It opens by saying in plain words what it follows from, and reads as continuous with that card. The cause's outcome plants the hook by naming the person or thing.
- Why: years pass between the two; the player has to recognise it when it returns.
- Example: "{peer} is back." → "Years ago, on the leadership programme, you covered for {peer}. ..."
- Check: editor review only.

**3.5 A callback needs its cause.** A card that remembers a choice requires the flag that choice set. Never recall a choice the player did not make.
- Why: "as you promised" to someone who refused is a lie the player catches.
- Check: `test/contexts.js` for callbacks that name a cast member (a static check, also in CI); editor review for the rest.

**3.6 Linked cards agree.** A consequence and its cause, and a card and its alternates, describe the same person, place and fact the same way.
- Why: the player reads them as one story.
- Check: editor review only.

**3.7 Write for where the player will be.** A consequence that may fall due after a promotion, a move into politics or a move between ministries has `alternates` written for those places, and a story that starts in a ministry checks `moved_ministry` before it carries on there.
- Why: a promotion-board callback must never land on a Minister.
- Check: `test/harness.test.js` checks that every alternate exists and fires only through its card; coverage is editor review.

**3.8 A card's versions change only words.** A version (`variants`) changes the title, body, choice text and outcomes; requires, choices and their order, effects, flags, schedules and election kinds stay the card's own.
- Why: callbacks, the Folder and the harness see one card.
- Check: the engine reads nothing else from a version.

**3.9 A version is a new scene, not a reworded sentence.** A different room, person, weather or document. Sibling versions stay below 0.35 on the 4-gram similarity measure.
- Why: the point of a version is that a second career sees something new.
- Check: editor review only (`test/similarity.js` does not compare a card's versions with each other).

**3.10 Every combination of a card's parts reads well.** Write each option to read beside every option of every other slot, or tie them with `requires.parts`. Slot names are lower case and never a cast role, a batchmate token or `player`; every option has every field the text asks for.
- Why: the player sees one combination and must never see the seams.
- Check: `test/contexts.js` static checks (also in CI); `test/harness.test.js` renders every combination and fails on a raw token.

**3.11 No part tokens where nothing fills them.** Not in Meanwhile lines, autoplay lines, a repeatable card's title, or Folder items.
- Why: the token would reach the screen raw.
- Check: `test/contexts.js` static checks for Meanwhile lines, autoplay lines and repeatable titles (also in CI); editor review for the Folder.

**3.12 Meanwhile lines stand alone.** No tokens of any kind; never count ("another", not "a second"); never claim a result the year's own lines may contradict (the pay line shows the bonus).
- Why: the line can come in any year, in any order.
- Example: "A second year of Budget meetings." → "Another year of Budget meetings."
- Check: `test/contexts.js` static check for tokens (also in CI); editor review for the rest.

**3.13 Write enough lines that none repeats.** At least four Meanwhile lines per habit, enough for a long career on a series card, and three or four versions of each cast line, with each sentence used once.
- Why: a run never shows a line twice; when the lines run out, the card comes back in full or the change happens with no line.
- Check: editor review only.

**3.14 A story chain is 3-5 cards over years.** Each beat is set up by a flag and scheduled with `inYears` and a chance; branches are mutually exclusive flags; the chain feeds the Folder (a compromise) or Declassified (a line naming the chain) at least once. Order a chain's Declassified entries from the furthest point the story can reach to the nearest.
- Why: a chain is named at the end by where it finished.
- Check: `test/harness.test.js` checks that Declassified names each story once; the rest is editor review.

## 4. Characters and the cast

**4.1 The player is "you".** The player's name appears only where someone else names or addresses them, inside the quote or document that carries it: the papers, Hansard, a document's footer, an official, the batchmate. Use `{player.formal}` when an official, the press or a resident names the player, and `{player}` for colleagues and lists.
- Why: the game is in the second person; a name in the narration breaks it.
- Example: "{player} walks into the room." → "You walk into the room." And: the Forum page "headlined "{player.formal} candid on scheme flaw"".
- Check: editor review; `test/contexts.js` and the leak checks fail an unknown player token or the wrong honorific.

**4.2 Name and gender are text only.** Write one line with the player's tokens. Never two versions of a line, and never gate a card or a choice on gender.
- Why: nothing but text reads the gender, so the same seed plays the same career under every choice.
- Check: `test/harness.test.js` (the same seed plays identically as Female and as Male); `test/contexts.js` plays every choice, with typed and drawn names.

**4.3 People are named and consistent.** Your reporting officer is always `{senior}` ("your reporting officer, {senior}"). Never an unnamed "supervisor", and never "from your intake".
- Why: a recurring person is how a career becomes a story.
- Check: editor review only.

**4.4 Leave room for the introduction.** The engine introduces a person on the first card they appear on, by adding "who ..." after the first bare mention in the body. Put that mention where "Name, who ..., " reads naturally (as a subject or object, not inside a list), or introduce them yourself, followed by a comma.
- Why: the player has to know who someone is the first time they meet them.
- Check: editor review; `test/contexts.js` fails an empty field (", ,") in assembled text.

**4.5 Grades of people come from tokens.** Never write a grade out next to a cast member. Use `{role.title}`, or `{role.aTitle}`, which also picks "a" or "an".
- Why: people are promoted; a written grade goes wrong at some rank.
- Example: "{senior}, the Deputy Secretary, ..." → "{senior}, now {senior.aTitle}, ...".
- Check: `test/contexts.js` (a static check, also in CI; every render also checks the grade is that person's).

**4.6 Pronouns follow the person.** A cast member's or the batchmate's pronoun is fixed per person, so use their tokens. A subject pronoun comes only before a past-tense verb; otherwise use the name.
- Why: "{peer.they} is" and "{peer.they} are" cannot both be right.
- Example: "{peer.they} is late." → "{peer} is late." ("{peer.they} said no." is fine.)
- Check: `test/contexts.js` (a static check, also in CI).

**4.7 No gendered pronoun for an office.** An unnamed official, the Minister, the Permanent Secretary, the Whip and the Prime Minister get no "he" or "she", unless the office holder is the player, who gets the player's tokens.
- Why: two cards could disagree about the same person.
- Example: "The Minister says he will look at it." → "The Minister says the ministry will look at it."
- Check: editor review only.

**4.8 A callback names only the person it remembers.** A card that depends on what happened with a cast member checks that person's flags (`requires.cast`). Flags stay with the person, never with a successor in the role.
- Why: the role may hold someone new by then.
- Check: `test/contexts.js` (a static check, also in CI; renders confirm the person named is the one the choice was about).

**4.9 People act in character.** For their role, and for their history with you in this run.
- Why: a peer you cut out of a promotion does not ask you for a favour as if nothing happened.
- Check: editor review only.

**4.10 The run's people stay congruent.** A senior above you, a junior below, nobody under their rung's age floor, nobody vacant or departed named, and no two people sharing a word of a name (nor the batchmate, nor the player). Name only the roles the card needs: a vacant role keeps the card out.
- Why: the engine keeps the cast congruent, but only for the roles a card actually names.
- Check: `test/contexts.js`.

**4.11 Batchmate tokens only on batchmate cards.** `{rival}`, `{they}` and the like appear only on the batchmate's own cards, and the batchmate's lines only where their wording fits.
- Why: most careers have no batchmate.
- Check: `test/contexts.js`; the leak checks fail an unfilled batchmate token.

**4.12 Folder items never name a cast role.**
- Why: the Folder is read years later, when the role may hold someone else.
- Check: `test/contexts.js` (a static check, also in CI).

**4.13 Names are invented.** The name pools are fictional, across communities, and never a real public figure.
- Why: see 8.1.
- Check: editor review only (`test/contexts.js` checks names never repeat within a run).

## 5. Choices, rewards and consequences

**5.1 Genuine choices.** At least two, each costing something. A third only when it is a real third way, not a "do nothing" filler.
- Why: a choice with an obvious answer is not a decision.
- Check: editor review only.

**5.2 No dominated choice.** No choice is worse than another on every stat (lower Heat is better).
- Why: a player who spots one stops reading the others.
- Check: `test/harness.test.js` fails one in any part combination or second-showing scene; `node test/sim.js` reports the rest (not a CI failure).

**5.3 Stakes from parts stay small.** A part option may add to or scale a choice's effects, so who is asking changes the price, but no combination may leave a choice dominated.
- Why: the card's decision must survive every combination.
- Check: `test/harness.test.js`.

**5.4 No reward without a cause.** Standing and Competence (what makes your grade) only move when someone could have seen it. Integrity can move in private; Reputation needs an audience. Doing nothing can pay off or cost you, but only through someone who plausibly noticed.
- Why: a stat that moves when nobody was looking feels like the game cheating.
- Example: "You fix the figures alone at midnight. Nobody knows." with Standing up → the same line with Integrity up; or "{senior} sees the timestamp on the file." with Standing up.
- Check: editor review only.

**5.5 Witnesses are never named.** Someone may notice, and it may help or hurt you, but the text never says who promoted you or why.
- Why: in real life you hardly ever know.
- Example: "The Deputy Secretary saw your paper and put your name forward." → "Someone upstairs seems to have read your paper."
- Check: editor review only.

**5.6 Push every stat both ways.** A pack moves each stat it touches up and down through real choices.
- Why: a stat pushed one way does not earn its place.
- Check: `node test/sim.js` reports each stat's direction (not a CI failure); editor review against the pack's targets.

**5.7 Only a standout moment raises the ceiling.** `cep` goes on choices that would mark a file, never on grinding.
- Why: learning which moments count is the skill the game teaches.
- Check: editor review only.

**5.8 Compromises go in the Folder.** A choice a background check would find (burying, spinning, a favour) sets a flag listed in `folder` in `game.json`, written as a noun phrase.
- Why: the vetting reads every compromise back.
- Check: editor review only.

**5.9 Choices come back.** Plant consequences with `schedule`, years later and with a chance. A consequence waits, still scheduled, until its requirements hold.
- Why: a choice in year 6 detonating in year 14 is what makes choices feel heavy.
- Check: `node test/sim.js regress` fails if a consequence is ever silently dropped.

**5.10 A series is one decision in different weather.** Every card of a series uses the same stance names. A second showing (`again`) makes the habit the default and gives keeping and breaking it their own stakes (`again.keep`, `again.change`).
- Why: the second time is the real question: will you change course, knowing you will not be asked again?
- Check: `test/harness.test.js` (each second-showing scene renders whole, habit first, no dominated choice).

**5.11 Let the engine say a choice counts at appraisal.** Use the `appraisal` effect; the outcome screen then says the choice will count, for or against.
- Why: the line is the engine's, so the outcome stays free for what happened.
- Check: editor review only.

**5.12 Traits (not built) never decide a career.** No trait is required to win, and every origin can take every trait.
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

**6.4 The player always works for a ministry.** The header names a ministry; never put a CEO or a statutory board above the player.
- Why: the header must agree with every card.
- Example: "Your CEO wants a briefing." → "{senior}, your reporting officer, wants a briefing."
- Check: editor review only.

**6.5 Assume nothing about the player's origin or age.** A scholar starts as an Assistant Director, bonded; a poly entrant can be a Management Executive in their fifties.
- Why: every origin reaches most cards.
- Example: "As the newest officer in the division, ..." on a card for ranks 0-1 → "As the most junior officer at the meeting, ...".
- Check: editor review; `node test/contexts.js --table` lists the origins and ages each card fires at.

## 7. What the player is shown

**7.1 Stats are hidden during play.** Never a stat number or effect on a play screen. The engine's stat words appear sometimes (a "why" line, a quiet line after a big swing), never on every card.
- Why: inferring them is the game; numbers turn it into a spreadsheet.
- Check: the leak checks (a stat value or effect number during play); `test/harness.test.js` (no numbers in the stat words, big swings at most once every three cards).

**7.2 Appraisal weightings and fractions are never stated.**
- Why: the player infers what the appraisal values, as officers do.
- Example: "Competence counts for half your grade." → "Your appraisal looks at your competence, your standing upstairs and your reputation outside the building."
- Check: editor review; `test/harness.test.js` fails a "why" line with a number.

**7.3 The ending reveals all four stats in plain words.** Each with what it was and what it did to the run.
- Why: the end is where the player learns the rules they were paying for.
- Check: `test/harness.test.js`.

**7.4 A locked choice gives an in-world reason, never the number it needs.** The words are `statWords.locked` in `game.json`.
- Example: "Requires Reputation 60." → "You'd need a stronger reputation for this."
- Check: `test/harness.test.js` and the leak checks.

**7.5 The ceiling and Heat show only as rumour and euphemism.** Never a number for either, until Declassified at the end.
- Why: they are the hidden values the player learns to read.
- Check: the leak checks.

**7.6 Each grade wording quotes exactly one phrase.** In double quotes, and no two wordings quote the same phrase. The review shows the letter first, then the wording.
- Why: Meanwhile years show only the quoted phrase.
- Check: `test/harness.test.js`.

**7.7 Ages are real.** The service retires at 64. The party asks a Member not to stand at the first general election after they turn 65. A Minister or higher with strong Standing may stay to 70, a hard stop. Prime Minister is the last role; Senior Minister appears only as flavour.
- Why: accuracy is the joke, and a career should end when a real one would.
- Check: `test/harness.test.js` (the end of a career).

**7.8 Foreboding comes first.** Retirement and the payouts are signalled before they come: the end of a career two years and one year ahead; a ranking, the invitation to tea and an election in a seat at risk the year before. A signal never lies.
- Why: an ending or a promotion should never arrive out of nowhere (see 3.3).
- Check: `test/harness.test.js` (no heads-up or foreboding line lies).

**7.9 Each event gets its own screen.** A card's outcome is separate from the year's review, so an outcome never announces the grade, the pay or a promotion.
- Why: the review that follows says those, and the two must not disagree.
- Example: "You get an A this year." → "Your director thanks you in front of the division."
- Check: editor review only.

## 8. Never

**8.1 Never a real politician or public figure, even renamed.** No recognisable career path, famous quote, signature trait or event from the news.
- Why: it breaks rule 1.1 and makes the game unshippable.
- Check: editor review only (the content auditor's first check).

**8.2 Never wink.** No nudge that this is satire, no line that explains its own joke, no line that steps outside the world.
- Why: see 1.3.
- Check: editor review only. (The planted "canary" checks that the agent players catch one, not that content has none.)

**8.3 Never a gendered word for the player.** No "sir", "madam", "he" or "she" for the player; only the player's tokens.
- Why: the player chooses; see 4.2.
- Example: "Thank you, sir." → "Thank you, {player.formal}."
- Check: `test/contexts.js` ("sir", "madam", "ma'am", and the wrong honorific); the leak checks (the wrong honorific).

**8.4 Never assume the player's partner, children, religion or ethnicity.**
- Why: the player is never asked.
- Example: "Your wife asks when you'll be home." → "Your phone shows three missed calls from home."
- Check: `test/contexts.js` ("wife", "husband", "girlfriend", "boyfriend"); editor review for the rest.

**8.5 Never anything internal on screen.** No raw `{token}`, card or flag id, JSON, "undefined" or "NaN".
- Why: it breaks the world instantly.
- Check: the leak checks and `test/harness.test.js`.

**8.6 Never end on "It is noted."**
- Why: it says nothing; the engine now says when a choice counts at appraisal (5.11).
- Check: editor review only.
