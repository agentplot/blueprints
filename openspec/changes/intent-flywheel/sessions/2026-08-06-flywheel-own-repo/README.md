# Session: flywheel-own-repo

## Charge
- Change: flywheel
- Directory: sessions/2026-08-06-flywheel-own-repo/
- Type: interactive design session (lavish surface)
- Tasks: `design session: does flywheel move into its own repo, and what
  does that cost — the local install loop for a plugin under active
  development, what travels with it, what stays in blueprints, and whether
  the split lands before or after the two end-to-end runs`

Three decisions closed in one surface, presented together with options and
trade-offs: whether flywheel moves, what travels, and when the split lands.

## Produced
- `research-local-plugin-loop.md` — the development loop for a plugin under
  active edit. `--plugin-dir` plus `/reload-plugins`; skills namespace;
  `${CLAUDE_PLUGIN_ROOT}` resolves in both modes.
- `research-standalone-plugin-repo.md` — a standalone repo can be its own
  marketplace (`"source": "."`), install is two steps, and the skill change
  is a restructure rather than a rename.
- `own-repo.html` — the decision surface. Left exactly as the operator saw
  and answered it, including the repo options that his mid-session word
  closed; it is the trail of what was actually put in front of him.
- `flywheel-own-repo-decision.md` — decision draft: flywheel moves to
  `agentplot/flywheel`, self-contained, its own marketplace.
- `flywheel-repo-manifest-decision.md` — decision draft: the machinery
  travels, the record and the book stay, with the full manifest.
- `split-after-the-runs-decision.md` — decision draft: the runs go first;
  split, restructure, and publish are one bolt.

Verified by hand in this session, correcting the research: `claude --agent`
resolves a plugin agent by its **bare** name as well as its namespaced one,
so no `herdr agent start` line anywhere changes. Skills namespace as
expected (`testplug:demo`). OpenSpec resolves schemas from `project`, `user`,
and `package` sources, and project copies shadow user copies.
`willdan-marketplace` cannot host an out-of-repo plugin — its own
commissioning gate enforces in-repo sources.

## Delivered
Three decisions closed; the Design task
`does flywheel move into its own repo` is ready to check.

**Decisions to promote into `decisions/`:**
1. `flywheel-own-repo` — moves to `agentplot/flywheel`, not
   `willdan-marketplace`.
2. `flywheel-repo-manifest` — machinery travels; record and book stay.
3. `split-after-the-runs` — runs first; split and publish as one bolt.

**Tasks to append (Handoff):**
- Stand up `agentplot/flywheel` — bare layout, both `.claude-plugin/`
  manifests, devenv, CI, `wt.toml` gates.
- Split to `agentplot/flywheel` (blocked by: both end-to-end runs) — move
  the machinery and `add-flywheel-loops`, restructure the skills to drop the
  `flywheel-` prefix, publish both schemas as user schemas, ship the plugin,
  and run the named acceptance checklist. The existing plugin-ship task
  folds into this one.

**Tasks to amend:**
- The deferred cloud-dispatch task unblocks — `agentplot/flywheel` is the
  ADR's home, so it is no longer blocked on the own-repo decision.
- The plugin-ship Handoff task retargets from `willdan-marketplace` to
  `agentplot/flywheel`'s own marketplace. The `openspec-construction`
  retirement stays pointed at `willdan-marketplace`.

**Open, for the split bolt rather than a design session:**
- The sibling-path convention across orgs — blueprints addresses siblings as
  `../../<repo>/main` from a shared parent, and agentplot checkouts sit under
  a different one.
- Who drains `add-flywheel-loops`' remaining tasks once it is off blueprints
  main, and under which schema.
- Explicit confirmation that machinery authored in a Willdan client repo is
  the operator's to move to another org.
- Which name Claude Code registers a marketplace under when added by GitHub
  shorthand — affects only the second install argument.

**What the next batch should work:** nothing here blocks the runs, and the
runs block almost everything else. The next batch is the dispatch-rename
bolt reaching the phase gate so `sessions/2026-08-06-e2e-design-loop/` can
start. The three chapter Writeback tasks are now genuinely independent of
the split and can run in parallel with it — worth a batch of their own,
with the caveat recorded in `split-after-the-runs`: they will name the
skills under their current names and the split bolt re-edits them.
