# Decision: a planned-tasks conductor, as the light alternative to a bolt

## Decision
**Planned tasks IS `bolt-no-spec`, and `bolt-no-spec` binds no schema at
all.** It bypasses OpenSpec entirely — no change directory, no artifacts, no
`opsx`. **Claude Code plan mode replaces the spec step.** An intent
conductor hands a bolt conductor a batch of settled tasks; it plans them in
one plan-mode pass, the operator approves the plan, it executes, merges, and
closes. The plan and the commits are the whole record.

There is no planned-tasks conductor profile either. A bolt conductor runs
it.

This record originally called it a third conductor with a profile of its
own. `sessions/2026-08-07-loop-layer/loop-layer.html` is the primary design
source and its actor model is three conductor profiles — dispatch, intent,
bolt — with the schema deciding depth. A fourth profile would mean the
member picked at creation is *not* what sets the shape, which is the one
thing the family exists to guarantee.

It is the lightest member of the family
(`decisions/the-bolt-schema-family.md`) and the only one that is not a
schema: the other three are OpenSpec schemas whose `apply.instruction`
carries a loop prompt, and this one is the absence of that. The plan is its
only artifact — no proposals, no registry, no spec or review agents,
nothing archived.

It is launched by an intent conductor, runs from the intent's own repo
(blueprints main today), and may target several built repos in the same
batch. Its shape:

1. **Charged with a batch.** The intent conductor names the tasks, the
   sources to read, the surfaces it may edit, and the surfaces it may not.
2. **Plans in Claude Code plan mode**, which is what replaces the spec
   step. One plan covering every edit in the batch,
   grouped so each commit is coherent, naming which items it is doing and
   which it is leaving. The operator approves the plan. **That approval is
   the release** — there is no separate gate, because the plan is the thing
   worth approving and it exists before any file is written.
3. **Executes.** Edits it can make in place, it makes in place. Work
   landing in a *built repo* gets a worktree there and a session agent to
   do it, exactly as a bolt would — the lightness is in the tracking, not
   in abandoning worktree discipline.
4. **Merges back.** The planned-tasks conductor merges each session's
   branch to that repo's main itself. Sessions do not merge their own work.
5. **Reports done and closes.** On its report the intent conductor checks
   off the tasks it handed over and closes the pane. Nothing is archived,
   because nothing was tracked — the plan, the commits and the report are
   the record.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/spec-driven-construction.md`
- Produced by: the operator, after watching two of these run unnamed —
  "I want that to be a skill that goes with flywheel."

## The test against a bolt
**Is the change already specified by the task text?**

- **Yes → planned tasks.** The *what* is settled and only the *how* needs
  working out. Small text edits across known files, a scaffold, a rename,
  a batch of corrections an audit already enumerated.
- **No → bolt.** The change needs specifying before it can be built,
  wants adversarial review of a success claim no mechanical check would
  catch, needs batched acceptance across interdependent proposals, or
  deserves a permanent record of what was built and why.

A bolt carries a change, a registry, spec and apply and review agents,
acceptance batches, a release gate and an archive. For a batch whose
content is already decided, every one of those is ceremony, and the
ceremony is what made a bolt run all day.

## Evidence, 2026-08-06
Two ran before the pattern had a name, and both worked:

- **`loop-fixups`** — the retro's accepted findings plus four rules, across
  the skills, both schemas, `openspec/config.yaml`, `books/CLAUDE.md`,
  root `CLAUDE.md` and `devenv.nix`. Fourteen items, one plan, no change
  tracked.
- **`flywheel-repo`** — standing up `agentplot/flywheel` and writing the
  migration plan, spanning two repos.

Both were charged the same way: read these sources, enter plan mode, one
plan, these surfaces are yours and these are not.

## Why it is a bolt type rather than an escape from bolts
`decisions/every-handoff-is-a-bolt.md` settled that a lone generated
proposal does not skip the bolt, and that stands. This does not skip it
either — it takes the member of the family that asks for least, the one
that is not a schema at all. The lightness is in what
the member requires, not in leaving the family, which is the whole reason
the family exists: work that differs in how much ceremony it deserves
differs by schema, and nothing has to be argued per run.

## Consequences
- A skill ships with the flywheel — the practice, as `flywheel-inception`
  and `flywheel-construction` carry theirs. **No new profile.** A bolt
  conductor reads it when an intent conductor charges it with a
  planned-tasks batch — the charge is the launch. Nothing "binds
  `bolt-no-spec`", because there is no change and it is not a schema
  name: the phrase names the practice. (This bullet first said "when its
  change binds `bolt-no-spec`" — a leftover from this record's superseded
  third-conductor draft, found load-bearing by bolt-plugin-shape's spec
  agent 2026-08-10 and corrected to agree with the Decision.)
- `flywheel-inception` gains the launch and the test above, so an intent
  conductor knows which of the two to reach for.
- The charge template is part of the skill: sources to read, tasks in
  scope, surfaces allowed and forbidden, and the constraints that bite
  here — commit by pathspec, `--no-squash`, and which agent owns what while
  siblings share a tree.
- Naming is not settled. `planned-tasks` is the operator's phrase and is
  descriptive; the vocabulary decision closed the term set at six, so this
  either uses ordinary words or is added to that list deliberately.
