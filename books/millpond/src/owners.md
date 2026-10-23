# Who owns what

Each part of capture owns one job and never reaches into another's.
Each format and rule is written once and used by every part that needs
it.

## Each part's job

| Part | Owns | Never |
|---|---|---|
| An adapter | One source. It lists the source's events, keys each one, fetches the raw material, and marks a capture that is its own excerpt. | Writes records, keeps a list of what it reported, cuts an excerpt, or reads a capture into signals (115). |
| headwater | Releases and advisories for what a repository declares. It stands alone with its Claude Code and herdr plugins, and its Flywheel plugin holds an adapter part. | Knows which inbox records its releases. |
| eddy | Recorded meetings across meeting services, with a part per service. It stands alone as headwater does. | Reads a meeting into signals. |
| millpond | Runs adapters and takes the capture contract. Dedupes by key, banks raw material, and writes each capture, plus the one signal of a capture that is its own excerpt. Keeps the inbox, checks a reader's excerpts, writes moves and items, records each send and its outcome, and records each run. | Judges what a capture says, starts an agent, or plans across items. |
| flume | Places on the host it runs on: makes a worktree ready, starts each stage's agent in it with its prompt confirmed, moves on when the stage's deliverable exists, and tidies the place. Reports each place's state. | Decides what to launch, plans across items, or lands anything itself. |
| A reader, a session | Reads a capture that is not its own excerpt into signals, through millpond (113, 217e). | Lists a source. |
| Curation, a session | Proposes one move per signal, in batches, through millpond's tools (116). | Writes captures or signals. |
| sounding | One question in one session, in a worktree of its own, ending on a conclusion. It offers each finding beyond its question to millpond as a capture. | Lands code, writes the inbox except through millpond, or plans across items. |
| The operator | Accepts or changes each batch of moves, sends an item, and decides each conclusion. | Picks through signals one at a time. |
| crew | Teams, plans and bolts. Its planner turns items into chores and units across teams. | Writes an inbox's records except through millpond. |
| sluice | Tests a change as merged and lands it. | Knows where the change came from. |
| The fleet | Says which adapter part runs for which inbox, on which host, and when. Hands headwater the pins that only Nix can read. Watches every run from the doctor. | Runs an adapter's logic itself. |

## Code built once

