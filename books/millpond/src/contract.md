# The capture contract

The contract is the one way captures reach an inbox. Flywheel's
statement defines it, a crate in flywheel-next implements it, and
millpond and Flywheel both take it. One conformance pack proves every
host and every adapter part against it: lines in, records expected.

## The lines

An adapter writes JSON Lines to standard output. Each object has
exactly one of three keys: `capture`, `cursor` or `done`.

```json
{"capture": {"key": "release/mise/2026.10.10", "source": "release", "event_at": "2026-10-10T14:02:11Z", "title": "mise 2026.10.10", "url": "https://github.com/jdx/mise/releases/tag/v2026.10.10", "raw": ["mise-2026.10.10/notes.md", "mise-2026.10.10/release.json"], "excerpt": {"text": "…the notes, whole…", "kind": "ask", "asserted_by": "jdx/mise", "assertion": "mise 2026.10.10 is released; the repository pins 2026.9.18.", "subjects": ["release", "mise"], "argues_with": ["packages/mise/default.nix"], "position": "release notes"}}}
{"cursor": "2026-10-17T04:30:05Z"}
{"done": {"listed": 14, "failed": [{"what": "github:jdx/mise", "why": "HTTP 502"}]}}
```

## A capture

A capture line describes one source event:

| Field | Required | Meaning |
|---|---|---|
| `key` | yes | The source event's identity. The same event gets the same key from every host and every run (111). |
| `source` | yes | The source's name: `release`, `meeting`, `folder`, `deploy`. |
| `event_at` | yes | When the event happened, in RFC 3339. |
| `title` | no | One line a person reads in a list. |
| `url` | no | Where the event lives upstream. |
| `raw` | no | The files the adapter wrote under the raw directory, as relative paths. |
| `excerpt` | no | Present only when the capture is its own excerpt. It holds the signal's fields. |

### The key

The key is what makes a capture idempotent. millpond looks every key
up before it writes, so a source event listed twice, by two hosts or by
two runs over the same window, lands once (111). A `/` separates the
key's segments, as in `release/mise/2026.10.10`,
`meeting/wispr/<meeting id>` and
`folder/<folder name>/<sha256 of the file>`.

A key never starts with `/`, never has a `..` segment, and never starts
with `captures` or `moves`. A key becomes part of a folder's name when
the capture comes to rest, and these rules keep that folder inside the
inbox and clear of the inbox's own folders.

### The event date

`event_at` is when the event happened: a release's publication, a
meeting's start, the date a dropped file's name begins with. It is
never when the adapter noticed the event, because weight counts by
event date (118). A backlog imported in one afternoon still weighs as
the months it spans.

### The excerpt

An adapter includes an excerpt only when the capture is its own
excerpt: when the event's own words are the signal, with no judgment
needed to find it. A release is its own excerpt. Its notes are the
excerpt, and its signal asks for a bump. A meeting is not, so a reader
session turns its transcript into signals later.

The excerpt holds the signal's fields (113):

- `text`, the excerpt verbatim and whole;
- `kind`, one of constraint, ask, question, commitment and reaction;
- `asserted_by`, who said it;
- `assertion`, what it asserts, in a sentence;
- `subjects`, its subject tags;
- `argues_with`, what it argues with, such as the declarations a bump moves;
- `position`, where in the source the text sits.

The adapter never cuts the text. millpond cuts it when it writes the
signal, so every adapter's excerpt meets the same limit the same way.

## The cursor

A `cursor` line carries a value only the adapter understands. millpond
keeps the last cursor of a run that ended in `done` and hands it back
on the next run. An adapter works without one: listing a window again
is safe, because millpond dedupes by key.

## The end of a run

A `done` line ends a complete run with what it listed and the items
that failed, each with what failed and why. One failed item never stops
the others.

A run that exits without `done`, or with a status other than 0, keeps
every capture already taken, since captures are idempotent. Its cursor
does not advance, and millpond records the run as failed, so the next
run lists the same window again and lands only what the failed run did
not.

## Lines and raw files

The lines describe each event, and the raw files hold it.

