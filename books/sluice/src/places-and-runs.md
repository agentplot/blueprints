# Places and runs

A place is a working copy sluice makes for one candidate. It holds
exactly the candidate's revision, with the environment the repository
declares, and nothing of any other place (33, 35). A candidate's checks
run in it and nowhere else, under an executor that holds them to the
limits the branch states.

## The place

A place is a detached git worktree at the candidate's revision, with
nothing run in it: no git hook, no worktree tool's hook, no setup of
any kind (C.1). What a check needs before it runs is the repository's
own toolchain step or a task the check depends on, run as a CI job runs
its setup.

A place belongs to its candidate. Nothing started in it outlives it,
and two places on one host never collide (32). Once the candidate's
verdict is read, sluice releases the place with everything started in
it ended (34, 25). sluice releases only places it made; a session's own
place is its driver's to release.

### Caches

A place starts with the caches its branch's policy declares (35). Each
cache is keyed by the content of the files it is built from and saved
only from a run that passed. A place takes the cache of its candidate's
key, or else the one saved last. A cache changes how fast a check runs,
never what it reports: a test build that takes minutes cold takes
seconds warm, and the result is the same either way.

## What sluice owes a run

sluice starts no service and chooses no port (31). What a candidate's
checks need, a database, a dev server, an emulator, the checks bring up
themselves in the candidate's place. Every CI job and every test
harness owns its own services the same way. The repository's task graph or its
test framework starts them and stops them.

A run gets from sluice exactly four things:

- a clean place holding exactly the candidate;
- `SLUICE_CHECKOUT` and `SLUICE_TMP` in its environment: the place's
  path and a scratch directory of its own. A harness names its
  databases, sockets and state directories from them and never
  collides;
- a time limit, the branch's policy's;
- one process group, which sluice ends when the command exits, times
  out, or the place is released.

A run that exceeds its time limit is ended with everything it started,
recorded as timed out, and read as failed (66). A process that escapes
the group, a container or a detached daemon, is the repository's to
stop.

## The executor

An executor runs a command in a place within the limits a run is held
to (83). The processors are what its instance gives each run. The
memory, the network and the paths a run may write are what the
branch's policy states. It reports what it enforced: whether the run was confined, and
each limit it held.

An executor that cannot enforce a limit the policy states refuses the
run rather than run it without the limit (84). Every run is recorded
with what its executor enforced, so a run is never read as confined, or
as held to a limit, unless its executor enforced it (84, 16).

The policy names one executor profile (C.2):

| executor | what it enforces |
|---|---|
| **open** | a process group on the instance's host; the processors given, by the runner's own threads; nothing else; never confined |
| **sandbox** | the host's kernel sandbox: Seatbelt on macOS, bubblewrap and Landlock on Linux. Writes only to the place and its scratch. The network as the policy says. Processors and memory on Linux, by a cgroup. Confined when no session on the host can write the place |
| **container** | a container engine on the executing host; the place mounted into a new container from the repository's image; processors, memory, paths and network; confined as the deployment says |

A run is confined only when its executor established that nothing of
any session could reach the place and nothing but the executor could
have written its records. Confinement is never inferred from the
executor's kind.

## How many runs at once

An instance of sluice starts no more checks at once than its own bound,
whatever the windows of the branches it serves (71). A host whose
checks are all started by one instance runs no more than that
instance's bound. The bound is the host's own setting, not the
repository's: a quarter of the processors by default, shared equally
between runs, or the number the host's configuration names.

Where each session runs its own rounds, the branches' windows are the
only limit, and that is the cost of running that way. One `sluice run`
on a host, reached by every submission, is what caps the host.

## The check seam

The check seam answers two questions. Given the branch's revision and a
candidate, which checks can the candidate change the result of (36)?
Given a place and checks, what is each check's key, its outcome, its
executor, and whether the outcome was observed in this run or read from
an earlier one (37)? An outcome is what the executor observed, never
inferred, and a replay says it is a replay (38).

Two profiles bind it (C.2):

| profile | affected | run |
|---|---|---|
| **moon** | moon's affected projects between the branch's revision and the candidate, downstream dependents included | moon's run of the affected check tasks; the run report gives each task's outcome and whether it was replayed; the run record gives its hash as the key and its exit code |
| **script** | every check, always | one command's exit code, never a replay |

With moon, a candidate runs only the tasks it affects, and a task whose
inputs match a run that passed replays its result. With a script, every
check runs every time. Either way the gate reads the same records (53).
