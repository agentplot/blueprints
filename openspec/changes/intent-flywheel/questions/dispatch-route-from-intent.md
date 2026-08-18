# Question: does an intent conductor get a route to dispatch?

- **State:** closed → decisions/message-envelopes.md · sessions/2026-08-07-loop-layer/
- **Raised by:** the operator's structured feedback, 2026-08-07, section A1
- **Blocks:** nothing — the envelopes can be written either way

## The question
Every messaging leg is stated somewhere except this one. A design session
reaches its intent conductor, a construction agent reaches its bolt
conductor, a bolt conductor reaches both dispatch and the intent conductor,
and anyone reaches any conductor by prompt or inbox. An intent conductor
reaching dispatch appears nowhere.

## What turns on it
Whether the envelopes cover five legs or six, and whether dispatch is a hub
every actor can reach or a router that only carries inward traffic outward.

## What is already known
It may be deliberate rather than missing. Dispatch's own profile describes
relaying inner-loop escalations outward, and an intent conductor already
reaches the operator directly with `AskUserQuestion` — so a relay would put
a machine between two parties already in the room.
→ decisions/message-envelopes.md · decisions/bridged-singleton.md
