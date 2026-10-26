# flume — phase 1, the bolts

A draft for the madswan planner, 2026-10-27, on the capture plan's L3:
flume's core and its Claude Code plugin, after L2's records and rules.
Three bolts. The first is the core, one agent in sequence, because the
seam traits and the types every profile codes against must exist before
units can work apart, as tailrace's Bolt 1 did. Each unit names what it
owns, the clauses it builds and what proves it. The planner turns these
into proposals; nothing here is the plan.

## How the units stay apart

- **The core bolt goes first and is one unit.** It lands every seam
  trait of Part B (78 to 104, 115 to 117, 121, 122, 125), the types
  they pass, the fakes, the conformance suite and the engine over the
  fakes. No profile unit starts before it lands.
- **A unit owns directories.** A profile unit owns one directory under
  `crates/flume/src/profiles/<seam>/` and its tests; the plugin unit
  owns `plugins/claude/`. A unit touches nothing outside what it owns,
  except the two shared files: `crates/flume-conformance/src/` gains
  scenarios below a marker per seam and `Cargo.toml` gains a dependency
  line, both append-only.
- **A trait never changes inside a profile unit.** A change to a trait
  or a shared type is a unit of its own, landed before the units that
  need it (`crew needs`).
- **Done means the suite.** A profile unit is done when its seam's
  conformance scenarios pass against the real tool, in that profile's
  own tests, tagged by the layer that can run them.

## Weir's crates

flume reads kinds through weir's `weir-kinds` crate and no reader of
its own (core.4; weir 51 to 58), so Bolt 2's kinds unit depends on it.
weir's bolt is landing and nothing is tagged or published yet; flume
takes `weir-kinds` as a git dependency pinned to a revision of weir's
main, moved by a chore when weir changes, until tailrace renders the
family's Cargo registry (tailrace Bolt 5), when the pin becomes a
version. flume does not wait on a tag. A pinned revision is the
statement's rule for every cross-kit read (flume 20; weir 58).

## Bolt 1 · the core

One unit, in sequence. Done when the conformance suite passes over the
fakes: a launch makes a place, runs a kind's stages in order with one
fresh agent each, reads each stage's end from its deliverable or a
stop-short, submits a landing kind and sends a place back on a failed
submission, settles under a watching terminal and under none, and
tidies, all against fakes. Nothing a person uses yet.

| unit | owns | builds | proves it |
|---|---|---|---|
| the core | `crates/flume-seams/`, `crates/flume-core/`, `crates/flume-fakes/`, `crates/flume-conformance/`, `crates/flume/src/` but `profiles/` and `plugins/`, `Cargo.toml` | the seven seam traits of Part B and the types they pass: a launch (2, 3, 7, 8), a place and its held state (62, 73 to 76, 102 to 104), a kind's stages as `read-kinds` returns them (18, 23), the six deliverable forms and how each end is read (24, 25, 39), a prompt and its parts (27, 28), an agent's identity, its start secret and the stop-short (29, 30, 41, 92), the submission's outcomes (111 to 113, 117, 125); the engine: launch, the stage loop with one fresh agent each (30), the settle (46, 121, 122), retry, stop, drop, done, finish and tidy (48 to 52, 63 to 67, 114), the send-back after a failed submission (112) and the caller's hold (47); refusals whole (4); every answer as JSON (61); the fakes, one per trait, scriptable per test; the conformance suite, every scenario citing its clauses and the check that fails when a clause of Part A is cited by nothing (106, section 12) | S10, S12, S13, S15, S21, S26, S29, S31, S33 and the rest of section 11 over the fakes; `cargo test` green; every clause of Part A cited |

## Bolt 2 · the profiles

Seven units side by side. Usable when `flume launch` on a repository
bound to worktrunk, OpenSpec, Claude Code, herdr and sluice runs a fix
end to end on this host and tidies the place.

| unit | owns | builds | proves it |
|---|---|---|---|
| the place | `profiles/place/git_worktree/`, `profiles/place/worktrunk/` | B.1 through `git worktree` and through worktrunk (C.1): make at the base where the merge-queue profile says it lives, ready as the repository's readiness declares, read, remove through the teardown, remove-branch only when nothing is lost (78 to 83, 9, 11, 12, 65 to 67) | the place scenarios against a scratch repository with both profiles; S10, S16 |
| the kinds | `profiles/kinds/weir/` | B.2 through `weir-kinds` at a pinned revision: a repository's `.config/flume.toml` at the base's revision, a launch's file, flume's own two kinds built in; the `[profiles]` table read at the default branch and nothing guessed from another tool's files (84, 85, 19 to 23, 105, C.2, core.3, core.4) | the kinds scenarios; S13, S15, S31, S33 |
| the change | `profiles/change/openspec/` | B.3 through OpenSpec's files at a revision: exists, planning complete, tasks ticked, archived (86, 87, C.3) | the change scenarios against a scratch change |
| the agent | `profiles/agent/claude/` and the hooks under `plugins/claude/hooks/` | B.4 through Claude Code: the command with the plugin loaded, received from the transcript, asking from the mark, own-work from the transcript, `flume needs` as the stop-short under the identity and secret, send-back and guard as the Stop and PreToolUse hooks, on-quiet starting `flume settle` (88 to 93, 115, 116, 121, C.4; 108, 110) | the agent scenarios against a real `claude` in the tools layer; the guard refuses `sluice submit`, `wt submit`, `wt merge` and `git push` |
| the terminal | `profiles/terminal/herdr/`, `profiles/terminal/printed/` | B.5 through herdr: a pane per place, send read back, state, close, the watch on herdr's server; and the printed command, which refuses every tell (94 to 98, 122, C.5, 107, 119) | the terminal scenarios against herdr in the tools layer; a prompt not received reported never begun (38) |
| the merge queue | `profiles/merge_queue/sluice/` | B.6 through sluice: submit as `wt submit` or `sluice submit` waited on, read-submission from `sluice status --json`, wait through `sluice step`, the release before every removal (99, 101, 117, 125, C.6; 63, 66, 68, 113, 124) | the merge-queue scenarios against a scratch repository landing through sluice; S21 |
| the store | `profiles/store/host_dir/` | B.7 through the host's state directory: one document per place with its version, written by rename under a lock and refused when the version moved, the place's own folder beside it (102 to 104, C.7; 62, 73 to 76) | the store scenarios; S12 |

## Bolt 3 · the surfaces

Two units side by side. Usable when the operator types `/launch` in any
Claude Code session and a fix lands through flume's own submission with
no agent running `wt submit`, which is L3's done.

| unit | owns | builds | proves it |
|---|---|---|---|
| the command line | `crates/flume/src/commands/` | `flume launch`, `status --json`, `tell`, `stop`, `retry`, `finish`, `drop`, `done`, `tidy`, `prompt`, `needs` and `settle`, each an answer from the one core as JSON (56 to 61, section 9), the launch's settings and `--kinds`; the one way to stop short refused without the identity and secret (41) | the walkthrough of section 11's S1 and S2 from the installed binary against a scratch repository bound to every profile |
| the Claude Code plugin | `plugins/claude/` but the hooks the agent unit owns | `/launch <brief>` from any session and `status` over MCP, the plugin as sluice keeps its plugins, every answer from the one core (core.14) | a fix launched from a session lands through flume's submission and its place is tidied; a submission that fails sends its place back to the stage its kind names |

## Left for L4 on purpose

The herdr plugin's sidebar and keys (L4), sounding's elaboration kinds
through `--kinds` beyond reading them, and the callers' integrations
(millpond's send, headwater's fix key, crew's units), each the plan's
own step.
