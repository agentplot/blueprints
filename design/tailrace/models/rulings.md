# tailrace — rulings after interview 1

Rulings the operator made outside an interview, each with where it
landed in the statement.

| date | question | ruling | landed |
|---|---|---|---|
| 2026-10-23 | one version per revision, or one per declared component, as Switchboard's manifests | declared components, one component by default: the authors declare each component by its outputs, the paths that version it and its tag prefix; the version rule runs per component; a publish names a component or every component a commit touched; a channel belongs to one component | 22, 110, 123 to 125, glossary, actors, C.10, givens, S15 |
| 2026-10-24 | how an environment is admitted beyond the policy file, and tenants at different paces | a roster operation on the target seam, no seam of its own: the policy declares the kind, the target answers the instances; a tenant on its own pace follows a declared channel such as `lts-<name>`, one environment per channel, never a channel per tenant | 126, B.7, C.10, glossary, section 10 |
| 2026-10-24 | branch builds such as `alpha/<branch>` | a channel pattern in the policy, the channel retired with the branch | 127 |
| 2026-10-24 | a release that moves several channels | several promotions in one act, refused whole where the ledger can hold them as one | 128 |
| 2026-10-24 | who asked for a promotion | an identity the gate verified, from the owner's identity provider; a surface carries the person's own token | 129 |
| 2026-10-24 | what runs publish after a landing, and what tells the gate | no seam: the core starts nothing; a Part C list of what turns the wheel, each named in the host's bindings | 130, C.16 |
| 2026-10-24 | the ledger a control plane binds | a database table with conditional writes, the control plane's own rows written in the same transaction as projections; a control plane's dispatch is the reconciler of a pool target; a CloudFormation template set is a projection, its bucket a rendered layout, never truth | C.15, C.12, C.11 |
| 2026-10-24 | the offering signer on a build fleet | a key in a key service through the runner's role now (C.7); keyless (C.9) once phase 2 delivers it, since 104 wants one name for one signer | none; the roadmap |
| 2026-10-23 | the name of seam B.8: "keeper", or the ledger itself | the ledger: the seam is named for the thing bound, as the store and the policy are; "keeper" is retired. The chain's one true copy is wherever the bound profile holds it, a git ref, the store or a table; every other copy, the store's claims, a ref a service pushes into a tenant's repository, is a projection (101, 106) | glossary, 15, 106, 122, 92, B.8, C.13, C.14 |

## What the operator said beyond the leans

- On components: one policy file holds every component, and a host that runs a
  separate job per manifest, as Switchboard does, runs a publish per
  component against the same file at the landed revision.
- On the ledger: the table or the git ref is the one writer; a copy
  sent to git or to the store is a projection and needs no
  compare-and-swap of its own, since only the ledger's writer writes it.
- On environments: a short static list in the policy is the common
  case, and managed hosting of many instances adds environments while
  running, through the target's roster (126).
- On the template bucket: the control plane's deploy step renders the
  version's template set from the store into the bucket before it
  creates the change set, under a version prefix, the same bytes a
  skip; the bucket is a consumer layout (48), and the store by digest
  stays the truth.
