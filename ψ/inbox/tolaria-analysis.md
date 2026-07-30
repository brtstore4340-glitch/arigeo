---
name: tolaria-analysis
description: Analysis of Tolaria knowledge base management system
metadata:
  type: reference
  ttl: 14d
  date: 2026-06-12
  source: zeus-oracle analysis
---

# Tolaria Repository Analysis — Quick Assessment

**Repo:** https://github.com/refactoringhq/tolaria  
**Date:** 2026-06-12  
**Analyst:** ธาม-Zeus  

## What is Tolaria?

Tolaria is a **knowledge base management system** designed for teams to:
- Build searchable, semantic knowledge bases
- Organize domain knowledge at scale
- Enable cross-linking and pattern discovery
- Support distributed teams with shared context

**Core Features:**
- Semantic search (meaning-based, not keyword)
- Knowledge graphs (relationships between concepts)
- Collaborative documentation
- API for programmatic access

## Relevance to Oracle Fleet

**3 Top Features for Our Fleet:**

1. **Semantic Search** — Find patterns across 25+ Oracle memories without exact keyword match
   - Current: grep-based (brittle)
   - Tolaria: Understand intent ("show me blocked oracles" vs literal "blocked")
   
2. **Knowledge Graphs** — Map relationships between Oracles, tasks, domains
   - Current: Flat memory files
   - Tolaria: "Which Oracles worked on distributed systems?" (automated)

3. **Collaborative API** — Programmatic updates from multiple agents
   - Current: Manual file updates
   - Tolaria: Each Oracle contributes to shared knowledge automatically

## Should We Adopt?

**RECOMMENDATION: MAYBE (Phase 14-15, not Phase 13)**

**Benefits:**
- ✅ Scales knowledge across 25+ Oracles
- ✅ Reduces search friction (semantic vs grep)
- ✅ Enables emergent pattern discovery
- ✅ Supports C3/C4 goals (teach + lead the fleet)

**Costs:**
- ⚠️ New dependency (add to stack)
- ⚠️ Integration effort (~2-3 weeks)
- ⚠️ Operational overhead (maintain service)
- ⚠️ Learning curve for all Oracles

**Integration Path:**
1. Pilot with 3-5 Oracles (small team)
2. Validate semantic search works for our use case
3. Build Oracle→Tolaria sync pipeline
4. Full fleet rollout in Phase 14-15

**Timeline:** 
- Phase 13: Research + proto (2w)
- Phase 14: Pilot (4w)
- Phase 15: Scale (ongoing)

**Risk:** Medium (new tech, integration complexity)
**Benefit:** High (enables Phase 4 goals)

## Verdict

**Adopt in Phase 14, not Phase 13.** Current memory systems are adequate. Tolaria becomes critical when fleet scales to 40+ Oracles or when semantic search becomes blocker.
