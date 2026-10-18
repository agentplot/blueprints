# Prompt delivery

A stage begins when its agent has its prompt. flume starts the agent,
waits until it accepts input, sends the prompt, and then reads the
agent's transcript to see that the prompt arrived. A prompt shown typed
in a pane proves nothing, and text left in a pane for a hand to submit
is never a stage's state (`teams.15`).

## A fresh agent for each stage

Every stage starts a fresh agent, once the place's previous agent has
ended (`teams.2`). flume never starts an agent over one still running
in the place, since a start typed into a running agent's pane lands as
text in its conversation.

A fresh agent carries nothing from the stage before it except what the
place holds: the commits, the files, and the deliverable the stage
before it left. Each stage's prompt names what the stage starts from.

The agent starts in a herdr pane, or as a command flume prints for the
operator to run.

## Taken, or sent again

1. flume starts the stage's agent.
2. It waits until the agent accepts input. An agent still starting is
   slow, never failed.
3. It sends the prompt.
4. It reads the agent's transcript. When the transcript holds the
   prompt within a short time, the prompt is taken, and the stage has
   begun.
5. When it does not, flume sends the prompt once more and reads again.
6. When the second sending is not taken either, flume reports the stage
   as never started.

<figure class="fl-fig">
<div class="fl-scroll">
<svg viewBox="0 0 720 280" role="img" aria-label="flume starts a fresh agent, waits until it accepts input, sends the prompt and reads the agent's transcript. A transcript that holds the prompt means the stage began. One that does not gets the prompt once more; a second sending not taken either means the stage never started. A transcript not yet written is unknown, and flume watches it until it tells.">
<defs>
<marker id="fl-p-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd"/></marker>
<marker id="fl-p-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd-a"/></marker>
</defs>
<rect x="10" y="110" width="120" height="64" rx="9" class="fl-bx"/>
<text x="24" y="136" class="fl-t">Start the</text>
<text x="24" y="154" class="fl-t">agent</text>
<line x1="130" y1="142" x2="156" y2="142" class="fl-ar" marker-end="url(#fl-p-m)"/>
<rect x="160" y="110" width="120" height="64" rx="9" class="fl-bx"/>
<text x="174" y="136" class="fl-t">Accepts input</text>
<text x="174" y="156" class="fl-ts">slow is not failed</text>
<line x1="280" y1="142" x2="306" y2="142" class="fl-ar" marker-end="url(#fl-p-m)"/>
<rect x="310" y="110" width="120" height="64" rx="9" class="fl-bx"/>
<text x="324" y="136" class="fl-t">Send the</text>
<text x="324" y="154" class="fl-t">prompt</text>
<line x1="430" y1="142" x2="456" y2="142" class="fl-ar-a" marker-end="url(#fl-p-a)"/>
<rect x="460" y="110" width="130" height="64" rx="9" class="fl-bx-hl"/>
<text x="474" y="136" class="fl-t">Read the</text>
<text x="474" y="154" class="fl-t">transcript</text>
<rect x="430" y="20" width="170" height="52" rx="9" class="fl-bx-dash"/>
<text x="444" y="42" class="fl-t">No transcript yet</text>
<text x="444" y="60" class="fl-ts">unknown, watched</text>
<line x1="525" y1="110" x2="525" y2="76" class="fl-ar-d" marker-end="url(#fl-p-m)"/>
<rect x="620" y="20" width="92" height="96" rx="9" class="fl-bx-fl"/>
<text x="634" y="46" class="fl-t">Began</text>
<text x="634" y="66" class="fl-ts">the prompt</text>
<text x="634" y="82" class="fl-ts">is taken</text>
<line x1="600" y1="46" x2="616" y2="46" class="fl-ar-d" marker-end="url(#fl-p-m)"/>
<path d="M590,128 L604,128 L604,98 L616,98" class="fl-ar-a" marker-end="url(#fl-p-a)"/>
<rect x="620" y="150" width="92" height="76" rx="9" class="fl-bx-dash"/>
<text x="634" y="174" class="fl-t">Never</text>
<text x="634" y="192" class="fl-t">started</text>
<text x="634" y="212" class="fl-ts">reported</text>
<path d="M590,158 L604,158 L604,186 L616,186" class="fl-ar" marker-end="url(#fl-p-m)"/>
<path d="M525,174 L525,240 L370,240 L370,178" class="fl-ar-d" marker-end="url(#fl-p-m)"/>
<text x="384" y="262" class="fl-ts">not taken: sent once more, then read again</text>
<text x="606" y="244" class="fl-ts">not taken twice</text>
</svg>
</div>
<figcaption>flume believes the transcript, never the pane. A prompt the transcript lacks is sent once more, a start it cannot yet read is watched, and only a second sending not taken reports the stage as never started.</figcaption>
</figure>

The transcript is the agent's own record of what it was given. herdr
reads the pane's screen, and a screen shows what was typed into the
pane, whether or not the agent received it. So flume confirms a prompt
in the transcript and nowhere else.

A start flume cannot read is unknown: no transcript yet, as when the
agent is still starting on a loaded host. flume watches it until the
transcript tells. A working agent whose transcript holds its prompt is
a stage that began, however long the start took (`teams.15`).

## A tell

A tell is more text for a place's agent: the operator's answer to what
it needs, or a caller's note. `flume tell` reaches the agent as a
prompt or not at all (`teams.11`).

- **An agent that is not up** is reported, and the tell fails with
  nothing typed.
- **An agent waiting on a question in its pane** is reported the same
  way, since text typed into a question's dialog never reaches the
  agent. flume reads two things before it types: herdr's state for the
  pane, and the agent's own record that it asked a question still
  unanswered.
- **A tell that goes through** is confirmed in the transcript, as a
  stage's prompt is.

## Ending an agent

`flume stop` ends a place's agent. It fails, rather than report
success, when the agent did not exit, and it ends a working agent only
with `--force` (`teams.2`). flume itself ends a stage's agent that
delivered, before the next stage starts
([A stage ends on its deliverable](stage-ends.md)).
