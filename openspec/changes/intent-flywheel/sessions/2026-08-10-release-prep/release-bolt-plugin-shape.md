# Staged release: bolt-plugin-shape — the machinery's own shape, in its own repo

- **Built repo:** `agentplot/flywheel`
  (`/Users/chuck/Code/github_agentplot/flywheel/main`); one proposal also
  touches willdan-blueprints on that bolt's own blueprints branch (the
  design-center deletion).
- **Bolt member:** `bolt-default`. The batch rewrites the loop's own
  schemas and both conductor skills — work whose defects propagate into
  every later bolt, so the declared agent review is worth its rounds.
  `bolt-quick` would fit none of the four largest rows.
- **Owner:** `chuck` — same record as `bolt-loop-layer` and
  `bolt-flywheel-plugin` (`owner:` in `.openspec.yaml`).
- **ADR lines:** none in this batch.

## Released task lines and their assertions

All assertion states re-read from disk this session: every one `State: open`.

1. BATCH — the bolt's own shape, one handoff
   → `assertions/per-proposal-registry.md` ·
   `assertions/spec-agent-worktrees.md` · `assertions/adr-trigger.md` ·
   `assertions/bolt-schema-prose.md`
2. the conductor skills shed the guidance written for their agents
   → `assertions/skills-shed-agent-guidance.md`
3. dispatch triage that routes straight to a bolt
   → `assertions/dispatch-bolt-triage.md`
4. `flywheel-prototype` and the practice disagree on where a throwaway is
   built
   → `sessions/2026-08-07-workflow-trigger/prototypes/schema-triggered-workflow.md`
5. promote the `design-center` scratch skill
   → `assertions/design-center-skill.md`
6. the planned-tasks conductor — skill and launch point
   → `assertions/planned-tasks-conductor.md`
7. the on-demand manifest state
   → `decisions/on-demand-conductors.md`
8. the fleet launch verifies plugin resolution
   → `assertions/fleet-launch-plugin-resolution.md`

## Draft registry rows

| proposal | repo | review | waits on |
|---|---|---|---|
| bolt shape (the BATCH, one proposal): registry becomes a directory, a bolt bounds a delivery, spec-agent worktrees, the ADR trigger linkage, the unintelligible passage | agentplot/flywheel | agent | — |
| conductor skills shed agent guidance; `/opsx:ff` · `/opsx:continue` · `/opsx:archive` called, not described; review comments applied across siblings | agentplot/flywheel | agent | bolt shape (same files: `skills/construction`, `skills/inception`) |
| dispatch bolt-route triage, with the test that decides it stated | agentplot/flywheel | — | — |
| prototype skill: throwaway in an isolated blank repo, per the operator's direction | agentplot/flywheel | — | — |
| design-center promotion: add `skills/design-center/`, pointer from `skills/interactive`, delete blueprints `.claude/skills/design-center/` | agentplot/flywheel + willdan-blueprints | — | — |
| planned-tasks conductor: the `bolt-no-spec` skill with its charge template, launch point in `skills/inception` | agentplot/flywheel | agent | skills shed (same file: `skills/inception`) |
| on-demand manifest state in `bin/flywheel` and `skills/fleet` | agentplot/flywheel | — | — |
| fleet launch verifies plugin resolution, `--plugin-dir` the declared fallback | agentplot/flywheel | — | on-demand row (same files: `bin/flywheel`, `skills/fleet`) |

`waits on` entries are file-collision serializations, not semantic
dependencies; the conductor may instead merge colliding rows into one
proposal.

## What disk says today, per row

**Bolt shape.** All three family schemas
(`schemas/bolt-{default,quick,deep}/schema.yaml`) open with "A bolt is one
construction iteration", and `schemas/README.md` carries "one construction
iteration each". `bolt-default`'s registry instruction still says "the one
table" with "one row per proposal". The passage "Two rules bind every
section here…" sits in all three schemas (near line 53). The
`spec-agent-worktrees` target is live: `skills/construction/SKILL.md`
carries "Spec agents sharing a bolt worktree do not commit" (line 135) and
the idle-observation rule. The ADR residual is the linkage only —
`flywheel-intent`'s Handoff instruction already carries the line contents
and `skills/construction` already carries the log4brains direct-edit
passage; missing is that a Handoff line *triggers* the record and that it
is written *first, before the code*. The legacy `flywheel-bolt` schema in
blueprints `openspec/schemas/` is **out of scope**: it exists only until
the bolts bound to it archive, and reshaping a registry under a running
bolt is the collision the directory design exists to end.

