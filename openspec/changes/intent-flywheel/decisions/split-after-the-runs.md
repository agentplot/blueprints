# Decision: the split lands now, ahead of the two end-to-end runs

## Decision
The split goes **now** — the operator's word, 2026-08-10, overriding this
record's original timing. One bolt does the move, the skill restructure,
and the publish together: a settled tree to `agentplot/flywheel`, the
`flywheel-` prefix dropped from the skills, the profiles and schemas
travelling per `flywheel-repo-manifest.md`. The two end-to-end runs follow
**against the plugin**, which is where their findings should land anyway
once the machinery lives there.

What made the original timing safe to override: the loop-layer bolt
landed the machinery reviewed — three independent reads, thirty-seven
findings fixed, gates green — which is most of the hardening the runs
were parked in front of. The original reasoning below stands as the
record of why the timing was first set the other way.

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
  checklist — install clean, launch all five profiles, invoke both skills by
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
- **That count was a point-in-time measurement and is already wrong.** It
  was taken before `bolt-flywheel-machinery` began, and adding references
  is most of what that bolt does: root `CLAUDE.md` gains a flywheel section
  naming both skills, `.claude/agents/`, and both schema paths, and the
  `sessions` instruction gains seven live references — two profile paths
  and five skill paths — inside a schema the split moves and prefix-strips,
  against a count that read "zero in the schemas". The count stays on the
  record as what was weighed. It is not the basis of the decision, which is
  that moving a tree about to churn is a merge problem — but it does mean
  no inventory taken today can be trusted at split time.

## Consequences
- One new Handoff task, blocked by both runs: split to `agentplot/flywheel`
  — stand up the repo, migrate the machinery, restructure the skills,
  publish both schemas as user schemas, ship the plugin. The existing
  plugin-ship task folds into it rather than standing alone.
- That task carries a named acceptance checklist, since the runs will not
  have exercised the shipped packaging: install `flywheel@flywheel` clean
  from the new marketplace, launch each of the five profiles, invoke both
  skills by their namespaced names, resolve both schemas from the user
  source, and confirm no hard-coded absolute path survives.
- The four Handoff proposals that edit the machinery — the dispatch rename,
  the settled batch into both skills, the design-session profile split with
  its session-type skills, and the schema instruction edits — all land in
  blueprints and move with the split. Of the remaining three, only
  `books/CLAUDE.md` and the `openspec-construction` retirement are
  genuinely unaffected, and the latter stays pointed at
  `willdan-marketplace`. Root `CLAUDE.md` is **not** unaffected, as this
  record first claimed: the flywheel section it gains names
  `flywheel-inception`, `flywheel-construction`, `.claude/agents/`, and both
  schemas by their in-repo paths — every one of which the split renames or
  relocates. That section joins the re-edit list below.
- **The split bolt derives its re-edit list; it does not inherit one.** The
  list is a query run at split time, not an inventory written now — grep
  the tree for the skill names, the `flywheel-` skill directory paths, the
  `.claude/agents/` path, and both schema paths, and re-edit whatever
  answers. Known members today are the three rewritten chapters, root
  `CLAUDE.md`'s flywheel section, and `flywheel-intent`'s `sessions`
  instruction — named as examples of what the query must catch, not as the
  set. Every enumeration this record has attempted was overtaken within
  the day.
- The sequencing risk is that a decision made and not landed rots: if the
  runs slip, the split slips with them. Filing the split task now, blocked,
  is the whole mitigation — an unblocked-when-the-runs-finish task on the
  board rather than an intention.
- Reopen trigger, and its disposition. The trigger was: if the two runs
  have not both reached completion by the time the chapter rewrites are
  ready to write, re-ask rather than writing the chapters twice. It fired
  the same day — `sessions/2026-08-06-book-writeback/` wrote all three
  chapters while both runs were still blocked. It was neither missed nor
  re-asked, because this record had already accepted that consequence
  above: the chapters name the skills under their current names and the
  split bolt re-edits them. The trigger is spent, noted here so a later
  reader does not read it as an oversight.
