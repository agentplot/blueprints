# Assertion: the bolt registry is a directory, and a bolt bounds a delivery

- **Repo:** agentplot/flywheel — label re-pointed 2026-08-10 after the split; the target files moved with the plugin
- **State:** open
- **Raised by:** code review, 2026-08-07, findings 11 and 13

## The claim
The registry becomes one file per proposal, each carrying that proposal's
state, what it waits on, and what it produced; any at-a-glance view is
generated. Every "one construction iteration" reading in the schema and in
`flywheel-construction` is rewritten: a bolt bounds a delivery to main.

## Why
A table row stops being adequate the moment the loop queries it, and a
growing bolt edited by several agents is exactly what a shared table
collides on. The iteration wording also contradicted the same schema's
statement that the bolt grows — the one-answer defect, in the file carrying
the one-answer rule.
→ decisions/a-bolt-bounds-a-delivery.md
→ sessions/2026-08-07-loop-fixups/code-review-verdicts.md findings 11, 13

## Boundaries
Timestamping the state transitions is optional and only if a sequencing
record is wanted (→ decisions/no-audit-log.md).
