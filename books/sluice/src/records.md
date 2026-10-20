# The records

Everything sluice knows is in the records: one JSON document per entry
and one JSON Lines log of runs and verdicts per branch. They have one
form whatever profile wrote them, so a reader of one profile's records
reads another's (53). A running instance may hold a copy in memory, and is
never the only holder. Every state an entry has been in and every
verdict read for it is readable by its session, its planner and the
operator (26). They read it from every host that submits to the branch,
whether or not sluice is running. A state read with sluice stopped is the state
sluice last wrote (51).

## Read and write

A read returns a branch's records as last written, and the version they
were read at (61). A write names the version its records were read at
and the records to write; it succeeds whole or is refused because the
records have been written since (62). Two writes from one version never
both succeed, and every host reads what the last write left (63). That
one rule serves the one-machine case and the fleet alike: at most one
instance advances a branch at any moment because at most one write
from a version succeeds (58).

Every decision an instance makes is written to the records before it is
performed. A landing is written as intended before the branch moves and
as done after. An instance that stops at any point loses nothing: every
entry submitted meanwhile is held, and whatever next advances the branch
resumes from the records as last written (59). The next round finishes, from
the records, a landing whose round stopped between its two writes.

## What outlives the records

The records are never tracked and never pushed under the local files
profile, and a branch's state ref under the remote refs profile is
sluice's own. What outlives both is the landing commit (23). Each
landing commit names the entry it landed, its work and the verdict it
landed on, as trailers on the commit. A reader with nothing but the
branch's history knows what was tested and what passed.

```
chore(land): #12 unit/touches

Sluice-Submission: 12
Sluice-From: crw-1-unit-1 (unit/touches)
Sluice-Tested: 9ab3d07c11
Sluice-Result: passed (2 run, 31 replayed)
```

## The results log

A check's result belongs to its key and its system, not to a branch: a
pass recorded under a key on a system satisfies every branch whose gate
trusts the signer that signed it and requires that system (69). So the
results sit beside the per-branch records, never inside one branch's.
Under local files that is one log of check results per repository, with
each result's key, system, outcome and executor. Under remote refs it is
each signer's own ref of signed run records (109). A bolt's branch and
the shared branch read the same results and apply their own trust to
them.

An operator's set-aside (116) goes in a log of its own beside the
results, naming the run it sets aside and why. The run's line stays in
the results log, so a reader of that log alone reads what it always
did.

## Profiles

The records seam has two profiles (C.6). A deployment names one.

**Local files**, one host. The documents live under the repository's
common git directory, one directory per branch and one results log per
repository, readable by every place on the host with no process running
and never tracked. A version file beside them is bumped on every write;
a write takes the branch's lock and is refused when the version moved.

```
.git/sluice/bolt/concurrent-units/
  version              57: bumped on every write
  submissions/12.json
  submissions/13.json
  log.jsonl            every submission, run, result, blame and landing, in order
.git/sluice/.logs/bolt/concurrent-units/<candidate>/<task>.log
.git/sluice/caches/    the caches the policy declares, the last two keys of each
.git/sluice/results.jsonl
                       every check result of the repository, with its executor
```

**Remote refs**, peers, for a branch with a `remote` whose policy names
signers. A branch's records are one root commit under
`refs/sluice/state/<branch>` on the shared remote, its tree the branch's
documents and its id the version. Any instance that submits to or
advances the branch writes it, by a push with `--force-with-lease` from
the commit read: the push succeeds only if the ref still holds that
commit, which is the conditional write of (62) as git provides it. The
queue's history is `git log` of the state ref.

Beside it the remote holds:

```
refs/sluice/state/<branch>              the branch's documents; any instance writes it
refs/sluice/runs/<signer>               one signer's signed run records, added to only by it
refs/sluice/heads/<oid>                 every submitted head
refs/sluice/combinations/<branch>/<id>  every candidate open to claims
refs/sluice/logs/<branch>/<run>         a run's output
refs/sluice/hosts/<host>                each host's sign of life and free room
```

Each signer's run records are written only by that signer and only
added to, so one signer's write never refuses another's and never waits
on the branch's records (109). A run record there is an in-toto
statement in a DSSE envelope, its subject the check's key and system,
its predicate the outcome, the claims of (79), the candidate, the claim
and the time. Each signer computes the keys it signs from the candidate
itself. A forge's job signs keylessly with its workload identity; any
other signer signs with an SSH key whose public half the policy lists.
Each host rewrites its own `hosts` ref alone, on a fixed cadence, as its
sign of life and its free room (77, 107). Since any instance may write
the state ref, a landing reads its verdict again from the signed run
records before it moves the branch (C.6).

## Telemetry

With telemetry turned on, each sluice process pushes traces and metrics
over OTLP to a collector the host runs. Each round is one trace, with
counters and histograms for queue depth, verdicts, replays,
culprits, landings and time to land. Nothing reads them back. The records are the
only truth, and an exporter that cannot reach its collector loses what
it held and says nothing.
