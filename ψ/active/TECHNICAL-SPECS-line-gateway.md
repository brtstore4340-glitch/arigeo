---
name: technical-specs-line-gateway
description: LINE Gateway technical specifications — database schema, API contracts, webhook implementation, component interfaces
metadata:
  type: project
  status: phase-2-technical-specs
  date: 2026-07-21
  project: line-gateway
---

# 🔧 TECHNICAL SPECIFICATIONS: LINE Gateway Phase 2

**Project**: LINE Command & Reporting Gateway  
**Phase**: 2 (Technical Implementation Specs)  
**Scope**: Database DDL, API contracts, webhook details, component interfaces  
**Created**: 2026-07-21

---

## DATABASE SCHEMA (SQL DDL)

### line_identities Table

```sql
CREATE TABLE line_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_user_id VARCHAR(255) UNIQUE NOT NULL,
  line_display_name VARCHAR(255),
  internal_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  internal_username VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'viewer',
    -- ENUM: 'owner', 'lead', 'dev', 'viewer'
    -- Hierarchy: owner ⊃ lead ⊃ dev ⊃ viewer
  company_id UUID,
  allowed_projects TEXT[] NOT NULL DEFAULT '{}',
    -- Array of project IDs user can access
    -- Empty array = no projects (viewer mode)
  status VARCHAR(50) NOT NULL DEFAULT 'pending_link',
    -- ENUM: 'active', 'disabled', 'pending_link'
    -- pending_link: awaiting account link confirmation
    -- active: linked + verified
    -- disabled: access revoked (admin action)
  link_token VARCHAR(255) UNIQUE,
    -- Temporary token for account linking flow
    -- Expires after 10 minutes
  link_token_expires_at TIMESTAMP,
  linked_at TIMESTAMP,
  last_seen TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_role CHECK (role IN ('owner', 'lead', 'dev', 'viewer')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'disabled', 'pending_link')),
  CONSTRAINT internal_user_or_pending 
    CHECK ((status = 'active' AND internal_user_id IS NOT NULL) OR status IN ('pending_link', 'disabled'))
);

CREATE INDEX idx_line_user_id ON line_identities(line_user_id);
CREATE INDEX idx_internal_user_id ON line_identities(internal_user_id);
CREATE INDEX idx_status ON line_identities(status);
CREATE INDEX idx_link_token ON line_identities(link_token) WHERE link_token IS NOT NULL;
CREATE INDEX idx_company ON line_identities(company_id);
```

### line_channels Table

```sql
CREATE TABLE line_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_type VARCHAR(50) NOT NULL,
    -- ENUM: 'user', 'group', 'room'
  destination_id VARCHAR(255) NOT NULL,
    -- LINE userId, groupId, or roomId
  destination_name VARCHAR(255),
    -- Display name for logging
  company_id UUID,
  report_policy VARCHAR(100),
    -- Cron expression or schedule: 'daily_09:00', 'weekly_monday_09:00', etc.
    -- NULL = no automatic reports
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_type CHECK (destination_type IN ('user', 'group', 'room')),
  UNIQUE (destination_type, destination_id, company_id)
);

CREATE INDEX idx_destination ON line_channels(destination_type, destination_id);
CREATE INDEX idx_company ON line_channels(company_id);
CREATE INDEX idx_enabled ON line_channels(enabled) WHERE enabled = TRUE;
```

### line_commands Table

