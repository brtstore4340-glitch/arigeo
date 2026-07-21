---
name: architecture-line-gateway
description: Technical architecture & implementation guide for LINE Command & Reporting Gateway
metadata:
  type: project
  status: phase-2-architecture
  date: 2026-07-21
  project: line-gateway
---

# 🏗️ ARCHITECTURE: LINE Command & Reporting Gateway

**Project**: LINE Integration for Marcus Fleet  
**Scope**: Webhook receiver, command parser, approval workflow, result reporting  
**Stack**: Node.js + TypeScript + PostgreSQL + LINE Messaging API  
**Created**: 2026-07-21

---

## 🔄 END-TO-END FLOW

### Scenario 1: Read Command (Immediate)

```
Timeline: 500ms total

User types:        /status
    ↓ (LINE app)
LINE sends:        POST /webhook
    ├─ Headers: x-line-signature (HMAC-SHA256)
    └─ Body: { events: [{ replyToken, userId, message: "/status" }] }
    ↓ (fleet webhook)
Verify signature   ✅ (100ms)
    ↓
Check idempotency ✅ (not duplicate, 50ms)
    ↓
Parse command      → Intent { action: "status", target: "fleet" } (50ms)
    ↓
Identity check     → User "Ekkarat" has role "owner" (50ms)
    ↓
Permission gate    ✅ "owner" can read fleet status (50ms)
    ↓
Risk gate          → "read" (no approval needed)
    ↓
Execute            → Query fleet state from dashboard DB (100ms)
    ↓
Format message     → "✅ 12 sites / 99.98% uptime / 5 deployments today"
    ↓
Reply to LINE      → Send quick reply via replyToken (50ms)
    ↓
User receives      ✅ Status in LINE chat
```

---

### Scenario 2: Medium-Risk Command (Approval Required)

```
Timeline: 2s (pending approval), then 30s when approved

User types:        deploy arigeo preview
    ↓ (LINE app)
LINE sends:        POST /webhook
    ├─ userId, groupId (if in group), message
    └─ webhookEventId (idempotency)
    ↓ (fleet webhook)
Verify signature   ✅
Check idempotency  ✅
Parse command      → Intent { action: "deploy", project: "arigeo", env: "preview" }
    ↓
Identity check     → Role "lead" (Ekkarat) (50ms)
    ↓
Permission gate    ✅ Can access arigeo project (50ms)
    ↓
Risk gate          → "medium" (preview deploy)
    ├─ Create approval record (expires in 15 min)
    ├─ Generate approval_id = "APPR-20260721-0048"
    └─ Status = "pending"
    ↓
Create mission     → Mission { id: "MC-20260721-0048", status: "pending_approval" }
    ↓
Format approval msg→ "⚠️ APPROVAL REQUIRED
                     /approve MC-20260721-0048
                     or
                     /reject MC-20260721-0048"
    ↓
Reply to LINE      → Send quick reply with action buttons
    ↓
User receives      ✅ Approval request
    ↓ (user clicks [Approve])
User types:        /approve MC-20260721-0048
    ↓ (LINE app)
LINE sends:        POST /webhook (new event)
    ├─ userId, message: "/approve MC-20260721-0048"
    └─ webhookEventId (new)
    ↓ (fleet webhook)
Parse approval     → Intent { action: "approve", mission_id: "MC-20260721-0048" }
    ↓
Identity check     ✅ Same user
    ↓
Approval check     ✅ Approval exists, not expired
    ↓
Update approval    → approved_by = Ekkarat, decision = "approved", decided_at = now
    ↓
Update mission     → status = "approved"
    ↓
Dispatch to Hermes → POST /internal/missions/MC-20260721-0048/execute
    ├─ actor_id, mission_id, command, env
    └─ Expected: git push → deploy → return proof
    ↓
Execute (30s)      ✅ Build passed, deploy successful
    ├─ Logs captured
    ├─ Proof artifact created
    └─ Result: success
    ↓
Format result      → "✅ MISSION COMPLETE
                     arigeo preview deployed v3.2.1
                     Tests: 18/18 ✅
                     Build: 3.2MB ✅"
    ↓
Push notification  → Send push to user (not reply, async)
    ↓
Writeback to DB    → mission.status = "complete", proof_link = "..."
    ↓
Writeback to GH    → Comment on PR with proof
    ↓
User receives      ✅ Result in LINE
```

