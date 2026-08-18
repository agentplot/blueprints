# Decision: every session launch carries a model — sensible defaults, overridable at runtime

## Decision
Model choice is part of the loop layer, not an accident of whatever the
conductor happens to run. Every session launch names its model:

- **Defaults by session type.** Fable runs design sessions and spec
  sessions; Opus with the 1M context window (`opus[1m]`) runs construction
  sessions — build, test, code-review — where the work is reading and
  writing large trees, not settling design.
- **Overridable at runtime via args.** The workflow invocation's `args`
  carry model overrides — per run or per session type — and the workflow
  passes them through (`agent()`'s `model` option; `--model` on a herdr
  launch). The defaults live where the session types are defined, never
  hard-coded into a loop prompt.

## Context
- Raised by: the operator, 2026-08-10, closing
  `questions/rule-1-and-workflow-agents.md` — a gap the loop-layer design
  did not cover
- Chapter: `books/aidlc-design/src/spec-driven-construction.md`

## Why
The two loops want different models for different work: design and spec
sessions are reasoning-bound, construction sessions are context-bound. A
default that is wrong for a given run must be correctable at the
invocation, without editing a skill or a schema.

## Consequences
- The session-type set gains a default-model column; the construction
  profile and skills state their defaults where the type is defined.
- Loop prompts instruct the workflow to honour model overrides arriving in
  `args` and to apply the type's default otherwise.
- The fleet manifest's launch commands name models the same way — one
  vocabulary for both launch paths.
