# A new version reaches every machine

The user's research talk of 2026-11-11 and 2026-11-12 on the update
ladder: how a new version of one of the family's own tools, or of an
upstream, reaches every machine with no agent on the happy path, and
how the same mechanism links one drive to another. It works from the
user's driving notes of 2026-11-11, kept unchanged beside this page
(`2026-11-11-driving-notes/millpond-routing.md`,
`timber-headwater-pocket-cd.md`, `README_1.md`), and from the
statements on main. The pain behind it, in the notes' words: updating
flume, bumping Boomdrive's flake input, building and deploying through
clan "goes through agents for every step and can take hours. The naive
bump needs no agent."

Nothing here lands until the user asks for it. A decision quoted here
is the user's; a record or an amendment it leads to is proposed until
they have seen it as one.

## The chain, step by step

| step | what happens | owner | settled |
|---|---|---|---|
| 1 | a change lands on flume's main | sluice | yes |
| 2 | flume's version is published and its channels move by its policy | timber (32, C.10); what runs the publish after a landing is named and not built (C.16, timber record 0020) | yes |
| 3 | Boomdrive's flake moves flume's tag and lock, and its gate tests the set | nothing makes this change without an agent (agentplot/boomdrive record 0020) | no |
| 4 | the host's flake moves its Boomdrive input | as step 3 | no |
| 5 | each machine converges on the host repository's channel, by clan push, on its own or once an approver promotes | timber (40, 41, 97; timber records 0027, 0028) | yes |

Steps 3 and 4 are one gap: a repository that depends on another moves
its pin to the other's new version, and lands the change.

## What the talk decided

**A static policy decides what happens to each new version, and a
command does the update.** In the user's words: "I really like the
idea of the commands and the static rule system for routing,
especially because we could do things like this if we did connect to
upstream NPM packages." Their default: "by default, all of the point
releases automatically get updated, so it auto-converges with no agent.
It just updates the package lock, submits the new release, or
whatever." A major release is held: "Maybe the policy is that the major
releases don't happen automatically. If there is a major release and we
detect it, maybe that's where we go and get release notes or other
information to bring in so we can feed that to agents and decide. We
also have the policy ladder for when we would want it to go to a human."

**A rule names the flume kind it launches.** The user, finding that it
makes more sense: "the policy name is the flume kind. What else would
the policy be for?"

**A rule gathers what it matches over a window, apart from how often
its sources are scanned.** Of the family's own tools in the Boomdrive
flake: "It would be nice if we could capture those as a group, perhaps
with a rule that captures the family name and a window. That way we
don't necessarily trigger the update automatically for every one that
comes in." The window follows the pace of the work: "Maybe we have a
10-minute window or something, and when development's slower, maybe
it's a daily window." And it differs from the scan: "I might run and
look for patch releases every 5 minutes, and then every 30 minutes we
kick off the command to go do the update."

**A rule gives a priority.** "We don't actually have any priority
concept in the rules now, but I think we should. Low patches would be a
low priority and security vulnerabilities a high priority, very similar
to the difference between executive quarterly strategy (GVB is
medium-high) and an executive demand for a new client request or demo,
which becomes an urgent priority." GVB is, in their words, "the
quarterly strategy documents".

**The person sees the system working for them.** "Even if it's not
going to be a user decision, we want an indicator in operations or
construction so the user knows, 'Oh look, my system is working to do
these upgrades for me.'" They named what they would read there: which
update is running and when, its terminal, the velocity, how many point
releases landed over the last week, and the majors, since "if there are
a lot of major updates, a lot of agents have to handle that, and the
system becomes a little riskier because of them."

What these change:

- A rule with no model behind it decides what happens to a new version.
  The rule is the keeper's standing word, the way timber's policy moves
  a channel on each publish with no one asked (32, C.10).
  agentplot/strategy decision #46 names the person's own session as the
  decider across the tools; these rulings add the keeper's written
  policy beside it, in every setup. The amendment to #46 is
  agentplot/strategy's to write.
- A rule's outcome is a flume kind, by its name as a launch names it
  (19), or none. A repository whose update needs a move of its own,
  such as Boomdrive's set, which moves a tag and the lock together
  (agentplot/boomdrive record 0020), declares its own kind and names it.
- The happy path runs no agent: the `update` kind runs the release's
  move as a command, and the merge queue's gate decides whether it
  lands.
- Three clocks stand apart: an adapter's schedule says how soon a new
  version is known, a rule's window how often what it matched is acted
  on, and flume's room, by the rule's priority, when a launched place
  starts (70).
- A person decides where a rule names no kind, where no rule matches,
  and where a place reaches its kind's bound.
