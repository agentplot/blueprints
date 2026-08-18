# Receiving-turn captures — sm-probe-b's pane, verbatim

Method: every send was made with the SendMessage tool; the receiver's pane
was read over the herdr channel (`herdr agent read sm-probe-b --source
recent-unwrapped`) in or immediately after the receiving turn, so what the
receiver saw is observed, not inferred. `claude` 2.1.226 on every end,
probes on haiku, started as bare `claude --model haiku` (argv confirmed in
the `agent_started` result — no `-n`), renamed via `/rename` and confirmed
by title before use.

## Leg 1 — this session → sm-probe-b, plain envelope

Send result:

```
{"success":false,"message":"'sm-probe-b' is not an agent in this conversation. Re-send with the ref to confirm you mean:\n  sm-probe-b [593313] — Claude session, on this machine, active 25s ago\ne.g. {\"to\": \"sm-probe-b [593313]\", ...}"}
```

Retry with `sm-probe-b [593313]`:

```
{"success":true,"message":"“envelope delivery probe, reply with token” → sm-probe-b (another Claude session on this machine)","msg_id":"0cf40a64-bda7-45f1-8ad8-7081d21606c7"}
```

Receiver pane, same turn — delivered as `› Message from @peer`, acted on
immediately. Its reply attempt, verbatim from the pane:

```
⏺ I need to fetch the SendMessage tool schema first to reply to this cross-session message.
  ⎿  No agent named 'sendmessage-transport-prototype' is reachable.
     Use ListAgents to see everyone you can message.
  ⎿  “Token receipt confirmation” → intent-flywheel (another Claude session on this machine)
```

The probe copied the envelope body's `from:` header (not a routable
address), failed, then picked `intent-flywheel` off ListAgents — a
production conductor — and delivered the token there.

## Leg 2 — sm-probe-a → sm-probe-b, fleet actor to fleet actor

Sender pane: bare-name send refused with the same ref-confirmation error;
retry with the ref succeeded. Receiver pane, receiving turn:

```
⏺ Received cross-session message from sm-probe-a:

  <cross-session-message from="uds:/tmp/cc-socks/51828.sock" from-name="sm-probe-a" from-mode="bypass">
  TOKEN-BRAVO-4483 fleet leg
  </cross-session-message>
```

## Leg 3 — built-in slash command over the socket

Message text exactly `/rename sm-probe-slashed`. Receiver pane:

```
› Message from @peer (ctrl+o to expand)

⏺ Received cross-session message from intent-flywheel:

  <cross-session-message from="uds:/tmp/cc-socks/47447.sock" from-name="intent-flywheel" from-mode="bypass">
  <agent-message from="a13713b68f5152c27">
  /rename sm-probe-slashed
  </agent-message>
  </cross-session-message>
```

`herdr agent get sm-probe-b` after: `"terminal_title_stripped":"sm-probe-b"`
— title unchanged; nothing executed client-side; the text reached the
model as a peer message.

Control, earlier in the same probe session, same command over the herdr
channel (`herdr agent prompt sm-probe-b "/rename sm-probe-b"`):

```
❯ /rename sm-probe-b
  ⎿  Session renamed to: sm-probe-b
```

— executed client-side, before any model turn.

## Leg 4 — skill slash command over the socket

Message text exactly `/opsx:explore`. Receiver pane:

```
⏺ Received cross-session message from intent-flywheel:

  <cross-session-message from="uds:/tmp/cc-socks/47447.sock" from-name="intent-flywheel" from-mode="bypass">
  <agent-message from="a13713b68f5152c27">
  /opsx:explore
  </agent-message>
  </cross-session-message>
```

No skill loaded, no command block — raw text to the model.

## Sender-identity ground truth

This session's environment: `CLAUDE_CODE_MESSAGING_SOCKET=/tmp/cc-socks/47447.sock`.

```
$ ps -p 47447 -o pid,ppid,command
  PID  PPID COMMAND
47447 23311 claude --agent flywheel-intent-conductor --model fable --plugin-dir /Users/chuck/Code/github_agentplot/flywheel/main --dangerously-skip-permissions
```

PID 47447 is the intent-flywheel conductor. The wrappers on legs 3–4 stamp
this session's sends `from-name="intent-flywheel"` with the nested
`<agent-message from="a13713b68f5152c27">` — the workflow agent id. This
session appears in no ListAgents under a name of its own, and the probe's
reply addressed to `intent-flywheel` landed in the conductor's transcript,
which answered it itself mid-Workflow-call.

## Reliability note

One retrospective quote — the probe re-quoting its first wrapper minutes
later — showed `from-name="sendmessage-transport-prototype"`, contradicting
the receiving-turn stamps from the same socket. Almost certainly the probe
conflating the envelope header with the wrapper attribute; excluded from
the findings. The receiving-turn captures above are the record.

## Teardown

Probe tab closed (`herdr tab close w1:tW`), workspace and worktree
force-removed (`herdr worktree remove --workspace w5 --force` — the force
because the probe had written stray files, which died with the worktree),
branch `spike/sendmessage-transport` deleted, `herdr agent list` shows
zero probes.
