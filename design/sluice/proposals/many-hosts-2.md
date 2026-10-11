# Many hosts: the lead, the claims, the vouching and the readable state

Drafted clauses answering the multi-host questions of section 10, from
the design in `../models/many-hosts-1.md`. Parts A and B gain eleven
clauses, 72 to 82, three glossary entries and four scenarios; Part C's
rows for the container place, remote submit, the records and the
deployments are rewritten to match. Nothing here edits
`../requirements.md`; the operator rules on it.

The questions, in the order section 10 asks them, and where each is
answered:

| section 10 asks | answered by |
|---|---|
| when a branch's stepper stops, how long before another may advance it, and what tells a peer it stopped rather than went quiet | 72, 73 |
| how a peer decides which candidates to run, and how many | 75, 76, 77 |
| whether the shared branch's gate trusts a container on a host that also runs sessions | 79 and the C.7 default |
| how a policy names the executors it trusts, and how a run proves which executor made it when every host writes the records | 78, 79 |
| under a central server, whether state readable only on the server is readable "whether or not sluice is running" | 80 |
| who releases the candidate places of a host that has stopped for good | 81 |
| who sets how long a host may hold a branch or a claim | 74 |

## Vocabulary

Three entries the clauses below lean on. 58 and 59 already say
"instance" without defining it.

- **instance**: one running sluice on one host.
- **lease**: how long an instance keeps a branch without writing its
  records.
- **claim**: an instance's recorded hold on a candidate's checks, from
  taking them to reporting them.

## The lead: a branch is kept by writing

### The problem

58 says at most one instance advances a branch and a stopped one writes
nothing more; 59 says whatever next advances it resumes from the records.
Neither says when "next" may be, nor how a peer knows the lead stopped.
The reconstruction (2.4) argues no peer needs to know, because a quiet
lead's writes are refused once the version moves and its one effect
outside the records is guarded by the branch's own conditional move. The
model tests that argument against each of the lead's four outside effects
(`many-hosts-1.md` 4.1) and it holds. What remains is to say it as an
invariant, and to say what a lease is measured against.

### What the statement already settles

Every write is conditional on the version read (62) and two writes from
one version never both succeed (63). So taking a branch is a write, and a
former lead's next write fails. 46 settles the move.

### The ruling

> 72. An instance keeps a branch only by writing its records. Once the
>     deployment's lease has passed with no write of that instance, any
>     instance may take the branch; taking it is a write (62), after which
>     the former lead writes nothing more for the branch (58).
>
> 73. Taking a branch needs no knowledge of the former lead: one that
>     stopped and one that was quiet for a lease are treated alike, and
>     the lease is measured by the taker's own observation of the
>     records, never by the hosts' clocks agreeing.

73 forbids a model in which a lead renews by anything but writing: a
lead that is alive but makes no progress is taken over, which is the
behaviour wanted. It also forbids a takeover rule that compares a
timestamp one host wrote with a clock another host reads.

## Who sets the lease and the grace

### The problem

Section 10 asks whether the policy, the deployment or the operator sets
how long a host may hold a branch or a claim. The reconstruction suggested
the policy (Q19); the answers leaned to the deployment. The model sides
with the deployment: the lease trades takeover delay against needless
takeovers, which is a property of the fleet's network and hosts, the same
for every branch, and nothing a repository's reviewers should decide. The
time a run may take (66) is the policy's and must stay apart from it: a
claim that lapsed because a run was long would re-run every long check.

### The ruling

> 74. The lease on a branch and the bound on an executor's sign of life are
>     the deployment's, one value each for every branch it serves, never a
>     branch's policy's. A branch's policy bounds only how long a candidate's
>     checks may run (66), and a claim never lapses for the length of its
>     run alone.

## Claims: who runs which checks, and how many

### The problem

60 says a candidate's checks may run on any host and a stopped
executor's run has no outcome. It does not say how a host comes to run
them, how many it takes, or what makes a run's executor "stopped". Under
a central server the answer is phase 1's; under peers it must be stated.

### What the statement already settles

The window is per branch (13); a host runs no more at once than its own
bound (71); the front of a chain is what blocks landing (22).

### The ruling

> 75. A candidate's checks are taken only by a claim written to the
>     branch's records, by any instance with room under its own bound (71).
>     The lead opens candidates within the window (13) and assigns them to
>     no one.
>
> 76. An instance never claims a later open candidate of a chain while an
>     earlier open candidate of that chain is unclaimed.
>
> 77. A claim lapses when its holder has shown no sign of life for the
>     deployment's bound (74). A lapsed claim's run has no outcome (60),
>     and a report under a claim its reporter no longer holds is never
>     written.

