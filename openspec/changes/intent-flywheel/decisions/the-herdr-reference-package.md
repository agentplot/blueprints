# Decision: one shared herdr reference, and `conduct` retires

## Decision
The herdr invocation reference is **one file** at
`.claude/skills/_reference/herdr.md`, referenced by every skill that needs
it. Not copied into thirteen skills, and not inherited by assumption.

**`conduct` retires.** Its content is absorbed; nothing points at it.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md`
- Produced by: `sessions/2026-08-07-loop-layer/` decision 13, closing
  `questions/herdr-reference-and-conduct.md`

## Why neither copying nor inheriting
**Inheriting failed, measurably.** The reference was reachable from
`flywheel-inception`, which every session profile loads, and eight of
twelve flywheel sessions never loaded it. `bolt-flywheel-machinery` never
loaded it and ran 98 Agent-tool subagents against its rule 1, which forbids
exactly that. A rule reachable by a load nobody performs is not in force.

**Copying fails differently and later.** Thirteen copies of one file drift,
and the drift is silent because no check compares them — the same failure
mode as the map's topology vocabulary being written twice
(→ `assertions/map-topology-vocabulary.md`).

One file, referenced explicitly, is what neither buys: present at the point
of use, and single-sourced.

## Consequences
- `.claude/skills/_reference/` is a new location; the file moves once and
  every skill points at it.
- The `conduct` skill is deleted, and any reference to it is a defect.
- Each skill states which reference files it needs, rather than assuming a
  sibling skill loaded them.
