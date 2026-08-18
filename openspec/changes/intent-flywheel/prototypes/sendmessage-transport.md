# Prototype finding — SendMessage as the live envelope transport

## Question

Does SendMessage deliver envelopes between two fleet actors, and does a
socket-delivered slash command execute or land as plain text? The second
half decides the `bin/flywheel` extension: if a socket-delivered
`/opsx:apply` does not load the skill, the socket path is envelopes-only
and `herdr agent prompt` keeps the launch leg.
→ `questions/sendmessage-transport.md`

## Where

A `spike/sendmessage-transport` worktree in `knowledgebase-spike` (herdr
workspace w5, checkout `~/.herdr/worktrees/.bare/spike-sendmessage-transport`),
holding two throwaway haiku sessions, `sm-probe-a` and `sm-probe-b`, under
`claude` 2.1.226. No code was written; the throwaway was the pair of
sessions. Worktree force-removed and branch deleted after the measurement.
The receiving-turn evidence is quoted verbatim in
`sessions/2026-08-10-sendmessage-transport/evidence/receiving-turn-captures.md`,
which also records the sender-identity ground truth and the teardown.

## Findings

1. **Fleet-to-fleet delivery works, in the receiving turn.**
   `sm-probe-a`'s send arrived at `sm-probe-b` wrapped as
   `<cross-session-message from="uds:/tmp/cc-socks/51828.sock"
   from-name="sm-probe-a" from-mode="bypass">` and was acted on in the
   turn that received it. Each herdr-launched session binds its own
   socket under `/tmp/cc-socks/<pid>.sock`.

2. **A socket-delivered slash command lands as plain text and is not
   executed — both command classes.** Built-in: `/rename sm-probe-slashed`
   sent via SendMessage arrived as literal text inside the wrapper; the
   model read it as a message and the terminal title never changed.
   Skill-backed: `/opsx:explore` likewise arrived as raw text — no skill
   loaded, no command block. Control: the same `/rename` sent through
   `herdr agent prompt` executed client-side (`Session renamed to:
   sm-probe-b`) before any model turn. **The socket path is
   envelopes-only; `herdr agent prompt` keeps the launch leg. The
   `bin/flywheel` extension dies.**

3. **`-n` is not required to register the address; `/rename` is
   sufficient.** Both probes were started as bare `claude --model haiku`
   (argv observed, no `-n`) and became resolvable by name in a peer's
   ListAgents after the ordinary `/rename` step the herdr reference
   already prescribes.

4. **First send to any cross-session name is refused pending a ref
   confirmation.** `'sm-probe-b' is not an agent in this conversation.
   Re-send with the ref…` — the error carries the exact ref, and the
   retry with `sm-probe-b [593313]` succeeds. Observed identically from
   two different senders. A scripted sender needs the two-step.

5. **A workflow-spawned session has no messaging address of its own.**
   This session (spawned by the intent-flywheel conductor's Workflow
   tool) inherited `CLAUDE_CODE_MESSAGING_SOCKET=/tmp/cc-socks/47447.sock`;
   PID 47447 is the conductor's own `claude` process. Its sends arrive as
   the conductor's message with a nested
   `<agent-message from="<agentId>">`, and a reply addressed to the
   visible name lands in the conductor's transcript, never here. The
   reply leg to a workflow session does not exist; envelope routing rules
   can only name real sessions.

6. **The reply leg is the footgun, not delivery.** The envelope's `from:`
   header is not a SendMessage address: the probe copied the header value
   out of the envelope body, got `agent_not_found`, then picked the
   nearest plausible name off ListAgents and delivered its token to a
   production conductor. If the envelope travels over SendMessage, its
   `from:` must equal the sender's registered session name — or the
   envelope must direct replies at the wrapper's `from-name` attribute,
   which the transport stamps and the sender cannot misstate.

7. **Not exercised:** the claim that a `bypassPermissions` receiver holds
   messages unless the sender also bypasses. Every leg here ran
   bypass-to-bypass (`from-mode="bypass"` stamped on each wrapper), so
   the hold path was never reached. Also unmeasured: cross-host, and
   delivery to a parked (stopped) session — no socket exists, so `inbox/`
   keeps that path by construction.

## Feeds

- `decisions/message-envelopes.md` — the amendment the question blocks:
  SendMessage as the preferred live transport when both ends are Claude
  Code sessions on one machine, envelopes only; `herdr agent prompt`
  keeps every slash-command leg, launch first of all; the envelope
  `from:` header must be the sender's registered session name.
- `questions/sendmessage-transport.md` — both halves answered by
  measurement.
