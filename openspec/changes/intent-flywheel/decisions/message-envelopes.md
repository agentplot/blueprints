# Decision: three envelopes, one header, one fenced block on every transport

## Decision
A message between agents is a fenced `envelope` block with a fixed header
and a body shaped by its kind. **The same block travels every transport.**
The legs, stated here once as the enumeration to copy:

- **SendMessage** — the preferred live leg between two running Claude Code
  sessions on one machine, addressed by fleet name: delivery lands in the
  receiving turn and no composer is involved.
- **`herdr agent prompt`** — the legs SendMessage cannot carry: non-Claude
  agent kinds, cross-host, and **every session launch**, because a slash
  command arriving as message text lands as plain text and is never
  executed — the socket delivers envelopes, not invocations.
- **a file in the target's `inbox/`** — when the target is not running.

One block on every leg, because a prompt is a string and an inbox entry is
a file, and anything not paste-identical drifts apart. A workflow-spawned
session has no address of its own — it sends through its conductor's
socket and replies land in the conductor's transcript — so envelopes
between workflow sessions still travel herdr or the inbox.

The header:

```envelope
to:   bolt-rocs-records
from: rocs-persona-devops
re:   proposals/rocs-record-split.md
kind: extend-bolt
```

**`re:` is a change-relative path**, and it is how a message names its work
item. That answers the work-item-ID question: not a synthetic ID, the path
of the thing itself — which is checkable, survives renaming badly enough to
notice, and needs no registry to resolve.

Three kinds, one per routing disposition: **`respond`** (answer the sender),
**`extend-bolt`** (a new proposal for the bolt's registry), **`extend-intent`**
(a new question or task for the intent).

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/conducting.md`
- Produced by: the operator's feedback section A, settled in
  `sessions/2026-08-07-loop-layer/` decisions 10 and 11
- Amended 2026-08-10: the transport legs, from the sendmessage-transport
  prototype's measurements (`prototypes/sendmessage-transport.md`) —
  fleet-to-fleet delivery in the receiving turn on claude 2.1.226;
  socket-delivered `/rename` and `/opsx:explore` not executed. The
  bypass-hold, cross-host, and Remote Control claims stay unverified.

## There is no intent-conductor-to-dispatch leg, by decision
It was the one leg no document stated, and the answer is that it should not
exist. An intent conductor reaches the operator directly with
`AskUserQuestion`; routing through dispatch would put a machine between two
parties already in the room. Dispatch relays *inward* traffic outward, and
that asymmetry is deliberate rather than an omission.

## Consequences
- The envelope definition lives in `openspec/config.yaml`'s `context:`
  block, carried into every instructions call, where no bolt rewriting a
  skill can delete it (→ `decisions/the-four-home-test.md`). Carrying the
  three transport legs into that block is construction — a handoff task
  rides the gates-and-config release's config-truths row.
- Both skills point at it rather than describing message content.
- The report-length rule lands as shape rather than advice: a message has
  named parts, so brevity is structural.
- An inbox envelope is drained by revising the earliest artifact it touches
  and then re-walking forward, with the file deleted in that same commit.
