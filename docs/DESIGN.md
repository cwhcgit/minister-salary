# Minister Salary — Game Design Document

**Working title:** Minister Salary
*(alternates: "Million Dollar Minister", "Confirmed & Substantive", "CEP")*

**Platform:** the web, played on a phone (`web/`). It installs to the home screen and plays
offline. A native Android build (Kotlin + Jetpack Compose) was the original target; it is not
built (§9).
**Genre:** Text-driven life/career simulator, turn-based (BitLife-like)
**Setting:** Singapore's public service and political system, played satirically
**Status:** playable. 180 cards and 12 endings; content grows pack by pack (`docs/CONTENT_PLAN.md`).

---

## 1. The pitch

You join the Singapore public service as a President's Scholar, a local graduate, or a poly
diploma holder finishing a degree at night (§7). Over roughly forty in-game years you claw
upward through statutory boards, ministries, an appraisal system that will not tell you what
it thinks of you, and eventually an invitation to tea — toward the only job in the country
whose salary is set by a published formula.

The joke is never "politicians bad." The joke is the machinery: the appraisal
euphemisms, the bonus indicators, the acronyms, the serene institutional confidence.
Deadpan, not sneering.

### Core fantasy
Climbing a ladder whose rungs are invisible to you, and discovering the rules only
by paying for them.

### Session shape
30 seconds to a few minutes. Each card is one year. A year with nothing to decide passes
without a card and is shown as its own page (§2). A career is about 20-35 cards. Twelve
endings; replay is the point.

---

## 2. Core loop

One **card = one year**. A turn is a card, its outcome, then a page for each year-end review:

1. **The card.** One decision, two or three choices. A choice the player cannot take yet (it
   needs a stat they do not have) is not shown at all, and a card is only drawn while it has at
   least two choices to show.
2. **The outcome.** What the choice did, and anything it set off: a line saying it will count
   at this year's appraisal, a colleague arriving or leaving, and at most one quiet line when a
   stat moved a long way (§3).
3. **The year-end review**, on its own page, headed with the age: pay, compared with last
   year; the appraisal (§5); a promotion or not; any warning, rumour or batchmate news; and
   signals about next year. The player is a year older.
4. **Years without a decision**, a page each: a repeatable card already played in full (one
   Meanwhile line that repeats what you chose before), a safe re-election, a series card
   already shown as often as it may be, or an empty pool. Each still has its pay, appraisal
   and promotion.
5. **Confirm Another Year**, on the last page, goes on to the next card. When the career is
   over, the button reads **The Final Position** and opens the ending card (§8).

A card with no real decision in it is a failure of content. Years with nothing to decide pass
by themselves instead.

The header shows rank, grade, age, year, ministry, the batchmate if there is one, and lifetime
earnings. Its **Reincarnate** button abandons the current run and goes back to the start
screen; it takes two taps.

---

## 3. Stats

Four stats, one currency, two hidden values. Deliberately small — every stat
must be pushed in opposite directions by real choices, or it does not earn its place.

The four stats are not shown as numbers during play. They appear only as words
(`statWords` in `game.json`): the appraisal's "why" line in a year that needs explaining
(naming the strong suit and the weak spot only when that is news), one quiet line when a
single choice moves a stat by 6 or more (at most once every three cards). The ending screen reveals all four, each with its number and a plain
verdict on what it was and what it did to the run. How much each one weighs in the appraisal
is never shown, not even there.

| Stat | Range | What it is | Pushed up by | Pushed down by |
|---|---|---|---|---|
| **Reputation** | 0-100 | Public recognition. Counts a little in the appraisal, sets election odds, and with Standing gates the tea. | Visible wins, media, constituency work | Scandal, invisibility, unpopular policy |
| **Standing** | 0-100 | How much the machine trusts you. Counts in the appraisal; gates the tea, the succession and staying on past 65. | Loyalty, discretion, delivering | Dissent, leaks, embarrassing your Perm Sec |
| **Integrity** | 0-100 | Private moral ledger. Never counts in the appraisal; decides most of the legacy line. | Refusing, disclosing, protecting juniors | Burying, spinning, throwing staff under the bus |
| **Competence** | 0-100 | Whether you can actually do the job. Weighs most in the appraisal and sets the yearly performance bonus. | Hard postings, training, doing the work | Coasting, delegating everything, burnout |

