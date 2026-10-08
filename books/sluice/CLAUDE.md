# books/sluice: authoring rules

The source of truth is `design/sluice/requirements.md`, a statement of
invariants written to `design/requirements-style.md`. This book
includes it and never restates it.

- Chapters under `src/requirements/` are one heading and
  `{{#include}}` lines, nothing else. Fix a clause at its source.
- Anchors in the source are `<!-- ANCHOR: name -->` and
  `<!-- ANCHOR_END: name -->` pairs: `preamble`, `actors`,
  `glossary`, `part-a`, `part-b`, `part-c`, `invariants`,
  `non-goals`, `givens`, `questions`, `scenarios`, `deliver`.
- `src/index.md` is the only prose written fresh. Cite clauses by
  number in parentheses; never restate one. Plain prose, no em-dashes.
- The built repository's rules are its own `docs/architecture/`; they
  cite clauses of this statement by number as their source.

After any edit run `mdbook build` here and fix every unresolved include.
