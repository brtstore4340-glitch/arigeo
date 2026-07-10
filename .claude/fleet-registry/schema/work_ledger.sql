-- ==============================================================================
-- Fleet Work Ledger & Lease Management Schema (Phase 3)
-- Database: trans_4340_[DATE].sqlite
-- ==============================================================================

-- 1. Tasks Ledger (The "What")
-- บันทึกงานทั้งหมดที่ต้องทำ สถานะ และใครเป็นผู้ถือสิทธิ์ (Lease) อยู่
CREATE TABLE IF NOT EXISTS fleet_tasks (
    task_id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,       -- อ้างอิงจาก PROJECT_REGISTRY
    task_type TEXT NOT NULL,        -- เช่น 'code_review', 'db_migration', 'api_build'
    payload JSON,                   -- ข้อมูลหรือ Parameters ที่ต้องใช้ทำงาน
    status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, CLAIMED, COMPLETED, FAILED, CANCELLED
    owner_agent TEXT,               -- ชื่อ Agent ที่รับงานนี้ไป (เช่น 'Tham', 'Codex-01')
    lease_expires_at DATETIME,      -- เวลาที่สิทธิ์การถือครองงานนี้จะหมดอายุ (TTL)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index สำหรับค้นหางานที่ยังว่าง และงานที่ Lease หมดอายุ (Zombie Tasks)
CREATE INDEX idx_tasks_status ON fleet_tasks(status, lease_expires_at);

-- 2. Audit Trail (The "Receipts")
-- บันทึกทุกความเคลื่อนไหวอย่างละเอียด (Append-Only)
CREATE TABLE IF NOT EXISTS fleet_audit_log (
    log_id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,          -- เชื่อมกับ fleet_tasks
    agent_id TEXT NOT NULL,         -- ใครเป็นคนทำ
    action_type TEXT NOT NULL,      -- เช่น 'CLAIM_TASK', 'TOOL_CALL', 'TASK_COMPLETE', 'LEASE_EXPIRED'
    details JSON,                   -- รายละเอียด (เช่น Tool input/output, Error message, หรือ Tokens ที่ใช้)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES fleet_tasks(task_id)
);

CREATE INDEX idx_audit_task ON fleet_audit_log(task_id);

-- 3. Global Context Sync (The "Shared Brain")
-- แหล่งรวมความจำกลาง (Context) ที่ Agent ทุกตัวต้องโหลดอ่านก่อนเริ่มงาน
CREATE TABLE IF NOT EXISTS fleet_global_context (
    key TEXT PRIMARY KEY,           -- เช่น 'CURRENT_PHASE', 'CRITICAL_ALERTS', 'ACTIVE_OUTAGE'
    value JSON NOT NULL,            -- ข้อมูล
    updated_by TEXT NOT NULL,       -- Agent ที่อัปเดตข้อมูลนี้ล่าสุด
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- Example Queries (Reconciliation & Workflows)
-- ==============================================================================

-- [1] Agent Claiming a Task (ด้วยการต่ออายุ Lease 15 นาที)
-- UPDATE fleet_tasks 
-- SET status = 'CLAIMED', owner_agent = 'Aris', lease_expires_at = datetime('now', '+15 minutes'), updated_at = CURRENT_TIMESTAMP 
-- WHERE task_id = 'T-1001' AND (status = 'PENDING' OR lease_expires_at < datetime('now'));

-- [2] Reconciliation Worker (ดึงงาน Zombie กลับเข้า Pool)
-- UPDATE fleet_tasks
-- SET status = 'PENDING', owner_agent = NULL, lease_expires_at = NULL, updated_at = CURRENT_TIMESTAMP
-- WHERE status = 'CLAIMED' AND lease_expires_at < datetime('now');
