# tailrace — rulings after interview 1

Rulings the operator made outside an interview, each with where it
landed in the statement.

| date | question | ruling | landed |
|---|---|---|---|
| 2026-10-23 | one version per revision, or one per declared component, as Switchboard's manifests | declared components, one component by default: the authors declare each component by its outputs, the paths that version it and its tag prefix; the version rule runs per component; a publish names a component or every component a commit touched; a channel belongs to one component | 22, 110, 123 to 125, glossary, actors, C.10, givens, S15 |

## What the operator said beyond the leans

- On components: one policy file holds every component, and a host that runs a
  separate job per manifest, as Switchboard does, runs a publish per
  component against the same file at the landed revision.
- On environments: a short static list in the policy is the common
  case, and managed hosting of many instances adds environments while
  running; the question is in section 10 and on the book's open page.
