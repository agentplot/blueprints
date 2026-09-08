# Hosted physical design — review

Read: requirements A.25, A.32–A.36; `models/dispatch/model.md`;
`proposals/hosted-design.md`, `security.md`, `cloud.md`; the eight diagrams
as SVG source and as renders. Platform facts checked 2026-09-07 against
AWS, Slack and Discord documentation; see the two lists at the end.

## Findings, most serious first

**1. The capture receiver is not "no compute", and it is shared.**
Claim: "API Gateway integrated straight into one SQS queue per instance
· no compute" (271; `hosted-design.md` machines table; all four physical
diagrams). Why wrong: the hosted tiers use the service's own Slack app,
Discord app and GitHub App (207a, 277). Each of those has exactly one
inbound URL for every workspace, guild and installation, so the payload
must be demultiplexed to the instance's queue by `team_id`, `guild_id`
or `installation.id`, which API Gateway cannot look up without compute.
Discord's interactions endpoint must verify an Ed25519 signature and answer
`PING` with `PONG` at registration and on every health check; Slack needs
a `url_verification` echo once and a signed-request check; GitHub sends an
HMAC. All three want a 2xx inside three seconds. A pure gateway-to-queue
integration cannot do any of that. There is therefore a small receiver
function, and it is one shared process that sees every instance's
inbound payload in the clear before it is queued. It also needs
`kms:GenerateDataKey` on every instance's key to write the queue, which
the tagged-principal rule as written would refuse. Fix: draw a "receiver
function" box (stateless, verifies signatures, answers `PING`, defers the
interaction, routes by workspace id to the instance's queue) and say
plainly that it is the second shared component beside the bot; amend 271
to "no compute of the machinery's beyond verification and routing"; split
the key policy into an encrypt-side grant for the receiver role and a
tagged-session grant for `Decrypt`.

**2. Discord free text has no home on the hosted tiers, and 217i forbids
the placement outright.** Claim: Hobby "chat is fully usable with the
laptop closed: a decision is answered by button or by free text" (281);
the dispatcher is "one Lambda function per tier" (269). Why wrong: Discord
delivers ordinary channel messages only over the gateway websocket; a
function invocation holds no socket. 217i still says "a placement that
cannot hold a socket, a clock and a private-network route is not a
placement for the presenter or the endpoint", which is the exact argument
`dispatch-physical.svg` uses to strike out Vercel functions, and it
disqualifies Lambda identically. 270 amended 231 but nobody amended 217i or
217c. Fix: state that on the hosted tiers free text in Discord is the
string option of a slash command (`/fw yes 412`, `/fw <anything>`) and
plain replies are not read, while Slack free text arrives over the Events
API; then rewrite 217i so the invoked placement of 270 is a placement in
its own right (clock from the scheduler, socket replaced by the
interactions endpoint, route replaced by the served name with an identity
check). Say the reply path too: the receiver answers the interaction with a
deferred acknowledgement, and the tick posts the real reply within the
15-minute interaction-token window or as an ordinary bot message.

**3. Nobody draws who serves the page, or where the tool server runs, when
no tick is running.** Claim: "the rail reaches ... the page at a served
name" (281), "woken ... by a page request" (all diagrams), "the tool server
verifies the token" (243, 249). Why unclear: a browser request is not a
tick; it is a read with an identity check, and the diagrams make it invoke
the dispatcher's tick path (download bundle, fetch GitHub, evaluate). No
box shows the ingress (API Gateway or a function URL), the Frontegg token
verification, or where the page's static bundle is served from. Worse,
217c and 191 require the tool server to listen only on the operator's
private network, and 46 forbids publishing it; the hosted tiers have no
private network and must publish it at the served name. Fix: add a box
"page and tool server · the same function, request-invoked · behind the
tier's served name · verifies the Frontegg token on every call (249) · a
request is a read, never a tick"; add a Frontegg box on the third-party
side; amend 217c and 191 so that on a hosted host the identity token
replaces the private network as the boundary.

**4. The pool host's disk cannot be "encrypted under the instance
key".** Claim: 275, `hosted-design.md` pool row and KMS row, and all four
diagrams ("it encrypts the queue, the cache, the pool disk, the logs").
Why wrong: `cloud.md`'s own AWS section says "no customer-managed key
documented for images or snapshots — SnapStart takes `--kms-key-arn`,
MicroVMs do not", and the MicroVM security and image pages read today name
only a build role, an execution role and port-scoped tokens. The disk is
under AWS's key, not the instance's. Fix: on the diagrams change the
KMS list to "the queue, the cache, the logs, and what a pool host writes to
S3"; rewrite 275 to say the microVM's disk is isolated per instance and
destroyed at terminate under the platform's own encryption, and that an
instance whose tier statement (261) must promise a key of its own on the
disk binds its pool to Fargate with an EBS volume under its key.

