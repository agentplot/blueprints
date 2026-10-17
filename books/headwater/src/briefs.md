# Briefs and fixers

headwater never acts on a release (36). A fixer does: a coding agent or
a person who makes changes, and who decides whether and how to move a
pin. headwater hands the fixer a brief, everything needed to move one
dependency to one release, and the change the fixer makes is the
fixer's.

## What a brief holds

headwater gives a brief for any release a report holds (25). The brief
holds:

- the release, with its version, its date and its link;
- its notes, whole, or the part asked for with a way to read the whole
  again (12);
- its advisories;
- every declaration of the dependency in the repository state, with the
  pin each gives (26).

The declarations let a fixer move every one. A dependency declared in
two projects at two pins needs both moved, and the brief names both,
with the older pin the report measured from (4, 26).

## What a brief reaches

Asking for a brief reaches no source but the notes and advisory
sources, and writes nothing but notes it keeps whole (25). The release
itself comes from what headwater already holds.

## What a brief leaves out

A brief prescribes nothing (27). It names no tool that acts on it and
no step a fixer must take. The fixer chooses: a lockfile update, a code
change the notes call for, or no change at all. headwater judges none
of these, and a brief reads the same whichever fixer will act on it
(34).

## The command and the diff

The capture design settles two more things a brief carries, and the
statement takes them at plan step H1, where they amend (27)
(`design/capture/design.md`). A brief names the ecosystem's own
command for the move: `npm update` or `npm install <name>@<version>`,
`uv lock --upgrade-package`, `cargo update -p`, `go get`, `mise use`.
Whoever makes the change runs it, and headwater never does. Beside the
release's notes, a brief can carry the published package's own diff
between the pin and the release (`npm diff`), so a change to a README
or a CHANGELOG shows as upstream shipped it.

## After the brief

The fixer makes the change in a place of its own, and the repository's
own gate decides whether it lands (section 8). In a repository that
lands through [sluice](../sluice/), the fixer submits and sluice lands
what passes. Once the change lands, the next reading has the new pin,
and the releases it reaches leave every report with no acknowledgement
written (9, S4).

A surface hands a brief on. The Claude Code plugin hands it to a
background agent in a worktree of its own, and the herdr plugin's key
starts a new agent in a worktree with it (section 9). In a repository
crew runs, a bump comes only through crew's plan, and the herdr key
hands the release to millpond instead; [Releases as
captures](captures.md) follows that path.

Still to rule: questions 26 and 27; the command and the diff enter the
statement at plan step H1. See
[Open questions](open.md#briefs-and-fixers).
