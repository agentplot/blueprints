# tailrace — rulings after interview 1

Rulings the operator made outside an interview, each with where it
landed in the statement.

| date | question | ruling | landed |
|---|---|---|---|
| 2026-10-23 | one version per revision, or one per declared component, as Switchboard's manifests | declared components, one component by default: the authors declare each component by its outputs, the paths that version it and its tag prefix; the version rule runs per component; a publish names a component or every component a commit touched; a channel belongs to one component | 22, 110, 123 to 125, glossary, actors, C.10, givens, S15 |
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
  running; the question is in section 10 and on the book's open page.
