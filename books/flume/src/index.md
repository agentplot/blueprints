# flume

Work that leaves the inbox needs somewhere to happen: a worktree of the
right repository on a branch of its own, made ready to build. It needs
an agent started there with the right prompt, then a fresh one for each
stage after, until the work goes to sluice. flume does this for one
launch at a time. A launch names a repository, a kind, a brief and a
name. flume makes the place, starts each stage's agent and confirms
that its prompt arrived, and moves to the next stage once the stage's
deliverable exists. When sluice lands the work, or the launch is
dropped, flume tidies the place. It runs on one host and launches
there.

<figure class="fl-fig">
<div class="fl-scroll">
<svg viewBox="0 0 720 438" role="img" aria-label="Five callers launch through flume: the operator with /launch or a herdr key, millpond with an item's send, headwater with its fix key, sounding with a question, and crew with each stage of its work. flume takes a repository, a kind, a brief and a name, makes a place under places/kind--name, made ready, and starts a fresh agent for each stage in a herdr pane or as a printed command, its prompt confirmed. Each stage ends on its deliverable. The last stage's agent submits to sluice, which tests and lands the work; once it lands or the launch is dropped, flume tidies the place. millpond keeps the item's record, crew its plan and sluice its landings; flume keeps only each place's live state.">
<defs>
<marker id="fl-i-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd"/></marker>
<marker id="fl-i-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd-a"/></marker>
<marker id="fl-i-s" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd-sl"/></marker>
</defs>
<text x="10" y="22" class="fl-th">launches from</text>
<text x="200" y="22" class="fl-th">one launch</text>
<text x="500" y="22" class="fl-th">the work</text>
<rect x="10" y="36" width="160" height="52" rx="9" class="fl-bx"/>
<text x="24" y="58" class="fl-t">The operator</text>
<text x="24" y="76" class="fl-ts">/launch, a herdr key</text>
<rect x="10" y="98" width="160" height="52" rx="9" class="fl-bx-mp"/>
<text x="24" y="120" class="fl-t">millpond</text>
<text x="24" y="138" class="fl-ts">an item's send</text>
<rect x="10" y="160" width="160" height="52" rx="9" class="fl-bx"/>
<text x="24" y="182" class="fl-t">headwater</text>
<text x="24" y="200" class="fl-ts">the fix key</text>
<rect x="10" y="222" width="160" height="52" rx="9" class="fl-bx-sd"/>
<text x="24" y="244" class="fl-t">sounding</text>
<text x="24" y="262" class="fl-ts">a question</text>
<rect x="10" y="284" width="160" height="52" rx="9" class="fl-bx"/>
<text x="24" y="306" class="fl-t">crew</text>
<text x="24" y="324" class="fl-ts">each stage of its work</text>
<line x1="170" y1="62" x2="196" y2="62" class="fl-ar-a" marker-end="url(#fl-i-a)"/>
<line x1="170" y1="124" x2="196" y2="124" class="fl-ar-a" marker-end="url(#fl-i-a)"/>
<line x1="170" y1="186" x2="196" y2="186" class="fl-ar-a" marker-end="url(#fl-i-a)"/>
<line x1="170" y1="248" x2="196" y2="248" class="fl-ar-a" marker-end="url(#fl-i-a)"/>
<line x1="170" y1="310" x2="196" y2="310" class="fl-ar-a" marker-end="url(#fl-i-a)"/>
<rect x="200" y="36" width="220" height="300" rx="10" class="fl-bx-fl"/>
<text x="216" y="64" class="fl-tb">flume</text>
<text x="216" y="84" class="fl-tm">flume launch</text>
<text x="216" y="112" class="fl-ts">a repository, a kind,</text>
<text x="216" y="130" class="fl-ts">a brief and a name</text>
<text x="216" y="158" class="fl-ts">a place, made ready</text>
<text x="216" y="176" class="fl-tm">places/&lt;kind&gt;--&lt;name&gt;</text>
<text x="216" y="204" class="fl-ts">a fresh agent per stage,</text>
<text x="216" y="222" class="fl-ts">its prompt confirmed</text>
<text x="216" y="250" class="fl-ts">each stage ends on</text>
<text x="216" y="268" class="fl-ts">its deliverable</text>
<text x="216" y="296" class="fl-ts">tidies the place;</text>
<text x="216" y="314" class="fl-ts">lands nothing itself</text>
<line x1="420" y1="66" x2="496" y2="66" class="fl-ar-a" marker-end="url(#fl-i-a)"/>
<rect x="500" y="36" width="212" height="60" rx="9" class="fl-bx-hl"/>
<text x="514" y="60" class="fl-t">Each stage's agent</text>
<text x="514" y="80" class="fl-ts">in a herdr pane, or a command</text>
<line x1="606" y1="96" x2="606" y2="126" class="fl-ar-sl" marker-end="url(#fl-i-s)"/>
<text x="614" y="116" class="fl-ts">submits</text>
<rect x="500" y="130" width="212" height="60" rx="9" class="fl-bx-sl"/>
<text x="514" y="156" class="fl-tb">sluice</text>
<text x="514" y="176" class="fl-ts">tests as merged, lands it</text>
<path d="M606,190 L606,226 L424,226" class="fl-ar-d" marker-end="url(#fl-i-m)"/>
<text x="440" y="248" class="fl-ts">landed, or dropped:</text>
<text x="440" y="264" class="fl-ts">flume tidies the place</text>
<rect x="200" y="356" width="512" height="72" rx="10" class="fl-bx"/>
<text x="216" y="380" class="fl-t">Each record stays with its owner</text>
<text x="216" y="400" class="fl-ts">millpond keeps the item's, crew its plan, sluice its landings</text>
<text x="216" y="418" class="fl-ts">flume keeps only each place's live state</text>
</svg>
</div>
<figcaption>Five callers launch the same way. flume makes the place and runs its stages, each with a fresh agent, and the last stage's agent submits to sluice. flume tidies the place once the work lands, and keeps no record beyond each place's live state.</figcaption>
</figure>

