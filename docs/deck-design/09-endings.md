# The deck, with the mechanics: Endings

[← The endgame](08-endgame.md#c205) · [Contents](../DECK-DESIGN.md#contents)

## <a id="endings"></a>Endings

Every way a career ends.

### <a id="end-pm"></a>Prime Minister

> You made it. The formula pays you twice the entry-grade minister's salary, and the formula was published, so nobody can say they were not told.

**How it happens:** Promotion from Deputy Prime Minister needs an A, the years in grade, a ceiling (CEP) of 16, room for a tenure before 70, and not having put someone else in the job. The tenure's cards follow (three or four years), and the career ends after the last.

**Choices that lead here:** [212. Stepping Down](08-endgame.md#c212) (any choice)

### <a id="end-permsec"></a>Permanent Secretary

> The top of the civil service. No street is named after you and none ever will be, which is rather the point.

**How it happens:** Retirement (the last year at 63) at Permanent Secretary.

**Choices that lead here:** [205. The Last Year](08-endgame.md#c205) (any choice)

### <a id="end-level"></a>You Found Your Level

> Four decades, give or take, and retirement savings that will comfortably outlast you. The pewter plate says "Ms Lim Wei Ling, with appreciation". The scheme you designed in year nine is still running.

**How it happens:** Retirement (the last year at 63) at Deputy Secretary or below, without the tea's flags.

**Choices that lead here:** [205. The Last Year](08-endgame.md#c205) (any choice)

### <a id="end-declined"></a>The Tea Was Declined

> The party asked you to stand for election, and you said no. You are not sure, even now, whether it was principle or nerve. Everyone who knows you thinks it was principle.

**How it happens:** Retirement with `declined_tea` set (the tea's second choice).

**Choices that lead here:** [143. An Invitation to Tea](04-crossing.md#c143), B; [205. The Last Year](08-endgame.md#c205) (any choice)

### <a id="end-lostward"></a>Lost the Ward

> Forty-eight point two percent. You shook every hand in that ward and it was not enough. The concession speech was the best speech you ever gave.

**How it happens:** The first election lost (a GRC: 0.60 + Reputation/400 + Standing/500; a single seat: 0.28 + Reputation/200), or a re-election lost (0.72 + Reputation/250, at most 98%; a safe seat passes by itself and is never lost).

**Choices that lead here:** [146. The General Election](04-crossing.md#c146) (any choice); [147. Polling Day, Again](04-crossing.md#c147) (any choice)

### <a id="end-scandal"></a>Everything Surfaced

> Everything you had kept quiet came out in one week, which was merciful in its way. The press conference was eleven minutes long, and the next morning's headline was "Ms Lim resigns".

**How it happens:** Heat of 85 or more at any year-end review. Every choice that adds Heat moves toward it; the choices listed here add 6 or more.

**Choices that lead here:** any of [#5](01-first-years.md#c5) B, [#6](01-first-years.md#c6) A, [#14](01-first-years.md#c14) B, [#40](01-first-years.md#c40) A, [#41](01-first-years.md#c41) B, [#61](02-service.md#c61) C, [#72](02-service.md#c72) C, [#74](02-service.md#c74) A, [#99](02-service.md#c99) C, [#100](02-service.md#c100) B, [#108](02-service.md#c108) A, [#109](02-service.md#c109) C, [#110](02-service.md#c110) B, [#111](02-service.md#c111) A, [#112](02-service.md#c112) B, [#116](02-service.md#c116) B, [#139](03-top-of-service.md#c139) B, [#142](03-top-of-service.md#c142) B, [#155](05-politics.md#c155) B, [#162](05-politics.md#c162) B, [#180](06-cabinet.md#c180) C

### <a id="end-quiet"></a>The Quiet Conversation

> You were asked whether you had considered the private sector. No announcement was made. The email to your colleagues said only that Ms Lim "has moved on", and wished her well. Your pass stopped working on a Friday.

**How it happens:** A second D in a row once the improvement plan (or the Whip's word) has been played and the probation is over (after year four and the sixth card).

**Choices that lead here:** [7. The Improvement Plan](01-first-years.md#c7), A, C; [8. A Word from the Whip](01-first-years.md#c8), A, C

### <a id="end-backbench"></a>Backbench Lifer

> Never a portfolio. But at your last Meet-the-People Session there was a queue out the door, and half of them had come only to say "Thank you, Ms Lim".

**How it happens:** The political career ends (the renewal election after 65, or the year before 70) as a Member of Parliament.

**Choices that lead here:** [206. Renewal](08-endgame.md#c206) (any choice); [207. One More Term](08-endgame.md#c207), B; [208. The Last Year](08-endgame.md#c208) (any choice)

### <a id="end-office"></a>Never Quite Cabinet

> You answered Members' questions in Parliament, from answers your old colleagues had drafted, and answered them well. Cabinet was always one reshuffle away.

**How it happens:** The political career ends as Parliamentary Secretary to Senior Minister of State.

**Choices that lead here:** [206. Renewal](08-endgame.md#c206) (any choice); [207. One More Term](08-endgame.md#c207), B; [208. The Last Year](08-endgame.md#c208) (any choice)

### <a id="end-retired"></a>Retired, Honourably

> You served. The service continued. Both of these facts are entirely unremarkable and that is the highest compliment the system can pay.

**How it happens:** The political career ends as a Minister (MR4) or higher, below Prime Minister.

**Choices that lead here:** [206. Renewal](08-endgame.md#c206) (any choice); [207. One More Term](08-endgame.md#c207), B; [208. The Last Year](08-endgame.md#c208) (any choice)

### <a id="end-consultancy"></a>The Consultancy

> You now advise ministries on the problems you used to have. The decks are better designed than your memos were. They say the same things, and they cost \$1.9 million.

**How it happens:** A choice that leaves for the private sector ends the career at once, with the fees.

**Choices that lead here:** any of [#63](02-service.md#c63) A, [#92](02-service.md#c92) A, [#128](02-service.md#c128) A, [#167](05-politics.md#c167) A, [#168](05-politics.md#c168) A

### <a id="end-withdrawn"></a>The Invitation Lapsed

> The party read your file and decided the country could wait. You were never told which page. You have narrowed it down to three.

**How it happens:** Disclosing 3 or more Folder items at the background check sets `tea_withdrawn`; the career ends at retirement.

**Choices that lead here:** [144. The Background Check](04-crossing.md#c144), A; [205. The Last Year](08-endgame.md#c205) (any choice)

[Contents](../DECK-DESIGN.md#contents)

[← The endgame](08-endgame.md#c205) · [Contents](../DECK-DESIGN.md#contents)
