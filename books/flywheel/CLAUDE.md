# books/flywheel: authoring rules

This book is the design book for the flywheel. Its source of truth is
`design/flywheel-next/`, and the book's whole discipline is that it
includes that source rather than restating it.

## The one structural rule

**Part I and Part III are includes, never prose.** A chapter under
`src/fundamentals/` or `src/surfaces/` is one heading and one or more
`{{#include ../../../../design/flywheel-next/<file>:<anchor>}}` lines,
and nothing else. If a clause is wrong, fix it at its source and let the
build carry it through. Never copy clause text into a chapter, never
paraphrase a clause in Part I, and never let a chapter's heading
contradict the section it includes.

Anchors live in the source as `<!-- ANCHOR: name -->` and
`<!-- ANCHOR_END: name -->` comment pairs. `requirements.md` carries one
per Part A section (`a01` to `a39`), plus `preamble`, `actors`,
`glossary`, `part-b`, `part-c`, `invariants`, `non-goals`, `givens`,
`questions` and `scenarios`. `surfaces.md` carries one per top-level
section. `roadmap.md` carries one for the whole file. An anchor starts
after its heading line and ends before the next heading, so it never
cuts across a clause.

Adding a Part A section to the requirements means adding its anchor, a
chapter under `src/fundamentals/`, and a line in `src/SUMMARY.md`.

## Part II

Part II is the only place in this book where prose about the design is
written fresh. Rules for it:

- Cite clause numbers in parentheses, the way the sources do: `(75)`,
  `(A.14)`, `(I13)`. Cite rather than restate.
- Six to eight chapters, sixty to a hundred and fifty lines each. A
  chapter that outgrows that is two chapters.
- A mermaid diagram only where it shows a mechanism prose cannot. The
  book has a mermaid preprocessor; use ```` ```mermaid ```` fences.
- Plain prose. No em-dashes.

## Vocabulary

Section 3 of the requirements is this book's ubiquitous language, and
Part I includes it as the glossary chapter. Use its terms verbatim and
never redefine one in Part II.

## Boundaries

The models, the proposals and the roadmap live in
`design/flywheel-next/` and are pointed at from Part IV, not duplicated
into it. The model of record is
`design/flywheel-next/models/statechart/model.md`; its checker is what
holds the model and the requirements together.

## After any edit

Run `mdbook build` here and fix every unresolved include it reports. If
you touched an anchor in `design/flywheel-next/`, also run, from
`design/flywheel-next/models/statechart`:

```bash
uv run --with pyyaml --with jsonschema python3 machines/check.py
```

An anchor comment must never break the clause parser that check uses.
