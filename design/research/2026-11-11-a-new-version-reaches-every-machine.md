# A new version reaches every machine

The user's research talk of 2026-11-11 on the update ladder: how a new
version of one of the family's own tools, or of an upstream, reaches
every machine with no agent on the happy path. It works from the user's
driving notes of that day, kept unchanged beside this page
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

**A static policy routes each new version, and commands converge it.**
In the user's words, on reading the steps above: "I really like the
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

What it changes:

- A rule with no model behind it decides what happens to a new version.
  The rule is the depending repository's authors' standing word, the way
  timber's policy moves a channel on each publish with no one asked
  (32, C.10). agentplot/strategy decision #46 names the person's own
  session as the decider across the tools; this ruling adds the
  authors' written policy beside it, in every setup. The amendment to
  #46 is agentplot/strategy's to write.
- The happy path runs no agent: the policy's route launches a place
  whose first stage runs the release's move as a command, and the
  merge queue's gate decides whether it lands.
- An agent works a release only on the ladder: when the gate fails a
  command's change, or when the policy routes a release to one, a major
  release with its notes and what the published dependency changed.
- A person decides only at the ladder's top, or where the policy routes
  a release to them first.

## The design the talk is drawing

One dependency edge, from a new release to every machine:

```
                    policy (the depending repository's)
                          |
                          v
 headwater --facts--> route --route--> launch --> flume place --> sluice --> timber
     ^                                              |                          |
     |                                         gate fails                 environments
     |                                              v                          |
     |                                     agent stage, then a person          v
     |                                                                     machines
     +------- the landed repository's new version is the next edge's release ----+
```

The routes, and the ladder each climbs on failure:

| route | first | on the gate's failure | at the bound |
|---|---|---|---|
| converge | a command, the release's move | an agent, with the failure and the notes | a person |
| assess | an agent, with the notes and the brief | | a person |
| ask | a person, who picks converge, assess or no | | |
| hold | listed, nothing launched | | |

flume already climbs the ladder for a landing kind: a failed
submission goes back to the stage the kind names (23), and past the
kind's bound the place waits on its caller (130). The new piece in
flume is a stage that runs a declared command where every stage today
runs one agent (23).

A rule keys only on facts headwater already holds or derives without
judgment: the dependency, its ecosystem, the release's level in its
version order (major, minor, patch, prerelease), whether an advisory
names the pin, the tier, and the release's age. No rule reads the
notes, so headwater's 11 and I3 stand: the notes reach the agent of an
assess route whole, in the brief (12).

## Seams

| seam | between | what crosses | standing |
|---|---|---|---|
| policy | the authors and the route | rules, each a match on facts and a route, first match wins | new |
| facts | headwater and the route | the release, its pin, its level, the advisories, the tier | headwater gains the level, a `flake.lock` description and a timber channel as a release lookup |
| route | the route and the launch | the release, its route, its move and its kind | new |
| launch | the launch and flume | a launch of the route's kind with the release's brief, named for the dependency and the version | headwater's plugins hand flume a brief today (headwater section 9; flume C.9); the converge and assess kinds are new |
| submit | flume and sluice | the place's branch | settled |
| landing | sluice and timber | the landed revision, published | settled; its trigger is named and not built (timber C.16) |
| next release | timber and headwater | the depending repository's new version, read as its own dependents' release | new: the timber lookup above |
| ladder | flume and the person | the send-back to the agent stage, then the place waiting on its caller, its end delivered, and a capture through `millpond land` | settled (flume 23, 130, 43; millpond C.12) |
| follow | timber and the machines | an environment converges on its channel's head, on its own or once promoted | settled (timber 40, 41, 97) |

## What the notes propose that the design already decides

- **Millpond as a router.** Millpond writes no move of its own
  judgment (72), only curation proposes moves (35), and an offer carries
  no domain fields (weir 2, 25). The route sits before Millpond, which
  sees a release only where the ladder or the policy hands it to a
  person.
- **A summary inside headwater.** Headwater never summarises a release
  (11, I3). An assess route's agent reads the notes whole, and where a
  person decides, curation's brief carries what the agent found
  (millpond 47).
- **The pocket CD.** One app over timber and Millpond is the combined
  app the user declined under decision #46, and a local web app is what
  decision #43 rules out. Timber says who approves on its own: the person
  or their session asks for the promotion (C.17).

## Open

- Where the route is computed: in headwater's core, as a field of each
  release in its report, read from a policy beside its tiers
  declaration; or in a tool of its own.
- What launches a route where no control plane stands: a host's timer,
  as one runs `millpond tick` (millpond C.4), or a surface of
  headwater's at a session's start. With crew or Boomdrive, the control
  plane asks the runner to launch.
- What an assess route's agent delivers: the change, submitted, or a
  finding for a person to decide.
- Two loose ends from the brief: millpond's adapter table (C.12) lacks
  the adapter timber's section 9 promises, and timber's book
  (`books/timber/src/family.md`, `open.md`) still lists Attic and the
  closure's mapping as open, which timber records 0027 and 0028 settle.
