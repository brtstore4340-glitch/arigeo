---
pattern: "Delegate background work early, start own work immediately, integrate results when notifications arrive"
date: 2026-06-14
source: "rrr: mission-control session 03-tham"
concepts: [coordination, parallelism, agent-orchestration, latency-reduction]
---

# Lesson: Delegate Early, Check Late (Agent Coordination Pattern)

## Pattern

When coordinating multiple oracle agents on parallel decision tasks:

1. **Brief agents clearly** (provide template, reference materials, scope boundary)
2. **Spawn agents as background tasks** (don't wait for them to start)
3. **Start your own work immediately** (in this case: writing retrospective, gathering context)
4. **Integrate agent outputs when notifications arrive** (merge timestamps, seal documents)

This pattern reduces session latency by overlapping orchestrator work with agent execution.

## Evidence (from 2026-06-14 Hermes session)

**Sequential approach** (bad):
- 17:35 Spawn Aeimathes agent
- 18:22 Aeimathes completes (47 min latency)
- 18:22 Start writing retro + spawn Tham agent
- 19:35 Tham completes (73 min latency)
- 19:56 Write commit message, finalize

**Parallel approach** (what I did):
- 17:35 Spawn Aeimathes agent (background)
- 17:36 Spawn Tham agent (background)
- 17:37 Start writing retro + gathering git context while agents run
- 18:22 Aeimathes notification arrives → integrate into retro (already drafted)
- 19:35 Tham notification arrives → finalize retro + seal documents
- 19:56 Ready for commit

**Time saved**: ~40 minutes of orchestrator idle time (17:37–18:22, 18:22–19:35 could have been retro-writing + review)

## When to Apply

- Multi-oracle decision delivery (like Hermes Phase 1: Khun-Ram + Aeimathes + Tham)
- Research tasks where multiple oracles explore different angles in parallel
- Prototype scoping where multiple streams (design, scope, risk) need synchronization
- Any workflow where agent execution is independent of orchestrator analysis

## When NOT to Apply

- If agent outputs are tightly coupled (e.g., "oracle B's decision depends on oracle A's output"), use **sequential staging** instead of pure parallelism
- If notification timing is critical (e.g., real-time monitoring), use **polling** instead

## Anti-Pattern to Avoid

❌ "I'll wait for the agent to finish, then I'll review it, then I'll write my summary."

This is orchestrator-idling. It works for single agents, but scales poorly with team size.

✅ "I'll brief the agent, start it background, and write my analysis in parallel. When it lands, I'll merge."

---

## Connection to Oracle Constitution

This pattern extends [[oracle-brain-principles]]:

- **Principle 3 (External Brain)**: Orchestrator (ธาม) is not the executor; delegate decision-writing to specialists (Aeimathes research, Tham synthesis)
- **Principle 5 (Form and Formless)**: Formless work (agent processes) happen in parallel; form emerges (decisions) only when consolidated
- **Autonomy**: Each oracle operates independently; orchestrator's job is routing + integration, not sequencing

---

## Next Application

Phase 13B implementation sprint (starting Mon Jun 17): Codex-01 (implementation lead) + Aeimathes (arch review) + Khun-Ram (backend) + Hermes (data pipeline) all working on sprint items. Orchestrator (ธาม-Zeus) should brief all 4, spawn in parallel, write governance checkpoint while they execute, integrate weekly (not daily).

---

**Source**: Hermes Fleet Memory Phase 1 async decision delivery (2026-06-14, agents a5b42fd05b6d3901d + a2609abea24e8167f, latency reduction ~40min)
