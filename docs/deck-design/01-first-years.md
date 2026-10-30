# The deck, with the mechanics: The first years

[Contents](../DECK-DESIGN.md#contents) · [The service →](02-service.md#c50)

## <a id="stage-first-years"></a>The first years

Each start's first card, then Management Executive and Senior Management Executive. Cards 1 to 49.

### <a id="c1"></a>1. Four Months In

[Next → 2](#c2) · [Contents](../DECK-DESIGN.md#contents)

`opening_scholar` · packs/openings.json · once a career · weight 1 · priority: drawn the moment it qualifies

**Who sees it:** the first card of every President's Scholar career; aged 25 or less; President's Scholar only.

**Series** `footing` with [#46](#c46), [#2](#c2): shown in full twice a career (the second time asking whether to keep the habit), then its years pass by themselves on the habit; this card opens it.

You came back from your overseas degree four months ago and were posted to the Ministry of Health as an Assistant Director. Your reporting officer is Ms Chua, a Director. Today Ms Chua hands you your first real job: a paper for the Minister, due in two weeks, on why a scheme isn't reaching the people it was built for. The officers who run its counters have done it for years, and nobody has asked them. A scholar's first paper gets read closely.

**A. Spend the first week at the counters.**

> You spend five mornings behind the counters, and the paper says what the counter staff have known for years, with numbers. Ms Chua sends it up unchanged. The Minister's office asks who wrote it, and why it reads as if the writer had been there.

- Hidden: Competence up a lot (+6), Standing down (−3), Integrity up a little (+2).
- Habit: `harder`.

**B. Ask a scholar from your year, now in the Minister's office, what the Minister wants.**

> Your friend in the Minister's office tells you what the Minister likes to read, and in what order. The paper lands well and comes back with a tick. Ms Chua, who wasn't asked, notices that nobody asked.

- Hidden: Competence up a little (+1), Standing up (+5), Integrity down a little (−2).
- Habit: `network`.

**C. Write it from the files, and hand it in early.**

> The files are thorough, and so is your paper: correct, and a day early. It goes up with a tick and comes back with no comment, which for a first paper is a comment.

- Hidden: Competence up (+3), Standing up a little (+2), Reputation down a little (−1).
- Habit: `head_down`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 50%: A helps (+4) · B hurts (−3) · C helps (+1).
- The Minister's office (service, `ministersOffice`), 40%: A hurts (−2) · B helps (+2) · C helps (+1).

[Next → 2](#c2) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c2"></a>2. Eight Months In

[← 1](#c1) · [Next → 3](#c3) · [Contents](../DECK-DESIGN.md#contents)

`opening_grad` · packs/openings.json · once a career · weight 1 · priority: drawn the moment it qualifies

**Who sees it:** the first card of every Local Graduate career; aged 23 or less; Local Graduate only.

**Series** `footing` with [#46](#c46), [#1](#c1): shown in full twice a career (the second time asking whether to keep the habit), then its years pass by themselves on the habit; this card opens it.

You've been a Management Executive at the Ministry of Health for eight months, mostly drafting replies to letters from the public. Your reporting officer is Ms Chua, an Assistant Director. Xin Yi, who joined the same week as you, already gets sent to meetings you don't. Your first appraisal is in four months.

**A. Ask Ms Chua for harder work.**

> Ms Chua gives you a briefing note for a Deputy Secretary, due Friday. It's harder than anything you've done. It goes in on time, with one mistake that Ms Chua catches before anyone upstairs sees it.

- Hidden: Competence up a lot (+6), Standing down a little (−1).
- Habit: `harder`.

**B. Ask Xin Yi how to get into those meetings.**

> Xin Yi says you just ask to sit in. So you ask. The meetings are mostly about scheduling other meetings, but people upstairs now know your face.

- Hidden: Competence down a little (−2), Standing up (+4), Reputation up a little (+2).
- Habit: `network`.

**C. Keep your head down and clear the letters.**

> You clear a hundred and forty replies by December, each one checked twice. Nobody upstairs counts them. Ms Chua does, and starts sending you the letters nobody else wants to answer.

- Hidden: Competence up (+3), Standing down (−3), Integrity up (+4).
- Habit: `head_down`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 40%: A helps (+2) · B hurts (−2) · C helps (+1).
- The ranking panel (service, `panel`), 35%: B helps (+3) · C hurts (−1).

[← 1](#c1) · [Next → 3](#c3) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c3"></a>3. The Counter

[← 2](#c2) · [Next → 4](#c4) · [Contents](../DECK-DESIGN.md#contents)

`the_counter` · events.json · once a career · weight 16 · priority: drawn the moment it qualifies

**Who sees it:** the first card of every Poly, then night classes career; up to Director; Poly, then night classes only.

You're a Management Executive at the Ministry of Health, eight months in. Before this you spent four years working a public service counter, and you're still finishing a part-time degree at night. Your reporting officer, Ms Chua, has set up a team to redesign how the public applies for a scheme. You're the most junior person on it, and the only one who has ever worked a counter.

**A. Tell the team exactly why the new design will fail.**

> You describe, from memory, the eleven things a person at a counter is actually holding in their hands. The room goes quiet, and the design changes. Ms Chua asks where you worked before, and listens to the whole answer.

- Hidden: Competence up a lot (+10), Standing down a little (−2), Reputation up a lot (+6), the ceiling (CEP) up two grades (+2).
- The reporting officer, if this showing named them: marks `heard_about_the_counter`.

**B. Say nothing, and let the pilot show them.**

> The pilot fails exactly the way you knew it would, and you're the one asked to fix it. Being listened to the first time would have been less work.

- Hidden: Competence up (+3), Standing up (+3).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 40%: A helps (+3) · B hurts (−2).
- The people who work around you (service, `floor`), 35%: A hurts (−2).

[← 2](#c2) · [Next → 4](#c4) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c4"></a>4. The Last Paper

[← 3](#c3) · [Next → 5](#c5) · [Contents](../DECK-DESIGN.md#contents)

`the_night_degree` · events.json · once a career · weight 18 · priority: drawn the moment it qualifies

**Who sees it:** up to Deputy Director; Poly, then night classes only.

Your part-time degree is down to one Saturday exam, after six years of evening classes. It's also the busiest month of the year at work. Xin Yi, who joined the service the same year as you, finished her degree at twenty-two, full-time, on a scholarship. Finishing yours opens jobs a diploma doesn't.

**A. Sit the exam and finish it.**

> You pass, with a Second Upper. Nobody at work marks it, because nobody at work knew. But it changes which jobs you can apply for, and, more slowly, which ones you think you can.

- Hidden: Competence up a lot (+8), Standing up (+3), Integrity up (+5), the ceiling (CEP) up two grades (+2).

**B. Defer it. Work needs you this month.**

> The busy month is followed by another, and another. You finish the degree four years later, by which time the jobs it would have opened have gone to other people.

- Hidden: Competence up a little (+2), Standing up (+5), the ceiling (CEP) down one grade (−1).

[← 3](#c3) · [Next → 5](#c5) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c5"></a>5. The Ballot

[← 4](#c4) · [Next → 6](#c6) · [Contents](../DECK-DESIGN.md#contents)

`bto_queue` · events.json · once a career · weight 7

**Who sees it:** up to Director; aged 40 or less.

You've applied for a new flat from HDB, the government's housing board, for the fourth time: a four-room BTO, built to order, in a non-mature estate far from the centre. Flats go by ballot, and every ballot you lose is another year of waiting. At work you are, technically, the government, and a friend from school now works at HDB.

**A. Ballot again like everyone else.**

> Queue number 2,847, for 610 flats. You laugh in the lift. At the next family dinner you explain the scheme much better than before, because now you've also lost.

- Hidden: Integrity up a lot (+8).

**B. Ask a friend at HDB whether anything is coming up.**

> Nothing your friend tells you is secret; it's all on the HDB website three weeks later. Three weeks early is the whole favour, and you both know its exact size. You apply for the launch your friend mentioned, and get a flat.

- Hidden: Standing up a little (+2), Integrity down a lot (−10), Heat up a lot (+10).
- Sets `friend_at_hdb`: in the Folder the background check reads.
- ↳ Can lead to: [6. A Small Favour](#c6), in six years, 75% · [Everything Surfaced](09-endings.md#end-scandal)

**C. Buy a resale flat, second-hand. Take the loan.**

> Done by Thursday. The cash you pay above the valuation hurts for eleven years, and you never again have to explain a queue number at a family dinner.

- Hidden: Competence up (+3), Integrity up (+3).

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2: The Prime Launch*

You're applying for a new flat from HDB, the government's housing board, in a Prime project: central and cheaper now, but you'd have to live there ten years and repay part of the subsidy when you sell. Thousands have applied, and the queue is already longer than the estate. A friend from school now works at HDB.

**A. Apply, and take your chances.**

> Queue number 1,206, for 290 flats. You do the arithmetic once, and then decide not to do it again.

**B. Ask a friend at HDB how the next launch looks.**

> Your friend tells you which launch next quarter will have the shortest queue. It's on the website three weeks later, word for word. For three weeks you were the website, and you get your flat.

**C. Buy a second-hand resale flat instead, and stop thinking about it.**

> You buy a 1990s five-room with its original kitchen cabinets and a view of a multi-storey carpark. The loan is long. The cabinets turn out to be very good.

---

*Version 3: The Fifth Ballot*

You've applied for a new flat from HDB, the government's housing board, five times now and lost every ballot. The results page remembers your login. Your queue numbers, added together, would house a small town. Each lost ballot is another year of rent, and a friend from school now works at HDB.

**A. Ballot again.**

> Queue number 3,104. You screenshot it for a group chat that has become, over five years, mostly a support group.

**B. Ask a friend at HDB what is coming up.**

> Your friend walks you through next quarter's launches over kopi, and every word is on the website three weeks later. You apply for the quietest launch, and your sixth application succeeds. All you got early was public information, and a kopi.

**C. Buy a resale flat, second-hand. Take the loan.**

> Done in a week. The valuation comes in below the price, and the difference must be paid in cash. That's the rule, and it's also most of your savings.

</details>

[← 4](#c4) · [Next → 6](#c6) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c6"></a>6. A Small Favour

[← 5](#c5) · [Next → 7](#c7) · [Contents](../DECK-DESIGN.md#contents)

`small_favour` · events.json

**Who sees it:** only as a follow-up to [5. The Ballot](#c5) (B: in six years, 75%).

Years ago your friend at HDB told you about a flat launch three weeks before it was public, and you got your flat. Now your friend has been in touch: a nephew has applied for a job in the civil service. The nephew is very hardworking, your friend says, and wants no special treatment, only for someone to look at the application.

**A. Make sure someone looks at it.**

> Someone looks at it. The nephew is interviewed, turns out to be very hardworking, and gets the job on merit, probably. The flat and the nephew are now one story, and it's yours.

- Hidden: Standing up (+3), Integrity down a lot (−6), Heat up a lot (+8).
- Sets `returned_favour`: in the Folder the background check reads.
- ↳ Can lead to: [Everything Surfaced](09-endings.md#end-scandal)

**B. Forward it to HR, declaring the connection.**

> HR thanks you for declaring it, and files the declaration next to the application. The nephew isn't shortlisted. Your friend says it's understood, in the tone of someone updating a ledger.

- Hidden: Standing down (−3), Integrity up a lot (+8).

**C. Say you can't, and why.**

> You mention the flat. There's a pause on the line, then a laugh: that was public information, three weeks early. You agree that it was. Neither of you mentions the nephew again.

- Hidden: Standing down a little (−1), Integrity up (+5), Heat down (−4).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The office a confidential paper or decision belongs to (service, `owner`), 35%: A hurts (−3) · B helps (+2) · C helps (+1).
- The civil servants who work with you (politics, `officials`), 35%: A hurts (−3) · B helps (+2) · C helps (+1).

[← 5](#c5) · [Next → 7](#c7) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c7"></a>7. The Improvement Plan

[← 6](#c6) · [Next → 8](#c8) · [Contents](../DECK-DESIGN.md#contents)

`improvement_plan` · events.json

**Who sees it:** only as a follow-up: the year-end review books it for the year after a first D (a formal warning); when it falls due: up to Permanent Secretary.

**Series** `plan` with [#8](#c8): always shown in full.

Last year's D means an improvement plan: three targets, six months, then a review. Miss the targets, or get another D, and you'll be asked to leave. Your reporting officer asks you to sign it, and explains, twice, that signing means you've read it, not that you agree.

**A. Sign it, and meet every target.**

> You meet all three targets, two of them early. The review takes eleven minutes and ends with the word "encouraging". The plan is closed, and so, for now, is the question of you leaving.

- Hidden: Competence up (+3), Standing up a little (+2), this year's appraisal marked up (+10, said on screen).
- Habit: `comply`.
- Closes the improvement plan: another D now ends the career.
- ↳ Can lead to: [The Quiet Conversation](09-endings.md#end-quiet)

**B. Ask HR for a transfer before the review.**

> HR finds you a post in another division, under a director who has never read your file. The plan closes when you move. You start again, among people who don't know you yet.

- Hidden: Competence up (+4), Standing down (−3).
- Habit: `move`.
- Closes the improvement plan, and clears the warnings: a fresh start.

**C. Dispute the D, in writing.**

> Your reply runs to four pages and is filed with the plan. It doesn't change the grade. It does change your reporting officer, who now keeps notes of every meeting with you.

- Hidden: Standing down (−4), Integrity up (+5), this year's appraisal marked up (+4, said on screen).
- Habit: `contest`.
- Closes the improvement plan: another D now ends the career.
- ↳ Can lead to: [The Quiet Conversation](09-endings.md#end-quiet)

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 40%: A helps (+2) · B hurts (−1) · C hurts (−1).

<details><summary>Other versions (7)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2*

Last year's D means an improvement plan: targets to meet in six months, then a review, and if it goes badly you'll be asked to leave. The plan comes on version 4.1 of HR's template, which has a new 150-word box for "Officer's Reflections" and a tick saying you helped write the plan. Someone has ticked it for you.

**A. Fill in the reflections, then meet every target.**

> Your reflections come to exactly 150 words, because the box won't take more. You meet the targets two months early. Version 4.2 of the template uses your plan, without your name, as its example.

**B. Ask HR for a posting before the review.**

> HR moves you to another division before the review is even scheduled. The plan closes as "Officer Transferred", which the HR system counts as a success.

**C. Use the reflections box to disagree, politely.**

> You disagree in 150 words, politely. At the review your reporting officer has clearly read them twice, and asks you something that isn't on the template: what would you change?

---

*Version 3*

Last year's appraisal was a D, so your reporting officer is putting you on an improvement plan. It arrives by email: six targets for the next six months. An HR officer you've never met is copied in, because if you miss the targets, the next conversation is about you leaving. The email's subject line is "Supporting your growth".

**A. Hit every target, and keep proof of each one in writing.**

> Six months, six targets, six emails confirming each one was met. The HR officer replies to the last one, "Noted, thanks", and closes the plan. You have never been so well documented.

**B. Ask HR for a transfer to another division.**

> HR agrees so quickly it seems to have been expecting you. Your new division has never heard of you or your plan, which is exactly what you wanted.

**C. Reply to each target, explaining why it's unfair.**

> Your reply is longer than the plan. The HR officer reads all of it, carefully, and now knows exactly who you are. The plan stays as it was.

---

*Version 4*

Last year's D comes with an improvement plan, and the plan comes with a deadline: six months to meet its targets, then a review that decides whether you stay. It arrives as a form in the HR system. Your reporting officer has ticked four boxes and written one sentence. If you don't acknowledge it within five working days, the system acknowledges it for you.

**A. Acknowledge it, and work through the four boxes.**

> All four boxes are done by the review. The system marks the plan "Completed" in green, then asks you to rate the experience out of five. You give it a four.

**B. Ask HR for a transfer before day five.**

> HR moves faster than the system. By the time the plan acknowledges itself, you've been moved, and it's addressed to a job you no longer have.

**C. Fill the comments box, all 2,000 characters of it.**

> You use exactly 2,000 characters; the box won't take more. Your reporting officer reads every one, books a meeting room, and asks, for the first time, what you think is going wrong.

---

*Version 5*

Last year's D means an improvement plan: three objectives for the next six months, then a review that decides whether you stay. The objectives are, in order: to improve, to show that you've improved, and to "take ownership of your improvement journey". Your reporting officer got them from a leadership course.

**A. Improve, show it, and own the journey.**

> You improve, report it in a monthly email, and own the journey in a slide. All three objectives are marked "Met", and the leadership course asks if it can use your slide.

**B. Ask to continue the journey in another division.**

> HR arranges a transfer within the month. Your new reporting officer has never heard of an improvement journey, and on your first day asks you to fix a spreadsheet instead.

**C. Ask, in writing, how you'll know the journey has ended.**

> Your one-page question is filed with the plan and never answered. At the review, the third objective has quietly disappeared, and the first two are marked "Met".

---

*Version 6*

Last year's D has started an improvement plan, and its first meeting is in a room booked under "Catch-up". Your reporting officer, an HR partner and a printed copy of your objectives are waiting. Fail the review in six months, or get another D, and you will be asked to leave.

**A. Agree the targets in the room, and meet them.**

> You agree all four targets before the meeting ends, which nobody expected, and meet them in five months. The HR partner closes the file and stamps it, with some ceremony, "Closed".

**B. Ask HR, quietly, about a transfer.**

> The HR partner slips you a card on the way out. Within a month you are in another division, and the room booked under "Catch-up" is booked by somebody else.

**C. Ask for the reasons for the D, in writing, first.**

> The reasons arrive three weeks later, two pages long. You agree with one of them. Your reporting officer, reading your reply, agrees with one of yours.

---

*Version 7*

Last year's D means an improvement plan, and this year's plans come with a "buddy", an officer from another division who checks on you once a month. The targets are due in six months; miss them, or get another D, and you will be asked to leave. Your buddy is younger than you, and very kind about it.

**A. Meet the targets, with the buddy's monthly check-ins.**

> You meet the targets, and your buddy's final report is so warm that HR asks whether the two of you are related. The plan is closed.

**B. Ask HR to move you before the first check-in.**

> HR moves you before the buddy's first visit. The buddy is assigned to someone else, and sends you a cheerful message wishing you luck.

**C. Tell the buddy, politely, that the D was wrong.**

> Your buddy listens, writes it all down, and puts it in the monthly report. Nothing changes on paper. Your reporting officer starts asking for your view in meetings, which is something.

---

*Version 8*

The improvement plan for last year's D arrives as a spreadsheet: five targets, each with a weighting, the weightings adding up to a hundred per cent. In six months a review decides whether you stay, and another D decides it for you. Someone has already filled in the column headed "Progress" with zeros.

**A. Fill in the progress column, one target at a time.**

> By the review every row says a hundred per cent, and the spreadsheet turns itself green. HR closes the plan, and keeps your spreadsheet as a template.

**B. Ask for a transfer before the first update is due.**

> HR moves you to another division before the first update. The spreadsheet stays behind, all zeros, in a shared folder nobody opens.

**C. Add a column of your own, headed "Context".**

> Your column runs longer than the rest of the spreadsheet put together. The review reads it, keeps the D, and quietly drops one of the five targets.

</details>

<details><summary>Meanwhile lines (18)</summary>

A year that passes by itself on the habit shows one line, never the same one twice in a career.

**Habit A, `comply`**

- Another improvement plan arrives on the same template, and you do what you did with the first: sign, meet, file.
- Another improvement plan is marked Met and added to your file, which HR now describes as "a pattern".
- The improvement plan comes round again, and you sign where it says acknowledgement and work to its dates.
- Another improvement plan brings the same three objectives in a different order, and you clear them in the old one.
- You meet the new improvement plan's objectives a month early, and the review is cancelled for lack of material.
- The improvement plan arrives with last time's comments still in its margin, and you work through it in the same order.

**Habit B, `move`**

- Another improvement plan arrives, and you ask for a posting again; HR still has your last request on file.
- HR moves you before the new improvement plan's first review and closes it as "Officer Transferred", as before.
- HR processes your transfer request faster than last time, which it treats as a sign of maturity.
- A new improvement plan, then a new division, and a new reporting officer who reads your file from the back.
- You are posted out within the month, and the improvement plan is closed by a system that records you as "Moved On".
- Your transfer is approved before the improvement plan's review is booked, by an HR officer who recognises your name.

**Habit C, `contest`**

- Another improvement plan arrives, and you reply to it in writing, at the same length as last time.
- Your written reply to the new improvement plan is filed beside the old one, and the review moves to a larger room.
- Another improvement plan, another four-page reply, and HR opens a second folder because the first is full.
- You answer the new improvement plan point by point, and your reporting officer now writes everything down, in pen.
- Your written reply cites the previous plan by paragraph number, which nobody on the panel can find.
- The new improvement plan comes with a box for your comments, and your comments come with an annex.

</details>

[← 6](#c6) · [Next → 8](#c8) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c8"></a>8. A Word from the Whip

[← 7](#c7) · [Next → 9](#c9) · [Contents](../DECK-DESIGN.md#contents)

`whip_word` · events.json

**Who sees it:** fires instead of [7. The Improvement Plan](#c7) when that card falls due and this one's conditions hold (the first version that fits); when it falls due: Member of Parliament and up.

**Series** `plan` with [#7](#c7): always shown in full.

Last year your work as an MP was graded a D. So the Party Whip would like a word, over kopi, about your attendance, your ward, and a speech the papers called "brief". Nobody says "improvement plan", but everyone knows that's what this is: another D and your time in politics is over.

**A. Promise to do better, and then do it.**

> You speak in three debates and visit every block in your ward twice. The Whip's next note to you is one line long. It says "Good."

- Hidden: Competence up (+3), Reputation up (+3), this year's appraisal marked up (+10, said on screen).
- Habit: `comply`.
- Closes the improvement plan: another D now ends the career.
- ↳ Can lead to: [The Quiet Conversation](09-endings.md#end-quiet)

**B. Ask to move to a committee where you'd be useful.**

> You're moved to a Government Parliamentary Committee that meets at eight in the morning. It turns out you're a morning person now.

- Hidden: Competence up (+4), Standing down (−3).
- Habit: `move`.
- Closes the improvement plan, and clears the warnings: a fresh start.

**C. Explain, politely, that your ward comes first.**

> The Whip agrees that the ward comes first, and points out that Parliament is also, technically, somewhere you're meant to be.

- Hidden: Standing down (−4), Reputation up (+5), this year's appraisal marked up (+4, said on screen).
- Habit: `contest`.
- Closes the improvement plan: another D now ends the career.
- ↳ Can lead to: [The Quiet Conversation](09-endings.md#end-quiet)

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your party branch and its volunteers (politics, `branch`), 45%: B hurts (−1) · C helps (+2).
- The party's leadership and the Prime Minister's office (politics, `leadership`), 30%: A helps (+1) · C hurts (−3).

<details><summary>Meanwhile lines (12)</summary>

A year that passes by itself on the habit shows one line, never the same one twice in a career.

**Habit A, `comply`**

- The Whip has another word over kopi, and you promise again to do better, and again you do.
- Another word from the Whip, then three more debates, every block visited twice, and a note that says "Good."
- You are reminded, kindly, that the House sits on Mondays, and after that you are there for every one.
- The Whip's word is shorter this time, and your attendance afterwards is longer.

**Habit B, `move`**

- The Whip has another word, and you ask to move committees again; there is one that meets at seven.
- You move to another committee that meets at an hour that suits nobody, so attendance is excellent.
- Another word from the Whip, another committee, and your diary now holds more committees than days.
- The Whip finds you a committee again, and you find, again, that you are useful on it.

**Habit C, `contest`**

- The Whip has another word, you explain again that the ward comes first, and the Whip agrees again, in writing.
- Over kopi you repeat that the ward comes first, and the Whip repeats that Parliament is also somewhere you are meant to be.
- Another word from the Whip, and another polite reply about the ward, filed with the others.
- You tell the Whip the ward comes first, and your attendance record agrees, which is the difficulty.

</details>

[← 7](#c7) · [Next → 9](#c9) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c9"></a>9. Public Sector Transformation

[← 8](#c8) · [Next → 10](#c10) · [Contents](../DECK-DESIGN.md#contents)

`postit_workshop` · events.json · once a career · weight 8

**Who sees it:** up to Senior Director.

**Shares a decision** (`candour_up`) with [#29](#c29): a career sees only one.

Your division has been sent on a two-day offsite to plan its "transformation", and Xin Yi, who joined the service with you, is at your table. Each table has to fill post-its with ways to make the division "more agile, more citizen-centric and more data-driven", with no extra staff or money. The best post-its go into a deck for the Permanent Secretary.

**A. Write down what everyone is actually thinking.**

> Your post-it says "We need three more officers." Xin Yi sticks one beside it that says "Agree." Neither makes it into the deck. The Deputy Secretary running the offsite asks, pleasantly, whose handwriting that was.

- Hidden: Standing down (−5), Reputation up (+3), Integrity up a lot (+8), this year's appraisal marked down (−6, said on screen).
- The peer, if this showing named them: marks `agreed_with_you` (read by [#18](#c18)).

**B. Produce an acronym.**

> You offer S.E.R.V.E. The facilitator writes it up in green marker, and it's on a banner in the lift lobby for the next six years. Nobody ever agrees on what the second E stands for.

- Hidden: Competence down (−3), Standing up a lot (+9).

**C. Volunteer to write the follow-up implementation plan.**

> Nobody else wanted it. Your plan gives every idea an owner and a date, and it's the only document from the offsite that anyone opens twice. The transformation is now, quietly, yours.

- Hidden: Competence up a lot (+8), Standing up (+5), Reputation down a little (−2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 50%: A helps (+3) · B hurts (−3).
- The ranking panel (service, `panel`), 30%: A hurts (−2) · B helps (+2) · C helps (+2).

<details><summary>Other versions (4)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2: Design Thinking*

Your division is spending a day on a design-thinking sprint to redesign one of its services. The wall has a map of the citizen's journey and an imaginary user called "Auntie Mary". The facilitator asks everyone to stick their assumptions in a box marked PARKING LOT. Whatever survives the day becomes next year's plan.

**A. Park the assumption everyone actually has.**

> You write "No new resources" on a sticky note and put it in the parking lot. The facilitator laughs, stops laughing, and moves it to a corner. The Deputy Secretary who paid for the facilitator watches it go.

**B. Give Auntie Mary a tagline.**

> You offer "Auntie Mary: Served Once, Served Right." It's printed on a tote bag, and for years you see the tote bag at hawker centres, carried by people who were never at the sprint.

**C. Volunteer to turn the wall into a plan.**

> Nobody else wanted the wall. Your plan is the only thing from the sprint that outlives the sprint, and so, without anyone deciding it, the redesign becomes yours.

---

*Version 3: The Retreat*

The ministry is holding a two-day retreat at a Sentosa hotel to agree its new values, and every officer has to join a breakout room. The rooms are named after the old values. You're in Integrity, the room with no window. Each room reports one idea back to the Permanent Secretary at five.

**A. Say what the division actually needs: more officers.**

> You say the division needs three more officers, not a fourth value. The room agrees in silence, and the scribe doesn't write it down. Your point reaches the Permanent Secretary anyway, because the scribe repeats it over coffee.

**B. Propose a new value.**

> You propose "Ownership with Heart". It's adopted by the afternoon, and by the end of the quarter it's printed on every lanyard in the ministry, including yours.

**C. Volunteer to write up the retreat.**

> You write it up properly, with an owner and a date for every action. It's the first retreat report anyone has acted on, and you're now, somehow, in charge of all of it.

---

*Version 4: 2060*

Your division spends a day imagining four possible futures for Singapore in 2060, so that it can plan for all of them. The facilitator's one rule is that nobody says "budget" before lunch. By eleven you notice that all four futures have your division in them, with exactly today's staff.

**A. Say "budget" at 11:15.**

> You point out that all four futures assume today's headcount. The facilitator writes "resourcing" on the whiteboard outside all four futures, in a corner that belongs to none of them, and the Deputy Secretary at the back makes a note.

**B. Give the four futures names.**

> You call them Harbour, Haze, Heartland and Hive. The names outlive the exercise by a decade. Hive turns up years later in a Minister's speech, meaning something else entirely.

**C. Volunteer to write up the implications.**

> Nobody else wanted to. Your paper turns four futures into six actions, each with an owner and a date. Two of them happen within the year: the only part of 2060 to arrive early.

---

*Version 5: The Innovation Challenge*

Your division is running an innovation challenge: five teams pitch for five minutes each, and a panel of three directors gives the winner \$5,000 to build a prototype. Winning gets a team noticed upstairs. Your team's idea is good. The team before yours has a logo.

**A. Pitch the real problem: the team is short of people.**

> You spend your five minutes on headcount. The panel thanks you for your candour and gives the grant to the logo. Your slide turns up, without your name on it, at the next directors' retreat.

**B. Give your idea a logo, and an acronym.**

> Your idea becomes S.P.A.R.K. and wins by one vote. The panel's chair hands over the cheque and asks what it stands for. Nobody on your team can remember.

**C. Offer to build whichever idea wins.**

> The logo wins, and its team moves straight on to next year's challenge. Over the next year you quietly build their idea. Version two, the one that actually works, is yours.

</details>

[← 8](#c8) · [Next → 10](#c10) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c10"></a>10. Reply All

[← 9](#c9) · [Next → 11](#c11) · [Contents](../DECK-DESIGN.md#contents)

`reply_all` · events.json · once a career · weight 5

**Who sees it:** up to Senior Management Executive.

At 4:52pm on a Friday, you accidentally send the whole division your draft reply, with your notes to yourself still in square brackets. Email recalls rarely work, and on Monday everyone will remember whose name was on it. Xin Yi, who joined the service with you, messages you within the minute: "Check your sent folder."

**A. Send a short correction to everyone, now.**

> Your correction is two lines long. The square brackets are discussed for a week, and then quoted, fondly, at the division retreat.

- Hidden: Competence up (+4), Standing down (−3), Reputation up a little (+2), Integrity up (+4).
- The peer, if this showing named them: marks `warned_you`.
- The reporting officer, if this showing named them: marks `saw_your_reply_all`.

**B. Recall it, and hope.**

> The recall reaches the people who hadn't opened it. Everyone else receives a second email, saying you would like to recall the first.

- Hidden: Standing up (+5), Integrity down a lot (−6), Heat up (+5).
- The peer, if this showing named them: marks `warned_you`.
- The reporting officer, if this showing named them: marks `saw_your_reply_all`.

**C. Reply all once more, with an apology and a joke.**

> The joke lands. Two people you've never spoken to say hello in the lift the following week.

- Hidden: Competence down a little (−1), Standing down (−3), Reputation up a lot (+6).
- The peer, if this showing named them: marks `warned_you`.
- The reporting officer, if this showing named them: marks `saw_your_reply_all`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 40%, when the part `to` is `division`: A helps (+2) · B hurts (−2) · C helps (+3).
- People from other agencies who were in the room or on the email (service, `agencies`), 40%, when the part `to` is `agencies`: A helps (+2) · B hurts (−2) · C hurts (−3).
- The Minister's office (service, `ministersOffice`), 60%, when the part `to` is `minister`: A helps (+2) · B hurts (−3) · C hurts (−4).

<details><summary>This card varies (3 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `sent`

- your draft reply, with your notes to yourself still in square brackets *(`draft`; shown above)*
  - `fix`: Your correction is two lines long. The square brackets are discussed for a week, and then quoted, fondly, at the division retreat.
- last year's figures, attached instead of this year's *(`attachment`)*
  - `fix`: Your correction attaches the right file and the words "with apologies". By then, three people have already pasted last year's figures into something.
- the words "Is this serious?" in a reply meant for one person *(`aside`)*
  - `fix`: Your correction explains that the line wasn't meant to go round. By then it's the most widely read thing you've ever written.

**Part 2** · `to`

- the whole division *(`division`; shown above)*
  - `joke`: The joke lands. Two people you've never spoken to say hello in the lift the following week.
- forty-one agencies *(`agencies`)*
  - `joke`: Forty agencies ignore the joke. One replies all to ask to be taken off the list, and the whole thing starts again.
- the Minister's office *(`minister`; choice A: Standing down a little (−1); choice C: Standing down (−3))*
  - `joke`: The Minister's office doesn't reply. By Monday your joke has been forwarded back to you three times, without comment, which is a comment.

**Part 3** · `noticed`

- Xin Yi messages you within the minute: "Check your sent folder." *(`peer`; shown above)*
- Ms Chua replies to all, "Noted, thanks," which keeps the thread alive into the weekend. *(`senior`; choice B: Standing down a little (−2))*
- Nobody says anything. Everyone has read it. *(`nobody`)*

</details>

[← 9](#c9) · [Next → 11](#c11) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c11"></a>11. The Appraisal Conversation

[← 10](#c10) · [Next → 12](#c12) · [Contents](../DECK-DESIGN.md#contents)

`the_appraisal_talk` · events.json · can come back · weight 10

**Who sees it:** up to Deputy Secretary.

**Series** `appraisal`: shown in full twice a career (the second time asking whether to keep the habit), then its years pass by themselves on the habit; a card whose Meanwhile lines are spent is not drawn again.

**The second showing** (folded below): keeping the habit adds Competence up a little (+1), Reputation down a little (−1); breaking it adds Standing down a little (−1), Reputation up a little (+1).

**A Meanwhile year with no habit:** Competence up a little (+1), Standing up a little (+1).

It's your yearly appraisal conversation with Ms Chua, your reporting officer: forty minutes and a form with six competency areas. What goes on the form is taken to the ranking meeting that decides your grade. Halfway through, Ms Chua says, "I'd like you to be more visible," without saying to whom.

**A. Ask directly where you stand.**

> "Rankings aren't really something we discuss," Ms Chua says, kindly. It's a complete answer.

- Hidden: Competence up a little (+2), Standing down (−4), Integrity up (+4).
- Habit: `standing`.

**B. Agree to be more visible.**

> You volunteer for two committees. It works, in the sense that more people have now seen you.

- Hidden: Standing up (+3), Reputation up (+4).
- Habit: `visible`.

**C. Ask what needs doing that nobody is doing.**

> Ms Chua thinks for a moment, then names something real: a backlog nobody owns. You clear it by June. That one answer was worth the other thirty-nine minutes.

- Hidden: Competence up (+5), Standing up (+4).
- Habit: `needs`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The ranking panel (service, `panel`), 35%: A hurts (−3) · B helps (+1) · C helps (+2).
- The people who work around you (service, `floor`), 60%, version 5 only: A hurts (−2) · B helps (+3) · C helps (+2).

<details><summary>When it comes back (3 scenes)</summary>

The series' second full showing, written per habit: the habit is the first choice, and the answer stands for the rest of the career.

---

*If your habit so far is “Ask directly where you stand.” (`standing`):*

**The Appraisal Conversation**

Your yearly appraisal conversation with Ms Chua, your reporting officer, has come round again: forty minutes, a form, and the ranking meeting after it. Every year you ask exactly where you stand, and Ms Chua now has an answer ready. How you spend this one is how you'll spend every one after it.

**A. Ask where you stand, as you always do.**

> Ms Chua gives the ready answer, word for word, and adds "as before". It's still not an answer. It has become a tradition, which is nearly the same thing.

- Hidden: Competence up (+3), Standing down (−4), Reputation down a little (−1), Integrity up (+4).
- Habit: `standing`.

**B. Agree, this time, to be more visible.**

> You volunteer for two committees. Ms Chua writes "more visible" on the form, in the box where it has always said "asked about prospects".

- Hidden: Standing up a little (+2), Reputation up (+5).
- Habit: `visible`.

**C. Ask what needs doing that nobody is doing.**

> Ms Chua, braced for the usual question, is so relieved that the answer comes at once: a backlog nobody owns. You clear it by June.

- Hidden: Competence up (+5), Standing up (+3), Reputation up a little (+1).
- Habit: `needs`.

---

*If your habit so far is “Agree to be more visible.” (`visible`):*

**The Appraisal Conversation**

Your yearly appraisal conversation with Ms Chua, your reporting officer, has come round again, and the word "visible" is already on the form. Every year you agree to be more visible, and you are: committees, panels, photographs. How you spend this one is how you'll spend every one after it.

**A. Agree to be more visible, as usual.**

> Two more committees and one more panel. By December you're visible in rooms you didn't know the ministry had, and the form says so, again.

- Hidden: Competence up a little (+1), Standing up (+3), Reputation up (+3).
- Habit: `visible`.

**B. Ask, plainly, where all that has got you.**

> Ms Chua looks at the list of committees for a long time, and says it's "a strong foundation". Neither of you writes it down.

- Hidden: Competence up a little (+2), Standing down (−5), Reputation up a little (+1), Integrity up (+4).
- Habit: `standing`.

**C. Ask what needs doing instead.**

> Ms Chua names a backlog nobody owns, and you drop a committee to clear it. The committee doesn't notice you've gone. The backlog does.

- Hidden: Competence up (+5), Standing up (+3), Reputation up a little (+1).
- Habit: `needs`.

---

*If your habit so far is “Ask what needs doing that nobody is doing.” (`needs`):*

**The Appraisal Conversation**

Your yearly appraisal conversation with Ms Chua, your reporting officer, has come round again. Every year you ask what needs doing that nobody is doing, and Ms Chua now arrives with a list. How you spend this one is how you'll spend every one after it.

**A. Take the list, as usual.**

> Three things nobody owned, all done by June. Ms Chua has started saving them up for you, which is a compliment of a kind.

- Hidden: Competence up a lot (+6), Standing up (+4), Reputation down a little (−1).
- Habit: `needs`.

**B. Ask, this time, where you stand.**

> Ms Chua is surprised into honesty: "Better than you think, and not as well as you'd like." It's the most useful sentence anyone says to you all year.

- Hidden: Competence up a little (+2), Standing down (−5), Reputation up a little (+1), Integrity up (+4).
- Habit: `standing`.

**C. Agree, this time, to be more visible.**

> You take the list and present it, item by item, at the divisional meeting. People who had been benefiting from your work quietly learn your name.

- Hidden: Standing up a little (+2), Reputation up (+5).
- Habit: `visible`.

</details>

<details><summary>Other versions (4)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2*

It's appraisal week. HR has redesigned the form: four areas instead of six, a new section called "Aspirations", and a box for Ms Chua, your reporting officer, to give an overall impression that's bigger than all the others put together. Everyone knows the big box is what decides your grade.

**A. Ask what your overall impression says.**

> "It's still being calibrated." Ms Chua turns the form face down, gently. You'll find out with everyone else, when the grades come out.

**B. Fill in "Aspirations" with something ambitious.**

> You write "to lead a cross-agency effort". A month later you're put on one, as an ordinary member. Ms Chua calls it a good first step.

**C. Ask which of the four areas actually counts.**

> Ms Chua pauses, then says which area really counts: "Ownership." So you spend the year taking charge of things nobody else wanted. It shows, and it's noticed.

---

*Version 3*

This year's appraisal conversation is a video call, because Ms Chua, your reporting officer, is overseas on a course. The camera at the other end is off, and the connection is excellent. What's said in these forty minutes goes into this year's grade, and with the camera off you can't tell how any of it is landing.

**A. Ask, plainly, where you stand.**

> "You're doing fine." There's a long silence on the line, then: "Fine is good." It's clearly not the whole sentence.

**B. Turn your camera on, and keep it on.**

> Eventually the other camera comes on too. The second half of the call is noticeably warmer. You are now, in a small way, visible.

**C. Ask what Ms Chua wants done while away.**

> Ms Chua lists three things. You finish two of them before Ms Chua flies home, and Ms Chua mentions it at the ranking meeting that decides grades, the only meeting that matters.

---

*Version 4*

Your appraisal conversation is in a meeting room booked for thirty minutes, and it's the only time this year Ms Chua, your reporting officer, will sit down with you before writing your grade. Ms Chua arrives twelve minutes late, from another officer's appraisal, carrying that officer's form by mistake.

**A. Ask, while there's time, where you stand.**

> Ms Chua glances down at someone else's form and says that's above her pay grade. It may be the only literal thing anyone says to you all year.

**B. Use the eighteen minutes to list what you did.**

> You get through the list in eleven minutes. Ms Chua writes down four items, and they're the four taken to the ranking meeting that decides your grade. You learn which four to lead with next year.

**C. Ask what Ms Chua needs from you this year.**

> The answer comes before Ms Chua has even sat down: a paper nobody has started. You start it that afternoon, and next year's appraisal begins on time.

---

*Version 5*

This year your appraisal includes anonymous feedback from the people who work around you, and Ms Chua, your reporting officer, reads it out. One comment says you "never say no to anything from upstairs", so the extra work lands on everyone else. Fair or not, it will go in your file.

**A. Ask what the comment means for your grade.**

> Ms Chua says it's "a development point, not a grading point", and then that grades aren't discussed before the ranking meeting. Both halves are true, and only one of them was an answer.

**B. Say you'll be more visible to the people around you, not just upstairs.**

> You start a monthly lunch for the people around you. Attendance is excellent. Next year's anonymous comment is about the lunches, and it's fond.

**C. Ask what Ms Chua needs you to say no to.**

> Ms Chua names two jobs you could stop doing for upstairs. You stop both, and the people around you notice before Ms Chua does.

</details>

<details><summary>Meanwhile lines (15)</summary>

A year that passes by itself on the habit shows one line, never the same one twice in a career.

**Habit A, `standing`**

- At your appraisal you ask where you stand, and are told it's "not a helpful way to think about it", the most precise answer yet.
- Your appraisal: forty minutes, six competency areas, and one question from you, about where you stand, that nobody writes down.
- At your appraisal you ask where you stand, and are offered a coaching session on curiosity.
- You ask at your appraisal where you stand, and the question is recorded under "Officer's Aspirations", a box on the form.
- You ask where you stand at the end of your appraisal, when there are two minutes left.

**Habit B, `visible`**

- You agree again to be more visible, and at the next appraisal you're told that you have been.
- Your appraisal: six competency areas, one new acronym and the phrase "stretch assignment", with you nodding at the right moments.
- You're more visible this year, mostly in the background of other people's photographs.
- Your visibility is praised at a meeting you went to mainly in order to be seen there.
- Your visibility is discussed at your appraisal for forty minutes, in a room with no windows.

**Habit C, `needs`**

- At your appraisal you ask what isn't being done. By March it's done, and your name is on the list for the next good posting.
- You ask what would have helped in this year's "very tight" ranking, and, unusually, you're told.
- The things nobody was doing become your things, each with a thank-you for asking.
- The list of work nobody is doing gets shorter by March and longer by June, with your name at the top.
- You ask what needs doing. A great deal does, and now it's on your list instead of anyone else's.

</details>

[← 10](#c10) · [Next → 12](#c12) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c12"></a>12. A Year Without Incident

[← 11](#c11) · [Next → 13](#c13) · [Contents](../DECK-DESIGN.md#contents)

`the_quiet_year` · events.json · can come back · weight 6

**Who sees it:** any grade.

**Series** `effort` with [#13](#c13): shown in full twice a career (the second time asking whether to keep the habit), then its years pass by themselves on the habit; a card whose Meanwhile lines are spent is not drawn again.

**The second showing** (folded below): keeping the habit adds Competence up a little (+1), Reputation down a little (−1); breaking it adds Standing down a little (−1), Reputation up a little (+1).

**A Meanwhile year with no habit:** Competence up a little (+1), Integrity up a little (+1).

Nothing goes wrong this year. Everything you're responsible for runs, and when you go to Bintan for a week in June, nothing breaks while you're away. That means either you've set things up well, or nothing needs you. You have a year to decide which.

**A. Use it to fix something nobody asked you to fix.**

> You get a process fixed that has annoyed eleven thousand people for a decade. It takes the whole year, and it's never announced.

- Hidden: Competence up (+5), Standing down a little (−1), Integrity up (+3).
- Habit: `substance`.

**B. Use it to build your network.**

> Coffees, lunches, and a great deal of being remembered. It isn't work. It is, unmistakably, the job.

- Hidden: Standing up (+5), Reputation up (+3).
- Habit: `visibility`.

**C. Use it to rest.**

> You rest. It turns out you needed the rest more than anything needed fixing, or anyone needed lunch with you.

- Hidden: Competence down a little (−1), Reputation down a little (−1), Integrity up a little (+2).
- Habit: `low`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 35%: A helps (+3) · B hurts (−1) · C hurts (−2).
- The ranking panel (service, `panel`), 30%: B helps (+3) · C hurts (−1).
- The party's leadership and the Prime Minister's office (politics, `leadership`), 30%: A helps (+3) · B hurts (−1) · C hurts (−2).
- Your fellow Members of Parliament (politics, `fellowMPs`), 30%: B helps (+2) · C hurts (−2).

<details><summary>When it comes back (3 scenes)</summary>

The series' second full showing, written per habit: the habit is the first choice, and the answer stands for the rest of the career.

---

*If your habit so far is “Use it to fix something nobody asked you to fix.” (`substance`):*

**Another Quiet Year**

Another year without incident: everything runs, and your diary has empty afternoons. Your quiet years have a pattern by now: you fill them by fixing things nobody asked you to fix, and say nothing about it. What you do with this one decides the quiet years after it, and nobody will ask about them again.

**A. Find the next thing that needs fixing.**

> This year it's the leave form, which asked for your reason three times. It asks once now. Nobody announces it, and you've stopped expecting anyone to.

- Hidden: Competence up a lot (+6), Standing down a little (−1), Reputation down a little (−1), Integrity up (+3).
- Habit: `substance`.

**B. Spend this one on lunches.**

> Eleven lunches and a dinner, with people you've fixed things for without their knowing. Now they know, and several of them say so in rooms you're not in.

- Hidden: Standing up (+4), Reputation up (+4).
- Habit: `visibility`.

**C. Rest. You've earned it.**

> You rest, and the next broken thing stays broken for the year. Someone else fixes it eventually, and is thanked for it. You sleep well anyway.

- Hidden: Competence down a little (−1), Standing down a little (−1), Integrity up a little (+2).
- Habit: `low`.

---

*If your habit so far is “Use it to build your network.” (`visibility`):*

**Another Quiet Year**

Another year without incident, and the diary has gaps in it again. Your quiet years have a pattern by now: you fill them with coffees and lunches, and you're invited to more things than you can attend. What you do with this one decides the quiet years after it, and nobody will ask about them again.

**A. Accept everything, as usual.**

> Forty lunches, a reception a week, and a phone full of people who call you "a friend". Some of them mean it.

- Hidden: Competence up a little (+1), Standing up (+5), Reputation up a little (+2).
- Habit: `visibility`.

**B. Turn down the lunches. Fix something instead.**

> You decline nine invitations and fix the process that slows every new joiner's first week. Three people stop inviting you. The new joiners never find out you were busy.

- Hidden: Competence up (+5), Standing down a little (−2), Reputation up a little (+1), Integrity up (+3).
- Habit: `substance`.

**C. Accept nothing. Go home on time.**

> You go home on time all year. The invitations thin out by June, and by December you can't honestly say you mind.

- Hidden: Competence down a little (−1), Standing down a little (−1), Integrity up a little (+2).
- Habit: `low`.

---

*If your habit so far is “Use it to rest.” (`low`):*

**Another Quiet Year**

Another year without incident, and nothing needs you. Your quiet years have a pattern by now: you take them as rest, your leave, all of it, and home by six. What you do with this one decides the quiet years after it, and nobody will ask about them again.

**A. Rest, as you always do.**

> You take every day of leave you're owed, and the office runs without you. The leave system flags it as unusual. Nobody else does.

- Hidden: Reputation down a little (−2), Integrity up a little (+2).
- Habit: `low`.

**B. Use this one to fix something.**

> You find the thing that has annoyed everyone for years, and fix it by September. People are surprised it was you, and say so, which is less flattering than it sounds.

- Hidden: Competence up (+5), Standing down a little (−2), Reputation up a little (+1), Integrity up (+3).
- Habit: `substance`.

**C. Use this one to see people.**

> Lunches again, after a long gap. Several people are pleased to see you, and two of them had assumed you'd left the service.

- Hidden: Standing up (+4), Reputation up (+4).
- Habit: `visibility`.

</details>

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2*

This year brings no crisis, no reorganisation and no question in Parliament with your name in it. Your diary has empty afternoons, something nobody around you has seen in years. Everyone has noticed, and is pretending not to. Empty afternoons get filled, and for once you can choose with what.

**A. Use it to fix something small and permanent.**

> You fix the thing that has made every new joiner's first week worse for a decade. Nobody thanks you. The new joiners never find out what it used to be like.

**B. Use it for the lunches you keep postponing.**

> Eleven lunches, four dinners and one kopi at a hawker centre that turns out to matter more than the dinners. People remember you now in a way they didn't.

**C. Use it to sleep.**

> You sleep. Your doctor, who has been saying things for three years, says nothing at all: the nicest thing a doctor has ever said to you.

---

*Version 3*

Nothing much happens to you this year. The most discussed thing on your floor is the new coffee machine, which has nine settings; everyone uses the same one. A quiet year is a chance to do something for yourself.

**A. Read every file you've been forwarded and never opened.**

> In the unopened files you find two problems you can fix, and one that someone should have fixed three years ago. You fix the two, and write a note about the third that nobody will enjoy receiving.

**B. Make yourself useful to the people who decide things.**

> You become the person who knows where everything is and who to ask. It isn't a title, but it gets you into rooms.

**C. Take your leave, all of it.**

> You take every day of leave you're owed. The office copes without you, which is either reassuring or not.

</details>

<details><summary>Meanwhile lines (33)</summary>

A year that passes by itself on the habit shows one line, never the same one twice in a career.

**Habit A, `substance`**

- Nothing breaks all year, which you suspect isn't a coincidence and can't prove.
- You use a quiet year to fix a process that annoyed people since before you arrived, and never announce it.
- You spend a quiet year fixing a form nobody asked you to fix, and three people quietly stop complaining.
- A quiet year, and you clear a backlog older than anyone in the office, without telling anyone.
- You fix the meeting-room booking system in a quiet year, and the queue for the big room disappears.
- In a quiet year you write down a process that existed only in one retiring officer's head.
- A quiet year, and you rewrite a form so that it asks each question only once.
- With nothing on fire, you finally fix the shared calendar nobody could find anything in.
- You spend a quiet spring untangling a filing system, and by autumn a file takes seconds to find.
- A slow year, so you write the handover notes your predecessor never left you.
- Nothing urgent comes in, and you use the gap to retire three reports that nobody read.

**Habit B, `visibility`**

- A quiet year and forty lunches, of which you remember thirty: about average.
- You go to everything you're invited to, and by December you're invited to more.
- A quiet year of coffees in the same three cafés, with people who will remember you as "helpful".
- A quiet year of networking, after which three people you've met once describe you as "a friend".
- In a quiet year you join two committees, both for the networking and one of them for the food.
- A quiet year of receptions, where you learn to hold a plate, a glass and a business card at once.
- A quiet year of kopi with people from other ministries, most of whom now answer your emails.
- You spend a slow year at seminars, and learn the names behind the acronyms.
- With little on your desk, you sit in on other divisions' meetings, and two of them remember you.
- A quiet year, and your name turns up on the guest list of every farewell lunch on the floor.
- You use an uneventful year to say yes to every working group, and leave each with a new contact.

**Habit C, `low`**

- A week on Bintan in June, where you check your email only twice. That's progress.
- A quiet year, and somewhere someone writes "steady" about you and means it kindly.
- A quiet year, and you take all your leave, which the leave system flags as unusual.
- You rest, and everything keeps running without you. It's reassuring, and very slightly insulting.
- A quiet year, and you leave at six without a single email asking where you are.
- A quiet year, and you read three books, none of them about leadership.
- A quiet year: you read the papers in the morning and leave on the stroke of six.
- Nothing much happens, and you let it, from nine to six with an hour for lunch.
- A calm year in which your out-of-office reply gets more use than your outbox.
- You spend a quiet year exactly as busy as the year requires, and no busier.
- An uneventful year of short emails and long lunches, and nobody asks for more.

</details>

[← 11](#c11) · [Next → 13](#c13) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c13"></a>13. The Work

[← 12](#c12) · [Next → 14](#c14) · [Contents](../DECK-DESIGN.md#contents)

`the_work` · events.json · can come back · weight 14

**Who sees it:** up to Permanent Secretary.

**Series** `effort` with [#12](#c12): shown in full twice a career (the second time asking whether to keep the habit), then its years pass by themselves on the habit; a card whose Meanwhile lines are spent is not drawn again.

**The second showing** (folded below): keeping the habit adds Competence up a little (+1), Reputation down a little (−1); breaking it adds Standing down a little (−1), Reputation up a little (+1).

**A Meanwhile year with no habit:** Competence up (+3), Standing up a little (+1).

Xin Yi, who joined the service with you, is building a new scheme this year with you and three others, and it has to launch on time. It'll go out under the ministry's name, not yours: no officer's name ever goes on a government scheme. Whether anyone upstairs learns who did the work is, this once, up to you.

**A. Do the work well.**

> It launches on time, and nobody says a word, because on time is what's expected. The people who write your appraisal noticed anyway.

- Hidden: Competence up (+4), Standing up a little (+2).
- Habit: `substance`.

**B. Do the work, and be seen doing it.**

> You present it at the divisional meeting, with four more slides than it needed. Two people who didn't know your name now do. Xin Yi, who made half the slides, isn't mentioned.

- Hidden: Competence up a little (+2), Standing up a little (+2), Reputation up (+4).
- Habit: `visibility`.
- The peer, if this showing named them: marks `you_took_the_slides` (read by [#18](#c18)).

**C. Coast. You've earned a quiet year.**

> You leave at six every day for a year and eat dinner at a normal hour. It costs you exactly what you thought it would.

- Hidden: Competence down a little (−2), Standing down a little (−1), Integrity up a little (+1).
- Habit: `low`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 40%: A helps (+2) · B hurts (−1) · C hurts (−4).
- The ranking panel (service, `panel`), 35%: B helps (+3).
- The people who work around you (service, `floor`), 50%, the main version only: B hurts (−4) · C hurts (−2).

<details><summary>When it comes back (3 scenes)</summary>

The series' second full showing, written per habit: the habit is the first choice, and the answer stands for the rest of the career.

---

*If your habit so far is “Do the work well.” (`substance`):*

**The Work, Again**

Xin Yi, who joined the service with you, is building another scheme this year, and has asked for you by name. You've made a habit of doing the work well and letting it speak for itself, while other people's names go on the slides. How you handle this one is how your working years will run after it, without anyone asking you again.

**A. Do it well, and let it speak, as usual.**

> It launches on time and nobody says a word, because on time is what's expected of you now. The people who write your appraisal have stopped noticing, and started relying on it.

- Hidden: Competence up (+5), Standing up a little (+2), Reputation down a little (−1).
- Habit: `substance`.

**B. Do it, and this time make sure you're seen.**

> You present the launch yourself, with your name on the first slide, and two directors ask afterwards who you are. Xin Yi notices too. From now on your name goes on your work.

- Hidden: Competence up a little (+2), Standing up a little (+1), Reputation up (+5).
- Habit: `visibility`.
- The peer, if this showing named them: marks `you_took_the_slides` (read by [#18](#c18)).

**C. Let the others carry this one. Ease off.**

> You leave at six, and the scheme launches anyway, a week late and mostly fine. Nobody asks why. You find you don't miss the late nights as much as you'd expected.

- Hidden: Competence down a little (−2), Standing down a little (−2), Reputation up a little (+1), Integrity up a little (+1).
- Habit: `low`.

---

*If your habit so far is “Do the work, and be seen doing it.” (`visibility`):*

**The Work, Again**

Xin Yi, who joined the service with you, is building another scheme this year, and you're on it again. You've made a habit of being seen with your work: the slides, the forums, the photograph beside the chart. Xin Yi has started counting whose names are on them. How you handle this one is how your working years will run after it, without anyone asking you again.

**A. Present it, as you always do.**

> Your slides, your forum, your photograph beside the chart. By the third presentation people call it your scheme, and Xin Yi has stopped volunteering to make the slides.

- Hidden: Competence up (+3), Standing up a little (+2), Reputation up (+3).
- Habit: `visibility`.
- The peer, if this showing named them: marks `you_took_the_slides` (read by [#18](#c18)).

**B. Do the work, and let Xin Yi present it.**

> Xin Yi presents it well, and thanks you by name in the second minute. Fewer people upstairs know your face this year. The people who write your appraisal know your work.

- Hidden: Competence up (+4), Standing up a little (+1), Reputation up a little (+1).
- Habit: `substance`.

**C. Step back from it altogether this year.**

> You hand over your slides and leave on time. The scheme launches with Xin Yi at the lectern. Your name stops coming up in meetings, which is restful, and then noticeable.

- Hidden: Competence down a little (−2), Standing down a little (−2), Reputation up a little (+1), Integrity up a little (+1).
- Habit: `low`.

---

*If your habit so far is “Coast. You've earned a quiet year.” (`low`):*

**The Work, Again**

Xin Yi, who joined the service with you, is building another scheme this year, and needs one more person on it. You've made a habit of doing what's asked and not a minute more, and your evenings have been your own for a while. How you handle this one is how your working years will run after it, without anyone asking you again.

**A. Say you're stretched. Keep your evenings.**

> Xin Yi finds someone else by Friday. You leave at six all year and nobody says anything, which you take as agreement. It's mostly indifference.

- Hidden: Competence down a little (−1), Standing down a little (−1), Reputation down a little (−1), Integrity up a little (+1).
- Habit: `low`.

**B. Join, and do it properly this time.**

> You join, and the late nights come back with the work. It launches on time. The people who write your appraisal notice the change before you've noticed it yourself.

- Hidden: Competence up (+4), Standing up a little (+1), Reputation up a little (+1).
- Habit: `substance`.

**C. Join, and make sure upstairs sees you did.**

> You join late and present early. Two directors who had stopped saying your name start again, and Xin Yi, who did most of the year's work, says nothing about it.

- Hidden: Competence up a little (+2), Standing up a little (+1), Reputation up (+5).
- Habit: `visibility`.
- The peer, if this showing named them: marks `you_took_the_slides` (read by [#18](#c18)).

</details>

<details><summary>Other versions (4)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2*

Your job this year is a form the public fills in. It has eleven fields, and seven of them ask for things the government already knows. Removing them needs four agencies to agree, two legal opinions and a year of meetings nobody will remember. Getting it right would save a million people ten minutes each.

**A. Do the work properly.**

> Three fields go. The other four turn out to be required by a regulation whose reason nobody can find. Three is a good year.

**B. Do the work, and make sure the right people see it.**

> Three fields go, and your one-page note on them goes round upstairs as "a good example of citizen-centric design". You'll be asked to give the talk.

**C. Let the agencies sort it out among themselves.**

> They don't. The form keeps all eleven fields. You keep your evenings, and decide that they were also a public good.

---

*Version 3*

This year you're reviewing a review: what was recommended three years ago, what was actually done, and why the gap between them is described as "phased implementation". The people who did the phasing will read your review, and some of them now outrank you.

**A. Write it straight.**

> Your review says what happened. It's accepted with thanks, and its recommendations are, in due course, phased.

**B. Write it straight, and present it yourself.**

> Your chart of the gap between what was promised and what was done is so clear that two directors ask for the slide. One of them later uses it against you, admiringly.

**C. Write it the way the last one was written.**

> It reads beautifully and says nothing anyone could disagree with. It takes a week. You spend the rest of the year on other things, mostly lunch.

---

*Version 4*

Your ministry's hotline takes two thousand calls a week, and four hundred of them ask the same question. The website answers it, on page six. Fixing this is your job for the year, and first you have to decide whether the problem is the callers or page six.

**A. Fix page six.**

> Page six becomes page one, in plain words, and calls drop by a third. The hotline team sends a cake with no message, the highest honour a hotline can give.

**B. Fix page six, and present the call figures.**

> Your before-and-after chart travels further than the website ever did. Two other agencies cite it in their own papers, with your name in the footnote.

**C. Note it for whoever owns the website, and go home on time.**

> Your note is clear and lands in the right inbox, where it stays. The calls continue. You're home by half past six, most days.

---

*Version 5*

A circular explaining a new rule has to reach forty agencies by the first of the month, and getting it there is your job. It's on its ninth draft. The ninth is the first one anyone outside this building could understand, and three more people still want to comment on it.

**A. Send the ninth draft, on time.**

> It goes out on the twenty-eighth. Three agencies reply that it's the clearest circular they've had all year, which in agency terms is a standing ovation.

**B. Send it, and brief the agencies yourself.**

> Forty agencies, four briefings, one set of slides. By the last briefing you don't need the slides, and two directors now ask for you by name.

**C. Leave the last draft to the next person in the chain.**

> It goes out on the third of the month, two days late. Nobody asks why, and you were home for dinner on both days.

</details>

<details><summary>Meanwhile lines (33)</summary>

A year that passes by itself on the habit shows one line, never the same one twice in a career.

**Habit A, `substance`**

- A scheme goes out on time, and you're one of five people who know why.
- You clear forty-one papers and write one sentence you're proud of. Nobody notices the sentence.
- A memo you wrote comes back to you months later as "the ministry's position", and you let it stand.
- You fix a system in March, it stops producing complaints, and nobody connects the two.
- A paper you wrote goes upstairs under someone else's name, and does well there.
- You catch an error in a figure three divisions had already passed, and fix it quietly.
- Another ministry copies an approval process you redesigned, and doesn't credit you.
- Your team's system goes live on schedule, and the launch email thanks the vendor.
- You rewrite a policy paper until it is short enough to be read, and it is.
- A year of careful work on a scheme nobody will notice until it fails, and it doesn't.
- You fix the spreadsheet everyone else had learned to work around.

**Habit B, `visibility`**

- You present a scheme your team built at three forums, and by the third, people call it your scheme.
- Your name is on the slide, the email and the photograph, for work that was mostly last year's.
- Someone from another ministry greets you by name in the lift. Being seen is working.
- You present your team's work at a lunchtime talk, with your photo on the poster and the team in the footnotes.
- A scheme you worked on gets a feature on the intranet, with a photograph of you pointing at a chart.
- You sit on four panels this year, three of them about the same scheme.
- A speech you didn't write mentions a scheme you worked on, and you, by name. That part you did arrange.
- You present the same good slide at four meetings, and at the fourth someone quotes it back to you.
- Your project's progress report carries your name in the subject line, every month.
- You volunteer to brief the people above you, and the briefing is what they remember of the project.
- A year of being the one who sends the summary email after every meeting.

**Habit C, `low`**

- You do what's asked, on time and not a minute more, and nobody can find anything to complain about.
- A quiet year at your desk. The best thing you write is your out-of-office message.
- The papers come in and go out. Someone on your floor is working late, and it isn't you.
- Your inbox reaches zero twice this year, which on your floor is treated as a rumour.
- You attend every meeting on time and speak at none of them.
- Your to-do list is shorter in December than in January, mostly by deletion.
- A year of steady work, measured mostly in the emails you didn't send.
- You do the year's work at the year's pace, and the work gets done.
- Every deadline this year is met on its last afternoon, and none is missed.
- You keep your head below the parapet all year, and the parapet holds.
- A year of on-time, unremarkable work that nobody has to check twice.

</details>

[← 12](#c12) · [Next → 14](#c14) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c14"></a>14. Eyes Only

[← 13](#c13) · [Next → 15](#c15) · [Contents](../DECK-DESIGN.md#contents)

`strange_letter` · packs/strange.json · once a career · weight 0.6

**Who sees it:** up to Assistant Director; aged 34 or less; not after any of [#17](#c17), [#48](#c48), [#72](02-service.md#c72), [#106](02-service.md#c106), [#107](02-service.md#c107), [#116](02-service.md#c116), [#121](03-top-of-service.md#c121), [#136](05-politics.md#c136), [#137](05-politics.md#c137), [#168](06-cabinet.md#c168), [#171](06-cabinet.md#c171) (`strange_met`).

An envelope arrives in the internal mail, addressed to you in your own handwriting and dated thirty years from now. It's stamped SECRET, and your grade isn't cleared to read SECRET documents: opening it would be a security breach, however it got here. The registry, which tracks every classified document in the building, would like it back.

**A. Return it to the registry unopened.**

> The registry logs it, and will keep it until you are cleared for SECRET, or until it is declassified, twenty-five years after its date. Its date is thirty years away, so that would take fifty-five years.

- Hidden: Competence down a little (−2), Standing up (+3), Integrity up (+5).
- Sets `strange_met`: read by [#17](#c17), [#48](#c48), [#72](02-service.md#c72), [#106](02-service.md#c106), [#107](02-service.md#c107), [#116](02-service.md#c116), [#121](03-top-of-service.md#c121), [#136](05-politics.md#c136), [#137](05-politics.md#c137), [#168](06-cabinet.md#c168), [#171](06-cabinet.md#c171).
- ↳ Can lead to: [15. Cleared](#c15), in 12 years, 60% (or, at another grade, [#16](#c16))

**B. Open it. It is addressed to you.**

> One line, in your handwriting: "You were not supposed to open this." The broken seal gives you away within the week, and the security officer writes you up for a security breach.

- Hidden: Competence up (+4), Integrity down (−4), Heat up a lot (+8), this year's appraisal marked down (−6, said on screen).
- Sets `strange_met`: read by [#17](#c17), [#48](#c48), [#72](02-service.md#c72), [#106](02-service.md#c106), [#107](02-service.md#c107), [#116](02-service.md#c116), [#121](03-top-of-service.md#c121), [#136](05-politics.md#c136), [#137](05-politics.md#c137), [#168](06-cabinet.md#c168), [#171](06-cabinet.md#c171).
- ↳ Can lead to: [Everything Surfaced](09-endings.md#end-scandal)

**C. Apply for SECRET clearance first.**

> The form asks why you need to read it. Ms Chua, your reporting officer, has to sign that part, and can't say. The only officer who knows is you, thirty years from now. The form comes back incomplete, and the registry keeps the envelope until you are cleared.

- Hidden: Competence up (+3), Standing down (−3).
- Sets `strange_met`: read by [#17](#c17), [#48](#c48), [#72](02-service.md#c72), [#106](02-service.md#c106), [#107](02-service.md#c107), [#116](02-service.md#c116), [#121](03-top-of-service.md#c121), [#136](05-politics.md#c136), [#137](05-politics.md#c137), [#168](06-cabinet.md#c168), [#171](06-cabinet.md#c171).
- ↳ Can lead to: [15. Cleared](#c15), in 12 years, 60% (or, at another grade, [#16](#c16))

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The office a confidential paper or decision belongs to (service, `owner`), 50%: A helps (+2) · B hurts (−3) · C helps (+1).

[← 13](#c13) · [Next → 15](#c15) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c15"></a>15. Cleared

[← 14](#c14) · [Next → 16](#c16) · [Contents](../DECK-DESIGN.md#contents)

`strange_envelope` · packs/strange.json

**Who sees it:** only as a follow-up to [14. Eyes Only](#c14) (A, C: in 12 years, 60%); when it falls due: up to Permanent Secretary.

Years ago an envelope came for you in your own handwriting, dated thirty years ahead and stamped SECRET, and the registry kept it until you were cleared. You now are. It's one page from your future self, almost all of it blacked out in your own hand. One line isn't: "Take the leave." You have forty days saved, and a busy year.

**A. Take the leave.**

> You take three weeks, the longest leave of your career. The office copes. You never learn what the redacted lines said, and after a while you stop needing to.

- Hidden: Standing down (−3), Integrity up (+5).

**B. File it, and carry on.**

> You file it and work straight through the year. In December you notice the leave you did not take, and understand that the letter knew you better than the registry did.

- Hidden: Competence up a little (+2), Standing up (+3), Integrity down (−3).

[← 14](#c14) · [Next → 16](#c16) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c16"></a>16. Cleared

[← 15](#c15) · [Next → 17](#c17) · [Contents](../DECK-DESIGN.md#contents)

`strange_envelope_pol` · packs/strange.json

**Who sees it:** fires instead of [15. Cleared](#c15) when that card falls due and this one's conditions hold (the first version that fits); when it falls due: Member of Parliament and up.

Years ago, as a junior officer, you were sent an envelope in your own handwriting, dated thirty years ahead and stamped SECRET, and the registry kept it. Now that you've left the service, the registry rules that the author may read it, and posts it to you: one page, almost all blacked out in your own hand. One line isn't: "Take the leave."

**A. Take the leave.**

> You take three weeks, the longest leave since you entered politics. Everything copes. You never learn what the redacted lines said, and after a while you stop needing to.

- Hidden: Standing down (−3), Integrity up (+5).

**B. File it, and carry on.**

> You file it and work straight through the year: Parliament, the ward, every Tuesday night of residents' problems. In December you notice the leave you did not take, and understand that the letter knew you.

- Hidden: Competence up a little (+2), Standing up (+3), Integrity down (−3).

[← 15](#c15) · [Next → 17](#c17) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c17"></a>17. Snow

[← 16](#c16) · [Next → 18](#c18) · [Contents](../DECK-DESIGN.md#contents)

`strange_snow` · packs/strange.json · once a career · weight 0.45

**Who sees it:** up to Senior Management Executive; not after any of [#14](#c14), [#48](#c48), [#72](02-service.md#c72), [#106](02-service.md#c106), [#107](02-service.md#c107), [#116](02-service.md#c116), [#121](03-top-of-service.md#c121), [#136](05-politics.md#c136), [#137](05-politics.md#c137), [#168](06-cabinet.md#c168), [#171](06-cabinet.md#c171) (`strange_met`).

At 3pm it snows in Toa Payoh for forty minutes. The National Environment Agency confirms that it was snow, and can't say why. Your division's business continuity plan, which says how the office keeps working through an emergency, covers haze, floods and a pandemic. Ms Chua, your reporting officer, wants a section on snow by 5pm, in case it happens again, and you're writing it.

**A. Copy the haze section. Replace "haze" with "snow".**

> The plan now tells officers to stay indoors, keep the windows closed and check on vulnerable colleagues. Annoyingly, this is a good snow plan. It also orders N95 masks.

- Hidden: Competence down a little (−1), Standing up (+4), Integrity down a little (−2).
- Sets `strange_met`: read by [#14](#c14), [#48](#c48), [#72](02-service.md#c72), [#106](02-service.md#c106), [#107](02-service.md#c107), [#116](02-service.md#c116), [#121](03-top-of-service.md#c121), [#136](05-politics.md#c136), [#137](05-politics.md#c137), [#168](06-cabinet.md#c168), [#171](06-cabinet.md#c171).

**B. Write a real snow section, from first principles.**

> Eleven pages, sent at 7.40pm. Your annex on slippery walkways is adopted across the ministry. It has not snowed since, and the plan is given some of the credit.

- Hidden: Competence up (+5), Standing down (−3).
- Sets `strange_met`: read by [#14](#c14), [#48](#c48), [#72](02-service.md#c72), [#106](02-service.md#c106), [#107](02-service.md#c107), [#116](02-service.md#c116), [#121](03-top-of-service.md#c121), [#136](05-politics.md#c136), [#137](05-politics.md#c137), [#168](06-cabinet.md#c168), [#171](06-cabinet.md#c171).

**C. Point out that it will not happen again.**

> Ms Chua asks whether you can guarantee that. You can't. Someone else writes the snow section, and lists your view in it, under Risks.

- Hidden: Competence up a little (+1), Standing down (−3), Integrity up (+4).
- Sets `strange_met`: read by [#14](#c14), [#48](#c48), [#72](02-service.md#c72), [#106](02-service.md#c106), [#107](02-service.md#c107), [#116](02-service.md#c116), [#121](03-top-of-service.md#c121), [#136](05-politics.md#c136), [#137](05-politics.md#c137), [#168](06-cabinet.md#c168), [#171](06-cabinet.md#c171).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 35%: A hurts (−1) · B helps (+2) · C hurts (−1).
- The ranking panel (service, `panel`), 30%: A helps (+1) · B helps (+1) · C hurts (−2).

[← 16](#c16) · [Next → 18](#c18) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c18"></a>18. And Team

[← 17](#c17) · [Next → 19](#c19) · [Contents](../DECK-DESIGN.md#contents)

`and_team` · packs/first_years.json · once a career · weight 6

**Who sees it:** up to Senior Management Executive.

**Shares a decision** (`credit_taken`) with [#51](02-service.md#c51): a career sees only one.

You and Xin Yi, who joined the service with you, spent a month on a deck. Your reporting officer, Ms Chua, sends it up to the Deputy Secretary under her own name only. The Deputy Secretary's reply thanks Ms Chua "and team". Xin Yi forwards it to you without comment, clearly annoyed.

**A. Ask Ms Chua to put all three names on the next one.**

> Ms Chua agrees at once, and seems surprised you had to ask. The next deck goes up with three names on it, and the Deputy Secretary's reply thanks "the team". You decide to count that.

- Hidden: Competence up (+3), Standing down a little (−2), Integrity up (+5).
- The peer, if this showing named them: marks `you_spoke_up`.

**B. Reply to the Deputy Secretary, and name who did the work.**

> Your reply is two lines long and names Xin Yi first. The Deputy Secretary answers, "Well done, both." Ms Chua leaves you off every email for three months, then copies you on everything.

- Hidden: Standing down (−5), Reputation up a lot (+6), Integrity up (+3).
- The peer, if this showing named them: marks `you_named_them`.

**C. Say nothing. Papers go up under your reporting officer's name.**

> You build the next deck too, and it also goes up under Ms Chua's name. In March Ms Chua is promoted, and asks for you to move with her. Xin Yi isn't asked.

- Hidden: Competence up a little (+2), Standing up a lot (+7), Integrity down (−3).
- The peer, if this showing named them: marks `you_said_nothing`.
- The reporting officer, if this showing named them: promoted one grade at once.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 50%: A helps (+2) · B helps (+2) · C hurts (−4).
- The officer who countersigns your appraisal (service, `countersigner`), 40%: B helps (+2).

<details><summary>This card varies (2 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `doc`

- deck *(`deck`; shown above)*
  - `made`: built
- briefing note *(`note`)*
  - `made`: drafted
- budget paper *(`paper`)*
  - `made`: drafted

**Part 2** · `with` (the first option that fits)

- Xin Yi, whose half of the slides you once presented as your own, *(`slides`; when the peer (Xin Yi) is the one from [13. The Work](#c13), B (`you_took_the_slides`))*
- Xin Yi, who once put "agree" beside your post-it, *(`postit`; when the peer (Xin Yi) is the one from [9. Public Sector Transformation](#c9), A (`agreed_with_you`))*
- Xin Yi *(`intake`; shown above)*

</details>

[← 17](#c17) · [Next → 19](#c19) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c19"></a>19. Approved Leave

[← 18](#c18) · [Next → 20](#c20) · [Contents](../DECK-DESIGN.md#contents)

`approved_leave` · packs/first_years.json · once a career · weight 5

**Who sees it:** up to Senior Management Executive.

**Series** `work_life` with [#35](#c35): shown in full twice a career (the second time asking whether to keep the habit), then its years pass by themselves on the habit; a card whose Meanwhile lines are spent is not drawn again.

**The second showing** (folded below): keeping the habit adds Competence up a little (+1), Reputation down a little (−1); breaking it adds Standing down a little (−1), Reputation up a little (+1).

In January, Ms Chua, your reporting officer, approved your two weeks' leave for September, and you booked your flights. Now Ms Chua has moved the division's Work Plan Seminar, where each section presents next year's plans, into the second week of your leave. This year's theme is Staff Well-being, and nobody else can present your section's slide.

**A. Cancel the leave and present the slide.**

> You cancel the trip. Your slide, "Rest as a Strategic Enabler", is on at 4:40pm, and the Deputy Secretary leaves at 4:42. The airline gives you a voucher instead of a refund, and it expires unused, like the leave.

- Hidden: Competence down a little (−1), Standing up a lot (+6).
- Habit: `work`.

**B. Go. Someone else can present it.**

> Ms Chua presents your slide for you, and tells the room you are "role-modelling the theme". Two directors write that down. You come back rested, and do the best work of your year.

- Hidden: Competence up (+4), Standing down (−4), Integrity up (+4).
- Habit: `life`.

**C. Present it by video, from the holiday.**

> From a hotel lobby in Seattle, at 1:40am local time, you present the slide on Staff Well-being. The connection holds. Three directors say how good it was to see you. Nobody mentions the slide.

- Hidden: Competence down a little (−2), Standing up (+3), Reputation up a little (+2).
- Habit: `work`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The ranking panel (service, `panel`), 40%: B helps (+2) · C helps (+2).
- The people who work around you (service, `floor`), 40%: A hurts (−3) · B helps (+2) · C hurts (−2).

<details><summary>When it comes back (2 scenes)</summary>

The series' second full showing, written per habit: the habit is the first choice, and the answer stands for the rest of the career.

---

*If your habit so far is “Cancel the leave and present the slide.” (`work`):*

**Approved Leave**

In January Ms Chua, your reporting officer, approved your two weeks' leave for September, and you booked flights. Now Ms Chua has moved the division's Work Plan Seminar into the second week, and nobody else can present your section's slide. When work and leave have collided before, work has won. Whatever you choose now, your leave will go the same way every year after.

**A. Cancel the leave, as you usually would.**

> You cancel the trip and present the slide at 4:40pm, to a room that empties at 4:42. The airline's voucher expires unused, like the leave, and like the one before it.

- Hidden: Standing up a lot (+6), Reputation down a little (−1).
- Habit: `work`.

**B. Go this time. Someone else can present it.**

> Ms Chua presents your slide and tells the room you're "role-modelling the theme". You come back rested, and slightly alarmed by how good it felt.

- Hidden: Competence up (+4), Standing down (−5), Reputation up a little (+1), Integrity up (+4).
- Habit: `life`.

**C. Present it by video, from the holiday.**

> From a hotel lobby in Seattle, at 1:40am local time, you present the slide on Staff Well-being. The connection holds. Three directors say how good it was to see you, and nobody mentions the slide.

- Hidden: Competence down a little (−2), Standing up a little (+2), Reputation up (+3).
- Habit: `work`.

---

*If your habit so far is “Go. Someone else can present it.” (`life`):*

**Approved Leave**

In January Ms Chua, your reporting officer, approved your two weeks' leave for September, and you booked flights. Now Ms Chua has moved the division's Work Plan Seminar into the second week, and nobody else can present your section's slide. When work and leave have collided before, you've taken the leave. Whatever you choose now, your leave will go the same way every year after.

**A. Go, as you always do.**

> Ms Chua presents your slide for you and calls you a role model for the theme. You come back rested and do your best work of the year, which is becoming a pattern.

- Hidden: Competence up (+5), Standing down (−4), Reputation down a little (−1), Integrity up (+4).
- Habit: `life`.

**B. Cancel the leave this time, and present it.**

> You cancel the trip and present at 4:40pm. The Deputy Secretary leaves at 4:42. Ms Chua thanks you in the corridor, warmly and at length, and the airline sends a voucher.

- Hidden: Competence down a little (−1), Standing up (+5), Reputation up a little (+1).
- Habit: `work`.

**C. Go, but present it by video from the holiday.**

> From a hotel lobby in Seattle, at 1:40am local time, you present the slide. The connection holds, and three directors say how good it was to see you. Your holiday photographs include one of a laptop.

- Hidden: Competence down a little (−2), Standing up a little (+2), Reputation up (+3).
- Habit: `work`.

</details>

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `away`

- a hotel lobby in Seattle, at 1:40am local time *(`seattle`; shown above)*
- a hotel room in New York, at 4:40am local time *(`newyork`)*
- a beach bar in Honolulu, at 10:40pm the evening before *(`honolulu`)*

</details>

<details><summary>Meanwhile lines (10)</summary>

A year that passes by itself on the habit shows one line, never the same one twice in a career.

**Habit A, `work`**

- A seminar lands in the middle of your leave, and the leave gives way, as it usually does.
- You present your section's slide on the day your flight was meant to leave, and the flight leaves without you.
- Your unused leave rolls over again, with a reminder from HR that leave is good for you.
- A holiday becomes an airline voucher, and the voucher becomes a reminder in your inbox, then nothing.
- Your leave is approved in January and cancelled in August, which your family now plans around.

**Habit B, `life`**

- A seminar is moved into your leave, and you go on holiday anyway; someone else presents your slide.
- You take your leave as approved, and the seminar manages without you, slightly shorter.
- Your out-of-office message goes up on the day it says it will, and stays up.
- You're on a beach when your section's slide is presented, and you hear it went fine.
- Your leave is approved in January and taken in September, which on your floor counts as news.

</details>

[← 18](#c18) · [Next → 20](#c20) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c20"></a>20. Copied In

[← 19](#c19) · [Next → 21](#c21) · [Contents](../DECK-DESIGN.md#contents)

`copied_in` · packs/first_years.json · once a career · weight 6

**Who sees it:** up to Senior Management Executive.

An email arrives that clearly wasn't meant for you. You're copied in, below a Deputy Secretary and two directors, on a confidential plan for next year's restructuring, marked Official (Closed): for the people it is addressed to, and nobody else. Paragraph two abolishes the job of Xin Yi, who joined the service with you. Xin Yi doesn't know yet.

**A. Tell Xin Yi, quietly, after work.**

> Over kopi, without mentioning any email, you tell Xin Yi it might be a good time to look around. Xin Yi applies for two other jobs in the division that week, gets one, and never asks how you knew.

- Hidden: Standing down (−4), Reputation up (+4), Integrity up (+4), Heat up (+5).
- The peer, if this showing named them: marks `heard_it_from_you` (read by [#21](#c21)).
- ↳ Can lead to: [21. Face Down](#c21), in four years, 60%

**B. Say nothing. It wasn't sent to you to share.**

> The restructuring is announced six weeks later at a townhall. Xin Yi hears it with everyone else and is moved to another job in the division, in good order. You say all the right things, a little too smoothly for someone hearing it for the first time.

- Hidden: Competence up (+3), Standing up (+5), Integrity down (−3).
- The peer, if this showing named them: marks `you_knew_first` (read by [#22](#c22)).
- ↳ Can lead to: [22. The Cc Line](#c22), in three years, 60%

**C. Tell the sender you were copied in by mistake.**

> The Deputy Secretary's office thanks you in one line and takes you off the list. Nobody ever says who added you. For a while you open every email expecting to be on it.

- Hidden: Competence up (+3), Standing down a little (−2), Reputation down a little (−1), Integrity up a lot (+6).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The office a confidential paper or decision belongs to (service, `owner`), A 40%, B 50%, C 80%: A hurts (−5) · B helps (+3) · C helps (+3).
- The people who work around you (service, `floor`), 40%: B hurts (−3).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `above`

- a Deputy Secretary and two directors *(`ds`; shown above)*
  - `office`: The Deputy Secretary's office
- the HR director and the Chief Information Officer *(`ceo`)*
  - `office`: The HR director's office
- a Permanent Secretary, and nobody else *(`ps`)*
  - `office`: The Permanent Secretary's office

</details>

[← 19](#c19) · [Next → 21](#c21) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c21"></a>21. Face Down

[← 20](#c20) · [Next → 22](#c22) · [Contents](../DECK-DESIGN.md#contents)

`copied_in_repaid` · packs/first_years.json

**Who sees it:** only as a follow-up to [20. Copied In](#c20) (A: in four years, 60%); when it falls due: up to Permanent Secretary; the peer (Xin Yi) is the one from [20. Copied In](#c20), A (`heard_it_from_you`) and is not the one from [22. The Cc Line](#c22), B; [95. The Reorganisation](02-service.md#c95), B; [102. The Interview Panel](02-service.md#c102), B (`fell_out`).

A few years ago, you quietly warned Xin Yi, who joined the service with you, that a restructuring would abolish her job. Today Xin Yi closes your door and puts a printout on your desk, face down: next year's postings, which nobody is meant to see until April. "You told me once," Xin Yi says.

**A. Turn it over.**

> Your name is on it: you're being posted somewhere difficult in April. With three months' notice you ask for that posting yourself, so it looks like your idea. Nobody upstairs ever learns that you knew first.

- Hidden: Competence up (+3), Standing up (+5), Integrity down (−3), Heat up (+4).

**B. Leave it face down, and thank Xin Yi.**

> Xin Yi takes the printout back without a word, and looks almost relieved. In April the postings come out. Yours is somewhere difficult, and you are the only person on the floor who is surprised.

- Hidden: Standing down a little (−2), Integrity up a lot (+6).
- The peer, if this showing named them: marks `you_left_it`.

[← 20](#c20) · [Next → 22](#c22) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c22"></a>22. The Cc Line

[← 21](#c21) · [Next → 23](#c23) · [Contents](../DECK-DESIGN.md#contents)

`copied_in_file` · packs/first_years.json

**Who sees it:** only as a follow-up to [20. Copied In](#c20) (B: in three years, 60%); when it falls due: the peer (Xin Yi) is the one from [20. Copied In](#c20), B (`you_knew_first`).

Years ago you were copied in, by mistake, on a confidential plan that abolished the job of Xin Yi, and you said nothing. Now Xin Yi, looking for something else in an old file, has found that email. It is dated six weeks before anyone told her, and your name is on the cc line.

**A. Explain, properly, over kopi.**

> You explain: the email was marked Official (Closed), it wasn't yours to share, and you hated keeping quiet for six weeks. Xin Yi hears you out and says she would have done the same. Neither of you is sure that's true.

- Hidden: Standing down a little (−2), Integrity up a lot (+6).
- The peer, if this showing named them: marks `you_explained`.

**B. Point out that it was marked Official (Closed).**

> Xin Yi agrees that it was. The conversation is short and entirely correct. For years afterwards Xin Yi is perfectly cordial to you in every meeting, and says nothing to you at all in the lift.

- Hidden: Standing up (+4), Integrity down a little (−2).
- The peer, if this showing named them: marks `fell_out` (read by [#21](#c21), [#47](#c47)).

[← 21](#c21) · [Next → 23](#c23) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c23"></a>23. For the Record

[← 22](#c22) · [Next → 24](#c24) · [Contents](../DECK-DESIGN.md#contents)

`for_the_record` · packs/first_years.json · once a career · weight 6

**Who sees it:** up to Senior Management Executive.

You're taking the minutes at a meeting between the Permanent Secretary and three agencies about a project that is already behind. Forty minutes in, the Permanent Secretary says, calmly, that the project will not meet its target this year or next. Nobody wants that in writing: if it's in the minutes, someone will one day ask why nobody acted on it. You write the draft, and the Permanent Secretary's office approves it before it goes out.

**A. Minute it exactly as it was said.**

> The minutes go out with the line in paragraph six, word for word. Nobody replies. Two weeks later you're taken off the meeting's mailing list, and then off the meeting.

- Hidden: Competence up a little (+2), Standing down (−4), Integrity up a lot (+7).
- Sets `notes_as_said`: read by [#24](#c24).
- ↳ Can lead to: [24. The Note-Taker](#c24), in six years, 50%

**B. Leave it out, and minute only the decisions.**

> Your minutes say "The meeting noted the challenges ahead." They're approved in one round, unchanged: the first thing you've written that went upstairs without a single edit.

- Hidden: Competence up (+3), Standing up a lot (+6), Integrity down (−4).

**C. Minute it, and point it out to the Permanent Secretary's office when you send the draft.**

> The draft comes back with the line crossed out and initialled. The crossed-out draft is filed next to the final minutes, as drafts always are, where anyone who looks can read both.

- Hidden: Competence up a lot (+6), Standing down a little (−2), Integrity up (+3).
- Sets `notes_struck`: read by [#24](#c24).
- ↳ Can lead to: [24. The Note-Taker](#c24), in six years, 50%

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- People from other agencies who were in the room or on the email (service, `agencies`), 50%: A helps (+3) · B hurts (−4) · C helps (+2).
- The officer who countersigns your appraisal (service, `countersigner`), 30%: A hurts (−2) · C helps (+3).

<details><summary>This card varies (2 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `speaker`

- the Permanent Secretary *(`ceo`; shown above)*
  - `approver`: the Permanent Secretary's office
- Ms Chua *(`senior`)*
  - `approver`: Ms Chua

**Part 2** · `line`

- that the project will not meet its target this year or next *(`target`; shown above)*
  - `why`: if it's in the minutes, someone will one day ask why nobody acted on it
- that the new system will miss its launch date, and that the date will not be moved *(`launch`)*
  - `why`: if it's in the minutes, someone will one day ask why it launched anyway
- that the vendor building it has already failed two other agencies the same way *(`vendor`)*
  - `why`: if it's in the minutes, someone will one day ask why the ministry hired them anyway

</details>

[← 22](#c22) · [Next → 24](#c24) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c24"></a>24. The Note-Taker

[← 23](#c23) · [Next → 25](#c25) · [Contents](../DECK-DESIGN.md#contents)

`for_the_record_audit` · packs/first_years.json

**Who sees it:** only as a follow-up to [23. For the Record](#c23) (A, C: in six years, 50%).

**Shares a decision** (`own_up`) with [#34](#c34), [#65](02-service.md#c65), [#161](06-cabinet.md#c161), [#105](02-service.md#c105): a career sees only one.

Years ago, in your first years in the service, you took the minutes at a meeting where someone senior warned, calmly, that a project would go wrong. It did. The Auditor-General's Office is now auditing it, and the only written record of that warning is your minutes, with the warning in paragraph six. The auditors would like to speak to whoever took the notes.

**A. Confirm the record, and that you wrote it.**

> The audit report quotes your minutes in a footnote, without your name. Everyone who was at that meeting knows who took them, and two of them tell you so: one to thank you, and one not.

- Hidden: Standing down (−3), Integrity up a lot (+6), the ceiling (CEP) up one grade (+1).

**B. Confirm it's accurate, and say nothing more.**

> You confirm the record is accurate and add nothing. The footnote appears anyway, and the people at that meeting decide you were no help to anyone, themselves included.

- Hidden: Competence up a little (+2), Standing up (+4), Integrity up a little (+1).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- People from other agencies who were in the room or on the email (service, `agencies`), 45%: A helps (+2) · B hurts (−2).
- The officer who countersigns your appraisal (service, `countersigner`), 30%: A hurts (−1) · B helps (+1).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `record` (the first option that fits)

- your minutes, with the warning in paragraph six *(`said`; when after [23. For the Record](#c23), A (`notes_as_said`); shown above)*
- your draft of the minutes, with the warning crossed out and initialled *(`struck`; when after [23. For the Record](#c23), C (`notes_struck`))*

</details>

[← 23](#c23) · [Next → 25](#c25) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c25"></a>25. Friday, 5pm

[← 24](#c24) · [Next → 26](#c26) · [Contents](../DECK-DESIGN.md#contents)

`fridge_friday` · packs/first_years.json · once a career · weight 5

**Who sees it:** up to Senior Management Executive.

The office pantry fridge is cleared at 5pm every Friday, under paragraph 3 of an office circular: anything past its date goes in the bin. This quarter, the clearing is your job. Behind the milk sits a yoghurt, eleven days past its date, labelled with the Permanent Secretary's name.

**A. Bin it, as paragraph 3 says.**

> On Monday the Permanent Secretary's PA writes to ask, politely, about a yoghurt. Your reply quotes paragraph 3. The circular is reissued the following week, with a new paragraph 4, on exemptions.

- Hidden: Competence up a little (+2), Standing down (−4), Integrity up (+5).

**B. Clear everything else, and leave the yoghurt.**

> The yoghurt survives six more Fridays while everyone else's lunch goes in the bin. The floor draws its own conclusion about who paragraph 3 applies to, and shares it at the pantry sink, while you're there.

- Hidden: Standing up a lot (+6), Reputation down a little (−2).

**C. Email the floor, asking the owner to claim it.**

> The Permanent Secretary replies to all forty of you: "Mine. Pls bin. Thanks for checking." It becomes the most forwarded email on the floor that year, and the friendliest.

- Hidden: Competence down a little (−1), Standing up a little (+1), Reputation up (+5).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 40%: A helps (+2) · B hurts (−2).
- The ranking panel (service, `panel`), 30%, when the part `owner` is `ceo`: A hurts (−2) · B helps (+2).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `owner`

- with the Permanent Secretary's name *(`ceo`; choice A: Standing down a little (−2); choice B: Standing up a little (+1); shown above)*
  - `a`: On Monday the Permanent Secretary's PA writes to ask, politely, about a yoghurt. Your reply quotes paragraph 3. The circular is reissued the following week, with a new paragraph 4, on exemptions.
  - `b`: The yoghurt survives six more Fridays while everyone else's lunch goes in the bin. The floor draws its own conclusion about who paragraph 3 applies to, and shares it at the pantry sink, while you're there.
  - `c`: The Permanent Secretary replies to all forty of you: "Mine. Pls bin. Thanks for checking." It becomes the most forwarded email on the floor that year, and the friendliest.
- with a smiley face and the name of Xin Yi *(`peer`)*
  - `a`: Xin Yi finds the empty shelf on Monday, laughs, and pins a copy of the circular to the fridge door with paragraph 3 highlighted and your initials in the margin.
  - `b`: You bin everyone's food but Xin Yi's. Nobody says anything. On Monday morning somebody has labelled the milk, the butter and the chilli sauce with Xin Yi's name too.
  - `c`: Forty people now know that Xin Yi keeps a yoghurt for eleven days. Xin Yi collects it from your desk in person, to applause, and bins it.
- "DO NOT THROW", in capitals, and nothing else *(`nobody`)*
  - `a`: You bin it. On Monday a new yoghurt appears, labelled "DO NOT THROW. I MEAN IT." You bin that one on Friday too. Neither of you gives up before the quarter ends.
  - `b`: The yoghurt stays. By March it has outlasted two office managers and the fridge's thermostat, and the floor calls it, without irony, "the tenant".
  - `c`: Nobody claims it. Three people reply to say it is not theirs, and one to ask what paragraph 3 says. At 5pm it goes into the bin anyway.

</details>

[← 24](#c24) · [Next → 26](#c26) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c26"></a>26. The Internet Laptop

[← 25](#c25) · [Next → 27](#c27) · [Contents](../DECK-DESIGN.md#contents)

`internet_laptop` · packs/first_years.json · once a career · weight 5

**Who sees it:** up to Senior Management Executive.

A vendor has sent the tender clarifications as a download link, and Ms Chua, your reporting officer, wants it by 2pm. Your work laptop can't open the link: government work laptops are kept off the internet, for security. The division's one internet laptop is booked until 3pm. There is a quick way round this, and it breaks the IT rules.

**A. Open it on your phone and email it to your work account.**

> Ms Chua has it at 1:52pm. Three months later the IT security review finds your email, and you're sent on a forty-minute refresher course on the government's IT rules, with a quiz at the end and a certificate.

- Hidden: Competence up (+3), Standing up (+5), Integrity down (−4), Heat up (+5).

**B. Ask the vendor to email it as an attachment instead.**

> The vendor emails it as one attachment, which bounces for being too large, then as six, one of which the virus scanner quarantines. Ms Chua gets it on Thursday, two days late, and asks what happened.

- Hidden: Competence down a little (−1), Standing down (−3), Integrity up (+5).

**C. Read it on your phone, and retype it.**

> Six pages, retyped by 1:58pm, with two typos, both in the vendor's name. Every keystroke was compliant. When you explain how you did it, nobody believes you.

- Hidden: Competence up a lot (+7), Standing down a little (−1), Integrity up a little (+1).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The office a confidential paper or decision belongs to (service, `owner`), 50%: A hurts (−3) · B helps (+2) · C helps (+1).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: A helps (+1) · B hurts (−2) · C helps (+1).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `file`

- the tender clarifications *(`tender`; shown above)*
- a revised quotation *(`quote`)*
- the consultant's six-page summary *(`summary`)*

</details>

[← 25](#c25) · [Next → 27](#c27) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c27"></a>27. The Lucky Draw

[← 26](#c26) · [Next → 28](#c28) · [Contents](../DECK-DESIGN.md#contents)

`lucky_draw` · packs/first_years.json · once a career · weight 5

**Who sees it:** up to Senior Management Executive.

You missed the meeting where the committee for the division's D&D, its yearly dinner-and-dance, was picked, so you're on it. The theme is Old Hollywood. The top prize is a 65-inch television, and the box for the lucky draw holds every name in the division, directors included.

**A. Draw it straight, whoever comes out.**

> The Permanent Secretary wins it, and gives it back to be drawn again, to applause. So does a director, and then another. By the fourth draw, the prize has been on stage longer than the band.

- Hidden: Standing up a little (+2), Reputation down a little (−2), Integrity up (+5).

**B. Quietly take the directors' names out first.**

> An officer in the first month of the job wins it, and cries a little. The directors, spared the business of giving it back, are quietly grateful. Nobody ever checks the box.

- Hidden: Standing up a little (+2), Reputation up a lot (+6), Integrity down (−3).

**C. Spend the prize money on the food instead.**

> The food is the best anyone can remember, and there's no lucky draw. Next year a third fewer people come. It turns out nobody came for the food.

- Hidden: Competence up (+5), Standing down a little (−1), Reputation down (−4), Integrity up a little (+2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The ranking panel (service, `panel`), 35%: B helps (+3).
- The people who work around you (service, `floor`), 45%: A helps (+2) · B hurts (−4) · C hurts (−2).

<details><summary>This card varies (2 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `theme`

- Old Hollywood *(`hollywood`; shown above)*
- Kampong Days *(`kampong`)*
- Neon Nineties *(`nineties`)*

**Part 2** · `prize`

- a 65-inch television *(`tv`; shown above)*
- a staycation on Sentosa *(`staycation`)*
- an air fryer, for the third year running *(`airfryer`)*

</details>

[← 26](#c26) · [Next → 28](#c28) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c28"></a>28. One Word

[← 27](#c27) · [Next → 29](#c29) · [Contents](../DECK-DESIGN.md#contents)

`one_word` · packs/first_years.json · once a career · weight 6

**Who sees it:** up to Senior Management Executive.

You spent a week on a minute paper for Ms Chua, your reporting officer: a memo on why the renewal form asks for the same date three times, asking for a decision. It runs to four pages, and it's the first paper of yours meant to go further upstairs. It comes back the next morning with one word in the margin, in Ms Chua's handwriting: "Discuss."

**A. Rewrite it from the top.**

> Your second version is better, and goes up on Thursday. It comes back with the same word. You learn, eventually, that "Discuss" was never about the paper. It meant: come upstairs and talk to me.

- Hidden: Competence up a lot (+7), Standing down a little (−2).

**B. Go up and ask Ms Chua what the word means.**

> Ms Chua reads the paper while you wait, agrees with all four pages, and tells you to send it on as it is. That was the discussion. It took six minutes.

- Hidden: Competence down a little (−1), Standing up (+5), Reputation up a little (+2).

**C. Send it back up unchanged, with a one-line reply.**

> Your reply says: "Happy to discuss." It comes back: "Discuss." The paper goes back and forth between your desk and Ms Chua's three more times before either of you books a meeting room.

- Hidden: Competence up (+3), Standing down (−3), Integrity up a lot (+6).

<details><summary>This card varies (2 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `topic`

- why the renewal form asks for the same date three times *(`form`; shown above)*
- the hotline's rising call volumes *(`hotline`)*
- whether to extend a pilot by a year *(`pilot`)*

**Part 2** · `word`

- Discuss. *(`discuss`; shown above)*
  - `a`: Your second version is better, and goes up on Thursday. It comes back with the same word. You learn, eventually, that "Discuss" was never about the paper. It meant: come upstairs and talk to me.
  - `b`: Ms Chua reads the paper while you wait, agrees with all four pages, and tells you to send it on as it is. That was the discussion. It took six minutes.
  - `c`: Your reply says: "Happy to discuss." It comes back: "Discuss." The paper goes back and forth between your desk and Ms Chua's three more times before either of you books a meeting room.
- Why? *(`why`)*
  - `a`: The new version opens with the answer to "Why?" in one paragraph. Ms Chua reads that paragraph, approves the paper, and returns the other three pages unread.
  - `b`: Ms Chua explains that "Why?" meant "why now?": the answer depends on a budget cycle you haven't heard of yet. You write that down, and add a paragraph about it.
  - `c`: Your reply is one line long, and answers the question. Ms Chua writes "OK" beneath it. You keep the page in a drawer for years, for no reason you could explain.
- Noted. *(`noted`)*
  - `a`: Four pages become two. The new version also comes back marked "Noted." You learn that it means read, agreed with, and not to be acted on this financial year.
  - `b`: Ms Chua is surprised to see you, and explains kindly that "Noted" is a complete reply. It means the paper was read. It does not mean anything will happen, and nothing does.
  - `c`: Your reply asks what happens next, and comes back marked "Noted." as well. Long afterwards, someone else finds your paper in a file, sends it up again, and it is approved.
- See me. *(`seeme`)*
  - `a`: You rewrite it before going up, to be safe. Ms Chua only wanted to say it was good. There are now two good versions, and a meeting about which one to use.
  - `b`: You go up at once. Ms Chua wanted to say it was good, and to put a face to the paper. The meeting takes four minutes. You replay it for a week.
  - `c`: Your reply says you are free all afternoon. Ms Chua is not. The meeting happens three weeks later, by which time the paper has gone up anyway, unchanged.
- Shorter. *(`shorter`)*
  - `a`: Four pages become one. Ms Chua approves it and sends it upstairs, where the next reader writes "Pls elaborate" across the top.
  - `b`: Ms Chua explains that the paper is fine, but the person it goes to next reads everything on a phone, in a car, between meetings. You learn to write for the car.
  - `c`: Your one-line reply reads, in full: "Noted." It is the shortest thing you have ever sent upstairs, and Ms Chua approves the paper on the strength of it.

</details>

[← 27](#c27) · [Next → 29](#c29) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c29"></a>29. Station 4

[← 28](#c28) · [Next → 30](#c30) · [Contents](../DECK-DESIGN.md#contents)

`station_four` · packs/first_years.json · once a career · weight 6

**Who sees it:** up to Senior Management Executive.

**Shares a decision** (`candour_up`) with [#9](#c9): a career sees only one.

The Minister is visiting your division, and the visit is planned to the minute. You're at Station 4, beside a poster of the new scheme, from 10:42 to 10:45am. Your reporting officer, Ms Chua, is two steps behind the Minister. At 10:43 the Minister turns to you and asks whether it actually works. It doesn't, yet.

**A. Say "not yet, Minister", and why.**

> The Minister asks a second question that isn't on the plan, then a third. The visit leaves Station 4 four minutes late. Ms Chua never mentions it to you.

- Hidden: Standing down (−4), Reputation up (+4), Integrity up a lot (+6), this year's appraisal marked down (−4, said on screen).

**B. Give the answer from the briefing notes.**

> "It's progressing well, Minister." The visit moves on to Station 5 at 10:45 exactly. That evening Ms Chua sends you a thumbs-up, the first one ever. You keep it.

- Hidden: Competence up a little (+1), Standing up (+5), Integrity down (−3).

**C. Say what would make it work, in ninety seconds.**

> The Minister's private secretary writes it down. To make up the time, Station 5 is dropped from the visit, and the officer at Station 5, who rehearsed for a week, finds you at lunch to tell you so.

- Hidden: Competence up a lot (+6), Standing down a little (−2), Reputation up (+3), Integrity up a little (+2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The Minister's office (service, `ministersOffice`), 40%: A helps (+3) · B hurts (−4) · C helps (+3).
- The people who work around you (service, `floor`), 50%: C hurts (−2).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `exhibit`

- a poster of the new scheme *(`poster`; shown above)*
- a tablet running the division's new booking app *(`app`)*
- a service counter, repainted for the visit *(`counter`)*

</details>

[← 28](#c28) · [Next → 30](#c30) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c30"></a>30. A Word You Have Not Heard Before

[← 29](#c29) · [Next → 31](#c31) · [Contents](../DECK-DESIGN.md#contents)

`cep_discovery` · events.json · once a career · weight 12

**Who sees it:** Senior Management Executive to Senior Director; not for President's Scholar.

Over lunch, a friend who works in HR mentions your "CEP" as if you'd know the term. You don't, so your friend explains: Currently Estimated Potential, HR's private estimate of the highest grade you'll ever reach, set early in your career and never told to you. Your friend has clearly seen yours, and changes the subject to the new chicken rice stall downstairs.

**A. Ask what yours says.**

> Your friend won't tell you the grade, and says only, very quietly, that it's reviewed every year and can still move. You think about it in the lift, and on most days after that.

- Hidden: Competence up (+5), Integrity down a little (−2).
- Sets `knows_cep`.
- ↳ Can lead to: [31. Farewell Drinks](#c31), in three years, 80%

**B. Let it go.**

> You let it go, and try the chicken rice. You'll hear the term again years from now, in a sentence that begins "Well, realistically".

- Hidden: Standing up (+3).

[← 29](#c29) · [Next → 31](#c31) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c31"></a>31. Farewell Drinks

[← 30](#c30) · [Next → 32](#c32) · [Contents](../DECK-DESIGN.md#contents)

`farewell_drinks` · events.json

**Who sees it:** only as a follow-up to [30. A Word You Have Not Heard Before](#c30) (A: in three years, 80%); when it falls due: up to Deputy Secretary.

Your friend in HR, the one who explained your CEP to you over lunch years ago, is leaving the service. At the farewell drinks, on a second glass, your friend tells you how yours gets reviewed: every year, by people who mostly read your last two postings, and who like officers who have run something, not just written about it. So far, yours have all been papers.

**A. Ask to run something at your next posting.**

> You ask the next morning. HR says it will note your interest, and does: your next posting comes with nine officers, a hotline and a backlog, and it gets read twice.

- Hidden: Competence up (+3), Standing down (−3), the ceiling (CEP) up one grade (+1).

**B. Say thanks, and let your friend enjoy the drinks.**

> You talk about your friend's new job instead: a bank, at a salary that had to be read twice.

- Hidden: Standing up (+3), Integrity up (+3).

[← 30](#c30) · [Next → 32](#c32) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c32"></a>32. The Inconvenient Figure

[← 31](#c31) · [Next → 33](#c33) · [Contents](../DECK-DESIGN.md#contents)

`inconvenient_figure` · events.json · once a career · weight 10

**Who sees it:** Senior Management Executive to Deputy Director.

**Shares a decision** (`bad_number`) with [#41](#c41), [#141](05-politics.md#c141), [#74](02-service.md#c74): a career sees only one.

Your division's flagship scheme is reviewed every quarter by the Permanent Secretary, and this quarter's figure is bad: only 31% of the people eligible for it are using it. A number that low gets a scheme cut. Ms Chua, your reporting officer, asks, mildly, whether it might be "presented as a range rather than a number".

**A. Present it as a range.**

> The slide says "30-60%", and nobody at the review asks how a range that wide was arrived at. Ms Chua never mentions it again, which you decide to take as approval. The real figure stays in your files.

- Hidden: Standing up a lot (+8), Integrity down a lot (−12), Heat up a lot (+12).
- Sets `buried_figure`: in the Folder the background check reads.
- The reporting officer, if this showing named them: marks `asked_for_range`; marks `you_obliged` (read by [#33](#c33)).
- ↳ Can lead to: [33. The Figure, Again](#c33), in four years, 45% · [Everything Surfaced](09-endings.md#end-scandal)

**B. Present the number.**

> You present 31%. The review runs forty minutes over, and the scheme is sent for a full redesign with your slide attached. Ms Chua doesn't invite you to the next meeting, or the four after that.

- Hidden: Competence up (+4), Standing down a lot (−7), Integrity up a lot (+10), this year's appraisal marked down (−8, said on screen).
- The reporting officer, if this showing named them: marks `asked_for_range`; marks `you_refused` (read by [#34](#c34)).
- ↳ Can lead to: [34. The Figure, Cited](#c34), in three years, 55%

**C. Present the number, with a recovery plan attached.**

> You give up the weekend for eleven slides nobody asked for: the number, and how to fix it. Ms Chua presents them as her own. The scheme survives. So do you.

- Hidden: Competence up a lot (+8), Standing up (+3), Integrity up (+5).
- Only offered with Competence of at least 45; otherwise it is left off the card.
- The reporting officer, if this showing named them: marks `asked_for_range`; marks `took_your_slides`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 35%: A hurts (−3) · B helps (+1) · C helps (+2).
- The people who work around you (service, `floor`), 40%: A hurts (−3) · B helps (+2) · C helps (+1).

[← 31](#c31) · [Next → 33](#c33) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c33"></a>33. The Figure, Again

[← 32](#c32) · [Next → 34](#c34) · [Contents](../DECK-DESIGN.md#contents)

`figure_resurfaces` · events.json

**Who sees it:** only as a follow-up to [32. The Inconvenient Figure](#c32) (A: in four years, 45%).

Years ago, when your scheme's usage came in at 31%, you put it on a slide as "30-60%". Now the Auditor-General's Office is auditing the scheme and has asked for the original figure for that year. The request is routine and addressed to Ms Lim Wei Ling, and the auditors will compare it with the slide.

**A. Send the real figure, and explain the slide.**

> You write it all down plainly, including the part where you were asked to. The auditors accept it with a coolness that lasts about two years and then, oddly, turns into a kind of respect.

- Hidden: Standing down a lot (−6), Integrity up a lot (+8), Heat down a lot (−18).

**B. Send the range, and say the raw file wasn't kept.**

> The raw file was kept. It's kept in three places, and the auditors find two of them. Telling an auditor something untrue in writing is much worse than a wide range on a slide, and you've now done it.

- Hidden: Standing up a little (+2), Integrity down a lot (−10), Heat up a lot (+25).
- Sets `raw_file_lost`: in the Folder the background check reads.
- ↳ Can lead to: [Everything Surfaced](09-endings.md#end-scandal)

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 40%: A helps (+3) · B hurts (−3).
- The civil servants who work with you (politics, `officials`), 35%: A helps (+2) · B hurts (−3).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `asked` (the first option that fits)

- the part where Ms Chua asked you to *(`senior`; when the reporting officer (Ms Chua) is the one from [32. The Inconvenient Figure](#c32), A (`you_obliged`))*
- the part where you were asked to *(`unnamed`; shown above)*

</details>

[← 32](#c32) · [Next → 34](#c34) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c34"></a>34. The Figure, Cited

[← 33](#c33) · [Next → 35](#c35) · [Contents](../DECK-DESIGN.md#contents)

`figure_vindicated` · events.json · a standout moment, whichever choice (in the service)

**Who sees it:** only as a follow-up to [32. The Inconvenient Figure](#c32) (B: in three years, 55%); when it falls due: up to Deputy Secretary.

**Shares a decision** (`own_up`) with [#65](02-service.md#c65), [#161](06-cabinet.md#c161), [#105](02-service.md#c105), [#24](#c24): a career sees only one.

A review of why your old scheme struggled has just cited a figure: 31%. That was its real usage rate, the one you put on a slide years ago instead of the range you'd been asked for. Someone senior asks, carefully, who presented it.

**A. Say it was you.**

> The questioner nods slowly and makes a note. A month later you're asked to help redesign the scheme: the kind of request that comes before a promotion.

- Hidden: Standing up a lot (+6), Reputation up (+3), the ceiling (CEP) up two grades (+2).

**B. Say it was a team effort.**

> It wasn't, entirely. Your team knows that, and it does you more good with them than the other answer would have done upstairs.

- Hidden: Standing up (+3), Integrity up a lot (+6), the ceiling (CEP) up one grade (+1).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 45%: A hurts (−2) · B helps (+2).
- The ranking panel (service, `panel`), 30%: A helps (+2) · B hurts (−1).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `asker` (the first option that fits)

- Ms Chua, who wanted the range back then, *(`senior`; when the reporting officer (Ms Chua) is the one from [32. The Inconvenient Figure](#c32), B (`you_refused`))*
  - `short`: Ms Chua
- someone senior *(`unnamed`; shown above)*
  - `short`: The questioner

</details>

[← 33](#c33) · [Next → 35](#c35) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c35"></a>35. 11:40pm, Level 9

[← 34](#c34) · [Next → 36](#c36) · [Contents](../DECK-DESIGN.md#contents)

`late_night` · events.json · can come back · weight 9

**Who sees it:** Senior Management Executive to Permanent Secretary.

**Series** `work_life` with [#19](#c19): shown in full twice a career (the second time asking whether to keep the habit), then its years pass by themselves on the habit; a card whose Meanwhile lines are spent is not drawn again.

**The second showing** (folded below): keeping the habit adds Competence up a little (+1), Reputation down a little (−1); breaking it adds Standing down a little (−1), Reputation up a little (+1).

**A Meanwhile year with no habit:** Competence up a little (+2), Integrity down a little (−1).

It's 11:40pm, and your paper has come back for the fourth time with comments from the people who have to clear it. It's due upstairs in the morning. Faizal, a Management Executive who reports to you, is still at his desk, waiting to see what you decide. The dinner you promised to be home for was at eight.

**A. Finish it tonight.**

> It's cleared at 1:20am, with Faizal proofreading the annexes. You're both thanked in one email of one word. Dinner is in the fridge, with a note that's mostly punctuation.

- Hidden: Competence up (+4), Standing up (+4), Reputation down a little (−1), Integrity down a little (−2).
- Habit: `work`.
- The junior officer, if this showing named them: marks `kept_late` (read by [#47](#c47)).

**B. Go. Send it in the morning.**

> You send Faizal home first, and make it home yourself in time for dessert. The paper goes in at 8:40am, and the world doesn't end. You make a careful note that it didn't.

- Hidden: Standing down (−3), Integrity up a lot (+6).
- Habit: `life`.
- The junior officer, if this showing named them: marks `sent_home` (read by [#47](#c47)).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 45%, the main version only: A hurts (−2) · B helps (+2).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: A helps (+1) · B hurts (−1).

<details><summary>When it comes back (2 scenes)</summary>

The series' second full showing, written per habit: the habit is the first choice, and the answer stands for the rest of the career.

---

*If your habit so far is “Finish it tonight.” (`work`):*

**Late, Again**

It's late again, a paper is due upstairs in the morning, and Faizal, who reports to you, is still at his desk, watching what you do. These nights always end the same way: you stay and finish, whatever was planned at home. What you do tonight is what you'll do every night after it.

**A. Finish it tonight, as usual.**

> Cleared at 1:10am, with Faizal on the annexes again. The thanks is one word, as before. At home the note on the fridge has stopped being punctuation and become a list.

- Hidden: Competence up (+5), Standing up (+4), Reputation down a little (−2), Integrity down a little (−2).
- Habit: `work`.
- The junior officer, if this showing named them: marks `kept_late` (read by [#47](#c47)).

**B. Go home. Send it in the morning, this once.**

> You send Faizal home first, then go yourself. The paper goes in at 8:40am and nobody upstairs can tell. At home, the dinner is what people remember.

- Hidden: Standing down (−4), Reputation up a little (+1), Integrity up a lot (+6).
- Habit: `life`.
- The junior officer, if this showing named them: marks `sent_home` (read by [#47](#c47)).

---

*If your habit so far is “Go. Send it in the morning.” (`life`):*

**Late, Again**

It's late again, a paper is due upstairs in the morning, and Faizal, who reports to you, is waiting to see what you do. These nights always end the same way: you go home on time and send it in the morning, and the building hasn't fallen down yet. What you do tonight is what you'll do every night after it.

**A. Go home, as you always do.**

> You're home for dinner, and the paper goes in at 8:40am. Upstairs never asks when it was written. Two people on your floor now leave on time too, and say it was your idea.

- Hidden: Competence up a little (+1), Standing down (−3), Reputation down a little (−1), Integrity up a lot (+6).
- Habit: `life`.
- The junior officer, if this showing named them: marks `sent_home` (read by [#47](#c47)).

**B. Stay tonight, and finish it.**

> You stay, and Faizal stays because you did. It's cleared at 1am. Upstairs says thank you, once, and the next morning Faizal looks at you as if you'd changed the rules.

- Hidden: Competence up (+4), Standing up (+3), Integrity down a little (−2).
- Habit: `work`.
- The junior officer, if this showing named them: marks `kept_late` (read by [#47](#c47)).

</details>

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2: Sunday, 4pm*

You're at a friend's birthday party on a Sunday afternoon when an email from upstairs asks for a brief by eight tomorrow morning. Upstairs will judge you by whether it's there at eight, not by when you wrote it. Everyone else at the table is holding cake.

**A. Find a quiet corner and write it now.**

> You write it on your phone behind the cake table, and it's approved by nine. In the party photographs you're the back of a head, bent over a screen.

**B. Stay at the party. Write it at six tomorrow.**

> You sing, badly, and help cut the cake. The brief goes in at 7:55am. Upstairs never asks when it was written, and that teaches you something you try to remember.

---

*Version 3: 10:50pm, One Comment*

At 10:50pm your paper comes back from upstairs with one comment: "Can we tighten?" It's already two pages, it's due at nine tomorrow, and whoever wrote the comment is clearly still awake and waiting.

**A. Tighten it tonight.**

> Two pages become one and a half. The half you cut was the only part anyone would have disagreed with, so the paper sails through.

**B. Reply that it's already tight, and go to bed.**

> You reply at 10:52pm that it's already tight, and go to bed. In the morning there's a thumbs-up, which in this building counts as a concession.

</details>

<details><summary>Meanwhile lines (14)</summary>

A year that passes by itself on the habit shows one line, never the same one twice in a career.

**Habit A, `work`**

- Working late on Level 9 becomes a habit, then a reputation.
- The cleaner on your floor now says goodnight to you by name.
- You miss a birthday dinner and make a deadline. By March both are forgotten, by different people.
- The night guard knows your car, your floor and your usual time: late.
- The lights on Level 9 go off on a timer at midnight, and you've learnt to wave at the sensor.
- A deadline met at 1am is acknowledged at 9am with "Thanks, noted", all a deadline ever gets.
- Your laptop battery dies at 11:58pm, mid-sentence. You take it as advice, and ignore it.

**Habit B, `life`**

- You leave at seven and send things in the morning, and the building doesn't fall down.
- A birthday dinner, attended, while the comments on your paper wait until morning, as they always could.
- You've stopped apologising for leaving on time, and two people on your floor have started doing the same.
- You leave at six, the work is in by nine the next morning, and nobody can tell it wasn't written at midnight.
- You leave on time, and the comments on your paper come back anyway. They're the same comments.
- Dinner at eight, as promised, and your paper is none the worse for a night in the outbox.
- You go home at seven again, and the midnight reply-all about your paper happens without you in it.

</details>

[← 34](#c34) · [Next → 36](#c36) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c36"></a>36. The Classification

[← 35](#c35) · [Next → 37](#c37) · [Contents](../DECK-DESIGN.md#contents)

`mnd_classification` · events.json · once a career · weight 8

**Who sees it:** Senior Management Executive to Deputy Secretary; only in the Ministry of National Development.

HDB, the government's housing board, is planning a new estate, and you have to decide which of its projects are Standard, Plus or Prime. The label decides how long owners must live there and what they repay when they sell. You have a map, a set of criteria, and three neighbouring blocks that are, in every way a resident would notice, identical.

**A. Apply the criteria exactly, and let the line fall where it falls.**

> The line falls between two of the three blocks. Years from now, two neighbours on the same corridor will have different rules for selling the same kind of flat, and both will know exactly why.

- Hidden: Competence up (+3), Standing down a little (−2), Integrity up (+5).

**B. Move the line so it follows the road.**

> The road makes a tidy boundary, and the criteria get a footnote. Nobody reads footnotes, until somebody does.

- Hidden: Competence up a little (+1), Standing up (+5), Integrity down a little (−2).

**C. Write a note on the three blocks, and send it up.**

> Your note asks a question nobody wanted asked. It's answered eventually, in a way you can live with, by someone more senior who takes the credit for the question.

- Hidden: Competence up (+4), Standing down (−3), Integrity up a little (+2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- People from other agencies who were in the room or on the email (service, `agencies`), 40%: A helps (+2) · B hurts (−2).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: B helps (+1) · C hurts (−1).

[← 35](#c35) · [Next → 37](#c37) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c37"></a>37. Ninety-Nine Years

[← 36](#c36) · [Next → 38](#c38) · [Contents](../DECK-DESIGN.md#contents)

`mnd_lease` · events.json · once a career · weight 8

**Who sees it:** Senior Management Executive to Deputy Secretary; only in the Ministry of National Development.

A residents' committee from a 1970s estate built by HDB, the government's housing board, has written in. Their leases are ninety-nine years long and about half used up. The letter is polite, well researched, and asks one question: what happens to their flats when the lease runs out. The answer is in the policy. They've read the policy.

**A. Meet them, and explain it in person.**

> Two hours at a void deck, the shaded open space under one of their blocks. You explain the policy, and then you listen to what it means to them. That's a different conversation, and a longer one.

- Hidden: Competence up a little (+2), Standing down a little (−2), Reputation up (+4), Integrity up (+4).

**B. Reply in writing, accurately and kindly.**

> Your letter is accurate and kind. It's pinned on the noticeboard beside the lift, where everyone reads it and most people believe it.

- Hidden: Competence up a little (+2), Standing up (+4).

**C. Invite them to the consultation on redevelopment.**

> They come, all eleven of them, with a folder. Their folder is better organised than yours.

- Hidden: Competence up (+3), Standing down a little (−1), Reputation up (+3).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- People from other agencies who were in the room or on the email (service, `agencies`), 35%: A helps (+1) · B helps (+1) · C hurts (−2).

[← 36](#c36) · [Next → 38](#c38) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c38"></a>38. The Banding

[← 37](#c37) · [Next → 39](#c39) · [Contents](../DECK-DESIGN.md#contents)

`moe_banding` · events.json · once a career · weight 8

**Who sees it:** Senior Management Executive to Deputy Secretary; only in the Ministry of Education.

Under Full Subject-Based Banding, students in the same class take different subjects at different levels, so a school's timetable no longer fits inside its classes. A principal has written to the ministry to say the school's teachers are now, in effect, air traffic controllers. The ministry's reply is yours to decide.

**A. Fund the timetabling software the principal asked for.**

> The software mostly works. The teachers are now air traffic controllers with radar, which they say is an improvement.

- Hidden: Competence up (+4), Standing down a little (−2), Reputation up (+3).

**B. Send a guidebook and a hotline number.**

> The guidebook is thorough and the hotline is staffed. The principal's reply thanks you for both, in a tone you'll remember.

- Hidden: Competence down a little (−2), Standing up (+4).

**C. Spend a week in the school, and find out.**

> You spend a week with a timetable on a wall the size of a car park, and come back with three changes that fit on one page. They work.

- Hidden: Competence up a lot (+6), Standing down a little (−2), Integrity up (+3).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 35%: A helps (+1) · B hurts (−2) · C helps (+1).
- The ranking panel (service, `panel`), 30%: A helps (+1) · C hurts (−1).

[← 37](#c37) · [Next → 39](#c39) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c39"></a>39. The Merger List

[← 38](#c38) · [Next → 40](#c40) · [Contents](../DECK-DESIGN.md#contents)

`moe_mergers` · events.json · once a career · weight 8

**Who sees it:** Senior Management Executive to Deputy Secretary; only in the Ministry of Education.

Fewer children are born every year, so some schools must merge, and you're drawing up the list. Every school on it will lose its name or its building. Every school on it also has an alumni association, a school song, and a former principal who is still alive and writes letters.

**A. Draw the list on the numbers.**

> The list is defensible, line by line. The letters arrive line by line too, many of them beautifully written, and all of them signed.

- Hidden: Competence up (+4), Standing down (−3), Integrity up (+5).

**B. Keep the oldest names, whatever the numbers say.**

> The old names survive. Two newer schools with better numbers don't, and their students will remember the year their school was described as "consolidated".

- Hidden: Standing up (+5), Reputation up a little (+2), Integrity down (−3).

**C. Propose that merged schools keep both names.**

> The names are hyphenated. The school songs aren't, and the first combined assembly is, by every account, loud.

- Hidden: Competence up a little (+2), Standing up a little (+1), Reputation up (+4).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The Minister's office (service, `ministersOffice`), 40%: A hurts (−2) · B helps (+2).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: A helps (+2) · B hurts (−2).

[← 38](#c38) · [Next → 40](#c40) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c40"></a>40. The Bed Crunch

[← 39](#c39) · [Next → 41](#c41) · [Contents](../DECK-DESIGN.md#contents)

`moh_beds` · events.json · once a career · weight 8

**Who sees it:** Senior Management Executive to Deputy Secretary; only in the Ministry of Health.

**Shares a decision** (`announce`) with [#88](02-service.md#c88), [#74](02-service.md#c74): a career sees only one.

Public hospitals are over ninety per cent full, and emergency waiting times are in the papers again. You've been asked for a paper on transitional care: beds outside the hospitals for patients who are well enough to leave but have nowhere ready to go. The Minister wants something to announce.

**A. Recommend more transitional beds, and say where the nurses will come from.**

> Your paper has a section on nurses that nobody asked for and everybody quotes. The beds are approved. Staffing them is, as you said it would be, the hard part.

- Hidden: Competence up a lot (+6), Standing down (−3), Integrity up (+4).

**B. Recommend the beds, and leave the nurses to a later paper.**

> The beds are approved quickly. A later paper, not yours, discovers there aren't enough nurses, and cites yours as "an important first step".

- Hidden: Competence down a little (−2), Standing up (+5).

**C. Recommend better discharge planning instead.**

> It's the right answer and the less announceable one. The hospitals like it. The press office asks whether there's a version with a number in it.

- Hidden: Competence up (+4), Standing down a little (−2), Reputation up (+3).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The Minister's office (service, `ministersOffice`), 40%: B helps (+2) · C hurts (−2).
- People from other agencies who were in the room or on the email (service, `agencies`), 40%: B hurts (−2) · C helps (+2).
- The officer who countersigns your appraisal (service, `countersigner`), 30%: A helps (+2) · B hurts (−2).

[← 39](#c39) · [Next → 41](#c41) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c41"></a>41. The Premiums

[← 40](#c40) · [Next → 42](#c42) · [Contents](../DECK-DESIGN.md#contents)

`moh_premiums` · events.json · once a career · weight 8

**Who sees it:** Senior Management Executive to Deputy Secretary; only in the Ministry of Health.

**Shares a decision** (`bad_number`) with [#32](#c32), [#141](05-politics.md#c141), [#74](02-service.md#c74): a career sees only one.

Premiums for MediShield Life, the national health insurance everyone pays into, are going up, and the actuaries have done the sums: the increase is what it is. Your job is to decide how it's put to the public: all at once or over several years, and with how much subsidy shown beside it. Whatever you choose, someone will add it up.

**A. Present the full number, with the subsidies next to it.**

> The increase is large, the subsidies are larger for the people who need them, and the slide says both. It's the least comfortable slide in the deck, and the only one nobody later has to correct.

- Hidden: Competence up (+3), Standing down (−3), Integrity up a lot (+6).

**B. Phase it over three years, so no single year looks large.**

> Each year looks reasonable. Within a week somebody adds the three years together, in a letter to the newspaper, with a table in it.

- Hidden: Standing up (+5), Integrity down (−3).

**C. Ask the actuaries to walk you through their assumptions first.**

> Two days in a room with the actuaries. You come out understanding medical cost inflation better than anyone in your division, and slightly worried about it.

- Hidden: Competence up a lot (+6), Standing up a little (+1), Reputation down a little (−1).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 35%: A helps (+2) · B hurts (−2).
- The Minister's office (service, `ministersOffice`), 35%: A helps (+1) · B hurts (−3).
- People from other agencies who were in the room or on the email (service, `agencies`), 35%: C helps (+2).

[← 40](#c40) · [Next → 42](#c42) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c42"></a>42. The Dormitory Standards

[← 41](#c41) · [Next → 43](#c43) · [Contents](../DECK-DESIGN.md#contents)

`mom_dorms` · events.json · once a career · weight 8

**Who sees it:** Senior Management Executive to Deputy Secretary; only in the Ministry of Manpower.

Your division has drafted new standards for migrant worker dormitories: fewer beds to a room, more toilets, better ventilation, more space per worker. The dormitory operators have written to say they'll pass the cost on to employers. The employers have written to say they won't absorb it. You decide what holds.

**A. Hold the standards, and phase the deadline.**

> The standards hold. The deadline moves twice, in writing, with reasons. Two years later the rooms are measurably less crowded. It isn't a headline, and that's the point.

- Hidden: Competence up (+4), Standing down a little (−2), Integrity up (+5).

**B. Hold the standards and the deadline.**

> Three operators complain about you, by name, to three different people. The rooms are less crowded on schedule.

- Hidden: Standing down (−5), Reputation up a little (+2), Integrity up a lot (+8).

**C. Soften the space requirement for existing dormitories.**

> Everyone is relieved, including you, briefly. New dormitories meet the new standard. The old ones keep to the old one, for longer than anyone said they would.

- Hidden: Standing up (+5), Integrity down (−5).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 35%: A helps (+2) · C hurts (−2).
- The people who work around you (service, `floor`), 40%: A helps (+1) · B helps (+1) · C hurts (−2).
- The Minister's office (service, `ministersOffice`), 35%: B hurts (−2) · C helps (+2).

[← 41](#c41) · [Next → 43](#c43) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c43"></a>43. The Wage Ladder

[← 42](#c42) · [Next → 44](#c44) · [Contents](../DECK-DESIGN.md#contents)

`mom_wages` · events.json · once a career · weight 8

**Who sees it:** Senior Management Executive to Deputy Secretary; only in the Ministry of Manpower.

Your division is extending the Progressive Wage Model, the ladder of minimum wages tied to skills, to another sector. The union wants the ladder steeper, so pay rises faster. The employers want it longer, so pay rises slowly. The workers in the sector, when you finally meet some, want to know when.

**A. Back the steeper ladder.**

> The ladder ends up steeper than the employers wanted and gentler than the union asked for. In tripartite talks, where government, unions and employers settle wages together, that's a win for everyone and a story for nobody.

- Hidden: Standing down (−4), Reputation up (+3), Integrity up (+5).

**B. Broker the longer, gentler ladder.**

> Everyone signs. The first rung is lower than you'd hoped. You tell yourself it's a ladder, and ladders get climbed.

- Hidden: Competence up a little (+2), Standing up a lot (+6), Integrity down a little (−2).

**C. Take both versions back to the workers, and ask.**

> They choose the steeper one and ask for it sooner. You write that down exactly, and it goes into the paper sent upstairs. Workers' own words rarely get that far.

- Hidden: Competence up (+5), Standing down a little (−2), Integrity up (+3).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 35%: A hurts (−1) · B helps (+2) · C hurts (−1).
- The ranking panel (service, `panel`), 30%: B hurts (−2) · C helps (+2).

[← 42](#c42) · [Next → 44](#c44) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c44"></a>44. Meet-the-People Session

[← 43](#c43) · [Next → 45](#c45) · [Contents](../DECK-DESIGN.md#contents)

`mps_duty` · events.json · once a career · weight 10

**Who sees it:** Senior Management Executive to Senior Director.

An old school friend volunteers at her MP's Meet-the-People Session: every Tuesday night, residents bring their problems to their Member of Parliament, and volunteers write their appeal letters to agencies. She asks you to help. Most of the cases were decided correctly the first time. The sessions are run by the party's branch in the ward, and civil servants are meant to stay out of politics. She says lots of people help in their own time.

**A. Go every Tuesday for a year, in your own time.**

> Fifty-one Tuesdays, in your own T-shirt, never the branch one. You learn more about how policy lands than in all your years of writing it. One appeal you argue properly, for a woman everyone said was hopeless, wins. The MP notices.

- Hidden: Competence down (−4), Standing up (+4), Reputation up a lot (+10), Integrity up a lot (+6).
- Sets `did_mps`: counts toward Legacy.
- ↳ Can lead to: [45. The Block Party](#c45), in four years, 90%

**B. Go a few times, enough to be seen.**

> You go four times, and make sure the MP sees you on two of them. You learn very little about how policy lands. The branch learns that you are interested.

- Hidden: Competence up a little (+1), Standing up (+5), Reputation up (+4), Integrity down (−3).

**C. Decline. You are a civil servant, and mean to stay neutral.**

> Your friend says she completely understands. The branch secretary, standing next to her, also understands, and will remember your name if it ever comes up.

- Hidden: Competence up (+4), Standing down (−4), Integrity up (+3).

[← 43](#c43) · [Next → 45](#c45) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c45"></a>45. The Block Party

[← 44](#c44) · [Next → 46](#c46) · [Contents](../DECK-DESIGN.md#contents)

`block_party` · events.json

**Who sees it:** only as a follow-up to [44. Meet-the-People Session](#c44) (A: in four years, 90%); when it falls due: Member of Parliament and up.

**Shares a decision** (`share_credit`) with [#94](02-service.md#c94), [#163](06-cabinet.md#c163): a career sees only one.

Years ago, before politics, you spent a year of Tuesday nights writing appeal letters at a Meet-the-People Session. One letter, for a woman everyone said was hopeless, won. Now, at a block party in your ward, that woman is introducing you to forty of her neighbours. She has told them the story, in detail, more than once.

**A. Let her tell it again.**

> She tells it with improvements. By the end of the evening the appeal has overturned a decision, saved a business and possibly a marriage. Forty people will vote for the version with the marriage.

- Hidden: Standing up a little (+2), Reputation up a lot (+8), Integrity down a little (−2).

**B. Tell them the appeal worked because her case was good.**

> This is true. She tells them you are being modest, and now the modesty is part of the story too. It goes round the block faster than you can walk it.

- Hidden: Reputation up (+4), Integrity up a lot (+6).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your party branch and its volunteers (politics, `branch`), 40%: A hurts (−2) · B helps (+2).

[← 44](#c44) · [Next → 46](#c46) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c46"></a>46. The New Reporting Officer

[← 45](#c45) · [Next → 47](#c47) · [Contents](../DECK-DESIGN.md#contents)

`new_ro` · events.json · once a career · weight 9

**Who sees it:** Senior Management Executive to Deputy Secretary.

**Series** `footing` with [#1](#c1), [#2](#c2): shown in full twice a career (the second time asking whether to keep the habit), then its years pass by themselves on the habit.

**Whichever choice:** the reporting officer leaves the story, and a new one arrives.

**The second showing** (folded below): keeping the habit adds Competence up a little (+1), Reputation down a little (−1); breaking it adds Standing down a little (−1), Reputation up a little (+1).

Ms Chua, your reporting officer until now, has been given more to run, so you now report to someone new from another ministry, who knows nothing about you and has brought two trusted people along. The newcomer will write your appraisals. Meanwhile the division's hardest file, a review the Permanent Secretary wants by December, has nobody on it.

**A. Make yourself indispensable on the hardest file.**

> The review takes eight months, and goes in before December. Your new reporting officer rates people strictly on what they've done, which turns out to be rarer than you'd thought, and suits you well.

- Hidden: Competence up a lot (+8), Standing up a lot (+6).
- Habit: `harder`.

**B. Be useful to the newcomer's two people.**

> You become the person they ask where things are and whom to see. It's a real position and a small one, and you hold it for as long as they stay.

- Hidden: Competence down a little (−2), Standing up a lot (+8), Integrity down a little (−2).
- Habit: `network`.

**C. Keep your head down until the newcomer leaves.**

> The newcomer is in no hurry to leave. Meanwhile your appraisals go flat, and every promotion board for the rest of your career will see the line.

- Hidden: Competence up (+3), Standing down (−4), Integrity up a little (+2).
- Habit: `head_down`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 60%: A helps (+4) · B hurts (−2) · C hurts (−3).
- The ranking panel (service, `panel`), 20%: A helps (+3) · A raises the ceiling a grade · C hurts (−3).

<details><summary>When it comes back (3 scenes)</summary>

The series' second full showing, written per habit: the habit is the first choice, and the answer stands for the rest of the career.

---

*If your habit so far is “Make yourself indispensable on the hardest file.” (`harder`):*

**The New Reporting Officer**

Ms Chua, your reporting officer until now, has been given more to run, and someone new from another ministry will write your appraisals. Since your first months you've gone for the hard work first, and the division's hardest file has nobody on it. What the newcomer sees this year is what your file will say about you for years.

**A. Take the hardest file, as you always have.**

> The review goes in before December. Your new reporting officer rates people on what they've done, and you've done a great deal. It suits you, and it's become what people expect of you.

- Hidden: Competence up a lot (+9), Standing up a lot (+6), Reputation down a little (−1).
- Habit: `harder`.

**B. This time, start with the newcomer's two people.**

> You learn their names before you learn the newcomer's habits. By March they ask you where things are and whom to see. The hardest file goes to someone else, who is tired by December.

- Hidden: Competence down a little (−2), Standing up a lot (+7), Reputation up a little (+1), Integrity down a little (−2).
- Habit: `network`.

**C. Let someone else take the file. Keep your head down.**

> Someone else takes the hard file, and you do your own work, quietly. The newcomer forms a view of you anyway, and the view is "steady", which every promotion board after will read.

- Hidden: Competence up (+3), Standing down (−5), Reputation up a little (+1), Integrity up a little (+2).
- Habit: `head_down`.

---

*If your habit so far is “Be useful to the newcomer's two people.” (`network`):*

**The New Reporting Officer**

Ms Chua, your reporting officer until now, has been given more to run, and someone new from another ministry will write your appraisals, with two trusted people in tow. Since your first months you've made a point of knowing who matters. What the newcomer sees this year is what your file will say about you for years.

**A. Make yourself useful to the newcomer's two people.**

> By Christmas you're the fourth chair at their lunch table. It's a real position and a small one, and you hold it for as long as they stay.

- Hidden: Competence down a little (−1), Standing up a lot (+8), Reputation down a little (−1), Integrity down a little (−2).
- Habit: `network`.

**B. Leave the networking. Take the hardest file.**

> You take the file nobody wanted, and finish it in eight months. Fewer people know your face this year. Your new reporting officer knows your work, which turns out to be the one that counts.

- Hidden: Competence up a lot (+8), Standing up (+5), Reputation up a little (+1).
- Habit: `harder`.

**C. Step back, and keep your head down.**

> You stop going to the lunches and do your own work. The newcomer barely knows your name by June, and the two trusted people have found someone else to ask.

- Hidden: Competence up (+3), Standing down (−5), Reputation up a little (+1), Integrity up a little (+2).
- Habit: `head_down`.

---

*If your habit so far is “Keep your head down until the newcomer leaves.” (`head_down`):*

**The New Reporting Officer**

Ms Chua, your reporting officer until now, has been given more to run, and someone new from another ministry will write your appraisals. Since your first months you've kept your head down and done what's in front of you, well and without fuss. What the newcomer sees this year is what your file will say about you for years.

**A. Keep your head down, as you always have.**

> You do your own work well, and the newcomer notices it the way you notice a clock that keeps time. Your appraisals go flat, and every promotion board after will read the same line.

- Hidden: Competence up (+4), Standing down (−4), Reputation down a little (−1), Integrity up a little (+2).
- Habit: `head_down`.

**B. This time, ask for the hardest file.**

> You ask for the file nobody wanted, and the newcomer, who doesn't know you're usually quiet, hands it over without surprise. It goes in before December. You're slightly surprised you asked.

- Hidden: Competence up a lot (+8), Standing up (+5), Reputation up a little (+1).
- Habit: `harder`.

**C. This time, get to know the newcomer's people.**

> You start having lunch with the newcomer's two people. They're friendly, and by March they're asking you where things are. You find you're good at this.

- Hidden: Competence down a little (−2), Standing up a lot (+7), Reputation up a little (+1), Integrity down a little (−2).
- Habit: `network`.

</details>

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2: Standing Up*

Your new reporting officer starts on Monday, and Ms Chua, who had the job until now, has moved up a floor to run something bigger. The newcomer spent twenty-two years in the army, holds the morning meeting standing up, and has brought two officers from the old unit. Nobody has briefed the newcomer on the year's most urgent file: the legal opinion that a decision due in March rests on.

**A. Brief the newcomer on the legal opinion yourself.**

> You brief your new reporting officer on the legal opinion in nine minutes, standing, and the March decision goes through. From then on you're asked for by surname, which in the newcomer's vocabulary is a commendation.

**B. Make yourself useful to the newcomer's two officers.**

> They know the newcomer; you know the building. By Christmas you're the fourth chair at their lunch table, and you keep it. It's the chair by the window.

**C. Do as you're told, and wait for the newcomer to move on.**

> The newcomer shows no sign of moving on. Your appraisals start to read like a roll call: present, correct, in line, and visible to every promotion board after.

---

*Version 3: The Deck*

Ms Chua, your reporting officer until now, is too busy to supervise you, so you're getting a new one: a mid-career hire from a consulting firm who wants everything as a deck, and has brought two former colleagues in on contract. This year's biggest decision rests on a file that won't fit on a slide: an Act, two amendments and a court case.

**A. Take the file that won't fit on a slide.**

> You walk your new reporting officer through the Act, the amendments and the court case in an afternoon. The newcomer is quick, and from then on rates you on what you know.

**B. Make yourself useful to the two consultants.**

> They need someone who knows how a paper really moves through the building, and you do. They bill for it. Their final report thanks you in a footnote, as "a key stakeholder".

**C. Wait for the new boss to go back to the private sector.**

> Your new boss likes it here, and stays. Your appraisals stop changing by so much as a word, and every promotion board after reads the identical years as one.

</details>

[← 45](#c45) · [Next → 47](#c47) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c47"></a>47. The Ask

[← 46](#c46) · [Next → 48](#c48) · [Contents](../DECK-DESIGN.md#contents)

`the_ask` · events.json · once a career · weight 6

**Who sees it:** Senior Management Executive to Deputy Secretary.

Xin Yi, who joined the service with you, stops you by the lift and asks you for a favour: a reference for a two-year posting to the Budget Division. Saying yes takes time. Saying no will be remembered. Your own paper is due the same week, and isn't finished.

**A. Say yes, and do it properly.**

> You write three paragraphs, all of them true, and send them before midnight. Xin Yi says you're owed one, and writes it in a notebook you've seen before.

- Hidden: Standing down a little (−2), Reputation up (+3), Integrity up a lot (+6).
- The peer, if this showing named them: marks `owes_you`.
- The junior officer, if this showing named them: marks `owes_you`.
- The reporting officer, if this showing named them: marks `owes_you`.

**B. Say yes, and make sure it's seen.**

> You write three good paragraphs, and copy in two people who'll remember that you wrote them. Xin Yi says you're owed one, and writes it in a notebook you've seen before.

- Hidden: Competence down a little (−2), Standing up (+5), Reputation up (+3), Integrity down (−4).
- The peer, if this showing named them: marks `owes_you`; marks `you_made_it_known`.
- The junior officer, if this showing named them: marks `owes_you`; marks `you_made_it_known`.
- The reporting officer, if this showing named them: marks `owes_you`; marks `you_made_it_known`.

**C. Say no, and say why.**

> You explain that a reference from you would read as a favour, because it would be one. Xin Yi takes it well, and has asked someone else by lunchtime.

- Hidden: Competence up (+4), Standing down (−5), Integrity up (+4).
- The peer, if this showing named them: marks `you_said_no`.
- The junior officer, if this showing named them: marks `you_said_no`.
- The reporting officer, if this showing named them: marks `you_said_no`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 45%, when the part `asker` is `peer` or `peer_box` or `junior` or `junior_late` or `junior_home`: A helps (+2) · B hurts (−2).
- The ranking panel (service, `panel`), 30%: B helps (+2) · C hurts (−2).
- The officer who countersigns your appraisal (service, `countersigner`), 35%, when the part `asker` is `senior`: A helps (+2) · C hurts (−2).

<details><summary>This card varies (3 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `asker`

- Xin Yi, who joined the service with you, *(`peer`; when the peer (Xin Yi) is not the one from [22. The Cc Line](#c22), B; [95. The Reorganisation](02-service.md#c95), B; [102. The Interview Panel](02-service.md#c102), B (`fell_out`) and is not the one from [95. The Reorganisation](02-service.md#c95), A (`got_the_box`); shown above)*
  - `short`: Xin Yi
  - `their`: her
  - `yes`: Xin Yi says you're owed one, and writes it in a notebook you've seen before.
  - `no`: Xin Yi takes it well, and has asked someone else by lunchtime.
- Xin Yi, who got the director's post in the reorganisation instead of you, *(`peer_box`; when the peer (Xin Yi) is the one from [95. The Reorganisation](02-service.md#c95), A (`got_the_box`) and is not the one from [22. The Cc Line](#c22), B; [95. The Reorganisation](02-service.md#c95), B; [102. The Interview Panel](02-service.md#c102), B (`fell_out`); preferred)*
  - `short`: Xin Yi
  - `their`: her
  - `yes`: Xin Yi says that makes the two of you even, and you both know it doesn't.
  - `no`: Xin Yi says that's fair, and reminds you, lightly, which of you got the post.
- Faizal, who reports to you, *(`junior`; when the junior officer (Faizal) is not the one from [35. 11:40pm, Level 9](#c35), A (`kept_late`) and is not the one from [35. 11:40pm, Level 9](#c35), B (`sent_home`); choice B: Integrity down a little (−2))*
  - `short`: Faizal
  - `their`: his
  - `yes`: Faizal thanks you twice, the second time when nobody else is around to hear it.
  - `no`: Faizal nods, and doesn't ask you for anything else for some months.
- Faizal, who once proofread your annexes until 1:20am, *(`junior_late`; when the junior officer (Faizal) is the one from [35. 11:40pm, Level 9](#c35), A (`kept_late`); preferred; choice B: Integrity down a little (−2); choice C: Standing down a little (−1))*
  - `short`: Faizal
  - `their`: his
  - `yes`: Faizal thanks you once, and you understand it's for the annexes as well.
  - `no`: Faizal says that's fine, in very nearly the tone you used at 1:20am.
- Faizal, whom you once sent home before a deadline, *(`junior_home`; when the junior officer (Faizal) is the one from [35. 11:40pm, Level 9](#c35), B (`sent_home`); preferred; choice B: Integrity down a little (−2))*
  - `short`: Faizal
  - `their`: his
  - `yes`: Faizal thanks you, and leaves on time that evening, which you also take as thanks.
  - `no`: Faizal says that's fine, and leaves on time, which you take as the reply.
- Ms Chua, your reporting officer, *(`senior`; choice B: Standing up a little (+2); choice C: Standing down (−3))*
  - `short`: Ms Chua
  - `their`: her
  - `yes`: Ms Chua remembers it in the meeting that decides your grade, the only room where it counts.
  - `no`: Ms Chua says that's perfectly fine, in the way the word is used upstairs.

**Part 2** · `want`

- a reference for a two-year posting to the Budget Division *(`reference`; when when the part `asker` is `peer` or `peer_box` or `junior` or `junior_late` or `junior_home`; shown above)*
  - `a`: You write three paragraphs, all of them true, and send them before midnight.
  - `b`: You write three good paragraphs, and copy in two people who'll remember that you wrote them.
  - `c`: You explain that a reference from you would read as a favour, because it would be one.
- a second read of a paper that goes up at nine tomorrow *(`read`)*
  - `a`: You read it twice and send back three comments, all of them fair, at 11:40pm.
  - `b`: You send back three comments, and mention at the morning meeting that you looked it over.
  - `c`: You say you can't do it justice tonight. It's true, and no help to the paper.
- someone to take her place at a Saturday dialogue session in Jurong *(`cover`; when when the part `asker` is `peer` or `peer_box` or `senior`)*
  - `a`: You spend the Saturday in Jurong with forty residents and a microphone that works half the time.
  - `b`: You take the Saturday session. Its photograph goes in the division newsletter, with you in front.
  - `c`: You keep your Saturday. The session goes ahead with nobody senior there, and is written up as "intimate".

**Part 3** · `snag`

- Your own paper is due the same week, and isn't finished. *(`deadline`; choice A: Competence down a little (−2); choice B: Competence down a little (−2); shown above)*
- HR sent round a reminder about conflicts of interest this morning, in bold. *(`conflicts`; when when the part `want` is `reference`; choice B: Heat up (+4))*
- Someone else on your floor asked you for the same thing an hour ago. *(`queue`; when when the part `want` is `reference` or `read`; choice C: Standing up a little (+2))*
- Nobody else has asked you for anything all week. *(`quiet`)*

</details>

[← 46](#c46) · [Next → 48](#c48) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c48"></a>48. The Seventh Month

[← 47](#c47) · [Next → 49](#c49) · [Contents](../DECK-DESIGN.md#contents)

`strange_ghost` · packs/strange.json · once a career · weight 1.2

**Who sees it:** Senior Management Executive to Director; not after any of [#14](#c14), [#17](#c17), [#72](02-service.md#c72), [#106](02-service.md#c106), [#107](02-service.md#c107), [#116](02-service.md#c116), [#121](03-top-of-service.md#c121), [#136](05-politics.md#c136), [#137](05-politics.md#c137), [#168](06-cabinet.md#c168), [#171](06-cabinet.md#c171) (`strange_met`).

During the seventh month of the lunar calendar, when the spirits of the dead are said to roam, your division's online feedback form receives a compliment from a resident who passed away in 1974. It's courteous and specific. The service standard says every member of the public gets a reply within three working days. You must also rule whether his rating counts in the satisfaction survey, where your division's score is one decimal place short of its target.

**A. Rule that he counts. He is a member of the public.**

> He is counted. He rates your reply five out of five, and adds that it came faster than his last one, in 1973. His rating lifts the division to its target, and the result is presented at the next townhall.

- Hidden: Standing down (−3), Reputation up (+4), Integrity up a little (+2).
- Sets `strange_met`: read by [#14](#c14), [#17](#c17), [#72](02-service.md#c72), [#106](02-service.md#c106), [#107](02-service.md#c107), [#116](02-service.md#c116), [#121](03-top-of-service.md#c121), [#136](05-politics.md#c136), [#137](05-politics.md#c137), [#168](06-cabinet.md#c168), [#171](06-cabinet.md#c171).

**B. Rule that he does not. The survey covers living residents.**

> The reply still goes out within three working days, because the service standard makes no exception. The survey's definitions are amended to add the word "living", which had never occurred to anyone.

- Hidden: Standing up (+4), Integrity down (−3).
- Sets `strange_met`: read by [#14](#c14), [#17](#c17), [#72](02-service.md#c72), [#106](02-service.md#c106), [#107](02-service.md#c107), [#116](02-service.md#c116), [#121](03-top-of-service.md#c121), [#136](05-politics.md#c136), [#137](05-politics.md#c137), [#168](06-cabinet.md#c168), [#171](06-cabinet.md#c171).

**C. Refer the question to a working group.**

> The working group meets in the eighth month, by which time he has stopped writing in, and recommends reviewing the question in the seventh month next year. It is reviewed then, and every year after.

- Hidden: Competence down a little (−2), Standing up (+3), Integrity down a little (−1).
- Sets `strange_met`: read by [#14](#c14), [#17](#c17), [#72](02-service.md#c72), [#106](02-service.md#c106), [#107](02-service.md#c107), [#116](02-service.md#c116), [#121](03-top-of-service.md#c121), [#136](05-politics.md#c136), [#137](05-politics.md#c137), [#168](06-cabinet.md#c168), [#171](06-cabinet.md#c171).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The ranking panel (service, `panel`), 30%: A helps (+2) · B hurts (−1) · C hurts (−1).
- The officer who countersigns your appraisal (service, `countersigner`), 30%: A hurts (−1) · B helps (+2) · C hurts (−1).

[← 47](#c47) · [Next → 49](#c49) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c49"></a>49. Standard Operating Procedure

[← 48](#c48) · [Next → 50](02-service.md#c50) · [Contents](../DECK-DESIGN.md#contents)

`real_sop` · packs/first_years.json · once a career · weight 6

**Who sees it:** Senior Management Executive only.

**Shares a decision** (`mentor_hardway`) with [#67](02-service.md#c67): a career sees only one.

Faizal, who reports to you, has just joined your section, and has been handed the official standard operating procedures: forty-one pages, last updated two reorganisations ago, and mostly out of date. You keep your own version on one page of a notebook. It's the reason you get things done faster than anyone else on the floor.

**A. Give Faizal your page.**

> Your page says which director reads only the first paragraph, which printer jams, and who in HR picks up before nine. Faizal is useful within a week, and photocopies it.

- Hidden: Competence up a little (+2), Standing down a little (−1), Integrity up (+5).
- The junior officer, if this showing named them: marks `has_your_page`.

**B. Let Faizal learn it the way you did.**

> Faizal learns it by getting it wrong in front of the right people. It takes a year. Neither of you mentions it, and Faizal starts a notebook.

- Hidden: Competence up a little (+2), Standing up (+5), Integrity down a little (−2).
- The junior officer, if this showing named them: marks `learnt_the_hard_way`.

**C. Rewrite the forty-one pages around your one.**

> It takes three months of evenings. The division adopts your new procedures, with your name in the version history and nowhere else, and Faizal learns them in a weekend.

- Hidden: Competence up a lot (+7), Standing down a little (−1), Reputation up a little (+2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 50%: A helps (+3) · B hurts (−3).
- The ranking panel (service, `panel`), 30%: B hurts (−1) · C helps (+1).

[← 48](#c48) · [Next → 50](02-service.md#c50) · [Contents](../DECK-DESIGN.md#contents)

[Contents](../DECK-DESIGN.md#contents) · [The service →](02-service.md#c50)
