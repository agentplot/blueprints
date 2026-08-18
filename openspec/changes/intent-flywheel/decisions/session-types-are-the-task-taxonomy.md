# Decision: thirteen session types, one set across both loops

## Decision
There is **one enumeration of session types**, spanning both loops, and a
task line names the type that will run it. A task type describes a category
of work and says nothing about who runs it; a session type says both.

**Six design types**, hosted by two profiles:

| type | opens |
|---|---|
| `design` | a lavish page |
| `planning` | `plannotator annotate` on drafts the session wrote |
| `research` | reading code, docs, and a tool's actual behaviour |
| `prototype` | a throwaway; the code dies and the finding survives |
| `writeback` | book chapters and the context map |
| `handoff` | the request to a bolt, the receipt, the check-off |

**Seven construction types**, hosted by one profile:
`proposal-writing`, `proposal-review`, `spec-writing`, `build`, `test`,
`code-review`, `human-code-review`.

**Every type shares one mechanic.** A session gets a worktree, carries a
batch of task lines, completes them inside that worktree, and its branch
merges when the session finishes. The session is the merge boundary, never
the individual task. Work **batches** onto a session — several task lines
each, never one session per task.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md`
- Produced by: the operator, 2026-08-07, with the set settled in
  `sessions/2026-08-07-loop-layer/` — decisions 5, 6, 7, 16

## Three things the taxonomy surfaced that a list did not
Drawing the set found what enumerating it had not:

- **`construction` collided with `flywheel-construction`**, the loop skill.
  The type becomes **`build`**, which is the word the bolt's own tasks
  already use.
- **There was no `test` type**, although the bolt schema defines a Test
  section and states it must never run inside a construction worktree.
  That is a session boundary described without being named. Added.
- **`handoff` stays a session, and the reason is worktree management, not
  waiting.** If the conductor did the handoff itself it would either write
  in its own base worktree or manage a nested worktree beside it. A session
  owns exactly one worktree and merges it once, which is simpler.

## Consequences
- `flywheel-review` is renamed **`flywheel-planning`**: it means plannotator
  on written drafts, and calling it `review` put the least specific word on
  one of four things that are all reviews.
- Seven construction session skills have to be written, 80–97 lines each,
  on the existing five as models.
- `flywheel-intent`'s task sections are the six design types, plus `verify`.
- `openspec/config.yaml`'s `rules.tasks` still names three sections and
  contradicts this. Tasked (→ `assertions/config-task-sections.md`).
