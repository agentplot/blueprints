# Decision: a session is steered by a profile pair, a skill section, and a pointer in the schema

## Decision
Three places steer a design session, and each carries one kind of content.
The `flywheel-intent` schema's `sessions` instruction carries a pointer: it
names that a conductor launches sessions, names the profile and the skill,
and stops there, so a session reading only `openspec instructions` finds
its way to the actor model. There are two design-session profiles rather
than one, split by surface — a review session that works written artifacts
through plannotator, and an interactive design session that builds a
surface in lavish — and the conductor picks at charge time. Presentation
practice lives in `flywheel-inception`'s session section: what a surface
should actually contain — code samples, configuration examples, diagrams,
conceptual SVGs, with `branch-topology-diagram` named as a ready tool — and
when a plan reviewed in plannotator is the better answer instead. Each
session type is steered by a skill wrapping its surface tool, so launching
a nested session under an intent conductor means loading the skill for that
type; prototypes and spikes are types in the same sense.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/authoring-capabilities.md` (to be
  rewritten)
- Produced by: `sessions/2026-08-06-chapters-and-channels/decisions.html` —
  three sub-questions the operator raised in a plannotator round on the
  schema's `sessions` instruction and then answered on the surface: a
  pointer line, two profiles split by surface, and coaching in the skill.
  His note under the first: "it's worth having skills that wrap the Lavish
  and the plannotator skills that describe the different intent and design
  session types (both review and interactive design), as well as prototypes
  or spikes as skills … launching a nested Session under the Intent
  Conductor should use skills to steer that Session correctly."

## Consequences
- The profile set changes: `flywheel-design-session` splits into two
  profiles, and the conductor's spawn line names which one it is starting.
- New tasks: the session-type skills — one per type, wrapping lavish and
  plannotator — with prototype and spike sessions among them.
- New task: run `skill-creator` over the flywheel skills so the coaching
  ships with evals rather than as prose ("we should apply the
  /skill-creator skill to our skill so we generate evals for this").
- Schema: the `sessions` instruction gains the pointer, and nothing more —
  the mechanics stay in the skill.
- New question the operator raised and left open: whether the session types
  would be better carried as OpenSpec schema types with their own artifact
  instructions than as skills. He named it as the one alternative to the
  skills route and did not settle it.
- Constraint on the plugin handoff: two profiles and their session-type
  skills ship together, since a profile without its skill leaves a session
  unsteered.
