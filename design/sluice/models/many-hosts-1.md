# sluice on many hosts: peers and a central server

A design for running sluice across ten or more machines, in the two ways
the statement admits (C.8): **peers**, sluice on every host coordinating
through refs on the shared remote with no server of its own, and **a
central server**, one host that takes the queue and the test execution off
every other. Both are worked in enough detail to build, compared, and one
is recommended to build first. Clause numbers are those of
`../requirements.md`; rules are sluice's `docs/architecture/core.md`; the
one-host model is `reconstruction-1.md`, whose records, lifecycles and step
function this design keeps unchanged.

The operator's givens for this session: no forge CI as the test executor;
the task runner's cache is an optimization, never the design; a test
checkout is a clean checkout, in a container; sluice starts no services.

## 0. The shape of the answer

The two deployments are one design with four settings, not two designs.
Parts A and B hold unchanged in both (52), and the step function of
`reconstruction-1.md` section 3 runs unchanged in both. What differs:

| axis | peers | central server |
|---|---|---|
| where the authoritative records of a branch live | a ref on the shared remote, written by conditional push (C.6 remote refs) | the server's local files (C.6 server), with the same ref on the remote kept as a projection |
| who may advance a branch (58) | any host, by a lead lease in the records | the server, by configuration |
| who may run a candidate's checks (60) | any host with room, by a claim in the records | the server's own executors |
| who holds the credential that moves a branch and the identity that vouches for runs | every host's sluice user | the server alone |

Everything else is shared: the layout of refs on the remote (section 1),
how a head and a candidate reach another host (1.3), the container place
(section 2), how a run proves who made it (section 3), and the record
forms (53). The server deployment publishes its records to the remote in
exactly the peers' layout, so moving from one to the other is a change of
settings, not of records. That is the basis of the recommendation in
section 7: build the server first, in the peers' record form, and let it
grow into peers one axis at a time.

---

## 1. Shared state on the remote

### 1.1 What is on the remote, and who writes it

Under git, a ref update on a remote is atomic and can be made conditional
on the ref's current value: `git push --force-with-lease=<ref>:<expected>`
is refused by the receiving side when the ref is not at `<expected>`, and
an expected value of nothing means the ref must not exist. That is
exactly the records contract: a read returns the records and a version
(61), a write from a version either succeeds or is refused because the
version moved (62), two writes from one version never both succeed and
every host reads what the last write left (63). The version is the ref's
commit id.

| ref | holds | written by | how |
|---|---|---|---|
| `refs/sluice/state/<branch>` | one commit whose tree is the branch's records: `version`, `submissions/<id>.json`, `log.jsonl`, the same documents as the local files profile (53) | the lead, executors reporting, drivers submitting and withdrawing | push with lease from the commit read |
| `refs/sluice/heads/<oid>` | a submitted head, so the remote keeps it and every host can fetch it | the submitting host, before it writes the entry | plain push; idempotent, since the name is the content |
| `refs/sluice/combinations/<branch>/<id>` | the candidate revision as a commit, so an executor can fetch exactly what to test (10, 33) | the lead, when it forms the candidate and before it opens a claim on it | plain push |
| `refs/sluice/logs/<branch>/<run>` | a run's full output, one blob per check, for a session to read after a failure (20) | the executor, before it writes the run (16) | plain push |
| `refs/sluice/hosts/<host>` | the host's sign of life: `{at, instance, bound, claims[]}`, rewritten on a fixed cadence | that host only | plain push to its own ref; nothing else writes it |

The records commit has no parent. Each write is a fresh root commit whose
tree is the whole record set; the previous commit becomes unreachable and
the remote's own housekeeping discards it. The log inside the tree is the
audit; a history of record commits would duplicate it and grow without
bound. (A write that wanted history would set the parent; nothing else
changes.)

Under peers, every host's sluice writes `records`. Under the server, only
the server writes it, and it is a projection of the server's files: the
same tree, the same version discipline, read by every host and written by
one. Section 5.2 says why that is worth doing.

### 1.2 A write, what it costs, and how many a branch sustains

A write by any host is: fetch the records ref (one round trip, with
protocol v2's prefix filter so only `refs/sluice/state/<branch>` is
advertised), apply the change to the tree in memory, write the tree and
commit objects locally, push with the lease. A refused push means the
version moved: fetch again, apply again, push again. The step function
already treats a refused write as "discard and restart" (reconstruction
section 3), so nothing new is needed in the core.

