# Decision: a bolt bounds a delivery to main, and its registry is one file per proposal

## Decision
**A bolt bounds a delivery to main.** It is not a count of iterations. New
work in scope joins a live bolt as new rows; the bolt grows and never
spawns a sibling for scope that belongs to it. What ends a bolt is
everything it carries reaching main, not a lap being completed.

**The registry is one file per proposal**, not one table in
`bolt/proposals.md`. Each file carries that proposal's state, what it
waits on, and what it produced.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/spec-driven-construction.md`
- Produced by: `sessions/2026-08-07-loop-fixups/code-review-verdicts.md`
  findings 11 and 13, and the operator's structured feedback section D3

## Why the wording had to change
`flywheel-bolt/schema.yaml` opened with "a bolt is one construction
iteration" while the same schema said the bolt grows. Both were in settled
voice, so a reader had no way to tell which was meant — the exact defect
the one-answer rule names, sitting in the file that carries the rule.
Counting iterations was never what the object did: nothing increments, and
nothing closes when a lap ends. Bounding a delivery describes what
actually happens and contradicts nothing.

## Why per-proposal files, now
A table row was adequate while a conductor read the registry with its
eyes. It stops being adequate the moment the loop **queries** it — the
workflow asks which proposals are workable with no unmet dependency
(`decisions/dynamic-workflows-drive-the-loop.md`), and a cell in a
markdown table is not something to ask a question of. Per-proposal files
also make a growing bolt cheap: adding work is a new file rather than an
edit to a shared table several agents are reading.

It costs the at-a-glance read. That is recovered by generating the
overview from the files rather than hand-maintaining one — the same rule
that already forbids hand-maintained status.

## Consequences
- `flywheel-bolt`'s schema opens with the delivery framing, and every
  "iteration" reading in the schema and in `flywheel-construction` is
  rewritten rather than annotated.
- The registry becomes a directory. The state ladder moves onto each
  proposal file, and the messages that move a proposal along it are the
  envelopes (`decisions/message-envelopes.md`).
- `bolt/proposals.md`, where it survives, is generated.
- Schema lines compressing two rules into abstract prose with no example
  are rewritten or deleted rather than edited — flagged as unintelligible
  by review, and unsalvageable at that length.
