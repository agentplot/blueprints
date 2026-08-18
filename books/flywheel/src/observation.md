# Observation

The loop programs are deterministic: what a loop does with a given
tracker state is proven by the [verification](verification.md) stages
at build time, not watched at runtime. Runtime observation exists for
the two inputs tests cannot pin — what sessions did, and what the
tracker was made to say — and it answers the question the operator
actually asks of a running fleet: *what changed on my board, and
why?*

## The run record

Each loop run appends a machine-readable record under the fleet's
state directory (`observations/<scope>/`, one scope per milestone
plus one for dispatch), written as the loop acts:

- every tracker write — an item created, a label moved, a batch
  expanded, a closure — with its reason and the board view it lands
  in;
- every session charged, its work order, and its outcome;
- every merge, with its commit.

Facts originate in the record and nowhere else. The raw server and
loop logs continue beside it; the record is curated, the logs are
not. Because the record names a board view for every write, any card
on any view traces back to the pass that put it there.

## The run report

The report is the record rendered for the operator: what changed on
the board and why, then expected versus actual for every session,
mismatches first.

```text
bolt/observer — pass 2026-08-17T09:12
board: 1 card Ready  →  unit + 3 items In Flight

tracker write                       why                        view
milestone bolt/observer created     card #12 approved          Roadmap
#12 became the unit; #13-#15 born   expanded from the plan     In Flight
#13 stage:built                     build committed ab12f3     In Flight

session       expected                        actual
build #13     commit by pathspec on build/…   ok — ab12f3
verify #13    verify.md reads NONE            2 findings — review charged
review #13    proceed / refix / escalate      refix, round 1
```

A mismatch is not automatically a failure; the report states what
diverged and the operator judges. Rendering is deterministic; an
observer agent adds narrative on top when asked, and never adds
facts.

## Holding a loop

While the machinery is under repair, the operator holds a loop: each
pass writes the tracker writes it intends and waits for
`flywheel approve`. A wrong intention is caught by reading alone — if
the intended writes are not what the operator wants on the board, the
pass never runs. A trusted loop runs unheld; the record is written
either way.

## Findings route to reports

A session or loop that notices the machinery misbehaving says so in
its report and stops. Nothing files an issue about the flywheel into
the tracker the flywheel is driving — that boundary is
[commitment 4](commitments.md), and it is what keeps the machinery's
self-knowledge out of a target's tracker when the target is someone
else's system.

## The repair loop

Machinery fixes happen in exactly one loop: the operator holds the
loop and reads its intended writes; the pass runs; the operator reads
the run report and comments; a repair session — an ordinary
interactive session with the operator, not machinery — consumes
report and commentary and fixes the flywheel; the next run measures
the fix. A finding the operator promotes to durable knowledge is
written into this book by the design loop, the same as any other
decision.
