# books/headwater: authoring rules

The statement is `design/headwater/requirements.md`, written to
`design/requirements-style.md`. This book includes it and never
restates it. Write to `books/VOICE.md`.

- Pages under `src/appendix/` are one heading and `{{#include}}`
  lines, nothing else. Fix a clause at its source.
- Anchors in the statement are `<!-- ANCHOR: name -->` and
  `<!-- ANCHOR_END: name -->` pairs: `preamble`, `actors`, `glossary`,
  `part-a`, `part-b`, `part-c`, `invariants`, `non-goals`, `givens`,
  `questions`, `scenarios`, `deliver`.
- A chapter states only what the statement settles, and what
  `design/capture/design.md` sets for headwater's place in the family.
  What the operator has not ruled goes in `src/open.md`, grouped by the
  chapter it would change.
- The statement's words are the book's words: a **source**, never a
  lookup, until the ruling on question 33 lands in the statement.
- millpond's book owns the capture contract, the inbox and curation.
  Link to it at `../millpond/`; never restate it.
- sounding's book owns a sounding, its question and its conclusion.
  Link to it at `../sounding/`; never restate it.
- Some of what the capture design settles for headwater is not in the
  statement yet: the range, the package managers, a brief's command and
  diff. A chapter writes each as the capture design's, which the
  statement takes at plan step H1, and `src/open.md` lists it under its
  chapter.
- Figures are inline SVG inside one `<figure class="hw">` with no blank
  line in it, drawn with the classes in `headwater.css`, which follow
  mdBook's light and dark themes. One figure per claim, each with a
  caption and an `aria-label` that says what it shows.

After any edit, from the repository root: `devenv shell -- vale
books/headwater` and `devenv shell -- mdbook build books/headwater`.
