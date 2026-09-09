# MCP tools for herdr sessions: what exists, what to use

The flywheel runs many Claude Code sessions at once in herdr panes on one machine, and will later run Codex
sessions the same way. Those sessions need every kind of MCP tool: local stdio servers such as playwright and
filesystem, npx-launched servers such as GitHub, local HTTP servers, and remote services such as context7,
deepwiki, Atlassian and Linear, some behind OAuth and some behind API keys. This note reports what the clients
give us today, what off-the-shelf gateways exist, and which one to adopt.

## What Claude Code gives us today

Claude Code reads MCP config from three scopes: local (`~/.claude.json`, keyed per project path), project
(`.mcp.json` at the project root) and user (`~/.claude.json`, global). Precedence runs local, project, user,
plugin-provided, then claude.ai connectors, and a server named at several scopes is connected once from the
highest one. Source: https://code.claude.com/docs/en/mcp

| Mechanism | What it does |
| --- | --- |
| `.mcp.json` | Project scope file with an `mcpServers` map. Keys: `type`, `url`, `command`, `args`, `env`, `headers`, `timeout`, `oauth`. |
| `--mcp-config` | Passes server config to one session, as inline JSON or a config file path. |
| `--strict-mcp-config` | Loads only what `--mcp-config` passed. Project and user config are ignored entirely. |
| `claude mcp add --scope local\|project\|user` | Writes config into the matching scope. |
| `managed-mcp.json` | Enterprise file carrying `mcpServers`, `allowedMcpServers`, `deniedMcpServers`, `allowAllClaudeAiMcps`. |
| `headersHelper` | Path to a script that prints a JSON header map on stdout, run on each connection, 10 second timeout. |

Transports are `stdio`, `http` (streamable HTTP, with `streamable-http` accepted as an alias), `sse`
(deprecated) and `ws`. Remote servers authenticate through OAuth with dynamic client registration, driven by
`/mcp` in session or `claude mcp login <name>`, and pre-registered credentials go in an `oauth` block with
`clientId`, `callbackPort`, `authServerMetadataUrl` and `scopes`. Expansion of `${VAR}` and `${VAR:-default}`
works in `command`, `args`, `env`, `url` and `headers`, so a generated file can reference a value without
carrying it. Source: https://code.claude.com/docs/en/mcp

Two behaviours matter here. First, `--strict-mcp-config` is the only thing that reliably keeps the operator's own
user-scope servers out of a session. Second, Claude Code does not share a stdio server process between two of its
own processes: every session spawns its own child. The feature request asking for a shared daemon,
https://github.com/anthropics/claude-code/issues/28860, filed 26 February 2026 and closed as a duplicate,
measures four sessions with six servers producing about 42 processes and 1.9 GB, and
https://github.com/anthropics/claude-code/issues/45880 describes 15 sessions against 34 servers causing kernel
panics on a 64 GB Mac. This is the whole reason a gateway is worth adopting.

Codex CLI is simpler. Servers go in `~/.codex/config.toml` under `[mcp_servers.<name>]`, or through
`codex mcp add`. Local servers take `command`, remote ones take `url` plus a bearer token, and older builds need
`experimental_use_rmcp_client = true` in a `[features]` block before they will read HTTP servers at all.
Sources: https://composio.dev/content/how-to-mcp-with-codex and
https://github.com/netdata/netdata/blob/master/docs/netdata-ai/mcp/mcp-clients/codex-cli.md
Codex has no equivalent of `--strict-mcp-config`, so isolation there means writing a per-session `CODEX_HOME`.

## The constraint nobody can design away

A stdio MCP server speaks to exactly one client over one pair of pipes. It is a single-client transport by
construction, and the way to serve a second client is a second process.
Source: https://mcpcat.io/guides/configuring-mcp-servers-multiple-simultaneous-connections/
Every gateway therefore picks one of two answers: keep one long-lived process and serialize all sessions through
it, or spawn a fresh process per call or per session. Nothing gives both one process and full isolation. Remote
HTTP servers have no such problem, because a session connecting to context7 costs a socket and not a process.

## Candidates

**Docker MCP Gateway** (`docker mcp gateway run`) runs catalog servers as isolated containers behind one
endpoint, with `--transport stdio|sse|streaming`, `--port`, `--servers`, `--tools server:tool` filtering,
`--secrets`, `--verify-signatures` and `--block-secrets` on by default. Secrets live in a file the gateway reads
internally and never mounts into a container. `docker mcp client connect <client> --profile <id>` writes client
config, including Claude Code's `~/.claude.json`. OAuth is a first-class `docker mcp oauth` flow against catalog
v3. MIT licensed, roughly 1051 commits.
Sources: https://github.com/docker/mcp-gateway/blob/main/docs/mcp-gateway.md and
https://github.com/docker/mcp-gateway and https://www.docker.com/blog/docker-mcp-gateway-secure-infrastructure-for-agentic-ai/
It runs on Linux without Docker Desktop, but `docker mcp secret set` breaks there and you fall back to a
`secrets.env` file, and catalog `config:` entries have to be declared as `secrets:` instead.
Source: https://dev.to/udondan/running-docker-mcp-gateway-on-linux-without-docker-desktop-4da2

