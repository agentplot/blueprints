# Decision: dispatch starts a parked conductor when routed work arrives

## Decision
When routed work arrives for a conductor that is not running, **dispatch
starts it** — the operator does not unpark conductors to receive work. The
manifest state set is **running · on-demand · parked**, stated here once as
the enumeration to copy:

- **running** — the fleet keeps the actor up; `flywheel up` starts it.
- **on-demand** — the actor starts when work arrives for it: dispatch
  starts the conductor, records the start in `fleet.yaml` per the
  manifest-update rule, and the conductor drains its inbox on wake.
- **parked** — a hard operator hold. Requests wait in the change's
  `inbox/`; nothing starts the actor but the operator's word.

## Context
- Produced by: the operator, 2026-08-10 — direction relayed through their
  session, not a raw idea
- First application: dispatch started intent-flywheel on this direction,
  2026-08-10, and recorded the state change in `fleet.yaml`

## Why
Routing exists so work reaches its owner. The protocol this amends ended a
route at a wait — the SendMessage-transport request sat in this change's
inbox behind a parked conductor until the operator noticed — which
re-creates, inside the fleet, exactly the relay burden the fleet was built
to remove. A hard hold stays available, but it is a state the operator
chooses, not the default consequence of an actor being off.

## Consequences
- `decisions/fleet-per-org.md` stands for scope and placement; the state
  enumeration lives here and nowhere else.
- The machinery is construction in `agentplot/flywheel`: `bin/flywheel`
  and the fleet skill carry the three states. A handoff task names it.
- Dispatch's routing practice changes now, ahead of the machinery: a
  routed request whose owner is off and not parked warrants a start, not
  a wait.
