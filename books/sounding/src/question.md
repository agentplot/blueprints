# The question and its sources

A sounding starts from one question and the material that bears on it.
`sounding open` writes both into `question.md`, and every round's
session starts from that file.

## One question

A sounding works one question, whose answer the operator decides before
any work the answer implies begins. An item in millpond sometimes asks
one: whether to take a major release, or how to settle what a meeting
left open. An item that needs no judgment goes to
a worktree and becomes a change. An item that asks a question goes to a
sounding ([millpond's items](../millpond/items.html)).

## Ways in

- **An item millpond sends.** millpond's `send` takes a sounding as its
  target, and opens it with the item's signals and the captures they
  came from as its sources.
- **`/sound <question>`** in any Claude Code session. The sounding
  opens while that session goes on with its own work.
- **A key in another tool's herdr plugin**, such as headwater's on a
  release that needs judgment.
- **crew's planner and design agent**, which call `sounding open` for
  an item that asks a question, as crew calls millpond.

Each way in ends in `sounding open`, so a sounding is the same whichever
way it began. [Where questions come from](setups.md) sets out which
ways in each setup has.

## question.md

`sounding open` writes the question and its sources:

- the item's signals, each with its verbatim excerpt (113);
- the captures those signals came from, which point at the raw
  material;
- any earlier conclusion on the subject.

A question opened with `/sound` carries the sources it names, such as
the transcript of the meeting that left a decision open.

An earlier conclusion is one the operator accepted. Naming it among the
sources starts the session from what the operator already decided on
the subject.

## Each round's question

The question grows from round to round. When the operator answers a
conclusion with go on, the conclusion moves to `rounds/<n>.md`, and the
operator's notes join the next session's question
([Deciding a conclusion](deciding.md)).

<figure class="sd-fig">
<div class="sd-scroll">
<svg viewBox="0 0 720 300" role="img" aria-label="At open, the item's signals, the captures behind them and an earlier conclusion on the same subject become question.md's sources. On each go on, the operator's notes join question.md and the last conclusion moves to rounds/n.md. The start hook hands a round's session the question, its sources and every earlier round.">
<defs>
<marker id="sd-q-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="sd-hd"/></marker>
<marker id="sd-q-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="sd-hd-a"/></marker>
<marker id="sd-q-p" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="sd-hd-mp"/></marker>
</defs>
<text x="10" y="22" class="sd-th">at open</text>
<text x="250" y="22" class="sd-th">the sounding's files</text>
<text x="480" y="22" class="sd-th">a round</text>
<rect x="10" y="36" width="200" height="48" rx="8" class="sd-bx-mp"/>
<text x="24" y="57" class="sd-t">The item's signals</text>
<text x="24" y="74" class="sd-ts">each with its excerpt</text>
<rect x="10" y="94" width="200" height="48" rx="8" class="sd-bx-mp"/>
<text x="24" y="115" class="sd-t">Their captures</text>
<text x="24" y="132" class="sd-ts">pointers to raw material</text>
<rect x="10" y="152" width="200" height="48" rx="8" class="sd-bx"/>
<text x="24" y="173" class="sd-t">An earlier conclusion</text>
<text x="24" y="190" class="sd-ts">on the same subject</text>
<text x="10" y="228" class="sd-th">on each go on</text>
<rect x="10" y="238" width="200" height="48" rx="8" class="sd-bx-hl"/>
<text x="24" y="259" class="sd-t">The operator's notes</text>
<text x="24" y="276" class="sd-ts">on the last conclusion</text>
<line x1="210" y1="60" x2="246" y2="74" class="sd-ar-mp" marker-end="url(#sd-q-p)"/>
<line x1="210" y1="118" x2="246" y2="112" class="sd-ar-mp" marker-end="url(#sd-q-p)"/>
<line x1="210" y1="176" x2="246" y2="150" class="sd-ar" marker-end="url(#sd-q-m)"/>
<path d="M210,262 L228,262 L228,184 L246,184" class="sd-ar-a" marker-end="url(#sd-q-a)"/>
<rect x="250" y="36" width="190" height="168" rx="10" class="sd-bx-sd"/>
<text x="266" y="62" class="sd-tm">question.md</text>
<text x="266" y="90" class="sd-ts">the question</text>
<text x="266" y="110" class="sd-ts">its sources</text>
<text x="266" y="138" class="sd-ts">the operator's notes,</text>
<text x="266" y="156" class="sd-ts">one set per go on</text>
<rect x="250" y="226" width="190" height="60" rx="9" class="sd-bx"/>
<text x="266" y="250" class="sd-tm">rounds/&lt;n&gt;.md</text>
<text x="266" y="270" class="sd-ts">each earlier conclusion</text>
<line x1="440" y1="120" x2="476" y2="130" class="sd-ar-a" marker-end="url(#sd-q-a)"/>
<path d="M440,256 L458,256 L458,160 L476,160" class="sd-ar" marker-end="url(#sd-q-m)"/>
<rect x="480" y="96" width="104" height="84" rx="9" class="sd-bx-hl"/>
<text x="494" y="120" class="sd-t">Start hook</text>
<text x="494" y="140" class="sd-ts">hands it all</text>
<text x="494" y="156" class="sd-ts">to the session</text>
<line x1="584" y1="138" x2="606" y2="138" class="sd-ar-a" marker-end="url(#sd-q-a)"/>
<rect x="610" y="96" width="102" height="84" rx="9" class="sd-bx-sd"/>
<text x="624" y="120" class="sd-t">The round's</text>
<text x="624" y="138" class="sd-t">session</text>
<text x="624" y="160" class="sd-ts">reads it first</text>
</svg>
</div>
<figcaption><code>sounding open</code> writes the question and its sources. Each go on adds the operator's notes and keeps the last conclusion under <code>rounds/</code>. The start hook hands a round's session all of it, so a second round starts where the first ended, with the operator's reply.</figcaption>
</figure>

The Claude Code plugin's start hook hands each round's session its
question, its sources and its earlier rounds, whichever surface started
the round ([The operator's surfaces](surfaces.md)).
