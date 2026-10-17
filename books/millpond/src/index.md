# millpond

Some events outside a repository should change its work: a release of
something it depends on, a decision in a meeting, a deploy that failed.
millpond is the inbox those events reach. A program notices each event
and hands it to millpond as a capture. millpond records the capture
once, turns it into signals, and serves the tools a curation session
gives each signal its move through. Curation joins signals into items,
and millpond passes each item on, to one worktree or into crew's plan.
sluice lands the work an item becomes. An item that asks a question
goes to a sounding, which ends on a conclusion the operator accepts.

<figure class="mp-fig">
<div class="mp-scroll">
<svg viewBox="0 0 720 404" role="img" aria-label="headwater, eddy and the folder drop print capture lines into millpond, the inbox. millpond sends an item to one worktree, sends an item that asks a question to a sounding, or hands an item to crew's plan; sluice lands the work of a worktree or of crew's teams. Flywheel is later built on the same crates as millpond and reads the same inboxes.">
<defs>
<marker id="mp-i-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="mp-hd"/></marker>
<marker id="mp-i-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="mp-hd-a"/></marker>
</defs>
<text x="10" y="22" class="mp-th">adapters</text>
<text x="204" y="22" class="mp-th">the inbox</text>
<text x="430" y="22" class="mp-th">the work</text>
<text x="604" y="22" class="mp-th">landing</text>
<rect x="10" y="36" width="156" height="84" rx="9" class="mp-bx"/>
<text x="24" y="62" class="mp-tb">headwater</text>
<text x="24" y="84" class="mp-ts">releases of what a</text>
<text x="24" y="102" class="mp-ts">repository declares</text>
<rect x="10" y="136" width="156" height="84" rx="9" class="mp-bx"/>
<text x="24" y="162" class="mp-tb">eddy</text>
<text x="24" y="184" class="mp-ts">recorded meetings,</text>
<text x="24" y="202" class="mp-ts">a part per service</text>
<rect x="10" y="236" width="156" height="84" rx="9" class="mp-bx"/>
<text x="24" y="262" class="mp-tb">folder drop</text>
<text x="24" y="284" class="mp-ts">a file in a folder</text>
<rect x="24" y="294" width="130" height="18" rx="4" class="mp-chip-o"/>
<text x="30" y="307" class="mp-ct-o">built into millpond</text>
<line x1="166" y1="78" x2="200" y2="128" class="mp-ar-a" marker-end="url(#mp-i-a)"/>
<line x1="166" y1="178" x2="200" y2="178" class="mp-ar-a" marker-end="url(#mp-i-a)"/>
<line x1="166" y1="278" x2="200" y2="228" class="mp-ar-a" marker-end="url(#mp-i-a)"/>
<text x="168" y="170" class="mp-tl">lines</text>
<rect x="204" y="36" width="188" height="284" rx="10" class="mp-bx-mp"/>
<text x="220" y="64" class="mp-tb">millpond</text>
<text x="220" y="84" class="mp-tl">the inbox</text>
<text x="220" y="116" class="mp-ts">runs adapters on a tick</text>
<text x="220" y="140" class="mp-ts">keeps each capture once</text>
<text x="220" y="164" class="mp-ts">banks raw files off git</text>
<text x="220" y="188" class="mp-ts">holds signals and moves</text>
<text x="220" y="212" class="mp-ts">serves curation's tools</text>
<text x="220" y="236" class="mp-ts">passes items on</text>
<text x="220" y="276" class="mp-ts">a git repository,</text>
<text x="220" y="294" class="mp-ts">or a branch in one</text>
<rect x="430" y="36" width="140" height="84" rx="9" class="mp-bx"/>
<text x="444" y="60" class="mp-t">One worktree</text>
<text x="444" y="80" class="mp-ts">an agent and</text>
<text x="444" y="98" class="mp-ts">the item's brief</text>
<rect x="430" y="136" width="140" height="84" rx="9" class="mp-bx"/>
<text x="444" y="160" class="mp-t">A sounding</text>
<text x="444" y="180" class="mp-ts">one question,</text>
<text x="444" y="198" class="mp-ts">one conclusion</text>
<rect x="430" y="236" width="140" height="84" rx="9" class="mp-bx"/>
<text x="444" y="260" class="mp-t">crew's plan</text>
<text x="444" y="280" class="mp-ts">the planner's</text>
<text x="444" y="298" class="mp-ts">chores and units</text>
<line x1="392" y1="78" x2="426" y2="78" class="mp-ar" marker-end="url(#mp-i-m)"/>
<text x="396" y="70" class="mp-ts">send</text>
<line x1="392" y1="178" x2="426" y2="178" class="mp-ar" marker-end="url(#mp-i-m)"/>
<text x="396" y="170" class="mp-ts">send</text>
<line x1="392" y1="278" x2="426" y2="278" class="mp-ar" marker-end="url(#mp-i-m)"/>
<path d="M570,78 L586,78 L586,150 L600,150" class="mp-ar" marker-end="url(#mp-i-m)"/>
<path d="M570,278 L586,278 L586,210 L600,210" class="mp-ar" marker-end="url(#mp-i-m)"/>
<rect x="604" y="120" width="108" height="120" rx="9" class="mp-bx-hl"/>
<text x="618" y="146" class="mp-tb">sluice</text>
<text x="618" y="168" class="mp-ts">tests the</text>
<text x="618" y="186" class="mp-ts">work as</text>
<text x="618" y="204" class="mp-ts">merged, then</text>
<text x="618" y="222" class="mp-ts">lands it</text>
<rect x="204" y="338" width="508" height="54" rx="10" class="mp-bx-dash"/>
<text x="220" y="362" class="mp-t">Flywheel, later</text>
<text x="220" y="380" class="mp-ts">built on millpond's crates; reads the same inboxes</text>
</svg>
</div>
<figcaption>headwater and eddy each stand alone, and each carries an adapter part that prints capture lines into millpond. The folder drop needs no tool of its own, so it ships inside millpond. millpond sends an item to one worktree, or to a sounding when it asks a question, or hands it to crew's plan. sluice lands the work of a worktree and of crew's teams.</figcaption>
</figure>

