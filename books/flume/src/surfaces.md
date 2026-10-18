# The operator's surfaces

The operator works flume from whichever surface is at hand: the
command line, a Claude Code session, or herdr. flume keeps one plugin
per host under `plugins/` beside its core, `plugins/claude` and
`plugins/herdr`, as millpond and sounding keep theirs.

## The command line

| Command | Run by | Does |
|---|---|---|
| `flume launch` | the operator, millpond, headwater, sounding, crew | Makes a place for a repository, a kind, a brief and a name, makes it ready, and starts its first stage. |
| `flume status` | anyone | Reports each place's kind, stage, agent, deliverable and submission, and a change's tasks ticked. `--json` gives the same to callers. |
| `flume tell` | the operator, a caller | Sends text to a place's agent as a prompt, or fails with nothing typed ([Prompt delivery](prompts.md#a-tell)). |
| `flume stop` | the operator, a caller | Ends a place's agent. Fails when the agent did not exit, and ends a working agent only with `--force`. |
| `flume retry` | the operator, a caller | Starts a place's stage again, with a fresh agent and its prompt. |
| `flume tidy` | the operator, a caller | Removes each place whose work landed or was dropped, and keeps a branch that holds commits its target lacks ([Tidying](tidying.md)). |

## The Claude Code plugin

- **`/launch <brief>`** in every session launches the brief, while the
  session goes on with its own work.
- **`status` over MCP** lets any session read where each place stands.

## The herdr plugin

- **The sidebar** shows every place in flight, with its kind, its stage
  and its agent's state, and a change's tasks ticked.
- **Keys** open a place's pane, tell its agent, stop it and retry its
  stage, and launch from herdr.
- **A sounding waiting on the operator** shows as a row there, since
  soundings share flume's sidebar
  ([sounding's surfaces](../sounding/surfaces.html)).

<figure class="fl-fig">
<div class="fl-scroll">
<svg viewBox="0 0 720 330" role="img" aria-label="flume's herdr plugin. The sidebar lists four places in flight: a fix at its submission stage, working; a change at code with five of eight tasks ticked, working; a fix at code, waiting, its agent having said what it needs; and a sounding's question, waiting on the operator. The selected place's pane holds the stage's agent. Keys along the bottom launch, open, tell, stop and retry.">
<text x="10" y="22" class="fl-th">sidebar</text>
<text x="270" y="22" class="fl-th">the selected place</text>
<rect x="10" y="32" width="240" height="286" rx="10" class="fl-bx"/>
<text x="24" y="54" class="fl-th">places in flight</text>
<rect x="20" y="64" width="220" height="56" rx="7" class="fl-chip"/>
<text x="32" y="84" class="fl-tm">fix--bump-parser</text>
<text x="32" y="104" class="fl-ts">submission · working</text>
<rect x="20" y="126" width="220" height="56" rx="7" class="fl-bx-fl"/>
<text x="32" y="146" class="fl-tm">change--retention</text>
<text x="32" y="166" class="fl-ts">code · 5 of 8 tasks · working</text>
<rect x="20" y="188" width="220" height="56" rx="7" class="fl-chip"/>
<text x="32" y="208" class="fl-tm">fix--flaky-retry</text>
<text x="32" y="228" class="fl-tl">code · waiting</text>
<rect x="20" y="250" width="220" height="56" rx="7" class="fl-bx-sd"/>
<text x="32" y="270" class="fl-tm">take-library-5</text>
<text x="32" y="290" class="fl-tl-sd">waiting on the operator</text>
<rect x="270" y="32" width="442" height="286" rx="10" class="fl-bx-hl"/>
<rect x="286" y="48" width="410" height="196" rx="7" class="fl-chip"/>
<text x="300" y="72" class="fl-t">The stage's agent</text>
<text x="300" y="96" class="fl-tm">places/change--retention</text>
<text x="300" y="120" class="fl-ts">the code stage's session, a fresh agent,</text>
<text x="300" y="138" class="fl-ts">ticking the change's tasks as it works</text>
<rect x="300" y="160" width="380" height="8" rx="4" class="fl-chip"/>
<rect x="300" y="160" width="238" height="8" rx="4" class="fl-dot"/>
<text x="300" y="190" class="fl-ts">5 of 8 tasks ticked</text>
<rect x="286" y="262" width="72" height="34" rx="6" class="fl-chip"/>
<text x="298" y="284" class="fl-tm">launch</text>
<rect x="366" y="262" width="62" height="34" rx="6" class="fl-chip"/>
<text x="378" y="284" class="fl-tm">open</text>
<rect x="436" y="262" width="62" height="34" rx="6" class="fl-chip"/>
<text x="448" y="284" class="fl-tm">tell</text>
<rect x="506" y="262" width="62" height="34" rx="6" class="fl-chip"/>
<text x="518" y="284" class="fl-tm">stop</text>
<rect x="576" y="262" width="70" height="34" rx="6" class="fl-chip"/>
<text x="588" y="284" class="fl-tm">retry</text>
</svg>
</div>
<figcaption>The sidebar shows each place's stage and its agent's state, with a change's tasks and a sounding that waits on the operator among them. The keys act on the selected place.</figcaption>
</figure>

## Where a stage's agent runs

Each stage's agent runs in a herdr pane, where the herdr plugin shows
it and its keys reach it. Where herdr is not running, flume prints the
command that starts the agent, for the operator to run. Either way flume confirms
the prompt in the agent's transcript and reads the stage's end from
its deliverable ([Prompt delivery](prompts.md)).
