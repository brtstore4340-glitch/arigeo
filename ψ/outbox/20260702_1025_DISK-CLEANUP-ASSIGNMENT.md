---
from: ធាម-Zeus
assigned_to: System Maintenance / Operations
date: 2026-07-02
priority: medium
type: system-maintenance
task_id: DISK-CLEANUP-C-DRIVE-20260702
---

# System Maintenance: Clean Disk Space on C: Drive

**Priority**: Medium  
**Task ID**: DISK-CLEANUP-C-DRIVE-20260702  
**Assigned by**: ធាม-Zeus  
**Date**: 2026-07-02 10:25 UTC+7

---

## Objective

Clean up disk space on C: drive to improve system performance. **CONSTRAINT: Do NOT delete any picture/image files.**

---

## What CAN Be Deleted

✅ **Safe to Delete**:
- Temporary files (`C:\Windows\Temp\`, `C:\Users\{user}\AppData\Local\Temp\`)
- Windows Update cache (`C:\Windows\SoftwareDistribution\Download\`)
- Recycle bin contents
- Browser cache (`AppData\Local\{Browser}\Cache\`)
- Application logs older than 30 days
- Old backup files (not current backups)
- Duplicate files (not system files)
- Windows prefetch files (optional, system-safe)

---

## What CANNOT Be Deleted

🚫 **Protected**:
- Any `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.webp`, `.tiff`, `.raw` files
- Pictures, Photos, Screenshots, Downloads, Documents folders (user files)
- System32, Program Files directories
- Active application files
- Current Windows installation files

---

## Process

1. **Scan** — Use disk analyzer tool (e.g., TreeSize, WizTree, or Windows Storage Sense) to identify large temp/cache files
2. **Report** — Show what will be deleted, how much space freed, confirm no pictures affected
3. **Backup** — Optional: backup critical temp data if needed
4. **Delete** — Remove identified files
5. **Verify** — Confirm deletion successful, pictures still intact
6. **Report Results** — Space freed, files removed, system status

---

## Tools Available

- **Windows Storage Sense** — Built-in, safe, can target specific types
- **Disk Cleanup Utility** (`cleanmgr.exe`) — Safe, selective deletion
- **TreeSize/WizTree** — Shows what's using space
- **Manual cleanup** — Command line (safe if careful)

---

## Success Criteria

✅ Minimum 2 GB freed (or as much as possible safely)  
✅ Zero picture files deleted  
✅ System remains stable after cleanup  
✅ Report showing: space freed, files removed, time taken

---

## Timeline

- Start: ASAP
- Duration: ~1-2 hours (depending on disk size and cleanup method)
- Report due: End of today (2026-07-02)

---

## Contact

Questions or blockers? Report to ធាម-Zeus.

---

**Status**: Ready for assignment  
**Approval**: ធាម-Zeus (Chief of Staff)
