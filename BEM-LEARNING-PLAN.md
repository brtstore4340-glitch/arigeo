# BEM Learning & Phase 2 Retrofit Strategy

## BEM Fundamentals (Block Element Modifier)

### Naming Convention
```
Block:    .block-name
Element:  .block-name__element-name
Modifier: .block-name--modifier-name
          .block-name__element--modifier-name
```

### Example: Card Component
```css
/* Block: self-contained unit */
.card { }

/* Elements: parts of card */
.card__header { }
.card__title { }
.card__body { }
.card__footer { }

/* Modifiers: variations */
.card--featured { }
.card__header--dark { }
```

### Key Principles
1. **Single Responsibility** — One class = one purpose
2. **No Nesting in Selectors** — Use BEM naming instead of CSS nesting
3. **Prefixed Namespaces** — Group related blocks (e.g., `siz-*`, `news-*`, `careers-*`)
4. **Flat Structure** — No more than 2 levels deep (block and element)

---

## Phase 2 Retrofit Target Areas

| Area | Page | Status | Priority |
|------|------|--------|----------|
| **Recruitment** | `/careers` | Partial CSS | High |
| **Performance** | `/products` | Needs audit | High |
| **Learning** | TBD | Needs audit | Medium |
| **Workflow** | TBD | Needs audit | Medium |
| **ESS** | `/sustainability` | Needs audit | High |

---

## Retrofit Strategy

### Step 1: Audit Current State
- [ ] List all CSS class names per page
- [ ] Identify blocks, elements, modifiers currently in use
- [ ] Document inconsistencies

### Step 2: Define Namespace Prefixes
- `careers-*` for recruitment sections
- `perf-*` for performance/products sections  
- `learn-*` for learning sections
- `work-*` for workflow sections
- `ess-*` for sustainability sections

### Step 3: Map to BEM
For each page, create mapping:
```
Current:  .hero, .title, .content, .button
BEM:      careers-hero, careers-hero__title, careers-hero__content, careers-hero__button
```

### Step 4: Retrofit & Test
- Create worktree per area
- Update CSS class names
- Update component JSX/TSX className props
- Run tests, visual regression check
- Commit & merge

### Step 5: Document Component API
Each component gets a BEM reference doc:
```markdown
## careers-job-card Component

**Block**: `.careers-job-card`

**Elements**:
- `.careers-job-card__title` — Job title
- `.careers-job-card__location` — Job location
- `.careers-job-card__department` — Department tag

**Modifiers**:
- `.careers-job-card--featured` — Highlight priority jobs
```

---

## Phase 2 Order (Parallel Possible)

1. **Recruitment** (`/careers`) — Foundation for HR/recruiting flow
2. **ESS** (`/sustainability`) — Strategic messaging, high-touch CSS
3. **Performance** (`/products`) — Product showcase, complex grid/carousel CSS
4. **Learning** — Once location confirmed
5. **Workflow** — Once location confirmed

---

## Notes
- Keep Phase 1 header/nav BEM as-is (already correct)
- Design system components (Button, Tag) don't need retrofit — they're generic
- Focus retrofit on page-specific sections (Hero, Cards, Grids, Sections)
- Test on mobile, tablet, desktop after each area complete
- Watch for pseudo-selectors (`:hover`, `:active`, `:disabled`) — include modifiers for all states