75 and 76 together answer "which and how many": any instance, earliest
first, up to its own bound. 77 makes a dead executor a lapsed claim and
nothing else; a surviving executor that lost its claim discards its run.

## Vouching: how a run proves who made it

### The problem

A gate trusts executors (27, 28), and a gate that trusts only confined
executors is satisfied by no open run (29). The glossary's **confined**
requires that nothing but the executor could have written its records.
Under peers every host writes the records, so a Run record's own
`executor` field proves nothing: any host can write any name into it.
Without something only the executor could have produced, 29 cannot be
satisfied under peers, and the shared branch cannot land. The answers
already lean this way (questions 14 and 15).

### What the statement already settles

Trust is the policy's (27) and read at the gate (28). The policy is read
from the branch's revision (56), so what a branch trusts is a reviewed change
and never a submission's to alter. The model binds vouching to a key the
policy names, verified from the records alone (`many-hosts-1.md` 3.2);
the clauses say only what the binding must achieve.

### The ruling

> 78. A run counts as an executor's only when an identity the branch's
>     policy names vouches for it in a way every host verifies from the
>     records alone. A run vouched for by no identity the policy names is
>     from an executor the gate does not trust (28). A policy that counts
>     runs nobody vouches for says so for that branch, by name.
>
> 79. Confinement is never inferred. A run is read as confined only when
>     the identity vouching for it is one the branch's policy names as
>     confined (29); that the identity is reachable by no session is the
>     policy author's to assert, never sluice's to decide.

The third sentence of 78 is what lets a bolt's branch keep taking the
sessions' open runs as it does today: its policy says so. Under a
central server the server is the only writer, and 78 is met by the
records themselves until a second host executes.

Section 10's third question, whether the shared branch trusts a container
on a host that also runs sessions, is answered by 79 as "whoever the
policy's author names", and by a default in C.7 below: the shared branch's
default policy names only executors on hosts that run no sessions.

## State readable when the server is gone

### The problem

26 wants every state and verdict readable from every host "whether or
not sluice is running". Under a central server other hosts read only by
asking it. The answers' leaning (question 17) was "readable on the
server", which makes 26 hold when the stepping process is stopped and
fail when the server's host is down. The model closes the gap at the cost
of one push per write: the server publishes its records to the shared
remote after every write, in the same layout peers use, so the state last
written is readable without the server at all (`many-hosts-1.md` 5.2).
That is worth saying as an invariant, because it is also what makes a
lost server replaceable (59) and what lets the server grow into peers.

### The ruling

> 80. When more than one host submits to a branch, every state an entry has
>     been in and every verdict read for it is readable from each of those
>     hosts while the host that last wrote the records is unreachable, as
>     the records were last written (26).

Under local files on one host, 80 is vacuous. Under remote refs it is
63. Under the server it forces the projection.

## Places of a host that stopped for good

### The problem

A candidate's place lives on the executor's host (32), and release is
local (34). When that host stops, no other instance can release its
places; when it never returns, nobody can. 25 says sluice releases every
place it made once the verdict is read.

### The ruling

> 81. An instance takes no claim while a place it made on its host
>     belongs to a candidate that has a verdict or is obsolete, or to a
>     claim it no longer holds (25, 34). A place on a host that never
>     returns is the operator's to remove, and no verdict is ever read
>     from it (32).

The first sentence makes a returning host clean up before it works. The
second says what the branch owes the abandoned place: nothing.

## What every host must be able to fetch

### The problem

A head submitted on one host is tested and landed on another, and a
candidate formed by the lead is run elsewhere. Nothing in Part A says the
objects reach those hosts; under one host it was never in question.

### The ruling

> 82. From the moment an entry is written until it leaves sluice, its head
>     is fetchable by every host that may run its checks or advance its
>     branch; and a candidate is open to claims only while its revision is
>     fetchable by every host that may claim it.

## Part C, rewritten rows

**C.1 the place**, the container row:

| profile | materialize | release |
|---|---|---|
| **container**: a clean checkout of the candidate in a container on the executing host | the candidate fetched into the host's mirror of the repository; a detached worktree of it under the sluice user's scratch; a container from the image the repository's policy names, read from the branch's revision (56), with the worktree as its checkout, the mirror read-only, a scratch directory, `SLUICE_CHECKOUT` and `SLUICE_TMP`, and nothing of any session mounted; the run as the container's one process under the branch's time limit (66) | the run's records and the failing checks' output written to the records first (16), then the container stopped and removed with everything started in it, and the worktree removed |

