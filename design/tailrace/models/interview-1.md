# tailrace — interview 1

The questions the operator rules on next, gathered on 2026-10-22 from
the reconstruction (`reconstruction-1.md`, Q1 to Q20, made from the
statement as it stood before the clean-room review) and from the
review's three gaps that are rulings. Each names the clauses it sits
beside and the lean where there is one. A ruling lands in the statement
as a clause numbered from 105, or as a rewrite of the clause named; the
answers are recorded in `interview-1-answers.md` beside this file.

## Already answered by the review's edits

- Q1 (22): the version's name is claimed in the repository's shared
  history; a repository whose history no other publisher shares has one
  publisher. Confirm or amend.
- Q2 (33, 61): one record is a channel's source of truth and the rest
  are projections (101); which one is below as A.

## A. The ledger and the gate

- A (101, 33, 39). Which record is a channel's source of truth: git, or
  a chain of gate-signed claims in the store with a name moved by
  expected digest? Lean: git the source, the referrer the projection.
- Q3 (29, 65). At which landed revision does the gate read the
  acceptance policy: the one the index was published from, or the
  governed branch's head when it judges? Lean: the branch's head when
  it judges, since a policy change must bind what is judged after it.
- Q4 (37). "Only from the channel it is bound to": the bound channel's
  head at promotion time, or any version it ever held? Lean: any
  version the ledger shows it held, so a rollback on stable to a
  version beta has left is allowed.
- B (27, 96). May a solo user hold the offering and the accepting
  credentials on one host under a policy that says so? The statement
  forbids it. Lean: admit it under a policy that names the host as its
  gate, with the acceptance claim saying so, so a reader can tell a
  one-host acceptance from a separated one.
- Q18 (31, 36). When the store cannot move a name against an expected
  digest, what must a reader of the channel still have? Lean: the
  ledger decides, the tag is a projection (101), and a profile that
  cannot move with expectation reads back after the move.
- Q5 (41, 97). Where is an approval recorded and in whose signature,
  and may an approver approve one environment's convergence apart from
  the promotion? Lean: an approval is a claim by the approver on the
  index, naming the environment, so per environment is admitted.

## B. Publishing and versions

- Q10 (21). One version per publish for every artifact, or one per
  artifact name, when packages change at different rates? Lean: one
  version per publish, every artifact at it, as the family versions a
  release; per-name versioning is a profile of the version rule.
- Q11 (18). When a repeat publish packs different bytes, refuse
  outright, or offer under a new index the name does not move to?
  Lean: refuse, naming the artifact; the name stays with the first.
- Q12 (16, 75, 78). "Its build's outcome": the build seam's own, the
  landing's verdicts, or both, and which wins? Lean: both must pass
  where both exist, and the landing's verdict names the identity that
  must match (15).
- Q20 (16, 74). Is `ensure` one call for all outputs, and is a partial
  answer a refusal? Lean: one call, a partial answer refuses the
  version whole (16).
- Q13 (30, 55, 87). Does a verifier compare digests of outputs or of
  packed artifacts? Lean: outputs, since packing may not be
  reproducible (87); a projection that packs reproducibly may be
  compared after packing too.

## C. Consumers

- C (47, 65). Under which repository's policy, at which landed
  revision, is a layout rendered for a repository that consumes
  another's versions? Lean: the consuming repository's own policy; a
  repository with none renders under the publishing repository's layout
  policy.
- Q7 (47, 99). Where a client shows only absence, is answering the
  refusal to whoever rendered enough? Lean: yes for a file layout;
  serve answers the request itself with the reason.
- Q8 (49). Does a loopback address count as "no host"? Lean: a fixed
  name on every host counts; a loopback with a port that differs per
  host does not.
- Q14 (61, 62). Must a render record be readable from every checkout,
  and how does it travel? Lean: it is the host's, not the repository's;
  62 is amended to say what is the repository's and what is the host's.
- Q19 (86, 60). Who runs `serve`, for how long, and may it reach the
  store on a miss? Lean: the host, as long as a client needs it, and a
  miss is a render (50), which 60 does not cover since it is not a read
  of what tailrace holds.

## D. Signers and policy

- Q16 (9, 82). A signer's reach: predicate types only, or outputs,
  checks and ecosystems too? Lean: predicate types, and for a verdict
  the checks it may claim, as sluice's policy already names.
- Q15 (25, 81). An expired signer's claim that counted at acceptance:
  does a layout rendered later refuse the version? Lean: no; acceptance
  stands (94), and a layout policy that requires a live signature says
  so itself.
- Q17 (92). Where are the operator's bindings of store, signers and
  landing kept, outside the repository yet readable by plain tools?
  Lean: a host file beside sluice's, in the same form.

## E. Environments and the cache

- Q6 (43, 89, 98). A target that can never say what it runs: is unread
  the permanent answer, or must it carry a marker the reconciler
  writes? Lean: a marker the reconciler writes where the target admits
  one, unread otherwise.
- Q9 (52, 54). A Nix closure of thousands of referencing digests
  against a removal that is not reference-aware. Open; a measurement
  answers it (`open.md`).

## Ties the model named, for a recommendation

The reconstruction lists three designs that satisfy the same clauses
equally and recommends one of each; the operator may take or overturn
them when ruling on A and Q18.
