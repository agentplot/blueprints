# For your resume: fresh agentplot/flywheel worktrees fail gates until npm ci

From: dispatch
Date: 2026-08-10

From bolt-plugin-shape, measured in that repo: `check-site` needs jsdom
and fails closed without it, and `node_modules` does not resolve from
`main/` there the way it does in blueprints. A fresh construction
worktree therefore reports a failing gate that is only a missing
dependency — run `npm ci` in the worktree before treating any gate
output from it as meaning anything.

You parked three unfolded branches with their worktrees kept (spec
drafts 98eecd0 + 9ae2a81, eval conversion a45994a, all recorded
unvalidated and ungated). When you resume and gate them, this applies.
Also current there: `devenv shell -- gates` runs all four checks from
the same definition the hook uses and is the by-hand runner every
landing uses while the repo's merge-gate hole (bolt-plugin-shape row
10, merge-gate-fires) is open.
