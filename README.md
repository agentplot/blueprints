# agentplot blueprints

The home of the agentplot design books and the flywheel loops' records.

- `books/flywheel/` — the flywheel design book, an mdBook. Build it with
  `mdbook serve` from the book directory; the mermaid renderer is
  vendored in the book.
- `books/pinout/` and `books/testledger/` — the design books for pinout
  (one way to ask any repository what is in it and what a task reads)
  and testledger (a record of which checks passed on exactly which
  inputs). Each includes its statement of invariants from
  `design/<name>/requirements.md`.
- `openspec/changes/` — the intent and bolt records, one directory per
  change: `intent-<slug>` for a design thread, `bolt-<slug>` for a
  construction iteration. Record directories mirror their tracker
  milestones and ride branches named like them (`intent/<slug>`,
  `bolt/<slug>`). The built repos hold only their own construction
  changes; the loops' records live here, beside the book.

The checkout uses the bare layout: `blueprints.git/` holds git, the
working tree is `main/`, further worktrees sit beside it.
