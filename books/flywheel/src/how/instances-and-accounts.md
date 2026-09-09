# Instances, hosts and accounts

An **instance** is one flywheel: one blueprints repository, one state
repository, the repositories it tracks, its sinks and its numbers (219).
The name is the operator's, and it need not coincide with anything at
the git host, because the repositories are listed by URL and may live
under any organization the connection reaches.

An **account** holds one or more instances, and an instance belongs to
exactly one account. The account is what a user signs in to; the
instances of one account are listed together.

## Isolation

A host runs several instances at once, each isolated on disk and in
state. Nothing crosses between them: no lease, no id, no session, no
decision number (218). The page shows one instance at a time and
switches between them. Each instance has its own sinks, one presenter
per sink, and no sink serves two.

A host has one address with the instance in the path, so a host serving
several instances serves them all at that one address and every link
names the instance it opens (205a).

Authentication belongs to the host and authorization to the instance. A
host declares one sign-in kind, the same for every instance it serves,
so switching instances never changes the signed-in identity. Membership
is the authored operators list on a self-managed host and the
application's assignment on a hosted tier; what a member may do is that
list, or the permission the token carries. A call without it is refused
and recorded as refused, and the instance switcher shows an instance the
identity is not a member of as not a member.

## From zero, and back to zero

Initialization adopts an existing blueprints repository or creates one
from the template, and does the same for the state repository and for
each tracked repository (220). An existing repository that lacks the
layout is upgraded by a chore and never rewritten.

An instance is removed by a response and never by deleting files: its
sessions are ended, its places removed, its state archived, its git
repositories left on disk. Its numbers are never reused. The account it
belonged to stands, with its other flywheels (221).

Every tick reconciles the host's disk against the state (222). A bare
repository or a checkout that is missing, moved or changed by hand is a
decision under attention that shows the difference and the proposed
repair. Nothing is repaired without the response, except a place's
worktree, which is re-made from its line because a place holds nothing
that is not on the line. Unreadable state is never guessed at, and until
the response the host stops covering the affected objects and the status
view says why.

## Lines and places

Both halves of the machinery have the same shape on disk (49). An intent
owns a line off the blueprints' shared line; a bolt owns a line off its
built repository's shared line. Off each line sit **places**, one
worktree per work item or elaboration, plus the operator's own place off
a bolt's line, kept and refreshed so they always have somewhere to look.

A line is kept current by taking its parent: before the first place is
made, when it lands, on a daily cadence, and whenever the operator says
so. A take that conflicts is aborted whole and seeded as a chore on the
line, with its own place and its own session to resolve it, and the take
retries when that chore is done.

A place is proven current before its session starts, and it is rebased
when it falls behind only while its session is not working and nobody
has typed in its pane. A rebase that conflicts is aborted whole and
handed to the place's own session. Nothing on an open line is ever
rewritten.

A place is removed by the machinery when the work it served is merged,
dropped or retired, and every removal is a recorded effect with its
reason. The operator may hold a place, and a held place is not removed.
A worktree left behind by a crash belongs to no live object and is found
and removed by the host's own reconciliation.

Anything a place runs belongs to the place: a tethered process ends when
the place is removed, and its ports are derived from the worktree so two
places on one host never collide (45). How those ports are reached is
the host's router and never the machinery's: a local hostname on the
operator's machine, a tailnet name on a host in their network, the URL a
managed platform publishes (191).

## Services

A built repository declares its services as data in its own tracked
declaration: a name, the command that starts it in a place, what it
serves, and an optional readiness command (47). The bolt reads that file
at the head of the operator's place and creates one service object per
record.

The record is the intended state and the tethered process is evidence. A
process found under the tether name is stopped, never adopted. Start and
stop are the operator's to invoke outright, the one pair the
undo-or-defer rule does not cover, and a session asks for the same thing
through a command that writes the same record, so the machine sees one
guard whoever asked (48). A service that exits, or never serves within
five minutes, is an attention line whose answers are start and stop.

## Pools

An instance may declare a **pool**: a platform that provisions hosts on
demand from the instance's image, up to a bound, each joining by an
enrolment token the machinery issues, covering what the pool declares,
and retiring when idle (240). A pool host is ephemeral. It holds no
place past its life, and a place it held is re-made from its line on
another host, which is exactly the property that makes places
disposable.

A pool host serves one instance. A host serving several instances is the
operator's own machine (241). A service run for many instances gives
every instance its own pool, and nothing is shared between instances but
the platform.

The machinery adds pool hosts while approved work waits behind the bound
and drain is the limit, within the pool's bound and the cost setting the
manifest names, and retires them as the queue drains (242). Every such
change is an effect with a proof. The operator never needs to see a pool
host; they see the pool, its bound and its live hosts.
