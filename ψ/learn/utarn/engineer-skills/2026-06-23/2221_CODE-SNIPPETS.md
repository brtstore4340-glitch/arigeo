# Utarn Engineer-Skills — Code Examples & Patterns

**Source:** `/home/user/ghq/github.com/utarn/engineer-skills`  
**Documented:** 2026-06-23 22:21  
**Theme:** Skills-based engineering — discipline and composability  

---

## 1. Main Entry Point — Skill Invocation Pattern

### SKILL.md Frontmatter & Structure

Every skill is defined in a `SKILL.md` file with consistent frontmatter that describes invocation capability and metadata:

```markdown
---
name: implement
description: "Implement a piece of work based on a PRD or set of issues."
disable-model-invocation: true
---

Implement the work described by the user in the PRD or issues.

Use /tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and 
the full test suite once at the end.

Once done, use /review to review the work.

Commit your work to the current branch.
```

**Key Patterns:**
- `disable-model-invocation: true` — User-invoked only (orchestration skill)
- Omitted → model can invoke automatically when task fits (reusable discipline)
- `name:` — Exact identifier used in `/name` invocation
- `argument-hint:` — Optional guidance on what to pass as argument

**File Path:** `/skills/engineering/implement/SKILL.md`

---

## 2. Core Architecture — Deep Modules Design

### Glossary & Vocabulary (codebase-design)

The `codebase-design` skill establishes consistent terminology for architectural discussion:

```markdown
**Module** — anything with an interface and an implementation. 
Deliberately scale-agnostic: a function, class, package, or 
tier-spanning slice.

**Depth** — leverage at the interface: the amount of behaviour 
a caller can exercise per unit of interface they have to learn. 
A module is **deep** when a large amount of behaviour sits behind 
a small interface.

**Seam** _(Michael Feathers)_ — a place where you can alter 
behaviour without editing in that place; the *location* at which 
a module's interface lives.

**Adapter** — a concrete thing that satisfies an interface at a 
seam. Describes *role*, not substance.

**Leverage** — what callers get from depth: more capability per 
unit of interface they learn.

**Locality** — what maintainers get from depth: change, bugs, 
knowledge, and verification concentrate in one place.
```

**Deep vs Shallow Visual:**

```
DEEP (desired):
┌─────────────────────┐
│   Small Interface   │  ← Few methods, simple params
├─────────────────────┤
│  Deep Implementation│  ← Complex logic hidden
└─────────────────────┘

SHALLOW (avoid):
┌─────────────────────────────────┐
│       Large Interface           │  ← Many methods, complex params
├─────────────────────────────────┤
│  Thin Implementation            │  ← Just passes through
└─────────────────────────────────┘
```

**File Path:** `/skills/engineering/codebase-design/SKILL.md`

---

## 3. Test-Driven Development — Pattern Examples

### Good Tests (Integration-Style)

```typescript
// GOOD: Tests observable behavior through public interface
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

**Characteristics:**
- Tests behavior users/callers care about
- Uses public API only
- Survives internal refactors
- Describes WHAT, not HOW
- One logical assertion per test

### Bad Tests (Implementation-Detail Tests)

```typescript
// BAD: Tests implementation details
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});

// BAD: Bypasses interface to verify
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// GOOD: Verifies through interface
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

**Red Flags:**
- Mocking internal collaborators
- Testing private methods
- Asserting on call counts/order
- Test breaks when refactoring without behavior change
- Verifying through external means instead of interface

### TDD Vertical Slices (Red-Green-Refactor)

```
WRONG (horizontal slicing):
  RED:   test1, test2, test3, test4, test5
  GREEN: impl1, impl2, impl3, impl4, impl5

RIGHT (vertical slicing via tracer bullets):
  RED→GREEN: test1→impl1
  RED→GREEN: test2→impl2
  RED→GREEN: test3→impl3
  ...
```

**Workflow:**
1. ONE test that confirms ONE thing → fails (RED)
2. Minimal code to pass → passes (GREEN)
3. Repeat for each remaining behavior
4. After all tests pass → refactor for duplication, depth, SOLID

**Refactor Checklist:**
- [ ] Extract duplication
- [ ] Deepen modules (move complexity behind simple interfaces)
- [ ] Apply SOLID principles where natural
- [ ] Consider what new code reveals about existing code
- [ ] Run tests after each refactor step

