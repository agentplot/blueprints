# Proposals

| proposal | repo | change id | review | status | branch | owner |
|---|---|---|---|---|---|---|
| plugin core: fifteen skills + evals renamed into the namespace, shared reference, nine profiles, four schemas | agentplot/flywheel | - | agent | merged | `bolt/flywheel-plugin` | - |
| fleet layer: `bin/flywheel` per fleet-per-org (org-root manifest, relative cwds, named session), `fleet` skill, template manifest | agentplot/flywheel | - | agent | merged | `bolt/flywheel-plugin` | - |
| the record travels: `add-flywheel-loops` + the eight deployed capabilities into the repo's OpenSpec tree | agentplot/flywheel | - | - | merged | `bolt/flywheel-plugin` | - |
| blueprints consumes the plugin: machinery removed, plugin installed, user schemas, namespace sweep, org fleet.yaml | willdan-blueprints | - | agent | merged | `bolt/flywheel-plugin` | - |
| context-map tool generalization: the viewer travels as a CLI fed JSON, not lift-and-shift (build waits on `bolt-gates-and-config`'s `gates-books-and-map` row) | agentplot/flywheel | - | agent | to-spec | - | - |
| book skills into the plugin, poach defects fixed rather than copied (build waits on the same row) | agentplot/flywheel | - | agent | to-spec | - | - |

## What each proposal carries, and the decisions it implements

- **plugin core** — `flywheel-repo-manifest` (re-measured rows) ·
  `agent-profiles` (profiles keep prefixes; bare-name resolution) · the
  skills-README naming rule (directory sheds the prefix the namespace
  supplies). Internal cross-references between skills rewrite to the new
  names; `${CLAUDE_PLUGIN_ROOT}` replaces any repo-relative path.
- **fleet layer** — `fleet-per-org` · `session-model-defaults` (defaults
  ride the launch line) · decisions 26–29. The command walks up from cwd
  to the org-root `fleet.yaml`, resolves `cwd:` entries against that
  folder, targets the org's named session socket, and treats an absent
  session as the operator's to start.
- **the record travels** — `questions/deployed-specs-travel.md` (closed:
  together) · `flywheel-repo-manifest`. Who drains the change's open
  tasks in the new repo is answered by the move itself: the repo's own
  bolt conductors, under the repo's own OpenSpec config.
- **blueprints consumes** — `flywheel-repo-manifest` (staying rows) ·
  `split-after-the-runs` (the packaging checklist). `flywheel-bolt`
  stays a project schema until its live bolts archive.
- **context-map tool** — `assertions/context-map-tool.md` (the claim
  and boundaries) · the release staging note
  `sessions/2026-08-10-release-prep/release-context-map-tool.md`. A CLI
  fed JSON is the shape; the three maps and Willdan's schema specifics
  stay in blueprints. Released 2026-08-10; build waits on the
  `gates-books-and-map` row landing in `bolt-gates-and-config` (the
  topology vocabulary written once, `book-grab` made optional) — the
  wait is checked against that bolt's registry at build dispatch, not
  assumed from this row's text.
- **book skills** — the same assertion ·
  `assertions/marketplace-poach-defects.md`. Poached from
  `system-design-inception` with the two defects fixed rather than
  copied; a writeback must run in a repo that has never seen
  `books/CLAUDE.md`. Same build wait as its sibling.
