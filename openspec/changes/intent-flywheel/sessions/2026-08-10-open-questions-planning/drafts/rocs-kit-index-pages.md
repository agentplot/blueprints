# Draft decision: no section index pages — the 19 links retarget to the section heads

Closes `questions/rocs-kit-index-pages.md`.

## Decision (proposed)

rocs-kit's section directories get **no index pages**. The 19 dead links
retarget in place to the chapters that already head those sections in
`SUMMARY.md`:

| dead target | links | retarget to |
|---|---|---|
| `rocs-kit/cli/index.md` | 8 | `rocs-kit/cli/state-machine.md` ("The CLI state machine") |
| `rocs-kit/api/index.md` | 8 | `rocs-kit/api/endpoints.md` ("The control-plane API") |
| `rocs-kit/knowledge/index.md` | 3 | `rocs-kit/knowledge/knowledge-model.md` ("The knowledge graph") |

All 19 sit in eight atlas-kit chapters (measured on this branch, tip of
`sess/` cut from main `a7911ad6`): `index.md`, `stations.md`, `cli.md`,
`resolution.md`, `sdk.md`, `snapshot-schema.md`, `observability.md`,
`verification.md`.

## Why

- **No book in the suite has a per-directory index page.** Measured
  across the four kit books: each has exactly one `src/index.md` at the
  book root, and every `SUMMARY.md` section is headed by a real chapter
  — rocs-kit's own sidebar already presents `cli/state-machine.md`,
  `api/endpoints.md` and `knowledge/knowledge-model.md` as the parents
  of their sections. The 19 links were written assuming a convention
  that never existed anywhere.
- Writing three index pages would invent that convention for one book,
  require three new `SUMMARY.md` entries, and produce thin pages whose
  content the section heads already carry — most of the 19 links are
  `[rocs-cli](…)`, and "The CLI state machine" is the chapter that
  answers them.
- Retargeting in place is the practice the dead-link session already
  established: 56 links repaired by retarget, zero added or deleted, the
  `links checked` count constant as the proof of it.

## The alternative, and why not

Write `index.md` in each of the three directories. Rejected as a
convention invented for one book to satisfy links written in error; it
also adds three pages to keep truthful forever for a one-time repair. If
a real overview page for a section ever earns its place, it arrives as a
chapter with content, on its own merits — not as a link target.

## Consequences

- A **writeback task**: retarget the 19 links across the eight atlas-kit
  chapters. Mechanical — each retarget keeps the link's own depth and
  anchor — and it clears the largest remaining block of dead links (19
  of 47 measured at the dead-link session's tip).
- The books gate's dead-link ceiling is derived from the merge target,
  so the ceiling drops for every branch once this lands.
- `questions/rocs-kit-index-pages.md` flips to closed.
