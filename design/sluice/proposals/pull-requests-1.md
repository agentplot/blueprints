# Pull requests: a submission's page, and a branch on the forge

Drafted rows and scenarios for a branch whose shared copy lives on a
forge and whose work arrives as pull requests, on any deployment and
with any executor. The checks run where sluice runs them: on one
machine, that machine. A forge's job service as the executor and the
stepper is a pool in `../requirements.md` (88, C.8), which
uses these rows and adds nothing to them. The operator ratified 118,
119, S50, S51 and the C.2 moon row's edit on 2026-10-22: they are in
`../requirements.md`, which wins where they differ. The rest waits for
the operator's ruling.

## What it answers

| question | answered by |
|---|---|
| who fetches the branch, and when | C.4 pushed refs, unchanged; the round that reads the branch fetches it first |
| how a landing reaches the forge | C.4 pushed refs: a push leased on the revision the candidate was formed on |
| what happens when the branch moves on the forge outside sluice | S8, unchanged: the landing is refused and the chain is formed again |
| what a pull request is to sluice | C.5 pull request: a session's page; submitted when ready, never before |
| how review and other systems' checks hold work back | C.7: the branch's policy names them; 27 leaves them before submission |
| what a waiting pull request learns early | C.5 pull request: a forecast (64) each round, posted on it |
| who may open one | C.5 pull request: a branch in the repository; forks stay out (non-goals) |
| what a request shows of its verdict | 118: what its session reads, and no failure it is not blamed for |
| what a task runner's own report adds | 119: its times and tries, recorded with the run, deciding nothing |

## The shape

A pull request has two stages. It **waits** while it is a draft or
while a condition the branch's policy names does not yet hold: an
approving review, or a check another system posts on its head, such as
a QA team's approval of a test deployment. When it is ready and every
condition holds, the driver **submits** its head (47), and the entry
joins the branch's one chain (8). From there the queue is the queue:
candidates formed in order (10), tested ahead of need, a culprit named
(17), and the branch moved only to what passed (22).

A pull request never waits inside the queue. The chain lands in order,
so an entry held for a person's approval would hold every entry behind
it, and a refusal would form every candidate behind it again.

```
 opened (by submit, or by hand)
        |
        v
 +----------- waits -------------+      +------- the queue -------+
 | a draft, or a condition the   |      | tested with every entry |
 | policy names does not hold:   | ---> | ahead of it; landed by  | ---> landed
 | a review, a check another     |      | a push of the branch    |
 | system posts on the head      |      +-------------------------+
 +-------------------------------+
   joins the queue when it is out of draft and every condition holds
```

## Part C, rows

**C.4 the branch**, the pushed refs row, stands as written: `git fetch`
then `git rev-parse` of the remote's branch; forming and committing as
local refs, on the host advancing the branch; the landing a push with
`--force-with-lease=<branch>:<expected>`; branch protection by the
forge's rules, which only sluice's identity bypasses (1). Only the
branch is pushed. On one host the records stay local files (C.6); the
remote refs records are for many hosts.

**C.5 the driver**, a new row:

| profile | submit / withdraw / state / notify / forecast |
|---|---|
| **pull request**: a forge's request to merge a branch of the repository into a branch whose policy turns pull requests on | `submit` pushes the session's branch and opens a pull request, or updates the open one; a pull request opened by hand is found by the round that reads the branch; either is submitted when it is out of draft and every condition its branch's policy names holds on its head, and a request from a fork is never submitted; a new head withdraws the entry and the request waits again; a request moved back to draft or closed is withdrawn; its state is a check sluice's identity posts on its head, carrying the entry's state, what it waits for, and the culprit or conflict with a comment when it is removed; the instance that reads the branch's records posts, on the request's head, one check per required check per system with its outcome and signer, and one for the entry's state in the queue, and in the request's conversation one report of the entry's verdict, edited as it changes, all showing what 118 says; each round runs a forecast for every waiting request and posts it; the landing is sluice's push of the branch (C.4 pushed refs), after which the forge marks the request merged because its head is in the branch; the forge's merge button, merge queue and squash or rebase merges are not used on such a branch |

**C.7 policy**, added: a branch's table may name its remote and turn
pull requests on, with the conditions a request meets before it is
submitted:

```toml
[branches.main]
remote = "origin"            # the branch lives there: fetched, and landed by push

[branches.main.pull_requests]
reviews = 1                  # approving reviews on the current head
checks = ["qa/approved"]     # checks other systems post on the head, by name
```

The conditions are read from the branch's revision (56), as the gate
is. They decide when work is submitted, never how it is tested: the
gate is still the checks sluice runs (27).

**C.2 the check**, the moon row's run cell gains: "run in moon's CI
mode, so a task the repository keeps out of CI is not run and its check
is missing; each task's duration and attempts, and the run's duration
and moon's estimate of the time it saved, recorded with the run (119)".

## What a request shows

A team reads its CI where its work is, on the request. The request
shows what sluice decided and how, read from the records, the same
whichever task runner the branch uses. A runner's own report describes
one run of the runner, not the candidate that lands: its changed files
are every entry's, and its cache is not a trusted replay. It is not
posted.

> 118. What a request shows of its entry, on its checks or in its conversation, is read from the records and decides nothing: no gate, round or submission reads it back (27, 30). It shows what the entry's session reads (49): the candidate, the entries tested in it, and each required check's key, outcome, executor or signer, and whether it was run or replayed (16, 38), or why it has no outcome (114, 116). A request whose entry was tested with a culprit shows that its candidate is formed again, and no outcome of that candidate (20).

> 119. What a check's tool reports of a run beyond its key, outcome and executor, such as how long it took, how often it was tried, or the time it saved, may be recorded with the run and shown with it. It is never read as an outcome, a replay or a flake (16, 19, 38).

118 holds a request to 20: a page every reader of the repository can
see is no place to tell the entries behind a culprit what the culprit
did. 119 keeps a runner's retries from passing for a flake, which only
19 reads.

## Non-goals, rewritten

- The forge's own pull-request flow for contributors outside the
  repository: a request from a fork is never submitted.

## Scenarios

- **S21.** A pull request is out of draft and approved, and waits for
  `qa/approved`. Two others behind it are submitted, tested and land.
  QA approves; the request is submitted, tested on the branch the other
  two left, and lands.
- **S22.** A queued request gets a new commit. Its entry is withdrawn,
  its review is stale, and it waits again; the entries behind it are
  formed again without it.
- **S23.** A person opens a pull request by hand from a branch of the
  repository. The next round finds it, posts its forecast, and submits
  it once it is ready and its conditions hold.
- **S24.** A person merges a pull request with the forge's button
  between a candidate's verdict and its landing. The landing's push is
  refused and the chain is formed again on the new revision (S8). The
  merged request is closed, which withdraws its entry if it had one.
- **S50.** #10 and #12 are pull requests, #12 behind #10. Their
  candidate fails and #10 is the culprit. #12's checks go back to
  queued, and its report says its candidate is formed again; none of
  them names #10 or a failed check (118, 20).
- **S51.** moon reports a passing task tried twice. Its outcome is a
  pass and the key is not flaky (19); the request's report notes the two
  attempts (119).
