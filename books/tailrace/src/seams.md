# The core and its seams

tailrace is one core that knows git and reaches everything else through
seven seams. Each seam is a contract of Part B, and each is bound by
naming one or more profiles of Part C (92). Parts A and B do not change
to admit a profile.

**The store** (B.1) holds bytes by digest and never alters them (73).
It puts bytes and artifacts, attaches an attestation to a digest and
lists what is attached, moves a name only from the digest it is expected
to be at, resolves a name, and reads bytes (66 to 72). An OCI registry
is the first profile and an OCI layout on disk the second (C.1, C.2).

**The build** (B.2) makes the declared outputs present for a revision,
or says which it could not, and reports for each output its build
identity, its outcome and where its files are (74, 75). The same
revision and inputs give the same identity on every host (76). moon is
the first profile; a declared command with a git tree hash the second
(C.3, C.4).

**The landing** (B.3) says whether a branch has landed a revision, and
gives every signed verdict the repository's gate recorded for it (77,
78). sluice is the first profile; a plain branch with no verdicts the
second (C.5, C.6).

**The signer** (B.4) signs a claim as the party running tailrace, and
says which of the signers a policy names made an attestation, or that
none did (79, 80). An expired identity is reported as expired, never as
valid and never as absent (81). A key in a key service, a host key and
keyless signing are the profiles (C.7 to C.9).

**The policy** (B.5) gives, for a repository at a landed revision and
an audience, the claims required and the signers that may make each
(82). The policy file in the repository is its profile (C.10).

**A projection** (B.6) packs an output into an ecosystem's own bytes,
renders a consumer layout, and serves it where the ecosystem's clients
read no files (84 to 86). Eight projections are listed (C.11).

**A target** (B.7) says what an environment should run and what it
runs, converges it, and reports (88 to 91). Seven targets are listed
(C.12).

## Who binds what

The repository's authors bind the build, the projections and the
targets in the repository; the operator binds the store, the signers and
the landing for a host (92). Any number of projections and targets are
bound at once; exactly one store is written by a publish, and exactly
one landing is read. One conformance suite holds every profile to Parts
A and B (93).
