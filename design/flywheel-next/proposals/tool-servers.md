# Tool servers belong to the host

A tool server is a part of the host, not a part of a session. The host
runs one of each server it declares, every session on that host calls
the same one, and which servers a session may call is named in its work
order and versioned like its instructions.

## The problem

The flywheel runs many sessions at once. A host's bound is a setting
(32), pools raise it further (240), and every session is an agent
program in a pane (173, 174). Each of those programs, left to its own
configuration, starts its own copy of every tool server it is told
about. N sessions times M servers is the count of processes, almost all
of them idle, all of them holding memory, and none of them visible to
the machinery that is supposed to be able to say what a host is doing
(B.4). The cost is worst exactly where the flywheel is trying to be
good: a host running its bound of construction work pays M times the
bound for tools that a single process could have served.

## What the requirements already settle

More of this is answered than it first appears, and the answer is
consistent.

The flywheel's own tool server is already one per host. It is the
binary's catalogue (193), a remote server of the model context protocol
at the host's address (293), and its clients are the page, the chat, the
interpreter, a member's own coding agent, and the sessions the machinery
starts. One server, many callers, each call carrying an identity the
server checks (197, 249). Nothing about that shape is special to the
flywheel's own tools.

The machinery already refuses to read an agent program's configuration.
Every tool the machinery drives runs under explicit arguments and a
configuration the machinery writes from the manifest, never the tool's
own file on the host or in the operator's home (183), so that the same
manifest on two hosts yields the same commands. A session that inherits
tool servers from whatever happens to be in the operator's home
contradicts that clause today.

A session's inputs are closed and enumerable (89), the enumeration is
data per session type (226), and a test renders a work order from it
without starting a session (90, 124). Tools are conspicuously not in
that enumeration, which is the gap this proposal closes.

Packages are the way a host gets a part (228), the setup surface is
where one is configured and its secrets are named (229), and a secret is
placed by the operator and never by an agent (204, 207).

So the ruling below is less an invention than an extension of clauses
that already exist to a class of thing the statement has not yet named.

## The ruling

A tool server is provisioned by the host as a per-host package, of a
kind of its own in 228's list. The host starts exactly one of each
server it declares and shares it across every session on that host,
whatever the bound is set to. No session starts a tool server, and no
server is started per session or per place. Liveness is the host's to
watch and to report under attention (81), like any other part of it.

The tools a session may call are part of its type's closed inputs. Every
session type's enumeration names the tool servers in force for it (226),
versioned like the instructions and the skills (88, 123), so a test can
render the set (90) and two sessions can be told apart by which set they
had. The machinery hands the set to the agent program through a
configuration it writes for the place, and the program is told to read
that and nothing else (183).

Tool servers do not enter the session bound. The bound of 32 limits work
in flight and is what the instrument reads as drain (214). A tool server
is a fixed cost of the host, not work, and folding it in would make the
instrument lie: adding a server would shorten runway. Nor does a tool
server need a bound of its own, because the declaration is the bound.
One per declared server per host is a count that does not move with
demand, which is the whole point of the change.

