# Bolt: plugin-shape

## Scope

This bolt rewrites the flywheel plugin's own shape: the three bolt schema
members lose the sentence that equates a bolt with an iteration and gain a
registry that is a directory rather than a table; both conductor skills
shed the ~190 lines addressed to the agents they dispatch and call the
`opsx` commands by invocation instead of describing them; the spec-agent
worktree rule, the ADR trigger and the unintelligible schema passage all
move with them. Six smaller proposals ride alongside: dispatch gets the
triage test that routes an idea straight to a bolt, `skills/prototype`
names an isolated blank repo as where a throwaway is built, the
`design-center` skill moves out of blueprints into the plugin, a
planned-tasks skill and its launch point appear for `bolt-no-spec` work,
`bin/flywheel` and `skills/fleet` learn the on-demand state, a fleet launch
checks that the plugin resolves before it starts an actor, and the release
gate's machinery catches up with the amended rule that a release document
rides a desk round rather than an inline question. Eight of the intent's
task lines name `willdan-blueprints` as the repo; that prefix predates the
plugin split, and every file those lines describe is in `agentplot/flywheel`
today — the design-center deletion is the one edit that still lands in
blueprints.

## Sources

`intent-flywheel`, released by the operator 2026-08-10 as `bolt-default`,
staged by its `2026-08-10-release-prep` handoff session
(`openspec/changes/flywheel/sessions/2026-08-10-release-prep/release-bolt-plugin-shape.md`).
The eight handoff tasks:

- BATCH — the bolt's own shape, one handoff: the registry becomes a
  directory, spec agents get worktrees, the ADR trigger, and the
  unintelligible schema passage
- the conductor skills shed the guidance written for their agents
- dispatch triage that routes straight to a bolt
- `flywheel-prototype` says a throwaway is built in the spike repo; the
  operator directed an isolated blank repo instead
- promote the `design-center` scratch skill
- the planned-tasks conductor — skill and launch point; no profile, no
  schema
- the on-demand manifest state — `bin/flywheel` and the fleet skill carry
  running · on-demand · parked
- the fleet launch verifies plugin resolution before starting an actor,
  with `--plugin-dir` the declared fallback

Folded in 2026-08-10, released by the operator the same day on the amended
rule's own boundary and delivered as an `extend-bolt` from
`intent-flywheel`:

- the handoff skill, the release-request shape and `flywheel-intent`'s
  `apply.instruction` carry the amended desk-round gate, with the bolt
  member an explicit choice field in the release document
- `agentplot/flywheel`'s merge gate fires on the merge path — routed by
  dispatch after `bolt-gates-and-config` declined to widen its own row into
  this bolt's built repo, which is right: two bolts editing one repo's
  `.config/wt.toml` is the collision that bolt already serializes its rows
  to avoid

## Repos

- agentplot/flywheel · bolt branch `bolt/plugin-shape` · cut from that
  repo's `main` at `bb9f491` · worktree
  `~/.herdr/worktrees/.bare/bolt-plugin-shape`
- willdan-blueprints · bolt branch `bolt/plugin-shape` · cut from this
  repo's `main` · worktree
  `~/.herdr/worktrees/blueprints/bolt-plugin-shape`

**`~/.herdr/worktrees/.bare/bolt-plugin-shape` is the flywheel repo, not
blueprints.** Both repos label their bare directory `.bare`, so herdr
derives the same path from the same branch name for both; flywheel was cut
first and took it, and blueprints was given an explicit path. Every other
blueprints worktree on this machine sits under `.herdr/worktrees/.bare/`,
so the natural reading of that path is wrong here — check `git -C <path>
remote -v` rather than reading the directory name.

`herdr worktree create --cwd` takes the repo's parent folder, not its
`main/` checkout: `/Users/chuck/Code/github_agentplot/flywheel`, not
`.../flywheel/main`, which fails `linked_worktree_source`. Neither repo
configures `wt` post-start hooks — measured on both worktrees, so there is
nothing to run after a cut.

`bolt/flywheel-plugin` is still open in `agentplot/flywheel` with two
unmerged rows — the context-map tool and the book skills. Neither touches
a file this bolt edits: they add `tools/` and `skills/book-*`, while this
bolt's rows edit `schemas/`,
`skills/{construction,inception,prototype,interactive,handoff}`,
`skills/design-center`, `agents/flywheel-dispatch.md`, `bin/flywheel` and
`skills/fleet`. The two bolts can run at once, and each lands through the
release gate on its own.

Construction runs on nested worktrees off the bolt branches, one per
proposal. Four rows collide on files rather than on meaning:
`skills/construction/SKILL.md` has two writers (bolt shape, skills shed) and
`skills/inception/SKILL.md` has three (skills shed, planned tasks, gate
machinery). Those orderings serialize writers to one file; nothing in a
later change depends on an earlier one being correct.

## Merge criteria

The full release gate — `wt merge` with each repo's `.config/wt.toml`
hooks, unweakened, one writer to main at a time — is implied and never
waived. Its **evidence is the checks' recorded output, not the merge's exit
code**: `bolt-gates-and-config` and dispatch each measured, on
willdan-blueprints, a clean-tree `wt merge` that landed a deliberately
broken ref with exit 0 and no check run. I have not reproduced that run and
do not restate its mechanism. What I did measure, on
`agentplot/flywheel` `main` at `bb9f491` and blueprints `main` at
`9fe968cb`: both repos declare their checks under `[pre-commit]` and
neither declares `[pre-merge]`, and `~/.config/worktrunk/config.toml` sets
`squash = false`. The failing shape is therefore present in this bolt's
main repo too — unproven there rather than absent. So every landing in this
bolt runs its repo's checks by hand on the rebased tree and records the
output on the Merge task line, until `bolt-gates-and-config`'s
merge-gate-runs row lands and the gate is trustworthy on its own. On top of
that, on the bolt branch:

