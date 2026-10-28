#!/usr/bin/env bash
# Commits a run's reports to the playtest-results branch, so anyone can read them with plain git.
# Artifacts need the Actions download API, which some sandboxes (the supervisor's included) cannot
# reach. The repository is public, so this publishes nothing the artifacts did not already.
#   publish-results.sh <label> <path>...
set -uo pipefail
label="$1"; shift
dest="$RUNNER_TEMP/playtest-results"
url="https://x-access-token:${GH_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
rm -rf "$dest"
git clone -q --depth 1 --branch playtest-results "$url" "$dest" || { echo "::warning::no playtest-results branch"; exit 0; }
out="$dest/runs/${GITHUB_RUN_ID}-${label}"
mkdir -p "$out"
for src in "$@"; do [ -e "$src" ] && cp -r "$src" "$out/"; done
cd "$dest"
git add -A
git -c user.name="github-actions[bot]" -c user.email="41898282+github-actions[bot]@users.noreply.github.com" \
  commit -qm "Reports from run ${GITHUB_RUN_ID} (${label})" || { echo "nothing to publish"; exit 0; }
for i in 1 2 3 4 5 6; do
  if git push -q origin HEAD:playtest-results; then echo "published to playtest-results/runs/${GITHUB_RUN_ID}-${label}"; exit 0; fi
  sleep $((5 + RANDOM % 15))
  git pull -q --rebase origin playtest-results || true
done
echo "::warning::could not publish reports to playtest-results"