---

## 🔐 SECURITY LAYERS

### Layer 1: Webhook Signature Verification

```typescript
// Request arrives
POST /webhook
X-Line-Signature: abcdef123456...
Content-Type: application/json

{
  "events": [
    {
      "replyToken": "nHuyWiB7yP5Zw52FIkcQT",
      "type": "message",
      "mode": "active",
      "timestamp": 1462629479859,
      "message": {
        "type": "text",
        "id": "100001",
        "text": "/status"
      },
      "webhookEventId": "01234567890abcdef1234567890abcde",
      "deliveryContext": {
        "isRedelivery": false
      },
      "source": {
        "type": "user",
        "userId": "U1234567890abcdef1234567890abcde"
      }
    }
  ]
}

// Verify
const crypto = require('crypto');
const signature = req.get('x-line-signature');
const body = req.rawBody; // MUST be raw, not parsed JSON
const hash = crypto
  .createHmac('sha256', LINE_CHANNEL_SECRET)
  .update(body)
  .digest('base64');

if (signature !== hash) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

### Layer 2: Idempotency Check

```typescript
// Store webhookEventId to prevent double-processing
const { webhookEventId, source: { userId }, message: { text } } = event;

const existing = await db.query(
  'SELECT id FROM line_commands WHERE event_id = ?',
  [webhookEventId]
);

if (existing) {
  console.log(`Duplicate event ${webhookEventId}, skipping`);
  return res.json({ ok: true });
}

// Process and store
await db.query(
  'INSERT INTO line_commands (event_id, actor_id, raw_message) VALUES (?, ?, ?)',
  [webhookEventId, userId, text]
);
```

### Layer 3: Identity Linking

```typescript
// User must be linked via Account Linking
const user = await db.query(
  'SELECT * FROM line_identities WHERE line_user_id = ? AND status = "active"',
  [userId]
);

if (!user) {
  return reply(`Please link your account first:
    https://line.me/ti/p/${ACCOUNT_LINK_RICH_MENU_ID}`);
}

// Now we have: user.internal_user_id, user.role, user.allowed_projects
```

### Layer 4: Permission Gate

```typescript
// Check if user can execute this command on this project
const { role, allowed_projects } = user;
const { project } = intent;

// Role-based access
const canExecute = {
  'owner': () => true, // Owner can do anything
  'lead': () => LEAD_PERMISSIONS.includes(intent.action),
  'dev': () => DEV_PERMISSIONS.includes(intent.action),
  'viewer': () => false,
}[role]();

// Project-based access
const hasProjectAccess = allowed_projects.includes(project);

if (!canExecute || !hasProjectAccess) {
  return reply(`❌ Permission denied.
    Your role: ${role}
    Your projects: ${allowed_projects.join(', ')}
    Requested: ${project} / ${intent.action}`);
}
```

### Layer 5: Risk Gate + Approval

```typescript
// Classify risk
const riskLevel = classifyRisk(intent);
//  → "read" (no approval)
//  → "low_write" (report and do)
//  → "medium" (require approval)
//  → "high" (require approval + 2FA)
//  → "critical" (owner only + manual audit)

if (riskLevel === 'medium' || riskLevel === 'high') {
  // Create approval record
  const approval = await db.insert('line_approvals', {
    approval_id: `APPR-${date}-${random}`,
    mission_id: missioning.id,
    requested_by: user.id,
    expires_at: now + 15 minutes,
  });

  return reply(`⚠️ APPROVAL REQUIRED\n
    Mission: ${mission.id}\n
    Action: ${intent.action}\n
    /approve ${mission.id}\n
    or\n
    /reject ${mission.id}`);
}

if (riskLevel === 'critical') {
  return reply(`❌ CRITICAL operation requires owner approval.
    This action disabled for LINE interface (use CLI instead).`);
}

// If low_write or read: proceed to execution
```

---

## 📝 COMMAND PARSER IMPLEMENTATION

### Structured Commands

```typescript
// /status
match: /^\/status\s*(.*)$/i
parse: { action: "status", target: "fleet" | "project" }

