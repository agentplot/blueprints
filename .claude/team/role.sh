#!/usr/bin/env bash
# Run one flywheel team role in the current pane: role.sh conductor|fable|explorer|coder
set -euo pipefail

root=/Users/chuck/Code/github_agentplot
bp=$root/blueprints/main
fn=$root/flywheel-next/main
fc=$root/flywheel-cloud/main
team=$bp/.claude/team
role=${1:?usage: role.sh conductor|fable|explorer}

git_read=('Bash(git log:*)' 'Bash(git show:*)' 'Bash(git diff:*)' 'Bash(git status:*)')
git_write=('Bash(git add:*)' 'Bash(git commit:*)')

case $role in
  conductor)
    cd "$bp"
    args=(--model 'opus[1m]' --effort medium --add-dir "$fn" "$fc"
      --allowed-tools 'Bash(herdr agent:*)' 'Bash(openspec list:*)' 'Bash(openspec status:*)' 'Bash(openspec show:*)' "${git_read[@]}")
    ;;
  fable)
    cd "$bp"
    args=(--model fable --effort high --add-dir "$fn" --permission-mode acceptEdits
      --allowed-tools 'Bash(uv run:*)' "${git_read[@]}" "${git_write[@]}")
    ;;
  explorer)
    cd "$fn"
    args=(--model 'opus[1m]' --effort high --add-dir "$bp" "$fc" --permission-mode acceptEdits
      --allowed-tools 'Bash(openspec:*)' "${git_read[@]}" "${git_write[@]}")
    ;;
  coder)
    cd "$fn"
    args=(--model 'opus[1m]' --effort xhigh --add-dir "$bp")
    ;;
  *)
    echo "unknown role: $role" >&2
    exit 2
    ;;
esac

exec claude "${args[@]}" --name "$role" --append-system-prompt "$(cat "$team/$role.md")"