## Why it exists

Starting an agent on work looks like one command, and it fails in ways
that cost the work. A prompt sits typed in a pane and is never
submitted. A stage reads as done because its pane went quiet. A
worktree goes with commits that nothing else holds. crew's teams meet
each of these and hold rules against them (`teams.1`–`4`, `teams.11`,
`teams.15`, `plan.9`, `10`, `12`, `17`). Every other tool that starts
work needs the same rules: millpond sending an item, headwater's fix
key on a release, sounding opening a question, and the operator
launching a fix of their own.

flume holds those rules once, as a tool of its own. Every caller
launches the same way, and crew asks flume for each place and each
stage's agent as it asks sluice for each landing.

## What it promises

- One launch is one place: a worktree of one repository, on the branch
  `<kind>/<name>`.
- Each stage starts a fresh agent, and never one over an agent still
  running (`teams.2`).
- A stage's prompt is confirmed in the agent's transcript or sent once
  more. A stage whose second sending is not taken is reported never
  started (`teams.15`).
- A stage ends on its deliverable, or on its agent stopping short to
  say what it needs, and never on a quiet pane (`teams.4`).
- A tell reaches its agent as a prompt, or fails with nothing typed
  (`teams.11`).
- flume removes only places it made, and keeps a branch that holds
  commits its target lacks (`plan.9`, `plan.10`).
- flume lands nothing. The work reaches its target through sluice.

## Where it stops

flume decides nothing about what to launch and plans across no items.
It keeps only the live state of the places it runs: millpond keeps an
item's record, crew its plans, and sluice its landings. crew keeps
what spans many places, among them its bolts, slots, conductors and
approvals ([Who launches](launchers.md)).

## The tools beside it

- **millpond** is the inbox. It sends an item to flume as a fix or a
  change, records the send, and writes the landing against the item.
  Its book is at [../millpond/](../millpond/).
- **headwater** reports releases newer than a repository's pins. Its
  fix key hands a release's brief to flume as a fix. Its book is at
  [../headwater/](../headwater/).
- **sounding** works one question in one session. flume makes its
  place and runs its session as the kind question. Its book is at
  [../sounding/](../sounding/).
- **sluice** tests a change as merged and lands it. Every fix and
  change flume launches ends on a submission to sluice. Its book is at
  [../sluice/](../sluice/).
- **crew** runs teams, plans and bolts. It calls flume's command line
  for each place and each stage.

## How to read this book

The chapters follow one launch: the launch and its place, the kinds
and their stages, how a stage's prompt reaches its agent, and how a
stage ends. Then come what flume reports while a place runs and how it
tidies a place once its work is over. Last come who launches, with
what crew keeps for itself, and the surfaces the operator works
through.

A rule id in backticks, such as `teams.15`, cites crew's
`docs/architecture/`, whose rules about places and stages flume takes
over. flume's own statement is `design/flume/requirements.md`;
[Open questions](open.md) says what folding it into the book still holds.
