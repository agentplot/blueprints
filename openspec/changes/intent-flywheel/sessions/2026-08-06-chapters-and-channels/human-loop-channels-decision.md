# Decision: the channel follows the shape of the answer, and the loop sets the default

## Decision
Three channels carry human-in-the-loop work and each has one job. Discord
carries a question whose answer is a sentence and needs nothing read first;
it is non-blocking, so the agent keeps working on whatever the answer does
not gate. plannotator carries margin notes on a document that already
exists. lavish carries choices across coupled decisions and anything that
needs options side by side. Both desk channels are blocking rounds — a
session stands at its surface until the operator has been through it — and
if an agent would have to stop and wait anyway, the question was never a
Discord question. Shape decides which channel; the loop decides the
default. The inner loop minimizes human review: adversarial agent review
and automated testing are how construction earns automated delivery, and
plannotator on code is something an agent asks for, not something the
pipeline requires. The outer loop defaults to the desk channels, with
triage the exception that is Discord-first and becomes more so as new
channel sources arrive. Escalation runs one way — take the cheapest
channel that can carry the answer, and when it cannot, say so and open the
surface, leaving the pointer behind.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md` (to be rewritten)
- Produced by: `sessions/2026-08-06-chapters-and-channels/decisions.html` —
  the operator annotated the shape-of-the-answer option with "it's a matrix
  of which actor is asking, because we specifically want to make sure that
  the inner-loop actors minimize the plannotator type of human in the loop
  … most things in the outer loop, by default, are plannotator and Lavish,
  with the exception of intake decision-making", and his answer added that
  the boundary "depends on whether it's the inner loop versus the outer
  loop, intent versus bolt and construction"

## Consequences
- Appended writeback task: the channel matrix into `conducting.md` — answer
  shape down one axis, loop across the other, and who blocks named per cell.
- `flywheel-inception`'s review-surfaces bullet states the outer-loop
  default and the escalation rule.
- `flywheel-construction` states construction's review bar: adversarial
  agent review plus automated testing, with human code review as a request
  an agent may make rather than a stage the pipeline runs.
- Standing constraint: automated delivery rests on that agent-review and
  test bar holding, so anything that weakens it re-opens this decision.
- The Discord side of this rests on there being exactly one bridged actor
  → decisions/bridged-singleton.md.
