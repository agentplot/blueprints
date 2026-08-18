# Decision: the invocation carries the trigger; the schema describes only the shape

## Decision
**A schema says nothing about workflows.** Its `apply.instruction`
describes the loop's *shape* — analyse which tasks can start, build the
startable ones, re-query each pass — and mentions neither `Workflow` nor
`Agent`.

**The invocation carries the trigger:**

```
/opsx:apply build a dynamic workflow with the instructions for <change>
```

The phrase "a dynamic workflow" is enough. The tool need not be named.

Two things the instruction must still carry, both about content rather
than triggering:

- **`isolation: 'worktree'` is mandated** on any phase that writes.
- **The run ID is reported**, as the cheap check that the loop ran.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/spec-driven-construction.md`
- Produced by: `sessions/2026-08-07-workflow-trigger/`, round 3 — the
  operator's own proposal, tested at last with the variable isolated.
  Evidence at `evidence-rounds-2-3/`.

## Measured, 24/24

| arm | invocation | profile | fired |
|---|---|---|---|
| P | `/opsx:apply build a dynamic workflow with the instructions for <change>` | default | **8/8** |
| PS | as P, naming the `Workflow` tool outright | default | 8/8 |
| PC | as P | `flywheel-bolt-conductor` | **8/8** |

The stripped schema was audited at **0 occurrences of "workflow" and 0 of
"agent"**, in the file *and* in the delivered `.instruction` payload. PC
holds under the real conductor profile, with 5 of 8 having loaded
`flywheel-construction` and firing anyway.

**Round 1's `ctrlC` was never a counterexample.** It fired 0 with a
stripped schema, but its prompt — *"then do what it tells you to do"* —
named no workflow either. Keyword absent from **both** places fires
nothing; present in **either** fires. `ctrlC` and arm P agree. The n=1
negative that appeared to refute this arm was measuring something else, and
it was quoted twice as though it had refuted it.

## The shape improved rather than degrading
The worry was that a schema which no longer describes the mechanism would
produce a worse loop. The opposite happened. **25 of 26 stripped-schema
scripts built an explicit multi-pass loop** — `while (pass < 6)`,
re-querying each pass — where round 2's schema-carried text mostly produced
single-pass scripts needing the conductor to invoke twice. Stripping the
text moved the loop *into* the workflow, which is where it belongs.

All 24 trials reached the correct final state, with task 3 staged behind
task 1, so dependency reasoning survived losing the schema text. Drift was
additive: both core phases present in 22 of 24, most inventing a third
phase to tick tasks off, two renaming to `Pass 1..N`. Labels moved; work
did not.

## Isolation never arrives on its own — 0 of 71
Across rounds 2 and 3, **not one agent-authored script used
`isolation: 'worktree'`**. This is the most robust negative in the
prototype and it is independent of where the trigger lives. Without it in
the text, every build agent runs in the conductor's own tree and branch.

## What this costs
**A conductor started any other way fires nothing.** The trigger is in the
invocation by construction, so a session that begins from "continue work on
X" runs no loop. That is the design, not a defect — but it means the
invocation is now load-bearing and has to be stated wherever a conductor is
launched.

`/opsx:apply`'s step 6 still says *"for each pending task… continue to next
task"* — the walk-past written into the vehicle. It lost 24/24 here, but a
contradiction that survives because it keeps losing is still a
contradiction. Tasked separately.

## Consequences
- The three bolt schemas and `flywheel-intent` carry shape-only loop text.
  Nothing about workflows leaks into any schema.
- The starve-and-prohibit mechanism is **not adopted**. It solved a problem
  that only exists when the schema carries the trigger.
- Both surviving round-2 findings are about content: mandate isolation,
  report the run ID.
- Untested and named: a fully cold prompt against the stripped schema
  (excluded by construction), interactive rather than headless, more than
  three agents per phase.
