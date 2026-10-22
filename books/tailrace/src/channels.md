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

The policy may bind a channel to another (37): `stable` takes a version
only from `beta`, never from a publish directly, so a version has stood
on `beta` before anyone's `stable` environment sees it.

## The ledger

Every promotion is recorded before the channel is read as moved (33):
the channel, the version it moves from and to, who asked, which policy
was satisfied by which claims, and when. The ledger is append-only (34).
A wrong move is undone by a further promotion back, which the ledger
records like any other; the version left stays accepted and readable
(38).

Every promotion is also a claim about the version it moves to, signed by
the gate and attached to the version's index (39). A store that holds
the version holds the proof of each channel it was ever on, and a copy
of the version carries that proof with it (8).

Every follower of a channel reads one head (36): no two consumers,
targets or surfaces read the same channel at the same moment and get two
versions.

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