**MCPJungle** is a single Go binary. `mcpjungle start` runs the registry on port 8080 and creates a SQLite
database in the working directory, with `--sqlite-db-path` to move it. Install is Homebrew, a release binary, or
Docker. Servers are registered from JSON with `mcpjungle register -c file.json`, stdio servers run as child
processes of the gateway, and `${VAR_NAME}` placeholders in `env` and args are resolved server side. Tool groups
cherry-pick tools into a named subset served at its own URL. Enterprise mode issues per-client bearer tokens with
explicit server allowlists. MPL-2.0, 1.2k stars.
Sources: https://github.com/mcpjungle/MCPJungle and https://mcpjungle.mintlify.app/ and
https://mcpjungle.mintlify.app/guides/tool-groups and https://mcpjungle.mintlify.app/guides/register-stdio-servers
and https://mcpjungle.mintlify.app/reference/cli-enterprise

**ToolHive** (`thv`) from Stacklok runs each server in a Docker, Podman or OrbStack container, proxies stdio into
HTTP, auto-configures known clients, holds encrypted secrets, and aggregates a group behind one endpoint through
`thv vmcp serve --group <name>` at `http://127.0.0.1:4483/mcp`, with per-workload tool filters in `vmcp.yaml`.
Apache 2.0, 2.1k stars, 4281 commits. A container runtime is required.
Sources: https://github.com/stacklok/toolhive and https://docs.stacklok.com/toolhive/guides-vmcp/local-cli

**MetaMCP** aggregates servers into namespaces and serves each namespace as one endpoint over SSE, streamable
HTTP or OpenAPI, with per-endpoint API keys of the form `sk_mt_...`, OIDC, middleware that rewrites traffic in
flight, `${VAR}` resolved server side, and idle sessions pre-allocated per server to cut cold starts. Deployment
is Docker Compose with Postgres. MIT, 2.7k stars. Source: https://github.com/metatool-ai/metamcp

**IBM ContextForge** is the broadest of the set: `pip install mcp-contextforge-gateway` or a container, inbound
stdio, SSE, streamable HTTP, WebSocket and JSON-RPC, REST and gRPC translated into MCP, `mcpgateway.translate` to
lift a local stdio server onto HTTP, virtual servers for per-client tool subsets, JWT and basic auth, SSO. Apache
2.0, 4.4k stars. It also carries the most operational weight, wanting Postgres and Redis for the full stack.
Source: https://github.com/IBM/mcp-context-forge

**1MCP** (`npm install -g @1mcp/agent`) is a long-lived `1mcp serve` process owning backend lifecycle, exposing
streamable HTTP at `http://127.0.0.1:3050/mcp` plus a `1mcp proxy` stdio bridge, with tags set at add time
(`--tags=documentation,docs`) and presets built by `preset create <name> --filter "documentation OR thinking"`.
Apache 2.0, about 500 stars. Its docs are thin on how backend connections are shared.
Sources: https://github.com/1mcp-app/agent and https://docs.1mcp.app/reference/architecture

**Transport bridges** solve one narrow thing. sparfenyuk/mcp-proxy converts stdio to SSE or streamable HTTP and
back, mcp-remote gives a stdio-only client a remote server including the interactive OAuth flow. Neither
aggregates, holds secrets, or filters per client.
Sources: https://github.com/sparfenyuk/mcp-proxy and https://github.com/punkpeye/mcp-remote

