# The deck, with the mechanics: The crossing

[← The top of the service](03-top-of-service.md#c121) · [Contents](../DECK-DESIGN.md#contents) · [Politics →](05-politics.md#c130)

## <a id="stage-crossing"></a>The crossing

The tea, the background check and the election: from the service into politics, and what follows from them. Cards 123 to 129.

### <a id="c123"></a>123. An Invitation to Tea

[← 122](03-top-of-service.md#c122) · [Next → 124](#c124) · [Contents](../DECK-DESIGN.md#contents)

`tea_session` · events.json · once a career · weight 100 · priority: drawn the moment it qualifies

**Who sees it:** Director to Permanent Secretary; needs Standing of at least 54; needs Reputation of at least 44; not while the scholarship bond runs; not in the service's last three years before 64.

An email invites you to tea. The sender's title is not explained and there is no agenda, but everyone in the service knows what this is: the governing party is sounding you out to stand for Parliament, as one of its candidates at the next general election. Go, and your whole career will be looked at. Decline, and you stay a civil servant, and the invitation never comes again.

**A. Go.**

> Tea is served, and the conversation is about nothing for forty minutes. Then a second guest arrives with a folder: everything in your career that could embarrass the party. The newcomer opens it, and reads.

- Hidden: Standing up (+5).
- Sets `went_to_tea`.
- Reads out the Folder: the flags the background check would find.
- ↳ Can lead to: [124. The Background Check](#c124), in a year

**B. Decline, politely.**

> You write three sentences and delete two of them. The reply thanks you for your candour. Others invited that year say yes. You will not be asked again, and you will think about this for the rest of your life.

- Hidden: Standing down a lot (−15), Integrity up a lot (+10).
- Sets `declined_tea`.
- ↳ Can lead to: [129. The Other Life](#c129), in six years, 90% · [The Tea Was Declined](09-endings.md#end-declined)

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2*

A phone call: a warm, unhurried voice, which gives no surname, asks if you are free for tea on Thursday. You are suddenly very free. This is how the governing party sounds out people it might ask to stand for Parliament, as its candidates at the next general election. Go, and they will look closely at your past. Say no, and nobody calls again.

**A. Go.**

> Tea is at a club with carpet so thick it swallows footsteps, and the talk is about nothing for an hour. Then the second pot comes, and so does a second visitor, with a folder on your career. The visitor opens it, and reads.

**B. Decline, politely.**

> You say you are honoured, but committed to the service. The voice understands completely, and moves on to the next name on its list. Others invited that year say yes, and you never hear the voice again.

---

*Version 3*

A hand-delivered envelope on your desk asks whether you might spare an hour for tea and a conversation "about the future". It does not say who sent it. It does not need to: this is the governing party's first approach to someone it may ask to stand at the next election, as one of its candidates. Accept, and the party will go through your whole career for anything that could embarrass it. Decline, and the future goes ahead without you.

**A. Go.**

> The hour is in a quiet room with very good chairs. Two people ask for your views on the country. Then the older of the two, without any change of tone, opens a folder on your career and begins to read from it.

**B. Decline, politely.**

> You reply by hand, because it seems right, and say no. A handwritten thank-you arrives within a day. Others invited that year say yes, and the future happens without you in it.

</details>

[← 122](03-top-of-service.md#c122) · [Next → 124](#c124) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c124"></a>124. The Background Check

[← 123](#c123) · [Next → 125](#c125) · [Contents](../DECK-DESIGN.md#contents)

`the_vetting` · events.json

**Who sees it:** only as a follow-up to [123. An Invitation to Tea](#c123) (A: in a year).

Before the party puts you up for election, it checks everything that could come out in a campaign. The person who read from the folder at your tea is back with it, now as your interviewer. Whatever you admit counts against you; admit too much and the invitation quietly lapses. Whatever you hide may surface during the campaign. Nobody says which parts of the folder are the worry.

**A. Disclose everything, including the things they may not have.**

> Your interviewer listens without writing anything until you have finished, then writes for a long time. Whatever happens next, nothing in that folder can surprise you on the campaign trail.

- Hidden: Integrity up a lot (+6), Heat down a lot (−25).
- The Folder, disclosed: each item costs Standing 5 and gives Integrity 2; 3 or more items and the invitation lapses.
- ↳ Can lead to: [125. The Younger Officer](#c125), in three years · [126. The General Election](#c126), the year after (unless the Folder lapses the invitation) · [The Invitation Lapsed](09-endings.md#end-withdrawn)

**B. Answer exactly what is asked and nothing more.**

> The questions are precise and so are your answers. Your interviewer thanks you. Nobody mentions the folder again. It is still there, and anything in it can still come out.

- Hidden: Standing up (+3), Heat up (+5).
- The Folder, concealed: each item may surface in the campaign (20% + Heat/250), costing Reputation 7 and adding Heat 6.
- ↳ Can lead to: [126. The General Election](#c126), the year after

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2*

The background check, in a room with a window that does not open. Before fielding you, the party must know what could come out in a campaign. The person who read from the folder at your tea asks the questions; a colleague writes. Your folder lies between them, closed. Somehow that is worse. Admit too much and the invitation lapses. Hide something and it may surface later.

**A. Tell them everything, including what is not in the folder.**

> You talk for forty minutes and the colleague fills four pages. At the end your questioner says, "Thank you, Ms Lim. That was very complete." It sounds like the highest praise either of them is allowed to give.

**B. Answer the questions you are asked, and only those.**

> Precise questions, precise answers, and nobody opens the folder. When you leave it is still on the table, closed. It will be opened again later, somewhere else, perhaps by a journalist.

---

*Version 3*

The party's background check starts as a form: forty-two questions, three about companies you have never heard of and one, question thirty-one, about a company you have. Then a meeting with the person who read from the folder at your tea, to "go through it together". What you admit now costs you, and too much ends the invitation. What you leave out may come out in the campaign.

**A. Go through all of it, including question thirty-one.**

> You go through everything, and then the things the form did not ask. The meeting runs an hour over. Nobody seems to mind; that appears to have been the point.

**B. Go through what is on the form.**

> Every question is answered completely and exactly. Question thirty-one is answered in eleven words. The meeting ends on time, and the folder goes back into a drawer you do not get to see.

</details>

[← 123](#c123) · [Next → 125](#c125) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c125"></a>125. The Younger Officer

[← 124](#c124) · [Next → 126](#c126) · [Contents](../DECK-DESIGN.md#contents)

`younger_officer` · events.json

**Who sees it:** only as a follow-up to [124. The Background Check](#c124) (A: in three years); when it falls due: up to Permanent Secretary; only if the party's invitation lapsed at the background check (`tea_withdrawn`).

Years ago the party invited you to tea too. At the background check that followed, you told them everything, including what wasn't in their folder on you, and you never heard from the party again. Now a younger officer, just invited to tea, asks you over kopi whether to go, and knows none of this.

**A. Say go, and keep the folder thin.**

> The younger officer goes. Two years later there is a new candidate in the newspapers, crediting an older colleague with the best advice of a career, and not saying what it was. That's the advice working.

- Hidden: Standing up (+3), Reputation up (+3).

**B. Tell the younger officer about your folder.**

> You tell all of it. The younger officer listens the way you once listened at tea, thanks you, and you realise you've just been vetted by someone half your age.

- Hidden: Standing down a little (−2), Integrity up a lot (+8).

[← 124](#c124) · [Next → 126](#c126) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c126"></a>126. The General Election

[← 125](#c125) · [Next → 127](#c127) · [Contents](../DECK-DESIGN.md#contents)

`the_election` · events.json

**Who sees it:** only as a follow-up to [124. The Background Check](#c124) (any choice: the year after).

The party is fielding you at the general election, in a GRC: a large ward split into divisions, where you run as one of a team of five and voters elect the whole team together. You have resigned from the service to stand, and if you lose, the service will not take you back. The minister leading your team asks which division you will look after.

**A. Take the division you're given: share the risk, and the credit.**

> Nine days of walkabouts, meeting voters at every market and coffee shop, with your name fourth on the poster. You shake eleven thousand hands and understand, with total clarity, that almost none of this is about you.

- Hidden: Reputation up (+5).
- Sets `seat_grc`: read by [#143](05-politics.md#c143), [#148](05-politics.md#c148).
- Election, in a GRC team: won with chance 0.60 + Reputation/400 + Standing/500. Won: Member of Parliament; lost: the career ends. Concealed Folder items may surface first.
- ↳ Can lead to: [127. Polling Day, Again](#c127), in five years · [Lost the Ward](09-endings.md#end-lostward)

**B. Take the division the opposition is fighting for.**

> Nine days of walkabouts in the four blocks the opposition has decided to win, while your teammates take the friendlier ones. The minister leading your team calls every evening to ask how it is going, and listens to the answer.

- Hidden: Standing up (+3), Reputation up a little (+1).
- Sets `seat_grc`: read by [#143](05-politics.md#c143), [#148](05-politics.md#c148).
- Election, in a GRC team: won with chance 0.60 + Reputation/400 + Standing/500. Won: Member of Parliament; lost: the career ends. Concealed Folder items may surface first.
- ↳ Can lead to: [127. Polling Day, Again](#c127), in five years · [Lost the Ward](09-endings.md#end-lostward)

**C. Ask for a single seat of your own instead, alone against one opponent: all the risk, and all the credit.**

> Nine days of walkabouts, meeting voters at every market and coffee shop, alone, against a decent opponent with volunteers on every floor. Nobody carries you, and if it goes wrong, there is nobody else to blame.

- Hidden: Standing up (+5), Reputation up a lot (+8).
- Only offered with Reputation of at least 60; otherwise it is left off the card.
- Sets `seat_smc`: read by [#144](05-politics.md#c144), [#147](05-politics.md#c147).
- Election, in a single seat: won with chance 0.28 + Reputation/200. Won: Member of Parliament; lost: the career ends. Concealed Folder items may surface first.
- ↳ Can lead to: [127. Polling Day, Again](#c127), in five years · [Lost the Ward](09-endings.md#end-lostward)

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your fellow Members of Parliament (politics, `fellowMPs`), 40%: A helps (+2) · B helps (+1) · C hurts (−2).
- The party's leadership and the Prime Minister's office (politics, `leadership`), 35%: A hurts (−1) · B helps (+1) · C helps (+1).

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2*

Polling Day is announced on a Monday, and the party names you as a candidate in a GRC: a large ward, split into divisions, that elects a team of five together. You have resigned from the service to stand, so losing ends your career: the service will not take you back. Now you choose your division.

**A. Stand with the team, in the division you're given: shared risk, shared credit.**

> Nine days of walkabouts, meeting voters block by block, teach you which blocks have lifts that stop on every floor. The minister leading your team does the rally speeches. You do the lifts.

**B. Stand with the team, in its hardest division.**

> Nine days of walkabouts, block by block, in the division the other side has picked to fight for. Your name is fourth on the poster and first on every complaint, and the team notices which of you went where.

**C. Ask to stand alone in a single seat instead: your risk, your credit.**

> Nine days of walkabouts, meeting voters block by block, against a real opponent and with nobody to share the result with. Yours is the only name on your posters. It is thrilling for exactly one day.

---

*Version 3*

The party's candidates are photographed in a school hall that smells of floor polish. You have resigned from the service to stand, and if you lose, the service will not take you back. The party has you on a GRC team of five, each looking after a division, which voters elect together. It asks which division you want.

**A. Take the division you're offered.**

> Nine days of walkabouts in a team of five, through markets, coffee shops and lift lobbies, meeting voters. At every coffee shop someone asks which one you are. By the end of the campaign, you can answer.

**B. Take the division nobody wants.**

> Nine days of walkabouts in the division the opposition is targeting, where residents have their questions ready before you reach the lift. Nobody on the team says thank you. Everyone on it knows.

**C. Ask for a single seat instead, alone against one opponent.**

> Nine days of walkabouts, meeting voters at every market and coffee shop, as the only candidate anyone in the ward asks for. By the last rally your voice has gone and your opponent's has not. It feels significant, and is not.

</details>

[← 125](#c125) · [Next → 127](#c127) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c127"></a>127. Polling Day, Again

[← 126](#c126) · [Next → 128](#c128) · [Contents](../DECK-DESIGN.md#contents)

`re_election` · events.json

**Who sees it:** only as a follow-up to [126. The General Election](#c126) (any choice: in five years); [127. Polling Day, Again](#c127) (any choice: in five years).

**Passes by itself** (choice A, with a Meanwhile line) when needs Reputation of at least 60, needs Heat of 39 or less.

Parliament is dissolved on a Tuesday, so there is a general election within weeks and your seat is up again. Lose it, and your political career is over. Nobody is surprised: the party's tents went up under the blocks a fortnight ago. This time the chairman of your party branch, which runs the party's volunteers in your ward, has started using the word "swing" in sentences about you.

**A. Campaign on the record.**

> You stand on a campaign lorry and read out everything the ward got since the last election, as if it were all your doing. Some of it was.

- Hidden: Reputation up a little (+2).
- Re-election: won with chance 0.72 + Reputation/250 (at most 98%); lost, the career ends.
- ↳ Can lead to: [127. Polling Day, Again](#c127), in five years · [128. A Model Ward](#c128), in two years, 50% · [Lost the Ward](09-endings.md#end-lostward)

**B. Walk every block, every night, for nine days.**

> Nine nights, four hundred lift lobbies, and one pair of shoes you will never wear again.

- Hidden: Competence down (−3), Reputation up (+4).
- Re-election: won with chance 0.72 + Reputation/250 (at most 98%); lost, the career ends.
- ↳ Can lead to: [127. Polling Day, Again](#c127), in five years · [128. A Model Ward](#c128), in two years, 50% · [Lost the Ward](09-endings.md#end-lostward)

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your party branch and its volunteers (politics, `branch`), 50%: A hurts (−2) · B helps (+2).
- The press gallery (politics, `pressGallery`), 35%: A helps (+2) · B hurts (−2).

<details><summary>Other versions (6)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2*

The general election is called in the middle of the monsoon, and your seat is contested again. Lose it, and your political career ends with it. Your volunteers have done the sums on last time's result and stopped joking about them, which is how you know the ward is close.

**A. Campaign on the record.**

> You set out what the ward got since the last election at every rally, under a tarpaulin that drips on the front row. The front row stays anyway.

**B. Walk every block, every night, for nine days.**

> You walk the blocks in the rain for nine nights and learn which lift lobbies flood. Residents remember the umbrella longer than anything you said under it.

---

*Version 3*

Parliament is dissolved, and this time the opposition has sent your ward its best candidate: younger than you, fluent, and already photographed with every hawker in the market. Your seat is up, and losing it would end your political career. Your branch chairman has pinned the opponent's leaflet above the photocopier.

**A. Campaign on the record.**

> You hold a press conference with a table of numbers: new lifts, new ramps, a new bus service. Your opponent holds one with a hawker, and gets the better photograph.

**B. Walk every block, every night, for nine days.**

> You visit every stall in the market twice and buy something at each. By Polling Day you have eaten more chicken rice than in the five years before it put together.

---

*Version 4*

The electoral boundaries are redrawn before the general election, and your ward gains four blocks you have never visited. Your seat is up again; lose it, and your political career is over. The new blocks' residents' committee has already written to ask who you are.

**A. Campaign on the record.**

> You campaign on what the old blocks got since the last election. The new blocks listen politely, and then ask what they will get.

**B. Walk every block, every night, for nine days.**

> You walk the four new blocks first, every floor, and by the second night the residents' committee chairman is walking with you, mainly to tell you which doors not to knock on after nine.

---

*Version 5*

The general election falls in the month the bus service your ward has relied on for decades is withdrawn. Your seat is up, and if you lose it your political career is over. The decision was not yours, but the only face at the bus stop is yours, on an election poster.

**A. Campaign on the record.**

> You campaign on everything else the ward got since the last election, which is a great deal. Every question at every rally is about the bus.

**B. Walk every block, every night, for nine days.**

> You ride the replacement service every morning for nine days and talk to everyone on it. It is slower than the old one, and by the end, so are you.

---

*Version 6*

A general election is called, your seat is up again, and losing it would end your political career. This time there is also a video: you, at a community event, mid-sentence, looking bored. It is eleven seconds long, and everyone in the ward seems to have seen it.

**A. Campaign on the record.**

> You put the whole speech online, all forty minutes of it, so voters can see the eleven seconds in context. Eleven people watch it to the end.

**B. Walk every block, every night, for nine days.**

> You walk every block for nine days and let residents see you wide awake. Several tell you that you look much better in person, which you decide to count as support.

---

*Version 7*

Parliament is dissolved, and your seat is contested again; if it goes, so does your political career. Your longest-serving volunteer, who has worked on every campaign since before you arrived, has made a wall chart of every block and its mood. Too many of the blocks are coloured yellow.

**A. Campaign on the record.**

> You give the same speech at every rally, listing what the ward got since the last election. By the last night your volunteer can mouth it along with you, and does.

**B. Walk every block, every night, for nine days.**

> You and your volunteer walk the yellow blocks first, every night for nine days. By the end the chart has more green on it, mostly in your volunteer's handwriting.

</details>

<details><summary>Meanwhile lines (8)</summary>

A year that passes by itself on the habit shows one line, never the same one twice in a career.

**When the seat is safe**

- Another general election. On the campaign lorry you read out everything the ward got in five years: new lifts, a covered walkway, an upgraded hawker centre. You read it all out as if it were your doing, and the lorry driver, who has heard every version of it, nods in the right places.
- After the vote, an open lorry carries you round the ward to thank voters, by the same route as last time, down to the same coffee shop.
- Nine days of campaigning, one rally, and on election night a sample count, an early tally from a few ballot boxes, that tells everyone the result before the real one does.
- Your ward's result is among the first announced, and your volunteers treat this as a personal achievement.
- Election posters go up at the first permitted minute and come down by the date on the permit.
- On Cooling-off Day, the day before the vote, nobody may campaign, so you spend it reading the comments online, and wish you could reply.
- Nomination Day, when the candidates file their papers, then nine days of walkabouts, and a result your campaign manager predicted, in writing, to within a point.
- By the end of the campaign you can rank every coffee shop in the ward by its kopi, privately.

</details>

[← 126](#c126) · [Next → 128](#c128) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c128"></a>128. A Model Ward

[← 127](#c127) · [Next → 129](#c129) · [Contents](../DECK-DESIGN.md#contents)

`model_ward` · events.json · once a career

**Who sees it:** only as a follow-up to [127. Polling Day, Again](#c127) (any choice: in two years, 50%); when it falls due: only if your ward swung to you at a re-election (Reputation 75 or more), once a career (`noticed_swing`).

Your ward's six-point swing towards you at the election, the best result in the region, has reached an internal party paper. It calls your ward a model and credits "Ms Lim Wei Ling and her walkabouts". The party's organising secretary wants you to mentor three new candidates. You suspect the swing was really three things: the volunteers, the Tuesday-night Meet-the-People Sessions where residents queue with their problems, and a weak opponent.

**A. Teach them the walkabout, as the paper says.**

> You teach them to listen to a stallholder on camera without looking like someone listening on camera. Two of them get it. The paper is reprinted with their photographs.

- Hidden: Standing up a lot (+6), Reputation up (+4), Integrity down a little (−2).

**B. Teach them Meet-the-People on Tuesday nights. That is what worked.**

> You take them to your Tuesday Meet-the-People Session. One stays until midnight writing a letter that argues the case, and you recognise the look. The paper is not revised.

- Hidden: Competence up a little (+1), Standing down a little (−2), Reputation up (+4), Integrity up (+5).

**C. Send them to your volunteers instead of you.**

> Your longest-serving volunteer mentors all three for six weeks and refuses lunch every time. All three win their seats. None of their victory speeches mentions the volunteer.

- Hidden: Competence up (+3), Standing down (−4), Integrity up (+5).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your party branch and its volunteers (politics, `branch`), 45%: A hurts (−2) · B helps (+1) · C helps (+2).
- The party's leadership and the Prime Minister's office (politics, `leadership`), 40%: A helps (+2) · B hurts (−1) · C hurts (−2).

[← 127](#c127) · [Next → 129](#c129) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c129"></a>129. The Other Life

[← 128](#c128) · [Next → 130](05-politics.md#c130) · [Contents](../DECK-DESIGN.md#contents)

`other_life` · events.json

**Who sees it:** only as a follow-up to [123. An Invitation to Tea](#c123) (B: in six years, 90%); when it falls due: up to Permanent Secretary.

You declined the party's invitation to tea, years ago, when it wanted to sound you out about politics. Someone invited the same year went, and is now a Minister. On the evening news, that Minister announces a scheme your people designed, and thanks the public service, correctly, in general terms.

**A. Send the Minister a note of congratulations.**

> The Minister replies by hand, remembering the year you were both invited, and admitting to having wondered ever since which of you chose right. The reply doesn't say which way the Minister has decided.

- Hidden: Standing up (+4), Reputation up a little (+2).

**B. Turn off the television and go back to the file.**

> The file is better than the announcement. It usually is. That was, you remind yourself, more or less why you said no.

- Hidden: Competence up (+3), Integrity up (+4).

[← 128](#c128) · [Next → 130](05-politics.md#c130) · [Contents](../DECK-DESIGN.md#contents)

[← The top of the service](03-top-of-service.md#c121) · [Contents](../DECK-DESIGN.md#contents) · [Politics →](05-politics.md#c130)
