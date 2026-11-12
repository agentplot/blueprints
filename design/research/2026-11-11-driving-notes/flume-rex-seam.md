# Flume: Rex as a second multiplexer seam

## Goal
Add Rex as a seam in Flume next to Herdr. The minimum contract is small:

1. **Start** an agent session in a terminal.
2. **Send** an agent a message.
3. **Know** when the agent is done (or blocked).
4. **Read** the reply.

Do not try to reproduce the Herdr implementation one-to-one. An earlier Claude Code attempt pushed back because Rex lacks Herdr's agent-level awareness. That's true, but it's the wrong bar: rebuild only the four operations above.

## Why it differs from Herdr
- **Herdr** knows agent state itself (it installs hooks) and is request/response: Flume asks "what is this agent doing?" and gets an answer.
- **Rex** is a lower-level primitive. It streams raw PTY bytes to per-client emulators and leaves agent semantics to whoever builds on top. Flume has to *listen* instead of *ask*.

So the Rex adapter is a small event loop, not just another set of CLI calls.

## Design: two channels

### Command path (on demand, short-lived CLI calls)
| Operation | Rex mechanism |
|---|---|
| Start agent | Create a block / `rex run` the agent command in the place's working directory. **Save the returned block ID.** |
| Send message | `rex send <block> "<text>"` then `rex send-key` Enter |
| Read reply | `rex capture <block>` (screen + scrollback) |
| Discover API | `rex api list`, `rex api describe` — the CLI and Lua API are generated from the server API, so this shows exactly what the installed version supports |

Block IDs are stable and never reused — use them as the agent handle.

### Event path (always on, one per host)
- Run `rex events --json` as a long-lived child process. It streams one JSON object per line.
- Watch for `terminal.program_status_changed`. When a block goes `done` or `idle`, run `rex capture`. When it goes `blocked`, surface it (permission / question / auth).

### Optional: Lua shim on the Rex server
Not needed for a first cut. Useful if logic should live next to the server:
- `rex.on(...)` handlers keep a script running and fire per event; `--all` covers every session including future ones.
- `rex.wait` returns an event table, or `nil, "timeout"`.
- `rex.server(LABEL)` addresses another host with the same API.
- Uses: filter to `app = claude-code` status changes, or do agent restore locally.

## Where status comes from: OSC 7501 (Program Status Protocol)
- The **program in the terminal** writes the escape sequence; Rex parses it and emits structured events. Flume never parses escape codes.
- States: `idle`, `working`, `blocked` (kinds: permission, question, auth), `done`, `failed`. An `app` key identifies the program (e.g. `claude-code`). Child records (id/title/message) can represent sub-tasks and show up in Rex's UI for free.
- **Claude Code**: changelog for 2.1.295 lists native OSC 7501 support. One project observed idle → working → done (with summary). The `blocked`-on-permission case was **not yet confirmed** — test it.
- **Codex**: Rex detects status via a SessionStart hook it adds.
- **Fallback** for any harness without native support: Flume installs hooks (e.g. Claude Code `Stop` → done, `Notification` → blocked/permission) that print the OSC 7501 sequence to the terminal's tty.

## Host topology
- Rex server runs on Linux/FreeBSD as well as macOS; the only shipping client is the Mac app.
- Run one Boom Drive runner per host, talking to the **local** Rex server over its Unix socket. Firstmate takes the same approach (refuses non-local Rex, because PIDs/paths only mean something on their own machine).
- If Flume ever drives a remote Rex directly: rely only on block IDs and status events, never PIDs or local paths.

## Nix note
NixOS / nix-darwin reset PATH at shell start and can drop `rex`. Use the documented `interactiveShellInit` fix in the clan config.

## Open questions
- Exact event JSON fields for `program_status_changed` — confirm with `rex events --json` on a live server.
- Whether `rex events` can filter server-side, or Flume filters client-side.
- Long-term: make Herdr fit the same send/listen/capture seam so both adapters share one interface.

## Sources
- Rex docs, Program Status: https://www.superlogical.com/rex/docs/build/program-status
- Rex docs, CLI: https://www.superlogical.com/rex/docs/automate/cli
- Firstmate Rex backend: https://github.com/kunchenguid/firstmate/blob/main/docs/rex-backend.md