**5. Nothing guarantees one tick per instance at a time.** Claim:
"each invocation is one instance's tick" (269). Why unclear: the
scheduler, the queue and a page request are three independent invokers;
Lambda scales them concurrently, so two ticks of the same instance can
overlap. Git's compare-and-swap keeps state safe, but both ticks upload the
bundle (last writer wins, harmless because it is a projection), both may
post the rail to chat before the sink's mark lands, and both hold the same
host id, so the sink lease (148, 150) does not separate them. Fix: route
every invoker through the instance's FIFO queue with the instance
as the message group id (the scheduler's target is the queue, not the
function); Lambda then runs at most one invocation per group, and page
requests take the read path of finding 3 and never tick. Say so in 270 and
on the diagrams ("due" goes to the queue, not the function).

**6. A dispatcher that exists only during a tick looks dead between
ticks.** Claim: dispatch "heartbeats, holds its leases and ticks like every
host" (217); the host life region marks a host stale at five minutes and
gone at thirty (`cloud.md` retire section). Why unclear: an instance
whose next due time is hours away has a dispatcher whose last heartbeat is
hours old, so the status view shows it stale and raises takeover
decisions for a host that is merely not due. Fix: a ruling that an invoked
host's liveness is its scheduler entry: it heartbeats once per tick, its
stale window is the due time it wrote plus a grace, and a missing entry
with no heartbeat is what "gone" means.

**7. Design C is drawn as if it were a tier, its "control plane" is
undefined, and it contradicts `security.md` on the bot.** Claim:
`physical-c` "every machine in your account"; box "control plane · the
only thing of ours that exists · provisioning only · plus the chat bot
app". Why unclear: A.34 has four tiers and tier 3 is design B (the same
function, assuming a role you grant). 281's Enterprise "a dispatcher
function of its own" is ambiguous between a dedicated function in our
account and C's function in yours. `security.md` (e) says "Their App,
their bot ... breaks the shared bot identity", while `physical-c` keeps
the bot ours. And "control plane" names no machine: provisioning into a
customer account needs a deployer (a cross-account stack deployment
through the role), a registry of instances with health and counters,
the identity environment (Frontegg), and a path for the readings 288 sends
back. Fix: either ratify C as tier 4 in 268 with its own clause, or stamp
the diagram "a design, not a tier of A.34"; in both cases replace the
"control plane" box with three: "registry · instance names, tier,
health, counters", "deployer · a stack applied through your role, our
binary version stamped", "identity · Frontegg, the served-name redirect
entry for your host (244)"; and decide the bot once in C and in (e).

**8. In designs B and C the queue's wake path breaks the "deleting the role
ends every path" promise.** Claim: `physical-b` receiver "the dispatcher
reads it through your role, for one tick"; "the queue has items" arrow to
the function. Why wrong: an SQS event source mapping polls with the
function's execution role, not with the per-tick assumed role, and it must
hold `kms:Decrypt` on the customer's queue key before the tick begins. That
is a standing cross-account grant on the customer's key policy, a second
revocation point the customer must know about, and it is a credential path
that the role's deletion does not close. Fix: in B and C the wake is a
content-free notification (the customer's queue fans out an EventBridge
event carrying only the instance id, or the scheduler ticks), and the
tick reads the queue itself under the assumed role. State in 276 that the
only grants in the customer's account are the role's trust policy and the
key's grant to that role.

**9. Session tags by OIDC need the issuer to mint them, and the customer
registers an identity provider, not just a trust line.** Claim: "you paste
our issuer and your instance's subject and you are done"
(`hosted-design.md`), "matched against the tag on every key and object"
(259). Why unclear: for `AssumeRoleWithWebIdentity` the tags come only from
the token's `https://aws.amazon.com/tags` claim, so the service's issuer
must put the instance into `principal_tags` and the trust policy must
allow `sts:TagSession`; the customer must also create an IAM OIDC provider
resource for our issuer before a role can trust it. Fix: say both in 276
and in the "What changes for you" paragraph.

**10. Key policy wording.** Claim: "policy: a principal may use it only
when its session tag equals the key's tag" (all diagrams, `hosted-design`).
Why unclear: `aws:ResourceTag` is not usable in a KMS key policy. Either
each key's policy names its instance literally under
`aws:PrincipalTag/org`, or the tier role's IAM policy allows `kms:Decrypt`
on `key/*` with `aws:ResourceTag/org = ${aws:PrincipalTag/org}`. Both
work; the second is what "no count of roles limits it" needs. Fix: one
sentence naming the second form.

