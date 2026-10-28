# Agent playtests

Scripted bots and Claude personas play the web build to answer one question before money goes into the Android build: is the loop fun? This folder is the Claude half. The bot half is `test/sim.js`; both drive the game through `harness/`.

Nothing here changes the game. Agents produce reports and proposals, and a proposal reaches `web/` only when you run `proposals.ts apply`.

The default playtest is the **fun meter**: a Haiku 5.5 player plays careers back to back, reacting to each screen in one short line, until its fun runs out. What it measures is behaviour (how many taps and careers before it quits, and on which card), and what each card did to its fun. A career costs about $0.0015 on Haiku, and a five-career session under a cent. The original cohorts (1-5 interest ratings, notes and a diary per run, $0.25-0.31 a career on Sonnet) are still here for the questions only they answer.

## Setup

Node 22.18 or later (TypeScript runs directly; there is no build step), then `cd agents && npm ci`. Everything free runs without the install: `node agents/leak-check.ts`, `node test/sim.js`, `node test/harness.test.js`, and any agent command with `--mock`.

## Paid runs

Paid runs happen in GitHub Actions and authenticate with [workload identity federation](https://platform.claude.com/docs/en/manage-claude/wif-providers/github-actions): each job proves who it is with a GitHub OIDC token and exchanges it for a short-lived Anthropic access token. No API key exists anywhere: not in the repository, not in GitHub secrets, not on anyone's laptop.

**One-time setup**

1. Claude Console → [Workload identity](https://platform.claude.com/settings/workload-identity-federation) → Connect workload → GitHub Actions. The wizard registers GitHub's issuer (`https://token.actions.githubusercontent.com`, discovery mode) and creates a service account and a federation rule. Use these values for the rule:
   - `subject_prefix`: `repo:cwhcgit@156731708/minister-salary@1368461072:ref:refs/heads/main`, the subject of a job dispatched on `main`. GitHub includes the owner and repository IDs in the subject, so the plain `repo:cwhcgit/minister-salary:…` form does not match. The workflows must not set `environment:`, which would change the subject to `…:environment:<name>`.
   - `audience`: `https://api.anthropic.com`; `claims`: `repository_owner` `cwhcgit`, `repository_owner_id` `156731708`, `repository` `cwhcgit/minister-salary`, `ref` `refs/heads/main`, `event_name` `workflow_dispatch`. Only people with write access can dispatch, so forks cannot get tokens.
   - `workspace_id`: the project's own workspace (`wrkspc_014M7AmfQuPoyQccxD9agdEB`, no spend limit by the owner's choice)
   - `oauth_scope`: `workspace:developer`
   - `token_lifetime_seconds`: 600. Keep it at 420 or more. The SDK renews an access token once fewer than 120 seconds remain, and the file must have been replaced since the last exchange by then, because each GitHub token is accepted once; it is replaced every 180 seconds.
2. The four identifiers (rule `fdrl_…`, organization, service account `svac_…`, workspace `wrkspc_…`) are written directly into `cohort.yml` and `wif-smoke.yml`. They are identifiers, not credentials, so no GitHub secrets or variables are needed. If the rule is ever recreated, update them in both files.
3. Actions → **WIF smoke test** → Run workflow. It makes one tiny Haiku call through the same client and token handling as the cohorts, and fails with a pointer to the Console's authentication history if the exchange is refused.

**Running a cohort**

Actions → **Agent cohort** → Run workflow, then choose a persona (or `calibration`, or `content-audit`) and whether it is a dry run. One cohort per job. A dry run plays 3 runs (2 sessions for a fun persona, 1 per persona for calibration) and reports the projected cost of the full cohort in the job summary, followed by each fun cohort's `report.md`. The logs, summaries and audit come back as an artifact named after the persona, and are committed to the `playtest-results` branch.

Two optional inputs, both ignored when left empty and both ignored by `content-audit`:

- `runs`: a whole number of runs (sessions, for a fun persona), passed to the runner's `--runs` in place of the persona's own count (`lib/config.ts`). A dry run still plays at most 3 (2 sessions), and still projects the cost of the persona's default count. Calibration ignores it.
- `max_usd`: a dollar amount, passed to `--max-usd`. It caps this job's spend on top of the cohort's own cap; the lower of the two wins. Calibration is capped at $2 whatever it says.

Anything else (a word, a negative number, `0`) fails the job before the runner starts. The job log prints the exact runner command.

Order for a round: `calibration` (dry run first; check that Haiku passes the canaries), then `fun-casual`, `fun-insider`, `fun-completionist`, and `fun-critic` when the Haiku scores need a second opinion. `content-audit` before a round on new content. The original cohorts (`blind-*`, `lineage`, `breaker`, `veteran`) answer their own questions and cost far more; run them only for those.

How the job authenticates (`.github/scripts/anthropic-wif.sh`):

- `check` fails the job if `ANTHROPIC_API_KEY`, `PLAYTEST_ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN` or `ANTHROPIC_PROFILE` is set, even empty, since any of them would win over federation. It also fails if a federation variable is missing.
- `start` fetches a GitHub OIDC token with audience `https://api.anthropic.com` into `ANTHROPIC_IDENTITY_TOKEN_FILE`, then replaces it in the background every 180 seconds. The token lasts about 5 minutes and is accepted once. It is written atomically, readable only by the job, and never printed.
- The runner builds a zero-argument SDK client (`@anthropic-ai/sdk` 1.3.0, pinned by the lockfile). The client reads `ANTHROPIC_FEDERATION_RULE_ID`, `ANTHROPIC_ORGANIZATION_ID`, `ANTHROPIC_SERVICE_ACCOUNT_ID`, `ANTHROPIC_WORKSPACE_ID` and `ANTHROPIC_IDENTITY_TOKEN_FILE`, exchanges the token on the first request, and re-reads the file whenever the access token needs renewing. There is one client per process, so one exchange per access token. `PLAYTEST_REQUIRE_WIF` makes the runner refuse any other credential.
- `refresh` fetches a token immediately. It runs before each further process in the same job, so that process's first exchange never sees a token another process already used.

`test.ts` runs both halves offline against fake GitHub and Anthropic endpoints. It checks the audience, the refresh, that a reused token is never presented, and that a key anywhere stops the run.

## The monthly loop

```bash
node test/sim.js regress 800 --json reports/bot-metrics.json   # free: bots, balance, fun proxies
# Actions → Agent cohort: content-audit, then each persona (dry run first)
node agents/analyse.ts <downloaded cohort dirs> --metrics reports/bot-metrics.json
node agents/design.ts reports/analysis/<date>-<hash>            # proposals → proposals/
node agents/proposals.ts list                                   # then show / apply / reject
```

The analyst and designer still run locally. Without an API key, sign in with `ant auth login` first; the SDK picks up the profile. Moving them into a workflow too means downloading the cohort artifacts into that job.

`--mock` on any command runs the whole pipeline with a scripted stand-in instead of the API: free, offline, and what CI runs. Mock output is gitignored.

## Personas

Fun-meter personas (blind: the screen and the meter, nothing else; Haiku with thinking off unless stated). `runs` is sessions of up to 5 careers.

| persona | who | quit line | repeats | model | sessions | answers |
|---|---|---|---|---|---|---|
| `fun-casual` | a 24-year-old who plays on the bus; three screens to hook her | 35 | ×1.5 | Haiku 5.5, low | 100 | How long does a casual player keep tapping, and what makes her stop? Keeps one origin. |
| `fun-insider` | a Deputy Director; tone and accuracy matter | 25 | ×1 | Haiku 5.5, low | 100 | Does the satire hold an insider? Which lines break tone or get the service wrong? |
| `fun-completionist` | plays every ending; loves a callback that pays off | 15 | ×1 | Haiku 5.5, low | 100 | Do callbacks and endings pull a patient player through several careers? |
| `fun-critic` | a games critic, hard to impress | 25 | ×1 | Sonnet 5.5, low, thinking `between_tools` | 10 | Calibration: does a sharper (and dearer) reader agree with the Haiku players? |
| `calibration` | `fun-casual` ×3, `fun-insider` ×3, `fun-completionist` ×2, `fun-critic` ×3, canaries in every career | | | | 11 | Does Haiku mark the bland canary down, flag the wink, and agree with the critic card by card? |

Each personality is a block of config (`fun` in `lib/config.ts`: quit line, repeat multiplier, decay, maximum delta, careers per session, rotate or keep the origin) plus a short persona prompt in `personas/fun-*.md`. Adding one is a few lines.

The original cohorts:

| persona | sees | model | runs | answers |
|---|---|---|---|---|
| `blind-insider` | screen only; a Singapore public servant | Sonnet 5.5, low effort | 50 | Does the satire land for insiders? Is the jargon accurate? |
| `blind-general` | screen only; knows the country, not the service | Sonnet 5.5, low | 50 | Is it funny and followable without insider knowledge? |
| `blind-international` | screen only; a BitLife player abroad | Sonnet 5.5, low | 50 | Does it work abroad? Is the title opaque? |
| `lineage` | screen, plus its own notes from earlier lives | Sonnet 5.5, medium | 20 × 5 | Does knowledge improve outcomes? When is CEP inferred, and how does that feel? |
| `veteran` | the mechanics brief and the full trace | Haiku 5.5, low | 200 | Is the win reachable by skill from every origin? |
| `breaker` | the mechanics brief and the full trace | Sonnet 5.5, medium | 30 | Heat farming, vetting and election exploits, degenerate loops |

Prompts are plain files: `personas/*.md` and `prompts/*.md`. Models, effort, run counts and caps are in `lib/config.ts`. All cohorts share one seed set, with origins split evenly, so differences between cohorts come from the persona, not the dice. A lineage keeps one origin for all five lives. Fun personas share their own seed set: session s, career k gets the same seed in every fun cohort.

## The fun meter

A session is one player playing careers back to back, as someone would on the phone: up to 5 (`--careers`), each starting when the last one ends, with the next origin along or the same one again. The meter runs 0 to 100, starts at 50 once per session, and carries from career to career. Every tap moves it by three things:

- **the player's delta**, -10 to +10: its own reaction to this screen. The prompt (`prompts/play-fun.md`) allows a rise only for something it can name (a laugh, a surprise, a callback paying off, a real dilemma), says most screens land between -3 and +3, and keeps +6 and above for a moment you would tell a friend about. It sees the meter's value on every turn.
- **repeats**, applied by the runner: a card already played in full this session, in any career, costs 5. Repeats close together compound: 5, then 10, then 15 (and 15 after that), until three fresh cards in a row reset the streak. The persona's multiplier scales this (`fun-casual`: 8, 15, 23). "Meanwhile" lines (years that pass by themselves), the engine's one-line years and the canaries never count. A card is its version: a new version of a card (a different scene, same mechanics) is fresh.
- **decay**, applied by the runner: 2 off every tap.

At or below the persona's quit line, the player quits: the runner records the tap, the career and the card, and stops the session. The ending card is a tap too (the player reacts to it; no repeat cost). Between careers the session does what the phone does after each ending: the engine is given the cards of the last two finished careers (`recent`, as `ui.js` keeps them), so the next career prefers cards and versions the player has not just seen. A session therefore measures the variety players actually get.

At the end (a quit, or the last career) comes a three-question exit survey: `quit_reason` (20 words or fewer), `best_card`, `worst_card`. It is its own short request: a recap of the session (each career's ending, the screens that moved the player most and its reasons at the time, the last three screens, any lines it flagged) rather than the whole conversation again.

## What an agent sees

**Fun sessions.** One conversation per career. Each turn appends one user message (the screen exactly as the harness renders it, then `Your fun: 47/100.`) and the player's reply, which is the whole of its output:

```json
{"choice": "B", "delta": 2, "reason": "the appraisal euphemism for a C made me laugh", "off_tone": null}
```

`off_tone` is null unless a line broke the tone (a wink at the player, cruelty to a person rather than the system, a real politician, a wrong detail), in which case it quotes the line. No notes: the conversation is the memory. The request carries a cache breakpoint on the system prompt (shared by every career and session of the persona) and top-level automatic caching (`cache_control` on the request), which moves a breakpoint to the latest message, so each turn reads everything before it from the cache and pays full price only for the new screen and the last reply: about 250 tokens. Thinking is off (`disabled` on Haiku, `between_tools` on Sonnet). A new career opens with one line on how the earlier ones went. A reply that cannot be used is retried once with the available choices listed, then a choice is picked at random, flagged `autoPicked`, and the player is told so in its next message. Haiku has no refusal fallback; a refusal is handled the same way.

**The original cohorts.** Blind personas get the screen and nothing else (see `harness/README.md`). Every request is ordered for caching:

1. system prompt: persona, the store-page paragraph, how to reply. Identical for every turn of a cohort, so it is a cache hit after the first request.
2. a lineage's notes from earlier lives (cached for the length of the life).
3. the agent's own notes on this life so far.
4. the current screen: last year's outcome, then this year's event.

Notes are the agent's only memory. It adds one line a year (`remember`); when they pass 300 words it is asked to rewrite them (`rewrite_notes`). This keeps the plan's "short notes, updated every turn" while not paying to regenerate 300 words of output on every turn, which would roughly double the cost of a run.

Each turn returns `choice`, `why`, `interest` (1-5, calibrated in the prompt), `felt_weighty`, `confused_by`, `note` and the notes update. Each run ends with a diary: best and worst year, the year you would skip, callbacks noticed and whether they felt earned, what held your career back (the CEP probe), whether the ending felt fair, which ending you would chase, whether you would start another run now, tone breaks, and which title fits. Blind cohorts also answer a title question before play, with the two names in alternating order.

## Validity safeguards

- **Leak gate.** A blind cohort will not launch if its system prompt, diary or title prompt names CEP or Heat, gives an effect number or a stat threshold, or copies seven words in a row from the mechanics brief, the playtest brief or the design doc. Every screen is checked for internal ids and render bugs before it is sent. `node agents/leak-check.ts` runs the gate on its own; CI runs it on every push.
- **Canaries.** Blind and lineage cohorts play a build with two planted events (`harness/canaries.json`): a deliberately bland one and one that winks. A cohort passes only if it rates the bland one low (at most 2.5, and half a point under its own mean) and flags the wink in at least half the runs that saw it. A fun cohort passes only if the bland one's mean delta is -1 or lower and 2 points under the cohort's mean, and the wink is flagged `off_tone` in at least half its showings and 30 points above the cohort's base off-tone rate (so a player that flags everything fails). Fun sessions plant the canaries in the first career only, so they do not come back as repeats; calibration plants them in every career for more showings. A failed cohort's praise is discounted by the analyst. Canaries are held out of every other number.
- **Calibration.** `calibration` plays 8 Haiku sessions (the three Haiku players) and 3 Sonnet critic sessions on the same seeds, then writes `calibration.md`: each model's canary results, and how far Haiku's per-card scores agree with the critic's (Pearson, mean gap, same sign, the biggest disagreements). Run it before trusting a round of Haiku cohorts.
- **Behaviour over ratings.** The analyst weights skipped years, "start another run now?" and "which ending next" above 1-5 scores.
- **Fresh context.** Blind runs never see other runs. A fun session's careers see only a one-line recap of the earlier careers in the same session, written by the runner from what the ending cards showed. Lineage lives carry only notes the agent wrote; `test.ts` checks that nothing else gets in.
- **Humans confirm.** CEP cruelty, the title, and anything that changes the core loop go to 3-5 real players before they are treated as settled.

## Outputs

Fun cohorts: `reports/cohorts/<date>-<persona>-<build>/` holds `manifest.json`, `system-prompt.txt`, one JSONL per session in `sessions/`, `summary.json` and `report.md`. A session's JSONL has a `meta` line; per career a `career_start` (origin, seed, build, the freshness memory it started with, the meter) and a `career_end` (ending, choices, final state); one `turn` line per tap (the exact screen, the reply, the meter's before/model/repeat/decay/after, the card and whether it was a repeat, token usage and cost, the full trace); the `survey`; and a `summary` (quit, taps to quit, careers to quit, cost). Every career replays exactly from its build hash, origin, seed, `recent` and choices.

`summary.json` and `report.md` give, in order: taps to quit and careers to quit (median and distribution, with sessions that never quit counted apart), the share of careers finished and their endings, the fun curve (mean meter and mean delta by tap, and how many are still playing), a score per card (mean model delta with the rule deltas left out, split into first showing and repeats, off-tone flags, the cards players quit on, top and bottom 10), the endings' scores, the canary check, the exit survey, and the cost: per tap, career and session, the token split (uncached input, cache writes, cache reads, output, thinking) and its cost share, and what the same token counts would cost on Haiku and on Sonnet. `node agents/runner.ts summarize <dir>` rebuilds both. A calibration run adds `<date>-calibration-<build>/calibration.{json,md}` beside its four cohorts.

The original cohorts:

`reports/cohorts/<date>-<persona>-<build>/`: `manifest.json`, `system-prompt.txt`, one JSONL per run, and `summary.json`. Each run's JSONL has a `meta` line, an optional `title_probe`, one `turn` line per year (the exact screen the agent saw, its reply, token usage and cost, and the full trace), the `diary`, and a `summary` (ending, why it ended, final stats, the choice list). A run replays exactly from its build hash, origin, seed and choices.

`reports/analysis/<date>-<build>/report.md` is the ranked findings report; `reports/audit/<build>.md` is the tone audit.

## Spend

**Fun sessions.** From mock runs of every fun persona, priced with the table in `lib/config.ts` (token counts from the real screens at about 4 characters a token, a 35-token reply, no thinking; the dry run measures the real ones):

| | per tap | per career | per mock session (1-3 careers before the scripted player quits) | full 5-career session |
|---|---|---|---|---|
| Haiku 5.5 | ~$0.0001 | ~$0.0015 | ~$0.0015-0.003 | ~$0.006-0.008 |
| Sonnet 5.5 | ~$0.0014 | ~$0.023 | ~$0.025-0.045 | ~$0.09-0.13 |

Against the last Sonnet round ($0.25-0.31 a career, 58% of it per-turn output), that is about 12 times cheaper on Sonnet and about 200 times on Haiku. Nearly all input is a cache read; the cost is mostly cache writes (each new screen) and output. A Haiku cohort of 100 sessions comes to roughly $0.3-0.8 even if every session plays all five careers, so the $2 cap is a guard, not a budget; `calibration` is about $0.4, `fun-critic` about $1.2. A whole round (calibration, the three Haiku cohorts, the critic) is about $2-4, so $11.50 buys about three rounds, or many more Haiku cohorts on their own. Haiku 5.5 prices prompts over 100,000 tokens higher; a career's conversation stays under about 25,000 even at the 60-turn cap.

**The original cohorts.**

Estimates from the real prompt sizes (about 4 characters a token), before thinking tokens, which the dry run measures:

| cohort | per run | runs | cohort | cap |
|---|---|---|---|---|
| blind, each | $0.25-0.31 (measured in the first dry runs) | 50 | $13-15 | $20 |
| lineage | ~$0.16 | 100 | ~$16 | $25 |
| veteran | ~$0.02 | 200 | ~$4 | $5 |
| breaker | ~$0.17 | 30 | ~$5 | $10 |
| audit, analyst, designer | | | ~$2-5 a cycle | |

The caps add up to $76, leaving room in the $100 credit to re-test approved changes. Controls:

- A cohort stops launching runs once it has spent its cap (`lib/config.ts`); `--max-usd` caps a whole invocation.
- Every run, and every career in a session, stops at 60 turns.
- `--dry-run` plays three runs per persona for real and prints the projected cohort cost before you commit to it.
- Use a dedicated Console workspace with its own spend limit, and point the federation rule at it: every token the cohorts get is scoped to that workspace, so the monthly credit cannot be spent by anything else.
- Play requests use the regular Messages API, one request per turn, with up to 4 games (or sessions) at once (`--concurrency`). The Batch API (half price) is used only where nothing waits on the answer: the content audit and diary coding.
- Sonnet and Opus requests opt into server-side refusal fallback (`fallbacks: "default"`), so a rare safety decline is retried on another model instead of failing the turn. Haiku has no fallback; a turn that cannot be used is retried once, then picked at random and flagged `autoPicked` so analysis can drop it.

## Answers to the plan's open questions

- **Can the engine produce the on-screen text without the DOM?** Mostly. Event cards, outcomes, the pay line, appraisal euphemisms, promotion, warning, CEP-hint and rumour lines come from `engine.js` and the content. The UI adds the header, the "Requires competence 45" label on locked choices, the log tag labels, the ending card labels and the start screen. `harness/screen.js` reproduces those, and `test/screen.test.js` plays six careers through the real DOM and checks that every screen matches field for field.
- **Are events stored as data the designer can add to?** Yes: `web/content/events.json`. The designer writes ops (add, replace, set a field); `lib/proposals.ts` validates them, builds a patched copy of `web/`, and produces the diff.
- **Are balance numbers in config or hardcoded?** Both. In config: the ladder and pay, origins and CEP ranges, grade thresholds and euphemisms, minimum years in grade, retirement ages, and every choice's effects. Hardcoded in `engine.js`: the appraisal weights and noise, the bonus formula, the election win chances, the post-election CEP formula, the Heat thresholds (55 and 85), the C and D streak rules, the extra years at senior rungs and the double-jump rule. The designer can only propose content and config; if the analysis points at one of the hardcoded numbers, it says so instead. Moving them into `game.json` would open them up.
- **Node/TypeScript with the Anthropic SDK?** That is what this is: TypeScript run by Node's built-in type stripping, with `@anthropic-ai/sdk` as the only runtime dependency.
- **Which Console workspace and spend limit?** Yours to choose. Suggested: a workspace for this project alone with a spend limit of $90 a month, targeted by the federation rule (see Paid runs). No API key is needed.

## Files

```
runner.ts        play cohorts, fun sessions and calibration; summarize and score them
audit.ts         content auditor (Opus, Batch API)
analyse.ts       analyst: bot metrics + cohorts → ranked findings
design.ts        designer: findings → proposals, each regression-tested and audited
proposals.ts     the approval gate: list, show, check, apply, reject
leak-check.ts    the blind-prompt leak gate, on its own
test.ts          offline tests of the whole pipeline (mock, no credits)
lib/             config, harness bindings, prompts, schemas, API calls, play loop, reports;
                 meter.ts (the fun meter's rules), session.ts (a fun session), funreport.ts (its report)
personas/        one prompt per persona
prompts/         store page, play and diary instructions, briefs, analysis prompts
```

`prompts/m1-brief.md` is the M1 playtest brief. The analyst and designer take its fun criteria and known gaps as given, so keep it current when the design moves.
