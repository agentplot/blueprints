# Decision: one bridged pane, and it triages rather than intakes

## Decision
Exactly one session is connected to Discord: the standing singleton, under
the allowlist DM policy, so every message from the operator reaches it and
no channel traffic does. It answers its own routing questions and relays
everything else through the two paths that already exist — `herdr agent
prompt` when the target conductor runs, the change's `inbox/` when it does
not — and that includes escalations from the inner loop, so a bolt's agents
reach the operator through the singleton without a second bot. Because
relaying and escalation are now most of what it does, the actor is no
longer named for intake; it is the triage singleton. No webhook receiver is
built: a DM to the bot is already remote intake, with the sender checked
against the allowlist, and a second delivery path for the same job earns
nothing today.

## Context
- Map: none — the flywheel is process, not a map context
- Chapter: `books/aidlc-design/src/authoring-capabilities.md` and
  `conducting.md` (both to be rewritten)
- Produced by: `sessions/2026-08-06-chapters-and-channels/decisions.html` —
  the operator on the one-bridged-pane option: "this agent could also
  monitor the Bolt agents so that they could escalate and get feedback via
  Discord through the Singleton agent. That would work really well, but at
  that point we need a different name for this agent, not just Intake,
  maybe Triage or something."
- Evidence in the same surface: the Discord plugin binds one Claude Code
  session per bot token, so any second bridged actor means a second
  application, a second state directory, and a second thread to watch.

## Consequences
- The actor renames. The `flywheel-intake` profile, the intake section of
  `flywheel-inception`, both end-to-end scripts, and the agent-name convention
  all follow it. The name itself is not settled — "Triage" is the
  operator's suggestion, not his word → new question.
- Appended task: the bridge configuration written down — DM policy
  `allowlist`, no guild channels, and what the relay looks like in both
  directions (operator answer inbound, agent question outbound).
- Closes the bridge-triggering research: a DM from an allowlisted sender
  fires the session on every message; guild channels default to
  `requireMention: true`, with `--no-mention` and `mentionPatterns` as the
  overrides. Triggering is configuration, not a limit — the constraint that
  matters is one session per bot token.
- New fog: the triage singleton hosted in the cloud. The operator wants to
  run it outside the workstation — AWS AgentCore named — so it can triage
  real-time inputs it does not have today: meeting transcripts, bug reports
  from users. That changes what the singleton is, so it is a question
  before it is a task, and it is the setting in which a webhook receiver
  would be re-asked.
- Rests on the channel matrix → decisions/human-loop-channels.md.
