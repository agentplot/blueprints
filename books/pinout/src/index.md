# pinout

A pinout tells you what every pin of a chip does without opening the
chip. pinout does that for a repository: what its projects are, which
one owns a file, what a change affects, how a task is run, and what that
task reads. It answers the same way whether the repository is organized
by moon, Turborepo, Nx, a package manager's workspaces, or nothing at
all, so whoever asks learns one set of questions instead of one tool per
repository.

## Why it exists

Monorepo tools all know the same things about a repository and each
says them differently. That costs most where work is now done by agents.
An agent arriving in a repository it has never seen reads the README,
guesses a test command, and often runs the whole suite to check a
one-file change. Across a fleet of agents working in hundreds of
checkouts, that guessing is most of the cost of verifying their work.
pinout gives them the exact answer instead: the owning project, the one
invocation the repository itself uses (20), and only the projects the
change affects (12).

The same answers serve the other side. A pipeline plans which jobs to
run from what a change affects. A build platform finds the parts of a
repository without asking it to adopt a monorepo tool. And a test
ledger keys each check by a digest of exactly what it reads (16, 17),
which is what lets a pass proven in one place be trusted in another.

## What it promises

pinout only describes, and never acts (1). Its answers are
reproducible to the byte (2). It keeps "the repository does not say"
apart from "pinout could not ask" and from "there is nothing here" (3,
5), because a reader that mistakes one for another makes the wrong
decision quietly. And where it cannot be sure, it errs toward the safe
answer: a change affects more projects rather than fewer (13), and a
digest is unknown rather than computed over part of the inputs (15).

Every digest says what its completeness rests on (14). A repository
that lists its inputs gives a declared digest; a repository whose tool
only implies them gives one under the profile's stated convention (30).
pinout claims nothing stronger, and leaves it to whoever reads the
digest to decide how much that is worth.

## Why it is open source

pinout is a protocol more than a program, in the way the Language
Server Protocol is: its value grows with each workspace tool bound to it
and each consumer that asks it questions, and neither side needs the
other to know it. A protocol only one organization uses is a private
convention. Published, it is something a monorepo tool can implement
directly, an agent framework can rely on, and a build platform can
depend on without owning.

## Where it stops

pinout describes one repository and stops. It runs no task, caches no
output, records no result, chooses nothing for an asker and versions
nothing (section 8). A team needs nothing beside it to ask its
questions: no account, no service and no other project of ours.

Whatever is built on its answers, a ledger of results or a platform that
builds and releases, asks through the same surfaces as anyone and gets
the same answer (6), in words that belong to no one asker (21): no
asker is privileged.

## How to read this book

Part I is the statement of invariants, included from
`design/pinout/requirements.md` so the book cannot drift from it. Part A
is what pinout answers, Part B the contract any workspace tool is read
through, and Part C the profiles that bind it to each tool. Clause
numbers in parentheses here point into it.
