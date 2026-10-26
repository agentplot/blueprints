# A repository's drawing kind

A design note for the madswan planner, 2026-10-26, on the user's words
in the operator's pane: each of the Method's diagrams went through a
change with propose, apply and verify, which they do not like; a chore
is too thin, since the proposal is what gave the agent the context to
draw well. Signal 2026-10-26-madswan-operator-f16c114b/01. This is
flywheel-web's side; what a bolt may carry is crew's.

## What the statement already gives

flume lets a repository declare a kind in its own file (19, 20, C.2): an
ordered list of stages, each with a prompt, one deliverable or a
conversation, and whether the kind lands (18, 23). A change is one kind
among many: flume's own `change` kind reads a change, and a repository's
kind need not (22). The context an agent needs does not come from a
proposal; it comes from the brief its prompt carries, whole (5, 27). So
the fix is a kind whose brief is the diagram's context and whose
deliverable is the drawing, with no change written.

## The kind

```toml
# .config/flume.toml in flywheel-web
[kinds.diagram]
branch = "diagram"
lands = true

[[kinds.diagram.stages]]
name = "draw"
prompt = "docs/prompts/diagram-draw.md"
deliverables = ["commits"]          # the SVG and the page's figure, committed
agents = [{ program = "claude" }]

[[kinds.diagram.stages]]
name = "review"
prompt = "docs/prompts/diagram-review.md"
conversation = true                 # the operator looks, in the site's preview
wait = true
agents = [{ beside = "operator" }]
on_fail = "draw"
```

## The brief, which is the whole point

`docs/prompts/diagram-draw.md` is a template whose one argument is the
principle's slug. Filled, it hands the agent, in this order:

1. the principle's entry in `docs/method-outline.md`, whose **Diagram**
   line is the idea the user agreed to before any drawing;
2. the principle's page, `src/content/principles/<slug>.md`, so the
   drawing says what the page says;
3. the diagram rule in `docs/site-design.md`: one SVG the principle
   names, its own styles, motion and reduced-motion rule, the family's
   colours by token, alt text that says what it shows, drawn inline;
4. the statements the principle cites, by clause, read from blueprints
   at the pinned revision, and the tools' pages the principle names
   (`the-method-names-its-tools.md`);
5. two drawn diagrams as examples, `public/diagrams/one-shell.svg` and
   `order-at-landing.svg`, with the commits that drew them;
6. where the drawing lands: `public/diagrams/<slug>.svg`, the figure and
   caption in the page, and the outline's **Diagram** line changed from
   the idea to "drawn, `public/diagrams/<slug>.svg`";
7. what proves it: the site builds, Vale passes on the caption and alt
   text, and the operator's look in the review stage.

The review prompt opens the preview at the principle and asks the
operator whether the drawing says what the idea said; a no sends the
place back to draw with their words.

## What this replaces, and what it does not

It replaces propose, apply and verify for a drawing: no change, no
spec deltas, no verify report. It keeps everything that made the
proposal useful, since the brief is that context written down once and
handed every time. The same brief serves a crew chore until flume runs
the family's repositories: the chore's text is "draw `<slug>` from
`docs/prompts/diagram-draw.md`", and nothing else.

For crew: a bolt should be able to carry an item of a repository's kind
with its brief, so a chore is a kind with a brief rather than a proposal
without one. That is crew's design and swancloud's to rule; this note is
what flywheel-web declares.

## The unit

One flywheel-web unit: the two prompts under `docs/prompts/`, the
`[kinds.diagram]` declaration in `.config/flume.toml`, and the outline's
**Diagram** lines read as the briefs they already are. The remaining
drawings, proposal 106's two among them, are the first to run as chores
from the brief.
