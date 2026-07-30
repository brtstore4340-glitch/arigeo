# Project Registry Index

**Created**: 2026-07-20  
**Total Projects**: 8  
**Registry Version**: 1.0

---

## Projects by Type

### Commercial (2)
| Project | Status | Link |
|---------|--------|------|
| **cms-arigeo** | 🟡 deployment-blocked | [PROJECT.md](../cms-arigeo/PROJECT.md) |
| **dheva-oracle** | 🟢 active | [PROJECT.md](../dheva-oracle/PROJECT.md) |

### System/Infrastructure (6)
| Project | Role | Link |
|---------|------|------|
| **zeus-oracle** (root) | Meta-Orchestrator | [PROJECT.md](./PROJECT.md) |
| **khun-ram-oracle** | Thai Documentation Authority | [PROJECT.md](../khun-ram-oracle/PROJECT.md) |
| **aris-oracle** | Code Review & Quality | [PROJECT.md](../aris-oracle/PROJECT.md) |
| **omega-oracle** | Bridge & Integration | [PROJECT.md](../omega-oracle/PROJECT.md) |
| **aeimathes-oracle** | Fleet Memory & Delivery | [PROJECT.md](../aeimathes-oracle/PROJECT.md) |
| **all-oracle** | Fleet Scribe | [PROJECT.md](../all-oracle/PROJECT.md) |

---

## Registry Structure (Each Project)

```
project/
├── PROJECT.md              # Project profile
├── architecture.md         # System design & tech stack
├── REQUIREMENTS.md         # Functional/non-functional requirements
└── .registry/
    ├── project.json        # Machine-readable metadata
    └── status.json         # Current project status
```

---

## Key Classifications

| Attribute | Values |
|-----------|--------|
| **Type** | commercial, system, hybrid |
| **Status** | 🟢 active, 🟡 blocked, 🔴 inactive |
| **Language** | TypeScript/JavaScript, Markdown/Docs |
| **Owner** | E0993599799 (Ekkarat) |

---

## Critical Dependencies

```
zeus-oracle (root)
  ├─ cms-arigeo (commercial)
  │  └─ captain-maid (commercial subproject)
  │
  ├─ dheva-oracle (commercial)
  │  └─ orry-website (commercial subproject)
  │
  └─ Oracle Agents (system)
     ├─ khun-ram-oracle (Thai authority)
     ├─ aris-oracle (code review)
     ├─ omega-oracle (integration)
     ├─ aeimathes-oracle (memory)
     └─ all-oracle (scribe)
```

---

## Governance Rules

✅ **Per project**:
- Stored in PROJECT.md + .registry/
- Machine-readable (JSON)
- Version controlled
- Updated on each change

✅ **Type Classification**:
- **commercial**: Revenue-generating, client-facing
- **system**: Infrastructure, governance, fleet services
- **hybrid**: Both (e.g., zeus-oracle)

✅ **Registry Requirements**:
- Architecture documented
- Requirements specified
- Status tracked
- Commits tagged `registry: ...`

---

## Next Steps

1. ✅ Registries created for all 8 projects
2. ✅ Committed with `registry: ...` tag
3. 🟡 **Recommended**: Link registries to fleet dashboard
4. 🟡 **Recommended**: Automate registry updates on git commits
5. 🟡 **Recommended**: Set up project metrics tracking

---

**Status**: ✅ Complete  
**Authority**: E0993599799 (Ekkarat)  
**Contact**: ekkarat.mee@gmail.com

Last Updated: 2026-07-20 GMT+7
