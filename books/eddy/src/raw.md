# A meeting's raw files

A part writes each meeting's transcript twice, under the raw directory
millpond hands it: once as the service served it, and once as a plain
copy with one line per turn. The capture line names both files in its
`raw` field. Neither file enters git.

## Two files

- **The transcript as served** is the service's own form, whole:
  whatever structure, speaker labels and timings the service gave. It
  keeps everything the service recorded, so a later reading loses
  nothing to a conversion eddy made.
- **The plain copy** has one line per turn, a turn being what one
  speaker says before the next speaker starts. Every part writes the
  same plain shape, so a reader meets one form of transcript whatever
  service recorded the meeting.

The layout is shared code, so `wispr`, `webex` and `teams` lay a
meeting out the same way, and a part added later inherits it.

## The line goes to git, the files stay on the host

A capture line is small. It holds what millpond checks and what enters
git as the capture: the key, the source, `event_at`, the title, the
`url` and the names of the raw files. A raw file is the material, and a
long meeting's transcript runs to megabytes.

<figure class="fig">
<div class="scroll">
<svg viewBox="0 0 760 320" role="img" aria-labelledby="fr-t fr-d">
<title id="fr-t">A meeting's line and its raw files</title>
<desc id="fr-d">A part prints one capture line and writes two raw files for a meeting. The line becomes an unread capture in the inbox, in git, which curation, crew and herdr's pane read. The two files, the transcript as served and a plain copy with one line per turn, go to the host's raw bank under the capture's name, never into git. The capture points at them as host and path. A reader session, millpond's verbatim check and a person following the pointer read the raw files.</desc>
<defs>
<marker id="fr-h" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hd"/></marker>
<marker id="fr-ha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hd-a"/></marker>
</defs>
<rect x="12" y="126" width="130" height="74" rx="8" class="bx"/>
<text x="24" y="150" class="t">A part</text>
<text x="24" y="169" class="ts">prints one line,</text>
<text x="24" y="185" class="ts">writes two files</text>
<path d="M142,145 L176,92" class="ar-a" marker-end="url(#fr-ha)"/>
<path d="M142,182 L176,236" class="ar" marker-end="url(#fr-h)"/>
<rect x="180" y="40" width="200" height="86" rx="8" class="bx"/>
<text x="192" y="63" class="t">The capture line</text>
<text x="192" y="83" class="ts">key, source, event_at,</text>
<text x="192" y="99" class="ts">title, url, the files' names</text>
<text x="192" y="115" class="ts">small: one per meeting</text>
<rect x="180" y="200" width="200" height="100" rx="8" class="bx"/>
<text x="192" y="223" class="t">Two raw files</text>
<text x="192" y="243" class="ts">the transcript as served</text>
<text x="192" y="259" class="ts">a plain copy, one line per turn</text>
<text x="192" y="275" class="ts">up to megabytes</text>
<line x1="380" y1="83" x2="416" y2="83" class="ar-a" marker-end="url(#fr-ha)"/>
<line x1="380" y1="250" x2="416" y2="250" class="ar" marker-end="url(#fr-h)"/>
<rect x="420" y="40" width="160" height="86" rx="8" class="bx-acc"/>
<text x="432" y="63" class="t">The inbox, in git</text>
<text x="432" y="83" class="ts">an unread capture,</text>
<text x="432" y="99" class="ts">no excerpt</text>
<rect x="420" y="200" width="160" height="100" rx="8" class="bx"/>
<text x="432" y="223" class="t">The raw bank</text>
<text x="432" y="243" class="ts">on the host, under</text>
<text x="432" y="259" class="ts">the capture's name;</text>
<text x="432" y="275" class="ts">never in git</text>
<path d="M500,126 L500,196" class="ar-d" marker-end="url(#fr-h)"/>
<text x="508" y="166" class="tm">&lt;host&gt;:&lt;path&gt;</text>
<line x1="580" y1="83" x2="606" y2="83" class="ar" marker-end="url(#fr-h)"/>
<line x1="580" y1="250" x2="606" y2="250" class="ar" marker-end="url(#fr-h)"/>
<rect x="610" y="40" width="138" height="86" rx="8" class="bx-soft"/>
<text x="622" y="60" class="th">READ BY</text>
<text x="622" y="80" class="ts">curation</text>
<text x="622" y="96" class="ts">crew and its planner</text>
<text x="622" y="112" class="ts">herdr's inbox pane</text>
<rect x="610" y="200" width="138" height="100" rx="8" class="bx-soft"/>
<text x="622" y="220" class="th">READ BY</text>
<text x="622" y="240" class="ts">a reader session</text>
<text x="622" y="256" class="ts">the verbatim check</text>
<text x="622" y="272" class="ts">a person following</text>
<text x="622" y="288" class="ts">the pointer</text>
</svg>
</div>
<figcaption>A part's line becomes the capture in git, and its two files go to the host's raw bank, which the capture points at. A meeting's words never reach GitHub: only a reader, millpond's verbatim check and a person following the pointer read them.</figcaption>
</figure>

Only millpond reads the line ([landing a capture](../millpond/landing.html)).
It writes the capture into the inbox, in
git, banks the raw files in the host's raw bank under the capture's
name, and gives the capture a pointer of the form `<host>:<path>`
(217h). Raw transcripts stay outside version control, and the capture
cites them (111), so a meeting's words never reach GitHub with the
record.

A hosted Flywheel adds one rule: raw material a capture points at is
never read on a host serving more than one flywheel. A reading that
must follow the pointer runs on the operator's own machine or a pool
host (263).

## Who reads them

Three readers use a meeting's raw files once millpond banks them:

- **A reader session.** A meeting capture has no excerpt, so its
  transcript is the reader's whole input. The reader's instructions
  are the inbox's data, never eddy's (119). They say what makes a
  signal, how to name a speaker a transcript leaves unnamed, and how
  the operator draws signals from a meeting.
- **millpond's verbatim check.** millpond refuses a signal whose
  excerpt does not appear verbatim in its capture's raw material, so
  every excerpt a reader takes from a meeting is a quote from one of
  these two files.
- **A person** following the capture's pointer to the transcript
  itself.

eddy writes the files and nothing about what they mean. A transcript
that leaves a speaker unnamed reaches the raw bank unnamed, and the
reader names the speaker by the inbox's instructions.
