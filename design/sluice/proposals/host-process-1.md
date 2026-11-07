# Host process: sluice starts what it needs and stops it when idle

Drafted clauses for how a host's queues move with nothing installed to
run. sluice keeps one process per host, started by its own command when
work arrives and gone when no queue has work. A branch that takes pull
requests is queued on its forge, so no host takes requests in. The user
approved the design on 2026-11-06 ("Okay I approve this."), as drawn on
the page `Boomdrive Work Lifecycle`
(https://claude.ai/artifact/671w5zreD9aMqstSLpMQSm, kept beside this file as `host-process-1.html`). Clauses 135, 137
and 129 are rewritten in `../requirements.md`, and 120 and 140 follow,
each marked proposed until sluice's record. That record replaces record
0092's host driver.

## What it answers

| question | answered by |
|---|---|
| what moves a host's queues when nobody waits | 135: sluice's host process, which the first command that needs it starts |
| what a host installs for sluice | 135: nothing; no service, no unit, no list of repositories |
| how many sluice processes a host runs | 135: one per user while any queue has work; none when idle |
| where the host's bound on runs is kept | 135, 71: inside that one process, queued work before sessions' runs (150) |
| what ten submits at once do | 135: the first starts the process if none runs; each adds its entry and returns |
| what a crash or a sleeping laptop loses | 135: nothing; the records are on disk and the next command starts the process again |
| how it finds repositories after a restart | 135: an index sluice writes whenever a command finds a repository has sluice |
| who takes a branch's pull requests in | 137: only the instance that keeps the branch's records on its remote, on a forge the forge's jobs |
| what flume does to move a queue | flume's C.6: nothing; it reads each place's outcome at its settles |
| whether sluice calls another program | no; flume, timber and anything else read what sluice decided (landing-handoff-1) |

## The shape

One unit of work is a `using` block. flume holds the place, and sluice
decides the outcome, which flume reads:

```
runner      lease ─▶ flume launch
flume       using   place (branch + worktree)
agent                 stages
flume       finally sluice submit --no-wait ─▶ returns
sluice                 host process: form ─▶ test ─▶ land ─▶ next … ─▶ no work: exits
flume                  next settle reads the outcome:
                         landed ─▶ tear down
                         failed ─▶ a fix stage, same place
```

The host process, one per user on a host:

```
sluice submit · exec · wait · status       the command line, any repository
        │   a socket in sluice's state folder
        │   nobody answers: take the lock, start it, connect
        ▼
┌────────────── sluice host process ──────────────┐
│  a task per repository with work                 │
│  one run scheduler: the host's bound, candidates  │
│    before sessions' runs                          │
│  one forge client: one allowance, shared fetches  │
│  no work and nobody following ─▶ exits            │
└──────────────────────────────────────────────────┘
        │
        ▼
  records on disk, read again at every start
```

Where a queue runs:

```
host                                    forge
units ─▶ queue ─▶ bolt ── leased push ───────────────▶ main
                       └─ pull request ─▶ queue (forge's jobs) ─▶ main
```

## The clauses

### 135, rewritten

135. sluice is a plain command line, and nothing is installed for it to
     run. A command that needs the host's queues moved, a submit among
     them, reaches sluice's host process or starts it when none answers:
     one process on the host for each user that runs sluice there,
     holding every repository on the host that has sluice, each
     repository's queues apart, so a refusal or a slow fetch in one
     holds no other's round (26), and the host's bound on runs in one
     place (71, 150). Every other command reaches it and returns: a
     submit adds its entry and returns at once, and a wait or a watch
     follows it and runs no round (129). It ends once no queue it holds
     has work in play and nothing follows it. It keeps nothing the
     records do not hold, so one that stops loses nothing: the next
     command of sluice's that finds work in play and no host process
     starts one, which finds its repositories in an index sluice writes
     in the host's state whenever a command of sluice's finds a
     repository has sluice, a policy at a revision the host holds or
     records (129). A run outlives the host process that started it,
     and is equipped from its repository's policy (147), never from the
     environment of the command that started the process. A command of
     a newer sluice has an older host process hand its repositories
     over and end. No policy, configuration or document of sluice's
     tells a host to install or keep a service for it.

### 137, rewritten

137. A branch's requests are taken in only where its records are on
     its remote, by the instance that keeps the branch there (72): on a
     forge, the forge's jobs, as a pool (C.8), take them in and run the
     branch's rounds, one at a time. A branch whose records each host
     keeps in its own files takes no requests in. A host's submit to a
     branch that takes requests opens or updates its request and marks
     it ready (C.5), and the instance that keeps the branch takes it in
     as its conditions hold. The host follows the request by what the
     forge shows of it, open, merged or closed, and sluice's check on
     its head (C.5), each read as 136 has every read made, and reports
     the outcome they show as it reports an entry's (50). A status, an
     overview or a wait of the branch on a host shows each request it
     submitted or reaches with the request's entry there, taken in or
     waiting and on what, its state, its number and the entries ahead
     of it, each a field of the JSON form as well as words, read from
     sluice's check on the request's head.

### 129, the reader

A watch or a wait that finds no reader starts the host process, which
reads (135), in place of becoming the reader itself. A host process
that stops is started again by the next watch or wait within a tick.

### 120 and 140

120 drops the withdrawal for a hand-over of intake, since no host hands
intake over. 140's landing beside the queue names the instance that
takes the branch's requests in, in place of the host.

## What goes

- `sluice run` as a process a host keeps, and record 0092's host driver.
- One service per repository, on any host.
- Taking pull requests in on a host: the intake mark, its renewal and
  its lease, hand-overs and their withdrawals, and a copy named on the
  mark.
- Counting the host's runs across processes with lock files.

## What follows in the ratification

The rewritten clauses leave these naming `sluice run` or a host's
intake, for the statement change that comes with sluice's record:

- 129's tick sentence, "a watch's or `sluice run`'s (51)".
- 71's count "kept where every instance on the host reads it", which
  the host process keeps in one place.
- The many-hosts table's "what is new to run" row.
- S64 and S65, which name `sluice run` and a driver's rounds.
- C.5's pull request row, which names the host that takes requests in.

## What each repository owes

For agentplot-design, which writes in these repositories:

- **agentplot/sluice.** A record, named for what it decides, that
  replaces record 0092's host driver with the host process and moves
  pull request intake to the forge; rules core.25, core.31 and core.33
  amended to match; the README's "No daemon" paragraph says sluice
  starts its own process when work arrives and nothing is installed.
- **agentplot/boomdrive.** core.13 and record 0003 name sluice's driver
  among the processes the host's service manager keeps; under this
  design sluice starts its own, so that name goes. The runner's pass
  ending with one `flume settle --every` (follow-up B1) stands as the
  host's tick. The flake starts the runner and nothing of sluice's.
- **agentplot/flume.** C.6's step row: nothing, since sluice's queue
  moves on its own once submitted, and the settle's read of the
  submission starts the host process where work waits and none runs.
  This repository's statement carries it.
- **afterthought/swancloud.** The per-repository `sluice run` units on
  the Macs and the gate box retire once a sluice with the host process
  is released.
