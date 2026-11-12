# Boom Drive design context — Nov 11, 2026 session

Context for coding agents working on Flume, Millpond, Headwater, Timber and the Boom Drive runner/cloud.
Each file is one thread. Items marked **(unverified)** came from research or reasoning that hasn't been tested yet; confirm before building on them.

| File | Thread |
|---|---|
| `flume-rex-seam.md` | Adding Rex as a second multiplexer seam in Flume, alongside Herdr |
| `rex-ecosystem.md` | What Rex provides today, and existing community projects (prior art) |
| `flume-session-lifecycle.md` | Suspend/resume (dormant sessions), auto-suspend, account-pool moves, transcript ownership |
| `web-terminal.md` | Boom Drive Cloud web terminal and how it differs between Herdr and Rex |
| `millpond-routing.md` | Millpond as a generic signal router, rules, lanes, coupling |
| `timber-headwater-pocket-cd.md` | Timber + Headwater intersection, the update ladder, and the "pocket CD" for Nix/clan flakes |

## Tool map (as of this session)

- **Boom Drive** — umbrella brand and cloud control plane. `boomdrive` CLI is the local runner (front door; mirrors local state to the cloud; cloud never owns tool state).
- **Boom** — open-source claims ledger.
- **Flume** — runs the state machines ("places") for agent sessions and hands agents work. Drives a terminal multiplexer through a seam (today: Herdr).
- **Herdr** — current terminal multiplexer.
- **Rex** — Superlogical's multiplexer; candidate second seam.
- **Millpond** — signal inbox → now framed as a generic router.
- **Headwater** — adapter that watches upstream releases/changes and emits typed signals.
- **Eddy** — adapter that turns meeting notes into signals.
- **Sluice** — local merge queue / CI.
- **Timber** (formerly Tailrace) — artifacts, channels, environments; publishing and deployment.
- **Weir** — shared library (proposed home for the signal schema).
