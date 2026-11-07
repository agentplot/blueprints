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
    Boomdrive flake's configuration: "Flume's: managed + local", "Flume's
    rule for all", "Add to Nix's"; agentplot/boomdrive
    `design/research/the-flakes-configuration-holds-streams-and-repositories.md`.)
