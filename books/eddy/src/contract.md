# Running a part

A part is a command that prints the capture contract. millpond starts
it, reads the lines it prints and banks the files it writes, and
Flywheel's tick later starts it the same way (215, 231). The contract
is the one way captures reach an inbox, and millpond's book describes
it whole ([the capture contract](../millpond/contract.html), and
[running adapters](../millpond/running.html)).

## How a host starts a part

eddy's Flywheel plugin declares each adapter part: its command, the
shape of its configuration and the secrets it needs (228). millpond
reads the same declaration Flywheel reads, and runs the part as

```
eddy capture wispr --raw-dir <dir> [--cursor <c>]
```

with the part's configuration in the file the `CAPTURE_CONFIG`
environment variable names, and each declared secret in the environment
under its declared name. A part that signs in to its service keeps that
sign-in itself ([A part per service](parts.md)).

millpond starts a part in one of two ways:

- **`millpond run <part>`** makes a fresh raw directory, starts the
  part with that directory and the part's last cursor, and lands what
  the part prints. It then keeps the new cursor and the run's status:
  its exit, its failures and the tail of its standard error.
- **`millpond tick`** runs every part of an inbox whose schedule is
  due, so one timer on a host serves every part there. A schedule is
  five-field cron, and a run missed while the host slept is caught up
  once (231).

An inbox's settings name the one host whose tick runs each part. An
inbox checked out on two hosts therefore runs a meeting part once, on
the host that holds its sign-in.

## What a part prints

A part writes JSON Lines to standard output, and each line holds
exactly one of three keys: `capture`, `cursor` or `done`.

<figure class="fig">
<div class="scroll">
<svg viewBox="0 0 760 410" role="img" aria-labelledby="fc-t fc-d">
<title id="fc-t">One run of the wispr part</title>
<desc id="fc-d">millpond run starts eddy capture wispr with a raw directory, the last cursor, the configuration and the secrets. The part asks Wispr Flow for meetings recorded since the cursor and gets them with their details. For each meeting not too short to hold anything, it fetches the transcript, writes two raw files and prints one capture line to millpond. It then prints its cursor and its done line, and millpond keeps the cursor and the run's status. No model runs in any step.</desc>
<defs>
<marker id="fc-h" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hd"/></marker>
<marker id="fc-ha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="hd-a"/></marker>
</defs>
<rect x="12" y="16" width="176" height="36" rx="8" class="bx-acc"/>
<text x="100" y="39" class="tm" text-anchor="middle">millpond run wispr</text>
<rect x="292" y="16" width="176" height="36" rx="8" class="bx"/>
<text x="380" y="39" class="tm" text-anchor="middle">eddy capture wispr</text>
<rect x="552" y="16" width="176" height="36" rx="8" class="bx"/>
<text x="640" y="39" class="t" text-anchor="middle">Wispr Flow</text>
<line x1="100" y1="52" x2="100" y2="356" class="life"/>
<line x1="380" y1="52" x2="380" y2="356" class="life"/>
<line x1="640" y1="52" x2="640" y2="356" class="life"/>
<text x="112" y="78" class="ts">starts it: raw dir, cursor, config, secrets</text>
<line x1="100" y1="86" x2="376" y2="86" class="ar" marker-end="url(#fc-h)"/>
<text x="392" y="110" class="ts">meetings recorded since the cursor</text>
<line x1="380" y1="118" x2="636" y2="118" class="ar" marker-end="url(#fc-h)"/>
<text x="392" y="142" class="ts">each meeting with its details</text>
<line x1="640" y1="150" x2="384" y2="150" class="ar-d" marker-end="url(#fc-h)"/>
<rect x="56" y="164" width="692" height="134" rx="8" class="bx-dash"/>
<text x="112" y="182" class="th">FOR EACH MEETING NOT TOO SHORT</text>
<text x="392" y="202" class="ts">fetch its transcript</text>
<line x1="380" y1="210" x2="636" y2="210" class="ar" marker-end="url(#fc-h)"/>
<text x="392" y="232" class="ts">the transcript</text>
<line x1="640" y1="240" x2="384" y2="240" class="ar-d" marker-end="url(#fc-h)"/>
<rect x="392" y="252" width="168" height="26" rx="6" class="bx-soft"/>
<text x="402" y="270" class="ts">writes two raw files</text>
<text x="112" y="276" class="tm">{"capture": …}</text>
<line x1="380" y1="284" x2="104" y2="284" class="ar-a" marker-end="url(#fc-ha)"/>
<text x="112" y="310" class="tm">{"cursor": …}</text>
<line x1="380" y1="318" x2="104" y2="318" class="ar-a" marker-end="url(#fc-ha)"/>
<text x="112" y="340" class="tm">{"done": {listed, failed}}</text>
<line x1="380" y1="348" x2="104" y2="348" class="ar-a" marker-end="url(#fc-ha)"/>
<rect x="12" y="366" width="300" height="32" rx="7" class="bx-soft"/>
<text x="24" y="387" class="ts">millpond keeps the cursor and the run's status</text>
<text x="392" y="387" class="tlo">no model runs in any step (115)</text>
</svg>
</div>
<figcaption>millpond starts a part with a raw directory, its last cursor, its configuration and its secrets. The part asks its service for meetings since the cursor, writes each transcript as raw files and prints one capture line per meeting, then its cursor and its done line.</figcaption>
</figure>

A run of the `wispr` part that lists three meetings, lands two and
fails to fetch the third prints four lines:

```json
{"capture": {"key": "meeting/wispr/m42", "source": "meeting", "event_at": "2026-10-16T15:00:00Z", "title": "Inbox planning", "raw": ["m42/transcript.json", "m42/turns.txt"]}}
{"capture": {"key": "meeting/wispr/m43", "source": "meeting", "event_at": "2026-10-16T17:30:00Z", "title": "Release review", "raw": ["m43/transcript.json", "m43/turns.txt"]}}
{"cursor": "2026-10-17T04:30:05Z"}
{"done": {"listed": 3, "failed": [{"what": "meeting/wispr/m44", "why": "HTTP 502"}]}}
```

A meeting capture fills the contract's fields this way:

| Field | A meeting part writes |
|---|---|
| `key` | `meeting/<service>/<meeting id>` |
| `source` | `meeting` |
| `event_at` | when the meeting started |
| `title` | the meeting's title |
| `url` | where the meeting lives on its service, when the service gives it an address |
| `raw` | the transcript as served and the plain copy, as paths under the raw directory |
| `excerpt` | never present |

A meeting capture never carries an excerpt. A meeting is not its own
excerpt: what it says becomes signals only through a reader's judgment
(115). millpond therefore writes no signal for it and marks it unread,
which charges a reader.

The `cursor` line is the part's own and opaque to millpond. The `done`
line ends a complete run with its counts and the meetings that failed.

## A run that fails

One failed meeting never stops the others. A part names it in the
`done` line's `failed` list, with what failed and why, and carries on
with the next meeting.

A run that exits without `done`, or with a status other than 0, keeps
every capture already taken, since captures are idempotent. Its cursor
does not advance, and millpond records the run as failed. The next run
lists the same window again from the old cursor, and millpond passes
over every key it already holds.

## What millpond does with each line

millpond checks each line and refuses one with a bad key, a missing
field or an empty excerpt, naming it in the run. It looks the key up in
every capture the inbox holds and passes over a key it already holds.
It banks the raw files, writes the capture with its pointer, marks the
capture unread, and records the run, which a fleet's doctor reads from
`millpond status --json`. millpond's book holds each of those steps
([landing a capture](../millpond/landing.html)).
