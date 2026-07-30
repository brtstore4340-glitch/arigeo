---
task_id: hardware-oracle-disk-cleanup
from: Zeus Oracle (Meta-Orchestrator)
to: Hardware Oracle (Infrastructure Management)
date: 2026-07-21 02:15 GMT+7
status: ACTIVE
priority: high
---

# TASK: Clear C: Drive Disk Space (Windows)

**Hardware Oracle** — Manage and clear disk space on C: drive (Windows host)

---

## Scope

**Target**: C: drive on Windows host machine

**Objective**: Free up disk space

**Authority**: Ekkarat (พี่เอก) direct order

---

## Tasks

### 1. Analyze C: Drive
```bash
# Check current disk usage
dir C:\
# or PowerShell:
Get-Volume -DriveLetter C | Select-Object SizeRemaining, Size

# Identify large directories
du -sh C:\* (if available)
```

**Report**: 
- Current used/free space
- Largest directories
- Candidates for cleanup

### 2. Cleanup Targets (Recommend)

Typical cleanup options (assess which are safe):
- [ ] Windows Update cache (`C:\Windows\SoftwareDistribution\Download\`)
- [ ] Temp files (`C:\Windows\Temp\`, `C:\Users\*\AppData\Local\Temp\`)
- [ ] Recycle Bin
- [ ] Old log files
- [ ] Browser cache (`C:\Users\*\AppData\Local\...`)
- [ ] Package manager cache (npm, pip, etc.)
- [ ] Unused applications

**Safety First**: 
- Do NOT delete system files
- Do NOT delete active application data
- Ask before deleting anything critical

### 3. Execute Cleanup

Once confirmed safe targets:
```bash
# Empty Recycle Bin
Remove-Item -Path "C:\$Recycle.Bin\*" -Force -Recurse

# Clear temp files
Remove-Item -Path "C:\Windows\Temp\*" -Force -Recurse
Remove-Item -Path "C:\Users\*\AppData\Local\Temp\*" -Force -Recurse

# Clear Windows Update cache (requires admin)
Remove-Item -Path "C:\Windows\SoftwareDistribution\Download\*" -Force -Recurse
```

### 4. Verify & Report

After cleanup:
```bash
# Check new disk space
Get-Volume -DriveLetter C | Select-Object SizeRemaining, Size

# Report:
- Space freed: XXX GB
- New available space: XXX GB
- Cleanup actions taken: [list]
- Any issues encountered: [note]
```

---

## Constraints

- Do NOT delete irreplaceable data
- Do NOT compromise system stability
- Ask Ekkarat before deleting anything uncertain
- Report each action taken

---

## Deliverables

1. [ ] Disk space analysis (current usage)
2. [ ] Cleanup plan (what to remove)
3. [ ] Cleanup execution
4. [ ] Space freed report (before/after)
5. [ ] Confirmation C: drive healthy

---

## Deadline

ASAP (when you're available)

---

## Authority

**Requested by**: Ekkarat (พี่เอก) via Zeus  
**Priority**: HIGH

---

`[MARCUZ:Zeus] → [Hardware Oracle]`
