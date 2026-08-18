# Decision: no audit log; timestamp the state ladder if sequencing is wanted

## Decision
The flywheel adds no audit log. The ask it came from — keep a record
somewhere other than `tasks.md` — is already met three times over, and a
fourth trail nobody reads costs more than it returns.

If a record of *sequencing* is genuinely wanted, the cheap version is to
timestamp each proposal's state transitions. The ladder becomes a log for
free, stays machine-shaped, and is never re-read as narrative.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md`
- Produced by: the operator's structured feedback of 2026-08-07, section D5

## What already records this
- **Git history.** One commit per artifact change is already required, and
  with the commit-subject rule in place the subjects are readable.
- **Each conductor's herdr pane transcript.** A real file on disk,
  complete, searchable, and free. The 2026-08-06 retrospective was built
  entirely out of these.
- **The proposal state ladder.** Its forward-only progression is already a
  record of what happened to each proposal.

## What actually went wrong
Not a missing log. Reasoning with nowhere to go, which went into
`tasks.md` and was then re-read every turn — the cost being that a
conductor paid for its own analysis on every pass. That is answered by the
rule already landed: `tasks.md` carries orchestration steps, and reasoning
belongs in a decision record or in a report.

A separate `log.md` would reproduce the original defect exactly. An
append-only file in the change directory is re-read at turn start for the
same reason `tasks.md` was.

## Consequences
- Nothing is built. This decision exists so the question is not re-asked.
- If timestamps are added, they go on the per-proposal files
  (`decisions/a-bolt-bounds-a-delivery.md`), where the state already lives.