```sql
CREATE TABLE line_commands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  command_id VARCHAR(50) UNIQUE NOT NULL,
    -- Format: CMD-YYYYMMDD-NNNN (generated, e.g., CMD-20260721-0001)
  webhook_event_id VARCHAR(255) UNIQUE NOT NULL,
    -- LINE's webhookEventId (idempotency key)
  actor_id UUID REFERENCES line_identities(id) ON DELETE SET NULL,
  actor_name VARCHAR(255),
    -- Cached display name (in case identity is deleted)
  raw_message TEXT NOT NULL,
    -- Original user input (for audit trail)
  parsed_command VARCHAR(255),
    -- First word or structured command: 'status', 'deploy', 'approve', etc.
  normalized_intent VARCHAR(255) NOT NULL,
    -- Machine-readable intent: 'query_status', 'dispatch_deploy', 'approve_mission', etc.
  intent_parameters JSONB NOT NULL DEFAULT '{}',
    -- Extracted params: { project: 'captain-maid', env: 'preview', ... }
  language VARCHAR(10),
    -- 'en', 'th', 'mixed' (detected by intent decoder)
  confidence NUMERIC(3,2),
    -- 0.00-1.00 (from NLP decoder)
  risk_level VARCHAR(50) NOT NULL DEFAULT 'read',
    -- ENUM: 'read', 'low_write', 'medium', 'high', 'critical'
  mission_id VARCHAR(50) REFERENCES missions(id) ON DELETE SET NULL,
    -- Link to execution mission (if any)
  approval_id UUID REFERENCES line_approvals(id) ON DELETE SET NULL,
    -- Link to approval record (if high/critical)
  status VARCHAR(50) NOT NULL DEFAULT 'received',
    -- ENUM: 'received', 'parsed', 'permission_denied', 'pending_approval', 
    --       'approved', 'rejected', 'dispatched', 'executing', 'complete', 'failed', 'timeout'
  execution_log JSONB,
    -- { steps: [{ name, status, duration_ms, output }], errors: [...] }
  result_summary TEXT,
    -- Human-readable final result
  error_message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  parsed_at TIMESTAMP,
  permission_checked_at TIMESTAMP,
  approved_at TIMESTAMP,
  dispatched_at TIMESTAMP,
  executed_at TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_risk CHECK (risk_level IN ('read', 'low_write', 'medium', 'high', 'critical')),
  CONSTRAINT valid_status CHECK (status IN ('received', 'parsed', 'permission_denied', 'pending_approval', 
                                             'approved', 'rejected', 'dispatched', 'executing', 'complete', 'failed', 'timeout'))
);

CREATE INDEX idx_actor ON line_commands(actor_id);
CREATE INDEX idx_mission ON line_commands(mission_id);
CREATE INDEX idx_approval ON line_commands(approval_id);
CREATE INDEX idx_webhook_event ON line_commands(webhook_event_id);
CREATE INDEX idx_status ON line_commands(status);
CREATE INDEX idx_risk ON line_commands(risk_level);
CREATE INDEX idx_created ON line_commands(created_at DESC);
```

### line_approvals Table

```sql
CREATE TABLE line_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_id VARCHAR(50) UNIQUE NOT NULL,
    -- Format: APPR-YYYYMMDD-NNNN (e.g., APPR-20260721-0048)
  command_id UUID UNIQUE REFERENCES line_commands(id) ON DELETE CASCADE,
  mission_id VARCHAR(50) REFERENCES missions(id) ON DELETE CASCADE,
  requested_by UUID REFERENCES line_identities(id) ON DELETE SET NULL,
  requested_by_name VARCHAR(255),
    -- Cached display name
  action_description TEXT NOT NULL,
    -- Human-readable description: "Deploy cms-arigeo to production"
  risk_level VARCHAR(50) NOT NULL,
    -- ENUM: 'medium', 'high', 'critical'
  approved_by UUID REFERENCES line_identities(id) ON DELETE SET NULL,
  approved_by_name VARCHAR(255),
    -- Cached display name
  decision VARCHAR(50),
    -- ENUM: 'approved', 'rejected', NULL (if pending)
  decision_reason TEXT,
    -- Why approved/rejected
  expires_at TIMESTAMP NOT NULL,
    -- When approval expires (typically 15 minutes)
  decided_at TIMESTAMP,
  line_reply_token VARCHAR(255),
    -- LINE replyToken to send result (if used)
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_risk CHECK (risk_level IN ('medium', 'high', 'critical')),
  CONSTRAINT valid_decision CHECK (decision IS NULL OR decision IN ('approved', 'rejected')),
  CONSTRAINT decided_requires_decision CHECK ((decided_at IS NULL) = (decision IS NULL))
);

CREATE INDEX idx_mission ON line_approvals(mission_id);
CREATE INDEX idx_command ON line_approvals(command_id);
CREATE INDEX idx_expires ON line_approvals(expires_at) WHERE decision IS NULL;
CREATE INDEX idx_requested_by ON line_approvals(requested_by);
CREATE INDEX idx_created ON line_approvals(created_at DESC);
```

