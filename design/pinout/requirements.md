# pinout — requirements
<!-- ANCHOR: preamble -->

A statement of what pinout must always do and never do, written to admit
any model that satisfies it.

The statement is in three parts. Part A is what must hold of pinout on
its own: the answers it gives about a repository and the properties
every answer has. Part B is the workspace contract: the few operations
pinout needs from whatever already knows a repository's projects and
tasks, and the guarantee each must give. Part C is the profiles: the
ways that contract is satisfied, one per workspace tool.

Parts A and B name no mechanism: no command, file, format, field,
protocol or tool. One thing of the world they do name freely, because
section 9 fixes it: git. Every other real tool is named only in section
9 and in Part C, where naming it is the point. A reader who has never
seen a monorepo tool should be able to design from Parts A and B and
git alone.

## 1. Purpose

pinout answers the questions anyone about to change a repository has to
answer first: what is in it, which part owns a file, what a change
affects, how a part is built or tested, and what that build or test
reads. It answers them the same way for every repository, whichever
tool that repository chose to organize itself, so an agent, a person or
a pipeline asks once and never learns each tool. It describes; it never
acts.

<!-- ANCHOR_END: preamble -->
<!-- ANCHOR: actors -->
## 2. Actors

| actor | may decide | may not |
|---|---|---|
| **the repository's authors** | what the projects and tasks are, what each task reads, which tool organizes the repository | nothing pinout reports is theirs to override at the moment of asking |
| **an asker** (a coding agent, a person, a pipeline, a test ledger, a build platform) | which question to ask, of which repository state | it never changes what pinout reports by who it is |
| **pinout** | nothing about the repository; it reports what the repository declares, through the binding that reads it | it never runs a task, never writes to the repository, never invents a project, task, dependency or input |
| **a workspace tool** | what it declares about the repository it organizes | it is never asked to act, only to describe |

<!-- ANCHOR_END: actors -->
<!-- ANCHOR: glossary -->
## 3. Vocabulary

Terms are defined by meaning. A model may add terms; it may not
redefine these.

- **repository state**: the content of a repository at one commit,
  together with any uncommitted change the asker names as part of it.
- **project**: a part of a repository that its authors declare as one
  unit, owning a set of the repository's paths.
- **task**: a named operation a project offers, such as building,
  testing, linting or type-checking it.
- **dependency**: a declared relation by which one project's tasks may
  read another project.
- **change**: the difference between two repository states.
- **affected**: a project is affected by a change when a task of it may
  give a different result after the change than before.
- **inputs**: every fact a task's result may depend on: the content of
  files, and any other fact the repository declares, such as a tool's
  version or a setting of the environment.
- **assurance**: what a statement that a set of inputs is complete rests
  on. **Declared**: the repository lists them. **Convention**: a stated
  rule of the profile infers them. Nothing else is an assurance pinout
  gives.
- **digest**: a fixed-size fingerprint of the content of a task's
  inputs.
- **invocation**: what runs one task as the repository's own tooling
  would run it.
- **answer**: what pinout returns to one question. It is exactly one of
  a **description**, **unknown** (the repository does not say) or
  **refused** (pinout cannot ask, and says why).
- **binding**: one way of reading a workspace tool, as Part C
  describes.
- **surface**: one way an asker reaches pinout.

<!-- ANCHOR_END: glossary -->
<!-- ANCHOR: part-a -->
## Part A. What pinout answers

### A.1 Answers

1. pinout only describes. It never runs a task, never writes into the
   repository state it describes, and leaves the repository as it found
   it.
2. The same question about the same repository state, through the same
   binding, gets the same answer, identical in every byte.
3. Every answer is exactly one of a description, unknown or refused. A
   description that lists nothing, a repository with no projects, is a
   description, and is never given in place of unknown or refused.
4. A refused answer names what was missing, and where a workspace tool
   refused, carries that tool's own words unaltered.
5. Unknown is never rounded into a description. Where a binding can say
   part of an answer, the answer marks unknown exactly the part it
   cannot say.
6. An answer never depends on who asks, or on which surface the
   question came through.
7. Every answer names the version of this statement it satisfies and
   the binding that produced it.

