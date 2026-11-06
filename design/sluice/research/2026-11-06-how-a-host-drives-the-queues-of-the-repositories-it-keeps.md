# How a host that keeps many repositories drives their queues

Research note for the user, 2026-11-06, from the research place
`research--how-a-host-drives-the-queues-of-the-repositories-it-keeps`.
Clause numbers are sluice's statement, `design/sluice/requirements.md`,
unless another tool is named; `core.N` are each tool's rules; records
are each repository's `docs/adr/`. Nothing here amends a statement, a
spec or a rule: it is a design for the user to approve, which then goes
to each repository's own change.

## 1. The short answer

deneb keeps two copies of most repositories: the person's clone under
`~/Code/github_<owner>/<repo>/` and the runner's under
`~/.local/share/flywheel/repositories/<owner>/<repo>/`. sluice knows a
repository by its git directory, so each copy is a sluice of its own,
with its own records, its own queue for the same GitHub branch, its own
reader and its own driver. The fleet runs a `sluice run` in every
person's copy and none in any runner's copy, so work the runner
launches moves only while flume settles its place. When it does move,
its rounds find the host's two run slots held by agents' `sluice exec`
runs, which take a freed slot within a second.

Recommendation: **one copy of each repository per host, and one sluice
driver per host.** The runner's clone is the host's one copy, as
Boomdrive's rule core.14 already says, and the person's checkouts are
worktrees of it. `sluice run` gains a host form that drives every
repository on the host holding sluice's records, which the Boomdrive
flake starts as a service of its own. sluice stays a command line run
from a working copy: nothing requires the driver, and a person on a
laptop with nothing running submits and waits as today. A driver gets
room only once the host keeps some for candidates: deneb's setting of
`reserved = 0` gives agents' runs all of it.

## 2. What happened on deneb

Read on 2026-11-06 from the records, the process table, the host's
sluice state and flume's log, against sluice's code on main. sluice
broke no clause. Two things stopped the runner's swancloud queue.

**Nothing drives the runner's copies.** The 16 `sluice run` processes
each hold the driver lock of a person's copy
(`~/.local/state/sluice/readers/%2FUsers%2Fchuck%2FCode%2F…​.driver`);
no lock names any runner copy. A queue there moves only by a round
someone runs in it. flume runs one, `sluice step <base>`, at each
settle of a place whose submission is undecided, and a place is
settled only while its agent is live or a caller asks.

