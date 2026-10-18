# Curation and moves

Curation gives each signal one of Flywheel's six moves (116). A
curation session is a Claude session working through millpond's tools.
It proposes moves in batches, the operator accepts or changes each
batch, and the session writes it. Curation writes no captures and no
signals.

## The six moves

| Move | Consequence |
|---|---|
| `drop` | Records the reason. |
| `answered` | Names the claim or record that settled it. |
| `challenge` | Weighs against a claim. Only an inbox beside Flywheel's claims has one. |
| `join` | Makes an item, or grows a proposed one, from any number of signals. |
| `attach` | Puts the signal on an item already sent. |
| `route` | Offers a chore, which millpond makes an item of one, or an ask, which it records. |

Every signal has exactly one standing move, stored with the signal, its
target, its reason and its date (107). Curation runs over signals with
no move and never judges a signal that already has one (107). A route that
offers neither a chore nor an ask is refused (116).

An unmoved signal is never discarded, and weight counts by event date
(118). A signal moved a month after its meeting still counts on the
meeting's day.

## Working through a backlog

Nobody picks through hundreds of signals by hand. The curate skill
starts a session that asks `signals` for the oldest fifty unmoved,
reads the raw material of the unclear ones with `capture`, and proposes
a move for each. The operator accepts the batch or changes rows, and
the session writes it with one `moves` call.

<figure class="mp-fig">
<div class="mp-scroll">
<svg viewBox="0 0 720 390" role="img" aria-label="The operator asks a curation session to curate the oldest fifty signals. The session asks millpond's signals tool for fifty unmoved signals, reads the raw material of the unclear ones with the capture tool, and proposes drop eighteen, answered six, and join twenty-six into five items. The operator accepts, changing one row, and the session writes the batch with one moves call, as one commit. The next batch starts where this one ended.">
<defs>
<marker id="mp-cu-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="mp-hd"/></marker>
<marker id="mp-cu-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="mp-hd-a"/></marker>
</defs>
<rect x="30" y="14" width="120" height="44" rx="8" class="mp-bx"/>
<text x="90" y="41" class="mp-t" text-anchor="middle">The operator</text>
<rect x="250" y="14" width="160" height="44" rx="8" class="mp-bx"/>
<text x="330" y="33" class="mp-t" text-anchor="middle">Curation session</text>
<text x="330" y="50" class="mp-ts" text-anchor="middle">the curate skill</text>
<rect x="530" y="14" width="140" height="44" rx="8" class="mp-bx-mp"/>
<text x="600" y="33" class="mp-t" text-anchor="middle">millpond</text>
<text x="600" y="50" class="mp-ts" text-anchor="middle">its MCP tools</text>
<line x1="90" y1="58" x2="90" y2="352" class="mp-ar-d"/>
<line x1="330" y1="58" x2="330" y2="352" class="mp-ar-d"/>
<line x1="600" y1="58" x2="600" y2="352" class="mp-ar-d"/>
<line x1="90" y1="96" x2="326" y2="96" class="mp-ar-a" marker-end="url(#mp-cu-a)"/>
<text x="100" y="88" class="mp-ts">curate the oldest fifty</text>
<line x1="330" y1="134" x2="596" y2="134" class="mp-ar" marker-end="url(#mp-cu-m)"/>
<text x="340" y="126" class="mp-tm">signals: unmoved, oldest, 50</text>
<line x1="600" y1="172" x2="334" y2="172" class="mp-ar-d" marker-end="url(#mp-cu-m)"/>
<text x="360" y="164" class="mp-ts">fifty signals with their excerpts</text>
<line x1="330" y1="210" x2="596" y2="210" class="mp-ar" marker-end="url(#mp-cu-m)"/>
<text x="340" y="202" class="mp-tm">capture: the unclear ones</text>
<line x1="330" y1="252" x2="94" y2="252" class="mp-ar-a" marker-end="url(#mp-cu-a)"/>
<text x="104" y="230" class="mp-ts">proposes: drop 18, answered 6,</text>
<text x="104" y="244" class="mp-ts">join 26 into 5 items</text>
<line x1="90" y1="294" x2="326" y2="294" class="mp-ar-a" marker-end="url(#mp-cu-a)"/>
<text x="100" y="286" class="mp-ts">accepts, changing one row</text>
<line x1="330" y1="334" x2="596" y2="334" class="mp-ar" marker-end="url(#mp-cu-m)"/>
<text x="340" y="326" class="mp-tm">moves: the batch, one commit</text>
<text x="30" y="378" class="mp-ts">The next batch starts where this one ended.</text>
</svg>
</div>
<figcaption>The session proposes a move for each of fifty signals, the operator accepts the batch or changes rows, and one <code>moves</code> call writes it as one commit. The operator judges a proposal, never a signal at a time.</figcaption>
</figure>

A batch is the operator's unit of attention. The session does the
reading, and the operator does the deciding: one decision per batch,
and per item that the batch proposes (109). The next batch starts where
that one ended.

## The operator's surfaces

The operator curates from whichever surface is at hand, and each reads
and writes through the same tools:

- **millpond's Claude Code plugin** holds the curate and read skills
  and starts `millpond mcp`.
- **millpond's herdr plugin** shows the count and age of unmoved
  signals by source (118), lets the operator review a proposed batch
  row by row, and sends an item with one key.
- **crew's rail** shows an inbox crew keeps, one decision per item
  (109).
