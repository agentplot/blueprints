# Assertion: spec agents get a worktree each

- **Repo:** agentplot/flywheel — label re-pointed 2026-08-10 after the split; the target files moved with the plugin
- **State:** open
- **Raised by:** code review, 2026-08-07, finding 6

## The claim
Each spec agent works in its own worktree and commits its own work; the
conductor merges the branch back. The rule that spec agents do not commit,
and that the conductor lands each spec by pathspec once the agent is idle,
comes out.

## Why
That rule worked around a shared git index instead of removing it, and it
made "finished" a property a conductor had to observe before every commit —
with no check between, a commit boundary lands wherever the agent happened
to be. Pathspec discipline survives wherever a tree is genuinely shared.
→ decisions/bolt-conductor-latitude.md
→ sessions/2026-08-07-loop-fixups/code-review-verdicts.md finding 6

## Boundaries
Merge-back ownership is stated in the dynamic-workflow assertion; this one
is only about where a spec agent works.
