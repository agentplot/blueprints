# The plan — mockup for iteration

One rendering of the plan at one moment, every row kind shown once.
The tree is the page; the chat shows the same rows compressed to one
line each with the same numbers. Draft; not yet encoded in the
requirements.

```
PLAN · willdan · 2026-09-04 07:40 · 9 rows · "yes all" answers 1-5
│
├─ APPROVE            yes is safe · nothing starts without it
│  ├─ 1  intent   atlas-provider-limits           curation · 7 signals · 3 sources · 12d
│  │      elaborations: research (self-closing) · prototype (standing)
│  │      challenges claim providers/one-writer @v3
│  │      → yes · drop · split
│  ├─ 2  unit     atlas · status-writer            bolt plan-rows · covers one-writer sc.1,2 · completes it
│  │      → yes · drop · edit on page
│  ├─ 3  chores   atlas · 3                        stale AGENTS.md · citation fix · rename ref
│  │      → yes · pick 3a 3c · no
│  ├─ 4  land     switchboard/plan-rows            4 units merged · gates green
│  │      → yes · hold
│  └─ 5  baseline new-repo                         11 claims unmet · 8 chores · 3 units
│         → yes · pick · later
│
├─ DECIDE             a choice · no default · not touched by "yes all"
│  ├─ 6  close    intent loop-granularity          all 4 elaborations done
│  │      → close · keep open
│  ├─ 7  idle     prototype plan-derivation        standing · idle 14h · intent atlas-provider-limits
│  │      → finish · keep
│  └─ 8  moved    claim sessions/one-writer v3→v4  bolt plan-rows cites v3 · 2 items in flight
│         → amend bolt · land and follow
│
├─ ANSWER             needs words · page only
│  └─ 9  question wi-#418 build                    "should Ready imply Backlog cleared?"
│         → reply on page
│
└─ ATTENTION          read · one-word answers where shown
   ├─ host mac-mini last seen 41m · holds wi-#418  → takeover on studio · wait
   └─ word "yes 2" from 06:10 could not apply      unit already dropped by 05:58 edit
```

## Reply grammar, chat or page

```
yes all          approves every APPROVE row, nothing else
yes 1 4          approves rows 1 and 4
no 3             rejects row 3 (all three chores)
3 pick a c       accepts chores 3a and 3c
6 close          7 keep          8 amend
9: <text>        answers the question
takeover         answers the host row
```

Every answer is applied once, then its row is gone from the next
rendering. An answer that cannot be applied comes back under ATTENTION
with the reason, once.

## What is on the plan

- one row per decision that is the operator's to make right now
- the weight behind a row (signals, units, items) as a short tail
- a place to answer, on the row

## What is not on the plan

- work in progress with no decision pending (the status view)
- signals, moves, dropped things, or anything already answered
- machinery problems (the run report), except a word that could not apply
- a row that was answered and re-derived: an approval never re-asks
- more than one row per intent awaiting approval (requirement 13)
- a row for a session that is working (requirement 31)

## Open questions for iteration

- Should ATTENTION rows count in "9 rows", or sit outside the count?
- Should `yes all` include row 4 (land) and row 5 (baseline), or only
  rows that create no more than one session?
- Does a chore group show its three items on chat, or only the count?
- Is "edit on page" for a unit a real answer, or does the operator drop
  and let the planner re-propose?
