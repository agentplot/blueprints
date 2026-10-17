# eddy on its own

eddy is a tool for meetings first and an adapter second. It stands alone
as headwater does: one core that lists and fetches meetings across
services, and one plugin per host beside the core. A person who
installs only eddy reads their meetings with it. A host that runs
millpond takes the same listings as captures through eddy's Flywheel
plugin.

<figure class="fig">
<div class="scroll">
<svg viewBox="0 0 760 270" role="img" aria-labelledby="fa-t fa-d">
<title id="fa-t">eddy's core and its three plugins</title>
<desc id="fa-d">eddy's core lists recorded meetings and fetches transcripts, and holds the code every part shares. Three plugins sit beside it. plugins/claude pulls a transcript into a Claude Code session. plugins/herdr shows the day's meetings in a pane. plugins/flywheel holds an adapter part per service, whose capture lines millpond runs, and Flywheel's tick later. Only the Flywheel plugin's parts reach an inbox.</desc>
<defs>
<marker id="fa-h" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hd"/></marker>
<marker id="fa-ha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hd-a"/></marker>
</defs>
<text x="12" y="20" class="th">THE CORE</text>
<text x="250" y="20" class="th">A PLUGIN PER HOST</text>
<text x="470" y="20" class="th">WHAT IT GIVES</text>
<rect x="12" y="72" width="196" height="118" rx="9" class="bx-acc"/>
<text x="26" y="98" class="tb">eddy's core</text>
<text x="26" y="120" class="ts">lists recorded meetings</text>
<text x="26" y="137" class="ts">fetches a transcript</text>
<text x="26" y="154" class="ts">per service it has a part for</text>
<text x="26" y="171" class="ts">the code every part shares</text>
<path d="M208,110 L246,62" class="ar" marker-end="url(#fa-h)"/>
<line x1="208" y1="131" x2="246" y2="131" class="ar" marker-end="url(#fa-h)"/>
<path d="M208,152 L246,202" class="ar-a" marker-end="url(#fa-ha)"/>
<rect x="250" y="34" width="176" height="56" rx="8" class="bx"/>
<text x="262" y="57" class="tm">plugins/claude</text>
<text x="262" y="76" class="ts">Claude Code</text>
<rect x="250" y="103" width="176" height="56" rx="8" class="bx"/>
<text x="262" y="126" class="tm">plugins/herdr</text>
<text x="262" y="145" class="ts">herdr</text>
<rect x="250" y="172" width="176" height="56" rx="8" class="bx-acc"/>
<text x="262" y="195" class="tm">plugins/flywheel</text>
<text x="262" y="214" class="ts">an adapter part per service</text>
<line x1="426" y1="62" x2="466" y2="62" class="ar" marker-end="url(#fa-h)"/>
<line x1="426" y1="131" x2="466" y2="131" class="ar" marker-end="url(#fa-h)"/>
<line x1="426" y1="200" x2="466" y2="200" class="ar-a" marker-end="url(#fa-ha)"/>
<rect x="470" y="34" width="278" height="56" rx="8" class="bx"/>
<text x="482" y="57" class="t">A transcript in a session</text>
<text x="482" y="76" class="ts">for a person asking about one meeting</text>
<rect x="470" y="103" width="278" height="56" rx="8" class="bx"/>
<text x="482" y="126" class="t">The day's meetings in a pane</text>
<text x="482" y="145" class="ts">across every service with a part</text>
<rect x="470" y="172" width="278" height="56" rx="8" class="bx-acc"/>
<text x="482" y="195" class="t">Capture lines for millpond</text>
<text x="482" y="214" class="ts">run by millpond, later by Flywheel's tick</text>
<text x="12" y="256" class="ts">Only the Flywheel plugin's parts reach an inbox. The other two write nothing anywhere.</text>
</svg>
</div>
<figcaption>eddy is one core with a plugin per host. A person reaches meetings through the Claude Code and herdr plugins. millpond reaches them through the Flywheel plugin's adapter parts, and only those parts print captures.</figcaption>
</figure>

## The core

The core knows each meeting service eddy has a part for: how to list
the meetings it recorded, and how to fetch one meeting's transcript.
It also holds the code every part shares: the key, the meeting's
details, the raw layout and the rule that skips a meeting too short to
hold anything. [What every part shares](shared.md) and
[A meeting's raw files](raw.md) describe it. Every plugin calls the
core, so the pane, the session and an adapter part all see the same
meetings under the same keys.

## The plugins

eddy keeps one plugin per host under `plugins/`, beside its core, as
headwater does:

| Plugin | Host | Gives |
|---|---|---|
| `plugins/claude` | Claude Code | pulls a meeting's transcript into a session |
| `plugins/herdr` | herdr | shows the day's meetings |
| `plugins/flywheel` | Flywheel, and millpond | one adapter part per meeting service |

A plugin is the installable unit in every host, and it holds parts of
the kinds its host takes. Flywheel's statement calls it a package
(228, 284).

The Claude Code plugin serves a person working in a session who wants
one meeting in front of them: what was agreed, who asked for what. It
pulls the transcript into that session and records nothing. The herdr
plugin shows the day's meetings, from every service eddy has a part
for, in a pane beside the person's work.

The Flywheel plugin holds the adapter parts, one per meeting service,
and nothing else. millpond runs a Flywheel plugin's adapter parts and
ignores the rest of it, so eddy's parts run under millpond today and
under Flywheel's tick later, with no change (215, 231).

## Alone, and beside an inbox

eddy needs no inbox. A person with only eddy's Claude Code and herdr
plugins lists and reads meetings, and nothing about them is kept
anywhere.

A host that runs millpond names a meeting part in an inbox's settings,
and the part's listings become captures. The inbox then works in any of
its three setups: on its own, with crew, or with Flywheel
([millpond's book](../millpond/)). Moving from one setup to the next
changes the host and the curator. eddy's parts stay as they were, so
no meeting is captured twice.
