# Decision: one fleet per GitHub org, in its own herdr session

## Decision
A **fleet is scoped to a GitHub org** — willdan, afterthought, agentplot —
and each fleet runs in its **own named herdr session**, named for the org.
A named session is a separate herdr server instance with its own socket,
workspaces, and agent namespace, so the fleet's roster is the session's
whole contents: `herdr agent list` there is the fleet, teardown is the
session's, and nothing the fleet does lands in a pane beside unrelated
work.

The manifest lives at the **org folder root** — the directory above the
org's repos (`~/Code/clients/github_willdan/fleet.yaml`) — and is **not
checked into git**:

- placement is machine-local by nature (hostnames, working trees), and the
  org folder is not a repo, so nothing forces a commit;
- `cwd:` entries are **relative to the org folder**, which removes
  absolute paths from the manifest entirely;
- the fleet command finds the manifest by walking up from wherever it is
  invoked, so it does the right thing from any repo in the org.

The flywheel plugin ships the command (`bin/flywheel`), a `fleet` skill
that wraps it (`/flywheel:fleet up|status`), and a template manifest; each
org folder keeps its own instance.

## Context
- Produced by: the operator, 2026-08-10, in the session that landed the
  loop layer — extending decisions 26–29 (manifest + command, placement
  only, `parked`)
- Measured: `herdr session list` shows sessions as separate server
  instances with their own sockets; a CLI call targets one via
  `HERDR_SOCKET_PATH`. The loop layer's fleet smoke test ran in the
  default session and landed its tab beside unrelated work — the failure
  this scoping removes.

## Why
One machine hosts several clients' work. A fleet that shares the default
session shares its workspace list, its agent namespace, and its blast
radius with everything else running; per-org sessions make isolation the
default and multi-client work side-by-side safe. Org scope (not repo
scope) because a fleet conducts sibling repos together — blueprints, the
kits — and the org folder is the one place they all hang from.

## Consequences
- `fleet.yaml` moves out of the blueprints repo to the org folder root;
  the repo copy retires with the migration.
- The manifest gains nothing for sessions beyond its location: the
  session name is the org folder's name unless a `session:` field says
  otherwise.
- `flywheel up`/`status` target the org session's socket; when the
  session is not running they say so and name the command that starts it
  (`herdr --session <org>`), rather than starting agents into the wrong
  session.
- Whether a named session can be started headless is unverified; the
  command treats an absent session as the operator's to start.
