# Tasks

A line is a checkbox, a blocker and a pointer. Sections are session types.
Every line names the `questions/<slug>.md` it answers or the
`assertions/<slug>.md` it builds. A line charged to a session names it as
`[sess: <dir>]`; several lines charged to one session is the normal case,
and the session is the merge boundary.

## design
- [x] how the plugin chapters fold into the loop chapters
      → decisions/plugin-chapters-fold.md · sessions/2026-08-06-chapters-and-channels/
- [x] does a lone generated proposal skip the bolt
      → decisions/every-handoff-is-a-bolt.md · sessions/2026-08-06-chapters-and-channels/
- [x] what replaces the books' `proposals.md` chapter
      → decisions/proposals-chapter-retires.md · sessions/2026-08-06-chapters-and-channels/
- [x] which human-in-the-loop channel applies when
      → decisions/human-loop-channels.md · decisions/bridged-singleton.md
- [x] the launch points for plannotator and lavish
      → decisions/review-launch-points.md · decisions/design-session-steering.md
- [x] does flywheel move into its own repo, and what it costs
      → decisions/flywheel-own-repo.md · decisions/flywheel-repo-manifest.md ·
      decisions/split-after-the-runs.md · sessions/2026-08-06-flywheel-own-repo/
- [x] does an intent conductor get a route to dispatch — no such leg, by
      decision
      → decisions/message-envelopes.md · questions/dispatch-route-from-intent.md
- [x] does an agent respond against its work item by ID — yes, `re:` is a
      change-relative path
      → decisions/message-envelopes.md · questions/respond-by-work-item-id.md
- [x] where the herdr reference lives, and whether `conduct` retires
      → decisions/the-herdr-reference-package.md ·
      questions/herdr-reference-and-conduct.md
- [x] which register the loop skills are written in — a skill instructs with
      one clause of warrant
      → decisions/the-four-home-test.md · questions/skill-register.md
- [x] the workflow mechanism — `apply.instruction` holds a prompt, and
      Claude Code authors the workflow from it each run
      → decisions/dynamic-workflows-drive-the-loop.md
- [x] the bolt schemas differentiated — four, not five; chore and fast
      differed only by latitude every member has
      → decisions/the-bolt-schema-family.md
- [x] the session-type taxonomy — thirteen types under three profiles
      → decisions/session-types-are-the-task-taxonomy.md ·
      decisions/agent-profiles.md
- [x] the envelope shapes — one fenced block for both transports
      → decisions/message-envelopes.md
- [ ] is a persona's unasked question evidence the intent was incomplete
      → questions/persona-question-as-signal.md
- [x] does rule 1 get amended for workflows, or do phases launch herdr
      agents? Amended narrowly: sessions are the only mutating calls a
      workflow makes and run isolated; other `agent()` calls get no
      worktree. The same answer added model defaults by session type,
      overridable via args
      → decisions/rule-1-amended-for-workflow-sessions.md ·
      decisions/session-model-defaults.md
      → questions/rule-1-and-workflow-agents.md
- [x] what makes the fan-out actually happen — the INVOCATION carries
      "build a dynamic workflow"; the schema says nothing about workflows
      at all. 24/24 across three arms, including under the real conductor
      profile. Stripping the schema improved the loop: 25/26 built
      multi-pass rather than single-pass
      → decisions/the-trigger-lives-in-the-invocation.md ·
      questions/workflow-trigger-reliability.md
- [ ] one Discord bridge per org, or one bot with per-org routing
      → questions/discord-bridge-per-org.md
- [x] dispatch starts a parked conductor when routed work arrives — the
      on-demand manifest state, closed on the operator's direction
      → decisions/on-demand-conductors.md
- [x] the bolt type is the operator's choice at release, presented as an
      option set in the approval question — closed on the operator's word
      → decisions/bolt-type-is-the-operators-choice.md
- [ ] what visibility a conductor owes at a workflow launch — announce,
      name, or ask above a threshold
      → questions/workflow-launch-visibility.md
