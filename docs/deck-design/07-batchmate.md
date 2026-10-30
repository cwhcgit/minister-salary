# The deck, with the mechanics: The batchmate

[← Cabinet](06-cabinet.md#c180) · [Contents](../DECK-DESIGN.md#contents) · [The endgame →](08-endgame.md#c205)

## <a id="stage-batchmate"></a>The batchmate

Only with the batchmate on: the start screen's option to play against someone from your intake, who climbs alongside you. Cards 198 to 204.

### <a id="c198"></a>198. The 360

[← 197](06-cabinet.md#c197) · [Next → 199](#c199) · [Contents](../DECK-DESIGN.md#contents)

*Only with the batchmate on.*

`rival_360` · rival.json · once a career · weight 7

**Who sees it:** up to Senior Director; with an active batchmate at your grade.

**Shares a decision** (`peer_review`) with [#200](#c200), [#202](#c202): a career sees only one.

It's 360-degree feedback season, when colleagues assess each other anonymously and the ranking panel reads the results. You've been asked to assess Hui Min, your batchmate and your rival for every promotion. The form promises anonymity. It has a free-text box headed "Areas for development".

**A. Write something true and useful.**

> Three sentences on stakeholder management, true and mildly painful. Hui Min acts on all three within a year and never learns where they came from.

- Hidden: Competence up a little (+1), Integrity up (+4).
- Batchmate: goodwill +1.

**B. Write something true and damaging.**

> It is accurate. It is also the only peer comment the ranking panel quotes. Hui Min is described that year as "still developing", which you did not write but did cause.

- Hidden: Standing up a little (+2), Integrity down a lot (−6).
- Sets `undercut_batchmate`.
- Batchmate: goodwill −2; their next score −6.

**C. Write "No comments" and submit.**

> The form accepts it. HR's report later notes "limited peer input" for your whole division. Your blank form is one of the reasons.

- Hidden: Competence down a little (−1), Standing up a little (+1).

[← 197](06-cabinet.md#c197) · [Next → 199](#c199) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c199"></a>199. The Name Put Forward

[← 198](#c198) · [Next → 200](#c200) · [Contents](../DECK-DESIGN.md#contents)

*Only with the batchmate on.*

`rival_name` · rival.json · once a career · weight 12

**Who sees it:** up to Deputy Secretary; with an active batchmate a grade or more ahead of you (the batchmate up to Permanent Secretary) whose goodwill toward you is at least 3.

Hui Min, your batchmate and now senior to you, has been asked to nominate officers for a cross-ministry task force. Everyone understands it is where future leaders get tested. She put your name first.

**A. Accept, and thank her properly.**

> Lunch, on you, at a place Hui Min chose. It was more expensive than she let on, and worth it.

- Hidden: Standing up (+4), the ceiling (CEP) up one grade (+1).
- Batchmate: goodwill +1.

**B. Decline. You would rather go up on your own file.**

> Hui Min says that is fair. It is, and it costs you a year.

- Hidden: Standing down a little (−2), Integrity up a lot (+6).
- Batchmate: goodwill −1.

[← 198](#c198) · [Next → 200](#c200) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c200"></a>200. Annex B

[← 199](#c199) · [Next → 201](#c201) · [Contents](../DECK-DESIGN.md#contents)

*Only with the batchmate on.*

`rival_annex` · rival.json · once a career · weight 7

**Who sees it:** Senior Management Executive to Deputy Secretary; with an active batchmate within one grade of you (the batchmate Senior Management Executive to Deputy Secretary).

**Shares a decision** (`peer_review`) with [#198](#c198), [#202](#c202): a career sees only one.

Hui Min, your batchmate and your rival for every promotion, sends a paper up to the Permanent Secretary at nine tomorrow, and you're copied on the draft. Annex B has the right numbers in the wrong columns, and the recommendation rests on them. A mistake like that would cost Hui Min at the next ranking.

**A. Call her tonight.**

> Hui Min fixes it at 11:50pm and says thank you twice, the second time in a voice you have not heard before.

- Hidden: Competence down a little (−1), Standing up a little (+1), Integrity up (+4).
- Batchmate: goodwill +2.

**B. Say nothing. It is not your paper.**

> The Permanent Secretary finds Annex B in four minutes. For the rest of the year Hui Min is described as "detail-light". You are described as nothing at all, which this year is better.

- Hidden: Standing up a little (+2), Integrity down a little (−1).
- Batchmate: their next score −8.

**C. Raise it at the meeting, helpfully.**

> You are thanked for your rigour. Hui Min thanks you too, later, in the corridor, in a tone the minutes would not have captured.

- Hidden: Competence up a little (+2), Standing up (+4), Integrity down (−3).
- Sets `undercut_batchmate`.
- Batchmate: goodwill −3; their next score −10.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The ranking panel (service, `panel`), 35%: C helps (+3).
- The people who work around you (service, `floor`), 40%: C hurts (−3).

[← 199](#c199) · [Next → 201](#c201) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c201"></a>201. One Posting

[← 200](#c200) · [Next → 202](#c202) · [Contents](../DECK-DESIGN.md#contents)

*Only with the batchmate on.*

`rival_posting` · rival.json · once a career · weight 7

**Who sees it:** Senior Management Executive to Deputy Director; with an active batchmate at your grade.

**Shares a decision** (`one_slot`) with [#64](02-service.md#c64), [#103](02-service.md#c103): a career sees only one.

There's one two-year posting to the Budget Division at the Ministry of Finance this year, the kind that gets people noticed, and your division has two nominees: you and Hui Min, your batchmate. HR suggests the two of you "have a conversation" first. In HR, that means one of you should withdraw.

**A. Withdraw, and say it was your idea.**

> Hui Min goes to Finance. Three weeks later a photograph arrives of the view from her new office. It is, admittedly, a very good view.

- Hidden: Standing down (−3), Integrity up (+5).
- Batchmate: goodwill +3; their next score +6.

**B. Let HR decide on the files.**

> HR decides on the files, which takes six weeks and a matrix.
>
> *If you come out ahead:* The posting goes to you. Hui Min says she had expected it to, which may even be true.
>
> *If Hui Min does:* The posting goes to Hui Min. HR's email to you uses the phrase "many strong candidates". There were two.

- Hidden: Competence up a little (+1).
- Batchmate: a head-to-head now: won, Standing up (+3), the ceiling (CEP) up one grade (+1); lost, Standing down a little (−1).

**C. Make your case to the Director, privately.**

> The Director listens, nods, and promises to "bear it in mind". That is the most anyone has ever got out of that office.
>
> *If you come out ahead:* The posting goes to you. Hui Min hears, eventually, how.
>
> *If Hui Min does:* The posting goes to Hui Min. The Director mentions, in passing, that Hui Min did not come asking.

- Hidden: Standing up (+3), Integrity down (−4).
- Batchmate: goodwill −3; a head-to-head now (you +8): won, Standing up (+3), the ceiling (CEP) up one grade (+1); lost, Standing down (−3).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 40%: A helps (+2) · C hurts (−2).
- The ranking panel (service, `panel`), 30%: A hurts (−1) · C helps (+1).

[← 200](#c200) · [Next → 202](#c202) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c202"></a>202. Views Are Sought

[← 201](#c201) · [Next → 203](#c203) · [Contents](../DECK-DESIGN.md#contents)

*Only with the batchmate on.*

`rival_views` · rival.json · once a career · weight 7

**Who sees it:** Deputy Director to Deputy Secretary; with an active batchmate at your grade.

**Shares a decision** (`not_yet`) with [#127](02-service.md#c127): a career sees only one.

**Shares a decision** (`peer_review`) with [#198](#c198), [#200](#c200): a career sees only one.

Hui Min, your batchmate, has been shortlisted for a post one grade above you both, which would make Hui Min senior to you. The selection panel has asked Hui Min's peers for their views. Yours will be read, and filed, and remembered by someone.

**A. Back her, warmly and specifically.**

> You write half a page and mean all of it. Someone on the panel later shows it to Hui Min, who never mentions it to you and never forgets it.

- Hidden: Standing up a little (+1), Integrity up (+3).
- Batchmate: goodwill +3; their next score +8.

**B. Back her, briefly.**

> Two lines, both true, neither memorable. The panel files them with the others.

- Hidden: Standing up a little (+2).
- Batchmate: their next score +2.

**C. Suggest, carefully, that another year in the grade might help her.**

> The panel finds your view "balanced". Hui Min learns of it eventually, the way everyone here learns everything: from someone who was not supposed to say.

- Hidden: Standing up (+3), Integrity down a lot (−6).
- Sets `undercut_batchmate`.
- Batchmate: goodwill −3; their next score −10.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 40%: A helps (+2) · C hurts (−3).
- The ranking panel (service, `panel`), 30%: A hurts (−1) · C helps (+2).

[← 201](#c201) · [Next → 203](#c203) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c203"></a>203. Saturday

[← 202](#c202) · [Next → 204](#c204) · [Contents](../DECK-DESIGN.md#contents)

*Only with the batchmate on.*

`rival_ward` · rival.json · once a career · weight 7

**Who sees it:** Member of Parliament and up; with an active batchmate (the batchmate Member of Parliament to Minister (MR3)).

Hui Min, your batchmate, is an MP too, and Hui Min's ward has had a difficult year: a lift upgrading that overran, and an angry letter in the newspaper every week. She asked you to walk the ward with her on Saturday morning. Your own ward has a walkabout planned for the same morning.

**A. Go. Walk her ward.**

> Six blocks, two markets, and one auntie who assumes you are Hui Min's campaign manager and tells you exactly what she thinks of her. The letters to the newspaper stop by March. The last one thanks "the MP from the next ward, Ms Lim".

- Hidden: Standing up (+3), Reputation down (−3), Integrity up a little (+2).
- Batchmate: goodwill +3.

**B. Send your volunteers instead.**

> Your volunteers are better at it than you are. Hui Min thanks them by name, which you notice.

- Hidden: Standing up a little (+1), Reputation up a little (+1).
- Batchmate: goodwill +1.

**C. Stay in your own ward.**

> Your ward is pleased to see you. Hui Min manages without you, and remembers the Saturday.

- Hidden: Standing down a little (−1), Reputation up (+3).
- Batchmate: goodwill −2.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your fellow Members of Parliament (politics, `fellowMPs`), 45%: A helps (+2) · C hurts (−2).
- Your party branch and its volunteers (politics, `branch`), 45%: A hurts (−2) · C helps (+2).

[← 202](#c202) · [Next → 204](#c204) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c204"></a>204. First Among Equals

[← 203](#c203) · [Next → 205](08-endgame.md#c205) · [Contents](../DECK-DESIGN.md#contents)

*Only with the batchmate on.*

`rival_first` · rival.json · once a career · weight 12 · priority: drawn the moment it qualifies

**Who sees it:** Minister (MR3) and up; aged 64 or less; needs Standing of at least 60; not after [192. The Succession](06-cabinet.md#c192), A (`bid_for_top`); not after [192. The Succession](06-cabinet.md#c192), B (`kingmaker`); with an active batchmate (the batchmate Minister (MR4) to Deputy Prime Minister).

Who becomes the next Prime Minister, first among equals, is being settled informally by the Cabinet, in a room. It has come down to two names, as the officers you joined with joked it would at your first dinner together: Wei Ling and Hui Min, your batchmate.

**A. Put yourself forward.**

> You say it plainly, to the people who need to hear it. Hui Min says it too, in the next room. It will be decided the way these things are: slowly, and then all at once.

- Hidden: Standing down a little (−2), Reputation up (+4).
- Sets `bid_for_top`: read by [#192](06-cabinet.md#c192).
- Marks [#192](06-cabinet.md#c192) as already seen.
- Batchmate: goodwill −2.

**B. Back Hui Min. Ask for Finance.**

> Hui Min thanks you once, in private, and never again. That is how you know the deal was understood.

- Hidden: Standing up a lot (+6), Integrity up a little (+2), wealth +$150,000.
- Sets `kingmaker`: read by [#192](06-cabinet.md#c192).
- Sets `backed_batchmate`.
- Marks [#192](06-cabinet.md#c192) as already seen.
- Batchmate: goodwill +4; their ceiling +1.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your fellow Members of Parliament (politics, `fellowMPs`), 45%: A hurts (−2) · B helps (+2).

[← 203](#c203) · [Next → 205](08-endgame.md#c205) · [Contents](../DECK-DESIGN.md#contents)

[← Cabinet](06-cabinet.md#c180) · [Contents](../DECK-DESIGN.md#contents) · [The endgame →](08-endgame.md#c205)
