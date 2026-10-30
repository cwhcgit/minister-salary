# The deck, with the mechanics: The top of the service

[← The service](02-service.md#c58) · [Contents](../DECK-DESIGN.md#contents) · [The crossing →](04-crossing.md#c143)

## <a id="stage-top"></a>The top of the service

Deputy Secretary and Permanent Secretary. Cards 130 to 142.

### <a id="c130"></a>130. The Moon

[← 129](02-service.md#c129) · [Next → 131](#c131) · [Contents](../DECK-DESIGN.md#contents)

`strange_moon` · packs/strange.json · once a career · weight 0.5

**Who sees it:** Deputy Secretary to Permanent Secretary; not after any of [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#56](01-first-years.md#c56), [#80](02-service.md#c80), [#114](02-service.md#c114), [#115](02-service.md#c115), [#124](02-service.md#c124), [#156](05-politics.md#c156), [#157](05-politics.md#c157), [#188](06-cabinet.md#c188), [#191](06-cabinet.md#c191) (`strange_met`).

A civilisation beyond Jupiter has offered Singapore a moon. The Ministry of Foreign Affairs has drafted the formal reply, a note verbale, declining "with the assurances of its highest consideration", because the Outer Space Treaty bars any country from claiming one. Every ministry has until 5pm to comment, and yours will comment under your name.

**A. Comments: nil.**

> Nil is the most popular comment. The note goes out as drafted. The reply, also a note verbale, presents its compliments and offers a smaller moon.

- Hidden: Competence down a little (−2), Standing up (+4).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#56](01-first-years.md#c56), [#80](02-service.md#c80), [#114](02-service.md#c114), [#115](02-service.md#c115), [#124](02-service.md#c124), [#156](05-politics.md#c156), [#157](05-politics.md#c157), [#188](06-cabinet.md#c188), [#191](06-cabinet.md#c191).

**B. Ask, in a footnote, whether it has ice.**

> It has ice. PUB, the water agency, has a paper on a fifth national tap by Monday. The note is redrafted to decline the moon and keep the conversation open.

- Hidden: Competence up (+4), Standing down (−3), Reputation up (+3).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#56](01-first-years.md#c56), [#80](02-service.md#c80), [#114](02-service.md#c114), [#115](02-service.md#c115), [#124](02-service.md#c124), [#156](05-politics.md#c156), [#157](05-politics.md#c157), [#188](06-cabinet.md#c188), [#191](06-cabinet.md#c191).

**C. Offer Singapore as a neutral venue for talks instead.**

> The note declines the moon and offers Singapore as a neutral meeting place, as it has been for other summits. The offer is accepted by return. Your ministry is now looking for office space near Changi.

- Hidden: Competence down (−4), Standing up (+3), Reputation up (+4).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#56](01-first-years.md#c56), [#80](02-service.md#c80), [#114](02-service.md#c114), [#115](02-service.md#c115), [#124](02-service.md#c124), [#156](05-politics.md#c156), [#157](05-politics.md#c157), [#188](06-cabinet.md#c188), [#191](06-cabinet.md#c191).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- People from other agencies who were in the room or on the email (service, `agencies`), 45%: A helps (+1) · B helps (+1) · C hurts (−2).
- The Minister's office (service, `ministersOffice`), 30%: A hurts (−1) · C helps (+1).

[← 129](02-service.md#c129) · [Next → 131](#c131) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c131"></a>131. Acting

[← 130](#c130) · [Next → 132](#c132) · [Contents](../DECK-DESIGN.md#contents)

`ts_acting` · packs/top_service.json · once a career · weight 5

**Who sees it:** Deputy Secretary only.

The Permanent Secretary is overseas for three weeks, and you are acting in the post. On the second Friday, a decision lands that would normally go upstairs: an agency wants to issue a statement tonight, committing the ministry to a date you think is too early. Upstairs is asleep, seven time zones away.

**A. Decide it yourself. You are acting.**

> You approve the statement with the date a month later, the one change you are sure of. It goes out at nine. The Permanent Secretary, back on Monday, would have chosen a different month, and says so, once.

- Hidden: Competence up a lot (+6), Standing down (−3), Reputation up a little (+2).

**B. Wake the Permanent Secretary.**

> The Permanent Secretary answers on the second ring, wide awake, and decides in a minute. You are thanked for calling. The next week, at a meeting, the Permanent Secretary mentions that some decisions can be made without a phone call.

- Hidden: Competence down a little (−2), Standing up (+4), Integrity up a little (+1).

**C. Hold it until Monday.**

> The agency issues its statement on Monday, with a date the Permanent Secretary approves. Over the weekend a newspaper reports that the ministry "declined to comment", which is technically what happened.

- Hidden: Standing up a little (+2), Reputation down (−4), Integrity up (+3).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- People from other agencies who were in the room or on the email (service, `agencies`), 45%: A helps (+2) · C hurts (−3).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: A helps (+1) · B hurts (−1) · C hurts (−1).

[← 130](#c130) · [Next → 132](#c132) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c132"></a>132. The Model

[← 131](#c131) · [Next → 133](#c133) · [Contents](../DECK-DESIGN.md#contents)

`ts_board` · packs/top_service.json · once a career · weight 7 · starts the `top_service` clock

**Who sees it:** Deputy Secretary to Permanent Secretary; one card on the `top_service` clock every three years.

You sit on the board of one of the agencies your ministry runs at arm's length, as the ministry's representative. Today the board approves its new headquarters: forty per cent over budget, with a sky garden. The chairman asks whether the ministry is comfortable. Nobody has asked the ministry. A model of the building sits on the table.

**A. Say the ministry is comfortable.**

> The board approves it in four minutes. You spend the next quarter making the ministry comfortable: a paper, two meetings and a call to the Minister's office about the sky garden, which survives.

- Hidden: Standing up (+5), Integrity down (−5).

**B. Say you will come back once the ministry has decided.**

> The decision waits a quarter, and the agency's management stays very polite to you. The ministry approves the building with a smaller garden, and the model on the table is quietly replaced with a smaller one.

- Hidden: Competence up (+3), Standing down (−3), Integrity up (+4).

**C. Ask what the forty per cent buys, line by line.**

> It takes two hours. The forty per cent turns out to be thirty-one for the building and nine for the garden. The board approves the building and defers the garden. Management describes the meeting afterwards as "robust".

- Hidden: Competence up a lot (+6), Standing down a little (−2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- People from other agencies who were in the room or on the email (service, `agencies`), 45%: A helps (+2) · B hurts (−1) · C hurts (−2).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: A hurts (−2) · B helps (+2) · C helps (+1).

[← 131](#c131) · [Next → 133](#c133) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c133"></a>133. The Box Marked Successor

[← 132](#c132) · [Next → 134](#c134) · [Contents](../DECK-DESIGN.md#contents)

`ps_successor` · events.json · once a career · weight 9

**Who sees it:** Permanent Secretary only.

The Public Service Division, which makes the service's top appointments, asks every Permanent Secretary to name a successor, in confidence, on a form with one box. Your two Deputy Secretaries are the obvious names. One would carry on everything you have built. The other is sharper, and would quietly undo half of it.

**A. Name the one who would undo it.**

> You write the sharper name, and sign before you can reconsider. The Public Service Division thanks you for your "candour", the word it uses when someone has surprised it.

- Hidden: Competence up a little (+2), Standing down (−3), Integrity up a lot (+6).

**B. Name the one who would carry it on.**

> You write the loyal name, and the Public Service Division agrees within a week. Everything you built will be safe for years, including the parts that shouldn't be.

- Hidden: Standing up (+5), Reputation up a little (+1), Integrity down (−3).

[← 132](#c132) · [Next → 134](#c134) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c134"></a>134. Openness to Challenge

[← 133](#c133) · [Next → 135](#c135) · [Contents](../DECK-DESIGN.md#contents)

`ts_feedback` · packs/top_service.json · once a career · weight 8 · starts the `top_service` clock

**Who sees it:** Permanent Secretary only; one card on the `top_service` clock every three years.

Every few years the Public Service Division, which looks after the careers of the service's most senior officers, asks each Permanent Secretary's officers, anonymously, what they think. Your results are back. You score well on everything except "openness to challenge", where you score lowest of any Permanent Secretary this year. Nobody ever said so to your face.

**A. Show the whole ministry the results, and ask why.**

> You present the slide yourself, lowest score first. The silence lasts eleven seconds. Then come the questions, more than you wanted, some of them fair. The next survey is better, and so is the ministry.

- Hidden: Competence up a little (+1), Standing down a little (−2), Reputation up a lot (+6), Integrity up (+3).

**B. Talk it through with your Deputy Secretaries only.**

> Your Deputy Secretaries agree that the score is unfair. Then, one at a time over the next month, each tells you privately about a meeting where it was not. You change two habits.

- Hidden: Competence up (+3), Standing up a little (+1), Integrity down a little (−2).

**C. File it, and be more open, quietly.**

> You resolve to be more open, and are, in the meetings where you remember to be. The next survey moves by two points, which the Public Service Division calls "a positive trajectory".

- Hidden: Competence down a little (−1), Standing up (+4), Integrity down (−3).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 45%: A helps (+3) · C hurts (−2).
- The officer who countersigns your appraisal (service, `countersigner`), 30%: A helps (+2) · B helps (+1) · C hurts (−1).

[← 133](#c133) · [Next → 135](#c135) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c135"></a>135. The Orphan

[← 134](#c134) · [Next → 136](#c136) · [Contents](../DECK-DESIGN.md#contents)

`ts_orphan` · packs/top_service.json · once a career · weight 8 · starts the `top_service` clock

**Who sees it:** Permanent Secretary only; one card on the `top_service` clock every three years.

A hotline that sits between your ministry and another has been passed back and forth for years, each ministry sure that its callers belong to the other. Its own staff call it the orphan. The other ministry's Permanent Secretary has now written, warmly, to propose that it belongs with you. Whoever takes it gets its backlog, and its headlines.

**A. Take it, with its staff and its backlog.**

> The orphan arrives with nine officers, four thousand unanswered calls and a number nobody may change. A year later the backlog is gone. The other ministry writes to say it always knew the line would be in good hands.

- Hidden: Competence up a lot (+6), Standing down (−3), Reputation up (+3).

**B. Write back, just as warmly, proposing it belongs with them.**

> Your letter is as warm as theirs and twice as long. The letters go on at a dignified pace for eight months, and the callers go on at theirs. The orphan stays where it was, with nobody.

- Hidden: Competence down a little (−1), Standing up (+4), Integrity down (−5).

**C. Propose a joint unit, run by both ministries.**

> The joint unit has two directors, two budgets and one phone line, and its quarterly report needs four signatures. Callers get through more often than before. The officers in the unit call the arrangement, privately, joint custody.

- Hidden: Competence up (+3), Standing up (+3), Reputation down a little (−2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- People from other agencies who were in the room or on the email (service, `agencies`), 45%: A helps (+3) · B hurts (−3) · C helps (+1).
- The people who work around you (service, `floor`), 35%: A hurts (−2) · B helps (+1).

[← 134](#c134) · [Next → 136](#c136) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c136"></a>136. The Podium

[← 135](#c135) · [Next → 137](#c137) · [Contents](../DECK-DESIGN.md#contents)

`ts_podium` · packs/top_service.json · once a career · weight 8 · starts the `top_service` clock

**Who sees it:** Permanent Secretary only; one card on the `top_service` clock every three years.

A payments system at one of the agencies your ministry runs at arm's length has failed, and forty thousand payments went out twice. Tomorrow at ten, someone has to stand at a podium and explain. The agency's chief executive has offered. The Minister's office says the Minister will, if asked. Who stands there is your call.

**A. Let the chief executive face it alone.**

> The chief executive takes forty minutes of questions alone, and does well. The ministry appears in the story only as "the parent ministry", in paragraph nine. At the agency, people notice who was not at the podium.

- Hidden: Standing up (+5), Reputation down a little (−2), Integrity down (−4).

**B. Stand beside the chief executive yourself.**

> A Permanent Secretary at a press conference is a story in itself. The questions the chief executive cannot answer come to you, including whose idea the payments system was. It was the ministry's.

- Hidden: Competence up a little (+2), Standing down (−4), Reputation up a lot (+8), Integrity up (+3).

**C. Ask the Minister to front it, from your brief.**

> The Minister does it from your eleven pages, word perfect. The story is now about the Minister, which the Minister's office had hoped to avoid. You are thanked warmly, and the next brief is written in the Minister's office.

- Hidden: Competence up (+5), Standing down a little (−2), Reputation up a little (+1).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- People from other agencies who were in the room or on the email (service, `agencies`), 45%: A hurts (−3) · B helps (+3) · C helps (+1).
- The Minister's office (service, `ministersOffice`), 40%: A helps (+2) · B hurts (−1) · C hurts (−2).

[← 135](#c135) · [Next → 137](#c137) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c137"></a>137. The Predecessor

[← 136](#c136) · [Next → 138](#c138) · [Contents](../DECK-DESIGN.md#contents)

`ts_predecessor` · packs/top_service.json · once a career · weight 8 · starts the `top_service` clock

**Who sees it:** Permanent Secretary only; one card on the `top_service` clock every three years.

Your predecessor as Permanent Secretary has retired, and now chairs the board of one of the agencies your ministry oversees. Your predecessor also still rings your directors, once a week or so, with suggestions that sound a great deal like instructions. The directors follow them. It is the voice they learned to follow, and nobody has told it to stop.

**A. Ring your predecessor, and ask for the calls to stop.**

> The call is short and very polite on both sides, and the weekly calls stop. The agency's papers to the ministry become noticeably more formal, and arrive, from then on, on the last possible day.

- Hidden: Competence up (+5), Standing down (−4), Integrity up a little (+2).

**B. Tell your directors to bring the suggestions to you.**

> The directors do, for a month. Then the suggestions start arriving at your desk directly, in your predecessor's handwriting, copied to the directors. You have become the person who forwards them.

- Hidden: Competence up (+3), Standing up (+3), Reputation down a little (−1).

**C. Leave it. The suggestions are mostly good.**

> They are mostly good, and the ministry runs very smoothly, in two directions at once. At the agency's annual dinner your predecessor raises a glass to "my successor", and the room laughs a beat too early.

- Hidden: Competence down (−3), Standing up (+5), Reputation down a little (−2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 45%: A helps (+2) · B hurts (−1) · C hurts (−3).
- People from other agencies who were in the room or on the email (service, `agencies`), 35%: A hurts (−3) · B helps (+1) · C helps (+2).

[← 136](#c136) · [Next → 138](#c138) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c138"></a>138. Paragraph Six

[← 137](#c137) · [Next → 139](#c139) · [Contents](../DECK-DESIGN.md#contents)

`ts_sentence` · packs/top_service.json · once a career · weight 8 · starts the `top_service` clock

**Who sees it:** Permanent Secretary only; one card on the `top_service` clock every three years.

You are giving the keynote at an industry conference, and the speech your officers drafted is good. Paragraph six says the ministry will review a rule the industry hates, which is true, and has not been announced. Permanent Secretaries do not announce things; ministers do. Four reporters have registered.

**A. Read paragraph six as written.**

> The review is in the next morning's business pages under your name, which is where the Minister reads about it. The industry is delighted. The Minister's office would like to see your next speech a week early.

- Hidden: Standing down a lot (−6), Reputation up a lot (+7), Integrity up a little (+2).

**B. Cut paragraph six.**

> The speech is sound, and nobody quotes it. A month later the Minister announces the review, in a sentence very like paragraph six, and the industry thanks the Minister.

- Hidden: Standing up (+4), Reputation down (−4).

**C. Send paragraph six to the Minister's office tonight.**

> It comes back at midnight, approved, with every verb softened: "will review" is now "is studying the feasibility of reviewing". You read it as amended. One reporter writes it up, accurately, as nothing.

- Hidden: Competence up a little (+2), Standing up (+3), Integrity down a little (−2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The Minister's office (service, `ministersOffice`), 45%: A hurts (−3) · B helps (+1) · C helps (+3).
- The officer who countersigns your appraisal (service, `countersigner`), 30%: A hurts (−2) · C helps (+2).

[← 137](#c137) · [Next → 139](#c139) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c139"></a>139. The Terms of Reference

[← 138](#c138) · [Next → 140](#c140) · [Contents](../DECK-DESIGN.md#contents)

`ts_terms` · packs/top_service.json · once a career · weight 8 · starts the `top_service` clock

**Who sees it:** Permanent Secretary only; one card on the `top_service` clock every three years.

After a four-day outage of your ministry's main online service, the Minister is appointing a Committee of Inquiry: a retired judge and two experts who can call witnesses, and will publish what they find. Your ministry drafts its terms of reference, which set out what the committee may look at. Drafted generously, that includes you.

**A. Draft them wide: the outage, and the ministry's oversight.**

> The committee sits for eleven months and calls you twice. Its report has a chapter on the ministry, and a paragraph on you that is fair and not kind. Other ministries now give it to new directors to read.

- Hidden: Competence up a little (+2), Standing down (−5), Reputation up a little (+2), Integrity up a lot (+7).

**B. Draft them narrow: the vendor's system, and nothing else.**

> The committee finds the vendor at fault, correctly, in five months. Nobody asks why the ministry chose that vendor, because nobody was allowed to. A columnist asks it anyway, every year, on the anniversary.

- Hidden: Standing up a lot (+6), Integrity down a lot (−6), Heat up a lot (+6).
- Sets `narrow_terms`: in the Folder the background check reads.
- ↳ Can lead to: [Everything Surfaced](09-endings.md#end-scandal)

**C. Let the judge propose the terms, and accept them.**

> The judge proposes terms wider than you would have dared and narrower than you feared, and the Minister signs them unchanged. The report is careful, and the ministry learns more from it than it expected to.

- Hidden: Competence up (+4), Standing down a little (−2), Reputation up (+4).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The Minister's office (service, `ministersOffice`), 40%: A hurts (−2) · B helps (+2) · C helps (+1).
- People from other agencies who were in the room or on the email (service, `agencies`), 40%: A helps (+3) · B hurts (−3) · C helps (+1).

[← 138](#c138) · [Next → 140](#c140) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c140"></a>140. The List

[← 139](#c139) · [Next → 141](#c141) · [Contents](../DECK-DESIGN.md#contents)

`ts_the_list` · packs/top_service.json · once a career · weight 8 · starts the `top_service` clock

**Who sees it:** Permanent Secretary only; one card on the `top_service` clock every three years.

Your Minister comes back from every visit to a market or an estate with a new idea, usually already promised to the residents there. The ministry tracks the ideas on a spreadsheet its officers call the List. It has twenty-three lines, and three officers who work on nothing else. The Minister reads its progress column every Monday.

**A. Deliver all twenty-three. Give the List more officers.**

> The List gets eleven officers and a meeting room of its own. By December twenty ideas are done, and the ministry's own work plan is a quarter behind. The Minister calls it the ministry's best year.

- Hidden: Competence down (−3), Standing up a lot (+6), Reputation up (+3).

**B. Go through it with the Minister, and keep three.**

> It takes two meetings. The Minister keeps four, and asks at the door who will tell the residents about the other nineteen. You do, in the end, by letter, nineteen times.

- Hidden: Competence up a lot (+7), Standing down (−4), Integrity up (+3).

**C. Mark every line "in progress". Do the three that matter.**

> The progress column turns a reassuring amber. Three ideas are done properly. The other twenty stay amber until a Monday a year later, when the Minister asks what amber means.

- Hidden: Competence up (+4), Standing up (+4), Integrity down a lot (−6), Heat up (+5).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The Minister's office (service, `ministersOffice`), 45%: A helps (+2) · B helps (+3) · C hurts (−3).
- The people who work around you (service, `floor`), 40%: A hurts (−3) · B helps (+3).

[← 139](#c139) · [Next → 141](#c141) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c141"></a>141. Two Names

[← 140](#c140) · [Next → 142](#c142) · [Contents](../DECK-DESIGN.md#contents)

`ts_two_names` · packs/top_service.json · once a career · weight 8 · starts the `top_service` clock

**Who sees it:** Permanent Secretary only; one card on the `top_service` clock every three years.

The Head of Civil Service, the most senior official in the service, is moving senior officers between ministries this year, and asks each Permanent Secretary for two names. The obvious first name on your list is Faizal, and everyone knows it, including Faizal. Your ministry would take a year to recover.

**A. Put Faizal first.**

> Faizal moves in March, to a bigger job in a harder ministry, and is very good at it. Your ministry spends the year relearning what Faizal knew. The Head of Civil Service remembers whose name came first.

- Hidden: Competence down (−4), Standing up (+4), Integrity up (+5).
- The junior officer, if this showing named them: leaves the story (moved to another ministry).

**B. Give two other good names.**

> Two good officers move, and the Head of Civil Service thanks you for them. Faizal stays, and hears from a friend in another ministry which names went in. Faizal works exactly as hard as before, and you watch for it.

- Hidden: Competence up (+3), Standing up (+4), Integrity down (−5).
- The junior officer, if this showing named them: marks `kept_back`.

**C. Ask Faizal which list to be on.**

> Faizal asks for a weekend, and then to stay a year to finish the work. You write that on the form. The Head of Civil Service accepts it, and puts a date in a diary that is not yours.

- Hidden: Competence up a little (+2), Standing down (−3), Integrity up (+4).
- The junior officer, if this showing named them: marks `asked_first`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 40%: A helps (+3) · B hurts (−3).
- The people who work around you (service, `floor`), 40%: A hurts (−1) · B hurts (−1) · C helps (+3).

[← 140](#c140) · [Next → 142](#c142) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c142"></a>142. Mentioned Twice

[← 141](#c141) · [Next → 143](04-crossing.md#c143) · [Contents](../DECK-DESIGN.md#contents)

`ts_ward` · packs/top_service.json · once a career · weight 8 · starts the `top_service` clock

**Who sees it:** Permanent Secretary only; one card on the `top_service` clock every three years.

Your ministry is deciding which estates get the next round of a building programme. On the scoring, the estates the Minister represents in Parliament come eleventh. The Minister has not asked for anything. The Minister has mentioned, twice, at two different meetings, how long the residents of one block there have been waiting.

**A. Keep the scoring. Eleventh is eleventh.**

> The list goes up as scored. The Minister approves it without comment, and mentions the block a third time, at a dinner, to someone else. Your officers notice that the scoring held, and say so in the lift.

- Hidden: Standing down (−4), Integrity up a lot (+6).

**B. Find a criterion that moves the Minister's estates up.**

> There is one: distance to a future train station. The estates move up to fourth, defensibly, and the Minister thanks the team for its rigour. The criterion is used again the next year, and moves someone else's estates down.

- Hidden: Competence up a little (+1), Standing up a lot (+6), Integrity down a lot (−7), Heat up a lot (+6).
- Sets `estate_criterion`: in the Folder the background check reads.
- ↳ Can lead to: [Everything Surfaced](09-endings.md#end-scandal)

**C. Ask the Minister, plainly, whether it is a request.**

> The Minister looks surprised and says no, of course not. The scoring stands. The block is never mentioned again in your hearing, and you wonder whether you misread it, and then whether you were meant to.

- Hidden: Competence up (+3), Standing down (−3), Integrity up (+4).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The Minister's office (service, `ministersOffice`), 45%: A hurts (−2) · B helps (+3) · C helps (+1).
- The people who work around you (service, `floor`), 40%: A helps (+3) · B hurts (−3) · C helps (+1).

[← 141](#c141) · [Next → 143](04-crossing.md#c143) · [Contents](../DECK-DESIGN.md#contents)

[← The service](02-service.md#c58) · [Contents](../DECK-DESIGN.md#contents) · [The crossing →](04-crossing.md#c143)