### Extend Existing Tables

```sql
-- missions table
ALTER TABLE missions ADD COLUMN line_initiated_by UUID REFERENCES line_identities(id);
ALTER TABLE missions ADD COLUMN line_command_id VARCHAR(50) REFERENCES line_commands(command_id);
ALTER TABLE missions ADD COLUMN line_approval_id UUID REFERENCES line_approvals(id);

-- audit_log table
ALTER TABLE audit_log ADD COLUMN channel VARCHAR(50) DEFAULT 'cli',
  -- 'cli', 'line', 'api', 'web', 'scheduled'
  CONSTRAINT valid_channel CHECK (channel IN ('cli', 'line', 'api', 'web', 'scheduled'));
ALTER TABLE audit_log ADD COLUMN line_event_id VARCHAR(255),
  -- LINE webhookEventId (for tracing)
ALTER TABLE audit_log ADD COLUMN line_actor_id UUID REFERENCES line_identities(id);
```

---

## API CONTRACTS

### Webhook Endpoint

**POST** `/api/integrations/line/webhook`

**Request**:
```json
{
  "events": [
    {
      "type": "message",
      "message": {
        "type": "text",
        "id": "100001",
        "text": "/status"
      },
      "webhookEventId": "01234567890abcdef1234567890abcde",
      "deliveryContext": {
        "isRedelivery": false
      },
      "timestamp": 1462629479859,
      "source": {
        "type": "user",
        "userId": "U1234567890abcdef1234567890abcde"
      },
      "replyToken": "nHuyWiB7yP5Zw52FIkcQT"
    }
  ]
}
```

**Headers**:
```
X-Line-Signature: abcdef1234567890abcdef1234567890abcdef12=
Content-Type: application/json
```

**Response** (200 OK):
```json
{
  "ok": true,
  "command_id": "CMD-20260721-0001",
  "status": "received",
  "processing": "async"
}
```

### Internal Mission Dispatch API

**POST** `/internal/missions`

**Request**:
```json
{
  "actor_id": "550e8400-e29b-41d4-a716-446655440000",
  "source": "line",
  "project": "captain-maid",
  "intent": "deploy preview",
  "environment": "preview",
  "parameters": {
    "branch": "main",
    "skip_tests": false
  },
  "risk_level": "medium",
  "line_command_id": "CMD-20260721-0001",
  "line_approval_id": "APPR-20260721-0048"
}
```

**Response** (201 Created):
```json
{
  "mission_id": "MC-20260721-0042",
  "status": "dispatched",
  "expected_duration_ms": 120000,
  "executor": "hermes"
}
```

**GET** `/internal/missions/{mission_id}`

**Response** (200 OK):
```json
{
  "mission_id": "MC-20260721-0042",
  "status": "complete",
  "output": {
    "deployed_at": "2026-07-21T06:15:00Z",
    "duration_ms": 45000,
    "commit": "a18f92c",
    "tests": { "passed": 18, "failed": 0, "total": 18 },
    "build": { "status": "success", "size_bytes": 3355443 }
  },
  "proof": {
    "artifact_url": "https://dashboard.example.com/missions/MC-20260721-0042",
    "logs_url": "https://dashboard.example.com/missions/MC-20260721-0042/logs"
  }
}
```

---

