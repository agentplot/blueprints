# Rex as flume's second terminal

The operator's notes of 2026-11-11 ask for Rex as a second terminal beside
herdr, with four operations: start, send, know and read
(`2026-11-11-driving-notes/flume-rex-seam.md`). This page weighs those notes
against flume's statement (`design/flume/requirements.md`) and against Rex
itself, read on deneb on 2026-11-11, and carries the talk with the operator
that settles the Rex profile's rows. The rows themselves are the proposed
amendment to C.5 on this branch.

## What Rex is, read on deneb

The release read is Rex Beta 0.1.0 (build 1925), whose server and command
line report `rex 0.1.0-preview.14`, commit `7e460d0`, built
2026-11-09, API revision 12. Every finding below was read from that release
by `rex <command> --help`, `rex api list`, `rex api describe <method>`,
`rex skill show`, the docs at `superlogical.com/rex/docs` (`llms-full.txt`
and the Program Status page), and by driving a server of its own: a
`rex server run` on a socket and state folder of the test's, so no session of
the operator's was touched. A stand-in script that writes OSC 7501 reports,
and then Claude Code 2.1.322 itself, ran in that server's blocks.

### Where it lives

- The command line ships inside the app, at
  `Rex Beta.app/Contents/Helpers/Rex Server.rex/Contents/MacOS/rex`, and is not
  on the `PATH`. The server the app runs is a second copy, under
  `~/Library/Application Support/com.superlogical.rex/RexServer/Versions/`,
  replaced when the app updates.
- One server per user listens on
  `~/Library/Application Support/rex/server.sock` and admits callers by their
  peer credentials. Every command reaches it with `-S <address>`; without one
  it uses the user's server. Every command starts a missing local server
  unless given `--autostart=false`. Each request is bounded by `--timeout`,
  ten seconds where none is given.
- A Unix socket's path is limited to 104 bytes on macOS; a longer `--listen`
  path fails to bind.
- The server runs with `--websocket-origin-pattern https://rex.superlogical.com`,
  so Superlogical's web client reaches the user's server from a browser.

### The model

