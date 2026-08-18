# Question: what makes the fan-out actually happen, given the instruction is not reliably obeyed?

- **State:** closed → decisions/the-trigger-lives-in-the-invocation.md ·
  sessions/2026-08-07-workflow-trigger/ round 2
- **Raised by:** sessions/2026-08-07-workflow-trigger/prototypes/schema-triggered-workflow.md
- **Blocks:** assertions/dynamic-workflow-layer.md — it is that claim's failure mode

## The question
`apply.instruction` triggering a workflow is supported. It is not reliable.
Does the design mandate a start-prompt phrasing, add a check that notices
the fan-out did not happen, or something else?

## What turns on it
Whether a conductor can be trusted to have run its loop. A loop that
silently does not run is worse than one that fails, because the output
looks right.

## What is already known
- **The gate was never the problem.** `apply.instruction` alone made a cold
  agent author and run a dynamic workflow, 4/4 runs — no skill in the path,
  no keyword, no session opt-in. The skill route is untested and unneeded.
- **With a cold prompt it fired 1 of 3.** In all three the instruction was
  in context: the agent read "do not work the tasks one at a time in this
  conversation" and then did exactly that, with `printf > out/1.txt`.
- **The failure mode is a silent walk-past producing plausible output**, not
  a refusal. Nothing distinguishes the run that fanned out from the two that
  did not, except the worktrees that were never created.
- **The instruction text is load-bearing.** Control with the word `Workflow`
  stripped: 0 calls, all work done inline.
