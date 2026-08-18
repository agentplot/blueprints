# Assertion: the conductor skills shed the guidance written for their agents

- **Repo:** agentplot/flywheel — label re-pointed 2026-08-10 after the split; the target files moved with the plugin
- **State:** open
- **Raised by:** code review, 2026-08-07, findings 1, 5 and 10

## The claim
The reads-as-instruments section and the state-claim rules move out of
`flywheel-construction` to the agents they address; `flywheel-inception`
gets the same treatment. Both skills call `/opsx:ff`, `/opsx:continue` and
`/opsx:archive` explicitly rather than describing them. Review comments
written against one skill are applied to its siblings.

## Why
Roughly a third of a 496-line skill is rules for agents the conductor
dispatches rather than for the conductor, and the skill says so itself. The
five session-type skills, at 80 to 97 lines, do not have the problem.
→ sessions/2026-08-07-loop-fixups/code-review-verdicts.md findings 1, 5, 10

## Boundaries
Which register the skills are written in is an open Design question, and
answering it before this lands avoids rewriting twice.
