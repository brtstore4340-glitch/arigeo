---
name: product-line-gateway
description: LINE Official Account + Messaging API integration for Marcus Fleet command & reporting
metadata:
  type: project
  status: phase-1-understand
  date: 2026-07-21
  project: line-gateway
---

# 📋 PRODUCT DEFINITION: LINE Command & Reporting Gateway

**Project**: Marcus Fleet LINE Integration  
**Purpose**: Bidirectional LINE communication for fleet reporting & command execution  
**Scope**: Report distribution + command intake + approval workflow + result writeback  
**Created**: 2026-07-21

---

## 🎯 VISION

> Enable พี่เอก (Ekkarat) to receive fleet status reports via LINE and execute commands through natural language, with full security gating, approval workflows, and audit trails.

**Why LINE?**
- Ubiquitous in Thailand (higher engagement than email/Slack)
- LINE Notify discontinued (2025-03-31) → must use Official Account + Messaging API
- Native support for links, rich formatting, quick replies
- Built-in account linking (OAuth-like flow)
- Perfect for notifications + command interface

---

## 👥 PERSONAS

### Persona 1: Ekkarat (Mission Owner/Authorizer)
**Role**: Owner, final decision maker  
**Needs**:
- See fleet status daily (briefing)
- Get urgent alerts (deployment failed, security issue)
- Approve/reject critical operations via LINE
- Execute commands in Thai (natural language)
- See mission results immediately

**Permissions**: All read, all writes, all approvals

### Persona 2: Team Lead (Secondary Approver)
**Role**: Project lead, can approve some operations  
**Needs**:
- Monitor specific projects (captain-maid, cms-arigeo)
- Request missions (delegate to Hermes)
- Approve Medium-risk operations
- See proof/logs when missions complete

**Permissions**: Read own projects, Medium-risk approvals only

### Persona 3: Developer (Executor Visibility)
**Role**: Dev working on fleet projects  
**Needs**:
- Check mission status
- View logs/errors
- Request retry of failed tasks
- Get notifications when assigned

**Permissions**: Read own missions, Low-risk writes (retry, request)

---

## 🎪 TECHNICAL CONTEXT

### Current Marcus Fleet State
- ✅ Design Governance (.ai/) deployed
- ✅ Git safety protocol hardcoded (Step 0)
- ✅ Agent queue system operational
- ✅ Hermes executor (command → git → deploy)
- ✅ Proof artifact system
- ✅ Dashboard (control_fleet)
- ✅ Fleet memory (ψ/)

### LINE Messaging API Integration Points
- **Entry**: Webhook receives user messages from LINE
- **Processing**: Decode → Permission → Risk → Contract → Execute
- **Exit**: Push message to user with results
- **Bridge**: Mission Control ↔ LINE (bidirectional)

### Why Not LINE Notify?
- ❌ LINE Notify discontinued 2025-03-31
- ❌ No command intake capability
- ✅ Official Account + Messaging API: active, feature-rich, maintained

---

## 📊 FEATURE MATRIX

### Outbound (Fleet → LINE)

| Report Type | Trigger | Format | Example |
|-------------|---------|--------|---------|
| **Daily Briefing** | 09:00 daily | Summary card | Sites running: 12 / Uptime: 99.9% / Alerts: 3 |
| **Mission Complete** | After success | Rich message + link | MC-20260721-0042 captain-maid mobile menu fixed |
| **Mission Failed** | After error | Alert + logs | MC-20260721-0041 failed (git push error) |
| **Deployment Result** | After deploy | Status + proof | arigeo preview deployed, 18/18 tests passed |
| **Security Alert** | Real-time | Urgent | SSL certificate expiring in 7 days |
| **Cost Alert** | Daily/weekly | Summary | Bandwidth: 450GB/500GB quota (90%) |
| **Approval Request** | Need approval | Action buttons | Deploy arigeo production? [Approve] [Reject] |
| **Manual Report** | /report today | Summary | Activity: 5 missions, 3 passed, 2 pending |

### Inbound (LINE → Fleet)

| Command Type | Examples | Risk | Gate |
|--------------|----------|------|------|
| **Status/Query** | /status, /fleet, /missions, /logs | Read | Identity only |
| **Low Write** | /retry, /assign task | Low | Identity + permission |
| **Medium** | /commit, /preview deploy | Medium | Identity + permission + contract |
| **High** | /deploy production, /database migrate | High | Approval required |
| **Critical** | /delete data, /rotate secret | Critical | 2FA + owner only |

