# Decision: the bolt type is the operator's choice at release

## Decision
The release gate presents the bolt type — **quick · default · deep**,
the `bolt-*` schema member the change binds — as an explicit choice,
never only as a drafted default inside the recommendation text. The
conductor still drafts the release and may recommend a type; the
operator picks. The choice travels on whatever channel carries the gate:
an option set in the approval question while `AskUserQuestion` stands in,
an explicit choice field in the release document now that the gate rides
the desk round (amended 2026-08-10 together with
`decisions/the-gate-is-inline.md`).

## Context
- Produced by: the operator, 2026-08-10, via dispatch — "I need to be able
  to choose the bolt type", after a release arrived with bolt-quick
  pre-picked inside the recommendation text

## Why
The bolt type picked at creation sets the review steps the whole bolt's
loop schedules. How much scrutiny the work deserves is a property of the
work being released, and the release approval is the operator's one
moment to set it; a pre-picked type buries the one lever the approval
exists to pull.

## Consequences
- Binding on every release request from this conductor immediately: the
  approval question carries the bolt types as options, the drafted
  type marked as the recommendation.
- The handoff skill and the release-request shape carry the rule — that is
  construction in `agentplot/flywheel`; a handoff task names it.