**11. Sizing on the diagrams is the burst figure.** Claim: "8–32 GB
memory, 4–16 vCPU" (all diagrams). Why wrong: the baseline is 0.5 to 8 GB
and 0.25 to 4 vCPU; 32 GB / 16 vCPU is the 4× burst above the top baseline
and is billed per second above baseline. `cloud.md` says "4 vCPU
sustained". Fix: "baseline up to 8 GB / 4 vCPU, bursting to 32 GB / 16
vCPU, 32 GB of disk".

**12. The image build is a code-reading step with no stated host.** Claim:
"created from the instance's image" (275); "It never holds code"
(269). Why unclear: building the image reads the built repository's
environment declarations (238, 239) and runs the Dockerfile; the MicroVM
build service does that in the service account from a zip in S3 that
someone uploaded. Who uploads it, and where were the declarations read?
Fix: state that the image build is an effect run on a pool host or the
operator's own machine, never in the dispatcher, and that the artifact is
written to a per-flywheel prefix under the instance's key.

**13. The 15-minute ceiling is a binding fact and is unstated.** Claim:
"both are bounded per tick, and what does not fit is carried" (269). Why
unclear: a Lambda tick has a hard 900-second cap covering bundle download,
fetch, interpreter calls, self-contained triage, push and upload. Fix: name
it in 269 and say what the tick drops first when the budget is short
(triage before interpretation).

**14. "Nothing between runs" is true of the design, not of the platform.**
Claim: "nothing between runs" (diagrams, `hosted-design`). Why unclear:
Lambda reuses an execution environment across invocations, `/tmp` and
process memory persist between them, and the next invocation may be
another instance's tick. The residual paragraph knows this; the boxes
do not. Fix: "nothing between runs by construction: scratch wiped and the
data key dropped before exit; the sandbox is reused across instances".

**15. Two proposals still carry the earlier physical shape.** `security.md`
§2 says "the clones live on EFS, the due index on DynamoDB, queued captures
on SQS with their bodies on S3"; `cloud.md` "Recommended AWS mapping" §1
says "a Lambda function behind a function URL ... warm clones live in one
EFS filesystem mounted from the VPC" and idea 2 says "one queue with a
tenant key", while the same file's "Recommended path" and A.34 say one S3
object, no VPC, one queue per flywheel. Fix: rewrite those three
passages to the A.34 shape.

**16. The dispatch model and its diagrams predate A.34.**
`models/dispatch/model.md` §5.1 still rules that a per-request function is
"not a placement" and that the first cloud placement is a long-lived
container; §6 has hobbyist/SMB/enterprise. That is what
`dispatch-physical.svg` draws. See "Diagram fixes" for the two stale
diagrams, and add a one-paragraph §5.2 to the model naming the invoked
placement of 270 with its three substitutions from finding 2.

## Diagram fixes

**Are `boundaries.svg` and `dispatch-physical.svg` stale?** Triage inside
the dispatch box on `boundaries.svg` is correct: 216 names triage as one
of dispatch's four jobs and 217e charges it by the tick of the host that
declares the source. What is stale on that diagram is the label "the
org's, outside every host", which contradicts 217 ("Dispatch is a host"),
and it does not show that on a shared host triage over pointed-at raw
material runs elsewhere (263). `dispatch-physical.svg` is the stale one:
its three placements, its container-only cloud, its Vercel ruling and its
hobbyist/SMB/enterprise ladder are all superseded by A.32, A.34 and A.35.

`flywheel-next-cloud-tiers.svg` and the three physical diagrams (apply to
each unless noted):
- Capture receiver box: replace "no compute" with "a receiver function ·
  verifies the signature, answers Discord's PING, defers the interaction,
  routes by workspace id to your queue · stateless · the second shared
  component"; move the "encrypts the queue" arrow to say "the receiver
  encrypts, only your tagged session decrypts".
- Add a box "page and tool server · the same function, request-invoked ·
  the tier's served name · verifies the Frontegg token on every call · a
  request is a read, never a tick"; add "Frontegg · sign-in, membership,
  roles" on the your-side row; draw "page request" into the new box, not
  into the dispatcher.
- Dispatcher box: replace "woken by the queue, by the scheduler at the due
  time, or by a page request" with "woken only through your queue: the
  receiver, the scheduler and a page write all enqueue, so one tick of
  yours runs at a time"; add "a tick has 15 minutes; triage yields to the
  interpreter"; add "the sandbox is reused across instances; scratch
  wiped and the data key dropped before exit".
