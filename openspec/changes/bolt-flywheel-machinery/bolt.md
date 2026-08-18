# Bolt: flywheel-machinery

## Scope
**The books and the map are the design loop's exclusively**
(`blueprints-is-a-built-repo`, closed at `3f35d0e`). This bolt carries no
book-chapter edit and no map move, not as a proposal and not as a side
effect of one — a chapter is where the destination is stated, and a bolt
editing one is writing design through the construction gate. The line
inside `books/` is **chapter versus machinery, not path**:
`books/<book>/src/**` belongs to the design loop; `books/CLAUDE.md`, each
book's `CLAUDE.md` and `BUILDOUT_PROMPT.md`, and the book skills are this
bolt's.

Carry the flywheel intent's settled design into the machinery blueprints
hosts: both loop skills, the design-session profile split and the
session-type skills, the two schemas' artifact instructions, the
`books/CLAUDE.md` conventions and the book skills that enforce them, the
root `CLAUDE.md` entry points, and the retirement of the
`openspec-construction` plugin family from `willdan-marketplace`. Seven
proposals across two repos.

The handoff released the `books/CLAUDE.md` conventions and the book skills
that enforce them as one proposal, but the conventions live in blueprints
and the skills live in `willdan-marketplace`'s `system-design-inception`
plugin, and one OpenSpec change cannot be applied in two repos. It is built
as two proposals against the same decision — a construction split that
changes nothing about what gets built.

Everything here is derived from decision records that are already settled
and already reviewed as decisions. The spec agents' job is to turn a
decision into a proposal that cites it, not to re-open it.

## Sources
The intent amends these tasks in place as its own design settles, so the
handoff is a live source rather than a snapshot taken at release. Four
amendments have arrived since: the eval scope corrected to all seven skills,
the session-worktree consequence requested into this bolt, two additions to
the construction skill's batch, and a widened roster criterion with the
`_automation-migrate` pointer resolved. None came through `inbox/`; all came
through the intent's own `tasks.md` and `decisions/`, which is where a bolt
conductor has to look.

- Intent `flywheel`, six Handoff tasks — the two skill rewrites plus
  `skill-creator`, the design-session profile split with its session-type
  skills, the schema instruction edits, `books/CLAUDE.md` and the book
  skills, root `CLAUDE.md`, and the `openspec-construction` retirement.
- The decision records each proposal cites, in
  `openspec/changes/flywheel/decisions/`.
- Released by the operator on 2026-08-06, alongside `bolt-dispatch-rename`.

## Repos
- willdan-blueprints · `bolt/flywheel-machinery` ·
  `~/.herdr/worktrees/.bare/bolt-flywheel-machinery`
- willdan-marketplace · `bolt/flywheel-machinery` ·
  `~/.herdr/worktrees/willdan-marketplace/bolt-flywheel-machinery`

Both bolt branches carry the same name, and herdr derives a worktree path
from the branch name under the repo's bare-directory label — which is
`.bare` for every repo in this layout. The second repo therefore needs an
explicit `--path`, or it collides with the first.

## A status is not evidence of activity

`building` plus a named owner **asserts a live agent, and nothing verifies
it.** The registry is a state claim about a fleet, and fleets die — to an
outage, a closed pane, a compaction. Before trusting any `building` row,
check the owner is alive; when it is not, the row is **wrong**, not merely
stale, and a row that reads in-progress while nothing progresses is worse
than one that reads blocked, because nobody goes looking.

Two rows here asserted owners that had finished or died. The work was done
in both cases, which is the benign version; the malign version is identical
on the page.

The corollary, learned twice today: **when an agent dies mid-turn, the
branch is the only truthful record of where it got to.** Its last report is
the least reliable thing available — one agent reported 58 of 58 tasks
closed with two blocking rulings untouched. Re-read the branch, then
relaunch only what is genuinely unfinished.

Note also that a conductor's Task-tool workers are not herdr agents and
never appear in `herdr agent list`. Reading that list as the whole fleet
reports a healthy bolt as dead — the inverse of the defect above, and the
same root: a list nobody verified is being read as evidence.

## Merge criteria
The release gate (`wt merge`, full hooks, on the exact rebased tree) is
always implied. Beyond it:

- Every proposal cites the decision record it implements, and an
  independent agent has checked the proposal against that record before
  building. Review mode is `agent` on every row: the decisions are the
  spec, and they were already reviewed as decisions.
- The skill rewrites carry the three conductor failures this intent
  produced, stated as rules rather than left to be inferred — **two write
  scopes, not one** (`blueprints-is-a-built-repo`): a conductor writes
  `intent.md`, `decisions/`, `tasks.md` and `design.md`, plus the books and
  the map; a session writes **only its assigned session directory**, plus
  the books and the map, and never the canonical artifacts. The lumped form
  this criterion carried — "a conductor and its sessions write only the
  change's artifacts" — reads as granting a session the canonical
  artifacts, which is the amendment that record exists to make. An
  acceptance agent checks against this line, so the lumped form here would
  have passed a build that implemented it; the chore route belongs to dispatch at
  triage and closes once an intent owns the work; the conductor drives and
  the gate authorizes rather than stalls (`the-gate-is-inline`). Each was
  made by an agent that had read the skill, so each lands in the profile
  bodies too.