## WEBHOOK IMPLEMENTATION DETAILS

### Signature Verification

**Algorithm**: HMAC-SHA256

**Implementation**:
```typescript
import crypto from 'crypto';

function verifySignature(
  rawBody: string, 
  signature: string, 
  secret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64');
  
  // Constant-time comparison (prevent timing attacks)
  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(signature)
  );
}
```

**Important**: Use raw request body (before JSON parsing), not the parsed JSON object.

### Idempotency Handling

**Key**: `webhookEventId` (unique per LINE event)

**Implementation**:
```typescript
async function handleWebhookEvent(event: LineEvent): Promise<void> {
  const { webhookEventId } = event;
  
  // Check if already processed
  const existing = await db.query(
    'SELECT id FROM line_commands WHERE webhook_event_id = ? LIMIT 1',
    [webhookEventId]
  );
  
  if (existing) {
    console.log(`Duplicate event ${webhookEventId}, skipping`);
    return;
  }
  
  // Process event (only runs once per webhookEventId)
  await processEvent(event);
}
```

### Error Handling & Retry

```typescript
async function handleWebhookWithRetry(req: Request, res: Response): Promise<void> {
  try {
    // Verify signature
    if (!verifySignature(req.rawBody, req.headers['x-line-signature'], LINE_SECRET)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Parse body
    const { events } = JSON.parse(req.rawBody);
    
    // Respond immediately (200 OK)
    res.json({ ok: true });
    
    // Process asynchronously (don't block response)
    for (const event of events) {
      try {
        await handleWebhookEvent(event);
      } catch (err) {
        // Log error, don't crash
        logger.error('Webhook event processing failed', {
          webhookEventId: event.webhookEventId,
          error: err.message,
          stack: err.stack
        });
        
        // Store for retry (DLQ pattern)
        await deadLetterQueue.push({
          event,
          error: err.message,
          retry_count: 0,
          failed_at: new Date()
        });
      }
    }
  } catch (err) {
    logger.error('Webhook handler crashed', { error: err.message });
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

---

## COMPONENT INTERFACES

### IntentDecoder

```typescript
interface Intent {
  action: 'status' | 'deploy' | 'logs' | 'approve' | 'reject' | 'retry' | 'assign' | 'create_task';
  project?: string;
  environment?: 'preview' | 'production' | 'staging';
  missionId?: string;
  hours?: number;
  reason?: string;
  taskDescription?: string;
  parameters: Record<string, any>;
  language: 'en' | 'th' | 'mixed';
  confidence: number; // 0.00-1.00
}

interface IntentDecoderResult {
  intent: Intent;
  isValid: boolean;
  parseError?: string;
}

// StructuredCommandParser
class CommandParser {
  parse(input: string): IntentDecoderResult {
    // Implement regex-based parsing
    // Examples:
    //   /status → { action: 'status' }
    //   /deploy captain-maid preview → { action: 'deploy', project: 'captain-maid', environment: 'preview' }
    //   /approve MC-20260721-0042 → { action: 'approve', missionId: 'MC-20260721-0042' }
  }
}

// NaturalLanguageDecoder (Thai + English)
class NLDecoder {
  async decode(input: string): Promise<IntentDecoderResult> {
    // Use google-nlp or similar for tokenization + intent classification
    // Examples:
    //   "ธาม สรุปสถานะ fleet ตอนนี้" → { action: 'status', project: 'fleet' }
    //   "deploy arigeo preview" → { action: 'deploy', project: 'arigeo', environment: 'preview' }
  }
}
```

### PermissionGate

```typescript
interface AccessDecision {
  allowed: boolean;
  reason?: string;
  requiredRole?: string;
  requiredProject?: string[];
}

