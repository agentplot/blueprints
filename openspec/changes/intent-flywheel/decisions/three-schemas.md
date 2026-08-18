# Decision: OpenSpec is the foundation, as one schema family

## Decision
Both loops are OpenSpec changes in one hierarchy. An **intent**
(`flywheel-intent`) tracks design on blueprints main. A **bolt** tracks one
delivery to main, also on blueprints main, binding whichever of
`bolt-default`, `bolt-quick`, `bolt-deep` or `bolt-no-spec` matches the work
(`decisions/the-bolt-schema-family.md`). The code work runs in each built
repo as ordinary **spec-driven** changes.

The enumeration, stated here once and copied from here: **`flywheel-intent`,
the four bolt schemas, and `spec-driven`.**

A per-change `.openspec.yaml` binds the schema (`skip_specs: true` on the
flywheel ones); `openspec/config.yaml` keeps `spec-driven` as the project
default, so all of them coexist in one changes tree with task progress on
every kind. Archival is the same motion throughout: closing an intent or a
bolt archives its whole record as one unit.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md` (to be rewritten)
- Produced by: `sessions/2026-08-05-loop-pivot/loop-pivot-design.html`;
  designed in `openspec/changes/add-flywheel-loops/design.md`; the bolt
  family added on the operator's structured feedback of 2026-08-07

## Consequences
- Landed in `add-flywheel-loops`: the first two schemas, the sample intent
  `rocs-record-split`, the sample bolt `bolt-rocs-records`.
- Appended writeback task: the actor-model rewrite of `conducting.md` and
  `authoring-capabilities.md`, which state the hierarchy.
- Question surfaced here, since closed: whether a lone generated proposal
  skips the bolt entirely → `decisions/every-handoff-is-a-bolt.md`. With
  the family in place it does not skip the bolt; it binds a lighter member.
- The schema is where a change's loop logic lives, not only its artifact
  list → `decisions/dynamic-workflows-drive-the-loop.md`.
