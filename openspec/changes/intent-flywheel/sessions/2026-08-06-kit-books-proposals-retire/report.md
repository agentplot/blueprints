# Writeback: the kit books' proposals chapter retires

Task: retire `src/proposals.md` from the six books that carried one.
Decision behind it: `decisions/proposals-chapter-retires.md`.
Commit: `a558872` on `sess/kit-books-proposals-retire`.

## Outcome

All six books done. Nothing stopped. 3,117 chapter lines deleted, 47
references repaired across 33 chapters, all three gates green.

| Book | Chapter | SUMMARY | Refs repaired | Cost |
|---|---|---|---|---|
| atlas-kit | 1041 lines | 1 line | 20 (4 top-level, 16 nested) | largest — 16 nested sites, each a distinct sentence |
| rocs-kit | 1544 lines | 1 line | 16 (all top-level) | uniform phrasing, one substitution |
| cortex-kit | 138 lines | 1 line | 8 (5 top-level, 3 nested) | one prose rewrite (`commissioning.md`) |
| commissioning-template | 331 lines | 1 line | 7 | one structural rewrite (below) |
| geo-iq | 32 lines | 1 line | 0 | trivial |
| gvc-kit | 31 lines | 1 line | 0 | trivial |

## The rule I repaired links by

Not `books/CLAUDE.md`'s flat-book link rule. I resolved every link
against the deployed layout — mdbook renders `src/<dir>/<page>.md` to
`<book>/<dir>/<page>.html`, and books deploy as siblings under one site
root — then verified each one on disk in `_site/`.

That rule immediately exposed the guide's error: **20 of the 47
references were already dead before I touched them.** Every nested
chapter in `atlas-kit/src/integrations/`, `lakehouse/`, `pipelines/` and
`cortex-kit/src/lakehouse-reference/` linked a bare `proposals.md`, which
from a page one directory below `src/` resolves to
`<book>/<dir>/proposals.html` — a file that never existed. The flat-book
rule produced them. They are gone now because their target is gone.

Three substitution shapes, chosen by what the sentence was doing:

1. **A proposal's *location*** — "a proposal in `[Proposals](proposals.md)`
   ships its own assertion-level tests" → "a proposal in a bolt's
   registry ships…". 26 sites. This matches
   `books/aidlc-design/src/verifications.md`, which already lives without
   a proposals chapter and says "Each proposal in a
   [bolt's](spec-driven-construction.md) registry declares…". I used that
   chapter as the exemplar throughout rather than inventing phrasing.
2. **A pointer worth keeping** — 6 sites get one cross-book link,
   `../aidlc-design/spec-driven-construction.md`, placed once per book at
   the verification frame or the index nav row. Verified rendered:
   every one emits `href="../aidlc-design/spec-driven-construction.html"`
   and `_site/aidlc-design/spec-driven-construction.html` exists.
3. **A dead pointer with a live name** — "(proposal `add-spatial-allocator`
   in [Proposals](proposals.md))" → "(proposal `add-spatial-allocator`)".
   15 sites. The proposal name survives as a name; only the registry
   pointer dies.

**No new nested cross-book links.** Every nested site took shape 3, so
nothing in this change needs `../../` and nothing depends on the
in-flight link-rule correction.

### Dead-link count

The metric you flagged, measured on the built site:

| | dead relative links |
|---|---|
| before | 493 |
| **removed by this change** | **263** |
| remaining | 230 (atlas-kit 64, rocs-kit 134, cortex-kit 22, commissioning-template 10) |

263 = 243 inside the deleted pages (their `Scope:` links were mostly
stale flat paths for chapters that had since moved into subdirectories)
+ 20 inbound. Zero dead links anywhere in the site now contain
"proposals". The remaining 230 are pre-existing and untouched by me.

## Where it needed more than link repair

Three places. All resolved without inventing design.

**`cortex-kit/src/commissioning.md`** opened by defining itself as "the
construction-facing sibling of [proposals](proposals.md)" — the whole
sentence was a definition by reference to the dead chapter. Rewritten to
define itself directly: commissioning is the standing floor, what gets
built on it is an intent's handoff.

**`commissioning-template/src/verifications.md`** carried the coupling
worth knowing about: its catalog has 26 rows with an `introduced-by:
<proposal-name>` field, and a paragraph stating each proposal carries a
`Verifications gate:` field. `introduced-by` stays exactly as-is —
aidlc-design keeps its five and they name proposals fine without a
registry. The gate paragraph now says the field lives on the bolt
registry row, which is the same field on the same object.

**`commissioning-template/src/commissioning-book-shape.md`** had a
"Cross-cutting trio" section whose point was that a per-project book,
unlike a system book, carries no `proposals.md`. The contrast is gone now
that no book does. Rewritten to state the fact positively.

## Findings

