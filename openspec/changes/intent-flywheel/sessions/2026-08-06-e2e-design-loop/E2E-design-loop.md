# Flywheel end to end, part one — a raw idea becomes a settled slice

The design loop walked step by step: every command, file, session, skill,
and repo from a thought in a pane to writebacks landed and handoff tasks
staged. Construction picks the same storyline up at the phase gate in
`sessions/2026-08-06-e2e-construction/E2E-construction.md`.

The storyline is the rocs record split (its design-loop half exists as the
sample intent `openspec/changes/rocs-record-split/`, its construction half
as the sample bolt `openspec/changes/bolt-rocs-records/`). Paths:
blueprints main is `willdan-blueprints/main`; the built repo is `rocs-kit`.

Actors on stage here: **operator** (Chuck), **dispatch** (the standing
singleton pane, blueprints main), **intent conductor**
(`intent-rocs-record-split`), and the **design sessions** it spawns.
Monitoring throughout is the OpenSpec UI board on blueprints@main — every
actor keeps its change committed, so the board is always current.

---

## §1 — Dispatch: a raw idea becomes an intent change

The operator drops a thought into the dispatch pane:

> "rocs keeps too much in DynamoDB. registrations and run history feel like
> catalog content."

Dispatch (a standing pane launched with `claude --agent flywheel-dispatch`)
routes it — three options: new intent, amendment request to a running bolt,
or an untracked `opsx` chore. This one is design-heavy → new intent:

```bash
# dedupe: is this already an open intent or a settled map node?
openspec list                          # no open intent covers it
grep -i "registration" context-map/maps/target.js   # rc.registrations: candidate

# file the intent change — dispatch's one write, before any conductor exists
mkdir -p openspec/changes/rocs-record-split
printf 'schema: flywheel-intent\nskip_specs: true\n' \
  > openspec/changes/rocs-record-split/.openspec.yaml
```

It writes `intent.md` from the schema's instruction (`openspec
instructions intent --change rocs-record-split`): Destination, Map, Scope,
Fog ("where does the row state machine live?"), seeds `tasks.md`, commits.
The intent now waits on the openspecui board — dispatch starts no
conductors until the operator says to work it.

## §2 — The design loop: sessions iterate decisions

The operator pulls the intent from the board and starts its conductor:

```bash
herdr agent start intent-rocs-record-split --kind claude --pane <pane> -- --agent flywheel-intent-conductor
herdr agent prompt intent-rocs-record-split "/rename intent-rocs-record-split"
# confirm the title (conduct's rename protocol), then the charge:
#   own openspec/changes/rocs-record-split; work the Design tasks
```

The conductor drains its (empty) inbox, re-reads the change, and spawns a
design session charged with the first task batch and its own persistent
storage: `sessions/2026-08-01-record-split/` under the change. The session
presents the record-split decision in one surface — lavish for the
interactive comparison, or `plannotator annotate` on a decision draft when
the operator is reading rather than working controls. The operator's
annotations close the decision; the session commits its report and
decision draft in its session directory and reports back; the conductor
promotes — `decisions/record-split.md` finalized, the report given a row in
`design.md` while the file stays in the session directory, the task checked,
and the consequences appended: Writeback (chapter + map), ADR (rocs-kit),
Handoff (registration records; run records blocked behind it).

A second question needs proof, not discussion — a prototype task, delegated
to the spike repo:

```bash
herdr worktree create --cwd ../../knowledgebase-spike \
  --path ~/.herdr/worktrees/knowledgebase-spike/spike-registration-ingress \
  --base main --branch spike-registration-ingress --no-focus --json
herdr agent start proto-reg-ingress --kind claude --pane <root-pane> -- --model fable
```

`prototypes/registration-ingress.md` records what it proved (including the
negative finding feeding the fog question) and takes its own row in
`design.md`; the worktree and its code die.

## §3 — Writeback: the books and map move

Same session, Writeback tasks (voice from `books/CLAUDE.md`; the mermaid
hook guards diagrams):

```bash
$EDITOR books/rocs-kit/src/record-split.md      # destination voice, full rewrite
node context-map/bin/map-check.mjs --write      # node statuses move
python3 books/preview.py --check
git commit                                       # git-commit skill
```

The intent shows on the board with its Handoff tasks staged: registration
records ready, run records blocked behind it. The design loop has done its
job; what happens next is the operator's word, and it opens part two.
