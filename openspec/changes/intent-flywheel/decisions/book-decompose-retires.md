# Decision: book-decompose retires with the chapter it mined

## Decision
`book-decompose` is not retargeted. It retires with the `proposals.md`
chapter it swept and with the rest of the `openspec-construction` family.
Nothing replaces it, because nothing is left for it to do: decomposition
now starts from an intent's settled slice, and that slice is already
written down as the intent's Handoff tasks. A bolt's spec agents work from
those tasks and the design sources they cite. A skill whose job was to read
a whole book and emit a build list has no input and no output in the
flywheel.

`authoring-capabilities.md` therefore lists no decomposition capability at
all, rather than a repointed one.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/authoring-capabilities.md`, which per
  `decisions/plugin-chapters-fold.md` is where this outcome lands
- Produced by: the operator's annotations in
  `sessions/2026-08-06-chapters-and-channels/decisions.html`, read
  together: "when we're making a bolt, we don't want to decompose
  everything in a book each time. It's really just the ideas coming out of
  the intent", and "given the direction of Flywheel, the openspec skills,
  plugins in the marketplace just go away entirely". Confirmed directly
  when he noted he had already answered it.
- Both `proposals-chapter-retires.md` and `plugin-chapters-fold.md` left
  this as a new question. The answer was in the annotations that produced
  them; retarget-or-retire had only one live branch once the chapter, the
  lints, and the plugin family were all going.

## Consequences
- The `openspec-construction` retirement task covers `book-decompose`; no
  separate proposal is needed and none is added. **Where it lives is not
  where this sentence implies.** `book-decompose` is at
  `plugins/system-design-inception/skills/book-decompose/` — inside a
  plugin the retirement must *not* take, since
  `decisions/plugin-chapters-fold.md` retires that plugin's *chapter*, not
  the plugin. So the retirement proposal reaches in for the one skill and
  leaves the plugin standing, with a test asserting that both
  `system-design-inception` and `book-decompose-commissioning` survive.
  The intent of this record was always right; only its implied location
  was wrong, and the next reader trusting it would look in the retiring
  family and not find it.
- `authoring-capabilities.md` gains no row for it. The book names the
  capabilities that exist.
- Closes the Design task without a session. Every other book skill keeps
  its capability row and is unaffected beyond the proposals-lint edits
  already tasked: `book-suite-scaffold`, `book-add-system`,
  `book-chapter-ready`, `book-coherence-audit`, `book-architect`,
  `book-seam-audit`, and `book-decompose-commissioning` — seven, not the
  four this record first named. The standing rule is that the book lists
  the capabilities that exist, so the enumeration was never meant to be
  exclusive.
- Rests on `decisions/proposals-chapter-retires.md`.