- The surfaces show what the policy did, from the records of millpond,
  flume, sluice and timber. What the hosted control plane shows, and
  where, is agentplot/boomdrive-cloud's to rule.

## Use cases the user named

"I want these captured because there are some key ideas for Boom Drive.
There's always been this idea of connecting Boom drives in a graph and
this is the start of it."

| use case | what is published | who watches it | the watcher's rule |
|---|---|---|---|
| the family's flake | a version of flume, sluice, timber or Boomdrive | Boomdrive's flake | one group for the family, Boomdrive's own kind, a 10-minute window in heavy development and a day otherwise |
| registry upstreams | a release on npm or any registry headwater reads | any repository that pins it | patch and minor: `update`, low priority, scanned every 5 minutes, sent every 30 |
| a company's web app | the web app's version, with its notes | an executive | no launch; one item a week, across teams |
| quarterly strategy | the executive's quarterly strategy documents | each team's drive | an intent, medium-high |
| a client's request | the executive's demand for a client request or a demo | the team's drive | urgent |

Of the web app: "Now imagine a company building a web app with similar
internal dependencies. The web app itself gets released, has versions,
and has release notes. You might have an executive upstream from that
who has the headwater dependency on that website and could have the
same interval and batching rules." They want "every time there's a new
release, let me be able to look at the release notes and drill in to
check out the new functionality", or, batched, "I just want to know
once a week, and I want this rolled up across these different teams
that are building different products." Of the strategy: "the executive
might be building their own product: quarterly strategy guidance for
the teams. Those would be feeding as intents into the teams' boom
drives."

One seam links two drives: a publish in one is an offer in the other.
A team's versions reach the executive as progress, and the executive's
strategy reaches the teams as intents. The Boomdrive context pack drew
this as "intents flow down as signals, progress flows back up"
(`2026-11-08-the-boomdrive-context-pack.md`, new territory there); this
talk gives it a mechanism. The publisher states facts of what it
published. The watching drive's policy decides what they mean there,
its kind and its priority, so each drive stays the decider of its own
work, as the pack's context map has it.

```
              executive's drive (in the cloud, no runner)
     publishes: quarterly strategy, a client's request
     watches:   every team's web-app releases, one item a week
            |  intents (down)                ^  versions (up)
            v                                |
   +--- team A's drive ----------------------+----+     team B's drive
   |  millpond: the policy                        |     the same
   |    the quarterly strategy -> medium-high      |
   |    a client's request     -> urgent           |
   |    a patch release        -> update, low      |
   |    a meeting              -> no rule: curation|
   |  flume -> sluice -> timber publishes v2.3 ----+
   +-----------------------------------------------+
```

## The design the talk is drawing

The policy runs in millpond, where every event of a body of work
arrives. Each rule matches facts of a signal and joins it into the
rule's open item; when the rule's window closes, millpond sends the
item, as a launch of the rule's kind where it names one, and otherwise
leaves it for a person with its priority. A signal no rule matches
stays unmoved, for curation.

```
 sources                     adapters, run by the tick when due
 registries, timber  -----> headwater --+  own signals, with facts
 another drive's publish -> headwater --+
 meetings ----------------> eddy -------+  unread: a reader writes signals
 boom's gaps -------------> the intake -+
 the runner's checks -----> its watch --+
                                        v
                               millpond: signals
                                        |
                  the policy, the keeper's rules, first match wins
                    |                                 |
               a rule matches                    no rule matches
                    v                                 v
          joins the rule's open item          curation proposes moves,
                    |                         in batches a person accepts
             the window closes
            /                 \
     a kind named            no kind
          v                       v
  flume launch <kind>      waits for a person,
  at the rule's priority   at the rule's priority
          v
  sluice lands -> timber publishes -> machines follow
          |
          +-> the landed version is the next drive's release
```

In each setup the same rules run, and only the launcher differs: on its
own, millpond's send launches the place (C.5); with crew or Boomdrive,
the item goes to the planner or the control plane (50), which has the
runner launch it without judging it (agentplot/boomdrive core.1).

### The rules

A rule keys only on facts a capture's source states or a reading
wrote: the source, the dependency, its ecosystem, the release's level
in its version order (major, minor, patch, prerelease), whether an
advisory names the pin, the tier, the age, a signal's nature and who
asserted it. No rule reads the notes or a signal's words, so millpond
still judges nothing a capture says (70), and headwater's 11 and I3
stand.