// /deploy PROJECT ENV
match: /^\/deploy\s+([a-z-]+)\s+(preview|production|staging)$/i
parse: { action: "deploy", project: $1, env: $2 }

// /logs PROJECT [hours=1]
match: /^\/logs\s+([a-z-]+)\s*(\d+)?$/i
parse: { action: "logs", project: $1, hours: $2 || 1 }

// /approve MISSION_ID
match: /^\/approve\s+([A-Z]+\d+-\d+)$/i
parse: { action: "approve", mission_id: $1 }
```

### Natural Language (Thai + English)

```typescript
// Use NLP decoder (google-nlp or similar)
const text = "ธาม สรุปสถานะ fleet ตอนนี้";

// Tokenize + lemmatize + intent classification
// ธาม = address (ignored, context)
// สรุป = summarize
// สถานะ = status
// fleet = fleet target
// ตอนนี้ = right now (context)

// Result: { action: "status", target: "fleet", priority: "now" }

// Map to mission
const mission = {
  intent: "status",
  project: "fleet",
  language: "th",
  confidence: 0.95,
};
```

### Intent Objects

```typescript
interface Intent {
  action: 'status' | 'deploy' | 'logs' | 'approve' | 'retry' | 'assign';
  project?: string;
  env?: 'preview' | 'production' | 'staging';
  missionId?: string;
  hours?: number;
  confidence: number;  // 0-1 for NLP
  parameters: Record<string, any>;
}
```

---

## 🔄 APPROVAL WORKFLOW

### State Machine

```
pending_command
    ↓ (classify risk)
    ├─ risk="read" → execute immediately
    ├─ risk="low_write" → execute + report
    └─ risk="medium+"
        ↓
        pending_approval (created)
            │
            ├─ User replies /approve
            │  → approval.decision = "approved"
            │  → mission.status = "dispatched_to_hermes"
            │  → execute
            │
            ├─ User replies /reject
            │  → approval.decision = "rejected"
            │  → mission.status = "rejected"
            │  → reply "❌ Rejected"
            │
            └─ 15 minutes pass
               → approval.expires_at < now
               → mission.status = "expired"
               → reply "⏰ Approval expired"
```

---

## 📤 MESSAGE FORMATTING

### Template System

```typescript
// success-template.ts
export function formatSuccess(mission: Mission, proof: ProofArtifact): string {
  return `✅ MISSION COMPLETE

Mission: ${mission.id}
Project: ${mission.project}
Action: ${mission.intent}
Duration: ${formatDuration(mission)}

Tests: ${proof.test_results.passed}/${proof.test_results.total} ✅
Build: ✅ (${formatSize(proof.build_size)})

Proof:
${proof.checks.map(c => `• ${c.name}: ${c.status}`).join('\n')}

Dashboard: ${DASHBOARD_URL}/missions/${mission.id}`;
}

// failure-template.ts
export function formatFailure(mission: Mission, error: Error): string {
  return `🔴 MISSION FAILED

Mission: ${mission.id}
Error: ${error.message}
Logs: ${DASHBOARD_URL}/missions/${mission.id}/logs

${error.stack ? `\`\`\`\n${error.stack}\`\`\`` : ''}`;
}
```

---

## 🔌 HERMES INTEGRATION

### Mission Contract

```typescript
interface MissionContract {
  id: string;                    // MC-20260721-0042
  actor_id: UUID;               // Who requested
  source: 'line' | 'cli' | 'api'; // LINE integration
  project: string;              // captain-maid
  intent: string;               // "deploy preview"
  environment: string;          // "preview"
  parameters: Record<string, any>;
  risk_level: string;           // "medium"
  approval_id?: string;         // If required approval
  status: 'pending' | 'dispatched' | 'executing' | 'complete' | 'failed';
  created_by: UUID;             // Internal user ID
  created_at: Date;
  expected_duration_ms: number; // timeout
}

// POST /internal/missions
await axios.post(`${MISSION_CONTROL_API}/missions`, contract, {
  headers: { 'Authorization': `Bearer ${API_TOKEN}` }
});

// GET /internal/missions/{mission_id}
const result = await axios.get(
  `${MISSION_CONTROL_API}/missions/MC-20260721-0042`,
  { headers: { 'Authorization': `Bearer ${API_TOKEN}` } }
);
// Returns: { status, output, proof, logs }
```