---

## 🔄 FLOW DIAGRAMS

### Outbound: Fleet Report to LINE

```
Hermes/Zeus (Fleet)
    ↓
Report Service
    ├─ Query mission status
    ├─ Format message (rich)
    └─ Render proof summary
    ↓
LINE Client
    ├─ Validate channel + user
    └─ Push message to LINE
    ↓
LINE Platform
    ↓
พี่เอก's LINE (Notification)
```

### Inbound: Command from LINE to Fleet

```
พี่เอก (LINE app)
    ↓ (types message)
LINE Official Account
    ↓
Webhook (POST to fleet)
    ├─ Verify x-line-signature
    ├─ Check idempotency (webhookEventId)
    └─ Parse JSON
    ↓
Event Normalizer
    └─ Extract userId, groupId, message
    ↓
Identity Linker
    ├─ Map LINE user → internal user
    ├─ Load role + permissions
    └─ Check if enabled
    ↓
Intent Decoder
    ├─ Parse command (/status, /deploy, etc.)
    ├─ Extract parameters
    └─ Support natural language (Thai + English)
    ↓
Permission Gate
    ├─ Check actor role
    ├─ Check project access
    └─ Deny if insufficient permission
    ↓
Risk Gate
    ├─ Classify risk level (Read/Low/Medium/High/Critical)
    ├─ Require approval if High/Critical
    └─ Check approval TTL (default 15 min)
    ↓
Mission Contract
    ├─ Create contract (actor, intent, risk, project)
    ├─ Assign mission ID
    └─ Log to database
    ↓
Hermes Executor
    ├─ Execute (git push, deploy, etc.)
    ├─ Capture logs + proof
    └─ Timeout/watchdog protection
    ↓
Proof Generation
    ├─ Build evidence artifacts
    ├─ Generate dashboard link
    └─ Writeback to GitHub/Obsidian
    ↓
Report Renderer
    └─ Format result message (success/failure/approval)
    ↓
LINE Client
    ├─ Reply to user (quick reply)
    └─ Send push notification if async
    ↓
พี่เอก (LINE notification)
```

---

## 📋 COMMAND SPECIFICATION

### Syntax & Examples

#### Read Commands (Immediate)

```
/status                          → Fleet status summary
/fleet                           → All projects status
/missions                        → Recent missions
/missions active                 → Only in-progress missions
/missions captain-maid           → Project-specific missions
/report today                    → Daily report
/report deployment               → Deploy-only report
/logs cms-arigeo                 → Recent logs for project
/project captain-maid status     → Specific project status
```

#### Write Commands (Low Risk)

```
/retry MC-20260721-0042          → Retry failed mission
/assign hermes fix captain-maid  → Create new mission
/create task "Fix mobile menu"   → Create task
/stop MC-20260721-0042           → Cancel running mission (if allowed)
```

#### High Risk (Require Approval)

```
/project arigeo deploy preview   → Deploy to preview
/deploy cms-arigeo production    → Deploy to production
/database migrate                → Run migration
```

#### Critical (2FA Required)

```
/delete project cms-arigeo       → Delete entire project
/rotate secret DATABASE_URL      → Rotate credentials
/disable service hermes          → Disable executor
```

#### Natural Language (Thai + English)

```
ธาม สรุปสถานะ fleet ตอนนี้
ให้ Hermes ตรวจ captain-maid แล้วรายงานปัญหา
deploy arigeo preview แต่ห้าม production
หยุด mission ที่กำลังแก้ cms-arigeo
ส่งรายงานประจำวันมาให้ดู
```

---

## 🔐 SECURITY MODEL

### Identity Linking (Account Linking)

**NOT**:
- ❌ Username matching ("ธาม" → user lookup)
- ❌ Text-based identity ("I am Ekkarat")
- ❌ Simple phone number matching

**YES**:
- ✅ LINE Account Linking (OAuth-like)
  1. LINE provides `/link` URL
  2. User clicks → redirected to Mission Control login
  3. User logs in (proves identity)
  4. Receives link token from LINE
  5. Mission Control exchanges link token → LINE user binding
  6. `line_user_id` → `internal_user_id` stored in DB

### Signature Verification