| | shared forge over the internet | a git server on the operator's network |
|---|---|---|
| one write, fetch and push, `d` | about 0.6 to 1.5 s | about 0.1 to 0.2 s |
| refusal rate at write rate `λ` per branch | `1 − e^(−λd)` | same |
| rate at which one write in ten is refused | about 6 writes per minute | about 40 writes per minute |
| writes per entry (submit, claim, runs, verdict and attribution, landing intent, landed, notified) | about 8 | about 8 |
| comfortable ceiling per branch | about 45 entries per hour | about 300 entries per hour |

Branches are independent refs and never contend with each other; the ceiling
is per branch, and the remote's own limit on pushes per repository is far
above these rates. A bolt's branch lands units at a few an hour and the
shared branch lands bolts at fewer, so one records ref per branch is enough
for the fleet the operator described. If a branch ever approaches the
ceiling, the growth path is to split the non-lead writes into one inbox
ref per host (submissions, claims and run reports, each written only by
its own host, ingested by the lead on its next step), which removes the
contention without changing any record's form. It is not needed now and
is not designed further here.

Reads are fetches of the same prefix. What each process fetches, and how
often:

| who | fetches | cadence |
|---|---|---|
| the lead of a branch | that branch's `records` | every step: 2 to 3 s while anything is under test, backing off to 15 s when the branch is idle |
| a host with free room | `records` of every branch it serves | 5 s, backing off to 30 s when nothing is open |
| a waiting `wt submit` | its branch's `records` | 3 s for the first minute, then 10 s |
| any host | `refs/sluice/hosts/*` | with the fetch above; it costs nothing extra |

Ten hosts serving five branches fetch about three times a second between
them at the idle cadence and ten times a second when busy. A git server on
the operator's network does not notice that. A shared forge's tolerance
for sustained fetching over SSH is undocumented; the cadence above is set
so a busy fleet stays under one fetch per second per host, and it is the
first thing to measure (section 8).

A write to the records carries at most a few kilobytes of changed
documents; the push transfers only the objects the remote lacks, so a
write's cost is the round trips, not the bytes. The heads and candidates
pushed beside it carry the session's actual commits once each.

### 1.3 Heads and candidates reach every host through the remote

A head submitted on host A must be testable on host B and landable by
whichever host leads. So a submission is two pushes and one write, in
this order: the head to `refs/sluice/heads/<oid>`; then the entry written
into `records` naming that oid. A write that names a head the remote does
not hold is refused by the writer's own check before it pushes, so a
reader never finds an entry it cannot fetch. The head ref is deleted by
the lead once the entry has left sluice and its notification is confirmed
delivered; a landed entry's head stays reachable from the branch regardless
(23).

Candidates are formed by the lead on its own host with `git merge-tree
--write-tree` over fetched heads (43, ADR 0009), which needs no checkout.
The lead pushes each candidate it will open a claim on as a commit under
`refs/sluice/combinations/<branch>/<id>` before it writes the claim open, and
deletes the ref when the candidate is judged or obsolete (25). A candidate
whose verdict is already read from the log (15) is never pushed.

Nothing here touches a branch. The branches themselves are still moved only by
the landing path, through a push with lease from the revision the
candidate was formed on (24, 45, C.4 pushed refs), and the forge's branch
rules let only sluice's identity push them (1).

### 1.4 The records seam under peers, in Part B's words

| operation | satisfied by |
|---|---|
| read (61) | fetch `refs/sluice/state/<branch>`; the version is its commit id; the documents are read from its tree |
| write (62) | a new root commit holding the records to write, pushed with `--force-with-lease=<ref>:<version read>`; a refusal is the refusal 62 names |
| guarantee (63) | the remote updates a ref atomically and compares its old value under its own lock; two pushes from one expected value never both succeed |

---

## 2. The container place

The place profile named **container** in C.1 is the same under both
deployments. It is designed here because every host that executes under
peers, and the server, needs it, and the brief asks how the commit gets
there and how results get back.

**The image.** The repository declares it, in the checked-in policy's
checkout section, beside the method:

```toml
[checkout]
method = "container"
image = "ghcr.io/agentplot/crew-dev:2026-10"
```

The policy is read from the branch's current revision (56, core.15), so a
submission cannot change the image its own candidate is tested in. The
container runtime is the host's: podman or docker on Linux, a VM-backed
runtime on macOS; the deployment names it, not the repository. What the
image holds is the repository's business: the toolchains the task runner
needs, nothing of any session.

