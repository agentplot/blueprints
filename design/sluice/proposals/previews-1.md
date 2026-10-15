# Previews: a running copy of a landed revision, held until asked to go

Drafted clauses letting a caller ask sluice for a preview of a revision
a branch has landed: a place sluice makes at that revision, equipped as
a candidate's place is, in which the policy's preview command brings up
the repository's stack on the fakes its checks use, with a name for
each of its ports and the addresses a person opens. The place is held
until its caller asks for it to go. Parts A and B gain six clauses, 98
to 103; Part C gains a row in C.1, a command in C.5 and a table in C.7.
Nothing here edits `../requirements.md`; the operator rules on it.

## What it answers

| question | answered by |
|---|---|
| where a person looks at a branch's work running, with no worktree of the branch kept | 98: a preview, a place sluice makes at a landed revision |
| which revision | 98: one the branch has landed, named by the caller; never a candidate, never a head |
| what runs in it, and who starts it | 98, C.7: the policy's preview command, under the executor; the repository's tools keep what it starts |
| what a person opens | 99, C.7: a name per port, given by sluice; addresses from the policy's templates |
| what asking twice does | 100: the same preview |
| who ends it | 101: whoever asks; sluice only when its place is gone or its command failed |
| what it counts against, and what it decides | 102, 103: its command's run, then nothing; it decides nothing |
| which policy it is held to | 98: what it brings up, from the previewed revision; what it may use and reach, from the branch now |
| deploying to a real environment | not sluice's: non-goals, and "For the caller" below |

## The shape

```
 branch lands R1 (22)
        |
        | caller: sluice preview <branch> R1          (98)
        v
 +--------------------------------------------+
 | place at R1, made as a candidate's (33)    |
 |   ports  SLUICE_PORT_WEB, SLUICE_PORT_API  |  (31)
 |   names  SLUICE_NAME_WEB, SLUICE_NAME_API  |  (99)
 |   preview command run once, under the      |
 |   executor; its process group ends (66);   |
 |   what it handed off stays (98)            |
 +--------------------------------------------+
        |
        | addresses, from the policy's templates   (99)
        v
 caller puts them before a person
        |
        | caller: sluice release <preview>          (101)
        v
 release command, everything ended, place removed,
 ports and names let go (34)
```

A preview is the third place sluice knows. A candidate's place is made by
sluice and released by sluice once its verdict is read (25). A session's
place is made by its driver and released at the session's or driver's
asking (95). A preview's place is made by sluice and released at its
caller's asking, because nothing in sluice knows when a person has
finished looking.

## Vocabulary

- **preview**: a place sluice makes at a revision a branch has landed,
  in which the policy's preview command has brought up what a person
  opens, held until its caller asks for its release.

## The preview: a place at a landed revision

### The problem

A person verifying a bolt's work wants it running. Today that means a
worktree of the bolt's branch, kept checked out and kept current, with
its stack brought up by hand on ports nobody else is using. Keeping a
worktree per branch is upkeep the fleet means to drop, and a stack
brought up by hand is outside the bound, the ports and the release that
every other run on the host gets.

### What the statement already settles

A place made at a revision holds exactly that revision, with the ports
its policy names (33, 31). sluice starts no service: what a run needs,
the run brings up (31). What a run hands to another process stays until
its place is released (94), and a release ends it (34). A branch's
history holds only what passed its gate (22).

### The ruling

> 98. A session, a driver, a planner or the operator may ask for a
>     preview of a revision its branch has landed: a place sluice makes
>     holding exactly that revision (33), given its ports (31) and its
>     caches (35), in which the preview command of the revision's own
>     policy is run once, under the host's executor and the limits and
>     time limit of the branch's current policy, and ended with its
>     process group (66). What the command
>     hands to another process to keep stays with the place until it
>     is released. sluice starts no service by it (31). A revision the
>     branch has not landed has no preview.

98 previews only what landed, so a person never looks at a combination
the gate has not passed, and the caller names the revision so a preview
asked for just as the branch moves again is still of the revision it
meant. What the preview brings up and takes down, its command, its
ports, its caches and its release command, is read from the previewed
revision, since it describes that revision's stack. What the command
may use and reach, the executor, the limits and the time limit, is read
from the branch's current revision, since trust is the branch's now
(27, 56); `[preview] timeout`, when the previewed revision's policy
sets it, takes the time limit's place. Nothing a preview reads gates
anything.

## The names: what a person opens

### The problem

Several previews, candidates and sessions run on one host, each with
servers a person opens by name, through a local proxy whose names end
in `.localhost` because an identity provider redirects only there. A
name built by the repository from the place's worktree gives every
detached place the same name. A name must be unique to the preview, the
same for its whole life, and one label, since a wildcard certificate and
a wildcard redirect each cover one.