**Every webhook**:
1. Extract `x-line-signature` header
2. Compute HMAC-SHA256(raw request body, channel secret)
3. Verify matches header
4. Reject if mismatch (replay attack protection)

### Idempotency

**Every event**:
1. Store `webhookEventId` (LINE's unique ID for this event)
2. Before processing, check if already processed
3. Skip if duplicate (prevent double-execution)

### Risk Classification

```
Read (status, logs)
└─ No approval needed
└─ Identity + enabled user check only

Low Write (retry, create task)
└─ Report and do
└─ Check permission + risk gate
└─ Create mission, execute, report result

Medium Write (preview deploy, commit)
└─ Show contract, user confirms
└─ Display planned changes
└─ Wait for /approve or timeout
└─ Execute if approved

High Write (production deploy)
└─ Require explicit /approve MC-ID
└─ 15-minute TTL on approval
└─ Log who approved, when

Critical (delete, secret rotate, disable)
└─ Owner only (role check)
└─ 2FA required (optional: TOTP via LINE?)
└─ Manual audit required
└─ Send to Slack for backup notification
```

### Command Execution Safeguards

**NO direct shell access from LINE**:
- ❌ No `bash -c "rm -rf /"`
- ❌ No `git push --force`
- ❌ No `DELETE FROM users`

**YES through contract**:
- ✅ Decode intent (what user wants)
- ✅ Create mission (what will happen)
- ✅ Hermes executes (sandboxed, logged)
- ✅ Proof artifact (what actually happened)
- ✅ Writeback (record result)

---

## 💾 DATABASE SCHEMA

### line_identities

```sql
CREATE TABLE line_identities (
  id UUID PRIMARY KEY,
  line_user_id VARCHAR(255) UNIQUE NOT NULL,
  internal_user_id UUID REFERENCES users(id),
  display_name VARCHAR(255),
  role ENUM('owner', 'lead', 'dev', 'viewer') DEFAULT 'viewer',
  company_id UUID,
  allowed_projects TEXT[] (JSON list of project IDs),
  status ENUM('active', 'disabled', 'pending_link') DEFAULT 'active',
  linked_at TIMESTAMP,
  last_seen TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_line_user ON line_identities(line_user_id);
CREATE INDEX idx_internal_user ON line_identities(internal_user_id);
```

### line_channels

```sql
CREATE TABLE line_channels (
  id UUID PRIMARY KEY,
  destination_type ENUM('user', 'group', 'room') NOT NULL,
  destination_id VARCHAR(255) NOT NULL,
  company_id UUID,
  report_policy VARCHAR(50) DEFAULT 'daily_09:00',
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_destination 
  ON line_channels(destination_type, destination_id);
```

### line_commands

```sql
CREATE TABLE line_commands (
  id UUID PRIMARY KEY,
  command_id VARCHAR(50) NOT NULL UNIQUE,
  event_id VARCHAR(255) NOT NULL UNIQUE,  -- LINE webhookEventId
  actor_id UUID REFERENCES line_identities(id),
  raw_message TEXT,
  normalized_intent VARCHAR(255),
  intent_parameters JSONB,
  risk_level ENUM('read', 'low_write', 'medium', 'high', 'critical'),
  mission_id VARCHAR(50) REFERENCES missions(id),
  status ENUM('pending', 'approved', 'rejected', 'executed', 'failed'),
  execution_log JSONB,
  result_summary TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  executed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_actor ON line_commands(actor_id);
CREATE INDEX idx_mission ON line_commands(mission_id);
```

### line_approvals

```sql
CREATE TABLE line_approvals (
  id UUID PRIMARY KEY,
  approval_id VARCHAR(50) NOT NULL UNIQUE,
  mission_id VARCHAR(50) REFERENCES missions(id),
  command_id UUID REFERENCES line_commands(id),
  requested_by UUID REFERENCES line_identities(id),
  approved_by UUID REFERENCES line_identities(id),
  decision ENUM('approved', 'rejected') NOT NULL,
  decision_reason TEXT,
  expires_at TIMESTAMP NOT NULL,
  decided_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mission ON line_approvals(mission_id);
CREATE INDEX idx_expires ON line_approvals(expires_at);
```

### Extend existing tables

```sql
-- missions table (add LINE fields)
ALTER TABLE missions ADD COLUMN line_initiated_by UUID REFERENCES line_identities(id);
ALTER TABLE missions ADD COLUMN line_approval_id UUID REFERENCES line_approvals(id);

-- Add to Fleet audit/ledger
ALTER TABLE audit_log ADD COLUMN channel VARCHAR(50) DEFAULT 'cli';  -- 'cli', 'line', 'api', 'web'
ALTER TABLE audit_log ADD COLUMN line_actor_id UUID;
```

---

## ⚙️ ENVIRONMENT VARIABLES

```env
# LINE Channel Setup (from LINE Developers Console)
LINE_CHANNEL_ID=1234567890
LINE_CHANNEL_SECRET=abcdef1234567890abcdef1234567890
LINE_CHANNEL_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Webhook Configuration
LINE_WEBHOOK_PATH=/api/integrations/line/webhook
LINE_WEBHOOK_URL=https://fleet.example.com/api/integrations/line/webhook

# Authorized Users
LINE_OWNER_USER_IDS=U1234567890abcdef1234567890abcde,U0987654321fedcba0987654321fedcba
LINE_ALLOWED_GROUP_IDS=C1234567890abcdef1234567890abcde,C0987654321fedcba0987654321fedcba

# Security
LINE_COMMAND_SIGNING_SECRET=secret_for_additional_command_signing
LINE_APPROVAL_TTL_MINUTES=15

# Internal API (to dispatch to Hermes)
MISSION_CONTROL_INTERNAL_API_URL=http://localhost:3000/api/internal
MISSION_CONTROL_INTERNAL_API_TOKEN=Bearer token...

# Logging
LINE_WEBHOOK_LOG_LEVEL=info
LINE_COMMAND_LOG_LEVEL=debug
```

---

## 🎬 COMPONENT ARCHITECTURE

### Directory Structure

```
apps/line-gateway/
├── src/
│   ├── webhook/
│   │   └── handler.ts              # Entry point for LINE webhook
│   ├── signature-verifier/
│   │   └── verifier.ts             # Verify x-line-signature
│   ├── event-normalizer/
│   │   └── normalizer.ts           # Extract userId, groupId, message
│   ├── identity-linker/
│   │   └── linker.ts               # Map LINE user → internal user
│   ├── command-parser/
│   │   ├── parser.ts               # /status, /deploy, etc.
│   │   └── natural-language.ts     # Thai + English NLP decode
│   ├── intent-decoder/
│   │   └── decoder.ts              # Convert parsed → intent object
│   ├── permission-gate/
│   │   └── gate.ts                 # Check role + project access
│   ├── risk-gate/
│   │   ├── classifier.ts           # Classify risk level
│   │   └── approval-checker.ts     # Check if approval exists + valid
│   ├── approval-service/
│   │   └── service.ts              # Create, check, expire approvals
│   ├── mission-dispatcher/
│   │   └── dispatcher.ts           # Create mission contract + call Hermes
│   ├── report-renderer/
│   │   ├── success-template.ts     # Format ✅ complete messages
│   │   ├── failure-template.ts     # Format 🔴 failed messages
│   │   ├── approval-template.ts    # Format ⚠️ approval requests
│   │   ├── alert-template.ts       # Format 🚨 alerts
│   │   └── briefing-template.ts    # Format 📊 daily briefing
│   ├── line-client/
│   │   ├── client.ts               # LINE Messaging API wrapper
│   │   ├── reply.ts                # Reply to event (quick)
│   │   └── push.ts                 # Push notification (async/scheduled)
│   ├── db/
│   │   ├── schema.sql              # Database definitions
│   │   └── migrations/             # Schema changes
│   ├── types/
│   │   ├── line.ts                 # LINE event types
│   │   ├── mission.ts              # Mission contract types
│   │   └── identity.ts             # Identity/permission types
│   └── index.ts                    # Server bootstrap
├── tests/
│   ├── webhook.test.ts
│   ├── signature-verifier.test.ts
│   ├── command-parser.test.ts
│   ├── risk-gate.test.ts
│   └── integration.test.ts
├── package.json
└── .env.example
```

---

## 📤 MESSAGE TEMPLATES

### Success Report

```
✅ MISSION COMPLETE

Mission: MC-20260721-0042
Project: captain-maid
Executor: Hermes
Action: Fix mobile navigation
Branch: main
Commit: a18f92c "Fix hamburger menu alignment"
Duration: 6m 14s

Tests: 18/18 ✅
Build: ✅ passed (3.2MB)
Mobile Menu: ✅ verified

Proof:
• TypeScript check passed
• Production build passed
• Mobile menu responsive
• Screenshot captured

Dashboard: https://control-fleet.example/missions/MC-20260721-0042
```

### Approval Request

```
⚠️ APPROVAL REQUIRED

Mission: MC-20260721-0048
Action: Deploy cms-arigeo to production

Risk Level: HIGH

Changes:
• 3 database migrations (add columns)
• 2 environment variables (config change)
• Production deployment (main → production)

Timeline:
Approval expires in 15 minutes

Respond with:
/approve MC-20260721-0048
or
/reject MC-20260721-0048
```

### Daily Briefing

```
📊 FLEET BRIEFING — July 21, 2026 09:00

Status: ✅ Healthy

Sites Running: 12 / 12
Uptime: 99.98%
Deployments Today: 5 (4 success, 1 pending)
Errors: 2 (1 resolved)
Alerts: 1 (SSL expires in 7 days)

Recent Missions:
✅ captain-maid: Mobile menu fix (6m 14s)
✅ cms-arigeo: Database cleanup (4m 22s)
⏳ khun-ram: Documentation update
🔴 legacy-site: Deployment failed

Upcoming:
• Smart Home Phase 1 design review (tomorrow)
• Pharmacy mockups from Luxi (ETA 2026-07-23)

Dashboard: https://control-fleet.example/dashboard
```

---

## 🎯 IMPLEMENTATION PRIORITIES

**Phase 1 (MVP)**:
- [x] Webhook receiver + signature verification
- [x] Identity linking (account link flow)
- [x] Command parser (simple commands: /status, /logs, /report)
- [x] Outbound push (simple alerts + daily briefing)
- [x] Risk gate (Read/Low/Medium)
- [x] Database schema

**Phase 2 (Core)**:
- [ ] High-risk approval workflow
- [ ] Natural language intent decoder (Thai + English)
- [ ] Mission dispatcher (create contract → Hermes)
- [ ] Result reporting (rich messages + proof)
- [ ] Writeback (GitHub + Obsidian)

**Phase 3 (Advanced)**:
- [ ] Critical-risk 2FA (TOTP via LINE?)
- [ ] Scheduled reports (cron)
- [ ] Message history/archive
- [ ] Analytics dashboard (commands executed, success rate)
- [ ] Webhook retry logic + dead letter queue

---

## ✅ SUCCESS CRITERIA

**At MVP (Phase 1)**:
- [ ] Webhook receives LINE messages (verified)
- [ ] Signature verification working
- [ ] Identity linking complete (1 owner linked)
- [ ] /status command returns fleet summary
- [ ] Daily briefing pushes at 09:00
- [ ] No unauthorized access (permission gate working)

**At Phase 2**:
- [ ] 5+ commands working (/status, /logs, /report, /retry, /assign)
- [ ] Approval workflow tested (Medium-risk command requires approval)
- [ ] Natural language decode tested (Thai + English)
- [ ] Result messages formatted rich (with links, proof)
- [ ] Writeback to GitHub/Obsidian working

**At Phase 3**:
- [ ] Critical-risk operations protected (2FA)
- [ ] Scheduled reports running automatically
- [ ] 100+ missions dispatched via LINE
- [ ] Dashboard showing LINE command metrics
- [ ] Zero security incidents

---

## 🔗 INTEGRATION POINTS

| System | Interaction | Protocol |
|--------|-------------|----------|
| **Hermes** | Dispatch missions | Internal API |
| **Dashboard** | Link to mission results | HTTP link |
| **GitHub** | Writeback commits | GitHub API |
| **Obsidian/Notion** | Writeback logs | API/webhook |
| **Fleet Memory** | Store command history | File system (ψ/) |
| **Audit Log** | Record all actions | Database |
| **LINE Platform** | Send/receive messages | Webhook + API |

---

## 📞 HANDOFF TO DEV

**When ready**:
1. Provide LINE Channel credentials (from Developers Console)
2. Set up database (run migrations)
3. Deploy webhook server
4. Configure firewall (webhook URL must be public HTTPS)
5. Test account linking (1 admin user)
6. Enable in production

---

**Status**: Architecture complete  
**Next Phase**: Phase 2 (Implementation specs + database schema details)  
**Owner**: Ekkarat → Hermes (executor setup) → Dev team

---

*"LINE is the interface. Hermes is the executor. The contract is the safety net."*
