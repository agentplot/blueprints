# Branches: sluice makes and removes the branches it lands on

These are drafted clauses that let the operator or a planner ask sluice to
make a branch it will land on, such as a bolt cut from `main`, and to
remove it once its work has landed. Without them, the caller makes and
removes the branch itself. On a forge that means a second writer on
branches only sluice's identity should move, using credentials that may
need a person present. On one host it means a ref the protection hook
has to let through. Parts A and B gain three clauses, 104 to 106, and
45 changes. Part C gains a command in C.5, and the C.4 rows say
how each profile makes and removes a branch. Nothing here edits
`../requirements.md`; the operator rules on it.

## What it answers

| question | answered by |
|---|---|
| who makes a branch sluice lands on | 104: sluice, when the operator or a planner asks |
| at which revision | 104: the current revision of another branch sluice lands on, never a head or a candidate |
| who removes it, and when | 105: sluice, when asked, once nothing is queued on it and its revision is in the branch it landed into |
| what keeps two makers, or a landing and a removal, apart | 45, 46, 106: a move from absent, or to absent, from the revision read |
| whether it works with no remote | C.4: local refs make and remove the ref with the same expectation, so yes |
| what it costs a session | nothing: 1 stands; a session never asks |

## The shape

```
 planner asks: make bolt/x from main
        |
        v
 bolt/x made at main's revision M (104), only if absent (45)
        |
        v
 units submit to bolt/x; sluice lands them (22)
        |
        v
 bolt/x submitted to main and landed: bolt/x's revision is in main (23)
        |
        v
 planner asks: remove bolt/x into main
        |
        v
 bolt/x removed from the revision read (105), only if still there (45)
```

## Making a branch

### The problem

A bolt is cut from `main` and lives as long as its work does. When the
branch lives on a forge, whoever cuts it pushes it, and the forge's
rules must then let a second identity create branches sluice alone
updates. On a host whose git reaches the forge through an agent that
asks a person, the push waits for them. On one host with no remote, the
cut is a local ref the protection hook has to allow.

### What the statement already settles

A session never moves a branch (1), and the actors table keeps a
planner from moving one. A branch moves only from the revision it is
expected at (45), and its gate is read from its own revision (56). Nothing says who makes a branch.

### The ruling

> 104. The operator or a planner may ask sluice to make a branch it
>      will land on, from another branch it lands on. sluice makes it at
>      the other branch's current revision, by a move from absent (45),
>      when the policy at that revision gives the new branch a gate (56)
>      and the new branch's records hold no entry still waiting, under
>      test or landing. A branch already present is refused, and so is
>      one that policy does not name.

The new branch starts at a revision that has already passed a gate,
because it is another branch's current revision. The actors table's
"never move a branch to a revision that has not passed its gate" holds
from the first revision on. Its policy is the one it starts at, so its
first submission is gated as every later one is (56).

## Removing a branch

### The problem

Once a bolt has landed on `main`, its branch only collects stale
checkouts and fetches. Removing it by hand races a landing still on
its way. It also loses work when the bolt's last landing never reached
`main`.

### The ruling

> 105. The operator or a planner may ask sluice to remove a branch it
>      lands on, naming the branch the removed branch's work landed
>      into. sluice removes it by a move to absent (45) from the revision
>      it read, only when no entry on it is waiting, under test or
>      landing, no landing on it is left unrecorded (S9), and that
>      revision is contained in the named branch's current revision. Its
>      records stay.

A landing commit has the entry's head as its second parent (23). Once
the branch's revision has been submitted and landed, it is contained in
the branch it landed into. A removal that finds the branch moved since
it read the revision is refused (46), so a landing that races the
removal is never lost. The records stay so that the branch's history
stays readable (26).

> 106. Making and removing a branch is not landing: neither writes a
>      commit, records a verdict or reads a gate's checks, and 22 to 24
>      bind neither. A refused one is reported, never retried blind. A
>      branch sluice lands on is made and removed only as 104 and 105
>      say, and the branch's protection (1) refuses anyone else's.

45 becomes:

> 45. **move**: given a branch, the revision it is expected at or that
>     it is absent, and the revision to move to or its removal, the move
>     or a refusal because the branch was elsewhere (24, 104, 105).

The guarantee of 46 covers both new moves as written: two moves from
one expectation never both succeed, so two makers of one branch never
both succeed, and neither do a landing and a removal from one revision.

## Part C, rows

**C.4 the branch**: each row gains its make and its remove.

| profile | make / remove |
|---|---|
| **local refs** | `git update-ref <branch> <rev> ""`, the empty old value meaning absent; `git update-ref -d <branch> <expected>`; the protection hook lets sluice's own through, as it does its landings |
| **pushed refs** | `git push --force-with-lease=<branch>: <rev>:refs/heads/<branch>`, the empty lease meaning absent; `git push --force-with-lease=<branch>:<expected> --delete <branch>`; the forge's rules restrict creating, updating and deleting the branch, and only sluice's identity bypasses them |

With no remote, a branch is made and removed in local refs under the
same expectation, and everything above holds on one host.

**C.5 the driver** gains a row:

| profile | make / remove |
|---|---|
| **branch**: `sluice branch` | `sluice branch create <branch> --from <branch>` makes it at the other branch's current revision and prints that revision (104); `sluice branch delete <branch> --into <branch>` removes it (105), `--into` naming `main` when omitted; each prints JSON with `--json`, exits 0 when done, 1 when a branch it names does not exist and 2 on a refusal, naming it |

## For the caller

crew makes each bolt with `sluice branch create bolt/<b> --from main`
and cuts its units' worktrees from the revision printed, or from
`origin/bolt/<b>` after a fetch. Once the bolt has landed on `main`,
crew calls `sluice branch delete bolt/<b> --into main`. crew pushes to
no branch. A refusal says why, and crew reports it.

Records are kept per host (C.6). A removal sees only this host's entries
on the branch. A submission still queued on another host then finds the
branch gone and is refused there. Its work is not lost: it stays on its
head. 105's containment check keeps everything that landed. A caller
working one bolt from several hosts removes it only once each host's
work is done. A shared queue across hosts (the records' peers or
central server) closes the gap.

## Scenarios

- **S36.** A planner asks for `bolt/x` from `main` at M. sluice makes
  `bolt/x` at M. A second ask is refused because `bolt/x` is present. On
  another host, an ask made at the same time finds the remote's branch present and is
  refused (46).
- **S37.** A planner asks to remove `bolt/x` into `main` while an entry
  is under test on it. The removal is refused, naming the entry. Once the
  bolt's revision is landed on `main`, the removal succeeds and the
  branch's records still read.
- **S38.** A removal reads `bolt/x` at R. Another host lands on `bolt/x`
  before the removal reaches the remote. The removal is refused because
  the branch is elsewhere, and the landing stands.
- **S39.** A planner asks to remove `bolt/x` into `main`, but `bolt/x`'s
  revision was never landed on `main`. The removal is refused, saying so.

## What it changes elsewhere

- 45 as above.
- The actors table: a planner and the operator may ask sluice to make
  or remove a branch it lands on (104, 105). sluice may not make a
  branch at a revision no branch it lands on holds, nor remove one whose
  work has not landed into another (105).
- 1 stands: a session never asks.
- The forge's rules for a branch on a forge (C.4 pushed refs): creation
  and deletion are restricted as updates are, with sluice's identity
  the only bypass.
- The site: `sluice branch` in the command reference, and the GitHub
  guide's bolts on GitHub using it.
