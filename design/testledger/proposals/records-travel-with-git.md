# Records travel with git

A result store carried by git: the records a checkout wrote go to the
server with the push that carries the work, and a gate there reads them
like any other store.

## The problem

Section 10 asks it first: when a gate on a server should read records
written in an agent's checkout, what carries them there, and what must
vouch for them?

Until it is answered, a pass never leaves the machine it was proven on.
The filesystem profile is the repository's common git directory, read by
every checkout on one machine and by nothing else. An agent proves its
change in a worktree, pushes, and the server's merge gate finds an empty
ledger and proves it again. S1 holds on a laptop and fails across a
push.

The other profiles of C.4 can carry records, but each asks a team for
something before its first pass is shared: a registry or a bucket, and a
credential on every developer's machine and in every agent's
environment that may write to it.

## What the statement already settles

Repositories are git repositories (section 9), so every writer and every
gate already shares one transport, with one authentication.

Any number of stores may be read at once while one is written (37), a
record reads the same through any profile (38), and it has one format
whatever store holds it (39). Adding a store changes nothing in Parts A
or B.

Trust is the reader's (14). A store never decides whether a record
counts, so a store that anyone who may push can write to is as safe as
the policies that read it.

## The ruling

One more profile in C.4.

| store | layout | put / get / find | retention |
|---|---|---|---|
| **git**: the repository's own remote | the OCI image layout of the filesystem profile, as git objects under a ref namespace of its own, one ref per writer so no two writers update the same ref | put writes the local layout and a push carries it; get and find read the fetched refs | a writer's ref is dropped once a longer-lived store holds its records, or by age |

What vouches for a record carried this way is whoever was allowed to
push it. That is enough for a gate whose policy admits it, a merge gate
in most teams, and never enough for a gate that trusts only confined
executors. S4 is unchanged: the pass is listed, and the version gate
reports the check missing until a confined run passes.

## What it changes elsewhere

- The first question of section 10 is answered for the merge gate. What
  carries records to a gate that trusts only its own executors needs no
  answer: that gate reads none of them.
- A team with no registry and no control plane shares passes between
  its checkouts and its build server with nothing but the repository.

## What it costs

Records ride in the repository's object store. They are small (12), and
evidence is the only part of any size, so the profile carries evidence
for a fail and leaves a pass's evidence in the local layout. A remote
that restricts which refs a contributor may push needs the namespace
allowed.
