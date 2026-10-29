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
harness/                  runs the engine headlessly: screen view, full trace, seeded replays
test/                     bots, balance metrics, regression rule, UI and harness tests
agents/                   Claude playtesters, analyst and designer (see agents/README.md)
reports/                  playtest output; reports/baseline/ is the bot baseline
proposals/                designer changes awaiting your approval
.github/workflows/        validates content, enforces the balance rule, deploys to Pages;
                          runs the harness, leak checks and agent pipeline on every push
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
| `requires` | `minRank`/`maxRank` (0-16), `minStats`/`maxStats`, `minAge`/`maxAge`, `flagsAll`/`flagsNone`, `origin`/`originNot`, `notDuringBond`/`duringBond` |
| `weight` | Relative chance of being drawn. Default 5. |
| `once` | `true` = never repeats. `false` = filler, keeps the pool full. |
| `priority` | Fires the moment it qualifies, ahead of the random pool. |
| `triggered` | Never drawn randomly; only reachable via another choice's `schedule`. |
| `effects` | `reputation` `standing` `integrity` `competence` (0-100), plus `wealth`, `heat`, `cep` |
| `schedule` | Deferred consequences — the mechanism that makes choices matter |
| `bond` | Years a choice adds to the bond (a sponsorship with a bond of its own), served after any bond still running |
| `{peer}` `{junior.title}` … | The run's recurring people (peer, junior, senior, journalist, grassroots leader, fellow MP), named per run. `requires.cast` and a choice's `cast` read and change what each person remembers |
| `parts` | Named slots of interchangeable options (`{asker}`, `{want.done}`), one combination per showing |
| `{player}` `{player.formal}` `{player.their}` … | The player's name ("Mr" or "Ms" and the name, for officials) and pronouns, from the start screen. Only where someone else names or addresses the player: the papers, Hansard, a colleague, the batchmate, the ending |

The cast, the player's tokens and card parts are documented for writers in [`docs/CONTENT_PLAN.md`](docs/CONTENT_PLAN.md) section 8.

The service worker is cache-first, so an edit shows up on the *next* launch. To force it
immediately, bump `VERSION` in `web/sw.js`.

Push to `main` and the workflow validates the JSON, simulates 400 runs per bot per origin,
and deploys. A malformed event, or one that breaks the balance rule below, fails the build
instead of reaching your phone.

## Balance

```bash
node test/sim.js 800                 # balance and fun proxies across three bots and three origins
node test/sim.js regress 800         # the same, exit 1 if the regression rule fails
node test/harness.test.js            # replays, screen hygiene, trace
npm i jsdom@24 && node test/ui.test.js       # plays three full careers through the real DOM
npm i jsdom@24 && node test/screen.test.js   # the harness screen matches the phone
```

Every run is seeded, so the same content always gives the same numbers. Current PM win
rates — the win must stay rare by accident and reachable by skill:

| play style | scholar | graduate | poly |
|---|---|---|---|
| first-timer (random choices) | 6.4% | 2.0% | 0% |
| optimising stats | 15.1% | 22.1% | 11.3% |
| knows the win condition | 82.3% | 69.3% | 24.0% |

The origin difficulty ladder is the meritocracy joke expressed as balance, so if a content
change inverts that ordering, the change is wrong. `regress` rejects a change that
significantly inverts it for first-timer or win-seeking play, or lets a first-timer reach PM
in more than 15% of runs.

Beyond win rates, the sim reports fun proxies: dead and repeated years per act, which way
each stat gets pushed, dominated choices, events nobody reaches, whether early losses come
from choices or luck, whether a CEP-raising event is still reachable once you hit the ceiling,
and how often each consequence actually fires. `reports/baseline/README.md` is what they
show today.

## Agent playtests

Claude personas play the same build through the harness, seeing only what the phone shows,
and an analyst and designer turn their runs into ranked findings and proposed changes. Nothing
reaches `web/` without your approval. See [`agents/README.md`](agents/README.md).

## Tone

Institutions are real and accurately modelled; every person is invented. No real politician
is depicted. The comedy is in the machinery, never in a named individual. Full rules in
`docs/DESIGN.md` §12.
