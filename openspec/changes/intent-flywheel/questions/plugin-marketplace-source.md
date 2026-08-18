# Question: how a machine pins the flywheel plugin's marketplace source

- **State:** open
- **Raised by:** dispatch's plugin-install finding, 2026-08-10, after the
  repair — the open half the finding left for placement
- **Blocks:** nothing here; the machine runs on the directory source now

## The question
This machine runs the flywheel plugin from the dev checkout — a directory
source pointing at `github_agentplot/flywheel/main` — so version drift
from any pin is by construction. The alternative, the github marketplace,
needs a real populated cache, and the declarative setup must somehow
populate and verify that cache. Which source a machine declares, and how
the github path becomes safe, is undecided.

## What turns on it
Whether fleet machines track the plugin's main branch live or a pinned
release; and whether the break dispatch measured — a source flip to
github without a populated cache, silently unresolving every profile —
can recur by configuration.

## What is already known
The operator's direction on mechanism, settled: plugin enables are
declared in `devenv.nix` — the `files.".claude/settings.json"` block
devenv writes on every activation — never by editing the JSON and never
by imperative `claude plugin install`, whose side-written state beside
the declarative enable is what broke here. atlas-kit's devenv.nix is the
reference example; blueprints already generates its settings the same
way. The invariant that holds a machine together is the marketplace
SOURCE field: `flywheel` stays a directory source pointing at the live
checkout until a real cached install exists. `installed_plugins.json` is
session-load bookkeeping, rewritten by every session and inert under a
directory source — its entry beside the source field proves nothing.
→ assertions/fleet-launch-plugin-resolution.md
