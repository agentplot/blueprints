#!/usr/bin/env bash
# PostToolUse hook: Vale on every Markdown file a session writes under
# books/ or design/, so the warnings arrive in the turn that wrote the
# text. Exit 2 shows Vale's output to Claude; the write already happened.
# Vale comes from devenv: the shell's profile when one has been entered,
# else through `devenv shell`.
set -u
input="$(cat)"
file="$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')"
[ -n "$file" ] || exit 0
case "$file" in *.md|*.mdx) ;; *) exit 0 ;; esac
root="$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0
case "$file" in "$root"/books/*|"$root"/design/*) ;; *) exit 0 ;; esac
cd "$root" || exit 0
if [ -x .devenv/profile/bin/vale ]; then
  out="$(.devenv/profile/bin/vale --minAlertLevel=warning --output=line "$file" 2>&1)"
else
  out="$(devenv shell -- vale --minAlertLevel=warning --output=line "$file" 2>/dev/null)"
fi
if [ -n "$out" ]; then
  printf 'Vale (books/VOICE.md) on %s:\n%s\nClear each warning before you commit.\n' "${file#"$root"/}" "$out" >&2
  exit 2
fi
exit 0