### What the statement already settles

sluice gives a place a port for each name its policy lists, unique on
the host and fixed for the place's life (31). sluice never chooses what
listens on it.

### The ruling

> 99. A preview's place receives, for each port name its policy lists,
>     a name: one DNS label of at most 63 characters, built from the
>     port name, the revision, the branch and the repository, with the
>     port name and the revision kept whole when it is shortened; the
>     same for every asking of that revision, and no other place's on
>     the host. The policy states each address a person opens as a
>     template over the names and ports; sluice reports the addresses
>     filled in, and never contacts them.

99 gives the name as 31 gives the port: sluice owns uniqueness, the
repository owns what serves it. A name is `<port>-<rev7>--<branch>--
<repository>`, lower-case letters, digits and hyphens; one longer than
63 characters is cut after the revision and ends in six characters of a
hash of the whole, so two long names that share a beginning stay apart.
A name another preview holds takes the revision's first twelve
characters instead of seven. The repository's command routes the
name to the port with whatever proxy it uses, and its release command
removes the route. Because the addresses come from a template, they are
known as soon as the preview is asked for, before the stack is up.

## The life of a preview

### The problem

A caller asks for a preview and may crash before it records the answer.
A preview may be held for an hour or a day. A preview whose stack failed
to come up is no use to anyone, and a preview nobody asks to release
holds its ports and its stack.

### What the statement already settles

sluice never releases a session's place (25). A place whose working copy
no longer exists is no session's (97). A run that exceeds its time limit
is ended with everything it started (66).

### The ruling

> 100. A revision has at most one preview on a host, whichever branch
>      it was asked for through. Asking for a preview of a revision that
>      has one gives that one, unchanged.
>
> 101. A preview is released only at the asking of a session, a driver,
>      a planner or the operator: the release command its revision's
>      policy states run in the place under the host's executor,
>      everything started in it ended, the place removed, and its ports
>      and names let go (34). sluice releases a preview on its own only
>      when its place no longer exists, or when its command failed or
>      exceeded its time limit; such a preview stays listed, holding
>      nothing, with the end of what its command printed, until it is
>      released again. sluice lists every preview it holds on the host,
>      with its branch, revision, addresses, state and the time it was
>      made.
>
> 102. A preview's command counts against the instance's bound (71) for
>      exactly as long as it runs. A preview held after its command
>      ended counts against nothing.
>
> 103. A preview decides nothing. Its command is not a check: nothing
>      of it is recorded as a run (16), no gate reads it (30), and no
>      entry waits on it. Its state is its own: waiting for room in the
>      bound, starting, up, or failed with its command's output.

100 makes asking safe to repeat: a caller that crashed asks again and
gets what it asked for the first time. 101 leaves the end to whoever
knows the person is done, and the list is how a caller finds what it
forgot. 102 counts what loads the host while it is being started; a
held stack is the repository's, as a session's idle stack is (94). A
caller asking for a preview while the host is at its bound waits for
room, as a session run does, and never takes the share the host keeps
for candidates (91); stopped while it waits, it leaves the preview
waiting, and the next asking takes it up with the same names and
ports. 103
keeps a preview out of the queue entirely: a preview that fails to come
up says so and is released, and nothing lands or waits differently.

## Part C, rows

**C.1 the place** gains a row:

| profile | materialize | release |
|---|---|---|
| **preview**: a detached worktree at a landed revision, held until asked, its record kept in `.previews/` apart from every other place's | `git worktree add --detach` at the revision, as a candidate's; a block of ports held on the host, each checked free; a name per port (99); `SLUICE_PLACE`, `SLUICE_PORT_<NAME>`, `SLUICE_NAME_<NAME>`, `SLUICE_BRANCH` and `SLUICE_REVISION` given to the preview command | by `sluice release <preview>` (101): the revision's release command run in the place under the executor, the command's process group ended, `git worktree remove`, the ports and names let go; after a failed command, the record kept with the command's output and nothing else |

**C.5 the driver** gains a row:

| profile | submit / withdraw / state / notify / forecast |
|---|---|
| **preview**: `sluice preview` | `sluice preview <branch> <revision>` makes or returns the revision's preview (98, 100), waits for room in the bound (102), and prints its name, state and addresses once its command has started, as JSON with `--json`; `--wait` returns once its command has ended, exiting 1 if it failed; `sluice previews` lists the host's (101); `sluice release <preview>` releases one, named by its name or its revision |

**C.7 policy** gains a table, read from the previewed revision (98):

