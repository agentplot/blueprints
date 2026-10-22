# Artifacts and claims

## An artifact

An artifact is bytes, their digest, and the metadata that says what the
bytes are: which ecosystem's form they take, which name they have in
that ecosystem, and which version (4). The digest is a function of the
bytes alone, so the same bytes have the same digest on every host and in
every store (1), and the store never holds other bytes under it (2).

Everything else is a pointer. A version names a set of digests through
its index, itself an artifact (6); an ecosystem name and a channel name
a digest (3). Nothing reads a pointer to learn what bytes are: whatever
acts resolves the pointer to a digest first and records the digest it
acted on. A tag that moves under a reader moves nothing the reader
already did.

Offering the same bytes twice writes nothing and answers the same digest
(5). That is what makes a second publish of the same landing, a copy
between stores and a sync to a laptop idempotent.

## A claim

A claim is one statement by one signer about one digest (7): that a
build produced it from a revision, that checks passed on that build,
that a test ran, that a reviewer approved it, that a verifier rebuilt it
and the digests matched, that the gate accepted it, that a channel moved
to it. Signed, it is an attestation, attached to the digest it is about,
and it travels with the digest from store to store (8). A claim about a
version is a claim about its index (7).

A claim counts only through a signer the policy names, and only for
what the policy lets that signer claim (9). A build host's claim that
the build passed review counts for nothing; a reviewer's does. Every
other claim is kept and never counted, so a store full of noise is a
store, and a verdict is read from the policy, never from what happens to
be attached.

A claim is never altered (10). A signer that changes its mind makes a
new claim beside the old. Every claim names the revision and the build
identity it was made for (13): sluice's verdict names the task hash it
passed on, the provenance names the task hash the outputs came from, and
a verdict joins them without reading either source again.

## What tailrace signs

tailrace signs only as the party that runs it, and only what that party
observed: the publish it ran, the verdict it reached, the copy it made
(11). A claim another party made, sluice's verdict among them, is carried
as that party made it, signature and all, inside tailrace's own claim
that says where it was found (12). The carrier never re-signs another's
claim as its own, so a verifier peels two layers and trusts each by its
own signer.

<figure class="tr">
<svg viewBox="0 0 800 300" role="img" aria-label="One digest with its attestations attached: the fleet's provenance, sluice's verdict carried inside tailrace's claim, a test result, a reviewer's approval, the gate's acceptance and a promotion. A policy names which signers count.">
<rect x="300" y="110" width="200" height="80" rx="10" class="tr-bx-a"/>
<text x="400" y="142" text-anchor="middle" class="tr-t">artifact</text>
<text x="400" y="166" text-anchor="middle" class="tr-m">sha256:4f2a…</text>
<rect x="20" y="20" width="200" height="56" rx="8" class="tr-bx"/>
<text x="32" y="44" class="tr-t">provenance</text>
<text x="32" y="64" class="tr-s">signer: the fleet (13)</text>
<rect x="20" y="122" width="200" height="56" rx="8" class="tr-bx"/>
<text x="32" y="146" class="tr-t">sluice's verdict, carried</text>
<text x="32" y="166" class="tr-s">signer: the host; inside: sluice's (12)</text>
<rect x="20" y="224" width="200" height="56" rx="8" class="tr-bx"/>
<text x="32" y="248" class="tr-t">test result</text>
<text x="32" y="268" class="tr-s">signer: the fleet</text>
<rect x="580" y="20" width="200" height="56" rx="8" class="tr-bx"/>
<text x="592" y="44" class="tr-t">approval</text>
<text x="592" y="64" class="tr-s">signer: a reviewer</text>
<rect x="580" y="122" width="200" height="56" rx="8" class="tr-bx-a"/>
<text x="592" y="146" class="tr-t">accepted</text>
<text x="592" y="166" class="tr-s">signer: the gate (26)</text>
<rect x="580" y="224" width="200" height="56" rx="8" class="tr-bx-a"/>
<text x="592" y="248" class="tr-t">promoted to beta</text>
<text x="592" y="268" class="tr-s">signer: the gate (39)</text>
<line x1="220" y1="48" x2="300" y2="130" class="tr-ar"/>
<line x1="220" y1="150" x2="300" y2="150" class="tr-ar"/>
<line x1="220" y1="252" x2="300" y2="170" class="tr-ar"/>
<line x1="580" y1="48" x2="500" y2="130" class="tr-ar"/>
<line x1="580" y1="150" x2="500" y2="150" class="tr-ar"/>
<line x1="580" y1="252" x2="500" y2="170" class="tr-ar"/>
<text x="400" y="230" text-anchor="middle" class="tr-s">the policy names which signers count (9)</text>
</svg>
</figure>