- Scheduler box: the "due" arrow goes to the queue, not the function; add
  "60-second precision · at most one entry per instance ·
  create-or-update, deleted after it fires".
- Pool host box: "baseline up to 8 GB / 4 vCPU, bursting to 32 GB / 16
  vCPU, 32 GB of disk"; add "its image is built on a pool host or your
  machine, never in the dispatcher"; drop "the disk is encrypted under the
  instance key".
- KMS box: "it encrypts the queue, the cache, the logs, and what a pool
  host writes to S3"; replace the policy line with "your session tag must
  equal the key's tag: the tier role's policy, `aws:ResourceTag/org =
  ${aws:PrincipalTag/org}`"; add "the receiver may encrypt, never decrypt".
- Slack or Discord box: add "Discord free text is a slash command option;
  plain replies need a socket nobody holds · Slack free text arrives over
  the Events API".
- Cloud-tiers tier 3 cell and `physical-b`: "a dispatcher function of its
  own" or "the same dispatcher", one of the two, matching 281.
- `physical-b` and `physical-c` receiver: replace "the dispatcher reads it
  through your role, for one tick" with "your queue raises a content-free
  wake to our function; the tick reads the queue under your role"; in
  `physical-b` and `physical-c` the pool host line "its disk is encrypted
  under your key" goes.
- `physical-c`: subtitle "a design, not a tier of A.34" until 268 says
  otherwise; replace the control plane box with three boxes: registry,
  deployer, identity; decide the bot line to match `security.md` (e).

`flywheel-next-dispatch-physical.svg`: retitle "three placements and the
invoked placement"; add a fourth column "invoked function · the hosted
tiers · clock from the scheduler, socket replaced by the interactions
endpoint, route replaced by the served name with an identity check ·
gives up Discord plain replies"; remove the Vercel strike-out or reword it
"not a placement without a scheduler, a receiver and a served name";
replace the tiers table with 281's five rungs and A.32's two sign-in
kinds; replace "the tailnet is the identity" with "GitHub device flow" and
"SSO through the identity provider" with "Frontegg".

`flywheel-next-dispatch-logical.svg`: "bounded fetch every 30s" becomes
"notify first; the poll is a per-channel backstop (274)"; "TOOL SERVER ·
private network only" gains "or the served name with the identity token
on a hosted host"; the runner table gains the in-process runner's 15-minute
budget on the hosted tiers.

`flywheel-next-boundaries.svg`: "DISPATCH AGENT · the org's, outside every
host" becomes "DISPATCH · a host with no work, presenting the chat (217)";
under triage add "on a shared host only a capture whose content is in hand;
pointed-at raw material is read on a laptop or a pool host (263)".

## Requirement changes

- **217c**: append "On a hosted host the tool server is reached at the
  host's served name and the identity token it verifies is the boundary
  (249); the private network is the boundary on a self-managed host."
- **217i**: replace the last sentence with "A placement that holds no
  socket, no clock and no private route is a placement when a scheduler
  gives it the clock (273), an interactions endpoint gives it the replies
  a socket would carry (277), and a served name with an identity check
  gives it the route (243); it gives up only replies a chat delivers over a
  socket alone."
- **269**: after "It runs a model." add "A tick has a fixed budget the
  placement states, fifteen minutes on the function placement; when the
  budget is short the tick carries triage before it carries a reply." After
  "retaining nothing between invocations (217a)" add "the sandbox is reused
  across instances, so retaining nothing is the tick's own act: scratch
  wiped and the data key dropped before exit."
- **270**: append "Every invoker enqueues on the instance's queue and
  the queue admits one tick of an instance at a time; a request for
  the page is a read under the caller's identity and is not an invoker."
- **271**: replace "with no compute of the machinery's in the
  acknowledgement path: the platform answers the caller" with "with one
  stateless receiver of the machinery's in the acknowledgement path, which
  verifies the caller's signature, answers the platform's liveness check,
  acknowledges within the platform's deadline, and routes by workspace to
  the instance's queue; it holds no key that decrypts and reads no
  queue."
- **New 271a**: "The receiver and the chat application are the two shared
  components of the hosted tiers, and each sees an inbound payload once,
  in transit, and keeps nothing (261)."
- **New 272a**: "The page and the tool server on a hosted tier are served
  at the tier's name by the same function on request, under the caller's
  token (243, 249); a request reads the cache and the shared line and
  writes only through a tool call, which is captured and ticked like any
  other."
- **New 273a**: "An invoked host is alive while its scheduler entry stands
  or its queue holds items; it heartbeats once per tick, its stale window
  is the due time it wrote plus the profile's grace, and 150's takeover is
  raised for it only past that."
