# Decision: a persona is a lens a review session runs under, not an actor

## Decision
Personas are **`.claude/agents/user-*.md`** — stand-ins for the people who
use the built thing: a data scientist at a CLI, a library developer
integrating an SDK, a DevOps engineer deploying it. **The set is whatever
the glob finds**, not a list any record enumerates.

A persona is **a lens on `proposal-review` and `code-review`**, not a
session type of its own and never an actor. It owns no change. The same
review session runs under a persona profile and reads the work from that
position.

`bolt-deep` is the member whose prompt schedules the persona work
(→ `decisions/the-bolt-schema-family.md`): a persona read before the build,
adversarial and human review after, a smell check against the rest of the
codebase, and personas exercising the built application at the end.

Persona findings route two ways and the split carries the loop boundary:

- **A question the intent does not cover** goes back to the intent. Building
  it because an agent asked would let the outer loop be written by the
  inner one.
- **Behaviour that contradicts the intent** becomes new proposals in the
  bolt.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/spec-driven-construction.md`
- Produced by: the operator's feedback of 2026-08-07 section C, settled in
  `sessions/2026-08-07-loop-layer/` decision 8

## The stop is an andon cord
Where the work smells wrong enough, the conductor stops the line and asks
for a human read. That is **jidoka** — an andon cord, not a rip cord: the
point is that anyone may stop the line and the stop is normal, not an
emergency measure. The mechanism is `AskUserQuestion`.

## Consequences
- Persona profiles live beside the actor profiles and are told apart by the
  `user-` prefix, not by a registry.
- Three to start; adding one is adding a file.
- `flywheel-construction`'s review section is restated as `bolt-deep`'s
  prompt rather than as prose rules.
- Open: whether a persona surfacing a question the intent never asked is
  evidence the intent was incomplete (→ `questions/persona-question-as-signal.md`).