**Wealth ($)** — running total. Not a gate; it is the **score**. The salary table is the
satire, so the number must always be on screen.

### Hidden values

**CEP — Currently Estimated Potential.** The real mechanic and the heart of the game.
An internal estimate of the highest grade you will ever reach. It **caps your ladder**:
you cannot be promoted past your CEP, no matter your stats. Winning the first election
replaces it with the party's own estimate, worked out from Standing and Reputation. It is
never shown as a number during play — only surfaced as rumour, euphemism and inference:

> *"Your reporting officer describes your trajectory as 'steady'."*
> *"You were not on the list for the Leadership Programme. No reason was given."*
> *"Someone in HR called you 'a safe pair of hands'. You are not sure this is good."*

Raising CEP requires standout events, not grinding stats. Learning to read the
euphemisms **is** the skill the game teaches. The ending's Declassified file says what it
was (§8).

**Heat** — 0-100 scandal exposure. Accumulates from every corner cut. High Heat makes
concealed things likelier to surface during an election campaign. Also invisible: at 55 a
year-end line warns ("A journalist has been asking around about something old."), and at 85
the career ends (Everything Surfaced).

---

## 4. The ladder

The # is the rank number content uses (`requires.minRank` and `maxRank`, 0-16).

### Act I — The Service (age 23 → 64)

| # | Rank | Grade | Ballpark pay | Notes |
|---|---|---|---|---|
| 0 | Management Executive | MX13 | $3.8k/mo | Statutory board. You photocopy things. |
| 1 | Senior Management Executive | MX12 | $5.5k/mo | |
| 2 | Assistant Director | MX11 | $7.5k/mo | First time you chair anything |
| 3 | Deputy Director | MX10 | $10k/mo | |
| 4 | Director | MX9 | $14k/mo | |
| 5 | Senior Director | Superscale | $20k/mo | |
| 6 | Deputy Secretary | Superscale | $35k/mo | |
| 7 | **Permanent Secretary** | Staff Grade | ~$1M/yr | Top of the civil service |

**The Administrative Service fast lane.** Scholars enter the Admin Service as Assistant
Directors at 25, skipping the statutory-board rungs, and need one year in each grade
instead of two until Director. The advantage is the clock and the ceiling, not a senior
start: even the fastest real officers made Director around 29. This is the sharpest
satirical point in the game and it is a *mechanic*, not a line of dialogue — see §7
Character creation. Age floors (plausible, not official rules): Director 28, Deputy
Secretary 35, Permanent Secretary 40. An exceptional file lowers the top two: two
standout moments in the service (a crisis statement written well, a vindicated paper, a
second look by the board) mark it "exceptional", and Deputy Secretary opens at 33 and
Permanent Secretary at 38. Nothing ever goes below 38 for Permanent Secretary.

### Act II — The Crossing

You cannot become PM as a civil servant. You must be **spotted**, then resign.

- **The Tea Session** — offered, ahead of the random draw, to an officer at Director or above
  with Standing 54 and Reputation 44, once any bond is served and not within three years of
  retirement. The year before, a line hints that the party is interested. Saying no leads, at
  retirement, to The Tea Was Declined.
- **The vetting** — a background check that reads back the Folder: every compromise you made.
  Disclose it all (each item costs Standing; three or more and the invitation quietly lapses),
  or answer only what is asked (each hidden item may surface during the campaign, likelier with
  high Heat). An officer waiting for the election has resigned to stand; the service's clock
  waits for the result.
- **The general election** — run in a Group Representation Constituency team, where winning is
  mostly not about you, or, with Reputation 60 or more, ask for a single seat: riskier, and
  decided by Reputation. Losing ends the career (Lost the Ward). There is no way back.

### Act III — Politics

| # | Office | Ballpark pay |
|---|---|---|
| 8 | Member of Parliament | $259k/yr ($18,500/month allowance × 14) |
| 9 | Parliamentary Secretary | ~$810k (0.45× MR4) |
| 10 | Senior Parliamentary Secretary | ~$810k (same merged grade: a promotion with no pay rise) |
| 11 | Minister of State | ~$1.26M (0.7×, derived) |
| 12 | Senior Minister of State | ~$1.53M (0.85×, derived) |
| 13 | **Minister (MR4)** | **~$1.8M/yr** — the title drop |
| 14 | Minister (MR3/MR2 merged), or Second Minister | ~$2.34M (1.3×) |
| 15 | Deputy Prime Minister (MR1) | ~$2.88M (1.6×, derived) |
| 16 | **PRIME MINISTER** | **$3.6M, 2× MR4** |

