# Assertion: an ADR is triggered by a Handoff task line

- **Repo:** agentplot/flywheel — label re-pointed 2026-08-10 after the split; the target files moved with the plugin
- **State:** open
- **Raised by:** code review, 2026-08-07, finding 2

## The claim
`flywheel-intent`'s Handoff instruction states what an ADR line carries —
the repo, the decision to record, and the sources — and
`flywheel-construction` states that the bolt conductor writes it into the
built repo's log4brains layout, first, before the code, generating no
proposal.

## Why
Retiring the ADR task type moved the writing to the bolt conductor and left
nothing that asks for one; the conductor would have had to notice unprompted.
→ decisions/adr-is-a-handoff.md · decisions/bolt-conductor-latitude.md
→ sessions/2026-08-07-loop-fixups/code-review-verdicts.md finding 2

## Boundaries
The ADR task type stays retired. The trigger is a clause on a Handoff line,
not a section of its own.