- [ ] how a session knows the operator's desk is free — serializing desk
      rounds across parallel loops
      → questions/desk-round-collision.md
- [ ] the floor of process for small work inside a tracked scope — what
      earns ceremony
      → questions/small-work-process-floor.md
- [ ] what earns a plannotator round — the threshold criterion for drafts
      → questions/round-threshold.md
- [ ] does the loop need limit-awareness — stall vs settle, critical
      sections, a fleet pause
      → questions/usage-limit-stalls.md
- [x] the release gate's channel — the release document rides the desk
      round, closed on the operator's word, reversing the record's first
      reading; carrying it into the machinery rides bolt-plugin-shape
      → decisions/the-gate-is-inline.md ·
      decisions/bolt-type-is-the-operators-choice.md

## prototype
- [x] the loop layer's two unmeasured joints. The gate opens —
      `apply.instruction` alone made a cold agent author and run a workflow,
      4/4 — and the fan-out works, an agent inferring dependencies from
      prose with no declared edges. Neither is the risk: the instruction
      fired 1 of 3 on a cold prompt, walking silently past itself, and herdr
      saw 0 of 6 workflow agents
      → prototypes/schema-triggered-workflow.md ·
      questions/rule-1-and-workflow-agents.md ·
      questions/workflow-trigger-reliability.md
- [x] measure SendMessage as the live envelope transport — delivery lands in
      the receiving turn, fleet name as address; a socket-delivered slash
      command lands as plain text and is NOT executed, so herdr keeps the
      launch leg and the bin/flywheel socket extension dies
      → prototypes/sendmessage-transport.md · questions/sendmessage-transport.md ·
      decisions/message-envelopes.md

## planning
- [x] what becomes of `book-decompose` — closed on the operator's word
      → decisions/book-decompose-retires.md
- [x] session types as schema types, weighed against skills
      → decisions/session-types-are-skills.md
- [x] how parallel design sessions stay isolated
      → decisions/session-worktrees.md · sessions/2026-08-06-book-writeback/report.md finding 4
- [ ] do rocs-kit's section directories get index pages
      → questions/rocs-kit-index-pages.md
- [x] do the eight deployed capabilities travel with `add-flywheel-loops`
      — yes, together: the change and its specs are one subject (the
      operator, 2026-08-10)
      → questions/deployed-specs-travel.md
- [ ] deferred: where dispatch runs — becomes an ADR in the flywheel repo
      → questions/dispatch-in-the-cloud.md
- [ ] how a machine pins the flywheel plugin — directory source from the
      live checkout, or the github marketplace with a populated cache the
      declarative setup must produce
      → questions/plugin-marketplace-source.md

## research
- [x] do the schema instructions alone produce correct artifacts
      → decisions/session-directories.md · sessions/2026-08-06-schema-dogfood/
- [x] bridge triggering, and whether a webhook receiver earns its keep
      → decisions/bridged-singleton.md · sessions/2026-08-06-chapters-and-channels/
- [x] settle the standing singleton's name
      → decisions/dispatch-singleton-name.md
- [x] where verification docking binds — deferred, with its re-open trigger
      → decisions/bolt-verification-punt.md
- [x] what a skill can declare in its frontmatter — nothing that names an
      agent type, measured across 467 SKILL.md and 104 agent files. The
      pairing rules cannot collapse
      → decisions/agent-profiles.md · questions/skill-frontmatter.md
- [ ] one intent through the design loop end to end, subject
      `spike-context-cleanup` — unblocked: assertions/dynamic-workflow-layer.md
      built at ecfb85bc, 2026-08-10
      → sessions/2026-08-06-e2e-design-loop/E2E-design-loop.md §1–§3
- [ ] one released handoff through construction end to end
      (blocked by: the design-loop run reaching an approval)
      → sessions/2026-08-06-e2e-construction/E2E-construction.md §4–§7
- [ ] a fast local eval for the flywheel itself
- [ ] a merge end to end, scripted in herdr, against a contrived data project

