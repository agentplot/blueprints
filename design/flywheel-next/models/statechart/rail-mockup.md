# The rail — mockup for iteration

The rail at one moment, every decision kind shown once. The tree is
the page; the chat shows the same decisions compressed to one line
each with the same numbers, and a link to the page. Numbers are given
once per flywheel and never reused, so a reply names a decision
without a snapshot of the rail. The page is served on the operator's
private network and works on a phone.

```
PLAN · willdan · 2026-09-04 07:40 · 10 decisions · "yes all" answers 412-417
│
├─ APPROVE            yes is safe · nothing starts without it · "yes all" takes every decision here
│  ├─ 412 intent   atlas-provider-limits           curation · 7 signals · 3 sources · 12d
│  │      elaborations: research (self-closing) · prototype (standing)
│  │      challenges claim providers/one-writer @v3
│  │      → yes · drop · split
│  ├─ 413 unit     atlas · status-writer            → bolt rail-decisions (open) · after: none
│  │      covers one-writer sc.1,2 · completes it · type default
│  │      yes starts: spec → build ×2 → review → merge · no further response until the close
│  │      → yes · drop · redo: <notes> · bolt <name> · new bolt <name>
│  ├─ 414 unit     atlas · retry-jitter             → new bolt atlas-retry-behaviour-and-jitter-limits
│  │      routed from ask "retries hammer the provider" · no intent · type fast
│  │      → yes · drop · rename <name> · bolt rail-decisions
│  ├─ 415 chores   atlas · 3                        a stale AGENTS.md · b citation fix · c rename ref
│  │      → yes · pick a c · no
│  ├─ 416 land     switchboard/plan-rows                 4 units merged · gates green
│  │      → yes · hold
│  └─ 417 baseline new-repo                         11 claims unmet · 8 chores · 3 units
│         → yes · pick · later
│
├─ DECIDE             a choice · no default · not touched by "yes all"
│  ├─ 418 close    intent loop-granularity          all 4 elaborations done
│  │      → close · keep open
│  ├─ 419 idle     prototype rail-derivation        standing · idle 14h · intent atlas-provider-limits
│  │      → finish · keep
│  └─ 420 moved    claim sessions/one-writer v3→v4  bolt rail-decisions cites v3 · 2 items in flight
│         → amend bolt · land and follow
│
├─ ANSWER             needs text · page only
│  └─ 421 blocked  wi-#418 build · rail-decisions        "should Ready imply Backlog cleared?"
│         session alive · other items of the bolt running
│         → reply on page
│
├─ ATTENTION          read · one-word answers where shown · outside the count
│  ├─ host mac-mini last seen 41m · holds wi-#418  → takeover on studio · wait
│  └─ response "yes 413" from 06:10 could not apply      unit already dropped by 05:58 edit
│
└─ SINCE 2026-09-03 18:05   what finished since the last delivery to this sink · outside the count
   ├─ merged   rail-decisions · unit decision-grouping      3 items · review passed first time
   ├─ landed   switchboard/idle-timeout            gates green · 06:52
   ├─ closed   intent host-liveness               by your response 18:10
   └─ dropped  chore atlas 2b                     by your response 18:10
```

## Reply grammar, chat or page

```
yes all          approves every APPROVE decision, nothing else
yes 412 416      approves 412 and 416
no 415           rejects 415 (all three chores)
415 pick a c     accepts chores 415a and 415c
413 redo: <notes>  sends the unit back to planning with the notes
413 bolt other   routes the unit to open bolt "other"
414 rename retry names the new bolt "retry"
418 close        419 keep        420 amend
421: <text>      answers the blocked session
takeover         answers the host decision
```

Every answer is applied once, then its decision is gone from the next
rendering. An answer that cannot be applied comes back under ATTENTION
with the reason, once. Where the chat platform offers buttons, menus
or threaded replies, the decisions carry them; the grammar above always
works beside them.

## What a yes starts

A yes is the last response the machinery needs until the next decision
that is the operator's. Decision 413 shows it: spec, two builds, review,
merges, all by the machinery, and the next decision about that work is the
bolt's close. The operator never nudges a stage.

## Where construction goes

A unit decision always names its bolt. The planning session picks an open
bolt when the work belongs with what the bolt already holds (413),
otherwise a new bolt with a proposed name (414). The operator's response
on the decision can rename the bolt, move the unit to another open bolt, or
give it a new bolt. Work reaches a bolt without an intent when the
operator dictates it (no decision) or when planning routes an ask, finding
or signal there (414).

## The unit document

A unit is reviewed whole, on its own surface: the proposal document
with the operator's annotations. The decision is the summary and the place
to answer. "Redo" with notes sends it back to planning; an annotation
left on the document is the response on it.

## What is on the rail

- one decision per decision that is the operator's to make right now
- the weight behind a decision (signals, units, items) as a short tail
- where the work goes (the bolt) and what a yes starts
- a place to answer, on the decision
- outside the count: attention items, and what finished since the last
  rendering the operator received

## What is not on the rail

- work in progress with no decision pending (the status view)
- signals, moves, or anything already answered
- machinery problems (the run report), except a response that could not apply
- a decision that was answered and re-derived: an approval never re-asks
- more than one decision per intent awaiting approval (requirement 19)
- a decision for a session that is working (requirement 66); a blocked
  session is not working, and its question is a decision

## Counting

- the count is the decisions that take a response: APPROVE, DECIDE, ANSWER
- ATTENTION and SINCE sit outside the count
- "yes all" takes every APPROVE decision, including a landing and a baseline
- a chore group lists its items; the count on chat is the decision, not the
  items
