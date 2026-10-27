# Agent playtests

Scripted bots and Claude personas play the web build to answer one question before money goes into the Android build: is the loop fun? This folder is the Claude half. The bot half is `test/sim.js`; both drive the game through `harness/`.

Nothing here changes the game. Agents produce reports and proposals, and a proposal reaches `web/` only when you run `proposals.ts apply`.

## Setup

Node 22.18 or later (TypeScript runs directly; there is no build step), then:

```bash
cd agents && npm ci
export ANTHROPIC_API_KEY=...   # a key from the project's own Console workspace (see Spend)
```

Everything that costs nothing runs without the install: `node agents/leak-check.ts`, `node test/sim.js`, `node test/harness.test.js`.

## The monthly loop

```bash
node test/sim.js regress 800 --json reports/bot-metrics.json   # free: bots, balance, fun proxies
node agents/audit.ts                                            # once per content version, Opus, Batch API (under $1)
node agents/runner.ts play blind --dry-run                      # 3 real runs per persona + projected cost
node agents/runner.ts play blind                                # three blind cohorts of 50
node agents/runner.ts play lineage                              # 20 lineages x 5 lives
node agents/runner.ts score reports/cohorts/<date>-lineage-<hash>   # code the "what held you back" answers (Haiku, Batch)
node agents/runner.ts play veteran breaker                      # win-by-skill check, exploit hunt
node agents/analyse.ts reports/cohorts/<date>-* --metrics reports/bot-metrics.json
node agents/design.ts reports/analysis/<date>-<hash>            # proposals → proposals/
node agents/proposals.ts list                                   # then show / apply / reject
```

`--mock` on any of these runs the whole pipeline with a scripted stand-in instead of the API: free, offline, and what CI runs. Mock output is gitignored.

## Personas

| persona | sees | model | runs | answers |
|---|---|---|---|---|
| `blind-insider` | screen only; a Singapore public servant | Sonnet 5.5, low effort | 50 | Does the satire land for insiders? Is the jargon accurate? |
| `blind-general` | screen only; knows the country, not the service | Sonnet 5.5, low | 50 | Is it funny and followable without insider knowledge? |
| `blind-international` | screen only; a BitLife player abroad | Sonnet 5.5, low | 50 | Does it work abroad? Is the title opaque? |
| `lineage` | screen, plus its own notes from earlier lives | Sonnet 5.5, medium | 20 × 5 | Does knowledge improve outcomes? When is CEP inferred, and how does that feel? |
| `veteran` | the mechanics brief and the full trace | Haiku 5.5, low | 200 | Is the win reachable by skill from every origin? |
| `breaker` | the mechanics brief and the full trace | Sonnet 5.5, medium | 30 | Heat farming, vetting and election exploits, degenerate loops |

Prompts are plain files: `personas/*.md` and `prompts/*.md`. Models, effort, run counts and caps are in `lib/config.ts`. All cohorts share one seed set, with origins split evenly, so differences between cohorts come from the persona, not the dice. A lineage keeps one origin for all five lives.

## What an agent sees

Blind personas get the screen and nothing else (see `harness/README.md`). Every request is ordered for caching:

1. system prompt: persona, the store-page paragraph, how to reply. Identical for every turn of a cohort, so it is a cache hit after the first request.
2. a lineage's notes from earlier lives (cached for the length of the life).
3. the agent's own notes on this life so far.
4. the current screen: last year's outcome, then this year's event.

Notes are the agent's only memory. It adds one line a year (`remember`); when they pass 300 words it is asked to rewrite them (`rewrite_notes`). This keeps the plan's "short notes, updated every turn" while not paying to regenerate 300 words of output on every turn, which would roughly double the cost of a run.

Each turn returns `choice`, `why`, `interest` (1-5, calibrated in the prompt), `felt_weighty`, `confused_by`, `note` and the notes update. Each run ends with a diary: best and worst year, the year you would skip, callbacks noticed and whether they felt earned, what held your career back (the CEP probe), whether the ending felt fair, which ending you would chase, whether you would start another run now, tone breaks, and which title fits. Blind cohorts also answer a title question before play, with the two names in alternating order.

## Validity safeguards

- **Leak gate.** A blind cohort will not launch if its system prompt, diary or title prompt names CEP or Heat, gives an effect number or a stat threshold, or copies seven words in a row from the mechanics brief, the playtest brief or the design doc. Every screen is checked for internal ids and render bugs before it is sent. `node agents/leak-check.ts` runs the gate on its own; CI runs it on every push.
- **Canaries.** Blind and lineage cohorts play a build with two planted events (`harness/canaries.json`): a deliberately bland one and one that winks. A cohort passes only if it rates the bland one low (at most 2.5, and half a point under its own mean) and flags the wink in at least half the runs that saw it. A failed cohort's praise is discounted by the analyst. Canaries are held out of every other number.
- **Behaviour over ratings.** The analyst weights skipped years, "start another run now?" and "which ending next" above 1-5 scores.
- **Fresh context.** Blind runs never see other runs. Lineage lives carry only notes the agent wrote; `test.ts` checks that nothing else gets in.
- **Humans confirm.** CEP cruelty, the title, and anything that changes the core loop go to 3-5 real players before they are treated as settled.