- `agentplot/flywheel`'s checks fire on the merge path, shown by a probe
  run on that repo rather than inherited from the blueprints one:
  a deliberately broken ref, a clean-tree `wt merge`, the checks observed
  running and the merge refused. `bolt-gates-and-config` supplies the probe
  recipe from its own row once it has run it for real.
- `devenv shell -- gates` runs all four checks from one definition, and is
  the by-hand runner every landing here uses.

- No schema member equates a bolt with an iteration; each states that a
  bolt bounds a delivery to main. `grep -rn "one construction iteration"
  schemas/` returns three hits on `agentplot/flywheel` `main` at `bb9f491`,
  one per member's `schema.yaml`. It returns nothing for
  `schemas/README.md`, which carries the same claim wrapped across a line
  break — so the grep is an aid and the criterion is the content.
- Each member's registry artifact generates a directory: one file per
  proposal carrying its state, what it waits on, and what it produced. Any
  at-a-glance table is described as generated from those files.
  `grep -rn "one table" schemas/` returns three hits today, one per member,
  and must return nothing.
- The passage opening "Two rules bind every section here" is gone or
  rewritten with a worked example, in all three members. It is present in
  all three today.
- `skills/construction` states that each spec agent works in its own
  worktree and commits its own work, and that the conductor merges the
  branch back. The do-not-commit and land-by-pathspec-once-idle rules are
  out; pathspec discipline stays wherever a tree is genuinely shared.
- `skills/construction` states that a Handoff line naming an ADR triggers
  the record, that the bolt conductor writes it first, before the code, and
  that it generates no proposal.
- Neither conductor skill carries a section addressed to the agents it
  dispatches; those rules live where the dispatched agent reads them — the
  schemas' instructions and the session-type skills. Both skills call
  `/opsx:ff`, `/opsx:continue` and `/opsx:archive` by invocation.
- `agents/flywheel-dispatch.md` states the bolt-route triage with the test
  that decides it.
- `skills/prototype` names the isolated blank repo as where a throwaway is
  built, and the spike repo no longer appears as the mandated location —
  it appears six times today, in the description, the Where section and the
  scope.
- `skills/design-center/SKILL.md` exists in the plugin and loads;
  `skills/interactive` points at it; blueprints
  `.claude/skills/design-center/` is deleted. Afterwards every surviving
  mention of the old path sits inside a record OF the move — this bolt's
  own artifacts, the assertion, the release-prep session, the intent's
  tasks — and none inside a skill, profile, schema, command or doc. The
  path appears seven times across those five files on blueprints `main` at
  `f5451d11`; the skill's own frontmatter carries no path at all, since
  `name: design-center` names the skill rather than its location.
- The planned-tasks skill exists with its charge template, and
  `skills/inception` carries its launch point and the routing test. Its
  name passes the closed vocabulary in `openspec/config.yaml`.
- `bin/flywheel`'s state set is running · on-demand · parked — it is
  `{"running", "parked"}` today — `flywheel status` renders all three, and
  `skills/fleet` documents them with dispatch as the on-demand starter,
  matching `decisions/on-demand-conductors.md`.
- A fleet launch against a deliberately broken plugin source reports the
  failure and names `--plugin-dir <checkout>` as the fallback. Exercised,
  with the output in the acceptance evidence, not asserted.
- The desk-round gate is stated once, the same way, in all three places it
  lives, with no superseded phrasing left standing anywhere:
  `schemas/flywheel-intent/schema.yaml`, whose `apply.instruction` says
  "the approval is asked for inline, once" today; `skills/inception`, whose
  Handoff bullet says the approval is "asked for with `AskUserQuestion` —
  explicitly not a plannotator or lavish round" and whose channel table
  already routes margin notes on an existing document to the desk; and
  `skills/handoff`, whose "What the release request carries" lists "the
  bolt member the work warrants" where the record requires an explicit
  choice field over quick · default · deep with the drafted member marked
  as the recommendation. The sweep is the WHOLE repo, root included:
  `grep -rn "inline approval\|asked for inline" .` returns THIRTEEN hits on
  `bolt/plugin-shape` at `abd5941` and must return nothing. Three are agent
  profiles, three are main specs — including `flywheel-inception-skill`,
  which this row already modifies — one is the intent schema, one is
  `README.md`, and five are eval material: an `evals.json` expectation and
  four fixture files that are copies of the profiles. Each fixture is
  re-copied byte-for-byte from its edited source rather than paraphrased: a
  fixture that drifts from the profile it stands in for makes the eval
  assert the superseded rule, which is the defect `bolt-shape` found in
  `skills/construction/evals/evals.json`.

  This criterion was wrong twice before it was right, and the pattern is
  worth keeping rather than tidying away. It first scoped the grep to
  `schemas/` and `skills/` and would have passed green with every other
  site standing; corrected to four directories it counted twelve; the
  authoring agent's own first count was five. Each round found more because
  each round widened where it looked, not because the tree moved. A count
  is only as good as its scope, and a criterion that names its scope
  narrowly is a criterion that passes for the wrong reason.
- `skills/handoff`'s "Your type opens no round" section is left standing.
  Measured on the same tree, it scopes the handoff *session* — which
  delivers to the bolt conductor and puts nothing in front of the operator
  — not the conductor's gate, so the amendment does not reach it. It is a
  checked exclusion, not an oversight.
- Every row declaring agent review is read against the decision records its
  assertion cites before its branch merges back.

Acceptance is batched on each bolt branch after two or three merge-backs,
never inside a construction worktree. `agentplot/flywheel` carries a
`.config/wt.toml`; its checks are what the gate runs, and the repo-readiness
audit is the first task below.