**Reaching the commit.** Each executing host keeps one mirror clone per
repository, owned by the sluice user (section 3.3), fetched from the
remote. To materialize a candidate (33):

1. fetch `refs/sluice/combinations/<branch>/<id>` into the mirror;
2. make a detached worktree of the mirror at that commit, under the
   sluice user's scratch, mode 0700;
3. start a container from the image with that worktree bind-mounted as
   the checkout and the mirror bind-mounted read-only at its own path, so
   the worktree's git metadata resolves; a scratch directory of its own;
   no other mounts; `SLUICE_CHECKOUT` and `SLUICE_TMP` in
   the environment; a label naming the place.

Network inside the container is the deployment's choice: none, or the
task runner's remote cache only. The cache is an optimization (ADR 0008);
a container without it runs every affected check and the result is the
same.

**Running.** The check seam's `run` (37) executes the task runner's run
of the affected checks inside the container, as the one process the
container's entrypoint starts, under the branch's time limit (66). The host
side waits on the container. On exit, time limit or release, the
container is stopped and removed; that ends everything started in it
(32, 34), which is the whole reason the place is a container.

**Results back, before any verdict.** The run's outcome, per check, comes
from the task runner's own run report and per-task run records, which it
writes inside the checkout (ADR 0004); the host side reads them from the
worktree once the container has exited. The executor then, in this order:

1. pushes each failed check's full output as a blob under
   `refs/sluice/logs/<branch>/<run>`;
2. builds one Run record per check with its key, outcome, executor, the
   claim it ran under, the tail of its output inline (the last few
   kilobytes) and the log blob's id, signs the records (section 3), and
   writes them to the branch's records by conditional write (16, core.7);
3. only then releases the place: the container removed, the worktree
   removed.

A verdict is read by the lead from the records, so it cannot be read
before step 2 (16). A session told of a failure (20) gets the failing
checks, the tail inline, and where the full output is. A run that is
timed out is written as timed out and read as failed (66). A run whose
container exited before writing a run report is written with no outcome
and its checks stay open (60).

Under the server, step 1 keeps the output in the server's own files and
the Run names that path; everything else is the same.

---

## 3. Trust: how a run proves who made it

### 3.1 The problem under peers

The glossary's **confined** has three parts, and the third is "nothing but
it could have written its records". Under peers every host writes the
records. A host that writes a Run saying `executor: build-7, confined:
true` has written a record that, by the records alone, a gate trusting
`build-7` would count. So under peers a run's record must carry something
only its executor could have produced, and the policy must name
executors by that something. This is the answers' leaning on questions 14
and 15 (`reconstruction-1-answers.md`), confirmed by design: without it,
29 cannot be satisfied under peers at all.

### 3.2 Runs are vouched for by a key the policy names

Every host already holds SSH keys, and OpenSSH signs and verifies
arbitrary data against a list of allowed signers (`ssh-keygen -Y sign`,
`-Y verify`). So:

- Each executor has a signing key, held by the sluice user and by
  nothing a session can use.
- A Run record is signed over its canonical form (candidate, check, key,
  outcome, claim, executor name, time); the signature travels in the
  record.
- The branch's policy names each executor it trusts by principal, and says
  whether it counts that executor as confined; the principals' public
  keys live in a file beside the policy, checked in and read from the
  branch's revision (56), so changing whom a branch trusts is a reviewed
  change to the repository and never a change a submission can make to
  its own gate.

```toml
[branches.main]
required = ["#suite", "#live"]
trust = ["exec@build-7", "exec@build-8"]     # confined
flaky = "retry-once"

[branches."bolt/*"]
required = ["#suite"]
trust = "any"                                 # open runs count
```

Reading a Run (reconstruction section 3.4) gains one step before the
trust filter: a Run whose signature does not verify against a principal
the policy names is a Run from an executor the gate does not trust (28),
whatever its record says. A gate with `trust = "any"` skips the step and
reads the record's executor field as written, which is what a bolt's branch
wants (ADR 0004: the bolt branch takes the sessions' open runs).

Confinement is then never inferred by sluice from where a run happened.
The policy's author names a principal as confined, and is responsible
for it being so: a key held by a user no session can act as, on a host
whose container mounts nothing a session wrote. That is the actors
table's "which executors each branch trusts", made checkable.

### 3.3 Does the shared branch trust a container on a host that also runs sessions?

It may, and by default it should not.

It may, because the isolation that makes an executor confined is a
matter of the host's users and mounts, not of whether sessions exist on
the host: the sluice user's key, mirror, worktrees and container socket
are reachable by no session's user, and the container mounts only the
candidate's worktree. A fleet with no spare host can name such an
executor and the design holds.

By default it should not, because "reachable by no session's user" is a
claim about the host's configuration that nothing in the records can
check, and because a session host's runtime (a VM-backed container on a
macOS session host, say) is the weakest link. The default policy for the
shared branch names only executors on hosts that run no sessions. Under
the server that is every executor; under peers it is a subset of hosts,
which is to say a small server pool inside the peer fleet. This matches
the reconstruction's recommendation (section 4) and turns it from a rule
into a policy default.

