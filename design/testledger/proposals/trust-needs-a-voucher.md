# Trust needs a voucher

A gate trusts executors. For that to mean anything, a record has to
count as an executor's only when someone the gate's policy names vouches
that the executor wrote it. Two smaller rulings travel with it: a replay
is not a run, and an error is not a verdict.

## A record is an executor's only when vouched for

### The problem

A record from an executor the gate does not trust never satisfies that
gate (19). A reader can establish who wrote a record, or that it cannot
(11), and a record whose signature fails is read as vouched for by
nobody (36). Nothing joins these. No clause says that being vouched for
by nobody has any effect on trust.

A record states its own executor and its own confinement. A shell that
writes "the build server, confined" into a record has written a record
that, by the clauses alone, a version gate may count. The rules narrow
it to "a gate that must be sure", which nobody can check a model
against.

### What the statement already settles

Trust is the reader's, decided at reading, under its policy (14). A
writer never marks a record trusted. So the place for this is the
policy: what a gate requires before it takes a record's word for who
wrote it.

### The ruling

> 19a. A record counts as written by an executor only when an identity
>      the gate's policy names vouches that it was. A policy that admits
>      records nobody vouches for says so for that gate, by name, and a
>      later layer never adds that admission (20).

The policy entry in the glossary gains "and who must vouch for each".
testledger's rule ledger.15 then reads without "a gate that must be
sure": a gate reads a result's outcome, executor and confinement from
its verified signed layer unless its policy admits unvouched records.

## A replay is not a run

### The problem

A record's outcome is what the executor observed (9). The invocation a
workspace description gives is the one the repository's own tooling
uses, and that tooling answers from a cache of its own when it has one.
An executor that sees a zero exit from a replay has observed a zero
exit. The record then says this executor ran the check and it passed,
when the pass was proven earlier, by some other executor, under the
tool's own idea of what the inputs are.

That launders trust. A pass an open shell left in a tool's cache is
replayed, recorded again, and filed under whichever executor asked.

### The ruling

> 9a. An executor reports a pass only for a check it executed. A result
>     a tool answered from an earlier run is not a run, and is never
>     recorded as one.

How an executor ensures it, by turning a tool's output cache off or by
giving the run nothing to replay from, is the profile's.

## An error is not a verdict

### The problem

An outcome is a pass, a fail or an error (glossary). A verdict gives
each required check exactly one of passed, failed, missing or flaky
(18). A key holding only an error has no reading, and neither has a key
holding a pass and an error.

### The ruling

> 18. A verdict states, for every check the policy requires, exactly one
>     of passed, failed, missing or flaky, and is satisfied only when
>     every required check passed. An error is read as missing, and
>     never makes a key flaky.

## What it changes elsewhere

- S4 already shows an untrusted pass listed and read as missing. A
  scenario beside it shows an unvouched record claiming a trusted
  executor read the same way.
- A consumer whose merge gate takes an agent's shell at its word keeps
  doing so, by a line in its policy. Its version gate needs no line.