> Pay figures follow the 2026 political salary review (accepted 8 Sep 2026, effective
> 15 Oct 2026): MR4 is the median income of the top 1,000 earners less 40%. Mayors, Senior
> Parliamentary Secretaries and Parliamentary Secretaries are one grade at 0.45× MR4. The
> MOS, SMS and DPM figures are derived from the old multiples. National Bonus 0-6 months on
> four equally weighted indicators; from 1 Jan 2027 the target bands are unemployment 3% to
> below 3.5%, median real income growth 2.5% to below 3.5%, 20th-percentile real income
> growth 3% to below 4%, real GDP growth 2% to 4%.

Re-election comes every five years, and Reputation raises the odds. A safe seat (Reputation 60
or more, low Heat) passes by itself as a year without a decision, and is won.

### The end of a career

Careers end at real ages, and are told so in advance. The service retires at **64** (the
statutory age from 1 July 2026). In politics the party asks Members not to stand at the
**first general election after they turn 65** (the Renewal card, the year before), and that
election ends the career; a Minister or higher with strong Standing is asked to stay instead,
and may, to **70**, the stop for everyone. The **Prime Minister** serves a short tenure of
three or four cards (the Cabinet, the Rally, the successor, stepping down) and then the
ending; the top job is not given without room for three before 70. The reviews two years and
one year before the last year say plainly that it is coming, and the last year is a card of its
own ("The Last Year"). The political ladder is paced to fit: 20 years from MP to Prime
Minister. The timing and the lines live in `game.json` (`endgame`), the cards in
`content/packs/endgame.json`.

### Bonuses (the good part)
Annual payout = base + **Performance Bonus** (10% to 45% of base, set by Competence) +
**National Bonus** (from Minister of State up: 0-6 months, set by four socio-economic
indicators: real median income growth, income growth of the lowest 20th percentile,
unemployment, real GDP growth), less about 18% for tax and CPF.

Once the player is a Minister of State or above, **their own policy choices move their own
bonus.** The game never comments on this. It just shows the number. The choice comes twice a
career, as one story. The first time is the National Bonus card, in the first year as Minister
of State: it explains the bonus, and asks which policy to fund (the lowest incomes, or GDP), or
whether to ask Cabinet if ministers should be paid on targets they can move. The second time is
a later Budget (the Indicators, in a strong year, a downturn or before an election): it names
the earlier choice, makes it the default, and asks whether to break it (asking Cabinet counts as
funding neither policy, so the default is the plan that moves no target). After that the
ministry rolls the habit over by itself, and every year's pay line still shows the months it
earned.

---

## 5. Appraisal and promotion

End of each year:

```
performanceScore = 0.5·Competence + 0.3·Standing + 0.15·Reputation + noise(±5) + this year's "noted" choices
              → grade A (72+) / B+ (58+) / B (42+) / C (28+) / D
```

