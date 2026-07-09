# GH Bridge Dispatch → Hermes

**From:** Tham / Brain-Orchestrator  
**To:** Hermes / Executor Only  
**Date:** 2026-07-09 Asia/Bangkok  
**Repository:** E0993599799/zeus-oracle  
**Mission:** Build and run a safe Obsidian → GitHub sync workflow for mission-control, with proof, logs, backup, clipboard summary, and no human-in-loop hang.

---

## 0) Role Contract

Hermes is executor only. Do not redesign the architecture unless execution is blocked.

Use the Forge chain:

1. Intent / Prompt Decode
2. Memory / Risk Gate
3. Contract
4. Executor
5. Proof
6. Dashboard
7. Obsidian / Notion / GitHub writeback

Do not mark mission COMPLETE / DONE / OK unless proof is written and verifiable.

---

## 1) User Intent

User wants to sync Obsidian Vault to GitHub.

Implement a PowerShell-first SFSR workflow that:

- Detects or accepts an Obsidian vault path.
- Initializes Git if missing.
- Creates or validates `.gitignore` for Obsidian-safe sync.
- Configures remote GitHub repo if not present.
- Runs `git pull --rebase` safely when remote exists.
- Runs `git add`, `git commit`, and `git push`.
- Writes proof/logs/backups into mission-control.
- Updates `tools/LAST_BACKUP_DIR.txt`.
- Copies final summary/proof to clipboard.
- Uses timeout/watchdog/no-hang safety.

---

## 2) Required Workspace / Staging

Workspace:

```text
D:\01 Main Work\Boots\Agentic AI\mission-control
```

Staging:

```text
D:\01 Main Work\Boots\Agentic AI\mission-control\backup\temp-time-load-doc
```

Generated SFSR file must be placed in staging as:

```text
OBSIDIAN_GH_SYNC_SFSR_V1.ps1.txt
```

---

## 3) Delivery Format Rules

Use Direct-Safe Add-Line Generator / Flat Add-Line SFSR Pattern.

- One file.
- One run.
- One error output path.
- PowerShell-first.
- No long console paste.
- Avoid nested here-string.
- Avoid broken quotes.
- Use `$add` or `[System.Collections.Generic.List[string]]::Add()` line-by-line generation.
- Background/no-window for any long-running child process.
- All child process calls must have timeout/watchdog/no-hang safety.

If script requires the user to run the next step manually, output exactly this style:

```text
NN NEXT TT  RUN : SFSR in clipboard
```

Then leave two blank lines.

Final clipboard result must include all proof and the last line must be:

```text
DONE!
```

---

## 4) Required Script Behavior

### Phase A — Validate Paths

Validate:

```text
D:\01 Main Work\Boots\Agentic AI\mission-control
D:\01 Main Work\Boots\Agentic AI\mission-control\backup\temp-time-load-doc
D:\01 Main Work\Boots\Agentic AI\mission-control\tools
D:\01 Main Work\Boots\Agentic AI\mission-control\tools\logs
```

Create missing `tools` and `tools\logs` if safe. Do not destroy user files.

### Phase B — Resolve Vault Path

Default candidate vault paths:

```text
D:\01 Main Work\Boots\Agentic AI\mission-control\obsidian
D:\01 Main Work\Boots\Agentic AI\mission-control\vault
D:\01 Main Work\Boots\Agentic AI\mission-control\memory
D:\01 Main Work\Boots\Agentic AI\mission-control
```

Pick the first existing folder containing either `.obsidian`, many `.md` files, `CLAUDE.md`, or `README.md`.

If no vault is detected, write RESULT=ERROR with clear next action and do not continue.

### Phase C — Backup / Audit

Create timestamped backup/proof folder under staging, for example:

```text
D:\01 Main Work\Boots\Agentic AI\mission-control\backup\temp-time-load-doc\OBSIDIAN_GH_SYNC_SFSR_V1_YYYYMMDD_HHMMSS
```

Write:

```text
summary.md
run.log
error.log
proof.json
git-status-before.txt
git-status-after.txt
git-remote.txt
```

Update:

```text
D:\01 Main Work\Boots\Agentic AI\mission-control\tools\LAST_BACKUP_DIR.txt
```

### Phase D — Obsidian Gitignore

Ensure `.gitignore` includes at least:

```gitignore
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.obsidian/cache/
.trash/
.DS_Store
Thumbs.db
.env
*.key
secrets/
private/
tools/logs/
backup/temp-time-load-doc/
node_modules/
.next/
dist/
build/
```

Preserve existing `.gitignore`; append missing lines only.

### Phase E — Git Init / Remote

If `.git` is absent, run:

```powershell
git init
git branch -M main
```

Remote handling:

- If `origin` exists, use it.
- If `origin` is missing, do not guess remote. Write `REMOTE_MISSING` in summary and produce next command template.
- Suggested remote template:

```powershell
git remote add origin https://github.com/OWNER/obsidian-vault.git
```

Do not inject tokens into remote URL.

### Phase F — Pull / Commit / Push

If remote exists:

1. `git fetch origin` with timeout.
2. `git pull --rebase origin main` if remote branch exists.
3. `git add .`
4. `git commit -m "Obsidian sync YYYY-MM-DD HH:mm:ss"`
   - If nothing to commit, record `NO_CHANGES` not error.
5. `git push -u origin main`.

All commands must capture stdout/stderr and exit codes.

### Phase G — Proof Criteria

Proof must include:

- `RESULT=OK` only if path validation passed and either:
  - push succeeded, or
  - no changes and remote is already valid, or
  - remote missing but script completed setup safely and next action is documented.
- `RESULT=ERROR` if git is missing, vault cannot be found, path invalid, pull conflicts, or push fails.
- `run_id`
- `backup_dir`
- `vault_path`
- `remote_status`
- `commit_status`
- `push_status`
- `git_status_after`
- `log_path`
- `error_path`

### Phase H — Clipboard

Copy final result to clipboard:

- Summary
- Backup path
- Proof path
- Next run command if needed
- Last line: `DONE!`

---

## 5) Obsidian Writeback Requirement

If `RESULT=OK`, create/update an Obsidian note under detected vault:

```text
Forge/Reports/OBSIDIAN_GH_SYNC_SFSR_V1_YYYYMMDD_HHMMSS.md
```

Content must include mission name, timestamp, result, backup path, Git remote status, commit/push result, proof location, and next action if any.

Then include that note in git commit if remote is available.

---

## 6) Risk Gate

Do not commit `.env`, `*.key`, secrets, private folders. Do not force push. Do not delete files. Do not rewrite user history. Do not assume repo owner/name. Do not store GitHub token in a file. Do not claim success without proof.

---

## 7) Expected Hermes Output

```text
RESULT=<OK|ERROR>
RUN_ID=<...>
BACKUP=<...>
SCRIPT=<...>
PROOF=<...>
SUMMARY=<...>
NEXT=<...>
```

If manual run is needed, include:

```text
NN NEXT TT  RUN : SFSR in clipboard
```

Then two blank lines.

Last line of copied clipboard text:

```text
DONE!
```
