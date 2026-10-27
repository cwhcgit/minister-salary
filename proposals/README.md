# Proposals

Designer proposals awaiting a decision. `node agents/design.ts <analysis dir>` writes one folder per proposal:

- `proposal.md`: what it changes and why, the predicted effect on a named metric, the checks it passed, and the diff. Read this one.
- `proposal.json`: the designer's ops (add an event, replace an event, set a field).
- `change.diff`: the change to `web/content`, as a reviewable diff.
- `status.json`: `awaiting_approval`, `failed_regression` (goes back to the designer), `invalid`, `approved` or `rejected`.
- `metrics-before.json`, `metrics.json`: the bot metrics without and with the change, at the same number of runs.
- `audit.json`: the content auditor on any new or changed events.
- `build/`: a patched copy of `web/` (not committed). Bots and agents can play it before anything is approved: `node test/sim.js regress --content proposals/<id>/build`, or `node agents/runner.ts play blind --build proposals/<id>/build`.

```bash
node agents/proposals.ts list
node agents/proposals.ts show <id>
node agents/proposals.ts check <id>            # re-run the bot regression on today's content
node agents/proposals.ts apply <id>            # re-check, write into web/content, bump the cache version
node agents/proposals.ts reject <id> <reason>
```

`apply` writes the files and stops; review with `git diff` and commit as usual. Then play a fresh blind cohort and run `node agents/analyse.ts … --proposals <id>` to see whether the prediction came true.
