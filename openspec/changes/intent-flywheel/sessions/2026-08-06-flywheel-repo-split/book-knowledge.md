# Moving the skill means moving the knowledge of what a book is

## The problem, precisely

`flywheel-writeback` is one of the seven skills that travel. Its whole job is
carrying a settled destination into the books and the context map, and it does
that by leaning on a file that stays:

> This type wraps a convention rather than a surface tool. `books/CLAUDE.md`
> is the authority on voice, layout, status semantics, and mermaid rules; read
> it before you write, and let it settle anything this skill does not say.

`books/CLAUDE.md` is 508 lines and is explicitly Willdan's — it opens by
naming the Willdan framework kits, enumerates eight books by name, defines
four tiers, and pins the commissioning chapter to Willdan's commissioning
plugin catalog. `flywheel-repo-manifest.md` keeps it, correctly.

So the skill arrives in `agentplot/flywheel` naming an authority the plugin
does not carry. In a repo that has its own `books/CLAUDE.md` this still works
by accident. In a repo that does not, the skill has no idea what a chapter is,
what destination voice means, or what "rewritten whole" is being contrasted
with — and it will invent all three.

## Recommendation

**A reference bundle owned by the writeback skill, plus a precedence rule.**

```
skills/writeback/
  SKILL.md
  references/book-conventions.md      ~250 lines, the repo-neutral half
```

`SKILL.md` reaches it as `${CLAUDE_PLUGIN_ROOT}/skills/writeback/references/book-conventions.md`,
and the sentence quoted above is replaced by a precedence rule:

> The consuming repo's `books/CLAUDE.md` is the authority on anything it
> states. Where it is silent — and in a repo that has none at all — the
> bundled `references/book-conventions.md` is the floor. Read the repo's file
> first if it exists, then the reference for whatever it did not settle.

Blueprints therefore changes nothing about how it authors books: its 508-line
file states more than the reference does and wins everywhere the two overlap.
A fresh repo gets a working writeback out of the box.

### Why a reference and not a skill of its own

The knowledge is consumed *during* a writeback, by a session that has already
loaded `flywheel:writeback` because its charge named the type. A second skill
would need a trigger description competing with the writeback skill's own, and
would leave the model deciding whether to load it — a failure mode bought for
nothing. A path named in prose loads deterministically.

The same argument answers "why not inline it in `SKILL.md`": the skill is
already 97 lines of loop practice, and 250 lines of book convention would make
the loop practice the minority of a file whose job is the loop.

### Why not depend on `system-design-inception`

It is a plugin in `WilldanGroup/willdan-marketplace`, and the flywheel cannot
take a dependency on a client catalog — the whole point of the move is that
the tool stops being a guest in a client repo. It is also a different job:
those skills scaffold and lint a suite (`book-suite-scaffold`,
`book-add-system`, `book-chapter-ready`), where a writeback session already
has a suite and needs to know how to write one chapter of it.

Poaching from it is right. Depending on it is not.

## What to poach, and from which file

Read on disk at `willdan-marketplace/main/plugins/system-design-inception/`.
Note it is mid-change — a bolt dropping its proposals-chapter lints has landed
— so the counts and cross-references below are what is there now.

### `references/books-CLAUDE.md.tmpl` — the strongest single source

445 lines, and already generic: it is a template with `{{SUITE_NAME}}`,
`{{LANDING_BOOK}}`, `{{BOOK_TREE}}` placeholders rather than Willdan content.
This is most of the deliverable. Take, in order:

- **Why these books exist** — the two jobs, and "Books describe destinations.
  OpenSpec changes describe moves toward destinations. Both refer back to the
  book; neither narrates the diff." That sentence is the whole idea.
- **The discovery rule** — `books/` holds only valid mdBooks; a directory
  without `book.toml` is not a book and breaks `mdbook build`; parked or
  superseded material lives outside the tree.
- **Book status** — the `STATUS` sidecar, the four values
  (`new` · `draft` · `active` · `archived`), and *why* it is a sidecar rather
  than a `book.toml` table (mdbook 0.5 rejects unknown top-level tables).