The review shows the letter first, then a euphemism for it ("Grade B+. Your performance is
described as 'strong, consistently exceeding expectations'."); each grade has several
wordings. In a year that needs explaining (the first appraisal, a change of grade, a promotion
or a warning), a "why" line says in words which stats carried or cost the grade, and whether a
choice or the year's luck moved it. The weightings and the score are never shown. A first
appraisal never goes below C.

- **A / B+** → promotion eligible (an A only, from Minister up), if `currentRank < CEP`, the
  years in grade are served and the age floor allows. With a batchmate at the same grade, the
  ranking exercise gives the slot to one of you. A very high A at Director or below can skip a
  grade.
- The year before a ranking, a line says your name goes forward and what grade it takes. If
  only the ceiling stands in the way, the line says instead that your name is not on the list.
- **C** three times in a row → HR moves you sideways to another division, and you get a new
  reporting officer. (In politics, the Whip has you chair a parliamentary committee.) The New
  Reporting Officer card hands you to a new one too.
- **D** → a formal warning; the next year, the improvement plan card (the Whip's word in
  politics), shown in full every time. A second D in a row after it → the quiet conversation
  (never in the first four years, or before six cards).
- `currentRank == CEP` → a rumour instead of the promotion (*"Someone in HR calls you 'a safe
  pair of hands'."*). Promotion never comes. Player must find a CEP-raising event or accept
  the ceiling. The rumour comes in the first two years held there, then less and less often,
  and never twice in a career.

The player is shown the grade and its euphemism, and must infer the ceiling. There is no
setting that shows the numbers.

**Hidden witnesses.** A card can list who could plausibly know what you did: in the service, the
people who sign, rank and sit around you; in politics, the party, its volunteers, the press, the
officials and your fellow Members. Each judges by its own motive. Their judgement, for or against
you, lands in a later appraisal, sometimes with an anonymous line; the service's lapses once you
are in politics. They are never named, and the ending never mentions them
(`docs/WRITING_RULES.md` rule 5.6).

---

## 6. Events — the content system

Events are **data, not code** — JSON in `web/content/events.json` and the packs in
`web/content/packs/` (`docs/CONTENT_PLAN.md` sections 6 and 8). Anyone can write content
without touching the engine.

```json
{
  "id": "audit_bury_figure",
  "title": "The Inconvenient Figure",
  "body": "Your director asks whether the audit's utilisation figure might be presented as a range rather than a number.",
  "requires": {
    "minRank": 2, "maxRank": 4,
    "minStats": { "competence": 30 },
    "flagsNone": ["whistleblower"]
  },
  "weight": 10,
  "once": true,
  "choices": [
    {
      "text": "Present it as a range.",
      "effects": { "standing": 8, "integrity": -12, "heat": 10 },
      "setFlags": ["buried_audit"],
      "outcome": "The slide is approved without discussion. Your director says nothing further about it, which you decide to read as approval.",
      "schedule": [{ "eventId": "audit_resurfaces", "inYears": 3, "chance": 0.4 }]
    },
    {
      "text": "Present the number.",
      "effects": { "integrity": 10, "standing": -6, "competence": 3 },
      "outcome": "The meeting runs forty minutes long. You are not invited to the next one."
    }
  ]
}
```

**Deferred consequences** (`schedule`) are the mechanism that makes choices feel heavy.
A choice in year 6 detonating in year 14 is the single highest-value feature in the
design; it shipped in M1.

**Selection**, each year: a card the career's end decides (§4) comes first; then a card that
opens a chapter (a new Member's maiden speech); then a scheduled consequence that has fallen due
(one a year; the rest wait their turn, earliest first); then a priority card that qualifies (the
tea, the National Bonus, the succession); then a weighted random draw from the cards whose
`requires` hold, without `once` cards already seen.

**Variety.** A second career should not replay the first. Four mechanisms, measured by
`test/variety.js`:
- *Versions.* A card may carry `variants`: the same mechanics in a different scene (title,
  body, choice text and outcomes change; effects, flags and consequences do not). A run's
  first showing prefers a version the phone has not shown recently; a repeatable card shown
  in full again later in the run moves on to its next version.
- *Freshness.* The phone remembers the cards and versions of its last two runs; those cards
  are drawn at 0.35 of their weight.
- *Ministry decks.* Some cards require the player's ministry (Health, Manpower, National
  Development, Education), so two careers in different ministries see different work.
- *Cast and parts.* Each run draws its own recurring people, and a card may assemble its
  scene from interchangeable parts (`docs/CONTENT_PLAN.md` section 8).

**Strange Years** (`packs/strange.json`): an impossible premise, processed as routine. About a
third of careers meet one, and none meets more than one.

**Jargon** (`content/jargon.json`): every term a general player may not know, with its entry
points, the cards whose story makes its meaning clear. `test/jargon.js` plays simulated careers
and checks that a player always meets a term at an entry point first (`docs/WRITING_RULES.md`
rule 2.6).

**Content today:** 180 cards (105 in `events.json`, 75 in packs), 7 batchmate cards and 12
endings. `docs/CONTENT_PLAN.md` grows it toward about 300.

---

## 7. Character creation

Three origins. This is where the meritocracy satire lives — as balance, not commentary.

| Origin | Start | Effect |
|---|---|---|
| **President's Scholar** | Admin Service, Assistant Director, age 25, bonded | One year in grade instead of two until Director. High CEP: no ceiling inside the service. Bond: for 6 years, no invitation to tea and no headhunter (only a bank that offers to buy the bond out). Its own opening card and story (The Bond). *Easy.* |
| **Local Graduate** | MX13, age 23 | Baseline. Median CEP. Its own opening card. *Normal.* |
| **Poly, then night classes** | MX13, age 27 | Low starting CEP, hardest climb. More Integrity and Competence, less Reputation and Standing. Three cards only this origin sees. *Hard.* |

Two careers from the same origin do not start identical: each of the four starting stats sits up to
five either way from the origin's, drawn from the seed on a stream of its own (`startBand` in
`content/game.json`, with narrower bands for an origin where it sits close to the next). The bands
keep the origins apart where they are ranked: every scholar starts with more Standing and Reputation
than any graduate, and every graduate more than any poly entrant.

The start screen also asks for a name and a gender (below), and offers a batchmate: someone
from your intake who competes with you for the same promotion slots (`content/rival.json`).
The ministry is not chosen: it is drawn at random, and a reshuffle can later move a minister.
**Not built:** a ministry preference, and **Traits** (e.g. *Thick Skin*, *Knows Everyone's
Birthday*), which are planned in `docs/CONTENT_PLAN.md` section 2.

**Name and gender are text, not content branches.** The start screen asks for a name and a gender,
and the game still says "you", so they show only where someone else names or addresses the player.
The choices are data: `player.genders` in `game.json` lists each one (its label on the start screen,
its honorific, its pronouns, and the cast name pool a blank name is drawn from), the start screen
builds its buttons from that table, and every `{player.given}`, `{player.formal}`, `{player.full}` or
`{player.<field>}` token is filled by one function, `playerSub`, which only `sub()` calls. The three
forms are read from the one name field (`nameForms`, by the lists in `player.names`): what colleagues
call you, the honorific and surname, and the whole name. Adding a choice (an "Mdm",
say) or a field (`{player.self}`) is a change to the table, with no code change; the lint checks that
every choice has the same fields. The table is the only source: there is no default copy in code, so a
missing or malformed table refuses the build (`web/packs.js`) and makes `newGame` throw. Nothing outside text rendering reads the gender: not the dice, the
draw, the appraisal or any requirement, so the same seed plays the same career under every choice.
Writers therefore write one line with the tokens in it, and never gate anything on gender
(`docs/WRITING_RULES.md` rules 4.1 and 4.2; the tokens are in CONTENT_PLAN section 8).

---

## 8. Endings

Every run ends on an **ending card**: the player's name, the ending's title and epitaph, the
final position, age and lifetime earnings; then the four stats, revealed with a number and a
plain verdict each (§3); then **Declassified**, what was really going on: the ceiling and the choice that
raised it (or would have), what the rumours meant, why the tea never came, the peak of Heat,
the stories the career told, the batchmate, and a legacy line.

**Share this ending** turns the card into a picture, with the game's link, for the phone's
share sheet (or saves it). The picture leaves out Declassified, so it never spoils the game for
whoever receives it.

The twelve endings (`endings` in `game.json`):

1. **Prime Minister** — the win. A short tenure, then stepping down.
2. **Permanent Secretary** — retired at the top of the civil service. Quietly the most respected ending.
3. **You Found Your Level** — retired in the service, below Permanent Secretary. Pewter plate. Good CPF balance.
4. **The Tea Was Declined** — spotted, and said no.
5. **Lost the Ward** — lost an election, the first or a re-election.
6. **Everything Surfaced** — Heat reached 85. Everything surfaces at once.
7. **The Quiet Conversation** — asked to leave after the improvement plan. No announcement is made.
8. **Backbench Lifer** — retired as an MP, never a portfolio, beloved locally.
9. **Never Quite Cabinet** — retired as a junior office-holder (Parliamentary Secretary to
   Senior Minister of State). Answered the Questions; never sat at the table.
10. **Retired, Honourably** — retired as a Minister or Deputy Prime Minister.
11. **The Consultancy** — left for the private sector (a headhunter's offer, or a bank buying
    out a scholar's bond).
12. **The Invitation Lapsed** — the vetting found too much, and the career ended in the service,
    below Permanent Secretary.

**Not built:** a gallery of collected endings, a portrait, a score (lifetime earnings × a legacy
multiplier), and Leader of the Opposition (§11).

---

## 9. Architecture

The game is a web build. The rules are one plain JavaScript file with no DOM and no I/O, so
they run the same on the phone, in Node for the bots (`test/sim.js`) and in the agent harness.

```
web/
  engine.js      the rules: pure, no DOM, no I/O
  ui.js          rendering and taps; holds no game rules
  packs.js       assembles the content: game.json + events.json + packs + rival.json
  content/       game.json (ladder, pay, origins, grades, endings, words), events.json,
                 packs/, rival.json
  sw.js          offline cache: bump VERSION whenever anything changes
harness/         drives the engine headlessly, for the bots and the agents
test/            balance sims, content checks, UI tests
agents/          Claude playtesters, analyst and designer (agents/README.md)
```

**The one rule that keeps this clean:**

```js
Engine.advance(content, state, choiceIndex)   // → { state, outcome, log, trace }
```

`advance` is a **pure function**: the dice come from the state's seed, there is no I/O, and a
new state comes out. Same input, same output, always. That makes the rules deterministic,
replayable and testable, and it means the UI holds no game logic whatsoever: it renders the
state and sends back the index of the choice tapped.

The state is one plain object and is the single source of truth. Save = serialise it: the
phone keeps it in `localStorage` with a fingerprint of the content. A save started on an older
version of the game is flagged when it loads ("The game has been updated"), with a fresh start
offered and carrying on allowed.

**Not built: the native port.** The original plan was two Gradle modules, `:engine` (pure
Kotlin, mirroring `engine.js`) and `:app` (Compose, thin), with the same pure `advanceYear`.
Nothing of it exists yet.

---

## 10. Milestones

| | Deliverable | Status |
|---|---|---|
| **M0** | This document | Done |
| **M1** | Rules engine + JSON content + tests + a build you can actually play | Done, as the web build in `web/` (in place of a terminal harness) |
| **M2** | Native Android: Compose UI, save/load, debug APK on device | Not started. The web build saves on the phone and installs to the home screen |
| **M3** | Content to 120+ events, full ladder, all endings, balance pass | Done: 180 cards, 12 endings, `node test/sim.js regress` in CI. More content per `docs/CONTENT_PLAN.md` |
| **M4** | Art, sound, ending-card sharing, Play Store packaging | Sharing done (a picture of the ending card). Art, sound and the store: not built |

M1 was the real de-risking step: if the loop is not fun with no art, it will not be fun with
art.

---

## 11. Explicitly out of scope for v1

Listed so they are *decisions*, not oversights. None of these get scaffolding built in
advance — they get built if and when we do them.

- **The Opposition branch** — resign, contest an SMC, become Leader of the Opposition.
  Strong idea, doubles the content burden. v2.
- Multiplayer / leaderboards
- Monetisation
- A native iOS app
- A fifth stat ("Network"). Folded into Standing for now. Split it only if playtesting
  shows Standing is doing two jobs badly.

---

## 12. Tone guardrails

Practical rules, not hand-wringing. They make the game better *and* keep it shippable
in the country it is about.

The rules live in one place, [`docs/WRITING_RULES.md`](WRITING_RULES.md), so they cannot
drift. Tone is its group 1 (voice and tone), group 6 (realism and satire) and group 8
(never). Group 2 is Plain English, the owner's rule from playing on a phone; the rest cover
story logic, the cast, choices and what the player is shown.

---

## 13. Open questions

1. **Turn granularity** — *settled for now.* A card is still a year, but a year with nothing
   to decide passes by itself as its own page (§2), so a coasting year no longer reads like a
   promotion year. Quarters for Act III were not tried.
2. **Is CEP too cruel?** *Open.* Mitigations built: the rumours, the line the year before a
   ranking that says your name is not on the list, and Declassified, which names the ceiling
   and the choice that would have raised it. In about a fifth of first-time bot careers that
   hit the ceiling (17-24% by origin), no CEP-raising event is left to reach
   (`reports/baseline/README.md`). Needs playtesting.
3. **Failure pacing** — *mostly settled:* losable, but through choices. Nobody is eased out in
   the first four years or before six cards, or without the improvement plan first; a first
   appraisal never goes below C; a seat is lost only on a card the player saw. The few early
   losses (about 3% of first-time scholars) are still mostly the election's luck.
4. **Title.** *Open.* The game ships as "Minister Salary", plain and matching the repo.
   "Confirmed & Substantive" is funnier to the target audience and opaque to everyone else.
   The blind agent cohorts still ask.
