# The deck, with the mechanics: Politics

[← The crossing](04-crossing.md#c153) · [Contents](../DECK-DESIGN.md#contents) · [Cabinet →](06-cabinet.md#c190)

## <a id="stage-politics"></a>Politics

Member of Parliament to Senior Parliamentary Secretary. Cards 160 to 189.

### <a id="c160"></a>160. The Maiden Speech

[← 159](04-crossing.md#c159) · [Next → 161](#c161) · [Contents](../DECK-DESIGN.md#contents)

`maiden_speech` · events.json · once a career · weight 11 · opens a chapter: comes before anything scheduled

**Who sees it:** Member of Parliament to Parliamentary Secretary.

Your maiden speech, your first in Parliament, falls on day three of the debate on the President's Address, which opens each new Parliament. It tells the House, the press and the party what kind of Member you mean to be. You are a backbencher, a Member with no government job, and the Whip, who keeps the party's backbenchers voting together, will read every line. Hansard, the official record, keeps every word. You have written three drafts, and now you must choose which one to give.

**A. The draft about your ward.**

> Lifts, hawkers, and the chess table at a void deck, the open ground floor under a block. Three colleagues call it lovely in the lift, and your residents cut it out of the newsletter. Theirs is the only review that votes.

- Hidden: Standing up (+5), Reputation up (+3), Integrity down a little (−1).

**B. The draft about the one thing from the service you believe.**

> It is quoted, and for once the quoted line is the one you meant: "If a form needs a helpline, the form is the problem." A Minister you have never met sends a note: "That needed saying." The Whip sends a longer note, about what government backbenchers say in public.

- Hidden: Competence up (+4), Standing down (−5), Reputation up a lot (+12), Integrity up a lot (+8), this year's appraisal marked down (−6, said on screen).
- ↳ Can lead to: [161. Hansard](#c161), in four years, 40%

**C. The draft praising the policy you used to doubt.**

> Fluent, generous and on message. The Minister responsible nods twice. In your old ministry, an officer who sat through your objections for years reads it in Hansard and forwards it on without comment.

- Hidden: Competence up a little (+1), Standing up a lot (+6), Integrity down (−5).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your party branch and its volunteers (politics, `branch`), 45%: A helps (+3) · B hurts (−1) · C hurts (−1).
- The press gallery (politics, `pressGallery`), 40%: A hurts (−1) · B helps (+3) · C hurts (−2).
- The civil servants who work with you (politics, `officials`), 30%: B helps (+1) · C hurts (−3).

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2*

Day three of the debate on the President's Address, which opens each new Parliament: at 4:40pm you rise in the House to give your maiden speech, your first. It sets how the party and the press see you for years. You are a backbencher, a Member with no government job, and the Whip, who keeps backbenchers voting with the party, will read every line. Hansard, the official record, keeps every word. You have written three versions, all finished, and now you must choose which one to give.

**A. Give the version about your ward.**

> Eleven minutes on your blocks, your hawkers and the chess table in the void deck, the open ground floor of one of them. It is warm, local and over before the break. Your ward's newsletter prints it in full.

**B. Give the version with the thing you believe.**

> Eleven minutes on what you believed in the service and could never say there: "If a form needs a helpline, the form is the problem." The House goes quiet, the good kind. Afterwards the Whip's note to you is longer than that line.

**C. Give the version praising the policy you once doubted.**

> Generous and on message. The Minister responsible thanks you by name in the wrap-up. Your old colleagues, who heard your doubts for years, read it in Hansard and say nothing.

---

*Version 3*

Your maiden speech, your first in the House, as Members call Parliament, is next week. You are a backbencher, a Member with no government job, and the office of the Whip, who keeps backbenchers voting with the party, has sent guidance on length and tone, and a sample first line: "I rise in support of the motion." Whatever follows it goes into Hansard, the official record, and tells the party what kind of Member you will be. You have written three drafts of what follows it, and now you must choose which one to give.

**A. Write the rest about your ward.**

> The rest is about your ward, and it is good. A resident posts the Hansard link in the block's WhatsApp group with the caption "our one". You keep a screenshot.

**B. Write the rest about what you believe.**

> The rest is the thing you believed in the service and never said: "If a form needs a helpline, the form is the problem." It is quoted, mostly correctly. The Whip's office sends further guidance, this time addressed to you alone.

**C. Write the rest in the same spirit, and keep your doubts.**

> Nineteen minutes in support of the motion, with your doubts kept for later. The Whip's office uses your speech as next year's sample: the first line, and all the rest.

</details>

[← 159](04-crossing.md#c159) · [Next → 161](#c161) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c161"></a>161. Hansard

[← 160](#c160) · [Next → 162](#c162) · [Contents](../DECK-DESIGN.md#contents)

`speech_vindicated` · events.json · once a career

**Who sees it:** only as a follow-up to [160. The Maiden Speech](#c160) (B: in four years, 40%); [183. The Parliamentary Question](#c183) (A: in three years, 30%).

Years ago you stood up in the House and said plainly what you thought, when a safer version was ready in front of you. Your words went into Hansard, word for word. This week a newer Member quotes them in a speech, beginning "As Ms Lim Wei Ling said in this House". Someone on the front bench, where the ministers sit, looks up the original, and so does the press gallery.

**A. Send the newer Member a note.**

> The note is framed. You hear about this from four people, none of whom is the Member who framed it.

- Hidden: Standing up a lot (+6), Reputation up a lot (+6).

**B. Say nothing.**

> The quote goes round without you. It turns out to be the most-shared thing you've ever said, and it's years old.

- Hidden: Reputation up a lot (+8), Integrity up a lot (+6).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your fellow Members of Parliament (politics, `fellowMPs`), 40%: A helps (+1) · B hurts (−1).
- The press gallery (politics, `pressGallery`), 35%: A hurts (−1) · B helps (+1).

[← 160](#c160) · [Next → 162](#c162) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c162"></a>162. Tuesday Night

[← 161](#c161) · [Next → 163](#c163) · [Contents](../DECK-DESIGN.md#contents)

`the_mps_night` · events.json · can come back · weight 13

**Who sees it:** Member of Parliament and up.

**Series** `mps_night`: shown in full once a career, then its years pass by themselves on the habit; a card whose Meanwhile lines are spent is not drawn again.

**A Meanwhile year with no habit:** Reputation up (+3), Integrity up a little (+1).

It is Tuesday, the night of your weekly Meet-the-People Session, where residents bring you their problems and volunteers write appeal letters for them. Tonight there are forty-one residents, a queue to the lift lobby, and a man who has come every week for two years about a case that cannot be reopened. Parliament sits tomorrow, and your speech is half written.

**A. See every last one of them.**

> You finish at 12:40am and fix the two things that could be fixed. The man will be back next Tuesday, as he will be for nine more years. You finish the speech in the car, and it sounds it.

- Hidden: Competence down a little (−1), Reputation up (+5), Integrity up (+3).
- Habit: `everyone`.

**B. Take the hardest cases, and write them yourself.**

> You write eleven letters, each argued rather than copied from a template, and three succeed that would not have. Thirty residents are seen by your volunteers, who are very good, and are not you.

- Hidden: Competence up (+5), Standing down a little (−1), Reputation up (+3).
- Habit: `hardest`.

**C. Leave at ten. Finish the speech.**

> You leave at ten, and the speech goes well in the House. The volunteers stay until one. By Thursday a resident has posted about the evening, and the post is about what time you left.

- Hidden: Competence up a little (+2), Standing up (+3), Reputation down (−3).
- Habit: `speech`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your party branch and its volunteers (politics, `branch`), 50%: A helps (+3) · C hurts (−3).
- The Whip's office (politics, `whips`), 35%: A hurts (−1) · C helps (+2).

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2: Meet-the-People, After the Rain*

Your weekly Meet-the-People Session, where residents bring you their problems: a downpour at seven, so everyone comes at nine. In the queue are a family whose flat appeal has been turned down twice, and a man who wants the void deck, the open ground floor of his block, named after his father. Parliament sits at noon tomorrow, and you have not read your papers.

**A. Stay until the last one is seen.**

> Past one in the morning. The void deck will not be renamed, and you tell him so, kindly enough that he shakes your hand twice. You read your papers for the sitting in the car.

**B. Take the family's appeal, and write it yourself.**

> Two pages, citing the right paragraph. The appeal succeeds on the third try, which the family credits to persistence and you credit to the paragraph. A volunteer sees the void deck man.

**C. Leave the volunteers to finish. Read your papers.**

> You leave at ten and are word-perfect in the House. Your volunteers see the last resident out after midnight. The following Tuesday, the void deck man asks, pointedly, whether you are staying tonight.

---

*Version 3: Tuesday Night, the Lift*

Thirty residents at tonight's Meet-the-People Session, all about one thing: a lift that has been under upgrading for eleven months. Nobody is angry with you. Everybody would like you to be angry on their behalf, tonight, in person. Parliament sits tomorrow, and you have papers to read.

**A. See every one of them, one by one.**

> Thirty conversations about the same lift, until one in the morning. They go home feeling heard. That is not a lift, but it is not nothing.

**B. Write about the lift properly, tonight.**

> Your letter names the contractor, the start date and the eleven months. A new completion date arrives within the week, and is met. Volunteers saw the residents, and the residents noticed that you did not.

**C. Let the volunteers take the rest.**

> You leave at ten to prepare for the House. Twenty-nine residents are seen about the lift. The thirtieth wanted you, and mentions it at every block party for a year.

</details>

<details><summary>Meanwhile lines (18)</summary>

A year that passes by itself on the habit shows one line, never the same one twice in a career.

**Habit A, `everyone`**

- You see every resident on Tuesday nights, and a man whose case cannot be reopened now brings you kueh, still warm from the market.
- Your Meet-the-People Session runs past midnight again, and the volunteers have started bringing cushions.
- The coffee shop downstairs now closes before your Meet-the-People Session does, every week.
- Another Tuesday ends after midnight, with the last resident apologising for the hour and seen anyway.
- A resident brings a folder of letters from three MPs before you, and you read every one.
- The last resident of the night only wants to say thank you, and you stay for all forty minutes of it.

**Habit B, `hardest`**

- You write the hardest appeals yourself, and three a month now succeed that would not have.
- An appeal you argued yourself is approved, and the resident thanks the volunteer who typed it, fairly.
- You write the hard appeals yourself again, and one agency has started to recognise your paragraphs.
- A letter you drafted on a Tuesday gets a reply by Friday, and the volunteers call it a record.
- Your letters to agencies now open with the right section number, and the agencies have noticed.
- A volunteer asks how you write the hard appeals, and you teach the paragraph, not the template.

**Habit C, `speech`**

- You leave the Tuesday session at ten again, and the volunteers see the rest of the queue, very well and very tired.
- A resident thanks you for the new lifts, which were the Town Council's doing, and you accept on its behalf and leave at ten.
- Your speech for Parliament is done by Wednesday, because the volunteers saw out the Tuesday queue without you.
- You leave Meet-the-People at ten again, and the volunteers no longer look up when the lift doors close.
- Your speech is the best-prepared in the House, and the Tuesday queue is a little longer for it.
- The volunteers keep a list of the residents who asked for you after ten, and give it to you monthly.

</details>

[← 161](#c161) · [Next → 163](#c163) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c163"></a>163. The Ribbon

[← 162](#c162) · [Next → 164](#c164) · [Contents](../DECK-DESIGN.md#contents)

`the_ribbon` · events.json · once a career · weight 6

**Who sees it:** Member of Parliament to Senior Parliamentary Secretary.

Today's ribbon is at the handover of the new lifts at Blk 412, and as the ward's MP you are there to cut it. Mdm Rohani, who organised it, is waiting at the ribbon with the scissors. Twenty minutes in, it starts to rain on the speeches. Residents will notice how long you stay and who gets the credit.

**A. Stay to the end, and talk to everyone.**

> You stay through the rain and the speeches, and shake every wet hand there is. Mdm Rohani mentions it to every residents' committee in the ward by Monday.

- Hidden: Competence up a little (+2), Standing down (−4), Reputation up a lot (+6).

**B. Cut the ribbon, smile, and go.**

> You cut the ribbon under someone else's umbrella and are gone before the second speech. Mdm Rohani walks you to the car without a word, and that says enough.

- Hidden: Standing up (+5), Reputation down (−3).

**C. Hand Mdm Rohani the scissors. It was her work.**

> Mdm Rohani, the Citizens' Consultative Committee chairman, cuts the ribbon slowly, to applause that is mostly for her, and keeps the scissors.

- Hidden: Standing down (−5), Reputation up (+4), Integrity up a lot (+6).
- The grassroots leader, if this showing named them: marks `you_gave_the_scissors`.
- The fellow MP, if this showing named them: marks `you_gave_the_scissors`.
- The journalist, if this showing named them: marks `you_stepped_aside`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your party branch and its volunteers (politics, `branch`), 45%: A helps (+2) · B hurts (−3) · C helps (+1).
- Your fellow Members of Parliament (politics, `fellowMPs`), 50%, when the part `host` is `mp`: B hurts (−2) · C helps (+2).
- The press gallery (politics, `pressGallery`), 50%, when the part `host` is `journalist`: A helps (+2) · B hurts (−1) · C hurts (−1).

<details><summary>This card varies (3 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `occasion`

- the handover of the new lifts at Blk 412 *(`lifts`; shown above)*
- the reopening of the hawker centre after renovation *(`hawker`)*
- the opening of a rooftop garden on the multi-storey car park *(`garden`)*
- the launch of a fitness corner first planned six years ago *(`fitness`)*

**Part 2** · `host`

- Mdm Rohani, who organised it, *(`grassroots`; choice C: Reputation up a little (+2); shown above)*
  - `where`: is waiting at the ribbon with the scissors
  - `give`: Hand Mdm Rohani the scissors. It was her work.
  - `saw`: Mdm Rohani mentions it to every residents' committee in the ward by Monday.
  - `left`: Mdm Rohani walks you to the car without a word, and that says enough.
  - `gave`: Mdm Rohani, the Citizens' Consultative Committee chairman, cuts the ribbon slowly, to applause that is mostly for her, and keeps the scissors.
- Benedict, the MP for the next ward, *(`mp`; choice B: Standing up a little (+1))*
  - `where`: has come with a spare pair of scissors, hoping to share the photograph
  - `give`: Hand Benedict the scissors, and stand at the back.
  - `saw`: Benedict leaves halfway, and is in none of the photographs.
  - `left`: Benedict stays for the rest of it, and is in every photograph.
  - `gave`: Benedict cuts the ribbon. The newsletter's photograph is of Benedict, captioned with the name of your ward, and the Whip asks you why.
- Rajesh Nair, a reporter from the paper, *(`journalist`; choice A: Reputation up a little (+2); choice B: Reputation down a little (−2))*
  - `where`: is waiting by the ribbon with a camera
  - `give`: Ask Mr Nair to photograph the residents, not you.
  - `saw`: Mr Nair files three paragraphs about it, and all three are accurate.
  - `left`: Mr Nair photographs you leaving. It is the photograph that runs.
  - `gave`: The photograph that runs is of four residents and a pair of scissors. It is the best one the paper prints that month, and you are not in it.

**Part 3** · `snag`

- Twenty minutes in, it starts to rain on the speeches. *(`rain`; shown above)*
  - `stay`: You stay through the rain and the speeches, and shake every wet hand there is.
  - `go`: You cut the ribbon under someone else's umbrella and are gone before the second speech.
- A resident has brought a petition about the bus stop, and a folding chair. *(`petition`; choice A: Reputation up a little (+2); choice B: Reputation down a little (−2))*
  - `stay`: You sit beside the folding chair and read the petition, which has 212 signatures and one good idea.
  - `go`: You accept the petition with both hands, pass it to an aide with one, and leave.
- The ribbon is the wrong colour. The right one is stuck in traffic on the expressway. *(`ribbon`)*
  - `stay`: You wait forty minutes for the van and talk to everyone in the queue, and everyone is in the queue.
  - `go`: You cut the wrong ribbon. Nobody minds except the person who ordered the right one.
- You are due across the ward in fifteen minutes. *(`late`; choice A: Standing down a little (−2))*
  - `stay`: You stay, and reach the next event as it is packing up, apologising mainly to the chairs.
  - `go`: You cut the ribbon on time and are across the ward in fourteen minutes, which the driver mentions.

</details>

[← 162](#c162) · [Next → 164](#c164) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c164"></a>164. The Walkabout

[← 163](#c163) · [Next → 165](#c165) · [Contents](../DECK-DESIGN.md#contents)

`the_walkabout` · events.json · can come back · weight 11

**Who sees it:** Member of Parliament and up.

**Series** `walkabout`: shown in full once a career, then its years pass by themselves on the habit; a card whose Meanwhile lines are spent is not drawn again.

**A Meanwhile year with no habit:** Reputation up a little (+2).

It is 7:20am at the wet market in your ward, on a walkabout with a camera crew: a slow walk past every stall, meeting voters. A stallholder has strong and specific views about the price of chillies, and is delighted to share them, at volume. Fourteen stalls are still to go, and every one of them votes.

**A. Listen to her properly, on camera.**

> Four minutes of her talking and you not interrupting. The clip is shared widely, and the comments are, unusually, kind. The last fourteen stalls get nine seconds each.

- Hidden: Standing down a little (−2), Reputation up a lot (+7), Integrity up (+3).
- Habit: `listen`.

**B. Keep moving. Every stall gets a handshake.**

> Every stall in forty minutes. The photographs are excellent, and nobody remembers a word you said.

- Hidden: Standing up (+4), Reputation down a little (−2).
- Habit: `move_on`.

**C. Take her number. Call her tonight, off camera.**

> You call at nine. She talks for forty minutes about chillies, supply chains and her nephew. None of it is filmed, and two of her points end up in your letter to the ministry.

- Hidden: Competence up (+3), Reputation down a little (−1), Integrity up (+3).
- Habit: `call_back`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The press gallery (politics, `pressGallery`), 45%: A helps (+2) · B hurts (−2).
- Your party branch and its volunteers (politics, `branch`), 40%: A hurts (−1) · B helps (+2) · C hurts (−1).

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2: The Hawker Centre*

A lunchtime walkabout at a hawker centre in your ward, table by table, meeting voters, with photographers. The uncle at the drinks stall wants to explain, in detail, why his rent has gone up and what should be done about it. The other stalls are watching to see how long you give him.

**A. Sit down and hear him out.**

> Twenty minutes, one kopi going cold, and a written follow-up on his rent. The one photographer who stayed gets the best picture of the day. The next three stalls get none of your time.

**B. Buy a kopi, smile, and keep moving.**

> You pay for the kopi, smile for the photograph and move on. In the photograph, he is still talking.

**C. Ask for his number. Call him tonight.**

> You call after dinner. He has prepared notes. His rent case goes to the agency under your name the next morning, and there is no photograph of any of it.

---

*Version 3: The Estate Visit*

An estate walkabout in your ward: eight blocks before lunch, then a ribbon to cut, with cameras all the way. A resident on a mobility scooter wants to show you a ramp that does not quite reach the kerb. It is two blocks off your route, and the ribbon is on a schedule.

**A. Go and look at the ramp.**

> You walk the ramp with her, slowly, cameras behind you. It is two centimetres short, and fixed within a fortnight. The ribbon is cut forty minutes late, to applause from people who wanted lunch.

**B. Promise someone will look, and stay on schedule.**

> Someone does look, eventually. The ribbon is cut on time, by you, in a photograph that is very well lit.

**C. Get her number. Send someone this afternoon.**

> An officer measures the ramp at four: two centimetres short. It is fixed within a fortnight. She sends you a photograph of herself using it, and nobody else ever sees it.

</details>

<details><summary>Meanwhile lines (18)</summary>

A year that passes by itself on the habit shows one line, never the same one twice in a career.

**Habit A, `listen`**

- Wet markets at 7am, with cameras, until you know the price of chillies better than the price of anything else.
- On a walkabout an auntie says you looked thinner on television, and you hear out the rest of what she has to say, about her lift.
- A stallholder you once heard out on camera now greets you every visit with the latest price rises.
- Another walkabout, another auntie, and four minutes of footage about her lift that the news runs in full.
- A fishmonger explains the price of fish to you on camera, and the clip is shared mostly by fishmongers.
- You hear out a complaint about a bus route on camera, and the route is changed, though not because of the camera.

**Habit B, `move_on`**

- A walkabout in the rain, on schedule, and the photograph of you under someone else's umbrella does very well.
- Eleven market stalls in forty minutes: everyone gets a handshake and nobody gets a sentence.
- Fourteen stalls, fourteen handshakes and a volunteer one step behind you with hand sanitiser.
- The walkabout keeps to time, and the photographs are better than anything anyone said.
- Every stall gets a handshake before nine, and you are in the car by a quarter past, as planned.
- The walkabout is so punctual that the stallholders now time their breaks by it.

**Habit C, `call_back`**

- You take residents' phone numbers at walkabouts and call them at night, and your call log becomes the best map of the ward.
- Three phone numbers on a napkin from the wet market, and you call all three that evening, off camera.
- You call a stallholder back about her rent, and she tells the next stall, and the next.
- A resident you called one night tells the whole residents' committee, and the committee now knows you as the MP who calls back.
- Your evening calls to residents now take longer than the walkabouts, and sort out more.
- A hawker you called back about her lease tells you the next week that it was renewed, as if you did it.

</details>

[← 163](#c163) · [Next → 165](#c165) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c165"></a>165. The Town Council

[← 164](#c164) · [Next → 166](#c166) · [Contents](../DECK-DESIGN.md#contents)

`town_council` · events.json · once a career · weight 9

**Who sees it:** Member of Parliament to Minister (MR4).

Lift C at Blk 77 has broken down nine times this year, and your Town Council, which runs the estates in your ward, must decide what to do. A proper replacement means a tender, which takes five months. Mdm Rohani, the Citizens' Consultative Committee chairman, knows a contractor who could start on Monday if the tender is waived. Waivers are allowed in an emergency, and auditors read every one.

**A. Tender it properly, and explain the delay.**

> Five months of complaints at every Tuesday session. The new lift comes in on budget from the lowest compliant bid. Years later the auditors read the file and find nothing to say.

- Hidden: Competence up (+5), Reputation down (−4), Integrity up a lot (+10).
- The grassroots leader, if this showing named them: marks `slow_lifts`.

**B. Waive the tender. Call Mdm Rohani's contractor.**

> The lift runs again in eleven weeks and the block is delighted. The waiver's justification is two lines long. The Town Councils Financial Rules expect more, and so, one day, will an auditor.

- Hidden: Reputation up a lot (+8), Integrity down a lot (−10), Heat up a lot (+22).
- The grassroots leader, if this showing named them: marks `fast_lifts`.
- ↳ Can lead to: [Everything Surfaced](09-endings.md#end-scandal)

**C. Have the regular contractor patch it while the tender runs.**

> The regular contractor patches Lift C six times in five months, at a cost the finance committee reads out slowly. The new lift arrives on budget, and the patches are minuted separately.

- Hidden: Competence up (+3), Standing down (−3), Reputation up a little (+2), Integrity up a little (+2).
- The grassroots leader, if this showing named them: marks `patched_lifts`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your party branch and its volunteers (politics, `branch`), 50%: A hurts (−2) · B helps (+3).
- The party's leadership and the Prime Minister's office (politics, `leadership`), 30%: A helps (+1) · B hurts (−3).

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2*

Blk 77's lift keeps breaking down, and the Town Council, which runs the estates in your ward, meets to decide on a new one. The slide from the managing agent, the firm that runs the estate day to day, has three options. The third, circled in pen, comes from Mdm Rohani, the Citizens' Consultative Committee chairman: a firm that could start on Monday, without a tender. Skipping a tender is allowed in an emergency, and auditors check every time it happens. Every head turns to you.

**A. Choose the tender, and minute why.**

> The minutes record why, in a paragraph you dictate yourself. Mdm Rohani votes with you and does not speak to you at the tea break. The lift is replaced in five months.

**B. Choose the circled option, as an emergency.**

> The firm starts on Monday and finishes in eleven weeks. The minutes say "emergency" twice. At the next block party you thank Mdm Rohani in front of the firm's banner, and the waiver waits on file for the auditors.

**C. Propose a fourth option: patch it, and tender.**

> The meeting agrees, with relief, to the option you have just invented. The regular contractor keeps the lift running, mostly. The tender closes on time, and so, eventually, does the lift door.

---

*Version 3*

At 8am you are on the fourteenth floor of Blk 77, because the lift is not. A resident in a wheelchair has missed two dialysis sessions. A proper tender for a new lift takes five months. Mdm Rohani, the Citizens' Consultative Committee chairman, hands you a phone: a contractor who can start on Monday, if your Town Council, which runs the estates in your ward, waives the tender and answers for it later.

**A. Hand the phone back. The tender stays.**

> The Town Council helps her down the stairs, with a day's notice, for every session of the tender's five months. At the new lift's opening she tells you there are 168 steps.

**B. Take the call. Monday it is.**

> The contractor starts on Monday. The lift works by Christmas and she makes every session. The paperwork follows in January, written to fit what happened. Auditors prefer it the other way round.

**C. Get the regular contractor out today, and tender the rest.**

> The regular contractor has the lift moving by evening, and patches it twice more by Christmas. The tender runs its five months. She does not miss a session, and never lets you forget the morning.

</details>

[← 164](#c164) · [Next → 166](#c166) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c166"></a>166. The Void Deck

[← 165](#c165) · [Next → 167](#c167) · [Contents](../DECK-DESIGN.md#contents)

`strange_dragon` · packs/strange.json · once a career · weight 1.4

**Who sees it:** Member of Parliament to Senior Parliamentary Secretary; not after any of [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](02-service.md#c90), [#124](02-service.md#c124), [#125](02-service.md#c125), [#134](02-service.md#c134), [#140](03-top-of-service.md#c140), [#167](#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201) (`strange_met`).

A dragon has nested in the void deck of Block 412, the open space beneath the flats, in your ward. Residents find it quiet, and warm. The housing board, the Town Council and the parks board have each written to say it is another agency's problem. Now the dragon has queued at your weekly Meet-the-People Session, where residents come for help with agencies: it wants your help to appeal to IRAS, the tax authority, for the lower property tax rate that owner-occupiers pay.

**A. Write it an appeal letter, as you would for anyone.**

> You seek IRAS's kind consideration, in the usual form. IRAS replies that owner-occupier rates need an individual who owns the property. The dragon accepts this. Dragons understand ownership.

- Hidden: Standing down (−3), Reputation up (+5), Integrity up a little (+2).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](02-service.md#c90), [#124](02-service.md#c124), [#125](02-service.md#c125), [#134](02-service.md#c134), [#140](03-top-of-service.md#c140), [#167](#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201).

**B. Table it at the Town Council. Void decks are common property.**

> The Town Council agrees that the void deck is common property and the dragon is not. It is minuted under any other matters, where it stays for four years.

- Hidden: Competence up (+4), Standing up a little (+2), Reputation down a little (−2).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](02-service.md#c90), [#124](02-service.md#c124), [#125](02-service.md#c125), [#134](02-service.md#c134), [#140](03-top-of-service.md#c140), [#167](#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201).

**C. Call a site visit with all three agencies.**

> Officers from all three arrive at 9am, each with a folder showing it is the others'. The dragon hears them out, then asks which of them handles the lighting.

- Hidden: Competence up (+3), Standing down (−4), Reputation up (+3).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](02-service.md#c90), [#124](02-service.md#c124), [#125](02-service.md#c125), [#134](02-service.md#c134), [#140](03-top-of-service.md#c140), [#167](#c167), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your party branch and its volunteers (politics, `branch`), 40%: A helps (+2) · B hurts (−1) · C hurts (−1).
- The press gallery (politics, `pressGallery`), 30%: A helps (+1) · B hurts (−2) · C helps (+1).

[← 165](#c165) · [Next → 167](#c167) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c167"></a>167. As Meant

[← 166](#c166) · [Next → 168](#c168) · [Contents](../DECK-DESIGN.md#contents)

`strange_hansard` · packs/strange.json · once a career · weight 1.1

**Who sees it:** Member of Parliament to Senior Minister of State; not after any of [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](02-service.md#c90), [#124](02-service.md#c124), [#125](02-service.md#c125), [#134](02-service.md#c134), [#140](03-top-of-service.md#c140), [#166](#c166), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201) (`strange_met`).

For one sitting day, the draft Hansard has recorded what each Member meant instead of what they said. Your speech that day, as printed, says what you really think. Members have the usual 72 hours to ask for corrections, and the editors already have ninety-one requests. Whether you ask or not, people will notice.

**A. Ask for a correction to what you said.**

> The editors may only fix typing and grammar, so changes of substance go to the Speaker. The Speaker reads your request, then your speech, and restores what you said.

- Hidden: Standing up (+4), Integrity down (−4).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](02-service.md#c90), [#124](02-service.md#c124), [#125](02-service.md#c125), [#134](02-service.md#c134), [#140](03-top-of-service.md#c140), [#166](#c166), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201).

**B. Let it stand. You meant it.**

> Yours is one of four speeches published as meant. A newspaper reprints it in full, under "What Ms Lim meant". Several colleagues tell you privately that they meant the same, and asked for corrections.

- Hidden: Standing down (−5), Reputation up (+4), Integrity up (+5).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](02-service.md#c90), [#124](02-service.md#c124), [#125](02-service.md#c125), [#134](02-service.md#c134), [#140](03-top-of-service.md#c140), [#166](#c166), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201).

**C. Ask that both versions be published.**

> The request goes to the Standing Orders Committee, which keeps Parliament's rule book. It considers the request at length and finds, on reflection, that it would rather not.

- Hidden: Competence up (+3), Standing down a little (−2), Reputation up a little (+2).
- Sets `strange_met`: read by [#14](01-first-years.md#c14), [#17](01-first-years.md#c17), [#27](01-first-years.md#c27), [#66](01-first-years.md#c66), [#90](02-service.md#c90), [#124](02-service.md#c124), [#125](02-service.md#c125), [#134](02-service.md#c134), [#140](03-top-of-service.md#c140), [#166](#c166), [#198](06-cabinet.md#c198), [#201](06-cabinet.md#c201).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The Whip's office (politics, `whips`), 45%: A helps (+2) · B hurts (−3) · C helps (+1).
- The press gallery (politics, `pressGallery`), 45%: A hurts (−2) · B helps (+3) · C hurts (−1).

[← 166](#c166) · [Next → 168](#c168) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c168"></a>168. The Adjournment Motion

[← 167](#c167) · [Next → 169](#c169) · [Contents](../DECK-DESIGN.md#contents)

`bench_adjournment` · packs/backbench.json · once a career · weight 7

**Who sees it:** Member of Parliament to Senior Parliamentary Secretary.

**Shares a decision** (`house_brief`) (Parliamentary Secretary and up) with [#183](#c183), [#170](#c170), [#130](02-service.md#c130), [#186](#c186): a career sees only one.

You have won the ballot for tonight's adjournment motion: twenty minutes, at the end of a long sitting, to raise the bus service your ward lost in the last route review, and a minister must reply. Backbenchers rarely get to pick the subject. Rajesh Nair, the only reporter left in the press gallery, has brought a sandwich.

**A. Speak for the full twenty minutes.**

> Twenty minutes on one bus service, at 9:40pm, and a ten-minute reply. Then the House passes your motion, which formally asks only that Parliament "do now adjourn", and everyone goes home.

- Hidden: Competence up a little (+2), Standing down (−4), Reputation up (+3), Integrity up (+3).

**B. Cut it to five. Let the House go home.**

> Five minutes, and the House is grateful in the lift. The reply, written for twenty minutes of argument, is read out in full, at the usual pace.

- Hidden: Standing up (+4), Reputation down a little (−2), Integrity down a little (−1).

**C. Send the ministry your speech the day before.**

> The reply answers every point you make, in order, including the one you cut at 9:38pm. You have never been so thoroughly answered, or so little reported.

- Hidden: Competence up (+3), Standing up a little (+2), Reputation down a little (−2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your fellow Members of Parliament (politics, `fellowMPs`), 40%, when the part `role` is `mover`: A hurts (−1) · B helps (+2) · C hurts (−1).
- The press gallery (politics, `pressGallery`), 50%, when the part `role` is `mover`; when the part `house` is `press`: A helps (+2) · B hurts (−1) · C hurts (−1).
- The civil servants who work with you (politics, `officials`), 40%, when the part `role` is `reply`: A hurts (−2) · B helps (+2).

<details><summary>This card varies (4 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `role` (the first option that fits)

- *The text above.* *(`mover`; when up to Member of Parliament)*
- *Read with this option (`reply`; when Parliamentary Secretary and up):*

  **The Adjournment Motion**

  Benedict, a fellow MP, has won the ballot for tonight's adjournment motion, a twenty-minute speech on something your ministry handles. The reply falls to you: ten minutes, at about ten o'clock, answering a colleague from your own party in public. Your officials' draft reply concedes nothing, beautifully.

  **A. Concede the point Benedict is right about.**

  > You concede it in your second minute and spend the other eight on what will change. Benedict thanks you across the floor. Your officials thank you less.

  **B. Read the draft, at a steady pace.**

  > The reply is read in full. Benedict listens with the face of a colleague, then posts the speech online with your reply beneath it, unedited.

  **C. Call Benedict beforehand, and agree the exchange.**

  > The exchange goes as agreed, which nobody watching can tell. Benedict thanks you in the lift. The newspaper calls the debate "cordial" and gives it two paragraphs.


**Part 2** · `topic`

- the bus service your ward lost in the last route review *(`bus`; shown above)*
  - `short`: one bus service
- caregivers who earn slightly too much for every scheme *(`carers`)*
  - `short`: caregivers
- lifts that are upgraded on schedule and break down off it *(`lifts`)*
  - `short`: lifts

**Part 3** · `house`

- Rajesh Nair, the only reporter left in the press gallery, has brought a sandwich. *(`press`; shown above)*
- By then the Chamber will hold eleven Members and the Clerks. *(`empty`)*
- Most Members still there are waiting for the item after yours: going home. *(`wait`)*

**Part 4** · `draft`

- Your officials' draft reply concedes nothing, beautifully. *(`nothing`; shown above)*
- The draft reply runs to twelve minutes. You have ten. *(`long`)*
- Your officials finished the draft reply before the speech it answers was written. *(`early`)*

</details>

[← 167](#c167) · [Next → 169](#c169) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c169"></a>169. The Arrears

[← 168](#c168) · [Next → 170](#c170) · [Contents](../DECK-DESIGN.md#contents)

`bench_arrears` · packs/backbench.json · once a career · weight 6

**Who sees it:** Member of Parliament to Senior Parliamentary Secretary.

At the meeting of your Town Council, which runs the estates in your ward, the managing agent proposes taking households more than six months behind on their S&CC, the monthly charges for the estate's upkeep, to court. Forty are on the list, and it needs the council's approval. One of them is a retired cleaner at Blk 52 who pays \$20 whenever she can.

**A. Approve it. The rules apply to everyone.**

> Thirty-one households pay within a month of the letters. Nine go to court, among them the cleaner, who brings the court's letter to your next Tuesday session.

- Hidden: Competence up a little (+2), Standing up (+4), Reputation down a little (−2).

**B. Take one name off the list, quietly.**

> Thirty-nine households get the letter. The cleaner does not, and never learns why. At the next meeting the managing agent's list has a footnote, and the footnote is you.

- Hidden: Reputation up a little (+2), Integrity down (−4), Heat up (+5).

**C. Change it for everyone: payment plans before courts.**

> Nobody goes to court. Arrears rise for a quarter, then fall below where they began. The agent presents the chart to three Town Councils as a warning, and to a fourth as advice.

- Hidden: Competence down a little (−1), Standing down (−4), Reputation up a little (+2), Integrity up (+5).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your party branch and its volunteers (politics, `branch`), 40%: A hurts (−2) · B helps (+1) · C helps (+1).
- Your fellow Members of Parliament (politics, `fellowMPs`), 35%: A helps (+1) · B hurts (−2) · C helps (+1).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `who`

- a retired cleaner at Blk 52 who pays \$20 whenever she can *(`cleaner`; shown above)*
  - `short`: the cleaner
- a hawker who lost three months' takings when the market was renovated *(`hawker`)*
  - `short`: the hawker
- a widower who comes to your Tuesday session every month to apologise for it *(`widower`)*
  - `short`: the widower

</details>

[← 168](#c168) · [Next → 170](#c170) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c170"></a>170. One Hundred Dollars

[← 169](#c169) · [Next → 171](#c171) · [Contents](../DECK-DESIGN.md#contents)

`bench_cut` · packs/backbench.json · once a career · weight 6

**Who sees it:** Member of Parliament to Senior Parliamentary Secretary.

**Shares a decision** (`house_brief`) (Parliamentary Secretary and up) with [#183](#c183), [#168](#c168), [#130](02-service.md#c130), [#186](#c186): a career sees only one.

At the Committee of Supply, the yearly debate on each ministry's budget, you want a few minutes to speak. To get them, you have filed a motion to cut the Ministry of Transport's budget by \$100, as Parliament's rules allow. Nobody expects the cut to pass. Your ward wants a sheltered walkway to the train station. You also have a harder question.

**A. Ask for what your ward wants.**

> The Minister promises, by name, to study a sheltered walkway to the train station. In your ward, that counts as delivery. You ask leave to withdraw your \$100 cut. Leave is granted.

- Hidden: Competence down a little (−2), Standing up a little (+1), Reputation up (+5).

**B. Ask the harder question.**

> The Minister answers carefully, and for longer than planned. You ask leave to withdraw your \$100. It is granted, a little more slowly than the others.

- Hidden: Competence up (+3), Standing down (−4), Integrity up (+4).

**C. Ask the question your party committee agreed on, word for word.**

> Four Members ask it in the same words. The Minister answers it once, warmly, and all four ask leave to withdraw their \$100. The budget is unchanged by \$400.

- Hidden: Standing up (+4), Reputation down a little (−1), Integrity down a little (−2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your party branch and its volunteers (politics, `branch`), 45%, when the part `role` is `mover`: A helps (+2) · B hurts (−1) · C hurts (−1).
- The Whip's office (politics, `whips`), 35%, when the part `role` is `mover`: A hurts (−1) · B hurts (−1) · C helps (+2).
- The civil servants who work with you (politics, `officials`), 40%, when the part `role` is `reply`: A hurts (−2) · B helps (+1) · C helps (+1).
- Your fellow Members of Parliament (politics, `fellowMPs`), 40%, when the part `role` is `reply`: A helps (+1) · B helps (+1) · C hurts (−2).

<details><summary>This card varies (2 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `role` (the first option that fits)

- *The text above.* *(`mover`; when up to Member of Parliament)*
- *Read with this option (`reply`; when Parliamentary Secretary and up):*

  **One Hundred Dollars**

  At the Committee of Supply, the yearly debate on each ministry's budget, Members have filed eleven token cuts of \$100 to your ministry's budget, the usual way to get time to speak, and four of the replies are yours. One Member wants something for a ward. Another has asked a harder question.

  **A. Promise the Member a study, naming the ward.**

  > You promise, naming the ward, to study it. Its residents count that as delivery. Your officials count it as a new workstream, with a deadline you have just set.

  **B. Answer the harder cut properly, past your time.**

  > You run four minutes over on the harder cut. The Member asks leave to withdraw the \$100, and thanks you in a tone that sounds, unusually, sincere.

  **C. Read the replies your officials drafted.**

  > The replies are accurate, and written for the questions the ministry expected. All four Members ask leave to withdraw their \$100 anyway. That is what the \$100 is for.


**Part 2** · `head`

- the Ministry of Transport *(`mot`; shown above)*
  - `ward`: a sheltered walkway to the train station
- the Ministry of Health *(`moh`)*
  - `ward`: a polyclinic nearer than the next town's
- the Ministry of Social and Family Development *(`msf`)*
  - `ward`: longer hours at the family service centre
- the Ministry of National Development *(`mnd`)*
  - `ward`: lifts for the three blocks the upgrading missed

</details>

[← 169](#c169) · [Next → 171](#c171) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c171"></a>171. The Briefing

[← 170](#c170) · [Next → 172](#c172) · [Contents](../DECK-DESIGN.md#contents)

`bench_gpc` · packs/backbench.json · once a career · weight 6

**Who sees it:** Member of Parliament to Senior Parliamentary Secretary; the peer (Xin Yi) is Director and up.

**Shares a decision** (`bad_number`) with [#50](01-first-years.md#c50), [#59](01-first-years.md#c59), [#92](02-service.md#c92): a career sees only one.

Your GPC, the party's committee of backbench MPs who shadow one ministry, is briefed, behind closed doors, on a scheme you worked on in the service. The briefer is Xin Yi, a Senior Director now, who started in the service the same week as you. Slide nine leaves out the scheme's weakest number, just as you would have. Asking about it would put Xin Yi on the spot in front of MPs.

**A. Ask about what slide nine leaves out.**

> Xin Yi answers it fully, with a figure you recognise. Afterwards Xin Yi sends one word: "Thanks." Slide nine, you realise, was left that way for somebody to ask.

- Hidden: Competence up (+3), Standing down (−3), Integrity up (+4).
- The peer, if this showing named them: marks `asked_about_slide_nine`.

**B. Thank Xin Yi for a comprehensive briefing.**

> The GPC thanks Xin Yi, and Xin Yi thanks the GPC. The scheme goes ahead as briefed, weak number and all. GPCs publish no minutes, so the thanks are the only record.

- Hidden: Standing up (+4), Integrity down (−3).
- The peer, if this showing named them: marks `let_slide_nine_pass`.

**C. Ask Xin Yi about it afterwards, over kopi.**

> Xin Yi comes for kopi, talks about old colleagues for forty minutes, and says of the scheme only: "It's in the briefing." It was, on page forty of the annex.

- Hidden: Competence up a little (+1), Standing up a little (+2), Integrity down a little (−2).
- The peer, if this showing named them: marks `slide_nine_offline`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The civil servants who work with you (politics, `officials`), 40%: A helps (+2) · B hurts (−1) · C hurts (−1).
- Your fellow Members of Parliament (politics, `fellowMPs`), 35%, when the part `role` is `office`: A helps (+2) · B hurts (−1) · C hurts (−1).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `role` (the first option that fits)

- *The text above.* *(`member`; when up to Member of Parliament)*
- *Read with this option (`office`; when Parliamentary Secretary and up):*

  **The Briefing**

  As an office holder you must brief a GPC, the party's committee of backbench MPs who shadow your ministry, behind closed doors, on one of its schemes. The slides are by Xin Yi, a Senior Director now, who started in the service the same week as you. Slide nine leaves out the scheme's weakest number. The MPs will not know unless you tell them.

  **A. Tell them what slide nine leaves out.**

  > In a closed room, out loud, you name what is missing, and the GPC asks better questions for an hour. Afterwards Xin Yi sends one word: "Thanks." The slide had been left that way for you.

  **B. Present the slides as written.**

  > The GPC thanks you, and you thank the GPC. The scheme goes ahead as briefed, weak number and all. GPCs publish no minutes, so the thanks are the only record.

  **C. Ask Xin Yi to take slide nine.**

  > Xin Yi presents slide nine flawlessly and takes the hard question for you. Afterwards Xin Yi asks, lightly, whether you will be needing anyone for slide ten.


</details>

[← 170](#c170) · [Next → 172](#c172) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c172"></a>172. The Letter Writer

[← 171](#c171) · [Next → 173](#c173) · [Contents](../DECK-DESIGN.md#contents)

`bench_letters` · packs/backbench.json · once a career · weight 6

**Who sees it:** Member of Parliament to Senior Parliamentary Secretary.

At your weekly Meet-the-People Session, volunteers write residents' appeals to agencies. One agency's reply notes, politely, a discrepancy that leads to your best letter writer, Mr Boey, twenty-six years at the folding table. Every resident in Mr Boey's letters earns slightly less than on the forms. The letters work better than anyone else's, and every one goes out on your letterhead.

**A. Stop it. Send every agency a correction.**

> Corrections go to eleven agencies under your name. Four cases are reconsidered and three refused. Mr Boey stays on, and now writes what the forms say, more slowly.

- Hidden: Competence up a little (+1), Standing down a little (−1), Reputation down (−4), Integrity up a lot (+6).

**B. Leave it. The cases are real, if not the details.**

> The letters keep working. In the agency that noticed, someone opens a file of discrepancies, and every page of it is on your letterhead.

- Hidden: Competence down a little (−1), Reputation up (+4), Integrity down (−5), Heat up a lot (+7).
- ↳ Can lead to: [Everything Surfaced](09-endings.md#end-scandal)

**C. Read and sign every letter yourself from now on.**

> Your Tuesdays now end at one in the morning. The letters are accurate, and slightly less persuasive. Mr Boey brings you kopi at eleven, and you understand it to be a review.

- Hidden: Competence up (+4), Standing down a little (−2), Reputation down a little (−1), Integrity up (+3).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your party branch and its volunteers (politics, `branch`), 50%: A hurts (−1) · B helps (+2) · C hurts (−1).
- The civil servants who work with you (politics, `officials`), 40%: A helps (+2) · B hurts (−3) · C helps (+1).

<details><summary>This card varies (2 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `writer`

- Mr Boey, twenty-six years at the folding table *(`veteran`; shown above)*
  - `short`: Mr Boey
- Mdm Chew, a retired teacher *(`teacher`)*
  - `short`: Mdm Chew
- Darren, a law student who types very fast *(`student`)*
  - `short`: Darren

**Part 2** · `trick`

- Every resident in Mr Boey's letters earns slightly less than on the forms. *(`income`; shown above)*
- Every family in Mr Boey's letters has an elderly parent who has just had a fall. *(`fall`)*
- Mr Boey's letters cite a paragraph of the policy that does not exist, with great confidence. *(`para`)*

</details>

[← 171](#c171) · [Next → 173](#c173) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c173"></a>173. The Next Ward

[← 172](#c172) · [Next → 174](#c174) · [Contents](../DECK-DESIGN.md#contents)

`bench_next_ward` · packs/backbench.json · once a career · weight 6

**Who sees it:** Member of Parliament to Senior Parliamentary Secretary; after [156. The General Election](04-crossing.md#c156), A, B (`seat_grc`).

Your GRC is split into wards, one for each MP on the team. Blk 438 is in Benedict's ward, but its residents come to your Meet-the-People Session, your weekly evening for residents' problems, because your volunteers write faster. Benedict, a fellow MP, has mentioned this at the team's breakfast, as a joke, twice. It sounds less like a joke the second time.

**A. Keep seeing them. Residents choose.**

> Blk 438 keeps coming. Benedict stops mentioning it at breakfast. That is worse. In the team's newsletter photograph you stand at one end and Benedict at the other.

- Hidden: Standing down (−3), Reputation up (+4), Integrity up a little (+1).
- The fellow MP, if this showing named them: marks `kept_438`.

**B. Send them to Benedict, with a note on every case.**

> Benedict sees every one of them, properly, and thanks you at breakfast without a joke. By March Benedict's session also ends later. Two residents still come to yours.

- Hidden: Competence up a little (+2), Standing up (+3), Reputation down a little (−1).
- The fellow MP, if this showing named them: marks `owes_you`.

**C. Propose a joint session for the block.**

> Every fourth Tuesday, Blk 438 gets both of you at one table. Residents explain each case twice, once to each MP, and leave sure it will be done twice as fast.

- Hidden: Competence up (+3), Standing up a little (+1), Reputation down a little (−1), Integrity up a little (+1).
- The fellow MP, if this showing named them: marks `shared_438`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your fellow Members of Parliament (politics, `fellowMPs`), 55%: A hurts (−3) · B helps (+2) · C helps (+1).
- Your party branch and its volunteers (politics, `branch`), 40%: A helps (+2) · B hurts (−1) · C hurts (−1).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `reason`

- your volunteers write faster *(`fast`; shown above)*
- your session ends later *(`late`)*
- you once wrote a letter there that worked *(`letter`)*

</details>

[← 172](#c172) · [Next → 174](#c174) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c174"></a>174. The Other Candidate

[← 173](#c173) · [Next → 175](#c175) · [Contents](../DECK-DESIGN.md#contents)

`bench_other_candidate` · packs/backbench.json · once a career · weight 6

**Who sees it:** Member of Parliament to Senior Parliamentary Secretary; after [156. The General Election](04-crossing.md#c156), C (`seat_smc`).

The opposition candidate you beat at the last election has not stopped campaigning in your ward: Sundays at the wet market, in a party T-shirt, shaking hands you shook first. If residents warm to them, your single seat is at risk next time. The chairman of your party branch, which runs the party's volunteers in your ward, would like you out there too, in your own T-shirt.

**A. Match them, every weekend.**

> For a year, two T-shirts work the same stalls an hour apart. Residents compare you, in detail, out loud. Your papers for the House are read on Sunday nights.

- Hidden: Competence down (−3), Standing up a little (+1), Reputation up (+5).

**B. Leave them to it. Do the work instead.**

> Your weekends go to cases and papers. The other candidate is photographed with more residents than you are, and your branch chairman cuts the photographs out for you.

- Hidden: Competence up (+4), Reputation down (−3), Integrity up a little (+1).

**C. Invite them for kopi.**

> They accept. You talk about the lifts for an hour and agree on most of it. The photograph is online by noon, and the Whip asks, kindly, whose idea it was.

- Hidden: Standing down (−5), Reputation up a little (+2), Integrity up (+4).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your party branch and its volunteers (politics, `branch`), 50%: A helps (+2) · B hurts (−2).
- The press gallery (politics, `pressGallery`), 35%: A hurts (−1) · C helps (+2).
- The Whip's office (politics, `whips`), 35%: B helps (+1) · C hurts (−2).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `where`

- Sundays at the wet market *(`market`; shown above)*
- Saturday mornings at the train station exit *(`mrt`)*
- every weekend in the hawker centre's breakfast queue *(`hawker`)*

</details>

[← 173](#c173) · [Next → 175](#c175) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c175"></a>175. Not at This Block

[← 174](#c174) · [Next → 176](#c176) · [Contents](../DECK-DESIGN.md#contents)

`bench_site` · packs/backbench.json · once a career · weight 6

**Who sees it:** Member of Parliament to Senior Parliamentary Secretary.

A ministry has picked a site in your ward for an eldercare centre in the void deck of Blk 118, the open space under the block. A petition against it has 412 signatures and a Facebook group. The agency running it wants you, as the ward's MP, beside it at Saturday's dialogue with residents, and the residents who vote for you will see where you stand.

**A. Stand beside the agency. Say it is needed.**

> On Saturday you say so, and are heckled, politely, for forty minutes. Two years after it opens, the woman who started the petition drops her mother there on weekdays.

- Hidden: Competence up a little (+2), Standing up a little (+2), Reputation down (−5), Integrity up (+5).

**B. Ask the ministry to look at other sites.**

> The ministry finds a site two towns away. That ward has a petition too, with more signatures, and its MP rings you to ask how you did it.

- Hidden: Competence down a little (−1), Standing down (−3), Reputation up (+5), Integrity down (−4).

**C. Back it, if residents get something for the space.**

> The eldercare centre shrinks by a fifth, the residents get a fitness corner, and the agency gets its site a year late. Everyone describes this as a win, separately.

- Hidden: Competence up (+3), Standing down (−3), Reputation up a little (+2).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The civil servants who work with you (politics, `officials`), 45%: A helps (+2) · B hurts (−2).
- Your party branch and its volunteers (politics, `branch`), 40%: A hurts (−2) · B helps (+2).
- Your fellow Members of Parliament (politics, `fellowMPs`), 35%: A helps (+1) · B hurts (−2) · C helps (+1).

<details><summary>This card varies (2 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `site`

- an eldercare centre in the void deck of Blk 118, the open space under the block *(`eldercare`; shown above)*
  - `short`: the eldercare centre
  - `later`: Two years after it opens, the woman who started the petition drops her mother there on weekdays.
- a nursing home on the field beside the playground *(`nursing`)*
  - `short`: the nursing home
  - `later`: Three years after it opens, the block's choir sings there on Sundays. Two of the altos signed the petition.
- a halfway house in the old school building *(`halfway`)*
  - `short`: the halfway house
  - `later`: Five years on, two of its former residents work at the coffee shop that started the petition. Nobody brings it up.

**Part 2** · `objection`

- A petition against it has 412 signatures and a Facebook group. *(`petition`; shown above)*
- You have had 61 emails about it, all with the same subject line. *(`emails`)*
- Mdm Rohani reports that the coffee shop is against it, and so is her own block. *(`grassroots`)*

</details>

[← 174](#c174) · [Next → 176](#c176) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c176"></a>176. The Whip's Text

[← 175](#c175) · [Next → 177](#c177) · [Contents](../DECK-DESIGN.md#contents)

`bench_whip` · packs/backbench.json · once a career · weight 7

**Who sees it:** Member of Parliament to Senior Parliamentary Secretary.

At 10:52pm the Whip texts: "Pls be in the Chamber by 3pm tmr. Thx." Tomorrow's bill brings in data-sharing between nine agencies, without asking residents. You think it is wrong; the party supports it. Members vote the party line unless the Whip "lifts the whip" and lets them vote freely, and crossing the Whip costs you standing.

**A. Vote with the party. Send your view to the party's committee on the bill.**

> You vote with the party and email your view to the committee's chairman, who replies with a thumbs-up. The bill passes. Your view is filed with the thumbs-up.

- Hidden: Standing up (+5), Integrity down (−3).

**B. Speak against the data clause. Then vote for the bill.**

> Your eleven minutes against the data clause go into Hansard. So does your vote for the bill, an hour later. A resident writes to ask which one you meant. You write back: both.

- Hidden: Competence up a little (+1), Standing down (−3), Reputation up (+5), Integrity up a little (+2).

**C. Ask the Whip to lift the whip.**

> The Whip replies at 7am: "Not this one." You vote with the party. The Whip now keeps a short list of the bills you would like to be this one.

- Hidden: Standing down (−5), Integrity up (+5).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The Whip's office (politics, `whips`), 45%: A helps (+2) · B hurts (−2).
- The press gallery (politics, `pressGallery`), 35%, when the part `role` is `bench`: A hurts (−1) · B helps (+2).

<details><summary>This card varies (3 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `role` (the first option that fits)

- *The text above.* *(`bench`; when up to Member of Parliament)*
- *Read with this option (`office`; when Parliamentary Secretary and up; choice B: Competence up a little (+1), Reputation down (−3)):*

  **The Whip's Text**

  At 10:52pm the Whip texts: "Pls be in the Chamber by 3pm tmr. Thx." Tomorrow's bill brings in data-sharing between nine agencies, without asking residents. You think it is wrong; the party supports it. Members vote the party line unless the Whip "lifts the whip" and lets them vote freely, and crossing the Whip costs you standing.

  **A. Vote with the party. Keep your view to yourself.**

  > You vote with the party and the bill passes. Your view stays in a note on your phone, under a heading you do not open again.

  **B. Put your view to the bill's Minister. Then vote for it.**

  > The bill's Minister hears you out over kopi and accepts one change to the data clause: a comma. Your vote goes in with everyone else's. The comma goes into the Act.

  **C. Ask the Whip to lift the whip.**

  > The Whip replies at 7am: "Not this one." You vote with the party. The Whip now keeps a short list of the bills you would like to be this one.


**Part 2** · `msg`

- "Pls be in the Chamber by 3pm tmr. Thx." *(`attend`; shown above)*
- "Vote tmr. Pls acknowledge." *(`ack`)*
- "2nd Reading tmr. Want a slot to speak? Pls advise." *(`slot`; when up to Member of Parliament; choice B: Standing down a little (−1))*

**Part 3** · `bill`

- data-sharing between nine agencies, without asking residents *(`data`; shown above)*
  - `short`: the data clause
- new powers for a government agency, with appeals to its own Minister *(`appeals`)*
  - `short`: the appeals clause
- higher fines for parking offences in public housing car parks *(`fines`)*
  - `short`: the fines schedule

</details>

[← 175](#c175) · [Next → 177](#c177) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c177"></a>177. The Board Seat

[← 176](#c176) · [Next → 178](#c178) · [Contents](../DECK-DESIGN.md#contents)

`headhunter_political` · events.json · once a career · weight 7

**Who sees it:** Parliamentary Secretary to Minister (MR3); not while the scholarship bond runs; after [156. The General Election](04-crossing.md#c156), C (`seat_smc`).

**Shares a decision** (`private_offer`) with [#73](02-service.md#c73), [#138](02-service.md#c138), [#178](#c178), [#101](02-service.md#c101): a career sees only one.

A conglomerate wants someone who has worked close to Cabinet on its board: four meetings a year, and a fee its annual report puts in a footnote. The chairman knows you hold office, and asks only whether you might be free "after". Saying yes means leaving politics at the next election.

**A. Tell the Prime Minister you will not stand again.**

> The Prime Minister asks you to see out the term, and you do. At the election a new candidate wins your old seat. The board seat, as promised, has been kept warm.

- Hidden: Heat down (−3).
- Leaves for the private sector: the career ends, with fees of twice the grade's pay for each year to retirement (3 to 10 years), after tax.
- ↳ Can lead to: [The Consultancy](09-endings.md#end-consultancy)

**B. Decline.**

> You decline in writing. You later learn that your letter is framed in the chairman's office, as a curiosity.

- Hidden: Reputation up (+3), Integrity up (+4).

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2*

At a charity dinner, a company chairman you have met twice steers you to the window. His board needs someone who has worked close to Cabinet, once you are out of office. Saying yes means leaving politics at the next election. He names the fee quietly, then again, in case you were being polite.

**A. Tell the Prime Minister you will not stand again.**

> The Prime Minister asks you to see out the term, and you do. A new candidate holds your seat at the election. Flowers arrive at your first board meeting, the first of four that year.

**B. Thank him, and decline.**

> You decline at the window, smiling. He says the offer will keep, and every Chinese New Year a card arrives to show that it is keeping.

---

*Version 3*

A search firm writes, on paper thick enough to stand up by itself, about a client's board seat for someone who has worked close to Cabinet, from "a date convenient to you": after you leave politics. Saying yes means not standing again. The fee is in the second paragraph. The second paragraph is short.

**A. Tell the Prime Minister you will not stand again.**

> The Prime Minister asks you to see out the term, and you do. Your seat passes to a new candidate. The search firm's next letter begins "Dear Director", and is much thinner.

**B. Decline, on your own letterhead.**

> The search firm replies within the hour to thank you, and files you under "later". The list of people filed under "later" is long, and well looked after.

</details>

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `post` (the first option that fits)

- *The text above.* *(`junior`; when up to Senior Parliamentary Secretary)*
- *Read with this option (`office`; when Minister of State to Senior Minister of State):*

  **The Board Seat**

  A conglomerate wants someone who has run part of a ministry on its board: four meetings a year, and a fee its annual report puts in a footnote. The chairman knows you hold office, and asks only whether you might be free "after". Saying yes means leaving politics at the next election.

  **A. Tell the Prime Minister you will not stand again.**

  > Your portfolio goes to a colleague who has waited for it, politely. At the election a new candidate wins your old seat. The board seat, as promised, has been kept warm.

  **B. Decline.**

  > You decline in writing. You later learn that your letter is framed in the chairman's office, as a curiosity.

- *Read with this option (`minister`; when Minister (MR4) and up):*

  **The Board Seat**

  A conglomerate wants someone who has sat in Cabinet on its board: four meetings a year, and a fee its annual report puts in a footnote. The chairman knows you hold office, and asks only whether you might be free "after". Saying yes means leaving politics at the next election.

  **A. Tell the Prime Minister this Cabinet is your last.**

  > The reshuffle announcement thanks you in its second paragraph. At the election a new candidate wins your old seat. The board seat, as promised, has been kept warm.

  **B. Decline.**

  > You decline in writing. You later learn that your letter is framed in the chairman's office, as a curiosity.


</details>

[← 176](#c176) · [Next → 178](#c178) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c178"></a>178. The Board Seat

[← 177](#c177) · [Next → 179](#c179) · [Contents](../DECK-DESIGN.md#contents)

`headhunter_political_grc` · events.json · once a career · weight 7

**Who sees it:** Parliamentary Secretary to Minister (MR3); not while the scholarship bond runs; after [156. The General Election](04-crossing.md#c156), A, B (`seat_grc`).

**Shares a decision** (`private_offer`) with [#73](02-service.md#c73), [#138](02-service.md#c138), [#177](#c177), [#101](02-service.md#c101): a career sees only one.

A conglomerate wants someone who has worked close to Cabinet on its board: four meetings a year, and a fee its annual report puts in a footnote. The chairman knows you hold office, and asks only whether you might be free "after". Saying yes means leaving politics at the next election.

**A. Tell the Prime Minister you will not stand again.**

> The Prime Minister asks you to see out the term, and you do. At the election your GRC team fields a new face in your ward. The board seat, as promised, has been kept warm.

- Hidden: Heat down (−3).
- Leaves for the private sector: the career ends, with fees of twice the grade's pay for each year to retirement (3 to 10 years), after tax.
- ↳ Can lead to: [The Consultancy](09-endings.md#end-consultancy)

**B. Decline.**

> You decline in writing. You later learn that your letter is framed in the chairman's office, as a curiosity.

- Hidden: Reputation up (+3), Integrity up (+4).

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2*

At a charity dinner, a company chairman you have met twice steers you to the window. His board needs someone who has worked close to Cabinet, once you are out of office. Saying yes means leaving politics at the next election. He names the fee quietly, then again, in case you were being polite.

**A. Tell the Prime Minister you will not stand again.**

> The Prime Minister asks you to see out the term, and you do. Your ward gets a new face at the election, and the team is returned. Flowers arrive at your first board meeting.

**B. Thank him, and decline.**

> You decline at the window, smiling. He says the offer will keep, and every Chinese New Year a card arrives to show that it is keeping.

---

*Version 3*

A search firm writes, on paper thick enough to stand up by itself, about a client's board seat for someone who has worked close to Cabinet, from "a date convenient to you": after you leave politics. Saying yes means not standing again. The fee is in the second paragraph. The second paragraph is short.

**A. Tell the Prime Minister you will not stand again.**

> The Prime Minister asks you to see out the term, and you do. Your ward passes to a new face on the team. The search firm's next letter begins "Dear Director", and is much thinner.

**B. Decline, on your own letterhead.**

> The search firm replies within the hour to thank you, and files you under "later". The list of people filed under "later" is long, and well looked after.

</details>

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `post` (the first option that fits)

- *The text above.* *(`junior`; when up to Senior Parliamentary Secretary)*
- *Read with this option (`office`; when Minister of State to Senior Minister of State):*

  **The Board Seat**

  A conglomerate wants someone who has run part of a ministry on its board: four meetings a year, and a fee its annual report puts in a footnote. The chairman knows you hold office, and asks only whether you might be free "after". Saying yes means leaving politics at the next election.

  **A. Tell the Prime Minister you will not stand again.**

  > Your portfolio goes to a colleague who has waited for it, politely. At the election your GRC team fields a new face in your ward. The board seat, as promised, has been kept warm.

  **B. Decline.**

  > You decline in writing. You later learn that your letter is framed in the chairman's office, as a curiosity.

- *Read with this option (`minister`; when Minister (MR4) and up):*

  **The Board Seat**

  A conglomerate wants someone who has sat in Cabinet on its board: four meetings a year, and a fee its annual report puts in a footnote. The chairman knows you hold office, and asks only whether you might be free "after". Saying yes means leaving politics at the next election.

  **A. Tell the Prime Minister this Cabinet is your last.**

  > The reshuffle announcement thanks you in its second paragraph. At the election your GRC team fields a new face in your ward. The board seat, as promised, has been kept warm.

  **B. Decline.**

  > You decline in writing. You later learn that your letter is framed in the chairman's office, as a curiosity.


</details>

[← 177](#c177) · [Next → 179](#c179) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c179"></a>179. The Million-Dollar Flat

[← 178](#c178) · [Next → 180](#c180) · [Contents](../DECK-DESIGN.md#contents)

`mnd_million` · events.json · once a career · weight 8

**Who sees it:** Parliamentary Secretary to Deputy Prime Minister; only in the Ministry of National Development.

**Shares a decision** (`viral_post`) with [#192](06-cabinet.md#c192), [#181](#c181): a career sees only one.

A second-hand public housing flat in an older estate has sold for one and a half million dollars, and the headline makes it sound as if every flat will. It was an unusually good flat; the headline does not say so. Housing is your ministry's job, and your phone has begun to buzz in the rhythm of a question you will have to answer.

**A. Point out, with numbers, how rare such sales are.**

> The numbers are correct and reassuring. The comments under the article are neither.

- Hidden: Competence up (+3), Standing up (+4), Reputation down a little (−2).

**B. Say what the government is doing about supply.**

> You list the new flat launches. The answer is solid and forgettable. On this subject, forgettable counts as a success.

- Hidden: Standing up (+3), Reputation up a little (+2).

**C. Say you understand why people are worried, and mean it.**

> You do mean it, it shows, and the clip travels. A colleague says, kindly, that understanding is not a policy. You think it is a start.

- Hidden: Standing down (−3), Reputation up (+5), Integrity up (+3).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The press gallery (politics, `pressGallery`), 40%: A hurts (−2) · C helps (+2).
- The party's leadership and the Prime Minister's office (politics, `leadership`), 35%: A helps (+1) · B helps (+1) · C hurts (−2).

[← 178](#c178) · [Next → 180](#c180) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c180"></a>180. The PSLE Question

[← 179](#c179) · [Next → 181](#c181) · [Contents](../DECK-DESIGN.md#contents)

`moe_psle` · events.json · once a career · weight 8

**Who sees it:** Parliamentary Secretary to Deputy Prime Minister; only in the Ministry of Education.

**Shares a decision** (`floor_question`) with [#182](#c182): a career sees only one.

You are hosting a dialogue for parents on "the joy of learning". The first question is about how the PSLE, the exam at the end of primary school, is scored, and the second about tuition. The third is from a twelve-year-old, brought along by a parent, who wants to know why there is an exam at all. The room is waiting to see whose question you answer first.

**A. Answer the twelve-year-old first.**

> Your answer is honest, and does not entirely defend the exam. The child nods. Several parents write it down, and you cannot tell whether that is a good sign.

- Hidden: Standing down (−3), Reputation up a lot (+6), Integrity up (+4).

**B. Take the questions in order.**

> The scoring, tuition, and then, briefly, the child, who by now has been taken outside for a drink.

- Hidden: Competence up a little (+2), Standing up (+4).

**C. Explain how the PSLE is scored, carefully, with the chart.**

> Everyone in the room understands the chart. Nobody in the room is reassured by it. You suspect the chart was never the problem.

- Hidden: Competence up (+4), Standing up a little (+2), Reputation down a little (−1).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The press gallery (politics, `pressGallery`), 40%: A helps (+2) · B hurts (−1) · C hurts (−1).
- The civil servants who work with you (politics, `officials`), 35%: A hurts (−2) · B helps (+1) · C helps (+1).

[← 179](#c179) · [Next → 181](#c181) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c181"></a>181. The Waiting Time

[← 180](#c180) · [Next → 182](#c182) · [Contents](../DECK-DESIGN.md#contents)

`moh_waiting` · events.json · once a career · weight 8

**Who sees it:** Parliamentary Secretary to Deputy Prime Minister; only in the Ministry of Health.

**Shares a decision** (`viral_post`) with [#192](06-cabinet.md#c192), [#179](#c179): a career sees only one.

A resident's post about a six-hour wait at a hospital emergency department, with photographs, has four thousand shares and one factual error. Hospitals are your ministry's business, so on Sunday, at a community event, you will be asked about it whether you prepare or not. Whatever you say will be clipped.

**A. Visit the emergency department on Saturday night, unannounced.**

> You sit in the waiting area for two hours. Nobody recognises you, which tells you something about the waiting area and something else about you.

- Hidden: Competence up (+3), Standing down a little (−2), Reputation up a lot (+6).

**B. Answer on Sunday with the figures, and correct the error.**

> Your figures are accurate and the error is corrected. The resident's reply to your answer is shared more widely than the answer.

- Hidden: Competence up a little (+2), Standing up (+4), Reputation down a little (−2).

**C. Say the wait was too long, and stop there.**

> It was too long, and you say so in nine words. The clip is on the evening news. Your colleagues' faces suggest you used about eight words too many.

- Hidden: Standing down (−4), Reputation up (+4), Integrity up a lot (+6).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The press gallery (politics, `pressGallery`), 45%: A helps (+1) · B hurts (−2) · C helps (+2).
- The civil servants who work with you (politics, `officials`), 35%: A hurts (−1) · B helps (+2) · C hurts (−1).
- The party's leadership and the Prime Minister's office (politics, `leadership`), 35%: B helps (+1) · C hurts (−2).

[← 180](#c180) · [Next → 182](#c182) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c182"></a>182. The Retirement Age

[← 181](#c181) · [Next → 183](#c183) · [Contents](../DECK-DESIGN.md#contents)

`mom_retirement` · events.json · once a career · weight 8

**Who sees it:** Parliamentary Secretary to Deputy Prime Minister; only in the Ministry of Manpower.

**Shares a decision** (`floor_question`) with [#180](#c180): a career sees only one.

The retirement and re-employment ages are going up again, in steps, by law, and your ministry must explain it. At a dialogue for older workers, your slides are excellent. The first question, from a cleaner in the second row, is not on any of them, and the room is watching how you handle it.

**A. Answer her question, not the slides.**

> Her question was whether she could keep her job if her knees could not. You answer it properly, which takes the rest of the session. The slides go home unshown.

- Hidden: Standing down a little (−2), Reputation up a lot (+6), Integrity up (+4).

**B. Take the question offline, and follow up.**

> Your office follows up within a week, with a contact at her employer and a scheme she had not heard of. She never learns who sent it. That is fine.

- Hidden: Competence up a little (+2), Standing up (+4).

**C. Ask the union representative beside you to take it.**

> He answers it well, with a detail about re-employment contracts you did not know. The photograph in the newsletter is of him, answering it.

- Hidden: Competence up a little (+2), Reputation down (−3), Integrity up (+3).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The civil servants who work with you (politics, `officials`), 35%: A hurts (−1) · B helps (+2).
- The press gallery (politics, `pressGallery`), 35%: A helps (+2) · B hurts (−1) · C hurts (−1).
- Your fellow Members of Parliament (politics, `fellowMPs`), 30%: B hurts (−1) · C helps (+1).

[← 181](#c181) · [Next → 183](#c183) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c183"></a>183. The Parliamentary Question

[← 182](#c182) · [Next → 184](#c184) · [Contents](../DECK-DESIGN.md#contents)

`the_pq` · events.json · can come back · weight 11

**Who sees it:** Parliamentary Secretary and up.

**Series** `house`: shown in full twice a career (the second time asking whether to keep the habit), then its years pass by themselves on the habit; a card whose Meanwhile lines are spent is not drawn again.

**Shares a decision** (`house_brief`) with [#168](#c168), [#170](#c170), [#130](02-service.md#c130), [#186](#c186): a career sees only one.

**The second showing** (folded below): keeping the habit adds Competence up a little (+1), Reputation down a little (−1); breaking it adds Standing down a little (−1), Reputation up a little (+1).

**A Meanwhile year with no habit:** Competence up a little (+1), Standing up a little (+1).

A Member has filed a Parliamentary Question about a scheme your ministry runs, and you must answer it in the House. The question is good and sharply drafted, and the honest answer is not flattering. The brief your officials wrote is accurate, and answers a slightly different question. Whatever you say goes into Hansard, the official record of Parliament, for good.

**A. Answer it straight, and say what you will do.**

> You concede the point: "The scheme is not reaching the people it was built for, and we will change it by June." The follow-up question is gentler, because there is nothing left to prise open. The line goes into Hansard, word for word.

- Hidden: Competence up (+3), Standing down (−4), Reputation up a lot (+6), Integrity up a lot (+8).
- Habit: `straight`.
- ↳ Can lead to: [161. Hansard](#c161), in three years, 30%

**B. Read the brief, which answers a nearby question.**

> Technically responsive, substantively elsewhere. It takes skill and you have it, and the clip will stay online for longer than the scheme.

- Hidden: Standing up a lot (+6), Reputation down (−4), Integrity down a lot (−6).
- Habit: `brief`.

**C. Promise a full written answer, and write it properly.**

> The written answer runs to four pages, with tables, and is the most complete account the ministry has ever given of the scheme. The Member reads it. So does one researcher.

- Hidden: Competence up (+3), Standing up a little (+1), Reputation down (−3), Integrity up a little (+2).
- Habit: `written`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The press gallery (politics, `pressGallery`), 45%: A helps (+3) · B hurts (−2) · C hurts (−1).
- The civil servants who work with you (politics, `officials`), 35%: A hurts (−2) · B helps (+1) · C helps (+1).
- The party's leadership and the Prime Minister's office (politics, `leadership`), 35%: A hurts (−2) · B helps (+2).

<details><summary>When it comes back (3 scenes)</summary>

The series' second full showing, written per habit: the habit is the first choice, and the answer stands for the rest of the career.

---

*If your habit so far is “Answer it straight, and say what you will do.” (`straight`):*

**The Parliamentary Question, Again**

Another Parliamentary Question on one of your ministry's schemes, and again the honest answer is unflattering. Your habit in the House is to answer straight, and the Members who file questions have noticed: they file more. How you answer this one is how you'll answer them all, and Hansard keeps every word.

**A. Answer it straight, as you always do.**

> You say what isn't working and what you'll change. The Member who asked has run out of follow-up questions by the second one, and your officials have stopped drafting briefs that dodge.

- Hidden: Competence up (+4), Standing down (−4), Reputation up (+5), Integrity up a lot (+8).
- Habit: `straight`.
- ↳ Can lead to: [161. Hansard](#c161), in three years, 30%

**B. Read the officials' brief this time.**

> The brief answers a nearby question, fluently. The Member, who has heard you answer straight before, asks the question again, slowly, and Hansard records the second asking.

- Hidden: Standing up (+5), Reputation down (−3), Integrity down a lot (−6).
- Habit: `brief`.

**C. Promise a full written answer instead.**

> The written answer runs to four pages, with tables, and arrives on the date you promised. The House hears less from you this sitting, and reads more.

- Hidden: Competence up (+3), Reputation down a little (−2), Integrity up a little (+2).
- Habit: `written`.

---

*If your habit so far is “Read the brief, which answers a nearby question.” (`brief`):*

**The Parliamentary Question, Again**

Another Parliamentary Question on one of your ministry's schemes, and your officials' brief is ready: accurate, and about a slightly different question, like the ones before it. Your habit in the House is to read it well. How you answer this one is how you'll answer them all, and Hansard keeps every word.

**A. Read the brief, as you always do.**

> Fluent, accurate and slightly beside the point. The follow-up slides off it, as they all do, and the clip runs for a day longer than the answer deserved.

- Hidden: Competence up a little (+1), Standing up a lot (+6), Reputation down (−5), Integrity down a lot (−6).
- Habit: `brief`.

**B. Put the brief down. Answer the question asked.**

> You answer the question that was asked, and the House goes quiet in the way it does for something new. Your officials rewrite the next brief overnight, to fit you.

- Hidden: Competence up (+3), Standing down (−5), Reputation up a lot (+7), Integrity up a lot (+8).
- Habit: `straight`.
- ↳ Can lead to: [161. Hansard](#c161), in three years, 30%

**C. Offer a full written answer instead.**

> Four pages, with tables, that answer exactly what was asked. The Member is so surprised that the next question arrives with a thank-you.

- Hidden: Competence up (+3), Reputation down a little (−2), Integrity up a little (+2).
- Habit: `written`.

---

*If your habit so far is “Promise a full written answer, and write it properly.” (`written`):*

**The Parliamentary Question, Again**

Another Parliamentary Question on one of your ministry's schemes. Your habit in the House is to promise a full written answer and deliver it, with tables, and one Member now files questions just to get them. How you answer this one is how you'll answer them all, and Hansard keeps every word.

**A. Promise the written answer, as usual.**

> Another four pages, footnoted, on the date you promised. A researcher cites it within the month. In the House, the exchange takes eleven seconds.

- Hidden: Competence up (+4), Standing up a little (+1), Reputation down (−4), Integrity up a little (+2).
- Habit: `written`.

**B. Answer this one straight, on your feet.**

> You answer it in four sentences, and the House hears what your written answers have been saying all along. This time the press gallery writes it down.

- Hidden: Competence up (+3), Standing down (−5), Reputation up a lot (+7), Integrity up a lot (+8).
- Habit: `straight`.
- ↳ Can lead to: [161. Hansard](#c161), in three years, 30%

**C. Read the brief, and save the tables.**

> The brief answers a nearby question, and the House moves on. The Member who collects your written answers looks at an empty folder, and files another question.

- Hidden: Standing up (+5), Reputation down (−3), Integrity down a lot (−6).
- Habit: `brief`.

</details>

<details><summary>Other versions (2)</summary>

The same choices, with the same consequences, in another scene. A career is shown one of them.

---

*Version 2: Question Time*

At Question Time, when Members put questions to ministers in the House, a Member asks whether your ministry will review a rule that residents complain about every week. It is already under review, but nothing is decided, and the ministry is saving the news for a press conference in March, with the Minister, a stage and a banner. What you say now goes into Hansard, the official record of Parliament, where it stays.

**A. Say it is under review, and what is being looked at.**

> You say so, plainly: "Yes, it is under review, and here are the three things we are looking at." Then you name them. The Member thanks you. The press conference in March makes smaller news than it would have, banner and all.

**B. Say the ministry keeps all its rules under review.**

> This is true of every rule and says nothing about this one. The Member points that out. Hansard records you both, and the press conference in March gets the headline.

**C. Offer the Member a full written reply once it is decided.**

> The written reply goes out the week after the decision: three pages, complete. The Member reads all of it, and files a new question about the parts the announcement left out.

---

*Version 3: The Supplementary*

You have answered a Parliamentary Question about your ministry, and it went well. Then the Member rises with a follow-up question, the one your officials said would not come, and your brief has nothing on it. The House is waiting, and Hansard, the official record, is recording.

**A. Answer it straight, without the brief.**

> You say, "I do not have that figure, and I will not guess it in this House," then say what you do know. It is enough. Your officials send a note that reads, in full, "Well handled."

**B. Answer a nearby question the brief does cover.**

> The answer is fluent, confident and about something else. The Member says, "That was not my question," and is quoted the next morning in full.

**C. Offer to write to the Member, and do it properly.**

> You write two pages, with the figure you did not have to hand. The Member quotes your letter in the next debate, more kindly than you had expected.

</details>

<details><summary>Meanwhile lines (18)</summary>

A year that passes by itself on the habit shows one line, never the same one twice in a career.

**Habit A, `straight`**

- At Question Time you answer the question that was actually asked, and people still notice.
- Seven questions this sitting, and two of your answers make the news for being short and true.
- A Member files a question expecting your officials' usual reply, gets a straight answer instead, and files another.
- Your straight answers are now quoted back to you in follow-up questions, so somebody read them.
- You give the House the actual number, and the Member who asked has no follow-up question ready.
- Your answer in the House is one paragraph shorter than the brief: you cut the paragraph that dodged.

**Habit B, `brief`**

- At Question Time you answer a question that was nearly the one asked.
- A sharp follow-up question meets a smooth reply; Hansard records both, and the papers record the reply.
- Question Time again, and the brief answers a question your officials found easier.
- Your replies this sitting are smooth enough that the follow-up questions slide straight off them.
- You read your officials' brief in full, accurately, and the Member asks the original question again in other words.
- At Question Time you read the brief so well that nobody can quite say which question it answered.

**Habit C, `written`**

- Seven questions this sitting, and the full written answers follow, as promised, with tables.
- Another four-page written answer, and a university researcher cites three of them in a paper, with footnotes.
- Another written answer to a Parliamentary Question goes out, longer than the question and shorter than its annex.
- Your written answers come with tables, and one Member starts filing questions just to get them.
- Your written answer is footnoted so thoroughly that the Member who asked thanks you for the reading list.
- Another question becomes another written answer, delivered on the date you promised, and that is the news.

</details>

[← 182](#c182) · [Next → 184](#c184) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c184"></a>184. The Date

[← 183](#c183) · [Next → 185](#c185) · [Contents](../DECK-DESIGN.md#contents)

`bench_date` · packs/backbench.json · once a career · weight 7

**Who sees it:** Parliamentary Secretary to Senior Parliamentary Secretary.

On a visit with your Minister, the Minister tells a crowd of residents that the new polyclinic will open by December. Your officials, standing behind you, have told you it will really be the middle of next year. The cameras are still on, and the residents will hold the ministry to the date they just heard.

**A. Correct the date now, beside the Minister.**

> You say, gently, that it will be the middle of next year. The Minister says, "Better to under-promise," without missing a beat. The clip is of the Minister. The car ride back is quiet.

- Hidden: Standing down a lot (−6), Reputation up (+3), Integrity up (+5).

**B. Tell the Minister in the car.**

> The Minister thanks you, and gives the right date at the next visit, crediting your officials. The residents at the first visit remember the first date, and keep asking after it.

- Hidden: Competence up a little (+1), Standing up a little (+2), Reputation down a little (−2), Integrity up a little (+2).

**C. Ask your officials to make the date.**

> The polyclinic opens in the last week of December with a pharmacy, a waiting area and two doctors. The other ten arrive in June, as your officials said.

- Hidden: Competence down a little (−1), Standing up (+5), Reputation up a little (+2), Integrity down (−3).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The civil servants who work with you (politics, `officials`), 50%: A helps (+1) · B helps (+2) · C hurts (−3).
- The press gallery (politics, `pressGallery`), 35%: A helps (+2) · B hurts (−1) · C hurts (−1).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `promise`

- the lifts at Blk 210 will be upgraded by Chinese New Year *(`mnd`; when only in the Ministry of National Development)*
  - `real`: June
  - `made`: The lifts open on the eve of Chinese New Year. On the first day of the New Year one of them stops between floors, with two families and a mandarin orange plant inside.
- a new bus service will start in March *(`mot`; when only in the Ministry of Transport)*
  - `real`: September, after the tender
  - `made`: The service starts in March with buses borrowed from three other routes. Those three now come every twenty minutes, and their passengers write to you.
- the new polyclinic will open by December *(`moh`; when only in the Ministry of Health; shown above)*
  - `real`: the middle of next year
  - `made`: The polyclinic opens in the last week of December with a pharmacy, a waiting area and two doctors. The other ten arrive in June, as your officials said.
- the school's new hall will be ready for next year's Primary One *(`moe`; when only in the Ministry of Education)*
  - `real`: the year after
  - `made`: The hall is ready in January and the air-conditioning in April. Primary One learns the school song in record time, in a very warm hall.
- the drain works on the main road will be done before the monsoon *(`mse`; when only in the Ministry of Sustainability and the Environment)*
  - `real`: after it
  - `made`: The drain is finished in November, and works. The contractor's overtime appears in next year's budget, under drains.
- the new neighbourhood police post will open by National Day *(`mha`; when only in the Ministry of Home Affairs)*
  - `real`: December
  - `made`: The post opens on 8 August, staffed and freshly painted. The paint is still wet on National Day. The officers mention this to everyone who leans on it.
- the careers centre at the community club will open next month *(`mom`; when only in the Ministry of Manpower)*
  - `real`: in five months
  - `made`: It opens next month with two career coaches, a printer and no internet. The internet arrives in month five, along with most of the jobseekers.
- the new family service centre will open next month *(`msf`; when only in the Ministry of Social and Family Development)*
  - `real`: the autumn, once the lease is signed
  - `made`: It opens next month in a room borrowed from the community club, between a karaoke class and a line-dancing one. The caseworkers learn to time their calls.
- the grant for neighbourhood shops will open next month *(`mti`; when only in the Ministry of Energy, Trade and Industry)*
  - `real`: the new financial year
  - `made`: The grant opens next month, with a form that asks for information it will only need next year. Eleven shops apply. Two of them understand the form.
- the household payouts will arrive before the school holidays *(`mof`; when only in the Ministry of Finance)*
  - `real`: a week after them
  - `made`: The payouts arrive a week before the holidays. The hotline takes forty thousand calls that week, most of them asking what the money is for.

</details>

[← 183](#c183) · [Next → 185](#c185) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c185"></a>185. The Stand-In

[← 184](#c184) · [Next → 186](#c186) · [Contents](../DECK-DESIGN.md#contents)

`bench_stand_in` · packs/backbench.json · once a career · weight 6

**Who sees it:** Parliamentary Secretary to Senior Parliamentary Secretary.

Your Minister is overseas, so tonight's speech at a charity's annual gala is yours. It was written for the Minister, and nobody has changed it: paragraph three is the Minister's own childhood, in the first person, a kampong with one well. You are on in ten minutes.

**A. Read it as written.**

> You spend two minutes growing up in a kampong with one well, and it lands. Afterwards a guest says, delighted, that he grew up in the same kampong, and asks which house.

- Hidden: Standing up (+4), Integrity down (−4).

**B. Cut paragraph three, and read the rest.**

> The speech runs four minutes short and has no middle. Dinner is served early, and the evening is remembered, warmly, for the dinner.

- Hidden: Competence up a little (+2), Standing up a little (+1), Reputation down a little (−2).

**C. Tell your own story instead.**

> Your own childhood, unrehearsed, is less tidy than the Minister's. It gets the only real laugh of the night. The Minister's office asks for a copy, for the files.

- Hidden: Standing down (−4), Reputation up (+5), Integrity up (+3).

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The press gallery (politics, `pressGallery`), 35%: A hurts (−2) · C helps (+2).
- The civil servants who work with you (politics, `officials`), 35%: A helps (+1) · C hurts (−1).

<details><summary>This card varies (2 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `event`

- a charity's annual gala *(`gala`; shown above)*
- a trade association's fiftieth anniversary dinner *(`trade`)*
- a university's alumni dinner *(`alumni`)*

**Part 2** · `story`

- a kampong with one well *(`kampong`; shown above)*
  - `short`: in a kampong with one well
  - `guest`: Afterwards a guest says, delighted, that he grew up in the same kampong, and asks which house.
- selling kueh at a market at six every morning *(`kueh`)*
  - `short`: selling kueh before school
  - `guest`: Afterwards a guest asks which market, because her family sold kueh there too, and would remember you.
- a grandmother's provision shop and its abacus *(`shop`)*
  - `short`: behind a shop counter
  - `guest`: Afterwards a guest asks whether the shop is still there. Gone, you say. It is true of some shop, somewhere.

</details>

[← 184](#c184) · [Next → 186](#c186) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c186"></a>186. Nine Questions

[← 185](#c185) · [Next → 187](#c187) · [Contents](../DECK-DESIGN.md#contents)

`uturn_questions` · packs/chains.json · once a career · weight 8

**Who sees it:** Parliamentary Secretary to Senior Parliamentary Secretary; not if you have been moved to another ministry (`moved_ministry`).

**Shares a decision** (`house_brief`) with [#183](#c183), [#168](#c168), [#170](#c170), [#130](02-service.md#c130): a career sees only one.

Nine MPs have filed Parliamentary Questions on one of your ministry's policies, charging a fee for missed polyclinic appointments, and you will give the replies in the House, as Members call Parliament. Your officials' draft ends by saying the policy "remains under review", in square brackets: keep the phrase, or cut it? Whatever you say will be in Hansard, the word-for-word record of Parliament, under your name, for good.

**A. Strike it. The policy is sound, and it stays.**

> "The policy is sound, and it will stay." Hansard records it, and two newspapers print it as a pull quote. Your officials file the bracketed phrase, in case.

- Hidden: Standing up (+5), Reputation down (−3).
- Sets `uturn_met`: named in the Declassified file.
- Sets `uturn_firm`: read by [#189](#c189).
- ↳ Can lead to: [187. In the Room](#c187), in two years, 85%

**B. Keep it. Say the policy remains under review.**

> "Under review" satisfies the House and worries the officials who designed the policy, who ask what exactly you are reviewing. By Friday, you find that you are reviewing it.

- Hidden: Standing down (−4), Reputation up (+3).
- Sets `uturn_met`: named in the Declassified file.
- Sets `uturn_review`: read by [#189](#c189).
- ↳ Can lead to: [187. In the Room](#c187), in two years, 85%

**C. Strike the adjectives too. Answer with figures only.**

> Your replies run to nine figures and no adjectives. Members find little to quote and no follow-up questions to ask. Hansard records the most accurate answers of the sitting, unread.

- Hidden: Competence up (+4), Standing up a little (+1), Reputation down a little (−2).
- Sets `uturn_met`: named in the Declassified file.
- Sets `uturn_figures`.
- ↳ Can lead to: [187. In the Room](#c187), in two years, 85%

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The civil servants who work with you (politics, `officials`), 45%: A helps (+2) · B hurts (−3) · C helps (+1).
- The press gallery (politics, `pressGallery`), 35%: A helps (+2) · C hurts (−2).

<details><summary>This card varies (1 part)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `policy` (the first option that fits)

- counting a household's car in the means test for Budget payouts *(`mof`; when only in the Ministry of Finance; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the car rule
- ending grants for firms that miss their productivity targets two years running *(`mti`; when only in the Ministry of Energy, Trade and Industry; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the two-year rule
- making employers file every worker's hours online, every week *(`mom`; when only in the Ministry of Manpower; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the weekly hours returns
- capping co-curricular activities at two afternoons a week *(`moe`; when only in the Ministry of Education; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the activities cap
- charging a fee for missed polyclinic appointments *(`moh`; when only in the Ministry of Health; not if you have been moved to another ministry (`moved_ministry`); shown above)*
  - `short`: the no-show fee
- closing neighbourhood police centres' counters after 10pm *(`mha`; when only in the Ministry of Home Affairs; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the night closures
- a levy on renting out a whole public housing flat *(`mnd`; when only in the Ministry of National Development; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the rental levy
- charging road tolls on three expressways at weekends *(`mot`; when only in the Ministry of Transport; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the weekend tolls
- requiring hawkers to charge for every takeaway container *(`mse`; when only in the Ministry of Sustainability and the Environment; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the container charge
- tying the Baby Bonus cash gift to a parenting course *(`msf`; when only in the Ministry of Social and Family Development; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the parenting-course rule

</details>

[← 185](#c185) · [Next → 187](#c187) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c187"></a>187. In the Room

[← 186](#c186) · [Next → 188](#c188) · [Contents](../DECK-DESIGN.md#contents)

`uturn_reversal` · packs/chains.json

**Who sees it:** only as a follow-up to [186. Nine Questions](#c186) (any choice: in two years, 85%); when it falls due: Member of Parliament and up.

Two years ago, answering MPs in the House, you defended charging a fee for missed polyclinic appointments. Since then the feedback on the no-show fee has turned into a Cabinet paper, drafted by officials, recommending that it be reversed. The Minister would like your view before signing it, since the replies in Hansard are yours.

**A. Argue to keep it, from your own replies.**

> You argue for twenty minutes, from your own replies, and are listened to carefully. The paper goes in anyway, with a line in the minutes: you "raised considerations".

- Hidden: Standing down (−4), Integrity up (+3).
- Sets `uturn_argued`: named in the Declassified file.
- ↳ Can lead to: [188. The Statement](#c188), in a year, 90%

**B. Agree, and say it should go quickly.**

> You agree, and say it should go before the next sitting. Everyone is relieved. Nobody mentions your old replies: a courtesy, and you notice it.

- Hidden: Standing up (+4), Integrity down a little (−2).
- Sets `uturn_agreed`: named in the Declassified file.
- ↳ Can lead to: [188. The Statement](#c188), in a year, 90%

**C. Propose a phase-out, so nobody has to say "reverse".**

> The paper is amended: the policy will be "phased out" over six months, about as long as reversing it would have taken. Everyone agrees that this is different.

- Hidden: Competence up (+3), Standing up a little (+2), Integrity down (−3).
- Sets `uturn_phased`: named in the Declassified file; read by [#188](#c188).
- ↳ Can lead to: [188. The Statement](#c188), in a year, 90%

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your fellow Members of Parliament (politics, `fellowMPs`), 40%: A hurts (−1) · B helps (+2) · C hurts (−1).
- The civil servants who work with you (politics, `officials`), 35%: A hurts (−2) · B helps (+1) · C helps (+1).

<details><summary>This card varies (2 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `policy` (the first option that fits)

- counting a household's car in the means test for Budget payouts *(`mof`; when only in the Ministry of Finance; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the car rule
- ending grants for firms that miss their productivity targets two years running *(`mti`; when only in the Ministry of Energy, Trade and Industry; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the two-year rule
- making employers file every worker's hours online, every week *(`mom`; when only in the Ministry of Manpower; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the weekly hours returns
- capping co-curricular activities at two afternoons a week *(`moe`; when only in the Ministry of Education; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the activities cap
- charging a fee for missed polyclinic appointments *(`moh`; when only in the Ministry of Health; not if you have been moved to another ministry (`moved_ministry`); shown above)*
  - `short`: the no-show fee
- closing neighbourhood police centres' counters after 10pm *(`mha`; when only in the Ministry of Home Affairs; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the night closures
- a levy on renting out a whole public housing flat *(`mnd`; when only in the Ministry of National Development; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the rental levy
- charging road tolls on three expressways at weekends *(`mot`; when only in the Ministry of Transport; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the weekend tolls
- requiring hawkers to charge for every takeaway container *(`mse`; when only in the Ministry of Sustainability and the Environment; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the container charge
- tying the Baby Bonus cash gift to a parenting course *(`msf`; when only in the Ministry of Social and Family Development; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the parenting-course rule
- a policy at your old ministry *(`moved`; when only if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the policy you once defended

**Part 2** · `room` (the first option that fits)

- As Minister, you must sign it before it goes to Cabinet, and the Prime Minister has asked, kindly, when you will. *(`minister`; when Minister (MR4) and up; not if you have been moved to another ministry (`moved_ministry`))*
- The Minister would like your view before signing it, since the replies in Hansard are yours. *(`junior`; when up to Senior Minister of State; not if you have been moved to another ministry (`moved_ministry`); shown above)*
- You have moved on, but the replies in Hansard are yours, and the Minister now responsible would like your view. *(`moved`)*

</details>

[← 186](#c186) · [Next → 188](#c188) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c188"></a>188. The Statement

[← 187](#c187) · [Next → 189](#c189) · [Contents](../DECK-DESIGN.md#contents)

`uturn_statement` · packs/chains.json

**Who sees it:** only as a follow-up to [187. In the Room](#c187) (any choice: in a year, 90%); when it falls due: Member of Parliament and up.

Cabinet has decided that the policy you defended in the House will go. A ministerial statement on reversing the no-show fee is set for Tuesday, after Question Time. The Minister will deliver it, and has sent you the draft. Paragraph four quotes your old replies from Hansard as "the position at the time".

**A. Paragraph four should say plainly that it was wrong.**

> The Minister reads paragraph four as you rewrote it: "We got this wrong." Members rise for clarifications and find little to clarify. The sentence is attributed to the Minister, correctly.

- Hidden: Standing down (−5), Reputation up (+3), Integrity up (+5).
- Sets `uturn_wrong`: named in the Declassified file; read by [#189](#c189).
- ↳ Can lead to: [189. Paragraph Three](#c189), in five years, 85%

**B. Leave paragraph four as drafted.**

> "The position at the time" is read out on Tuesday. In clarifications, a Member asks what the position was at the time. The Minister looks, briefly, in your direction.

- Hidden: Standing up (+4), Integrity down (−3).
- Sets `uturn_position`: named in the Declassified file; read by [#189](#c189).
- ↳ Can lead to: [189. Paragraph Three](#c189), in five years, 85%

**C. Cut paragraph four. Nobody needs reminding.**

> Paragraph four goes. On Tuesday the first Member to seek clarification reads your old reply aloud from Hansard, in full, and the Minister answers it for you.

- Hidden: Competence up a little (+1), Standing up a little (+2), Reputation down (−3).
- Sets `uturn_cut`: named in the Declassified file.
- ↳ Can lead to: [189. Paragraph Three](#c189), in five years, 85%

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- The press gallery (politics, `pressGallery`), 45%: A helps (+3) · B hurts (−1) · C hurts (−2).
- The party's leadership and the Prime Minister's office (politics, `leadership`), 35%: A hurts (−2) · B helps (+1) · C helps (+1).

<details><summary>This card varies (3 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `policy` (the first option that fits)

- counting a household's car in the means test for Budget payouts *(`mof`; when only in the Ministry of Finance; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the car rule
- ending grants for firms that miss their productivity targets two years running *(`mti`; when only in the Ministry of Energy, Trade and Industry; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the two-year rule
- making employers file every worker's hours online, every week *(`mom`; when only in the Ministry of Manpower; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the weekly hours returns
- capping co-curricular activities at two afternoons a week *(`moe`; when only in the Ministry of Education; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the activities cap
- charging a fee for missed polyclinic appointments *(`moh`; when only in the Ministry of Health; not if you have been moved to another ministry (`moved_ministry`); shown above)*
  - `short`: the no-show fee
- closing neighbourhood police centres' counters after 10pm *(`mha`; when only in the Ministry of Home Affairs; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the night closures
- a levy on renting out a whole public housing flat *(`mnd`; when only in the Ministry of National Development; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the rental levy
- charging road tolls on three expressways at weekends *(`mot`; when only in the Ministry of Transport; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the weekend tolls
- requiring hawkers to charge for every takeaway container *(`mse`; when only in the Ministry of Sustainability and the Environment; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the container charge
- tying the Baby Bonus cash gift to a parenting course *(`msf`; when only in the Ministry of Social and Family Development; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the parenting-course rule
- a policy at your old ministry *(`moved`; when only if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the policy you once defended

**Part 2** · `word` (the first option that fits)

- phasing out *(`phased`; when after [187. In the Room](#c187), C (`uturn_phased`))*
- reversing *(`reversed`; shown above)*

**Part 3** · `who` (the first option that fits)

- As Minister, you will deliver it yourself. *(`self`; when Minister (MR4) and up; not if you have been moved to another ministry (`moved_ministry`))*
  - `a`: You read paragraph four as rewritten: "We got this wrong." Members rise for clarifications and, for once, find little to clarify. The sentence is quoted for a week, mostly kindly.
  - `b`: "The position at the time" gets you through Tuesday. In clarifications, a Member asks what the position is now. You say it is the position now, and sit down.
  - `c`: Paragraph four goes. On Tuesday the first Member to seek clarification reads your old reply aloud from Hansard, in full, so that nobody is without a reminder.
- The Minister will deliver it, and has sent you the draft. *(`minister`; when up to Senior Minister of State; not if you have been moved to another ministry (`moved_ministry`); shown above)*
  - `a`: The Minister reads paragraph four as you rewrote it: "We got this wrong." Members rise for clarifications and find little to clarify. The sentence is attributed to the Minister, correctly.
  - `b`: "The position at the time" is read out on Tuesday. In clarifications, a Member asks what the position was at the time. The Minister looks, briefly, in your direction.
  - `c`: Paragraph four goes. On Tuesday the first Member to seek clarification reads your old reply aloud from Hansard, in full, and the Minister answers it for you.
- The Minister now responsible will deliver it, and has sent you the draft. *(`successor`)*
  - `a`: The Minister reads paragraph four as you rewrote it: "We got this wrong." Members rise for clarifications and find little to clarify. The sentence is attributed to the Minister, correctly.
  - `b`: "The position at the time" is read out on Tuesday. In clarifications, a Member asks what the position was at the time. The Minister looks, briefly, in your direction.
  - `c`: Paragraph four goes. On Tuesday the first Member to seek clarification reads your old reply aloud from Hansard, in full, and the Minister answers it for you.

</details>

[← 187](#c187) · [Next → 189](#c189) · [Contents](../DECK-DESIGN.md#contents)

### <a id="c189"></a>189. Paragraph Three

[← 188](#c188) · [Next → 190](06-cabinet.md#c190) · [Contents](../DECK-DESIGN.md#contents)

`uturn_hansard` · packs/chains.json

**Who sees it:** only as a follow-up to [188. The Statement](#c188) (any choice: in five years, 85%); when it falls due: Member of Parliament and up.

Benedict, your fellow MP, sends you a draft speech for tomorrow's debate, proud of paragraph three. It quotes, in full from Hansard, your old reply on the no-show fee, as an example of precision. Benedict found it by searching Hansard, and stopped there: the search never reached the statement, years later, that reversed the policy.

**A. Tell Benedict the policy was later reversed.**

> You send Benedict the statement, which does not mention your reply at all. Benedict reads both, and asks which one you would like quoted. You say neither.

- Hidden: Standing up a little (+1), Reputation down a little (−1), Integrity up (+3).
- Sets `uturn_told_mp`.
- The fellow MP, if this showing named them: marks `you_told_them`.

**B. Let it stand. It was a good reply.**

> Benedict delivers paragraph three with feeling, and nobody rises. Hansard now holds your reply twice and its reversal once, in a statement that never mentions it.

- Hidden: Reputation up (+3), Integrity down (−3).
- Sets `uturn_quoted`.
- The fellow MP, if this showing named them: marks `quoted_you`.

**Who might notice** (unseen; one who notices moves one appraisal 1 to 3 years later):

- Your fellow Members of Parliament (politics, `fellowMPs`), 50%: A helps (+2) · B hurts (−2).

<details><summary>This card varies (3 parts)</summary>

Each showing puts the card together from one option of each part. The text above uses the first combination that fits; under an option, the other words it brings to the card (its fields).

**Part 1** · `policy` (the first option that fits)

- counting a household's car in the means test for Budget payouts *(`mof`; when only in the Ministry of Finance; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the car rule
- ending grants for firms that miss their productivity targets two years running *(`mti`; when only in the Ministry of Energy, Trade and Industry; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the two-year rule
- making employers file every worker's hours online, every week *(`mom`; when only in the Ministry of Manpower; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the weekly hours returns
- capping co-curricular activities at two afternoons a week *(`moe`; when only in the Ministry of Education; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the activities cap
- charging a fee for missed polyclinic appointments *(`moh`; when only in the Ministry of Health; not if you have been moved to another ministry (`moved_ministry`); shown above)*
  - `short`: the no-show fee
- closing neighbourhood police centres' counters after 10pm *(`mha`; when only in the Ministry of Home Affairs; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the night closures
- a levy on renting out a whole public housing flat *(`mnd`; when only in the Ministry of National Development; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the rental levy
- charging road tolls on three expressways at weekends *(`mot`; when only in the Ministry of Transport; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the weekend tolls
- requiring hawkers to charge for every takeaway container *(`mse`; when only in the Ministry of Sustainability and the Environment; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the container charge
- tying the Baby Bonus cash gift to a parenting course *(`msf`; when only in the Ministry of Social and Family Development; not if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the parenting-course rule
- a policy at your old ministry *(`moved`; when only if you have been moved to another ministry (`moved_ministry`))*
  - `short`: the policy you once defended

**Part 2** · `quote` (the first option that fits)

- conviction *(`firm`; when after [186. Nine Questions](#c186), A (`uturn_firm`))*
- a Government that listens *(`review`; when after [186. Nine Questions](#c186), B (`uturn_review`))*
- precision *(`figures`; shown above)*

**Part 3** · `said` (the first option that fits)

- *Read with this option (`wrong`; when after [188. The Statement](#c188), A (`uturn_wrong`)):*

  **Paragraph Three**

  Benedict, your fellow MP, sends you a draft speech for tomorrow's debate, proud of paragraph three. It quotes, in full from Hansard, your old reply on the no-show fee, as an example of precision. Benedict found it by searching Hansard, and stopped there: the search never reached the statement, years later, that reversed the policy.

  **A. Tell Benedict the policy was later reversed.**

  > You send Benedict the statement too, with paragraph four marked. Benedict quotes paragraph four instead, and it makes the point better than your reply ever did.

  **B. Let it stand. It was a good reply.**

  > Benedict delivers paragraph three with feeling. A Member opposite rises and reads out the statement that called it wrong. Benedict sends you an emoji you have not seen before.

- *Read with this option (`position`; when after [188. The Statement](#c188), B (`uturn_position`)):*

  **Paragraph Three**

  Benedict, your fellow MP, sends you a draft speech for tomorrow's debate, proud of paragraph three. It quotes, in full from Hansard, your old reply on the no-show fee, as an example of precision. Benedict found it by searching Hansard, and stopped there: the search never reached the statement, years later, that reversed the policy.

  **A. Tell Benedict the policy was later reversed.**

  > You send Benedict the statement. Benedict reads "the position at the time" twice, and replaces paragraph three with something about bus stops.

  **B. Let it stand. It was a good reply.**

  > Benedict delivers paragraph three with feeling, and nobody rises. Hansard now holds your reply twice, the statement once, and the position at the time, unchanged.

- *The text above.* *(`cut`)*

</details>

[← 188](#c188) · [Next → 190](06-cabinet.md#c190) · [Contents](../DECK-DESIGN.md#contents)

[← The crossing](04-crossing.md#c153) · [Contents](../DECK-DESIGN.md#contents) · [Cabinet →](06-cabinet.md#c190)
