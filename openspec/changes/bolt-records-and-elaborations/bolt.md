# Bolt: records-and-elaborations

## Scope
This bolt builds the two capabilities the operator gains once
`agentplot/flywheel`'s construction machinery matches the design book:
**a-systems-design-in-one-repo**, where the loops write their records onto
the book repo's (`blueprints`) main and the built repo (`agentplot/flywheel`)
holds only code and its implemented specs, so a system's whole design —
chapters, questions, decisions, bolt charters — lives in one repo and one
history; and **ruling-a-design-batch-once**, where a design batch is ruled
in at Ready and out at done, on the elaboration itself, rather than item by
item. Four changes total, roughly two days apiece, roughly four days
overall. Left out, to be re-derived when wanted rather than built here: the
file channels and escalation's threshold, the restart witness, the
landing's fix item, the book in the spec session's work order, the
born-ready and handoff births, the unit type and roadmap-field writers, the
session-type set, and the verification frame.

## Sources
- Milestone `bolt/records-and-elaborations` (`agentplot/flywheel` #34), its
  description the source of the Scope paragraph above.
- Derived from book `52fafa6` (this repo — `books/flywheel/src/
  bolt-planning.md`, "a unit is the user's proposal; rows are sized by the
  tree") and specs `6430df8` (`agentplot/flywheel` — the archived
  `the-defer-predicate-reads-a-closed-unit` change and
  `openspec/specs/flywheel-derived-backlog/spec.md`), the book and
  implemented-specs states the plan was carved against.
- Intent `flywheel` (`openspec/changes/intent-flywheel/` in this repo) is
  the design thread the milestone continues; its `design`, `planning` and
  `handoff` task sections carry the machinery decisions this bolt's
  proposals will cite.
- In flight beside this bolt, not folded into it: intent `flywheel` in this
  repo; `messy-repo-onboarding`, `site-teaches-the-system`, `observer` and
  `add-flywheel-loops` in `agentplot/flywheel`. Work folded in later is
  appended here with dates.

## Repos
- `agentplot/flywheel` · bolt branch `bolt/records-and-elaborations` ·
  worktree `/Users/chuck/Code/github_agentplot/flywheel/.bare.bolt-records-and-elaborations`
  (verified via `git worktree list` in that repo — the branch and its
  worktree already exist, cut before this record; a nested construction
  worktree, `build/records-are-written-beside-the-book`, is already open
  off it).

## Merge criteria
The merge gate (`wt merge`, on the exact rebased tree) is always implied
and never weakened. In `agentplot/flywheel` that gate runs three
`[pre-merge]` hooks, verified in `.config/wt.toml`: `manifests`
(`sh scripts/validate-manifests.sh`), `paths` (`node scripts/check-paths.mjs`)
and `site` (`node scripts/check-site.mjs`). Beyond it:

- The repo's unit suite (`sh scripts/test.sh`, verified in `tests/README.md`
  and in the script itself) is green on the bolt branch before landing.
  `scripts/test.sh` states deliberately that it is NOT wired into
  `[pre-merge]` — the hook addition needs an approval taken first — so this
  criterion is the bolt's own to check, not one `wt merge` enforces.
- No book chapter and no context-map move: the design this bolt implements
  already lives in `books/flywheel` at `52fafa6`, and every proposal here
  lands in `agentplot/flywheel` only.
- The `bolt-quick` schema this bolt binds schedules no review step
  (`loop.extensions: []`, verified in the bound schema's `schema.yaml`) —
  picked for small, mechanical work where a wrong claim is cheap to catch.
  No row's review column is assumed `agent` or `human` by default; each
  proposal declares its own review, if any, when its row is added.

Landing: merge
