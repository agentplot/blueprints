# Answers to the reconstruction's questions

A fresh model, given only the statement, designed sluice
(`reconstruction-1.md`) and asked 25 questions where the statement was silent
or contradicted itself. Below, the answer to each, in plain words, as the operator ruled them on
2026-10-11; each is now a clause or a Part C row of the statement.

Four of them were settled by the walkthrough review of 2026-10-11 and need
nothing more: 4 (there is no operator approval in sluice any more), and the
parts of 1, 13 and 24 noted below.

## Needed for phase 1 (one machine, bolt branches)

**1. Who checks that a submitted worktree holds nothing but its commits?**
The submit command, before it submits: `wt submit` and `sluice submit`
refuse a worktree with uncommitted or untracked changes and name them. sluice
itself is only ever given a commit. Clause 2 moves under the driver.

**2. How is an agent's attempt to move the branch itself refused?**
sluice cannot stop a `git push` or a `git merge` run by hand, so the
refusal belongs to the setup, not the core. This is branch protection: on one machine, sluice installs
a git `reference-transaction` hook that refuses any update to a branch
sluice manages unless sluice is the one making it, and logs the attempt.
On a forge, it is branch protection that only sluice's identity bypasses.

**3. When an agent resubmits after being blamed or conflicting, what happens
to the old submission?**
The new submission withdraws the old one. The old one stays in the log as
withdrawn; nothing is lost and nothing piles up.

**5. How are lanes worked out?**
From the projects each submission's own change touches, by moon's affected
projects, dependents included, between the point the submission's branch
left the target and its head. Two submissions whose projects overlap share a
lane. The lanes are worked out again every round.

**6. Does one submission whose projects are unknown fuse every lane into one?**
Yes, while it is queued, and the lanes split again once it lands or leaves.
That is the safe reading of clause 9 and costs only parallelism.

**7. A conflict is found when a combination is formed, but nothing may be
removed before everything ahead has a result. Which wins?**
The conflict: the agent is told at once and its submission leaves the
queue, as clause 12 says. If the submission it conflicted with is later
blamed and removed, the agent simply resubmits. Clause 18 is reworded to
cover blame and landing only.

**8. When several submissions together cause a conflict, who is it
"contested with"?**
sluice tries the conflicting submission against each one ahead singly and
names every one it conflicts with. If none conflicts alone, it names all
the submissions ahead up to the point the conflict appeared.

**9. Can a high-priority newcomer jump ahead of submissions already being
tested?**
No. Priority orders only submissions not yet in a combination under test;
nothing being tested is thrown away for a newcomer. A resubmission joins at
the back, keeping its `after` list.

**10. How does sluice know a test already passed without running it?**
It doesn't ask ahead; it runs the required moon targets and moon replays
the ones whose inputs did not change. A replay is recorded as a replay,
pointing at the run it came from. This costs moon's hashing, not the tests.

**11. Can a pass recorded for one branch count for another?**
Yes. A result belongs to a test's inputs, not to a branch, so results are
kept per repository, beside the per-branch queues, and any branch whose
rules accept that machine's runs can use them.

**12. When `batch = true` and the longest combination passes, which result
does each submission's merge commit name?**
The longest combination's: all of them land together on that one result,
and each merge commit names it.

**13. A flaky test with `flaky = "fail"`: is the submission blamed, or the
test run again?**
Blamed, as the config says. A third value, `"retry"`, which runs the test
once more before deciding, can come later if blame lands on flakes too
often.

**16. Is an agent told its outcome exactly once?**
At least once. After a crash, the next round may tell it again; every
message carries the submission id and the outcome, so a repeat is easy to
ignore. A waiting `wt submit` simply reads the outcome.

**20. Who is "the submitter", and how does a planner change a submission's
priority or `after` list once it is queued?**
The submit command records who submitted: the agent's name and its
worktree. A new command, `sluice amend <id> --after <ids> --priority <n>`,
changes a queued submission's order; crew needs it when a forecast conflict
turns into an `After`.

**21. What is "the submission's work" that a merge commit names?**
The submission's commits, from the point its branch left the target to its
head. The merge commit's subject names the submission and its branch, as in
`Land #12: unit/touches`.

**22. Where does `wt submit --check` place the work it checks?**
At the back of the queue, after everything already submitted and after
anything its `after` list names, exactly as if it were submitted now.

**23. If the branch was moved by hand and holds no recorded result, what
must the next combination run?**
Every required target, once. After that, results build up again and
replays resume.

**24. Is `parallel` per branch or per lane?**
Per branch, across all its lanes, because that is what someone setting it
expects. Separately, each machine has its own cap on how many test runs it
does at once, so several busy branches cannot swamp it.

**25. When a whole bolt is submitted to `main`, what are its "worktree" and
its "agent"?**
The bolt's own worktree, and whatever closed the bolt: crew's conductor or
flywheel. Not needed in phase 1, which queues only bolt branches.

## Left for several machines

These need the multi-host design and have no bearing on phase 1:

- **14, 15.** How a branch's rules name the machines whose runs count, and
  how a run proves which machine made it. Under peers, where every machine
  writes the shared state, runs have to be signed for "confined" to mean
  anything.
- **17.** Under a central server, the state is readable only through the
  server, so "readable with sluice stopped" means readable on the server.
- **18.** A machine that dies for good leaves checkouts behind; they are
  cleaned up when it comes back, and its claims on tests expire meanwhile.
- **19.** How long a machine may hold a branch, or a test claim, before
  another may take it: a deployment setting, not a branch rule.