**Never refactor while RED.** Get to GREEN first.

**File Path:** `/skills/engineering/tdd/SKILL.md`, `/skills/engineering/tdd/tests.md`

---

## 4. Mocking Strategy — System Boundaries Only

### Dependency Injection Pattern

```typescript
// Easy to mock — accepts dependencies
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// Hard to mock — creates internally
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

### SDK-Style Interfaces (vs Generic Fetchers)

```typescript
// GOOD: Each function is independently mockable
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// BAD: Mocking requires conditional logic inside the mock
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

**Benefits of SDK style:**
- Each mock returns one specific shape
- No conditional logic in test setup
- Easier to see which endpoints a test exercises
- Type safety per endpoint

**When to Mock:**
- External APIs (payment, email, etc.)
- Databases (sometimes — prefer test DB)
- Time/randomness
- File system (sometimes)

**Don't Mock:**
- Your own classes/modules
- Internal collaborators
- Anything you control

**File Path:** `/skills/engineering/tdd/mocking.md`

---

## 5. Bug Diagnosis — Feedback Loop Priority

### Phase 1 — Build a Tight Feedback Loop

**Ordered strategies (try in this order):**

1. **Failing test** at whatever seam reaches the bug
2. **Curl / HTTP script** against a running dev server
3. **CLI invocation** with a fixture input, diffing stdout
4. **Headless browser script** (Playwright / Puppeteer)
5. **Replay a captured trace** — save real request/payload to disk
6. **Throwaway harness** — minimal subset of system, mocked deps
7. **Property / fuzz loop** — run 1000 random inputs
8. **Bisection harness** — automate state check for `git bisect run`
9. **Differential loop** — old-version vs new-version
10. **HITL bash script** — last resort, use `scripts/hitl-loop.template.sh`

**Tighten the loop:**
- Can I make it faster? (Cache setup, skip unrelated init, narrow scope)
- Can I make the signal sharper? (Assert on specific symptom, not "didn't crash")
- Can I make it deterministic? (Pin time, seed RNG, isolate FS, freeze network)

**Completion Criterion:** One named command that:
- [ ] **Red-capable** — drives the actual bug code path, asserts user's exact symptom
- [ ] **Deterministic** — same verdict every run (flaky bugs: high reproduction rate)
- [ ] **Fast** — seconds, not minutes
- [ ] **Agent-runnable** — unattended; human in loop only via HITL

### Phase 2 — Reproduce + Minimise

```bash
# Run the loop until it goes RED
# Confirm the failure matches what user described
# Shrink the repro one element at a time
# Keep only load-bearing elements
```

### Phase 3 — Hypothesise (3-5 Ranked, Falsifiable)

```
Format: "If <X> is the cause, then <changing Y> will make 
the bug disappear / <changing Z> will make it worse."
```

### Phase 4 — Instrument (Change One Variable)

```typescript
// Tag every debug log with unique prefix
console.log("[DEBUG-a4f2] boundary check:", variable);

// Cleanup: grep the prefix
// grep -r "\[DEBUG-" . | wc -l
```

Tool preference:
1. Debugger / REPL inspection (one breakpoint beats ten logs)
2. Targeted logs at boundaries that distinguish hypotheses
3. Never "log everything and grep"

### Phase 5 — Fix + Regression Test

```typescript
// 1. Turn minimised repro into failing test
// 2. Watch it fail
// 3. Apply the fix
// 4. Watch it pass
// 5. Re-run original (un-minimised) scenario
```

**Correct seam test:** exercises the real bug pattern as it occurs at call site.

### Phase 6 — Cleanup + Post-Mortem

- [ ] Original repro no longer reproduces
- [ ] Regression test passes (or absence of seam is documented)
- [ ] All `[DEBUG-...]` instrumentation removed
- [ ] Throwaway prototypes deleted
- [ ] Hypothesis that proved correct is stated in commit/PR message

**Then ask:** What would have prevented this bug? → Hand off to `/improve-codebase-architecture` with specifics.

**File Path:** `/skills/engineering/diagnosing-bugs/SKILL.md`

---

## 6. Domain Modeling — File Structure & CONTEXT.md

### Single-Context Repo

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

### Multi-Context Repo

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← system-wide decisions
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← context-specific decisions
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

