# Conflict forecast

A conflict is found today only when a candidate is formed (12), which
is after the entry's session has finished and submitted. When units
build side by side (flywheel-next proposal `concurrent-units.md`, 330;
crew's change `concurrent-units`), two of them that edit the same
content find out after both are built, when the conflict is at its
largest. sluice already holds what a forecast needs: the line, the
entries in their order, and the forming of a candidate.

## The rulings

> 64. sluice forms, for a head not yet submitted, the candidate it would
>     form were the head submitted now, against the line and the entries
>     ahead of it, and reports a conflict so found to the head's
>     session. A forecast creates no entry, changes no order and moves
>     no line, and its result is never read as a verdict.

> 65. A conflict reported to a session, forecast or found at forming,
>     names the content contested and every entry it is contested with,
>     with what each of those entries submitted.

A new operation of the driver, beside 47:

> 47a. **forecast**: given a head, a line and its after-entries, the
>      conflicts the head would meet if submitted now, each with the
>      entries it meets (64, 65).

## Part C

| driver profile | forecast |
|---|---|
| **worktrunk** | `wt submit --forecast`, the same forming as a submission with no entry written |
| **crew** | the conductor's wait runs a forecast for each unit in code, and tells the unit's agent of a conflict when it is idle |
| **flywheel** | a forecast is evidence on the item, read each tick |

## What it changes elsewhere

- S16. Two sessions build heads that edit one file. The second asks for
  a forecast before it has finished; it is told the file and the first
  entry's work, settles it, and both candidates form without conflict.
