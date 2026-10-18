# Session runs: a session's checks under sluice's bound, ports and release

Drafted clauses letting a session run its checks, before it submits,
under the same contract sluice gives a candidate's place: room under
the host's bound, the ports the policy names, the executor's limits, a
release that ends what the checks started, and a record under the key
when the place holds exactly its head. Parts A and B gain nine clauses,
89 to 97; Part C gains a command, `sluice exec`, in the driver row, a
clause for the session's place in C.1, and the worktrunk row's removal
runs a release first. Nothing here edits `../requirements.md`; the
operator rules on it.

## What it answers

A crew's sessions build in their own places and run the repository's
checks there while they work: a test suite that brings up a stack of
services and a container engine of its own. Each session does so alone.
On one host with several sessions, nothing bounds how many such runs
go at once, two stacks take the same ports, and what a run started
outlives it until the place is removed. The statement gives every one
of these to a candidate's place and none to a session's: the bound
(71), the ports (31), the limits (83), and the release (34). sluice never
releases a session's place (25), and never runs a check of its own (30),
so a session's run of its own checks, in its own place, is a run the
session asks for and sluice holds to the contract.

A second gap follows. A session's place is removed by its driver when
its entry lands, and under worktrunk a `post-remove` hook runs then. A
run's leftovers, containers above all, are not the removal's to find:
the release that ends them is the policy's release command (C.1), which
today runs only in sluice's places.

## The shape

`sluice exec`, run in a session's place, is the execute contract (83)
opened to a place sluice did not make. With no command it runs the
checks the place's head affects against its branch (36); with a command
after `--` it runs that command. Either way the run counts against
the host's bound, receives the place's ports, runs under the host's
executor with the policy's limits, and ends with its process group.
What the run handed to another process stays with the place, so a
session iterating on a suite keeps its stack up between runs. The place
is released by `sluice release`, which the session or its driver runs
before the place is removed, and a session's place is never released by
sluice on its own (25).

A run of the checks, in a place that holds exactly its head, is recorded
under its keys as an open run (16, 69). A bolt branch whose gate trusts
open runs then reads the session's own run as its evidence, and the
submission that follows replays it (37). A dirty place runs and records
nothing. On a fleet, `sluice exec --remote` sends the run to the fleet's
executors as a run on a pushed revision with no entry, taken by claim
or launched like a candidate's (75, 88), in a place sluice makes and
releases, so the host running the sessions runs none of their checks.

## Vocabulary

- **session run**: a run of a session's checks or command that the
  session asks for in a place of its own, recorded under its keys only
  when the place holds exactly its head.

## The run: the contract a session's place gets

### The problem

31 gives a place a port for each name the policy lists and 71 bounds an
instance's runs; both speak of the places sluice makes. A session's place
gets neither, and nothing says what executor a session's own run goes
through or which limits it is held to.

### What the statement already settles

A place is a working copy prepared for one session (glossary), and the
session's is the one sluice never releases (25). The execute contract
takes any place (83) and reports what its executor enforced (84). The
bound is the instance's own (71).

### The ruling

> 89. A session may ask the instance on its host to run its checks, or a
>     command, in its own place. Such a run counts against the
>     instance's bound (71) for exactly as long as it runs, is executed
>     by the host's executor under the limits the branch's policy states
>     (83), and ends with its process group (66). sluice runs no check
>     of its own by it (30).
>
> 90. A session's place receives a port for each name its branch's
>     policy lists on its first run, and keeps each for the place's whole
>     life (31). A session's run is never confined (glossary, executor).
>
> 91. When a candidate's run and a session's run both wait for room on
>     one host, the candidate's is started first. The host's own setting
>     may reserve part of its bound for candidates' runs; by default
>     sessions' runs may hold all of it.

89 makes the session's run a run like any other to the executor and the
bound, and keeps 30: the session asks, the executor runs, sluice counts.
90 gives the ports to the place rather than the run, so a stack a run
brought up on them is still on them for the next run. 91 keeps the
queue moving when every session on a host is testing at once: a
candidate's run stands between other sessions and their landing, a
session's run stands between one session and its next edit.

## The record: a session's run as the gate's evidence

### The problem

