# Rex: capabilities and ecosystem (snapshot, Nov 2026)

Rex is early (weeks into a tester beta). Treat everything here as a snapshot.

## Platform
- Server: macOS, Linux, FreeBSD. Client: Mac app only (unofficial Linux client: rex-rune).
- Sessions live in the server, not the window. Mac app can attach to remote hosts.
- Superlogical has said sessions will be accessible via the web with live sharing.

## UI surface for Flume/Sluice
- Only documented block type is a **terminal**. Custom screens = TUIs in blocks.
- Layouts are scriptable from Lua/CLI: `new_window`, `new_split`, and `new_layer` (**undocumented**; name suggests an overlay → possible replacement for the Herdr popover).
- No equivalent to Herdr's sidebar slots / inline status tokens. Status chrome (tab spinners, session-picker indicators) is driven by OSC 7501. To get inline status, report through the protocol (including child records per task).
- "Block Plugins" appears in the docs nav but has no published page — likely the future home of non-terminal custom blocks. Possibly visible via the beta Discord.
- Rex ships a native agent skill; agents inside Rex get `REX_SESSION` and `REX_BLOCK` env vars.

## Prior art (community projects)
Mostly end-user tools, not libraries. Nobody yet owns the "spawn agent → send → wait → capture → keep alive" layer — an opening for Flume's adapter to double as a small library.

| Project | What it is | Relevance |
|---|---|---|
| Firstmate | Agent orchestrator with pluggable multiplexer backends incl. Rex | Closest analog to Flume; requires local Rex |
| rex-inbox | Inbox of approvals/questions/failures; agents message each other and you; answer permission prompts remotely | Human-in-the-loop prior art; uses the send path |
| rex-radar | Status monitoring with per-agent-version verified results; macOS/iPhone/Watch | Good reference for which agents emit which states |
| herdr2rex | Imports Herdr workspaces into Rex, including resumable agent conversations | Migration path + agent-restore prior art |
| barbasol-can | Moves Claude Code / Codex / OpenCode conversations to another Rex host | Same trick as account-pool session moves |
| rex-agent-relay | Passes turns/files between paired Claude Code and Codex agents | Agent-to-agent messaging |
| rex-mcp-bridge | MCP server letting agents read/run in Rex windows | Agent-facing, not a library |
| rex-rune | Unofficial native Linux client (Rust) | — |

Popularity (stars etc.) not yet checked.

## Sources
- awesome-rex list: https://github.com/beejmaxx/awesome-rex
- Rex docs: https://www.superlogical.com/rex/docs/
