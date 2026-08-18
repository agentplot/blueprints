# Commitments

Five invariants. Every mechanism in this book derives from one of
them, and a mechanism that violates one is a defect regardless of how
well it works.

## 1. Durable prose lives in git; work state lives on the tracker

Records — questions, session reports, decisions, this book — are files,
written once and reviewed. Work items, their states, their batches,
their dependencies, and the running narrative are GitHub Issues:
changed by one API call, no worktree, no merge collision. Nothing is
recorded in both places. A file carries only terminal facts; an issue
carries only mutable state.

## 2. Direction lives in design books; the backlog is computed

The design book is the only durable statement of where a system is
going. There is no stored queue of future proposals: the backlog is
the difference between the book and the built repo's implemented
specs, derived fresh each time the operator asks for a plan. Nothing
is pinned until the operator approves a specific bolt plan, and it
stays pinned only for that bolt's lifetime. Design keeps moving while
construction runs; the next planning run reads the book as it is then.

## 3. Construction never creates work objects

Only the operator — directly, or through a design session the operator
charged — brings work items into existence. A construction session
that finds a problem inside its approved scope fixes it: that is work,
not a discovery. A problem outside its scope goes into the session's
report and stops there; the operator reads it in the run report and
decides whether it becomes a question. Findings are
evidence, not obligations. An obligation exists only when the operator
makes one.

## 4. The machinery never writes about itself into the tracker it drives

The tracker is the bus for the system under construction. Findings
about the flywheel — a loop misbehaving, a prompt failing, a dispatch
mistake — are evaluation output and travel through run reports,
never as issues on the tracker the flywheel is driving. This
is the boundary between the machinery and its target, and it holds
even when the target is the flywheel's own repo.

## 5. The operator's attention is batched

The operator appears at four points, each an approval of a homogeneous
set, never a per-item decision:

- **answers** — a question only a human can settle, relayed by
  dispatch;
- **annotation rounds** — a chapter or plan reviewed as one document;
- **board approvals** — a candidate batch moved to Ready, one
  gesture per batch;
- **run reports** — what changed on the board and why, one run per
  table.

Everything between those points runs without a human. A mechanism
that makes the operator decide item by item is wrong even when each
decision is easy.
