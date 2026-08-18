# Intent: flywheel

## Destination
`books/aidlc-design` describes the flywheel as it is practiced.
`conducting.md` and `authoring-capabilities.md` carry the actor model —
dispatch, intent conductors, design sessions, bolt conductors, spec/apply/
testing agents, each with its cardinality, where it runs, and what it is
the sole writer of. `spec-driven-construction.md` is built around the five
pipeline stages, with the actor-and-branching figure. The book's chapter
set is the flywheel's: `catalog.md` and `agent-workspaces-plugin.md` are
gone, `system-design-inception.md` and `openspec-construction.md` have
folded into the loop chapters, and `SUMMARY.md`, `vocabulary.md`,
`walkthrough.md`, and `index.md` follow. `books/CLAUDE.md` no longer asks
for a per-book proposals chapter, and the root `CLAUDE.md` names the
flywheel entry points so a session in any worktree finds the schemas, the
skills, and the actor model without being told.

A conductor's loop is a **dynamic workflow**, not a list walked by hand. It
asks OpenSpec what can be worked now, fans out over the answer, and asks
again each pass so an item whose dependencies clear mid-run is picked up.
The text driving that workflow lives in the schema instructions, so a
change gets its loop logic from the schema it binds. A bolt binds one of a
family of five — default, chore, planned-tasks, fast, deep — and how much
review the work gets is settled by which name it binds rather than by a
rule in prose that keeps needing correction.

Construction is read by the people who will use the thing. A matrix of
repos and personas — the data scientist at a CLI, the library developer
integrating an SDK, the DevOps engineer deploying it — reviews each
proposal before it is built and exercises the application after. A smell
check reads the work against the rest of the codebase, and a conductor
meeting a large enough smell stops and asks for a human.

Messages between agents are shaped objects. Transport was always defined;
now the payload is, as one envelope per routing disposition — answer the
sender, extend the bolt, extend the intent — carried in
`openspec/config.yaml` where every instruction call picks it up.

The plugin is marketplace-ready: `flywheel-inception` and
`flywheel-construction` ship as one `flywheel` plugin, hardened by real
runs rather than by review — an intent has gone through the design loop
end to end and a released handoff has gone through construction and
landed, each as its session's end-to-end script narrates it. It ships from
`agentplot/flywheel`, which also carries the context map as a distributable
tool fed a map from outside itself, and enough of the book skills to do a
writeback in a repo that has never seen `books/CLAUDE.md`. The loop is
tested rather than asserted: a fast local eval, and a scripted end-to-end
run against a contrived data project.

## Map
The flywheel is process, not a system on the map — it moves no nodes. Its
governing artifacts:

- `books/aidlc-design/src/` — the chapters above; the destination record.
- `openspec/changes/add-flywheel-loops/` — the spec-driven change that
  built the schemas, the skills, the agent profiles, and the samples.
- `openspec/schemas/flywheel-*/` — the authoring contract that travels with
  every change, and now the loop logic too.
- `sessions/2026-08-06-e2e-design-loop/E2E-design-loop.md` and
  `sessions/2026-08-06-e2e-construction/E2E-construction.md` — the
  walkthrough in two halves, each the acceptance script for its own live
  run, each owned by the session that runs it.

## Scope
Blueprints is this intent's built repo. Its subject is the machinery
blueprints carries — skills, agent profiles, schema instructions,
conventions docs, plugins — so everything here that is not a book chapter
or a map move is construction and leaves through the operator's approval as
a handoff, exactly as it would for a kit repo.

In: the aidlc-design chapter rewrites and the two conventions changes
(`books/CLAUDE.md`, root `CLAUDE.md`); the schemas' artifact instructions
as live runs expose gaps, including the workflow text they now carry and
the split of `flywheel-bolt` into its family; the message envelopes; the
persona matrix and the persona-driven construction sequence; the two skills
and their agent profiles as the same runs harden them; packaging the pair
as the `flywheel` plugin and retiring the `openspec-construction` family it
supersedes; the flywheel's own eval and its scripted end-to-end run; and
the open questions below.

Out: the machinery `add-flywheel-loops` already landed — that change owns
its own remaining implementation and verification tasks, and this intent
does not duplicate them. Moon adoption in the kit repos, sequenced by
`research/kit-reorg-roadmap.md`. A custom monitoring dashboard. An audit
log (→ `decisions/no-audit-log.md`). Renaming the `spec-driven` schema.
