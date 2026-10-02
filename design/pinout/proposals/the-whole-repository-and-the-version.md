# The whole repository as one project, and the version an answer names

Two clauses of Part A cannot be satisfied as written. Each has a small
rewrite that keeps what it was for.

## A repository that declares no parts

### The problem

Clause 11 says pinout invents nothing: every project it reports has a
declaration the repository state holds. The declared-paths profile and
S4 say that a repository with no workspace tool and no file of declared
paths is described as one project whose inputs are the whole repository.
That project has no declaration. Clause 3 uses "a repository with no
projects" as its example of a description that lists nothing, which is
the same repository described the other way.

A consumer has to know which it will get. One project under convention
lets it key a check on the whole tree and reuse a pass when nothing
changed. No projects gives it nothing to key.

### What the statement already settles

Convention is already an assurance pinout may give, where a stated rule
of the profile infers what the repository does not list (glossary), and a
binding states that rule once, in its profile, and applies no other (30).
Clause 30 limits this to inputs. The declared-paths profile already
applies it to a project.

### The ruling

> 3. Every answer is exactly one of a description, unknown or refused. A
>    description that lists nothing, a project with no tasks, is a
>    description, and is never given in place of unknown or refused.
>
> 11. pinout invents nothing: every project, task and dependency it
>     reports has a declaration the repository state holds, read through
>     its binding, or is the repository taken whole under its profile's
>     stated convention.
>
> 30. A binding states, once and in its profile, the rule by which it
>     infers any input, or the one project of a repository that declares
>     none, under convention, and applies no other.

## The version an answer names

### The problem

Clause 7 says every answer names the version of this statement it
satisfies. The statement has no version: its clauses are rewritten in
place and it reads as one current intent. No model can pass or fail the
clause.

What a consumer needs from it is narrower. It must be able to tell that
two answers were written in the same vocabulary and derived the same
way, so that it never compares a digest derived one way with a digest
derived another (18).

### The ruling

> 7. Every answer names the version of the published vocabulary and
>    digest derivation it is written in, and the binding that produced
>    it. A change to either is a new version.

pinout's rule pinout.11 already says a change to the derivation is a new
version of the answer schema, and cites 7 for it.
