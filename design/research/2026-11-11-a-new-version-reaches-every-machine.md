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

What the two change:

- A rule with no model behind it decides what happens to a new version.
  The rule is the depending repository's authors' standing word, the way
  timber's policy moves a channel on each publish with no one asked
  (32, C.10). agentplot/strategy decision #46 names the person's own
  session as the decider across the tools; these rulings add the
  authors' written policy beside it, in every setup. The amendment to
  #46 is agentplot/strategy's to write.
- A rule's outcome is a flume kind, by its name as a launch names it
  (19), or none. A repository whose update needs a move of its own,
  such as Boomdrive's set, which moves a tag and the lock together
  (agentplot/boomdrive record 0020), declares its own kind and names it.
- The happy path runs no agent: the `update` kind runs the release's
  move as a command, and the merge queue's gate decides whether it
  lands.
- A person decides where a rule names no kind, and where a place
  reaches its kind's bound.

## The design the talk is drawing

```
  upstreams ------------.
  (npm, GitHub)          \             policy (the depending repository's)
                          v                  |
  timber channel -----> headwater <----------+
  (own tools only)        |  scans on a timer
                          |
            a rule names a kind            no rule names one
                          |                      |
                          v                      v
                 flume launch <kind>        millpond: waits for you
                          |
                       sluice --lands--> timber --follows--> machines
                                           |
          the landed repository's new version is the next one's release
```

The policy sits in the depending repository. Each rule matches facts of
a new release and names a flume kind, or none:

| when | kind | what runs |
|---|---|---|
| an advisory names the pin | `update` | the release's move, as a command |
| the dependency is `agentplot/flume` (in Boomdrive) | Boomdrive's own kind | Boomdrive's set moved, tag and lock together |
| a patch or minor release | `update` | the release's move, as a command |
| a major release | `fix` | an agent, with headwater's brief |
| anything else | none | nothing launched; the release waits for a person in millpond |

A rule keys only on facts headwater already holds or derives without
judgment: the dependency, its ecosystem, the release's level in its
version order (major, minor, patch, prerelease), whether an advisory
names the pin, the tier, and the release's age. No rule reads the
notes, so headwater's 11 and I3 stand.

### What a launch carries

Headwater's release splits in two at the launch. Its dependency, its
version and its move fill the kind's command. Its brief, the notes of
every release between the pin and it, the advisories and the
declarations it touches (headwater's vocabulary), goes in as the
launch's brief, for the agent of a stage that runs one. The `update`
kind's command reads the first; its agent reads the second only if
the command or the gate fails.

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

## Seams

| seam | between | what crosses | standing |
|---|---|---|---|
| upstream lookup | a registry and headwater | a dependency's releases | settled (headwater C.3) |
| timber lookup | timber and headwater | a channel's accepted head, for a dependency the family publishes through timber | new: a release lookup of headwater's |
| policy | the authors and headwater | rules, each a match on facts and a kind or none, first match wins | new |
| facts | inside headwater | the release, its pin, its level, the advisories, the tier, its age | headwater gains the level and a `flake.lock` description |
| launch | headwater and flume | `flume launch` of the rule's kind, the release's dependency, version and move as parameters, its brief as the brief, named `<dependency>--<version>` | headwater's plugins hand flume a brief on a person's key today (headwater section 9; flume C.9); the unattended launch and the parameters are new |
| command stage | inside flume | a stage that runs a command the kind declares, filled from the launch's parameters, and delivers commits | new |
| submit | flume and sluice | the place's branch | settled |
| landing | sluice and timber | the landed revision, published | settled; its trigger is named and not built (timber C.16) |
| follow | timber and the machines | an environment converges on its channel's head, on its own or once promoted | settled (timber 40, 41, 97) |
| bound | flume and the person | the place waits on its caller, its end delivered | settled (flume 23, 130, 43) |
| no kind | headwater and millpond | the release's capture, for curation and a person | settled (millpond C.12) |
| a publish | timber and millpond | a capture of each publish and each refusal | timber section 9 promises the adapter; millpond C.12 lacks its row |

## What the notes propose that the design already decides

- **Millpond as a router.** Millpond writes no move of its own
  judgment (72), only curation proposes moves (35), and an offer carries
  no domain fields (weir 2, 25). The policy acts before Millpond, which
  holds a release only where no rule names a kind.
- **A summary inside headwater.** Headwater never summarises a release
  (11, I3). The agent of a `fix` place reads the notes whole, in the
  brief (12).
- **The pocket CD.** One app over timber and Millpond is the combined
  app the user declined under decision #46, and a local web app is what
  decision #43 rules out. Timber says who approves on its own: the person
  or their session asks for the promotion (C.17).

## Open

- Whether headwater reads the policy and launches. It holds every fact a
  rule keys on, but it never acts on a release (36, I1), and a launch
  with no key pressed is acting. The alternative is a tool of its own
  that reads headwater's report.
- What runs the scan where no control plane stands: a host's timer, as
  one runs `millpond tick` (millpond C.4). With crew or Boomdrive, the
  control plane asks the runner to run it.
- How a launch carries parameters: flume's launch carries a brief and
  settings today, and no values a kind's command reads.
- Whether headwater's adapter still captures a release a rule launched,
  or only the releases no rule names a kind for.
- Two loose ends from the brief: millpond's adapter table (C.12) lacks
  the adapter timber's section 9 promises, and timber's book
  (`books/timber/src/family.md`, `open.md`) still lists Attic and the
  closure's mapping as open, which timber records 0027 and 0028 settle.