<figure class="mp-fig">
<div class="mp-scroll">
<svg viewBox="0 0 720 290" role="img" aria-label="An adapter prints lines and writes raw files. The lines become captures and signals in the inbox, in git, read by a curation session, the herdr plugin and crew's planner. The raw files go to the raw bank on the host, never git, read by a reader session, the verbatim check and a person past the cut. Each capture points at its raw files by host and path.">
<defs>
<marker id="mp-c-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="mp-hd"/></marker>
</defs>
<rect x="8" y="105" width="128" height="76" rx="9" class="mp-bx"/>
<text x="22" y="132" class="mp-t">Adapter</text>
<text x="22" y="152" class="mp-ts">prints lines,</text>
<text x="22" y="168" class="mp-ts">writes raw files</text>
<path d="M136,128 L160,72" class="mp-ar" marker-end="url(#mp-c-m)"/>
<path d="M136,158 L160,214" class="mp-ar" marker-end="url(#mp-c-m)"/>
<rect x="164" y="36" width="156" height="64" rx="9" class="mp-bx"/>
<text x="178" y="62" class="mp-t">Lines</text>
<text x="178" y="82" class="mp-ts">small, one per event</text>
<rect x="164" y="184" width="156" height="64" rx="9" class="mp-bx"/>
<text x="178" y="210" class="mp-t">Raw files</text>
<text x="178" y="230" class="mp-ts">the material, whole</text>
<line x1="320" y1="68" x2="344" y2="68" class="mp-ar" marker-end="url(#mp-c-m)"/>
<line x1="320" y1="216" x2="344" y2="216" class="mp-ar" marker-end="url(#mp-c-m)"/>
<rect x="348" y="28" width="176" height="80" rx="9" class="mp-bx-mp"/>
<text x="362" y="54" class="mp-t">The inbox, in git</text>
<text x="362" y="74" class="mp-ts">captures and signals,</text>
<text x="362" y="92" class="mp-ts">Flywheel's formats</text>
<rect x="348" y="176" width="176" height="80" rx="9" class="mp-bx"/>
<text x="362" y="202" class="mp-t">The raw bank</text>
<text x="362" y="222" class="mp-ts">on the host,</text>
<text x="362" y="240" class="mp-ts">never in git</text>
<path d="M436,108 L436,172" class="mp-ar-d" marker-end="url(#mp-c-m)"/>
<text x="444" y="136" class="mp-ts">pointer</text>
<text x="444" y="152" class="mp-tm">&lt;host&gt;:&lt;path&gt;</text>
<line x1="524" y1="68" x2="548" y2="68" class="mp-ar" marker-end="url(#mp-c-m)"/>
<line x1="524" y1="216" x2="548" y2="216" class="mp-ar" marker-end="url(#mp-c-m)"/>
<rect x="552" y="20" width="160" height="96" rx="9" class="mp-bx"/>
<text x="566" y="40" class="mp-th">read by</text>
<text x="566" y="62" class="mp-ts">a curation session</text>
<text x="566" y="80" class="mp-ts">the herdr plugin</text>
<text x="566" y="98" class="mp-ts">crew's planner</text>
<rect x="552" y="168" width="160" height="96" rx="9" class="mp-bx"/>
<text x="566" y="188" class="mp-th">read by</text>
<text x="566" y="210" class="mp-ts">a reader session</text>
<text x="566" y="228" class="mp-ts">the verbatim check</text>
<text x="566" y="246" class="mp-ts">a person past the cut</text>
</svg>
</div>
<figcaption>Only millpond reads the lines; everything after it reads the records in git. The raw material stays on the host, so a meeting's words never reach GitHub. A release's notes sit in both places: whole in the raw bank, and cut in the excerpt that git keeps.</figcaption>
</figure>

- **A line is small.** It holds what millpond checks and what enters
  git as the capture and its signal.
- **A raw file is the material** as the source served it, whole: a
  transcript, the full notes, a log. It can run to megabytes. It stays
  on the host and never enters git (111).

Once millpond banks the raw files, three readers use them:

- a reader session, for which a meeting's transcript is the whole
  input;
- millpond's check that each excerpt a reader writes appears verbatim
  in its capture's raw material;
- a person following the capture's pointer past the cut.