class PermissionGate {
  async check(
    user: LineIdentity,
    intent: Intent,
    riskLevel: string
  ): Promise<AccessDecision> {
    // Rule 1: Check role
    const rolePermissions = {
      'owner': ['status', 'deploy', 'logs', 'approve', 'reject', 'retry', 'assign', 'create_task'],
      'lead': ['status', 'logs', 'retry', 'assign', 'create_task'],
      'dev': ['status', 'logs'],
      'viewer': ['status']
    };
    
    if (!rolePermissions[user.role].includes(intent.action)) {
      return { allowed: false, reason: `Role ${user.role} cannot ${intent.action}` };
    }
    
    // Rule 2: Check project access
    if (intent.project && !user.allowed_projects.includes(intent.project)) {
      return { 
        allowed: false, 
        reason: `No access to project ${intent.project}`,
        requiredProject: [intent.project]
      };
    }
    
    return { allowed: true };
  }
}
```

### RiskGate

```typescript
interface RiskClassification {
  level: 'read' | 'low_write' | 'medium' | 'high' | 'critical';
  requiresApproval: boolean;
  approvalTtlMinutes: number;
  requiresMfa: boolean;
}

class RiskGate {
  classify(intent: Intent): RiskClassification {
    // Read operations → no approval
    if (['status', 'logs'].includes(intent.action)) {
      return { level: 'read', requiresApproval: false, approvalTtlMinutes: 0, requiresMfa: false };
    }
    
    // Low write → report and do
    if (['retry', 'assign', 'create_task'].includes(intent.action)) {
      return { level: 'low_write', requiresApproval: false, approvalTtlMinutes: 0, requiresMfa: false };
    }
    
    // Medium → require approval
    if (intent.action === 'deploy' && intent.environment === 'preview') {
      return { level: 'medium', requiresApproval: true, approvalTtlMinutes: 15, requiresMfa: false };
    }
    
    // High → require explicit approval
    if (intent.action === 'deploy' && intent.environment === 'production') {
      return { level: 'high', requiresApproval: true, approvalTtlMinutes: 15, requiresMfa: false };
    }
    
    // Critical → owner only + 2FA
    if (['delete', 'rotate_secret'].includes(intent.action)) {
      return { level: 'critical', requiresApproval: true, approvalTtlMinutes: 5, requiresMfa: true };
    }
    
    return { level: 'medium', requiresApproval: true, approvalTtlMinutes: 15, requiresMfa: false };
  }
}
```

### ReportRenderer

```typescript
interface MessageTemplate {
  render(mission: Mission, proof: ProofArtifact): string;
}

class SuccessReportRenderer implements MessageTemplate {
  render(mission: Mission, proof: ProofArtifact): string {
    return `✅ MISSION COMPLETE

Mission: ${mission.id}
Project: ${mission.project}
Action: ${mission.intent}
Duration: ${this.formatDuration(mission)}

Tests: ${proof.tests.passed}/${proof.tests.total} ✅
Build: ✅ ${this.formatSize(proof.build_size)}

Proof:
${proof.checks.map(c => `• ${c.name}: ${c.status}`).join('\n')}

Dashboard: ${DASHBOARD_URL}/missions/${mission.id}`;
  }
}

class ApprovalRequestRenderer implements MessageTemplate {
  render(approval: Approval): string {
    return `⚠️ APPROVAL REQUIRED

Mission: ${approval.mission_id}
Action: ${approval.action_description}
Risk Level: ${approval.risk_level}

Respond with:
/approve ${approval.approval_id}
or
/reject ${approval.approval_id}`;
  }
}
```

---

## MESSAGE FLOW DIAGRAM

### Command Execution Flow

```
LINE User Input
    ↓ (webhook)
Signature Verification ✅
    ↓
Idempotency Check ✅ (webhookEventId)
    ↓
Event Normalizer
    ├─ Extract: userId, groupId, message
    └─ Store: raw_message → DB
    ↓
Identity Linker
    ├─ Query: line_identities(line_user_id)
    ├─ Verify: status = 'active'
    └─ Load: internal_user_id, role, allowed_projects
    ↓