- **Per-book structure** — the file list a book ships with, and the two
  required chapters: contracts and verifications.
- **Writing rules** — current design only; rewrite in full when a section
  becomes wrong; diagrams are first-class.
- **Voice, entire** — the ban list in all six categories, plain language, the
  glossary rule, the voice cues, and the before/after pair. This is the part
  a writeback session cannot do without and cannot reconstruct.
- **Proposal pipeline, part (a) only** — the four-step general shape.

### `references/voice-rules.md` — the machine-checkable subset only

Its linting checklist is the useful part: ban-list scan, jargon scan, glossary
check, migration-framing scan, iteration-history scan, link shapes, mermaid
`classDef` coverage. Take them as *rules a writer applies*, not as a linter
specification — the flywheel is not shipping a linter in the first cut.

**Read this file knowing it has a hole.** Step 1 says "flag any whole-word
match against the lists above" and there are no lists above it; it cites a
"step 8" while listing seven. The bolt that dropped the proposals-chapter
lints appears to have taken the ban lists out with them. It is not a complete
source on its own; the complete ban list is in the `.tmpl` and in blueprints'
`books/CLAUDE.md`.

### `skills/book-chapter-ready/SKILL.md` — later, not now

324 lines: the eight-step checklist, output format, severity guidance,
chapter-type checks. A `flywheel:chapter-ready` equivalent is worth having and
is **not in the first cut**. The writeback loop functions without a linter,
and keeping the moved surface small is most of what makes the split land. File
it as a follow-on.

### What to reject outright

| piece | why |
|---|---|
| the commissioning chapter | bound to Willdan's commissioning-plugin catalog and its `satisfied-by` / `GAP` vocabulary |
| tiers and the `ROLE` sidecar | Willdan's four-tier taxonomy; blueprints even aliases a legacy `aidlc` value |
| the verifications **catalog** layer | `verify:smoke:*` ids as devenv tasks, `suite-smoke` / `suite-e2e` wrappers — that is the Willdan construction toolchain, not a book convention. Keep the *frame* layer (stages, fixtures, harnesses, docking, out-of-scope); drop the catalog |
| caddy, `:8443`, `books-up`, `build-index.py` | build wiring, per-repo |
| the `{{LANDING_BOOK}}` overview-sink rule | assumes a suite with a designated landing book and a PostToolUse hook |

## Two things to fix while poaching, not copy

### 1. The cross-book link rule in the plugin is wrong

`voice-rules.md` and `book-chapter-ready` step 6 both say:

> **Reject** if the path contains `../../` (two or more levels). Books are
> siblings — one `../` is correct.

That is false for any chapter nested below `src/`. mdBook strips `src/` and
preserves the directory structure beneath it, so link shape follows the *depth
of the page doing the linking*: a chapter directly in `src/` needs one `../`
to leave its book, and a chapter one directory down needs two. The plugin's
rule would reject correct links and accept broken ones.

Blueprints' `books/CLAUDE.md` carries the corrected rule with two worked
resolution tables and a table of the four failures it catches. **Poach that
version.** It also carries the three mermaid failures actually observed —
reserved words as participant ids, a `;` ending a statement mid-label,
unquoted parentheses in a label — which the plugin does not have at all.

### 2. The template violates its own ban list

`books-CLAUDE.md.tmpl` bans *seam* under undefined structural jargon, then
writes "That chapter is rewritten when seams shift, not each time a piece of
work lands" in its own Proposal-pipeline section. Strip it on the way in; the
sentence means "when the contracts shift".

## What is not book knowledge

The other half of a writeback is the context map — `map-check --write` green,
refs resolving, the map moved with the chapters. That knowledge belongs to the
tool, not to the book conventions, and ships as
`references/context-map-authoring.md` alongside it. See `context-map-tool.md`.

## The flywheel repo gets no `books/` of its own

Its docs are `README.md` and the Pages site, which is what was built this
session. The conventions ship for consuming repos. That has one consequence
for acceptance: the reference cannot be proved by using it here, so
`migration-plan.md` acceptance item 7 runs a writeback against a scratch repo
with no `books/CLAUDE.md` — the only arrangement that actually exercises the
floor.
