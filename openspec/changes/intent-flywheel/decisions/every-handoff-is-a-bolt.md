# Decision: every released handoff goes through a bolt

## Decision
There is one path out of the phase gate. A released handoff becomes a bolt
with a bolt conductor whatever its size, and a handoff carrying a single
proposal is a named special case of that path rather than a different one.
The bolt earns its keep below the size at which its tracking would: writing
the proposal and building the code stay two agents, an independent review
and the archive stay available, and feedback that has to travel back to the
triage singleton has an owner to catch it and a place to land. Nothing
releases into a bare work branch off main.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md` and
  `spec-driven-construction.md` (both to be rewritten)
- Produced by: `sessions/2026-08-06-chapters-and-channels/decisions.html` —
  the operator rejected the short-circuit the surface recommended: "even
  for short-circuit, we should operate with a bolt and a bolt conductor. It
  could definitely be called out as a special use case. The reason … is
  that the building of the proposal and the construction should still be
  two separate agents. We very well might want to do an independent review
  as well as an archive. We also need to account for catching any feedback
  that needs to be fed back to the triage human in the loop."
- Answers the question `decisions/three-schemas.md` surfaced when it left
  the small-change default open.

## Consequences
- Schema: `flywheel-intent`'s `tasks` instruction keeps one Handoff motion
  and names the one-proposal bolt as a special case, not an exit.
- `flywheel-inception`'s handoff-is-a-request paragraph stays single-path.
- `flywheel-bolt` and `flywheel-construction` describe the one-proposal
  bolt — the same artifacts and the same actors, with a one-row registry.
- `conducting.md` and `spec-driven-construction.md` describe one exit from
  the gate.
- The bolt conductor is the actor that routes inner-loop feedback to the
  triage singleton, which is what makes the singleton's relay role real
  → decisions/bridged-singleton.md.
