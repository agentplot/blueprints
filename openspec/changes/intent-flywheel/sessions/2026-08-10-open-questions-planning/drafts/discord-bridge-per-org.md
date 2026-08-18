# Draft decision: one Discord bridge per org fleet

Closes `questions/discord-bridge-per-org.md`.

## Decision (proposed)

**One bridge per org fleet.** Each fleet's dispatch binds its own Discord
bot — its own application, its own token, its own allowlist DM policy —
declared where the fleet already lives, in the org folder's untracked
`fleet.yaml`. Routing knowledge lives in each fleet's own dispatch, and a
message needs no org tag: the bot identity it arrived on **is** the
fleet, so which fleet answers is decided before any actor reads a word.

## Why

- **The measured constraint decides it.** The Discord plugin binds one
  Claude Code session per bot token (`decisions/bridged-singleton.md`,
  evidence section). A single bot for every org therefore means a single
  bridged session for every org — an actor standing outside every fleet.
- **A fleet is scoped to a GitHub org in its own named herdr session**
  (`decisions/fleet-per-org.md`), precisely so that one client's work
  shares no namespace, socket, or blast radius with another's. A
  cross-org router session would undo that at the bridge: every client's
  operator traffic in one transcript, relayed across herdr session
  sockets into fleets it does not belong to, and alive after any one
  fleet is torn down. One bot per org keeps the bridge inside the
  isolation boundary the fleet decision drew — the org session's
  teardown takes its bridge down with it.
- **The allowlist is per-client by nature.** Who may DM the willdan
  fleet is not who may DM the agentplot fleet; per-bot allowlists state
  that directly instead of encoding it in a shared bot's routing table.

## The alternative, and why not

One bot with per-org routing: a single Discord application whose bridged
session inspects each message and relays it to the right fleet. Rejected
because it requires a new standing actor no decision provides for, its
routing table duplicates what each fleet's manifest already knows, and it
re-creates exactly the shared-blast-radius shape `fleet-per-org` removed.
Its one advantage — a single bot identity to manage — is small at three
orgs, and each additional org is one-time Discord application setup.

## Consequences

- `fleet.yaml` gains the bridge declaration for the org's dispatch (bot
  binding beside the actor row); machine-local like everything else in
  the manifest.
- Bot identities multiply with orgs — three today — and are named for
  the org they serve.
- Escalation paths do not change: a bolt's agents reach the operator
  through their own fleet's dispatch (`decisions/bridged-singleton.md`),
  and nothing routes cross-org.
- The cloud-hosted dispatch question (`questions/dispatch-in-the-cloud.md`)
  inherits this shape: whatever hosts a dispatch hosts one org's bridge,
  not a shared one.
