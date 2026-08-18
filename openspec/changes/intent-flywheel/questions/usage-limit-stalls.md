# Question: does the loop need limit-awareness?

- **State:** open
- **Raised by:** dispatch's fleet-wide measurement, 2026-08-10 — the whole
  fleet runs on one subscription window
- **Blocks:** nothing here

## The question
A usage-limit stall is indistinguishable from a settle: a limit-hit
conductor reads `done` to `herdr agent wait` and `flywheel status`; only
a pane read shows the banner. A conductor mid-critical-section — a
serialized merge-back, an inbox drain past its worktree cut — stalls with
work half-promoted, and nothing records that the stop was a limit rather
than a choice. Does the loop need limit-awareness, and in which form: a
conductor checking its own banner before entering a critical section, a
dispatch-visible distinction between settled and stalled, a fleet-level
pause on exhaustion?

## What turns on it
Trust in settle states fleet-wide. Measured today: this conductor hit the
limit mid-drain (worktree cut, no records written, status `done`), and
three loop-round sessions died on the same window. The counter-example
that sharpens it: bolt-kit-lift, at 99% of the window, chained its last
two serialized merge-backs into one background shell command precisely so
they complete if its session pauses — limit-awareness improvised as
workmanship, and what one actor invented under pressure is a candidate
for the design.

## What is already known
The window resets 19:30 America/New_York; `/usage-credits` in a pane
continues that session; both are operator actions — no actor in the fleet
can see, price, or route around the limit.
→ questions/workflow-launch-visibility.md — the same visibility family