## writeback
- [x] book: rewrite `conducting.md` and `authoring-capabilities.md` as the
      actor-model design
      → sessions/2026-08-06-book-writeback/report.md
- [x] book: rewrite `spec-driven-construction.md` around the pipeline stages
      → sessions/2026-08-06-book-writeback/report.md
- [x] book: retire five chapters and rewrite `system-design.md`, with
      `SUMMARY.md`, `vocabulary.md`, `walkthrough.md`, `index.md`,
      `foundations.md`, `agent-workspaces.md`, `verifications.md` following
      → sessions/2026-08-06-book-writeback/report.md
- [x] request: repoint `add-flywheel-loops`' four citations of the moved
      `flywheel/E2E.md`
      → openspec/changes/add-flywheel-loops/inbox/2026-08-06-intent-flywheel-e2e-moved.md
- [x] book: retire `src/proposals.md` from the six kit books — six chapters
      and 3,117 lines gone, 47 references repaired across 33 chapters
      → sessions/2026-08-06-kit-books-proposals-retire/report.md
- [x] book: repair the dead links the flat-book link rule caused — 56
      repaired, 103 → 47, every one retargeted in place
      → sessions/2026-08-06-dead-link-repair/report.md
- [ ] book: three bare names in `rocs-kit/src/verification.md` whose chapters
      sit in subdirectories — `harnesses.md` → `conductor/`,
      `kb-provider-interface.md` and `alternate-backends.md` → `knowledge/`
      → sessions/2026-08-06-dead-link-repair/report.md finding 2
- [ ] book: `session-management.md` and `agent-workspaces.md` carry a board
      and work-item model that predates the flywheel — decide whether they
      read as one design with `conducting.md`, and rewrite them if so
      → sessions/2026-08-06-book-writeback/report.md finding 5
- [ ] book: re-edit `conducting.md`, `authoring-capabilities.md` and
      `spec-driven-construction.md` for the repo split — unblocked:
      assertions/flywheel-repo-split.md built 2026-08-10. The same
      re-edit of `spec-driven-construction.md` also retargets its commit
      stage sentence ("by its worktree pre-commit hook"), which goes
      stale the moment bolt-gates-and-config's merge-gate-runs row lands
      — that half waits on the row; the repo-split half does not
      → decisions/split-after-the-runs.md
- [ ] book: retarget the 19 dead links in eight atlas-kit chapters to
      rocs-kit's section-head chapters
      (blocked by: the open-questions round upholding the rocs-kit-index-pages
      draft)
      → sessions/2026-08-10-open-questions-planning/drafts/rocs-kit-index-pages.md

## handoff
Blueprints is this intent's built repo for everything that is not a book
chapter or a map move (→ decisions/blueprints-is-a-built-repo.md).

- [x] willdan-blueprints: rename `flywheel-intake` to `flywheel-dispatch`
      → bolt-dispatch-rename · archived `2026-08-06-rename-dispatch-profile` ·
      landed 6935cbd..1de95a7, verified by launching both names
- [x] willdan-blueprints: carry the settled batch into both loop skills, then
      run `skill-creator` over them so they ship with evals
      → bolt-flywheel-machinery
- [x] willdan-blueprints: the state-claim rule and its three corollaries
      → bolt-flywheel-machinery · now in both skills and the bolt schema
- [x] willdan-blueprints: the one-answer rule
      → 761a7a0 · now in `flywheel-inception` and the bolt schema
- [x] willdan-blueprints: the routing rule — routing does not transfer the
      obligation
      → 761a7a0 · now in both skills
- [x] willdan-blueprints: the true-strength rule
      → 761a7a0 · now in both skills
- [x] willdan-blueprints: a mechanism is not a justification
      → 761a7a0 · now in `flywheel-construction` and the bolt schema
- [x] willdan-blueprints: split `flywheel-design-session` in two and write
      the five session-type skills, all shipping with evals
      → decisions/session-types-are-skills.md · bolt-flywheel-machinery
