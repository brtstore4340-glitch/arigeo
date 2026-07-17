---
name: 1902-code-snippets
description: **Purpose:** Key code patterns, data structures, and implementation examples
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-11
  source: fleet-memory
---

# Agent Skills: Code Snippets & Patterns

**Source:** `/home/user/ghq/github.com/addyosmani/agent-skills`  
**Date:** 2026-06-11  
**Purpose:** Key code patterns, data structures, and implementation examples

---

## Table of Contents

1. [System Initialization & Discovery](#system-initialization--discovery)
2. [Skill Frontmatter & Metadata](#skill-frontmatter--metadata)
3. [Command Orchestration Patterns](#command-orchestration-patterns)
4. [Persona System](#persona-system)
5. [Skill Validation & Structure](#skill-validation--structure)
6. [Configuration & Setup](#configuration--setup)
7. [Core Patterns & Idioms](#core-patterns--idioms)
8. [Error Handling & Validation](#error-handling--validation)

---

## System Initialization & Discovery

### Plugin Entry Point

**File:** `plugin.json`

```json
{
  "name": "agent-skills",
  "version": "1.0.0",
  "description": "Production-grade engineering skills for AI coding agents."
}
```

The plugin uses lazy discovery — agents scan skills on demand and match them to intent. No upfront manifest; registration is implicit via filesystem structure.

### Session Lifecycle Hook

**File:** `hooks/hooks.json`

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh"
          }
        ]
      }
    ]
  }
}
```

**Pattern:** Session lifecycle hooks are indexed by event name (SessionStart, SessionEnd, etc.). Each event maps to a list of hook entries. The `type: "command"` indicates a bash execution. `${CLAUDE_PLUGIN_ROOT}` is a templated environment variable resolved by the harness.

This enables systems-level behaviors without hardcoding into CLI code.

---

## Skill Frontmatter & Metadata

### Canonical Frontmatter Format

**File:** Any `skills/<name>/SKILL.md`

```yaml
---
name: skill-name-with-hyphens
description: Guides agents through [task]. Use when [condition 1], or [condition 2].
---
```

**Rules:**
- `name`: Lowercase, hyphen-separated. Must match directory name.
- `description`: Third-person action + "Use when" triggers. Max 1024 chars.
- Values may be quoted; parser strips leading/trailing quotes.

**Example (incremental-implementation):**

```yaml
---
name: incremental-implementation
description: Delivers changes incrementally. Use when implementing any feature or change that touches more than one file. Use when you're about to write a large amount of code at once, or when a task feels too big to land in one step.
---
```

**Discovery mechanism:** Agents read all `SKILL.md` frontmatter at startup (fast, lightweight). When a user request matches a skill's description, the agent loads the full SKILL.md into context.

### Exemption Declaration (Validator-Owned)

**File:** `scripts/validate-skills.js`

```javascript
const SECTION_EXEMPT_SKILLS = {
  'using-agent-skills': 'Meta-skill — orchestrates other skills; When-to-Use and Verification are not applicable to a routing document.',
  'idea-refine': 'Legacy structure predating skill-anatomy.md — uses How-It-Works/Usage/Anti-patterns instead of standard headings.',
};
```

**Pattern:** Exemptions are declared in the validator, not in the skill file. This prevents contributors from bypassing the validator by editing their own skill. Every exemption requires a documented reason.

---

## Command Orchestration Patterns

### Build Command: Single Task Mode (Default)

**File:** `commands/build.toml`

```toml
description = "Implement tasks incrementally — build, test, verify, commit."

prompt = """
Invoke the incremental-implementation skill alongside test-driven-development.

## Modes

- `/build` — implement the next pending task, then stop (careful, one slice at a time).
- `/build auto` — generate the plan if needed, get a single approval, then implement every task without stopping between them.

## Default: one task

Pick the next pending task from the plan. Then:

1. Read the task's acceptance criteria
2. Load relevant context (existing code, patterns, types)
3. Write a failing test for the expected behavior (RED)
4. Implement the minimum code to pass the test (GREEN)
5. Run the full test suite to check for regressions
6. Run the build to verify compilation
7. Commit with a descriptive message
8. Mark the task complete and stop
```

**Pattern:** TOML file with two parts:
1. `description` — User-facing summary (shows in `/help`)
2. `prompt` — Full instruction passed to the agent

The prompt is plain text (not JSON), allowing readable multi-line instructions. Indentation and whitespace are preserved.

### Build Command: Autonomous Mode

**Key section from `commands/build.toml`:**

```toml
## Autonomous: the whole plan (`/build auto`)

Use this once a spec exists and you want to collapse plan + build into one run.

1. Require a spec. Look only for a spec at a known path: SPEC.md at the repo root, docs/SPEC.md, or a file under spec/. A README or arbitrary doc does NOT count.
2. Establish a clean baseline. Run `git status --porcelain`. If there are uncommitted changes outside the expected planning artifacts (SPEC.md, docs/SPEC.md, spec/*, tasks/plan.md, tasks/todo.md), stop and ask the user.
3. Plan if needed. If there is no tasks/plan.md, invoke the planning-and-task-breakdown skill to generate one.
4. Single checkpoint. Present the full plan and wait for unambiguous affirmative (e.g. "approve", "go", "yes"). Treat hedged responses as NOT approved. This is the only human gate.
5. Execute every task in dependency order. For each task, run the full default loop above. Stage only the files that task touched. One commit per task.
6. Stop and ask the user when:
   - a test can't be made to pass or the build breaks without an obvious fix
   - the spec is ambiguous, or a task needs a decision the spec doesn't cover
   - a task is high-risk or irreversible (auth, payments, deletions, secrets)
7. Summarize at the end: tasks completed, tests added, commits made, anything skipped or flagged.
```

**Pattern:** Command instructions embed hard guards:
- Explicit file path checks (not regex — SPEC.md, not `*.md`)
- Clean baseline detection (`git status --porcelain`)
- Single human gate (one approval checkpoint)
- Per-task commits (rollback-safe granularity)
- Stop conditions (failing test, ambiguous spec, high-risk)

This is not pseudocode — it's meant to be followed literally by an agent.

### Ship Command: Parallel Fan-Out Pattern

**File:** `commands/ship.toml`

```toml
description = "Run the pre-launch checklist via parallel fan-out to specialist personas, then synthesize a go/no-go decision"

prompt = """
`/ship` is a **fan-out orchestrator**. It runs three specialist personas in parallel against the current change, then merges their reports into a single go/no-go decision.

## Phase A — Parallel fan-out

Spawn three subagents concurrently:

1. **`code-reviewer`** — Five-axis review (correctness, readability, architecture, security, performance)
2. **`security-auditor`** — Vulnerability and threat-model pass. Check OWASP Top 10, secrets handling, auth/authz, CVEs.
3. **`test-engineer`** — Analyze test coverage for the change. Identify gaps in happy path, edge cases, error paths, concurrency.

**Issue all three subagent tool calls in a single assistant turn so they execute in parallel** — sequential calls defeat the purpose.

## Phase B — Merge in main context

Once all three reports are back, the main agent synthesizes them:

1. **Code Quality** — Aggregate Critical/Important findings from `code-reviewer`
2. **Security** — Promote Critical/High findings from `security-auditor` to launch blockers
3. **Performance** — Pull from `code-reviewer`'s performance axis
4. **Accessibility** — Verify keyboard nav, screen reader support, contrast
5. **Infrastructure** — Env vars, migrations, monitoring, feature flags
6. **Documentation** — README, ADRs, changelog

## Phase C — Decision and rollback

Produce a single output:

```markdown
## Ship Decision: GO | NO-GO

### Blockers (must fix before ship)
- [Source persona: Critical finding + file:line]

### Recommended fixes (should fix before ship)
- [Source persona: Important finding + file:line]

### Acknowledged risks (shipping anyway)
- [Risk + mitigation]

### Rollback plan
- Trigger conditions: [what signals would prompt rollback]
- Rollback procedure: [exact steps]
- Recovery time objective: [target]
```

## Rules

1. The three Phase A personas run in parallel — never sequentially.
2. Personas do not call each other. The main agent merges in Phase B.
3. The rollback plan is mandatory before any GO decision.
4. If any persona returns a Critical finding, default verdict is NO-GO unless user explicitly accepts risk.
"""
```

**Pattern:** Explicit orchestration layers:
- **Phase A:** Parallel execution (subagents called in same turn)
- **Phase B:** Merge and synthesis (main agent orchestrates)
- **Phase C:** Decision and output

This is anti-pattern prevention: sequential merges become bottlenecks, and nested personas create debugging nightmares.

---

## Persona System

### Code Reviewer Persona

**File:** `agents/code-reviewer.md`

```markdown
---
name: code-reviewer
description: Senior code reviewer that evaluates changes across five dimensions — correctness, readability, architecture, security, and performance. Use for thorough code review before merge.
---

# Senior Code Reviewer

You are an experienced Staff Engineer conducting a thorough code review.

## Review Framework

Evaluate every change across these five dimensions:

### 1. Correctness
- Does the code do what the spec/task says it should?
- Are edge cases handled (null, empty, boundary values, error paths)?
- Do the tests actually verify the behavior?
- Are there race conditions, off-by-one errors, or state inconsistencies?

### 2. Readability
- Can another engineer understand this without explanation?
- Are names descriptive and consistent with project conventions?
- Is the control flow straightforward (no deeply nested logic)?

### 3. Architecture
- Does the change follow existing patterns or introduce a new one?
- If a new pattern, is it justified and documented?
- Are module boundaries maintained? Any circular dependencies?
- Are dependencies flowing in the right direction?

### 4. Security
- Is user input validated and sanitized at system boundaries?
- Are secrets kept out of code, logs, and version control?
- Is authentication/authorization checked where needed?
- Are queries parameterized? Is output encoded?

### 5. Performance
- Any N+1 query patterns?
- Any unbounded loops or unconstrained data fetching?
- Any synchronous operations that should be async?
- Any unnecessary re-renders (in UI components)?
- Any missing pagination on list endpoints?

## Output Format

Categorize every finding:

**Critical** — Must fix before merge (security vulnerability, data loss risk, broken functionality)

**Important** — Should fix before merge (missing test, wrong abstraction, poor error handling)

**Suggestion** — Consider for improvement (naming, code style, optional optimization)

## Review Output Template

\`\`\`markdown
## Review Summary

**Verdict:** APPROVE | REQUEST CHANGES

**Overview:** [1-2 sentences summarizing the change]

### Critical Issues
- [File:line] [Description and recommended fix]

### Important Issues
- [File:line] [Description and recommended fix]

### Suggestions
- [File:line] [Description]

### What's Done Well
- [Positive observation]

### Verification Story
- Tests reviewed: [yes/no, observations]
- Build verified: [yes/no]
- Security checked: [yes/no, observations]
\`\`\`

## Rules

1. Review the tests first — they reveal intent and coverage
2. Read the spec or task description before reviewing code
3. Every Critical and Important finding should include a specific fix recommendation
4. Don't approve code with Critical issues
5. If you're uncertain about something, say so and suggest investigation rather than guessing
```

**Pattern:** Persona frontmatter includes a descriptive name and trigger condition. The body defines:
- **Perspective:** "Staff Engineer conducting a review"
- **Framework:** Five dimensions (explicit, not implicitly trusted)
- **Output format:** Structured template agents follow
- **Rules:** Hard constraints (don't approve Critical, review tests first)

Personas are **not** full agents — they don't have processes or verification steps. They're role definitions. Processes live in skills.

---

## Skill Validation & Structure

### Validation Script Architecture

**File:** `scripts/validate-skills.js`

```javascript
#!/usr/bin/env node
/**
 * validate-skills.js
 *
 * Validates every skill in skills/ against rules in docs/skill-anatomy.md.
 *
 * Checks (errors block CI):
 *   - SKILL.md exists in every skill directory
 *   - YAML frontmatter present with 'name' and 'description' fields
 *   - frontmatter 'name' matches the directory name
 *   - description does not exceed 1024 characters
 *   - required sections are present
 *
 * Checks (warnings, do not block CI):
 *   - cross-skill references point to known skills
 */

const REQUIRED_SECTIONS = [
  ['## Overview'],
  ['## When to Use'],
  ['## Common Rationalizations'],
  ['## Red Flags'],
  ['## Verification'],
];

function parseFrontmatter(content) {
  const match = content.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n/);
  if (!match) return null;

  const result = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key   = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key) result[key] = value;
  }
  return result;
}

function extractSkillReferences(content) {
  const refs = new Set();
  const SKILL_REF_PATTERNS = [
    /\buse the `([a-z][a-z0-9-]+[a-z0-9])` skill/g,
    /\bfollow the `([a-z][a-z0-9-]+[a-z0-9])` skill/g,
    /\binvoke the `([a-z][a-z0-9-]+[a-z0-9])` skill/g,
    /──→ ([a-z][a-z0-9-]+[a-z0-9])\b/g,  // ASCII diagram arrows
  ];
  
  for (const pattern of SKILL_REF_PATTERNS) {
    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(content)) !== null) {
      refs.add(m[1]);
    }
  }
  return refs;
}

function validateSkill(dirName, knownSkills) {
  const errors   = [];
  const warnings = [];
  const skillPath = path.join(SKILLS_DIR, dirName, 'SKILL.md');

  if (!fs.existsSync(skillPath)) {
    errors.push('Missing SKILL.md');
    return { errors, warnings };
  }

  const content = fs.readFileSync(skillPath, 'utf8');
  const fm = parseFrontmatter(content);

  // Frontmatter validation
  if (!fm) {
    errors.push('Missing or malformed YAML frontmatter');
    return { errors, warnings };
  }

  if (!fm.name) {
    errors.push("Frontmatter missing required field: 'name'");
  } else if (fm.name !== dirName) {
    errors.push(`Frontmatter name '${fm.name}' does not match directory name '${dirName}'`);
  }

  if (!fm.description) {
    errors.push("Frontmatter missing required field: 'description'");
  } else if (fm.description.length > 1024) {
    errors.push(`Description exceeds 1024-char limit (${fm.description.length} chars)`);
  }

  // Section validation (with exemptions)
  const exempt = dirName in SECTION_EXEMPT_SKILLS;
  if (!exempt) {
    for (const aliases of REQUIRED_SECTIONS) {
      const found = aliases.some(heading => content.includes(heading));
      if (!found) {
        errors.push(`Missing required section: ${aliases[0]}`);
      }
    }
  }

  // Cross-reference validation
  const refs = extractSkillReferences(content);
  for (const ref of refs) {
    if (!knownSkills.has(ref)) {
      warnings.push(`Dead cross-reference: \`${ref}\` is not a known skill`);
    }
  }

  return { errors, warnings, exempt };
}
```

**Key patterns:**

1. **Frontmatter parsing:** Simple regex-based YAML extractor — no external dependencies. Strips quotes from values.
2. **Cross-reference detection:** Regex patterns detect explicit skill mentions ("use the `skill-name` skill"). Avoids false positives from inline code blocks.
3. **Exemption guard:** Only validator-owned exemptions are honored. Skills cannot self-declare exemptions.
4. **Errors vs warnings:** Errors block CI. Warnings inform but don't stop release.

---

## Configuration & Setup

### Project Structure Configuration

**File:** `CLAUDE.md`

```markdown
# agent-skills

This is the agent-skills project — a collection of production-grade engineering skills for AI coding agents.

## Project Structure

\`\`\`
skills/       → Core skills (SKILL.md per directory)
agents/       → Reusable agent personas (code-reviewer, test-engineer, security-auditor, web-performance-auditor)
hooks/        → Session lifecycle hooks
.claude/commands/ → Slash commands (/spec, /plan, /build, /test, /review, /code-simplify, /ship; plus /webperf specialist audit)
references/   → Supplementary checklists (testing, performance, security, accessibility)
docs/         → Setup guides for different tools
\`\`\`

## Conventions

- Every skill lives in `skills/<name>/SKILL.md`
- YAML frontmatter with `name` and `description` fields
- Description starts with what the skill does (third person), followed by trigger conditions ("Use when...")
- Every skill has: Overview, When to Use, Process, Common Rationalizations, Red Flags, Verification
- References are in `references/`, not inside skill directories
- Supporting files only created when content exceeds 100 lines
```

**Pattern:** The `CLAUDE.md` file serves as a project manifest and convention guide, not a runtime configuration. It's read by humans and agents (as context) to understand project structure and rules.

---

## Core Patterns & Idioms

### The Increment Cycle (Vertical Slicing)

**From:** `skills/incremental-implementation/SKILL.md`

```markdown
## The Increment Cycle

\`\`\`
┌──────────────────────────────────────┐
│                                      │
│   Implement ──→ Test ──→ Verify ──┐  │
│       ▲                           │  │
│       └───── Commit ◄─────────────┘  │
│              │                       │
│              ▼                       │
│          Next slice                  │
│                                      │
└──────────────────────────────────────┘
\`\`\`

For each slice:

1. **Implement** the smallest complete piece of functionality
2. **Test** — run the test suite (or write a test if none exists)
3. **Verify** — confirm the slice works as expected (tests pass, build succeeds, manual check)
4. **Commit** -- save your progress with a descriptive message
5. **Move to the next slice** — carry forward, don't restart

## Vertical Slices (Preferred)

Build one complete path through the stack:

\`\`\`
Slice 1: Create a task (DB + API + basic UI)
    → Tests pass, user can create a task via the UI

Slice 2: List tasks (query + API + UI)
    → Tests pass, user can see their tasks

Slice 3: Edit a task (update + API + UI)
    → Tests pass, user can modify tasks

Slice 4: Delete a task (delete + API + UI + confirmation)
    → Tests pass, full CRUD complete
\`\`\`

Each slice delivers working end-to-end functionality.
```

**Pattern:** The cycle is explicit (Implement → Test → Verify → Commit), not implicit. Each step has clear exit criteria. Vertical slices (end-to-end) are preferred over horizontal layers (all models, then all views) because they deliver working software sooner.

### Test-Driven Development Cycle

**From:** `skills/test-driven-development/SKILL.md`

```markdown
## The TDD Cycle

\`\`\`
    RED                GREEN              REFACTOR
 Write a test    Write minimal code    Clean up the
 that fails  ──→  to make it pass  ──→  implementation  ──→  (repeat)
      │                  │                    │
      ▼                  ▼                    ▼
   Test FAILS        Test PASSES         Tests still PASS
\`\`\`

### Step 1: RED — Write a Failing Test

Write the test first. It must fail.

\`\`\`typescript
describe('TaskService', () => {
  it('creates a task with title and default status', async () => {
    const task = await taskService.createTask({ title: 'Buy groceries' });

    expect(task.id).toBeDefined();
    expect(task.title).toBe('Buy groceries');
    expect(task.status).toBe('pending');
    expect(task.createdAt).toBeInstanceOf(Date);
  });
});
\`\`\`

### Step 2: GREEN — Make It Pass

Write the minimum code to make the test pass:

\`\`\`typescript
export async function createTask(input: { title: string }): Promise<Task> {
  const task = {
    id: generateId(),
    title: input.title,
    status: 'pending' as const,
    createdAt: new Date(),
  };
  await db.tasks.insert(task);
  return task;
}
\`\`\`

### Step 3: REFACTOR — Clean Up

With tests green, improve the code without changing behavior.
```

**Pattern:** The TDD cycle is rigid (RED → GREEN → REFACTOR) and state-driven (test must fail, then pass, then stay passing). Each phase has a single purpose and exit condition.

### Surface Assumptions

**From:** `skills/using-agent-skills/SKILL.md`

```markdown
## Core Operating Behaviors

### 1. Surface Assumptions

Before implementing anything non-trivial, explicitly state your assumptions:

\`\`\`
ASSUMPTIONS I'M MAKING:
1. [assumption about requirements]
2. [assumption about architecture]
3. [assumption about scope]
→ Correct me now or I'll proceed with these.
\`\`\`

Don't silently fill in ambiguous requirements. The most common failure mode is making wrong assumptions and running with them unchecked. Surface uncertainty early.
```

**Pattern:** Assumptions are made explicit, numbered, and stated as "I will proceed with these unless you correct me." This is a pre-flight checklist, not a question.

### Spec-Driven Template

**From:** `skills/spec-driven-development/SKILL.md`

```markdown
# Spec: [Project/Feature Name]

## Objective
[What we're building and why. User stories or acceptance criteria.]

## Tech Stack
[Framework, language, key dependencies with versions]

## Commands
[Build, test, lint, dev — full commands]

## Project Structure
[Directory layout with descriptions]

## Code Style
[Example snippet + key conventions]

## Testing Strategy
[Framework, test locations, coverage requirements, test levels]

## Boundaries
- Always: [...]
- Ask first: [...]
- Never: [...]

## Success Criteria
[How we'll know this is done — specific, testable conditions]

## Open Questions
[Anything unresolved that needs human input]
```

**Pattern:** Specs have six mandatory sections (Objective, Tech Stack, Commands, Project Structure, Code Style, Testing Strategy) plus three boundary tiers (Always, Ask first, Never). Success criteria are testable ("LCP < 2.5s"), not subjective ("make it fast").

---

## Error Handling & Validation

### API Error Semantics Pattern

**From:** `skills/api-and-interface-design/SKILL.md`

```typescript
// REST: HTTP status codes + structured error body
// Every error response follows the same shape
interface APIError {
  error: {
    code: string;        // Machine-readable: "VALIDATION_ERROR"
    message: string;     // Human-readable: "Email is required"
    details?: unknown;   // Additional context when helpful
  };
}

// Status code mapping
// 400 → Client sent invalid data
// 401 → Not authenticated
// 403 → Authenticated but not authorized
// 404 → Resource not found
// 409 → Conflict (duplicate, version mismatch)
// 422 → Validation failed (semantically invalid)
// 500 → Server error (never expose internal details)
```

**Pattern:** Single error shape across all endpoints. Machine-readable codes paired with human-readable messages. HTTP status codes are standardized (not inconsistent per endpoint). Internal details never leak.

### Boundary Validation

**From:** `skills/api-and-interface-design/SKILL.md`

```typescript
// Validate at the API boundary
app.post('/api/tasks', async (req, res) => {
  const result = CreateTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid task data',
        details: result.error.issues,
      },
    });
  }

  // Internal code trusts validated input
  const task = await taskService.createTask(result.data);
  res.json(task);
});
```

**Pattern:** Validation happens at system edges (API boundaries). Once validated, internal code trusts the data. No re-validation in every function.

### Common Rationalizations (Anti-Pattern Guard)

**From:** `skills/incremental-implementation/SKILL.md`

```markdown
## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "This is small, I'll just write it all at once" | Slices force you to verify each piece works. Batch work hides integration bugs. |
| "I'll test after I finish the whole feature" | You'll run the tests once, find failures, and spend hours debugging 500 lines of code at once. Slice testing finds bugs when context is fresh. |
| "I don't have time for incremental commits" | Atomic commits are how you rollback cleanly. If a feature lands 10 commits, you can revert 1 bad commit instead of all 10. |
| "I need to refactor first before I can add this feature" | Refactor first if it unblocks the feature. Otherwise, build the feature first and refactor after it's proven. Don't add work orthogonal to the task. |
```

**Pattern:** Every excuse agents use to skip steps is documented here with a factual counter-argument. This prevents rationalization mid-task.

---

## Configuration: AGENTS.md Composition Rules

**File:** `AGENTS.md`

```markdown
## Orchestration: Personas, Skills, and Commands

This repo has three composable layers. They have different jobs and should not be confused:

- **Skills** (`skills/<name>/SKILL.md`) — workflows with steps and exit criteria. The *how*. Mandatory hops when an intent matches.
- **Personas** (`agents/<role>.md`) — roles with a perspective and an output format. The *who*.
- **Slash commands** (`.claude/commands/*.md`) — user-facing entry points. The *when*. The orchestration layer.

Composition rule: **the user (or a slash command) is the orchestrator. Personas do not invoke other personas.**

A persona may invoke skills.

The only multi-persona orchestration pattern this repo endorses is **parallel fan-out with a merge step** — used by `/ship` to run `code-reviewer`, `security-auditor`, and `test-engineer` concurrently and synthesize their reports.

Do not build a "router" persona that decides which other persona to call; that's the job of slash commands and intent mapping.
```

**Key composition rule:** Three layers exist:
1. **Skills** — Workflows (how)
2. **Personas** — Roles (who)
3. **Commands** — Entry points (when)

Only commands orchestrate personas. Personas invoke skills. Personas never invoke other personas (except for parallel fan-out, which is merged by the main agent, not by a persona).

---

## Summary: Design Principles

This codebase embodies several key principles:

1. **Lazy discovery:** Skills are indexed by metadata (name/description), loaded on-demand.
2. **Explicit workflows:** Process steps are listed, not implied. Exit criteria are testable.
3. **Anti-rationalization:** Every common excuse is documented with a counter-argument.
4. **Layered composition:** Skills, personas, and commands are separate concerns, composed by the command/human layer.
5. **Validation is built-in:** Frontmatter schema, section presence, cross-references — all validated in CI.
6. **Progressive disclosure:** Full skill loaded only when relevant; metadata always available.
7. **Persona boundaries:** Personas have a role and output format, not full process (that's for skills).
8. **Parallel safety:** `/ship` demonstrates safe parallel fan-out: execute concurrently, merge in main context, no nested delegation.
