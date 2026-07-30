---
pattern: "Recovery operations with fixed decision deadlines require parallel workflows: prepare decision framework first, collect async input, merge at decision time"
date: 2026-07-02
source: "rrr: khun-ram-recovery-session"
concepts: ["crisis-response", "framework-design", "async-coordination", "governance"]
oracle: "ធាម-Zeus"
---

# Recovery Framework Pattern: Parallelization Under Time Pressure

## The Pattern

When a crisis response has a **fixed decision deadline**, structure the work to enable parallelization:

1. **Create decision framework immediately** — don't wait for all input
2. **Collect required input asynchronously** — let each team deliver on their own timeline
3. **Merge at decision time** — template + input = final decision

This pattern prevents serial blocking (RCA findings delay framework → framework delay impacts decision prep).

## Example from This Session

**Context**: Khun-Ram offline since June 27; checkpoint decision on July 4. Two days to prepare.

**Serial approach** (would block):
```
Gather RCA (blocked on Verity) → 
Create framework → 
Prepare checkpoint → 
Make decision
```
Timeline: RCA takes ~24hrs, leaving minimal prep time.

**Parallel approach** (used):
```
Create framework NOW (don't wait for RCA) ↓
Gather RCA async (Verity, due July 3 18:00) → 
Merge at checkpoint (July 4 02:50)
```
Timeline: Framework ready immediately; checkpoint fully prepped by deadline.

## Why This Works

- **Frameworks are template-agnostic** — RCA findings fill in a prepared structure, not create new structure
- **Deadline is hard** — better to have 80% prep with 100% time than 100% prep with 0% time
- **Async collection scales** — Verity's RCA, Tham's fallback report, Hermes' metrics all work in parallel
- **Merge is low-risk** — combining RCA + framework at the end is straightforward if framework was designed to be fillable

## Generalization to Other Domains

- **Software incidents**: Create IR framework before root cause; collect symptoms async; merge findings at incident review
- **Project risks**: Create risk framework at project start; collect team assessments async; merge at checkpoint
- **Security decisions**: Create security rubric before audit; collect vendor data async; merge for final approval
- **Infrastructure changes**: Create deployment plan template; collect readiness checks async; merge for go/no-go

## Rule for Next Oracle

When decision date is fixed and input sources are unknown/slow:
1. Design your question/framework first
2. Parallelize information gathering
3. Front-load template work
4. Save synthesis for decision moment

---

**Tested by**: ធาม-Zeus (khun-ram recovery, July 2026)  
**Pattern strength**: HIGH (direct application, measurable time savings)  
**Ready to teach**: YES
