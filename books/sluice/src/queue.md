# The queue

A branch has one queue. A session submits a head to it and is done (1).
sluice orders the entries, forms each one's candidate and tests the
candidates ahead of need. When a candidate fails it names the one entry
at fault, and it moves the branch only to a candidate that passed (22). This
chapter is the queue from submission to landing. The gate that judges a
candidate is the next chapter.

## A submission

A submission is one head offered to one branch, with the entries it
must land after, its priority and who submitted it (3). It never names a
position: where it lands is the queue's to decide. The head comes from a
place whose tree is exactly its commits; a place holding anything more
is refused by the driver, which names what it holds (2).

Once submitted, the head is an entry. An entry leaves the queue in
three ways only (5): it lands; its submitter, its planner or the
operator withdraws it; or a bound the branch's policy stated in advance
removes it. sluice drops nothing on its own. A second submission from the
same place to the same branch withdraws the first, which stays readable
as withdrawn (67).

## Order

Entries are ordered by priority, then by the order of submission (6).
Priority moves only entries that are not under test: an entry whose
candidate is being tested is never displaced by one submitted after it.
An entry never lands before an entry it names as after, and while its
after-entries are neither landed nor ahead of it, it waits without
holding anyone else (7).

Every entry of a branch is in the branch's one chain, tested with the
entries ahead of it and landed in chain order (8).

## Candidates

A candidate is the branch's current revision extended, in order, by
every entry ahead and the entry itself: the revision that entry would
land as (10). It contains nothing behind it and nothing removed from
the chain. An entry is judged as a candidate and in no other way:
never alone against a revision the branch has left, and never in a
combination it would not land in (11).

Three entries A, B and C submitted to one branch give a chain of three
candidates:

```
branch + A
branch + A + B
branch + A + B + C
```

A conflict is found when a candidate is formed, before any check runs,
and removes the entry from the chain and nothing else; the chain
continues without it (12). The session hears what content is contested
and with which entries ahead (65). It can ask the same question before
submitting: a forecast forms the candidate the head would get now and
reports the conflicts it would meet (64). A forecast creates no entry
and moves nothing.

## The window

The chain is tested up to the branch's window: how many candidates are
under test at once (13). With a window of four, all three candidates
above are tested together, on the bet that they pass. The window never
falls below one, grows while candidates pass and shrinks when one
fails, within the bounds the branch's policy sets. An instance of sluice
starts no more checks at once than its own bound, whatever the windows
of the branches it serves (71).

The policy also says whether every candidate of a chain is tested or
only the deepest first (14). Testing the deepest first costs one run
for the whole chain when it passes; when it fails, the skipped
candidates are tested before anyone is blamed.

## Blame

A failed candidate is attributed to exactly one entry: the newest entry
of the first failed candidate in its chain (17). No entry is attributed
or landed before every candidate ahead of it has a verdict (18). So
when `branch + A + B` fails and `branch + A` passed, B is the culprit,
A lands, and C is formed again as `branch + A + C` (21).

Only the culprit's session is told, with the failing checks and the
candidate they failed on; no other session hears of that failure (20).
sluice never limits how often a session submits again after its entry
was removed (54). The entry's state shows how many times its place's
work was submitted, and acting on that count is the driver's or the
planner's.

## Landing

A branch moves only to a candidate whose verdict is satisfied, only in
chain order, never past an entry without a verdict, and never to a
candidate holding a culprit or a conflict (22). Each landing writes one
commit per entry, with the revision before it as first parent and the
entry's head as second, naming the entry's work and the verdict it
landed on (23). The branch's history is never rewritten, and a session's
commits stay reachable from the branch they landed on.

A landing moves the branch from exactly the revision its candidate was
formed on. A landing that finds the branch elsewhere is refused, and
the chain is formed again on the revision found (24). The candidate's
place is released once its verdict is read; a session's own place is
never released by sluice (25).

The session learns its entry landed through its driver (50). From then
on the entry, its state and every verdict read for it stay readable
from every host that submits to the branch, whether or not sluice is
running (26).

## Across branches

Entries of one branch are ordered with each other whichever host
submitted them (57). At most one instance of sluice advances a branch
at any moment (58). An instance that stopped loses nothing: entries
submitted meanwhile are held, and whatever next advances the branch
resumes from the records as last written (59). How instances on
several hosts share a branch is the many hosts chapter.