| rule | when | kind | priority | window |
|---|---|---|---|---|
| advisory | an advisory names the pin | `update` | high | none: the next tick |
| family | a release of the family's own tools, in Boomdrive's flake | Boomdrive's own kind | normal | 10 minutes in heavy development, a day otherwise |
| point releases | a patch or minor release | `update` | low | 30 minutes |
| majors | a major release | `fix` | normal | the keeper's |
| team releases, in the executive's drive | a version of a team's web app | none | low | a week |
| a client's request, in a team's drive | the executive's demand | none | urgent | none |
| quarterly strategy, in a team's drive | the executive's quarterly strategy | none | medium-high | none |
| no rule | a meeting's signals, and anything else | curation's | curation's | curation's |

A meeting's signals and the executive's strategy differ by source: the
first are a reader's reading of a meeting, the second the published
word of the executive's drive. A rule keys on the source, and the
meeting's signals go to curation, as millpond does today.

### Three clocks

| clock | set by | decides | what it spends |
|---|---|---|---|
| scan | an adapter's schedule, in the inbox's settings (28; weir's cadence) | how soon a new version is known | a lookup, no model |
| window | a rule, read by weir's cadence | how often what the rule matched is acted on, as one item | a launch, a gate run, a landing, each machine rebuilt, and an agent's tokens where the kind runs one |
| room | flume's streams, by the launch's priority, the stream's bound and its pace (70, 143, 167) | when a launched place starts | an agent's points against its stream's pace |

A window closes at the times its schedule names; a rule with none
sends at the next tick. A rule's item is named for the rule and the
window's close, so no two windows share a name (46), and its launch
takes the item's name. A signal that arrives while the rule's last
item is sent and open joins the next item (115).

"Batch" stays curation's word, for the moves it proposes together
(40, 112). A window gathers signals over time into one item a rule
sends.

### The policy and curation

| | the policy | curation |
|---|---|---|
| who decides | the keeper's written rules, no model | a model session |
| reads | facts a source states or a reading wrote | the signals' words |
| writes | a join into its rule's item, standing at once | moves, in batches a person accepts or changes (40, 112) |
| groups by | rule and window | judgment |
| sends | at the window's close: a launch of its kind, or a person's turn | when the person sends, or the planner takes |

### Priority

flume already orders waiting places by the priority a launch gives
(70). A rule's priority is its launch's. For an item no kind launches,
it is the order in which a person meets it. millpond carries the
priority a rule gave, and orders nothing itself (73). A rule names a
level, and the inbox's settings give each level its number in flume's
order, so the setting says what it is (principles, 13).

### What a launch carries

A release's dependency, its version and its move fill the kind's
command as the launch's parameters. Its brief, the notes of every
release between the pin and it, the advisories and the declarations it
touches (headwater's vocabulary), goes in as the launch's brief, for
the agent of a stage that runs one. The `update` kind's command reads
the first; its agent reads the second only if the command or the gate
fails. A window's item carries one set of parameters for each
dependency, at its newest version.

### The two kinds

| kind | first stage | on a failure | at the kind's bound |
|---|---|---|---|
| `update`, new | a command: the release's move, committed | an agent stage, with the failure and the brief | the place waits on its caller (130) |
| `fix@1`, flume's own (22) | an agent, with the brief | the agent again (22, 23) | the place waits on its caller |

A failure is the command's or the gate's. The send-back's bound is the
kind's own `max_send_backs` (23), so the policy holds no count of its
own. A simple kind runs every stage in order (18), so `update` is a
statechart kind (175), whose agent stage is reached only from a
failure.

### Boom

Boom stays a claims engine and never the coordinator, as the context
pack decided. It meets the policy at two seams. Its gaps, `boom gaps`
in the pack, are offers at the intake, each with the facts of its gap:
a claim nothing enforces, a failing check, an upstream claim that
changed. The same policy routes them: the pack's "one gap, one task" is
a rule that names a kind, and its "many gaps, one plan" is a rule's
window joining them into one item a planning kind takes. Millpond's
moves read Boom's claims the other way: an answered move cites the
claim that settles a signal, and a challenge the claim it weighs
against (36, 39; C.10). Boom routes nothing and plans nothing: it
states what holds, and finds where it does not.

### What the person sees

With Boomdrive, the runner carries flume's place status, sluice's
entries and the inbox up to the control plane, and the person reads
there:

| what the person reads | from |
|---|---|
| which update runs, its stage, since when | flume's status (56), carried up |
| its terminal | the control plane's relay (agentplot/boomdrive-cloud core.115) |
| the updates landed this week, by rule: patches, minors, majors | millpond's items, by who asked (51), and their landings (55) |
| how many reached an agent, and how many wait on a person | flume's place: a send-back to its agent stage, its bound reached (23, 130) |
| the time from a publish to every machine | timber: the publish, the channel's move, each environment converged (40, 41) |
| the points agents spent on updates | flume's points, given over the last day and week (70) |

The board shows four phases, Inception, Bolt plan, Construction and
Operation (agentplot/boomdrive-cloud core.76). An update's place is construction
no bolt plan approved, and the machines following its version are
operation. A launch's record names what it runs for: "a unit, an
elaboration, a planning run, a curation run or a member's own ask"
(boomdrive-cloud's glossary); a rule's ask is one more.

## Seams

| seam | between | what crosses | standing |
|---|---|---|---|
| upstream lookup | a registry and headwater | a dependency's releases | settled (headwater C.3) |
| timber lookup | timber and headwater | a channel's accepted head, for a dependency the family publishes through timber | new: a release lookup of headwater's |
| a drive's publish | one drive's timber and another's headwater | a version, with the facts its publisher states | new |
| facts | a source and millpond | the source, the dependency, the level, the advisories, the tier, the age | new: an offer carries no domain fields today (weir 2, 25) |
| policy | the keeper and millpond | rules, each a match on facts with a kind or none, a priority and a window, first match wins | new; its form and its reading are weir's, so millpond and Boomdrive read one copy |
| gaps | Boom and millpond | a gap, at the intake | the pack's leaning; Boom's to design |
| launch | millpond, or the planner through the runner, and flume | `flume launch` of the rule's kind, its priority, the item's name, the release's dependency, version and move as parameters, its brief as the brief | the parameters are new |
| command stage | inside flume | a stage that runs a command the kind declares, filled from the launch's parameters, and delivers commits | new |
| submit | flume and sluice | the place's branch | settled |
| landing | sluice and timber | the landed revision, published | settled; its trigger is named and not built (timber C.16) |
| follow | timber and the machines | an environment converges on its channel's head, on its own or once promoted | settled (timber 40, 41, 97) |
| bound | flume and the person | the place waits on its caller, its end delivered | settled (flume 23, 130, 43) |
| carried up | the runner and the control plane | flume's, sluice's and the inbox's records | agentplot/boomdrive's runner contract |
| a publish | timber and millpond | a capture of each publish and each refusal | timber section 9 promises the adapter; millpond C.12 lacks its row |

## What the notes propose that the design already decides

- **Millpond as a router.** The notes' routing is the policy above.
  Millpond reads the keeper's rules and judges nothing a capture says
  (70); its statement gains a move of the policy's beside curation's.
- **A summary inside headwater.** Headwater never summarises a release
  (11, I3). The agent of a `fix` place reads the notes whole, in the
  brief (12), and so does the agent that rolls a week's releases up
  for an executive.
- **The pocket CD.** One app over timber and Millpond is the combined
  app the user declined under decision #46, and a local web app is what
  decision #43 rules out. Timber says who approves on its own: the person
  or their session asks for the promotion (C.17).

## The amendments it leads to

| statement | what changes |
|---|---|
| millpond | the vocabulary gains policy, rule and window; a rule's move stands beside curation's, never judged again (35, 72, 112); a rule names its item (113); a rule's item's brief is its signals' own excerpts as they stand (47); a send names the rule as who asked (51); C.5 launches any kind, with a priority and parameters |
| weir | an offer carries the facts its source states (2, 25); the policy's form and its reading; cadence reads a rule's window |
| headwater | a release's level, a `flake.lock` reader, the timber lookup and another drive's publish as sources; it still never acts on a release (36, I1) |
| flume | the command stage; a launch's parameters |
| agentplot/strategy | #46: the keeper's written policy decides beside the person's session |
| agentplot/boomdrive-cloud | a rule's ask as a launch's source; the board's phase and the gauge an update shows in (core.76, core.84) |

## Open

- Where the policy is kept: in the inbox's settings, which are the
  keeper's (2), or in each depending repository, beside its pins.
- The levels of priority, and the number each takes in flume's order.
- How a planner, crew's or Boomdrive's, carries out a rule's item
  without judging it.
- Whether a launch carries parameters, or a brief whose form the
  kind's command reads.
- What carries a drive's publish to another drive: timber's channel and
  headwater's lookup, or the control plane's subscriptions, which the
  context pack has push-based and paid.
- Whether a watching drive's rule may take a priority its publisher
  states, or always gives its own.
- Where a drive kept only in the cloud, as the executive's, runs its
  policy, with no runner to run millpond's tick.
- Two loose ends from the brief: millpond's adapter table (C.12) lacks
  the adapter timber's section 9 promises, and timber's book
  (`books/timber/src/family.md`, `open.md`) still lists Attic and the
  closure's mapping as open, which timber records 0027 and 0028 settle.
