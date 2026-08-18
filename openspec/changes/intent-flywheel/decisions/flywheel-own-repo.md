# Decision: flywheel moves into its own repo, in the agentplot org

## Decision
Flywheel leaves blueprints for a repo of its own — `agentplot/flywheel`, in
the `agentplot` GitHub org rather than `WilldanGroup`. It is a general loop
for turning intent into built code, not a Willdan design book, and it stops
being a guest in the books repo. The repo is self-contained and is its own
marketplace: `.claude-plugin/plugin.json` names the plugin, and
`.claude-plugin/marketplace.json` points one entry at the repo root with
`"source": "."`. Installation is `/plugin marketplace add agentplot/flywheel`
then `/plugin install flywheel@flywheel`; development bypasses both with
`claude --plugin-dir <path>` and `/reload-plugins`. Shipping into
`willdan-marketplace` is rejected — the flywheel is not a Willdan catalog
entry.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md` (to be rewritten)
- Produced by: `sessions/2026-08-06-flywheel-own-repo/own-repo.html`, with
  the operator's word given directly mid-session: "i don't want flywheel to
  live in willdan-marketplace. instead i want to make a flywheel repo in
  https://github.com/orgs/agentplot/"
- The cost that was supposed to decide this evaporated under research. The
  development loop for a plugin under active edit is `--plugin-dir` plus
  `/reload-plugins` — edit and reload, no publish cycle — so the loop that
  builds the loop does not run slower than the one it replaces
  (`sessions/2026-08-06-flywheel-own-repo/research-local-plugin-loop.md`).
- `willdan-marketplace` could not have hosted a plugin living elsewhere in
  any case: all 25 of its `marketplace.json` entries use
  `"source": "./plugins/<name>"`, and its own commissioning gate enforces
  that — `marketplace_audit.py` resolves `repo / source`, fails when it
  resolves to no directory, then sweeps `plugins/` flagging unlisted
  directories as orphans, and `tests/test_marketplace_manifest.py` asserts
  the exact source string. Verified in this session.
- The single-plugin-repo-as-its-own-marketplace shape is already proven on
  this machine: `plannotator@plannotator` is a git-sourced marketplace whose
  manifest declares exactly one plugin, and it is enabled in blueprints'
  `.claude/settings.json` today.
- A different org is no constraint on installation. A public repo installs
  by `owner/repo` shorthand; a private one needs working git credentials
  (`gh auth setup-git` or an SSH key — `GITHUB_TOKEN` is reported not to
  work for `/plugin marketplace add`).

## Consequences
- The deferred cloud-dispatch task unblocks. It was filed as "becomes an ADR
  in the flywheel repo once flywheel has one"; that repo now has a name, so
  the task can be re-filed against `agentplot/flywheel` rather than left
  blocked on this decision.
- A new Handoff task: stand up `agentplot/flywheel` — the bare layout, both
  `.claude-plugin/` manifests, devenv, CI, and its own `wt.toml` gates.
- The final Handoff task retargets: the flywheel plugin ships from
  `agentplot/flywheel`'s own marketplace, not from `willdan-marketplace`.
  The separate task retiring the `openspec-construction` family stays
  pointed at `willdan-marketplace` — that family is superseded there.
- Flywheel's own construction becomes ordinary. The intent conductor still
  runs on blueprints main, but the built repo is `agentplot/flywheel`,
  exactly as `rocs-kit` is for a rocs intent. The special case that produced
  `decisions/blueprints-is-a-built-repo.md` stops applying to the machinery,
  though it still governs the `books/CLAUDE.md` and root `CLAUDE.md` work.
- One open practical question, not a design question: the sibling-path
  protocol. Blueprints' `CLAUDE.md` addresses siblings as `../../<repo>/main`
  from a shared parent, and `agentplot` checkouts live under a different
  parent (`Code/github_agentplot/`, not `Code/clients/github_willdan/`).
  The split bolt names the convention for reaching across.
- One inference the research flagged and did not confirm: which name Claude
  Code registers a marketplace under when added by GitHub shorthand — taken
  to be `marketplace.json`'s `name` field rather than the repo name. It
  affects only the second install argument and is cheap to verify once the
  repo exists.
