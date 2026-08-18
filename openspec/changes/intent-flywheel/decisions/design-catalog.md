# Decision: design output is catalogued, never copied

## Decision
An intent's `design.md` is the catalog of what its design work produced —
one row per session report and per prototype finding, carrying the date, the
path, the session it came from, the decisions it closed, and the tasks it was
working. It is the design-side sibling of a bolt's `proposals.md` registry
and the one reading surface for design output. Nothing is stored twice: a
report lives inside its session's directory and a prototype finding lives at
`prototypes/<slug>.md`, and promoting either one means the conductor adding
its row to the catalog. Every report belongs to a session, so a one-shot
report gets its own small session directory rather than living loose, and
there is no `design/` directory at all.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md` (to be rewritten)
- Produced by: the plannotator round on this intent — the operator asked what
  separated `design/` from `sessions/`, and the honest answer was that the
  directory held copies of things the session already owned

## Consequences
- Schema changed: the `design` artifact generates `design.md` from a catalog
  template; the `sessions` and `prototypes` instructions name the row as the
  act of promotion.
- The three existing intents converted: `rocs-record-split`'s report gained
  the retroactive session that produced it, `spike-context-cleanup`'s
  inventory likewise, and both intents plus this one now carry `design.md`.
- Prototype findings are design output like reports are, so they appear in
  the catalog while keeping `prototypes/` as their own artifact.
- Appended writeback task: `conducting.md` describes the catalog and the
  storage rule behind it.
