#!/usr/bin/env python3
"""Check the statechart model for internal consistency and for its trace to
the requirements.

    uv run --with pyyaml --with jsonschema python3 check.py

- every machine file validates against schema.json
- every `ev` and `do` name exists in atoms.yaml; every effect's proof is an evidence name
- every transition target is a state of the same region; every `enter` names a state of some template
- every `machine:` reference names a machine file (or a `$param`)
- every decision has a kind, group, answers and satisfies; decision kinds are collected for the plan catalogue
- every diagram in ../diagrams/*.svg names states (data-state="machine.state"), decision kinds
  (data-decision) and effects (data-effect) that exist, so a picture cannot drift from the runtime (83)
- every profile marked complete binds every evidence and effect name (140)
- every conformance scenario validates against ../conformance/schema.json and names only real decision
  kinds and effects
- the requirement trace (section 12 of the requirements): every machine, decision kind, effect and
  conformance scenario carries `satisfies: [numbers]`; a number that names no requirement fails; a
  requirement cited nowhere fails. The requirement numbers are read from ../../../requirements.md.
Exit 1 on any finding.

`render.py` beside this file draws the same machine files as statecharts, one SVG per
machine under ../diagrams/machines/ with an index.md, so the operator reviews every
machine as a picture derived from its definition (83); run it after any change here:

    uv run --with pyyaml python3 machines/render.py
"""
import glob, os, re, sys, json
import yaml, jsonschema

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
REQUIREMENTS = os.path.normpath(os.path.join(ROOT, '..', '..', 'requirements.md'))
bad = []

# ---- the requirements: numbered items under ### headings
req_numbers = set()
req_section = {}
if os.path.exists(REQUIREMENTS):
    section = None
    for line in open(REQUIREMENTS):
        h = re.match(r'^### ([ABC]\.\d+) ', line)
        if h:
            section = h.group(1); continue
        if line.startswith('## '):
            section = None; continue
        n = re.match(r'^(\d{1,3})\. ', line)
        if n and section:
            k = int(n.group(1)); req_numbers.add(k); req_section[k] = section
else:
    bad.append(f"requirements not found at {REQUIREMENTS}")
cited = {}   # number -> [where]

def cite(nums, where):
    if not isinstance(nums, list) or not nums:
        bad.append(f"{where}: satisfies missing or empty"); return
    for n in nums:
        if not isinstance(n, int) or n not in req_numbers:
            bad.append(f"{where}: satisfies cites {n!r}, which names no requirement")
        else:
            cited.setdefault(n, []).append(where)

schema = json.load(open(os.path.join(HERE, 'schema.json')))
atoms = yaml.safe_load(open(os.path.join(HERE, 'atoms.yaml')))
evidence = set(atoms['evidence'])
effects = atoms['effects']
cite(atoms.get('satisfies'), 'atoms.yaml')

machines = {}
for path in sorted(glob.glob(os.path.join(HERE, '**', '*.yaml'), recursive=True)):
    if os.path.basename(path) == 'atoms.yaml':
        continue
    m = yaml.safe_load(open(path))
    try:
        jsonschema.validate(m, schema)
    except jsonschema.ValidationError as e:
        bad.append(f"{path}: schema: {e.message} at {'/'.join(map(str, e.path))}")
        continue
    machines[m['machine']] = (path, m)
    cite(m.get('satisfies'), f"machine {m['machine']}")

for name, spec in effects.items():
    if spec.get('proof') and spec['proof'] not in evidence:
        bad.append(f"atoms: effect {name} proves by {spec['proof']} which is not an evidence name")
    cite(spec.get('satisfies'), f"effect {name}")

decisions = {}
def walk_guard(g, where):
    if not isinstance(g, dict):
        bad.append(f"{where}: guard not a mapping: {g!r}"); return
    for k, v in g.items():
        if k in ('all', 'any'):
            for x in v: walk_guard(x, where)
        elif k == 'not':
            walk_guard(v, where)
        elif k == 'ev':
            if v not in evidence: bad.append(f"{where}: unknown evidence {v}")
            for kk in ('eq_ev', 'ne_ev', 'gte_ev', 'lt_ev', 'gt_ev'):
                if kk in g and g[kk] not in evidence: bad.append(f"{where}: unknown evidence {g[kk]}")

def walk_effects(effs, where):
    for e in effs or []:
        if e['do'] not in effects: bad.append(f"{where}: unknown effect {e['do']}")

def walk_region(mname, rname, region, where):
    states = region['states']
    if region['initial'] not in states:
        bad.append(f"{where}: initial {region['initial']} not a state")
    for sname, st in states.items():
        sw = f"{where}.{sname}"
        st = st or {}
        if 'decision' in st:
            d = st['decision']; decisions.setdefault(d['kind'], []).append(f"{mname}.{sname}")
            cite(d.get('satisfies'), f"decision {d['kind']} at {mname}.{sname}")
        walk_effects(st.get('entry'), sw); walk_effects(st.get('exit'), sw)
        mref = st.get('machine')
        if mref and not mref.startswith('$') and mref not in machines:
            bad.append(f"{sw}: submachine {mref} has no definition")
        for rn, rg in (st.get('regions') or {}).items():
            walk_region(mname, rn, rg, f"{sw}[{rn}]")
        for i, t in enumerate(st.get('transitions') or []):
            tw = f"{sw}.transitions[{i}]"
            walk_guard(t['when'], tw)
            walk_effects(t.get('effects'), tw)
            if t['to'] not in states:
                bad.append(f"{tw}: target {t['to']} not a state of region {rname}")

for mname, (path, m) in machines.items():
    for rname, region in m['regions'].items():
        walk_region(mname, rname, region, f"{mname}[{rname}]")

