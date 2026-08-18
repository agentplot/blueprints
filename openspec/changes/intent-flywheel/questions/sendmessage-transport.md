# Question: does SendMessage become the preferred live envelope transport?

- **State:** closed 2026-08-10 — into the amended
  decisions/message-envelopes.md: SendMessage is the preferred live leg
  between running Claude Code sessions; the socket-first-prompt extension
  died (a socket-delivered slash command lands as plain text). Measured in
  prototypes/sendmessage-transport.md
- **Raised by:** the operator, 2026-08-10, routed via dispatch; the request
  itself arrived over the transport it proposes and was actionable in the
  receiving turn
- **Blocks:** an amendment to decisions/message-envelopes.md

## The question
Claude Code v2.1.224+ ships cross-session messaging (ListAgents /
SendMessage, per-session inbox sockets). Does SendMessage become the
preferred live transport for actor-to-actor envelopes when both ends are
Claude Code sessions on one machine — `herdr agent prompt` falling back for
non-Claude kinds and cross-host, `inbox/` unchanged for parked actors?

An extension asks whether `bin/flywheel` can deliver a conductor's first
prompt — the load-bearing `/opsx:apply` invocation — through the exported
socket (`CLAUDE_CODE_MESSAGING_SOCKET`, bound before SessionStart hooks).
The claim that would kill the extension, to measure rather than assume: the
docs say a slash command arriving as message text lands as plain text and
is not executed. If a socket-delivered `/opsx:apply` does not load the
skill, the socket path is for envelopes only and `herdr agent prompt`
keeps the launch leg.

## What turns on it
The composer race the shared herdr reference documents — two prompts
racing, concatenating, and submitting as one line — disappears on every
leg SendMessage carries, at launch time most of all. Independent weight:
bolt-kit-lift reported the herdr inbound channel failing intermittently
mid-batch on 2026-08-07 (name off `herdr agent list`, agent_not_found,
re-registration not taking), and its rows invented a /tmp file-drop to
route around it. The herdr defect itself is the operator's as herdr's
owner, not this intent's.

## What is already known — reported, not verified; measure before amending
Measured firsthand by dispatch: one message from the operator's session
reached the running dispatch agent by fleet name and was actionable in the
receiving turn. Claims carried with the idea, unverified here:

- fleet names set via `-n` are already the SendMessage addresses;
- `bypassPermissions` receivers hold messages unless the sender also
  bypasses — fleet launches would want `crossSessionInbound: accept` in
  `--settings`;
- Remote Control peers are reply-only;
- a stopped session binds no socket, so `inbox/` keeps the parked path.

→ decisions/message-envelopes.md