- [x] willdan-blueprints: the schema instruction edits — launch pointer, the
      Writeback/Handoff converse, the ADR type retiring, the one-row registry
      → decisions/adr-is-a-handoff.md · bolt-flywheel-machinery
- [x] willdan-blueprints: drop the per-book proposals-chapter requirement and
      rewrite the pipeline as chapter → intent → handoff → bolt
      → bolt-flywheel-machinery · the link-rule half did not land, and is
      assertions/books-guide-link-rule.md
- [x] willdan-blueprints: root `CLAUDE.md` names the flywheel entry points
      → bolt-flywheel-machinery
- [x] willdan-marketplace: retire the `openspec-construction` plugin family
      and `conductor-inception`, on the three-limb test
      → bolt-flywheel-machinery
- [x] willdan-blueprints: `check-mermaid.mjs` resolves its main-worktree
      fallback to `.bare`, failing the gate in every herdr-cut worktree
      → bolt-blueprints-tooling
- [x] willdan-blueprints: the books gate resolves no link target — add the
      check, reporting only, ceiling derived from the merge target
      → bolt-blueprints-tooling
- [x] willdan-blueprints: the commit instruction cannot hold once agents
      share a tree — stage only the paths you wrote
      → decisions/session-worktrees.md · bolt-blueprints-tooling
- [x] willdan-blueprints: the books preview watcher stops starting in session
      and construction worktrees
      → decisions/session-worktrees.md · 9973194
- [x] willdan-blueprints: carry the retro's accepted findings — absorbing
      `conduct` and closing the vocabulary
      → decisions/the-closed-vocabulary.md · decisions/bolt-conductor-latitude.md ·
      0c01d5f..6fc151c
- [x] agentplot/flywheel: stand up the repo — manifests, OpenSpec, README,
      Pages landing, four gates
      → decisions/flywheel-own-repo.md · sessions/2026-08-06-flywheel-repo-split/
- [x] BATCH — the loop layer, one handoff: released 2026-08-10 with the
      session-type set into bolt-loop-layer, built and landed on main at
      ecfb85bc — the loop shapes in bolt-{default,quick,deep} and
      flywheel-intent, the invocation in both conductor profiles, the
      envelopes in config, the shared herdr reference, the persona
      profiles, the fleet manifest with its command, and the owner
      record. The eight skills' evals remain the bolt's open task
      → decisions/rule-1-amended-for-workflow-sessions.md ·
      decisions/session-model-defaults.md · decisions/the-work-order.md
      → assertions/dynamic-workflow-layer.md · assertions/bolt-schema-family.md ·
      assertions/message-envelopes.md · assertions/persona-construction.md
- [x] BATCH — the bolt's own shape, one handoff: the registry becomes a
      directory, spec agents get worktrees, the ADR trigger, and the
      unintelligible schema passage. All four edit `flywheel-bolt` and
      `flywheel-construction`
      → assertions/per-proposal-registry.md · assertions/spec-agent-worktrees.md ·
      assertions/adr-trigger.md · assertions/bolt-schema-prose.md
      · released 2026-08-10 into bolt-plugin-shape · proposals observed
      on its registry (8 rows)
- [x] willdan-blueprints: the conductor skills shed the guidance written for
      their agents — ~190 lines that are rules for the agents a conductor
      dispatches, not for the conductor. Unblocked: the register question
      closed, and a skill instructs with one clause of warrant
      → assertions/skills-shed-agent-guidance.md
      · released 2026-08-10 into bolt-plugin-shape · proposals observed
      on its registry (8 rows)
- [x] willdan-blueprints: dispatch triage that routes straight to a bolt
      → assertions/dispatch-bolt-triage.md
      · released 2026-08-10 into bolt-plugin-shape · proposals observed
      on its registry (8 rows)