# enter targets and qualified finals: the named state must exist in some template's regions
template_states = {}
for mname, (path, m) in machines.items():
    def collect(region):
        for s, st in region['states'].items():
            template_states.setdefault(mname, set()).add(s)
            for rg in (st or {}).get('regions', {}).values(): collect(rg)
    for region in m['regions'].values(): collect(region)
all_states = set().union(*template_states.values())
def enters(obj, where):
    for k, v in (obj.get('enter') or {}).items():
        if v not in all_states: bad.append(f"{where}: enter {k}: {v} names no state")
def finals(g, where):
    if not isinstance(g, dict): return
    for k, v in g.items():
        if k in ('all', 'any'):
            for x in v: finals(x, where)
        elif k == 'not': finals(v, where)
        elif k == 'final':
            _, _, sn = v.rpartition('.')
            if sn not in all_states: bad.append(f"{where}: final {v} names no state")
for mname, (path, m) in machines.items():
    def walk(region, where):
        for s, st in region['states'].items():
            st = st or {}
            enters(st, f"{where}.{s}")
            for i, t in enumerate(st.get('transitions') or []):
                enters(t, f"{where}.{s}.transitions[{i}]"); finals(t['when'], f"{where}.{s}.transitions[{i}]")
            for rg in st.get('regions', {}).values(): walk(rg, f"{where}.{s}")
    for region in m['regions'].values(): walk(region, mname)

# diagrams must not drift from the definitions (83)
for svg in sorted(glob.glob(os.path.join(ROOT, 'diagrams', '*.svg'))):
    s = open(svg).read()
    for ref in re.findall(r'data-state="([^"]+)"', s):
        mn, _, sn = ref.partition('.')
        if mn not in template_states or sn not in template_states[mn]:
            bad.append(f"{os.path.basename(svg)}: data-state {ref} names no state")
    for ref in re.findall(r'data-decision="([^"]+)"', s):
        if ref not in decisions: bad.append(f"{os.path.basename(svg)}: data-decision {ref} names no decision kind")
    for ref in re.findall(r'data-effect="([^"]+)"', s):
        if ref not in effects: bad.append(f"{os.path.basename(svg)}: data-effect {ref} names no effect")
    for ref in re.findall(r'data-row="([^"]+)"', s):
        bad.append(f"{os.path.basename(svg)}: data-row {ref} is the old vocabulary; use data-decision")

# profile bindings must be complete (137)
for prof in sorted(glob.glob(os.path.join(ROOT, 'profiles', '*.yaml'))):
    p = yaml.safe_load(open(prof))
    if p.get('format') != 'flywheel-profile/1':
        continue
    bound_ev = set(p.get('evidence', {}))
    bound_fx = set(p.get('effects', {}))
    inh = p.get("inherits") or []
    for b in ([inh] if isinstance(inh, str) else inh):
        base = yaml.safe_load(open(os.path.join(ROOT, "profiles", b + ".yaml")))
        bound_ev |= set(base.get("evidence", {})); bound_fx |= set(base.get("effects", {}))
    for e in sorted(bound_ev - evidence):
        bad.append(f"{os.path.basename(prof)}: binds evidence {e}, which no atom names")
    for f in sorted(bound_fx - set(effects)):
        bad.append(f"{os.path.basename(prof)}: binds effect {f}, which no atom names")
    if p.get('complete', True):
        for e in sorted(evidence - bound_ev):
            bad.append(f"{os.path.basename(prof)}: evidence {e} not bound")
        for f in sorted(set(effects) - bound_fx):
            bad.append(f"{os.path.basename(prof)}: effect {f} not bound")

# conformance scenarios must validate, name only real decisions and effects, and cite requirements
sschema_path = os.path.join(ROOT, 'conformance', 'schema.json')
nscen = 0
if os.path.exists(sschema_path):
    sschema = json.load(open(sschema_path))
    for path in sorted(glob.glob(os.path.join(ROOT, 'conformance', '**', '*.yaml'), recursive=True)):
        if '/lamp/' in path:
            continue
        rel = os.path.relpath(path, ROOT)
        sc = yaml.safe_load(open(path))
        try:
            jsonschema.validate(sc, sschema)
        except jsonschema.ValidationError as e:
            bad.append(f"{rel}: scenario schema: {e.message} at {'/'.join(map(str, e.path))}"); continue
        nscen += 1
        cite(sc.get('satisfies'), f"scenario {sc['scenario']}")
        if sc.get('machines'):
            continue  # a toy machine set; not checked against the flywheel's decisions
        then = sc.get('then', {})
        for r in then.get('decisions', []) or []:
            for k in (r.get('present') or []) + (r.get('absent') or []):
                if k not in decisions: bad.append(f"{rel}: decision kind {k} does not exist")
        for e in then.get('effects', []) or []:
            if e['do'] not in effects: bad.append(f"{rel}: effect {e['do']} does not exist")
        for step in sc.get('when', []):
            w = step.get('response')
            if w and w.get('decision') and w['decision'].rsplit('/', 1)[-1] not in decisions:
                bad.append(f"{rel}: response decision kind {w['decision'].rsplit('/', 1)[-1]} does not exist")

# the trace: every requirement cited somewhere
uncited = sorted(req_numbers - set(cited))
for n in uncited:
    bad.append(f"requirement {n} ({req_section[n]}) is cited nowhere")

print(f"scenarios: {nscen} · requirements: {len(req_numbers)} · cited: {len(cited)} · uncited: {len(uncited)}")
print(f"machines: {len(machines)} · evidence: {len(evidence)} · effects: {len(effects)} · decision kinds: {len(decisions)}")
for k, v in sorted(decisions.items()): print(f"  decision {k}: {', '.join(v)}")
for b in bad: print("FAIL", b)
sys.exit(1 if bad else 0)
