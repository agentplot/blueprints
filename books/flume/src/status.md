# Status and live state

`flume status` reports every place flume runs on its host, as each
stands now. `flume status --json` gives the same to callers: millpond,
crew, sounding and flume's own plugins read it.

## What status gives

| For each place | What it says |
|---|---|
| kind | fix, change, question, or a kind the repository declares |
| stage | the stage running, or the last one run |
| agent | working, waiting or stopped |
| deliverable | whether the stage's deliverable exists |
| submission | the place's submission to sluice, and sluice's outcome |
| tasks | for a change, how many of its tasks are ticked, of how many |

Beside these, status names what an agent that stopped short needs, and
a stage reported stuck or never started. It names a readying step that
failed, with its words, and a place tidying kept, with the reason.

<figure class="fl-fig">
<div class="fl-scroll">
<svg viewBox="0 0 720 340" role="img" aria-label="Each field of flume status is read from where it lives. Kind and stage come from flume's own launch. The agent's state comes from herdr and the agent's transcript. Whether the deliverable exists comes from the place's branch, read at its head. A change's tasks come from the change's own files. The submission comes from sluice's record.">
<defs>
<marker id="fl-st-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd"/></marker>
<marker id="fl-st-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd-a"/></marker>
<marker id="fl-st-s" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd-sl"/></marker>
</defs>
<text x="10" y="22" class="fl-th">read from</text>
<text x="330" y="22" class="fl-th">flume status --json, for each place</text>
<rect x="10" y="36" width="210" height="48" rx="8" class="fl-bx-fl"/>
<text x="24" y="57" class="fl-t">flume's own launch</text>
<text x="24" y="74" class="fl-ts">what it launched, where</text>
<rect x="10" y="96" width="210" height="48" rx="8" class="fl-bx"/>
<text x="24" y="117" class="fl-t">herdr and the transcript</text>
<text x="24" y="134" class="fl-ts">the pane, the agent's record</text>
<rect x="10" y="156" width="210" height="48" rx="8" class="fl-bx"/>
<text x="24" y="177" class="fl-t">The place's branch</text>
<text x="24" y="194" class="fl-ts">read once, at its head</text>
<rect x="10" y="216" width="210" height="48" rx="8" class="fl-bx"/>
<text x="24" y="237" class="fl-t">The change's own files</text>
<text x="24" y="254" class="fl-ts">agreeing with openspec</text>
<rect x="10" y="276" width="210" height="48" rx="8" class="fl-bx-sl"/>
<text x="24" y="297" class="fl-t">sluice's record</text>
<text x="24" y="314" class="fl-ts">of the place's branch</text>
<line x1="220" y1="60" x2="342" y2="60" class="fl-ar-a" marker-end="url(#fl-st-a)"/>
<line x1="220" y1="120" x2="342" y2="120" class="fl-ar" marker-end="url(#fl-st-m)"/>
<line x1="220" y1="180" x2="342" y2="180" class="fl-ar" marker-end="url(#fl-st-m)"/>
<line x1="220" y1="240" x2="342" y2="240" class="fl-ar" marker-end="url(#fl-st-m)"/>
<line x1="220" y1="300" x2="342" y2="300" class="fl-ar-sl" marker-end="url(#fl-st-s)"/>
<rect x="330" y="32" width="382" height="296" rx="10" class="fl-bx-hl"/>
<rect x="346" y="42" width="350" height="36" rx="6" class="fl-chip"/>
<text x="358" y="65" class="fl-t">kind, stage</text>
<text x="470" y="65" class="fl-ts">change, at code</text>
<rect x="346" y="102" width="350" height="36" rx="6" class="fl-chip"/>
<text x="358" y="125" class="fl-t">agent</text>
<text x="470" y="125" class="fl-ts">working, waiting or stopped</text>
<rect x="346" y="162" width="350" height="36" rx="6" class="fl-chip"/>
<text x="358" y="185" class="fl-t">deliverable</text>
<text x="470" y="185" class="fl-ts">exists, or not yet</text>
<rect x="346" y="222" width="350" height="36" rx="6" class="fl-chip"/>
<text x="358" y="245" class="fl-t">tasks</text>
<text x="470" y="245" class="fl-ts">5 of 8 ticked</text>
<rect x="346" y="282" width="350" height="36" rx="6" class="fl-chip"/>
<text x="358" y="305" class="fl-t">submission</text>
<text x="470" y="305" class="fl-ts">none yet, or sluice's state of it</text>
</svg>
</div>
<figcaption>Status reads each field where it lives, so it never disagrees with the place, the transcript, the change or sluice.</figcaption>
</figure>

## A change's tasks

For a change, flume reads the OpenSpec change's own files in the place.
Its tasks show ticked as code ticks them: three of eight, then eight
of eight, and the stage ends once the last tick is committed. flume
reads the files directly, and what it reads agrees with what
`openspec` reports on the same worktree (`plan.12`).

## Live state, and the records that outlast it

flume keeps only the live state of the places it runs. Once it tidies
a place, the place leaves its status.

An item's record outlives its place, so the record belongs to whoever
keeps the item:

- **millpond** keeps an item's send and its landing, written from
  sluice's record ([millpond's items](../millpond/items.html#a-send)).
- **crew** keeps its plans, its bolts and each unit's stage.
- **sluice** keeps every submission and every landing.
- **git** keeps the commits, and a branch tidying kept.

flume holds no history a caller needs later, and no caller reads one
from it.

## What flume reports off the host

Where the host's managed configuration turns it on, flume reports each
place to a collector on the host as one trace (216, 217). The trace
holds a span for each start of a stage and a span for each wait. A
wait names whom the place waited on: its caller for an answer or a
review, the host for room, the merge queue, or a person the agent is
asking. A
record goes at each change, so a backend shows a place as it stands
before its spans end.

```
place  a-deploy-…-request   intent accounts
├─ construct, start 1   1h02   ended short, needs an answer
├─ wait: caller, answer 0h40
├─ construct, start 2   0h38   delivered
└─ wait: merge queue    0h50   landed
```

flume hands each agent it starts the place's facts and its start's
trace context (219). The agent program's own turns and token counts so
name the place, and a test run the agent starts through sluice nests
under the start. A backend joins a session, an intent or the merge
queue from these alone.

No word of a brief, prompt, stop-short or answer leaves the host. No
metric names a place, so the metrics grow with the kinds a host runs
and never with its places (218, 220). flume reads nothing back:
a collector that is down loses the signals and changes nothing flume
does (216).

## One reading per repository

A flume command reads each repository once, however many of its places
it reports (`plan.12`). A status of twenty places in one repository
costs one reading of that repository, so the herdr sidebar and crew can
read status as often as they need.
