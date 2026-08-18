# Staged release: the context-map tool — into bolt-flywheel-plugin, whose rows already exist

- **Target:** the existing `bolt-flywheel-plugin` (schema `bolt-default`,
  owner `chuck`), not a new bolt. Its registry already carries the two
  rows this release activates, both `to-spec` on disk today:

  > | context-map tool generalization (deferred, not lift-and-shift) | agentplot/flywheel | … | to-spec |
  > | book skills into the plugin (deferred) | agentplot/flywheel | … | to-spec |

  Custody is already there; the release request asks the bolt conductor
  to move both rows from deferred to active, so no duplicate rows open in
  a second bolt. If the conductor prefers one flywheel-repo bolt for
  everything, these rows fold into `bolt-plugin-shape` instead and
  `bolt-flywheel-plugin` drops them — either way exactly one registry
  owns them.
- **Built repo:** `agentplot/flywheel`.
- **ADR lines:** none.

## Released task line and its assertion

- the context map as a distributable tool, with the book skills —
  unblocked, the repo is standing
  → `assertions/context-map-tool.md` (`State: open`, re-read this session)

## What disk says today

- The repo is standing: `agentplot/flywheel` has `tools/`, `skills/`,
  gates, CI, and the plugin resolves from blueprints — the blocker named
  at raise time is gone.
- The maps stay in blueprints and there are **three**:
  `context-map/maps/{current,target,configurations}.js` all exist —
  `configurations` with its own validation arm and viewer tab. The root
  `CLAUDE.md` still describes two maps; the extraction must not inherit
  that count.
- Generalizing is not a lift-and-shift, per the assertion's boundary:
  `context-map/schema.json` carries Willdan's tier enum, the blueprints
  host in its `$id`, `^books/` in three patterns, and a Geo IQ chapter in
  a description. The shape to design against is a CLI fed JSON.
- The book knowledge is poached from `system-design-inception` with its
  two defects fixed rather than copied
  (→ `assertions/marketplace-poach-defects.md` — its own `not this
  intent's` line covers fixing them at the source; the extraction must
  simply not import them).
- `context-map/book-grab.js` is a symlink into `books/` — the dependency
  the blueprints bolt names and makes optional before this builds.

## Waits on

1. The map-vocabulary row in `bolt-gates-and-config`
   (`assertions/map-topology-vocabulary.md`): the two-copy vocabulary is
   fixed before extraction, not carried into it. Cross-bolt wait,
   recorded on the extraction row.
2. The book-grab row in the same bolt: the viewer must work with no
   `books/` tree before it ships to repos that have none.

## Merge criteria (drafted against disk; the release gate is implied)

- The map application runs from the plugin against a map supplied from
  outside itself — a repo with no `books/` and no blueprints checkout —
  and renders all three map kinds' features (including the
  configurations arm).
- The travelling schema carries no Willdan residue: no tier enum, no
  blueprints host in `$id`, no `^books/` pattern, no Geo IQ text —
  grep-clean, with Willdan's specifics staying in blueprints' own maps
  and schema.
- Blueprints keeps working: `node context-map/bin/map-check.mjs --write`
  green against the extracted tool, all three maps validating.
- The book skills travel with the tool, so a writeback runs in a repo
  that has never seen `books/CLAUDE.md`; the two poach defects are
  demonstrably absent from the travelled copies.
