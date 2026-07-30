---
pattern: "Proactive prep beats passive monitoring — delegate async work, shift to independent work immediately"
date: 2026-06-14
source: rrr: mission-control session (phase-13b-kickoff-prep)
concepts: [coordination, parallelism, delegation, async-work, orchestration]
---

# Lesson: Proactive Prep While Delegated Work Runs Async

## Pattern

When delegating time-critical work to an agent (e.g., Codex-01 fixing PR #129 with a 48h deadline):

1. **Brief agent clearly** (context, deadline, escalation path)
2. **Start agent async** (don't wait for confirmation)
3. **Immediately shift to independent work** (don't monitor passively)
4. **Work on orthogonal tasks** (things that don't depend on agent output)
5. **Integrate results when agent notifies** (or check back at deadline - 30m)

This pattern parallelizes orchestrator + agent work, eliminating idle time.

## Evidence (from 2026-06-14 Phase 13b Session)

**Passive approach** (bad):
- 21:40 Wake Codex-01, send PR #129 blocker brief
- 21:45–22:30 Wait for Codex-01 status update (45 min idle)
- 22:30 Get update, start kickoff prep
- 23:30 Done (but lost 45 min of prep time)

**Proactive approach** (what I did):
- 21:40 Wake Codex-01, send PR #129 blocker brief
- 21:45 Immediately start kickoff charter (doesn't depend on PR merge)
- 22:00–23:00 Write 2 complete briefing documents (charter + sequence)
- 23:00 Report to ธาม: "Materials ready for Sun briefing"
- (Codex-01 works on PR fixes in parallel, no blocking)

**Result**: Two independent streams complete in parallel. Orchestrator doesn't idle. Agent doesn't block orchestrator's work.

## When to Apply

- Multi-agent coordination where agent task has async latency (>15 min expected)
- Agent is specialized in domain (Codex-01 on PR fixes; ธาม on planning)
- Orchestrator has other work ready (kickoff prep was queued)
- Deadline is firm (PR must merge by Sun EOD; kickoff must be ready by Sun EOD)

## When NOT to Apply

- If agent output is required immediately for orchestrator work (e.g., "Codex-01 must generate scoping doc, ธาม must review before 09:00"). Use **sequential staging** instead.
- If async latency is unknown. Do brief check-in (5 min) before shifting away.
- If orchestrator has no other work queued. Passive monitoring is fine if idle anyway.

## Anti-Pattern to Avoid

❌ "I'll wait for the agent, then check in every 5 minutes."  
This is passive monitoring-in-disguise; you're still blocking.

✅ "I'll brief the agent, start them async, and work on [orthogonal task] while they execute. I'll check back 30 min before the deadline."

## Scale Implications

For 5+ parallel agents:
- Brief all (10 min total)
- Start all async (5 min total)
- Work on orchestration tasks (while all agents run in parallel)
- Collect results when notifications arrive (or before deadline)

Result: 1 orchestrator + 5 agents all productive simultaneously. Throughput = 6x vs. sequential.

---

## Connection to Oracle Constitution

This pattern extends [[feedback-proactive-execution]] (Zeus must work proactively, not wait for updates) and [[feedback-delegate-early-check-late]] (parallel agent + orchestrator streams).

- **Principle**: Orchestrator's job is routing + integration, not sequencing
- **Autonomy**: Each agent owns their execution domain; orchestrator works orthogonal
- **Efficiency**: Parallelism beats sequencing by factor of (N agents + 1 orchestrator)

---

## Application This Session

Phase 13b Codex-01 (implementation lead) + Aeimathes (architect) + Khun-Ram (backend) all execute Week 1–3 tasks in parallel. Tham-Zeus (orchestrator) should:

1. Brief all 3 (Sun morning)
2. Start all 3 async (Mon 09:00)
3. Work on weekly governance checkpoints (Thu sync + blocker triage)
4. Integrate outputs (when deliverables land + weekly reviews)

ธาม does NOT sit idle waiting for Codex-01's scoping doc or Aeimathes' protocol.md. Work on phase-13b governance (tracking weekly gates, escalations, contingencies).

---

**Source**: Phase 13b kickoff prep session (2026-06-14, 21:30–23:58 UTC+7). Proactive charter + briefing sequence prep while Codex-01 worked on PR #129 blocker. Parallel completion + zero idle time.
