# Could not run: a run that did not judge its check has no outcome

Drafted clauses that tell a check that failed apart from a run that
never judged its check: the program could not start, the check said it
could not run where it was, or the host stopped holding what the
repository declares its checks need. Such a run has no outcome (60). It
is recorded with its reason and never under its key, and the check runs
again. Part A gains three clauses, 114 to 116, and the glossary's
*check* and clause 84 are amended. Part C gains two policy settings and
a set-aside record. The operator ratified it on 2026-10-20: its
clauses, rows and scenarios are in `../requirements.md`, which wins
where they differ.

## What it answers

The statement gives a check two endings, a pass or a fail, and reads
every result under a key across every run (69). When a key holds both,
the policy says how the key reads (19), and a shared branch's policy
reads it as not passed.

A run can end in a fail that says nothing of the check. The host's
container engine is stopped, a launch stalls past a test's own timeout,
or the program never starts. That fail is recorded under the key as the
check's own. Every later pass then makes the key hold both outcomes, so
on a shared branch the key never reads passed again for as long as its
inputs stay the same.

The executor has no way to tell sluice what it saw, and the repository
has no way to say what its checks need. sluice cannot know either for
it: one repository's checks need a container engine, another's a
database, a GPU or a licence server.

Clause 60 already has the ending such a run needs: no outcome, never
read as a pass or a fail, and the check run again. What is missing is
the rest of it:
- the ways a run comes to have no outcome, besides an executor that
  stopped before reporting;
- a way for the repository to declare what its host must hold, and for
  a check to say it could not run;
- a bound on how often a candidate runs again;
- a way for the operator to correct a fail already recorded whose cause
  nobody declared.

## The shape

The repository declares two things in its policy, and sluice names
neither: a command that shows the host can run its checks (`ready`),
and the exits by which a check says it could not run here (`not_run`).
This follows the convention test harnesses use, where an exit of 77
means skipped and 99 means a hard error.

The executor runs the readiness command:
- **Before a run:** a host that fails it is refused the run (84), so
  nothing is recorded and the candidate waits.
- **After a run:** a host that fails it means every check of that run
  that did not pass has no outcome. Its passes stand.

A check that cannot be started, or that exits with a code `not_run`
names, has no outcome too.

A run with no outcome is recorded with why (16), but never under its
key, so the key reads only what the checks observed. No entry is
blamed for it (18). The check runs again, up to a bound the deployment
states, after which the candidate reads not passed as a run its time
limit ended does (66).

For a fault nobody declared, the operator sets the recorded run aside
with a reason. The run's record stays, and a later record says it was
set aside. A gate reads a run set aside as having no outcome.

## Vocabulary

- **check**, amended: a task run to judge a revision, ending in a pass,
  a fail, or no outcome when the run did not judge it (60, 114).
- **set aside**: an operator's record that a recorded run did not judge
  its check, with the reason.

## No outcome

### The problem

A run's fail is recorded under its key whatever caused it, so a host's
fault becomes the check's, and on a shared branch it holds the key at
not passed for good (19, 69).

### What the statement already settles

- An outcome is what the executor observed, never inferred (38).
- A run whose executor stopped before reporting has no outcome, is
  never read as a pass or a fail, and is run again (60).
- An executor that cannot enforce a limit refuses the run rather than
  run it without the limit (84).
- A run over its time limit is read as failed (66).

### The ruling

> 114. A run of a check has no outcome (60) when the check could not be
> started; when it ended with an exit its branch's policy names as not
> run; or, for a check that did not pass, when the host failed after the
> run the readiness the repository declares. Its record says why (16).
> It is never recorded or read under its key, no entry is attributed for
> it (18), and the check is run again.

The three cases are the only ones an executor can tell without knowing
the repository:
- A program that never started observed nothing.
- An exit the policy names is the check's own word that it could not
  run where it was.
- Readiness that fails after the run means the host stopped holding
  what the checks need while they ran. Only a pass is kept from such a
  run, since a pass under a failing host is still a pass.

> 84, amended. The guarantee: an executor that cannot enforce a limit
> the branch's policy states, or whose host fails the readiness the
> repository declares, refuses the run rather than run it without them,
> and every run is recorded with what its executor enforced (16), so a
> run is never read as confined, or as held to a limit, unless its
> executor enforced it (28, 29).

The readiness command is the repository's, read with the gate from the
branch's current revision (27, 56), and run under the run's executor
and limits, so it sees the host as the checks will. A run that was
refused started nothing and records nothing. Its candidate waits as one
waiting for room does (71).

> 115. A candidate whose checks could not run (114) in as many of its
> runs in a row as the deployment states is read as not passed, as one
> whose run its time limit ended is (66), and the culprit's session is
> told each check that could not run, and why (20).

Without a bound, a check that always says it could not run, on a host
whose readiness passes, would run forever. The bound holds the queue to
the same end a stalled run comes to. A run whose executor stopped
before reporting (60) is not counted: that is the executor's failure,
not the check's.

## Set aside

### The problem

A fault that neither the readiness command nor the check declares, such
as a launch stall on the host, still records a fail. The operator who
finds the cause has no way to say so, and records are never removed.

### The ruling

> 116. An operator may set aside a recorded run, naming it and the
> reason, by a record of its own. The run's record is kept. A run set
> aside has no outcome (60) and is read under no key, from the set-aside
> on. No session sets aside a run, and a set-aside counts for a gate
> only when the gate trusts its signer (28).

Setting a run aside is a ruling about evidence. It is the operator's to
make, like the policy's reading of a flaky key (19, the actors table).
A session that could set aside its own fails could land past any check.

## Part C, rows

C.2, the check: the moon profile reads each task's exit code from the
run report (the row already names it), and a task whose exit `not_run`
names has no outcome. The script profile reads the command's exit the
same way.

C.6, the records: a set-aside is one JSON document per line in a log of
its own beside the results log. It names the run by its key, its system
and the time it was recorded, and gives the reason, who set it aside,
and when. A reader of the results log alone is unchanged. On a signer's
ref, a set-aside is a statement signed as a run record is.

C.7, policy, under `[tests]`:

```toml
[tests]
runner = "moon"
# The host can run these checks: run before and after each run of them,
# under the run's executor.
ready = ["docker", "info"]
# Exits by which a check says it could not run here.
not_run = [77]
```

## Scenarios

- **S43.** The repository's readiness command fails partway through a
  session's run of its checks. The run's fails are not recorded and its
  passes are. A later run of the same head passes, and its keys read
  passed.
- **S44.** A shared branch's key holds a fail a stalled host produced
  and a later pass. The operator sets the fail aside, with the reason.
  The key reads passed from its passes, and the fail's record is still
  there to read.

## What it changes elsewhere

- The glossary's *check*, and clause 84, as above.
- C.7 gains `ready` and `not_run` under `[tests]`.
- The non-goal "Deciding policy" is unchanged: what readiness means and
  which exits mean "could not run" is the policy author's to decide.
