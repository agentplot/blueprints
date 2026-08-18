# Decision: a design session's directory is a tracked artifact

## Decision
A design session's working record lives at `sessions/<YYYY-MM-DD>-<slug>/`
under the intent change, and that path is an artifact of the
`flywheel-intent` schema in its own right. The conductor assigns the
directory in the charge, before the session starts; the date is the day of
the charge and the slug names the batch of work, so the name is fixed and
unique from the first commit and stays the session's address for the life
of the intent. A session that resumes reuses its directory; a different
session that would collide takes a slug that says how it differs. The
session is the sole writer inside; the conductor promotes outward — the
report given a row in `design.md`, closed decisions into `decisions/`,
findings into `prototypes/`, check-offs into `tasks.md` — and a closed
session directory is never rewritten, because it is the trail.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md` (to be rewritten)
- Produced by: `sessions/2026-08-06-schema-dogfood/` — authoring this
  intent from the schema instructions alone found `sessions/**/*` named in
  the actor model and in the intent instruction, but declared nowhere, so
  nothing said who names a session directory or what happens on collision

## Consequences
- Schema changed: `flywheel-intent` gains the `sessions` artifact with the
  naming, collision, and promotion rules, plus a `sessions/README.md`
  template.
- Every report now has a session behind it, which is what lets the catalog
  cite one → decisions/design-catalog.md.
- Appended writeback task: `conducting.md` describes the session directory
  as the unit of design-session work.