**Every round finds no room.** The host's bound is two runs with none
kept for candidates (`~/.config/sluice/config.toml`, `[runs] max = 2,
reserved = 0`, from swancloud's `lib/sluice-runs.nix`). Agents' `sluice
exec` runs retry at every pass and take a freed slot within about a
second; the session run directories begin at 01:51:03, 01:52:08,
02:00:36, 02:02:00, 02:15:38 and 02:19:25, each within a second of
another run's end.

- The hand waits did run rounds. `sluice wait 5`, `7` and `8`
  (01:47:23 to 01:56:30, `--timeout 9m`, exit 5 meaning still
  waiting) found no driver lock and ran a round every three seconds
  (`crates/sluice/src/lib.rs`, `wait_on`). Each round left the
  window's deepest candidate `formed`, as a round does when it has no
  room (`crates/sluice-core/src/step.rs`, about line 2589).
- The hand step's "stepped" says the round ran, never that a run
  started. At 01:57:20 two runs held the slots: sluice's
  `chore--the-conventional-check-takes-a-revert/1` and flume's
  `…/2`.
- At 02:01:58 a round, by its timing a flume settle after #15's submit
  at 02:01:41, found one slot free and claimed c4 into place
  `sluice/try/bolt/swanclouds-bumps-of-the-5th/1`. sluice makes the
  checkout first and asks for room after
  (`step.rs`, `start_run`; `checks.rs`). At 02:02:00 an agent's session
  run took the slot; at 02:02:03 admission found two of two held,
  released the place and left the run open, with no supervisor
  started and no output kept. The same claim and release came again at
  02:34:23 on this bolt and at 02:25:16 on
  `bolt/a-sessions-box-stops-with-only-plumbing-on-it`, and in person
  copies too (flume main/99, swancloud main/222 and 225, crew
  main/217).
- `sluice status` reads that run as "31m of 30m": it counts from when
  the run was opened, and the time limit applies only to a run another
  host was asked to take, so the run waits for room, however long.
- The reader files the brief found empty were there:
  `~/.local/state/sluice/readers/` holds the runner swancloud copy's
  reader, a herdr sidebar's `sluice overview --watch` from a runner
  place.

**What landed earlier: flume's settles, with room free.**

- dab6601 on `bolt/a-mac-waits-on-no-other-environments-release`,
  submitted 19:17:50 on 11-05 from `chore--the-deployer…`, claimed and
  refused at the bound once (19:43:06 to 19:43:08), started at
  19:45:06, ran 28m57s and landed at 20:14:29. flume settled that place
  314 times from 19:17:53 to 20:14:31, about six a minute, while its
  agent was live, with a settle just after each round.
- 84393d4 is in the runner's boomdrive-cloud copy,
  `bolt/you-sign-in-to-staging`, #1 from
  `change--one-seam-turns-every-credential-into-a-principal`: submitted
  15:44:44, testing at 15:45:55 and landed at 15:48:23, each inside a
  burst of settles, at an hour when the host had free slots.
- No wait, waiting submit or crew process took part in either.

**Two gaps in sluice worth their own change**, neither a broken clause:

- A round counts room when it decides and asks for it only after the
  checkout, three to five seconds later (`step.rs`, the comment near
  line 704 names the race). The room is not held between.
- Nothing gives a queued candidate the first free slot ahead of an
  agent's run that retries every pass. The session-runs-1 proposal's
  clause 91 said "the candidate's is started first"; the statement
  does not carry it, and the code offers only the host's `reserved`.

A swancloud change on the same gap,
`change--every-submission-from-a-runners-place-is-driven-on-its-host`,
was settled until 02:08Z in the person's swancloud copy; its place and
branch are gone, and I found no landing of it.

## 3. What the rules say today

### What "no daemon" forbids and what it allows

The statement (135) and rule core.31 forbid sluice from **needing** a process
between its commands and from telling a host to run one: "no policy,
configuration or document of sluice's tells a host to run a daemon".
They allow a host to run one, by its own choice: "A host may run one
driver, `sluice run`, by hand, from cron, by a fleet's service or by a
plugin's lease, the host's choice and never sluice's ask". Record 0068
settled this on the user's words of 2026-10-28: "telling them they have
to set up a daemon is probably not what I want. It should be able to
work as a simple CLI". A host driver serving many repositories fits
both: it is the host's choice, and a host without it works as before.

### What makes it one driver per repository today

The per-repository layout is the fleet's choice (swancloud
`lib/sluice-driver.nix`: "Binding the service is the fleet's choice
(crew record 0046 part 5), never sluice's ask"), and sluice's own
shape makes it the only choice a host has:

- `sluice run` drives the repository of its working directory: "Rounds
  for every branch with a queue, until stopped".
- A repository is its common git directory. The reader and driver
  locks are `~/.local/state/sluice/readers/<git dir>.{lock,driver}`
  (`crates/sluice/src/reader.rs`), and the records under the local
  files profile live in that git directory (C.6).
- 135 says "one process per repository reads and drives there".

So a host that wants every queue moving while nobody waits runs one
`sluice run` per copy of each repository. On deneb that is 16 today
for the person's copies, and would be 23 more for the runner's.

### What two copies of one repository on one host do

Each copy keeps its own queue of the same GitHub branch, and sluice has
no way to see the other:

- **Two queues for one branch.** For a branch on a remote (124, C.4
  pushed refs), both copies form on the remote's revision and land by a
  leased push. The lease keeps the branch correct, and the loser's runs
  are wasted. One instance advancing a branch at a time (58) holds
  only by accident.
- **Two takers of one branch's pull requests.** The intake mark (137,
  core.33) names a host, and a copy judges the mark its own when
  `mark.host == self.peer.name`
  (`crates/sluice/src/profiles/github/pulls.rs`). Both copies on deneb
  read swancloud main's mark as theirs. The runner's copy did take
  pull requests 314 and 315 into its own queue of main on 2026-11-05 at
  21:50Z; fifteen minutes later swancloud-ops withdrew 314, and 315's
  place withdrew it.
