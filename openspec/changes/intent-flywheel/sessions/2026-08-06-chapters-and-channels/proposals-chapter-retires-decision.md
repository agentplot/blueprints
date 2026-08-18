# Decision: the loops hold the build list; the books' proposals chapter retires

## Decision
`books/CLAUDE.md` no longer requires a `src/proposals.md` chapter of any
book. What is ready to build is an intent's Handoff tasks; what is being
built is a bolt's `proposals.md` registry. The chapter goes, the
scaffolding skills stop creating it, `book-chapter-ready` stops linting its
entry shape, and `book-coherence-audit` stops emitting
`unmineable-proposal`. The construction plugins built on it retire with
it — `openspec-construction` and its marketplace siblings are superseded by
the bolt loop rather than repointed at a new source. Decomposition starts
from the settled slice coming out of an intent, not from sweeping a book
each time a bolt opens.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/CLAUDE.md`, and the book skills it governs
- Produced by: `sessions/2026-08-06-chapters-and-channels/decisions.html` —
  the operator took the retire option, annotated the propose skill's row
  with "given the direction of Flywheel, the openspec skills, plugins in
  the marketplace just go away entirely", and noted "when we're making a
  bolt, we don't want to decompose everything in a book each time. It's
  really just the ideas coming out of the intent."

## Consequences
- `books/CLAUDE.md`: the per-book structure section drops the requirement,
  and the "Proposal pipeline (book → OpenSpec)" section is rewritten as the
  flywheel path — chapter to intent to handoff to bolt.
- Skills: `book-suite-scaffold` and `book-add-system` stop creating the
  chapter; `book-chapter-ready` drops the proposals lints; both
  `book-coherence-audit` and its `book-coherence-reviewer` agent drop the
  finding type.
- The `openspec-construction` plugin family retires as superseded → task,
  and a constraint on the marketplace handoff: the flywheel plugin replaces
  it rather than shipping beside it.
- The existing `src/proposals.md` chapters in the kit books retire with
  their own books' edits; aidlc-design's own chapter goes with the
  chapter-set rewrite → decisions/plugin-chapters-fold.md.
- Two things the operator left open → new questions. What becomes of
  `book-decompose` now that decomposition begins at an intent's settled
  slice rather than a chapter list. And whether the verification docking
  declaration — which fixtures a unit reuses, which it adds, which
  harnesses it extends — binds to an individual proposal or to the bolt as
  a whole: "Agreed, but I don't know if it needs to be tied directly to the
  proposal or to the bolt overall."
