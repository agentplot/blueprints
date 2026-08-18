# Charge: the loop layer, fully laid out

Type: **interactive design** (`flywheel-interactive`). Change: `flywheel`.
You own `openspec/changes/flywheel/sessions/2026-08-07-loop-layer/` and
nothing else. You write no canonical artifact — no `tasks.md`, no
`decisions/`, no `questions/`, no `assertions/`. You deliver a page and a
report; the conductor promotes.

## Do not start from scratch

Everything below has been argued already. Read before designing:

**The direction, as the operator gave it**
- `sessions/2026-08-07-loop-fixups/flywheel-feedback.md` — the dictated
  batch, organized and annotated twice. Sections A (messaging), B (dynamic
  workflows), C (personas), D (the machinery as it stands).
- `sessions/2026-08-07-loop-fixups/code-review-verdicts.md` — 13 findings
  over the machinery, each verified against the files.

**The decisions that already bind you** — these are settled; design within
them, and if the design cannot fit, say so explicitly rather than quietly
departing:
- `decisions/dynamic-workflows-drive-the-loop.md`
- `decisions/the-bolt-schema-family.md`
- `decisions/message-envelopes.md`
- `decisions/session-types-are-the-task-taxonomy.md`
- `decisions/the-persona-loop.md`
- `decisions/a-bolt-bounds-a-delivery.md`
- `decisions/the-closed-vocabulary.md` — six terms, and the list is closed.
- `decisions/blueprints-is-a-built-repo.md` — you write no machinery.

**The questions you are closing** — read each record; each states what turns
on it and what is already known:
- `questions/dispatch-route-from-intent.md`
- `questions/respond-by-work-item-id.md`
- `questions/herdr-reference-and-conduct.md`
- `questions/skill-register.md`
- `questions/skill-frontmatter.md`

**The tree as it is** — measure, do not remember:
- `.claude/skills/flywheel-*/` — seven skills; `flywheel-inception` and
  `flywheel-construction` are the two loop skills, five are session types.
- `.claude/agents/flywheel-*.md` — the profiles.
- `openspec/schemas/flywheel-intent/schema.yaml` — carries `questions`,
  `assertions` and session-typed tasks as of 2026-08-07.
- `openspec/schemas/flywheel-bolt/schema.yaml` — the one to split.
- `openspec/config.yaml` — the shared context block, where the vocabulary
  lives and where the envelopes are proposed to live.

## The one thing to measure before designing

**Does OpenSpec support a dependency query at all?** The whole fan-out rests
on "ask which items are workable now with no unmet dependency". Run
`openspec list --json`, `openspec status --json`, `openspec show`, and read
the CLI's own help. If nothing exposes dependencies, the design needs a
different mechanism and every downstream claim changes. Report what you ran
and what it returned. A measurement beats an argument here, and this intent
has been wrong twice this week by reasoning where it could have measured.

## What to design

**1. The workflow mechanism, concretely.** What "the workflow text lives in
the schema instructions" means as a thing on disk. Is it prose a conductor
executes, a script, a `Workflow` invocation? Show the actual text for ONE
schema end to end, not a description of it. Name where it lives in the YAML.

**2. The five bolt schemas, differentiated.** `bolt-opsx-default`,
`bolt-opsx-chore`, `bolt-planned-tasks`, `bolt-opsx-fast`, `bolt-opsx-deep`.
They share most of their artifact instructions and differ by workflow — so
show what each workflow actually is, side by side, and what makes an author
pick one. If two of the five turn out not to differ enough to justify
existing, say that.

**3. The session-type taxonomy, fully laid out.** Twelve types across two
loops. For each: what it opens, what it takes as a batch, what it writes,
what it reports, and how it binds to a profile and a skill. This is the
centrepiece — the operator wants to see the whole taxonomy at once, not a
list. Include the rename of `flywheel-review` to `planning` and the six
construction types that do not exist yet.

**4. The three envelopes, as shapes.** Answer the sender, extend the bolt,
extend the intent. Actual fields, actual example messages. Settle whether a
message carries its work item's ID, and whether an intent conductor gets a
route to dispatch.

**5. Where each rule lives.** Schema instruction, skill, profile, or
`openspec/config.yaml` — with the test that decides it. This is the answer
to the register question and the herdr-reference question at once: if you
can state the test, both fall out.

## Deliverable

A lavish page, opened with `npx -y lavish-axi`, per the `flywheel-interactive`
skill. The operator's annotations close the decisions.

**Heavy on visuals — SVG preferred over prose.** The taxonomy wants a
diagram, not a table of twelve rows. The workflow wants a sequence. The
envelopes want their shape drawn. Mermaid is available and gated
(`node books/check-mermaid.mjs`), but hand-authored SVG is preferred where
mermaid would fight the layout.

**Config and code samples throughout.** Real YAML from the real schema
files, real JSON for envelopes, real command lines. A sample an agent could
copy beats a description of what the sample would contain.

**Say which options you rejected and why** — the page is where alternatives
belong, and the operator chooses among them. Do not present one answer as
inevitable when you considered three.

## Constraints

- Your worktree is yours; commit there, staging only paths you wrote.
- Gates before you report: `python3 books/preview.py --check`,
  `node books/check-mermaid.mjs`, `node context-map/bin/map-check.mjs`.
- Report to `intent-flywheel` when the page is ready for annotation, and
  again after the annotations are folded: which questions closed, what the
  decision records should say, and what tasks to append or check.
- Never use the `Agent` tool for delegation — herdr agents only.
