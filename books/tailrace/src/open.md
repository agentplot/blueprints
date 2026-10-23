# Open questions

What the design does not settle, and where each question is held. The
chapters rest only on what the statement settles. A question leaves this
page when the operator rules: the ruling lands in the statement, and the
chapter that rests on it is rewritten whole.

## How the questions are ruled

The statement was written on 2026-10-22 from the inception pack and the
exploration of the command line that preceded it. A fresh model
handed the statement alone reconstructed tailrace the same day,
`design/tailrace/models/reconstruction-1.md`, and asked twenty questions
of it; with the review's three rulings they are the interview,
`design/tailrace/models/interview-1.md`. The operator ruled on every
question of it the same day, in a session; the rulings are clauses 105
to 122 and the rewrites `design/tailrace/models/interview-1-answers.md`
lists. A clean-room review the same day moved thirteen clauses and
added 94 to 104. The questions below are what the interview left open
and what the statement and the pack still hold, each with the clauses
it touches.

## Versions and the ledger

- Whether every landing that carries a feature or a fix is a release,
  or a person cuts releases, is the authors' rule (21); the family's
  default is the former.

## Consumers

- Whether serve accepts a client's own publish (`npm publish` against
  it) and turns it into an offer in the host's identity, or stays
  read-only with the hook naming tailrace's publish. The lean:
  read-only (20, 11).
- Whether plain pip, which picks the highest version across two indexes,
  is a supported client, or uv's per-package index is required.

## Environments

- The reconciler contract for a Kubernetes target that pulls: only a
  watcher, and which status it writes back (44, 91).

## The cache and Nix

- How a Nix closure, thousands of digests with references among them,
  maps onto artifacts and the cache without a reference-aware removal
  (52, 54), and whether the store serves the binary-cache protocol as a
  projection or layers under Attic. A prototype against one machine's
  closure and a measurement against Attic answer it.
- Whether the landed task hashes alone give the cache hit rate a fleet
  needs, or moon's remote protocol must be served over the store as
  well (C.3, C.11); a measurement on one host with many worktrees
  answers it.

## Trust

- The signer the family starts with: a key in a key service, a host key
  as sluice's, or keyless against the public instance (C.7 to C.9); and
  whether tailrace's envelopes must verify under cosign's tooling as
  well as its own.
- The policy language: the file's own tables, or a policy engine's
  language (C.10).

## The store

- Amazon ECR's open issues on artifact media types and on referrer
  pushes (aws/containers-roadmap 2306 and 2783, both open on
  2026-10-21) decide whether the OCI registry profile needs the
  tag-schema fallback on ECR; a push against a real repository answers
  it (C.1).
- Retention: the cache expires by age; artifacts and the ledger are kept
  for years; which store settings make that so is the profile's (54).
