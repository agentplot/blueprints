# How others add a service

eddy holds parts for the services most partitions record on. Every
other meeting service reaches an inbox by one of three routes: a
meeting plugin someone else publishes, the generic MCP part, or the
folder drop. One test admits a part to the first two: it passes the
meeting checks in the conformance pack, and then it counts as a meeting
part, the equal of eddy's own.

<figure class="fig">
<div class="scroll">
<svg viewBox="0 0 760 330" role="img" aria-labelledby="fo-t fo-d">
<title id="fo-t">Four routes into an inbox for meetings</title>
<desc id="fo-d">eddy's own parts, others' meeting plugins in the plugin index, and the generic MCP part all pass the meeting checks in flywheel-next's conformance pack. They print captures whose source is meeting. The folder drop, millpond's built-in adapter, takes any file and prints captures whose source is folder. All four print contract lines into millpond, which keeps one capture per key.</desc>
<defs>
<marker id="fo-h" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hd"/></marker>
<marker id="fo-ha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hd-a"/></marker>
</defs>
<text x="12" y="22" class="th">FROM THE COMMON SERVICE TO ANY FILE</text>
<rect x="12" y="36" width="320" height="56" rx="8" class="bx-acc"/>
<text x="24" y="58" class="t">eddy's own parts</text>
<text x="24" y="78" class="ts">wispr, webex, teams; tested by replaying responses</text>
<rect x="12" y="104" width="320" height="56" rx="8" class="bx"/>
<text x="24" y="126" class="t">Others' meeting plugins</text>
<text x="24" y="146" class="ts">their own repositories, in the plugin index (228)</text>
<rect x="12" y="172" width="320" height="56" rx="8" class="bx"/>
<text x="24" y="194" class="t">The generic MCP part</text>
<text x="24" y="214" class="ts">any MCP endpoint that serves transcripts</text>
<rect x="12" y="250" width="320" height="56" rx="8" class="bx-soft"/>
<text x="24" y="272" class="t">The folder drop</text>
<text x="24" y="292" class="ts">any file; millpond's built-in adapter</text>
<path d="M332,64 L376,112" class="ar" marker-end="url(#fo-h)"/>
<line x1="332" y1="132" x2="376" y2="132" class="ar" marker-end="url(#fo-h)"/>
<path d="M332,200 L376,152" class="ar" marker-end="url(#fo-h)"/>
<line x1="332" y1="278" x2="376" y2="278" class="ar" marker-end="url(#fo-h)"/>
<rect x="380" y="94" width="196" height="76" rx="8" class="bx-acc"/>
<text x="392" y="117" class="t">The meeting checks</text>
<text x="392" y="136" class="ts">in the conformance pack</text>
<text x="392" y="156" class="tl">source: meeting</text>
<rect x="380" y="246" width="196" height="70" rx="8" class="bx-soft"/>
<text x="392" y="268" class="t">No meeting checks</text>
<text x="392" y="287" class="ts">no meeting part</text>
<text x="392" y="305" class="ts">source: folder</text>
<path d="M576,132 L606,176" class="ar-a" marker-end="url(#fo-ha)"/>
<path d="M576,280 L606,228" class="ar" marker-end="url(#fo-h)"/>
<rect x="610" y="168" width="138" height="68" rx="8" class="bx"/>
<text x="622" y="192" class="t">Contract lines</text>
<text x="622" y="210" class="ts">into millpond land,</text>
<text x="622" y="226" class="ts">one capture per key</text>
</svg>
</div>
<figcaption>The common services live in eddy. Anyone else's meeting part sits beside them in the plugin index once it passes the same meeting checks, and a generic part takes any MCP endpoint that serves transcripts. The folder drop takes every file the rest leave. All four print the same contract.</figcaption>
</figure>

## The meeting checks

The conformance pack is flywheel-next's: contract lines in, and the
records a host must write from them expected. It proves millpond and
Flywheel as hosts and every adapter part, and its meeting checks decide
which parts count as meeting parts. eddy's parts pass the same checks as anyone
else's, so a part in eddy carries no standing a published part lacks.

A part from anyone depends on flywheel-next's capture crate for the
contract's types and key rules, as eddy's parts do, and prints the
contract with it.

## A part in eddy

A service most partitions record on gets its part in eddy, beside
`wispr`, `webex` and `teams`. The part brings its listing, its fetching
and its service's recorded responses, which its tests replay. Every
other piece it needs is eddy's shared code: the key's shape, the
meeting's details, the raw layout and the skip
([What every part shares](shared.md)).

## A plugin of one's own

Anyone can publish a meeting plugin of their own. It is a Flywheel
plugin holding a meeting part, kept in its author's repository at a
tag, and listed in the plugin index beside eddy's (228). The index is a
file, and the shipped set is the default index. A plugin declares the
set version it needs, the shape of its configuration and
the secrets it needs, and a host registers it by its content hash
(224, 228).

millpond and Flywheel run a published part as they run eddy's:
the same command line, the same raw directory, the same lines. Nothing
in a host tells eddy's parts from anyone else's.

## The generic MCP part

For the long tail, a generic part lists meetings from any MCP endpoint
that serves transcripts. Its configuration names the endpoint. It is an
MCP client, as `wispr` is, so no Claude session runs to list meetings
through it. A service whose endpoint serves transcripts reaches an
inbox through the generic part before anyone writes it a part of its
own.

## The folder drop

The folder drop takes the rest. A file dropped in a watched folder is
one capture: a meeting transcript someone downloaded by hand, an email
saved as `.eml`, a PDF.

- **Its adapter** is Flywheel's folder adapter, built into millpond
  from flywheel-next's adapters crate: `millpond capture folder <dir>`
  prints contract lines
  ([the folder drop](../millpond/sources.html#the-folder-drop)).
- **Its key** is `folder/<folder name>/<sha256 of the file>`, so a
  file dropped twice, or under another name, is one capture (111).
- **Its `event_at`** is the date the file's name begins with, or else
  the file's last write.
- **Its `source`** is `folder`, and no capture carries an excerpt. A
  reader reads each one and tells a transcript from an email by what it
  holds.

The folder drop is no meeting part and passes no meeting checks. A
service that sends many files of one kind earns a part of its own, and
until it has one the folder takes its files. millpond also carries
Flywheel's meeting transcript adapter, `millpond capture meeting`,
from the same crate (215). Its captures carry no excerpt either, and a
reader reads them ([the meeting file](../millpond/sources.html#the-meeting-file)).

A meeting that arrives by two routes, a transcript dropped in the
folder and the same meeting listed by a part, carries two keys and so
becomes two captures. Its reader reads them together and writes the
second's signals once, as for any meeting recorded twice.