### 3.4 The second credential: who may move a branch

Under pushed refs the branch is protected by the forge's rules, and only
sluice's identity bypasses them (C.4). Under peers the lead of a branch can
be any host, so every host's sluice user holds the bypass credential, and
clause 1 holds only as far as that credential is kept from sessions: a
deploy key the sluice user alone can read, with sessions pushing under
their own identities, which the rules refuse on the branch. Under the
server only the server holds it. This is the single strongest argument
for the server (section 6).

---

## 4. Peers

### 4.1 Who advances a branch: the lead

The branch record carries `lead = {instance, host, epoch}` and the records'
version moves on every write. The rules:

- **Taking the branch.** An instance takes the lead by a write that sets
  `lead` to itself with `epoch + 1`, conditional on the version it read
  (62). It may make that write only when the branch is vacant or when it has
  observed, on its own clock, no write by the current lead for a whole
  lease. "No write by the lead" is "the records' version unchanged, or
  changed only by writes that are not the lead's" (claims, reports and
  submissions carry their writer, so a taker can tell).
- **Renewing.** The lead renews only by writing: every step that changes
  anything writes, and a step that changes nothing writes a renewal at
  least every third of the lease. There is no renewal apart from the
  step. A lead that is alive but wedged (blocked in a fetch, say) makes
  no step, so it writes nothing, so it is taken over; that is what we
  want, and a separate heartbeat would hide it.
- **Fencing.** Every write by the lead is conditional on the version
  (62). The taker's write moves the version and the epoch. The former
  lead's next write, whatever it is, is refused, and on re-reading it
  finds an epoch not its own and stops advancing the branch (58). It writes
  nothing more for the branch because it cannot: the records seam refuses
  it.
- **No wall clock crosses hosts.** The taker measures silence on its own
  clock from when it first saw the lead's version. Hosts need clocks
  that run at the same rate, not clocks that agree. The record's
  `lease_until` of the reconstruction becomes informational.

**The stopped-versus-quiet argument, tested.** The reconstruction (2.4)
claims no observer need tell a stopped lead from a quiet one. The lead
has four effects outside the records, and each is checked:

| effect of a lead that lost the branch without knowing | what happens | safe because |
|---|---|---|
| a records write | refused; it re-reads and stops | 62, 63 |
| the `move` of a landing whose intent it wrote before losing the branch | the taker's first step runs `finish_landing` from the same intent and calls `move` with the same expectation; at most one succeeds; both read the same result afterwards | 24, 46; reconstruction 3.6 |
| a notification from its outbox | delivered once more than needed; it names the entry and the outcome | 51, at least once |
| a candidate ref pushed | an orphan ref nobody claims, since the records say what is open; swept by the next lead | harmless |

So the argument holds for safety. For liveness, the lease is the only
parameter, and it trades two things: a longer lease delays takeover after
a real stop; a shorter one causes needless takeovers when a step is
merely slow (a big forming, a slow forge). A takeover is cheap (one
step, no checks re-run, 59), so err short. Recommended: a lease of 60 s,
renewal by 20 s, measured per deployment. It is the deployment's setting
(section 4.5), the same for every branch it serves.

**Two instances both believing they lead.** Only possible for the instant
between the taker's write and the former lead's next refused write. In
that instant the former may push a candidate ref or call `move`, both
covered above. It cannot open a claim, attribute, land or notify without
writing first.

