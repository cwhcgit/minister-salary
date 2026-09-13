# Minister Salary

A turn-based career simulator about climbing from junior public servant to Prime Minister,
set in Singapore's public service and played satirically. One tap is one year.

**Play:** https://cwhcgit.github.io/minister-salary/
On Android, open it in Chrome and use **⋮ → Add to Home Screen**. It then runs fullscreen
and works with no signal.

Design document: [`docs/DESIGN.md`](docs/DESIGN.md)

---

## What this is

The web build in `web/` is the **M1 playtest harness** from the design doc — the fastest way
to find out whether the loop is fun before investing in a native UI. The real target is
Kotlin + Jetpack Compose (`docs/DESIGN.md` §9). The `events.json` content and the rules in
`engine.js` are written to port across directly; the HTML is disposable.

## Layout

```
web/
  index.html              shell + all styling
  engine.js               rules. no DOM, no I/O — port target for Kotlin :engine
  ui.js                   rendering + interaction. holds no game logic
  sw.js                   offline cache
  content/game.json       ladder, pay, origins, appraisal grades, endings
  content/events.json     every event and choice
docs/DESIGN.md            the design
.github/workflows/        validates content, simulates 400 runs, deploys to Pages
```

`engine.js` is a pure function of `(content, state, choice)`. It is `require`-able from Node,
which is how the balance simulations below run without a browser.

## Editing the game from a phone

Everything that makes the game the game is in `web/content/`. Add an event by appending one
object to `events.json` — no code changes:

```json
{
  "id": "unique_snake_case",
  "title": "The Card Title",
  "body": "What happens. Deadpan. Institutions real, people invented.",
  "requires": { "minRank": 2, "maxRank": 6 },
  "weight": 10,
  "once": true,
  "choices": [
    { "text": "What you do.",
      "effects": { "standing": 8, "integrity": -12, "heat": 10 },
      "setFlags": ["did_the_thing"],
      "outcome": "What follows.",
      "schedule": [{ "eventId": "it_comes_back", "inYears": 4, "chance": 0.45 }] }
  ]
}
```

| Field | Meaning |
|---|---|
| `requires` | `minRank`/`maxRank` (0-16), `minStats`/`maxStats`, `minAge`/`maxAge`, `flagsAll`/`flagsNone`, `origin`/`originNot`, `notDuringBond` |
| `weight` | Relative chance of being drawn. Default 5. |
| `once` | `true` = never repeats. `false` = filler, keeps the pool full. |
| `priority` | Fires the moment it qualifies, ahead of the random pool. |
| `triggered` | Never drawn randomly; only reachable via another choice's `schedule`. |
| `effects` | `reputation` `standing` `integrity` `competence` (0-100), plus `wealth`, `heat`, `cep` |
| `schedule` | Deferred consequences — the mechanism that makes choices matter |

The service worker is cache-first, so an edit shows up on the *next* launch. To force it
immediately, bump `VERSION` in `web/sw.js`.

Push to `main` and the workflow validates the JSON, simulates 400 runs, and deploys.
A malformed event fails the build instead of reaching your phone.

## Balance

```bash
node test/sim.js 800                 # balance across three bots and three origins
npm i jsdom@24 && node test/ui.test.js   # plays three full careers through the real DOM
```

Current PM win rates — the win must stay rare by accident and reachable by skill:

| play style | scholar | graduate | poly |
|---|---|---|---|
| first-timer (random choices) | 8.6% | 1.6% | 0% |
| optimising stats | 14.8% | 21.3% | 11.3% |
| knows the win condition | 78.8% | 67.4% | 22.9% |

The origin difficulty ladder is the meritocracy joke expressed as balance, so if a content
change inverts that ordering, the change is wrong.

## Tone

Institutions are real and accurately modelled; every person is invented. No real politician
is depicted. The comedy is in the machinery, never in a named individual. Full rules in
`docs/DESIGN.md` §12.
