# Reading

Listing events is arithmetic, and turning a capture into signals is
judgment (115). millpond does the arithmetic. A model runs in two
places only: a reader, which writes a capture's signals, and a curation
session, which gives each signal its move. Each is a Claude session
working through millpond's tools.

## The tools

millpond serves its tools over MCP as `millpond mcp`:

| Tool | Does |
|---|---|
| `signals` | Lists signals by state, source, age, capture or subject. |
| `capture` | Reads a capture and its raw material. |
| `read` | Writes a capture's signals. millpond refuses one whose excerpt does not appear verbatim in the capture's raw material. |
| `moves` | Writes a batch of moves in one commit. |
| `items` | Lists items with their signals, briefs and sends. |
| `brief` | Writes an item's brief. |
| `send` | Sends an item to a worktree. |

A session reaches the inbox through these tools and nothing else. It
never edits a record file, so every write passes millpond's checks and
takes the inbox's lock.

## Two paths to a signal

<figure class="mp-fig">
<div class="mp-scroll">
<svg viewBox="0 0 720 250" role="img" aria-label="A capture lands once, by key. If its line carries an excerpt, as a release's does, millpond writes one signal at once, cut at a line. If not, as with a meeting, the capture is unread until a reader session writes its signals, each excerpt checked verbatim. Both paths end in unmoved signals that wait, oldest first, for curation.">
<defs>
<marker id="mp-rd-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="mp-hd"/></marker>
<marker id="mp-rd-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="mp-hd-a"/></marker>
</defs>
<rect x="8" y="98" width="124" height="56" rx="9" class="mp-bx"/>
<text x="22" y="122" class="mp-t">Captured</text>
<text x="22" y="140" class="mp-ts">once, by key</text>
<line x1="132" y1="126" x2="154" y2="126" class="mp-ar" marker-end="url(#mp-rd-m)"/>
<rect x="158" y="98" width="140" height="56" rx="28" class="mp-bx-hl"/>
<text x="178" y="122" class="mp-t">Own excerpt?</text>
<text x="178" y="140" class="mp-ts">the line says so</text>
<path d="M228,98 L228,48 L316,48" class="mp-ar-a" marker-end="url(#mp-rd-a)"/>
<text x="236" y="76" class="mp-tl">yes: a release</text>
<path d="M228,154 L228,204 L316,204" class="mp-ar" marker-end="url(#mp-rd-m)"/>
<text x="236" y="184" class="mp-tl">no: a meeting</text>
<rect x="320" y="20" width="170" height="56" rx="9" class="mp-bx"/>
<text x="334" y="44" class="mp-t">One signal</text>
<text x="334" y="62" class="mp-ts">at once, cut at a line</text>
<rect x="320" y="176" width="170" height="56" rx="9" class="mp-bx"/>
<text x="334" y="200" class="mp-t">Unread</text>
<text x="334" y="218" class="mp-ts">charges a reader</text>
<line x1="490" y1="204" x2="516" y2="204" class="mp-ar" marker-end="url(#mp-rd-m)"/>
<rect x="520" y="176" width="192" height="56" rx="9" class="mp-bx"/>
<text x="534" y="200" class="mp-t">Reader session</text>
<text x="534" y="218" class="mp-ts">excerpts checked verbatim</text>
<line x1="490" y1="48" x2="516" y2="48" class="mp-ar" marker-end="url(#mp-rd-m)"/>
<rect x="520" y="20" width="192" height="56" rx="9" class="mp-bx-mp"/>
<text x="534" y="44" class="mp-t">Unmoved signals</text>
<text x="534" y="62" class="mp-ts">oldest first, for curation</text>
<line x1="616" y1="176" x2="616" y2="80" class="mp-ar" marker-end="url(#mp-rd-m)"/>
<text x="624" y="132" class="mp-ts">its signals</text>
</svg>
</div>
<figcaption>A release is its own excerpt, so millpond writes its one signal as it lands. A meeting is not, so it waits unread until a reader session writes its signals. From there both take the same path.</figcaption>
</figure>

A signal carries its capture, a kind from a fixed set (constraint, ask,
question, commitment, reaction), who asserted it, its subject tags, the
assertion in a sentence, the verbatim excerpt with its position, and
the claims it argues with when any exist. A signal never changes once
written (113).

## A reader

A reader takes unread captures oldest first and writes their signals
with `read` (113). Three things start one:

- the user, with the read skill in a Claude Code session;
- the inbox's tick, with the command its settings name;
- crew's reader, in an inbox crew keeps.

The reader's instructions are the inbox's data (119): what makes a
signal, how to name a speaker a transcript leaves unnamed, and the
extraction rules the existing meeting pipeline wrote down. Changing how
an inbox reads is an edit to its data, never to millpond.

A meeting recorded twice gives two captures, since each recording has
its own key. Its reader reads them together and writes the second's
signals once.

## The verbatim check

`read` refuses a signal whose excerpt does not appear verbatim in its
capture's raw material. The check holds a reader to quoting: an
excerpt is the source's own words, so a person who follows the pointer
finds them where the signal says they are.
