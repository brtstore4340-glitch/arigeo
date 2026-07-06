# disk-cleaner Learning Index

## Source
- **Origin**: ./origin/
- **GitHub**: https://github.com/gccszs/disk-cleaner

## Explorations

### 2026-06-01 1419 (default — 3 agents)
- [[2026-06-01/1419_ARCHITECTURE|Architecture]]
- [[2026-06-01/1419_CODE-SNIPPETS|Code Snippets]]
- [[2026-06-01/1419_QUICK-REFERENCE|Quick Reference]]

**Key insights**:
- Pure Python 3.6+ stdlib only — zero external dependencies; installs anywhere
- Core pattern: 3D file classification (type × risk × age) → SafetyChecker → deletion; never deletes without verify
- `SmartCleanupEngine` orchestrates incremental scan cache (10x speedup on repeat) + ThreadPoolExecutor + ProcessPoolExecutor for parallel hashing