A session runs the suite, it passes, the session submits, and the
candidate's checks run the suite again on the same inputs. 69 says a
pass belongs to its key, not to a branch, and a bolt branch's gate
trusts open runs. What is missing is a rule for when a session's run
has the key its candidate will ask for.

### What the statement already settles

A key is a check over the inputs it reads (glossary); a pass under a key
satisfies every gate that trusts its executor (69); a result a tool
answered from an earlier run is a replay, never recorded as a run (16).
The script profile keys by revision and never replays (C.2).

### The ruling

> 92. A session's run of its checks is recorded under its keys, with its
>     executor, when its place holds exactly its head: nothing unstaged,
>     nothing staged, nothing untracked that is not ignored. A run in any
>     other place has no key and records nothing. A session's run of a
>     command records nothing.
>
> 93. A candidate whose required checks are covered under their keys by
>     recorded runs the gate trusts replays them (37); a session's
>     recorded run is one such run, and it saves the caches its branch's
>     policy declares as a passed candidate does (35).

92 holds the key honest under both check profiles: moon's key is over
content and would be sound on a dirty tree, the script profile's is over
the revision and would not. One rule covers both. 93 adds nothing to the
statement and is here to say the consequence aloud: on a bolt branch the
session's own run is the gate's evidence, and the submission that follows
it runs only what the candidate changed.

## The release: what a run leaves, and who ends it

### The problem

34 releases a place sluice made with everything started in it ended,
through the policy's release command (C.1). A session's place is never
sluice's to release (25). So what a session's run handed to another
process, a container engine's containers above all, has no end until
the driver removes the place, and the removal knows nothing of it.

### What the statement already settles

Release is a contract over a place (34). A session's place is released
by its driver (25, S11). Under worktrunk the driver removes the place on
landing and runs `post-remove` (C.5).

### The ruling

> 94. What a session's run hands to another process to keep stays with
>     the session's place when the run ends, and is ended only by the
>     place's release.
>
> 95. A session's place is released only at the asking of its session
>     or its driver: the policy's release command run in the place under
>     the host's executor, everything its runs started ended, and its
>     ports let go (34). The place itself is removed by its driver (25).
>     A driver that removes a session's place releases it first.

94 is the iterating session's rule: a stack brought up by one run is
there for the next, and sluice does not tear it down between them. What
a place keeps between runs counts against nothing: the bound counts
runs. 95
says who ends it and when. The release is the same command for every
place on the host, so a check's cleanup is written once in the policy
and runs for a candidate's place when its verdict is read (25) and for
a session's place when its driver removes it, or when the session asks.

## The remote run: a session's checks on the fleet

### The problem

On a fleet whose sessions share a host, the sessions' own runs load the
host the sessions think on. The user's shape: the session commits,
pushes, and asks for the run elsewhere, on an executor that is warm.
Under a central server the executors are the server's (C.8); under
peers, any host with room claims a run (75); a pool launches one (88).
None of these takes a run that has no candidate.

### What the statement already settles

A run is opened on a revision and taken by a claim or launched (75, 88).
A place sluice makes is released once the verdict is read (25); a
session's run has no verdict. Caches the policy declares make a run on
a warm host a replay of what its inputs did not change (35).

### The ruling

> 96. A session may ask for its run of its checks to be taken by the
>     fleet's executors instead of its own host's: its head is pushed as
>     a remote submission pushes it (C.5), the run is opened on that
>     revision with no entry, taken by claim or launched (75, 88) by an
>     executor that is the system the run requires (87), and its place is
>     released once its outcome is read, as a candidate's is (25). The
>     outcome is recorded under its keys with its executor (16, 92), and
>     delivered to the session as an outcome is (50).

A remote session run can be confined, where the executor is (glossary),
so its record may satisfy the shared branch's gate too (29); whether it
does is the policy's trust (27). The session's own place is untouched
by it: no port is taken, nothing counted on the session's host, and nothing to
release there.

## The abandoned place: what sluice can see, and what it cannot

### The problem

A session's place holds its ports and what its runs started until it is
released (94, 95), and a session between two runs looks the same from
outside as a session that is gone. A session killed with its stack up,
or a worktree removed without `sluice release`, leaves the record, the
ports and the containers held with nothing to release them.

### What the statement already settles

sluice never releases a session's place (25). A place is a working copy
prepared for one session (glossary).

