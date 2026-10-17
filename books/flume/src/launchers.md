# Who launches

flume decides nothing about what to launch. Its callers do, and each
launches the same way: a repository, a kind, a brief and a name.

| Caller | Launches |
|---|---|
| The operator | `/launch <brief>` in any session, or the herdr plugin's key |
| millpond | an item's send, as a fix or a change |
| headwater | the fix key, as a fix with the release's brief |
| sounding | a question, as the place and session of a sounding |
| crew | each stage of a unit, chore or fix, in a slot of its team |

<figure class="fl-fig">
<div class="fl-scroll">
<svg viewBox="0 0 720 408" role="img" aria-label="The operator, millpond, headwater and sounding each launch through flume, which makes their places: a fix, a change and a question. crew keeps what spans many places: plans and bolts, slots, the dispatcher, conductors, approvals and conflicts between units. It asks flume for each place and each stage's agent, and asks sluice for each landing.">
<defs>
<marker id="fl-w-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd"/></marker>
<marker id="fl-w-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd-a"/></marker>
<marker id="fl-w-s" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd-sl"/></marker>
</defs>
<text x="10" y="22" class="fl-th">callers</text>
<text x="230" y="22" class="fl-th">flume, on its host</text>
<text x="480" y="22" class="fl-th">its places</text>
<rect x="10" y="36" width="180" height="48" rx="8" class="fl-bx"/>
<text x="24" y="57" class="fl-t">The operator</text>
<text x="24" y="74" class="fl-ts">/launch, a herdr key</text>
<rect x="10" y="96" width="180" height="48" rx="8" class="fl-bx-mp"/>
<text x="24" y="117" class="fl-t">millpond</text>
<text x="24" y="134" class="fl-ts">an item's send</text>
<rect x="10" y="156" width="180" height="48" rx="8" class="fl-bx"/>
<text x="24" y="177" class="fl-t">headwater</text>
<text x="24" y="194" class="fl-ts">the fix key</text>
<rect x="10" y="216" width="180" height="48" rx="8" class="fl-bx-sd"/>
<text x="24" y="237" class="fl-t">sounding</text>
<text x="24" y="254" class="fl-ts">a question</text>
<line x1="190" y1="60" x2="226" y2="80" class="fl-ar-a" marker-end="url(#fl-w-a)"/>
<line x1="190" y1="120" x2="226" y2="124" class="fl-ar-a" marker-end="url(#fl-w-a)"/>
<line x1="190" y1="180" x2="226" y2="168" class="fl-ar-a" marker-end="url(#fl-w-a)"/>
<line x1="190" y1="240" x2="226" y2="212" class="fl-ar-a" marker-end="url(#fl-w-a)"/>
<rect x="230" y="40" width="200" height="220" rx="10" class="fl-bx-fl"/>
<text x="246" y="68" class="fl-tb">flume</text>
<text x="246" y="92" class="fl-ts">makes each place,</text>
<text x="246" y="110" class="fl-ts">starts each stage's agent,</text>
<text x="246" y="128" class="fl-ts">reads each stage's end,</text>
<text x="246" y="146" class="fl-ts">tidies the place</text>
<text x="246" y="182" class="fl-ts">decides nothing about</text>
<text x="246" y="200" class="fl-ts">what to launch</text>
<line x1="430" y1="150" x2="466" y2="150" class="fl-ar-a" marker-end="url(#fl-w-a)"/>
<rect x="470" y="40" width="242" height="220" rx="10" class="fl-bx"/>
<rect x="486" y="56" width="210" height="44" rx="6" class="fl-chip-fl"/>
<text x="498" y="83" class="fl-tm">fix--bump-parser</text>
<rect x="486" y="110" width="210" height="44" rx="6" class="fl-chip-fl"/>
<text x="498" y="137" class="fl-tm">change--retention</text>
<rect x="486" y="164" width="210" height="44" rx="6" class="fl-chip-fl"/>
<text x="498" y="191" class="fl-tm">question--take-lib-5</text>
<text x="486" y="238" class="fl-ts">under places/, on one host</text>
<rect x="10" y="290" width="420" height="108" rx="10" class="fl-bx"/>
<text x="26" y="314" class="fl-tb">crew</text>
<text x="26" y="336" class="fl-ts">keeps what spans many places:</text>
<text x="26" y="356" class="fl-ts">plans and bolts · slots · the dispatcher</text>
<text x="26" y="374" class="fl-ts">conductors · approvals</text>
<text x="26" y="392" class="fl-ts">conflicts between units</text>
<line x1="330" y1="290" x2="330" y2="264" class="fl-ar-a" marker-end="url(#fl-w-a)"/>
<text x="338" y="282" class="fl-tl">each place, each stage</text>
<rect x="470" y="318" width="242" height="60" rx="9" class="fl-bx-sl"/>
<text x="486" y="344" class="fl-tb">sluice</text>
<text x="486" y="364" class="fl-ts">each landing</text>
<line x1="430" y1="348" x2="466" y2="348" class="fl-ar-sl" marker-end="url(#fl-w-s)"/>
</svg>
</div>
<figcaption>Every caller launches through flume on its host. crew keeps the plan across places, and asks flume for each place and stage as it asks sluice for each landing.</figcaption>
</figure>

