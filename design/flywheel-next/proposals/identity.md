# A.32 Identity — proposed requirements

Proposed as a new section of `requirements.md`, numbered 243–255,
amending 233, 234, 236a and 237.

### A.32 Identity

243. Identity is Frontegg's, through its SDK, and there is one provider.
    The page runs the React SDK and the tool server verifies the token
    the SDK carries; nothing else vouches for an operator. The flywheel
    never talks to GitHub or to an enterprise directory for sign-in:
    GitHub stays the git host and the App that reaches the repositories
    (207). This replaces the per-host sign-in kind of 233 and 234 — a
    host declares a Frontegg environment, not a kind.
244. Sign-in is Frontegg's hosted login. The SDK builds `redirect_uri`
    from the origin the page is served on, so the host's served name is
    the only per-host fact and it is registered once, as an entry on the
    Frontegg environment's redirect list, never per organization.
245. A host serving the page on the operator's own computer serves it
    under a name, not a port. A wildcard redirect entry never matches a
    port and several hosts run on one computer (232), so each host is
    reached at `https://<host>.flywheel.localhost` through the machine's
    portless proxy — the proxy already required for a place's services
    (191) — and one wildcard entry `https://*.localhost/oauth/callback`
    on the environment admits every host on every operator's machine.
    Nothing beyond that proxy is needed; the flywheel adds no redirect
    entry of its own at run time.
246. The identity is the Frontegg user. GitHub is one social connection
    on it, and the GitHub username the connection carries is what
    authorship uses — commit trailers, pull requests, the git host's
    view of who did the work. 234's "the identity is the GitHub username
    everywhere" becomes: the identity is the Frontegg user, whose GitHub
    connection supplies the username used for authorship. A user with no
    GitHub connection may respond and may not be an author; the flywheel
    asks for the connection at first sign-in.
247. Membership is the assignment of the flywheel Application to the
    organization's Frontegg account. The account is the organization
    (218) and assignment is the whole of "may respond in it" (233).
    The manifest's `operators:` is no longer authored: it is derived
    from the account's assigned users at every fetch and rendered
    read-only on the settings form. What stays authored on the entry is
    the member's chat addresses (236a), so the operators list becomes an
    addresses list keyed by Frontegg user id, and adding or removing a
    member is an act on the Frontegg account, never a commit.
248. Roles are held per account and carried in the JWT. A role assigned
    on a parent account applies down the branch, so an organization that
    is a sub-account of another inherits its roles. The manifest's
    `roles:` (237) is likewise derived, not authored: a decision's owner
    names a member or a Frontegg role, and the rail filters on it.
249. Permissions are read from the token by the tool server. Before any
    op-response is written the server checks the caller's token for the
    permission the tool declares, on the organization's account; a call
    without it is refused, no response is recorded, and the refusal is
    written to the run record with the identity, the tool and the object
    (79, 153). This replaces the `operators:` membership check of 233 as
    the authorization act; membership remains what admits the identity
    to the organization at all.
250. Feature flags are entitlement features, one flag per feature, keyed
    `fw.ff.*`, evaluated in the page and on the tool server. A flag
    hides a surface; it never authorizes, and the tool behind a hidden
    surface is still guarded by its permission.
251. Agents never sign in through the browser. A session in a place acts
    with the identity token the machinery issued it (surfaces.yaml
    `tools.identity`) and reaches the git host with the App's
    installation token (207); no session, host process or dispatch agent
    holds a Frontegg user credential.
252. The definitions ship in the flywheel binary and are synced to the
    Frontegg environment by the flywheel. The manifest below is the one
    place permissions, roles, features and flags are defined; a release
    carries it with the set version (208, 224). The sync reads the
    environment's current definitions and writes only the difference,
    respecting the provider's write ceiling on features, plans and
    flags; it deletes nothing not named in `retire:`, and it never
    writes a hostname.
253. Self-managed hosts are not an exception. A host on the operator's
    own computer or their own cloud serves the same page, so identity,
    membership, roles, permissions and flags all apply there exactly as
    on a served host. There is no local-user case and no unauthenticated
    page (S183). An organization created on a self-managed host is
    created as a Frontegg account whose creating user holds `owner`, so
    a fresh organization is never locked out and a single operator is
    never asked to administer roles.
254. A self-managed host degrades rather than fails when Frontegg is
    unreachable. A token already issued is honoured until it expires;
    past that the page is read-only — the status view, the book and the
    map render, the rail shows its decisions and every control that
    would write is absent, with one attention line saying identity is
    unreachable and since when. The loops keep running and nothing that
    needs a response is answered; flags fall back to their last-seen
    values, and to their manifest defaults when none were seen.
