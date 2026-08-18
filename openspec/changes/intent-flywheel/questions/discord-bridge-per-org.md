# Question: one Discord bridge per org, or one bot with per-org routing

- **State:** open
- **Raised by:** dispatch, 2026-08-10 — the seam fleet-per-org surfaced
- **Blocks:** nothing here

## The question
Dispatch is the only Discord-bridged actor, and one dispatch per org fleet
makes that one bridge per org. Whether the destination is one bot with
per-org routing or one bridge per fleet is undecided.

## What turns on it
How many bot identities exist and who manages them; where the routing
knowledge lives — in one bot that knows every org, or in each fleet's own
dispatch; and what a message's channel implies about which fleet answers
it.

## What is already known
Dispatch is the one bridged actor by decision, and a fleet is scoped to a
GitHub org in its own herdr session.
→ decisions/bridged-singleton.md · decisions/fleet-per-org.md