**What takes the lead.** Under peers each host runs one `sluice run`
started by the operator (C.8: "nothing new to run but sluice on each
host"), which takes the lead of any branch it serves when the branch is
vacant or lapsed, claims and runs checks (4.2), and delivers notifications
for entries submitted from its host (4.3). A waiting `wt submit` does not
step across hosts; on a fleet with no `sluice run` anywhere, it may take
a vacant or lapsed branch exactly as `sluice run` would, which is phase 1's
behaviour generalized, and it yields the branch when its entry is decided.

### 4.2 Who runs which checks: claims

The lead opens a candidate (marks it open and pushes its ref) within the
window (13); it never assigns it. Hosts pull:

- An instance with free room, counted against its own bound (71) across
  every branch it serves, reads the records of those branches and claims by a
  conditional write: `{claim_id, candidate, checks, executor, host}`. Two
  hosts racing for one candidate: one write is refused, that host re-reads
  and takes the next open candidate.
- Among open candidates of one chain it takes the earliest, because the
  front of the chain is what blocks landing (22). Across branches, the
  deployment may order branches (the shared branch first); by default, the
  oldest open candidate first.
- A locality preference, for the task runner's warm cache and nothing
  else: for a short head start (the claim cadence, 5 s), only the host
  that ran the previous candidate of the same chain claims the next one.
  After that, anyone. This is an optimization that changes no outcome.

**Sign of life.** Every host rewrites `refs/sluice/hosts/<host>` on a
fixed cadence (30 s) with the claims it holds. The lead expires a claim
when the holder's host ref has not changed for the deployment's grace
(two cadences, 60 s), by the lead's own clock, and marks the candidate's
checks open again (60). The host ref is written by one writer with no
condition, so it never contends with anything, and ten hosts cost the
remote one push every three seconds between them.

**A report under a lapsed claim.** The report is a conditional write that
names its claim; the writer checks, against the records it just read,
that the claim is still held by it, and does not write otherwise. The
dead host that returns finds its claim lapsed and discards the run: no
outcome, as 60 requires (S15). Because writes under peers are the
writer's own code, the check is cooperative; a forged report is the trust
question of section 3, and the gate's trust filter is what finally
decides what counts.

**A dead executor mid-run.** Its host ref goes stale; after the grace the
lead reopens the checks; another host claims and runs them; the verdict
is read from that run (S15). Recovery takes the grace plus one claim
cadence, about 65 s, plus the run itself.

### 4.3 Telling the session

Under peers no process delivers anything across hosts. A waiting `wt
submit` reads its entry's state from the records by polling (C.5 remote
submit); that read is the delivery (51). For a submission made with
`--no-wait`, the `sluice run` on the submitter's host owns the outbox
items whose entry was submitted from that host, prompts the session's
pane through the multiplexer, and confirms delivery by a write. The lead
decides notifications; the submitter's host delivers them. A notification
is thus at least once (51), keyed by entry and outcome.

### 4.4 Places left by a host that stopped

A place on a stopped host can be released by nobody else (34 is local).
So:

- Before an instance takes any claim after starting, it releases every
  place on its host that the records show as belonging to a candidate
  that is judged or obsolete, or to a claim it no longer holds. Containers
  carry the place's label, so the sweep is one query of the runtime; the
  worktrees are under the sluice user's scratch.
- A host that never returns leaves containers and worktrees that are
  the operator's to remove. They touch no branch: no verdict ever reads a
  place (32), and the candidate was re-run elsewhere.

This is the answers' leaning on question 18, as a rule.

### 4.5 Who sets the lease and the grace

The deployment: one value per fleet for the lead lease, one for the claim
grace and the host cadence, kept in the operator's configuration for
sluice on every host, never in a branch's policy. A branch's policy sets how
long a candidate's checks may run (66) and nothing about who holds what.
The two must be consistent only in one direction: a claim is never
expired merely for running long, because liveness is the host's sign of
life, not the run's duration. This is the answers' leaning on question
19.

### 4.6 Failure cases under peers

| failure | what happens | what is lost |
|---|---|---|
| a host partitioned from the remote | its lead lapses after a lease and is taken; its claims lapse after the grace and are re-run; its sessions cannot submit until it returns; on return every write it attempts is refused, it re-reads, sweeps its places (4.4) and continues as a follower | the checks it was running, re-run elsewhere |
| the remote unreachable by everyone | nothing advances; sessions keep building; no writes succeed, so nothing is inconsistent; on return every instance re-reads and continues | time |
| a dead executor | 4.2 | the run in flight |
| the lead stops | taken after a lease; the taker's first step finishes any landing intent and re-opens nothing with a verdict (59, S14) | one lease of time |
| two leads | 4.1; the fence | nothing |
| the forge refuses sluice's push to the branch (rules changed, credential expired) | the landing is refused as a move elsewhere is (24); the chain is formed again and refused again; the branch stalls visibly in its records | time, until the operator fixes the credential |
| a session's user obtains the sluice user's credential on some host | clause 1 is broken on that host: it can move a branch | the design's guarantee; this is why the server is preferred for the shared branch |

