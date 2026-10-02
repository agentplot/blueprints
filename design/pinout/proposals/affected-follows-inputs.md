# What a change affects follows what tasks read

A project is affected by a change when one of its tasks reads a changed
path, whoever owns that path. Ownership and dependency are two ways of
finding such projects, not the definition of them.

## The problem

Clause 12 lists the affected projects as those owning a changed path and
those depending on an affected project. The glossary defines affected by
outcome: a task of the project may give a different result after the
change than before. The two disagree for every path no project owns.

A lockfile, a root configuration file and the files that pin the tools
belong to no project (9), and they are inputs of nearly every task. The
package-manager profile says so itself: a task's inputs are the package's
own files, every package it depends on, the lockfile and the root
configuration. A change that bumps one dependency touches only the
lockfile. Under 12 it affects no project.

A gate that requires the checks of the affected projects then requires
nothing, and a dependency upgrade merges unproven. Clause 13 and I4 say
the answer errs only toward more. Clause 12 errs toward fewer, in the
commonest change a repository sees.

## What the statement already settles

The inputs of a task are every fact its result may depend on (glossary),
and a binding declares them with their assurance (24). A digest changes
whenever an input's content changes (17). So pinout already knows, for
each task, whether a changed path is something the task reads. The
affected answer simply does not use it.

Where a task's inputs are unknown, nothing can be said about what the
task reads, and 13 already says which way to err.

## The ruling

Clause 12 is rewritten in place, and one clause is added beside the
safe-direction rule.

> 12. A project is affected by a change when a changed path is among the
>     inputs of any of its tasks, when it owns a changed path, or when it
>     depends on an affected project.
>
> 33. A task whose inputs are unknown makes its project affected by every
>     change.

Clause 13 stands as written and now covers both unknowns: an unknown
dependency and an unknown input.

## What it changes elsewhere

- I4 cites 13 and 15 and needs no edit.
- S2 reads "the projects owning the changed paths and every project
  depending on them". It becomes "the projects whose tasks read a changed
  path, those owning one, and every project depending on them".
- pinout's rule pinout.5 gains the lockfile case in what it rules out:
  reporting no project affected because the changed path has no owner.
- A consumer that maps projects to something of its own, an app or a
  deployable, inherits the wider answer without a change.

## What it costs

An affected answer needs each task's inputs, not only the ownership map
and the dependency graph. For a binding whose tool reports inputs, that
is one more query. For a binding under convention it is the convention's
own list. The answer is wider than before only where the old one was
wrong.