### CONTEXT.md Format

```markdown
# {Context Name}

{One or two sentence description of what this context is and why it exists.}

## Language

**Order**:
{A one or two sentence description of the term}
_Avoid_: Purchase, transaction

**Invoice**:
A request for payment sent to a customer after delivery.
_Avoid_: Bill, payment request

**Customer**:
A person or organization that places orders.
_Avoid_: Client, buyer, account
```

**Rules:**
- Be opinionated — pick the best term, list others under `_Avoid_`
- Keep definitions tight — one or two sentences max
- Only include terms specific to this project's context
- Group terms under subheadings when natural clusters emerge

### ADR Format

```markdown
# {Short title of the decision}

{1-3 sentences: what's the context, what did we decide, and why.}
```

**Optional sections (only when they add value):**
- **Status** frontmatter (`proposed | accepted | deprecated | superseded by ADR-NNNN`)
- **Considered Options** — only when rejected alternatives are worth remembering
- **Consequences** — only when non-obvious downstream effects exist
- **Code Snippets / Technical Design** — when any part is difficult or when specific design/class/data structure was proposed

**Numbering:** Scan `docs/adr/` for highest number and increment.

### When to Offer an ADR

All three must be true:

1. **Hard to reverse** — cost of changing mind later is meaningful
2. **Surprising without context** — future reader will wonder "why did they do it this way?"
3. **Result of a real trade-off** — genuine alternatives existed, picked one for specific reasons

