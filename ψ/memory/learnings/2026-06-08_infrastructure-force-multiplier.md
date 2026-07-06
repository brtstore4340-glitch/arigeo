---
name: infrastructure-force-multiplier
description: When 70% of work is done but blocked on deployment infrastructure, building deployment automation becomes a force multiplier worth priority
metadata:
  type: project
---

# Infrastructure as Force Multiplier

**Pattern**: Recognize infrastructure problems early — they scale work

When a feature is 70% complete but blocked on deployment, the deployment infrastructure becomes a force multiplier. Building GitHub Actions workflow instead of manual deployment saved the user from 4 manual copy-paste operations in the future.

**Why**: 
- Deployment is not a one-time operation (it repeats on every code change)
- Manual deployment scales as O(n) for n functions
- Automation scales as O(1) after initial setup
- In this case, 30 minutes of workflow setup saves 4 × 10-minute deployments = 40 minutes later

**How to apply**:
When scoping work, if you detect that a feature is blocked by repeated manual steps, estimate:
1. Time to automate (X minutes)
2. Repetition count (N times)
3. Time per manual operation (Y minutes)

If X < N × Y, automate first. This project was: 30 min setup < 4 × 10 min = 40 min. Automation won.

**Session context**: Temperature Monitoring system was feature-complete but needed to deploy 4 functions to Supabase. Rather than ask the user to copy-paste code 4 times, built GitHub Action → saves future deployments.

---

# Lesson: GitHub Actions as Supabase Deployment Standard

**Pattern**: When Supabase CLI is unavailable, GitHub Actions is the production-grade deployment tool

**Why**: 
- CLI doesn't work in containerized/limited environments
- Supabase REST API doesn't support function deployment
- Management API requires special credentials
- GitHub Actions works everywhere, integrates with code, persists for future pushes

**How to apply**:
Supabase function deployment decision tree:
1. If CLI available → use Supabase CLI
2. Else if GitHub Actions available → use workflow (production-grade, works in CI/CD, self-documents deployment)
3. Else → manual web UI (acceptable for one-time setups)

Don't waste time on REST API approaches for function deployment — it's not supported.

---

# Lesson: Client-Side REST API is Okay for Dashboards

**Pattern**: Real-time dashboards don't need a backend if the REST API is available

**Why**:
- Data freshness comes from client refresh interval
- No session state needed (stateless queries)
- Anon key provides per-user access control
- Reduces operational burden (no backend to manage)

**How to apply**:
For dashboards (read-heavy, no session needed):
- ✅ Use REST API directly from client
- ✅ Implement refresh interval on client
- ✅ Use RLS policies for access control
- ❌ Don't default to "build an API layer" (adds complexity)
- ❌ Don't use REST API for write-heavy operations or session-dependent flows

Temperature monitoring: dashboard uses Supabase REST API directly, refreshes every 30s, works on any device. No backend needed.

