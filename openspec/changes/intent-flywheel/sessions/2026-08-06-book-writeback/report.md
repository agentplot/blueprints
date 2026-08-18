# Report: the book writeback

The three Writeback tasks are done as one pass. `books/aidlc-design` now
describes the flywheel: two loops, the actors that run them, the channels
that carry a human question, one exit from the phase gate, and the
pipeline stages a bolt drives. The plugin-and-skill chapter set is gone.

Checks: `python3 books/preview.py --check` green (8 books),
`node books/check-mermaid.mjs` green (225 diagrams),
`node context-map/bin/map-check.mjs` clean. The map did not move — no map
node cites an `aidlc-design` chapter, so nothing had to be repointed.

## What each chapter now says

### `conducting.md` — rewritten in full

The actor model. Two loops and three schemas; the actor table with
cardinality, where each runs, and what it owns; the sole-writer rule and
what follows from it; the two-things-a-design-session-writes rule stated
positively; the session directory and the design catalog; the two ways an
agent reaches a conductor and what draining an inbox means; the channel
matrix with answer shape down one axis and loop across the other and who
blocks per cell; the review-moment table generated from the sole-writer
rule plus the conductor's three-way triage; the phase gate as an inline
approval with one exit; the OpenSpec UI board as the monitoring surface.
The compounding material it used to open with survives as the closing
section — it is what the machinery is for.

Sources: `three-schemas`, `sole-writer-conductors`,
`blueprints-is-a-built-repo`, `session-directories`, `design-catalog`,
`herdr-and-inbox`, `human-loop-channels`, `review-launch-points`,
`the-gate-is-inline`, `every-handoff-is-a-bolt`, `openspec-ui-monitoring`,
`bridged-singleton`, `dispatch-singleton-name`, `agent-profiles`.

Dropped as superseded: the four-level automation spectrum, the delegation
envelope, Honcho peers, and Hermes as the board implementation.
`herdr-and-inbox` says agents reach each other two ways *and no others*,
which retires the envelope; `openspec-ui-monitoring` names the board.

### `authoring-capabilities.md` — rewritten in full

Keeps the shape-picking and the four tests (`walkthrough.md` and the
`soloist` vocabulary entry both depend on them), and gains three things:
how an actor is assembled (profile carries identity, skill carries
practice, first prompt carries the binding, and the three ship together);
session types as skills with the four types named, including writeback;
and the capability tables — the two loop skills, the book capabilities,
and workspaces — each row naming what the capability is for and nothing
about how it works.

There is no decomposition capability row, and the chapter says so
explicitly rather than leaving the absence to be noticed.

Sources: `agent-profiles`, `design-session-steering`,
`session-types-are-skills`, `book-decompose-retires`,
`plugin-chapters-fold`.

### `spec-driven-construction.md` — rewritten in full

Rebuilt around the pipeline stages. Construction is the bolt loop: the
actor-and-branching figure (bolt conductor → registry → bolt branch per
repo → nested construction worktrees → merge gate → acceptance → release
gate), the registry states that drive it, the five stages with their
invariant gates, the binding checklist, the opsx artifact sequence and
skill family absorbed from the retired chapter, the OpenSpec and SpecKit
mappings, and the long-lived-bolt posture. One exit from the gate is
stated in the opening.

Sources: `every-handoff-is-a-bolt`, `plugin-chapters-fold`,
`human-loop-channels` (the construction review threshold),
`bolt-verification-punt`, `three-schemas`, the `flywheel-bolt` schema and
the `flywheel-construction` skill.

### Retired

`catalog.md`, `agent-workspaces-plugin.md`, `system-design-inception.md`,
`openspec-construction.md` — and `proposals.md` (see the scope note
below). `SUMMARY.md` loses its "Plugins & skills" section; "Building the
marketplace" becomes "Building the toolchain" and carries contracts and
verifications only.

The commissioning-inception half moved to `commissioning.md` as a
four-capability table plus its flow diagram. The design content that
existed nowhere else — the two-plugin-systems distinction, what
`agent-workspaces` ships, and the machine/repo setup split — moved into
`agent-workspaces.md` as a compact "How it is delivered" section rather
than being lost with the chapter.

## Scope taken beyond the task lines

Three things went past the literal wording of the tasks. Each is
authorized by a decision record; each needs the task line reworded when
this is folded in.

1. **`books/aidlc-design/src/proposals.md` retired.**
   `decisions/proposals-chapter-retires.md` assigns it directly:
   "aidlc-design's own chapter goes with the chapter-set rewrite →
   decisions/plugin-chapters-fold.md". Task 3 names four chapters and not
   this one, and the Handoff task that covers the kit books' chapters says
   they "retire with their own books' edits" — which for aidlc-design is
   this writeback. Leaving it would have left the book carrying a build
   list for plugins that retire, maintained by a skill that retires.

2. **`system-design.md` rewritten in full.** It could not survive the
   retirement of `book-decompose` and the proposals chapter — its owned
   concepts included "turning a book's chapters into a `proposals.md` via
   `book-decompose`", and `walkthrough.md` (a mandated follower) now walks
   the flywheel path. The chapter keeps the design book, the suite shape,
   the unit, commissioning decomposition, and the contract-extraction
   threshold;
   its decomposition sections are replaced by a "From a chapter to work"
   section — chapter → intent → Handoff task → gate → bolt. The unit now
   renders as a row in a bolt's registry rather than an entry in a book.

