# Minister Salary — Game Design Document

**Working title:** Minister Salary
*(alternates: "Million Dollar Minister", "Confirmed & Substantive", "CEP")*

**Platform:** Android (Kotlin + Jetpack Compose)
**Genre:** Text-driven life/career simulator, turn-based (BitLife-like)
**Setting:** Singapore's public service and political system, played satirically
**Status:** M0 — design. No code yet.

---

## 1. The pitch

You are a fresh graduate joining the Singapore public service at the bottom of the
grade ladder. You did not get the scholarship. Over roughly forty in-game years you
claw upward through statutory boards, ministries, an appraisal system that will not
tell you what it thinks of you, and eventually an invitation to tea — toward the only
job in the country whose salary is set by a published formula.

The joke is never "politicians bad." The joke is the machinery: the appraisal
euphemisms, the bonus indicators, the acronyms, the serene institutional confidence.
Deadpan, not sneering.

### Core fantasy
Climbing a ladder whose rungs are invisible to you, and discovering the rules only
by paying for them.

### Session shape
30 seconds to a few minutes. One tap advances a year. Full run: 25-45 minutes.
Endings are collectible; replay is the point.

---

## 2. Core loop

One **turn = one year**. The player taps **Confirm Another Year**.

```
  ┌─────────────────────────────────────────────┐
  │ 1. PAYOUT      salary + bonus → Wealth      │
  │ 2. MAIN EVENT  one card, 2-4 choices        │
  │ 3. MINOR BEATS 0-2 flavour lines, no choice │
  │ 4. APPRAISAL   performance grade → promote? │
  │ 5. CONSEQUENCE scheduled events may fire    │
  │ 6. AGE         +1 year; check endings       │
  └─────────────────────────────────────────────┘
```

A turn that produces nothing is a failure of content, not a valid outcome. Every year
must give the player at least one thing to read.

---

## 3. Stats

Four visible stats, one currency, two hidden values. Deliberately small — every stat
must be pushed in opposite directions by real choices, or it does not earn its place.

| Stat | Range | What it is | Pushed up by | Pushed down by |
|---|---|---|---|---|
| **Reputation** | 0-100 | Public recognition. Gates electability. | Visible wins, media, constituency work | Scandal, invisibility, unpopular policy |
| **Standing** | 0-100 | How much the machine trusts you. Gates promotion and the tea session. | Loyalty, discretion, delivering | Dissent, leaks, embarrassing your Perm Sec |
| **Integrity** | 0-100 | Private moral ledger. Player-facing conscience. | Refusing, disclosing, protecting juniors | Burying, spinning, throwing staff under the bus |
| **Competence** | 0-100 | Whether you can actually do the job. Drives performance grade and policy outcomes. | Hard postings, training, doing the work | Coasting, delegating everything, burnout |

**Wealth ($)** — running total. Not a gate; it is the **score**. The salary table is the
satire, so the number must always be on screen.

### Hidden values

**CEP — Currently Estimated Potential.** The real mechanic and the heart of the game.
An internal estimate of the highest grade you will ever reach. It **caps your ladder**:
you cannot be promoted past your CEP, no matter your stats. It is never shown as a
number — only surfaced as rumour, euphemism and inference:

> *"Your reporting officer describes your trajectory as 'steady'."*
> *"You were not on the list for the Leadership Programme. No reason was given."*
> *"Someone in HR called you 'a safe pair of hands'. You are not sure this is good."*

Raising CEP requires standout events, not grinding stats. Learning to read the
euphemisms **is** the skill the game teaches.

**Heat** — 0-100 scandal exposure. Accumulates from every corner cut. High Heat makes
buried things resurface at the worst time. Also invisible; telegraphed by flavour text
("a journalist has been asking around about the 2029 tender").

---

## 4. The ladder

### Act I — The Service (age 23 → ~50)

| # | Rank | Grade | Ballpark pay | Notes |
|---|---|---|---|---|
| 1 | Management Executive | MX13 | $3.8k/mo | Statutory board. You photocopy things. |
| 2 | Senior Management Executive | MX12 | $5.5k/mo | |
| 3 | Assistant Director | MX11 | $7.5k/mo | First time you chair anything |
| 4 | Deputy Director | MX10 | $10k/mo | |
| 5 | Director | MX9 | $14k/mo | |
| 6 | Senior Director | Superscale | $20k/mo | |
| 7 | Deputy Secretary | Superscale | $35k/mo | |
| 8 | **Permanent Secretary** | Staff Grade | ~$1M/yr | Top of the civil service |

