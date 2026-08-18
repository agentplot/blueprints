# Decision: the book describes the practice, the skill file describes the skill

## Decision
`system-design-inception.md` and `openspec-construction.md` leave
`books/aidlc-design`, and no chapter restates a skill's flags, its
consumes and produces, or its bar again. What was practice is placed. The
opsx artifact sequence and the binding-checklist mapping go into
`spec-driven-construction.md`, which is rebuilt around the pipeline stages,
and the orchestration that chapter described is the bolt loop rather than a
separate family of skills. The book skills become one-line capabilities in
`authoring-capabilities.md`, each naming what it is for and pointing at its
skill file. The commissioning-inception half moves to `commissioning.md`,
which already owns that seam. `SUMMARY.md` loses its "Plugins & skills"
section entirely, `catalog.md` and `agent-workspaces-plugin.md` going with
it.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/` — the chapter set itself
- Produced by: `sessions/2026-08-06-chapters-and-channels/decisions.html` —
  the operator took the absorb-the-practice option, and his annotation on
  the retiring construction plugins says the same thing from the other
  side: the skills those chapters documented are going away, so a chapter
  documenting them has nothing left to describe.

## Consequences
- Unblocks both blocked writeback tasks — the `conducting.md` /
  `authoring-capabilities.md` rewrite and the chapter-set retirement.
- `SUMMARY.md`, `vocabulary.md`, `walkthrough.md`, and `index.md` follow
  the deletions.
- `spec-driven-construction.md` carries the opsx sequence and the binding
  checklist alongside the actor-and-branching figure.
- `commissioning.md` carries the commissioning-inception skills as
  capabilities.
- Pairs with the proposals-chapter retirement: whatever becomes of
  `book-decompose` is written into `authoring-capabilities.md`, not into a
  chapter being deleted → decisions/proposals-chapter-retires.md.
- Standing rule for every future chapter: a book names a capability and
  what it is for; the skill file is the reference.