---

## 5. The central server

### 5.1 The interface: SSH, and no listener of sluice's own

The server is one host running `sluice run` with its records as local
files (C.6 server), exactly phase 1's one-host sluice, with container
places. What makes it a server is only that other hosts reach it. The
cheapest way that satisfies "sluice starts no service and chooses no
port" (31) is the host's existing SSH daemon: the remote-submit driver
profile (C.5) runs sluice's own commands on the server over SSH.

A submission from host A to the shared branch:

```sh
git push ssh://sluice@build-1/srv/sluice/crew HEAD:refs/sluice/heads/<oid>
ssh sluice@build-1 sluice submit main --head <oid> --after 12 --priority 0 \
    --from crw-1-unit-2@host-a:unit/batch-review --json
```

`wt submit` does both and then waits by `ssh … sluice status <id> --json`
at the cadence of 1.2, or returns at once with `--no-wait`. Withdraw,
amend, status and the forecast (47a) are the same commands over the same
channel. The head is pushed to the server's own repository, not to the
forge, so a forge outage stalls only landings; the landing's push carries
the head to the forge as the merge's second parent (23).

The server runs each command under the records' lock on the branch, as any
number of local `wt submit`s do in phase 1. Concurrency, versions and
refusals are phase 1's.

Nothing listens but sshd. The core is untouched; the profile is a wrapper
that prefixes a command with `ssh` and a repository with a push.

### 5.2 Records: the server's files, projected to the remote

The authoritative records are the server's local files. After every
successful write, the server pushes the same tree to
`refs/sluice/state/<branch>` on the shared remote, in the layout of
1.1, as a projection: one writer, no contention, one push per write.

This costs one push per write and buys three things:

- **26 holds literally.** Every state and every verdict is readable from
  every host whether or not sluice is running, and even when the server's
  host is unreachable: the projection is the state last written. A read
  that falls back to the projection says so, with its version. This
  answers section 10's question on the server: "sluice not running" means
  no instance advancing the branch, and the records stay readable on the
  server's host; the host itself being down is covered by the projection.
- **A lost server is replaced from the remote.** A new server seeds its
  files from the projection, finishes any landing intent found there (59)
  and continues; nothing with a verdict is re-run. Container places on
  the old host are gone with it (4.4).
- **The server is already a peer.** Its records are on the remote in the
  peers' form. Letting another host claim, then lead, is a change of
  settings (section 7).

### 5.3 Executors: the server's pool

The server runs candidates' checks itself, in container places, up to its
own bound (71), front of chain first, across branches in the order of 4.2.
There are no claims in the records beyond phase 1's (a claim is still
recorded, since the step function is the same, but only the server
takes them). A run whose process group dies is found by the next step
and re-opened, as in phase 1 (60). No signatures are needed for trust:
the server is the only writer, so "nothing but it could have written its
records" holds by construction, and the shared branch's policy names the
server's executor as confined with `trust = ["exec@build-1"]` or, under
one writer, simply by host. Signing stays available and harmless, and is
turned on the day a second host executes.

A bigger pool is more servers behind one lead: hosts that run no
sessions, claiming through the projection exactly as peers do (4.2). That
is the first growth step of section 7, and the one that keeps the trust
story intact.

### 5.4 Stopping and restarting

| | what happens |
|---|---|
| `sluice run` stopped on the server | nothing lands; submissions over SSH still succeed and are held (59); states readable over SSH and from the projection; started again, it finishes any landing intent and re-runs only runs whose process is gone (S10, S14) |
| the server host down | submissions fail; `wt submit` retries with backoff and says the server is unreachable; states readable from the projection; nothing is lost |
| the server host lost for good | a new host is seeded from the projection (5.2); the sessions' places are untouched; the old host's container places are abandoned |
| a session's host partitioned from the server | its `wt submit` waits; nothing else changes (C.8) |
| the forge unreachable from the server | checks still run; landings are refused as moves elsewhere are and retried from the same expectation on the next step (reconstruction 3.6, "branch at `from`"), which is not a blind retry because nothing was refused by the branch, only by the network; the projection falls behind and says so |

Restart cost is one step. The window carries over in the records (13);
no check with a verdict runs again.

---

## 6. The comparison

