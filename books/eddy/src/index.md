# eddy

eddy lists recorded meetings across meeting services and fetches their
transcripts. It holds one part per service: `wispr` first, then
`webex` and `teams`. Each part lists the meetings its service recorded
since its cursor, keys each meeting, writes its transcript as raw
files, and prints one capture line per meeting. millpond takes those
lines and records each meeting once, as an unread capture in an inbox
([millpond's book](../millpond/)). No model runs while a part lists. A
meeting becomes signals later, when a reader session reads its
transcript (115).

<figure class="fig">
<div class="scroll">
<svg viewBox="0 0 760 350" role="img" aria-labelledby="fi-t fi-d">
<title id="fi-t">eddy in one pass</title>
<desc id="fi-d">Three meeting services, Wispr Flow, Webex and Microsoft Teams, each feed one of eddy's parts. A part lists recorded meetings and fetches each transcript, and prints capture lines that millpond checks, dedupes by key and banks. No model runs inside that listing. What a listing leaves is an unread capture in the inbox, in git, which points at the raw transcript in the host's raw bank, never in git. A reader session takes the unread capture later and writes its signals.</desc>
<defs>
<marker id="fi-h" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hd"/></marker>
<marker id="fi-ha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hd-a"/></marker>
<marker id="fi-ho" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hd-o"/></marker>
</defs>
<text x="12" y="22" class="th">SERVICES</text>
<text x="170" y="22" class="th">EDDY'S PARTS</text>
<text x="345" y="22" class="th">MILLPOND</text>
<text x="530" y="22" class="th">WHAT A LISTING LEAVES</text>
<rect x="152" y="34" width="350" height="238" rx="10" class="bx-dash"/>
<text x="166" y="262" class="tlo">a listing: arithmetic, and no model runs (115)</text>
<rect x="12" y="50" width="132" height="50" rx="8" class="bx"/>
<text x="24" y="71" class="t">Wispr Flow</text>
<text x="24" y="89" class="ts">MCP over HTTP</text>
<rect x="12" y="116" width="132" height="50" rx="8" class="bx"/>
<text x="24" y="137" class="t">Webex</text>
<text x="24" y="155" class="ts">transcripts API</text>
<rect x="12" y="182" width="132" height="50" rx="8" class="bx"/>
<text x="24" y="203" class="t">Microsoft Teams</text>
<text x="24" y="221" class="ts">Graph transcripts</text>
<line x1="144" y1="75" x2="166" y2="75" class="ar" marker-end="url(#fi-h)"/>
<line x1="144" y1="141" x2="166" y2="141" class="ar" marker-end="url(#fi-h)"/>
<line x1="144" y1="207" x2="166" y2="207" class="ar" marker-end="url(#fi-h)"/>
<rect x="170" y="50" width="130" height="50" rx="8" class="bx-acc"/>
<text x="182" y="71" class="tm">wispr</text>
<text x="182" y="89" class="ts">lists, fetches · first</text>
<rect x="170" y="116" width="130" height="50" rx="8" class="bx"/>
<text x="182" y="137" class="tm">webex</text>
<text x="182" y="155" class="ts">lists, fetches · later</text>
<rect x="170" y="182" width="130" height="50" rx="8" class="bx"/>
<text x="182" y="203" class="tm">teams</text>
<text x="182" y="221" class="ts">lists, fetches · later</text>
<path d="M300,75 L341,116" class="ar-a" marker-end="url(#fi-ha)"/>
<line x1="300" y1="141" x2="341" y2="141" class="ar-a" marker-end="url(#fi-ha)"/>
<path d="M300,207 L341,166" class="ar-a" marker-end="url(#fi-ha)"/>
<text x="305" y="134" class="tl">lines</text>
<rect x="345" y="96" width="140" height="90" rx="8" class="bx"/>
<text x="357" y="119" class="tm">millpond land</text>
<text x="357" y="139" class="ts">checks each line</text>
<text x="357" y="155" class="ts">dedupes by key</text>
<text x="357" y="171" class="ts">banks the raw files</text>
<path d="M485,122 L526,90" class="ar" marker-end="url(#fi-h)"/>
<path d="M485,160 L526,192" class="ar" marker-end="url(#fi-h)"/>
<rect x="530" y="50" width="218" height="64" rx="8" class="bx-acc"/>
<text x="542" y="73" class="t">Unread captures</text>
<text x="542" y="91" class="ts">the inbox, in git; no excerpt,</text>
<text x="542" y="106" class="ts">so no signal yet</text>
<path d="M600,114 L600,164" class="ar-d" marker-end="url(#fi-h)"/>
<text x="608" y="143" class="tm">&lt;host&gt;:&lt;path&gt;</text>
<rect x="530" y="168" width="218" height="64" rx="8" class="bx"/>
<text x="542" y="191" class="t">Raw transcripts</text>
<text x="542" y="209" class="ts">as served, and one line per turn;</text>
<text x="542" y="224" class="ts">the raw bank, never in git</text>
<path d="M748,82 L755,82 L755,300 L752,300" class="ar-o" marker-end="url(#fi-ho)"/>
<line x1="640" y1="232" x2="640" y2="266" class="ar-o" marker-end="url(#fi-ho)"/>
<rect x="530" y="270" width="218" height="64" rx="8" class="bx-ochre"/>
<text x="542" y="293" class="t">A reader, later</text>
<text x="542" y="311" class="ts">a session reads the transcript</text>
<text x="542" y="326" class="ts">and writes signals (113)</text>
<text x="166" y="304" class="ts">eddy's work ends when millpond holds the capture.</text>
<text x="166" y="321" class="ts">Reading a meeting is judgment, so a session does it.</text>
</svg>
</div>
<figcaption>A part lists one service's recorded meetings and fetches each transcript. millpond takes the lines, so each meeting lands once, as an unread capture whose transcript stays on the host. No model runs until a reader takes the capture later.</figcaption>
</figure>

## Why it exists

Decisions that should change a repository's work are often made in
meetings. Each meeting is recorded on whichever service hosted it, and
each service keeps its transcripts behind its own interface and its
own sign-in.

Two jobs stand between a recorded meeting and the work it should
change. Listing is arithmetic: which recordings exist, which are new
since the last listing, and when each meeting began. Reading is
judgment: which sentences commit someone to something, and who said
them. Flywheel's statement keeps the two apart. Enumerating source
events and writing captures runs unattended, and turning a capture into
signals is a session's judgment that never runs unattended (115).

eddy is the unattended half, for meetings. It knows every meeting
service it has a part for, and nothing of signals.

## What it promises

- **Each meeting lands once.** A part keys a meeting by its service
  and the meeting's own id, so every host and every run gives one
  meeting one key, and millpond keeps one capture per key (111).
- **A meeting counts from the day it was held.** A capture's
  `event_at` is when the meeting started, never when it was captured
  (118).
- **A meeting's words stay on the host.** The transcript is raw
  material. The capture points at it, and none of it enters git
  (111).
- **Every meeting reaches the inbox unread.** No meeting capture
  carries an excerpt, so millpond writes no signal for it and charges
  a reader instead (115).
- **One meeting never stops the rest.** A part names a meeting it
  failed to fetch in the run's last line and goes on to the next.

## Where it stops

eddy lists, fetches and prints. millpond writes each capture, banks
the raw files and keeps each part's cursor. eddy writes no record,
keeps no list of what it reported, cuts no excerpt and reads no
meeting into signals. Which inbox records a part's meetings, on which
host the part runs and how often are the host's to say, in millpond's
settings or a fleet's list. eddy never learns which inbox records its
meetings.

## Where it sits

headwater does for releases what eddy does for meetings
([headwater's book](../headwater/)). Each stands alone with its own
Claude Code and herdr plugins, and each carries a Flywheel plugin whose
adapter parts feed millpond. millpond is the inbox both of them print
into. Flywheel later runs the same parts on its tick and takes the
same lines (215, 231), and a part never knows which host ran it.

## How to read this book

The chapters are the design: eddy on its own, a part per service, what
every part shares, a meeting's raw files, running a part, and how
others add a service. A glossary and the open questions follow. Their
source is the capture design, `design/capture/design.md`. eddy has no
statement of invariants yet, so the book has no appendix. A number in
parentheses points into Flywheel's statement,
`design/flywheel-next/requirements.md`.
