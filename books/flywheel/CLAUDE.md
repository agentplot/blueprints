# books/flywheel — authoring rules

This book is the destination design for the flywheel, the work-loop
machinery built at `agentplot/flywheel`. The suite-wide rules in
`books/CLAUDE.md` govern everything here; this file adds the
per-system flavor.

## The one structural rule

The backlog is computed, never stored. This book carries no proposals
chapter, no roadmap, no work list of any kind: the bolt planner
derives construction work from the difference between this book and
the flywheel repo's `openspec/specs/`. If a chapter is tempted to
enumerate future work, the chapter is describing the destination
badly — rewrite it to state the destination and let the planner find
the gap.

## Vocabulary

`src/glossary.md` is the book's ubiquitous language. Use its terms
verbatim; never paraphrase a defined term. New terms earn a glossary
entry only when no DDD name and no plain technical word covers them.
"Assertion", "handoff", "conductor", and "andon" are retired
vocabulary and appear nowhere in this book.

## Boundaries

Adjacent systems appear as named contracts, never as duplicated
internals:

- **GitHub tracker** — the published language in
  `src/tracker-protocol.md`; label taxonomy and Project fields are
  this book's contract.
- **OpenSpec** — schemas and the `loop:` block in `src/schemas.md`;
  OpenSpec's own behavior belongs to its docs.
- **herdr / worktrunk** — session hosting and merge gates; named where
  used, designed elsewhere.
- **Design books** — the corpus protocol (chapter refs, sidecars)
  belongs to the suite; this book only states that the planner reads
  it.

## Sources

The machinery's implementation is the flywheel repo: `bin/` for the
loop programs and server, `agents/` for session profiles, `tests/`
for the verification stages, `design/` for decision drafts not yet
synthesized here. When this book and the repo disagree, the book
states the destination and the gap is the backlog — do not "correct"
the book to match the code.
