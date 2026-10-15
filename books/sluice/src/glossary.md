# Glossary

The words of the design, each defined once. The statement's vocabulary
section is the binding copy. This page adds the words the many hosts
design brings. Beside each is the word a user sees in `sluice`'s own
output and pages, where the two differ.

| design word | meaning | what a user sees |
|---|---|---|
| **branch** | a git branch that lands work: a repository's shared branch, or a bolt's branch off it | branch |
| **place** | a working copy prepared for one session off one branch, or made by sluice for one candidate | checkout |
| **head** | the revision a place holds when its session submits | head |
| **submission** | one head offered to one branch, with what it must land after, its priority and who submitted it | submission |
| **entry** | a submission as sluice holds it, with its state | submission |
| **after** | the entries a submission names as having to land before it | after |
| **work** | an entry's commits, from where its head left the branch to the head | commits |
| **candidate** | the branch's current revision extended, in order, by an entry and every entry ahead of it: the revision that entry would land as | combination |
| **chain** | the candidates of one branch, each extending the one before | queue |
| **window** | how many candidates of a branch's chain are under test at once | parallel |
| **deepest first** | testing only the longest candidate of a chain, and the shorter ones only when it fails | batch |
| **conflict** | a candidate that cannot be formed because its entry and the candidate before it change the same content incompatibly | conflict |
| **check** | a task run to judge a revision, ending in a pass or a fail | test, task |
| **gate** | for a branch, the checks it requires, the executors it trusts, and how a flaky key reads | the branch's rules |
| **key** | the identity of one check over the inputs it reads, the system it ran on among them | hash |
| **system** | the processor architecture and operating system a run executes on, named as the toolchain names it | system |
| **verdict** | a gate's reading of a candidate: for each required check exactly one of passed, failed, missing or flaky | result |
| **culprit** | the one entry a failed candidate is attributed to | the blamed submission |
| **landing** | the branch moving to a candidate that passed | landing |
| **executor** | what ran a check, with its identity and its host; **confined** when nothing of any session could reach the run or its records, **open** otherwise | executor |
| **host** | a machine on which sessions, sluice or executors run | host |
| **preview** | a place sluice makes at a revision a branch has landed, in which the policy's preview command has brought up what a person opens, held until its caller asks for its release | preview |
| **instance** | one running sluice on one host | sluice |
| **lead** | the instance advancing a branch | the host running the queue |
| **lease** | how long an instance keeps a branch without writing its records | lease |
| **claim** | an instance's recorded hold on a candidate's checks, from taking them to reporting them | a test run taken by a host |
| **records** | everything sluice holds about a branch: its entries, its log of runs and verdicts, and a version | state |
| **round** | one pass of sluice's work on a branch: read the records, start runs with room, read finished runs, blame, land, write | round |
| **driver** | what submits work to sluice and carries the outcome back: worktrunk, crew, flywheel, a remote submit, a pull request | `wt submit` |
| **profile** | one way a contract of Part B is satisfied, as Part C describes | profile |
| **seam** | one of the five contracts of Part B through which the core reaches everything that is not git | seam |
