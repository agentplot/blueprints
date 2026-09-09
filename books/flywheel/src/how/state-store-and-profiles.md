# The state store and its profiles

The machinery reaches durable, shared state and the operator through a
deliberately small contract. Part B states it; Part C states the ways it
is satisfied. Nothing above the contract changes when the storage under
it does.

## Seven operations

Part B.1 lists exactly seven, and says an engine that needs an eighth is
a change to the contract, stated there:

| operation | what it must do |
|---|---|
| read | given an object's identity, return the evidence the predicates ask for, as of a point it names |
| write an effect | write it with an identity of its own, so a repeat changes nothing and is not an error |
| lease | take, renew and release ownership of an object, so two would-be holders cannot both hold it |
| present and receive | present the rail's decisions to the operator and receive their response |
| notify | tell a host that state has changed |
| list | enumerate the objects in a scope |
| serve the status view | serve the view of what is happening |

Reading twice with nothing changed returns the same evidence and writes
nothing (126). That is not an optimisation. It is what makes the tick
safe to run as often as you like.

## Five guarantees

**Durable**: what a write reports as written survives the loss of every
host at once, without warning. **Single writer per object**: two writers
of one object cannot both succeed, and the loser learns that it lost and
reads again before deciding anything. **Atomic per write**: a write is
wholly applied or not applied, and no reader sees half of one.
**Derivable**: every state the engine decides upon is derivable from
what read and list return, and nothing the store holds privately decides
behaviour. **The response, exactly once**: an operator's response takes
effect once, however many times it is delivered and whatever restarts
happen in between (133 to 137).

The last one is worth dwelling on. It is why the state change and the
consumed response id are written together, in one atomic write. Deliver
the response twice, restart the machinery between the giving and the
applying, replay the chat message: the transition fires once.

## Abstract names, bound by data

A machine definition names the evidence it reads and the effects it
writes by abstract name only. No definition names a label, a column, a
field, a file path, a service or an interface (138). A **profile**
supplies the binding from every one of those names to the operations of
its own storage, and the binding is data, reviewable on its own (139).

So an engine runs unchanged against any profile whose binding is
complete, and a binding that leaves a name unsatisfied is not a profile
at all (140). This is also the invariant that keeps the model honest: no
machine definition names a store, a service, a path or a field, and
storage detail exists only in a binding (I13).

## The profiles

**The tracker profile.** State lives in an instance's tracker: an item
per object, grouped into milestones, arranged on a board. The item's own
fields, its grouping, its placement and its comments are the evidence; a
change to an item carrying the effect's identity is the write; a
recorded holder with the time it was taken is the lease; the tracker's
own notification is notify. The operator answers on the item or on the
page. The tracker is the central service.

**The git-only profile.** Every piece of durable state is a file in a
git repository and the git host is the only central service. There is no
tracker at all: issues and boards may exist for people, but the
machinery never reads or writes them (160).

A change of state is a commit. A commit that reaches the shared line is
the fact; one that has not is a local intention (161). **The push is the
compare-and-swap**: two hosts changing the same object at once cannot
both succeed, because the host rejects an update whose base is stale
(162). A lease is a file changed by a commit that lands. The operator's
response from a phone becomes a commit through one named writer, and
they can tell that it landed (164).

A host that cannot reach the git host keeps working on what it already
owns, commits locally, and reconciles when it reconnects (165). Every
host fetches and integrates the shared line on its own, on every notify
and on a bounded interval and before every tick, so no host decides on a
stale read and nobody runs the sync by hand.

Two invariants hold only under this profile, and say so. No state exists
outside git: a host's memory and disk hold only what git already holds
or what is about to be committed, and evidence about the world observed
each tick is not state and is re-observed after a restart (I14). And two
commits that change the same object cannot both land without one having
seen the other (I15).

History is the audit record and nothing else is kept for that purpose
(167). Every write is a commit carrying its reason and the evidence it
was based on, which is the same requirement the observability clauses
make of every profile (79).

**A custom profile.** Anything else is admitted by the same rule. For
each guarantee its storage does not give on its own, a profile names the
mechanism it adds and where that mechanism's own state lives (169). A
profile that cannot provide a guarantee is rejected as a profile, and
the data plane is never weakened to admit one (170).

## Admission is a test run, not an argument

The conformance suite is one set of scenarios, run as data, that every
profile must pass unchanged, exercising each operation of B.1 and each
guarantee of B.2. A profile is admitted by passing it. The contract
scenarios run through the engine with a toy machine that shares no atom
with the flywheel, so a profile is tested before the domain is loaded at
all, and passing them is a statement about the storage rather than about
the flywheel's own machines.