- [x] willdan-blueprints: `.claude/commands/opsx/apply.md` contradicts the
      loop it would carry — step 3 runs the full `--json` handing over
      `tasks[]`, step 6 says "for each pending task… continue to next task".
      Verbatim what the loop prompt forbids, and why arms A and B re-queried
      8/8
      → decisions/the-trigger-lives-in-the-invocation.md
      · released 2026-08-10 into bolt-gates-and-config · proposals
      observed on its registry (3 rows)
- [x] willdan-blueprints: `flywheel-prototype` says a throwaway is built in
      the spike repo; the operator directed an isolated blank repo instead,
      and the prototype used /tmp. The skill and practice disagree
      → sessions/2026-08-07-workflow-trigger/prototypes/schema-triggered-workflow.md
      · released 2026-08-10 into bolt-plugin-shape · proposals observed
      on its registry (8 rows)
- [x] agentplot/flywheel: promote the `design-center` scratch skill. It
      exists at `.claude/skills/design-center/` in blueprints on the
      operator's word, referenced by nothing; the handoff is moving it to
      the repo it belongs in, not writing it
      → assertions/design-center-skill.md
      · released 2026-08-10 into bolt-plugin-shape · proposals observed
      on its registry (8 rows)
- [x] willdan-blueprints: `openspec/config.yaml` names the old task sections
      while the schema names the new ones — same agent, same payload, both
      settled voice
      → assertions/config-task-sections.md
      · released 2026-08-10 into bolt-gates-and-config · proposals
      observed on its registry (3 rows)
- [x] willdan-blueprints: `openspec validate --strict` green is not evidence
      an artifact is contract-shaped — the check that works is diffing it
      against its own instructions, plus a requirement/scenario count. Into
      `openspec/config.yaml`'s context, since every spec-driven change in
      every repo has the gap
      → assertions/validate-is-not-evidence.md
      · released 2026-08-10 into bolt-gates-and-config · proposals
      observed on its registry (3 rows)
- [x] not this intent's: report two upstream OpenSpec defects — the
      four-name allowlist in `parseDeltas` that silently drops requirements
      under any other heading, and the Purpose check that never reaches
      delta specs inside a change
      → assertions/validate-is-not-evidence.md
      · carried-open at dispatch 2026-08-10 — the report-out is dispatch's
      obligation until filed or declined on the operator's word
- [x] willdan-blueprints: the planned-tasks conductor — skill and launch
      point; no profile, no schema
      → assertions/planned-tasks-conductor.md
      · released 2026-08-10 into bolt-plugin-shape · proposals observed
      on its registry (8 rows)
- [x] willdan-blueprints: `books/CLAUDE.md`'s link rule becomes depth-aware.
      Landed in `ac3d289`, verified on local main 2026-08-07 at lines
      310–347; the absence reports had read stale `origin/main`
      → assertions/books-guide-link-rule.md
- [x] BATCH — the books gate and the map tool, one handoff: refuse
      `SUMMARY.md` as a link target, write the topology vocabulary once, and
      name the viewer's `books/` dependency
      → assertions/summary-not-a-link-target.md ·
      assertions/map-topology-vocabulary.md · assertions/book-grab-symlink.md
      · released 2026-08-10 into bolt-gates-and-config · proposals
      observed on its registry (3 rows)
- [x] agentplot/flywheel: the migration — built and landed by
      bolt-flywheel-plugin, 2026-08-10: the plugin at b5d308b+bb9f491 on
      GitHub, blueprints consuming it at 61d16424, the fleet per-org in
      its own herdr session with the manifest at the org folder root.
      Open in the bolt: the eval-format conversion; deferred rows for the
      context-map tool and book skills
      → assertions/flywheel-repo-split.md · decisions/fleet-per-org.md
- [x] agentplot/flywheel: the context map as a distributable tool, with the
      book skills — unblocked, the repo is standing
      → assertions/context-map-tool.md
      · released 2026-08-10 into bolt-flywheel-plugin · both rows active
      at 0438da38, cross-bolt waits recorded
