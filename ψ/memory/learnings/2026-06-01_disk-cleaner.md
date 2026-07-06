---
pattern: "Learned gccszs/disk-cleaner: 3D file classification, SafetyChecker pre-deletion, incremental scan cache for 10x speedup"
date: 2026-06-01
source: "learn: gccszs/disk-cleaner"
concepts: ["learn", "disk-cleanup", "python", "file-scanner", "cross-platform", "safety"]
---

# Learned gccszs/disk-cleaner

- **Pure stdlib Python** — no pip deps beyond dev tools; `diskcleaner/` has 6 modules, 280+ LOC core
- **3D classification**: every file scored on type × risk × age before any action — SafetyChecker verifies locks + permissions + protected paths before deletion
- **Incremental cache**: `CacheManager` snapshots scan state → 10x speedup on repeated runs; concurrent scan via ThreadPoolExecutor, parallel hashing via ProcessPoolExecutor
- **8 CLI entry points**: `clean_disk.py`, `analyze_disk.py`, `analyze_progressive.py`, `find_duplicates.py`, `interactive_wizard.py`, `monitor_disk.py`, `organize_files.py`, `scheduler.py`
- **Platform-specific cleanup**: Windows WMI process detection + registry cache paths; Linux lsof + APT/pacman; macOS lsof + Homebrew
