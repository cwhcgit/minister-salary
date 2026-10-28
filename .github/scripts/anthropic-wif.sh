#!/usr/bin/env bash
# The GitHub OIDC identity token behind Workload Identity Federation with the Claude API.
#
#   anthropic-wif.sh check     fail if an API key or token is set, or a federation variable is missing
#   anthropic-wif.sh start     check, fetch a token into $ANTHROPIC_IDENTITY_TOKEN_FILE, keep it fresh in the background
#   anthropic-wif.sh refresh   fetch a fresh token now: run it before each new process that calls the API
#   anthropic-wif.sh stop      stop the background refresher and delete the token
#
# A GitHub token lasts about 5 minutes and the token exchange accepts each one only once, so
# the file is replaced every OIDC_REFRESH_SECONDS (default 180). The SDK exchanges it on the
# first request and re-reads the file whenever its Anthropic access token needs renewing.
# The token is only ever written to that file, never printed.
set -euo pipefail

AUDIENCE="https://api.anthropic.com"
FILE="${ANTHROPIC_IDENTITY_TOKEN_FILE:?ANTHROPIC_IDENTITY_TOKEN_FILE must be set}"
PIDFILE="$FILE.refresher.pid"
LOG="$FILE.refresher.log"
INTERVAL="${OIDC_REFRESH_SECONDS:-180}"

fetch() {
  : "${ACTIONS_ID_TOKEN_REQUEST_URL:?no OIDC token endpoint: the job needs 'permissions: id-token: write'}"
  : "${ACTIONS_ID_TOKEN_REQUEST_TOKEN:?no OIDC request token: the job needs 'permissions: id-token: write'}"
  local dir tmp
  dir="$(dirname "$FILE")"
  # Lock down only a directory this script creates, never an existing one such as /tmp.
  if [ ! -d "$dir" ]; then mkdir -p "$dir"; chmod 700 "$dir"; fi
  tmp="$(umask 077; mktemp "$FILE.XXXXXX")"
  if curl -sSf --retry 3 --retry-delay 2 \
       -H "Authorization: Bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \
       "$ACTIONS_ID_TOKEN_REQUEST_URL&audience=$AUDIENCE" | jq -er .value > "$tmp" && [ -s "$tmp" ]; then
    mv -f "$tmp" "$FILE"   # atomic, so the SDK never reads half a token
  else
    rm -f "$tmp"
    return 1
  fi
}

check() {
  local bad=() missing=() v
  for v in ANTHROPIC_API_KEY PLAYTEST_ANTHROPIC_API_KEY ANTHROPIC_AUTH_TOKEN ANTHROPIC_PROFILE; do
    if [ -n "${!v+set}" ]; then bad+=("$v"); fi
  done
  if [ ${#bad[@]} -gt 0 ]; then
    echo "::error::${bad[*]} must not be set: this job authenticates with workload identity federation only, and the SDK would prefer them"
    exit 1
  fi
  for v in ANTHROPIC_FEDERATION_RULE_ID ANTHROPIC_ORGANIZATION_ID ANTHROPIC_SERVICE_ACCOUNT_ID ANTHROPIC_IDENTITY_TOKEN_FILE; do
    if [ -z "${!v:-}" ]; then missing+=("$v"); fi
  done
  if [ ${#missing[@]} -gt 0 ]; then
    echo "::error::${missing[*]} not set: add them as variables on the 'playtest' environment (agents/README.md, Paid runs)"
    exit 1
  fi
  echo "no API key or token in the environment; federation rule ${ANTHROPIC_FEDERATION_RULE_ID}"
}

loop() {
  echo $$ > "$PIDFILE"
  trap 'exit 0' TERM
  while sleep "$INTERVAL"; do
    if fetch; then echo "$(date -u +%H:%M:%S) refreshed"; else echo "$(date -u +%H:%M:%S) refresh failed; next try in ${INTERVAL}s"; fi
  done
}

running() { [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; }

case "${1:-}" in
  check) check ;;
  start)
    check
    fetch || { echo "::error::could not fetch a GitHub OIDC token"; exit 1; }
    if ! running; then
      # Detached and with every stream redirected, so it outlives this step without holding it open.
      nohup setsid "$0" loop </dev/null >>"$LOG" 2>&1 &
      for _ in 1 2 3 4 5 6 7 8 9 10; do running && break; sleep 0.2; done
      running || { echo "::error::the token refresher did not start"; exit 1; }
    fi
    echo "OIDC token in place; refreshed every ${INTERVAL}s in the background"
    ;;
  refresh) fetch || { echo "::error::could not fetch a GitHub OIDC token"; exit 1; } ;;
  loop) loop ;;
  stop)
    if running; then kill "$(cat "$PIDFILE")" || true; fi
    if [ -f "$LOG" ]; then echo "refresher log:"; cat "$LOG"; fi
    rm -f "$FILE" "$PIDFILE" "$LOG"
    ;;
  *) echo "usage: $0 check|start|refresh|stop" >&2; exit 2 ;;
esac
