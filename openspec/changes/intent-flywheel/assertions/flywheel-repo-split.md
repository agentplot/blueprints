# Assertion: the machinery migrates to agentplot/flywheel

- **Repo:** agentplot/flywheel
- **State:** built — bolt-flywheel-plugin: agentplot/flywheel at b5d308b+bb9f491, blueprints at 61d16424, 2026-08-10. The end-to-end runs follow against the plugin per the rewritten split-after-the-runs.
- **Raised by:** decisions/flywheel-own-repo.md

## The claim
The machinery moves per the manifest: seven skills with their `evals/` and
`reference/`, the agent profiles, every flywheel schema, and
`add-flywheel-loops`. Skills drop the `flywheel-` prefix into
`skills/<name>/`; profile names stay as they are. Both schemas publish as
user schemas. Root `CLAUDE.md`'s flywheel section travels with it. The
acceptance checklist is its own: install `flywheel@flywheel` clean, launch
every profile, invoke both skills namespaced, resolve the schemas from the
user source, and confirm no absolute path survived `${CLAUDE_PLUGIN_ROOT}`.

## Why
→ decisions/flywheel-repo-manifest.md · decisions/split-after-the-runs.md
→ sessions/2026-08-06-flywheel-repo-split/migration-plan.md

## Boundaries
The three rewritten chapters are NOT here — they name the same paths and go
stale the same day, but a chapter is the design loop's and a bolt carries
none (→ decisions/blueprints-is-a-built-repo.md). They are the Writeback
task this names as its sibling. Whether the eight deployed capabilities
travel with `add-flywheel-loops` is an open Design question this waits on.
The re-edit query excludes `decisions/`, `sessions/` and `changes/archive/`;
a decision record's paths are not rewritten by the move.
