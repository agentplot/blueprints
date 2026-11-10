# Designing the Boomdrive family

How every agent that designs or builds a tool of the family (the
runner, flume, sluice, timber, weir and boom) weighs a design. Proposed
2026-11-06, from the user's research talk on sluice record 0092
(`sluice/research/2026-11-06-record-0092-beside-boomdrive.md`): "I want
one outcome of this to be better instructions for all the agents working
on Boom Drive. I'm the only one using it right now but I'm building it
for 100 million people to use and I want to make sure it's designed
right." Each repository's CLAUDE.md points here.

## The design comes first

1. **Records and rules describe today's design.** When the right design
   breaks one, propose changing it, with the reason. Never shape a
   design to fit a rule that is wrong.
2. **Find the mechanism before the owner.** Name what happens, step by
   step, before deciding which tool owns a fix. A design that starts
   from who runs a process has skipped whether the process is needed.
3. **Design for every operator.** The family is built for anyone, on a
   laptop or a fleet. A design that needs one particular host, or a
   service on it, is wrong; a host's own layout is a configuration of
   the design, never its shape.

## How the tools fit

4. **Each tool is a plain command line a person can use alone.**
   Installing the binary is all it needs. `sluice submit` returns at
   once, and `sluice wait` is there for whoever wants to watch.
5. **A tool that needs a background process starts it itself and stops
   it when idle.** Nothing is installed to keep running but the runner,
   whose job is to be reachable by the control plane. A process a tool
   starts holds nothing its records do not, so its death loses nothing
   and the next command starts it again.
6. **One decider for each shared thing, in one process.** A queue, a
   host's bound on runs, a forge's allowance: each is decided in one
   place, with the language's concurrency inside that process, never by
   separate processes coordinating through files.
7. **Tools fit by reading each other's records.** No tool calls
   another: sluice starts no program after an outcome, and flume,
   timber and any other reader read what sluice decided. A tool names
   another only to read it.
8. **A unit of work is a `using` block.** Whoever acquires a resource,
   a branch, a worktree, a place, releases it, once its outcome is
   read. The runner's pass is the host's one clock: it catches what no
   process is there for, time, a crash, an outcome decided elsewhere.
9. **Work runs where its subject lives.** A local branch's queue runs on
   the host; a branch on a forge that takes pull requests is queued on
   the forge.
10. **Every tool's configuration has two layers, by one pair of words.**
    Its managed layer, `config.toml`, is written by Nix, a fleet or a
    person; its local layer, `config.local.toml` beside it, by the
    operator or a control plane, read over it. Each tool lists the keys
    its local layer may set, the managed layer may pin them, and a list
    such as a host's repositories adds the two. A tool's file is written
    by its own module, by hand or by a control plane's local layer, and
    never by another tool. (From the user's talk of 2026-11-06 on the
    Boomdrive flake's configuration: "flume's: managed + local", "flume's
    rule for all", "Add to Nix's"; agentplot/boomdrive
    `design/research/the-flakes-configuration-holds-streams-and-repositories.md`.)

## Changing the work

11. **A step made automatic leaves no instruction doing it by hand.** A
    change that makes a step happen on its own also changes every
    instruction that has an agent or a person do that step. Those are
    the agents' briefs, each repository's CLAUDE.md and skills, and the
    cards and runbooks that walk it. Where those instructions live in the
    changed repository, the change carries them. Where they live in
    another, such as crew's briefs or a host's configuration, the
    change names them. Their own change lands when the host moves to
    the release that automates the step, not before. A unit that
    automates a step names, in its source, the instructions it retires.
    (Proposed 2026-11-07, from the user's words that day, relayed by
    agentplot-operator, "Boom driver" being Boomdrive: "We need to make
    sure that once the Boom driver flume sluice workflow is automatic,
    the instructions for the agents are updated in lockstep". Accepted
    only on their yes.)

12. **No code carries a transition.** Each change builds the design as
    it should stand. Where hosts or records must move from one shape to
    the next, an agent moves the data by hand, in a step the change
    names, and no fallback, guard or bridging unit is written for the
    move. A stopgap the user chooses is named in its record with the
    change that retires it. (Proposed 2026-11-08, from the user's words
    that day in agentplot-design's pane, on a unit that read a kit's
    folder only to carry a stopgap: "I want the system to be built the
    way it should be and then have agents fucking fix the data
    transition as necessary". Accepted only on their yes.)

## Settings

13. **A setting says what it is.** A key is named in its reader's
    words. A number's unit and range are in its name or in its
    description, in the module's option and the tool's configuration
    reference. A key whose value the reader must decode, such as a
    `false` that reads as turning something off, is renamed. (Written
    2026-11-09 by agentplot-design from the user's words that day in its
    pane, reading deneb's Boomdrive configuration: "when settings are a
    number liek this one: threshold = 90; a comment should explain the
    units/options"; "\"keep_free\" - blurgh. don't love this config key.
    there are better ways to name config keys"; and, of crew's per-role
    `flume` map, "I don't understand what this section is about and why
    we're turning these things off".)

14. **The set sets what the family knows, and a host says only its
    own, through a tool's settings.** The Boomdrive set derives or
    defaults every value the recipe knows: a tool's kinds and their
    words, its folders, the map of a drive's repositories. A host writes
    only what is its own, and only through a tool's own settings, never
    by a file, wrapper or script beside the set. A tool that needs what
    another program knows reads that program's own source, never a file
    a host makes for it. (Written 2026-11-09 by agentplot-design from
    the user's words that day in its pane: "If you can't set telemetry,
    that's the perfect thing to externalize. Yet you didn't make that an
    externalized config. Jeezum, we need to externalize the things that
    can be and make sense to be externalized"; "We should not be passing
    Flume some custom SwanCloud JSON. Flume is supposed to be figuring
    out Claude Code usage on its own. This coupling cannot exist"; "why
    is this in swancloud configs? the idea is that the are part of the
    recipe from crew/boomdrive".)

15. **A tool's checks are made faster from Timber's measurements.** A
    tool's CI and its merge gate are tuned as the work goes, by what
    Timber measures of their runs, never by a rule written ahead of the
    numbers. A public repository's runs cost time, not money, so
    running a check in two places is no reason alone to drop one.
    (Written 2026-11-10 by agentplot-design from the user's words that
    day, declining a chore that dropped CI's macOS checks beside
    sluice's gate: "I don't think we need to do this. We only ran out of
    minutes because the repo was private. The repo will be public and it
    won't matter. We will want to optimize as we go but we want to make
    sure to optimize with Timber.")
