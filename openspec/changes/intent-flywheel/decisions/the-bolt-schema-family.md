# Decision: four bolt schemas, and the `opsx` infix goes

## Decision
`flywheel-bolt` becomes a family of **three schemas plus one absence**. A bolt binds the member
matching its work, and the member's `apply.instruction` is what drives its
loop (→ `decisions/dynamic-workflows-drive-the-loop.md`).

| schema | what its prompt schedules | picked when |
|---|---|---|
| `bolt-default` | agent proposal-review, adversarial code-review, acceptance | normal work touching code others read |
| `bolt-quick` | no review step scheduled | small and mechanical; a wrong claim is cheap to catch |
| `bolt-deep` | persona read before the build, adversarial and human review after, smell check, personas exercise it | it has users who are not the author |
| `bolt-no-spec` | **not a schema.** Claude Code plan mode replaces the spec step; no change, no artifacts, no `opsx` | the handoff arrived already specified |

**Depth is chosen once, by picking a name**, and never argued per proposal.
That is the whole reason the family exists: "how much review" was a prose
rule that needed correcting three times.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/spec-driven-construction.md`
- Produced by: `sessions/2026-08-07-loop-layer/` — decisions 3 and 4

## Why four and not five
The proposed set had `bolt-opsx-chore` and `bolt-opsx-fast` as separate
members. They differed on two rows, and on both the difference was "no"
versus "may" — which is latitude every member already has under
`decisions/bolt-conductor-latitude.md`. Two schemas that differ only in how
much permission they grant are one schema. They merge as `bolt-quick`.

The `opsx` infix is dropped throughout: it named the tool rather than the
work, and `bolt-no-spec` is named for what it bypasses.

## Consequences
- `decisions/three-schemas.md` counts six — `flywheel-intent`, the four
  bolt members, and `spec-driven`.
- Artifact instructions are shared across the four; only
  `apply.instruction` differs.
- `bolt-no-spec` is the planned-tasks conductor's schema
  (→ `decisions/the-planned-tasks-conductor.md`).
- `openspec/config.yaml` keeps `spec-driven` as the project default.
