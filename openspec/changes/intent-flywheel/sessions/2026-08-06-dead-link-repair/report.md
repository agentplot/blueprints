# Dead-link repair — writeback session report

Session type: writeback. Branch `sess/dead-link-repair`, cut from `a10964f`.

## Counts

Both measured by `python3 books/preview.py --check` from this worktree.
A count without a tree is ambiguous, so each is stated with its ref.

| | ref | dead links | files | links checked |
|---|---|---|---|---|
| before | `a10964f` (branch point) | 103 | 48 | 1957 |
| after | this branch's tip | 47 | 27 | 1957 |

**56 links repaired.** `links checked` is identical on both sides: no link
was added, deleted, or turned into prose. Every one of the 56 was
retargeted in place.

Gates, all green from this worktree:

```
python3 books/preview.py --check     ok — 8 books built, sidecars validated
node books/check-mermaid.mjs         ok — 224 diagrams parse
node context-map/bin/map-check.mjs   clean
```

The map moved not at all, and correctly so: no chapter changed path, so no
node `ref` changed meaning. The gate was run to confirm that, not to record
an edit.

## What was repaired, and the depth reasoning

Both classes are the same defect seen twice. A chapter one directory below
`src/` deploys at depth 1 — `books/rocs-kit/src/api/stations.md` is the page
`rocs-kit/api/stations.md` — but its links were written as if the page sat
at depth 0. Every repair adds exactly one `../`. Nothing else changed.

### Class A — cross-book, `../` → `../../` (40 links)

From a depth-1 page, `../` reaches the book root, not the site root. So
`../atlas-kit/stations.md` from `rocs-kit/api/stations.md` resolved to
`rocs-kit/atlas-kit/stations.md`, which is nothing. Leaving the book takes
two `../` at depth 1.

| file | links | target |
|---|---|---|
| `rocs-kit/src/state/station-definitions.md` | 6 | `../../atlas-kit/index.md` |
| `rocs-kit/src/api/stations.md` | 6 | `../../atlas-kit/{index,stations}.md` |
| `rocs-kit/src/knowledge/station-manifests.md` | 3 | `../../atlas-kit/{index,stations}.md` |
| `rocs-kit/src/knowledge/knowledge-model.md` | 3 | `../../atlas-kit/{index,stations}.md` |
| `cortex-kit/src/lakehouse-reference/knowledge-graph-substacks.md` | 4 | `../../rocs-kit/knowledge/*.md` |
| `rocs-kit/src/cli/{cli,leasing,state-machine}.md` | 4 | `../../overview/vocabulary.md` |
| `atlas-kit/src/pipelines/{composition,lineage-flows,extrapolate-h3-cross-level}.md` | 4 | `../../{cortex-kit,rocs-kit}/…` |
| `cortex-kit/src/lakehouse-reference/lakehouse-stack.md` | 2 | `../../rocs-kit/…` |
| `rocs-kit/src/conductor/{coverage,scheduling-and-cascade}.md` | 2 | `../../overview/vocabulary.md` |
| `rocs-kit/src/state/{dynamo-tables,run-configs,scenarios,station-pipeline}.md` | 4 | `../../atlas-kit/index.md` |
| `rocs-kit/src/knowledge/{kb-access,role-registry}.md` | 2 | `../../atlas-kit/…` |

### Class B — same-book, `<page>.md` → `../<page>.md` (16 links)

Same-book links are relative to the linking page, not to `src/`. A bare
`verification.md` from `rocs-kit/knowledge/alternate-backends.md` means a
sibling *inside* `knowledge/`; the chapter meant is at the book root, one
level up.

| target after repair | links | in |
|---|---|---|
| `../verification.md` | 9 | `atlas-kit/src/{integrations,lakehouse,pipelines}/`, `rocs-kit/src/{cli,knowledge,state}/` |
| `../contracts.md` | 7 | `atlas-kit/src/integrations/`, `rocs-kit/src/{api,knowledge}/` |

## How each repair was verified

Not by pattern substitution. Three independent passes:

1. The repair set was derived by importing `preview.py`'s own
   `resolve_link` — the same function the gate uses — and keeping only
   links where prepending one `../` resolves to a file that `is_file()`
   on disk. A link that stayed dead under that test was never edited.
2. The rewrite asserted on every line that the exact `](<target>` occurrence
   was present before substituting. The assert fired once, on
   `[Verification](verification.md#smoke)` in `atlas-kit/src/pipelines/variants.md`
   — an anchored link the naive matcher would have skipped silently. The
   matcher was made anchor-aware; all anchors are preserved.
3. Every book was then built with `mdbook` into a deployed-layout scratch
   site, and all 56 changed links were resolved as `.html` against that
   tree. **56/56 land on a real built page.** This is the check that
   matters: the gate resolves against source files, the browser resolves
   against the built site, and only the third pass tests the latter.

## What I left, and why

47 dead links remain. None is a depth error.

