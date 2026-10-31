# The deck, with the mechanics: Cabinet

[← Politics](05-politics.md#c160) · [Contents](../DECK-DESIGN.md#contents) · [The batchmate →](07-batchmate.md#c208)

## <a id="stage-cabinet"></a>Cabinet

Minister of State to Prime Minister. Cards 190 to 207.

### <a id="c190"></a>190. The National Bonus

[← 189](05-politics.md#c189) · [Next → 191](#c191) · [Contents](../DECK-DESIGN.md#contents)

`the_bonus_reveal` · events.json · once a career · weight 10 · priority: drawn the moment it qualifies

**Who sees it:** Minister of State and up.

**Series** `indicators` with [#194](#c194), [#195](#c195), [#196](#c196): shown in full twice a career (the second time asking whether to keep the habit), then its years pass by themselves on the habit; this card opens it.

As a minister, you are paid a National Bonus: three months' extra salary if the country hits four targets, up to six if it beats them, nothing if it misses. The four are jobs, GDP growth, typical incomes, and the incomes of the lowest-paid fifth of workers. Your ministry has money for one of two policies: one lifts the lowest incomes, the other lifts GDP.

**A. Fund the policy that lifts the lowest incomes.**

> It is expensive, unglamorous and slow, and it works: the lowest incomes rise. Your bonus rises too, but no one talks about it.

- Hidden: Standing down (−5), Reputation up a lot (+10), Integrity up a lot (+12), wealth +$180,000.
- Habit: `lowest`.

**B. Fund the policy that lifts GDP.**

> GDP moves first and fastest, and your bonus comes in at six months, the most it can be. There is an annex on who gained. You skip the annex.

- Hidden: Standing up a lot (+8), Reputation up (+3), Integrity down a lot (−6), wealth +$260,000.
- Habit: `headline`.
- Sets next year's National Bonus at 6 months.

**C. Ask the other ministers whether any of you should be paid on targets you can move.**

> You ask at the ministers' weekly meeting. The room hears the question in complete silence. It is minuted, and answered at great length without being answered at all. From then on your colleagues choose their words around you.

- Hidden: Standing down a lot (−14), Reputation up a lot (+12), Integrity up a lot (+18), Heat up a lot (+8).
- Habit: `steady`.
- ↳ Can lead to: [191. Terms of Reference](#c191), in three years, 45% · [Everything Surfaced](09-endings.md#end-scandal)

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The civil servants who work with you (politics, `officials`), 35%: A helps (+2) · B hurts (−1) · C helps (+1).
- Your fellow Members of Parliament (politics, `fellowMPs`), 45%: B helps (+1) · C hurts (−3).

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2*

The Public Service Division sends you a three-page note on your pay as a minister. Page two explains the National Bonus: three months' extra salary if the country hits four targets for jobs, growth and incomes, one of them the incomes of the lowest-paid fifth of workers, up to six if it beats them, nothing if it misses. Page three lists two policies your ministry could fund: one lifts the lowest incomes, the other lifts GDP. There is money for one.

**A. Fund the policy for the lowest incomes.**

> It is slow, costly and unglamorous, and it works: the lowest incomes rise, and with them your bonus. Nobody, at any point, mentions page two.

**B. Fund the policy for GDP.**

> Quicker and cleaner, and it moves the figure everyone watches. Your bonus comes in at six months, the most it can be. The annex on who gained is on page nine, and you stop reading at page eight.

**C. Ask the other ministers whether any of you should be paid on targets you can move.**

> The question is heard in complete stillness, and minuted. It is answered at length without being answered at all. Colleagues now choose their words near you, and the minute is filed where it can be found.

---

*Version 3*

Your ministry's chief economist explains the National Bonus on a whiteboard: three months' extra salary when the country hits four targets for jobs, growth and incomes, up to six when it beats them. The explanation is brisk until it reaches the line saying the bonus is paid to ministers, including you. Then it slows down. One policy on your desk lifts the lowest incomes, another lifts GDP, and there is money for one.

**A. Choose the policy that lifts the lowest incomes.**

> It is expensive and slow, and in two years it works: the lowest incomes rise, and so does your bonus. The economist wipes the whiteboard, your pay included, before anyone can photograph it.

**B. Choose the policy that lifts headline GDP.**

> The headline figure moves first and fastest. Your National Bonus comes in at six months, the most the formula allows. The economist's slide on who gained is moved to the appendix.

**C. Ask the other ministers whether this is how any of you should be paid.**

> The ministers' weekly meeting hears the question in silence and minutes it with care. It is answered fully, and not at all. People adjust how they speak near you, and the minute stays in the file.

</details>

[← 189](05-politics.md#c189) · [Next → 191](#c191) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c191"></a>191. Terms of Reference

[← 190](#c190) · [Next → 192](#c192) · [Contents](../DECK-DESIGN.md#contents)

`bonus_vindicated` · events.json

**Who sees it:** only as a follow-up to [190. The National Bonus](#c190) (C: in three years, 45%).

**Shares a decision** (`own_up`) with [#52](01-first-years.md#c52), [#83](02-service.md#c83), [#123](02-service.md#c123), [#34](01-first-years.md#c34): a career sees only one.

Some years ago you asked the other ministers whether ministers should be paid on targets they can move themselves. Now a committee has been appointed to review political salaries, and your question appears, unattributed, as item three of its terms of reference. The committee is inviting submissions.

**A. Make a submission under your own name.**

> The committee thanks you for your submission. Its report adjusts the formula by one percentage point, which it describes as significant. Your name is in the annex, where colleagues will find it.

- Hidden: Standing down a lot (−6), Reputation up a lot (+10), Integrity up a lot (+10).

**B. Let item three do the work.**

> Item three does very little work on its own. But you were seen not to make a fuss, and among colleagues that counts for something.

- Hidden: Standing up a lot (+8), Integrity up a little (+2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your fellow Members of Parliament (politics, `fellowMPs`), 45%: A hurts (−3) · B helps (+2).
- The press gallery (politics, `pressGallery`), 35%: A helps (+2) · B hurts (−1).

[← 190](#c190) · [Next → 192](#c192) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c192"></a>192. The Correction Direction

[← 191](#c191) · [Next → 193](#c193) · [Contents](../DECK-DESIGN.md#contents)

`pofma_moment` · events.json · once a career · weight 9

**Who sees it:** Minister of State and up.

**Shares a decision** (`viral_post`) with [#181](05-politics.md#c181), [#179](05-politics.md#c179): a career sees only one.

A post about your ministry's scheme is going viral. It is wrong in two places and, awkwardly, right in the third. Under POFMA, the law against online falsehoods, you can direct whoever posted it to attach a correction notice, fixing the two wrong points in public and saying nothing about the third. Or you can answer the post yourself, and admit the point it got right.

**A. Issue the correction direction.**

> The correction notice appears. It is factually unimpeachable and fixes two of the three points. The third keeps circulating, now with a grievance attached: the government corrected everything except the part that was true.

- Hidden: Standing up a lot (+8), Reputation down a lot (−6), Integrity down (−5).

**B. Answer the third point publicly instead.**

> At 11pm you concede the point in a Facebook post, in your own words. It is shared more than anything your ministry has ever published, half the time by people who dislike you. You are now on record as having admitted it.

- Hidden: Competence up (+5), Standing down a lot (−8), Reputation up a lot (+10), Integrity up a lot (+12).
- ↳ Can lead to: [193. The Third Point](#c193), in two years, 50%

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The press gallery (politics, `pressGallery`), 45%: A hurts (−3) · B helps (+3).
- The party's leadership and the Prime Minister's office (politics, `leadership`), 40%: A helps (+2) · B hurts (−2).

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2*

A thread on HardwareZone, the online forum, about your ministry's scheme is on its fortieth page. The first post, which everyone quotes, is wrong about the eligibility age and the payout, and right about the waiting time. Under POFMA, the law against online falsehoods, you can direct the forum to pin a correction notice above it, fixing the two errors and leaving the waiting time standing. Or you can reply yourself.

**A. Issue the correction direction.**

> A correction notice is pinned above the first post, fixing the age and the payout. Page forty-one is about the waiting time. Nobody corrected that, because it was right, and the thread has noticed.

**B. Reply in the thread, and concede the waiting time.**

> You reply under your own name: two corrections and one concession. The thread is polite for nearly a page, then returns to the waiting time, now quoting you as the office holder who admitted it.

---

*Version 3*

A retired officer from your ministry has posted a long critique of its scheme, with three diagrams. Two are wrong. The third is right, to the decimal, redrawn from memory from an internal paper the officer once worked on. Under POFMA, the law against online falsehoods, you can direct the officer to attach a correction notice that fixes the two wrong ones and says nothing about the third.

**A. Issue the correction direction.**

> The correction notice runs above the post and fixes two diagrams. The third stays up, uncorrected, and becomes the most widely shared chart your ministry has ever produced.

**B. Post the third diagram yourself, and admit what it shows.**

> You post the third diagram again, with the real numbers and a sentence admitting the problem. The retired officer shares it with one word, "Better." Your officials do not share it.

</details>

[← 191](#c191) · [Next → 193](#c193) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c193"></a>193. The Third Point

[← 192](#c192) · [Next → 194](#c194) · [Contents](../DECK-DESIGN.md#contents)

`pofma_vindicated` · events.json

**Who sees it:** only as a follow-up to [192. The Correction Direction](#c192) (B: in two years, 50%).

**Shares a decision** (`share_credit`) with [#112](02-service.md#c112), [#63](01-first-years.md#c63): a career sees only one.

Some time ago, a viral post about your ministry's scheme got two points wrong and one right, and you publicly admitted the one it got right. Now the scheme has been quietly amended to fix exactly that. Rajesh Nair, a correspondent at the paper, has noticed that you were the only office holder who admitted it, and asks about it on the record.

**A. Take the question on the record.**

> The piece runs on a Sunday, headlined "Ms Lim candid on scheme flaw". Candid is a word your press secretary asks you never to be again.

- Hidden: Standing up a lot (+6), Reputation up a lot (+10).

**B. Credit the post's author.**

> The post's author is astonished, then gracious, then a reliable critic of yours for the rest of your career. You decide to take that as a compliment.

- Hidden: Standing down a little (−2), Reputation up a lot (+6), Integrity up a lot (+10).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The press gallery (politics, `pressGallery`), 45%: A helps (+2) · B hurts (−1).
- The party's leadership and the Prime Minister's office (politics, `leadership`), 35%: A hurts (−2) · B helps (+1).

[← 192](#c192) · [Next → 194](#c194) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c194"></a>194. The National Bonus

[← 193](#c193) · [Next → 195](#c195) · [Contents](../DECK-DESIGN.md#contents)

`the_indicators` · events.json · can come back · weight 16 · starts the `budget` clock

**Who sees it:** Minister of State and up; only in a strong economy; not when a general election is due within the year; one card on the `budget` clock every three years.

**Series** `indicators` with [#190](#c190), [#195](#c195), [#196](#c196): shown in full twice a career (the second time asking whether to keep the habit), then its years pass by themselves on the habit.

**The second showing** (folded below): keeping the habit adds Competence up a little (+2), Reputation down a little (−2); breaking it adds Standing down (−3), Reputation up a little (+2).

Growth is strong, and your ministry must settle its plan for the next three Budgets. The plan moves the national targets your National Bonus is paid on, and you can push one of them, not all.

**A. Push headline GDP.**

> Growth comes in above forecast, and your National Bonus is five months. The lowest incomes rise too, slightly, the way a small boat rises when a larger one goes past.
>
> *If the plan misses:* Growth comes in a little under forecast, which in a strong year is noticed, and your National Bonus drops to two months. The commentary uses the word "moderate" four times.

- Hidden: Standing up (+3), Integrity down (−4).
- Habit: `headline`.
- Sets next year's National Bonus at 5 months; 25% chance the plan misses, and it is 2.

**B. Push the incomes of the lowest-paid.**

> The lowest incomes grow faster than the median, which has not happened in six years, and your bonus is four months. The chart goes into the Budget speech, in colour.
>
> *If the plan misses:* The lowest-incomes figure misses its target by a tenth of a point, and the formula pays no National Bonus at all. Your officials' chart of it is still a good chart.

- Hidden: Standing down a little (−2), Reputation up (+4), Integrity up (+3).
- Habit: `lowest`.
- Sets next year's National Bonus at 4 months; 30% chance the plan misses, and it is 0.

**C. Bank the targets. Change nothing that is working.**

> Every target is met to the decimal place, which pays the standard three months. Nothing is announced, because nothing has changed, and other ministries copy the plan.

- Hidden: Competence up (+4), Standing up a little (+1).
- Habit: `steady`.
- Sets next year's National Bonus at 3 months.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The party's leadership and the Prime Minister's office (politics, `leadership`), 35%: A helps (+2) · B hurts (−2).
- The civil servants who work with you (politics, `officials`), 35%: A hurts (−1) · B hurts (−1) · C helps (+2).

<details><summary>When it comes back (3 scenes)</summary>

The series' second full showing, written per habit: the habit is the first choice, and the answer stands for the rest of the career.

---

*If your habit so far is “Push headline GDP.” (`headline`):*

**The National Bonus, Again**

Growth is strong, and the next three Budgets need a plan. Last time you funded the policy that lifts GDP, and your officials have redrafted it with the dates changed in pen. Whatever you sign now becomes the ministry's standing plan, rolled over every Budget from here on, in good years and bad, without coming back to you.

**A. Sign it as it is.**

> Signed in pen, beside the old dates. Growth comes in above forecast again, your bonus is five months, and the plan will now renew itself. Nobody asks what else it could have been.
>
> *If the plan misses:* Growth comes in a little under forecast, which in a strong year is noticed, and your National Bonus drops to two months. The commentary uses the word "moderate" four times.

- Hidden: Competence up a little (+2), Standing up (+3), Reputation down a little (−2), Integrity down (−4).
- Habit: `headline`.
- Sets next year's National Bonus at 5 months; 25% chance the plan misses, and it is 2.

**B. Cross it out. Put the lowest incomes first.**

> Your officials redraft the whole plan in a fortnight, and Finance asks in writing why a working plan has changed. The lowest incomes outgrow the median by spring, and this is now the standing plan.
>
> *If the plan misses:* The lowest-incomes figure misses its target by a tenth of a point, and the formula pays no National Bonus at all. Your officials' chart of it is still a good chart.

- Hidden: Standing down (−5), Reputation up a lot (+6), Integrity up (+3).
- Habit: `lowest`.
- Sets next year's National Bonus at 4 months; 30% chance the plan misses, and it is 0.

**C. Cross it out. Bank the targets instead.**

> The new plan is the old one with its ambitions removed, and Finance minutes it as a "recalibration". The targets are met exactly, for the standard three months, and from now on the plan renews itself.

- Hidden: Competence up (+4), Standing down a little (−2), Reputation up a little (+2).
- Habit: `steady`.
- Sets next year's National Bonus at 3 months.

---

*If your habit so far is “Push the incomes of the lowest-paid.” (`lowest`):*

**The National Bonus, Again**

Growth is strong, and the next three Budgets need a plan. Last time you funded the policy that lifts the lowest incomes, and a chart of their rise now hangs in the ministry lobby, framed. Your officials' draft keeps it climbing. Whatever you sign now becomes the standing plan, rolled over every Budget from here on, without being put to you again.

**A. Sign it. Keep the chart climbing.**

> Signed without a meeting. The lowest incomes outgrow the median for another cycle, your bonus is four months, and the plan will now roll on by itself. The lobby chart is replaced by a larger one.
>
> *If the plan misses:* The lowest-incomes figure misses its target by a tenth of a point, and the formula pays no National Bonus at all. Your officials' chart of it is still a good chart.

- Hidden: Competence up a little (+2), Standing down a little (−2), Reputation up a little (+2), Integrity up (+3).
- Habit: `lowest`.
- Sets next year's National Bonus at 4 months; 30% chance the plan misses, and it is 0.

**B. Take the chart down. Push headline GDP this time.**

> The chart comes down on a Saturday, so nobody sees it go. Growth comes in above forecast, and growth-first is now the standing plan. The officials who drew the chart ask, in a long email, what it was for.
>
> *If the plan misses:* Growth comes in a little under forecast, which in a strong year is noticed, and your National Bonus drops to two months. The commentary uses the word "moderate" four times.

- Hidden: Reputation up a little (+2), Integrity down (−4).
- Habit: `headline`.
- Sets next year's National Bonus at 5 months; 25% chance the plan misses, and it is 2.

**C. Bank the targets. Let the chart level off.**

> The new plan meets its targets and moves nothing, and it is now the plan for good. The chart levels off and comes down, the lobby gets a potted plant, and Finance writes to say it liked the chart.

- Hidden: Competence up (+4), Standing down a little (−2), Reputation up a little (+2).
- Habit: `steady`.
- Sets next year's National Bonus at 3 months.

---

*If your habit so far is “Bank the targets. Change nothing that is working.” (`steady`):*

**The National Bonus, Again**

Growth is strong, and the next three Budgets need a plan. Last time you asked the other ministers whether ministers should be paid on targets they can move, and funded neither policy. Your ministry's plan has moved none of the targets since, and your officials have drafted it again. Whatever you sign now becomes the standing plan, rolled over every Budget without coming back to you.

**A. Let it renew.**

> It renews, and will keep renewing. The targets are met to the decimal, for the standard three months, and the plan is cited in a training course as an example of what a plan should be. It is cited nowhere else.

- Hidden: Competence up a lot (+6), Standing up a little (+1), Reputation down a little (−2).
- Habit: `steady`.
- Sets next year's National Bonus at 3 months.

**B. Change it. Push headline GDP while the going is good.**

> Growth comes in above forecast, your bonus is five months, and growth-first is now the standing plan. Your question is still in Cabinet's minutes. Nobody brings it up.
>
> *If the plan misses:* Growth comes in a little under forecast, which in a strong year is noticed, and your National Bonus drops to two months. The commentary uses the word "moderate" four times.

- Hidden: Reputation up a little (+2), Integrity down (−4).
- Habit: `headline`.
- Sets next year's National Bonus at 5 months; 25% chance the plan misses, and it is 2.

**C. Change it. Put the lowest incomes first.**

> The lowest incomes outgrow the median by the next survey, and that is the standing plan from now on. Your bonus rises with them. You do not ask about it a second time.
>
> *If the plan misses:* The lowest-incomes figure misses its target by a tenth of a point, and the formula pays no National Bonus at all. Your officials' chart of it is still a good chart.

- Hidden: Standing down (−5), Reputation up a lot (+6), Integrity up (+3).
- Habit: `lowest`.
- Sets next year's National Bonus at 4 months; 30% chance the plan misses, and it is 0.

</details>

<details><summary>Meanwhile lines (15)</summary>

A year that passes by itself on the habit shows one line, never the same one twice in a career.

**Habit A, `headline`**

- Growth is strong, and your ministry rolls its growth-first plan into three more Budgets without asking you, as agreed.
- Your officials renew the growth-first plan on their own, exactly as you told them to.
- Two more plants are brought forward under your growth-first plan, announced in a press release copied from the last one.
- In a strong year your standing plan pushes headline growth again, and the quarterly slide keeps its arrow pointing up.
- The growth-first plan renews itself for three more Budgets, and the only edit anyone makes is to the year.

**Habit B, `lowest`**

- Your plan for the lowest incomes rolls into three more Budgets, and its chart gets new numbers.
- Wage support for the lowest-paid is renewed without a meeting, the surest sign that it is policy now.
- Finance's yearly letter asking whether the support for the lowest-paid is temporary arrives on schedule, and gets a template reply.
- Your standing plan puts the lowest incomes first again, and your economists print the chart on A3, out of habit.
- Another ministry adopts your plan for the lowest incomes, and sends a thank-you note with its own logo on it.

**Habit C, `steady`**

- The safe plan rolls into three more Budgets, and nobody in the ministry remembers a time before it.
- The plan that changes nothing is renewed, unchanged, as intended.
- Growth is strong and your standing plan stays steady: the targets are tracked to the decimal and nothing is announced.
- Your officials renew the steady plan, and a training course adds it to its slide titled "Good Practice".
- The steady plan renews itself for three more Budgets, and its only new feature is a page number.

</details>

[← 193](#c193) · [Next → 195](#c195) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c195"></a>195. The National Bonus, in a Downturn

[← 194](#c194) · [Next → 196](#c196) · [Contents](../DECK-DESIGN.md#contents)

`the_indicators_downturn` · events.json · can come back · weight 16 · starts the `budget` clock

**Who sees it:** Minister of State and up; only in a downturn; not when a general election is due within the year; one card on the `budget` clock every three years.

**Series** `indicators` with [#190](#c190), [#194](#c194), [#196](#c196): shown in full twice a career (the second time asking whether to keep the habit), then its years pass by themselves on the habit.

**The second showing** (folded below): keeping the habit adds Competence up a little (+2), Reputation down a little (−2); breaking it adds Standing down (−3), Reputation up a little (+2).

Exports are down for a third quarter and "retrenchment" is back in the papers. Your ministry must settle its plan for the next three Budgets now, and in a downturn the country will miss at least one of the targets your National Bonus is paid on. You choose what to protect.

**A. Protect jobs first.**

> Unemployment holds, growth does not, and your bonus is two months. A great many people keep jobs they will never know were on a list.
>
> *If the plan misses:* Unemployment rises anyway, by less than it would have. The indicator does not record the difference, and the formula pays no National Bonus.

- Hidden: Competence up (+3), Standing down a little (−1), Reputation up (+3), Integrity up a little (+2).
- Habit: `steady`.
- Sets next year's National Bonus at 2 months; 20% chance the plan misses, and it is 0.

**B. Push growth through it.**

> Growth recovers ahead of the region and your bonus is four months. The speech about resilience writes itself. The jobs do come back, in time, in other industries, for other people.
>
> *If the plan misses:* The push does not take. Growth stays flat, the lowest incomes fall, and there is no National Bonus. Nobody calls it a gamble, because it was a plan.

- Hidden: Standing up (+4), Integrity down (−3).
- Habit: `headline`.
- Sets next year's National Bonus at 4 months; 50% chance the plan misses, and it is 0.

**C. Cushion the lowest incomes.**

> The lowest incomes hold steady through the downturn, and your bonus is one month. Rent is paid on time in a great many flats. Nobody reports on rent paid on time.
>
> *If the plan misses:* The cushion holds the lowest incomes steady. The indicator only counts growing, not holding steady, so the formula pays no National Bonus.

- Hidden: Standing down a little (−2), Reputation up (+5), Integrity up (+4).
- Habit: `lowest`.
- Sets next year's National Bonus at 1 months; 30% chance the plan misses, and it is 0.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The party's leadership and the Prime Minister's office (politics, `leadership`), 35%: B helps (+2) · C hurts (−2).
- Your party branch and its volunteers (politics, `branch`), 35%: A helps (+1) · B hurts (−2) · C helps (+1).

<details><summary>When it comes back (3 scenes)</summary>

The series' second full showing, written per habit: the habit is the first choice, and the answer stands for the rest of the career.

---

*If your habit so far is “Protect jobs first.” (`steady`):*

**The National Bonus, Again, in a Downturn**

The economy has turned down, and the next three Budgets need a plan. Last time you asked the other ministers whether ministers should be paid on targets they can move, and funded neither policy. So your officials' draft chases no target: it only holds on to jobs, under a cover that says "For signature", not "For decision". Whatever you sign now becomes the standing plan.

**A. Sign it. Jobs first.**

> Unemployment holds through the downturn, your bonus is two months, and jobs-first is now the plan for good. The cover is changed to "For information".
>
> *If the plan misses:* Unemployment rises anyway, by less than it would have. The indicator does not record the difference, and the formula pays no National Bonus.

- Hidden: Competence up (+5), Standing down a little (−1), Reputation up a little (+1), Integrity up a little (+2).
- Habit: `steady`.
- Sets next year's National Bonus at 2 months; 20% chance the plan misses, and it is 0.

**B. Write "For decision" on it. Push growth through.**

> Projects are brought forward, growth recovers ahead of the region, and growth-first is the standing plan from now on. Your officials, who had expected a signature, spend March rebuilding the plan around cranes.
>
> *If the plan misses:* The push does not take. Growth stays flat, the lowest incomes fall, and there is no National Bonus. Nobody calls it a gamble, because it was a plan.

- Hidden: Standing up a little (+1), Reputation up a little (+2), Integrity down (−3).
- Habit: `headline`.
- Sets next year's National Bonus at 4 months; 50% chance the plan misses, and it is 0.

**C. Write "For decision" on it. Cushion the lowest incomes.**

> The cash for the lowest incomes goes out in spring, rent is paid on time in a great many flats, and this is now the standing plan. Finance asks, twice, why the plan changed.
>
> *If the plan misses:* The cushion holds the lowest incomes steady. The indicator only counts growing, not holding steady, so the formula pays no National Bonus.

- Hidden: Standing down (−5), Reputation up a lot (+7), Integrity up (+4).
- Habit: `lowest`.
- Sets next year's National Bonus at 1 months; 30% chance the plan misses, and it is 0.

---

*If your habit so far is “Push growth through it.” (`headline`):*

**The National Bonus, Again, in a Downturn**

Exports have turned down, and the next three Budgets need a plan. Last time you funded the GDP policy, and your ministry now has a growth unit, with a logo. Its draft pushes growth through the downturn. Whatever you sign now becomes the standing plan, rolled over every Budget from here on, without coming back to you. The unit would like to continue existing.

**A. Sign it. The unit knows what it is doing.**

> Growth recovers ahead of the region again, your bonus is four months, and the plan will now renew itself. The unit's logo goes on the Budget slide, and the unit goes on existing.
>
> *If the plan misses:* The push does not take. Growth stays flat, the lowest incomes fall, and there is no National Bonus. Nobody calls it a gamble, because it was a plan.

- Hidden: Competence up a little (+2), Standing up (+4), Reputation down a little (−2), Integrity down (−3).
- Habit: `headline`.
- Sets next year's National Bonus at 4 months; 50% chance the plan misses, and it is 0.

**B. Overrule the unit. Protect jobs first.**

> Unemployment holds and growth does not, and jobs-first is now the standing plan. The growth unit is renamed the Resilience Unit, in a memo that takes eleven drafts, and nobody in it is retrenched.
>
> *If the plan misses:* Unemployment rises anyway, by less than it would have. The indicator does not record the difference, and the formula pays no National Bonus.

- Hidden: Competence up (+3), Standing down (−4), Reputation up (+5), Integrity up a little (+2).
- Habit: `steady`.
- Sets next year's National Bonus at 2 months; 20% chance the plan misses, and it is 0.

**C. Turn the unit to the lowest incomes.**

> The growth unit spends the downturn delivering cash to the lowest incomes, efficiently and with visible reluctance. Rent is paid on time in a great many flats, and this is the standing plan now.
>
> *If the plan misses:* The cushion holds the lowest incomes steady. The indicator only counts growing, not holding steady, so the formula pays no National Bonus.

- Hidden: Standing down (−5), Reputation up a lot (+7), Integrity up (+4).
- Habit: `lowest`.
- Sets next year's National Bonus at 1 months; 30% chance the plan misses, and it is 0.

---

*If your habit so far is “Cushion the lowest incomes.” (`lowest`):*

**The National Bonus, Again, in a Downturn**

The downturn is official, and the next three Budgets need a plan. Last time you funded the policy for the lowest incomes, and the payment system built for it is still running, idle, at some expense. Your officials' draft switches it back on. Whatever you sign now becomes the standing plan, rolled over every Budget from here on, without coming back to you.

**A. Sign it. Switch it back on.**

> The cash goes out within a week, because the system remembered how. The lowest incomes hold steady, your bonus is one month, and nobody writes about a system that worked twice.
>
> *If the plan misses:* The cushion holds the lowest incomes steady. The indicator only counts growing, not holding steady, so the formula pays no National Bonus.

- Hidden: Competence up a little (+2), Standing down a little (−2), Reputation up (+3), Integrity up (+4).
- Habit: `lowest`.
- Sets next year's National Bonus at 1 months; 30% chance the plan misses, and it is 0.

**B. Repurpose it for wage support, to keep people in work.**

> The system is repurposed for wage support, which takes four months and a new acronym. Unemployment holds, jobs-first is now the standing plan, and the vendor bills for the acronym.
>
> *If the plan misses:* Unemployment rises anyway, by less than it would have. The indicator does not record the difference, and the formula pays no National Bonus.

- Hidden: Competence up (+3), Standing down (−4), Reputation up (+5), Integrity up a little (+2).
- Habit: `steady`.
- Sets next year's National Bonus at 2 months; 20% chance the plan misses, and it is 0.

**C. Switch it off. Push growth through.**

> Projects are brought forward, growth recovers ahead of the region, and growth-first is the plan from now on. The idle payment system is switched off, and its vendor invoices, politely, for that too.
>
> *If the plan misses:* The push does not take. Growth stays flat, the lowest incomes fall, and there is no National Bonus. Nobody calls it a gamble, because it was a plan.

- Hidden: Standing up a little (+1), Reputation up a little (+2), Integrity down (−3).
- Habit: `headline`.
- Sets next year's National Bonus at 4 months; 50% chance the plan misses, and it is 0.

</details>

<details><summary>Meanwhile lines (12)</summary>

A year that passes by itself on the habit shows one line, never the same one twice in a career.

**Habit A, `steady`**

- A downturn, and your standing jobs-first plan comes out of a folder labelled "Downturn" that nobody has to look for.
- Wage support for jobs is renewed for three more Budgets, and firms fill in the same forms, in triplicate, again.
- Retrenchment is back in the papers, and your ministry's jobs scheme is back in the Budget, unchanged.
- The downturn plan keeps jobs first, announced in last cycle's press release with the year changed.

**Habit B, `headline`**

- In a downturn your standing plan pushes growth through it again, and the cranes go up in the west on schedule.
- Your growth-first plan is rolled over into the downturn, with a new cover that says "Resilience".
- Projects are brought forward again, from a list that has not changed since the last downturn.
- Exports fall and your ministry pushes growth anyway, as the standing plan says, with a speech about resilience.

**Habit C, `lowest`**

- The cash for the lowest incomes goes out again within a week of the Budget, as your standing plan says.
- Your standing plan cushions the lowest incomes through another downturn, and again nobody reports on rent paid on time.
- The plan for the lowest incomes is renewed through the downturn, and Finance asks once, out of habit, whether it is temporary.
- The downturn cash goes out in March under your standing plan, and is spent on rent, school shoes and hawker food.

</details>

[← 194](#c194) · [Next → 196](#c196) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c196"></a>196. The National Bonus, Before an Election

[← 195](#c195) · [Next → 197](#c197) · [Contents](../DECK-DESIGN.md#contents)

`the_indicators_election` · events.json · can come back · weight 16 · starts the `budget` clock

**Who sees it:** Minister of State and up; only when a general election is due within the year; one card on the `budget` clock every three years.

**Series** `indicators` with [#190](#c190), [#194](#c194), [#195](#c195): shown in full twice a career (the second time asking whether to keep the habit), then its years pass by themselves on the habit.

**The second showing** (folded below): keeping the habit adds Competence up a little (+2), Reputation down a little (−2); breaking it adds Standing down (−3), Reputation up a little (+2).

A general election is due within the year, and your ministry must settle its plan for the next three Budgets before Nomination Day, when the candidates file their papers. The plan moves your National Bonus. The chairman of your party branch, which runs the party's volunteers in your ward, has sent, unasked, a list of what the ward would like announced.

**A. Spread the gains widely before polling day.**

> The measures land in time and are felt in every block, and your bonus is three months. Your branch chairman reads them out at the community club dinner, from a printout, with feeling.
>
> *If the plan misses:* The measures land after the indicators are measured, so your bonus is one month. Residents like the measures anyway; the indicators were not voting.

- Hidden: Competence down a little (−1), Reputation up a lot (+6), Integrity down (−3).
- Habit: `headline`.
- Sets next year's National Bonus at 3 months; 30% chance the plan misses, and it is 1.

**B. Hold the line on the targets.**

> The targets are met and your bonus is four months. Your branch chairman asks, politely, whether anything at all could be announced, and is sent the targets.
>
> *If the plan misses:* The targets are nearly met, for a bonus of two months, and the campaign is a little quieter than your branch would like.

- Hidden: Competence up (+3), Standing up (+3), Reputation down (−3).
- Habit: `steady`.
- Sets next year's National Bonus at 4 months; 20% chance the plan misses, and it is 2.

**C. Push the incomes of the lowest-paid.**

> The lowest incomes outgrow the median, and your bonus is three months. The chart is on a campaign flyer by Friday, cropped so the axis starts somewhere encouraging.
>
> *If the plan misses:* The lowest-incomes figure misses its target by a tenth of a point, and the formula pays no National Bonus. In an election year, a tenth of a point gets a press conference.

- Hidden: Standing down a little (−2), Reputation up (+3), Integrity up (+3).
- Habit: `lowest`.
- Sets next year's National Bonus at 3 months; 35% chance the plan misses, and it is 0.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your party branch and its volunteers (politics, `branch`), 50%: A helps (+3) · B hurts (−3).
- The press gallery (politics, `pressGallery`), 35%: A hurts (−2) · B helps (+1) · C helps (+1).

<details><summary>When it comes back (3 scenes)</summary>

The series' second full showing, written per habit: the habit is the first choice, and the answer stands for the rest of the career.

---

*If your habit so far is “Spread the gains widely before polling day.” (`headline`):*

**The National Bonus, Again, Before an Election**

A general election is due, and the next three Budgets need a plan. Last time you put your ministry's money behind GDP, and your party branch, the volunteers who run your campaign, has reprinted the flyer that boasted about the growth. Your officials' draft matches the flyer, with measures every block will feel before polling day. Whatever you sign now becomes the standing plan.

**A. Run it as written.**

> The measures land before polling day, in every block, with the flyer, and this is now the standing plan. At a walkabout a resident says it is the same flyer as last time, and she is right.
>
> *If the plan misses:* The measures land after the indicators are measured, so your bonus is one month. Residents like the measures anyway; the indicators were not voting.

- Hidden: Competence up a little (+1), Reputation up (+4), Integrity down (−3).
- Habit: `headline`.
- Sets next year's National Bonus at 3 months; 30% chance the plan misses, and it is 1.

**B. Pull the flyer. Hold the line on the targets.**

> The targets are met, the flyers are pulped, and the safe plan is the standing plan from now on. Your branch chairman asks, twice, whether the change could have waited until after polling day.
>
> *If the plan misses:* The targets are nearly met, for a bonus of two months, and the campaign is a little quieter than your branch would like.

- Hidden: Competence up (+3), Reputation down a little (−1).
- Habit: `steady`.
- Sets next year's National Bonus at 4 months; 20% chance the plan misses, and it is 2.

**C. Pull the flyer. Put the lowest incomes first.**

> Support for the lowest incomes lands before polling day, a new flyer is printed with a new chart, and that is the plan from now on. The old flyers are used, unofficially, to wrap cakes at the community club.
>
> *If the plan misses:* The lowest-incomes figure misses its target by a tenth of a point, and the formula pays no National Bonus. In an election year, a tenth of a point gets a press conference.

- Hidden: Standing down (−5), Reputation up (+5), Integrity up (+3).
- Habit: `lowest`.
- Sets next year's National Bonus at 3 months; 35% chance the plan misses, and it is 0.

---

*If your habit so far is “Hold the line on the targets.” (`steady`):*

**The National Bonus, Again, Before an Election**

An election is due, and the next three Budgets need a plan. Last time you asked the other ministers whether ministers should be paid on targets they can move. Your officials' plan moves no target, and its annex on timing is blank. Your party branch, the volunteers who run your campaign, asks by voice note what is in it for the ward. Whatever you sign now becomes the standing plan.

**A. Sign it, blank annex and all.**

> The targets are met, your bonus is four months, and the plan will now renew itself. The branch sends a second voice note, mostly a sigh, and the campaign leads on lift upgrading instead.
>
> *If the plan misses:* The targets are nearly met, for a bonus of two months, and the campaign is a little quieter than your branch would like.

- Hidden: Competence up (+5), Standing up (+3), Reputation down (−5).
- Habit: `steady`.
- Sets next year's National Bonus at 4 months; 20% chance the plan misses, and it is 2.

**B. Fill the annex. Bring the visible measures forward.**

> The measures land before polling day, and visible measures first is the standing plan now. Your officials redo the annex over a weekend, and Finance asks why a plan that met its targets needs a timing annex at all.
>
> *If the plan misses:* The measures land after the indicators are measured, so your bonus is one month. Residents like the measures anyway; the indicators were not voting.

- Hidden: Competence down a little (−1), Standing down (−3), Reputation up a lot (+8), Integrity down (−3).
- Habit: `headline`.
- Sets next year's National Bonus at 3 months; 30% chance the plan misses, and it is 1.

**C. Fill the annex. The lowest incomes, before polling day.**

> Support for the lowest incomes lands before polling day, and that is the standing plan now. The branch sends a thumbs-up, the first in years, and asks for a chart of it in three more languages.
>
> *If the plan misses:* The lowest-incomes figure misses its target by a tenth of a point, and the formula pays no National Bonus. In an election year, a tenth of a point gets a press conference.

- Hidden: Standing down (−5), Reputation up (+5), Integrity up (+3).
- Habit: `lowest`.
- Sets next year's National Bonus at 3 months; 35% chance the plan misses, and it is 0.

---

*If your habit so far is “Push the incomes of the lowest-paid.” (`lowest`):*

**The National Bonus, Again, Before an Election**

Polling day is within the year, and the next three Budgets need a plan. Last time you put your ministry's money behind the lowest incomes, and they rose. Your party branch, the volunteers who run your campaign, wants a chart of the rise on its flyer. Your officials' draft carries the same policy on, under a covering note that calls it "settled policy". Whatever you sign now becomes the standing plan.

**A. Leave it settled.**

> The lowest incomes outgrow the median again, your bonus is three months, and the plan now renews itself. The chart goes on the flyer. The residents on the chart did not need the flyer to tell them.
>
> *If the plan misses:* The lowest-incomes figure misses its target by a tenth of a point, and the formula pays no National Bonus. In an election year, a tenth of a point gets a press conference.

- Hidden: Competence up a little (+2), Standing down a little (−2), Reputation up a little (+1), Integrity up (+3).
- Habit: `lowest`.
- Sets next year's National Bonus at 3 months; 35% chance the plan misses, and it is 0.

**B. Unsettle it. Spread the gains wider before polling day.**

> The measures reach every block in time, and visible measures first is the standing plan from now on. Your officials refile the "settled policy" note under a heading that no longer applies.
>
> *If the plan misses:* The measures land after the indicators are measured, so your bonus is one month. Residents like the measures anyway; the indicators were not voting.

- Hidden: Competence down a little (−1), Standing down (−3), Reputation up a lot (+8), Integrity down (−3).
- Habit: `headline`.
- Sets next year's National Bonus at 3 months; 30% chance the plan misses, and it is 1.

**C. Unsettle it. Hold the line on the targets.**

> The targets are met, the flyer has nothing new on it, and the safe plan is the standing plan from now on. Your branch chairman reads the covering note aloud at a meeting, slowly, as evidence.
>
> *If the plan misses:* The targets are nearly met, for a bonus of two months, and the campaign is a little quieter than your branch would like.

- Hidden: Competence up (+3), Reputation down a little (−1).
- Habit: `steady`.
- Sets next year's National Bonus at 4 months; 20% chance the plan misses, and it is 2.

</details>

<details><summary>Meanwhile lines (12)</summary>

A year that passes by itself on the habit shows one line, never the same one twice in a career.

**Habit A, `headline`**

- An election is due, and your standing plan brings the visible measures forward again, with last time's flyer redated.
- Polling day approaches, and your ministry's measures are timed to land in every block, as the standing plan says.
- Your branch gets its flyer, its measures and its press conference, in the usual order.
- An election year, and the plan is rolled forward to land just before the campaign starts.

**Habit B, `steady`**

- An election is due, and your standing plan holds the line on the targets again; your branch chairman has stopped asking.
- The safe plan rolls into an election year, and your branch learns of it from the newspapers, as usual.
- Before polling day your ministry announces nothing new, on schedule.
- The targets are kept through another election year, and the campaign leads on lift upgrading instead.

**Habit C, `lowest`**

- An election is due, and the lowest-incomes chart goes on the flyer, cropped so the axis starts somewhere encouraging.
- Support for the lowest incomes is timed to land before polling day, as your standing plan says.
- Your branch prints the lowest-incomes chart again, and residents on it say they did not need the flyer.
- The plan for the lowest incomes renews itself in an election year, and a volunteer translates the chart's caption again.

</details>

[← 195](#c195) · [Next → 197](#c197) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c197"></a>197. The Ministry Townhall

[← 196](#c196) · [Next → 198](#c198) · [Contents](../DECK-DESIGN.md#contents)

`the_townhall` · events.json · can come back · weight 10

**Who sees it:** Minister of State and up.

**Series** `townhall`: shown in full once a career, then its years pass by themselves on the habit; a card whose Meanwhile lines are spent is not drawn again.

**A Meanwhile year with no habit:** Standing up a little (+1), Reputation up a little (+1).

You are hosting your ministry's townhall: four hundred officers, and an anonymous question board on the screen behind you. One question has far more upvotes than the rest. It is about workload, and it is not polite. Every officer in the room is waiting to see whether you read it out.

**A. Read it out and answer it.**

> You read it in full, rude part included, and answer it for eleven minutes without notes. The room changes temperature. Nobody repeats anything else from the townhall, inside the ministry or out.

- Hidden: Standing down a lot (−6), Reputation up (+4), Integrity up a lot (+10).
- Habit: `face`.

**B. Address the theme without reading it.**

> You speak warmly about wellbeing and the importance of a sustainable pace. Four hundred officers understand precisely what has happened, and the question's upvotes keep climbing.

- Hidden: Standing up a lot (+6), Reputation down a little (−2), Integrity down (−4).
- Habit: `deflect`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The civil servants who work with you (politics, `officials`), 55%: A helps (+3) · B hurts (−3).

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2: The Curated Questions*

At your ministry's townhall this year, the questions were submitted in advance and curated, so that nothing awkward would come up. Four hundred officers are watching. An officer at the back raises a hand anyway, and the room turns to see whether you will take the question.

**A. Take the question.**

> It is about promotions, and it is fair. You answer it partly, and say that it is only partly. Afterwards, the curated questions are the part nobody remembers.

**B. Say there will be time at the end.**

> There is no time at the end. There was never going to be, and four hundred officers watched the hand go down.

---

*Version 3: The Extra Floor*

You are hosting your ministry's townhall: four hundred officers and a roving microphone. An officer asks why headquarters added a floor of staff this year, while every division was told to absorb its work. It's true, the room knows it, and everyone is waiting to see what you do with it.

**A. Say it's true, and say why.**

> You say it's true, and why, and that it won't happen next year. The applause is short and real. Someone in the third row writes "next year" in a notebook.

**B. Talk about the year's priorities.**

> You talk about priorities for six minutes, well. The officer who asked sits down, and the microphone moves on, and the floor is still there.

</details>

<details><summary>Meanwhile lines (10)</summary>

A year that passes by itself on the habit shows one line, never the same one twice in a career.

**Habit A, `face`**

- The workload question tops the townhall board again, you read it out again, and this time the room applauds before you answer.
- Four hundred officers, one microphone, and a rude question read out in full: the only part of the townhall anyone repeats.
- An officer thanks you at the lift for reading the rude townhall question out, in a whisper, in case anyone is listening.
- You read the townhall's top question out in full, and the next year one officer puts a real name to a question.
- The townhall question about workload is read out again, and this time a director in the front row nods.

**Habit B, `deflect`**

- The townhall's top question is about workload, and you address its theme, warmly.
- Your townhall slides circulate, unofficially, as an example of what a townhall can be.
- The townhall runs to time and the theme is addressed, while the question waits on the board like a queue number.
- At the townhall you answer the theme of the top question so warmly that HR asks to use it in a module.
- The theme of the top question becomes the title of next year's townhall, and that counts as an answer.

</details>

[← 196](#c196) · [Next → 198](#c198) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c198"></a>198. Open Minds

[← 197](#c197) · [Next → 199](#c199) · [Contents](../DECK-DESIGN.md#contents)

`strange_thoughts` · packs/strange.json · once a career · weight 0.7

**Who sees it:** Minister of State to Deputy Prime Minister; not after any of [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](02-service.md#c90), [#124](02-service.md#c124), [#125](02-service.md#c125), [#134](02-service.md#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#201](#c201) (`strange_met`).

For one Tuesday, everyone in the room with you can hear your thoughts. It's the day of your ministry's weekly senior management meeting. Word has got round, so nobody sits beside you, and items one to six take nineteen minutes. Item seven is a proposal your officials have worked on for a year, and you have doubts about it.

**A. Think only about the agenda.**

> You think about item seven's annex so hard that the room hears a table of figures. It is approved. Your doubts were about paragraph three, and nobody heard them.

- Hidden: Competence up (+4), Standing up a little (+2), Integrity down (−3).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](02-service.md#c90), [#124](02-service.md#c124), [#125](02-service.md#c125), [#134](02-service.md#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#201](#c201).

**B. Let them hear what you think of item seven.**

> Item seven is withdrawn for further study. The minutes record that views were expressed. Afterwards the Permanent Secretary says, "I had the same doubts." You can't check.

- Hidden: Standing down (−4), Reputation up a little (+2), Integrity up a lot (+6).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](02-service.md#c90), [#124](02-service.md#c124), [#125](02-service.md#c125), [#134](02-service.md#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#201](#c201).

**C. Adjourn the meeting. Cite a clash.**

> Everyone hears that there is no clash. The meeting adjourns anyway, with great courtesy. Item seven comes back next week with a better paper, and you are inaudible again.

- Hidden: Competence up (+3), Standing down (−3), Integrity down a little (−1).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](02-service.md#c90), [#124](02-service.md#c124), [#125](02-service.md#c125), [#134](02-service.md#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#201](#c201).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The civil servants who work with you (politics, `officials`), 50%: A hurts (−1) · B helps (+2) · C hurts (−1).

[← 197](#c197) · [Next → 199](#c199) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c199"></a>199. The Other Side of the Table

[← 198](#c198) · [Next → 200](#c200) · [Contents](../DECK-DESIGN.md#contents)

`bench_tea` · packs/backbench.json · once a career · weight 5

**Who sees it:** Minister of State and up; the peer (Xin Yi) is Director and up.

**Shares a decision** (`declare`) with [#121](02-service.md#c121), [#114](02-service.md#c114): a career sees only one.

The party asks you to sit on the panel at a tea, its first, informal look at a possible election candidate. The candidate is Xin Yi, a Senior Director now, who started in the service the same week as you and does not know you will be there. The file is thin and very good. Knowing a candidate is meant to be declared.

**A. Say that you know Xin Yi, and step aside.**

> The tea goes ahead without you, and you hear nothing about it, correctly. The party does not field Xin Yi, who stays in the service and never mentions the tea, which you take as good manners.

- Hidden: Standing down a little (−2), Integrity up (+5).
- The peer, if this showing named them: marks `you_stepped_aside`.

**B. Say that you know Xin Yi, and sit anyway.**

> The panel lets you stay. You ask Xin Yi about the file, gently, in the voice that once asked you about yours. Xin Yi answers better than you did, and the party still decides not to field Xin Yi.

- Hidden: Competence up (+3), Standing up a little (+2), Integrity up a little (+1).
- The peer, if this showing named them: marks `you_sat_in`.

**C. Sit, and say nothing about knowing Xin Yi.**

> Nobody asks, and you are fair, mostly. Xin Yi is not fielded, and stays in the service. A year later, at a wedding, Xin Yi thanks you for the panel, in front of two people who were also on it.

- Hidden: Standing up (+4), Integrity down (−5), Heat up (+4).
- The peer, if this showing named them: marks `owes_you`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your fellow Members of Parliament (politics, `fellowMPs`), 50%: A helps (+1) · B helps (+2) · C hurts (−3).

[← 198](#c198) · [Next → 200](#c200) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c200"></a>200. The Reshuffle

[← 199](#c199) · [Next → 201](#c201) · [Contents](../DECK-DESIGN.md#contents)

`reshuffle` · events.json · once a career · weight 11

**Who sees it:** Senior Minister of State to Minister (MR3).

A Cabinet reshuffle is coming: the Prime Minister will move ministers between ministries, and has asked to see you on Thursday to hear where you would like to go. Taking on a hard ministry and surviving it is how ministers reach the top jobs. Staying put is comfortable, and rarely leads further. Benedict, your fellow MP, has already told you it is good news, though Benedict knows no more than you do.

**A. Ask for the hard ministry nobody wants.**

> Housing, health or transport: something with a queue, a waiting list and a headline every week. You are given it at once, and the speed tells you it was going to be yours anyway. Survive it, and the top jobs open up.

- Hidden: Competence up a lot (+10), Standing up a lot (+12), Reputation down (−4), the ceiling (CEP) up two grades (+2).
- Moves you to another ministry (one of: Ministry of National Development; Ministry of Health; Ministry of Transport); sets `moved_ministry`.

**B. Ask to stay where you are.**

> You stay. It is pleasant and important, and nobody, including you, will ever find out whether you could have handled something harder.

- Hidden: Competence down (−4), Standing up (+3), wealth +$100,000.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your fellow Members of Parliament (politics, `fellowMPs`), 40%: A helps (+2) · B hurts (−2).

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2*

A Cabinet reshuffle, moving ministers between ministries, will be announced on Monday. On Friday the Prime Minister's principal private secretary calls: "Ms Lim, is there any preference you would like noted?" A hard ministry is where ministers are tested for the top jobs; staying is safe. The call lasts ninety seconds, and within the hour Benedict, your fellow MP, texts to ask how it went.

**A. Note a preference for the hardest ministry going.**

> You name housing, health and transport. On Monday you are given one of them, announced so smoothly that the press release was plainly typed before the call. Survive it, and you will be in line for more.

**B. Note a preference for staying put.**

> Your preference is noted in ninety seconds and honoured on Monday. You stay, in a ministry that runs well, as it did before you and will after you.

---

*Version 3*

A Cabinet reshuffle is due, and a newspaper's graphic puts your face in three different ministries, each with a question mark. Benedict, your fellow MP, sends you all three, with emojis. The Prime Minister's office wants twenty minutes on Thursday to hear where you would like to go. Hard ministries are how ministers rise. Staying is safe.

**A. Ask for whichever ministry has the longest queue.**

> Inside the twenty minutes you are given housing, health or transport, whichever has the worst week coming. The newspaper says, for a week, that its graphic had guessed it.

**B. Ask to stay where you are.**

> You stay, which the graphic had not considered. Your diary for the next five years looks very like your diary for the last five.

</details>

[← 199](#c199) · [Next → 201](#c201) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c201"></a>201. The Gold Bar

[← 200](#c200) · [Next → 202](#c202) · [Contents](../DECK-DESIGN.md#contents)

`strange_gold` · packs/strange.json · once a career · weight 0.7

**Who sees it:** Minister (MR4) and up; not after any of [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](02-service.md#c90), [#124](02-service.md#c124), [#125](02-service.md#c125), [#134](02-service.md#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](#c198) (`strange_met`).

Since Monday, one gold bar in the national reserves has produced another every night. Nobody can say how. The Finance ministry can say exactly what it is: a return on the reserves. The rules let the Government spend up to half the expected return each year, and nobody expected this. Cabinet must decide what to do.

**A. Ask for a higher expected rate of return.**

> The boards that invest the reserves propose counting the new gold in the expected return, so the Government could spend more. The President consults the Council of Presidential Advisers and does not agree, so the usual twenty-year average applies. That average does not include this week.

- Hidden: Standing up (+3), Reputation up (+3), Integrity down (−4).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](02-service.md#c90), [#124](02-service.md#c124), [#125](02-service.md#c125), [#134](02-service.md#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](#c198).

**B. Leave the framework alone. Let the bars accumulate.**

> The bars accumulate. Whatever is unspent at the end of the term becomes past reserves, which no government may spend without the President's agreement. Nothing is announced. The vault is extended.

- Hidden: Standing down (−3), Integrity up (+5).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](02-service.md#c90), [#124](02-service.md#c124), [#125](02-service.md#c125), [#134](02-service.md#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](#c198).

**C. Propose a scheme, funded from the bars.**

> Finance reminds Cabinet that schemes are funded from the Budget, and that the bars are reserves. The scheme is funded from the Budget. It is very popular.

- Hidden: Standing up a little (+1), Reputation up (+5), Integrity down a little (−2), Heat up (+4).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](02-service.md#c90), [#124](02-service.md#c124), [#125](02-service.md#c125), [#134](02-service.md#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](#c198).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The civil servants who work with you (politics, `officials`), 40%: A hurts (−2) · B helps (+2).
- The press gallery (politics, `pressGallery`), 30%: B hurts (−1) · C helps (+1).

[← 200](#c200) · [Next → 202](#c202) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c202"></a>202. The Succession

[← 201](#c201) · [Next → 203](#c203) · [Contents](../DECK-DESIGN.md#contents)

`succession` · events.json · once a career · weight 100 · priority: drawn the moment it qualifies

**Who sees it:** Minister (MR3) and up; needs Standing of at least 60; not after [214. First Among Equals](07-batchmate.md#c214), A (`bid_for_top`); not after [214. First Among Equals](07-batchmate.md#c214), B (`kingmaker`).

The Prime Minister is stepping down, and the next generation of ministers must agree on a successor. The process is informal, which means it is decided entirely by people in a room. You are in the room, and so is the other front-runner. Put yourself forward and you may become Prime Minister. Back the other, and you get a senior portfolio but never the top job.

**A. Put yourself forward.**

> You say it plainly, against convention. The room absorbs it. Nothing is decided that day, but your name is now one of the two being weighed, instead of one of the nine being listed.

- Hidden: Standing down (−5), Reputation up a lot (+6), the ceiling (CEP) up one grade (+1).
- Sets `bid_for_top`: read by [#214](07-batchmate.md#c214).

**B. Back the other candidate. Ask for a senior portfolio.**

> The other candidate wins, as everyone expected once you had spoken, and knows exactly who delivered it. You get everything you asked for. You will spend the rest of your career as the most powerful minister who is not Prime Minister.

- Hidden: Standing up a lot (+14), Integrity up (+3), wealth +$200,000.
- Sets `kingmaker`: read by [#214](07-batchmate.md#c214).
- ↳ Can lead to: [203. The First Cabinet](#c203), in a year, 90%

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your fellow Members of Parliament (politics, `fellowMPs`), 50%: A hurts (−2) · B helps (+2).

[← 201](#c201) · [Next → 203](#c203) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c203"></a>203. The First Cabinet

[← 202](#c202) · [Next → 204](#c204) · [Contents](../DECK-DESIGN.md#contents)

`first_cabinet` · events.json

**Who sees it:** only as a follow-up to [202. The Succession](#c202) (B: in a year, 90%).

The colleague you backed for the succession, instead of standing yourself, is now Prime Minister. At the first Cabinet meeting the new Prime Minister thanks everyone for their support, in general terms, and then looks at you for slightly longer than at anyone else. You are owed something, and everyone at the table can see it.

**A. Ask for nothing.**

> You are given something anyway: the chair of a ministerial committee that meets on Saturday mornings. The appointment is a sign of enormous trust, and you will never see a Saturday again.

- Hidden: Standing up a lot (+8), Integrity up (+4).

**B. Ask, at the table, for the portfolio you were promised.**

> The Prime Minister gives it to you before the next item on the agenda, and the whole table watches a debt being paid in full. It's a good portfolio. Everyone will remember how you got it.

- Hidden: Competence up (+4), Standing down a little (−2), Reputation up (+3), Integrity down a little (−2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your fellow Members of Parliament (politics, `fellowMPs`), 40%: A helps (+2) · B hurts (−1).

[← 202](#c202) · [Next → 204](#c204) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c204"></a>204. The Counterpart

[← 203](#c203) · [Next → 205](#c205) · [Contents](../DECK-DESIGN.md#contents)

`lo_counterpart` · packs/long_office.json · once a career · weight 8 · starts the `long_office` clock

**Who sees it:** Deputy Prime Minister only; aged 55 or more; one card on the `long_office` clock every three years.

A minister from a neighbouring country, a friend since you were both new in office, rings you on a private number. Your ministry is about to announce a decision that will hurt an industry across the border, where an election is three months away. Your counterpart asks for the announcement to wait until it is over.

**A. Agree to wait three months.**

> The announcement waits. Your counterpart is re-elected, and sends a case of something expensive, which you declare and return. Your own industry, which needed the decision, spends the three months asking why.

- Hidden: Standing up (+5), Reputation down a little (−1), Integrity down a lot (−6).

**B. Announce it on the day planned.**

> You announce it on schedule. Across the border, your counterpart's party loses two seats and blames you by name. The private number stops ringing, and regional meetings are formal for some years.

- Hidden: Competence up (+3), Standing down (−3), Integrity up (+5).

**C. Announce on schedule, and tell your counterpart the day before.**

> With a day's warning, your counterpart announces a support package first. The two announcements land side by side in the morning papers, looking almost coordinated. The private number keeps ringing, less often.

- Hidden: Competence up (+4), Standing up a little (+1), Reputation up (+3), Integrity down (−3), Heat up (+3).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The party's leadership and the Prime Minister's office (politics, `leadership`), 40%: A hurts (−3) · B helps (+1) · C helps (+1).
- The civil servants who work with you (politics, `officials`), 40%: A hurts (−2) · B helps (+2).

[← 203](#c203) · [Next → 205](#c205) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c205"></a>205. The Historian

[← 204](#c204) · [Next → 206](#c206) · [Contents](../DECK-DESIGN.md#contents)

`lo_historian` · packs/long_office.json · once a career · weight 8 · starts the `long_office` clock

**Who sees it:** Deputy Prime Minister only; aged 55 or more; one card on the `long_office` clock every three years.

A historian writing the official account of a crisis you helped to handle, years ago, asks to interview you. Your memory of it turns on a decisive phone call you made at 2am. The government's records put the call at 9:40am, and another minister made it. The historian has the records too.

**A. Check the records first, and correct yourself.**

> You spend a weekend with the files, and arrive with your own memory corrected in pencil. The historian is delighted. The book gives you a short, accurate paragraph, and the other minister, long retired, writes to thank you.

- Hidden: Competence up a little (+2), Reputation down a little (−2), Integrity up a lot (+6).

**B. Tell it the way you remember it.**

> It is a good story, and you tell it well. The book quotes it in full, followed by a footnote giving the time from the records. Reviewers enjoy the footnote more than the story.

- Hidden: Standing up (+3), Reputation up (+4), Integrity down (−5).

**C. Decline the interview, and send the files.**

> The chapter is written from the files alone. It is accurate, dry and short on you. Your 2am phone call survives only in your own telling, at dinners, where nobody brings footnotes.

- Hidden: Standing up a little (+2), Reputation down a little (−2), Integrity up a little (+2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The civil servants who work with you (politics, `officials`), 35%: A helps (+2) · B hurts (−2) · C helps (+1).
- Your fellow Members of Parliament (politics, `fellowMPs`), 35%: A helps (+2) · B hurts (−2).

[← 204](#c204) · [Next → 206](#c206) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c206"></a>206. The Podcast

[← 205](#c205) · [Next → 207](#c207) · [Contents](../DECK-DESIGN.md#contents)

`lo_podcast` · packs/long_office.json · once a career · weight 8 · starts the `long_office` clock

**Who sees it:** Deputy Prime Minister only; aged 55 or more; one card on the `long_office` clock every three years.

Two hosts in their twenties want you on their podcast. Its last guest was a durian seller, and it is the most popular show in the country among people who do not read newspapers. Your press secretary is against it. The hosts promise you can talk about anything, and they mean it.

**A. Go, and answer anything.**

> Ninety minutes, unedited. You are funny about your first election and frank about a policy you would now do differently. The clips travel. At the next Cabinet meeting, two colleagues have clearly listened to the frank part.

- Hidden: Standing down (−4), Reputation up a lot (+8), Integrity up a little (+1).

**B. Go, with the questions agreed in advance.**

> The hosts agree the questions, then ask them in a tone that makes it plain they were agreed. The episode is polite, and loses half its usual audience. Your press secretary calls it a success.

- Hidden: Competence up a little (+1), Standing up (+4), Reputation down a little (−2).

**C. Decline, and suggest a younger colleague instead.**

> A younger minister goes in your place, is very good, and is now known to a generation that has never heard your name. Your press secretary is relieved. You listen to the episode in the car, twice.

- Hidden: Standing up (+3), Reputation down (−3), Integrity up a little (+2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The press gallery (politics, `pressGallery`), 40%: A helps (+3) · B hurts (−2).
- The party's leadership and the Prime Minister's office (politics, `leadership`), 35%: A hurts (−3) · B helps (+1) · C helps (+1).
- Your fellow Members of Parliament (politics, `fellowMPs`), 30%: C helps (+2).

[← 205](#c205) · [Next → 207](#c207) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c207"></a>207. Pre-Agreed

[← 206](#c206) · [Next → 208](07-batchmate.md#c208) · [Contents](../DECK-DESIGN.md#contents)

`lo_pre_agreed` · packs/long_office.json · once a career · weight 8 · starts the `long_office` clock

**Who sees it:** Deputy Prime Minister only; aged 55 or more; one card on the `long_office` clock every three years.

Your officials have learned your preferences so well that their papers now arrive already agreeing with you, with the options you would reject removed before you see them. Decisions that once took a month take a day, and your ministry is the fastest in government. You cannot remember the last paper that surprised you.

**A. Ask for one paper a month that argues against you.**

> The first arrives labelled "Contrary view (as requested)", and is very good. By the third month, officials compete to write it. Decisions take a week again, and two of them come out differently.

- Hidden: Competence up (+5), Standing down a little (−2), Integrity up (+3).

**B. Leave it. It works.**

> It does work. Years later an auditor finds a scheme nobody questioned, and asks to see the options paper that went to you. There was only ever one option in it.

- Hidden: Competence down (−3), Standing up (+5), Heat up (+3).

**C. Bring in an outside panel to test the big decisions.**

> The panel meets quarterly: a professor, a former banker and a union leader. In its first year it finds a serious flaw, in a scheme your officials had doubted and never mentioned. They are relieved, and a little put out.

- Hidden: Competence up (+4), Standing down a little (−2), Reputation up (+4).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The civil servants who work with you (politics, `officials`), 45%: A helps (+3) · B hurts (−2) · C helps (+1).
- The party's leadership and the Prime Minister's office (politics, `leadership`), 30%: A hurts (−1) · B helps (+2) · C hurts (−1).

[← 206](#c206) · [Next → 208](07-batchmate.md#c208) · [Contents](../DECK-DESIGN.md#contents)

[← Politics](05-politics.md#c160) · [Contents](../DECK-DESIGN.md#contents) · [The batchmate →](07-batchmate.md#c208)