- **Two answers to one question.** `sluice status` of one bolt, read
  from the two copies, gives two queues; 26 asks that every host that
  submits to a branch read the same state.

### What Boomdrive and flume say

- Boomdrive core.14: "The runner's clone of a repository is the host's
  one clone of it: flume, sluice and what a launch runs may work in its
  container". Its detail rules out "a second clone of a kept repository
  made for a tool".
- Boomdrive core.13: "The runner starts, keeps and stops no tool's
  long-running process … sluice's driver, the multiplexer's server and
  any settle loop are the host's service manager's." Boomdrive record
  0003 (proposed) weighed "The runner keeps one `sluice run` for each
  repository it keeps" and did not take it.
- The flake design in progress starts only the runner. Its non-goals:
  "sluice's driver, herdr's server, flume's settle loop and flume's
  configuration. They are the host's service manager's".
- flume moves a queue only inside a settle: "`sluice step <base>`, one
  round of the base's queue, run by each settle that finds the place's
  submission undecided" (flume C.6, 124, 125 and core.6). A settle runs
  only when an agent goes quiet, when the terminal's watch settles a
  place with an agent in it (flume 122), or when a caller runs a
  command (flume 120). Nothing settles a place whose agent has
  ended.
- swancloud record 0050 found the gap on 2026-11-05 and decided
  nothing: "No sluice driver drives the queues of the runner's clones."
- The views' retirement keeps the anchors, the spaces' clones and their
  drivers "until a runner keeps every host's repositories (afterthought/crew
  record 0052, part 4)".

## 4. The options side by side

Each option is read for what it keeps of sluice as a person meets it in
their own repository (commands from the working copy, no daemon
needed), what it changes, what it amends, and who owns each piece.

### A. One host driver serving many repositories

`sluice run --host` (the name is open) drives every repository on the
host that holds sluice's records. sluice finds them in an index it
writes in the host's state when it first writes a repository's records
(a submit, a `sluice branch create`), and drops a repository once it is
gone or holds no sluice, as a watch does today (129). Per repository it
does what `sluice run` does: it holds that repository's reader and
driver locks, so waits and watches follow it (129, 135); one
repository's failure is that repository's, as one branch's is its own
today (26); one repository's slow fetch holds no other's round. The
host's bound on runs (71) is kept in this one process. A `sluice run`
started in one repository's folder still drives that repository, and
the host driver passes over a repository whose driver lock another
process holds.

- **Keeps:** every command a person runs in a working copy; nothing
  needs it; a host that runs nothing moves its queues by waits as today.
- **Changes:** one service on a host in place of one per repository; a
  new repository is driven from its first submission, with no deploy.
- **Amends:** sluice 135 and 129 (the host's one driver serves every
  repository; a reader may be one process for many), core.25,
  core.31, record 0068 (amended), and a scenario beside S60. The
  Boomdrive flake's non-goal on sluice's driver. swancloud's
  `lib/sluice-driver.nix` retires.
- **Owners:** sluice owns the host driver and its index. The Boomdrive
  flake owns starting it on a host that turns it on. swancloud and
  every other host cite the flake.

### B. Per-repository drivers where the runner keeps its clones