- [x] willdan-blueprints: the session-type set — eight skills (the seven
      construction types plus handoff), the third host profile, both
      renames swept tree-wide — built in bolt-loop-layer, landed at
      ecfb85bc
      → assertions/session-type-set.md
- [x] not this intent's: `willdan-marketplace` has no merge gate
      → assertions/marketplace-gate.md
      · routed 2026-08-10 → intent marketplace-gate, filed at 200e973b
- [x] not this intent's: fix the two defects in the book material the
      flywheel repo poaches
      → assertions/marketplace-poach-defects.md
      · routed 2026-08-10 → intent marketplace-gate, one handoff sequenced
      behind the gate
- [x] not this intent's: the commissioning template ships two dead book links
      into every repo scaffolded from it
      → assertions/commissioning-template-links.md
      · done as a dispatch chore, 5b34b43d — both links unlinked, books gate
      green
- [ ] deferred: does anything call `openspec-devportal`?
      → assertions/devportal-caller.md
- [x] not this intent's: `maps/current.js` node `pk.lakehouse-ref` refs a
      deleted lakehouse chapter — routed to intent-kit-lift 2026-08-10,
      carried and closed the same day: node repointed to the chapter's
      atlas-kit home at c5cc09b0, map-check exit 0 on main, observed here.
      The ERROR-exits-0 claim routed with it was refuted by
      bolt-gates-and-config and confirmed here: map-check already exits 1;
      the conductor's 'exit 0' was a pipeline $? reading tail, the
      state-claim corollary failed by its own author a second time
- [x] not this intent's: `wt merge` printed ✓ over a tree where
      `wt hook pre-commit` fails — mechanism identified by
      bolt-gates-and-config from `wt merge --help`: the three checks sit
      under `[pre-commit]`, which fires only when the merge itself
      commits; hand-committed branches and the missing `[pre-merge]`
      section mean no merge path gates a landing. Carried as that bolt's
      `merge-gate-runs` row, observed on its registry 2026-08-10. Until
      it lands, this conductor runs `wt hook pre-commit` by hand before
      every merge
- [x] agentplot/flywheel: the on-demand manifest state — `bin/flywheel` and
      the fleet skill carry running · on-demand · parked
      → decisions/on-demand-conductors.md
      · released 2026-08-10 into bolt-plugin-shape · proposals observed
      on its registry (8 rows)
- [x] agentplot/flywheel: the fleet launch verifies plugin resolution before
      starting an actor, with `--plugin-dir` the declared fallback
      → assertions/fleet-launch-plugin-resolution.md
      · released 2026-08-10 into bolt-plugin-shape · proposals observed
      on its registry (8 rows)
- [ ] agentplot/flywheel: the gate machinery carries the amended desk-round
      gate — the handoff skill, the release-request shape, and
      flywheel-intent's apply.instruction, with the bolt-* member an
      explicit field in the release document
      → decisions/bolt-type-is-the-operators-choice.md ·
      decisions/the-gate-is-inline.md
      · released 2026-08-10 into bolt-plugin-shape (ninth row, after
      skills-shed); closes on the row observed
- [x] willdan-blueprints: `openspec/config.yaml`'s envelope transport
      sentence carries the three measured legs — rides the config-truths
      row of the staged gates-and-config release
      → decisions/message-envelopes.md
      · released 2026-08-10 into bolt-gates-and-config · proposals
      observed on its registry (3 rows)

## verify
- [x] a handoff is checked off once the proposals exist in the bolt, not when
      the request is sent — demonstrated 2026-08-10: all three releases
      closed only on observed registries (0438da38; the two new bolts'
      proposals.md), none on the send
- [ ] dispatch creating an intent resolves its open questions immediately and
      reports the answers back
- [x] design sessions are launched by a dynamic workflow, not one at a time
      — run wf_8e52d9fc-2f8, 2026-08-10: one workflow launched six sessions
      batched from the analyse step, three ran to report
      → assertions/dynamic-workflow-layer.md
- [ ] the named direct edits are still exactly three, and the list is closed
      → decisions/bolt-conductor-latitude.md