## Outputs

`reports/cohorts/<date>-<persona>-<build>/`: `manifest.json`, `system-prompt.txt`, one JSONL per run, and `summary.json`. Each run's JSONL has a `meta` line, an optional `title_probe`, one `turn` line per year (the exact screen the agent saw, its reply, token usage and cost, and the full trace), the `diary`, and a `summary` (ending, why it ended, final stats, the choice list). A run replays exactly from its build hash, origin, seed and choices.

`reports/analysis/<date>-<build>/report.md` is the ranked findings report; `reports/audit/<build>.md` is the tone audit.

## Spend

Estimates from the real prompt sizes (about 4 characters a token), before thinking tokens, which the dry run measures:

| cohort | per run | runs | cohort | cap |
|---|---|---|---|---|
| blind, each | ~$0.16 | 50 | ~$8 | $12 |
| lineage | ~$0.16 | 100 | ~$16 | $25 |
| veteran | ~$0.02 | 200 | ~$4 | $5 |
| breaker | ~$0.17 | 30 | ~$5 | $10 |
| audit, analyst, designer | | | ~$2-5 a cycle | |

The caps add up to $76, leaving room in the $100 credit to re-test approved changes. Controls:

- A cohort stops launching runs once it has spent its cap (`lib/config.ts`); `--max-usd` caps a whole invocation.
- Every run stops at 60 turns.
- `--dry-run` plays three runs per persona for real and prints the projected cohort cost before you commit to it.
- Use a dedicated Console workspace with its own spend limit, and a key that belongs to it, so the monthly credit cannot be spent by anything else.
- Play requests use the regular Messages API, one request per turn, with up to 4 games at once (`--concurrency`). The Batch API (half price) is used only where nothing waits on the answer: the content audit and diary coding.
- Sonnet and Opus requests opt into server-side refusal fallback (`fallbacks: "default"`), so a rare safety decline is retried on another model instead of failing the turn. Haiku has no fallback; a turn that cannot be used is retried once, then picked at random and flagged `autoPicked` so analysis can drop it.

## Answers to the plan's open questions

- **Can the engine produce the on-screen text without the DOM?** Mostly. Event cards, outcomes, the pay line, appraisal euphemisms, promotion, warning, CEP-hint and rumour lines come from `engine.js` and the content. The UI adds the header, the "Requires competence 45" label on locked choices, the log tag labels, the ending card labels and the start screen. `harness/screen.js` reproduces those, and `test/screen.test.js` plays six careers through the real DOM and checks that every screen matches field for field.
- **Are events stored as data the designer can add to?** Yes: `web/content/events.json`. The designer writes ops (add, replace, set a field); `lib/proposals.ts` validates them, builds a patched copy of `web/`, and produces the diff.
- **Are balance numbers in config or hardcoded?** Both. In config: the ladder and pay, origins and CEP ranges, grade thresholds and euphemisms, minimum years in grade, retirement ages, and every choice's effects. Hardcoded in `engine.js`: the appraisal weights and noise, the bonus formula, the election win chances, the post-election CEP formula, the Heat thresholds (55 and 85), the C and D streak rules, the extra years at senior rungs and the double-jump rule. The designer can only propose content and config; if the analysis points at one of the hardcoded numbers, it says so instead. Moving them into `game.json` would open them up.
- **Node/TypeScript with the Anthropic SDK?** That is what this is: TypeScript run by Node's built-in type stripping, with `@anthropic-ai/sdk` as the only runtime dependency.
- **Which Console workspace and spend limit?** Yours to choose. Suggested: a workspace for this project alone, a spend limit of $90 a month, and an API key created inside it.

## Files

```
runner.ts        play cohorts; summarize and score them
audit.ts         content auditor (Opus, Batch API)
analyse.ts       analyst: bot metrics + cohorts → ranked findings
design.ts        designer: findings → proposals, each regression-tested and audited
proposals.ts     the approval gate: list, show, check, apply, reject
leak-check.ts    the blind-prompt leak gate, on its own
test.ts          offline tests of the whole pipeline (mock, no credits)
lib/             config, harness bindings, prompts, schemas, API calls, play loop, reports
personas/        one prompt per persona
prompts/         store page, play and diary instructions, briefs, analysis prompts
```

`prompts/m1-brief.md` is the M1 playtest brief. The analyst and designer take its fun criteria and known gaps as given, so keep it current when the design moves.