- `skill-creator` has been run over both loop skills **and the five
  session-type skills**, and all seven ship with evals. The handoff first
  narrowed this to the two loop skills; the intent corrected the narrowing
  as a drafting loss rather than a scoping judgment
  (`session-types-are-skills.md`), and this criterion follows the decision,
  not the first draft of the task.
- The session-worktree consequence is carried, per the intent's request into
  this running bolt (`session-worktrees.md`): `flywheel-inception`'s
  conductor section carries the spawn recipe, its session section carries
  that a session owns a worktree and a branch rather than only a directory,
  and both design-session profiles say the same. The fold gains one step —
  merge the session branch through the gate before promoting — and teardown
  joins the conductor's duties.
- The `books/CLAUDE.md` proposal also carries `books/aidlc-design/`'s own
  `CLAUDE.md` and `BUILDOUT_PROMPT.md` chapter rosters, and the
  voice-rules pointer every book's `CLAUDE.md` aims into the
  `system-design-inception` plugin. That plugin survives the retirement, so
  the pointer is not dangling — but a blueprints convention reaching into a
  marketplace plugin for its own voice rules is the coupling this proposal
  closes.

  The roster drift is not what the handoff described. The handoff said both
  rosters still list five deleted chapters; on disk they name one,
  `proposals.md` — the other four came out when the chapters were deleted in
  `1b96a08`. The real drift runs the other way: both rosters *omit*
  `choosing-worktrunk.md`, `worktrunk-substrate.md` and
  `session-management.md`, which exist. The criterion is that the rosters
  match disk, which is what the handoff was reaching for.
- Book gates green in blueprints: `python3 books/preview.py --check`,
  `node books/check-mermaid.mjs`, `node context-map/bin/map-check.mjs`.

  Green means every book builds, every `SUMMARY.md` entry resolves, every
  sidecar exists, every diagram parses, and every map `ref` resolves. It does
  **not** mean the prose links anywhere: the books gate never resolves an
  intra-book link target, and there are 249 dead same-book links across 44
  files on a tree it calls ok. Roughly four fifths are `proposals.md` links,
  which the **design loop's** chapter deletions clear, not this bolt. The
  criterion is not weakened — all three still pass — but it is not read as
  more than it checks. The slug and inbound-link evidence this bolt's review
  produced was handed to the session that owns those deletions rather than
  binned: a bare deletion strands exactly what that audit found, and the
  evidence transfers even though the branch does not.
- The marketplace retirement leaves no dangling registration — every plugin
  in `marketplace.json` exists on disk and every plugin on disk is
  registered. `system-design-inception` survives it, minus `book-decompose`,
  and a test asserts as much so a later over-broad cleanup cannot take it.
- The two marketplace proposals collide on **eleven of the twelve files the
  retirement touches in `system-design-inception`** — not the two first
  recorded here, and not the twelve claimed after that. The exception is
  `references/contracts-frame.md`, which the sibling explicitly does not
  edit, so whatever the retirement leaves there is permanent text rather
  than a base for a second pass. Token-scoping is right for the other
  eleven and wrong for that one, which has to read cleanly on the first
  and only pass. They build serially on one worktree, retirement first:
  it prunes `book-decompose` from the nine, then the sibling rewrites them
  on a tree where that skill no longer exists.

  The order is not a preference. All six `book-decompose` hits in the two
  hottest files sit *inside* the `unmineable-proposal` machinery the sibling
  deletes wholesale — so reversed, the retirement's tasks would point at
  line numbers and quoted text that no longer exist, and one task would name
  a finding type already gone. Token-scoping the retirement's edits is what
  keeps the pruned tree a clean base for the rewrite; it is not a claim that
  either merge is small, which it was briefly and wrongly justified as.

## Sequencing
Ordered behind `bolt-dispatch-rename` in content but not in time: nothing
here edits `.claude/agents/flywheel-intake.md`, so the two bolts touch
disjoint files and run in parallel. The skill proposal retitles the
`flywheel-inception` intake section to dispatch, which reads correctly once
the rename lands and is harmless before it.

**That rename landed on main across `6935cbd` (the file move) and `d2cd6ea`
(the body rewrite), and the disjointness held exactly.** `c59c2a7`, which
this record first cited, closed the sibling change's tasks and touched no
profile at all — a landing SHA read off the top of `git log` rather than
off what the commit changed. The rename changed two paths and no others —
`.claude/agents/flywheel-intake.md` deleted, `flywheel-dispatch.md` added.
It touched neither loop skill, neither conductor profile, neither schema,
nor either `CLAUDE.md`, so every line number this bolt's proposals cite is
still valid. Two consequences: the retitle is now unambiguously correct
rather than merely harmless, and the "do not touch `flywheel-intake.md`"
constraint in several proposals now names a file that no longer exists —
a build agent verifying it must check `flywheel-dispatch.md` instead.

This bolt's branches rebase onto main before acceptance, not now: a rebase
mid-round would disturb spec agents holding uncommitted amendments, and the
release gate runs on the rebased tree regardless.

This bolt's output moves to `agentplot/flywheel` later, per
`decisions/split-after-the-runs.md` — the skills, profiles, and schemas
harden here first and travel settled. Nothing in this bolt anticipates the
move; the split is its own bolt, blocked on both end-to-end runs.
