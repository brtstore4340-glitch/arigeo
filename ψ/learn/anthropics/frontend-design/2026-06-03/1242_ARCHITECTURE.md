# Architecture — frontend-design Plugin

**Source**: anthropics/claude-plugins-official/plugins/frontend-design
**Date**: 2026-06-03 12:42

---

## Directory Structure

```
plugins/frontend-design/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata (name, author)
├── LICENSE                  # Apache 2.0 (assumed)
├── README.md                # User-facing intro + usage examples
└── skills/
    └── frontend-design/
        └── SKILL.md         # The actual skill prompt/instructions
```

## Entry Point

`skills/frontend-design/SKILL.md` — this is the skill Claude loads and executes when triggered.

## Plugin Metadata (`plugin.json`)

```json
{
  "name": "frontend-design",
  "description": "Frontend design skill for UI/UX implementation",
  "author": { "name": "Anthropic", "email": "support@anthropic.com" }
}
```

## Core Abstraction

Single-skill plugin. No external dependencies. No runtime code.

The "architecture" IS the prompt — `SKILL.md` contains structured instructions that guide Claude's design thinking process:

```
1. Design Thinking phase (before coding)
   └── Purpose → Tone → Constraints → Differentiation

2. Implementation phase
   └── Produces: HTML/CSS/JS, React, Vue, etc.
```

## Trigger Condition

```yaml
description: "...Use this skill when the user asks to build web components, pages, or applications."
```

Auto-triggers on any frontend build request — no slash command required.

## Authors

- Prithvi Rajasekaran (prithvi@anthropic.com)
- Alexander Bricken (alexander@anthropic.com)
