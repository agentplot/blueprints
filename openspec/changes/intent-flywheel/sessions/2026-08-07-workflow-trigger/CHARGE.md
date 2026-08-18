# Charge: can a schema instruction trigger a dynamic workflow?

Type: **prototype** (`flywheel-prototype`). Change: `flywheel`. You own
`openspec/changes/flywheel/sessions/2026-08-07-workflow-trigger/` and the
throwaway repo you build. You write no canonical artifact — the finding
comes back as `prototypes/<slug>.md` and the conductor promotes it.

## The question

`sessions/2026-08-07-loop-layer/` settled that the loop is a **Claude Code
dynamic workflow** and that its text lives in a custom OpenSpec schema's
`apply.instruction`. Every part of that was measured except the joint
between the two halves:

**Does an agent, working a change bound to a custom schema, actually launch
a dynamic workflow because that schema's `apply.instruction` told it to?**

If it does not, the loop layer's whole mechanism needs rethinking, and that
is worth knowing before a bolt is scoped around it. A negative result is
the finding — do not engineer around a failure to make the prototype
succeed.

## Hit this risk first, before building anything

The `Workflow` tool refuses to run without **explicit user opt-in**. Its own
contract says to call it only when the user asked for multi-agent
orchestration in their own words, said the keyword, invoked a skill whose
instructions say to call it, or turned it on for the session.

**A schema instruction is not a user message.** So the most likely outcome
is that an agent reading `apply.instruction` declines to launch a workflow,
correctly, because nothing in its actual conversation opted in. Test that
before you build the rest.

The routes worth probing, in order of how much they would cost us:
1. The instruction alone, with no opt-in anywhere. Does the agent launch?
2. The instruction delegating to a **skill** — the contract names "a skill
   whose instructions tell you to call Workflow" as valid opt-in. If a
   schema instruction says "invoke skill X" and skill X calls `Workflow`,
   does the gate open?
3. Session-level opt-in, set once by the operator when the conductor starts.

Route 2 is the one that would make the design work as written. Report which
routes open the gate and which do not, with the exact text you used.

## Build

An **isolated, blank** repo — not blueprints, not the spike repo. Somewhere
disposable; it dies with this session.

- `git init`, then OpenSpec initialized in it.
- A **custom schema** with a proposal-per-file registry and an
  `apply.instruction` carrying the workflow text. Copy the shape from
  `openspec/schemas/flywheel-bolt/` here, cut down to the minimum that
  makes the question answerable. Nothing about books, personas, or bolts —
  those are not what is being tested.
- Three or four proposal files, one with a dependency on another, so the
  fan-out has something real to be dependency-aware about.
- **A deliberately simple workflow.** Two phases at most: query which
  proposals are workable, then one agent per workable proposal doing
  something trivial and verifiable — writing a file, returning a structured
  value. Resist making it realistic. The question is whether it *triggers*,
  not whether it does good work.
- Reuse `sessions/2026-08-07-loop-layer/specimens/workable.mjs` for the
  workable-now query rather than rewriting it; it is already built and run.

## What the finding must say

`prototypes/schema-triggered-workflow.md`, and it answers plainly:

- **Did it trigger?** Which route, exact instruction text, what the agent
  did. If it declined, quote the refusal.
- **Did the fan-out work?** Two workable on pass one, the third picked up on
  pass two once its dependency cleared — the scenario the design claims.
- **What the design has to change.** If the gate only opens via a skill,
  then `apply.instruction` cannot carry the workflow alone and the design
  needs a skill in the path. Say so in those terms.
- **What you did not test**, named rather than left implicit.

Every claim carries the command that produced it and the tree it ran on. A
measurement is a claim about a tree.

## Constraints

- Your blueprints worktree is yours; commit there, staging only paths you
  wrote. The throwaway repo is not committed anywhere.
- Report to `intent-flywheel` when the finding is written.
- Never use the `Agent` tool for delegation — herdr agents only. The
  `Workflow` tool is the subject under test and is a different thing.
