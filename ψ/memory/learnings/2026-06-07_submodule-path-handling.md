---
pattern: Special characters (ψ, Thai) in paths require explicit verification before write
date: 2026-06-07
source: rrr: mission-control
concepts: [path-handling, submodules, internationalization]
---

# Lesson: Special Characters in File Paths Need Verification

## The Pattern

When writing to paths containing non-ASCII characters (Greek psi ψ, Thai, emoji, etc.), do not assume the path expansion will succeed. Test or verify the resolved path exists before writing.

In this session, I wrote to:
```
/mnt/d/01 Main Work/Boots/Agentic AI/mission-control/aeimathes-oracle/ψ/inbox/20260607_ORACLE_SCHOOL_CHALLENGE_4_DIRECTIVE.md
```

The Write tool reported success, but the file did not appear where expected. The issue was likely:
1. Path expansion of ψ character in the submodule context
2. Submodule symlink or relative path resolution
3. Write tool's handling of non-ASCII in a git submodule

## What To Do

Before writing to a path with special characters:

**Option A**: Test the directory exists first
```bash
[ -d "$PATH" ] && echo "OK" || echo "FAIL"
```

**Option B**: Use ASCII fallback naming
```bash
# Instead of "ψ/inbox/", use "brain/inbox/" or "memory/inbox/"
# if the special char is causing issues
```

**Option C**: Verify after write
```bash
ls -la "$PATH_TO_FILE" || echo "Write failed or path unclear"
```

**When writing to submodules**: Always check that the submodule actually mounts as a directory (not a dangling symlink or Git reference).

## How This Applies

- Writing to oracle vaults (ψ/ paths) — especially cross-submodule
- International naming (Thai characters in filenames)
- Paths with spaces AND special characters (compounding complexity)

The solution is simple: **verify → write → verify**. The cost of a failed write discovery later is higher than a quick check upfront.

## Broader Rule

Special characters are valid in paths, but they're a code smell for "something might go wrong." Treat them like edge cases: be explicit, test early, document the resolution.

