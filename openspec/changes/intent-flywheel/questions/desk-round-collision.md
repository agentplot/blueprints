# Question: how does a session know the operator's desk is free?

- **State:** open
- **Raised by:** the operator, 2026-08-10 — the open-questions planning
  session's plannotator round displaced the kit-lift round the operator
  was working ("session:open-questions-planning stopped my plannotator
  session")
- **Blocks:** every desk round from this intent's sessions until it closes
  or the operator says go — the conductor holds rounds meanwhile

## The question
Desk rounds are a single-slot resource: one desk, one operator. A session
charged to open a round has no way to know whether the desk is occupied —
by another change's round or by the operator's own reading — so parallel
loops race for it, and the loser is always the operator. What serializes
desk rounds: a lock the desk tools honour, a queue through dispatch, the
conductor asking on a cheap channel before the round opens?

## What turns on it
Whether desk channels stay trustworthy under parallel loops. An operator
displaced mid-round loses working state and reads the displacement as the
machinery misbehaving — which it is, at the practice level: the work order
charged the round without accounting for the desk.

## What is already known
Displacement comes from the open itself, not from any process kill — the
displaced round's server survived (kit-lift's annotate process alive
afterwards, measured 2026-08-10). The channel table assigns a round to the
sole writer of the file under review; it says nothing about desk occupancy.
→ decisions/human-loop-channels.md · decisions/review-launch-points.md
