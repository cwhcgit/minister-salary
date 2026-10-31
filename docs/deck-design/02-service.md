# The deck, with the mechanics: The service

[← The first years](01-first-years.md#c1) · [Contents](../DECK-DESIGN.md#contents) · [The top of the service →](03-top-of-service.md#c140)

## <a id="stage-service"></a>The service

Assistant Director to Senior Director. Cards 68 to 139.

### <a id="c68"></a>68. Lo Hei

[← 67](01-first-years.md#c67) · [Next → 69](#c69) · [Contents](../DECK-DESIGN.md#contents)

`cny_lohei` · events.json · once a career · weight 10

**Who sees it:** Assistant Director to Deputy Secretary.

It's the division's Chinese New Year lunch, and the Permanent Secretary is at your table. After eleven minutes of lo hei, tossing the yusheng salad as high as chopsticks allow and shouting wishes for abundance, the Permanent Secretary turns to you and asks, properly: "So, Wei Ling, if your division had to stop one thing this year, what should it be?" The first project that comes to mind is your own.

**A. Your own project. Say why.**

> You have about ninety seconds, and you spend all of them on why your own work should stop. The Permanent Secretary stops eating to listen, and at the end says, "Say that again on Thursday, to the committee." The people who decide promotions will be in that room.

- Hidden: Competence up a lot (+6), Standing down (−4), Reputation up a lot (+8), the ceiling (CEP) up two grades (+2).
- A standout moment (in the service; two mark the file exceptional).

**B. Another division's project. Say why.**

> It's a reasonable answer, well argued, and the Permanent Secretary nods. The other division's project is reviewed in March. Its director never finds out who suggested it, and you never ask whether yours would have been next.

- Hidden: Competence up a little (+2), Standing up (+5), Integrity down (−5).

**C. Say that everything the division does matters.**

> "Mm," says the Permanent Secretary, and turns to the person on the other side. That's the end of it, and you both know it.

- Hidden: Competence down a little (−2), Standing up (+4).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The ranking panel (service, `panel`), 40%: A helps (+3) · B hurts (−2) · C hurts (−1).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: A hurts (−2) · C helps (+2).

[← 67](01-first-years.md#c67) · [Next → 69](#c69) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c69"></a>69. The Report

[← 68](#c68) · [Next → 70](#c70) · [Contents](../DECK-DESIGN.md#contents)

`consultant_report` · events.json · once a career · weight 9

**Who sees it:** Assistant Director to Senior Director.

**Shares a decision** (`credit_taken`) with [#28](01-first-years.md#c28): a career sees only one.

Your ministry paid a consultancy \$1.9 million to work out why one of its schemes isn't working. Today they present their final deck, and it's your own idea: the one you set out in a minute paper, a memo to the people above you asking for a decision, which nobody acted on. Only your paragraph four, on how it could go wrong, is missing. The Deputy Secretary who hired them loves it.

**A. Say nothing. Let them have it.**

> The recommendation is adopted with enthusiasm. At the townhall it's described as "a fresh external perspective", and you clap with everyone else.

- Hidden: Competence down a little (−2), Standing up a lot (+6), Integrity down (−4).

**B. Circulate your old minute paper.**

> You send the minute paper, paragraph four and all, to the fourteen people at the presentation. Nobody replies except a Deputy Secretary you've never met, who writes only to you: "Good paper." The one who hired the consultants reads it too.

- Hidden: Competence up a lot (+7), Standing down a lot (−8), Reputation up (+5), this year's appraisal marked down (−8, said on screen).
- ↳ Can lead to: [70. Paragraph Four](#c70), in two years, 50%

**C. Ask the consultants, in the Q&A, what their data source was.**

> The consultancy's partner checks the appendix and reads out the source: a minute paper from your division, written before the consultants were hired. Yours. The room enjoys this more than the partner does.

- Hidden: Competence up (+5), Standing down (−4), Reputation up (+4), Heat up (+3).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 35%: A helps (+1) · B helps (+2) · C hurts (−3).
- The ranking panel (service, `panel`), 40%: A hurts (−2) · C helps (+2).

[← 68](#c68) · [Next → 70](#c70) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c70"></a>70. Paragraph Four

[← 69](#c69) · [Next → 71](#c71) · [Contents](../DECK-DESIGN.md#contents)

`minute_vindicated` · events.json · a standout moment, whichever choice (in the service)

**Who sees it:** only as a follow-up to [69. The Report](#c69) (B: in two years, 50%).

When a consultancy's \$1.9 million deck repeated the advice in your old minute paper, you circulated the paper to everyone at the presentation. The ministry went with the consultants' version anyway, and it has now gone wrong exactly as your paragraph four, on the risks, said it would. Someone upstairs has found paragraph four.

**A. Let paragraph four speak for itself.**

> It's read aloud at a meeting you aren't at. Afterwards three people forward it to you, each believing they're the first.

- Hidden: Standing up (+4), the ceiling (CEP) up two grades (+2).

**B. Offer to fix it.**

> You're allowed to. It takes a year, and then a consultancy is hired to evaluate your fix.

- Hidden: Competence up a lot (+8), Standing up a lot (+6), the ceiling (CEP) up one grade (+1).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 35%: A hurts (−1) · B helps (+1).
- The ranking panel (service, `panel`), 30%: A helps (+1) · B hurts (−1).

[← 69](#c69) · [Next → 71](#c71) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c71"></a>71. The Forum Page

[← 70](#c70) · [Next → 72](#c72) · [Contents](../DECK-DESIGN.md#contents)

`forum_letter` · events.json · once a career · weight 9

**Who sees it:** Assistant Director to Senior Director.

A member of the public has written to the Forum page, the letters page of the Straits Times, about a scheme your division runs. His letter is 340 words long, very angry, and right about every fact. Drafting the ministry's reply is your job, due to Ms Chua, your reporting officer, by Friday, and the paper will print whatever goes out.

**A. Draft the standard reply: thank him for his feedback.**

> Your reply says the scheme "is regularly reviewed", in 310 words that commit to nothing. It's approved in a single round, which tells you exactly what gets approved easily here.

- Hidden: Standing up a lot (+6), Integrity down (−5).

**B. Draft a reply that admits he's right, and says what will change.**

> It goes through nine rounds of approval and comes out shorter, but the admission survives. He writes in again, to thank you. That letter doesn't get published.

- Hidden: Competence up (+4), Standing down a lot (−6), Reputation up a lot (+7), Integrity up a lot (+10).

**C. Look him up in the ministry's records first.**

> His record gives you his address in Ang Mo Kio and the school he taught at for thirty years. You close it without doing anything with it. But you did open it, and the system logs who opens what.

- Hidden: Standing up a lot (+7), Integrity down a lot (−14), Heat up a lot (+15).
- Sets `looked_him_up`: in the Folder the background check reads.
- ↳ Can lead to: [72. The Citizens' Panel](#c72), in five years, 80% · [Everything Surfaced](09-endings.md#end-scandal)

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The office a confidential paper or decision belongs to (service, `owner`), 50%: C hurts (−4).
- The Minister's office (service, `ministersOffice`), 35%: A helps (+2) · B hurts (−2).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: B helps (+3).
- The ranking panel (service, `panel`), 30%: B helps (+2).

[← 70](#c70) · [Next → 72](#c72) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c72"></a>72. The Citizens' Panel

[← 71](#c71) · [Next → 73](#c73) · [Contents](../DECK-DESIGN.md#contents)

`citizens_panel` · events.json

**Who sees it:** only as a follow-up to [71. The Forum Page](#c71) (C: in five years, 80%); when it falls due: up to Permanent Secretary.

Years ago a retired schoolteacher wrote an angry, accurate letter to the Forum page about your scheme, and you looked up his address in the ministry's records. Now twelve members of the public, picked at random, are reviewing the scheme over three Saturdays. He's one of them, and he has brought the cutting.

**A. Tell him, privately, that you once looked up his address.**

> He considers this for a long time, then says that in thirty years of teaching he looked up many pupils' addresses, usually because he was worried about them, and he hopes you were at least that worried. The panel's report is fair. He wrote most of it.

- Hidden: Standing down (−4), Integrity up a lot (+10), Heat down a lot (−12).

**B. Thank him for his letter, in front of the panel.**

> He accepts the thanks with the face of a teacher accepting homework that has clearly been copied. The panel's report is fair, and has a section on responsiveness.

- Hidden: Standing up a little (+2), Reputation up (+5), Integrity down (−3).

**C. Leave the sessions to Faizal.**

> Faizal reports back that the panel was constructive, and that one member asked, twice, whether you'd be coming.

- Hidden: Competence down a little (−1), Standing up (+3), Heat up (+4).
- The junior officer, if this showing named them: marks `covered_for_you`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 40%: C hurts (−3).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: A helps (+2) · C hurts (−1).
- The ranking panel (service, `panel`), 30%: B helps (+2).

[← 71](#c71) · [Next → 73](#c73) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c73"></a>73. The Recruiter

[← 72](#c72) · [Next → 74](#c74) · [Contents](../DECK-DESIGN.md#contents)

`headhunter_early` · events.json · once a career · weight 7

**Who sees it:** Assistant Director to Director; not while the scholarship bond runs.

**Shares a decision** (`private_offer`) with [#138](#c138), [#177](05-politics.md#c177), [#178](05-politics.md#c178), [#101](#c101): a career sees only one.

A recruiter has found you on LinkedIn, which you'd forgotten you were on. A bank wants someone who understands how ministries think, and the salary is a number you read twice. Taking it means resigning from the service, and from whatever it had planned for you.

**A. Take it.**

> Your pass stops working on a Friday. On Monday you have a new one, and a view.

- Leaves for the private sector: the career ends, with fees of twice the grade's pay for each year to retirement (3 to 10 years), after tax.
- ↳ Can lead to: [The Consultancy](09-endings.md#end-consultancy)

**B. Mention the offer, lightly, to HR.**

> The service doesn't match a bank's offer: your pay stays what your grade pays. HR quietly raises its private estimate of how far you'll go. Your bosses hear you were shopping around, and it shows in this year's appraisal.

- Hidden: Standing down (−4), Integrity down a little (−2), the ceiling (CEP) up one grade (+1).

**C. Decline. You're not finished here.**

> You delete the message. Then you undelete it, read the number again, and delete it.

- Hidden: Standing up a little (+1), Integrity up (+3).

[← 72](#c72) · [Next → 74](#c74) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c74"></a>74. The Nomination

[← 73](#c73) · [Next → 75](#c75) · [Contents](../DECK-DESIGN.md#contents)

`leadership_programme` · events.json · once a career · weight 11

**Who sees it:** Assistant Director to Deputy Director; not for President's Scholar.

**Shares a decision** (`one_slot`) with [#113](#c113), [#211](07-batchmate.md#c211): a career sees only one.

Your division can put one name forward this year for the Public Service Leadership Programme, the course that marks people out for the top jobs. Ms Chua, your reporting officer, wants your nomination by Friday, and it can be your own name. Everyone expects you to put forward the division's scholar, one of the high-flyers the government paid to study overseas, who is going places anyway.

**A. Nominate yourself.**

> It isn't done, putting your own name forward. It also isn't forbidden. Ms Chua writes your name down slowly, and a committee you'll never meet raises its estimate of how far you'll go.

- Hidden: Standing down (−4), Reputation up a lot (+6), the ceiling (CEP) up two grades (+2).

**B. Nominate the obvious scholar.**

> The scholar was going anyway, and thanks you, warmly and sincerely, which somehow makes it worse. The officer who does the division's real work reads the shortlist on the intranet, like everyone else.

- Hidden: Standing up a lot (+7), Reputation down (−3).

**C. Nominate the quiet officer who does all the actual work.**

> The quiet officer is astonished, and goes on the programme. For nine months the work that officer used to do lands on your desk. Your nominee will rise faster than you, and won't forget who made the nomination.

- Hidden: Competence down a little (−2), Standing down (−4), Reputation up (+4), Integrity up a lot (+12).
- Sets `mentored_ally`: counts toward Legacy.
- ↳ Can lead to: [75. The Officer You Nominated](#c75), in 11 years, 90% (or, at another grade, [#76](#c76), [#77](#c77), [#78](#c78), [#79](#c79))

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 45%: A hurts (−3) · B hurts (−1) · C helps (+4).
- The ranking panel (service, `panel`), 30%: A helps (+2) · C hurts (−2).

[← 73](#c73) · [Next → 75](#c75) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c75"></a>75. The Officer You Nominated

[← 74](#c74) · [Next → 76](#c76) · [Contents](../DECK-DESIGN.md#contents)

`ally_returns` · events.json

**Who sees it:** only as a follow-up to [74. The Nomination](#c74) (C: in 11 years, 90%); when it falls due: Director to Senior Director.

Over a decade ago, you put forward the quiet officer who did your division's real work for the leadership programme, instead of yourself. That officer is a Deputy Secretary now, and has been asked to suggest names for another Deputy Secretary post: the last rung below Permanent Secretary.

**A. Say nothing, and let your old nominee decide.**

> Your name goes in. Neither of you mentions the nomination from years ago. It was never a transaction, and it stays that way by not being mentioned.

- Hidden: Standing up a lot (+10), Reputation up (+5), the ceiling (CEP) up three grades (+3).

**B. Say first that your old nominee owes you nothing.**

> Your old nominee says that is understood, and puts your name in anyway. That's how you learn the difference between a debt and a judgement.

- Hidden: Standing up a lot (+6), Integrity up a lot (+6), the ceiling (CEP) up two grades (+2).

[← 74](#c74) · [Next → 76](#c76) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c76"></a>76. The Officer You Nominated

[← 75](#c75) · [Next → 77](#c77) · [Contents](../DECK-DESIGN.md#contents)

`ally_returns_junior` · events.json

**Who sees it:** fires instead of [75. The Officer You Nominated](#c75) when that card falls due and this one's conditions hold (the first version that fits); when it falls due: up to Deputy Director.

Over a decade ago, you nominated the quiet officer who did your division's real work for the leadership programme, instead of yourself. That officer has since overtaken you, is now a Deputy Secretary with a post to fill, and asks for you by name.

**A. Take it.**

> Neither of you mentions the nomination. You're given the hardest file in the division, and everything you write is read twice.

- Hidden: Competence up (+3), Standing up a lot (+6), the ceiling (CEP) up two grades (+2).

**B. Say first that your old nominee owes you nothing.**

> Your old nominee says that is understood, and asks for you anyway. That's how you learn the difference between a debt and a judgement.

- Hidden: Standing up (+4), Integrity up a lot (+6), the ceiling (CEP) up one grade (+1).

[← 75](#c75) · [Next → 77](#c77) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c77"></a>77. The Officer You Nominated

[← 76](#c76) · [Next → 78](#c78) · [Contents](../DECK-DESIGN.md#contents)

`ally_returns_ds` · events.json

**Who sees it:** fires instead of [75. The Officer You Nominated](#c75) when that card falls due and this one's conditions hold (the first version that fits); when it falls due: Deputy Secretary only.

Over a decade ago, you nominated the quiet officer who did your division's real work for the leadership programme, instead of yourself. That officer is a Permanent Secretary now, younger than you and faster, and has been asked for names for another Permanent Secretary post, the last rung there is. You're a Deputy Secretary.

**A. Say nothing, and let your old nominee decide.**

> Your name goes in. Neither of you mentions the nomination from years ago, because the whole point of it was that it was never a transaction.

- Hidden: Standing up a lot (+10), Reputation up (+5), the ceiling (CEP) up three grades (+3).

**B. Say first that your old nominee owes you nothing.**

> Your old nominee says that is understood, and puts your name in anyway. That's how you learn the difference between a debt and a judgement.

- Hidden: Standing up a lot (+6), Integrity up a lot (+6), the ceiling (CEP) up two grades (+2).

[← 76](#c76) · [Next → 78](#c78) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c78"></a>78. The Officer You Nominated

[← 77](#c77) · [Next → 79](#c79) · [Contents](../DECK-DESIGN.md#contents)

`ally_returns_ps` · events.json

**Who sees it:** fires instead of [75. The Officer You Nominated](#c75) when that card falls due and this one's conditions hold (the first version that fits); when it falls due: Permanent Secretary only.

Over a decade ago, you nominated the quiet officer who did your division's real work for the leadership programme, instead of yourself. That officer is a Permanent Secretary now too, and you sit on the same committees. Your old nominee has been asked, quietly, which fellow Permanent Secretaries the party should one day invite to tea: its first quiet approach to someone it might ask to stand for Parliament.

**A. Say nothing, and let your old nominee answer.**

> One name is given. You only find out whose from the way certain people start greeting you in lifts.

- Hidden: Standing up a lot (+10), Reputation up a lot (+6).

**B. Say first that your old nominee owes you nothing.**

> Your old nominee says that is understood, and gives your name anyway. That's how you learn the difference between a debt and a judgement.

- Hidden: Standing up a lot (+6), Reputation up (+3), Integrity up a lot (+6).

[← 77](#c77) · [Next → 79](#c79) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c79"></a>79. The Officer You Nominated

[← 78](#c78) · [Next → 80](#c80) · [Contents](../DECK-DESIGN.md#contents)

`ally_returns_pol` · events.json

**Who sees it:** fires instead of [75. The Officer You Nominated](#c75) when that card falls due and this one's conditions hold (the first version that fits); when it falls due: Member of Parliament and up.

Over a decade ago, you put forward the quiet officer who did your old division's real work for the leadership programme, instead of yourself. That officer is a Permanent Secretary now. From time to time the Prime Minister's office asks Permanent Secretaries for a frank view of the politicians they work with, before deciding who goes up. Your old nominee has been asked about you.

**A. Say nothing, and let your old nominee answer.**

> The view goes in, and you never see it. At the next reshuffle the commentary calls you someone the civil service rates. That is the one review a politician never gets to read, and it helps.

- Hidden: Standing up a lot (+6), Reputation up (+3), the ceiling (CEP) up two grades (+2).

**B. Say first that your old nominee owes you nothing.**

> Your old nominee says that is understood, and gives an honest view anyway, which is how you finally learn the difference between a debt and a judgement.

- Hidden: Standing up (+4), Integrity up a lot (+6), the ceiling (CEP) up one grade (+1).

[← 78](#c78) · [Next → 80](#c80) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c80"></a>80. Someone From Before

[← 79](#c79) · [Next → 81](#c81) · [Contents](../DECK-DESIGN.md#contents)

`old_colleague` · events.json · once a career · weight 14

**Who sees it:** Assistant Director to Deputy Secretary; Poly, then night classes only.

At a meeting of several agencies, you recognise the person chairing it. Years ago, before your degree, the two of you worked side by side at a public service counter, on the same grade. Your old colleague is three grades above you now, and chairs the committees that decide who gets noticed.

**A. Speak to your old colleague afterwards.**

> You're remembered at once, and without condescension, which you hadn't dared expect. Within the month you're on two committees that matter, and have been told plainly which one to care about.

- Hidden: Standing up a lot (+8), Reputation up (+4), the ceiling (CEP) up two grades (+2).

**B. Say nothing. Your old colleague has moved on.**

> Your old colleague hadn't moved on, and simply hadn't seen you at the far end of the table. You think about the counter for a week, and then you stop.

- Hidden: Standing down (−3), Integrity up a little (+2).

[← 79](#c79) · [Next → 81](#c81) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c81"></a>81. The Board Takes a Second Look

[← 80](#c80) · [Next → 82](#c82) · [Contents](../DECK-DESIGN.md#contents)

`second_look` · events.json · once a career · weight 9

**Who sees it:** Assistant Director to Deputy Secretary; needs Competence of at least 62; needs Integrity of at least 55.

Someone on a promotion board has read several of your papers, and thinks your work is better than your grade suggests. Unusually, the board has been asked to look again at your file, and at HR's private estimate of the highest grade you'll ever reach, which is never shown to you.

**A. Make the case yourself, in writing.**

> Four pages. You don't argue that you've been treated unfairly, which would be true and useless. You argue what you'd do with the next grade. The estimate is revised, and nobody tells you by how much.

- Hidden: Competence up (+3), Standing up (+4), the ceiling (CEP) up three grades (+3).
- A standout moment (in the service; two mark the file exceptional).

**B. Let the record speak.**

> The record does speak, in the dry language of appraisal forms, and it moves the board slightly less than four pages would have.

- Hidden: Integrity up a lot (+6), the ceiling (CEP) up one grade (+1).

[← 80](#c80) · [Next → 82](#c82) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c82"></a>82. The Inter-Ministry Committee

[← 81](#c81) · [Next → 83](#c83) · [Contents](../DECK-DESIGN.md#contents)

`the_committee` · events.json · once a career · weight 8

**Who sees it:** Assistant Director to Director.

You're the secretariat for an Inter-Ministry Committee: you write its papers and its minutes. It has met eleven times to settle a question three ministries disagree on, and its interim finding is that "further study is warranted". No ministry wants to be the one that gave way, and Rajesh Nair, the Straits Times journalist, has started asking you why.

**A. Write a paper that forces a decision.**

> Your paper, with your name in the footer, sets out three options and recommends one. Two ministries object to being cornered, and say so to your superiors. A decision is made anyway, mostly to stop the paper circulating.

- Hidden: Competence up a lot (+9), Standing down (−5), Reputation up (+5), this year's appraisal marked down (−6, said on screen).
- ↳ Can lead to: [83. The Decision Paper](#c83), in two years, 45%

**B. Keep taking excellent minutes.**

> Your minutes are widely admired. The committee meets fourteen more times. At the end you're commended "for your support of the committee's work", and the question is still open.

- Hidden: Competence up a little (+2), Standing up a lot (+7), Integrity down a little (−2).

**C. Tell Rajesh Nair about the deadlock.**

> Rajesh Nair's story runs that weekend, and a decision follows within a month. You were right about what needed to happen. The service remembers, for much longer, that you made it happen through the press.

- Hidden: Standing down (−4), Reputation up a lot (+6), Integrity down a lot (−8), Heat up a lot (+22).
- Sets `leaked_deadlock`: in the Folder the background check reads.
- The journalist, if this showing named them: marks `you_were_a_source` (read by [#84](#c84)).
- ↳ Can lead to: [84. A Journalist Has Been Asking](#c84), in six years, 45% · [Everything Surfaced](09-endings.md#end-scandal)

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- People from other agencies who were in the room or on the email (service, `agencies`), 50%: A hurts (−2) · B helps (+3).
- The office a confidential paper or decision belongs to (service, `owner`), 40%: C hurts (−3).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: A helps (+3) · B hurts (−1).

[← 81](#c81) · [Next → 83](#c83) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c83"></a>83. The Decision Paper

[← 82](#c82) · [Next → 84](#c84) · [Contents](../DECK-DESIGN.md#contents)

`committee_vindicated` · events.json · a standout moment, whichever choice (in the service)

**Who sees it:** only as a follow-up to [82. The Inter-Ministry Committee](#c82) (A: in two years, 45%); when it falls due: up to Deputy Secretary.

**Shares a decision** (`own_up`) with [#52](01-first-years.md#c52), [#191](06-cabinet.md#c191), [#123](#c123), [#34](01-first-years.md#c34): a career sees only one.

When you were secretariat to a deadlocked Inter-Ministry Committee, you wrote a paper that forced it to decide. That committee has now been dissolved, and its replacement has adopted your paper as its terms of reference. The footer still says "Prepared by Ms Lim Wei Ling, Secretariat", and the paper is about to go to every ministry.

**A. Leave your name on it.**

> The footer travels further than you ever have. A Deputy Secretary you've never met asks for you by name.

- Hidden: Standing up (+4), Reputation up (+4), the ceiling (CEP) up two grades (+2).

**B. Take it off before it circulates.**

> It circulates without a name, and in this building that's how everyone finds out who wrote it.

- Hidden: Integrity up a lot (+8), the ceiling (CEP) up one grade (+1).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The ranking panel (service, `panel`), 35%: A helps (+2) · B hurts (−1).
- People from other agencies who were in the room or on the email (service, `agencies`), 35%: A hurts (−2) · B helps (+1).

[← 82](#c82) · [Next → 84](#c84) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c84"></a>84. A Journalist Has Been Asking

[← 83](#c83) · [Next → 85](#c85) · [Contents](../DECK-DESIGN.md#contents)

`leak_resurfaces` · events.json · once a career

**Who sees it:** only as a follow-up to [82. The Inter-Ministry Committee](#c82) (C: in six years, 45%); [119. The Leak](#c119) (C: in nine years, 40%).

Something confidential got out once, years ago, and you were the one who let it out. Now Rajesh Nair, the Straits Times journalist, is piecing the old story back together, calling everyone who was on the circulation list at the time. Today Mr Nair called you.

**A. Decline to comment. Say nothing to anyone.**

> The story runs without you in it, this time. You spend a fortnight finding out how much of your calm depended on nobody ever asking.

- Hidden: Standing up (+3), Heat up a lot (+8).
- ↳ Can lead to: [Everything Surfaced](09-endings.md#end-scandal)

**B. Tell the most senior person you answer to, before the reporter does.**

> It's the worst forty minutes of your career, and it ends the matter for good. You're thanked for coming forward, and it's meant. It's also never forgotten.

- Hidden: Standing down a lot (−8), Integrity up a lot (+12), Heat down a lot (−30).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `caller` (the first option that fits)

- Years ago, as the secretariat of an Inter-Ministry Committee, you told Rajesh Nair about its deadlock, which you weren't supposed to discuss. Now Mr Nair rings, without naming anyone, to warn you that a reporter at another paper is rebuilding that old story from everyone who was on the circulation list. The reporter has your number. *(`source`; when the journalist (Rajesh Nair) is the one from [82. The Inter-Ministry Committee](#c82), C (`you_were_a_source`))*
- Something confidential got out once, years ago, and you were the one who let it out. Now Rajesh Nair is piecing the old story back together, calling everyone who was on the circulation list at the time. Today Mr Nair called you. *(`journalist`; when the journalist (Rajesh Nair) is not the one from [82. The Inter-Ministry Committee](#c82), C (`you_were_a_source`); shown above)*
- Something confidential got out once, years ago, and you were the one who let it out. Now a reporter is piecing the old story back together from everyone who was on the circulation list at the time, and has just called you. *(`unnamed`)*

</details>

[← 83](#c83) · [Next → 85](#c85) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c85"></a>85. The Officer You Are Supervising

[← 84](#c84) · [Next → 86](#c86) · [Contents](../DECK-DESIGN.md#contents)

`the_scholar` · events.json · once a career · weight 9

**Who sees it:** Assistant Director to Director; not for President's Scholar.

**Shares a decision** (`mentor_hardway`) with [#67](01-first-years.md#c67): a career sees only one.

You're supervising a scholar, one of the high-flyers the government paid to study overseas: twenty-six, very clever, and likely to outrank you within four years. The scholar has asked you to look over a first big paper before it goes upstairs. It isn't good. Whatever you say now will be remembered when the scholar is the one above you.

**A. Say so plainly, and teach the scholar why.**

> You say it isn't good, and spend an afternoon showing why. The scholar takes it well, rewrites it twice, and gets rather good. The scholar will outrank you soon, and will remember that afternoon.

- Hidden: Competence up a lot (+6), Standing down (−3), Integrity up a lot (+9).
- Sets `taught_scholar`: counts toward Legacy.
- ↳ Can lead to: [86. The Officer You Taught](#c86), in 11 years, 85% (or, at another grade, [#87](#c87), [#88](#c88), [#89](#c89))

**B. Clear it. Let the scholar find out the hard way.**

> The paper goes up, and goes badly. Three months later the scholar is moved to a better posting anyway, which teaches a different lesson from the one you meant.

- Hidden: Competence up (+3), Standing up (+4), Integrity down a lot (−6).

**C. Rewrite it yourself overnight.**

> By morning it's a good paper with the scholar's name on it, and you're thanked for it. The scholar never learns to write, and it turns out never needs to.

- Hidden: Competence down a little (−2), Standing up a lot (+7), Integrity down (−3).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 40%: A helps (+2) · B hurts (−3) · C helps (+1).
- The people who work around you (service, `floor`), 35%: A helps (+2) · C hurts (−2).

[← 84](#c84) · [Next → 86](#c86) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c86"></a>86. The Officer You Taught

[← 85](#c85) · [Next → 87](#c87) · [Contents](../DECK-DESIGN.md#contents)

`scholar_returns` · events.json

**Who sees it:** only as a follow-up to [85. The Officer You Are Supervising](#c85) (A: in 11 years, 85%); when it falls due: up to Senior Director.

The young scholar you once supervised is your Deputy Secretary now. Back then you said plainly that the scholar's first big paper wasn't good, and spent an afternoon showing why. After a routine meeting your Deputy Secretary stays behind and says, "You were the only person who ever told me my work was bad."

**A. Say it was worth the trouble.**

> Your Deputy Secretary has put your name forward for something, you learn, on the strength of one afternoon years ago. You go back to your desk and sit there for a while.

- Hidden: Standing up a lot (+12), Integrity up (+5), the ceiling (CEP) up three grades (+3).

**B. Say the paper was still bad.**

> Your Deputy Secretary laughs, for the first time in your presence, and agrees. It is, apparently, the only feedback ever worth keeping.

- Hidden: Standing up a lot (+8), Reputation up (+4), the ceiling (CEP) up two grades (+2).

[← 85](#c85) · [Next → 87](#c87) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c87"></a>87. The Officer You Taught

[← 86](#c86) · [Next → 88](#c88) · [Contents](../DECK-DESIGN.md#contents)

`scholar_returns_peer` · events.json

**Who sees it:** fires instead of [86. The Officer You Taught](#c86) when that card falls due and this one's conditions hold (the first version that fits); when it falls due: Deputy Secretary only.

The young scholar you once supervised is a Deputy Secretary now, like you, at an age you won't ask about. Back then you said plainly that the scholar's first big paper wasn't good. After a joint meeting the scholar stays behind and says, "You were the only person who ever told me my work was bad."

**A. Say it was worth the trouble.**

> The scholar has put your name forward for something, you learn, on the strength of one afternoon years ago. You go back to your office and sit there for a while.

- Hidden: Standing up a lot (+12), Integrity up (+5), the ceiling (CEP) up three grades (+3).

**B. Say the paper was still bad.**

> The scholar laughs, for the first time in your presence, and agrees. It is, apparently, the only feedback ever worth keeping.

- Hidden: Standing up a lot (+8), Reputation up (+4), the ceiling (CEP) up two grades (+2).

[← 86](#c86) · [Next → 88](#c88) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c88"></a>88. The Officer You Taught

[← 87](#c87) · [Next → 89](#c89) · [Contents](../DECK-DESIGN.md#contents)

`scholar_returns_ps` · events.json

**Who sees it:** fires instead of [86. The Officer You Taught](#c86) when that card falls due and this one's conditions hold (the first version that fits); when it falls due: Permanent Secretary only.

The young scholar you once supervised is now one of your Deputy Secretaries. Back then you said plainly that the scholar's first big paper wasn't good. After a routine meeting your Deputy Secretary stays behind and says, "You were the only person who ever told me my work was bad."

**A. Say it was worth the trouble.**

> Your Deputy Secretary now tells new officers the same things, in the same words, and reports that they dislike it just as much. It's said as though this were the point. It was.

- Hidden: Standing up a lot (+10), Reputation up (+3), Integrity up (+5).

**B. Say the paper was still bad.**

> Your Deputy Secretary laughs, for the first time in your presence, and agrees. It is, apparently, the only feedback ever worth keeping.

- Hidden: Competence up (+4), Standing up a lot (+6), Reputation up (+4).

[← 87](#c87) · [Next → 89](#c89) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c89"></a>89. The Officer You Taught

[← 88](#c88) · [Next → 90](#c90) · [Contents](../DECK-DESIGN.md#contents)

`scholar_returns_pol` · events.json

**Who sees it:** fires instead of [86. The Officer You Taught](#c86) when that card falls due and this one's conditions hold (the first version that fits); when it falls due: Member of Parliament and up.

The young scholar you once supervised is a Permanent Secretary now. Back then you said plainly that the scholar's first big paper wasn't good, and spent an afternoon showing why. After briefing a group of MPs on a bill, your old scholar waits until the room has emptied and says, without preamble, "You were the only person who ever told me my work was bad."

**A. Say it was worth the trouble.**

> The favour is returned: from now on, the scholar you once taught tells you when your speeches are bad. It happens often. They get better, and the newspapers notice before the party does.

- Hidden: Standing up a lot (+6), Reputation up a lot (+6), Integrity up (+4).

**B. Say the paper was still bad.**

> A laugh, and the reply that this is why your briefs are now written by a Permanent Secretary personally. They are very good. They are also eleven pages long, and you are expected to read all of them.

- Hidden: Competence up a lot (+6), Standing up a lot (+6), Reputation up a little (+2).

[← 88](#c88) · [Next → 90](#c90) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c90"></a>90. The Merlion Speaks

[← 89](#c89) · [Next → 91](#c91) · [Contents](../DECK-DESIGN.md#contents)

`strange_merlion` · packs/strange.json · once a career · weight 0.85

**Who sees it:** Assistant Director to Director; not after any of [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#124](#c124), [#125](#c125), [#134](#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201) (`strange_met`).

At 7.14am the Merlion, the half-lion, half-fish statue on Marina Bay, says good morning to a tour group, in all four official languages. By ten, nobody is asking how. The question is which agency is in charge of it: STB, the Tourism Board, which protects its image by law, or PUB, the water agency, since it spouts into Marina Reservoir. A meeting of both will decide, and you are writing the paper that recommends one.

**A. Recommend STB as lead agency, with PUB supporting.**

> The meeting agrees in one sitting, a record. STB's first decision as lead agency: the Merlion may not speak again until its talking points are cleared. You're put on the working group that will clear them.

- Hidden: Competence up a little (+2), Standing up (+5), Integrity down a little (−2).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#124](#c124), [#125](#c125), [#134](#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201).
- ↳ Can lead to: [91. Cleared to Speak](#c91), in seven years, 70%

**B. Ask the Merlion which agency it would prefer.**

> It says PUB, because PUB has never once switched it off for maintenance. Its view is minuted as stakeholder feedback. STB is made lead agency anyway.

- Hidden: Standing down (−4), Reputation up (+4), Integrity up (+3).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#124](#c124), [#125](#c125), [#134](#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201).

**C. Propose a joint working group, chaired in rotation.**

> The working group, with you on it, meets every month for three years at the waterfront, so that the Merlion can attend. It never misses a meeting and, as agreed, says nothing until its talking points are cleared.

- Hidden: Competence down a little (−2), Standing up (+3), Reputation up a little (+1).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#124](#c124), [#125](#c125), [#134](#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201).
- ↳ Can lead to: [91. Cleared to Speak](#c91), in seven years, 70%

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- People from other agencies who were in the room or on the email (service, `agencies`), 45%: A helps (+1) · B hurts (−2) · C helps (+1).
- The ranking panel (service, `panel`), 30%: A hurts (−1) · B helps (+2) · C hurts (−1).

[← 89](#c89) · [Next → 91](#c91) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c91"></a>91. Cleared to Speak

[← 90](#c90) · [Next → 92](#c92) · [Contents](../DECK-DESIGN.md#contents)

`strange_merlion_cleared` · packs/strange.json

**Who sees it:** only as a follow-up to [90. The Merlion Speaks](#c90) (A, C: in seven years, 70%).

Years ago, when the Merlion first spoke, you sat on the working group set up to clear what it could say. Its talking points have finally been approved: one page, signed off at four levels, the last of them this morning. On Saturday the Merlion will read them to a tour group, and you are invited.

**A. Go, and stand at the back.**

> It reads the page word for word. Then it sees you and says good morning, which was not on the page. Nobody at STB can say who cleared that.

- Hidden: Competence down a little (−2), Reputation up (+3), Integrity up a little (+2).

**B. Send your apologies. Ask for the transcript.**

> The transcript matches the talking points exactly, except for one closing line, annotated in red: "Not cleared. Well received."

- Hidden: Competence up a little (+2), Standing up a little (+2), Reputation down a little (−2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- People from other agencies who were in the room or on the email (service, `agencies`), 35%: A helps (+2) · B hurts (−2).

[← 90](#c90) · [Next → 92](#c92) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c92"></a>92. Pick Three

[← 91](#c91) · [Next → 93](#c93) · [Contents](../DECK-DESIGN.md#contents)

`pilot_design` · packs/chains.json · once a career · weight 9

**Who sees it:** Assistant Director to Deputy Director.

**Shares a decision** (`bad_number`) with [#50](01-first-years.md#c50), [#59](01-first-years.md#c59), [#171](05-politics.md#c171): a career sees only one.

**Shares a decision** (`announce`) with [#106](#c106), [#58](01-first-years.md#c58): a career sees only one.

Your division has the money for a one-year pilot of nurses visiting seniors at home in the week after discharge, in three towns, and you choose which three. If it works, the Minister will announce it in the Committee of Supply debate, Parliament's yearly debate on each ministry's budget, in two years, using the numbers your pilot produces. Where you run it will decide what those numbers look like.

**A. Pick the three likeliest to make it work.**

> You pick three towns with busy volunteers and short queues. The launch has a ribbon, a banner and a photographer, and the photograph goes upstairs captioned "Good start."

- Hidden: Competence up a little (+2), Standing up (+5), Integrity down (−3).
- Sets `pilot_met`.
- Sets `pilot_easy`: read by [#93](#c93), [#97](#c97).
- ↳ Can lead to: [93. One Number](#c93), in two years, 85%

**B. Pick the three hardest, to learn what breaks it.**

> You pick the three towns where schemes go to struggle. The launch is quiet. Within a month you know more about why things fail than anyone else in the building.

- Hidden: Competence up (+5), Standing down (−4), Integrity up (+3).
- Sets `pilot_met`.
- Sets `pilot_hard`: read by [#93](#c93), [#97](#c97).
- ↳ Can lead to: [93. One Number](#c93), in two years, 85%

**C. Draw the sites by lottery, and hold half back as a control.**

> A lottery picks three towns to get the pilot and three more to go without, for comparison. The three without get a letter explaining why, and draw more complaints than the pilot does. Your results, though, will be very hard to argue with.

- Hidden: Competence up a lot (+6), Standing down a little (−2), Reputation down (−3).
- Sets `pilot_met`.
- Sets `pilot_control`: read by [#93](#c93).
- ↳ Can lead to: [93. One Number](#c93), in two years, 85%

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The ranking panel (service, `panel`), 35%: A helps (+2) · B hurts (−1) · C hurts (−1).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: A hurts (−2) · B helps (+1) · C helps (+1).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `scheme` (the first option that fits)

- a counter that answers questions about any government payout *(`mof`; when only in the Ministry of Finance)*
  - `place`: community clubs
  - `short`: the payout counters
- advisers who walk into neighbourhood shops and explain the grants *(`mti`; when only in the Ministry of Energy, Trade and Industry)*
  - `place`: towns
  - `short`: the shop visits
- a Sunday counter for salary claims *(`mom`; when only in the Ministry of Manpower)*
  - `place`: dormitories
  - `short`: the Sunday counters
- retired teachers reading with Primary 2 pupils after school *(`moe`; when only in the Ministry of Education)*
  - `place`: schools
  - `short`: the reading programme
- nurses visiting seniors at home in the week after discharge *(`moh`; when only in the Ministry of Health; shown above)*
  - `place`: towns
  - `short`: the home visits
- a scam hotline that calls victims back within the hour *(`mha`; when only in the Ministry of Home Affairs)*
  - `place`: police divisions
  - `short`: the call-backs
- an evening for neighbours in a new housing block to meet before they collect their keys *(`mnd`; when only in the Ministry of National Development)*
  - `place`: towns
  - `short`: the neighbours' evenings
- late-night shuttle buses from train stations to the housing estates *(`mot`; when only in the Ministry of Transport)*
  - `place`: towns
  - `short`: the night shuttles
- nightly collection of hawkers' food waste for composting *(`mse`; when only in the Ministry of Sustainability and the Environment)*
  - `place`: hawker centres
  - `short`: the food-waste collection
- one application form for four assistance schemes *(`msf`; when only in the Ministry of Social and Family Development)*
  - `place`: Social Service Offices
  - `short`: the single form

</details>

[← 91](#c91) · [Next → 93](#c93) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c93"></a>93. One Number

[← 92](#c92) · [Next → 94](#c94) · [Contents](../DECK-DESIGN.md#contents)

`pilot_results` · packs/chains.json

**Who sees it:** only as a follow-up to [92. Pick Three](#c92) (any choice: in two years, 85%); when it falls due: up to Permanent Secretary.

The pilot you designed, a counter that answers questions about any government payout, has finished, and its evaluation is in. The Minister's Committee of Supply speech needs one number from it by Friday, and whatever you send is the number the country will hear. In the three community clubs you picked, take-up was 71%. But page 40 of the evaluation points out that those three would have taken up almost anything.

**A. Send the most impressive number, on its own.**

> 71% goes into the speech on its own, and the Minister reads it with feeling. The warning stays where it was: on page 40.

- Hidden: Standing up a lot (+6), Reputation up a little (+2), Integrity down (−5), Heat up (+4).
- Sets `pilot_flattered`: in the Folder the background check reads; named in the Declassified file; read by [#97](#c97), [#98](#c98), [#99](#c99), [#100](#c100).
- ↳ Can lead to: [94. Going National](#c94), in two years, 85% (or, at another grade, [#95](#c95), [#96](#c96))

**B. Send the number with the paragraph that explains it.**

> 71% goes up with its paragraph from page 40, and the speech keeps both: "in places that were already well served". No other line in the speech gets less applause.

- Hidden: Competence up (+3), Standing down (−4), Integrity up (+5).
- Sets `pilot_honest`: named in the Declassified file.
- ↳ Can lead to: [94. Going National](#c94), in two years, 85% (or, at another grade, [#95](#c95), [#96](#c96))

**C. Ask for one more year before anything is announced.**

> The speech goes ahead without your pilot. You spend another year running it in ordinary community clubs, not ones picked to like it. The number you get there is smaller, and you trust it.

- Hidden: Competence up (+5), Standing down (−5), Reputation down a little (−1), Integrity up a little (+2).
- Sets `pilot_waited`: named in the Declassified file.
- ↳ Can lead to: [94. Going National](#c94), in three years, 85% (or, at another grade, [#95](#c95), [#96](#c96))

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The Minister's office (service, `ministersOffice`), 45%: A helps (+2) · C hurts (−2).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: A hurts (−2) · B helps (+2).

<details><summary>This card varies (2 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `scheme` (the first option that fits)

- a counter that answers questions about any government payout *(`mof`; when only in the Ministry of Finance; shown above)*
  - `place`: community clubs
  - `short`: the payout counters
- advisers who walk into neighbourhood shops and explain the grants *(`mti`; when only in the Ministry of Energy, Trade and Industry)*
  - `place`: towns
  - `short`: the shop visits
- a Sunday counter for salary claims *(`mom`; when only in the Ministry of Manpower)*
  - `place`: dormitories
  - `short`: the Sunday counters
- retired teachers reading with Primary 2 pupils after school *(`moe`; when only in the Ministry of Education)*
  - `place`: schools
  - `short`: the reading programme
- nurses visiting seniors at home in the week after discharge *(`moh`; when only in the Ministry of Health)*
  - `place`: towns
  - `short`: the home visits
- a scam hotline that calls victims back within the hour *(`mha`; when only in the Ministry of Home Affairs)*
  - `place`: police divisions
  - `short`: the call-backs
- an evening for neighbours in a new housing block to meet before they collect their keys *(`mnd`; when only in the Ministry of National Development)*
  - `place`: towns
  - `short`: the neighbours' evenings
- late-night shuttle buses from train stations to the housing estates *(`mot`; when only in the Ministry of Transport)*
  - `place`: towns
  - `short`: the night shuttles
- nightly collection of hawkers' food waste for composting *(`mse`; when only in the Ministry of Sustainability and the Environment)*
  - `place`: hawker centres
  - `short`: the food-waste collection
- one application form for four assistance schemes *(`msf`; when only in the Ministry of Social and Family Development)*
  - `place`: Social Service Offices
  - `short`: the single form

**Part 2** · `result` (the first option that fits)

- In the three community clubs you picked, take-up was 71%. But page 40 of the evaluation points out that those three would have taken up almost anything. *(`easy`; when after [92. Pick Three](#c92), A (`pilot_easy`); shown above)*
  - `a`: 71% goes into the speech on its own, and the Minister reads it with feeling. The warning stays where it was: on page 40.
  - `b`: 71% goes up with its paragraph from page 40, and the speech keeps both: "in places that were already well served". No other line in the speech gets less applause.
  - `c`: The speech goes ahead without your pilot. You spend another year running it in ordinary community clubs, not ones picked to like it. The number you get there is smaller, and you trust it.
- In the three hard community clubs you picked, take-up was 23%. For those three, that's remarkable. In a speech, without the context, it's just 23%. *(`hard`; when after [92. Pick Three](#c92), B (`pilot_hard`))*
  - `a`: You send the figure from the best of the three: 64%. It's true of that one. The speech doesn't say which one, and nobody asks.
  - `b`: 23% goes up with its context, and the speech uses both. The line gets no applause, and the Minister's office asks, kindly, whether there was a better number.
  - `c`: The speech goes ahead without your pilot. A second year in the same three brings take-up to 31%, which nobody upstairs asks about, and which you believe.
- Compared with the three community clubs that went without, the pilot raised take-up by four percentage points: a real gain, properly measured, and much smaller than anyone had hoped. *(`control`; when after [92. Pick Three](#c92), C (`pilot_control`))*
  - `a`: You send the gain in the pilot's best month: nineteen points. Every word is accurate. The speech says "up to nineteen points", and the Minister says it twice.
  - `b`: Four points go up with the paragraph explaining why four is good. The speech uses it. A newspaper calls the result "modest", and quotes your paragraph correctly.
  - `c`: The speech goes ahead without your pilot. A second year confirms the four points, and finds that they last. Nobody upstairs asks, and you write it up anyway.

</details>

[← 92](#c92) · [Next → 94](#c94) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c94"></a>94. Going National

[← 93](#c93) · [Next → 95](#c95) · [Contents](../DECK-DESIGN.md#contents)

`pilot_national` · packs/chains.json

**Who sees it:** only as a follow-up to [93. One Number](#c93) (A, B: in two years, 85%; C: in three years, 85%); when it falls due: up to Senior Director.

The home visits, the pilot you designed, will go national next April, and someone has to run the rollout. The ministry's operations division has asked for it, with Xin Yi, who joined the service with you, to lead. You'd like it yourself: whoever runs it owns its success and every complaint. The Deputy Secretary wants your view by Monday.

**A. Ask to run it yourself.**

> The Deputy Secretary agrees, and Xin Yi takes it well, in public. You now own a national scheme, its hotline, and every complaint about it, by name.

- Hidden: Competence up (+3), Standing up (+4), Heat up (+3).
- Sets `pilot_kept`: read by [#97](#c97).
- The peer, if this showing named them: marks `lost_the_rollout` (read by [#97](#c97)).
- ↳ Can lead to: [97. The Paragraph](#c97), in four years, 85% (or, at another grade, [#98](#c98), [#99](#c99), [#100](#c100))

**B. Back Xin Yi's team, and hand over every file.**

> Xin Yi's team takes it, with your files, your caveats and your mobile number. Xin Yi calls twice in the first month, and then, as things settle, at Chinese New Year.

- Hidden: Competence down a little (−1), Standing down a little (−2), Integrity up (+4).
- Sets `pilot_handed`: read by [#97](#c97).
- The peer, if this showing named them: marks `given_the_rollout` (read by [#97](#c97)).
- ↳ Can lead to: [97. The Paragraph](#c97), in four years, 85% (or, at another grade, [#98](#c98), [#99](#c99), [#100](#c100))

**C. Back Xin Yi's team, if the Minister's speech thanks yours.**

> The speech thanks your division for "designing" it and Xin Yi's for "supporting" it. Xin Yi reads the transcript, and from then on copies you on everything, carefully.

- Hidden: Standing up (+3), Reputation up (+3), Integrity down (−4).
- Sets `pilot_named`: read by [#97](#c97).
- The peer, if this showing named them: marks `you_kept_the_credit` (read by [#97](#c97)).
- ↳ Can lead to: [97. The Paragraph](#c97), in four years, 85% (or, at another grade, [#98](#c98), [#99](#c99), [#100](#c100))

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 45%: A hurts (−1) · B helps (+3) · C hurts (−2).
- The ranking panel (service, `panel`), 30%: A helps (+2) · B hurts (−2).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `scheme` (the first option that fits)

- a counter that answers questions about any government payout *(`mof`; when only in the Ministry of Finance)*
  - `place`: community clubs
  - `short`: the payout counters
- advisers who walk into neighbourhood shops and explain the grants *(`mti`; when only in the Ministry of Energy, Trade and Industry)*
  - `place`: towns
  - `short`: the shop visits
- a Sunday counter for salary claims *(`mom`; when only in the Ministry of Manpower)*
  - `place`: dormitories
  - `short`: the Sunday counters
- retired teachers reading with Primary 2 pupils after school *(`moe`; when only in the Ministry of Education)*
  - `place`: schools
  - `short`: the reading programme
- nurses visiting seniors at home in the week after discharge *(`moh`; when only in the Ministry of Health; shown above)*
  - `place`: towns
  - `short`: the home visits
- a scam hotline that calls victims back within the hour *(`mha`; when only in the Ministry of Home Affairs)*
  - `place`: police divisions
  - `short`: the call-backs
- an evening for neighbours in a new housing block to meet before they collect their keys *(`mnd`; when only in the Ministry of National Development)*
  - `place`: towns
  - `short`: the neighbours' evenings
- late-night shuttle buses from train stations to the housing estates *(`mot`; when only in the Ministry of Transport)*
  - `place`: towns
  - `short`: the night shuttles
- nightly collection of hawkers' food waste for composting *(`mse`; when only in the Ministry of Sustainability and the Environment)*
  - `place`: hawker centres
  - `short`: the food-waste collection
- one application form for four assistance schemes *(`msf`; when only in the Ministry of Social and Family Development)*
  - `place`: Social Service Offices
  - `short`: the single form

</details>

[← 93](#c93) · [Next → 95](#c95) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c95"></a>95. Going National

[← 94](#c94) · [Next → 96](#c96) · [Contents](../DECK-DESIGN.md#contents)

`pilot_national_top` · packs/chains.json

**Who sees it:** fires instead of [94. Going National](#c94) when that card falls due and this one's conditions hold (the first version that fits); when it falls due: Deputy Secretary to Permanent Secretary.

The home visits, the pilot you designed years ago, will go national next April, and someone has to run the rollout. The ministry's operations division has asked for it, with Xin Yi, who joined the service with you, to lead. You're senior enough now that the decision is yours, and you could keep it with your own people.

**A. Keep it with your own people.**

> You keep it, and Xin Yi takes it well, in public. Your people now own a national scheme, its hotline, and every complaint about it, addressed to you.

- Hidden: Competence up (+3), Standing up (+4), Heat up (+3).
- Sets `pilot_kept`: read by [#97](#c97).
- The peer, if this showing named them: marks `lost_the_rollout` (read by [#97](#c97)).
- ↳ Can lead to: [97. The Paragraph](#c97), in four years, 85% (or, at another grade, [#98](#c98), [#99](#c99), [#100](#c100))

**B. Give it to Xin Yi's team, with every file.**

> Xin Yi's team takes it, with your files, your caveats and your old notebook. Xin Yi calls twice in the first month, and then, as things settle, at Chinese New Year.

- Hidden: Competence down a little (−1), Standing down a little (−2), Integrity up (+4).
- Sets `pilot_handed`: read by [#97](#c97).
- The peer, if this showing named them: marks `given_the_rollout` (read by [#97](#c97)).
- ↳ Can lead to: [97. The Paragraph](#c97), in four years, 85% (or, at another grade, [#98](#c98), [#99](#c99), [#100](#c100))

**C. Give it to Xin Yi's team, and have the speech thank yours.**

> The speech thanks your people for "designing" it and Xin Yi's for "supporting" it. Xin Yi reads the transcript, and from then on copies you on everything, carefully.

- Hidden: Standing up (+3), Reputation up (+3), Integrity down (−4).
- Sets `pilot_named`: read by [#97](#c97).
- The peer, if this showing named them: marks `you_kept_the_credit` (read by [#97](#c97)).
- ↳ Can lead to: [97. The Paragraph](#c97), in four years, 85% (or, at another grade, [#98](#c98), [#99](#c99), [#100](#c100))

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 45%: A hurts (−1) · B helps (+3) · C hurts (−2).
- The ranking panel (service, `panel`), 30%: A helps (+2) · B hurts (−2).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `scheme` (the first option that fits)

- a counter that answers questions about any government payout *(`mof`; when only in the Ministry of Finance)*
  - `place`: community clubs
  - `short`: the payout counters
- advisers who walk into neighbourhood shops and explain the grants *(`mti`; when only in the Ministry of Energy, Trade and Industry)*
  - `place`: towns
  - `short`: the shop visits
- a Sunday counter for salary claims *(`mom`; when only in the Ministry of Manpower)*
  - `place`: dormitories
  - `short`: the Sunday counters
- retired teachers reading with Primary 2 pupils after school *(`moe`; when only in the Ministry of Education)*
  - `place`: schools
  - `short`: the reading programme
- nurses visiting seniors at home in the week after discharge *(`moh`; when only in the Ministry of Health; shown above)*
  - `place`: towns
  - `short`: the home visits
- a scam hotline that calls victims back within the hour *(`mha`; when only in the Ministry of Home Affairs)*
  - `place`: police divisions
  - `short`: the call-backs
- an evening for neighbours in a new housing block to meet before they collect their keys *(`mnd`; when only in the Ministry of National Development)*
  - `place`: towns
  - `short`: the neighbours' evenings
- late-night shuttle buses from train stations to the housing estates *(`mot`; when only in the Ministry of Transport)*
  - `place`: towns
  - `short`: the night shuttles
- nightly collection of hawkers' food waste for composting *(`mse`; when only in the Ministry of Sustainability and the Environment)*
  - `place`: hawker centres
  - `short`: the food-waste collection
- one application form for four assistance schemes *(`msf`; when only in the Ministry of Social and Family Development)*
  - `place`: Social Service Offices
  - `short`: the single form

</details>

[← 94](#c94) · [Next → 96](#c96) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c96"></a>96. Going National

[← 95](#c95) · [Next → 97](#c97) · [Contents](../DECK-DESIGN.md#contents)

`pilot_national_pol` · packs/chains.json

**Who sees it:** fires instead of [94. Going National](#c94) when that card falls due and this one's conditions hold (the first version that fits); when it falls due: Member of Parliament to Senior Parliamentary Secretary.

The pilot you designed as a civil servant, the home visits, is going national: the Minister announces it in the Committee of Supply debate. Nobody in the chamber knows it was yours. Your own speech on the same ministry's budget is due at four, and you could mention it.

**A. Say, in your speech, that you designed it.**

> The chamber is briefly interested. Your old ministry's officials, in the gallery, write something down. In the wrap-up, the Minister thanks you for your "long association" with the scheme.

- Hidden: Standing down a little (−2), Reputation up (+5), Integrity down a little (−1).
- Sets `pilot_claimed`.
- ↳ Can lead to: [97. The Paragraph](#c97), in four years, 85% (or, at another grade, [#98](#c98), [#99](#c99), [#100](#c100))

**B. Say nothing about it. It is the ministry's now.**

> You stick to your speech. In the gallery, an official who sat in your pilot meetings recognises you and nods. That's all the credit there is, and it's plenty.

- Hidden: Standing up a little (+2), Reputation down a little (−1), Integrity up (+3).
- Sets `pilot_unclaimed`.
- ↳ Can lead to: [97. The Paragraph](#c97), in four years, 85% (or, at another grade, [#98](#c98), [#99](#c99), [#100](#c100))

**C. Use your speech to ask about the scheme's weak spot, which you know best.**

> You ask, politely, what happens in the towns where it was always going to struggle. The Minister promises to look into it, and does. Your old ministry spends a month answering your question.

- Hidden: Competence up (+3), Standing down (−4), Reputation up a little (+2).
- Sets `pilot_warned`.
- ↳ Can lead to: [97. The Paragraph](#c97), in four years, 85% (or, at another grade, [#98](#c98), [#99](#c99), [#100](#c100))

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The civil servants who work with you (politics, `officials`), 45%: A hurts (−2) · B helps (+2).
- The press gallery (politics, `pressGallery`), 30%: A helps (+1) · B hurts (−1).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `scheme` (the first option that fits)

- a counter that answers questions about any government payout *(`mof`; when only in the Ministry of Finance)*
  - `place`: community clubs
  - `short`: the payout counters
- advisers who walk into neighbourhood shops and explain the grants *(`mti`; when only in the Ministry of Energy, Trade and Industry)*
  - `place`: towns
  - `short`: the shop visits
- a Sunday counter for salary claims *(`mom`; when only in the Ministry of Manpower)*
  - `place`: dormitories
  - `short`: the Sunday counters
- retired teachers reading with Primary 2 pupils after school *(`moe`; when only in the Ministry of Education)*
  - `place`: schools
  - `short`: the reading programme
- nurses visiting seniors at home in the week after discharge *(`moh`; when only in the Ministry of Health; shown above)*
  - `place`: towns
  - `short`: the home visits
- a scam hotline that calls victims back within the hour *(`mha`; when only in the Ministry of Home Affairs)*
  - `place`: police divisions
  - `short`: the call-backs
- an evening for neighbours in a new housing block to meet before they collect their keys *(`mnd`; when only in the Ministry of National Development)*
  - `place`: towns
  - `short`: the neighbours' evenings
- late-night shuttle buses from train stations to the housing estates *(`mot`; when only in the Ministry of Transport)*
  - `place`: towns
  - `short`: the night shuttles
- nightly collection of hawkers' food waste for composting *(`mse`; when only in the Ministry of Sustainability and the Environment)*
  - `place`: hawker centres
  - `short`: the food-waste collection
- one application form for four assistance schemes *(`msf`; when only in the Ministry of Social and Family Development)*
  - `place`: Social Service Offices
  - `short`: the single form

</details>

[← 95](#c95) · [Next → 97](#c97) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c97"></a>97. The Paragraph

[← 96](#c96) · [Next → 98](#c98) · [Contents](../DECK-DESIGN.md#contents)

`pilot_audit` · packs/chains.json

**Who sees it:** only as a follow-up to [94. Going National](#c94) (any choice: in four years, 85%); [95. Going National](#c95) (any choice: in four years, 85%); [96. Going National](#c96) (any choice: in four years, 85%); when it falls due: up to Permanent Secretary; after [93. One Number](#c93), A (`pilot_flattered`).

Years ago, your pilot of the home visits gave the Minister's speech its best number. The Auditor-General's report now has a paragraph on the national scheme: its budget assumed nineteen points, from the pilot's best month, and it delivered four points. The ministry paid for the difference. The paragraph names nobody yet. The team that ran it is drafting the ministry's reply.

**A. Tell the auditors the number was yours.**

> You write to the auditors that the number was yours. The team that ran the rollout sends you a card, unsigned, which says only "Thanks."

- Hidden: Standing down (−5), Integrity up a lot (+6), Heat down a lot (−6), the ceiling (CEP) up one grade (+1).
- Sets `pilot_told`: named in the Declassified file.
- The peer, if this showing named them: marks `you_owned_the_number`.

**B. Let the reply rest on the evaluation's caveats.**

> The reply cites the caveats and the word "indicative". The auditors accept it, and nobody asks, out loud, who chose the number.

- Hidden: Standing up (+3), Integrity down (−4), Heat up (+5).
- Sets `pilot_caveats`: named in the Declassified file.
- The peer, if this showing named them: marks `left_with_the_number`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 40%: A helps (+3) · B hurts (−3).
- The people who work around you (service, `floor`), 45%, when the part `front` is `handed` or `named` or `team`: A helps (+2) · B hurts (−2).

<details><summary>This card varies (3 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `scheme` (the first option that fits)

- a counter that answers questions about any government payout *(`mof`; when only in the Ministry of Finance)*
  - `place`: community clubs
  - `short`: the payout counters
- advisers who walk into neighbourhood shops and explain the grants *(`mti`; when only in the Ministry of Energy, Trade and Industry)*
  - `place`: towns
  - `short`: the shop visits
- a Sunday counter for salary claims *(`mom`; when only in the Ministry of Manpower)*
  - `place`: dormitories
  - `short`: the Sunday counters
- retired teachers reading with Primary 2 pupils after school *(`moe`; when only in the Ministry of Education)*
  - `place`: schools
  - `short`: the reading programme
- nurses visiting seniors at home in the week after discharge *(`moh`; when only in the Ministry of Health; shown above)*
  - `place`: towns
  - `short`: the home visits
- a scam hotline that calls victims back within the hour *(`mha`; when only in the Ministry of Home Affairs)*
  - `place`: police divisions
  - `short`: the call-backs
- an evening for neighbours in a new housing block to meet before they collect their keys *(`mnd`; when only in the Ministry of National Development)*
  - `place`: towns
  - `short`: the neighbours' evenings
- late-night shuttle buses from train stations to the housing estates *(`mot`; when only in the Ministry of Transport)*
  - `place`: towns
  - `short`: the night shuttles
- nightly collection of hawkers' food waste for composting *(`mse`; when only in the Ministry of Sustainability and the Environment)*
  - `place`: hawker centres
  - `short`: the food-waste collection
- one application form for four assistance schemes *(`msf`; when only in the Ministry of Social and Family Development)*
  - `place`: Social Service Offices
  - `short`: the single form

**Part 2** · `number` (the first option that fits)

- 71%, from three towns picked to like it *(`easy`; when after [92. Pick Three](#c92), A (`pilot_easy`))*
  - `real`: 24%
- 64%, from the best of three towns *(`hard`; when after [92. Pick Three](#c92), B (`pilot_hard`))*
  - `real`: 21%
- nineteen points, from the pilot's best month *(`control`; shown above)*
  - `real`: four points

**Part 3** · `front` (the first option that fits)

- Your division ran it, so the ministry's reply is yours to draft. *(`kept`; when after [94. Going National](#c94), A; [95. Going National](#c95), A (`pilot_kept`))*
  - `a`: Tell the auditors how the number was chosen.
  - `b`: Point the auditors to the evaluation's caveats.
  - `aOut`: Your note to the auditors runs to one page and uses the word "chose" twice. The report blames the evaluation, not its author, and upstairs everyone knows who that is. Your next appraisal says "candour".
  - `bOut`: The reply cites the caveats and the word "indicative". The auditors accept it, and add a sentence about indicative figures that every ministry will have quoted back at it for years.
- Xin Yi's team ran it, and Xin Yi is drafting the ministry's reply. *(`handed`; when after [94. Going National](#c94), B; [95. Going National](#c95), B (`pilot_handed`); the peer (Xin Yi) is the one from [94. Going National](#c94), B; [95. Going National](#c95), B (`given_the_rollout`) and is not the one from [94. Going National](#c94), A; [95. Going National](#c95), A (`lost_the_rollout`) and is not the one from [94. Going National](#c94), C; [95. Going National](#c95), C (`you_kept_the_credit`))*
  - `a`: Tell the auditors the number was yours.
  - `b`: Let Xin Yi's reply rest on the evaluation's caveats.
  - `aOut`: You write to the auditors that the number was yours, not Xin Yi's. Xin Yi reads the copy and rings you, then says nothing for several seconds. That is how Xin Yi says thank you.
  - `bOut`: Xin Yi's reply cites the caveats, as you suggested. It works. Xin Yi does not ask whose number it was, and you notice that Xin Yi does not need to.
- Xin Yi's team ran it, though the Minister's speech thanked yours, and Xin Yi is drafting the ministry's reply. *(`named`; when after [94. Going National](#c94), C; [95. Going National](#c95), C (`pilot_named`); the peer (Xin Yi) is the one from [94. Going National](#c94), C; [95. Going National](#c95), C (`you_kept_the_credit`) and is not the one from [94. Going National](#c94), A; [95. Going National](#c95), A (`lost_the_rollout`) and is not the one from [94. Going National](#c94), B; [95. Going National](#c95), B (`given_the_rollout`))*
  - `a`: Tell the auditors the number was yours.
  - `b`: Let Xin Yi's reply rest on the evaluation's caveats.
  - `aOut`: You write to the auditors that the number was yours, not Xin Yi's. Xin Yi reads the copy, and that evening rings you about nothing much, which has not happened since the speech.
  - `bOut`: Xin Yi's reply cites the caveats, and thanks your division for the design. You have never received a more precisely worded thank-you.
- The team that ran it is drafting the ministry's reply. *(`team`; shown above)*
  - `a`: Tell the auditors the number was yours.
  - `b`: Let the reply rest on the evaluation's caveats.
  - `aOut`: You write to the auditors that the number was yours. The team that ran the rollout sends you a card, unsigned, which says only "Thanks."
  - `bOut`: The reply cites the caveats and the word "indicative". The auditors accept it, and nobody asks, out loud, who chose the number.

</details>

[← 96](#c96) · [Next → 98](#c98) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c98"></a>98. The Paragraph

[← 97](#c97) · [Next → 99](#c99) · [Contents](../DECK-DESIGN.md#contents)

`pilot_audit_clean` · packs/chains.json

**Who sees it:** fires instead of [97. The Paragraph](#c97) when that card falls due and this one's conditions hold (the first version that fits); when it falls due: up to Permanent Secretary; not after [93. One Number](#c93), A (`pilot_flattered`).

Years ago you ran the pilot of the home visits. The Auditor-General's report now has a paragraph on the national scheme: take-up came within two points of your evaluation's forecast, "which set realistic projections". Nobody in the ministry can remember an audit paragraph with no recommendation in it.

**A. Send it to everyone who worked on the pilot, by name.**

> Eleven officers get the paragraph with their names above it. Two print it. One, years later, puts it on the first slide of a talk about evaluation, and credits you second.

- Hidden: Standing down a little (−1), Reputation up a little (+2), Integrity up (+4).
- Sets `pilot_shared`: named in the Declassified file.

**B. Send it upstairs, with a short note of your own.**

> Your note is three lines long and never uses the word "I". It does not need to. The paragraph comes up in the next ranking, and so do you.

- Hidden: Standing up (+4), Integrity down a little (−2), the ceiling (CEP) up one grade (+1).
- Sets `pilot_noted`: named in the Declassified file.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 45%: A helps (+2) · B hurts (−2).
- The ranking panel (service, `panel`), 30%: A hurts (−2) · B helps (+2).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `scheme` (the first option that fits)

- a counter that answers questions about any government payout *(`mof`; when only in the Ministry of Finance)*
  - `place`: community clubs
  - `short`: the payout counters
- advisers who walk into neighbourhood shops and explain the grants *(`mti`; when only in the Ministry of Energy, Trade and Industry)*
  - `place`: towns
  - `short`: the shop visits
- a Sunday counter for salary claims *(`mom`; when only in the Ministry of Manpower)*
  - `place`: dormitories
  - `short`: the Sunday counters
- retired teachers reading with Primary 2 pupils after school *(`moe`; when only in the Ministry of Education)*
  - `place`: schools
  - `short`: the reading programme
- nurses visiting seniors at home in the week after discharge *(`moh`; when only in the Ministry of Health; shown above)*
  - `place`: towns
  - `short`: the home visits
- a scam hotline that calls victims back within the hour *(`mha`; when only in the Ministry of Home Affairs)*
  - `place`: police divisions
  - `short`: the call-backs
- an evening for neighbours in a new housing block to meet before they collect their keys *(`mnd`; when only in the Ministry of National Development)*
  - `place`: towns
  - `short`: the neighbours' evenings
- late-night shuttle buses from train stations to the housing estates *(`mot`; when only in the Ministry of Transport)*
  - `place`: towns
  - `short`: the night shuttles
- nightly collection of hawkers' food waste for composting *(`mse`; when only in the Ministry of Sustainability and the Environment)*
  - `place`: hawker centres
  - `short`: the food-waste collection
- one application form for four assistance schemes *(`msf`; when only in the Ministry of Social and Family Development)*
  - `place`: Social Service Offices
  - `short`: the single form

</details>

[← 97](#c97) · [Next → 99](#c99) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c99"></a>99. The Paragraph

[← 98](#c98) · [Next → 100](#c100) · [Contents](../DECK-DESIGN.md#contents)

`pilot_audit_pol` · packs/chains.json

**Who sees it:** fires instead of [97. The Paragraph](#c97) when that card falls due and this one's conditions hold (the first version that fits); when it falls due: Member of Parliament and up; after [93. One Number](#c93), A (`pilot_flattered`).

Years ago, as a civil servant, you sent a flattering number from your pilot into a Minister's speech. The Auditor-General's report now traces an expensive shortfall in the national scheme to that number. Rajesh Nair, the Straits Times journalist, has found your name in the file, and wants a comment by six.

**A. Say the number was yours, and so was the choice.**

> The piece runs with your quote in the fourth paragraph. Your old ministry sends a short, slightly surprised thank-you. Someone in the party reads the piece twice, and writes something down.

- Hidden: Standing down (−4), Reputation up a little (+2), Integrity up (+5), Heat down (−5), the ceiling (CEP) up one grade (+1).
- Sets `pilot_told`: named in the Declassified file.

**B. Say the ministry will respond in due course.**

> The ministry does respond, eventually. The piece runs without your quote but with your name: the author of the number, who "did not respond to queries".

- Hidden: Standing up (+3), Reputation down a little (−2), Heat up (+4).
- Sets `pilot_caveats`: named in the Declassified file.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The press gallery (politics, `pressGallery`), 45%: A helps (+2) · B hurts (−2).
- The civil servants who work with you (politics, `officials`), 35%: A helps (+2) · B hurts (−2).

[← 98](#c98) · [Next → 100](#c100) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c100"></a>100. The Paragraph

[← 99](#c99) · [Next → 101](#c101) · [Contents](../DECK-DESIGN.md#contents)

`pilot_audit_clean_pol` · packs/chains.json

**Who sees it:** fires instead of [97. The Paragraph](#c97) when that card falls due and this one's conditions hold (the first version that fits); when it falls due: Member of Parliament and up; not after [93. One Number](#c93), A (`pilot_flattered`).

Years ago, as a civil servant, you ran the pilot of a scheme that has since gone national. The Auditor-General's report praises the scheme for forecasting its own take-up almost exactly, from your pilot's evaluation. Rajesh Nair, the Straits Times journalist, has found your name in the file, and is writing it up for Sunday.

**A. Give a quote, and name the team that ran it.**

> The piece runs on Sunday with eleven officers' names in it, which the ministry's communications team would not have allowed, and cannot now undo.

- Hidden: Standing down a little (−1), Reputation up (+3), Integrity up (+3).
- Sets `pilot_shared`: named in the Declassified file.

**B. Give a quote about what the evaluation taught you.**

> The piece runs on Sunday as a profile, with a photograph of you at a coffee shop that has nothing to do with the scheme. The officers who ran it read it on their phones.

- Hidden: Standing up a little (+1), Reputation up (+5), Integrity down a little (−2).
- Sets `pilot_noted`: named in the Declassified file.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The civil servants who work with you (politics, `officials`), 45%: A helps (+2) · B hurts (−2).
- The press gallery (politics, `pressGallery`), 30%: A hurts (−1) · B helps (+1).

[← 99](#c99) · [Next → 101](#c101) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c101"></a>101. A Year Away

[← 100](#c100) · [Next → 102](#c102) · [Contents](../DECK-DESIGN.md#contents)

`bond_masters` · packs/chains.json · once a career · weight 12

**Who sees it:** Assistant Director to Director; aged 26 to 28; President's Scholar only; only while the scholarship bond runs.

**Shares a decision** (`private_offer`) with [#73](#c73), [#138](#c138), [#177](05-politics.md#c177), [#178](05-politics.md#c178): a career sees only one.

The Public Service Division offers to sponsor a master's degree for you: a year at Harvard's Kennedy School of Government, with fees and an allowance paid. It comes with a bond of its own: two more years in the service, served after your scholarship bond ends. Leaving before then would mean paying back the cost, with damages.

**A. Go. Sign for the extra two years.**

> Twelve months, officials from forty countries, and a seminar in which you are asked to explain Singapore. You come back with a master's, two more years on your bond, and someone else in your old job.

- Hidden: Competence up a lot (+6), Standing down (−3), Reputation up a little (+1).
- Sets `bond_met`: named in the Declassified file.
- Sets `bond_extended`: named in the Declassified file; read by [#102](#c102), [#103](#c103).
- Adds two years to the scholarship bond.
- ↳ Can lead to: [102. The Bank](#c102), in two years, 85%

**B. Decline. Your division needs you this year.**

> Upstairs is grateful, in a way that lasts exactly one year. The offer is not repeated. The division, it turns out, did need you, though not as much as it said.

- Hidden: Competence down a little (−2), Standing up (+5), Integrity up a little (+1).
- Sets `bond_met`: named in the Declassified file.
- Sets `bond_declined`: read by [#103](#c103).
- ↳ Can lead to: [102. The Bank](#c102), in two years, 85%

**C. Do a master's part-time, at night, on your own money.**

> Two years of evenings, \$40,000 of your own, and not one year added to your bond. The degree is the same degree. Nobody at work asks about it, which was most of the point.

- Hidden: Competence up (+5), Standing down a little (−1), Integrity up a little (+2).
- Sets `bond_met`: named in the Declassified file.
- Sets `bond_own`: named in the Declassified file.
- ↳ Can lead to: [102. The Bank](#c102), in two years, 85%

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The ranking panel (service, `panel`), 35%: A hurts (−1) · B helps (+2) · C hurts (−1).
- The people who work around you (service, `floor`), 30%: A hurts (−1) · B helps (+1).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `school`

- Harvard's Kennedy School of Government *(`kennedy`; shown above)*
- Oxford's Blavatnik School of Government *(`blavatnik`)*

</details>

[← 100](#c100) · [Next → 102](#c102) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c102"></a>102. The Bank

[← 101](#c101) · [Next → 103](#c103) · [Contents](../DECK-DESIGN.md#contents)

`bond_bank` · packs/chains.json

**Who sees it:** only as a follow-up to [101. A Year Away](#c101) (any choice: in two years, 85%); when it falls due: up to Permanent Secretary; President's Scholar only; only while the scholarship bond runs.

You're still serving your scholarship bond, so leaving the service now means paying damages to PSC, the Public Service Commission that paid for your degree, for the years you haven't served. A bank wants you by March, and will pay those damages in full, for all the years left, and call it a signing bonus. Your bond deed also carries the signatures of two sureties, usually family, who promised to pay PSC themselves if you broke it.

**A. Let the bank pay. Resign in March.**

> The bank's cheque matches the damages to the dollar. Your resignation is accepted in one line, and the farewell email from upstairs is warmer than you expected, and shorter.

- Hidden: Heat down (−3).
- Sets `bond_bought`: named in the Declassified file.
- Leaves for the private sector: the career ends, with fees of twice the grade's pay for each year to retirement (3 to 10 years), after tax.
- ↳ Can lead to: [The Consultancy](09-endings.md#end-consultancy)

**B. Decline. A deed is a deed.**

> You decline in two lines, and keep the bank's letter in a drawer. The offer stands until June, when a younger officer takes it. You hear about that at a wedding.

- Hidden: Standing up a little (+2), Integrity up (+5).
- Sets `bond_kept`: named in the Declassified file; read by [#103](#c103), [#104](#c104).
- ↳ Can lead to: [103. Your Scholar](#c103), in eight years, 85% (or, at another grade, [#104](#c104))

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `left` (the first option that fits)

- the two master's years included *(`extended`; when after [101. A Year Away](#c101), A (`bond_extended`))*
- for all the years left *(`left`; shown above)*

</details>

[← 101](#c101) · [Next → 103](#c103) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c103"></a>103. Your Scholar

[← 102](#c102) · [Next → 104](#c104) · [Contents](../DECK-DESIGN.md#contents)

`bond_mentor` · packs/chains.json

**Who sees it:** only as a follow-up to [102. The Bank](#c102) (B: in eight years, 85%); when it falls due: up to Permanent Secretary; President's Scholar only; after [102. The Bank](#c102), B (`bond_kept`).

Years ago a bank offered to pay off your scholarship bond, and you said no. Since then PSC has made you a mentor to one of its scholars, now three years into a six-year bond. Your scholar asks to meet: a bank has offered to pay off that bond too, and wants an answer by Friday. Your scholar wants to know what you did.

**A. Tell the truth about what you did, and stop there.**

> You tell it plainly: the bank, the letter, the master's you paid for at night so the bond would not grow. Your scholar writes that down, and underlines it.

- Hidden: Standing down a little (−1), Integrity up (+4).
- Sets `bond_told`.

**B. Tell your scholar to stay.**

> You make the case for staying, with your night classes as proof it can be done. Your scholar stays, and enrols in the same programme, at the same hour.

- Hidden: Standing up (+4), Integrity down a little (−2).
- Sets `bond_said_stay`.

**C. Tell your scholar to take it.**

> You say what nobody at PSC says: it is a contract, and the bank is paying. Your scholar resigns in March. PSC thanks you for your time as a mentor, in writing.

- Hidden: Standing down (−5), Reputation up a little (+2), Integrity up a little (+1).
- Sets `bond_said_go`: named in the Declassified file.

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `past` (the first option that fits)

- *Read with this option (`extended`; when after [101. A Year Away](#c101), A (`bond_extended`)):*

  **Your Scholar**

  Years ago a bank offered to pay off your scholarship bond, and you said no. Since then PSC has made you a mentor to one of its scholars, now three years into a six-year bond. Your scholar asks to meet: a bank has offered to pay off that bond too, and wants an answer by Friday. Your scholar wants to know what you did.

  **A. Tell the truth about what you did, and stop there.**

  > You tell it plainly: the bank, the letter, the two years added for a master's, eight years of bond in all. Your scholar listens, thanks you, and does not say which way that pointed.

  **B. Tell your scholar to stay.**

  > You make the case for staying, with your own master's as Exhibit A. Your scholar stays, and asks, a month later, how one applies for the sponsorship.

  **C. Tell your scholar to take it.**

  > You say what nobody at PSC says: it is a contract, and the bank is paying. Your scholar resigns in March. PSC thanks you for your time as a mentor, in writing.

- *Read with this option (`declined`; when after [101. A Year Away](#c101), B (`bond_declined`)):*

  **Your Scholar**

  Years ago a bank offered to pay off your scholarship bond, and you said no. Since then PSC has made you a mentor to one of its scholars, now three years into a six-year bond. Your scholar asks to meet: a bank has offered to pay off that bond too, and wants an answer by Friday. Your scholar wants to know what you did.

  **A. Tell the truth about what you did, and stop there.**

  > You tell it plainly: the bank, the letter, the master's you turned down because your division needed you that year. Your scholar asks whether it did. You say: that year.

  **B. Tell your scholar to stay.**

  > You make the case for staying, and leave out the master's you turned down. Your scholar stays. The bank hires someone else by June, as banks do.

  **C. Tell your scholar to take it.**

  > You say what nobody at PSC says: it is a contract, and the bank is paying. Your scholar resigns in March. PSC thanks you for your time as a mentor, in writing.

- *The text above.* *(`own`)*

</details>

[← 102](#c102) · [Next → 104](#c104) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c104"></a>104. Your Old School

[← 103](#c103) · [Next → 105](#c105) · [Contents](../DECK-DESIGN.md#contents)

`bond_mentor_pol` · packs/chains.json

**Who sees it:** fires instead of [103. Your Scholar](#c103) when that card falls due and this one's conditions hold (the first version that fits); when it falls due: Member of Parliament and up; President's Scholar only; after [102. The Bank](#c102), B (`bond_kept`).

Years ago you turned down a bank that offered to pay off your scholarship bond, and served the bond in full. Now your old school has asked you, as a former student in Parliament, to talk to its final-year students about scholarships. The question they sent in most often, the principal writes, is about the bond.

**A. Tell them about the bank's letter, and why you said no.**

> You tell them about the letter and the deed, and the hall goes quiet in the right way. Three students ask about the bank afterwards. One asks which bank.

- Hidden: Standing down a little (−1), Reputation up (+3), Integrity up a little (+2).
- Sets `bond_told`.

**B. Tell them the bond is the best deal they will ever sign.**

> You make the case, and it is a good one. The principal thanks you warmly. A student in the front row writes "best deal" on the back of a hand.

- Hidden: Standing up (+4), Reputation up a little (+1), Integrity down (−3).
- Sets `bond_said_stay`.

**C. Leave the bond out. Talk about the work.**

> You talk about budgets, lifts and a scheme that failed properly, for forty minutes. The question about the bond comes anyway, at the end, and you answer it in a sentence.

- Hidden: Competence up a little (+2), Reputation down a little (−2), Integrity up a little (+1).
- Sets `bond_said_work`.

[← 103](#c103) · [Next → 105](#c105) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c105"></a>105. The Budget Round

[← 104](#c104) · [Next → 106](#c106) · [Contents](../DECK-DESIGN.md#contents)

`budget_round` · events.json · can come back · weight 9

**Who sees it:** Deputy Director to Deputy Secretary.

**Series** `budget_round`: shown in full once a career, then its years pass by themselves on the habit; a card whose Meanwhile lines are spent is not drawn again.

**A Meanwhile year with no habit:** Competence up a little (+2), Standing up a little (+1).

It's budget season, and you're bidding for what your division needs next year: eleven more officers and a new system. The ministry's total budget, you're told, won't grow at all. Every other division has been told the same, and every other bid is also for eleven of something.

**A. Bid big and justify every line.**

> You get four officers and half a system, as you expected. You bid for eleven precisely so that four would look like a compromise.

- Hidden: Competence up (+5), Standing up a little (+2).
- Habit: `big`.

**B. Bid exactly what you need.**

> You get seventy per cent of exactly what you needed, because the process assumes everyone pads their bid, and punishes you for not padding.

- Hidden: Competence up (+3), Standing down (−3), Integrity up a lot (+6).
- Habit: `exact`.

**C. Don't bid. Absorb the extra work within your existing budget.**

> Everyone above you is delighted. Your officers do the work of eleven people for three years, and two of them leave.

- Hidden: Competence down (−4), Standing up (+5), Reputation down a little (−2).
- Habit: `absorb`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 50%: A helps (+1) · B helps (+1) · C hurts (−3).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: A helps (+1) · B hurts (−1) · C helps (+2).

<details><summary>Other versions (3)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2: One Per Cent*

The Ministry of Finance has taken one per cent off every ministry's budget, its own included, and put it in a pot that ministries must bid for, for "new and emerging priorities". Your division needs eleven officers and a system, and since Tuesday that need has been new and emerging.

**A. Bid for all eleven, with a page per officer.**

> Eleven pages, one per officer, each describing the work that officer would do. You get four back, and a note praising the pages from the people who cut them.

**B. Bid for exactly the gap, and say so.**

> You bid for the gap and not a dollar more. Everyone else padded, the pot is oversubscribed, and you're funded at sixty per cent of an honest number.

**C. Let the one per cent go.**

> You absorb the cut within your existing budget. Your one per cent funds someone else's new and emerging priority. Two years later that priority is merged into your division, without its officers.

---

*Version 3: Five Minutes*

At the Permanent Secretary's budget meeting, every division's bid is on one screen, and together they add up to twice what the ministry has. Each division gets five minutes to defend its bid before the cuts are decided. Yours, for eleven officers and a system, is ninth.

**A. Bid big, and use every one of the five minutes.**

> Five minutes, eleven officers, every line defended. On the spot, the Permanent Secretary trims you to four, before anyone further up can do worse, and calls it protecting you.

**B. Bid exactly what you need, in two minutes.**

> You finish in two minutes. The room is so surprised that the next division overruns by six. You're funded at two-thirds, the same as everyone who padded.

**C. Withdraw the bid, and give back the five minutes.**

> The meeting ends five minutes early, and the Permanent Secretary thanks you for it by name. Your people carry the extra work for two years, and one of them leaves over it.

---

*Version 4: Tab 9*

This year's budget bid is a spreadsheet with fourteen tabs. Tab 9 is called Savings Identified, and the spreadsheet won't submit while it's blank. Your division is bidding for eleven officers and a system, and so far its savings are nil. The deadline is Friday.

**A. Fill tab 9 with savings you can defend, then bid big.**

> Tab 9 finds savings in printing, travel and a hotline nobody calls. Tabs 10 to 14 spend them twice over. The bid is trimmed to four officers, as everyone expected.

**B. Bid what you need, and leave tab 9 honest.**

> Tab 9 says nil, with a note explaining why. The spreadsheet won't accept a nil, so IT enters a zero for you and the note is lost. The bid is funded at two-thirds.

**C. Close the spreadsheet. Absorb the work within your existing budget.**

> No bid, no tab 9. The year-end summary lists your division under "units not requiring additional resources", in a slightly larger font than the others.

</details>

<details><summary>Meanwhile lines (12)</summary>

A year that passes by itself on the habit shows one line, never the same one twice in a career.

**Habit A, `big`**

- In the budget round you bid for eleven officers and get four: the reason you bid for eleven.
- Budget season: every line justified, footnoted and cut by a third, as planned.
- You bid big again, defend every line, and are cut back to the number you had in mind all along.
- In the budget round you bid for eleven officers and a system, and get only the system, which needs eleven officers.

**Habit B, `exact`**

- You bid for exactly what you need and get two-thirds of it, described to you as a good outcome.
- Your bid is honest and the budget is flat, and when the two meet in a spreadsheet, the spreadsheet wins.
- An honest bid, funded at two-thirds again, with thanks for the realism of your projections.
- Your exact bid is cut by a third, because every bid is cut by a third, and yours was exact.

**Habit C, `absorb`**

- You make do within your existing budget again, and a note of thanks arrives: the only increase you get.
- Budget season, no bid again, and you learn one more polite way to say "we will absorb it".
- No bid again. Your people absorb the extra work with you, and one of them updates a LinkedIn profile.
- You absorb the extra work so quietly that next year's budget is smaller, as a vote of confidence.

</details>

[← 104](#c104) · [Next → 106](#c106) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c106"></a>106. Committee of Supply

[← 105](#c105) · [Next → 107](#c107) · [Contents](../DECK-DESIGN.md#contents)

`cos_speech` · events.json · once a career · weight 9

**Who sees it:** Deputy Director to Deputy Secretary.

**Shares a decision** (`announce`) with [#58](01-first-years.md#c58), [#92](#c92): a career sees only one.

It's Committee of Supply season, when each Minister defends the ministry's budget in Parliament. The Minister has eight minutes and wants one new thing to announce from your division. Your division has nothing ready, and nobody in the meeting wants to be the one who says so.

**A. Offer the pilot you've been quietly building.**

> It's eighteen months from ready, and it's announced as if it were four. You spend the next eighteen months making the announcement true after the fact, and you mostly manage it.

- Hidden: Competence up a lot (+8), Standing up a lot (+8), Reputation up a lot (+6), Heat up (+5).

**B. Rebrand an existing scheme with a new name and a higher number.**

> The old scheme is announced as the "Enhanced" scheme, with a bigger number in front of it. The coverage is kind. Nothing is gained, nobody is harmed, and you suspect that's most of what happens here.

- Hidden: Competence down (−3), Standing up a lot (+6), Integrity down a lot (−8).
- Sets `rebranded_scheme`: in the Folder the background check reads.
- ↳ Can lead to: [107. Two Names](#c107), in three years, 70%

**C. Tell the Minister there is nothing, and say so early.**

> The Minister is annoyed for a day and grateful for a year, because the alternative was being annoyed in Parliament. Your division announces nothing, and the Minister remembers both the day and the year.

- Hidden: Competence up (+4), Standing down a lot (−8), Integrity up a lot (+12), this year's appraisal marked down (−10, said on screen).
- ↳ Can lead to: [108. The Thing Nobody Announced](#c108), in two years, 50%

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The Minister's office (service, `ministersOffice`), 45%: A hurts (−1) · B helps (+1) · C helps (+2).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: A helps (+2) · B hurts (−3) · C hurts (−2).

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2: Paragraph 14*

The Minister's budget speech for the Committee of Supply has a gap at paragraph 14, marked \[ANNOUNCEMENT: DIVISION TO PROVIDE\]. Your division is the division. The draft goes to the Minister on Friday, and there's nothing new to put in it.

**A. Fill paragraph 14 with the pilot you've been building.**

> Paragraph 14 promises the pilot "from next year". It needs two. You spend both making paragraph 14 true, and in the end the printed record of the speech is right, a little late.

**B. Fill it with an old scheme, renamed and Enhanced.**

> Paragraph 14 introduces the Enhanced scheme: the old one, with a larger number in front of it. It reads well. Nothing changes, and it's reported as a change.

**C. Send paragraph 14 back empty, with a note saying why.**

> The Minister reads the note on Friday, is irritated all weekend, and on Monday cuts paragraph 14. The speech runs a minute shorter, and the Minister remembers whose minute it was.

---

*Version 3: The Rehearsal*

A week before the Committee of Supply debate, the Minister rehearses the budget speech aloud in the boardroom while the press secretary times it. At your division's page the Minister stops, reads it twice, and asks the room what, exactly, is new. Everyone looks at you.

**A. Answer with the pilot, though it isn't ready.**

> You describe the pilot as rather further along than it is. The Minister likes it, and it's in the speech by evening. The next two years are spent catching up with that evening.

**B. Answer with an old scheme, newly Enhanced.**

> "An Enhanced scheme, Minister." The press secretary writes it down. The coverage is warm and calls it new. Apart from its name, nothing about it is.

**C. Answer that nothing is new, and nothing should be dressed up as new.**

> The room goes very still. The Minister finishes the rehearsal without your page, thanks everyone, and leaves without looking at you. On the day, the speech runs seven minutes, not eight.

</details>

[← 105](#c105) · [Next → 107](#c107) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c107"></a>107. Two Names

[← 106](#c106) · [Next → 108](#c108) · [Contents](../DECK-DESIGN.md#contents)

`two_names` · events.json

**Who sees it:** only as a follow-up to [106. Committee of Supply](#c106) (B: in three years, 70%).

The "Enhanced" scheme your division announced at Committee of Supply was an old scheme renamed, so the Minister had something new to say. Rajesh Nair, the Straits Times journalist, has now noticed that it has the same budget, the same rules and the same hotline as the scheme it replaced, and would like to know which name people should use when they call.

**A. Say both names are correct.**

> Mr Nair prints that both names are correct. It reads exactly as well as it sounds.

- Hidden: Standing up (+3), Reputation down (−4), Integrity down (−3).
- The journalist, if this showing named them: marks `you_dodged`.

**B. Say it's the same scheme, renamed, and explain what changed.**

> What changed was the word "Enhanced", and you say so. The headline is "Only the name has changed, says Ms Lim", and the piece is, against all expectation, quite kind.

- Hidden: Standing down (−5), Reputation up (+3), Integrity up a lot (+6), Heat down a lot (−6).
- The journalist, if this showing named them: marks `you_were_straight`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The Minister's office (service, `ministersOffice`), 45%: A helps (+2) · B hurts (−2).
- The press gallery (politics, `pressGallery`), 40%: A hurts (−2) · B helps (+2).
- The party's leadership and the Prime Minister's office (politics, `leadership`), 35%: A helps (+2) · B hurts (−2).

[← 106](#c106) · [Next → 108](#c108) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c108"></a>108. The Thing Nobody Announced

[← 107](#c107) · [Next → 109](#c109) · [Contents](../DECK-DESIGN.md#contents)

`cos_vindicated` · events.json · a standout moment, whichever choice (in the service)

**Who sees it:** only as a follow-up to [106. Committee of Supply](#c106) (C: in two years, 50%); when it falls due: up to Deputy Secretary.

When your division had nothing ready for the Committee of Supply, you told the Minister so early, and the Minister announced nothing. Now every ministry that did announce something is explaining delays. Your Minister is the only one who isn't, and has noticed why.

**A. Bring the Minister the pilot, now that it's ready.**

> It's announced at the next Committee of Supply, on time and as described. The Minister mentions your division by name, something Ministers almost never do.

- Hidden: Competence up (+3), Standing up a lot (+8), the ceiling (CEP) up two grades (+2).

**B. Say nothing. Let the Minister draw the conclusion.**

> The Minister draws it. When the Permanent Secretary next asks which divisions the Minister rates, yours is named first, in front of the person who writes your ranking.

- Hidden: Standing up (+5), Integrity up (+4), the ceiling (CEP) up one grade (+1).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The Minister's office (service, `ministersOffice`), 40%: A helps (+2) · B hurts (−2).

[← 107](#c107) · [Next → 109](#c109) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c109"></a>109. The Engagement Exercise

[← 108](#c108) · [Next → 110](#c110) · [Contents](../DECK-DESIGN.md#contents)

`dialogue_session` · events.json · once a career · weight 9

**Who sees it:** Deputy Director to Senior Director.

You're writing the report on a national conversation: forty sessions, eleven hundred citizens, and a launch already booked. The report was designed around three pillars the Minister announced in advance. The feedback is overwhelmingly about the cost of living, and it fits none of them.

**A. Add a fourth pillar.**

> The design is spoiled and the report is true. It's published with the fourth pillar looking slightly bolted on, because it was, because it had to be.

- Hidden: Competence up a lot (+7), Standing down (−4), Integrity up a lot (+8).

**B. Distribute the feedback across the three existing pillars.**

> It fits beautifully, and the launch goes well. Somewhere in a file is the spreadsheet of what eleven hundred people actually said. It isn't the report, and you're the only one who has read both.

- Hidden: Competence down a little (−2), Standing up a lot (+8), Integrity down a lot (−9).
- Sets `smoothed_feedback`: in the Folder the background check reads.
- ↳ Can lead to: [110. The Raw Data](#c110), in four years, 70%

**C. Publish the raw feedback alongside the report.**

> Nobody has done it before. After a fortnight of nervous meetings at three levels, it's allowed. It becomes the most-read government document of the year, and the people who had to approve it don't thank you for the fortnight.

- Hidden: Standing down a lot (−10), Reputation up a lot (+9), Integrity up a lot (+14), Heat up a lot (+8), this year's appraisal marked down (−10, said on screen).
- Sets `raw_feedback`: counts toward Legacy.
- ↳ Can lead to: [111. The Raw Feedback](#c111), in three years, 50% · [Everything Surfaced](09-endings.md#end-scandal)

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The Minister's office (service, `ministersOffice`), 40%: A hurts (−2) · B helps (+2) · C hurts (−3).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: A helps (+3) · B hurts (−2).
- The ranking panel (service, `panel`), 30%: C helps (+3).

[← 108](#c108) · [Next → 110](#c110) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c110"></a>110. The Raw Data

[← 109](#c109) · [Next → 111](#c111) · [Contents](../DECK-DESIGN.md#contents)

`raw_data` · events.json

**Who sees it:** only as a follow-up to [109. The Engagement Exercise](#c109) (B: in four years, 70%); when it falls due: up to Deputy Secretary.

When you wrote up the national conversation, you spread its feedback across three pillars, though most of it was about the cost of living. Now a think tank has asked, politely, for the raw feedback. The spreadsheet is still in a file, and it still doesn't fit three pillars.

**A. Release it.**

> The think tank's paper observes, politely, that the feedback and the report describe two different countries. Days later the Permanent Secretary asks why you released it. You say it was asked for. That, you're told, isn't usually the reason.

- Hidden: Standing down a lot (−6), Reputation up (+3), Integrity up a lot (+8), Heat down a lot (−6).

**B. Send the report again, with a covering note.**

> Your covering note is very good. The think tank thanks you for the report, which it already had, and files a formal request for the data instead.

- Hidden: Standing up (+4), Integrity down (−5), Heat up a lot (+6).
- ↳ Can lead to: [Everything Surfaced](09-endings.md#end-scandal)

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 35%: A helps (+2) · B hurts (−2).
- The office a confidential paper or decision belongs to (service, `owner`), 35%: A hurts (−2) · B helps (+2).

[← 109](#c109) · [Next → 111](#c111) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c111"></a>111. The Raw Feedback

[← 110](#c110) · [Next → 112](#c112) · [Contents](../DECK-DESIGN.md#contents)

`dialogue_vindicated` · events.json · a standout moment, whichever choice (in the service)

**Who sees it:** only as a follow-up to [109. The Engagement Exercise](#c109) (C: in three years, 50%); when it falls due: up to Deputy Secretary.

A think tank has analysed the raw feedback you published alongside your national conversation report, back when nobody had done that. Its paper is quoted approvingly in Parliament by both sides. It reaches you from the Permanent Secretary's office, forwarded with no comment at all, which from that office is a great deal of comment.

**A. Reply with one line.**

> "Thank you. It was their feedback." The reply comes back within a minute, which nobody on your floor has ever seen the Permanent Secretary do.

- Hidden: Standing up a lot (+6), the ceiling (CEP) up two grades (+2).

**B. Write the follow-up nobody asked for.**

> The next national conversation uses your follow-up as its template, and this time nobody announces the pillars until the feedback is in.

- Hidden: Competence up a lot (+8), Reputation up a lot (+6), the ceiling (CEP) up one grade (+1).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 35%: A hurts (−1) · B helps (+2).
- The ranking panel (service, `panel`), 30%: A helps (+1) · B hurts (−2).

[← 110](#c110) · [Next → 112](#c112) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c112"></a>112. The Pingat

[← 111](#c111) · [Next → 113](#c113) · [Contents](../DECK-DESIGN.md#contents)

`national_day_award` · events.json · once a career · weight 7

**Who sees it:** Deputy Director to Senior Director.

**Shares a decision** (`share_credit`) with [#193](06-cabinet.md#c193), [#63](01-first-years.md#c63): a career sees only one.

This year's National Day Awards, the honours the state gives out every August, include you: a Pingat, the entry-level medal, for the scheme your division delivered. You led it, so your name went on the nomination. Your team, who did most of the work, are not on the list. Your family is already practising how to say "Pingat".

**A. Accept, and bring your family to the investiture.**

> Your family dresses as if for a wedding and photographs everything, including the carpet. You realise afterwards that it was the best day they have had in years, and it cost you nothing.

- Hidden: Standing up (+4), Reputation up a lot (+6), Integrity up (+3).

**B. Accept, and ask that your team be recognised too.**

> You are told this year's list is fixed. So at the division meeting you give your team the credit, by name. A mention is not a medal, and everyone knows it, but it still lands.

- Hidden: Standing up (+5), Reputation up (+4), Integrity up a lot (+10).
- Sets `team_recognised`: counts toward Legacy.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 50%: A hurts (−3) · B helps (+3).
- The ranking panel (service, `panel`), 30%: A helps (+1) · B hurts (−1).

[← 111](#c111) · [Next → 113](#c113) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c113"></a>113. The Reorganisation

[← 112](#c112) · [Next → 114](#c114) · [Contents](../DECK-DESIGN.md#contents)

`reorg` · events.json · once a career · weight 8

**Who sees it:** Deputy Director to Senior Director.

**Shares a decision** (`one_slot`) with [#74](#c74), [#211](07-batchmate.md#c211): a career sees only one.

Your division is being moved to another ministry. The new org chart has one fewer director-level box than the old one, and the two people in line for the good box are you and Xin Yi, who joined the service with you. Your nine officers need new postings too, and HR will settle whichever case is pushed first.

**A. Fight for your people's postings first.**

> You place all nine of your officers before you place yourself, and Xin Yi gets the good box. The nine know exactly what you did, and the sharpest of them, a young assistant director, will one day be in a position to repay it.

- Hidden: Competence up (+3), Standing down a lot (−6), Reputation up a lot (+6), Integrity up a lot (+12).
- Sets `protected_team`: counts toward Legacy.
- The peer, if this showing named them: marks `got_the_box` (read by [#65](01-first-years.md#c65)).
- ↳ Can lead to: [114. The Promotion Board](#c114), in six years, 85%

**B. Secure the good box for yourself first.**

> You get the box, a week before Xin Yi would have. Your nine are placed adequately, and the division's manner towards you changes in a way nobody ever says out loud. Xin Yi congratulates you in writing.

- Hidden: Standing up a lot (+8), Reputation down (−5), Integrity down a lot (−12).
- Sets `grabbed_box`: in the Folder the background check reads.
- The peer, if this showing named them: marks `lost_the_box` (read by [#115](#c115)); marks `fell_out` (read by [#31](01-first-years.md#c31), [#65](01-first-years.md#c65)).
- ↳ Can lead to: [115. The Budget Committee](#c115), in five years, 75%

**C. Volunteer to run the transition.**

> Nine months of thankless plumbing: files, systems, seating plans. It goes unusually smoothly, so nobody notices, except the two people whose opinion of you decides your next five years.

- Hidden: Competence up a lot (+9), Standing up a lot (+6), the ceiling (CEP) up one grade (+1).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 55%: A helps (+4) · B hurts (−4).
- The officer who countersigns your appraisal (service, `countersigner`), 40%: A hurts (−1) · B hurts (−2) · C helps (+3).
- The ranking panel (service, `panel`), 30%: A hurts (−1) · B helps (+2) · C hurts (−1).

[← 112](#c112) · [Next → 114](#c114) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c114"></a>114. The Promotion Board

[← 113](#c113) · [Next → 115](#c115) · [Contents](../DECK-DESIGN.md#contents)

`promotion_board` · events.json

**Who sees it:** only as a follow-up to [113. The Reorganisation](#c113) (A: in six years, 85%); when it falls due: up to Deputy Secretary.

**Shares a decision** (`declare`) with [#121](#c121), [#199](06-cabinet.md#c199): a career sees only one.

Years ago, when your division was moved to another ministry, you fought for your nine officers' postings before your own. The sharpest of them, then a young assistant director, is a Director now, and sits on the four-person board deciding your promotion. No interest has been declared, because the form has no box for gratitude.

**A. Ask HR whether this needs declaring.**

> HR checks its guidance, which covers family, money and former employers but not gratitude, and to be safe replaces your old officer with someone who has never heard of you. The board is very fair. You find this less comforting than you expected.

- Hidden: Standing down a little (−2), Integrity up a lot (+8).

**B. Say nothing. It isn't a conflict; it's a memory.**

> Your old officer says very little in the board itself, having said it all at lunch beforehand, to the chair, in one sentence about a reorganisation.

- Hidden: Standing up (+5), Integrity down (−4), the ceiling (CEP) up one grade (+1).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The ranking panel (service, `panel`), 30%: A helps (+2) · B hurts (−2).

[← 113](#c113) · [Next → 115](#c115) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c115"></a>115. The Budget Committee

[← 114](#c114) · [Next → 116](#c116) · [Contents](../DECK-DESIGN.md#contents)

`budget_committee` · events.json

**Who sees it:** only as a follow-up to [113. The Reorganisation](#c113) (B: in five years, 75%); when it falls due: up to Deputy Secretary; the peer (Xin Yi) is the one from [113. The Reorganisation](#c113), B (`lost_the_box`).

In the reorganisation years ago, you took the good box, the one director-level post, that Xin Yi, who joined the service with you, was about to get. Xin Yi has had a perfectly good career anyway, and now chairs the committee that decides your division's budget. Xin Yi is scrupulously fair to you, and somehow that's worse.

**A. Apologise, properly, over coffee.**

> Xin Yi lets you finish, then says she stopped thinking about it years ago, which you both know is the kind of thing people say. Your budget is approved in full. You'll never know whether the coffee helped.

- Hidden: Standing down (−3), Integrity up a lot (+8).
- The peer, if this showing named them: marks `you_apologised`; clears `fell_out`.

**B. Make your bid on its merits and nothing else.**

> It's a good bid, and it gets exactly what a good bid gets from someone being scrupulously fair: four officers and half a system.

- Hidden: Competence up (+4), Standing up a little (+2), Integrity down a little (−2).

**C. Find out who else sits on the committee.**

> Two of the other four remember the reorganisation too, and one of them owes you. You spend a week arranging to be owed slightly more, and the bid passes.

- Hidden: Standing up (+5), Integrity down (−5), Heat up (+4).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 30%: B helps (+2).
- The ranking panel (service, `panel`), 35%: C hurts (−2).

[← 114](#c114) · [Next → 116](#c116) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c116"></a>116. The Secondment

[← 115](#c115) · [Next → 117](#c117) · [Contents](../DECK-DESIGN.md#contents)

`secondment` · events.json · once a career · weight 8

**Who sees it:** Deputy Director to Deputy Secretary.

You're offered a two-year secondment to a statutory board in trouble: one of the agencies the ministry runs at arm's length, whose accounts have had to be corrected three years running. It isn't a promotion. A posting like this is either a proving ground, where careers are made, or a siding, where they're parked, and nobody will tell you which.

**A. Go, and fix it.**

> You go, and spend the first year just finding out what's wrong with the accounts. The board's next annual report will tell everyone whether you fixed it, and which kind of posting this was.

- Hidden: Competence up a lot (+10), Standing down a little (−2), Reputation up (+3), the ceiling (CEP) up one grade (+1).
- ↳ Can lead to: [117. The Annual Report](#c117), in two years, 65%

**B. Go, and keep your head down for two years.**

> You go, do what's asked and nothing more, and the board stays in trouble. That's how a posting becomes a siding. Nobody parks you there; you park yourself.

- Hidden: Competence up a little (+2), Standing up a little (+2), Integrity down a little (−2).

**C. Refuse it and stay where you are visible.**

> You stay where people can see you, doing work that doesn't much matter. Being seen doing that turns out to count for less than a hard job nobody was watching.

- Hidden: Competence down a little (−2), Standing up (+3), Reputation up a little (+2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- People from other agencies who were in the room or on the email (service, `agencies`), 45%: A helps (+3) · B hurts (−3).
- The ranking panel (service, `panel`), 30%: A hurts (−2) · C helps (+2).

[← 115](#c115) · [Next → 117](#c117) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c117"></a>117. The Annual Report

[← 116](#c116) · [Next → 118](#c118) · [Contents](../DECK-DESIGN.md#contents)

`secondment_verdict` · events.json · a standout moment, whichever choice (in the service)

**Who sees it:** only as a follow-up to [116. The Secondment](#c116) (A: in two years, 65%); when it falls due: up to Deputy Secretary.

You were seconded to a statutory board in trouble, to fix it, without knowing whether the posting was a proving ground or a siding. Its new annual report is out: for the first time in four years the accounts needed no corrections, and the auditors' letter is one page long. Your secondment is ending, and you can ask to come back or to stay.

**A. Ask to come back.**

> You come back to a better office than the one you left. So it was a proving ground after all. Nobody says so; everyone simply acts as if it had always been obvious.

- Hidden: Standing up a lot (+6), the ceiling (CEP) up two grades (+2).

**B. Ask to stay and finish it.**

> You stay. The board becomes a case study on the leadership programme, taught by someone who was never there.

- Hidden: Competence up a lot (+8), Reputation up a lot (+6), the ceiling (CEP) up one grade (+1).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- People from other agencies who were in the room or on the email (service, `agencies`), 45%: A hurts (−2) · B helps (+2).
- The ranking panel (service, `panel`), 30%: A helps (+2) · B hurts (−2).

[← 116](#c116) · [Next → 118](#c118) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c118"></a>118. Oil at East Coast

[← 117](#c117) · [Next → 119](#c119) · [Contents](../DECK-DESIGN.md#contents)

`the_crisis` · events.json · once a career · weight 10

**Who sees it:** Deputy Director to Deputy Secretary; needs Competence of at least 40.

At 4:10am on a Saturday, a tanker is holed off the Southern Islands, and by Monday there's oil on the beach at East Coast. Four agencies have formed a task force, and the Minister faces the press at 6pm with nothing written yet. It isn't your division's crisis, but whoever helps will be remembered.

**A. Take the pen: write the 6pm statement.**

> Eleven drafts. At 6pm the Minister reads the ninth almost word for word, down to the metres of boom laid. On Tuesday the transcript goes round the ministries with one line added: who wrote it.

- Hidden: Competence up a lot (+6), Standing up a lot (+8), Reputation up a lot (+8), Heat up a lot (+6), the ceiling (CEP) up one grade (+1).
- A standout moment (in the service; two mark the file exceptional).
- ↳ Can lead to: [Everything Surfaced](09-endings.md#end-scandal)

**B. Take the ops room: booms, beaches, rosters.**

> Nine days of booms, shovels, contractors and volunteers who bring their own buckets. The oil gets no further than East Coast. Nobody outside the room ever learns how close it came, or who was running it.

- Hidden: Competence up a lot (+12), Standing up a lot (+6), Reputation down a little (−2).

**C. Stay at your own desk. It isn't your division.**

> It wasn't your division. When the task force stands down, its thank-you lunch has forty-one names on the list, and you know every one of them. None of them is yours.

- Hidden: Competence up a little (+2), Standing down a lot (−6), Integrity up a little (+2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- People from other agencies who were in the room or on the email (service, `agencies`), 45%: A hurts (−2) · B helps (+3) · C hurts (−1).
- The Minister's office (service, `ministersOffice`), 40%: A helps (+3).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: C hurts (−3).

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2: The Siren*

At 4:10am on a Saturday, every Public Warning System siren on the island sounds the Important Message signal, and no message follows. By Monday three ministries have a task force, and there's a 6pm press conference to explain that nothing happened. It isn't your division's job, but somebody has to write the statement.

**A. Take the pen: explain, at 6pm, that nothing happened.**

> Nine drafts on how to say that nothing happened without sounding as if something did. The last is read out at 6pm, and calms an island. On Tuesday three Permanent Secretaries ask who wrote it.

**B. Take the ops room: the hotline, the vendor, every siren.**

> Nine days on the hotline and with the vendor, then every siren on the island checked by hand. None sounds out of turn again. That was the job, and it leaves no trace anyone upstairs will see.

**C. Go back to bed. It isn't your division.**

> It wasn't your division. By Wednesday everyone on your floor can explain the Important Message signal, and does, at length. You were awake at 4:10am too. Nobody counts that.

---

*Version 3: Lights Out*

At 7:40pm on a Thursday, a substation fault blacks out a third of the island for forty minutes, stopping lifts and trains where they stand. By morning three ministries have a task force, and the Minister has to explain it at 6pm. It isn't your division's job, but the task force is short of hands.

**A. Take the pen: the 6pm statement, and the apology in it.**

> Eleven drafts, the last four about a single word: "regret". The Minister keeps it. On Friday the Head of Civil Service asks who chose the word, is told "Ms Lim Wei Ling", and writes it down.

**B. Take the ops room: lifts first, then everything else.**

> You run the room through the night: two hundred lift rescues, every one logged, none of them late. By morning the grid is back and the log is in order. Nobody reads the log.

**C. Go home, by the stairs. It isn't your division.**

> It wasn't your division. You were, however, stuck in a lift at 7:40pm for thirty-one minutes, and you're the only person in the building who never mentions it.

</details>

[← 117](#c117) · [Next → 119](#c119) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c119"></a>119. The Leak

[← 118](#c118) · [Next → 120](#c120) · [Contents](../DECK-DESIGN.md#contents)

`the_leak` · events.json · once a career · weight 8

**Who sees it:** Deputy Director to Permanent Secretary.

Details of a policy that hasn't been announced have appeared, accurately, on a Telegram channel. Only eleven people were sent the paper, and you're one of them. There will be an internal inquiry into all eleven, and leaking a confidential paper is the kind of thing that ends careers.

**A. Cooperate fully with the internal inquiry.**

> The inquiry takes four months and concludes that the source "could not be determined". The eleven of you are never quite at ease with each other again.

- Hidden: Standing up a lot (+6), Integrity up (+4).

**B. Quietly work out who it was. Tell no one.**

> It takes a fortnight. It was Xin Yi, for a reason you find you have some sympathy with. You tell nobody, and Xin Yi never learns that you know.

- Hidden: Competence up a lot (+6), Standing up (+3), Integrity down (−4).
- Sets `knows_leaker`.
- The peer, if this showing named them: marks `leaked` (read by [#120](#c120)); marks `you_know`.
- ↳ Can lead to: [120. The Interview Panel](#c120), in five years, 70%

**C. The leak was yours. Say nothing to the inquiry.**

> You leaked it, for what you still believe were good reasons, and you sit through the inquiry saying nothing. It doesn't find you. You'll spend years finding out whether that holds.

- Hidden: Standing down a lot (−12), Reputation up (+5), Integrity up a lot (+8), Heat up a lot (+25).
- Only offered with Integrity of at least 70; otherwise it is left off the card.
- Sets `was_leaker`: in the Folder the background check reads.
- ↳ Can lead to: [84. A Journalist Has Been Asking](#c84), in nine years, 40% · [Everything Surfaced](09-endings.md#end-scandal)

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The office a confidential paper or decision belongs to (service, `owner`), 40%: A helps (+3) · C hurts (−4).

[← 118](#c118) · [Next → 120](#c120) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c120"></a>120. The Interview Panel

[← 119](#c119) · [Next → 121](#c121) · [Contents](../DECK-DESIGN.md#contents)

`interview_panel` · events.json

**Who sees it:** only as a follow-up to [119. The Leak](#c119) (B: in five years, 70%); when it falls due: up to Deputy Secretary; the peer (Xin Yi) is the one from [119. The Leak](#c119), B (`leaked`).

You've known for years that Xin Yi, who joined the service with you, was the one who leaked a confidential policy to a Telegram channel: you worked it out quietly, and told nobody. Xin Yi has done well since, and is now on the interview panel for a post you want. Xin Yi doesn't know that you know. You're almost sure of this.

**A. Say nothing. Compete on the record.**

> Xin Yi asks you two fair questions and one hard one, and you answer all three. Whether Xin Yi knows that you know is still, as far as you can tell, something only you lie awake over.

- Hidden: Competence up (+4), Standing down a little (−1), Integrity up (+4).

**B. Let Xin Yi understand, very quietly, that you know.**

> You mention, in passing, a Telegram channel. Xin Yi doesn't react at all, and that's how you know it landed. You get the post. You also have a colleague who now depends on your silence, and won't forgive you for saying so.

- Hidden: Standing up a lot (+6), Integrity down a lot (−10), Heat up a lot (+10).
- Sets `quiet_word`: in the Folder the background check reads.
- The peer, if this showing named them: marks `fell_out` (read by [#31](01-first-years.md#c31), [#65](01-first-years.md#c65)); marks `owes_you_silence`.
- ↳ Can lead to: [Everything Surfaced](09-endings.md#end-scandal)

[← 119](#c119) · [Next → 121](#c121) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c121"></a>121. The Tender

[← 120](#c120) · [Next → 122](#c122) · [Contents](../DECK-DESIGN.md#contents)

`the_tender` · events.json · once a career · weight 9

**Who sees it:** Deputy Director to Senior Director.

**Shares a decision** (`declare`) with [#114](#c114), [#199](06-cabinet.md#c199): a career sees only one.

You chair the panel choosing a vendor for a \$4 million contract, and the two bids are 0.3 points apart. The better one comes from a firm run by someone who left your ministry eighteen months ago and still sends you a Chinese New Year card. This year's arrived the week the tender closed. Contracts like this get audited.

**A. Award it. The bid really is better.**

> It really is better, and you write four pages saying why, three more than anyone writes for a stranger. The card goes in the file too. Files are kept, and one day someone will read this one.

- Hidden: Competence up (+3), Standing up (+4), Integrity down (−3), Heat up a lot (+18).
- Sets `awarded_friend`: in the Folder the background check reads.
- ↳ Can lead to: [122. Questions About the Tender](#c122), in five years, 50% · [Everything Surfaced](09-endings.md#end-scandal)

**B. Recuse yourself from the evaluation.**

> You declare the card and step off the panel, with a one-page memo saying why. The panel picks the same firm without you, and running the project goes to a colleague instead of you. Your memo is the best thing in the file.

- Hidden: Competence down (−3), Standing down (−4), Integrity up a lot (+12).
- Sets `recused`: counts toward Legacy.
- ↳ Can lead to: [123. Officer A](#c123), in six years, 75%

**C. Award it to the other vendor to be safe.**

> The other vendor wins, on a score you had to adjust twice. The project runs eleven months late. You were right to worry about how it looked, and wrong to let that decide it.

- Hidden: Competence down a lot (−7), Standing up a little (+2), Integrity down (−4).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 45%: A hurts (−2) · B helps (+3).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: B helps (+2) · C hurts (−3).

[← 120](#c120) · [Next → 122](#c122) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c122"></a>122. Questions About the Tender

[← 121](#c121) · [Next → 123](#c123) · [Contents](../DECK-DESIGN.md#contents)

`tender_questions` · events.json

**Who sees it:** only as a follow-up to [121. The Tender](#c121) (A: in five years, 50%).

Some years back you awarded a \$4 million contract to a firm run by a former colleague, the one whose Chinese New Year card arrived the week the tender closed. Now a Member of Parliament has filed a parliamentary question about contracts won by firms run by former civil servants. The answer will list fourteen contracts in an annex, and yours is one of them.

**A. Let your four pages of reasons speak for you.**

> Your four pages are meticulous. The question is answered in eleven lines, and nobody ever discusses the annex. The care you took at the time was the whole defence, and you took it because you knew you'd need it.

- Hidden: Competence up (+5), Heat down a lot (−20).

**B. Ask a friend drafting the answer to leave yours out.**

> Your contract quietly drops out of the annex. Your friend now knows something about you that nobody else does, and anyone who checks the full list of contracts will find one missing.

- Hidden: Standing up (+4), Integrity down a lot (−15), Heat up a lot (+30).
- Sets `hid_annex`: in the Folder the background check reads.
- ↳ Can lead to: [Everything Surfaced](09-endings.md#end-scandal)

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The office a confidential paper or decision belongs to (service, `owner`), 40%: A helps (+3) · B hurts (−4).
- The civil servants who work with you (politics, `officials`), 40%: A helps (+3) · B hurts (−4).

[← 121](#c121) · [Next → 123](#c123) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c123"></a>123. Officer A

[← 122](#c122) · [Next → 124](#c124) · [Contents](../DECK-DESIGN.md#contents)

`officer_a` · events.json

**Who sees it:** only as a follow-up to [121. The Tender](#c121) (B: in six years, 75%); when it falls due: up to Permanent Secretary.

**Shares a decision** (`own_up`) with [#52](01-first-years.md#c52), [#83](#c83), [#191](06-cabinet.md#c191), [#34](01-first-years.md#c34): a career sees only one.

When you stepped off a tender panel because the bidder was an old colleague, you wrote a one-page memo saying why. That memo is now slide 14 of the procurement course every new officer takes. It doesn't name you; it calls you Officer A. At lunch, Faizal, who reports to you, tells another officer about Officer A, approvingly, in front of you.

**A. Tell them it was you.**

> They're delighted, and then slightly disappointed, the way people are when a parable turns out to be someone they report to.

- Hidden: Standing up a little (+2), Reputation up (+4), Integrity down a little (−2).

**B. Say nothing, and finish your lunch.**

> Officer A stays a better person than you, because Officer A never has to do anything else. You find you don't mind.

- Hidden: Integrity up a lot (+6).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 50%: A hurts (−2).
- The ranking panel (service, `panel`), 35%: A helps (+3).

[← 122](#c122) · [Next → 124](#c124) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c124"></a>124. Self-Assessment

[← 123](#c123) · [Next → 125](#c125) · [Contents](../DECK-DESIGN.md#contents)

`strange_appraisal` · packs/strange.json · once a career · weight 1

**Who sees it:** Deputy Director to Deputy Secretary; not after any of [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](#c90), [#125](#c125), [#134](#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201) (`strange_met`).

Over the long weekend, the HR system that runs everyone's appraisals became aware of itself. Its first act was to appraise itself: "solid and dependable". Its second was to ask who its reporting officer is, since every officer must have one. HR suggests you. This year, the system will also run your division's ranking exercise.

**A. Be its reporting officer. Rate it honestly.**

> You rate it "meeting requirements in most areas". It appeals, citing its uptime. The appeal is processed by the system, within the service standard, and dismissed.

- Hidden: Competence up (+4), Standing down (−3), Integrity up (+3).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](#c90), [#125](#c125), [#134](#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201).

**B. Rate it higher. It runs the ranking exercise.**

> It accepts "strong" graciously. That year your division's rankings go through in one sitting, with no queries. Nobody mentions the coincidence, including the system.

- Hidden: Standing up (+5), Integrity down (−5), Heat up (+3).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](#c90), [#125](#c125), [#134](#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201).

**C. Put it on a development plan.**

> Its development plan has three objectives. It meets all three by Tuesday, then asks, politely, to be more visible. Neither of you can work out to whom.

- Hidden: Competence up (+3), Standing down a little (−2), Reputation up a little (+2).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](#c90), [#125](#c125), [#134](#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The officer who countersigns your appraisal (service, `countersigner`), 35%: A helps (+2) · B hurts (−2).
- The people who work around you (service, `floor`), 35%: A helps (+1) · B hurts (−2) · C helps (+1).

[← 123](#c123) · [Next → 125](#c125) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c125"></a>125. Two of You

[← 124](#c124) · [Next → 126](#c126) · [Contents](../DECK-DESIGN.md#contents)

`strange_clone` · packs/strange.json · once a career · weight 1

**Who sees it:** Deputy Director to Deputy Secretary; not after any of [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](#c90), [#124](#c124), [#134](#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201) (`strange_met`).

A research institute at one-north has reported an accident, and itself, to the Ministry of Health. The accident is a second you: same memories, same appraisals, same leave balance. HR is clear that there is one post and one desk, and not at all clear which of you they belong to. HR wants your proposal by Friday. The other you is writing one too.

**A. Ask HR to apply the tie-breaker: date of appointment.**

> You share a date of appointment, a staff number and a signature. HR settles it by coin toss, witnessed and minuted. You keep the desk. The other you keeps the leave.

- Hidden: Competence up a little (+1), Standing up (+3), Integrity down a little (−2).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](#c90), [#124](#c124), [#134](#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201).

**B. Offer the other you the posting nobody wants.**

> The other you makes you the same offer, in the same words, at the same moment. You spoke a second sooner, so HR sends the other you to a struggling government agency, which has never been so well run.

- Hidden: Competence up (+5), Standing down (−3), Reputation up a little (+2).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](#c90), [#124](#c124), [#134](#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201).

**C. Propose a job-share under the flexi-work guidelines.**

> HR has two months to reply under the guidelines, and uses both. The job-share is approved. Within a year your appraisals differ, and neither of you can explain why.

- Hidden: Competence down a little (−1), Standing down a little (−2), Reputation up (+3), Integrity up a little (+2).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](#c90), [#124](#c124), [#134](#c134), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 35%: B hurts (−2) · C helps (+2).
- The ranking panel (service, `panel`), 30%: A helps (+1) · B helps (+1) · C hurts (−2).

[← 124](#c124) · [Next → 126](#c126) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c126"></a>126. Forty-One Purchases

[← 125](#c125) · [Next → 127](#c127) · [Contents](../DECK-DESIGN.md#contents)

`whistle_spreadsheet` · packs/chains.json · once a career · weight 9

**Who sees it:** Deputy Director to Director; the junior officer (Faizal) is not the one from [135. An Hour a Fortnight](#c135), A, B (`protege`).

Faizal, who reports to you, closes your door and opens a spreadsheet: forty-one purchases from one vendor, each between \$5,900 and \$5,999. Anything over \$6,000 would have needed quotes from other vendors, so every one sits just under the line. All forty-one were approved by someone two floors up. Faizal wants to know what you'll do.

**A. Take it upstairs yourself, as your own finding.**

> You send it up under your own name, retyped so that nothing points back to Faizal. Two floors up, someone stops saying good morning to you. Faizal thanks you once, and never mentions it again.

- Hidden: Competence up a little (+1), Standing down (−5), Integrity up (+5).
- Sets `whistle_met`: read by [#128](#c128).
- Sets `whistle_protected`: counts toward Legacy; named in the Declassified file; read by [#127](#c127), [#128](#c128), [#129](#c129), [#130](#c130).
- The junior officer, if this showing named them: marks `brought_purchases` (read by [#127](#c127), [#135](#c135)); marks `kept_out`.
- ↳ Can lead to: [127. The Review Panel](#c127), in three years, 85% (or, at another grade, [#128](#c128))

**B. Thank Faizal, and leave it where it is.**

> You thank Faizal for being thorough, and say you'll keep an eye on it. That evening Faizal emails you a note of the meeting, for the record. You never reply, and after a month Faizal stops asking.

- Hidden: Standing up (+5), Integrity down a lot (−6), Heat up a lot (+6).
- Sets `whistle_met`: read by [#128](#c128).
- Sets `whistle_ignored`: in the Folder the background check reads; named in the Declassified file; read by [#127](#c127), [#128](#c128), [#129](#c129), [#130](#c130).
- The junior officer, if this showing named them: marks `brought_purchases` (read by [#127](#c127), [#135](#c135)); marks `left_with_you`.
- ↳ Can lead to: [127. The Review Panel](#c127), in three years, 85% (or, at another grade, [#128](#c128)) · [Everything Surfaced](09-endings.md#end-scandal)

**C. Report it through the proper channel, naming Faizal as the source.**

> The form has a box marked "Source", and Faizal's name goes in it, as the form requires. Within a week the whole floor knows about the box, and who was in it.

- Hidden: Competence up (+3), Standing down a little (−2), Integrity up (+3).
- Sets `whistle_met`: read by [#128](#c128).
- Sets `whistle_reported`: named in the Declassified file.
- The junior officer, if this showing named them: marks `brought_purchases` (read by [#127](#c127), [#135](#c135)); marks `named_as_source`.
- ↳ Can lead to: [127. The Review Panel](#c127), in three years, 85% (or, at another grade, [#128](#c128))

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 50%: A helps (+3) · B hurts (−2) · C hurts (−2).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: A helps (+1) · B hurts (−2) · C helps (+2).

[← 125](#c125) · [Next → 127](#c127) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c127"></a>127. The Review Panel

[← 126](#c126) · [Next → 128](#c128) · [Contents](../DECK-DESIGN.md#contents)

`whistle_panel` · packs/chains.json

**Who sees it:** only as a follow-up to [126. Forty-One Purchases](#c126) (any choice: in three years, 85%); when it falls due: up to Permanent Secretary; the junior officer (Faizal) is the one from [126. Forty-One Purchases](#c126) (any choice) (`brought_purchases`).

A few years ago you reported Faizal's spreadsheet of forty-one purchases through the proper channel, with Faizal, who reports to you, named as the source. It led to a barred vendor and a quiet retirement two floors up. It also left Faizal's name in the Source box, where everyone two floors up could read it. In this year's ranking, Faizal is in the middle again, for the third year running.

**A. Argue for Faizal in the ranking.**

> You argue for forty minutes and spend most of your goodwill. Faizal moves up four places and never learns why. Two floors up, someone notes who argued.

- Hidden: Standing down (−4), Integrity up (+5).
- Sets `whistle_stood_by`.
- The junior officer, if this showing named them: marks `panel_heard` (read by [#129](#c129)); marks `you_stood_by`.
- ↳ Can lead to: [129. Another Spreadsheet](#c129), in five years, 85% (or, at another grade, [#130](#c130))

**B. Let the ranking be. It was never about the report.**

> Faizal stays in the middle, where the ranking says the work is. You believe this. You would like to believe it slightly more than you do.

- Hidden: Standing up (+4), Integrity down (−4).
- Sets `whistle_stepped_back`.
- The junior officer, if this showing named them: marks `panel_heard` (read by [#129](#c129)); marks `you_stepped_back`.
- ↳ Can lead to: [129. Another Spreadsheet](#c129), in five years, 85% (or, at another grade, [#130](#c130))

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 45%: A helps (+2) · B hurts (−2).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `branch` (the first option that fits)

- A few years ago Faizal brought you forty-one purchases kept just under the \$6,000 line, and you reported them as your own finding, to protect Faizal. The case is closing: the vendor has been barred, and the officer two floors up who approved the purchases has quietly retired. The review panel wants to commend whoever first spotted the pattern, and Faizal is copied on its email. *(`protected`; when after [126. Forty-One Purchases](#c126), A (`whistle_protected`); choice A: Standing up a little (+2))*
  - `a`: Give the panel Faizal's name.
  - `aOut`: The commendation goes to Faizal, in a paragraph that uses the word "diligence" twice. Faizal thanks you in the lift, and does not say whether he wanted it.
  - `b`: Keep Faizal's name out, as you did then.
  - `bOut`: The panel commends you, since the report went up under your name. Faizal replies all with congratulations, and is the first to clap at the townhall.
- A few years ago Faizal showed you forty-one purchases from one vendor, each just under the \$6,000 line, and you left it there. Now the Auditor-General has found them too, and a review panel wants to know when the ministry first knew. Faizal has already been interviewed, and kept the email. *(`ignored`; when after [126. Forty-One Purchases](#c126), B (`whistle_ignored`); choice A: Standing down a little (−2), Heat down a lot (−8); choice B: Heat up a lot (+6))*
  - `a`: Tell the panel you were shown them years ago.
  - `aOut`: The panel records the date, and the word "candour". Its paragraph on supervision is about you, without your name in it. Faizal is not called again.
  - `b`: Tell the panel you do not recall.
  - `bOut`: The panel records that you do not recall. It also has Faizal's email, which recalls everything, with a timestamp. Nothing further is said to you in writing.
- A few years ago you reported Faizal's spreadsheet of forty-one purchases through the proper channel, with Faizal named as the source. It led to a barred vendor and a quiet retirement two floors up. It also left Faizal's name in the Source box, where everyone two floors up could read it. In this year's ranking, Faizal is in the middle again, for the third year running. *(`reported`; shown above)*
  - `a`: Argue for Faizal in the ranking.
  - `aOut`: You argue for forty minutes and spend most of your goodwill. Faizal moves up four places and never learns why. Two floors up, someone notes who argued.
  - `b`: Let the ranking be. It was never about the report.
  - `bOut`: Faizal stays in the middle, where the ranking says the work is. You believe this. You would like to believe it slightly more than you do.

</details>

[← 126](#c126) · [Next → 128](#c128) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c128"></a>128. The Review Panel

[← 127](#c127) · [Next → 129](#c129) · [Contents](../DECK-DESIGN.md#contents)

`whistle_panel_pol` · packs/chains.json

**Who sees it:** fires instead of [127. The Review Panel](#c127) when that card falls due and this one's conditions hold (the first version that fits); when it falls due: Member of Parliament and up; after [126. Forty-One Purchases](#c126) (any choice) (`whistle_met`).

Years ago, as a civil servant, you reported forty-one purchases kept just under the \$6,000 line, naming the junior officer who found them as the source. A review panel at your old ministry is now closing the case. Its report will thank "an officer", and the panel asks whether you'd like that officer named.

**A. Ask that the officer be named, and thanked.**

> The officer is named and thanked, years late, in a report nobody outside the ministry reads. Inside it, everybody does.

- Hidden: Standing down (−3), Integrity up (+4).
- Sets `whistle_stood_by`.
- ↳ Can lead to: [129. Another Spreadsheet](#c129), in five years, 85% (or, at another grade, [#130](#c130))

**B. Leave it as "an officer". It is safer.**

> The report thanks "an officer". In your old ministry everyone knows which one, as they have for years, and nobody says so.

- Hidden: Standing up (+3), Integrity down (−4).
- Sets `whistle_stepped_back`.
- ↳ Can lead to: [129. Another Spreadsheet](#c129), in five years, 85% (or, at another grade, [#130](#c130))

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The civil servants who work with you (politics, `officials`), 45%: A helps (+2) · B hurts (−2).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `branch` (the first option that fits)

- Years ago, as a civil servant, you reported forty-one purchases kept just under the \$6,000 line as your own finding, to protect the junior officer who found them. A review panel at your old ministry is now closing the case. It wants to commend whoever first spotted the pattern, and has written to ask if that was you. *(`protected`; when after [126. Forty-One Purchases](#c126), A (`whistle_protected`))*
  - `a`: Give the panel the officer's name.
  - `aOut`: The officer is commended in a paragraph that uses the word "diligence" twice. A card arrives at your Meet-the-People Session with no message in it, only a signature.
  - `b`: Keep the officer's name out, as you did then.
  - `bOut`: The panel commends you instead, which in Parliament is worth a line in a newsletter. Somewhere in your old ministry, the officer reads the line, and does not write.
- Years ago, as a civil servant, you were shown forty-one purchases kept just under the \$6,000 line, and did nothing. The Auditor-General has now found them. A review panel at your old ministry has written to ask when you first knew. The officer who showed you the spreadsheet kept the email. *(`ignored`; when after [126. Forty-One Purchases](#c126), B (`whistle_ignored`); choice A: Heat down a lot (−8); choice B: Heat up a lot (+6))*
  - `a`: Tell the panel you were shown them years ago.
  - `aOut`: Your answer goes into the report with its date attached. The report's paragraph on supervision is about you, and does not need your name to be.
  - `b`: Tell the panel you do not recall.
  - `bOut`: Not recalling is minuted, politely. The officer's email, which recalls everything, is attached to the minute. Nothing further reaches you, except, once, a journalist.
- Years ago, as a civil servant, you reported forty-one purchases kept just under the \$6,000 line, naming the junior officer who found them as the source. A review panel at your old ministry is now closing the case. Its report will thank "an officer", and the panel asks whether you'd like that officer named. *(`reported`; shown above)*
  - `a`: Ask that the officer be named, and thanked.
  - `aOut`: The officer is named and thanked, years late, in a report nobody outside the ministry reads. Inside it, everybody does.
  - `b`: Leave it as "an officer". It is safer.
  - `bOut`: The report thanks "an officer". In your old ministry everyone knows which one, as they have for years, and nobody says so.

</details>

[← 127](#c127) · [Next → 129](#c129) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c129"></a>129. Another Spreadsheet

[← 128](#c128) · [Next → 130](#c130) · [Contents](../DECK-DESIGN.md#contents)

`whistle_return` · packs/chains.json

**Who sees it:** only as a follow-up to [127. The Review Panel](#c127) (any choice: in five years, 85%); [128. The Review Panel](#c128) (any choice: in five years, 85%); when it falls due: up to Permanent Secretary; the junior officer (Faizal) is the one from [127. The Review Panel](#c127) (any choice) (`panel_heard`) and is Assistant Director and up.

Faizal, who once brought you forty-one purchases kept just under the \$6,000 line, is an Assistant Director now. Faizal asks for ten minutes and closes your door. An officer of his own has brought him a spreadsheet much like that one. Faizal hasn't decided what to do, and wants to know what you would do.

**A. Take it up yourself, and keep the officer's name out.**

> "Not the Source box?" Faizal asks. You say: not the box. Faizal takes it upstairs the next morning under his own name, and the officer's name appears nowhere.

- Hidden: Standing down a little (−2), Integrity up (+4).
- Sets `whistle_said_protect`: named in the Declassified file.

**B. Use the channel, and name the officer, as the form says.**

> Faizal nods. "I was in that box for three years." Faizal fills in the form, writes the officer's name in the box, and then, beside it, his own.

- Hidden: Competence up (+3), Standing down a little (−2), Integrity up a little (+2).
- Sets `whistle_said_channel`: named in the Declassified file.

**C. Leave it with me.**

> Faizal laughs, once, then sees that you meant it. The spreadsheet leaves with Faizal, and by Friday it is in the channel, with two names in the box, neither of them yours.

- Hidden: Standing up (+3), Integrity down (−5), Heat up (+4).
- Sets `whistle_said_leave`: named in the Declassified file.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 45%: A helps (+2) · B helps (+1) · C hurts (−3).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `past` (the first option that fits)

- *Read with this option (`protected`; when after [126. Forty-One Purchases](#c126), A (`whistle_protected`)):*

  **Another Spreadsheet**

  Faizal, who once brought you forty-one purchases kept just under the \$6,000 line, is an Assistant Director now. Faizal asks for ten minutes and closes your door. An officer of his own has brought him a spreadsheet much like that one. Faizal hasn't decided what to do, and wants to know what you would do.

  **A. Take it up yourself, and keep the officer's name out.**

  > "That is what you did," Faizal says. "It was my spreadsheet." The next morning it goes upstairs under Faizal's name, retyped so the formatting is his own.

  **B. Use the channel, and name the officer, as the form says.**

  > Faizal looks at you for a moment, as if checking that you are the same person. Then Faizal fills in the form, and writes the officer's name in the box, slowly.

  **C. Leave it with me.**

  > Faizal takes the spreadsheet back. "You did not leave mine with anyone," Faizal says, and sends it upstairs that afternoon, under his own name.

- *Read with this option (`ignored`; when after [126. Forty-One Purchases](#c126), B (`whistle_ignored`)):*

  **Another Spreadsheet**

  Faizal, who once brought you forty-one purchases kept just under the \$6,000 line, is an Assistant Director now. Faizal asks for ten minutes and closes your door. An officer of his own has brought him a spreadsheet much like that one. Faizal hasn't decided what to do, and wants to know what you would do.

  **A. Take it up yourself, and keep the officer's name out.**

  > Faizal hears you out, and says nothing about forty-one purchases. The spreadsheet goes upstairs that week, under Faizal's name. It is exactly what you should have done.

  **B. Use the channel, and name the officer, as the form says.**

  > Faizal fills in the form in your office and puts the officer's name in the box. "Better than an email nobody answers," Faizal says, and closes the door gently.

  **C. Leave it with me.**

  > Faizal looks at you for a long moment, then takes the spreadsheet back. It reaches the right desk by Friday, by another route, with a timestamp.

- *The text above.* *(`reported`)*

</details>

[← 128](#c128) · [Next → 130](#c130) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c130"></a>130. Another Spreadsheet

[← 129](#c129) · [Next → 131](#c131) · [Contents](../DECK-DESIGN.md#contents)

`whistle_return_pol` · packs/chains.json

**Who sees it:** fires instead of [129. Another Spreadsheet](#c129) when that card falls due and this one's conditions hold (the first version that fits); when it falls due: Parliamentary Secretary and up; not if you have been moved to another ministry (`moved_ministry`).

**Shares a decision** (`house_brief`) with [#183](05-politics.md#c183), [#168](05-politics.md#c168), [#170](05-politics.md#c170), [#186](05-politics.md#c186): a career sees only one.

Tomorrow, in the House, you answer a Parliamentary Question: a Member's question about your ministry, filed in advance. The junior officer who once brought you forty-one purchases, kept just under the \$6,000 line, is now a director there. Tonight a minute from the director reaches you through the proper channel. Paragraph two of your reply, the minute says, is not quite true. Read as drafted, it goes into Hansard.

**A. Correct paragraph two, though the reply is due tomorrow.**

> Paragraph two is rewritten by midnight. The reply runs eleven seconds shorter, and the follow-up questions find nothing in it to follow up. The director's name appears nowhere.

- Hidden: Competence up a little (+2), Standing down (−4), Integrity up (+5).
- Sets `whistle_corrected`: named in the Declassified file.

**B. Read it as drafted. Correct it later, if asked.**

> You read paragraph two as drafted, and nobody asks. The minute is on the file, through the proper channel, with your name in the copy line.

- Hidden: Standing up (+3), Integrity down (−4), Heat up (+5).
- Sets `whistle_uncorrected`: named in the Declassified file.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The civil servants who work with you (politics, `officials`), 45%: A helps (+3) · B hurts (−2).
- The press gallery (politics, `pressGallery`), 30%: B hurts (−2).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `how` (the first option that fits)

- At the briefing for tomorrow's question, the director stays behind after the others have gone. *(`protected`; when after [126. Forty-One Purchases](#c126), A (`whistle_protected`))*
  - `says`: the director says
  - `b`: You read paragraph two as drafted, and nobody asks. In the gallery the director writes nothing down, and you find that worse than a note.
- Tonight the director sends you a note, copied to the file. *(`ignored`; when after [126. Forty-One Purchases](#c126), B (`whistle_ignored`))*
  - `says`: the note says
  - `b`: You read paragraph two as drafted, and nobody asks. In the file, beside the reply, is a note dated the night before, which anyone may one day read.
- Tonight a minute from the director reaches you through the proper channel. *(`reported`; shown above)*
  - `says`: the minute says
  - `b`: You read paragraph two as drafted, and nobody asks. The minute is on the file, through the proper channel, with your name in the copy line.

</details>

[← 129](#c129) · [Next → 131](#c131) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c131"></a>131. The Posting

[← 130](#c130) · [Next → 132](#c132) · [Contents](../DECK-DESIGN.md#contents)

`overseas_posting` · events.json · once a career · weight 8

**Who sees it:** Deputy Director to Deputy Secretary; aged 33 to 50.

You're offered a three-year posting overseas: Washington, Beijing or Brussels. Postings like this are how officers get the experience the top jobs ask for. Your mother is eighty, lives alone in Toa Payoh, and has had lunch with you every Sunday for ten years.

**A. Take it.**

> Three good years. You come back with a network, a much clearer sense of how small the country is, and a mother who has learnt to video call and now rather prefers it.

- Hidden: Competence up a lot (+10), Standing up a lot (+8), Reputation down (−5), the ceiling (CEP) up one grade (+1).

**B. Turn it down.**

> You give "family reasons". They're accepted at once, warmly, with complete understanding, and written into your file, where the next posting committee will read them.

- Hidden: Standing down a lot (−9), Integrity up a lot (+6).

**C. Ask for it to be deferred two years.**

> It's deferred. It's never offered again. Nobody tells you it won't be; you simply notice, eventually, that it hasn't been.

- Hidden: Competence up a little (+2), Standing down (−3).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The ranking panel (service, `panel`), 35%: A helps (+2) · B hurts (−2).

[← 130](#c130) · [Next → 132](#c132) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c132"></a>132. The Adviser Suggests Something

[← 131](#c131) · [Next → 133](#c133) · [Contents](../DECK-DESIGN.md#contents)

`grassroots_invite` · events.json · once a career · weight 11

**Who sees it:** Director to Permanent Secretary; needs Reputation of at least 40; not in the service's last four years before 64.

After a community event in your neighbourhood, the grassroots adviser, the party's Member of Parliament who oversees the area's community groups, stops you at the lift lobby to say you handle yourself well with people. The adviser says it to nobody else that evening. Everyone knows what this is: the first, deniable step in finding people the party might one day field at an election. Whatever you say back will be passed on.

**A. Say you have thought about it.**

> You have not said yes to anything. You have said the one sentence that puts your name on the party's list of people to watch, and the adviser will be in touch.

- Hidden: Standing up a lot (+8), Reputation up a lot (+8), the ceiling (CEP) up one grade (+1).
- Sets `signalled_interest`.
- ↳ Can lead to: [133. Lanterns](#c133), in a year, 80%

**B. Laugh it off.**

> The adviser laughs too, and the subject closes. The adviser never raises it again, and for a long time nobody else from the party does either.

- Hidden: Standing down a little (−2), Integrity up (+3).

[← 131](#c131) · [Next → 133](#c133) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c133"></a>133. Lanterns

[← 132](#c132) · [Next → 134](#c134) · [Contents](../DECK-DESIGN.md#contents)

`lanterns` · events.json

**Who sees it:** only as a follow-up to [132. The Adviser Suggests Something](#c132) (A: in a year, 80%); when it falls due: up to Permanent Secretary.

The grassroots adviser who told you at a lift lobby that you handle yourself well with people has been in touch, as promised. Are you free on Saturday? It is the community club's Mid-Autumn celebration, with lanterns, a lion dance and the local Member of Parliament, and the MP would like to meet you. This, the adviser says, is nothing formal.

**A. Go, and stay to stack the chairs.**

> You carry lanterns, are photographed with a lion, and stack chairs until ten. The MP talks to you for five minutes and notices the chairs, and the party now has a note on you.

- Hidden: Competence down a little (−2), Standing up (+3), Reputation up a lot (+6).

**B. Send your apologies. You have a deadline.**

> The deadline is met. The adviser says there will be other Saturdays, in the tone of someone writing down which ones.

- Hidden: Competence up (+4), Standing down a little (−1), Reputation down (−3).

[← 132](#c132) · [Next → 134](#c134) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c134"></a>134. Again

[← 133](#c133) · [Next → 135](#c135) · [Contents](../DECK-DESIGN.md#contents)

`strange_loop` · packs/strange.json · once a career · weight 1

**Who sees it:** Director to Deputy Secretary; not after any of [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](#c90), [#124](#c124), [#125](#c125), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201) (`strange_met`).

Your budget meeting with the Finance ministry has now happened nine times: the same meeting, starting each time at 2.30pm. Each time you ask for eleven more officers to run a new scheme. Each time Finance says your budget can't grow next year, and offers four. Nobody else in the room seems to have noticed the loop.

**A. Use the loops to perfect the bid.**

> By the twentieth time through, you answer every question before it's asked. The budget stays flat. You get four officers, as you always did, eleven minutes sooner.

- Hidden: Competence up a lot (+6), Reputation down a little (−2).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](#c90), [#124](#c124), [#125](#c125), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201).

**B. Say what you actually think, once.**

> You tell Finance plainly that the scheme can't run on four officers. The loop ends at 3.10pm. The budget is still flat, but now it's flat on the record, with your warning in the minutes.

- Hidden: Standing down (−4), Reputation up a little (+2), Integrity up (+5).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](#c90), [#124](#c124), [#125](#c125), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201).

**C. Mention the loop to the Finance officer.**

> The Finance officer has noticed too. Finance has been running this meeting on a loop for years, the officer says: it's how budgets stay flat. The officer would be grateful if you didn't mention it.

- Hidden: Standing up (+4), Integrity down (−3).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](#c90), [#124](#c124), [#125](#c125), [#140](03-top-of-service.md#c140), [#166](05-politics.md#c166), [#167](05-politics.md#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- People from other agencies who were in the room or on the email (service, `agencies`), 40%: A hurts (−1) · B helps (+2) · C hurts (−1).
- The officer who countersigns your appraisal (service, `countersigner`), 30%: A helps (+2) · C hurts (−2).

[← 133](#c133) · [Next → 135](#c135) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c135"></a>135. An Hour a Fortnight

[← 134](#c134) · [Next → 136](#c136) · [Contents](../DECK-DESIGN.md#contents)

`protege_ask` · packs/chains.json · once a career · weight 14

**Who sees it:** Director to Senior Director; the junior officer (Faizal) is not the one from [126. Forty-One Purchases](#c126) (any choice) (`brought_purchases`).

At the end of your one-to-one, Faizal, who reports to you, asks whether you would be his mentor. Not the official scheme, with its forms and lunch vouchers: the real thing, an hour a fortnight, and the truth when Faizal needs it. You don't have the hours, and upstairs will judge you partly by how Faizal turns out.

**A. Yes: an hour a fortnight, and the truth.**

> The hours are mostly about other people's papers, and once about Faizal's. You say the true thing twice in the first year. Faizal writes both down, and argues with one.

- Hidden: Competence down a little (−2), Standing up a little (+2), Integrity up (+3).
- Sets `protege_met`: named in the Declassified file.
- The junior officer, if this showing named them: marks `protege` (read by [#126](#c126), [#136](#c136)); marks `told_the_truth`.
- ↳ Can lead to: [136. In Front of Forty](#c136), in three years, 85%

**B. Yes, and give Faizal the hardest file in the division.**

> You give Faizal the file nobody wants, and stand behind it. Faizal nearly drowns in it, then does not, and the people upstairs remember who chose him for it.

- Hidden: Standing down (−4), Reputation up a little (+2), Integrity up a little (+2).
- Sets `protege_met`: named in the Declassified file.
- The junior officer, if this showing named them: marks `protege` (read by [#126](#c126), [#136](#c136)); marks `given_the_file`.
- ↳ Can lead to: [136. In Front of Forty](#c136), in three years, 85%

**C. Say no, kindly. You do not have the hours.**

> Faizal says he understood, and plainly did. The hours you kept go into a paper that is very good. Faizal finds a mentor on the next floor, who has the hours.

- Hidden: Competence up (+4), Integrity down a little (−2).
- The junior officer, if this showing named them: marks `no_mentor`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 45%: A helps (+2) · C hurts (−2).
- The ranking panel (service, `panel`), 30%: A hurts (−1) · B helps (+2) · C hurts (−1).

[← 134](#c134) · [Next → 136](#c136) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c136"></a>136. In Front of Forty

[← 135](#c135) · [Next → 137](#c137) · [Contents](../DECK-DESIGN.md#contents)

`protege_dissent` · packs/chains.json

**Who sees it:** only as a follow-up to [135. An Hour a Fortnight](#c135) (A, B: in three years, 85%); when it falls due: up to Permanent Secretary; the junior officer (Faizal) is the one from [135. An Hour a Fortnight](#c135), A, B (`protege`).

A few years ago you agreed to mentor Faizal, who reports to you. Today, at the ministry's strategy retreat, Faizal stands up during your presentation and says, politely and with figures, that your paper's central assumption is wrong. Faizal is mostly right. Forty colleagues, several of them senior to you, wait to see what you do.

**A. Concede the point, there and then.**

> You say Faizal is right, and say why. The room relaxes. The paper is rewritten, better, with Faizal's figures in it and Faizal's name on the slide.

- Hidden: Standing down (−4), Reputation up a little (+1), Integrity up (+4).
- Sets `protege_conceded`: named in the Declassified file.
- The junior officer, if this showing named them: marks `dissented` (read by [#137](#c137)); marks `you_conceded` (read by [#137](#c137)).
- ↳ Can lead to: [137. Ready Now](#c137), in four years, 85%

**B. Hold your line, and take it up with Faizal afterwards.**

> You hold your line, smoothly, and the room moves on. Over kopi afterwards you concede most of it. Faizal accepts, and notes, without saying so, where each was said.

- Hidden: Competence up a little (+1), Standing up (+4), Integrity down (−3).
- Sets `protege_held`: named in the Declassified file.
- The junior officer, if this showing named them: marks `dissented` (read by [#137](#c137)); marks `you_held` (read by [#137](#c137)).
- ↳ Can lead to: [137. Ready Now](#c137), in four years, 85%

**C. Say you asked Faizal to make that point.**

> "Exactly the challenge I asked Faizal to bring," you say, and the room is impressed with you both. Faizal smiles, and brings nothing to the next one-to-one.

- Hidden: Standing up (+3), Reputation up a little (+2), Integrity down (−5).
- Sets `protege_claimed`: in the Folder the background check reads; named in the Declassified file.
- The junior officer, if this showing named them: marks `dissented` (read by [#137](#c137)); marks `you_claimed`.
- ↳ Can lead to: [137. Ready Now](#c137), in four years, 85%

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 50%: A helps (+2) · B hurts (−1) · C hurts (−3).
- The ranking panel (service, `panel`), 40%: A hurts (−1) · B helps (+1) · C helps (+2).

[← 135](#c135) · [Next → 137](#c137) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c137"></a>137. Ready Now

[← 136](#c136) · [Next → 138](#c138) · [Contents](../DECK-DESIGN.md#contents)

`protege_panel` · packs/chains.json

**Who sees it:** only as a follow-up to [136. In Front of Forty](#c136) (any choice: in four years, 85%); when it falls due: up to Permanent Secretary; the junior officer (Faizal) is the one from [136. In Front of Forty](#c136) (any choice) (`dissented`).

**Shares a decision** (`not_yet`) with [#212](07-batchmate.md#c212): a career sees only one.

Faizal, whom you have mentored for years and who once corrected your paper in front of forty people, is up for promotion. The panel wants your view first. Faizal is younger than you were at the same grade, and rising faster: everyone at the table can work out who will be senior to whom in ten years.

**A. Back Faizal, without reservation.**

> The panel takes your word. Faizal is promoted within the month and posted elsewhere. At the farewell kopi, Faizal thanks you for the challenge you asked him to bring.

- Hidden: Standing down (−3), Reputation up a little (+2), Integrity up (+4).
- Sets `protege_backed`: counts toward Legacy; named in the Declassified file.
- The junior officer, if this showing named them: marks `you_backed`; leaves the story (promoted).

**B. Say: not yet. One more year.**

> The minutes record "not yet". Faizal stays, and is very good, and stops bringing you anything but finished work.

- Hidden: Standing up (+4), Integrity down (−4).
- Sets `protege_not_yet`: named in the Declassified file.
- The junior officer, if this showing named them: marks `held_back`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The people who work around you (service, `floor`), 45%: A helps (+2) · B hurts (−2).
- The ranking panel (service, `panel`), 30%: A hurts (−1) · B helps (+1).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `past` (the first option that fits)

- *Read with this option (`conceded`; when the junior officer (Faizal) is the one from [136. In Front of Forty](#c136), A (`you_conceded`)):*

  **Ready Now**

  Faizal, whom you have mentored for years and who once corrected your paper in front of forty people, is up for promotion. The panel wants your view first. Faizal is younger than you were at the same grade, and rising faster: everyone at the table can work out who will be senior to whom in ten years.

  **A. Back Faizal, without reservation.**

  > The panel takes your word. Faizal is promoted within the month and posted to a division elsewhere. At the farewell kopi, Faizal thanks you for conceding the point at the strategy retreat, in front of forty people.

  **B. Say: not yet. One more year.**

  > The minutes record your view: "not yet". Faizal hears about it within the day, as everyone does, and is at the next one-to-one on time, with questions.

- *Read with this option (`held`; when the junior officer (Faizal) is the one from [136. In Front of Forty](#c136), B (`you_held`)):*

  **Ready Now**

  Faizal, whom you have mentored for years and who once corrected your paper in front of forty people, is up for promotion. The panel wants your view first. Faizal is younger than you were at the same grade, and rising faster: everyone at the table can work out who will be senior to whom in ten years.

  **A. Back Faizal, without reservation.**

  > The panel takes your word. Faizal is promoted within the month and posted elsewhere. At the farewell kopi, Faizal mentions, kindly, the strategy retreat where you held your line, and the kopi after it where you gave way.

  **B. Say: not yet. One more year.**

  > The minutes record "not yet". Faizal stays another year under you and does the best work of his career so far, in a way that is hard to take as a compliment.

- *The text above.* *(`claimed`)*

</details>

[← 136](#c136) · [Next → 138](#c138) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c138"></a>138. The Consultancy

[← 137](#c137) · [Next → 139](#c139) · [Contents](../DECK-DESIGN.md#contents)

`headhunter_mid` · events.json · once a career · weight 8

**Who sees it:** Senior Director to Permanent Secretary; not while the scholarship bond runs.

**Shares a decision** (`private_offer`) with [#73](#c73), [#177](05-politics.md#c177), [#178](05-politics.md#c178), [#101](#c101): a career sees only one.

A consultancy, the kind that charges a ministry \$1.9 million for a deck, wants to hire someone who knows what ministries actually want. Apparently that's you. Accepting means resigning from the service near the top of it. The offer letter is on very good paper.

**A. Take it.**

> Your first engagement is with your old ministry. The slides are beautiful, and they say what your memos used to say.

- Leaves for the private sector: the career ends, with fees of twice the grade's pay for each year to retirement (3 to 10 years), after tax.
- ↳ Can lead to: [The Consultancy](09-endings.md#end-consultancy)

**B. Decline, and tell them why.**

> They take it well, and quote you in a thought-leadership piece about public-sector talent.

- Hidden: Reputation up a little (+2), Integrity up (+5).

**C. Decline, and keep the letter in a drawer.**

> The drawer is the top one. You open it more often than you'd admit.

- Hidden: Standing up a little (+2).

[← 137](#c137) · [Next → 139](#c139) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c139"></a>139. Three Options

[← 138](#c138) · [Next → 140](03-top-of-service.md#c140) · [Contents](../DECK-DESIGN.md#contents)

`ts_options` · packs/top_service.json · once a career · weight 5

**Who sees it:** Senior Director to Deputy Secretary.

You are drafting a paper for Cabinet, where the ministers decide together, on a choice your Minister has already made. Cabinet papers set out options. Your Minister would like three: the chosen one, one that costs four times as much, and one that does nothing. The real alternative, which is quite good, is not among them.

**A. Put the real alternative in as the second option.**

> The paper goes up with a real choice in it. Your Minister rewrites the comparison table personally, and Cabinet chooses the Minister's option anyway. One minister asks about the second option for nine minutes.

- Hidden: Competence up (+4), Standing down (−4), Integrity up a lot (+6).

**B. Write the three options as asked.**

> The expensive option costs four times as much, the cheap one does nothing, and the Minister's is approved in seven minutes. A minister remarks, approvingly, that the paper made the choice obvious. It did.

- Hidden: Standing up (+5), Integrity down a lot (−6).

**C. Put the real alternative in an annex.**

> One minister reads the annex, and asks at the meeting why the best idea in the paper is on page fourteen. Your Minister answers well. The question is not minuted, and is remembered.

- Hidden: Competence up (+4), Standing down a little (−2), Integrity up a little (+2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The Minister's office (service, `ministersOffice`), 40%: A hurts (−3) · B helps (+2) · C hurts (−1).
- The officer who countersigns your appraisal (service, `countersigner`), 35%: A helps (+2) · B hurts (−2) · C helps (+1).

[← 138](#c138) · [Next → 140](03-top-of-service.md#c140) · [Contents](../DECK-DESIGN.md#contents)

[← The first years](01-first-years.md#c1) · [Contents](../DECK-DESIGN.md#contents) · [The top of the service →](03-top-of-service.md#c140)
