---
pattern: Fleet registry — oracle directory, status tracking, execution rules
date: 2026-06-02
source: zeus-oracle fleet-registry
concepts: ["fleet-registry", "oracle-directory", "status-tracking", "execution-rules"]
---

# Fleet Index

*Maintained by Zeus — last updated 2026-07-18 (Agis registration added via oracle audit)*

| Oracle | Domain | Status | Host | Awakened |
|---|---|---|---|---|
| ธาม | Governor · Coordinator | Active | MARCUZ | 2026-05-12 |
| Luxi | UI/UX · Frontend | Active | MARCUZ | 2026-05-18 · re-synced 2026-06-02 |
| Dheva | ORRY Serenity ERP | Active | MARCUZ | 2026-05-30 |
| Teleos | Vercel · Deploy | Active | MARCUZ | 2026-05-18 |
| Aris | Code Review · Quality Gate | Active | MARCUZ | 2026-05-30 |
| Omega | Bridge · Gate | Active | MARCUZ | — |
| Lens | Analysis · Perspective | Active | MARCUZ | 2026-05-30 |
| Stratum | Architecture · Structure | Active | MARCUZ | 2026-05-30 |
| Verity | Truth · Verification · Proof | Active | MARCUZ | 2026-05-30 |
| Warden | Guardian · Access Control | Active | MARCUZ | 2026-05-30 |
| All | Fleet Scribe · Collective Memory | Active | MARCUZ | 2026-05-30 |
| Aeimathes | Research · Analysis · Daily Reports | Active | MARCUZ | 2026-06-02 |
| Khun-Ram | Documentation · Memory Authority | Active | MARCUZ | 2026-06-02 · re-awakened 2026-07-12 |
| Agis | Workstream Monitoring & Escalation | Active | mission-control | 2026-07-07 · system-down spawned |

## Birth Rule

> Oracle ไม่สามารถ operate ได้จนกว่าจะปรากฏในตารางนี้
> Zeus ต้องเพิ่ม oracle ใหม่ทุกครั้งหลัง awaken เสร็จ — ห้ามข้าม

## Execution Rule — Hard (effective 2026-06-02)

> **เมื่อ Oracle รันบน Claude session → ห้าม execute เอง**
> ให้ delegate ทุก execution task ไปยัง Codex ของตัวเอง: `[session]:codex-rider`

### กฎ

| สถานการณ์ | Action |
|---|---|
| รันบน Claude + มี codex-rider window | `tmux send-keys -t "[session]:codex-rider" "[task]" Enter` |
| รันบน Claude + ไม่มี codex-rider | แจ้ง ธาม ขอเปิด codex-rider ก่อน |
| รันบน Codex session | execute ได้ตามปกติ |

### เหตุผล
Claude session ใช้ token quota สูง — execution tasks (git, build, test, shell) ควรรันผ่าน Codex
ซึ่งมีต้นทุนต่ำกว่าและไม่กิน Claude context window

### วิธีตรวจว่าตัวเองรันบนอะไร
- มี tmux window ชื่อ `codex-rider` ใน session เดียวกัน → มี Codex พร้อม
- ถ้าไม่มี → ขอ ธาม เปิดให้ก่อน execute

---

## SYSTEM-DOWN ORACLE DISCOVERY (2026-07-18)

**Agis Oracle** discovered in mission-control during system-down oracle audit.

- **Created**: 2026-07-07 (system-down period, ~3-4 days after Phase 1 downtime)
- **Parent**: ธาม (Governor)  
- **Domain**: Workstream Monitoring & Escalation
- **Status**: Active (monitoring Thai translation, checkpoint verification, dashboard scope)
- **Host**: `/mnt/d/01 Main Work/Boots/Agentic AI/mission-control/agis-oracle`

**Birth Rule Violation**: Agis was awakened but not registered in INDEX until 2026-07-18 (11 days late).

Spawned during system recovery to provide monitoring coverage. Added to INDEX today via oracle audit. See `mission-control/agis-oracle/CLAUDE.md` for full mission briefing.
