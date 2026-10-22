# Landing handoff: what a tool after the landing reads of sluice

These are drafted clauses that let a tool downstream of sluice, tailrace
first, learn of a landing and carry the landing's verdicts onward, with
sluice unchanged in what it decides. tailrace publishes only a landed
revision (tailrace 14) and attaches sluice's signed verdicts to what it
publishes as sluice made them (tailrace 12, 13); it needs to read, from
any host that may run a publish, which revisions a branch landed, when,
and the signed run records that landed each. Parts A and B gain three
clauses, 120 to 122. Part C gains a reader in C.5 and a row in C.6. No
clause lets sluice start anything after a landing: the handoff is a
read, and whoever runs the tool after it turns the wheel.

## What it answers

| question | answered by |
|---|---|
| how a tool learns a branch landed a revision | 120: the landing record is readable by revision, by any host that may submit to the branch |
| what a landing record says | 120: the revision, the candidate it was tested as, the entries it landed, the time, and where its runs are |
| how the verdicts travel | 121: the signed run records of the landing's candidate are readable as signed, by the landed revision |
| a one-host branch, whose runs are unsigned | 122: a host with a signing identity signs its own runs on such a branch too, so a verdict exists to carry; without one there is no verdict to carry, and the downstream tool says so |
| whether sluice runs anything after a landing | nothing changes: 10 stands, and no hook is added |
| what it costs a session | nothing: 1 stands; a session never asks |

## The shape

```
 sluice lands revision R on main (23)
        |
        v
 the landing record for R: candidate, entries, time, runs (120)
        |
        v
 tailrace, or any tool, asks: landed main R?  -> yes, the record
                              verdicts R?     -> the signed run records, as signed (121)
        |
        v
 tailrace publishes R, carrying each record inside its own claim
 (tailrace 12); sluice has done nothing further
```

## The clauses

### Landings as records

120. Every landing is readable, by the branch and the revision it
     landed, from every host that may submit to the branch: the
     revision, the candidate whose tree it carries (23), the entries it
     landed, when, and where the runs that decided it are. A landing
     the records do not hold did not happen.

121. The run records that decided a landing are readable by the landed
     revision, each as its signer recorded it (C.6): signature,
     subject, outcome and claims unchanged, so a reader verifies each
     against the signer its own policy names and never against
     sluice's word that it was verified.

122. On a branch in one host's own files, an instance with a signing
     identity signs its own run records as it would on a signer's ref,
     so a landing on such a branch carries verdicts a downstream reader
     can count; an instance with none records unsigned runs as today,
     and a reader finds no signed verdict and says so (tailrace S13).

### Part C

C.5 gains a reader: `sluice landings <branch> [--json]` lists a branch's
landings, newest first, each with 120's fields; `sluice landing
<revision> [--json]` gives one; `sluice verdicts <revision> [--json]`
prints the signed run records of 121 as DSSE envelopes, one per line,
and nothing for an unsigned run.

C.6 gains a row: the landing records are the `landed` lines of the
branch's log on local files, and on remote refs the branch's state
documents, each naming the candidate's `refs/sluice/combinations/<branch>/<id>`
and each signer's `refs/sluice/runs/<signer>` entries for it. A read
needs no process running (26).

## What it does not propose

- A command sluice runs after a landing. The core starts no service and
  runs only checks (10); a tool after the landing is driven by whoever
  drives it: a watcher of the log, a plan's step, a person. A hook
  would make sluice the thing that publishes, and 1 and 23 say what
  sluice does: it lands.
- A change to what a run record says. tailrace joins sluice's subject,
  the task's key with moon's hash as its digest, to the provenance it
  writes for the same hash; nothing in the record changes for that.
