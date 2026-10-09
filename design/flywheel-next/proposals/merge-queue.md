# Merges through a queue

Sessions never merge (43), and the machinery merges one item at a time
(38). Nothing yet says what is tested before a merge. Today an item is
gated on its own rebased tree, two items finishing together race for the
line, the loser gates again, and what lands is verified afterwards. The
sluice statement (`design/sluice/requirements.md`) states a queue that
tests every merge in the combination it lands in and blames one item for
a failure; ADR 0002 of agentplot/sluice records the decision, and names
clauses 31, 38 and 39 here as the ones to rewrite. 179 joins them,
because sluice lands a merge commit that keeps an item's commits.

## Order is decided at merging, never at starting

### The problem

31 starts a unit only when its dependencies are merged. With merges
gated on the combination they land in, the dependency is honoured where
it matters, at merging, and holding a unit back from starting costs the
whole wait for nothing.

### The ruling

> 31. Within a bolt a unit may depend on other units of the same bolt.
>     A unit starts as soon as it is approved, from its dependencies'
>     work as it stands when one has not merged, and never merges before
>     a unit it depends on. The proposal states the dependencies and the
>     operator's response may change them.

## A merge is tested in the combination it lands in

### The problem

38 fixes that merges happen one at a time and in a fixed order, which
ends nothing but the race: each item is still judged alone, against a
line that others are about to move.

### The ruling

> 38. Several work items may be in flight at once. A finished item is
>     offered to its bolt's line and merges only after the line,
>     extended by every item offered ahead of it and by it, passes the
>     line's gate. A failure of that combination is told to the one item
>     at fault and to no other, and the items behind it are judged again
>     without it.

## The close is the word; the landing follows on green

### The problem

39 lands a bolt when the operator closes it. With the shared line
queued like a bolt's, the close is better read as the operator's word
admitting the bolt to the shared line's queue. The landing then follows
when the bolt's combination passes, and a fix after a failed landing
should not need the operator again.

### The ruling

> 39. A bolt is offered to the shared line once, when the operator
>     closes it, and only if every unit is finished; the close is
>     proposed on the rail when that holds. The bolt lands when the
>     shared line, extended by it and by everything offered ahead of it,
>     passes the shared line's gate, with no second word, and a fix
>     after a failed landing is offered again with no new word.

## An item's merge keeps its commits

### The problem

179 makes an item's merge into its bolt line a squash by default. The
queue lands a merge commit whose first parent is the line, whose second
is the item's work, and which names the verdict it merged on, so the
item's commits stay reachable and the line's first-parent history is one
commit per merge.

### The ruling

> 179. The history of an open line is never rewritten. Every take is a
>      merge (50), and an item's merge into its bolt line is one commit
>      that names the item and the verdict it merged on and keeps the
>      item's commits. A place is rebased onto its line only while no
>      session is working in it (51, 52). The landing's shape is the
>      repository's: a merge commit when direct, the repository's merge
>      setting when pull-request.

## Givens

Added under the rest of the stack:

> - Merges into a bolt's line and landings onto the shared line go
>   through sluice: the machinery's merge effect is a submission to it,
>   and the verdicts it reads are evidence on the item or the bolt.

## What it changes elsewhere

- 40 stands: a failed landing is reported and leaves the bolt open,
  and 39's fix is offered again with no new word.
- 52's retry bound stays the machinery's; sluice bounds no
  resubmission (sluice 54).
- 175's pull-request policy is untouched; a repository whose landing is
  a pull request lands through its own gates, and sluice's shared-line
  queue serves direct landings.
- A scenario: two items of one bolt finish together; the second's
  combination fails; only the second's session is told, the first
  merges, and the second is offered again after its fix.
- A scenario: a unit starts before the unit it depends on has merged,
  finishes first, and merges only after its dependency.
