# The plan — mockup for iteration

One rendering of the plan at one moment, every row kind shown once.
The tree is the page; the chat shows the same rows compressed to one
line each with the same numbers, and a link to the page. The page is
served on the operator's private network and works on a phone.

```
PLAN · willdan · 2026-09-04 07:40 · 10 rows · "yes all" answers 1-6
│
├─ APPROVE            yes is safe · nothing starts without it · "yes all" takes every row here
│  ├─ 1  intent   atlas-provider-limits           curation · 7 signals · 3 sources · 12d
│  │      elaborations: research (self-closing) · prototype (standing)
│  │      challenges claim providers/one-writer @v3
│  │      → yes · drop · split
│  ├─ 2  unit     atlas · status-writer            → bolt plan-rows (open) · after: none
│  │      covers one-writer sc.1,2 · completes it · type default
│  │      yes starts: spec → build ×2 → review → merge · no further word until the close
│  │      → yes · drop · redo: <notes> · bolt <name> · new bolt <name>
│  ├─ 3  unit     atlas · retry-jitter             → new bolt atlas-retry-behaviour-and-jitter-limits
│  │      routed from ask "retries hammer the provider" · no intent · type fast
│  │      → yes · drop · rename <name> · bolt plan-rows
│  ├─ 4  chores   atlas · 3                        a stale AGENTS.md · b citation fix · c rename ref
│  │      → yes · pick a c · no
│  ├─ 5  land     switchboard/plan-rows            4 units merged · gates green
│  │      → yes · hold
│  └─ 6  baseline new-repo                         11 claims unmet · 8 chores · 3 units
│         → yes · pick · later
│
├─ DECIDE             a choice · no default · not touched by "yes all"
│  ├─ 7  close    intent loop-granularity          all 4 elaborations done
│  │      → close · keep open
│  ├─ 8  idle     prototype plan-derivation        standing · idle 14h · intent atlas-provider-limits
│  │      → finish · keep
│  └─ 9  moved    claim sessions/one-writer v3→v4  bolt plan-rows cites v3 · 2 items in flight
│         → amend bolt · land and follow
│
├─ ANSWER             needs words · page only
│  └─ 10 blocked  wi-#418 build · plan-rows        "should Ready imply Backlog cleared?"
│         session alive · other items of the bolt running
│         → reply on page
│
├─ ATTENTION          read · one-word answers where shown · outside the count
│  ├─ host mac-mini last seen 41m · holds wi-#418  → takeover on studio · wait
│  └─ word "yes 2" from 06:10 could not apply      unit already dropped by 05:58 edit
│
└─ SINCE 2026-09-03 18:05   what finished after the last rendering you received · outside the count
   ├─ merged   plan-rows · unit row-grouping      3 items · review passed first time
   ├─ landed   switchboard/idle-timeout            gates green · 06:52
   ├─ closed   intent host-liveness               by your word 18:10
   └─ dropped  chore atlas 2b                     by your word 18:10
```

## Reply grammar, chat or page

```
yes all          approves every APPROVE row, nothing else
yes 1 5          approves rows 1 and 5
no 4             rejects row 4 (all three chores)
4 pick a c       accepts chores 4a and 4c
2 redo: <notes>  sends the unit back to planning with the notes
2 bolt other     routes the unit to open bolt "other"
3 rename retry   names the new bolt "retry"
7 close          8 keep          9 amend
10: <text>       answers the blocked session
takeover         answers the host row
```

Every answer is applied once, then its row is gone from the next
rendering. An answer that cannot be applied comes back under ATTENTION
with the reason, once. Where the chat platform offers buttons, menus
or threaded replies, the rows carry them; the grammar above always
works beside them.

## What a yes starts

A yes is the last word the machinery needs until the next decision
that is the operator's. Row 2 shows it: spec, two builds, review,
merges, all by the machinery, and the next row about that work is the
bolt's close. The operator never nudges a stage.

## Where construction goes

A unit row always names its bolt. The planning session picks an open
bolt when the work belongs with what the bolt already holds (row 2),
otherwise a new bolt with a proposed name (row 3). The operator's word
on the row can rename the bolt, move the unit to another open bolt, or
give it a new bolt. Work reaches a bolt without an intent when the
operator dictates it (no row) or when planning routes an ask, finding
or signal there (row 3).

## The unit document

A unit is reviewed whole, on its own surface: the proposal document
with the operator's annotations. The row is the summary and the place
to answer. "Redo" with notes sends it back to planning; an annotation
left on the document is the word on it.

## What is on the plan

- one row per decision that is the operator's to make right now
- the weight behind a row (signals, units, items) as a short tail
- where the work goes (the bolt) and what a yes starts
- a place to answer, on the row
- outside the count: attention items, and what finished since the last
  rendering the operator received

## What is not on the plan

- work in progress with no decision pending (the status view)
- signals, moves, or anything already answered
- machinery problems (the run report), except a word that could not apply
- a row that was answered and re-derived: an approval never re-asks
- more than one row per intent awaiting approval (requirement 18)
- a row for a session that is working (requirement 45); a blocked
  session is not working, and its question is a row

## Counting

- the count is the rows that take a word: APPROVE, DECIDE, ANSWER
- ATTENTION and SINCE sit outside the count
- "yes all" takes every APPROVE row, including a landing and a baseline
- a chore group lists its items; the count on chat is the row, not the
  items