### A.2 Projects and tasks

8. Every project has an identifier that is unique in the repository and
   unchanged for as long as its declaration is unchanged.
9. Every path of the repository is owned by at most one project, and a
   path no project owns is answered as owned by none.
10. Every task belongs to exactly one project and is named by that
    project and its own name.
11. pinout invents nothing: every project, task and dependency it
    reports has a declaration the repository state holds, read through
    its binding.

### A.3 Changes

12. The projects affected by a change are those owning a changed path,
    together with every project that depends on an affected project.
13. An answer about what a change affects errs only toward more. Where a
    dependency is unknown, every project that might depend is reported
    affected, and none is ever left out to make the answer smaller.

### A.4 Inputs and digests

14. Every digest states its assurance, and pinout never states an
    assurance higher than its binding establishes.
15. A digest is given only for a set of inputs complete under its stated
    assurance. Where completeness cannot be stated, the digest is
    unknown, never computed over part of the inputs.
16. Two repository states whose inputs to a task have identical content
    give that task the same digest, whatever their commit, branch,
    checkout location or machine.
17. Any difference in the content of a task's inputs gives a different
    digest.
18. How a digest is derived from its inputs is published, and any party
    holding the same inputs can derive the same digest without pinout.
19. With every digest pinout can name the inputs it covers, so a party
    can check the digest, or say which input made two digests differ.

### A.5 Invocations

20. For each task pinout gives exactly one invocation, the one the
    repository's own tooling uses, and depends on nothing but the
    repository state and the binding to give it.

### A.6 Vocabulary of the answers

21. Every answer uses only this statement's vocabulary and the
    repository's own names. No term in an answer belongs to any one
    asker.

<!-- ANCHOR_END: part-a -->
<!-- ANCHOR: part-b -->
## Part B. The workspace contract

pinout reads every repository through one contract. A binding is one
way of satisfying it for one workspace tool.

### B.1 Operations

22. **enumerate**: given a repository state, the projects, the paths
    each owns, and the tasks each offers.
23. **relate**: given a repository state, the dependencies between its
    projects.
24. **declare-inputs**: given a task, its inputs and the assurance
    under which they are complete.
25. **invoke**: given a task, its invocation.

### B.2 Guarantees

26. Every operation has no effect on the repository state it reads.
27. Every operation answers with what the repository declares, or
    unknown for what it does not, under the same three kinds of answer
    as A.1 (3).
28. Every operation gives the same answer for the same repository state.

### B.3 Binding the contract

29. A binding implements all four operations. Where its tool cannot
    answer one, the binding answers unknown and still implements it.
30. A binding states, once and in its profile, the rule by which it
    infers any input under convention, and applies no other.
31. Which binding reads a repository is decided by the repository state
    alone, and an asker can name a different one.
32. One conformance suite holds every binding to Parts A and B; a binding
    that fails it is not a binding.

<!-- ANCHOR_END: part-b -->
<!-- ANCHOR: part-c -->
## Part C. Profiles

Parts A and B do not change to admit a profile. Each profile maps the
four operations of B.1 onto one workspace tool.

### C.1 moon

| operation | how moon satisfies it |
|---|---|
| enumerate | moon's project and task graph, as `moon query projects` and `moon query tasks` report it |
| relate | the project graph's declared dependencies |
| declare-inputs | each task's declared `inputs`, assurance declared; the files moon hashes for the task's own cache key |
| invoke | `moon run <project>:<task>` |

### C.2 Turborepo

| operation | how Turborepo satisfies it |
|---|---|
| enumerate | the workspace packages, and the tasks `turbo.json` declares for each |
| relate | the packages' declared dependencies |
| declare-inputs | the task's `inputs` where declared, assurance declared; otherwise Turborepo's default of the package's files, assurance convention |
| invoke | `turbo run <task> --filter=<package>` |

### C.3 Nx

| operation | how Nx satisfies it |
|---|---|
| enumerate | the project graph and each project's targets |
| relate | the project graph's edges, declared or inferred by Nx |
| declare-inputs | the target's resolved `inputs` and named inputs, assurance declared |
| invoke | `nx run <project>:<target>` |

