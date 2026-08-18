# Assertion: a conductor's loop is a dynamic workflow driven from the schema

- **Repo:** willdan-blueprints
- **State:** built — bolt-loop-layer, landed on main at ecfb85bc, 2026-08-10
- **Raised by:** the operator's structured feedback, 2026-08-07

## The claim
Four loop descriptions exist — one per bolt schema plus the intent loop —
each in its schema's `apply.instruction`, describing the loop's SHAPE and
mentioning neither `Workflow` nor `Agent`. The trigger lives in the
invocation (`decisions/the-trigger-lives-in-the-invocation.md`). Each text
mandates `isolation: 'worktree'` on writing phases and requires the run ID
to be reported. No script is written or maintained: Claude Code authors the
workflow on each run. The loop
queries tasks from `openspec instructions apply --json`, an agent analyses
them and returns what can start, work batches into sessions, the conductor
merges, and it re-queries. Both skills lose the loop-walking prose they
carry today, and the apply agents stop merging.

Isolation is scoped by what a call does: sessions are the only mutating
calls a workflow makes, and only they run in worktrees — query and analyse
calls get none (→ decisions/rule-1-amended-for-workflow-sessions.md). Each
text also instructs the workflow to honour model overrides arriving in
`args` and to apply the session type's default otherwise
(→ decisions/session-model-defaults.md).

## Why
Review depth was written three times as prose and could not settle, because
how much review the work deserves is a property of the work, not a sentence
in a skill. Moving the loop into the schema is what makes the bolt family
mean anything.
→ decisions/dynamic-workflows-drive-the-loop.md

## Boundaries
The workflow extension point is named here so `ponytail` and `simplify` can
be called from a step, but wiring either one is not in this assertion.
