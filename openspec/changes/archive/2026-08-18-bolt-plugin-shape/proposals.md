# Proposals

| proposal | repo | change id | review | status | branch | owner |
|---|---|---|---|---|---|---|
| **bolt-shape** — a bolt bounds a delivery, the registry becomes a directory, spec agents get worktrees, the ADR trigger, the unintelligible passage | agentplot/flywheel | `bolt-schema-shape` | agent | specced | `bolt/plugin-shape` | - |
| **skills-shed** — both conductor skills shed the guidance written for their agents; the `opsx` commands are called, not described | agentplot/flywheel | - | agent | to-spec | - | - |
| **dispatch-triage** — the bolt route in dispatch triage with the test that decides it, and the on-demand start rule in the same profile | agentplot/flywheel | `dispatch-bolt-triage` | - | specced | `bolt/plugin-shape` | - |
| **prototype-location** — a throwaway is built in an isolated blank repo, wherever the spike-repo mandate is stated | agentplot/flywheel | `prototype-isolated-repo` | - | specced | `bolt/plugin-shape` | - |
| **design-center** — the skill moves into the plugin, `skills/interactive` points at it, the blueprints copy is deleted | agentplot/flywheel + willdan-blueprints | `design-center-skill` | - | specced | `bolt/plugin-shape` | - |
| **planned-tasks** — `skills/planned-tasks/` with its charge template, and its launch point in `skills/inception` | agentplot/flywheel | `planned-tasks-skill` | agent | specced | `bolt/plugin-shape` | - |
| **on-demand-state** — running · on-demand · parked in `bin/flywheel`, `skills/fleet` and its template manifest | agentplot/flywheel | `on-demand-fleet-state` | - | specced | `bolt/plugin-shape` | - |
| **plugin-resolution** — the fleet launch probes agent resolution before starting an actor, `--plugin-dir` the named fallback | agentplot/flywheel | `fleet-plugin-resolution` | - | specced | `bolt/plugin-shape` | - |
| **gate-machinery** — the desk-round gate and the explicit bolt-member field, everywhere the superseded inline-approval phrasing stands | agentplot/flywheel | `desk-round-release-gate` | agent | specced | `bolt/plugin-shape` | `spec-gate-machinery` |
| **merge-gate-fires** — `.config/wt.toml`'s checks move to a hook point the merge path reaches, proven by a probe on this repo | agentplot/flywheel | - | agent | to-spec | - | - |

## What each proposal carries, and the sources it is written from

Every source path below is relative to `openspec/changes/flywheel/` in
willdan-blueprints. A spec agent re-reads each from disk rather than
trusting the summary here.

- **bolt-shape** — `assertions/per-proposal-registry.md` ·
  `assertions/spec-agent-worktrees.md` · `assertions/adr-trigger.md` ·
  `assertions/bolt-schema-prose.md`. Four edits across the same files, so
  they are one proposal rather than four. The legacy `flywheel-bolt` schema
  in blueprints `openspec/schemas/` stays untouched: bolts bound to it are
  running, and reshaping a registry under a running bolt is the collision
  the directory design exists to end. The row reaches further than those
  files on the sources' own wording — every iteration reading, the root
  README, the bolt-conductor profile, the shared herdr reference, and the
  eval fixtures — because the sources say every reading is rewritten and
  that the rule comes out, not that four files change. It also carries two
  drifts its authoring agent found and verified: an eval expecting a
  `flywheel-bolt` change with a one-row table, and a main-spec requirement
  bounding spec review to one round that the on-disk skill replaced with
  judgement wording.
- **skills-shed** — `assertions/skills-shed-agent-guidance.md`, with the
  register question closed by `questions/skill-register.md` and
  `decisions/the-four-home-test.md`: a skill instructs with one clause of
  warrant. What comes out of the conductor skills goes where the dispatched
  agent reads it — the schemas' instructions and the session-type skills —
  and the shed is the row that decides where each rule lands.
- **dispatch-triage** — `assertions/dispatch-bolt-triage.md`.
  `agents/flywheel-dispatch.md` names the bolt route in its description
  today and carries no test that picks it, so every idea defaults to an
  intent. Grown 2026-08-10 by one sentence in the same file, found by
  `spec-on-demand-state` and routed here because this row is its only
  writer: the profile sends requests to `inbox/` "when it is parked", which
  is wrong under three states. Its warrant is
  `decisions/on-demand-conductors.md`, whose Consequences say dispatch's
  routing practice changes ahead of the machinery — a request for an actor
  that is off and not parked warrants a start, not a wait. The enumeration
  itself stays in that record and is carried into the machinery by
  `on-demand-state`, not restated here.
