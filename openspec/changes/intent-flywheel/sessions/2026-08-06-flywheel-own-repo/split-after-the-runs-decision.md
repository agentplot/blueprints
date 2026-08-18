# Decision: the split lands after the two end-to-end runs

## Decision
The two end-to-end runs go first, and the split follows as one bolt that
does the move, the skill restructure, and the publish together. The dispatch
rename lands in blueprints as already planned — it is the bolt both runs are
blocked on. The runs then harden the skills, the profiles, and the schema
instructions where they sit, and the hardening handoffs land in blueprints.
Only then does a single bolt move a settled tree to `agentplot/flywheel`,
drop the `flywheel-` prefix from the skills, and publish. The split is filed
as a Handoff task now, blocked by both runs, so it sits on the board rather
than in anyone's memory.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md` and
  `spec-driven-construction.md` (both to be rewritten)
- Produced by: `sessions/2026-08-06-flywheel-own-repo/own-repo.html`
- The runs' stated product is edits to the very files the split moves: "every
  command works as written, or the skill, the profile, and the instructions
  move," and "the bolt loop under real load." Moving a tree that is about to
  churn is a merge problem; moving a settled one is mechanical.
- Packaging correctness is not what an end-to-end run discovers. It is a
  checklist — install clean, launch all four profiles, invoke both skills by
  their namespaced names, resolve both schemas from the user source, confirm
  no absolute path survived `${CLAUDE_PLUGIN_ROOT}`.
- The argument that pointed the other way, recorded because it is real: the
  skill change is a restructure rather than a rename — directory names, the
  dropped prefix, and every reference in the profiles, the E2E scripts, and
  the loop chapters — and the three chapter rewrites that will name the
  skills have not been written yet, so splitting first would let them be
  written once. Measured against the current tree the reference count is
  small (four profile lines, two `SKILL.md` frontmatter names, one internal
  cross-reference, one line of `E2E-construction.md`, zero in
  `E2E-design-loop.md`, zero in the schemas, zero in `books/`), and the
  operator weighted de-risking the loop above renaming once. The mitigations
  below are what carry that weight.

## Consequences
- One new Handoff task, blocked by both runs: split to `agentplot/flywheel`
  — stand up the repo, migrate the machinery, restructure the skills,
  publish both schemas as user schemas, ship the plugin. The existing
  plugin-ship task folds into it rather than standing alone.
- That task carries a named acceptance checklist, since the runs will not
  have exercised the shipped packaging: install `flywheel@flywheel` clean
  from the new marketplace, launch each of the four profiles, invoke both
  skills by their namespaced names, resolve both schemas from the user
  source, and confirm no hard-coded absolute path survives.
- The four Handoff proposals that edit the machinery — the dispatch rename,
  the settled batch into both skills, the design-session profile split with
  its session-type skills, and the schema instruction edits — all land in
  blueprints and move with the split. The two conventions proposals
  (`books/CLAUDE.md`, root `CLAUDE.md`) and the `openspec-construction`
  retirement are unaffected; the last of those stays pointed at
  `willdan-marketplace`.
- The three chapter rewrites will name the skills under their current names
  and be re-edited by the split bolt. That re-edit is named on the split
  task so it is not discovered late.
- The sequencing risk is that a decision made and not landed rots: if the
  runs slip, the split slips with them. Filing the split task now, blocked,
  is the whole mitigation — an unblocked-when-the-runs-finish task on the
  board rather than an intention.
- Reopen trigger: if the two runs have not both reached completion by the
  time the chapter rewrites are ready to write, re-ask this decision rather
  than writing the chapters twice.