Command Parser
    ├─ Structured parser: /status, /deploy, etc.
    └─ NL decoder: "ธาม สรุปสถานะ", "deploy preview", etc.
    ↓
Intent Decoder
    └─ Normalize: { action, project, env, ... }
    ↓
Permission Gate
    ├─ Check: role + action
    ├─ Check: project access
    └─ Deny if insufficient
    ↓
Risk Classifier
    ├─ Determine: read/low/medium/high/critical
    └─ Require approval if medium+
    ↓
[Branch: Approval Required?]
    │
    ├─ YES → Approval Service
    │   ├─ Create approval record (expires 15min)
    │   ├─ Send approval request via LINE (reply)
    │   └─ Wait for /approve or /reject
    │
    └─ NO → Mission Dispatcher
        ├─ Create mission contract
        ├─ Dispatch to Hermes
        ├─ Await execution
        └─ Report result via LINE (push)
    ↓
[If Approved]
    ↓
Mission Dispatcher
    ├─ POST /internal/missions
    ├─ Actor: line_command_id, line_approval_id
    └─ Executor: Hermes
    ↓
Hermes Executor
    ├─ Execute (git push, deploy, etc.)
    ├─ Capture logs + proof
    └─ Return result
    ↓
Report Renderer
    ├─ Format result (success/failure)
    └─ Generate dashboard link
    ↓
LINE Client
    ├─ Push message to user (async)
    ├─ Include proof link
    └─ Optional: reply if still within reply window
    ↓
LINE User Receives ✅
```

---

## DEPLOYMENT CHECKLIST

### Pre-Launch
- [ ] Database migrations applied
- [ ] LINE Channel created (Developers Console)
- [ ] Channel credentials stored in `.env`
- [ ] Webhook URL registered (public HTTPS)
- [ ] Signature verification tested (curl with X-Line-Signature header)
- [ ] Idempotency working (duplicate events ignored)
- [ ] Account linking flow tested (1 test user linked)
- [ ] All components deployed (webhook, parser, gating, dispatcher)
- [ ] Hermes integration tested (mock mission dispatch)

### Launch
- [ ] /status command working
- [ ] Daily briefing configured (if enabled)
- [ ] Alerts working (real-time)
- [ ] Approval workflow tested
- [ ] Error handling verified (DLQ functional)

### Post-Launch Monitoring
- [ ] Webhook events received (rate)
- [ ] Signature verification success rate
- [ ] Command parsing success rate
- [ ] Permission denial rate
- [ ] Approval approval/reject ratio
- [ ] Mission execution success rate
- [ ] Response time (P50, P95, P99)

---

## CONFIGURATION (Environment Variables)

```bash
# LINE Channel (from Developers Console)
export LINE_CHANNEL_ID=1234567890
export LINE_CHANNEL_SECRET=abcdef1234567890abcdef1234567890
export LINE_CHANNEL_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Webhook
export LINE_WEBHOOK_PATH=/api/integrations/line/webhook
export LINE_WEBHOOK_URL=https://fleet.example.com/api/integrations/line/webhook

# Authorization
export LINE_OWNER_USER_IDS=U1234567890abcdef1234567890abcde,U0987654321fedcba0987654321fedcba
export LINE_ALLOWED_GROUP_IDS=C1234567890abcdef1234567890abcde

# Timing
export LINE_APPROVAL_TTL_MINUTES=15

# Integration
export MISSION_CONTROL_INTERNAL_API_URL=http://localhost:3000/api/internal
export MISSION_CONTROL_INTERNAL_API_TOKEN=Bearer token...

# Logging
export LINE_WEBHOOK_LOG_LEVEL=info
export LINE_COMMAND_LOG_LEVEL=debug
```

---

**Status**: Phase 2 Technical Specs Complete  
**Next**: Dev implementation (Phase 3, 4 weeks estimated)  
**Owner**: Dev team + Infrastructure

---

*"The database is the contract. The API is the interface. The component is the implementation."*