A server holds sessions; a session holds windows (the app's tabs); a window
holds blocks (panes) in splits or floating layers. A terminal block is the
flavor `com.superlogical.terminal.shell`. Sessions, windows and blocks carry
IDs such as `block:01a1cd87-…` (UUIDv7) and labels of up to 128 characters
that a person or a client can change. A label is unique only where the server
chose it.

### Open

`session.create` makes a session with its first windows and blocks in one
call, and `session.new_window` and `session.new_split` add a window or a
block to a session. Each answers the new IDs. A terminal block takes these
options: `command` (a program and its arguments, which reach it unchanged),
`shell` (`none` starts the command directly), `cwd`, `path_prepend`,
`login`, `interactive`, `initial_input`, `exit`, `size` and `theme`. **It
takes no environment.** A block's program gets the server's environment,
and on macOS runs under `/usr/bin/login`, which `process` reports as the
block's child. A program given as `/usr/bin/env K=V … <program>` with
`shell` `none` got the variables in the test. Inside a block Rex sets
`REX_SESSION` and `REX_BLOCK`.

### Send

`com.superlogical.terminal.write` types text as if a person typed it, and
returns once the text is queued, without waiting for the program to read
it. `block.event` sends a key, a paste or a mouse event; `rex send` and
`rex send-key` wrap the two. Rex gives no word that a program received what
was typed.

### State: the Program Status Protocol

A program in a block reports its own state with OSC 7501. Rex keeps the
reports as records, one per id, and answers them on asking:
`com.superlogical.terminal.program_status` gives every record with its
`state`, `kind`, `app`, `msg`, `title`, `progress`, `owner` (the foreground
process when the report came, by pid and name) and `updated_at`. The same
records come as `program_status_changed` and `program_status_removed` events
to a client attached to the session.

- The states are `idle`, `working`, `done`, `blocked` and `error`. The notes'
  `failed` is Rex's `error`. A `blocked` record may carry a `kind`:
  `permission`, `question` or `auth`.
- `working` and `blocked` records are dropped when the program exits or a
  shell prompt begins. `done` and `error` survive both.
- Claude Code 2.1.322 reports natively, as `app=claude-code`. In the test it
  reported `idle` once up, `working` at a prompt, with its tool's activity as
  `msg`, `done` at the end of the turn, which it kept, `blocked` with
  `kind=question` and its question as `msg` when it asked one, `idle` when
  the question was dismissed, and it cleared its records when it exited. A
  `blocked` with `kind=permission` was not seen: the account's settings let
  the tool it was asked to run go without asking.
- A program that reports nothing leaves no record.

### Process, exit and close

`com.superlogical.terminal.process` gives the block's child, its foreground
process and `last_exit` once the program has exited; `child_exited` comes as
an event with the exit code. A block's `exit` option decides whether the block
closes when its program exits; with `on_completion` false it stays.
`block.close` closes a block and ends its program; `session.close_window` and
`session.destroy` close a window or a session with every block in it.

### Screen

`rex capture` and `com.superlogical.terminal.format` give the screen and the
scrollback as text, HTML or escape sequences, about 64 MiB of scrollback. No
option limits a read to the visible screen; `size` gives the rows.

### A server's restart

A server saves its sessions and, at its next start, restores them with the
same session, window and block IDs, labels and working folders. It never
starts the restored blocks' programs again: the log says `not replaying
creation options on restore` with `[shell command]` dropped, and each block
comes back running the user's login shell, its scrollback and records empty.
Stopping the server ends every program in its sessions. Each start has an
`instance` ID that `rex whoami` and `server.status` give.

### Showing a session to a person

The command line has no command that shows a session in a terminal window.
The app shows one when told: `rex -C <client> do session.select
session_id=<id>`, which the app on deneb lists, works only while the app is
open and its Remote Control setting is on, which is off by default.

### What Rex installs into agents

`rex skill setup` writes a skill and a SessionStart hook into each agent's
configuration home, the hook telling the agent its Rex session and block. On
deneb Codex and OpenCode have them, and the account `amadden`'s Claude Code
home does not.

## The notes against the written design

The statement already answers most of the notes. flume's terminal seam is one
interface for every multiplexer (B.5; core.2), and a new multiplexer is one
terminal profile, named by a stream's `multiplexer` (flume record 0037). C.5
names Rex as a profile that may be written, and S91 refuses a stream naming
`rex` until one is.

The notes' four operations map onto the seam's: start is open (94), send is
send (95), know is state (96) and read is screen (136). The seam has five
more, close, tidy, show, attach and runs (97, 138, 139, 187, 201), and the
profile answers each.

Three of the notes' mechanics go against rules the operator accepted:

- **An always-on `rex events` process.** flume runs no process of its own
  between its commands (120; core.13), and the terminal settles nothing (122).
  Rex makes the process needless besides: `program_status` answers a block's
  state on asking, as herdr's `pane get` does, and an agent's quiet comes
  from its own hooks (121; record 0016). The notes' premise that flume must
  listen to Rex rather than ask it does not hold of the release read.
- **Reading done or blocked from the terminal as the agent's end.** A stage's
  end is read from its deliverable or a stop-short, never from a terminal's
  state (core.9), and a part the agent profile builds from its program's own
  record is never read from the terminal (core.39).
- **Reading the reply off the screen.** Results come from the deliverable or
  a stop-short (core.9, 92); screen is for status and a start never begun
  (136).

An agent the terminal brings back with no started ack is never the stage's
agent (77; record 0016). Under Rex no agent comes back at all: a restored
block runs a bare shell.

The web terminal sits behind flume's terminal seam (agentplot/boomdrive
record 0004), drawn with xterm.js (agentplot/boomdrive-cloud record 0061) and
carried end to end through the runner (boomdrive-cloud record 0016), so
Superlogical's own web client is out of it. The relay Boomdrive's record 0004
asks of flume is not yet in flume's statement; this brief does not take it
up.