One `sluice run` unit per repository the runner keeps, in the clone's
container or its view, rendered from the runner's own list
(`settings.repositories` in the flake).

- **Keeps:** sluice as it is; no sluice change.
- **Changes:** on deneb, 23 more processes beside the 16 until the
  spaces retire; a repository the runner starts keeping waits for a
  deploy before its queue moves; two lists of repositories to keep in
  step.
- **Amends:** the flake's non-goal; Boomdrive core.13 holds, since the
  service manager starts them and the runner does not. swancloud's
  driver jobs move to the runner's clones, or to the flake.
- **Owners:** the flake owns the units; sluice owns nothing new.

This works with no sluice change, which makes it the stopgap. It is
the shape the user called "not scalable".

### C. The runner or flume moves the queues

**The runner.** It already passes every two minutes and runs `sluice
status` for each launch (Boomdrive tool-records spec). It could run
`sluice step <base>` for each undecided launch on its pass, or keep a
`sluice run` per clone.

- **Keeps:** sluice as it is.
- **Changes:** a round at most every pass, and a landing takes several
  rounds (form, open a run, read its results, land), so each landing
  waits minutes longer; it drives only the repositories the runner
  keeps, never a person's own submits.
- **Amends:** Boomdrive core.13 rules out keeping a `sluice run`;
  stepping on its pass makes the runner a second driver beside flume's
  settle, against Boomdrive core.1 and record 0003; sluice C.5's
  Boomdrive row.
- **Owners:** Boomdrive.

**flume.** Its terminal's watch could settle every place whose
submission is undecided, as it settles every place with an agent in it
today, so each settle steps the base.

- **Keeps:** sluice as it is; flume keeps no process of its own (flume
  120), since the watch is herdr's.
- **Changes:** every undecided place steps the same queue, many steps
  per round; queues move only while herdr's server runs; a person's own
  submits are never driven.
- **Amends:** flume 122, 124, 125 and core.6.
- **Owners:** flume.

Neither is a driver a host would choose. flume's step stays what it is
today: the fallback where no driver lives.

### D. Records kept on the remote

sluice's peers profile (C.6 remote refs, C.8, record 0037): a branch
whose policy names signers keeps its records under `refs/sluice/` on
GitHub. Every copy and every host reads one queue, and any instance
with room advances it.

- **Keeps:** the command line; the person's own copy could stay, and
  its driver would drive the runner's submissions.
- **Changes:** each repository's policy names signers, and deneb's open
  runs must be signed to count (78); every write of the records is a
  push to GitHub, under the forge's allowance (137, core.31), so rounds
  slow; some driver on some host is still needed.
- **Amends:** no clause of sluice's: peers is a profile already. Each
  repository's policy; swancloud's signer keys.
- **Owners:** each repository's policy author; swancloud for the keys.

The right answer once several hosts submit to one branch (section 9,
"until several hosts submit to one branch"); too heavy as the answer to
one host holding two copies.

### E. One copy of each repository per host

The runner's clone is the host's one copy (Boomdrive core.14). A
person's checkouts are worktrees of it, as the runner's views under
`~/Code/boomdrive/<owner>/<repo>` already are. The spaces' clones under
`~/Code/github_<owner>/` retire, as crew record 0052 part 4 plans, once
their queues have drained; records do not move between copies.

- **Keeps:** every command a person runs from a working copy.
- **Changes:** the person works in worktrees of the runner's clone; the
  anchors and the spaces' clones go; one repository is one sluice on
  the host, one queue for each branch, one reader, one intake.
- **Amends:** no clause of sluice's. Boomdrive's clones spec, if the
  person wants the clone root in a folder of their choosing; swancloud
  records 0030 and 0050, the spaces and the anchors timer; the timing
  of crew record 0052 part 4.
- **Owners:** Boomdrive owns the copy; swancloud retires the spaces;
  sluice and flume cite Boomdrive.