- **275**: replace "on a disk encrypted under the instance's key
  (256)" with "on a disk the platform isolates per microVM and destroys at
  terminate under the platform's own encryption; an instance whose tier
  statement must name its own key on that disk binds its pool to a
  placement that takes one (Fargate with a volume under the key). The
  image is built on a pool host or the operator's own machine, never on a
  shared host, and its artifact is stored under the instance's key."
- **276**: append "The flywheel registers the service's issuer as an
  identity provider in its account and allows `sts:TagSession` on the
  role; the token the service mints carries the instance as a principal
  tag. The only standing grants in that cloud account are the
  role's trust and the key's grant to that role; the wake from the
  instance's queue carries the instance's name and nothing else,
  and the tick reads the queue under the role."
- **277**: append "On a function placement Discord free text is the string
  option of the application's slash command; plain replies in a channel
  are read only by a placement holding the gateway. Slack free text arrives
  over the Events API."
- **281 Hobby**: "answered by button or by free text" becomes "answered by
  button, by slash command, and in Slack by free text". **281 Enterprise**:
  "a dispatcher function of its own" becomes "a dispatcher function of its
  own in the service account" or "in its own account", whichever 268
  chooses.
- **268**: either add "Tier 4 is your account and our control plane: the
  binary provisioned into the customer's own cloud account through the role of
  276, the service keeping a registry of names, health and counters and a
  deployer, and nothing else" or leave 268 and mark `physical-c` as not a
  tier.
- **259**: append "The match is written as the role's own policy over
  every key and object of the account, `aws:ResourceTag = aws:PrincipalTag`,
  so no key policy names a role."

## Verified facts

- Lambda MicroVMs went GA on 22 June 2026; sessions preserve state up to
  8 hours; suspend, resume, terminate are API calls; build and execution
  roles, port-scoped tokens; egress to the public internet or a VPC, no VPC
  required; `additionalOsCapabilities: ["ALL"]` is the only elevated value
  and applies inside the VM boundary. Baselines 0.5–8 GB / 0.25–4 vCPU,
  4× burst, disk 8–32 GB tied to size. Regions: us-east-1, us-east-2,
  us-west-2, ap-northeast-1, eu-west-1.
- Lambda functions: 900-second hard timeout; 1,000 default account
  concurrency, raisable.
- SQS FIFO event source: at most one concurrent invocation per message
  group id, capped further by the event source's maximum concurrency,
  whose minimum is 2; cross-account SQS event sources are supported in the
  same region. The poller runs under the function's execution role.
- EventBridge Scheduler: one-time `at(...)` schedules, 60-second invocation
  precision, `ActionAfterCompletion: DELETE` removes a one-time schedule
  after it fires, default quota 10 million schedules per account; there is
  no upsert, `CreateSchedule` then `UpdateSchedule` on conflict.
- KMS ABAC: `aws:PrincipalTag` is in the request context for role sessions
  with session tags; `aws:ResourceTag` is usable in IAM policies only, not
  in key policies.
- STS: for `AssumeRoleWithWebIdentity` session tags come only from the
  token's `https://aws.amazon.com/tags` claim (nested or flattened), and the
  role's trust policy must allow `sts:TagSession`; `AssumeRole` takes tags
  as a parameter.
- S3: SSE-KMS key per object via `x-amz-server-side-encryption-aws-kms-key-id`
  on `PutObject` in general-purpose buckets; directory buckets take one
  key per bucket.
- Discord: an interactions endpoint must answer `PING` with `PONG`, must
  respond within 3 seconds (deferred types 5 and 6 exist), the interaction
  token lives 15 minutes; ordinary channel messages arrive only over the
  gateway websocket.
- Slack: one Request URL per app across all workspaces; message events in
  channels arrive over HTTP; a 2xx within 3 seconds or Slack retries three
  times; `url_verification` on configuration.

## Unverified facts

- MicroVM disk and snapshot encryption under a customer-managed key: not
  found in the security or images pages; treated as absent, not as
  refuted.
- `dockerd` inside a MicroVM: a third-party launch-day report cited in
  `cloud.md`; the documentation confirms the capabilities, not Docker.
- Fargate "without Docker inside" and 120 GB tasks with EBS attach: not
  re-checked.
- Any quota on the number of Lambda event source mappings per function or
  account, which a queue per instance would consume: not found.
- API Gateway's direct SQS integration needing `kms:GenerateDataKey` on the
  queue's key through its integration role: stated from prior knowledge of
  SQS SSE-KMS, not re-read today.
- Bedrock AgentCore session limits and pricing quoted in `cloud.md`: not
  re-checked.