**Also surveyed and set aside.** agentgateway (Linux Foundation, v1.0, no namespace hierarchy), Bifrost,
Cloudflare MCP Server Portals, Kong, MCP Mesh, mcp-proxy by tbxark, MCPX by Lunar, Microsoft MCP Gateway, Obot,
Portkey, Supergateway and Unla (https://www.heyitworks.tech/blog/mcp-aggregation-gateway-proxy-tools-q1-2026).
Smithery, Composio and Glama are catalogs and hosted runtimes, not something that holds our secrets on our own
machine, so they do not answer the process multiplication problem.

## uxc

uxc (holon-run/uxc) is a Rust CLI that discovers and invokes operations across OpenAPI, MCP over both HTTP and
stdio, GraphQL, gRPC and JSON-RPC, through one command shape: `uxc <host> -h` to list, `uxc <host> <op> -h` to
inspect, `uxc <host> <op> key=value` to call. It stores credentials separately from commands and binds them to
endpoints, imports MCP config from existing client settings, supports OAuth for HTTP MCP, and ships a daemon for
session reuse. MIT, 113 stars, 476 commits. Install is `brew install uxc` or `cargo install uxc`.
Source: https://github.com/holon-run/uxc

Honestly: uxc is a client, not a gateway. It replaces the session's MCP tool surface with a Bash-invoked CLI,
which is a real option because it costs zero MCP context and gives central credential binding. What it does not
do is hold one shared playwright process for twelve sessions, or stop the operator's own config leaking in. It
fits as a way to reach schema-described HTTP APIs from a session without an MCP server at all. It does not
replace a gateway for local stdio tools, and at 113 stars it is not something to build the fleet on yet.

## Evaluation

| Need | MCPJungle | Docker Gateway | ToolHive | MetaMCP | ContextForge | 1MCP | uxc |
| --- | --- | --- | --- | --- | --- | --- | --- |
| stdio, local HTTP and remote all behind one endpoint | yes | yes | yes | yes | yes | yes | no, per call |
| One shared process per stdio server | yes, `session_mode: stateful` | yes, one container | yes, one container | yes, pooled sessions | yes | unclear | no |
| Per-session allow-list | tool groups plus client allowlists | `--tools`, profiles | `vmcp.yaml` filters | namespaces | virtual servers | tags and presets | credential bindings |
| Secrets never in session config | yes | yes | yes | yes | yes | yes | yes |
| Claude Code via a generated file | yes, plain HTTP URL | yes, `client connect` | yes, auto-config | yes | yes | yes, or helper | not MCP |
| Works with Codex | yes, HTTP url | yes | yes | yes | yes | yes | yes, it is a CLI |
| Central OAuth to remote services | beta, incomplete | yes, `docker mcp oauth` | yes, OIDC | yes | yes, SSO | partial | yes |
| Runs without Docker | yes, one binary | no | no | no | yes, pip | yes, npm | yes |
| Actively maintained in 2026 | yes | yes | yes | yes | yes | yes | yes, small |

## Recommendation

Adopt **MCPJungle** as primary. It is the only candidate that scores on both of the hard columns, no container
runtime and a real per-client allow-list, while still holding stdio servers as long-lived processes and keeping
secrets on the gateway. **Docker MCP Gateway** is the fallback, and the right answer if the fleet standardises on
Linux hosts with Docker already running, because its catalog, signature verification, secret store and OAuth
flows are more finished than anything else here.

### Recipe

One gateway per machine, started by the fleet before any session:

```
mcpjungle start --sqlite-db-path /var/lib/flywheel/mcpjungle.db
```

Register each server once with `mcpjungle register -c <file>`, from files the fleet keeps under version control,
with secrets referenced and not embedded:

```json
{
  "name": "github",
  "transport": "stdio",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PAT}" },
  "session_mode": "stateful"
}
```

`${GITHUB_PAT}` resolves in the gateway's own environment, so it can come from `op run` or a launchd unit and
never reaches a session. Register remote services the same way with `transport: streamable_http` and
`--bearer-token` where the service takes one.

Define one tool group per session role, not per session, with `mcpjungle create group -c ./groups/build.json`:

```json
{
  "name": "build-session",
  "included_tools": ["playwright__browser_navigate", "github__create_pull_request", "context7__query-docs"]
}
```

The flywheel then writes one file per session and launches with strict config, so nothing from the operator's
home is visible:

```json
{
  "mcpServers": {
    "flywheel": {
      "type": "http",
      "url": "http://127.0.0.1:8080/v0/groups/build-session/mcp",
      "headers": { "Authorization": "Bearer ${FLYWHEEL_MCP_TOKEN}" }
    }
  }
}
```

```
claude --strict-mcp-config --mcp-config /path/to/session/.mcp.json --agent flywheel-construction-session
```

For Codex the same URL goes into a per-session `CODEX_HOME` config.toml under `[mcp_servers.flywheel]`. Remote
OAuth services are authorised once on the machine, either through the gateway where it supports the service or,
until MCPJungle's OAuth work lands, by running `claude mcp login <name>` once in a scratch session and letting
the gateway carry the resulting token as a bearer credential.

### What the flywheel still has to write

Four things, all small. A launcher that keeps `mcpjungle start` alive per host and waits for its port before
sessions start. A mapping from session role to tool group, and the group JSON files themselves, which are
policy and cannot be inferred. A per-session config writer that emits the four-line `.mcp.json` above with the
right group URL and, in enterprise mode, mints the client token through `mcpjungle create mcp-client <session>
--allow "..."` and revokes it at session close. And a health check, because a gateway that is down turns into a
session with no tools and no explanation.

## Open risks

**Shared stateful stdio servers leak state.** In `session_mode: stateful` MCPJungle opens one connection on the
first tool call and reuses it, which is exactly what makes playwright dangerous to share: twelve sessions would
drive one browser. Run playwright and any other stateful server as `stateless` and pay the cold start, or run one
gateway per session for that server alone.
Source: https://mcpjungle.mintlify.app/ and https://github.com/mcpjungle/MCPJungle

**A gateway restart mid-session is silent.** Claude Code connects at session start and reports health at `/mcp`.
A restart leaves running sessions holding a dead endpoint until the next tool call fails, so restarts have to be
a fleet-level event rather than a routine one.

**The tool list drifts.** Registering a server or editing a group changes what the gateway advertises, but
sessions already running keep the list they connected with. Treat group definitions as config that changes
between bolts, never during one.

**Per-client isolation is coarse.** Tool groups are per role, so two sessions with the same role share an
allow-list. A tool only one session may touch needs its own group and client token.

**Enterprise mode is the untested path for us.** The allow-list and bearer token behaviour is documented but is
the part of MCPJungle least exercised in the wild, and its OAuth support is described as beta. Spike it before
depending on it.