Alone, E ends the split queue, and the existing per-repository
drivers, pointed at the runner's clones, drive everything. It leaves
one driver per repository.

### F. One queue per remote branch per host, whatever the copies

sluice keeps a remote branch's local records in the host's state, keyed
by the remote and the branch, so every copy's submits join one queue.

- **Keeps:** the person's own clones as they are.
- **Changes:** where records live (C.6 local files); the reader, the
  driver and the results log keyed by remote; candidates formed in
  whichever copy drives.
- **Amends:** sluice C.6, 69, 129, 135 and their records.
- **Owners:** sluice.

The alternative to E if the person keeps separate clones. It is a much
larger change to sluice than E is to the fleet.

### The table

| | keeps the plain CLI | sluice changes | processes on deneb | split queue ends | owner of the new piece |
|---|---|---|---|---|---|
| A host driver | yes | host form of `run`, index | 1 | no, alone | sluice; flake starts it |
| B drivers at the runner's clones | yes | none | 16 + 23 | no | the flake |
| C runner or flume steps | yes | none | 0 new | no | Boomdrive or flume |
| D records on the remote | yes | none | as today | yes | each policy's author |
| E one copy per host | yes | none | 16, re-pointed | yes | Boomdrive |
| F one queue per remote branch | yes | records location | as today | yes | sluice |
| **A + E** | **yes** | **host form of `run`, index** | **1** | **yes** | **sluice; Boomdrive** |

## 5. Recommendation: A and E, with flume's step as the fallback

| piece | owner | cited by |
|---|---|---|
| The host's one copy of each repository, and where it lives | Boomdrive (core.14, clones spec) | sluice, flume, swancloud |
| `sluice run --host`: one driver for every repository on the host with records, found by sluice's own index | sluice (135, 129, core.25, core.31) | the flake, flume |
| A copy of a repository judged as the mark's holder only when the mark names that copy, so a second copy never takes a branch's requests in | sluice (137, core.33) | none |
| Starting the host driver as a service beside the runner, on a setting | the Boomdrive flake | swancloud and every host |
| `sluice step` per settle where no driver lives | flume (C.6, 124) | none |
| Retiring the 16 units, the spaces' clones and the anchors | swancloud (records 0030, 0050; crew record 0052 part 4) | none |

In order:

1. **Now.** Drive the runner's clones with what sluice has: swancloud's
   driver jobs gain the runner's clones (option B as a stopgap), or the
   operator starts a `sluice run` in the runner's swancloud clone by
   hand.
2. **sluice.** The host form of `sluice run` and its index; the intake
   mark naming the copy.
3. **The flake.** A setting that starts sluice's host driver as the
   host's service; the runner never spawns it (Boomdrive core.13).
4. **swancloud.** Imports the flake's driver and retires its units;
   the spaces' clones retire once their queues are empty.

## 6. What I am unsure of

- **The person's own checkouts.** E moves the person's working copies
  into worktrees of the runner's clone. That is the person's layout,
  and herdr's sessions, `wt` and crew's returns open the anchors'
  paths today. F keeps them and costs sluice a records move.
- **How the host driver finds repositories.** An index sluice writes at
  a repository's first records needs no configuration and covers a
  person's own copies; a list the flake renders from the runner's
  `repositories` is explicit. I lean to the index.
- **The host driver's shape inside sluice.** One process with a thread
  per repository, or one parent keeping a `sluice run` per repository
  as its children. Either is one service to the host; sluice's own
  change decides.

- **Whether the 02:01:58 round was a settle.** It fits a settle's
  timing and the step a settle runs, which I watched live at 02:39:16;
  no record names the process.
- **Two quiet stretches.** From 01:17:27 to 01:36:37 and 01:52:27 to
  01:54:02 the surviving run directories show one run or none, and
  `bolt/a-rift-step-finds-its-pane` formed with no room at 01:16:55.
  Either runs left no trace (a session place's run directories go with
  the place), or no settle stepped the branch then.