## Why it exists

Every source of events needs the same plumbing: a record of what it
has already reported, a place for the raw material, a cut that keeps a
quote small, a status a fleet can watch, and a loop that lands each
capture. swancloud's release adapter carries all of it alone today: its
own `landed` list, its `work/` and `raw/` folders, its 8 KiB cut, its
`status.json` and its landing loop. A meeting source would carry the
same plumbing again, and so would every source after it.

millpond holds that plumbing once. An adapter shrinks to the part that
knows its source: it lists the source's events, keys each one, fetches
the raw material, and marks a capture that is its own excerpt (115).
The dedupe by key, the raw bank, the records, the cut, the cursor and
the run's status are millpond's.

## What it promises

- A source event is one capture, however many hosts and runs report it
  (111).
- Raw material stays on the host and never enters git. The capture
  points at it (111, 217h).
- A capture that is its own excerpt gets its one signal as it lands,
  cut at a line under the inbox's limit. Every other capture waits,
  unread, for a reader.
- A reader's excerpt appears verbatim in its capture's raw material, or
  millpond refuses it (113).
- Every signal takes exactly one move, every move has a stated
  consequence, and an unmoved signal is never discarded (107, 116,
  118).
- Weight counts by event date, never by the date of capture (118).
- The operator decides a batch of moves at a time, and an item at a
  time, never a signal at a time (109).

## Where it stops

millpond never judges what a capture says and never plans across
items. A model runs in two places only, a reader and a curation
session, and each is a Claude session working through millpond's tools.
Ordering items across teams is crew's planner today and Flywheel's
later. millpond reads a source only through an adapter, its own
built-in ones included. It works no question itself, since a sounding
does, and it tests and lands nothing, since sluice does.

## The tools beside it

- **headwater** reports releases and advisories for what a repository
  declares. Its book is at [../headwater/](../headwater/).
- **eddy** lists recorded meetings from each meeting service. Its book
  is at [../eddy/](../eddy/).
- **sounding** works one question in one session, in a worktree of its
  own, and ends on a conclusion the operator accepts, sends back for
  another round, or drops. Its book is at [../sounding/](../sounding/).
- **sluice** tests a change as merged and lands it. Its book is at
  [../sluice/](../sluice/).
- **crew** runs teams, plans and bolts. It calls millpond's command
  line as it calls sluice's.
- **Flywheel** is built later on the same crates as millpond and reads
  the same inboxes. crew becomes it (crew ADR 0026).

## How to read this book

The chapters follow a capture: the contract it arrives under, the
adapters that print it, the seven steps that land it, the inbox that
keeps it, the reader that turns it into signals, the curation that
moves them, and the items and sends that turn signals into work. Then
come the sources millpond runs, the three setups it runs in, and who
owns what.

A bare number in parentheses cites Flywheel's statement,
`design/flywheel-next/requirements.md`, whose record formats and moves
millpond keeps. A number after `headwater` cites headwater's statement.
A rule id such as `signals.6` or `code.1` cites crew's
`docs/architecture/`; `inputs.6`, `lists.1`, `doctor.1` and `fleet.6`
are swancloud's. millpond's own statement is not written yet;
[Open questions](open.md) says what it will hold.
