# Decision: session types are skills, not OpenSpec schema types

## Decision
Each session type is steered by a skill that wraps its surface tool, and
the type is chosen by the conductor at charge time via the profile it
launches. Session types do not become OpenSpec schema types with their own
artifact instructions. A session is a way of working, not a change with an
artifact sequence to walk; giving it a schema would mean every design
session opened an OpenSpec change of its own, which is tracking the loop
does not need — the intent's `tasks.md` and `design.md` already carry what
a session did and what it produced.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/authoring-capabilities.md` (to be
  rewritten)
- Produced by: the operator's annotation in
  `sessions/2026-08-06-chapters-and-channels/decisions.html`: "it's worth
  having skills that wrap the Lavish and the plannotator skills that
  describe the different intent and design session types (both review and
  interactive design), as well as prototypes or spikes as skills …
  launching a nested Session under the Intent Conductor should use skills
  to steer that Session correctly." Confirmed directly when he noted he had
  already answered it.
- `decisions/design-session-steering.md` recorded the schema-types route as
  an open alternative. It was the option named and not taken.

## Consequences
- The session-type skills task stands as written: one skill per type,
  wrapping lavish and plannotator, prototype and research among them.
- **The naming: an actor says "session", a way of working never does.**
  Profiles are `flywheel-design-session` and `flywheel-interactive-session`
  (→ `decisions/agent-profiles.md`, which renamed the first and added a
  third for the construction types);
  skills are `flywheel-planning`, `flywheel-interactive`,
  `flywheel-writeback`, `flywheel-prototype`, `flywheel-research`,
  `flywheel-handoff` — `flywheel-research`'s name settled by the bullet
  below, which governs; `flywheel-handoff` because handoff is one of the
  six design types and every type carries a skill, a consequence this
  list had missed. The first
  draft had the skill as `flywheel-session-review` — the same words as its
  profile in the other order — and two independent reviewers confused the
  pair, the second reporting a correct proposal as internally inconsistent.
  Word order is not a distinction a reader can hold; the presence or
  absence of a word is. Settled on the operator's word before the names
  hardened across skills, profiles, schema instructions, and launch lines,
  and before the split made them the public invocation surface
  (`flywheel:review`, `flywheel:writeback`).
- **The fifth type is `flywheel-research`, not `flywheel-spike`.** "Spike"
  is already taken on disk, and taken for the opposite meaning: it is where
  throwaway code gets *built*. Root `CLAUDE.md` calls
  `knowledgebase-spike` a "throwaway learning spike; the richest prototype
  code"; `flywheel-intent`'s prototypes instruction says code stays in "the
  spike repo" and asks for "the spike-repo path or branch holding the
  throwaway code"; `flywheel-inception` says "delegate to the spike repo
  via a herdr worktree". So under the draft names a *prototype* session
  would build its throwaway in the *spike* repo while a *spike* session
  built nothing — the two words crossed, and both about to be published as
  `flywheel:prototype` and `flywheel:spike`.

  `research` is not merely the un-crossed alternative, it is the schema's
  own word. `flywheel-intent`'s `tasks` instruction names the Design types
  as "research, design session, prototype tasks", and this change's own
  `tasks.md` carries six `research:` lines. Naming the session type
  `research` makes the task type and the session that works it share a
  name: a `research:` task is worked by a `flywheel-research` session, a
  prototype task by a `flywheel-prototype` session. `spike` appears nowhere
  in the schema's task types.

  The operator chose the naming *shape*; `spike` was carried forward from
  the draft list and not chosen against `research`. Corrected here on that
  reading, and open to his overrule.
- **They ship with evals, same as the loop skills.**
  `decisions/design-session-steering.md` says "run `skill-creator` over the
  flywheel skills" without qualification; the Handoff task narrowed it to
  "both", which meant the two loop skills only because those were the only
  skills existing when the line was drafted. That was a drafting loss, not
  a scoping judgment, and it is corrected here rather than left for the
  next reader to re-ask. The argument is the decisions' own: these five
  carry the two-things rule, which `blueprints-is-a-built-repo.md` records
  as having been stated correctly and violated anyway, and whose sentence
  is "a definition that is only correct is not a guardrail". An eval is
  what turns a correct definition into a guardrail, so these are the skills
  that least deserve the exemption.
- No schema work follows. `flywheel-intent` and `flywheel-bolt` remain the
  two schemas, and `decisions/three-schemas.md` is unchanged.
- One narrow question survives and is not a design session: the split is by
  surface, and book writeback uses neither surface. It detaches from the
  session that closed the decision whenever one surface closes more
  decisions than a single session can write back — chapters-and-channels
  closed seven and left its chapter rewrites orphaned. Resolved inside the
  session-type skills proposal: writeback is a type in the same sense as
  prototype and research, steered by `books/CLAUDE.md` and the destination
  voice rather than by a surface tool.
- Closes the Design task without a session.