**The Administrative Service fast lane.** Scholars enter the Admin Service and skip
rungs 1-4 outright. This is the sharpest satirical point in the game and it is a
*mechanic*, not a line of dialogue — see §7 Character creation.

### Act II — The Crossing

You cannot become PM as a civil servant. You must be **spotted**, then resign.

- **The Tea Session** — an event chain, not a single roll. Gated on Standing + Reputation + CEP.
  Vetting, a background check that surfaces your buried choices, an interview where
  the questions are gentle and the silences are not.
- **The GRC** — you are slotted into a Group Representation Constituency team.
  Winning is mostly not about you. Losing ends Act II immediately.
  An SMC is offered only to high-Reputation players: higher risk, far higher standing if won.
- Lose the election → **ending**, or a long cold walk back via a statutory board chairmanship.

### Act III — Politics

| # | Office | Ballpark pay |
|---|---|---|
| 9 | Member of Parliament | $192k/yr allowance |
| 10 | Parliamentary Secretary | |
| 11 | Senior Parliamentary Secretary | |
| 12 | Minister of State | |
| 13 | Senior Minister of State | |
| 14 | **Minister (MR4)** | **~$1.1M/yr** — the title drop |
| 15 | Minister (MR3/MR2), or Second Minister | |
| 16 | Deputy Prime Minister (MR1) | |
| 17 | **PRIME MINISTER** | **~2× MR4** |

> Pay figures are ballpark, drawn from published salary-review material. **To be verified
> against primary sources before ship** — accuracy here is part of the joke landing.

### Bonuses (the good part)
Annual payout = base + **Performance Bonus** (from appraisal grade) + **National Bonus**
(0-6 months, computed from four socio-economic indicators the player can actually
influence once they hold a portfolio: real median income growth, income growth of the
lowest 20th percentile, unemployment, real GDP growth).

Once the player is a Minister, **their own policy choices move their own bonus.** The
game never comments on this. It just shows the number.

---

## 5. Appraisal and promotion

End of each year:

```
performanceScore = 0.5·Competence + 0.3·Standing + 0.15·Reputation + noise(±10)
              → grade A / B+ / B / C / D  (displayed in euphemism, never as a letter)
```

- **A / B+** → promotion eligible, if `currentRank < CEP`
- **C** twice consecutively → lateral transfer to a posting nobody wants
- **D** → the quiet conversation
- `currentRank == CEP` → *"You are described as having found your level."* Promotion
  never comes. Player must find a CEP-raising event or accept the ceiling.

The player is shown the euphemism and must infer the grade. A settings toggle can
reveal raw numbers for players who want the spreadsheet.

---

## 6. Events — the content system

Events are **data, not code** — JSON in `assets/content/`. Anyone can write content
without touching Kotlin.

```json
{
  "id": "audit_bury_figure",
  "title": "The Inconvenient Figure",
  "body": "Your director asks whether the audit's utilisation figure might be presented as a range rather than a number.",
  "requires": {
    "minRank": "MX11", "maxRank": "MX9",
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
design; it ships in M1, not later.

**Selection:** filter the pool by `requires` against current state → weighted random →
suppress `once` events already seen. Scheduled events pre-empt the random pool.

**Content targets**
- M1: ~25 events, enough to reach Director
- M3: 120+ events, full ladder, 8-10 endings

---

## 7. Character creation

Three origins. This is where the meritocracy satire lives — as balance, not commentary.

| Origin | Start | Effect |
|---|---|---|
| **President's Scholar** | Admin Service, age 26, bonded | Starts at rung 5. High CEP. Bond = cannot resign for 6 years. *Easy mode.* |
| **Local graduate** | MX13, age 23 | Baseline. Median CEP. *Normal.* |
| **Poly → night-class degree** | MX13, age 27, lower start | Low starting CEP, hardest climb. Unique events unavailable to the others. *Hard mode, best endings.* |

Also chosen: name, ministry preference, and one **Trait** (e.g. *Thick Skin*, *Good Chinese*,
*Knows Everyone's Birthday*) that unlocks a small pool of exclusive events.

---

## 8. Endings

Every run ends on a shareable **ending card**: portrait, final title, lifetime earnings,
one-line epitaph. Collected in a gallery — the main replay driver.

1. **Prime Minister** — the win. Score = lifetime earnings × legacy multiplier.
2. **Permanent Secretary** — topped out on the civil side. Quietly the most respected ending.
3. **Found Your Level** — CEP ceiling. Retire as Deputy Director. Pewter plate. Good CPF balance.
4. **The Tea Was Declined** — spotted, and said no. Rare, high-Integrity.
5. **Lost the Ward** — election defeat with no way back.
6. **POFMA'd Into The Sea** — Heat maxed out. Everything surfaces at once.
7. **The Quiet Conversation** — asked to resign. No announcement is made.
8. **Backbench Lifer** — MP for thirty years, never a portfolio, beloved locally.
9. *(stretch)* **Leader of the Opposition** — see §11.

---

## 9. Architecture

Two Gradle modules. The split exists for one concrete reason: **the entire game can be
built and tested on plain JVM before the Android SDK is even installed**, and the rules
stay testable forever without an emulator.

```
:engine   pure Kotlin, zero Android deps, 100% unit-testable
  model/     GameState, Stats, Rank, Flags, Origin
  content/   Event, Choice, Requirement, EventLoader, CareerLadder
  rules/     TurnEngine, EventSelector, Appraisal, Salary, CepRules, Endings

