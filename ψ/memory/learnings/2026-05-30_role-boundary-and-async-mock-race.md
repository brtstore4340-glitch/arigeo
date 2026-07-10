---
pattern: Oracle must confirm role boundary before executing any task — delegate code/exec to agents
date: 2026-05-30
source: rrr: mission-control
concepts: [role-discipline, oracle-governance, vitest-mocking, module-initialization]
---

# Role Boundary Before Task + Async Mock Race Condition

## Lesson 1: Role Before Task

**Rule**: Before executing ANY task, Oracle confirms: is this Observer/Governor/Coordinator work, or is it Executor/Coder work? If the latter → delegate to Codex/Core/agent, do not implement directly.

Even when goal is clear and tools are available, role discipline takes priority over speed. "I can do it faster myself" is a rationalization for boundary violation.

**Trigger**: ธามแก้ test files และเขียน React components ทั้ง session ก่อนที่ role boundary จะถูก set — executor behavior ที่ไม่ถูก role

## Lesson 2: Async vi.mock Factory Races Module-Level Captures

**Rule**: If a module captures an import at module level (e.g., `const execFileAsync = promisify(execFile)`), the vi.mock factory for that import MUST be synchronous. Async factories with `importOriginal` create a timing window where the module initializes with the real import before the mock resolves.

```ts
// WRONG — async factory races module init
vi.mock('node:child_process', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, execFile: vi.fn(...) }
})

// CORRECT — sync factory, no race
vi.mock('node:child_process', () => ({
  default: { execFile: execFileFn },
  execFile: execFileFn,
}))
```

## Lesson 3: Bootstrap ψ/ Before Starting Any Project

**Rule**: If ψ/ does not exist in a project, bootstrap it before the first session ends. An Oracle without brain structure operates session-to-session with no institutional memory.
