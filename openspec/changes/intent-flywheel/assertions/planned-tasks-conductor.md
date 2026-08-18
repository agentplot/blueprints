# Assertion: the planned-tasks conductor ships as a skill and a profile

- **Repo:** agentplot/flywheel — label re-pointed 2026-08-10 after the split; the target files moved with the plugin
- **State:** open
- **Raised by:** the operator, 2026-08-06, after two unnamed runs

## The claim
A skill and the launch point in `flywheel-inception` exist for the
`bolt-no-spec` practice, run by a bolt conductor. **No new agent profile,
and no schema** — it bypasses OpenSpec entirely, with Claude Code plan mode
replacing the spec step. The
routing test is stated where a conductor will read it: **is the change
already specified by the task text?** The charge template ships with the
skill — sources, tasks in scope, allowed and forbidden edits, and the
constraints that bite: pathspec commits, `--no-squash`, and who owns what
while siblings share a tree.

## Why
It ran twice before it had a name — `loop-fixups` and `flywheel-repo` — and
both worked.
→ decisions/the-planned-tasks-conductor.md · decisions/the-bolt-schema-family.md

## Boundaries
Worktree discipline is not what gets dropped: work landing in a built repo
gets a worktree and a session agent, and the conductor merges each branch
back. Naming is open against the closed vocabulary.
