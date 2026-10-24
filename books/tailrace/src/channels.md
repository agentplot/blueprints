# Channels and the ledger

A channel is a named pointer to exactly one accepted version (31).
`beta` and `stable` are the family's names; a repository's authors name
their own. An empty channel is an answer, never an error.

## Only a promotion moves a channel

A channel moves only by a promotion, and only the gate makes one (32),
at the asking of a party the policy lets ask: a rule that follows each
publish, which is how `beta` takes each landing, or an approver, which
is how `stable` takes a weekly cut. A channel moves only from the
version it is at (35): a promotion that names a different starting
version is refused naming the version the channel is at, and nothing is
retried blind.

A channel belongs to one component and names only its versions (125), so
a repository of several components has `stable` for each.

The policy may bind a channel to another (37): `stable` takes a version
only from among those the ledger shows `beta` has held, never from a
publish directly, so a version has stood on `beta` before anyone's
`stable` environment sees it, and `stable` can go back to a version
`beta` has since left.

## The ledger

Every promotion is recorded before the channel is read as moved (33):
the channel, the version it moves from and to, who asked, which policy
was satisfied by which claims, and when. The ledger is append-only (34).
A wrong move is undone by a further promotion back, which the ledger
records like any other; the version left stays accepted and readable
(38).

The ledger is a chain per channel (105). Every promotion is a claim the
gate signs about the version it moves to, and it names the digest of
the promotion it follows, so the chain is ordered and tamper-evident
wherever it is held. A promotion whose predecessor is not the chain's
head is refused (35), and two promotions that name one predecessor are
a fork, which the gate reports and never resolves by choosing. The same
claim is attached to the version's index (39), so a store that holds
the version holds the proof of each channel it was ever on, and a copy
of the version carries that proof with it (8).

## The ledger as a seam

Where the chain is held is a seam of its own, the ledger (B.8): it
appends a promotion only after the one that promotion names, and
answers the chain (120 to 122). The ledger is the one record every
channel state rests on; the tag in the store, the claim on the index and a
layout are written from it and never read as truth (101, 106), and
where the store disagrees with the ledger, the gate rewrites the store
from the ledger.

The gate alone appends, so a person who asks for a promotion, from a
terminal or a phone, asks the gate and the gate writes wherever the
ledger's profile says. For the standalone tool the ledger is a git ref
per channel that the gate's own identity pushes, since a repository
already has one and a fast-forward push refuses a stale predecessor
for every store alike (C.13). A store keeps the chain alone only where
the operator can trust it to retain untagged claims; a registry whose
retention rules expire them by age cannot (C.14). A control plane holds
the chain in a table with conditional writes, its own rows written in
the same transaction and read as projections (C.15).

Where a store cannot move a tag against the digest it is expected to be
at, the gate moves it, reads it back, and reports a tag found elsewhere
as a lost race it repairs from the ledger (109).

A channel resolves to exactly one version for every reader (36). A
repository may declare no channel at all, and nothing of a publish
changes when it does (102).

<figure class="tr">
<svg viewBox="0 0 800 220" role="img" aria-label="Versions 1.3.0, 1.4.0 and 1.5.0 accepted in the store. beta points at 1.5.0 after each publish; stable points at 1.4.0, moved there by an approver, and may take a version only from beta. The ledger below lists each move in order.">
<rect x="20" y="30" width="140" height="56" rx="8" class="tr-bx-a"/><text x="90" y="64" text-anchor="middle" class="tr-m">1.3.0</text>
<rect x="200" y="30" width="140" height="56" rx="8" class="tr-bx-a"/><text x="270" y="64" text-anchor="middle" class="tr-m">1.4.0</text>
<rect x="380" y="30" width="140" height="56" rx="8" class="tr-bx-a"/><text x="450" y="64" text-anchor="middle" class="tr-m">1.5.0</text>
<text x="600" y="52" class="tr-t">beta → 1.5.0</text>
<text x="600" y="72" class="tr-s">follows each publish (32)</text>
<line x1="596" y1="60" x2="524" y2="58" class="tr-ar"/>
<text x="600" y="108" class="tr-t">stable → 1.4.0</text>
<text x="600" y="128" class="tr-s">an approver asked; from beta only (37)</text>
<line x1="596" y1="116" x2="344" y2="70" class="tr-ar"/>
<text x="20" y="140" class="tr-th">LEDGER (33, 34)</text>
<text x="20" y="162" class="tr-m">beta: ∅ → 1.3.0 · rule · provenance, verdicts</text>
<text x="20" y="180" class="tr-m">beta: 1.3.0 → 1.4.0 · rule · provenance, verdicts</text>
<text x="20" y="198" class="tr-m">stable: ∅ → 1.4.0 · approver · + rebuild matched, approval</text>
<text x="20" y="216" class="tr-m">beta: 1.4.0 → 1.5.0 · rule · provenance, verdicts</text>
</svg>
</figure>
