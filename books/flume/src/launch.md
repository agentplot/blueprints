# A launch and its place

A launch is one start of work. It names a repository, a kind, a brief
and a name, and flume makes one place for it on the host flume runs on.
Every stage of the launch's work happens in that place, and the place
lasts until the work lands or the launch is dropped.

## What a launch names

| Part | What it gives |
|---|---|
| repository | the repository the place is a worktree of |
| kind | the stages the work goes through, each with its prompt and its deliverable ([Kinds and stages](kinds.md)) |
| brief | the text the first stage's agent starts from |
| name | the place's name, in its folder and its branch |

The caller gives all four ([Who launches](launchers.md)). millpond's
send gives an item's brief, headwater's fix key a release's, sounding
a question, and the operator's `/launch` their own words.

## The place

flume makes the place: a worktree of the repository at
`<repository>/places/<kind>--<name>`, on a new branch `<kind>/<name>`.
A fix named `bump-parser` is worked at `places/fix--bump-parser` on
`fix/bump-parser`. The kind leads both, so the places of one kind sit
together in the folder and their branches share a prefix.

- **One launch, one place.** flume refuses a launch whose place or
  branch already exists, and never adopts a worktree or a branch it did
  not make (`teams.3`). A place holds one launch's work and nothing of
  any other.
- **The agents work inside it.** Each stage's agent reads, writes and
  commits in the place, on its branch. flume makes the place and
  removes it; no agent does either.
- **Its work leaves through sluice.** The place's branch reaches its
  target, the branch the work lands on, only by a submission to sluice
  ([sluice's book](../sluice/)).

## Made ready

A worktree fresh from git holds the repository's files and nothing
else: no dependencies installed, no toolchain fetched, no generated
files. flume makes the place ready by the repository's own declaration
of what a worktree needs. It reads the declaration sluice reads, and
runs the toolchain the repository declares and then its runner's
setup, in the place (`plan.17`).

- **The steps run with a clean environment**, never the caller's,
  since a caller's shell may belong to another checkout.
- **flume runs them whenever it makes the place**, and again whenever
  it starts a stage in a place it finds already made.
- **A repository that declares nothing has nothing run.** flume names
  no script of the repository's and assumes no tool of its own
  choosing: the declaration says what runs.
- **A step that fails** is recorded with the place, with the step and
  its words, and status shows them ([Status and live state](status.md)).

<figure class="fl-fig">
<div class="fl-scroll">
<svg viewBox="0 0 720 256" role="img" aria-label="A launch names a repository, a kind, a brief and a name. flume makes the place, a worktree at places/kind--name on the branch kind/name, and makes it ready: first the toolchain the repository declares, then its runner's setup, run in the place with a clean environment. Only then does the first stage's agent start in the place, from the brief.">
<defs>
<marker id="fl-l-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fl-hd-a"/></marker>
</defs>
<text x="10" y="22" class="fl-th">the launch</text>
<text x="210" y="22" class="fl-th">the place</text>
<text x="500" y="22" class="fl-th">the first stage</text>
<rect x="10" y="36" width="170" height="204" rx="10" class="fl-bx"/>
<text x="24" y="60" class="fl-tm">flume launch</text>
<rect x="24" y="74" width="142" height="30" rx="6" class="fl-chip"/>
<text x="36" y="94" class="fl-ts">repository</text>
<rect x="24" y="112" width="142" height="30" rx="6" class="fl-chip"/>
<text x="36" y="132" class="fl-ts">kind</text>
<rect x="24" y="150" width="142" height="30" rx="6" class="fl-chip"/>
<text x="36" y="170" class="fl-ts">brief</text>
<rect x="24" y="188" width="142" height="30" rx="6" class="fl-chip"/>
<text x="36" y="208" class="fl-ts">name</text>
<line x1="180" y1="138" x2="206" y2="138" class="fl-ar-a" marker-end="url(#fl-l-a)"/>
<rect x="210" y="36" width="260" height="204" rx="10" class="fl-bx-fl"/>
<text x="226" y="60" class="fl-tm">places/&lt;kind&gt;--&lt;name&gt;</text>
<text x="226" y="80" class="fl-ts">a worktree, on the branch</text>
<text x="226" y="98" class="fl-tm">&lt;kind&gt;/&lt;name&gt;</text>
<text x="226" y="128" class="fl-th">made ready</text>
<rect x="226" y="138" width="228" height="28" rx="6" class="fl-chip-fl"/>
<text x="238" y="157" class="fl-ts">1  the declared toolchain</text>
<rect x="226" y="172" width="228" height="28" rx="6" class="fl-chip-fl"/>
<text x="238" y="191" class="fl-ts">2  the runner's setup</text>
<text x="226" y="224" class="fl-ts">in the place, a clean environment</text>
<line x1="470" y1="138" x2="496" y2="138" class="fl-ar-a" marker-end="url(#fl-l-a)"/>
<rect x="500" y="88" width="212" height="100" rx="9" class="fl-bx-hl"/>
<text x="514" y="114" class="fl-t">The first stage's agent</text>
<text x="514" y="138" class="fl-ts">starts in the place,</text>
<text x="514" y="156" class="fl-ts">from the brief</text>
</svg>
</div>
<figcaption>A launch becomes one place. flume makes the worktree and runs what the repository declares a worktree needs before any agent starts in it.</figcaption>
</figure>

## One host

flume runs on one host and launches there. Its places are worktrees on
that host, each stage's agent runs there, and `flume status` reports
the places of that host alone.
