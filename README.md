# Minister Salary

A satirical career game set in Singapore's public service. You start near the bottom, make
one decision at a time, and try to climb to Prime Minister: the only job in the country whose
salary is set by a published formula. Most careers end somewhere else, and that is the fun.

**Play:** https://cwhcgit.github.io/minister-salary/
On a phone, open it in the browser and add it to your home screen (Chrome: **⋮ → Add to Home
Screen**; Safari: **Share → Add to Home Screen**). It then runs fullscreen and works with no
signal.

Design document: [`docs/DESIGN.md`](docs/DESIGN.md)

Every card, in order: [`docs/DECK.md`](docs/DECK.md), as the player reads it, and
[`docs/DECK-DESIGN.md`](docs/DECK-DESIGN.md), with the mechanics.

---

## What this is

- **Pick who you are.** Enter a name, pick Male or Female, and choose where you start: a
  President's Scholar (easy), a Local Graduate (normal), or Poly, then night classes (hard).
  You can also play against a batchmate who climbs alongside you.
- **One card, one decision.** Each card is a situation at work: a minister's request, a leak,
  a budget cut, a by-election. You pick what to do and read what happens. Then each year gets
  its own review page: your grade, your pay, and any promotion.
- **Your stats are hidden.** Four things matter: Competence, Standing, Integrity and Reputation.
  You never see the numbers while you play. Colleagues and appraisals hint at them now and then.
  The ending card reveals all four.
- **Careers end at real ages.** The service retires you at 64. In politics, the party asks
  most Members to step down after 65. Only a strong Minister stays on, and 70 is the limit for
  everyone.
- **More than a third of careers get a Strange Year:** something impossible happens, and
  everyone handles it exactly as the system would.
- **Endings are collectible.** There are twelve, from Prime Minister to *The Consultancy* and
  *You Found Your Level*. Share yours as an image, with a link for friends to play.
- **Reincarnate** (top of the screen, two taps) abandons the current career and starts a new
  one.

The game runs in the browser from `web/`. A native Android app is the long-term plan
(`docs/DESIGN.md` §9). The game's content and rules are kept separate from the screens so they
can move across unchanged.

## Layout

```
web/                 the game: rules (engine.js), screens (ui.js), offline cache (sw.js)
web/content/         everything you read in the game: cards, endings, pay, names (JSON)
docs/                the design (DESIGN.md) and the writers' guide (CONTENT_PLAN.md)
docs/DECK*.md        every card in order, with links, generated from the content by tools/deck.js
harness/  test/      automated players, balance checks and tests
agents/              Claude playtesters that play the game and report what was fun or unclear
reports/             playtest results
proposals/           suggested changes waiting for approval
.github/workflows/   checks every change, then publishes the game
```

## Editing the game from a phone

Everything you read in the game lives in `web/content/`: the cards in `events.json` and the
packs in `content/packs/`, and the endings, pay, names and other lines in `game.json`. Adding a
card means adding one entry to a file. No code changes are needed:

```json
{
  "id": "unique_snake_case",
  "title": "The Card Title",
  "body": "What happens. Deadpan. Institutions real, people invented.",
  "requires": { "minRank": 2, "maxRank": 6 },
  "choices": [
    { "text": "What you do.",
      "effects": { "standing": 8, "integrity": -12 },
      "outcome": "What follows.",
      "schedule": [{ "eventId": "it_comes_back", "inYears": 4, "chance": 0.45 }] }
  ]
}
```

A card says when it can appear (`requires`), what each choice does to your hidden stats
(`effects`), and what can come back to bite you years later (`schedule`). Cards can use the
career's recurring people (`{peer}`, `{senior}`…) and the player's name, as the speaker would say it
(`{player.given}`, `{player.formal}`, `{player.full}`).
[`docs/CONTENT_PLAN.md`](docs/CONTENT_PLAN.md) is the full guide for writers. It covers every
field, the house style, and the plain-English rules.

Push to `main` and the checks run. If a card is malformed or breaks the balance below, the
change is stopped before it reaches anyone's phone. If it passes, the game is published in a
few minutes. Bump `VERSION` in `web/sw.js` with every change: the game is stored on phones so
it plays offline, and the new version number is what tells them to replace the old copy. The
deck (`docs/DECK.md`) rebuilds itself from the content after every change to `main`; to preview
it before pushing, run `node tools/deck.js`.

## Balance

Every change is tested by simulating thousands of careers with simple bots. The question is
whether reaching Prime Minister stays rare by accident but reachable by skill, and whether the
harder start is still harder. Current results:

| play style | President's Scholar | Local Graduate | Poly, then night classes |
|---|---|---|---|
| first-timer (random choices) | 3.5% | 0.3% | 0% |
| knows how to win | 45.9% | 39.0% | 20.6% |

A change is rejected if it lets random play reach PM in more than 15% of careers, makes an
easier start clearly worse than a harder one, or makes a batchmate help you instead of
competing with you. The simulation also reports dead years, repeated cards, and cards that
nobody ever reaches. `reports/baseline/README.md` explains each number.

To run it yourself:

```bash
node test/sim.js 800              # the balance report
node test/sim.js regress 800      # the same, and fail if a rule above is broken
```

## Agent playtests

Claude plays the game the way a person would. It sees only what the phone shows, decides
what to do, and says when it was having fun, when it was bored, and which lines it could not
follow. Those reports drive the fixes. Nothing it suggests changes the game without approval.
See [`agents/README.md`](agents/README.md).

## Tone

Institutions are real and accurately modelled; every person is invented. No real politician
is depicted. The comedy is in the machinery, never in a named individual. Impossible things
may happen, but nobody acts against their own interests: it is believable because the motives
are right. Every line is plain English a first-time player can follow. Full rules are in
`docs/DESIGN.md` §12 and `docs/CONTENT_PLAN.md` §5a.
