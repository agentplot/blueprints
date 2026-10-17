# Items and sends

An item is the unit of work: the signals curation joined, one or many.
It may be five of a meeting's ten signals, or two bumps that move
together. An item is Flywheel's proposed intent (109). millpond keeps
its signals, its brief and every place it was sent.

## How an item forms

Join, attach and route lead to items, and drop, answered and challenge
settle a signal:

<figure class="mp-fig">
<div class="mp-scroll">
<svg viewBox="0 0 720 300" role="img" aria-label="Each signal takes one move. Drop, answered and challenge settle it. Join, attach and route put it on an item of one signal or many. The inbox's settings send an item to one worktree, where an agent works from its brief on a branch named for it, or hand it to crew's planner, which turns items into chores and units across teams. sluice lands the work either way, and millpond writes a worktree's landing against the item from sluice's record.">
<defs>
<marker id="mp-it-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="mp-hd"/></marker>
<marker id="mp-it-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="mp-hd-a"/></marker>
</defs>
<rect x="8" y="104" width="140" height="70" rx="9" class="mp-bx"/>
<text x="22" y="132" class="mp-t">A signal's move</text>
<text x="22" y="152" class="mp-ts">one per signal</text>
<path d="M148,124 L176,62" class="mp-ar" marker-end="url(#mp-it-m)"/>
<path d="M148,156 L176,186" class="mp-ar-a" marker-end="url(#mp-it-a)"/>
<rect x="180" y="20" width="180" height="70" rx="9" class="mp-bx"/>
<text x="194" y="44" class="mp-t">Settled</text>
<text x="194" y="64" class="mp-ts">drop, answered,</text>
<text x="194" y="80" class="mp-ts">challenge</text>
<rect x="180" y="150" width="180" height="80" rx="9" class="mp-bx-mp"/>
<text x="194" y="176" class="mp-t">An item</text>
<text x="194" y="196" class="mp-ts">join, attach, route</text>
<text x="194" y="214" class="mp-ts">one signal or many</text>
<path d="M360,176 L380,176 L380,96 L396,96" class="mp-ar" marker-end="url(#mp-it-m)"/>
<path d="M360,204 L380,204 L380,212 L396,212" class="mp-ar" marker-end="url(#mp-it-m)"/>
<rect x="400" y="60" width="160" height="72" rx="9" class="mp-bx"/>
<text x="414" y="84" class="mp-t">One worktree</text>
<text x="414" y="104" class="mp-ts">a branch, the brief,</text>
<text x="414" y="120" class="mp-ts">and an agent</text>
<rect x="400" y="176" width="160" height="72" rx="9" class="mp-bx"/>
<text x="414" y="200" class="mp-t">crew's planner</text>
<text x="414" y="220" class="mp-ts">chores and units</text>
<text x="414" y="236" class="mp-ts">across teams</text>
<path d="M560,96 L578,96 L578,140 L592,140" class="mp-ar" marker-end="url(#mp-it-m)"/>
<path d="M560,212 L578,212 L578,168 L592,168" class="mp-ar" marker-end="url(#mp-it-m)"/>
<rect x="596" y="118" width="116" height="72" rx="9" class="mp-bx-hl"/>
<text x="610" y="146" class="mp-t">sluice</text>
<text x="610" y="166" class="mp-ts">lands the work</text>
<path d="M654,190 L654,276 L270,276 L270,234" class="mp-ar-d" marker-end="url(#mp-it-m)"/>
<text x="288" y="270" class="mp-ts">a worktree's landing, written against the item</text>
</svg>
</div>
<figcaption>Drop, answered and challenge settle a signal. Join and attach put it on an item, and a route's chore becomes an item of one. The inbox's settings send an item to one worktree or hand it to crew's planner, and sluice lands the work either way.</figcaption>
</figure>

- **`join`** makes an item from any number of signals, or grows one
  still proposed.
- **`attach`** puts a signal on an item already sent, so a late signal
  reaches the work it belongs to.
- **`route`** offers a chore, which millpond makes an item of one, or
  an ask, which millpond records and makes no item of.

Dropping a proposed item gives each of its signals a move that records
the drop, and they are not joined again unless new signals join them
(117).

## The brief

The brief is the text an item's work starts from. The curation session
writes it with the `brief` tool, and millpond keeps it on the item. An
agent sent the item finds the brief in its worktree, and the item's
signals point it to the source's own words.

## A send

millpond sends one item to one worktree:

1. It makes a worktree of the repository the send names, on a branch
   named for the item.
2. It writes the brief there.
3. It starts an agent on it: in a herdr pane through its herdr plugin,
   or as a command it prints for the operator to run.
4. The agent submits its work through sluice.
5. millpond writes the landing against the item, from sluice's record
   of that branch.

The item then shows where it went and that it landed.

## An inbox crew keeps

An inbox crew keeps sends no item to a worktree, and millpond refuses a
send from it. Its settings hand items to crew's planner, which orders
them across teams and turns each into a chore or a unit. Planning
across items is crew's today and Flywheel's later, never millpond's.

## A release, from capture to landed bump

In a repository crew runs, a bump comes only as a chore crew's planner
makes from an item (`inputs.6`). The release lands as a capture with
its own excerpt, curation routes its signal into an item, the planner
proposes the chore, and a team makes the bump, which sluice lands. The
bump moves the pin, so headwater's next scan no longer reports the
release (headwater 9). Nobody writes an acknowledgement.