3. **Repairs to chapters that pointed at the deleted ones.**
   `foundations.md` (the phase diagram and the four-concepts list no
   longer name retired plugins; the catalog pointer becomes the
   capabilities chapter), `agent-workspaces.md`, `choosing-worktrunk.md`,
   `worktrunk-substrate.md`, `session-management.md`, `verifications.md`,
   and `books/overview/src/systems.md` (the overview-is-the-sink rule).
   `session-management.md` and `agent-workspaces.md` also pointed at
   `conducting.md` for concepts that chapter no longer defines — Hermes,
   the automation horizon, the escalation envelope — and were repointed at
   what replaced them.

## Findings for the conductor

No contradiction between two decision records surfaced. Five gaps did.

1. **`books/aidlc-design/CLAUDE.md` and `BUILDOUT_PROMPT.md` are now
   wrong.** Both list a chapter roster that includes the five deleted
   files, and `CLAUDE.md` states that this book "does carry
   `proposals.md`" and that `proposals.md` is the one chapter allowed to
   name future work. Neither is a chapter, and the conductor already filed
   the sibling case (`books/CLAUDE.md`) as a Handoff, so this session left
   them alone. **Suggested: append to the existing `books/CLAUDE.md`
   handoff proposal** — the same proposal should carry the per-book
   `CLAUDE.md` and `BUILDOUT_PROMPT.md` rosters for `aidlc-design`, and
   the voice-rules pointer in every book's `CLAUDE.md` currently names the
   `system-design-inception` plugin's `references/voice-rules.md`, which
   moves when that plugin family retires.

2. **The `book-decompose-retires` capability list is short by three.** It
   names four surviving book skills (`book-suite-scaffold`,
   `book-add-system`, `book-chapter-ready`, `book-coherence-audit`), but
   `book-architect`, `book-seam-audit`, and `book-decompose-commissioning`
   also exist and are unaffected by any decision. `authoring-capabilities.md`
   lists all seven, on the decision's own standing rule that the book names
   the capabilities that exist. Flag if that enumeration was meant to be
   exclusive.

3. **The kit books still carry `proposals.md`.** `atlas-kit`, `rocs-kit`,
   `cortex-kit`, `gvc-kit`, `geo-iq`, and `commissioning-template` each
   have one, heavily cross-linked from their own `verification.md` and
   `contracts.md`. That is already the Handoff task's scope ("retire with
   their own books' edits"), but the link density there is high enough
   that it is a writeback session per book, not a side effect of a skill
   change.

4. **Two sessions share one working tree, and a broad `git add` crossed
   the line.** The five chapter deletions this session staged were swept
   into `1b96a08 docs(flywheel): land the standalone-repo research in the
   repo-split session` — a sibling session's commit. Nothing was lost; the
   attribution is wrong and the deletions are unreviewable in the commit
   that carries them. `decisions/sole-writer-conductors.md` guarantees no
   two writers share a *file*, which is what makes parallel sessions safe.
   It says nothing about two sessions sharing a *working tree*, and
   staging by directory rather than by path breaks that assumption. Worth
   a rule: an actor stages the paths it wrote, never `-a` or `add -A`.
   Worth a decision if the answer is instead that parallel sessions get
   their own worktrees.

5. **`session-management.md` and `agent-workspaces.md` describe a board
   and work-item model that predates the flywheel.** They were repointed
   so nothing dangles, and the flywheel's board is named where it matters,
   but the substrate chapters still carry a generic dispatcher story that
   no decision has resettled. Not urgent, and not this batch's subject —
   worth an appended Design or Writeback task if the operator wants those
   two chapters to read as one design with `conducting.md`.

## Tasks to check off

All three Writeback book tasks:

- rewrite `conducting.md` and `authoring-capabilities.md` as the actor
  model
- rewrite `spec-driven-construction.md` around the pipeline stages
- retire the chapter set, with `SUMMARY.md`, `vocabulary.md`,
  `walkthrough.md`, `index.md` following

Reword task 3 to name `proposals.md` and the `system-design.md` rewrite,
so the record matches what landed.

## What the next batch should work

The frontier's remaining unblocked work is Handoff, not Writeback: the
dispatch profile rename is the one-proposal bolt both end-to-end scripts
wait on, and the `books/CLAUDE.md` proposal should absorb finding 1 before
it is released. The design side has one live question —
`sessions/2026-08-06-flywheel-own-repo/` — and the chapters written here
followed `plugin-chapters-fold`'s standing rule of naming a capability
rather than quoting an invocation string, so a plugin split costs this
book nothing.

## Lint pass

`book-chapter-ready` was run over the seven rewritten chapters and every
same-book link and anchor was resolved. Links are clean: nothing under
`books/aidlc-design/src/` references a retired chapter, and every anchor
matches a heading.

Its voice findings were applied — the banned coinages went. `bar` became
*threshold* in `system-design.md`'s contract-extraction heading and its
in-page link; the metaphorical uses of `seam` and `surface` became
*contract*, *boundary*, *view*, or *API*, so `surface` now means only what
`vocabulary.md` says it means, a pane in herdr; two headings lost their
performative framing. `spike-commissioning` gained the glossary entry it
had been used without.

One use of `seam` stays: **seam plugin** is the name of a plugin family
the `commissioning-template` book uses throughout, so renaming it here
would put the two books out of step. It belongs with the kit-books pass
in finding 3 rather than in this one.
