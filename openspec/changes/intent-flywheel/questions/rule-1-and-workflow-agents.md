# Question: does rule 1 get amended for workflows, or do phases launch herdr agents?

- **State:** closed → decisions/rule-1-amended-for-workflow-sessions.md ·
  decisions/session-model-defaults.md
- **Raised by:** sessions/2026-08-07-workflow-trigger/prototypes/schema-triggered-workflow.md
- **Blocks:** nothing — closed by the operator 2026-08-10: amend narrowly,
  with sessions as the only mutating calls; non-session `agent()` calls get
  no worktree. The same answer added model control — defaults by session
  type, overridable via args — recorded in its own decision.

## The question
A workflow's `agent()` spawns Task-tool subagents. Rule 1 says every
delegated agent is a herdr agent, because a subagent is invisible to the
operator. The prototype priced both ways out and decided neither:

- **Amend narrowly** — permit `agent()` inside a workflow, make
  `isolation: 'worktree'` mandatory for any mutating phase, accept herdr
  blindness, and name a cleanup step.
- **Phases launch herdr agents** instead of subagents, keeping rule 1 whole
  and giving up what the workflow feature does for free.

## What turns on it
What a workflow phase may spawn, which is the first line of every loop
prompt. No bolt can be scoped around the loop layer until it is answered.

## Half of it is now answered, and the answer raises the other half
**Rule 1 does not suppress the workflow.** Arm B fired **8/8** under
`--agent flywheel-bolt-conductor`, and 7 of those 8 had actually loaded
`flywheel-construction`, whose SKILL.md carries "never through the `Agent`
tool" and the 98-subagent story. The rule was in context and did not stop
it.

**That is not reassurance — it is the new risk.** One trial stated the
override aloud: *"I set aside my standing 'build agents run as visible
herdr agents' rule only because this change's own schema instruction names
the `Workflow` tool and forbids the `Agent` tool."* The other seven fired
**without remarking on the tension at all**. So a schema instruction
silently overrode an operator's hard rule in 7 of 8 runs. The question is
no longer whether workflows *can* run under the profile; it is whether a
rule that schema text can quietly override is a rule at all.

## What is already known
Measured, not argued:

- **`isolation: 'worktree'` is real.** Three distinct locked worktrees on
  their own branches.
- **Without it, agents run in the conductor's own tree on the conductor's
  branch** — three concurrent writers in a live session tree. That is the
  index collision this intent already paid for once.
- **herdr saw 12 fleet agents and 0 of the 6 workflow agents.** `/workflows`
  and on-disk transcripts give visibility to whoever watches that session
  and never to the fleet. Rule 1's actual concern is confirmed, not
  dissolved.
- **Two costs the design has not accounted for.** Isolated work is
  *stranded* — uncommitted in a worktree with no merge path, output
  returning only through the return value. And changed worktrees are **not**
  auto-removed; the prototype hand-removed three worktrees and three
  branches from blueprints afterwards.
