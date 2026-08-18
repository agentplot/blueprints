# Decision: role identity arrives at launch, as an agent profile

## Decision
Each actor has a Claude Code agent profile under `.claude/agents/`, used as
the *main* session's identity: herdr starts `claude --agent <profile>` in
the pane, so the role is in place before any prompt and survives
compaction. Profiles are deliberately thin — identity and edit scope only,
pointing at the skills and the schema instructions, which remain the single
statement of the practice. Which change an actor owns comes from its first
prompt, not from its profile. No flywheel actor is a Task-tool subagent;
every one runs visibly in a herdr pane.

**A profile is one of three things an actor is.** The others are a herdr
name — how anything addresses it, `herdr agent prompt intent-flywheel` —
and one change it owns.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/authoring-capabilities.md` (to be
  rewritten)
- Produced by: `openspec/changes/add-flywheel-loops/design.md`; the count
  settled in `sessions/2026-08-07-loop-layer/` decisions 9 and 15

## Consequences
- **The conductor set is three, and these are the names:**
  `flywheel-dispatch`, `flywheel-intent-conductor`,
  `flywheel-bolt-conductor`. Every count of the conductor profiles reads
  three. Scaffold from this list and nowhere else.
- **Three host profiles carry the thirteen session types:**
  `flywheel-interactive-session` hosts `design`;
  `flywheel-design-session` hosts `planning`, `research`, `prototype`,
  `writeback` and `handoff`; `flywheel-construction-session` hosts all
  seven construction types.
- **`flywheel-review-session` is renamed `flywheel-design-session`.** Once
  `flywheel-review` becomes `flywheel-planning`, none of the types that
  profile hosts is a review, so the name described nothing it did. The name
  was previously retired for a different reason — it once meant the
  unsplit design-session profile — and is now correct for a different set.
- **Personas are not in this count.** `.claude/agents/user-*.md` are lenses,
  not actors (→ `decisions/the-persona-loop.md`). Same directory, different
  object, told apart by the prefix.
- **A charge names a profile AND a skill, and that cannot be collapsed.**
  Measured across 467 `SKILL.md` and 104 agent files on this machine: no
  frontmatter key names an agent type from a skill, or a skill from an
  agent. The hope that a skill could declare its own agent type is dead by
  measurement rather than by choice
  (→ `questions/skill-frontmatter.md`).
- Appended writeback task: `authoring-capabilities.md` explains the split —
  profile carries identity, skill carries practice, first prompt carries the
  binding.
- Constraint on the plugin handoff: a marketplace plugin ships the skills
  and the profiles together, since a skill without its profile leaves the
  role unassigned.
