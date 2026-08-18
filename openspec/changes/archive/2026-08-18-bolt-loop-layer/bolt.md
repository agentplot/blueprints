# Bolt: loop-layer

## Scope
Build the loop layer the `flywheel` intent designed in
`sessions/2026-08-07-loop-layer/`: the session-type set first — seven
construction session skills, the `flywheel-construction-session` profile,
and the two renames (`flywheel-review` → `flywheel-planning`,
`flywheel-review-session` → `flywheel-design-session`) — then the layer
that dispatches sessions by those types: the `bolt-{default,quick,deep}`
schema family with a loop shape in each `apply.instruction`, the intent
loop's shape in `flywheel-intent`, the invocation phrase at every conductor
launch point, the shared herdr reference, the envelope shapes and the
`rules.tasks` fix in `openspec/config.yaml`, the persona profiles, the
fleet manifest with its `flywheel up` / `status` commands, and the `owner:`
record with owner resolution in dispatch's relay.

The session types land before the loop shapes because a workflow
dispatches sessions BY TYPE — a loop prompt that names a type nobody hosts
dispatches nothing.

`flywheel-bolt` stays on disk while the changes bound to it are live —
this change is one of them. Retiring it is a chore once the last one
archives, not part of this bolt.

No book chapter and no map move: the design loop owns those exclusively.

## Sources
- Intent `flywheel`, two Handoff batches released together by the operator
  on 2026-08-10, in this session, after
  `questions/rule-1-and-workflow-agents.md` closed: the loop-layer batch
  (→ assertions/dynamic-workflow-layer.md · bolt-schema-family.md ·
  message-envelopes.md · persona-construction.md) and the session-type set
  (→ assertions/session-type-set.md).
- The decision records each proposal cites, in
  `openspec/changes/flywheel/decisions/` — including the two closed at
  release: `rule-1-amended-for-workflow-sessions.md` and
  `session-model-defaults.md`.
- The construction slate itself:
  `sessions/2026-08-07-loop-layer/loop-layer.html`, Mechanics tab, "What
  has to be built".

## Repos
- willdan-blueprints · `bolt/loop-layer` · worktree beside main
  (`wt`-managed)

## Working arrangement
The operator drives this bolt from their own session — conductor and
builder are the same session, by the operator's explicit choice at
release. The decisions are the spec: every proposal cites the records it
implements and no spec-driven change is opened per proposal. The declared
reviews still run: an independent read-only agent takes each `agent` row
across the batch before merge, and its findings land as Review task lines.

## Merge criteria
The release gate (`wt merge`, full hooks, on the exact tree) is always
implied. Beyond it:

- Every loop prompt contains zero occurrences of "workflow" and "agent"
  as mechanism words — the trigger lives in the invocation
  (`the-trigger-lives-in-the-invocation`), measured 24/24.
- Every loop prompt states what a phase may spawn on its first line:
  sessions isolated in worktrees, every other call read-only with no
  worktree (`rule-1-amended-for-workflow-sessions`).
- Every loop prompt requires the run ID and gives the merge/cleanup step
  to the conductor.
- The session-type definitions carry default models — Fable for design
  and spec sessions, `opus[1m]` for construction sessions — and every
  launch path accepts a runtime override via args
  (`session-model-defaults`).
- No reference to `flywheel-review` or `flywheel-review-session` survives
  the renames anywhere in the tree — grep-clean, not best-effort.
- The vocabulary and envelope block in `openspec/config.yaml` matches the
  loop-layer page's Vocabulary tab; `rules.tasks` names the intent's task
  sections as the six design types plus verify.
- An independent agent has read each `agent`-review row against the
  decision records it cites before its branch merges.
