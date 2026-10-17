# A part per service

A part is eddy's code for one meeting service, run as an adapter. Its
own code does two things: it lists the meetings its service recorded
since its cursor, and it fetches each meeting's transcript. Everything
else a part does, every other part does the same way, and the next
chapter describes it.

<figure class="fig">
<div class="scroll">
<svg viewBox="0 0 760 300" role="img" aria-labelledby="fp-t fp-d">
<title id="fp-t">What a part owns and what it shares</title>
<desc id="fp-d">Three parts, wispr for Wispr Flow's MCP endpoint, webex for Webex's transcripts API and teams for Microsoft Graph's meeting transcripts, each own only listing and fetching. Below them, one layer every part shares: the key's shape, the meeting's title, start, length and attendees, the raw layout, and skipping a meeting too short to hold anything. Below that, flywheel-next's capture crate holds the contract's types and key rules.</desc>
<defs>
<marker id="fp-h" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hd"/></marker>
</defs>
<text x="12" y="22" class="th">OWN CODE, ONE PART PER SERVICE</text>
<rect x="12" y="34" width="236" height="96" rx="9" class="bx-acc"/>
<text x="26" y="56" class="tm">wispr</text>
<text x="26" y="74" class="ts">Wispr Flow's MCP endpoint</text>
<rect x="26" y="86" width="98" height="30" rx="6" class="bx-soft"/>
<text x="40" y="106" class="t">list</text>
<rect x="132" y="86" width="102" height="30" rx="6" class="bx-soft"/>
<text x="146" y="106" class="t">fetch</text>
<rect x="262" y="34" width="236" height="96" rx="9" class="bx"/>
<text x="276" y="56" class="tm">webex</text>
<text x="276" y="74" class="ts">Webex's transcripts API</text>
<rect x="276" y="86" width="98" height="30" rx="6" class="bx-soft"/>
<text x="290" y="106" class="t">list</text>
<rect x="382" y="86" width="102" height="30" rx="6" class="bx-soft"/>
<text x="396" y="106" class="t">fetch</text>
<rect x="512" y="34" width="236" height="96" rx="9" class="bx"/>
<text x="526" y="56" class="tm">teams</text>
<text x="526" y="74" class="ts">Microsoft Graph's transcripts</text>
<rect x="526" y="86" width="98" height="30" rx="6" class="bx-soft"/>
<text x="540" y="106" class="t">list</text>
<rect x="632" y="86" width="102" height="30" rx="6" class="bx-soft"/>
<text x="646" y="106" class="t">fetch</text>
<line x1="130" y1="130" x2="130" y2="156" class="ar" marker-end="url(#fp-h)"/>
<line x1="380" y1="130" x2="380" y2="156" class="ar" marker-end="url(#fp-h)"/>
<line x1="630" y1="130" x2="630" y2="156" class="ar" marker-end="url(#fp-h)"/>
<rect x="12" y="160" width="736" height="56" rx="9" class="bx-acc"/>
<text x="26" y="182" class="t">Shared by every part, in eddy</text>
<text x="26" y="202" class="ts">the key's shape · title, start, length, attendees · the raw layout · skipping a meeting too short to hold anything</text>
<line x1="380" y1="216" x2="380" y2="232" class="ar" marker-end="url(#fp-h)"/>
<rect x="12" y="236" width="736" height="50" rx="9" class="bx-soft"/>
<text x="26" y="257" class="tm">flywheel-next's capture crate</text>
<text x="26" y="275" class="ts">the contract's types and key rules, JSON in flight, used by millpond, Flywheel, headwater and eddy</text>
</svg>
</div>
<figcaption>A part's own code is listing and fetching from its service. What every meeting part shares is written once in eddy, and the contract's types and key rules once in flywheel-next's capture crate. Adding a service adds one box to the top row.</figcaption>
</figure>

## The parts

| Part | Source | Key | When |
|---|---|---|---|
| `wispr` | Wispr Flow's MCP endpoint, over HTTP | `meeting/wispr/<meeting id>` | first |
| `webex` | Webex's transcripts API | `meeting/webex/<meeting id>` | when a partition records on Webex |
| `teams` | Microsoft Graph's meeting transcripts | `meeting/teams/<meeting id>` | when a tenant's administrator consents |

**`wispr`** comes first. Wispr Flow serves its meetings through an MCP
endpoint over HTTP. The part is an MCP client of that endpoint, with a
sign-in of its own, and calls the endpoint's tools from its own code.
No Claude session runs to list meetings, since a listing is arithmetic
and runs unattended (115).

**`webex`** reads Webex's transcripts API. eddy gains it when a
partition records its meetings on Webex.

**`teams`** reads Microsoft Graph's meeting transcripts. Graph serves a
tenant's transcripts only to an application the tenant's administrator
has consented to, so the part comes when an administrator consents.

## Its sign-in

A part that signs in to its service keeps that sign-in itself. The
host's only job is to hand the part what the plugin declared:

- **On millpond** the user signs in once per host, and the part keeps
  the sign-in from then on.
- **On Flywheel** the host places the secrets the plugin declares
  (228).

Either host starts the part with each declared secret in its
environment, under the secret's declared name. A fleet's user makes a
part's sign-in once per host, beside the other sign-ins that host
holds.

## Its cursor

A part lists the meetings its service recorded since its cursor. The
cursor is the part's own, and millpond treats it as opaque: millpond
keeps the last cursor from a run that ended in its `done` line and
hands it back on the next run. A part works with no cursor at all.
Listing a window again is safe, because millpond dedupes by key, so a
lost cursor costs one wider listing and no second capture (111).

## Its tests

eddy tests each of its parts by replaying the service's recorded
responses, so a part's tests need no account, no sign-in and no
network. A part counts as a meeting part when it also passes the
meeting checks in the conformance pack, which
[How others add a service](contributing.md) describes.
