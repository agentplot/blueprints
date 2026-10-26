# A repository's content kind

A design note for the madswan planner, 2026-10-26, on the user's words
in the operator's pane. First: each of the Method's diagrams went
through a change with propose, apply and verify, and a chore is too
thin, since the proposal gave the agent its context. Then, on the first
draft of this note: the task was updating diagrams on a website, not
drawing in the abstract; a preview would be good; and not every small
task can be broken down this way, so how is this done in a generic way
that is still tailored to what they are after. Signal
2026-10-26-madswan-operator-f16c114b/01. This is flywheel-web's side
and every family site's; what a bolt may carry is crew's.

## What the sessions did

The unit `capture-at-the-source-diagram` on flywheel-web landed 127
lines of SVG and three lines of front matter inside 460 lines of
proposal, design, spec and tasks. The design's Context section was the
useful part: it gathered the three drawn diagrams' conventions, the
outline's agreed idea, the glossary and the capture design. That
context is the same for every diagram and for most changes to what the
site shows, so it was written once and should be read every time, not
rewritten per task. The spec `method-diagrams` it added is generic too:
it says what every diagram is, and no later diagram needs a spec of its
own. The proposal and the verify report were ceremony around a content
change; the checks the gate already runs, `site-check`, Vale and the
build, were the real proof.

## The kind: content

One kind, the same in every family site repository, tailored by one
file the repository writes once. flume lets a repository declare it
(19, 20, 23, C.2); until flume runs the family's repositories, the same
shape is a crew chore.

```toml
# .config/flume.toml in flywheel-web, sluice's site, tailrace's site, the books
[kinds.content]
branch = "content"
lands = true

[[kinds.content.stages]]
name = "change"
prompt = "docs/prompts/content-change.md"
deliverables = ["commits"]          # what the page shows, changed; the checks green
agents = [{ program = "claude" }]

[[kinds.content.stages]]
name = "preview"
prompt = "docs/prompts/content-preview.md"
conversation = true                 # the operator looks at the place's own site
wait = true
agents = [{ beside = "operator" }]
on_fail = "change"
```

**The repository's content brief**, `docs/content-brief.md`, written
once: what a change to this site reads first (the site design, the
outline, the glossary, the house style), the conventions a thing of each
sort follows (a diagram: one SVG, the palette by token, motion and the
reduced-motion rule, alt text, drawn inline; a page; a figure; a tools
strip), two finished examples of each sort, and what proves a change
(the site builds, `site-check` and Vale pass, the gate is green). For
flywheel-web it is the design's Context section promoted to a standing
file, plus the Diagram lines of the outline as the briefs they already
are.

**The task**, one line: "update the diagrams for `<slugs>`" or "add
tailrace to the Tools page", with the brief named. The change prompt
hands the agent the brief whole (5, 27), the task line, and the page or
pages the task names at the base's revision. Nothing is proposed, no
spec is written, no verify report is filed: the change's own commits
and the repository's checks are the record.

**The preview** is the place's own site, served in the place with the
place's ports through the merge queue's exec, as a dev server a session
keeps up in its worktree today, and opened beside the operator. The preview stage's agent prints the preview's address as its first
line, the place's own name and port, so the operator reaches it from the
pane that opened beside them, and the address is in the place's status
for anyone who looks later. The stage asks one thing, whether what the
page shows now says what the task asked, and a no sends the place back
to change with the operator's words. Where the operator would rather see it after the
landing, sluice's preview at the landed revision serves the same site
and the stage is skipped (sluice record 0045).

**Batches, not minutes.** A task may name several pages or diagrams,
and one preview covers the set, so the Method's five remaining diagrams
are one task with one look, not five units. The unit of attention is
the batch the operator wants to see together, never the smallest change
an agent can make.

## Generic and tailored

The kind, its two stages and its two prompts are the same in every
site repository: a site's content changes the same way wherever it is.
What tailors it is the one brief file and the one task line. A new
site adopts the kind by writing its brief; nothing in the prompts names
flywheel-web. The same brief serves a crew chore today, whose whole
text is the task line and the brief's path.

## For crew

A bolt should carry an item of a repository's kind with its brief, so
a chore is a kind with a brief rather than a proposal without one, and
a batch of content changes is one item with one preview. That is
crew's design and swancloud's to rule; this note is what the sites
declare.

## The unit

One flywheel-web unit: `docs/content-brief.md` from the capture
diagram's design Context, the two prompts under `docs/prompts/`, the
`[kinds.content]` declaration in `.config/flume.toml`, and the outline's
Diagram lines read as the briefs they are. The five remaining diagrams
are then one chore with one preview. The sluice and tailrace sites and
the books take the kind by writing their briefs when they next change.
