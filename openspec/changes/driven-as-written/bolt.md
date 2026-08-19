# Bolt: driven-as-written

## Scope

This bolt closes the gap between what the flywheel construction loop
already does and what its schemas and specs say it does, in two units
against one repo (agentplot/flywheel). First, `bolt-plan-speaks-semantics`
sheds a leaked internal from the `bolt-plan` schema — today it declares
`strategy: ff`, an artifact of how the loop happens to run plan mode
that contradicts the type's own meaning (no spec artifact; the plan
approved in the pane is the spec); every type description in the
schemas and skills is left speaking only the operator's semantics, with
internal keys explained solely in the schema file's own comments (1
change, ~0.5 days). Second, `the-implemented-drive-gets-its-specs`
writes `openspec/specs/` from the code and the book for behavior the
loop already runs but has never recorded there: per-unit `Type:` line
reading with loud refusal of an unknown type, the `.flywheel/verify.md`
and `.flywheel/review.json` file channels, the two-round fix budget,
every pause that replaces a guess, the fleet binding's book path riding
into every work order, and the one App-identity write seam that fails
closed — any behavior the book promises that the tree turns out to lack
is queued as a finding rather than specced around silently (2 changes,
~1 day). Price: 3 changes, ~1.5 days. This plan replaces four
planner-born unit cards (#349-#352) that covered the same ground at
greater size; the operator's 2026-08-19 dispatch plan superseded them
with the two units above.

## Sources

- Tracker milestone `bolt/driven-as-written` (agentplot/flywheel, #38,
  state `open` — verified via `gh api repos/agentplot/flywheel/milestones/38`)
  carries two `state:ready` units: #357 `bolt-plan-speaks-semantics`
  (its one item, #361 `bolt-plan-sheds-the-leaked-strategy`, is
  `state:ready`) and #358 `the-implemented-drive-gets-its-specs` (its
  two items, #359 `the-drive-behaviors-spec` and #360
  `the-context-and-identity-spec`, are both `state:ready`). Both unit
  cards state "Derived from: book e106f26 · specs 483c574 · in flight:
  add-flywheel-loops, observer, records-and-elaborations, site-five-beats,
  site-teaches-the-system, operating-docs, messy-repo-onboarding,
  writeback-in-session." Verified: `e106f26` is a `book(flywheel)` commit
  on this tree's `main` (`git log -1 e106f26`; `git merge-base
  --is-ancestor e106f26 HEAD` returns true); `483c574` is a commit on
  `flywheel/main`'s `main` (`git -C flywheel/main log -1 483c574`;
  `git merge-base --is-ancestor` there also returns true). I searched
  `intent-flywheel/tasks.md` for this milestone's name and for either
  unit's slug and found no handoff task line naming them — like the two
  bolts before this one, the units read as planned straight from the
  book-and-specs gap rather than routed through an enumerated task.

- This bolt's own launching work order carried an earlier milestone
  description — four units (`choosing-how-much-ceremony-each-unit-gets`,
  `the-loop-stops-instead-of-guessing`, `the-spec-is-written-from-the-book-itself`,
  `machinery-never-posts-as-the-operator`), 6 changes, ~6 days — matching
  the now-`closed:superseded` cards #349-#352 and the planner's
  `.flywheel/plans/2026-08-19-triage/bolt-summary.md`. Re-reading the
  milestone from the tracker at scaffold time (rather than trusting that
  copy) found it replaced: #38's live description, and both unit cards
  above, name the smaller two-unit plan and say so directly — "Replaces
  the four planner-born cards (#349-#352), superseded by the
  operator-approved dispatch plan of 2026-08-19." This record's four
  sections are written from that live description, not from the work
  order's copy of the earlier one.

## Repos

- agentplot/flywheel · bolt branch `bolt/driven-as-written` · worktree
  `/Users/chuck/Code/github_agentplot/flywheel/.bare.bolt-driven-as-written`.
  Neither exists yet — `git worktree list` and `git branch -a --list
  '*driven-as-written*'` on that tree show no entry for this slug; the
  path follows the `.bare.bolt-<slug>` pattern every other live bolt
  worktree in that listing uses. Cutting it is the loop's to do after
  this record is settled, not mine.

## Merge criteria

`devenv shell -- gates` green on the bolt branch as it would land —
rebased onto (or merged with) flywheel/main's current main, not only in
isolation. I read `AGENTS.md`'s "Gates" section and `.config/wt.toml` on
that tree: the same three commands (`sh scripts/validate-manifests.sh`,
`node scripts/check-paths.mjs`, `node scripts/check-site.mjs`) run as
`.config/wt.toml`'s `[pre-merge]` hooks, in `.github/workflows/gates.yml`,
and via `devenv shell -- gates`, so a green claim means the same thing in
all three places. This bolt is bound to the `bolt-quick` schema, whose
`schemas/bolt-quick/schema.yaml` declares `extensions: []` (verified via
`openspec schema which bolt-quick`, resolving to
`~/.local/share/openspec/schemas/bolt-quick/schema.yaml`) — no review
step is scheduled beyond that gate. The merge gate itself is always
implied and never weakened.

Landing: merge
