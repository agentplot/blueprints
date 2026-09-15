#!/usr/bin/env bash
# Open a "team" tab in the current herdr workspace and start conductor, fable and explorer in it.
set -euo pipefail

test "${HERDR_ENV:-}" = 1 || { echo "Run this from inside a herdr pane." >&2; exit 1; }

team=$(cd "$(dirname "$0")" && pwd)
bp=/Users/chuck/Code/github_agentplot/blueprints/main
fn=/Users/chuck/Code/github_agentplot/flywheel-next/main

for role in conductor fable explorer; do
  if herdr agent get "$role" >/dev/null 2>&1; then
    echo "$role is already running." >&2
    exit 1
  fi
done

mkdir -p "$HOME/.local/state/flywheel-team/reports"

tab=$(herdr tab create --workspace "$HERDR_WORKSPACE_ID" --cwd "$bp" --label team --no-focus)
conductor_pane=$(jq -r '.result.root_pane.pane_id' <<<"$tab")
fable_pane=$(herdr pane split "$conductor_pane" --direction right --cwd "$bp" --no-focus | jq -r '.result.pane.pane_id')
explorer_pane=$(herdr pane split "$fable_pane" --direction down --cwd "$fn" --no-focus | jq -r '.result.pane.pane_id')

# Start the role's Claude session in the pane, then name the agent once herdr recognizes it.
start() {
  local role=$1 pane=$2
  herdr pane run "$pane" "bash $team/role.sh $role" >/dev/null
  for _ in $(seq 60); do
    if herdr agent rename "$pane" "$role" >/dev/null 2>&1; then
      echo "$role started in $pane"
      return
    fi
    sleep 1
  done
  echo "$role did not come up in $pane; look at that pane." >&2
  return 1
}

start conductor "$conductor_pane"
start fable "$fable_pane"
start explorer "$explorer_pane"
echo "team tab: $(jq -r '.result.tab.tab_id' <<<"$tab")"
