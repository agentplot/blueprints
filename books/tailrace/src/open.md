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
`design/tailrace/models/interview-1.md`, and the operator rules on each
into the statement as clauses numbered from 105. A clean-room review on the same day moved thirteen
clauses and added 94 to 104; its three gaps that are rulings are the
first three questions below. The questions below are the statement's and the
pack's, each with the clauses it touches.

## Versions and the ledger

- Which record is a channel's source of truth and which the projection
  (101), when the store has no append-only primitive (33, 39, 61). The
  lean: the record in git, and each promotion also a referrer on the
  version's index, so either alone reconstructs the other.
- Whether a solo user may hold the offering and the accepting
  credentials on one host under a policy that says so (27, 96); the
  statement forbids it as written.
- Under which repository's policy a consumer layout is rendered for a
  repository that consumes another's versions (47, 65).
- Whether every landing that carries a feature or a fix is a release,
  or a person cuts releases, is the authors' rule (21); the family's
  default is the former.

## Consumers

- Which consumer layouts can hold a refusal's reason where the client
  shows only absence (47, 58). The lean: serve answers the tarball
  request itself with the reason; a file layout cannot, and the sync
  that rendered it reported it.
- Whether serve accepts a client's own publish (`npm publish` against
  it) and turns it into an offer in the host's identity, or stays
  read-only with the hook naming tailrace's publish. The lean:
  read-only (20, 11).
- Whether plain pip, which picks the highest version across two indexes,
  is a supported client, or uv's per-package index is required.

## Environments

- What a reconciler reports for a target that cannot say what it runs
  (43, 89); the statement says unread with the reason, and the form of
  "the reason" is the model's.
- The reconciler contract for a Kubernetes target that pulls: only a
  watcher, and which status it writes back (44, 91).

## The cache and Nix

- How a Nix closure, thousands of digests with references among them,
  maps onto artifacts and the cache without a reference-aware removal
  (52, 54), and whether the store serves the binary-cache protocol as a
  projection or layers under Attic. A prototype against one machine's
  closure and a measurement against Attic answer it.
- Whether moon's remote cache protocol maps onto the store's put and
  read alone, to be verified against moon's own cache API.

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