### The ruling

> 97. A session's place whose working copy no longer exists is no
>     session's: the next session run or round on the host releases it
>     (95). A session's place whose working copy exists is held until
>     its session or driver releases it, however long its last run is
>     past, and sluice lists every session place it holds, with the
>     time, head and outcome of its last run, to the operator and to any
>     session on the host.

97 keeps 25 whole: a place with no working copy has no session to own
it. A place with a working copy and no sign of its session is left
alone, because a session thinking for an hour between two runs and a
session that died look alike, and ending the first's stack costs more
than the second's leak. The list is what makes the leak visible to a
person or a crew, which release it. The head and outcome let the
operator and a session tell a head that passed from one that failed
without running it again; a command's run and a run in a place holding
more than its head are listed with their outcome and never recorded
under keys, which is all 92's "records nothing" governs.

## Part C, rows

**C.1 the place** gains a row:

| profile | materialize | release |
|---|---|---|
| **session worktree**: a session's own place, worktrunk's or a plain `git worktree` | nothing: the place is the session's, and a session run takes it as found; on the place's first run, a block of ports held for it on the host, each checked free, kept until the release (90); `SLUICE_CHECKOUT` the place and `SLUICE_TMP` a scratch directory kept across its runs | by `sluice release` in the place (95): the policy's release command run under the host's executor, every session run's process group ended, the scratch directory removed, the ports let go; the worktree left standing for its driver to remove |

**C.3 the executor**, the open row's execute cell gains: "the host's
session runs recorded in the host's own state beside its port blocks, each
live while its supervisor holds its run's lock, so runs an instance
starts and runs `sluice exec` starts count together, with or without a
standing instance, and nothing of them reaches the records".

**C.5 the driver** gains a row:

| profile | submit / withdraw / state / notify / forecast |
|---|---|
| **session run**: `sluice exec` in a session's place | `sluice exec <branch>` runs the checks the head affects against the branch (36) and `sluice exec <branch> -- <command>` runs the command, each a session run (89); the run's output is the session's terminal's and its exit the command's; `--remote` sends the run to the fleet (96) and reads its outcome as a remote submission reads its state (C.5 remote submit); `--release` releases the place when the run ends (95); `sluice release` releases it on its own |

**C.5 the driver**, the worktrunk row gains: "before worktrunk removes
the session's place, `wt submit` runs `sluice release` in it (95), so a
`post-remove` hook finds nothing of the session's runs left to end".

**C.7 policy**: the release command and the port names are read as they
are today, from the branch's revision (56); a session's place takes them
from the branch it was taken off.

**The host's setting** gains, beside its bound: how many of the bound
sessions' runs may hold at once (91), by default all of it.

## Scenarios

- **S25.** Four sessions on one host each run the suite, and the host's
  bound is two. Two runs start; two wait; a candidate's run that
  arrives waits only for the next run to end and starts before the third
  session's.
- **S26.** A session runs the suite in a clean place, edits nothing, and
  submits. The candidate's required checks are covered under their keys
  by the session's run; the bolt branch's gate trusts open runs, so the
  candidate replays them and lands without running the suite again.
- **S27.** A session runs the suite, which brings up a container engine
  and a stack. The run ends; the stack stays. The session runs the suite
  again and the stack is reused. The entry lands; `wt submit` runs
  `sluice release` and the stack and engine are gone before worktrunk
  removes the worktree.
- **S28.** A session runs the suite with a file unstaged. The run gives
  its outcome and records nothing; the candidate formed later runs the
  suite.
- **S29.** A session on a fleet pushes its head and runs `sluice exec
  --remote`. Nothing is counted on its host and no port taken; a standing
  executor on a host that runs no sessions claims the run, replays what
  the caches cover, and its record is confined. The candidate on the
  shared branch replays it.

## What it changes elsewhere

- Non-goal "hosting an executor" and I5 stand: a session run is the
  host's executor running what the session asked for, counted and
  equipped by sluice.
- 25 stands as written; 95 names the moment a driver releases a
  session's place and the command it does so with.
- `wt submit` and the plain git path on the site: the worktrunk guide's
  `post-remove` paragraph, and a sentence in the walkthrough's services
  section pointing a crew at `sluice exec`.

