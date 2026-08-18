# Orphans dropped with commissioning-template's proposals chapter

Two named verification IDs were declared only in `books/commissioning-template/src/proposals.md`
and never landed as rows in `src/verifications.md`'s catalog. The catalog is meant to be the
complete named-verification set, so this gap predates the retirement — deleting the chapter only
makes it visible. Recorded here rather than invented into the catalog.

- `verify:smoke:spike-workspace-mcp-wired`
- `verify:e2e:spike-probe-roundtrip`

Both are declared by the `scaffold-spike-commissioning-plugin` entry, which itself had no chapter
in the book. Its verbatim text:

```
### `scaffold-spike-commissioning-plugin`

- **Scope:** [Two-track model](two-track-model.md),
  [`commissioning`](../aidlc-design/commissioning.md#spike-commissioning)
- **Seams touched:** the design book's requirements contract (reads
  `maturity: candidate` rows from `contracts/commissioning.yaml`); the
  execution-track plugins (sibling shape — reuses the provider
  scaffolding but targets a throwaway workspace); `agent-workspaces`
  (the scratch sibling repo is a commissioned workspace; `.mcp.json` is
  part of its floor); `book-decompose-commissioning` (writes settled
  requirements + decisions back to the design book).
- **Depends on:** `scaffold-devenv-commissioning-plugin` (the scratch
  workspace still carries a `suite-*` family for its probes)
- **Verifications gate:**
  - `verify:smoke:can-render-devenv-nix`
  - `verify:smoke:suite-verify-umbrella-present`
  - `verify:smoke:audit-suite-conformance-rejects-broken-devenv`
  - `verify:smoke:plan-yaml-parses`
  - `verify:smoke:resources-yaml-parses`
  - `verify:smoke:commissioning-plan-ready-exits-zero-on-canonical-book`
  - `verify:smoke:spike-workspace-mcp-wired`
  - `verify:e2e:spike-probe-roundtrip`
- **Summary:** The marketplace ships `plugins/spike-commissioning/` —
  a commissioning-family sibling that reads a design book's `candidate`
  commissioning requirements and stands up a **throwaway sibling repo**
  commissioned for learning, not construction. It scaffolds the scratch
  repo and a `SPIKE.md` findings sink, commissions a **real cloud
  account** with scoped IAM and cost guardrails (not ministack —
  Bedrock KB, Bedrock Flows, and Neptune are thin or absent locally),
  writes a `.claude/settings.json` that **enables** the commissioning
  plugins named in each requirement's `satisfied-by` (their bundled MCP
  servers + references come along — no hand-generated `.mcp.json`) so a
  session knows the service surface on day one, and registers one
  `suite-*` probe per requirement. Its deliverable is **book deltas**: an
  answered probe promotes a requirement `candidate → settled` upstream
  and writes the decision into the chapter that motivated it. The
  scratch repo is archived when the requirements settle. Novel over the
  execution-track plugins on two axes: enabling the satisfied-by plugins
  so their tool surface is the deliverable (not just infra) and the
  throwaway lifecycle (no permanent floor). Introduces
  `verify:smoke:spike-workspace-mcp-wired` and
  `verify:e2e:spike-probe-roundtrip`.

## Cross-book interactions

| This book's proposal | Pairs with |
|---|---|
| `wire-conductor-claim-time-suite-verify-gate` | [`../conductor/proposals.md#wire-conductor-claim-time-suite-verify-gate`](../conductor/proposals.md) — same change, conductor side owns the runtime; this book owns the contract |
| `scaffold-book-commissioner-plugin` | [`../hil-gateway/proposals.md`](../hil-gateway/proposals.md) — book-commissioner uses hil-gateway's `ask_user` envelope shape for failure escalation |

## Archived

(none yet — populated as `openspec/changes/` accumulates archived
```