:app      Android + Compose, thin
  ui/        MainScreen, EventCard, StatBar, AppraisalDialog, EndingCard, theme/
  save/      SaveStore (JSON → app files dir)
  assets/content/events/*.json
```

**The one rule that keeps this clean:**

```kotlin
fun advanceYear(state: GameState, choice: Choice?): TurnResult
```

`TurnEngine` is a **pure function** — no randomness injected implicitly (seeded `Random`
is passed in), no I/O, no Android types. Same input, same output, always. That makes
the rules deterministic, replayable, and trivially unit-testable, and it means the UI
holds no game logic whatsoever: Compose renders `GameState` and emits `Choice`.
Nothing else.

`GameState` is one immutable data class and is the single source of truth. Save = serialise it.

**Toolchain note:** no Android SDK, Flutter, or adb on this machine; Java 11 is installed
(AGP prefers 17). M1 needs none of that. M2 does — budget a setup step.

---

## 10. Milestones

| | Deliverable | Needs Android SDK? |
|---|---|---|
| **M0** | This document | no |
| **M1** | `:engine` + JSON content + JVM tests + console harness you can actually play in the terminal | **no** |
| **M2** | Java 17 + Android SDK; Compose UI; save/load; debug APK on device | yes |
| **M3** | Content to 120+ events, full ladder, all endings, balance pass | yes |
| **M4** | Art, sound, ending-card sharing, Play Store packaging | yes |

M1 is the real de-risking step: if the loop is not fun in a terminal with no art, it will
not be fun with art.

---

## 11. Explicitly out of scope for v1

Listed so they are *decisions*, not oversights. None of these get scaffolding built in
advance — they get built if and when we do them.

- **The Opposition branch** — resign, contest an SMC, become Leader of the Opposition.
  Strong idea, doubles the content burden. v2.
- Multiplayer / leaderboards
- Monetisation
- iOS
- A fifth stat ("Network"). Folded into Standing for now. Split it only if playtesting
  shows Standing is doing two jobs badly.

---

## 12. Tone guardrails

Practical rules, not hand-wringing. They make the game better *and* keep it shippable
in the country it is about.

1. **Institutions are real; people are invented.** Ministries, grades, CPF, GRCs, the
   bonus formula — real and accurately modelled. Every named character is fictional.
   No real politician is depicted, named, or caricatured.
2. **Punch at machinery, not at persons.** The comedy is in the process: the appraisal
   euphemism, the acronym, the twelve-page paper that concludes further study is needed.
3. **Deadpan.** The game never winks. It states the salary figure and moves on. Funniest
   line in the design is a number in a table.
4. **Accuracy is the joke.** Get the grades, acronyms and formulas right. A Singaporean
   player recognising a real appraisal phrase is worth more than any punchline we write.
5. **Affection.** This is a game made by someone who knows the system, not someone
   sneering at it from outside.

---

## 13. Open questions

1. **Turn granularity** — one year is clean but a promotion year and a coasting year
   feel identical. Worth prototyping quarters for Act III (parliament moves faster)?
2. **Is CEP too cruel?** A hard invisible ceiling may read as unfair rather than pointed.
   Mitigation: always leave at least one CEP-raising event reachable. Needs playtesting.
3. **Failure pacing** — should a run be losable at year 5, or should Act I always
   complete? Leaning: losable, but only through active choices, never bad luck.
4. **Title.** "Minister Salary" is plain and matches the repo. "Confirmed & Substantive"
   is funnier to the target audience and opaque to everyone else.
