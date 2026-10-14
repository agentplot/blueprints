# Pull requests: a submission's page, and a branch on the forge

Drafted rows and scenarios for a branch whose shared copy lives on a
forge and whose work arrives as pull requests, on any deployment and
with any executor. The checks run where sluice runs them: on one
machine, that machine. A forge's job service as the executor and the
stepper is a separate deployment, `many-hosts-2.md` section 10, which
uses these rows and adds nothing to them. Nothing here edits
`../requirements.md`; the operator rules on it.

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
| **pull request**: a forge's request to merge a branch of the repository into a branch whose policy turns pull requests on | `submit` pushes the session's branch and opens a pull request, or updates the open one; a pull request opened by hand is found by the round that reads the branch; either is submitted when it is out of draft and every condition its branch's policy names holds on its head, and a request from a fork is never submitted; a new head withdraws the entry and the request waits again; a request moved back to draft or closed is withdrawn; its state is a check sluice's identity posts on its head, carrying the entry's state, what it waits for, and the culprit or conflict with a comment when it is removed; each round runs a forecast for every waiting request and posts it; the landing is sluice's push of the branch (C.4 pushed refs), after which the forge marks the request merged because its head is in the branch; the forge's merge button, merge queue and squash or rebase merges are not used on such a branch |

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
