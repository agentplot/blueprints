# Assertion: dispatch can route an idea straight to a bolt

- **Repo:** agentplot/flywheel — label re-pointed 2026-08-10 after the split; the target files moved with the plugin
- **State:** open
- **Raised by:** code review, 2026-08-07, finding 4

## The claim
`flywheel-dispatch` carries a triage that picks the bolt route without an
intent, with the test that decides it stated.

## Why
The route exists in the skill; the triage that would choose it does not, so
every idea arrives at an intent by default.
→ sessions/2026-08-07-loop-fixups/code-review-verdicts.md finding 4

## Boundaries
The chore route already exists and is scoped to dispatch at triage; this is
the bolt route beside it.