| | peers | central server |
|---|---|---|
| **what runs where** | `sluice run` on every host, as a sluice OS user with a container runtime, a deploy key with bypass and a signing key | `sluice run` on one host; sessions' hosts run nothing of sluice but `wt submit` |
| **cost to build beyond phase 1** | the remote-refs records profile (1.4); heads, candidates and logs as refs (1.3); the container place (2); signed runs and the trust filter (3); the lead with epoch, renewal and observed silence (4.1); claims with host sign of life and lapse (4.2); per-host notification delivery (4.3); the sweep (4.4); a conformance suite with partitions and lost leads injected | the SSH remote-submit profile (5.1); the container place (2); the projection push (5.2). The lead, claims, trust filter and sweep are phase 1's |
| **cost to run** | the remote carries every write; the fleet's hosts carry the checks; every host must be configured for user separation; the forge's tolerance of the fetch cadence is unmeasured | one host, sized for the fleet's checks, and sshd; one credential pair to keep |
| **throughput of checks** | every host's spare cores, bounded per host (71) | one host's cores; more by adding executor hosts behind the lead (5.3) |
| **throughput of landings** | about 45 entries per hour per branch on a shared forge, 300 on a local git server (1.2) | the server's disk; the projection push is one per write and never refused |
| **a host stops** | its lead and claims pass to others within a lease or a grace (4.6) | a session host: nothing; the server: every branch stalls and loses nothing (5.4) |
| **the remote unreachable** | everything stalls, including submission | submission and checks continue; landings wait |
| **trust for the shared branch** | needs signed runs, and a policy that names only executors on hosts that run no sessions, which is a server pool inside the fleet (3.3) | by construction: one writer, no sessions |
| **clause 1 across hosts** | holds only as far as the bypass credential is kept from sessions on every host (3.4) | the credential exists on one host that runs no sessions |
| **how it grows from phase 1** | the records seam rebound to the remote, then the lead and claims generalized; the step function unchanged | phase 1 plus three profiles; the step function unchanged |
| **how one grows into the other** | pin the lead and the executors to one host and you have the server | let other hosts claim through the projection (executors), then let any host take the lead (peers); the records are already in the peers' form |

**Where the honest weight falls.** Peers' advantages are no single point
of failure and the fleet's whole capacity for checks. The server's are
trust that needs no cryptography and no per-host hardening, a build that
is three small profiles over phase 1, and a failure mode (stall, lose
nothing) that the operator already accepted in C.8 and S14. The capacity
advantage of peers is recoverable without peers: executor hosts behind
one lead give the shared branch confined executors and the bolt branches
spare cores, at the cost of the signing and the claims, and without
handing every host the branch's credential.

The one thing the server cannot do is keep landing while the server
host is down. For a fleet whose sessions keep building meanwhile and
whose entries are held and readable (5.4), that is time, not loss.

---

## 7. Recommendation: the server first, in the peers' form

Build in this order, each step a usable deployment:

1. **The central server**, as section 5: the SSH remote-submit profile,
   the container place profile, and the projection push in the layout of
   1.1. Bolt branches and the shared branch move to it as soon as a second
   host submits to either. The shared branch's gate names the server's
   executor as confined, so the shared branch lands through sluice for the
   first time.
2. **Executor hosts behind the lead**, when the server's cores bind: the
   claims of 4.2 taken through the records on the remote by hosts that
   run no sessions, with signed runs (3.2) and the sweep (4.4). This is
   most of the peers' executor side, built against a lead that never
   changes, which keeps the hard part out of it.
3. **The lead anywhere**, only if the server's stalls prove costly: the
   lease of 4.1 and the records' authority moved from the server's files
   to the remote ref. Every record is already there; the change is which
   copy is authoritative and who may write `lead`.

Step 1 is small enough to follow phase 1 directly. Steps 2 and 3 are each
one proposal and one conformance pass, and the design above is written
so that neither changes a record's form or a clause of Parts A and B.

---

## 8. The multi-host scenarios against this design

