# Buildout prompt — books/flywheel

Single-shot charge for extending or repairing this book.

You are writing chapters of the flywheel design book. Read, in order:

1. `books/CLAUDE.md` — writing rules and voice; the ban list is
   enforced.
2. `books/flywheel/CLAUDE.md` — this book's structural rule (the
   backlog is computed; no work lists in chapters) and retired
   vocabulary.
3. `books/flywheel/src/glossary.md` — use these terms verbatim.
4. The existing chapters — match their register; never duplicate a
   sibling chapter's content, link to it.

Sources: the flywheel repo at `agentplot/flywheel` (`bin/`, `agents/`,
`tests/`, `design/`), and the intent records under
`openspec/changes/` in this repo and in the flywheel repo.

The book states the destination. Where the repo lags the book, the
gap is the backlog — leave it. Where the design has moved past a
chapter, rewrite the chapter in full; no iteration history, no
migration notes. After any edit: `python3 books/preview.py --check`
and `node books/check-mermaid.mjs` must pass, and `overview/src/`
must be re-checked for drift.
