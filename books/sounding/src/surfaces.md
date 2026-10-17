# The operator's surfaces

The operator works a sounding from whichever surface is at hand: the
command line, a Claude Code session, or herdr. sounding keeps one
plugin per host under `plugins/` beside its core, `plugins/claude` and
`plugins/herdr`, as millpond, headwater and eddy keep theirs.

## The command line

| Command | Run by | Does |
|---|---|---|
| `sounding open` | whoever asks: `/sound`, millpond's `send`, a herdr key, crew | Opens a sounding: its worktree on `sounding/<name>` and its `question.md`. |
| `sounding list` | anyone | Lists the open soundings. |
| `sounding conclude` | the session | Writes `conclusion.md` and ends the round. |
| `sounding offer` | the session | Hands a finding beyond the question to `millpond land` as a capture of its own (62). |
| `sounding ask` | the session | Puts a question only the operator can answer on a card, and waits. |
| `sounding accept` | the operator | Settles the item and turns the proposed work into items or plan entries. |
| `sounding go-on` | the operator | Starts the next round, with the operator's notes in the question. |
| `sounding drop` | the operator | Records the reason and removes the worktree. |

## The Claude Code plugin

- **`/sound <question>`** in every session opens a sounding while the
  session goes on with its own work.
- **A start hook** gives a sounding's session its question, its sources
  and its earlier rounds ([The question and its sources](question.md)).
- **The stop check** runs at the session's end
  ([The stop check and the timebox](bounds.md)).
- **MCP tools**, `soundings`, `conclusion`, `accept`, `go_on` and
  `drop`, let the operator list soundings, read a conclusion and decide
  it from any session.
- **A guard** refuses a sluice submission from a `sounding/*` branch
  ([The place](place.md)).

## The herdr plugin

- **The sidebar** lists the open soundings, each with its round and its
  state: working, waiting on the operator, or parked.
- **A workspace per sounding** holds the session's pane with its
  conclusion beside it.
- **Keys** start, open, accept, send back and drop a sounding, and open
  its conclusion in plannotator for notes.

<figure class="sd-fig">
<div class="sd-scroll">
<svg viewBox="0 0 720 320" role="img" aria-label="sounding's herdr plugin. A sidebar lists three open soundings, each with its round and state: one on round 1 waiting on the operator, one on round 2 working, one on round 1 parked. The selected sounding's workspace shows the session's pane on the left and its conclusion on the right: the answer, its evidence, what it would change, the work it proposes and what stays open. Keys along the bottom start, open, accept, send back and drop, and open the conclusion in plannotator for notes.">
<text x="10" y="22" class="sd-th">sidebar</text>
<text x="230" y="22" class="sd-th">the sounding's workspace</text>
<rect x="10" y="32" width="200" height="270" rx="10" class="sd-bx"/>
<text x="24" y="54" class="sd-th">open soundings</text>
<rect x="20" y="66" width="180" height="62" rx="7" class="sd-bx-sd"/>
<text x="32" y="86" class="sd-tm">take-library-5</text>
<text x="32" y="103" class="sd-ts">round 1</text>
<text x="32" y="119" class="sd-tl">waiting on the operator</text>
<rect x="20" y="136" width="180" height="62" rx="7" class="sd-chip"/>
<text x="32" y="156" class="sd-tm">retention-policy</text>
<text x="32" y="173" class="sd-ts">round 2</text>
<text x="32" y="189" class="sd-ts">working</text>
<rect x="20" y="206" width="180" height="62" rx="7" class="sd-chip"/>
<text x="32" y="226" class="sd-tm">cache-layout</text>
<text x="32" y="243" class="sd-ts">round 1</text>
<text x="32" y="259" class="sd-ts">parked</text>
<rect x="230" y="32" width="482" height="270" rx="10" class="sd-bx-hl"/>
<rect x="246" y="48" width="220" height="190" rx="7" class="sd-chip"/>
<text x="260" y="72" class="sd-t">The session's pane</text>
<text x="260" y="96" class="sd-ts">the round's session,</text>
<text x="260" y="114" class="sd-ts">its offers and asks,</text>
<text x="260" y="132" class="sd-ts">and its conclude</text>
<rect x="482" y="48" width="214" height="190" rx="7" class="sd-bx-sd"/>
<text x="496" y="72" class="sd-tm">conclusion.md</text>
<text x="496" y="98" class="sd-ts">the answer</text>
<text x="496" y="118" class="sd-ts">its evidence</text>
<text x="496" y="138" class="sd-ts">what it would change</text>
<text x="496" y="158" class="sd-ts">the work it proposes</text>
<text x="496" y="178" class="sd-ts">what stays open</text>
<rect x="246" y="254" width="54" height="30" rx="6" class="sd-chip"/>
<text x="256" y="274" class="sd-tm">start</text>
<rect x="306" y="254" width="50" height="30" rx="6" class="sd-chip"/>
<text x="316" y="274" class="sd-tm">open</text>
<rect x="362" y="254" width="62" height="30" rx="6" class="sd-chip"/>
<text x="372" y="274" class="sd-tm">accept</text>
<rect x="430" y="254" width="88" height="30" rx="6" class="sd-chip"/>
<text x="440" y="274" class="sd-tm">send back</text>
<rect x="524" y="254" width="50" height="30" rx="6" class="sd-chip"/>
<text x="534" y="274" class="sd-tm">drop</text>
<rect x="580" y="254" width="116" height="30" rx="6" class="sd-chip"/>
<text x="590" y="274" class="sd-tm">plannotator</text>
</svg>
</div>
<figcaption>The sidebar shows every open sounding's round and state. The selected sounding's workspace puts the session beside its conclusion, and the keys decide it there or open it in plannotator for notes.</figcaption>
</figure>

Send back is go on: it starts the next round, and the operator's notes
join its question ([Deciding a conclusion](deciding.md)).

## Two ways to run

- **Unattended**, the session works alone, and the round ends on a
  card for the operator.
- **With the operator**, `--with-me`, the session runs in a pane beside
  the operator as a conversation.