---

## ⏰ WATCHDOG + TIMEOUT

```typescript
// Set timeout for execution
const TIMEOUT_MS = {
  read: 5000,        // /status should return in 5s
  low_write: 30000,  // /retry in 30s
  medium: 120000,    // /deploy preview in 2 min
  high: 300000,      // /deploy prod in 5 min
};

const timeout = setTimeout(() => {
  mission.status = 'timeout';
  reply(`⏰ Timeout after ${TIMEOUT_MS[risk]} ms.\n
    Mission: ${mission.id}\n
    Check dashboard for status.`);
}, TIMEOUT_MS[risk]);

try {
  const result = await executeMission(mission);
  clearTimeout(timeout);
  return handleSuccess(result);
} catch (err) {
  clearTimeout(timeout);
  return handleFailure(err);
}
```

---

## 📊 LOGGING + AUDIT

```sql
-- Every command logged
INSERT INTO audit_log (
  channel, source_id, actor_id, action, project,
  status, risk_level, mission_id, raw_input,
  response_output, timestamp
) VALUES (
  'line', $webhookEventId, $userId, 'deploy', 'arigeo',
  'approved', 'medium', 'MC-20260721-0048', '/deploy arigeo preview',
  'Mission dispatched to Hermes', NOW()
);

-- Every approval logged
INSERT INTO audit_log (
  channel, source_id, actor_id, action, project,
  status, approval_id, timestamp
) VALUES (
  'line', $webhookEventId, $userId, 'approve', 'arigeo',
  'approved', 'APPR-20260721-0048', NOW()
);
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Launch

- [ ] LINE channel created (LINE Developers Console)
- [ ] Channel credentials stored in `.env` (secret management)
- [ ] Webhook URL configured in LINE Console (public HTTPS)
- [ ] Database migrations applied (line_* tables)
- [ ] Account linking flow working (1 test user linked)
- [ ] Signature verification tested (curl with X-Line-Signature)
- [ ] Idempotency working (duplicate events ignored)
- [ ] Permission gates working (test role-based access)
- [ ] Risk classification tested (all risk levels)
- [ ] Hermes integration tested (mock mission dispatch)
- [ ] Message templates rendering correctly
- [ ] Webhook retry logic working (dead letter queue if timeout)

### Launch (MVP)

- [ ] Deploy webhook server (Node.js)
- [ ] Test live with owner (Ekkarat)
- [ ] /status command working
- [ ] Daily briefing sending at 09:00
- [ ] Alerts working (real-time)
- [ ] Link owner account via LINE

### Phase 2 (Core)

- [ ] All read commands working
- [ ] Approval workflow tested
- [ ] Medium-risk commands executing
- [ ] Natural language decoder working
- [ ] Result messages formatting correctly

---

## 🔍 MONITORING + ALERTING

### Metrics to Track

```
- Webhook events received (rate)
- Signature verification failures (security)
- Command parsing success rate
- Approval approval/reject ratio
- Execution success rate by command type
- Response time (P50, P95, P99)
- Timeout rate
- Message delivery failures
```

### Alerts

```
- Signature verification failure
  → Possible attack, investigate immediately
- High timeout rate (>10%)
  → Infrastructure issue
- Hermes dispatch failing
  → Executor down, fall back to manual
- Message delivery failure
  → LINE API issue, retry later
```

---

## 📚 IMPLEMENTATION ORDER

1. **Week 1**: Webhook + Signature + Idempotency
2. **Week 1**: Database schema + migrations
3. **Week 2**: Identity linking (account link flow)
4. **Week 2**: Command parser (structured + NLP)
5. **Week 3**: Permission + Risk gates
6. **Week 3**: Approval workflow
7. **Week 4**: Hermes integration + message formatting
8. **Week 4**: Testing + deployment

---

**Status**: Architecture complete  
**Next**: Database schema detailed design + webhook implementation spec  
**Owner**: Dev team (implementation) + Ekkarat (testing)

---

*"Every LINE command is a contract. Every contract needs proof. Every proof needs audit."*