255. Identity administration is a surface of the flywheel, not a second
    console: the account item lists the organization's members with
    their roles and their chat addresses, invites a user to the account,
    grants and revokes the Application, and targets a flag on the
    account. Every one of those is a tool call under
    `fw.identity.admin`, recorded like any response (153).

## The definitions

```yaml
identity:
  provider: frontegg
  application:
    surfaces: [page, tool-server]        # one Application for the whole flywheel
  permissions:
    - fw.read                            # status view, book, map, the query tools
    - fw.plan.answer                     # respond to a decision, including yes-all
    - fw.plan.assign                     # set a decision's owner (237)
    - fw.capture.write                   # the capture box (19)
    - fw.proposal.edit                   # edit a proposal before answering it
    - fw.map.edit                        # map-edit, set-home, set-status, attach, detach, add-repository
    - fw.review.mark                     # mark reviewed (122)
    - fw.packages.manage                 # add, configure, enable, disable, remove a package (228, 229)
    - fw.secrets.place                   # place a secret on a host (S187)
    - fw.hosts.manage                    # add a host, enrol, repair, takeover (222, 230)
    - fw.org.configure                   # the manifest as a form (233)
    - fw.org.remove                      # retire an organization (221)
    - fw.identity.admin                  # invite, assign the Application, roles, flag targeting
  roles:
    viewer:   [fw.read]
    reviewer: [fw.read, fw.capture.write, fw.review.mark, fw.proposal.edit]
    operator: [fw.read, fw.capture.write, fw.review.mark, fw.proposal.edit,
               fw.plan.answer, fw.plan.assign, fw.map.edit,
               fw.packages.manage, fw.hosts.manage, fw.org.configure]
    identity-admin: [fw.read, fw.identity.admin]
    owner:    [fw.read, fw.capture.write, fw.review.mark, fw.proposal.edit,
               fw.plan.answer, fw.plan.assign, fw.map.edit,
               fw.packages.manage, fw.hosts.manage, fw.org.configure,
               fw.secrets.place, fw.org.remove, fw.identity.admin]
  features:
    - key: fw.ff.pools
      flag: {default: off, on: []}       # host pools (240–242); per account
    - key: fw.ff.management-console
      flag: {default: off, on: []}       # the hosts and setup surfaces beyond one host
    - key: fw.ff.book-view
      flag: {default: on,  on: []}       # the board's book view (S60)
    - key: fw.ff.explore
      flag: {default: on,  on: []}       # explore over intents (S172)
    - key: fw.ff.store
      flag: {default: off, on: []}       # the package store (228)
  retire: []
```

## Who may do what

| Flywheel action | Permission | Roles | On a self-managed host |
|---|---|---|---|
| Read the status view, book, map, query tools | `fw.read` | viewer, reviewer, operator, identity-admin, owner | yes |
| Respond to a decision; yes all | `fw.plan.answer` | operator, owner | yes |
| Capture | `fw.capture.write` | reviewer, operator, owner | yes |
| Assign a decision's owner | `fw.plan.assign` | operator, owner | yes |
| Edit a proposal | `fw.proposal.edit` | reviewer, operator, owner | yes |
| Mark reviewed | `fw.review.mark` | reviewer, operator, owner | yes |
| Edit the map | `fw.map.edit` | operator, owner | yes |
| Add, configure, disable, remove a package | `fw.packages.manage` | operator, owner | yes, and `fw.ff.store` gates the store |
| Add a host, enrol, repair, takeover | `fw.hosts.manage` | operator, owner | yes, and `fw.ff.management-console` gates the surface |
| Place a secret | `fw.secrets.place` | owner | yes; the secret still never travels through the page |
| Configure the organization | `fw.org.configure` | operator, owner | yes |
| Retire an organization | `fw.org.remove` | owner | yes |
| Administer members, roles, flag targeting | `fw.identity.admin` | identity-admin, owner | yes; the creating user holds owner by default (253) |

## Open questions

1. One Frontegg Application for the whole flywheel, or one per
   environment class of the flywheel service? The manifest above assumes
   one, assigned to each organization's account.
2. Is an organization always a top-level account, or may an organization
   be a sub-account so that a parent's roles apply down the branch (248)?
   The answer decides whether a service running many organizations can
   grant a support role once.
3. Which Frontegg environment does a self-managed host use — the
   flywheel's own Production environment for every self-managed
   operator, or one environment per customer? This decides who holds the
   environment token the sync (252) writes with.
4. Does the flywheel sync definitions from a self-managed host at all,
   or only from the hosted service? A self-managed host writing the
   shared environment needs a scoped token it should probably not have.
5. Should `fw.ff.*` flags be targetable per user as well as per account,
   or per account only? Per account only is simpler and matches the
   board being the organization's (235).
6. Is the read-only degraded mode (254) bounded — does a host with no
   identity for a stated time stop covering work and say so under
   attention (150), or does it stay read-only indefinitely?