**19 — `../rocs-kit/{cli,api,knowledge}/index.md`**, all from depth-0
`atlas-kit` pages, so the shape is already right. `rocs-kit` has those three
directories and none has an `index.md`. One decision — do rocs-kit's section
directories get index pages? — clears all 19. This is the highest-leverage
remaining item by a wide margin.

**12 — `../willdan-ref-lakehouse/…`**, a retired book. Out of scope per
charge.

**2 — `commissioning-template/src/seams-to-construction.md`** links
`../hil-gateway/index.md` and `../phase-workflows/verifications.md`. Neither
book exists in this repo, and neither resembles a renamed one. These read
as inherited from the suite the template was copied out of.

**5 — target exists nowhere**: `auth.md`, `control-plane-substacks.md`,
`zuplo.md` ×2, `snapshot-args.md`. A page gets written or the link gets
repointed.

**5 — target exists, but in another book.** `cortex-kit`'s
`lakehouse-stack.md` links bare `warehouse-modules.md` and `bucket-access.md`
×2, which live in `atlas-kit/src/lakehouse/`; `atlas-kit`'s `catalog-data.md`
links bare `lakehouse-stack.md`, which lives in `cortex-kit`. Adding `../`
would not fix these — they are cross-book links written as same-book ones,
and which book owns the chapter is a design question. Left deliberately.

**1 — `../atlas-pipelines/catalog.md`** from `rocs-kit/src/conductor/coverage.md`.
No `atlas-pipelines` book exists, and `catalog.md` exists at *three* paths
under `atlas-kit/src/`. Exactly the guess worth not making.

**3 — bare names from a depth-0 page**, in `rocs-kit/src/verification.md`:
`harnesses.md`, `kb-provider-interface.md`, `alternate-backends.md`. See
finding 2.

**1 — `SUMMARY.md`.** See finding 1. Repairing it would have been actively
wrong.

## Findings

**1. `preview.py` will accept a link to `SUMMARY.md` that 404s in a browser.**
`atlas-kit/src/pipelines/authoring.md:115` links bare `SUMMARY.md` in an
authoring checklist. Prepending `../` fits both mechanical classes, and the
gate would have gone green: `books/atlas-kit/src/SUMMARY.md` is a real file
and the checker resolves against source files. But mdbook never deploys
`SUMMARY.html` — it becomes the sidebar. So the "repair" lowers the dead-link
count while leaving the reader a 404, which is the ratchet being gamed by an
edit that looks exactly like the other 56.

`SUMMARY.md` is the one source `.md` that is never a page, so this is a
one-line soundness fix in `resolve_link` — treat a target whose basename is
`SUMMARY.md` as dead. **Construction, in `books/preview.py`. Handoff, and
small enough for a one-proposal bolt.** The chapter's own line then wants
the same treatment its neighbour already gets one line below: `` `STATUS` ``
is inline code, not a link, because it too names a source file rather than a
page. I left the chapter alone — it is a prose judgement, not a link repair.

**2. A third mechanical class exists that the charge did not name.**
`rocs-kit/src/verification.md` is depth 0 and links three bare names whose
chapters sit in subdirectories: `harnesses.md` → `conductor/harnesses.md`,
`kb-provider-interface.md` → `knowledge/kb-provider-interface.md`,
`alternate-backends.md` → `knowledge/alternate-backends.md`. Each basename
occurs exactly once in the whole book, so each fix is a unique match rather
than a choice. But the fix is not a depth rule — it is "which directory did
this chapter end up in" — so it fell outside my scope and I left all three.
Cheap and safe as a follow-up batch.

**3. The gate reports a count but the count alone cannot see an exchange.**
Nothing to fix — `check_links` already prints every dead link by file, line
and target on passing runs precisely so a swap shows in the report diff, and
its docstring says so. Worth recording that this session exercised that
property: the 103 → 47 drop and the constant `1957 checked` together are what
let me claim retargeting rather than deletion, and neither number alone would
have.

**4. `commissioning-template` carries links to two books that never existed
here** (`hil-gateway`, `phase-workflows`). If the template is meant to be
copied into target repos, it ships those dead links to every repo scaffolded
from it. Worth deciding before the next repo is scaffolded, not after.

## For the conductor

- Nothing to check off — this batch had no `tasks.md` line of its own that I
  can see; the work came in as a charge.
- **Append a Handoff task** for finding 1: `books/preview.py` should refuse
  `SUMMARY.md` as a link target. One-proposal bolt.
- **Append a Writeback task** for finding 2: the three depth-0 bare names in
  `rocs-kit/src/verification.md`.
- **Append a decision** for the 19 `rocs-kit/{cli,api,knowledge}/index.md`
  links — do section directories get index pages? One answer, 19 links.
- Suggested next batch: the index-page decision, since it is the only
  remaining item where one ruling moves a large block.

Nothing was refused as construction — the charge named only book chapters,
and `books/CLAUDE.md`, the per-book `CLAUDE.md` files and `BUILDOUT_PROMPT.md`
were left untouched as instructed. No plannotator round was opened; writeback
opens none.