### C.4 Package-manager workspaces

| operation | how a workspace without a task tool satisfies it |
|---|---|
| enumerate | each workspace package is a project; each of its scripts is a task |
| relate | the packages' dependencies on one another |
| declare-inputs | the package's own files, every package it depends on, the lockfile and the root configuration, assurance convention |
| invoke | the package manager running the script in the package |

### C.5 Declared paths

For a repository with no workspace tool. A file in the repository lists
the projects, the paths each owns, each task's command and the globs it
reads.

| operation | how declared paths satisfy it |
|---|---|
| enumerate | the file's projects and tasks; with no file, the whole repository is one project |
| relate | the dependencies the file lists; with none listed, unknown |
| declare-inputs | the task's globs, assurance declared; with none, the whole repository, assurance convention |
| invoke | the command the file gives |

<!-- ANCHOR_END: part-c -->
<!-- ANCHOR: invariants -->
## 7. Global invariants

- **I1.** pinout never changes a repository and never runs what it
  describes (1, 26).
- **I2.** The same question about the same repository state gets the
  same bytes (2, 28).
- **I3.** Unknown, refused and an empty description are three answers,
  never one (3, 5, 27).
- **I4.** pinout errs only in the safe direction: a change affects more
  rather than fewer projects, and a digest is unknown rather than
  partial (13, 15).

<!-- ANCHOR_END: invariants -->
<!-- ANCHOR: non-goals -->
## 8. Non-goals

- Running tasks, ordering them, or running them in parallel. The
  workspace tool and the asker do that.
- Caching the outputs of tasks.
- Recording whether a task passed. That is a test ledger's.
- Choosing what an asker should run, or when.
- Versioning or releasing anything.
- Writing or migrating a workspace tool's configuration.

<!-- ANCHOR_END: non-goals -->
<!-- ANCHOR: givens -->
## 9. Environment givens

Constraints already fixed:

- Repositories are git repositories.
- The askers include coding agents working in many checkouts of one
  repository at once.
- pinout is free and open source.

The rest of the stack, which a model builds on unless it says why not:

- Two surfaces: a command-line program, and a Model Context Protocol
  server for agents, both answering in JSON.
- SHA-256 for digests.
- The profiles of Part C, moon first.

<!-- ANCHOR_END: givens -->
<!-- ANCHOR: questions -->
## 10. Questions the model must answer

These are not requirements.

- Is an uncommitted change part of the repository state by default, or
  only when the asker names it?
- How are inputs that are not files, a tool's version or a setting of
  the environment, expressed so that two machines agree on them?
- May projects nest, and if they may, how does a path keep at most one
  owner (9)?
- Which implementation language: one that ships a single binary, or one
  that the first consumers can embed as a library?

<!-- ANCHOR_END: questions -->
<!-- ANCHOR: scenarios -->
## 11. Scenarios the model must satisfy

- **S1.** An agent new to a repository asks which project owns the file
  it is about to edit and how that project is tested, and runs exactly
  that test, never the whole repository's.
- **S2.** A pipeline asks what a branch's change affects against the
  default branch and gets the projects owning the changed paths and
  every project depending on them.
- **S3.** Two checkouts of one repository on two machines, at different
  commits with identical content under a task's inputs, are given the
  same digest for that task.
- **S4.** A repository with no workspace tool and no file of declared
  paths is described as one project whose inputs are the whole
  repository, under convention.
- **S5.** A workspace tool that cannot list a task's inputs yields a
  digest of unknown, and the asker can tell that from a refusal.
- **S6.** The same question through the command line and through the
  agent surface gives the same answer.
- **S7.** An asker holding two digests of one task asks why they differ
  and is told which inputs changed.

<!-- ANCHOR_END: scenarios -->
<!-- ANCHOR: deliver -->
## 12. What to deliver

A model of pinout that satisfies Parts A and B: its components, the
answers each surface gives, and how a binding is added. A conformance
suite whose scenarios each cite the clauses they exercise, failing when
a clause is cited by nothing. Bindings for the profiles of Part C,
each passing the suite.

<!-- ANCHOR_END: deliver -->
