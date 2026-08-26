# Bolt: the-loop-obeys-itself

## Scope

This bolt fixes two places where the flywheel loop contradicts a rule
it states in its own source, both found by the research session on
#368 and both verified against `flywheel/main` at `e548adb5` before
this plan was drawn, in one unit against one repo (agentplot/flywheel).
`loop-rules-hold` carries both fixes: `job-reason-states` makes the
`Job.why` fingerprint render the state label rather than collapsing
`state:ready` and `state:in-progress` into the same `#N open` text, so
a milestone held on an in-progress item releases as soon as new ready
work arrives instead of waiting out a stale restart hold;
`plan-brief-no-worktree` stops `plan_brief` ordering a `wt switch` a
plan session was already born inside, bringing it to read like
`spec_brief` — the session is IN the worktree the loop cut for it and
never creates one. Price: 2 changes, ~0.5 days.

## Sources

- Tracker milestone `bolt/the-loop-obeys-itself` (agentplot/flywheel,
  #42, state `open` — verified via `gh api
  repos/agentplot/flywheel/milestones/42`) carries one `state:ready`
  unit, #376 `loop-rules-hold`, whose two items — #377
  `job-reason-states` and #378 `plan-brief-no-worktree` — are both
  `state:ready`. The unit card verifies both findings against the tree
  rather than the finding's summary (`flywheel/main` `e548adb5`):
  `Item.state` at `_flywheel_inbox.py:182,190,258,608` renders
  `state:ready` and `state:in-progress` items as the same `#N open`
  string, and `plan_brief` at `_flywheel_bolt_loop.py:2410-2413` does
  order a `wt switch --create` where the sibling `spec_brief` at
  `:2249-2251` instead says the session is already in its worktree and
  must never create one. I re-verified `e548adb5` is still the tip of
  `flywheel/main` (`git merge-base --is-ancestor e548adb5 HEAD` on that
  tree, both local and `origin/main`, returns true) and that the two
  cited "Derived from" commits are real: `e106f26` is a `book(flywheel)`
  commit reachable from this tree's `main`, and `3b113d9` is a
  `docs(specs)` commit reachable from `flywheel/main`'s `main`.

- **Why a new bolt.** The two other open `bolt/*` milestones hold no
  open item — verified via the same milestones listing: `loop-channels`
  (#33) shows 4 closed, 0 open; `types-rounds-and-destinations` (#37)
  shows 3 closed, 0 open. Both are finished threads awaiting a close,
  not live bolts whose deliverable these fixes serve; there is nothing
  to fold into. I searched `intent-flywheel/tasks.md` for this
  milestone's name and for the unit's slug and found no handoff task
  line naming them — like the bolts before this one, the unit reads as
  planned straight from the book-and-specs gap rather than routed
  through an enumerated task.

- Derived from: book `e106f26` · specs `3b113d9` · in flight:
  `intent-flywheel`, `messy-repo-onboarding`, `operating-docs`,
  `site-teaches-the-system`, `writeback-in-session`.

## Repos

- flywheel · bolt branch `bolt/the-loop-obeys-itself`

## Merge criteria

`devenv shell -- gates` green on the bolt branch as it would land —
rebased onto (or merged with) flywheel/main's current main, not only
in isolation. I read `AGENTS.md`'s "Gates" section and `.config/wt.toml`
on that tree: the same three commands (`sh scripts/validate-manifests.sh`,
`node scripts/check-paths.mjs`, `node scripts/check-site.mjs`) run as
`.config/wt.toml`'s `[pre-merge]` hooks, in `.github/workflows/gates.yml`,
and via `devenv shell -- gates`, so a green claim means the same thing
in all three places. This bolt is bound to the `bolt-quick` schema,
whose `schemas/bolt-quick/schema.yaml` declares `extensions: []`
(verified via `openspec schema which bolt-quick`, resolving to
`~/.local/share/openspec/schemas/bolt-quick/schema.yaml`) — no review
step is scheduled beyond that gate. The merge gate itself is always
implied and never weakened.

Landing: merge