**Skills shed.** `skills/construction/SKILL.md` is 517 lines with the
reads-as-instruments section at ~241–280 and the state-claim rules at
~313–350; `skills/inception/SKILL.md` is 595 lines. Both already call
`/opsx:continue` explicitly in places; the shed finishes the job. The
register question is closed (`questions/skill-register.md`,
`decisions/the-four-home-test.md`): a skill instructs with one clause of
warrant.

**Dispatch triage.** `agents/flywheel-dispatch.md` (52 lines) names the
bolt route in its description ("a request to a running bolt") but carries
no triage test that picks it; every idea defaults to an intent.

**Prototype skill.** `skills/prototype/SKILL.md` mandates a spike-repo
worktree in its description, its Where section, and its scope. The
operator directed an isolated blank repo; the workflow-trigger prototype
used `/tmp` and recorded the deviation as forced.

**Design-center.** Blueprints `.claude/skills/design-center/SKILL.md` is
tracked, complete, referenced by nothing. The assertion's boundary "the
pointer cannot land yet" is stale: the split landed, `skills/interactive`
is in the same repo the skill moves to, so the pointer lands in this
proposal.

**Planned-tasks conductor.** No skill directory for the practice exists in
the plugin; `skills/inception/SKILL.md` has zero mentions of `bolt-no-spec`
or plan mode; `skills/construction/SKILL.md` line 12 already names
`bolt-no-spec` binds no schema. No new profile, no schema — the routing
test is "is the change already specified by the task text?", and the
charge template ships with the skill (sources, tasks in scope, allowed and
forbidden edits, pathspec commits, `--no-squash`, tree-sharing ownership).
Naming is open against the closed vocabulary.

**On-demand.** `bin/flywheel` line 43: `STATES = {"running", "parked"}`.
`skills/fleet/SKILL.md` documents running and parked only. The enumeration
to copy is in `decisions/on-demand-conductors.md` and nowhere else:
running · on-demand · parked.

**Plugin resolution.** `bin/flywheel` contains no resolution check and no
mention of `--plugin-dir`; a broken plugin source today surfaces as a pane
timeout with the cause invisible.

## Merge criteria (drafted against disk; the release gate is implied)

- `grep -rn "one construction iteration" schemas/` returns nothing —
  schema files and `schemas/README.md` both — and each member states that
  a bolt bounds a delivery to main.
- Each bolt member's registry artifact generates a directory: one file
  per proposal carrying state, what it waits on, and what it produced;
  any at-a-glance table is described as generated from the files.
  `grep -n "one table" schemas/` returns nothing.
- The "Two rules bind every section here" passage is gone or rewritten
  with a worked example, in all three members.
- `skills/construction` states: each spec agent works in its own worktree
  and commits its own work; the conductor merges the branch back. The
  do-not-commit and land-by-pathspec-once-idle rules are out, with
  pathspec discipline retained wherever a tree is genuinely shared.
- `skills/construction` states the bolt conductor writes an ADR when a
  Handoff line names one, first, before the code, generating no proposal.
- Neither conductor skill carries a section addressed to the agents it
  dispatches; those rules live where the dispatched agent reads them (the
  schemas' instructions and the session-type skills). Both skills call
  `/opsx:ff`, `/opsx:continue`, `/opsx:archive` by invocation.
- `agents/flywheel-dispatch.md` states the bolt-route triage with its
  deciding test.
- `skills/prototype` names the isolated blank repo as where a throwaway
  is built, and the spike repo no longer appears as the mandated
  location.
- `skills/design-center/SKILL.md` exists in the plugin and loads;
  `skills/interactive` points at it; blueprints `.claude/skills/design-center/`
  is deleted; no other reference dangles (grep both repos).
- The planned-tasks skill exists with its charge template;
  `skills/inception` carries its launch point and the routing test.
- `bin/flywheel`'s state set is running · on-demand · parked; `flywheel
  status` renders all three; `skills/fleet` documents them with dispatch
  as the on-demand starter, matching `decisions/on-demand-conductors.md`.
- A fleet launch against a deliberately broken plugin source reports the
  failure and names `--plugin-dir <checkout>` as the fallback instead of
  timing out — exercised, not asserted.
- Every `agent`-review row is read against the decision records its
  assertion cites before its branch merges.

## Sequencing

The bolt-shape proposal lands before the skills shed (both rewrite
`skills/construction`); the shed lands before the planned-tasks launch
point (both edit `skills/inception`). Nothing here waits on the
blueprints bolt or on `bolt-flywheel-plugin`.
