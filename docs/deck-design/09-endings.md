# The deck, with the mechanics: Endings

[← The endgame](08-endgame.md#c215) · [Contents](../DECK-DESIGN.md#contents)

## <a id="endings"></a>Endings

Every way a career ends.

### <a id="end-pm"></a>Prime Minister

> You made it. The formula pays you twice the entry-grade minister's salary, and the formula was published, so nobody can say they were not told.

**How it happens:** Promotion from Deputy Prime Minister needs an A, the years in grade, a ceiling (CEP) of 16, room for a tenure before 70, and not having put someone else in the job. The tenure's cards follow (three or four years), and the career ends after the last.

**Choices that lead here:** [222. Stepping Down](08-endgame.md#c222) (any choice)

### <a id="end-permsec"></a>Permanent Secretary

> The top of the civil service. No street is named after you and none ever will be, which is rather the point.

**How it happens:** Retirement (the last year at 63) at Permanent Secretary.

**Choices that lead here:** [215. The Last Year](08-endgame.md#c215) (any choice)

### <a id="end-level"></a>You Found Your Level

> Four decades, give or take, and retirement savings that will comfortably outlast you. The pewter plate says "Ms Lim Wei Ling, with appreciation". The scheme you designed in year nine is still running.

**How it happens:** Retirement (the last year at 63) at Deputy Secretary or below, without the tea's flags.

**Choices that lead here:** [215. The Last Year](08-endgame.md#c215) (any choice)

### <a id="end-declined"></a>The Tea Was Declined

> The party asked you to stand for election, and you said no. You are not sure, even now, whether it was principle or nerve. Everyone who knows you thinks it was principle.

**How it happens:** Retirement with `declined_tea` set (the tea's second choice).

**Choices that lead here:** [153. An Invitation to Tea](04-crossing.md#c153), B; [215. The Last Year](08-endgame.md#c215) (any choice)

### <a id="end-lostward"></a>Lost the Ward

> Forty-eight point two percent. You shook every hand in that ward and it was not enough. The concession speech was the best speech you ever gave.

**How it happens:** The first election lost (a GRC: 0.60 + Reputation/400 + Standing/500; a single seat: 0.28 + Reputation/200), or a re-election lost (0.72 + Reputation/250, at most 98%; a safe seat passes by itself and is never lost).

**Choices that lead here:** [156. The General Election](04-crossing.md#c156) (any choice); [157. Polling Day, Again](04-crossing.md#c157) (any choice)

### <a id="end-scandal"></a>Everything Surfaced

> Everything you had kept quiet came out in one week, which was merciful in its way. The press conference was eleven minutes long, and the next morning's headline was "Ms Lim resigns".

**How it happens:** Heat of 85 or more at any year-end review. Every choice that adds Heat moves toward it; the choices listed here add 6 or more.

**Choices that lead here:** any of [#5](01-first-years.md#c5) B, [#6](01-first-years.md#c6) A, [#14](01-first-years.md#c14) B, [#50](01-first-years.md#c50) A, [#51](01-first-years.md#c51) B, [#71](02-service.md#c71) C, [#82](02-service.md#c82) C, [#84](02-service.md#c84) A, [#109](02-service.md#c109) C, [#110](02-service.md#c110) B, [#118](02-service.md#c118) A, [#119](02-service.md#c119) C, [#120](02-service.md#c120) B, [#121](02-service.md#c121) A, [#122](02-service.md#c122) B, [#126](02-service.md#c126) B, [#149](03-top-of-service.md#c149) B, [#152](03-top-of-service.md#c152) B, [#165](05-politics.md#c165) B, [#172](05-politics.md#c172) B, [#190](06-cabinet.md#c190) C

### <a id="end-quiet"></a>The Quiet Conversation

> You were asked whether you had considered the private sector. No announcement was made. The email to your colleagues said only that Ms Lim "has moved on", and wished her well. Your pass stopped working on a Friday.

**How it happens:** A second D in a row once the improvement plan (or the Whip's word) has been played and the probation is over (after year four and the sixth card).

**Choices that lead here:** [7. The Improvement Plan](01-first-years.md#c7), A, C; [8. A Word from the Whip](01-first-years.md#c8), A, C

### <a id="end-backbench"></a>Backbench Lifer

> Never a portfolio. But at your last Meet-the-People Session there was a queue out the door, and half of them had come only to say "Thank you, Ms Lim".

**How it happens:** The political career ends (the renewal election after 65, or the year before 70) as a Member of Parliament.

**Choices that lead here:** [216. Renewal](08-endgame.md#c216) (any choice); [217. One More Term](08-endgame.md#c217), B; [218. The Last Year](08-endgame.md#c218) (any choice)

### <a id="end-office"></a>Never Quite Cabinet

> You answered Members' questions in Parliament, from answers your old colleagues had drafted, and answered them well. Cabinet was always one reshuffle away.

**How it happens:** The political career ends as Parliamentary Secretary to Senior Minister of State.

**Choices that lead here:** [216. Renewal](08-endgame.md#c216) (any choice); [217. One More Term](08-endgame.md#c217), B; [218. The Last Year](08-endgame.md#c218) (any choice)

### <a id="end-retired"></a>Retired, Honourably

> You served. The service continued. Both of these facts are entirely unremarkable and that is the highest compliment the system can pay.

**How it happens:** The political career ends as a Minister (MR4) or higher, below Prime Minister.

**Choices that lead here:** [216. Renewal](08-endgame.md#c216) (any choice); [217. One More Term](08-endgame.md#c217), B; [218. The Last Year](08-endgame.md#c218) (any choice)

### <a id="end-consultancy"></a>The Consultancy

> You now advise ministries on the problems you used to have. The decks are better designed than your memos were. They say the same things, and they cost \$1.9 million.

**How it happens:** A choice that leaves for the private sector ends the career at once, with the fees.

**Choices that lead here:** any of [#73](02-service.md#c73) A, [#102](02-service.md#c102) A, [#138](02-service.md#c138) A, [#177](05-politics.md#c177) A, [#178](05-politics.md#c178) A

### <a id="end-withdrawn"></a>The Invitation Lapsed

> The party read your file and decided the country could wait. You were never told which page. You have narrowed it down to three.

**How it happens:** Disclosing 3 or more Folder items at the background check sets `tea_withdrawn`; the career ends at retirement.

**Choices that lead here:** [154. The Background Check](04-crossing.md#c154), A; [215. The Last Year](08-endgame.md#c215) (any choice)

[Contents](../DECK-DESIGN.md#contents)

[← The endgame](08-endgame.md#c215) · [Contents](../DECK-DESIGN.md#contents)