**C.4 the branch**, the pushed refs row, last cell: "branch protection by
the forge's rules, which only sluice's identity bypasses, an identity no
session on any host can use (1)".

**C.5 the driver**, the remote submit row:

| profile | submit / withdraw / state / notify / forecast |
|---|---|
| **remote submit**: a session on any host | under peers, the head pushed to `refs/sluice/heads/<oid>` on the shared remote and the entry written to the branch's records (C.6 remote refs); under a central server, the head pushed to the server's repository over SSH and `sluice submit` run on the server over SSH; withdrawal, amend, state and the forecast the same way; a waiting `wt submit` reads its entry's state at a backing-off cadence until the outcome, and that read is the delivery (51); a `--no-wait` submission is prompted by the instance on the submitter's host under peers and read by `wt submit --status` under the server |

**C.6 the records**:

| profile | read / write |
|---|---|
| **remote refs**: peers | one root commit under `refs/sluice/state/<branch>` on the shared remote, its tree the branch's documents (53), its id the version; a write a push with `--force-with-lease` from the commit read; beside it `refs/sluice/heads/<oid>` for every submitted head, `refs/sluice/combinations/<branch>/<id>` for every candidate open to claims, `refs/sluice/logs/<branch>/<run>` for a run's output, and `refs/sluice/hosts/<host>` rewritten by each host alone on a fixed cadence as its sign of life (77) |
| **server**: a central server | the server's local files, reached by other hosts only over SSH; after every write the same tree pushed to `refs/sluice/state/<branch>` as a projection, so a reader that cannot reach the server reads the state last written (80) and says it did |

**C.7 policy** gains: "a branch's policy names the executors it trusts by
the identity that vouches for their runs, and says which of them it
counts as confined; the identities' keys are checked in beside the
policy and read from the branch's revision (56). The default for the
shared branch names only executors on hosts that run no sessions; the
default for a bolt's branch counts runs nobody vouches for (78)."

**C.8 deployments**, with the growth step between the two:

| | peers | a server with executor hosts | a central server |
|---|---|---|---|
| profiles | container places on any host; pushed refs; remote submit; remote refs records | container places on the server and on hosts that run no sessions; pushed refs; remote submit over SSH; server records with the projection | container places on the server; pushed refs; remote submit over SSH; server records with the projection |
| who advances a branch | whichever instance holds the branch (72); another takes it after a lease (73) | the server, always | the server, always |
| where candidates run | any instance with room, by a claim (75, 76) | the server and the executor hosts, by a claim through the projection | the server's executors |
| a host stops | its lead and claims pass to others (72, 77) | an executor host: its claims pass to others; the server: every branch stalls and loses nothing (59) | a session's host: nothing changes; the server: every branch stalls and loses nothing (59) |
| confinement | by vouching (78, 79); the shared branch's default names only hosts that run no sessions | by vouching; the executor hosts run no sessions | by construction: one writer, no sessions |
| who holds the branch's credential | every host's sluice user | the server | the server |
| what is new to run | `sluice run` on each host | `sluice run` on the server and each executor host | `sluice run` on the server; nothing on any other host |

## Scenarios

> **S17.** The lead of a branch goes quiet while alive, with a landing
> intent written. Another instance takes the branch after a lease; the
> former's next write is refused and it advances the branch no more. The
> landing lands exactly once, by whichever instance's move the branch
> accepts, and both read the same result.
>
> **S18.** A host writes a run naming a confined executor, vouched for by
> no identity the shared branch's policy names. The shared branch reads the
> key as missing until a vouched run settles it; a bolt's branch whose
> policy counts unvouched runs reads it as the run says.
>
> **S19.** The server's host is lost. Every entry's last state and
> verdict is readable from another host. A new server continues from the
> records as last written, finishes the landing that was intended, and
> runs no check that has a verdict.
>
> **S20.** A host stops mid-run and returns after its claim lapsed and
> the checks were run elsewhere. It releases the places it left before it
> claims again, and writes no outcome for the lapsed run.

## What it changes elsewhere

- 58 and 59 stand as written; 72 and 73 say when and how "next" happens.
- 60 stands; 77 says what "stopped" is.
- 26 stands; 80 adds the multi-host case it left open.
- The glossary gains instance, lease and claim.
- Section 10 loses its seven multi-host questions.
- sluice's rules gain one under "Verdicts and attribution": a run is
  read as an executor's only through the vouching the policy names (78),
  ruling out trusting a record's executor field alone under any profile
  with more than one writer; and one under "Places": an instance claims
  nothing while it has places to release (81).
- ADR 0008's "both deployments are designed" becomes true, and a new ADR
  records the order of building in `many-hosts-1.md` section 7.
