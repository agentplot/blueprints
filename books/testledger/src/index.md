# testledger

testledger records whether a check passed on exactly the inputs it read.
A gate, the point where work may merge or become a version, asks it
whether what the gate requires has already passed, and runs only what
has not. It records verdicts and their evidence, and nothing a check
produced (12).

## Why it exists

Continuous integration was built for a few people pushing a few
branches. Agent fleets change the arithmetic: a hundred worktrees each
run the same checks before they merge, and the server runs them all
again after. Most of those runs prove something that was already
proven, on the same inputs, a few minutes earlier somewhere else.

Build tools solved the same problem for their outputs long ago by
keying a cache on the content of what a step reads. testledger applies
that to the verdict instead of the output, and to every tool instead of
one. A key is the check's definition, a digest of its inputs, its
toolchain and its envelope, and nothing else (1). The executor, the
branch and the commit stay out of the key, so a pass proven in one
place is the same fact everywhere it is read (13).

## What makes it safe to reuse a pass

Three things. The key changes when anything the check reads changes (2),
so a pass never covers inputs it did not see; a check whose inputs
cannot be stated has no key and is always run (4). Every run is
recorded, a fail as faithfully as a pass, and nothing written is ever
altered (6, 7), so a flaky check shows up as flaky rather than as
whichever result came last (16). And trust belongs to the reader:
whether a record from an agent's open shell counts at a gate is the
gate's policy, decided when it reads (14, 19). A merge gate can take an
agent's pass to save time while a version gate requires a confined run
on a server (S4), from one ledger.

The envelope is what lets integration tests join in. A test against an
emulator or a deployed artifact is keyed by that artifact's digest and
the emulator's, so forty branches that build the same artifact need one
integration run, not forty (S5).

## Why it is open source

The record is an in-toto Statement, the supply-chain community's format
for attestations, so existing signing and storage tools read it. What
was missing is a predicate for test verdicts keyed by inputs, and a
policy for reading them at gates, independent of any one build tool.
That gap is the same for every team running agents against a trunk.
testledger depends on pinout for what a repository is and what a check
reads (Part C, C.1), and on nothing else of ours.

## How to read this book

Part I is the statement of invariants, included from
`design/testledger/requirements.md`. Part A is what testledger keeps,
Part B its contracts with a workspace description, a result store, an
executor and a signer, and Part C the profiles that bind them. Clause
numbers in parentheses here point into it.
