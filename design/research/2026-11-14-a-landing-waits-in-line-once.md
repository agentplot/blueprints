# A landing waits in line once

On 2026-11-12 and 2026-11-13, Willdan's switchboard-kit drive lost most of
its hours to waiting in line for the long tests. This page asks why, and
how the merge queue and the flow around it should change. It weighs the
flow against sluice's statement (`design/sluice/requirements.md`, cited
by bare clause number), crew's record 0014 and flume's base place. It
covers sluice, flume and crew, and records the talk with the operator
on 2026-11-14 that carried on agentplot-design's of 2026-11-13.

## What went wrong

One piece of the accounts bolt,
`a-deploy-that-needs-more-than-the-guardrails-becomes-a-request`, took five hours on the night of
2026-11-12, from 20:40 to 01:44. Coding and merging took about an hour
and a half. The rest was waiting:

- The bolt took main in at 21:13 and borrowed the piece's own agent to
  do it, so the piece sat idle until 00:29.
- Three sibling pieces edited the same five files, and the piece
  resolved against each one as it merged, each time going back through
  its tests and to the end of the line.
- Its last lap waited an hour for one of the gate box's three test
  slots.

At the bolt's end the same loop ran again, bigger. Every unit was done,
main was merged in, and the landing's tests ran. A failure sent an
agent to fix it, the fix needed main again, and the long tests ran
again. Some landings took several tries.

Some of those tries failed for sluice's own reasons, not the code's.
The same week sluice wrote a green round's 117 checks failed and
blamed a submission (signal `2026-11-11-wldn-ops-be858325/01`). It wrote
a finished passing run as timed out when the lead changed hosts
(`2026-11-13-agentplot-ops-f42e2e42/01`), and it failed runs no host had
claimed, blaming the tip (`2026-11-13-agentplot-planner-74fcda5d/01`). A
reading of how many tries were real failures is asked of Willdan's
drive. It goes here when it comes.

## How the line works today

sluice's queue for a branch is a chain of candidates. Each candidate is
the branch's revision extended by every entry ahead and its own entry,
the revision that entry would land as (10). Candidates are tested up to
a window that grows while they pass and shrinks when one fails (13). A
conflict is found when a candidate is formed, before any check runs,
and drops only its own entry (12). A verdict reads only the checks the
candidate can change (15, 36), and a check whose key already holds a
trusted pass is not run again (15, 69). A failed candidate is blamed on
the newest entry of the first failed candidate (17).

So the line already speculates, already tests only what changed, and
already reuses passes. On paper, a candidate at the front of the line
is the exact revision that will land.

## Where a turn in line is not the best shot

The operator's question: does waiting in line give an entry the best
chance of passing when its turn comes? Today it does not, for five
reasons.

1. **The slow checks run on candidates that would fail the fast ones.**
   A candidate's checks start together, so a lint or type error can
   hold a long slot until the gate reads the whole run.
2. **One entry's failure throws away every candidate stacked on it.**
   Each candidate behind the culprit held its entries plus the
   culprit's, so all of them form again and run again (10, 17).
3. **A bolt's slow tests run twice for every try.** The bolt is proven
   on its own head, then its candidate on main runs the same slow checks
   again. The two trees differ wherever main moved, so no key carries
   over.
4. **A fix goes to the back of the line.** Its new submission waits
   behind every entry submitted since, and by its turn main has moved
   further.
5. **The long tests are one check.** An end-to-end check whose inputs
   are the whole tree has a new key after any change. Affected checks
   and reused passes help it only when it is split into checks with
   narrow inputs.

On top of those five, sluice's own false failures cost full laps (the
rebuild ends them), and one busy repository held every slot of the
gate box (record 0123 ends that).

## The flow

```
build          the agent tests its own code as it writes it:
               sluice exec --affected, the long tests among them
               where its change reaches them
while building sluice reports each place's base as it moves;
               a clean update is taken in at the agent's next pause,
               with no work of the agent's;
               a forecast conflict reaches the agent at once
piece → bolt   the bolt's gate: the fast checks
bolt proven    every piece merged, the fast checks green at its head,
               its changes in an answered batch
bolt → main    main's gate: every check, run once on the candidate
               the bolt lands as; while it waits, its fast checks run
               on that candidate; it takes a slow slot only once they
               pass
a failure      a run with no outcome runs again where it stands;
               a real failure's fix keeps its place, and runs only
               the checks whose keys it changed
```

