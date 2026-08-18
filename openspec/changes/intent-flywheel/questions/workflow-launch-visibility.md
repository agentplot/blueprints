# Question: what visibility does a conductor owe at a workflow launch?

- **State:** open
- **Raised by:** the operator, 2026-08-10, via dispatch — bolt-kit-lift's
  guard-convergence workflow (wf_4d9a2735-b08, three one-edit sessions)
  discovered only after it fired
- **Blocks:** nothing here

## The question
By the amended rule the launch was legitimate — construction inside a
released bolt — but nothing announces a run's start, name, or scale to the
operator. What does a conductor owe at launch: a narrated line on a channel
the operator watches, a naming convention that makes runs legible after the
fact, a threshold of scale above which it asks first — or some set of
these?

## What turns on it
Whether the fleet's actual activity is visible without being hunted for.
The operator's words: "this fired off without me knowing… I'm not sure the
handoff part is working correctly" — invisibility at launch reads as the
handoff being broken even when it is working, which spends trust the loop
needs.

## What is already known
Visibility inside a run is `/workflows` and the reported run ID, by the
amendment that permitted workflow sessions at all; the prototype
measurement found herdr saw 0 of 6 workflow agents. The run ID is reported
at the END of a loop — the gap this question names is at the start.
→ decisions/rule-1-amended-for-workflow-sessions.md ·
decisions/openspec-ui-monitoring.md
