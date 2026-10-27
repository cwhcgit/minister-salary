# Reports

- `baseline/`: the Phase 0 bot baseline (no credits): metrics JSON and what it shows.
- `cohorts/<date>-<persona>-<build>/`: one agent cohort. `manifest.json`, `system-prompt.txt`, `runs/*.jsonl` (one file per run, one line per turn, with the exact screen the agent saw, its reply and the full trace), `summary.json`, and `diary-codes.json` once scored.
- `analysis/<date>-<build>/`: `report.md` (the ranked findings), `analysis.json`, and the `bot-metrics.json` it was based on.
- `audit/<build>.md`: the content auditor's tone and accuracy table.

Mock and dry-run output is gitignored. Real cohorts are yours to commit or not; a full month (560 runs at about 100 KB each) is roughly 60 MB of JSONL.
