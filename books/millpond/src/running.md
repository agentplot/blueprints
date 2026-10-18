# Running adapters

An adapter is a program that knows one source. It lists the source's
events, keys each one, fetches the raw material, and marks a capture
that is its own excerpt. It writes no records, keeps no list of what it
reported, cuts no excerpt, and reads no capture into signals (115).
millpond does the rest, whichever adapter printed the lines.

## Plugins and adapter parts

A plugin is the installable unit in every host. It holds parts, each of
one kind:

| Host | Kinds of part |
|---|---|
| Claude Code | skills, hooks, commands, MCP servers |
| herdr | actions, panes, events |
| Flywheel | adapter, chat sink, runner, router, sign-in, unit type, elaboration type, deliverable producer, map vocabulary, template, scenario pack |

Flywheel's statement names the same unit a package, and a named set of
parts a bundle (228, 284). millpond runs a Flywheel plugin's adapter
parts and nothing else of it.

An adapter part declares a command, the shape of its configuration and
the secrets it needs (228). millpond reads the same declaration
Flywheel reads, so a part written for one host runs on the other
unchanged.

## How millpond starts a part

millpond runs the part's command as:

```
<command> --raw-dir <dir> [--cursor <c>]
```

The part's configuration is in the file the `CAPTURE_CONFIG`
environment variable names, and each declared secret is in the
environment under its declared name. The adapter writes its raw files
under the raw directory, prints its lines on standard output, and exits.

An adapter that signs in to its source keeps that sign-in itself. On
millpond the user signs in once per host. On Flywheel the host places
the secrets the plugin declares.

## Two ways in

Two commands take the same lines.

<figure class="mp-fig">
<div class="mp-scroll">
<svg viewBox="0 0 720 330" role="img" aria-label="millpond run starts one adapter process with a fresh raw directory and its last cursor. The adapter, whichever it is, prints JSON lines on standard output and writes raw files; millpond land takes both through its seven steps. A program running on its own pipes the same lines into millpond land. millpond run keeps the new cursor and the run's status.">
<defs>
<marker id="mp-r-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="mp-hd"/></marker>
<marker id="mp-r-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="mp-hd-a"/></marker>
</defs>
<path d="M606,40 L606,26 L96,26 L96,62" class="mp-ar-d" marker-end="url(#mp-r-m)"/>
<text x="140" y="18" class="mp-ts">the new cursor and the run's status, kept by millpond run</text>
<rect x="8" y="66" width="176" height="84" rx="9" class="mp-bx"/>
<text x="22" y="92" class="mp-tm">millpond run &lt;part&gt;</text>
<text x="22" y="114" class="mp-ts">a fresh raw directory</text>
<text x="22" y="132" class="mp-ts">and the last cursor</text>
<line x1="184" y1="108" x2="210" y2="108" class="mp-ar" marker-end="url(#mp-r-m)"/>
<rect x="214" y="40" width="226" height="200" rx="10" class="mp-bx-hl"/>
<text x="228" y="64" class="mp-t">Adapter process</text>
<text x="228" y="82" class="mp-ts">reads its source, nothing else</text>
<rect x="226" y="96" width="202" height="30" rx="6" class="mp-bx"/>
<text x="236" y="116" class="mp-tm">headwater capture</text>
<rect x="226" y="134" width="202" height="30" rx="6" class="mp-bx"/>
<text x="236" y="154" class="mp-ts">a part of eddy's, per service</text>
<rect x="226" y="172" width="202" height="30" rx="6" class="mp-bx"/>
<text x="236" y="192" class="mp-tm">millpond capture folder</text>
<text x="228" y="226" class="mp-ts">each prints the same lines</text>
<line x1="440" y1="96" x2="496" y2="96" class="mp-ar-a" marker-end="url(#mp-r-a)"/>
<text x="448" y="88" class="mp-tl">lines</text>
<line x1="440" y1="196" x2="496" y2="196" class="mp-ar" marker-end="url(#mp-r-m)"/>
<text x="446" y="188" class="mp-tl">raw files</text>
<rect x="500" y="40" width="212" height="200" rx="10" class="mp-bx-mp"/>
<text x="514" y="66" class="mp-tm">millpond land</text>
<text x="514" y="92" class="mp-ts">1  checks each line</text>
<text x="514" y="112" class="mp-ts">2  looks up its key</text>
<text x="514" y="132" class="mp-ts">3  banks the raw files</text>
<text x="514" y="152" class="mp-ts">4  writes the capture</text>
<text x="514" y="172" class="mp-ts">5  writes its one signal</text>
<text x="514" y="192" class="mp-ts">6  or marks it unread</text>
<text x="514" y="212" class="mp-ts">7  records the run</text>
<rect x="214" y="268" width="226" height="50" rx="9" class="mp-bx"/>
<text x="228" y="290" class="mp-t">A program on its own</text>
<text x="228" y="308" class="mp-ts">a deployer, a script, a person</text>
<path d="M440,293 L606,293 L606,244" class="mp-ar" marker-end="url(#mp-r-m)"/>
<text x="452" y="285" class="mp-tm">… | millpond land</text>
</svg>
</div>
<figcaption><code>millpond run</code> starts one adapter part with a fresh raw directory and its last cursor, lands what it prints, and keeps the new cursor and the run's status. Anything else pipes the same lines into <code>millpond land</code>. No adapter knows where its captures are kept.</figcaption>
</figure>

- **`millpond land`** is the intake. It takes lines on standard input
  from whoever pipes them, such as a deployer, a script or a person,
  and knows nothing of who made them.
- **`millpond run <part>`** is the scheduled form. It makes a fresh raw
  directory, starts the part's command with that directory and its
  last cursor, and lands what the command prints. It then keeps the new
  cursor and the run's status: its exit, its failures and the tail of
  its standard error. Only a run knows which adapter ran, so only a run
  keeps a cursor or a status per part.

## The tick

`millpond tick` runs every part of an inbox whose schedule is due, so
one timer on a host serves every part there. A schedule is five-field
cron. A run missed while the host slept is caught up once, and the key
makes the catch-up write nothing twice (111, 231).

Flywheel's tick takes the same schedules (231), and its capture
endpoint takes the same lines (216, 217g). An adapter never knows which
host ran it.
