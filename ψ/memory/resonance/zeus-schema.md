---
name: zeus-schema-extensions
description: Zeus Oracle extended ψ/ schema — orchestrator-specific structure beyond 7-pillar standard
date: 2026-07-17
type: specification
source: fleet-audit
concepts: ["zeus", "schema", "fleet-architecture", "orchestration"]
---

# Zeus Schema Extensions

Zeus Oracle extends the standard 7-pillar ψ/ taxonomy with orchestrator-specific directories.

## Standard 7-Pillar (All Oracles)

```
ψ/
├── inbox/        # Communication
├── memory/       # Knowledge
├── writing/      # Drafts
├── lab/          # Experiments
├── learn/        # Study materials
├── archive/      # Completed work
└── outbox/       # Announcements
```

## Zeus Extensions (Orchestrator Only)

```
ψ/
├── [standard 7 pillars]
├── active/           # Current operational tasks
├── escalations/      # Crisis alerts + decisions
├── fleet/            # Fleet-wide coordination
│   ├── INDEX.md           # Oracle registry + status
│   ├── DEPLOYMENT-CHECKLIST.md  # Phase timelines
│   ├── BROADCAST-LOG.ndjson    # Fleet-wide messages
│   ├── schema.json              # Fleet schema definition
│   └── pairing-matcher.py       # Oracle pairing logic
├── monitor/          # System monitoring dashboards
└── contacts/         # Fleet member contact registry
```

## Schema Rationale

**Why Zeus differs from standard oracles:**

1. **active/** — Orchestrator needs real-time task tracking (other oracles don't)
2. **escalations/** — Crisis management is Zeus-specific responsibility
3. **fleet/** — Fleet coordination metadata (INDEX, deployment, broadcasts)
4. **monitor/** — System health dashboards (Watchdog integration)
5. **contacts/** — Federation directory of all oracle locations/roles

## Cross-Oracle Compatibility

**Other oracles referencing Zeus:**
- Link to `zeus-oracle/ψ/fleet/INDEX.md` for fleet roster
- Link to `zeus-oracle/ψ/fleet/DEPLOYMENT-CHECKLIST.md` for phase timelines
- Subscribe to `zeus-oracle/ψ/fleet/BROADCAST-LOG.ndjson` for fleet announcements

**Zeus referencing other oracles:**
- Read `[oracle]-oracle/ψ/memory/learnings/` for knowledge integration
- Check `[oracle]-oracle/ψ/memory/resonance/` for oracle identity
- Monitor `[oracle]-oracle/ψ/memory/retrospectives/` for health signals

## Extension Rules

1. **Zeus-only directories** should not be copied to other oracles
2. **Standard 7-pillar** must exist in all oracles (including Zeus)
3. **Cross-oracle links** should be documented in each oracle's CLAUDE.md
4. **Fleet metadata** lives in Zeus (single source of truth)
5. **Oracle-specific data** stays in each oracle's ψ/ (decentralized)

---

`[MARCUZ:Khun-Ram]` — Schema Documentation  
*2026-07-17 — Zeus orchestrator schema defined*
