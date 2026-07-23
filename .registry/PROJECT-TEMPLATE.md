# Project Registry Template

Copy this template when creating a new project.

---

## Step 1: Create PROJECT.md

**File**: `PROJECT.md`

```markdown
# Project: [NAME]

## ข้อมูลพื้นฐาน
- **Name**: [project-name]
- **Type**: commercial|system|hybrid
- **Owner**: E0993599799
- **Description**: [1-line description]
- **Status**: 🟢 active | 🟡 blocked | 🔴 inactive
- **Created**: YYYY-MM-DD
- **Deadline**: YYYY-MM-DD (if applicable)

## Team & Roles
- **Owner**: Ekkarat (พี่เอก)
- **Lead Oracle**: [oracle-name]
- **Contact**: ekkarat.mee@gmail.com

## Key Links
- **Repo**: https://github.com/E0993599799/[project-name]
- **Architecture**: [architecture.md](architecture.md)
- **Requirements**: [REQUIREMENTS.md](REQUIREMENTS.md)
- **Registry**: [.registry/](.registry/)

## Critical Info
- Status: [current status]
- Last Updated: YYYY-MM-DD

## Files in .registry/
- `project.json` - Metadata
- `architecture.json` - Tech stack
- `status.json` - Current status
```

---

## Step 2: Create architecture.md

**File**: `architecture.md`

```markdown
# Architecture: [project-name]

## Type
commercial | system | hybrid

## Tech Stack
- **Frontend**: [list]
- **Backend**: [list]
- **Database**: [list]
- **Deployment**: [list]

## System Design
```
[ASCII diagram or description]
```

## Key Components
- Component 1: [description]
- Component 2: [description]

## Critical Dependencies
- Depends on: [projects]
- Consumed by: [projects]

## Deployment Strategy
- Primary: [target]
- Fallback: [target]
- CI/CD: [pipeline]

## Known Issues
- Issue 1: [status]
- Issue 2: [status]
```

---

## Step 3: Create REQUIREMENTS.md

**File**: `REQUIREMENTS.md`

```markdown
# Requirements: [project-name]

## Functional Requirements
- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3

## Non-Functional Requirements
- [ ] Performance (response time, uptime)
- [ ] Security (auth, validation, encryption)
- [ ] Reliability (backups, recovery)
- [ ] Scalability (concurrent users, data volume)

## Acceptance Criteria

### MVP (Phase 1)
- [ ] Criterion 1
- [ ] Criterion 2

### Integration (Phase 2)
- [ ] Criterion 1
- [ ] Criterion 2

### Production (Phase 3)
- [ ] Security audit
- [ ] Load testing
- [ ] Documentation complete
```

---

## Step 4: Create .registry/project.json

**File**: `.registry/project.json`

```json
{
  "name": "[project-name]",
  "type": "commercial|system|hybrid",
  "created_at": "YYYY-MM-DDTHH:MM:SS+07:00",
  "last_updated": "YYYY-MM-DDTHH:MM:SS+07:00",
  "repo": "https://github.com/E0993599799/[project-name]",
  "owner": "E0993599799",
  "contact": "ekkarat.mee@gmail.com",
  "status": "active|blocked|inactive",
  "files": {
    "project": "PROJECT.md",
    "architecture": "architecture.md",
    "requirements": "REQUIREMENTS.md",
    "registry": ".registry/"
  }
}
```

---

## Step 5: Create .registry/status.json

**File**: `.registry/status.json`

```json
{
  "project": "[project-name]",
  "timestamp": "YYYY-MM-DDTHH:MM:SS+07:00",
  "status": "active|blocked|inactive",
  "phase": "planning|development|testing|deployment|production",
  "last_commit": "YYYY-MM-DD",
  "metrics": {
    "registry_version": "1.0",
    "created": "YYYY-MM-DD"
  }
}
```

---

## Step 6: Commit

```bash
git add PROJECT.md architecture.md REQUIREMENTS.md .registry/
git commit -m "feat: Project registry initialized

Type: [commercial|system|hybrid]
Status: [status]

Co-Authored-By: Claude Zeus Oracle <noreply@anthropic.com>"
```

---

## Checklist for New Projects

- [ ] Created PROJECT.md
- [ ] Created architecture.md
- [ ] Created REQUIREMENTS.md
- [ ] Created .registry/project.json
- [ ] Created .registry/status.json
- [ ] Committed with `feat: ...` message
- [ ] Added to PROJECT-REGISTRY-INDEX.md
- [ ] Updated PROJECT-REGISTRY-METRICS.md

Done! 🎯