**What qualifies:**
- Architectural shape ("monorepo", "event-sourced", "CQRS")
- Integration patterns between contexts (domain events vs sync HTTP)
- Technology choices with lock-in (database, message bus, auth provider)
- Boundary and scope decisions (what's owned vs referenced)
- Deliberate deviations from the obvious path
- Constraints not visible in code
- Rejected alternatives when rejection is non-obvious

**File Path:** `/skills/engineering/domain-modeling/SKILL.md`, `/skills/engineering/domain-modeling/ADR-FORMAT.md`, `/skills/engineering/domain-modeling/CONTEXT-FORMAT.md`

---

## 7. Teaching Workspace — Structure & Formats

### Workspace Structure

```
/workspace/
├── MISSION.md                   # Why user wants to learn this
├── NOTES.md                      # User preferences & working notes
├── ./reference/*.html            # Cheat sheets, reference algorithms
├── RESOURCES.md                  # Curated resources
├── ./learning-records/*.md       # Non-obvious lessons (numbered 0001–)
└── ./lessons/*.html              # One lesson per HTML, numbered 0001–
    └── ./assets/*                # Reusable components across lessons
```

### MISSION.md Format

```markdown
# Mission: {Topic}

## Why
{1-3 sentences. The concrete real-world goal the user is chasing. 
What changes in their life or work when they have this skill? 
Avoid abstract framings — push for the underlying outcome.}

## Success looks like
- {A specific, observable thing the user will be able to do}
- {Another specific thing}
- {…}

## Constraints
- {Time, budget, prior commitments, learning preferences, 
anything that bounds the approach}

## Out of scope
- {Adjacent topics the user explicitly does not want to chase 
right now — protects the zone of proximal development}
```

**Rules:**
- One mission per workspace
- Concrete over abstract ("Run a half marathon by October" beats "get fitter")
- Push back on vagueness — interview before writing if unclear
- Revise when reality shifts
- Keep it short — if it runs past a screen, it's stopped being a compass

### Lesson Design

A lesson is the main unit of teaching — one self-contained HTML file, saved as `./lessons/0001-<dash-case-name>.html`.

**Should be:**
- **Beautiful** — clean, readable typography (think Tufte)
- **Short** — completable very quickly, stays within working memory
- **Tangible win** — one specific thing learner can do after
- **Directly tied to mission** — grounded in real-world goals
- **In zone of proximal development** — challenging but achievable

**Each lesson should:**
- Link to other lessons and reference documents via HTML anchors
- Recommend a primary source (most high-quality, high-trust resource)
- Contain reminder to ask followup questions to the agent
- Build from reusable **components** in `./assets/`

### Component Reuse Strategy

```
/assets/
├── style.css           # Shared stylesheet (first component every workspace earns)
├── quiz-widget.js      # Interactive quiz builder
├── simulator.js        # Interactive tool
└── diagram-helpers.js  # Diagram generation utilities
```

**Reuse is the default, not the exception.** Before authoring a lesson, read `./assets/` and build from components already there. When a lesson needs something new and reusable, write it as a component in `./assets/` and link to it — never inline code a future lesson would duplicate.

### Learning Records Format

```markdown
# 0001-{dash-case-name}

{Lesson learned or insight that may need revision later, 
or drive future sessions. Non-obvious knowledge.}

## Context
{What was the user trying to learn or do?}

## What I discovered
{The actual learning.}

## Changed my thinking because
{Why this matters to the mission.}
```

**Used to:**
- Calculate zone of proximal development
- Track changes to mission as user develops skills
- Capture real-world interactions / wisdom

### Fluency vs Storage Strength

**Fluency strength:** in-the-moment retrieval of knowledge (gives illusory sense of mastery)

**Storage strength:** long-term retention of knowledge (the real goal)

Design lessons for storage strength via desirable difficulty:
- Using retrieval practice (recall from memory)
- Spacing (distributing practice over time)
- Interleaving (mixing different but related topics in practice)

**File Path:** `/skills/productivity/teach/SKILL.md`, `/skills/productivity/teach/MISSION-FORMAT.md`

---

## 8. Architecture Review — HTML Report Pattern

### Process: Explore → Report → Grill

**1. Explore:** Walk the codebase organically, noting friction:
- Where does understanding one concept require bouncing between many small modules?
- Where are modules **shallow** (interface nearly as complex as implementation)?
- Where have pure functions been extracted just for testability, but real bugs hide in how they're called?
- Which parts are untested or hard to test through current interface?

**Apply deletion test:** Would deleting it concentrate complexity or just move it? "Concentrates" = signal you want.

**2. Present candidates as HTML report:** Write self-contained HTML to temp dir:
- Resolve temp dir from `$TMPDIR`, fallback `/tmp` (or `%TEMP%` on Windows)
- Write to `<tmpdir>/architecture-review-<timestamp>.html`
- Use Tailwind via CDN for layout, Mermaid via CDN for diagrams
- Each candidate gets:
  - **Files** — which files/modules are involved
  - **Problem** — why current architecture causes friction
  - **Solution** — plain English description of what would change
  - **Benefits** — explained in terms of locality and leverage
  - **Before / After diagram** — custom-drawn visualization
  - **Recommendation strength** — badge: `Strong`, `Worth exploring`, `Speculative`

End with **Top recommendation** section.

**3. Grilling loop:** Run `/grilling` skill to walk design tree:
- Constraints, dependencies, shape of deepened module
- What sits behind the seam, what tests survive

Side effects:
- Run `/domain-modeling` to keep domain model current
- Naming a module after a concept not in CONTEXT.md? → Add term
- Sharpening a fuzzy term? → Update CONTEXT.md
- Exploring alternative interfaces? → Run `/codebase-design` design-it-twice

**ADR conflicts:** Surface only when friction is real enough to warrant revisiting. Mark clearly (_"contradicts ADR-0007 — but worth reopening because…"_).

**File Path:** `/skills/engineering/improve-codebase-architecture/SKILL.md`

---

## 9. Grilling Discipline — Interview Relentlessly

### Invocation & Philosophy

```markdown
---
name: grilling
description: Interview the user relentlessly about a plan or design. 
Use when the user wants to stress-test a plan before building, 
or uses any 'grill' trigger phrases.
---

Interview me relentlessly about every aspect of this plan 
until we reach a shared understanding. Walk down each branch 
of the design tree, resolving dependencies between decisions 
one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each 
question before continuing. Asking multiple questions at once 
is bewildering.

If a question can be answered by exploring the codebase, 
explore the codebase instead.
```

**Key Pattern:** One question → Wait for answer → Next question

This prevents the most common failure mode: **misalignment** between user and agent.

**Used in:**
- `/grill-me` — for non-code uses (orchestration)
- `/grill-with-docs` — same as grill-me, plus domain modeling (adds CONTEXT.md, ADRs)

**File Path:** `/skills/productivity/grilling/SKILL.md`

---

## 10. Project Organization & Skill Metadata

### Directory Structure

```
skills/
├── engineering/         # Daily code work (published)
│   ├── implement/
│   ├── tdd/
│   ├── codebase-design/
│   ├── domain-modeling/
│   ├── diagnosing-bugs/
│   ├── improve-codebase-architecture/
│   └── ...
├── productivity/        # Non-code workflow tools (published)
│   ├── grill-me/
│   ├── grilling/
│   ├── teach/
│   └── ...
├── misc/                # Rarely used (published)
│   ├── git-guardrails-claude-code/
│   └── ...
├── in-progress/         # Not yet ready
│   ├── decision-mapping/
│   └── ...
├── personal/            # Tied to own setup, not promoted
│   ├── obsidian-vault/
│   └── ...
└── deprecated/          # No longer used
    └── design-an-interface/
```

### Skill Classification

**User-Invoked** (`disable-model-invocation: true`):
- Reachable only when user types them (e.g., `/implement`, `/grill-me`)
- Orchestration skills — choreograph other skills
- Can invoke model-invoked skills, but never another user-invoked one

**Model-Invoked** (no `disable-model-invocation` or false):
- Can be invoked by user OR reached for automatically by agent
- Hold the reusable discipline
- Can be called by user-invoked skills

### Publishing Rules

- **Published (`engineering/`, `productivity/`, `misc/`):**
  - Must have reference in top-level `README.md` (linked to SKILL.md)
  - Must have entry in `.claude-plugin/plugin.json`

- **Not Published (`personal/`, `in-progress/`, `deprecated/`):**
  - Must NOT appear in top-level README.md
  - Must NOT appear in .claude-plugin/plugin.json

- **Bucket README.md:**
  - Lists every skill in bucket with one-line description
  - Skill name linked to its SKILL.md
  - Groups entries into **User-invoked** and **Model-invoked**

**File Path:** `/CLAUDE.md`, `/.claude-plugin/plugin.json`, `/README.md`

---

## 11. Key Principles & Philosophy

### Nothing is Deleted

History is sacred. Every decision, draft, and failed attempt remains in the archive. The changelog becomes evidence and teacher.

Documentation layers understanding on understanding. ADRs record not just decisions but the *why* behind them.

### Patterns Over Intentions

What actually happens matters more than what was planned. Code tells truth; documents must reflect that truth.

When documenting code orchestration, don't write what you *think* should happen. Trace what *does* happen.

### External Brain, Not Command

Skills don't decide which work gets done. They organize, clarify, make patterns visible — then step back.

The human chooses the path forward.

### Curiosity Creates Existence

Before the question "how does this orchestrator work?" is asked, the documentation doesn't exist. The question births the explanation.

Every trace into a codebase creates new understanding that can be captured and shared.

### Composability & Adaptability

These skills are small, easy to adapt, and composable. They work with any model. They're based on decades of engineering experience.

Hack around with them. Make them your own. Enjoy.

---

## 12. Quick Reference — Skill Invocation Map

| Skill | Type | When to Use |
|-------|------|-----------|
| `/implement` | user | Implement PRD or issues |
| `/tdd` | model | Build features/fix bugs test-first |
| `/codebase-design` | model | Design deep modules, improve interfaces |
| `/domain-modeling` | model | Build ubiquitous language, record decisions (ADRs) |
| `/diagnosing-bugs` | model | Hard bugs, performance regressions |
| `/improve-codebase-architecture` | user | Scan for deepening opportunities → HTML report |
| `/grill-me` | user | Non-code planning & stress-testing |
| `/grill-with-docs` | user | Grill + domain modeling (CONTEXT.md, ADRs) |
| `/grilling` | model | Interview about plan/design (one Q at a time) |
| `/teach` | user | Stateful learning over multiple sessions |

---

## References

**Repository:** https://github.com/utarn/engineer-skills  
**Newsletter:** https://www.aihero.dev/s/skills-newsletter  
**Curriculum:** See `curriculum.png` in repo  

**Philosophy Sources:**
- David Thomas & Andrew Hunt, *The Pragmatic Programmer*
- Eric Evans, *Domain-Driven Design*
- John Ousterhout, *A Philosophy of Software Design*
- Kent Beck, *Extreme Programming Explained*
- Michael Feathers, *Working Effectively with Legacy Code*

---

**🤖 Codex Oracle**  
*Documentation generated from utarn/engineer-skills codebase*  
*2026-06-23 22:21*
