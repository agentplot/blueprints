# Claims are OpenSpec specifications

The design side and the construction side of the instance speak one
language: OpenSpec. A claim is a requirement block in the blueprints'
standing specifications; an as-built statement is a requirement block in
a built repository's standing specifications that names the claim it
serves; the ledger compares the two. The book and the context map remain
the operator's aids to understanding, and neither holds a claim.

This replaces the fenced-block ruling (model.md 8.1 and 12.12) and amends
97, 99, 105, 192 and the glossary entries for claim and as-built. Nothing
in A.14's loop changes: what a claim is, when it is standing, how scope
is derived, how a verdict is judged and reused, and how the backlog is
derived all stay as written. Only where the claim's text lives moves.

## The mapping

| the requirements say (112, 126, 97–105) | in OpenSpec |
|---|---|
| a claim is one statement with a stable name | `### Requirement: <name>` in `openspec/specs/<capability>/spec.md` of the blueprints; the claim's name is `<capability>/<name>` |
| at least one scenario saying how one would know it holds | its `#### Scenario:` blocks; OpenSpec refuses a requirement without one |
| proposed while its intent is open | the requirement appears in the intent's delta, `openspec/changes/<intent>/specs/<capability>/spec.md`, under ADDED, MODIFIED or REMOVED (49, 187) |
| standing once the intent is closed | the archive at the intent's landing merges the delta into `openspec/specs/` on the shared line (49) |
| retired | REMOVED and archived |
| a version that moves only when its text moves | the version is the content hash of the requirement block: its heading, its prose and its scenarios, excluding the attachment line. No hook and no lock enforce the rule; it is true by definition |
| a scope: the repositories homing what it attaches to (105, 200) | the capability directory names the context-map id the claim attaches to by default; a requirement may carry one `Attaches:` line naming further map ids. Scope is derived from those ids exactly as 200 says |

The three things the fenced block carried, name, version and scope, are
therefore the requirement's heading, its hash and its attachment. The
lock line, the pre-commit hook `flywheel claims check` and the lock
half of the mdBook preprocessor go away.

## The book and the context map

The book explains (23). A chapter that explains a claim includes it by
anchor, `{{#claim providers/one-writer}}`, and the preprocessor renders
the requirement in place with its name, version and scope. The text
lives in one place, the spec, and the chapter cannot drift from it,
which is what 97 asks for. A construction session reads the chapter for
what the claim means and the spec for what it says (89); both are one
source.

The context map supplies scope. A capability directory of the
blueprints' specifications is a map id: a context, an element, a
relationship or a link (200). A repository's capabilities are still
derived from the elements it homes (199), so the set of repositories in
scope for every requirement in a capability is derived, never chosen.
The attach and detach tools (193, 211) edit the `Attaches:` line and
nothing else, and the version does not move for it (200).

Every object still opens the OpenSpec artifacts behind it (213). The
page renders a claim from the spec, its chapter from the book, and its
map attachments from the map, in the dock.

## The two halves

An intent is a change in the blueprints (187). Its elaborations write
the destination as chapters and as requirement deltas; the landing
archives the deltas, and the claims are standing (49).

A unit is a change in its built repository (37, 187). Its delta carries
the requirement the unit builds, with one line, `Claim:
<capability>/<name>@<version>`, naming the standing claim it serves
(99); the unit's landing archives it into the built repository's
`openspec/specs/`. That standing set is the as-built: every requirement
in it names a claim and version, and construction never satisfies a
claim it does not name (99). That set is what a delivery system reads
from git to generate and run its suite (181, 192); the machinery writes
no index beside it.

The same schema serves both halves. The intent's delta and the unit's
delta are the same OpenSpec shape; a requirement on the construction
side differs from one on the design side only by its `Claim:` line.

## The ledger and the loop

A verdict is still a judgment made by an agent, stored with its inputs
(100). The inputs now include two facts the machinery reads for it: is
there a standing requirement in the repository naming the claim, and
does its version match. A version match with passing scenarios is
strong evidence; it is not the verdict. Reuse and staleness are as
written (101): the claim's version moving, the evidence gone, or a
challenge move.

The loop planning runs (28, 102, 104) is unchanged and is worth stating
once: for each repository the manifest tracks, for each standing claim
in its scope, read the ledger cell; where there is no satisfied or
not-applicable verdict, the claim is in the backlog; the backlog is
carved into units, the units into a bolt plan, and the plan is proposed.
A joining repository has an empty ledger and gets the whole scope as one
proposal (104). The index curation clusters against (108) is the
blueprints' `openspec/specs/` itself, read by the tick; nothing is
rendered beside it.

## What changes where

| where | change |
|---|---|
| requirements 97 | the chapter includes the claim by anchor; the claim's text is the spec's |
| requirements 99 | an as-built statement is a standing requirement of the built repository carrying a `Claim:` line |
| requirements 105 | the attachment is the capability directory and the requirement's `Attaches:` line |
| requirements 192 | the as-built is the built repository's standing specifications; a delivery system reads them from git; no index file |
| glossary: claim, as-built | as above |
| model.md 8.1, 12.12 | rewritten to this ruling |
| machines/claim.yaml | the state is which tree holds the requirement: an intent's delta, proposed; `openspec/specs/` on the shared line, standing; removed, retired. The evidence name `claim.on_shared_line` keeps its meaning |
| profiles/host.yaml | OpenSpec is the claim store on both sides; nothing is written beside it |
| surfaces | a claim renders as a requirement with its scenarios, name, version and scope; the chapter shows it included |
| roadmap | phase 3 (context) builds the include and the ledger over specs; phase 2's landing archives unit deltas |

Phase 1 is touched only in the claim machine's comments; no phase-1
scenario reads a chapter or a spec.

## Open

- Whether a capability directory must be a map id, or may be a plain
  name with every attachment on the `Attaches:` line. The first keeps
  scope derivable from the directory alone and is proposed here.
