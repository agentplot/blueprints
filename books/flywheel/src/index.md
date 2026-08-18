# The flywheel

The flywheel is the work-loop machinery that turns operator intent
into merged code. It exists because the scarce resource inverted:
a few developers with a fleet of agents have more build capacity than
decision capacity. Ideas arrive faster than anyone can rule on them,
agents find more problems than anyone can triage, and an unstructured
swarm converts that surplus into noise — every agent demanding
attention, every finding becoming a ticket, the queue growing faster
than the code. The bottleneck is not building; it is judgment.

The flywheel is built around that bottleneck. Human judgment is
concentrated at four points — answering a question, annotating a
chapter or a plan, approving a batch on the board, reading a run
report — and everything
between those points runs unattended. Agents do not decide what work
exists; they do work. The operator does not supervise work; they rule
on direction and approve it in batches.

The name is the mechanism. Each turn adds momentum instead of
starting over: decisions accrete into design books, merged changes
accrete into implemented specs, and the next turn's work is the
shrinking difference between the two — computed fresh each time,
never stored, never stale. There is no backlog to groom because the
backlog is a measurement.

<figure>
<svg viewBox="0 0 760 400" role="img" aria-label="The flywheel: the design loop writes the book, bolt plans derive from the gap between book and repo, the construction loop merges code, and the operator's four approvals sit at the hub" style="max-width:100%;height:auto;font-family:inherit">
  <defs>
    <marker id="fw-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/>
    </marker>
  </defs>
  <g fill="none" stroke="currentColor" stroke-width="1.4">
    <rect x="290" y="28" width="180" height="58" rx="10"/>
    <rect x="40" y="240" width="190" height="58" rx="10"/>
    <rect x="530" y="240" width="190" height="58" rx="10"/>
    <circle cx="380" cy="269" r="52" stroke-width="2" stroke="#e6a23c"/>
  </g>
  <g fill="currentColor" font-size="14" text-anchor="middle" font-weight="600">
    <text x="380" y="52">design book</text>
    <text x="135" y="264">tracker</text>
    <text x="625" y="264">built repo</text>
    <text x="380" y="264" fill="#e6a23c">operator</text>
  </g>
  <g fill="currentColor" font-size="11" text-anchor="middle" opacity="0.75">
    <text x="380" y="72">the destination</text>
    <text x="135" y="284">questions · work state</text>
    <text x="625" y="284">code · implemented specs</text>
    <text x="380" y="282" fill="#e6a23c">four approvals</text>
  </g>
  <g fill="none" stroke="currentColor" stroke-width="1.4" marker-end="url(#fw-arrow)">
    <path d="M 150 238 C 170 150, 230 90, 284 62"/>
    <path d="M 476 62 C 540 92, 596 152, 618 238"/>
    <path d="M 528 286 C 480 322, 300 322, 232 288"/>
  </g>
  <g fill="none" stroke="#e6a23c" stroke-width="1.1" stroke-dasharray="4 4">
    <line x1="345" y1="230" x2="300" y2="160"/>
    <line x1="415" y1="230" x2="460" y2="160"/>
    <line x1="326" y1="270" x2="236" y2="270"/>
    <line x1="434" y1="270" x2="524" y2="270"/>
  </g>
  <g fill="currentColor" font-size="11.5" text-anchor="middle">
    <text x="176" y="128">design loop</text>
    <text x="176" y="143" opacity="0.75">questions become decisions,</text>
    <text x="176" y="158" opacity="0.75">decisions become chapters</text>
    <text x="592" y="128">bolt plan</text>
    <text x="592" y="143" opacity="0.75">derived from the gap:</text>
    <text x="592" y="158" opacity="0.75">book minus implemented specs</text>
    <text x="380" y="356">construction loop</text>
    <text x="380" y="371" opacity="0.75">spec · build · verify · merge — each merge shrinks the next plan</text>
  </g>
</svg>
<figcaption>One turn of the flywheel. The design loop writes the
book; the bolt plan is derived from the difference between the book
and the built repo; the construction loop closes that difference. The
operator's approvals sit at the hub, and everything else turns
without them.</figcaption>
</figure>

## One idea, end to end

A developer sends a sentence. Dispatch files it as a question on an
intent. A design session burns the question into a decision; the
decision is synthesized into the system's design book, and the
operator approves the chapter in an annotation round. When the
operator wants construction, the bolt planner reads the book, the
built repo's implemented specs, and the changes already in flight,
and returns bolt plans — the remaining gap, cut into buildable
changes, each citing the chapters it derives from, one card per bolt
on the board. The operator approves a plan by moving its card to
Ready; the bolt loop expands it into the bolt's work items and drives
each change through spec, build, verify, review, and a gated merge to
main. The merged specs shrink the gap the next plan is derived from.

Between approvals, the machinery runs itself: a server reconciles
every sixty seconds and starts a loop process wherever a milestone
has work. Every run writes a record of what it changed on the tracker
and why; the operator reads any run as a report — what moved on the
board, expected versus actual — and holds any loop still under
repair. Agents that find problems put them in their reports —
evidence for the operator, never tickets in the queue.

## How to read this book

| Chapter | Question it answers |
|---|---|
| [Commitments](commitments.md) | The invariants everything else derives from. |
| [Glossary](glossary.md) | The vocabulary, one definition per term. |
| [The design loop](design-loop.md) | How uncertainty becomes decisions and books. |
| [Bolt planning](bolt-planning.md) | How construction work is derived, never groomed. |
| [The construction loop](construction-loop.md) | How a plan becomes merged code. |
| [Sessions](sessions.md) | The agent sessions the loops launch. |
| [The server and the fleet](server-and-fleet.md) | Processes, hosts, and identities. |
| [Observation](observation.md) | The run record, the hold, and the operator's reports. |
| [The tracker protocol](tracker-protocol.md) | Labels, milestones, batches, and the board. |
| [Lifecycles](lifecycles.md) | Each object's birth, life, and end — items, cards, change directories. |
| [Schemas](schemas.md) | How OpenSpec schemas bind changes to the loops. |
| [Contracts](contracts.md) | The canonical artifacts this book owns. |
| [Verification](verification.md) | The QA infrastructure every change docks onto. |

The flywheel is built at `agentplot/flywheel` and ships as a Claude
Code plugin. This book is the destination it is built toward; the
repo's `openspec/specs/` records what is implemented. The gap between
the two is the flywheel's own backlog, derived the same way as anyone
else's.