## From the operator

`/launch <brief>` in any Claude Code session launches the brief, and
the session that asked goes on with its own work, since the launch's
agent works in a place of its own. The herdr plugin's key launches from
herdr ([The operator's surfaces](surfaces.md)). Which repository and
kind a `/launch` takes is on [Open questions](open.md#what-launch-takes).

## From millpond

millpond sends one item to one worktree through flume. The send names
the repository and the kind, a fix or an OpenSpec change. millpond
records the send and hands flume the item's brief, and flume makes the
place and starts the agent. The work submits through sluice, and
millpond writes the landing against the item from sluice's record of
that branch ([millpond's items](../millpond/items.html#a-send)).

- **An item that asks a question** goes to a sounding, which launches
  its own place through flume.
- **An inbox crew keeps** sends no item to flume itself. Its settings
  hand items to crew's planner, and millpond refuses a send from it.

## From headwater

headwater's fix key hands a release's brief to flume as a fix. An agent
starts in a place to make the bump, and submits it to sluice
([headwater's book](../headwater/)).

In a repository crew runs, a bump comes only as a chore crew's planner
makes from an item. There the fix key hands the release to millpond as
a capture instead, and no agent starts outside crew's plan.

## From sounding

sounding launches the kind question for each sounding. flume makes the
place and runs the round's session in it. sounding keeps the question,
its rounds and the operator's decision on each conclusion
([sounding's book](../sounding/)). A sounding waiting on the operator
shows as a row in flume's herdr sidebar.

## From crew

crew starts each stage of a unit, a chore or a fix through flume, in a
slot of its team, and reads each stage's end from `flume status`. It
calls flume's command line, as it calls millpond's and sluice's, since
crew's Python uses only the standard library (`code.1`).

### What crew keeps

crew keeps what spans many places:

- plans and bolts;
- slots, which bound how much of a team's work is in flight;
- the dispatcher, which gives each team its next bolt;
- conductors, which run a team's work through its stages;
- approvals, the operator's word on each decision;
- conflicts between units, forecast and settled in the later unit's
  place.

crew asks flume for each place and each stage's agent, as it asks
sluice for each landing, and no crew code makes a worktree itself. A
unit in crew runs stages flume's change does not name: a fix round
after verify, a settle stage when a conflict reaches it, and a merge
stage that archives the change (`teams.14`, `teams.17`). Those stages
stay crew's. How their prompts take the form of a kind is on
[Open questions](open.md#a-repositorys-kinds).