A session that needs a server the host does not run is refused by name.
The host covers no work whose session type names a server it lacks (149,
the same shape as an object no host's declaration covers), and the
refusal says which server and which package would provide it, exactly as
a binding this release lacks is refused by name.

Isolation is the session's scope, unchanged. A shared server never
widens what a session can reach: what it may reach through one is what
its work order already names (89, 96). Every call carries the session's
identity, issued when the machinery started it (197), so a server that
keeps state per caller keeps it disjoint by identity, and a server that
cannot tell its callers apart holds nothing a session leaves behind and
is given only what every session on that host may see. A per-session
identity is therefore required, not optional, because without it two
sessions on one host would share a server's memory and 96 would fail
silently.

## The bindings

Part C style: one row per way the seam is satisfied.

| binding | what it gives | what it costs |
|---|---|---|
| **Shared servers over HTTP at the host**, handed to each session in the MCP configuration the machinery writes for its place | one process per declared server per host, whatever the bound; the shape the flywheel's own tool server already has (291, 293); per-caller identity on every call; both agent programs the sessions binding names read it from a file the machinery writes and can be told to read nothing else. Claude Code takes `--transport http` servers with static or helper-supplied headers and reads a project `.mcp.json`, with `--strict-mcp-config` excluding the user's own; Codex takes `url` with `bearer_token_env_var` in `mcp_servers` and reads a project `.codex/config.toml` | the server must speak HTTP, which a server published only as a stdio command does not; the host must supervise the process and hold its secrets; a server with no notion of a caller needs the shared-blind declaration above |
| **A multiplexing proxy in front of stdio servers**, itself reached over HTTP at the host | covers the stdio-only servers without changing anything on the session's side: one child per server per host, the proxy fanning calls from every session into it and stamping the caller | one more part the host provisions, watches and can lose calls in; a stdio server holding per-connection state must be separated by the proxy per identity or declared shared-blind; the proxy's own catalogue can drift from the servers behind it |
| **uxc's daemon for API-shaped tools** | uxc is a schema-driven unified CLI that discovers and invokes operations over OpenAPI, GraphQL, gRPC reflection, MCP and JSON-RPC, with an optional local daemon for session reuse and background subscriptions, and an importer for existing MCP configuration (`uxc config import mcp --from claude-code`, `--from codex`). For a tool that is really an API behind a schema, it collapses every agent's client into one command and one daemon, and the schema is fetched rather than configured | it is not an MCP server and does not present another server's tools to the model as tools: a session reaches it as a shell command, so the catalogue lives in a skill's prose rather than in the agent's own tool list, and 226's enumeration would have to name a skill instead of a server. It does not remove a stateful MCP server's process; it reuses a connection to one. Two vocabularies for tools on one host is a cost paid by every instruction that mentions either |

**Recommended shipped default: the first row.** Shared servers over HTTP
at the host, named in the work order, written into the place's
configuration by the machinery. The second row ships beside it as the
adapter for servers that exist only as a stdio command, and it is an
implementation detail of the same package kind rather than a second kind:
a session sees an HTTP server either way. The third row is admitted as a
package an instance may install for API-shaped tools, and is not the
default, because turning tools into a CLI moves them out of the agent's
catalogue and out of 226's enumeration.

## Clauses

Numbers 319 to 323, the next free after 318.

**319 (new, A.28).**

> A tool server is a part of the host. It is a per-host package of its
> own kind (228), configured on the setup surface with its secrets named
> there and placed by the operator (204, 207, 229), and the host runs
> exactly one of each server it declares however many sessions run on
> it. No session starts a tool server, and no tool server is started per
> session or per place. Its liveness is the host's to watch and to
> report under attention (81), as for any other part of the host, and a
> secret it needs never travels through a work order, a page or a
> session.

**320 (new, A.11).**

> The tool servers a session may call are part of its closed inputs
> (89). Every session type's enumeration names the servers in force for
> it (226), versioned like the schemas, instructions and skills (88), so
> a test renders the set for a given type, version and scenario without
> starting a session (90, 124), and two sessions are told apart by the
> set they were given. A session reaches no tool server its work order
> does not name. The machinery hands the set to the agent program
> through a configuration it writes and the program reads nothing else
> (183). Changing which servers a type is given is a chore (123).

**321 (new, A.28).**

> Tool servers never enter the bound on sessions running at once (32).
> That bound limits work in flight and is what the instrument reads as
> drain (214); a tool server is a fixed cost of the host and not work.
> The declaration is the only bound a tool server has: the count is one
> per declared server (319) and does not grow with the sessions, so a
> host running its bound of sessions runs no more tool servers than a
> host running none.

**322 (new, A.28).**

> A host covers no work whose session type names a tool server the host
> does not run, and says so by name (149). The refusal names the server
> and the package that would provide it, and it is a decision under
> attention, never a silent wait, in the same shape as a binding this
> release lacks.

**323 (new, A.7).**

> A shared tool server never widens a session's scope. What a session
> may reach through one is what its work order already names (89, 96),
> and every call carries the session's identity, issued when the
> machinery started it (197). A server that keeps state per caller keeps
> it disjoint by that identity; a server that cannot tell its callers
> apart holds nothing a session leaves behind and is given only what
> every session on the host may see.

## What changes where

| where | change |
|---|---|
| requirements 226 | the enumeration gains the tool servers in force for the session type, beside the schema instruction, the skill and the identity |
| requirements 228 | the kind list gains **tool server**; a tool server is per-host scope only, never instance scope |
| requirements 319–323 | new, as above |
| `machines/package.yaml` | `kind` gains `tool-server`; the install decision and the secret decision are unchanged, so a tool server installs by the path every package already takes |
| `machines/engine/host.yaml` | the host's declaration gains its tool servers; a declared server that is not running is an attention line and makes the host uncoverable for the types that name it (149, 322); nothing about leases or takeover changes |
| `profiles/host.yaml` | under `packages:`, the tool-server kind: what the host starts it with, the tether or launcher entry named by the package, the address and port it binds from the host's router (191), the evidence names for running and for reachable, and where its secrets are held |
| `profiles/sessions.yaml` | the configuration the machinery writes into each place per agent kind and passes on the command line: `.mcp.json` with `--strict-mcp-config` for `claude`, `mcp_servers` in a project `.codex/config.toml` for `codex`, each entry an HTTP URL at the host with the session's identity as its header, and nothing read from the operator's home (183) |
| `profiles/context.yaml` | a row per session type for the tool servers it is given, beside its other work-order contents; a construction session's set is closed like the rest of its inputs (89, ruling 24) |
| `surfaces.md` | the host's part of the setup surface lists its tool servers with their state, running or down or awaiting a secret, on the same rows as its other parts (229); the add-package flow offers the tool-server kind; a session's page shows the set it was given |
| conformance | **S35** (next free), two parts: a host with a bound of two sessions runs three declared tool servers once each across three sessions, the process count unchanged between one session running and the bound running; and a session whose type names a fourth server the host does not run is not started, the host reporting the server and the package by name under attention |
| roadmap | the package kind and the written place configuration land with packages and setup; the enumeration change in 226 lands with the work order |

## Open

- **Whether a tool server may be shared across hosts on one computer.**
  232 allows several hosts on one computer, each a separate process with
  its own root, ports and leases, sharing nothing but the git host. A
  tool server is a plain candidate for the exception, since two hosts on
  a laptop paying twice for the same server is the original complaint at
  a smaller scale. Against it: 232's value is that every host scenario
  runs on a laptop, and a server shared across hosts is a thing a
  scenario cannot start, stop or disconnect by host name. Leaning
  towards keeping 232 whole and paying the duplication, since the
  duplication is bounded by the number of hosts on one computer, which is
  small and deliberate.
- **Whether the model class rule (285) extends to tool servers.** 285
  lets a unit type or elaboration type declare the model class each of
  its stages runs. The parallel would let a stage declare its tool
  servers directly rather than only through its type's enumeration. It
  is the same shape of judgment, so probably yes, but it interacts with
  322: a per-stage set means coverage is decided per stage rather than
  per type, and the refusal has to name the stage.
- **Whether a shared-blind server is admissible at all**, or whether a
  server that cannot tell its callers apart should simply be refused. The
  clause above admits one on the narrowest terms. Refusing outright is
  cleaner and would cost the instance every server that has not thought
  about callers, which today is most of them.
