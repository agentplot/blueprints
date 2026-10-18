# A stage ends on its deliverable

A stage ends when its deliverable exists, or when its agent stops short
and says what it needs. It never ends because its pane went quiet
(`teams.4`). When the deliverable exists, flume ends the stage's agent
and starts the next stage.

## Why the pane says nothing

An agent's pane goes quiet for many reasons. The agent may wait on a
long build, think through a hard step, or finish a turn with the work
half done. A quiet pane says nothing about whether the work exists. The
deliverable does, so flume reads the deliverable where the work lives:
in the place, or on the host.

<figure class="fl-fig">
<div class="fl-scroll">
<svg viewBox="0 0 720 292" role="img" aria-label="A stage's agent is working. A pane that goes quiet with no deliverable leaves it working. When its deliverable exists, the stage ends and the next stage starts. When it stays quiet past flume's limit with no deliverable, it is reported stuck and not ended. When the agent stops short and says what it needs, it is waiting; a tell answers it, or a retry starts the stage again with a fresh agent.">
<defs>
<marker id="fl-s-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd"/></marker>
<marker id="fl-s-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd-a"/></marker>
</defs>
<rect x="10" y="110" width="140" height="60" rx="9" class="fl-bx-dash"/>
<text x="24" y="134" class="fl-t">Pane goes quiet</text>
<text x="24" y="154" class="fl-ts">no deliverable</text>
<line x1="150" y1="140" x2="176" y2="140" class="fl-ar-d" marker-end="url(#fl-s-m)"/>
<rect x="180" y="100" width="150" height="80" rx="10" class="fl-bx-fl"/>
<text x="196" y="130" class="fl-tb">Working</text>
<text x="196" y="152" class="fl-ts">the stage's agent</text>
<path d="M330,116 L400,116 L400,54 L476,54" class="fl-ar-a" marker-end="url(#fl-s-a)"/>
<text x="408" y="102" class="fl-tl">its deliverable</text>
<rect x="480" y="24" width="200" height="60" rx="9" class="fl-bx-hl"/>
<text x="494" y="48" class="fl-t">Ended</text>
<text x="494" y="68" class="fl-ts">the next stage starts</text>
<line x1="330" y1="140" x2="476" y2="140" class="fl-ar" marker-end="url(#fl-s-m)"/>
<text x="338" y="132" class="fl-ts">quiet past the limit</text>
<rect x="480" y="110" width="200" height="60" rx="9" class="fl-bx-dash"/>
<text x="494" y="134" class="fl-t">Stuck</text>
<text x="494" y="154" class="fl-ts">reported, never ended</text>
<path d="M330,164 L400,164 L400,226 L476,226" class="fl-ar" marker-end="url(#fl-s-m)"/>
<text x="408" y="214" class="fl-ts">stops short</text>
<rect x="480" y="196" width="200" height="60" rx="9" class="fl-bx"/>
<text x="494" y="220" class="fl-t">Waiting</text>
<text x="494" y="240" class="fl-ts">says what it needs</text>
<path d="M580,256 L580,278 L255,278 L255,184" class="fl-ar-d" marker-end="url(#fl-s-m)"/>
<text x="270" y="270" class="fl-ts">a tell, or a retry</text>
</svg>
</div>
<figcaption>Only the deliverable ends a stage and starts the next. A quiet pane leaves the agent working, a long silence is reported and left running, and an agent that stops short waits for a tell or a retry.</figcaption>
</figure>

## Reading a deliverable

| Stage | flume reads |
|---|---|
| construct | the OpenSpec change's files, committed on the place's branch |
| code, in a fix | a commit on the branch made since the stage began |
| code, in a change | the change's `tasks.md` at the branch's head, every task ticked |
| verify | its report |
| submission | sluice's record of the place's branch: landed on its target |
| a sounding's session | `conclusion.md` |

flume reads a deliverable at one commit. It reads the branch's head
once, then reads the ticks and the commit's time at that head. An
agent's last tick that lands between two reads never shows a
deliverable that is not there (`teams.4`).

For a change, flume reads the OpenSpec change's own files and agrees
with what `openspec` reports on the same worktree (`plan.12`).

## Stopping short

An agent may stop without its deliverable: a question only the operator
can answer, a step outside its place, a brief that cannot be done as
written. It stops and says what it needs. flume reads that from its
transcript, records what the agent needs with the place, and shows the
agent as waiting.

An agent that stops short ends flume's wait on the stage without the
deliverable, so flume starts no next stage. A tell answers the agent
in its pane, and it goes on with the stage. `flume retry` starts the
stage again with a fresh agent and its prompt
([Prompt delivery](prompts.md)).

## Stuck

A stage quiet past flume's limit, with no deliverable and no word of
what it needs, is reported stuck. flume ends nothing: the agent may be
in a long build, and ending it would lose the work it is doing. The
operator, or the caller, decides what follows: a tell, a stop, or a
retry.

## Moving on

When the deliverable exists, flume ends the stage's agent and starts
the next stage's fresh agent with its prompt. Whoever waits on the
place learns of the end with the deliverable itself: a caller reading
`flume status` sees the stage ended and what it delivered in the same
reading (`teams.4`).

After a fix's or a change's last stage the work has landed, and the
place waits only to be tidied ([Tidying](tidying.md)). A question's
place stays while the operator decides its conclusion, since go on runs
the stage again there ([Kinds and stages](kinds.md#a-question)).
