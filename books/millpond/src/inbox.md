# The inbox

An inbox is a git repository, or a branch in one, holding captures,
signals, moves and items in Flywheel's record formats:
`flywheel-capture/1`, `flywheel-signal/1`, `flywheel-move/1`, and the
item record (114). Each capture exists once at rest, as a folder named
from its event date and its key. JSON exists only in flight, on an
adapter's standard output and between millpond and its tools. At rest
each record is a rec file, the plain-text format of GNU recutils.

Keeping Flywheel's formats is what lets the inbox outlive its host.
crew reads it through millpond today, and Flywheel reads the same files
later with no import (114).

## Writes

millpond names an inbox by the path of its checkout and commits each
write there. It holds a lock in the inbox's git directory for each
write, so a tick, a reader, a curation session and crew's agents never
write at once. Every write is a commit, so the inbox's history is
`git log` of its checkout: each landing, each batch of moves, each
brief and each send.

## Settings

The settings are one file at the inbox's root, `millpond.toml`. It
holds:

- the inbox's parts, each with its schedule, its configuration, and the
  host whose tick runs it;
- the cut, when it differs from 8 KiB;
- the command that starts a reader;
- whether items go to worktrees or to crew.

A part names one host, so an inbox checked out on two hosts runs each
part once. The settings travel with the inbox, and every host that
checks the inbox out reads the same ones.

## What stays on the host

Two things stay off git, each kept per host.

| What | Where | In git |
|---|---|---|
| captures, signals, moves and items | the inbox | yes |
| the settings | `millpond.toml` at the inbox's root | yes |
| raw material | the host's raw bank, under millpond's data directory, keyed by inbox and capture | no |
| cursors and run status | millpond's state directory, keyed by inbox and part | no |

The raw bank holds material too large or too private for git, and each
capture points into it. Cursors and run status belong to the host whose
tick runs a part, so they live beside that tick.

## What comes in once

Two bodies of work predate their inbox, and millpond's signals-folder
import carries each in once:

- **crew's folders** on each partition's flywheel branch: a
  `capture.md` and one `NN-<slug>.md` per signal. A release capture
  keeps the key it landed under, `release/<name>/<version>`. The import
  keys every other capture by its folder's name.
- **The meeting corpus** already read in a partition's blueprints
  repository.

The import keeps each capture's source, event date, signals and moves
as they were read, and charges no reader for them (114). It keys each
capture by its own key, so importing a folder twice writes nothing the
second time. After the import every capture has one home, and the
dedupe by key looks in one place.
