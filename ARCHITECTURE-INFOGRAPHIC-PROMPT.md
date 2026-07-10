# AI Image Generator Prompt: Multi-Agent System (MAS) Architecture Infographic

> **คำแนะนำการใช้งาน:** ก๊อปปี้ข้อความภาษาอังกฤษในส่วน **[Midjourney / DALL-E 3 Prompt]** ไปวางใน AI สร้างภาพ (เช่น Midjourney, DALL-E 3, Stable Diffusion) หรือใช้เป็นบรีฟให้กับ AI แนวทำ Diagram (เช่น Napkin.ai, Eraser.io, Claude 3.5 Sonnet Artifacts) ได้เลยครับ

---

## 🎨 [Option 1: Prompt สำหรับ AI วาดภาพ (Midjourney / DALL-E 3)]
**Style:** 3D Isometric, Clean Futuristic Corporate Tech, Blueprint glow.

**Copy Text Below:**
```text
A highly detailed, professional 3D isometric infographic illustrating a futuristic "Multi-Agent System Architecture". The aesthetic should be clean corporate sci-fi, with dark backgrounds, glowing neon blue, cyan, and amber accents. High resolution, hyper-detailed, unreal engine 5 render style.

The layout is divided into 4 distinct vertical layers connected by glowing data streams:

Layer 1 (Top) - "Fleet Command": Two glowing AI core nodes labeled "Zeus" and "Tham" overseeing the entire system. They are emitting signals downwards.

Layer 2 (Middle-Upper) - "The Shared Brain & Registry": A central glowing document icon representing "PROJECT_REGISTRY" and a JSON tree representing "oracles.json". This layer has a protective shield around it, symbolizing "No Raw Secrets", connected to a secure external vault.

Layer 3 (Middle-Lower) - "The Work Ledger (SQLite)": A massive, solid cylindrical database structure. Inside or around it, three glowing tables are visible: "fleet_tasks" (showing lock/lease icons), "fleet_audit_log" (showing receipt/paper icons), and "fleet_global_context" (showing a glowing brain icon). A mechanical "Reconciliation Worker" drone is scanning this database, holding a stopwatch (representing Time-based Leases/TTL) and sweeping away zombie tasks.

Layer 4 (Bottom) - "The Agent Fleet": Multiple distinct robot/cyborg worker nodes (representing agents like Aris, Dheva, Luxi). 

Connections & Flow: Bright, animated light beams flow from Layer 3 (The Ledger) into the heads of the Agents in Layer 4, representing "Context Hydration" and "State Sync". The agents are also sending data beams back up to the "fleet_audit_log" database. 

The overall vibe is highly organized, deterministic, secure, and technologically advanced. No messy wires, only clean geometric light beams.
```

---

## 📊 [Option 2: Prompt สำหรับ AI แนวทำ Diagram / Flowchart (เช่น ChatGPT Data Analyst, Eraser.io, Napkin.ai)]
**Style:** Professional System Architecture Diagram

**Copy Text Below:**
```text
Please generate a highly detailed, professional system architecture diagram for our "Phase 3 Multi-Agent System (MAS)". Use a clean, modern tech stack aesthetic (dark mode with blue, green, and orange highlights).

The architecture consists of the following components and flows:

1. TOP LEVEL: "Fleet Command"
   - Node: "Zeus (Meta-Orchestrator)"
   - Node: "Tham (Governor)"
   - Flow: They manage and send high-level directives to the system.

2. SYSTEM CORE (The Coordination Fabric):
   This area contains two major blocks:
   
   Block A: "Shared Registry (Discovery & Metadata)"
   - Node: "oracles.json (Agent Manifest & Routing)"
   - Node: "PROJECT_REGISTRY.md (Metadata Map)"
   - Tag/Warning: "NO SECRETS STORED HERE - Environment Ref Only"

   Block B: "The Work Ledger (SQLite DB)"
   - Table: "fleet_global_context (The Shared Brain for hydration)"
   - Table: "fleet_tasks (Task Queue & Ownership/Leases)"
   - Table: "fleet_audit_log (Append-only receipts/actions)"

3. BACKGROUND WORKERS:
   - Node: "Reconciliation Worker"
   - Flow: Scans "fleet_tasks", checks TTL (Time-To-Live). If a lease expires, it revokes ownership and returns the task to the pool (Zombie Task cleanup).

4. WORKER LEVEL: "The Agent Fleet"
   - Nodes: Multiple agent instances (e.g., Aris, Dheva, Luxi, Teleos)
   
5. CRITICAL WORKFLOWS (Show with directional arrows):
   - "Context Hydration": Arrow from "fleet_global_context" & "oracles.json" TO "Agent Fleet" (Triggered upon /awaken).
   - "Claim & Lock": Arrow from "Agent Fleet" TO "fleet_tasks" (Agents acquiring a time-based lease).
   - "Audit Logging": Arrow from "Agent Fleet" TO "fleet_audit_log" (Agents writing their step-by-step receipts).

Layout should be top-down. Emphasize that the "Work Ledger (SQLite)" is the single source of truth that every agent must read from before acting.
```

---

## 🧩 ความหมายของสัญลักษณ์ในภาพ (เผื่อคุณต้องอธิบายให้ทีมหรือปรับแก้กราฟิก):
1. **The Shared Brain (สมองส่วนกลาง):** คือ `fleet_global_context` ที่ส่งข้อมูลไปอัปเดต Agent ทันทีที่ตื่น
2. **The Lock / Stopwatch (กุญแจ/นาฬิกาจับเวลา):** สัญลักษณ์ของ Lease Management ป้องกัน Agent กอดงานจนตาย (Zombie Task)
3. **The Shield (โล่):** แสดงถึงการทำ Metadata ที่ไม่มี Secret ปะปนอยู่
4. **The Ledger (สมุดบัญชี/ทรงกระบอก DB):** SQLite ที่เปรียบเสมือน Source of Truth เดียวของระบบ
