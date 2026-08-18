# Bolt: flywheel-plugin

## Scope
Move the flywheel machinery to `agentplot/flywheel` as a real plugin, per
the re-measured manifest in `flywheel/decisions/flywheel-repo-manifest.md`:
fifteen skills with their evals (the `flywheel-` prefix dropping to the
plugin namespace), the shared herdr reference, nine agent profiles (their
prefixes kept — bare-name resolution is the addressable surface), four
schemas (`flywheel-intent`, `bolt-{default,quick,deep}`), the
`add-flywheel-loops` change with the eight capabilities it deployed, and
the fleet layer rebuilt per `decisions/fleet-per-org.md` — `bin/flywheel`
finding an untracked `fleet.yaml` at the org folder root with
org-relative `cwd:` entries, targeting the org's named herdr session, and
a `fleet` skill wrapping it as `/flywheel:fleet`.

Blueprints then consumes the plugin: the moved machinery removed, the
plugin installed from the agentplot marketplace, the four schemas
installed as user schemas so live changes keep resolving by name
(`flywheel-bolt` stays as a project schema until its bolts archive), and
every skill invocation swept to the `flywheel:` namespace.

Released into this same bolt 2026-08-10, not lift-and-shift: the
context-map tool generalization and the book skills. The maps stay in
blueprints and there are three — `current`, `target`, `configurations`,
the third with its own validation arm and viewer tab; the travelling
schema sheds Willdan residue (the tier enum, the blueprints host in
`$id`, `^books/` in three patterns, a Geo IQ chapter in a description);
the book knowledge is poached from `system-design-inception` with its
two defects fixed rather than copied
(`flywheel/assertions/marketplace-poach-defects.md`). Build of both rows
waits on the `gates-books-and-map` row in `bolt-gates-and-config` — the
topology vocabulary written once, the viewer's `books/` dependency made
optional — landing first; spec does not wait.

No book chapter and no map-data move: the design loop owns those.

## Sources
- Intent `flywheel`, the migration Handoff released 2026-08-10 by the
  operator in the session that landed the loop layer:
  `assertions/flywheel-repo-split.md`, unblocked by
  `questions/deployed-specs-travel.md` closing (specs travel together)
  and `decisions/split-after-the-runs.md` rewritten to now.
- `decisions/flywheel-repo-manifest.md` — the travel manifest,
  re-measured 2026-08-10.
- `decisions/fleet-per-org.md` — fleets scope per GitHub org in named
  herdr sessions; the manifest lives at the org folder root, untracked.
- The context-map release, staged 2026-08-10 by the operator:
  `flywheel/sessions/2026-08-10-release-prep/release-context-map-tool.md`
  (what disk said at staging, the waits, the drafted merge criteria) and
  `flywheel/assertions/context-map-tool.md` (the claim and boundaries).

## Repos
- agentplot/flywheel · `bolt/flywheel-plugin` · worktree beside main
- willdan-blueprints · `bolt/flywheel-plugin` · worktree beside main

## Working arrangement
The operator drives this bolt from their own session, as with
bolt-loop-layer — conductor and builder the same session, by the
operator's explicit choice. The decisions are the spec; declared reviews
run as independent read-only agents before each repo's merge.

## Merge criteria
The release gates of both repos run unweakened. Beyond them, the
packaging checklist `split-after-the-runs.md` names:

- install clean from the agentplot marketplace;
- every profile launches by bare name (`claude --agent
  flywheel-intent-conductor` reaching the plugin copy);
- both loop skills and the type skills invoke by their namespaced names
  (`/flywheel:inception`, `/flywheel:fleet`);
- the four schemas resolve by name in blueprints from the user source
  (`openspec schema which` showing no dangling project reference);
- no absolute path survives into the plugin —
  `${CLAUDE_PLUGIN_ROOT}`-relative or org-relative only;
- blueprints grep-clean of the moved machinery: no `.claude/skills/
  flywheel-*` or `.claude/agents/flywheel-*` remaining, no reference to
  the retired repo-local `fleet/` path;
- the flywheel repo's own gates green, including `claude plugin
  validate` (or its gate script) over the populated plugin.

For the context-map rows, drafted at release:

- the map application runs from the plugin against a map supplied from
  outside itself — a repo with no `books/` and no blueprints checkout —
  and renders all three map kinds' features, the configurations arm
  included;
- the travelling schema is grep-clean of Willdan residue: no tier enum,
  no blueprints host in `$id`, no `^books/` pattern, no Geo IQ text —
  Willdan's specifics stay in blueprints' own maps and schema;
- blueprints keeps working: `node context-map/bin/map-check.mjs --write`
  green against the extracted tool, all three maps validating;
- the book skills travel with the tool, so a writeback runs in a repo
  that has never seen `books/CLAUDE.md`, and the two poach defects are
  demonstrably absent from the travelled copies.