**1. The stranded reference-lakehouse proposals — needs a decision, not a
writeback.** atlas-kit's chapter ended with ~220 lines inherited from the
retired `willdan-ref-lakehouse` book. Those chapters folded into
`cortex-kit/src/lakehouse-reference/`; their proposal entries did not
follow, and they cite chapters absent from atlas-kit entirely
(`control-plane-substacks.md`, `knowledge-graph-substacks.md`,
`lakehouse-stack.md`, `publish-and-deploy.md`, `oidc-provider.md`). Most
is covered by rocs-kit, but roughly 60 lines are not covered anywhere:
CDK app directory names (`cdk/control-plane-tables/` etc.), Neptune
cluster parameters, a 7-day staging-bucket TTL, a GH-Actions dispatcher
deploy shape, and an OIDC thumbprint chore.

I preserved it verbatim at
`stranded-reference-lakehouse-proposals.md` in this session directory
rather than rehoming it. Rehoming means writing into
`cortex-kit/src/lakehouse-reference/`, which is **intent-kit-lift's
territory** — that intent is live on those exact chapters, so this is
theirs to absorb or drop, not mine. Corroboration that the material is
real: three cortex-kit chapters name these candidates and hold no shape
for them, e.g. `lakehouse-stack.md` says per-warehouse EventBridge
opt-in "is a proposal candidate" and the shape lived only in the deleted
atlas-kit block. Recommend routing to intent-kit-lift.

**2. Two verification IDs existed only in the deleted chapter.**
`verify:smoke:spike-workspace-mcp-wired` and
`verify:e2e:spike-probe-roundtrip` were declared by
commissioning-template's `scaffold-spike-commissioning-plugin` entry and
never landed as rows in `verifications.md`'s catalog — which is supposed
to be the complete named set. The gap predates the retirement; deletion
only makes it visible. I did not invent catalog rows, partly because
cortex-kit's own text says spike-commissioning's automated writeback
machinery is retired, so whether these IDs should exist at all is open.
Preserved at `commissioning-template-orphans.md`. That entry also had no
chapter in the book, while `plugin-set.md` catalogs a
`zuplo-commissioning` plugin that had no proposal — the plugin set and
the proposals list disagreed in both directions.

**3. The guide layer still mandates the chapter I deleted, and this will
regenerate it.** `books/CLAUDE.md:150` ("Every system book MUST contain a
proposals chapter") plus `atlas-kit/CLAUDE.md:74`,
`rocs-kit/CLAUDE.md:73`, `commissioning-template/CLAUDE.md:84`, and
`commissioning-template/BUILDOUT_PROMPT.md:105` ("REQUIRED"). rocs-kit's
also pins SUMMARY order as "Proposals → Contracts → Verifications". I
touched none of them — you told me I do not own `books/CLAUDE.md`, and
splitting the guide layer would leave root and per-book contradicting
each other. But agents read the per-book guide on every edit in that
book, so **this should be the next task in the batch**, not a later one.
The decision record already scopes it.

**4. `books/preview.py --check` resurrected a deleted chapter as a stub,
silently.** The running worktree preview watcher rebuilt in the window
between `git rm books/atlas-kit/src/proposals.md` and the SUMMARY edit,
and mdbook wrote back a stub `# Proposals` — exactly the behavior
`CLAUDE.md` documents ("mdbook writes a stub and exits 0"). I caught it
in `git status` only because it showed as untracked. Anyone deleting a
chapter in a live worktree can commit a resurrected stub and the books
gate will pass. Cheap fix: have the books check fail on a `src/*.md` that
no `SUMMARY.md` references — the inverse of the check it already does.

**5. Both large chapters were unreconciled concatenations.** atlas-kit's
was four books' proposals chapters pasted together (four `## Active`
headings, two duplicated preambles, one entry name appearing twice, an
un-deleted template comment); rocs-kit's was five, led by an entirely
empty shell. `rocs-kit/src/verification.md` has the same shape — five
concatenated frames, so "How proposals interact with this frame" appears
six times in one chapter. Not my task, but that chapter is 1,300+ lines
of repeated frame and is the book's largest dead-link contributor (134).

**6. Two smaller things.** `rocs-kit/CLAUDE.md` requires
`src/verifications.md` (plural) but the book ships `src/verification.md`
(singular). And `rocs-kit/src/verification.md:174` links to
`verification.md` — itself.

## Residue

`geo-iq/src/SUMMARY.md` and `gvc-kit/src/SUMMARY.md` now end with a `---`
separator whose only entry was Proposals. I left them: you told me to
touch only the Proposals line in the SUMMARY files intent-kit-lift
shares, and in geo-iq's case that separator is where a
reference-deployment entry would land. If kit-lift does not touch geo-iq,
that separator wants removing.

## Next batch

1. **The guide layer** — `books/CLAUDE.md` plus the four per-book guides
   (finding 3). Highest urgency: it currently instructs agents to
   recreate what this change deleted.
2. **Route finding 1 to intent-kit-lift** — the stranded
   reference-lakehouse material, as a request to that conductor rather
   than a task here.
3. **The skills** — `book-suite-scaffold`, `book-add-system`,
   `book-chapter-ready`, `book-coherence-audit` and its reviewer agent,
   per the decision's consequences. Untouched by this session.

---

# Addendum: the bolt's evidence, verified