- **prototype-location** — the finding note at
  `sessions/2026-08-07-workflow-trigger/prototypes/schema-triggered-workflow.md`,
  which recorded its own use of `/tmp` as a forced deviation, plus the
  operator's direction that a throwaway is built in an isolated blank repo.
  The mandate has more bearers than the skill: the `flywheel-intent`
  schema's prototypes and tasks instructions, its prototype template, the
  prototype and research evals, and MODIFIED deltas for two main specs. A
  skill-only edit would leave the tree contradicting its own specs at
  verify time. It also reaches one line of the live sibling change
  `add-flywheel-loops`, whose unsynced delta would otherwise carry "code
  stays in the spike repo" back into a main spec after this row lands — a
  delta not yet synced is a future main spec, so the mandate comes out
  before it lands rather than after.
- **design-center** — `assertions/design-center-skill.md`. The assertion's
  boundary that the pointer cannot land yet is stale: the split landed and
  `skills/interactive` is now in the repo the skill moves to, so the
  pointer lands in this proposal. This is the one row that touches
  blueprints, and only to delete `.claude/skills/design-center/`.
- **planned-tasks** — `assertions/planned-tasks-conductor.md`. No profile
  and no schema: `bolt-no-spec` binds none, and plan mode replaces the spec
  step. The routing test is whether the change is already specified by the
  task text. The charge template ships with the skill and covers sources,
  tasks in scope, allowed and forbidden edits, pathspec commits,
  `--no-squash`, and who owns a shared tree. The name is open against the
  closed vocabulary in `openspec/config.yaml`.
- **on-demand-state** — `decisions/on-demand-conductors.md`, which is the
  only place the three-state enumeration is written down.
- **plugin-resolution** — `assertions/fleet-launch-plugin-resolution.md`. A
  broken plugin source surfaces today as a pane timeout with the cause
  invisible. This bolt reproduced that on its own first launch: five spec
  agents started in the flywheel bolt worktree and all five failed
  identically, `herdr agent start` reporting only "timed out waiting for
  agent startup" while the pane itself held the answer — `--agent
  'flywheel-construction-session' not found`, with no `flywheel-*` profile
  in the available list, because the plugin is not enabled in its own repo.
  The assertion is confirmed rather than assumed, and the row's job is to
  make the launch say that instead of the timeout.
- **merge-gate-fires** — routed by dispatch from `bolt-gates-and-config`,
  which declined to widen its own row into this repo. What travels is the
  rule, not the measurement: checks that gate a landing belong at a hook
  point the merge path reaches, and `[pre-commit]` is reached only when the
  merge has something to commit. `agentplot/flywheel` declares its three
  checks under `[pre-commit]` with no `[pre-merge]` — the same shape the
  defect was measured on — but the defect has not been reproduced here, so
  the row's first job is the probe. It is a row rather than a direct edit
  because where the hook point belongs is a judgement a reviewer has
  something to review, not a self-evident correction. It is declared
  `agent` for the same reason: a gate that reports green without running is
  the failure that hides every other failure.
- **gate-machinery** — `decisions/the-gate-is-inline.md` (amended
  2026-08-10) · `decisions/bolt-type-is-the-operators-choice.md`. Folded in
  by `extend-bolt` from `intent-flywheel` after that conductor's first
  attempt asserted a row here that had never existed; the record now
  carries its own correction, and the intent's task line reads released
  into this bolt as the ninth row. The amended record reverses a reading it
  first stated — it originally said the gate is explicitly not a
  plannotator round — so the spec cites the record as it now stands and the
  builder re-reads it rather than working from either summary.

## Serialization

These bind BUILDS, not specs. Specs run concurrently: a spec agent writes
under `openspec/changes/`, where no two collide, and a spec written against
a file a sibling will rewrite is met by citing anchors rather than line
numbers and by the build-time re-read task every change here carries.

Four rows write files another row also writes:

- **skills-shed** waits on **bolt-shape** — both rewrite
  `skills/construction/SKILL.md`, and the shed decides where the rules
  bolt-shape has just corrected come to rest.
- **planned-tasks** waits on **skills-shed** — both edit
  `skills/inception/SKILL.md`.
- **gate-machinery** waits on **planned-tasks** — third writer to
  `skills/inception/SKILL.md`. It edits the Handoff bullet and the channel
  table, which planned-tasks and skills-shed do not, so its place at the
  end of that chain is arbitrary and may be reordered freely if it is ready
  first.
- **plugin-resolution** waits on **on-demand-state** — both edit
  `bin/flywheel` and `skills/fleet/SKILL.md`.

These are orderings of writers to one file. Nothing in the later change
depends on the earlier one being correct, so a bounce upstream does not
bounce what waits on it.