```toml
[preview]
command   = "moon run app:preview"   # a string run by sh -c, or a list; brings the stack up, hands it off, exits
addresses = { web = "https://{name.web}.localhost", api = "https://{name.api}.localhost/docs" }
timeout   = "10m"                    # optional; the branch's time limit otherwise
# the ports are [checkout] ports; the release command is [tests] release
```

## For the caller

This section is for crew, flywheel and anything else that asks for
previews. sluice knows no bolt, no card and no proxy; the caller does.

### What a preview is for

A preview is a cheap environment: the repository's own stack, on the
fakes and stand-ins its checks already bring up (an emulator for the
cloud, stand-ins for outside services), running a revision the gate
passed. It answers "does the work behave" for a person who wants to
click through it. It starts in seconds to a minute, costs nothing but
the host, and many run at once. Because it is the same stack the gate's
checks started, what the person sees is what was tested.

It does not answer "does it deploy and run in our cloud". Infrastructure
code, permissions, the identity provider's real settings, real outside
integrations and performance are not modeled by the fakes. That needs a
deployment into a real environment, by a deployment tool holding cloud
credentials, which sluice never holds. sluice is the integration half of
CI/CD: it decides what lands and shows what landed running. The delivery
half, putting a revision into a real environment, is another provider's.

### How crew and flywheel use it

```
 unit lands on bolt at R1   --> sluice preview <bolt> R1
                                addresses onto R1's landing card
 next unit lands at R2      --> sluice preview <bolt> R2
                                addresses onto R2's card
                                sluice release <R1's preview>
 bolt lands on main         --> sluice release <bolt's last preview>
 after a crash              --> sluice previews; release any whose
                                revision is on no live card
```

- One preview per landing, of the revision the landing card names. The
  card's link always shows exactly that revision; a new landing gets a
  new preview and new names. There is no stable name per bolt: there
  are many bolts, and a stable name would show a card newer code than
  it names.
- The caller owns the lifetime. sluice never ends a preview on its own
  while its place exists, so a caller that drops one leaks a stack
  until its reconciliation finds it.
- Asking again is safe (100), so a caller that cannot tell whether it
  asked simply asks.

### Choosing a preview or a real environment

| the work touches | ask for |
|---|---|
| behavior, pages, flows, data the fakes model | a preview, on every landing |
| infrastructure code, permissions, identity provider settings, outside integrations, performance | a real environment from the deployment provider, usually once the bolt is ready for main |

A caller with both providers holds the same idea for each: an
environment for one revision, linked to its card, replaced on the next
landing and ended when the bolt lands. Only the provider differs.

### Names and the proxy

The repository's preview command routes each name to its port, under
portless with `portless alias "$SLUICE_NAME_WEB" "$SLUICE_PORT_WEB"`,
and its release command removes the alias. Names are one flat label, so
they hold under a wildcard certificate and a `*.localhost` redirect,
and a host's mirror carries them to the workstation as it carries any
other alias. A remote host's previews reach the workstation through the
same tunnel as its dev servers, at the same `.localhost` names.

## Scenarios

- **S30.** A unit lands on a bolt at R1. Its caller asks for a preview
  of R1 and gets its addresses at once, in state starting. The preview
  command brings up the emulator, the stand-ins and the app, routes
  their names and exits; the preview is up. A person opens the app's
  address and signs in.
- **S31.** A second unit lands at R2. The caller asks for R2's preview
  and releases R1's. R1's release command removes its containers and
  routes; its ports and names are free, and R2's preview never shared
  either.
- **S32.** The caller crashes after asking for R2's preview. Restarted,
  it asks again and gets R2's preview unchanged; it lists the host's
  previews and releases R0's, whose card is gone.
- **S33.** R3's preview command fails. The preview is reported failed
  with the command's output and released; nothing is recorded as a run,
  and no entry of the branch waits or lands differently.
- **S34.** Two bolts of one repository each hold a preview while four
  candidates and two session runs are under test on the host. No two
  share a port or a name.
- **S35.** A caller asks for a preview of a candidate's revision, or of
  a session's head. It is refused: the branch has not landed it.

## What it changes elsewhere

- 25 gains: "and releases a preview only as 101 says".
- 34 stands: a preview's place is a place sluice made.
- The actors table: sluice may not release a preview while its place
  exists unless asked (101); a session, a driver and a planner may ask
  for and release previews.
- I5 stands: the preview command is the repository's, and sluice starts
  no service, chooses a port only as 31 does, and gives names as it
  gives ports.
- Non-goals gain: "Deploying a revision into a real environment. A
  preview runs the repository's own stack on its fakes; a deployment is
  a delivery tool's."
- The site: a page on previews, the policy's `[preview]` table, and the
  walkthrough's services section pointing a caller at `sluice preview`.