bolt-flywheel-machinery sent its reviewer's audit by prompt (no file was
written into this directory). It was measured on a tree where the six
chapters still exist, so every claim is a state claim. I checked each
against my tree before acting. Two were actionable-looking and turned out
already satisfied; one led somewhere better.

| # | Claim | Verdict on this tree |
|---|---|---|
| 1 | Slug population is 158 any-level / 154 `###`-only, not 160; cortex-kit nests every slug at `####` so a `###` sweep sees zero of them | **Confirmed exactly.** atlas-kit 69, rocs-kit 74, commissioning-template 9, geo-iq 1, gvc-kit 1 — identical under both patterns; cortex-kit 4 any-level, **0** under `###`. Their methodology warning is right. |
| 2a | `cortex-kit/src/spike.md:65` — content to port, not a link to strip | **Already covered.** The deleted entry's operative half (findings return by hand, `SPIKE.md` → Architecture, promotions → Commissioning) is in `spike.md:86-88` ("the answer plus the chapter each answer is destined for") and `spike.md:120-127`. Its unique remainder was retirement narration — "was framed for the managed-index design and is retired with it" — which this book's voice rules ban outright. Nothing to port. |
| 2b | `cortex-kit/src/open-host.md:50` — names `cortex-extensions`, no link reaches it | **Already covered, verbatim.** `open-host.md:50` carries the exact phrase "a bundle with one subpackage per built-in". No link reaches it because nothing needs doing to it. |
| 2c | `kb-service` survives in zero files | **Confirmed as a string, harmless as design.** The slug appears nowhere. Its content does: `architecture.md:163` (two `gvc.merge` on-merge consumers), `:172` (three build row-sources), `kb-pattern.md:59-62` (real Atlas SDK wiring, serverless approval app, staging store). A slug is a proposal name; proposal names live in bolt registries now. |
| 3 | 34 inbound chapters — atlas-kit 18, cortex-kit 7, commissioning-template 5, rocs-kit 3, **aidlc-design 1**, gvc/geo-iq 0 | **Confirmed for five of six; aidlc-design is 0, not 1.** My repairs match name for name: atlas-kit 18, cortex-kit 7, commissioning-template 5 (incl. SUMMARY). aidlc-design's only two `proposals.md` mentions are `spec-driven-construction.md:40` and `:51`, both naming the **bolt's** registry, neither a link. Nothing there to repair. |
| 4 | The gate reports ok on a tree with 249 dead same-book links | **Confirmed in substance** — and already finding 4 of this report, from the other direction (the gate also lets a *resurrected* chapter through). Measured independently below. |
| 5 | `atlas-kit/src/verification.md`'s eleven slugs are out of scope | **Agreed, no action.** They are bare names in prose, matching aidlc-design's surviving `introduced-by:` fields. |
| 6 | `rocs-kit/src/proposals.md:1382` mermaid fence must keep parsing | **Moot, correctly.** Nothing absorbs it: it was a build-order graph of proposals — a queue of what to build, which is exactly what the decision moves into the loops. Mermaid gate green at 224 diagrams. |

## What claim 2a actually led to

Checking whether `spike.md` needed content ported found the opposite
problem — a surviving sentence describing the *dead pipeline*.
`spike.md:128` said normal decomposition "can mine settled chapters into
proposals", which contradicts `aidlc-design/src/authoring-capabilities.md:168`:
"There is no capability that mines a book into a build list. Decomposition
starts from an intent's settled slice." Rewritten to agree with it —
commit `1ea382d`. That is the kind of stranding a link sweep cannot find,
and it was the only one: a repo-wide sweep for mine/carve/decompose prose
against a chapter turned up no other live contradiction (`book-decompose-commissioning`
hits are fine — it mines infrastructure, not a build list).

## Dead links, measured under one rule on both trees

Their figures and mine are different populations (same-book vs all
relative, different commits), so I re-measured both trees with one
checker that resolves against the **deployed** layout: a link in
`books/B/src/REL/page.md` resolves from deployed dir `B/REL`, and the
first segment of the result maps back through `books/<book>/src/`.

| tree | dead | files |
|---|---|---|
| `aa62d58` (pre-deletion) | 332 | 73 |
| `HEAD` | **120** | 56 |

**212 removed, 17 files fully cleared, zero introduced** — every book's
count fell or held (atlas-kit 125→32, rocs-kit 177→67, cortex-kit 17→11,
commissioning-template 8→5, overview 5→5 untouched). Links pointing into
a retired chapter: **0**.

The remaining 120 is essentially blueprints-tooling's "other 118 real
repairs" — intra-book path errors, cross-book links naming a page that
does not exist, and cross-book links written in a form that resolves
inside their own book. That bolt's own boundary says they "belong to
their own books' writeback", and none of them is inbound to a retired
chapter, so they are not this task. rocs-kit alone holds 67 of them.

## On the link rule

No conflict either way. Every nested site in this change took the
drop-the-pointer shape, so this branch adds **no nested cross-book link
at all** — nothing here depends on the corrected rule landing, and
nothing here has to be rewritten after it does. The six links I did add
are all from top-level chapters, one `../`, verified rendering to a file
that exists.