### Two tiers, by each branch's gate

A piece merges into its bolt under the fast checks: format, lint,
types and unit tests. The bolt lands on main under every check. Each
is the branch's own gate in its policy, so the tiers need no new
mechanism in sluice. The agent still runs the tests its code reaches,
the slow ones included, with `sluice exec --affected` in its place.
The tiers only decide what the line waits for.

### The bolt's slow run is its candidate on main

A bolt is proven without its slow checks: every piece merged, the fast
checks green at its head and its changes in a batch the user answered
(crew record 0014, D6). Its slow checks run once, in main's line, on
the candidate it would land as. Nothing runs them on the bolt's own
head beforehand, so a try costs one slow run and not two.

### A candidate qualifies before it takes a slow slot

While an entry waits, its fast checks run on the candidate it would
land as, from the host's spare runs. A candidate takes a slow slot only
once its fast checks pass. Their passes are keyed, so the slow run
reads them and does not run them again (15). A slow slot is then spent
only on a candidate that already passes everything cheap.

### Every branch stays current while it is built

sluice already forecasts a head against its base and the entries
ahead (64), and flume's base place forecasts its branch against main
at each settle. Two things change:

- A clean update is taken in at the agent's next pause, with no work
  of the agent's. A piece then never drifts far from its bolt, nor a
  bolt from main.
- A forecast conflict reaches the agent at once, not when it is idle.
  On the night above the agent coded on for 90 minutes past a conflict
  already found.

A bolt then reaches main already current. Its candidate is close to
the tree its pieces were built on, and the one slow run tests little
that is new.

### A failure costs a fix, not a lap

A run with no outcome is not a failure (114). It runs again where it
stands, blames nobody, and moves no entry to the back. A real failure
is fixed and the fix keeps the entry's place, so it does not wait
behind work submitted while it was being fixed. Its candidate runs only
the checks whose keys the fix changed (15).

### The long tests have narrow inputs

Affected checks and kept passes are worth what the checks' inputs
allow. Each repository splits its long tests by area, each a check of
its own whose inputs are the parts it exercises. A change to the
console then reruns the console's flows and not the deploy flows. This is
each repository's work in its own task runner, switchboard-kit's first.

## Where each part goes

| Part | Tool | Where |
|---|---|---|
| Two tiers by each branch's gate | each repository's policy, and the guide | sluice's guide; switchboard-kit's policy |
| A bolt is proven on the fast tier | crew | record 0014, D6, and the base place's proof |
| A candidate qualifies before a slow slot | sluice | the rebuild, beside its chain (10 to 18) |
| A clean update at the next pause, a conflict at once | flume, crew | flume's change and base place kinds; crew record 0014, D2 and D3 |
| A no-outcome run runs again in place; a fix keeps its place | sluice | the run-life unit |
| Narrow inputs for the long tests | each repository | switchboard-kit's task runner |
| The false failures | sluice | the rebuild and the run-life unit |

## What the talk settled

- Merging is inevitable. Pieces that touch the same files still build
  at the same time, as record 0014 has it (D3), and overlap only orders
  their merging. The flow makes each merge small and early, and does not
  plan overlap away.
- Agents run the tests for the code they write, with
  `sluice exec --affected`, the slow ones included.
- A merge into a bolt runs the fast checks, and a bolt's landing on
  main runs the slow ones.
- sluice reports each base as it moves, so agents take it in ahead of
  their merge.

## Still open

- How many of switchboard-kit's landing tries failed for real, and how
  many for sluice's own reasons. Willdan's drive is asked.
- Whether a fix that keeps its place still has later entries stacked on
  it while it is unproven, or whether they are tested without it until
  it passes. The first keeps candidates as they stand (10). The second wastes
  fewer runs, but changes what a candidate holds.
- What a "pause" is for a clean update taken in under a working agent:
  the end of its turn, or the end of its stage.
- How large a bolt should be. A day of work is the planner's working
  rule.
