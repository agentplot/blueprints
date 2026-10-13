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

A check's result belongs to its key, not to a branch: a pass recorded
under a key satisfies every branch whose gate trusts the executor that
recorded it (69). So beside the per-branch records sits one log of check
results per repository, with each result's key, outcome and executor.
A bolt's branch and the shared branch read the same log and apply their
own trust to it.

## Profiles

The records seam has three profiles (C.6). A deployment names one.

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

**Remote refs**, peers. A branch's records are one commit under
`refs/sluice/state/<branch>` on the shared remote, its tree the branch's
documents and its id the version. A write is a push with
`--force-with-lease` from the commit read: the push succeeds only if the
ref still holds that commit, which is the conditional write of (62) as
git provides it. Beside it the remote holds `refs/sluice/heads/<oid>`
for every submitted head, `refs/sluice/combinations/<branch>/<id>` for
every candidate open to claims, `refs/sluice/logs/<branch>/<run>` for a
run's output, and `refs/sluice/hosts/<host>`, rewritten by each host
alone on a fixed cadence as its sign of life. The queue's history is
`git log` of the state ref.

**Server**, a central server. The records are the server's local files,
and other hosts reach them only over SSH. After every write the server
pushes the same tree to `refs/sluice/state/<branch>` on the remote as a
projection, so a reader that cannot reach the server reads the state
last written and says that it did (80). A server that is lost is
rebuilt from the projection.

## Telemetry

With telemetry turned on, each sluice process pushes traces and metrics
over OTLP to a collector the host runs. Each round is one trace, with
counters and histograms for queue depth, verdicts, replays,
culprits, landings and time to land. Nothing reads them back. The records are the
only truth, and an exporter that cannot reach its collector loses what
it held and says nothing.