<figure class="mp-fig">
<div class="mp-scroll">
<svg viewBox="0 0 720 330" role="img" aria-label="weir holds the shared crates: capture, signals, the built-in adapters, cadence and the conformance pack, and later Flywheel's host on the same crates. millpond, headwater, eddy and anyone's meeting plugins depend on those crates at a tag. crew, in standard-library Python, calls millpond's command line.">
<defs>
<marker id="mp-ow-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="mp-hd"/></marker>
<marker id="mp-ow-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="mp-hd-a"/></marker>
</defs>
<rect x="196" y="16" width="516" height="152" rx="10" class="mp-bx-mp"/>
<text x="212" y="44" class="mp-tb">weir</text>
<text x="350" y="44" class="mp-ts">the formats and rules, written once</text>
<rect x="212" y="62" width="156" height="44" rx="6" class="mp-bx"/>
<text x="222" y="80" class="mp-tm">capture</text>
<text x="222" y="97" class="mp-ts">contract, keys, cut</text>
<rect x="380" y="62" width="156" height="44" rx="6" class="mp-bx"/>
<text x="390" y="80" class="mp-tm">signals</text>
<text x="390" y="97" class="mp-ts">records, moves, inbox</text>
<rect x="548" y="62" width="156" height="44" rx="6" class="mp-bx"/>
<text x="558" y="80" class="mp-tm">adapters</text>
<text x="558" y="97" class="mp-ts">the built-in adapters</text>
<rect x="212" y="114" width="156" height="44" rx="6" class="mp-bx"/>
<text x="222" y="132" class="mp-tm">cadence</text>
<text x="222" y="149" class="mp-ts">five-field cron</text>
<rect x="380" y="114" width="156" height="44" rx="6" class="mp-bx"/>
<text x="390" y="132" class="mp-tm">conformance pack</text>
<text x="390" y="149" class="mp-ts">lines in, records out</text>
<text x="558" y="132" class="mp-ts">and later Flywheel's</text>
<text x="558" y="149" class="mp-ts">host, on these crates</text>
<rect x="8" y="40" width="160" height="80" rx="9" class="mp-bx"/>
<text x="22" y="66" class="mp-tb">crew</text>
<text x="22" y="88" class="mp-ts">standard-library</text>
<text x="22" y="104" class="mp-ts">Python</text>
<line x1="88" y1="120" x2="88" y2="212" class="mp-ar" marker-end="url(#mp-ow-m)"/>
<text x="96" y="160" class="mp-ts">calls its</text>
<text x="96" y="176" class="mp-ts">command line</text>
<rect x="8" y="216" width="170" height="100" rx="9" class="mp-bx-mp"/>
<text x="22" y="242" class="mp-tb">millpond</text>
<text x="22" y="262" class="mp-ts">the inbox binary</text>
<text x="22" y="284" class="mp-tm">plugins/claude</text>
<text x="22" y="300" class="mp-tm">plugins/herdr</text>
<rect x="196" y="216" width="164" height="100" rx="9" class="mp-bx"/>
<text x="210" y="242" class="mp-tb">headwater</text>
<text x="210" y="262" class="mp-ts">dependencies</text>
<text x="210" y="290" class="mp-tm">plugins/flywheel</text>
<rect x="372" y="216" width="164" height="100" rx="9" class="mp-bx"/>
<text x="386" y="242" class="mp-tb">eddy</text>
<text x="386" y="262" class="mp-ts">meetings</text>
<text x="386" y="290" class="mp-tm">plugins/flywheel</text>
<rect x="548" y="216" width="164" height="100" rx="9" class="mp-bx-dash"/>
<text x="562" y="242" class="mp-tb">Meeting plugins</text>
<text x="562" y="262" class="mp-ts">from anyone, passing</text>
<text x="562" y="280" class="mp-ts">the meeting checks</text>
<path d="M150,216 L150,196 L240,196 L240,172" class="mp-ar-a" marker-end="url(#mp-ow-a)"/>
<line x1="278" y1="216" x2="278" y2="172" class="mp-ar-a" marker-end="url(#mp-ow-a)"/>
<line x1="454" y1="216" x2="454" y2="172" class="mp-ar-a" marker-end="url(#mp-ow-a)"/>
<line x1="630" y1="216" x2="630" y2="172" class="mp-ar-d" marker-end="url(#mp-ow-m)"/>
<text x="292" y="198" class="mp-tl">depend on the crates</text>
</svg>
</div>
<figcaption>Each format and rule is written once, in weir. millpond, headwater and eddy depend on its crates at a tag and prove themselves against its conformance pack. crew stays standard-library Python and reaches signals only through millpond's command line.</figcaption>
</figure>

| Part | Built in | Used by |
|---|---|---|
| The contract's types and key rules, JSON in flight and rec at rest, a sha256 content hash, and the excerpt cut | weir's capture crate | millpond, Flywheel, headwater's and eddy's adapter parts |
| The signal, move and item records and the inbox's layout | weir's signals crate | millpond, Flywheel |
| The folder drop, the meeting file and the signals-folder import | weir's adapters crate | millpond, Flywheel |
| Cadence: five-field cron, caught up once | weir's cadence | `millpond tick`, Flywheel's tick |
| The conformance pack: lines in, records expected | weir | millpond and Flywheel as hosts, every adapter part |
| Raw banking with a host-qualified pointer, the checks on a capture, and the verbatim check on a reader's excerpt | millpond, from crew's checks | Flywheel, for 217h and 217e |
| Finding releases and reading their notes | swancloud's release adapter | headwater's lookups and its Flywheel plugin |
| One question, one session, one conclusion: the question, its rounds and the conclusion's shape | sounding, from crew ADR 0019 | crew, Flywheel's elaborations |
| Places, a fresh agent per stage, prompt delivery, stages that end on their deliverable, and tidying | flume, from crew's `teams.2`–`4`, `teams.11`, `teams.15` and `plan.9`, `10`, `12`, `17` | millpond, headwater, sounding, crew |

The conformance pack is how a part proves it keeps the contract: a set
of contract lines and the records a host must write from them, with
the meeting checks a meeting part passes. millpond passes it as a host,
and so does Flywheel; headwater's, eddy's and anyone's adapter parts
pass it as adapters.

millpond keeps its own Claude Code and herdr plugins under `plugins/`
beside its core, as headwater and eddy keep theirs. Its built-in
adapters are commands of its own, so it has no Flywheel plugin.
