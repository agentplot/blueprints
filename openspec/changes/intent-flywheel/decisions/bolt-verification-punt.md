# Decision: the bolt declares nothing about verification yet

## Decision
Verification docking stays exactly where `books/aidlc-design/src/
verifications.md` already puts it — on the individual proposal, which
declares inside its own OpenSpec change which fixtures it reuses, which it
adds, and which harnesses it extends. The `flywheel-bolt` schema gains no
verification artifact, no docking section in `bolt.md`, and no docking
column in the proposals registry. A bolt's docking is whatever the union
of its proposals' declarations happens to be, and nothing computes that
union.

This is a deliberate deferral, not a finding that per-proposal is right.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/verifications.md` — unchanged by this
  decision, which is the point
- Produced by: the operator's word, given directly to this conductor:
  "I feel like maybe we should punt on verifications in the bolt. I don't
  want to add extra machinery that complicates things yet."
- The case for moving it was put and is worth keeping, because it is what
  the trigger below watches for: *adds* and *extends* are shared state
  while *reuses* is a per-branch gate list, and they only read as one
  declaration because proposals were free-standing before bolts existed.
  Split by grain — bolt declares adds and extends, proposal declares
  reuses — would make two failure modes structurally impossible.

## Consequences
- Two failure modes are accepted as live until the trigger fires. Two
  proposals in one bolt may each declare they add the same fixture, and
  nothing catches the collision before both branches build it. A proposal
  that reuses a fixture another proposal adds is an ordering edge between
  two registry rows that the registry has no column for; the bolt conductor
  carries it in its head or on a task line.
- The trigger to re-open: the first real bolt whose proposals collide on an
  added fixture, or whose registry needs an ordering edge written down. At
  that point the split-by-grain shape above is the proposal on the table,
  not a fresh question.
- The `flywheel-bolt` schema writeback task is unaffected — it describes
  the one-proposal bolt's single-row registry and nothing about docking.
- Closes the intent's fog question on where docking binds. Deferral is the
  answer, and the fog entry retires rather than sitting open.
