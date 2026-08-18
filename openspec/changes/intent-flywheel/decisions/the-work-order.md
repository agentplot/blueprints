# Decision: the session assignment is a work order

## Decision
The assignment a conductor issues a session agent is a **work order**, and
the file that carries it is **`WORK-ORDER.md`**. It names five things and
nothing else: the change id · the task lines · the session directory · the
worktree · the type skill.

Renames apply forward — skills, schemas, templates and profiles say "work
order" from here on. `CHARGE.md` files in closed session directories stay
as history; a closed directory is never rewritten
(→ `decisions/session-directories.md`).

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md`
- Produced by: `sessions/2026-08-07-loop-layer/`, decision 17 (V1),
  settled from the page's cards in one annotation round

## Why
"Charge" collided with its ordinary meanings and read as ceremony; the
assignment is an ordinary work order in the factory sense — one batch, one
station, one instruction sheet. The five-field list is the decision's
teeth: an assignment carrying anything else is smuggling steering that
belongs in the type skill or the schema.

## Consequences
- Skills, profiles, schema instructions and templates name "the work
  order"; the verb "charged with" survives as ordinary English.
- The session-directory README template's assignment section reads work
  order; closed sessions keep `CHARGE.md` untouched.