| scenario | peers | server |
|---|---|---|
| S13: sessions on two hosts submit to one bolt branch, one order, each told on its own host | one `seq` in the records ref (57); the waiting submit reads its own entry (4.3) | one `seq` in the server's files; each waits over SSH (5.1) |
| S14: the host advancing a branch stops mid-chain | taken after a lease; `finish_landing`; no verdict re-run (4.1) | nothing lands until it is back; restart is one step (5.4) |
| S15: an executor stops mid-run | the claim lapses after the grace; re-run elsewhere (4.2) | the dead process is found by the next step; re-run on the server (5.3) |
| S8 across hosts: the branch moved by hand on the forge | the landing push is refused by the lease; the chain re-forms on the revision found (1.3, 24) | same |
| S7 on the shared branch: a pass and a fail at one key, from a session host and a confined executor | the session host's run is unsigned or signed by a principal `main` does not name, so it is not counted; the confined run settles it (3.2) | the session host cannot write the server's records at all |

---

## 9. Questions not settled here

1. **The forge's tolerance.** Whether a shared forge sustains the fetch
   cadence of 1.2 over SSH without rate limiting is undocumented. Measure
   it with ten hosts before relying on peers against a forge; a git
   server on the operator's network has no such limit.
2. **The task runner inside the container.** Whether the runner's hashing
   and run records work in a bind-mounted detached worktree whose mirror
   is mounted read-only at its own path, and whether presenting as CI to
   it changes which tasks run (the test-services research, section 2).
   Verify in the first container place before writing its ADR.
3. **Heads on the forge.** Under peers every unit's head is pushed to
   the forge under `refs/sluice/heads/`, hidden from its interface but
   present. Under the server only landed heads reach it. If the operator
   wants bolt-branch heads never to leave the fleet, peers need a git
   server of the operator's own as the records' remote, separate from the
   forge that holds the branches.
4. **Log retention.** How long `refs/sluice/logs/` entries are kept
   after their entry leaves, and a size cap per run. Proposed: deleted
   with the head ref; 16 MiB per check, truncated from the front.
5. **Clock rate.** The lead and claim rules need host clocks that run at
   one rate, not clocks that agree. A host whose clock jumps (a resumed
   laptop) may take a branch early; the fence makes that safe, and the
   question is only whether it is frequent enough to need a check.
6. **`--no-wait` under the server.** A session host runs nothing of
   sluice, so a `--no-wait` submission's pane is prompted by nobody; the
   session reads `wt submit --status`. If the pane prompt matters, a
   `sluice watch` on session hosts polling the projection is small, but
   it is a process the operator starts on every host, which erodes the
   server's "nothing to run elsewhere".
7. **The window across the fleet.** 13 counts the window per branch and 71
   bounds each host. Under peers nothing bounds the fleet's total; with
   ten hosts and five branches that is fine, and a fleet-wide bound is
   another deployment setting if it is ever not.
8. **Who starts `sluice run` on each host.** The operator, through the
   multiplexer or the host's service manager; sluice starts nothing (31).
   The deployment's documentation must say so, since peers depends on it
   being up everywhere.
9. **Plain words for what a user sees.** The walkthrough fixed branch,
   submission, checkout, combination, blame and result for everything a
   user sees, and this design adds three things a user will see in
   `sluice status` and the state files with no plain word yet: the lead
   (proposed: "the host running the queue"), a claim (proposed: "a test
   run taken by a host"), and an executor (proposed: "the host that ran
   it", with "trusted hosts" as the policy key). The operator picks.
10. **Where the per-repository results log lives under peers.** Clause 69
    makes a check's result belong to its key, not to a branch, so one
    passing run can satisfy several branches. The peers layout in section
    2 keeps every record under one branch's ref, written by that branch's
    lead, and a log shared across branches fits under none of them. Two
    ways out: its own ref, `refs/sluice/results`, with its own lease and
    its own writer, which adds a second lease to hold; or each branch's
    log kept under its own ref, with a lead reading the other branches'
    refs before it forms a candidate, which keeps one lease per branch but
    makes a cross-branch hit depend on how fresh the last fetch was. The
    second is cheaper and never wrong, only sometimes late, so this model
    leans to it; the operator rules.
11. **Whether a waiting `wt submit` steps across hosts.** On one machine
    the waiting submit runs the rounds itself and nothing else need be
    running. Section 4.1 gives that work to `sluice run` under peers and
    keeps the stepping submit only for a fleet with no `sluice run`
    anywhere. The argument for the change is clause 1: under pushed refs
    the stepper holds the credential that bypasses branch protection, and
    a session's own process must not hold it, so the stepper runs as the
    `sluice` OS user with its own key, which also vouches for the runs
    (29). Against it: the operator must start `sluice run` on every host,
    and a host with no `sluice run` submits but never lands. The one-
    machine case is unchanged either way, since a hook on local refs can
    tell sluice's rounds from the session's git. The operator rules.
