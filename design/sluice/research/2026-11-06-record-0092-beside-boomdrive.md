# Record 0092 beside Boomdrive: the user's word

Research talk with the user, 2026-11-06, in the place
`research--a-hosts-one-driver-fits-boomdrive`, on sluice record 0092
(proposed, sluice 2f0b5c98) read beside Boomdrive's records 0003 to
0021, flume's settles design and its follow-up B1, and swancloud
record 0057. Clause numbers are sluice's statement unless another tool
is named. This place cannot write in agentplot/sluice or
agentplot/boomdrive: what each owes is for agentplot-design to write,
listed in `../proposals/host-process-1.md`.

## The user's word

Record 0092 is replaced. The user approved the design drawn on the page
`Boomdrive Work Lifecycle`
(https://claude.ai/artifact/671w5zreD9aMqstSLpMQSm) with "Okay I
approve this." on 2026-11-06. Its clauses are in
`../proposals/host-process-1.md` and the statement, each proposed until
sluice's record.

<!-- vale Vale.Terms = NO -->
<!-- vale Blueprints.SoftSales = NO -->
<!-- vale Blueprints.Hedges = NO -->
The words that set the design's direction, 2026-11-06:

- "I don't know that we want to take it as a given that we have a
  gatebox. This isn't about this one [...] point solution. It's about
  the need to think about building an ecosystem of tools designed for
  agentic engineering."
- "What I want is an elegantly designed CLI, and I think it started out
  that way: you do `submit`, and if you wanted to wait, you could."
- "is it a punt where you just say, 'Look, run a [...] system service
  and just have it be there so it's always running things'? Or is there
  a design where these tools are meant to fit together like a glove?
  Remember Flume and Boom Drive act like the disposable pattern in code
  with `using` and `finalize`."
- On sluice calling another program: "At one point the design was very
  clear that sluice didn't call another program [...] I feel like that
  might make sense because then sluice would be loosely coupled to
  Flume". So Flume reads each outcome, and sluice starts nothing
  (`../proposals/landing-handoff-1.md`).
- On one process per queue: "if I had 10 agents all submit, then 10
  supervisors are running. They're all going to try to form the next
  candidate. It just seems antithetical to the concept of a merge
  queue."
- On one process per host: "Should it be one per queue or one
  system-wide that can also manage the system's concurrency and the
  host's concurrency rules? The whole point of programming languages
  like Rust and Go is to have really great concurrency support so I
  feel like we give that up when we have one per queue." So sluice keeps
  one host process, started by its own command and gone when idle.
- "I'm building it for 100 million people to use and I want to make
  sure it's designed right. Now's the time: it's okay to break things
  and make drastic changes." They asked that one outcome be better
  instructions for every agent working on Boomdrive, drafted in
  `../../principles.md`.
<!-- vale Blueprints.Hedges = YES -->
<!-- vale Blueprints.SoftSales = YES -->
<!-- vale Vale.Terms = YES -->

## Answers that stand

Asked on the question tool, 2026-11-06:

- **How the host process finds its repositories.** The user chose
  "Index, on any sluice use": sluice adds a repository to its host index
  whenever any command of sluice's finds it has sluice, a policy or
  records (135).
- **The person's own checkouts beside the runner's one clone.** The
  user chose "Worktrees of the one clone": on a runner host the person
  works in worktrees of the runner's clone, as swancloud record 0057
  (accepted 2026-11-06) carries out, so sluice sees one repository.
