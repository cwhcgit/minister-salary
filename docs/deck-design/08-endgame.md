# The deck, with the mechanics: The endgame

[← The batchmate](07-batchmate.md#c208) · [Contents](../DECK-DESIGN.md#contents) · [Endings →](09-endings.md#endings)

## <a id="stage-endgame"></a>The endgame

The last years: the service's last year, the party's renewal, the offer to stay, the last year in politics, and a Prime Minister's tenure. Cards 215 to 222.

### <a id="c215"></a>215. The Last Year

[← 214](07-batchmate.md#c214) · [Next → 216](#c216) · [Contents](../DECK-DESIGN.md#contents)

`endgame_last_service` · packs/endgame.json · once a career · priority: drawn the moment it qualifies

**Who sees it:** drawn by the engine: the last year in the service, the year before the retirement age (64).

This is your last year in the service. You reach the retirement age, 64, at the end of it, and HR has the date in the system. Ms Chua, your reporting officer, asks how you would like to spend the year. Whatever you leave unfinished goes to your successor in a box file with your initials on the spine.

**A. Write the handover properly.**

> The handover runs to forty pages: the files, the history, and the mobile numbers of the three people who actually know how the system works. Your successor reads it in a weekend and calls once, to say thank you.

- Hidden: Competence up a little (+2), Standing down (−3), Integrity up (+4).
- Sets `last_handover`: named in the Declassified file.
- ↳ Can lead to: [You Found Your Level](09-endings.md#end-level) · [Permanent Secretary](09-endings.md#end-permsec) · [The Tea Was Declined](09-endings.md#end-declined) · [The Invitation Lapsed](09-endings.md#end-withdrawn)

**B. Push one last thing through.**

> Most of your goodwill goes on the change you have wanted for a decade. It is approved in November with your name nowhere on it. Two colleagues who are staying are unhappy, and you can live with that.

- Hidden: Competence up a little (+1), Standing down (−5), Reputation up (+5).
- Sets `last_push`: named in the Declassified file.
- ↳ Can lead to: [You Found Your Level](09-endings.md#end-level) · [Permanent Secretary](09-endings.md#end-permsec) · [The Tea Was Declined](09-endings.md#end-declined) · [The Invitation Lapsed](09-endings.md#end-withdrawn)

**C. Start clearing your desk, quietly.**

> You take one box home a week. By December the desk holds a phone, a pen and a stapler that was there when you arrived. Nobody notices it emptying, which you had half hoped they would.

- Hidden: Competence down a little (−1), Standing up (+3), Reputation down a little (−2).
- Sets `last_cleared`: named in the Declassified file.
- ↳ Can lead to: [You Found Your Level](09-endings.md#end-level) · [Permanent Secretary](09-endings.md#end-permsec) · [The Tea Was Declined](09-endings.md#end-declined) · [The Invitation Lapsed](09-endings.md#end-withdrawn)

<details><summary>This card varies (2 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `when` (the first option that fits)

- You reach the retirement age, 64, at the end of it, and HR has the date in the system *(`due`; when aged 63 or less; shown above)*
- You are past the retirement age of 64, on a one-year re-employment contract that HR has marked "not for renewal" *(`late`)*

**Part 2** · `ro` (the first option that fits)

- Ms Chua asks how you would like to spend the year. *(`senior`; when up to Deputy Secretary; the reporting officer (Ms Chua) in post; shown above)*
- The Head of Civil Service asks how you would like to spend the year. *(`hcs`; when Permanent Secretary and up)*
- Your Permanent Secretary asks how you would like to spend the year. *(`ps`; when up to Deputy Secretary)*

</details>

[← 214](07-batchmate.md#c214) · [Next → 216](#c216) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c216"></a>216. Renewal

[← 215](#c215) · [Next → 217](#c217) · [Contents](../DECK-DESIGN.md#contents)

`endgame_renewal` · packs/endgame.json · once a career · priority: drawn the moment it qualifies

**Who sees it:** drawn by the engine: the year before the first general election after you turn 65; the party asks you not to stand.

The party is renewing its slate before the general election due next year: new candidates in, and Members who will be 65 or older by Polling Day asked to make way. This year it is your turn. The Whip has booked the meeting room with the box of tissues nobody mentions, and asks you, kindly, not to stand again.

**A. Agree, and announce it yourself first.**

> You tell your volunteers on Tuesday night, before the party tells anyone. Your statement says you have decided to make way for younger Members. Every word of it is true except "decided".

- Hidden: Standing up (+5), Reputation up a little (+2), Integrity down a little (−2).
- Sets `renewal_gracious`: named in the Declassified file.
- ↳ Can lead to: [Backbench Lifer](09-endings.md#end-backbench) · [Never Quite Cabinet](09-endings.md#end-office) · [Retired, Honourably](09-endings.md#end-retired)

**B. Ask to stand one more time.**

> You make your case, and make it well. The Whip listens without writing anything down, and says the answer will be the same tomorrow. It is. The slate goes to print without your name.

- Hidden: Standing down a lot (−6), Integrity up (+3).
- Sets `renewal_asked`: named in the Declassified file.
- ↳ Can lead to: [Backbench Lifer](09-endings.md#end-backbench) · [Never Quite Cabinet](09-endings.md#end-office) · [Retired, Honourably](09-endings.md#end-retired)

**C. Agree, if you can introduce your successor to the ward.**

> The party's candidate is a generation younger, with a better CV than yours ever was. All year you take them round every block, coffee shop and void deck, the open ground floor where residents gather, and introduce them as the person who looks after the ward now.

- Hidden: Competence down a little (−2), Standing down a little (−1), Reputation up (+4).
- Sets `renewal_successor`: named in the Declassified file.
- ↳ Can lead to: [Backbench Lifer](09-endings.md#end-backbench) · [Never Quite Cabinet](09-endings.md#end-office) · [Retired, Honourably](09-endings.md#end-retired)

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `due` (the first option that fits)

- the general election due next year *(`next`; when when the end is the renewal election; shown above)*
- the next general election *(`later`)*

</details>

[← 215](#c215) · [Next → 217](#c217) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c217"></a>217. One More Term

[← 216](#c216) · [Next → 218](#c218) · [Contents](../DECK-DESIGN.md#contents)

`endgame_stay` · packs/endgame.json · once a career · priority: drawn the moment it qualifies

**Who sees it:** drawn by the engine instead of [#216](#c216), for Minister (MR4) and up, needs Standing of at least 70: the party asks you to stay on.

The party is renewing its slate before next year's general election, and most Members who will be 65 or older by Polling Day are being asked to make way. You are not. The Prime Minister wants you to stand again and stay in Cabinet to 70, where the party draws the line, and says twice that there is no pressure.

**A. Stand once more.**

> You say yes before the Prime Minister has finished asking, and the Whip puts your name back on the slate. At your next meeting with your volunteers someone asks, kindly, how long you plan to go on.

- Hidden: Standing up (+4), Reputation down a little (−2).
- Sets `stays_on`: named in the Declassified file; read by [#218](#c218).

**B. Make way anyway.**

> You thank the Prime Minister and say no: the slate needs the room more than it needs you. The Prime Minister accepts at once, which you try not to read anything into.

- Hidden: Standing down (−4), Reputation up (+3), Integrity up (+5).
- Sets `made_way`: named in the Declassified file.
- Leaves at the coming election: the career ends there.
- ↳ Can lead to: [Backbench Lifer](09-endings.md#end-backbench) · [Never Quite Cabinet](09-endings.md#end-office) · [Retired, Honourably](09-endings.md#end-retired)

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your party branch and its volunteers (politics, `branch`), 40%: A hurts (−2).
- The party's leadership and the Prime Minister's office (politics, `leadership`), 35%: A helps (+2).

[← 216](#c216) · [Next → 218](#c218) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c218"></a>218. The Last Year

[← 217](#c217) · [Next → 219](#c219) · [Contents](../DECK-DESIGN.md#contents)

`endgame_last_politics` · packs/endgame.json · once a career · priority: drawn the moment it qualifies

**Who sees it:** drawn by the engine: the last year in politics (the year of the renewal election, or the year before 70).

This is your last year in politics. Parliament will be dissolved this year for the general election, and you are not on the party's slate. Whatever you leave unfinished in the ward goes to the next Member, with your notes in the margins. For once, the year is yours to spend.

**A. Write the handover properly.**

> Whoever comes next gets it all on paper: the files, the people who actually know how things work, and which residents to ring first when a lift breaks down. Your successor reads it twice, keeps your number, and uses it.

- Hidden: Competence up a little (+2), Standing down (−3), Integrity up (+4).
- Sets `last_handover`: named in the Declassified file.
- ↳ Can lead to: [Backbench Lifer](09-endings.md#end-backbench) · [Never Quite Cabinet](09-endings.md#end-office) · [Retired, Honourably](09-endings.md#end-retired)

**B. Push one last thing through.**

> You spend what goodwill you have left on one change you have wanted for years, and it goes through before you leave. Two colleagues who are staying on think you could have asked more nicely. You could have.

- Hidden: Competence up a little (+1), Standing down (−5), Reputation up (+5).
- Sets `last_push`: named in the Declassified file.
- ↳ Can lead to: [Backbench Lifer](09-endings.md#end-backbench) · [Never Quite Cabinet](09-endings.md#end-office) · [Retired, Honourably](09-endings.md#end-retired)

**C. Start clearing your desk, quietly.**

> You stop taking new cases and hand the old ones over, one a week. Your volunteers notice before anyone else does, and start planning a dinner you are not supposed to know about.

- Hidden: Competence down a little (−1), Standing up (+3), Reputation down a little (−2).
- Sets `last_cleared`: named in the Declassified file.
- ↳ Can lead to: [Backbench Lifer](09-endings.md#end-backbench) · [Never Quite Cabinet](09-endings.md#end-office) · [Retired, Honourably](09-endings.md#end-retired)

<details><summary>This card varies (2 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `end` (the first option that fits)

- Parliament will be dissolved this year for the general election, and you are not on the party's slate *(`election`; when when the end is the renewal election; shown above)*
- You turn 70 at the end of this year, where the party draws the line, and you will leave Cabinet then and not stand again *(`cabinet`; when after [217. One More Term](#c217), A (`stays_on`); when the end is the age limit, 70)*
- You turn 70 at the end of this year, where the party draws the line, and you will not stand at the next general election *(`limit`; when when the end is the age limit, 70)*

**Part 2** · `left` (the first option that fits)

- Whatever you leave unfinished at the Ministry of Health goes to whoever holds your office next. *(`office`; when Parliamentary Secretary and up)*
- Whatever you leave unfinished in the ward goes to the next Member, with your notes in the margins. *(`ward`; shown above)*

</details>

[← 217](#c217) · [Next → 219](#c219) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c219"></a>219. Your Cabinet

[← 218](#c218) · [Next → 220](#c220) · [Contents](../DECK-DESIGN.md#contents)

`pm_cabinet` · packs/endgame.json · once a career · priority: drawn the moment it qualifies

**Who sees it:** drawn by the engine in a Prime Minister's tenure (3-year tenure: year 1; 4-year tenure: year 1; the tenure is as long as fits before 70).

You are Prime Minister, and your first decision is the Cabinet: who runs which ministry. Your list goes to the Istana on Friday, and the President appoints whoever is on it. Every colleague left off it will know within the hour exactly who decided.

**A. Keep the team you inherited, mostly.**

> Most of the old Cabinet keep their ministries, and two swap. The newspapers call it "continuity". Your colleagues call it generous, and several of them call you, to say so.

- Hidden: Standing up a lot (+6), Reputation down (−3).
- Sets `pm_kept_team`.

**B. Bring in the new names, now.**

> Four Ministers you served with leave Cabinet, and four people a generation younger join it. The newspapers call it bold. Two of the four who left send you very short notes, perfectly polite.

- Hidden: Competence up a little (+2), Standing down a lot (−6), Reputation up (+5).
- Sets `pm_new_team`.

**C. Give the hardest ministry to the colleague who nearly beat you.**

> The colleague who nearly had your job accepts the hardest ministry in one word. That appointment turns out to be your best, and for a year the two of you are the most careful people in every room.

- Hidden: Competence up (+3), Standing down a little (−2), Integrity up (+3).
- Sets `pm_hard_ministry`.

[← 218](#c218) · [Next → 220](#c220) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c220"></a>220. The Rally

[← 219](#c219) · [Next → 221](#c221) · [Contents](../DECK-DESIGN.md#contents)

`pm_rally` · packs/endgame.json · once a career · priority: drawn the moment it qualifies

**Who sees it:** drawn by the engine in a Prime Minister's tenure (4-year tenure: year 2; the tenure is as long as fits before 70).

Your first National Day Rally, the Prime Minister's yearly speech to the nation, is in August: one evening, in Malay, then Mandarin, then English, and the country will remember one announcement from it. Your speechwriters have prepared nine announcements, and would like you to choose.

**A. Lead with one big thing, and spend an hour on it.**

> You spend most of the English speech on one change, with charts. The next morning every front page has the same headline, and your Ministers spend the week explaining the eight things you left out.

- Hidden: Competence down a little (−1), Standing down a little (−2), Reputation up a lot (+6).
- Sets `pm_rally_big`.

**B. Get through all nine, briskly.**

> All nine get a slide and four minutes. The commentary calls it "comprehensive". A month later, the thing most people remember is the joke you made about running out of slides.

- Hidden: Competence up (+3), Standing up (+3), Reputation down (−3).
- Sets `pm_rally_nine`.

**C. Talk about something hard instead.**

> You spend twenty minutes on a problem with no easy answer, and you say there isn't one. The hall goes very quiet. The letters that come in afterwards are the longest your office has ever received.

- Hidden: Standing down (−4), Reputation up a little (+2), Integrity up (+5).
- Sets `pm_rally_hard`.

[← 219](#c219) · [Next → 221](#c221) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c221"></a>221. The Next One

[← 220](#c220) · [Next → 222](#c222) · [Contents](../DECK-DESIGN.md#contents)

`pm_successor` · packs/endgame.json · once a career · priority: drawn the moment it qualifies

**Who sees it:** drawn by the engine in a Prime Minister's tenure (3-year tenure: year 2; 4-year tenure: year 3; the tenure is as long as fits before 70).

When you took office you said you would serve a few years and hand over, and next year will be your last. The party expects your successor to be settled before then. How it is settled will be in the history books, in one paragraph, possibly in a footnote.

**A. Let the younger ministers choose one of themselves.**

> A former Minister sees each of the younger ministers alone, and comes back with one name and the words "overwhelming majority". You were not consulted, by design. You agree with the name anyway.

- Hidden: Standing down (−3), Integrity up (+5).
- Sets `pm_let_them_choose`: named in the Declassified file.

**B. Name your choice, and back them in public.**

> You name your choice at a press conference, and the party lines up behind them within the week. One of the other contenders sends your successor flowers, and sends you nothing, which is fair.

- Hidden: Standing up (+5), Reputation up a little (+2), Integrity down (−3).
- Sets `pm_named_successor`: named in the Declassified file.

**C. Keep it open a little longer.**

> At three press conferences you say it is too early to say. The contenders keep working very hard, which was the point, and the commentators start counting the months.

- Hidden: Competence up a little (+2), Standing up (+3), Reputation down (−4).
- Sets `pm_kept_open`: named in the Declassified file.

[← 220](#c220) · [Next → 222](#c222) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c222"></a>222. Stepping Down

[← 221](#c221) · [Next → Endings](09-endings.md#endings) · [Contents](../DECK-DESIGN.md#contents)

`pm_step_down` · packs/endgame.json · once a career · priority: drawn the moment it qualifies

**Who sees it:** drawn by the engine in a Prime Minister's tenure (3-year tenure: year 3; 4-year tenure: year 4; the tenure is as long as fits before 70).

This is your last year as Prime Minister. Your successor will be sworn in at the Istana, and you will be offered the title of Senior Minister, the one former Prime Ministers have been given, with an office down the corridor from your old one. Until then, how you go is up to you.

**A. Take Senior Minister, and stay in Cabinet a while.**

> You take the title and the office down the corridor. You attend Cabinet, speak last, and most weeks stop yourself from saying how you would have done it.

- Hidden: Competence up a little (+2), Standing up (+4), Integrity down a little (−1).
- Sets `pm_senior_minister`: named in the Declassified file.
- ↳ Can lead to: [Prime Minister](09-endings.md#end-pm)

**B. Leave Cabinet, and go back to your ward.**

> You decline the title, politely, and go back to Meet-the-People Sessions on Tuesday nights. The first resident in the queue has a parking fine. You deal with it personally.

- Hidden: Standing down (−5), Reputation up (+5), Integrity up (+3).
- Sets `pm_back_to_ward`: named in the Declassified file.
- ↳ Can lead to: [Prime Minister](09-endings.md#end-pm)

**C. Spend the last months on the handover, not the farewells.**

> You skip three of the five farewell dinners and spend the evenings with your successor instead, going through every file that will never be in the newspapers. At the swearing-in, your successor's speech begins: "I thank Ms Lim Wei Ling."

- Hidden: Competence up (+3), Reputation down (−3), Integrity up a little (+2).
- Sets `pm_handover`: named in the Declassified file.
- ↳ Can lead to: [Prime Minister](09-endings.md#end-pm)

[← 221](#c221) · [Next → Endings](09-endings.md#endings) · [Contents](../DECK-DESIGN.md#contents)

[← The batchmate](07-batchmate.md#c208) · [Contents](../DECK-DESIGN.md#contents) · [Endings →](09-endings.md#endings)
