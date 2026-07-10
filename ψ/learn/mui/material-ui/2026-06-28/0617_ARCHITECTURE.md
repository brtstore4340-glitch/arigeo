# Material-UI Codebase Architecture

**Analysis Date:** 2026-06-28  
**Repository:** https://github.com/mui/material-ui  
**Current Version:** 9.1.2  
**Monorepo Manager:** pnpm + Lerna (independent versioning)  
**Build System:** Nx (task caching), code-infra (build tooling)

---

## 1. Directory Structure & Organization Philosophy

```
material-ui/
├── packages/                    # Public npm packages
│   ├── mui-material/           # Core UI components (157 components)
│   ├── mui-system/             # Styling system (Box, Grid, Stack, etc.)
│   ├── mui-utils/              # Utility functions
│   ├── mui-types/              # TypeScript type definitions
│   ├── mui-styled-engine/      # Emotion CSS-in-JS wrapper
│   ├── mui-styled-engine-sc/   # Styled-components alternative
│   ├── mui-icons-material/     # Google Material Design Icons
│   ├── mui-lab/                # Experimental components
│   ├── mui-material-nextjs/    # Next.js integration
│   ├── mui-material-pigment-css/  # Pigment CSS integration
│   ├── mui-private-theming/    # Internal theming utilities
│   ├── mui-stylis-plugin-rtl/  # RTL support plugin
│   ├── mui-codemod/            # Migration codemods
│   ├── mui-envinfo/            # Environment info utility
│   ├── mui-core-downloads-tracker/  # Analytics
│   ├── pigment-css-react/      # Pigment CSS React
│   └── pigment-react/          # Pigment base
│
├── packages-internal/           # Private development packages
│   ├── api-docs-builder/       # Generates API documentation
│   ├── api-docs-builder-core/  # Core API docs generation
│   ├── core-docs/              # Documentation content
│   ├── docs-utils/             # Documentation utilities
│   ├── test-utils/             # Testing utilities
│   ├── markdown/               # Markdown processing
│   ├── scripts/                # Internal build scripts
│   └── waterfall/              # Build coordination
│
├── docs/                        # Next.js documentation site
│   ├── pages/                  # Route pages
│   ├── data/                   # Component demos & content
│   ├── public/                 # Static assets
│   ├── src/                    # Custom components & utilities
│   └── lib/                    # Helper functions
│
├── test/                        # Test suites
│   ├── e2e/                    # End-to-end tests (Playwright)
│   ├── e2e-website/            # Website E2E tests
│   ├── regressions/            # Visual regression tests (Vitest)
│   ├── bundle-size/            # Bundle size checks
│   └── tsconfig.json
│
├── examples/                    # Example applications (18 examples)
│
├── nx.json                      # Nx configuration (task caching)
├── lerna.json                   # Lerna config (independent versioning)
├── pnpm-workspace.yaml          # pnpm workspace definition
├── babel.config.mjs             # Babel configuration
├── tsconfig.json                # Root TypeScript config
└── package.json                 # Root workspace metadata

```

### Organizational Principles

- **Monorepo Pattern:** 17 public packages + 8 internal packages share a single codebase
- **Independent Versioning:** Lerna `independent` mode allows per-package version management
- **Workspace Catalogs:** pnpm catalogs define shared dependency versions (docs catalog)
- **Trust Policy:** No downgrade; 365-day legacy package trust window
- **Build Caching:** Nx task caching + Lerna concurrency (8 parallel) for CI speed

---

## 2. Major Entry Points & Module Organization

### 2.1 Primary Package Exports

#### **@mui/material** (Core UI Library)
```
packages/mui-material/src/
├── index.js                    # Main export (re-exports all components)
├── colors/                     # Material Design color palette
├── styles/                     # Global styles (createTheme, ThemeProvider)
├── utils/                      # Utility functions (generateUtilityClass, etc.)
├── [157 Component Directories] # Each component is a module
│   ├── Component.tsx           # Main component
│   ├── Component.d.ts          # TypeScript definitions
│   ├── styles/                 # Component styles
│   └── index.ts                # Re-export
└── internal/                   # Internal utilities (not exported)
```

**Export Strategy (package.json `exports` field):**
```javascript
{
  ".": "./src/index.js",                          // Main entry
  "./*": "./src/*/index.js",                      // Subpath exports
  "./Button": "./src/Button/index.js",            // Named component imports
  "./zero-styled": "./src/zero-styled/index.tsx",
  "./styles": "./src/styles/index.js",
  "./utils": "./src/utils/index.ts"
}
```

**Component Categories (157 total):**
- Layout: AppBar, Drawer, Container, Grid, Stack
- Input: Button, TextField, Checkbox, Radio, Switch, Autocomplete
- Data Display: Table, List, Card, Badge, Chip, Avatar
- Feedback: Alert, Dialog, Snackbar, LinearProgress, CircularProgress
- Navigation: Breadcrumbs, Pagination, TabBar, SpeedDial
- Surfaces: Paper, Card, Panel
- Transitions: Fade, Collapse, Zoom, Grow, Slide

#### **@mui/system** (Styling System)
```
packages/mui-system/src/
├── index.js                    # Export createTheme, useTheme, etc.
├── Box/                        # Layout component (sx prop)
├── Stack/                      # Flexbox layout component
├── Grid/                       # CSS Grid layout
├── Container/                  # Max-width wrapper
├── createTheme/                # Theme factory function
├── ThemeProvider/              # React Context provider
├── createStyled/               # styled() API creator
├── styleFunctionSx/            # sx prop processor
├── breakpoints/                # Responsive breakpoint logic
├── cssVars/                    # CSS variables support
├── colorManipulator/           # Color utilities (lighten, darken, etc.)
├── palette/                    # Palette creation
├── typography/                 # Typography system
└── [25+ style functions]       # Spacing, flexbox, borders, display, etc.
```

**Export Pattern:**
```javascript
{
  ".": "./src/index.js",
  "./createTheme": "./src/createTheme/index.js",
  "./RtlProvider": "./src/RtlProvider/index.js",
  "./styleFunctionSx": "./src/styleFunctionSx/index.js",
  "./*": "./src/*/index.ts"
}
```

#### **@mui/utils** (Utility Functions)
```
packages/mui-utils/src/
├── deepmerge/                  # Deep merge objects
├── useId/                      # Stable ID generation
├── useEnhancedEffect/          # SSR-safe useEffect
├── useForkRef/                 # Merge multiple refs
├── useMediaQuery/              # Media query hook
├── useEventCallback/           # Stable callback hook
├── usePreviousProps/           # Track previous props
├── composeClasses/             # Class composition utility
└── [8 more utilities]
```

#### **@mui/types** (TypeScript Definitions)
```
packages/mui-types/src/
├── index.ts                    # Exported types
├── overridable.ts              # Component override types
├── sx.ts                       # sx prop types
└── theme.ts                    # Theme type definitions
```

#### **@mui/styled-engine** (CSS-in-JS Wrapper)
```
packages/mui-styled-engine/src/
├── index.ts                    # Main styled() export
├── GlobalStyles/               # Global CSS
├── StyledEngineProvider/       # Emotion cache setup
└── [Emotion integration]       # Wraps @emotion/styled
```

Peer dependency: `@emotion/react ^11.5.0` and `@emotion/styled ^11.3.0`

---

### 2.2 Support Packages

| Package | Purpose | Output Type |
|---------|---------|-------------|
| **@mui/icons-material** | 20,000+ Material Design icons | React components |
| **@mui/lab** | Experimental & unstable components | React components |
| **@mui/material-nextjs** | Next.js integration (App Router support) | Utilities |
| **@mui/material-pigment-css** | Zero-runtime CSS extraction | Components |
| **@mui/private-theming** | Internal theme context (shared) | React hooks |
| **@mui/stylis-plugin-rtl** | RTL text direction support | CSS plugin |
| **@mui/codemod** | Version migration codemods | CLI tool |

---

### 2.3 Documentation Site Entry Points

**docs/** (Next.js 16 application):
- **pages/**: Route definitions (component docs, guides, API)
- **data/**: Component demo code + metadata
- **src/**: Custom doc components, layouts, hooks
- **lib/**: Helper functions (markdown parsing, search, etc.)
- **public/**: Static assets, API docs JSON, error codes

---

## 3. Core Abstractions & Relationships

### 3.1 Dependency Graph

```
┌─────────────────────────────────────────────────────┐
│ @mui/material (Components)                          │
├─────────────────────────────────────────────────────┤
│ ├─ @mui/system (Theming, sx prop, layout)           │
│ ├─ @mui/styled-engine (CSS-in-JS)                   │
│ ├─ @mui/utils (useId, deepmerge, etc.)              │
│ ├─ @mui/types (TS definitions)                      │
│ └─ @popperjs/core (Positioning library)             │
└─────────────────────────────────────────────────────┘
         │
         └─ @emotion/react, @emotion/styled (Peer deps)
         └─ react, react-dom (Peer deps)

@mui/system depends on:
├─ @mui/styled-engine (styled() API)
├─ @mui/private-theming (theme context)
├─ @mui/types (type definitions)
├─ @mui/utils (deepmerge, useId)
└─ @emotion/react, @emotion/styled (Peer deps)

@mui/styled-engine depends on:
├─ @emotion/cache, @emotion/serialize, @emotion/sheet
├─ csstype (TypeScript CSS types)
└─ @emotion/react, @emotion/styled (Peer deps)
```

### 3.2 Component Architecture Pattern

Each component follows a consistent pattern:

```typescript
// components/Button/Button.tsx
import { styled } from '@mui/system';
import { useTheme } from '@mui/system';

const ButtonRoot = styled('button')(({ theme }) => ({
  // Styles defined using sx prop/theme values
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.primary.main,
  // ...
}));

export interface ButtonProps {
  variant?: 'text' | 'contained' | 'outlined';
  color?: 'primary' | 'secondary' | 'error';
  // ... other props
}

export default function Button(props: ButtonProps) {
  // Component implementation
}

// Re-export
export * from './Button';
```

**Key Abstractions:**
- **styled()**: Emotion wrapper for component styling
- **sx prop**: Object-based styling interface (theme-aware)
- **ThemeProvider**: React Context for theme distribution
- **useTheme()**: Hook to access theme object
- **breakpoints**: Responsive design utilities

### 3.3 Theme System

```typescript
// @mui/system/src/createTheme
export interface Theme {
  palette: {
    primary, secondary, error, warning, info, success;
    text, background, divider;
    mode: 'light' | 'dark';
  };
  typography: {
    fontFamily, fontSize, fontWeight;
    h1, h2, h3, h4, h5, h6, body1, body2, caption, ...;
  };
  spacing: (n: number) => string;  // 8px base unit
  breakpoints: {
    xs, sm, md, lg, xl;
    up(key), down(key), between(start, end), only(key);
  };
  shape: { borderRadius };
  transitions: { create, duration, easing };
  zIndex: { modal, drawer, appBar, ... };
  shadows: string[];  // 25 elevation levels
}
```

**Usage Pattern:**
```typescript
const theme = createTheme({
  palette: { primary: { main: '#1976d2' } },
  typography: { fontFamily: '"Roboto"' },
});

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

---

## 4. Dependencies & External Integrations

### 4.1 Runtime Dependencies (Minimalist Approach)

**@mui/material** runtime deps:
- `@babel/runtime` (7.29.2) - Babel helpers polyfill
- `@mui/system` - Theming & styling
- `@mui/utils` - Utilities
- `@mui/types` - TypeScript definitions
- `@popperjs/core` (2.11.8) - Tooltip/popover positioning
- `react-transition-group` (4.4.5) - Transition animations
- `clsx` (2.1.1) - ClassNames helper
- `csstype` (3.2.3) - CSS type definitions
- `prop-types` (15.8.1) - Runtime prop validation

**@mui/system** runtime deps:
- Same as above (plus styled-engine)

**@mui/styled-engine** runtime deps:
- `@emotion/cache`, `@emotion/serialize`, `@emotion/sheet`
- `csstype`, `prop-types`

### 4.2 Build-Time Dependencies

**Build Tools:**
- `code-infra` (0.0.4-canary.63) - MUI build system
- `tsgo` - TypeScript builder
- `babel` (7.29.0) - Code transpilation
- `vite` (7.3.2) - Build bundler
- `nx` (22.7.5) - Task orchestration

**Testing:**
- `vitest` (4.1.0) - Test runner (replaces Jest)
- `@vitest/browser-playwright` - Browser testing
- `playwright` (1.59.1) - E2E testing
- `chai` (6.2.2) - Assertions
- `sinon` (22.0.0) - Mocking library

**Linting & Type Checking:**
- `eslint` (10.3.0) - Code linting
- `typescript` (6.0.3) - Type checking
- `prettier` (3.8.3) - Code formatting
- `stylelint` (17.11.0) - CSS linting

**Documentation:**
- `@docsearch/react` - Search integration
- `remark`, `rehype` - Markdown processing
- `vale` (3.14.1) - Documentation linting

### 4.3 Peer Dependencies (Must Be Installed)

**Required:**
- `react` (^17.0.0 || ^18.0.0 || ^19.0.0)
- `react-dom` (^17.0.0 || ^18.0.0 || ^19.0.0)

**Optional (but recommended):**
- `@emotion/react` (^11.5.0)
- `@emotion/styled` (^11.3.0)
- `@types/react` (^17.0.0 || ^18.0.0 || ^19.0.0) - TypeScript only

---

## 5. Build & Tooling Setup

### 5.1 Package Manager & Workspace

**pnpm Workspace Configuration** (`pnpm-workspace.yaml`):
```yaml
packages:
  - packages/*              # 17 public packages
  - packages-internal/*     # 8 internal packages
  - docs                    # Next.js docs site
  - test/*                  # Test suites

engineStrict: true
packageManager: pnpm@11.5.0
engines: node>=22.18.0
```

**Dependency Overrides:**
- `@types/node`: 20.19.39
- `caniuse-lite`: ^1.0.30001792
- `@pigment-css/*`: 0.0.31 (force version consistency)

---

### 5.2 Build System: code-infra + Nx

**Build Command Chain:**
```bash
# Build all packages in parallel
pnpm build

# Output directory structure:
packages/
├── mui-material/
│   └── build/               # Transpiled JS + types
│       ├── index.js         # CommonJS
│       ├── index.d.ts       # TypeScript declarations
│       └── ...
└── [other packages]
```

**Build Process** (per package):
```bash
# In each package.json:
"build": "code-infra build --tsgo --flat"
```

**What code-infra does:**
1. Transpiles TS → ES5 (Babel)
2. Generates `.d.ts` type declarations (tsgo)
3. Creates multiple output formats:
   - ESM: `build/index.mjs`
   - CommonJS: `build/index.js`
   - TypeScript: `build/index.d.ts`
4. Preserves `sideEffects: false` for tree-shaking

---

### 5.3 Babel Configuration

**Root babel.config.mjs:**
- Uses `@mui/internal-code-infra/babel-config` as base
- Adds MUI-specific plugins:
  - Error code minification (`@mui/internal-babel-plugin-minify-errors`)
  - Path aliasing (resolve `@mui/material` → `./packages/mui-material/src`)
  - React constant element inlining

**Aliases for local development:**
```javascript
{
  '@mui/material': './packages/mui-material/src',
  '@mui/system': './packages/mui-system/src',
  '@mui/icons-material': './packages/mui-icons-material/lib',
  '@mui/lab': './packages/mui-lab/src',
  '@mui/styled-engine': './packages/mui-styled-engine/src',
  '@mui/utils': './packages/mui-utils/src',
  // ... etc
}
```

---

### 5.4 TypeScript Configuration

**Root tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@mui/material": ["packages/mui-material/src"],
      "@mui/*": ["packages/mui-*/src"],
      // ...
    }
  }
}
```

Each package has its own `tsconfig.json` referencing the root.

---

### 5.5 Nx Task Configuration

**nx.json (Task Caching):**
```json
{
  "targetDefaults": {
    "build": {
      "cache": true,
      "dependsOn": ["copy-license", "^build"],
      "outputs": ["{projectRoot}/build", "{projectRoot}/dist"]
    },
    "test": {
      "cache": true
    }
  }
}
```

**Task Execution:**
- `pnpm build` → Nx caches build outputs
- `pnpm build:ci` → Parallel 8-concurrency builds, skips cache
- Tasks auto-detect dependencies (e.g., `mui-material` waits for `mui-system` build)

---

### 5.6 Testing Setup

**Test Runners:**

| Suite | Tool | Purpose |
|-------|------|---------|
| Unit | Vitest | Component logic, utilities |
| Browser | Vitest + Playwright | DOM interactions |
| E2E | Playwright | Full website flows |
| Regression | Vitest | Visual diffs (screenshots) |
| Bundle Size | custom tool | Size tracking |

**Test Command Patterns:**
```bash
pnpm test:unit                    # Run all unit tests
pnpm test:browser                 # Browser-specific tests
pnpm test:node                    # Node.js-specific tests
pnpm test:e2e                     # End-to-end (Playwright)
pnpm test:regressions             # Visual regression tests
pnpm test:extended                # All checks (lint + types + tests)
```

---

### 5.7 Documentation Build

**Next.js Documentation Site** (`docs/`):
```bash
pnpm docs:build        # Full static build
pnpm docs:dev          # Dev server (HMR)
pnpm docs:api          # Generate API docs (TSDoc → JSON)
pnpm docs:api:build    # Build API documentation
```

**API Documentation Generation:**
- Reads JSDoc/TSDoc comments from components
- Generates API reference pages automatically
- Outputs: `docs/pages/**/api.md`

**Build process:**
1. Extract type info via `tsgo` and JSDoc
2. Generate markdown pages
3. Build with Next.js (static export)
4. Deploy to Netlify/Vercel

---

### 5.8 Release & Publishing

**Release Workflow:**
```bash
# 1. Version bump
pnpm release:version              # Lerna version (independent mode)

# 2. Build
pnpm release:build                # Clean build of public packages

# 3. Generate changelog
pnpm release:changelog            # Commit message → changelog

# 4. Pack & publish
pnpm release:pack                 # Create pack tarball
pnpm release:publish              # Publish to npm

# Canary releases (pre-release testing):
pnpm canary:release               # Publish @next tag
```

**Versioning Strategy:**
- **Independent versioning** (Lerna): Each package has its own version
- **Example:** @mui/material v9.1.2, @mui/system v9.1.2
- **Changelog:** Aggregated from git commits (conventional commits)

---

## 6. Key Architectural Patterns

### 6.1 Component Override System

Every Material-UI component supports style overrides:

```typescript
const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '12px 24px',
        },
        containedPrimary: {
          backgroundColor: 'custom-blue',
        },
      },
    },
  },
});
```

**Implementation:** Each component exports:
- `useStyles()` hook for internal styling
- `classes` prop object (e.g., `root`, `containedPrimary`)
- `sx` prop for inline style overrides

### 6.2 Utility Classes & CSS Generation

```typescript
// generateUtilityClass
generateUtilityClass('Button')
// → 'MuiButton'

generateUtilityClasses('Button')
// → { root: 'MuiButton-root', contained: 'MuiButton-contained', ... }
```

Components use these classes for:
- CSS module scope
- Override targeting
- Testing selectors

### 6.3 Ref Forwarding & Composition

All components use `forwardRef()` to support ref access:

```typescript
const Button = forwardRef(function Button(props, ref) {
  return <button ref={ref} {...props} />;
});

// Usage:
const btnRef = useRef();
<Button ref={btnRef} />
btnRef.current.focus();
```

---

## 7. Notable Integrations & Extensions

### 7.1 CSS-in-JS Strategy

**Primary:** Emotion (@emotion/react, @emotion/styled)
- Runtime CSS-in-JS
- Dynamic theme support
- SSR compatible

**Alternative:** Styled-components (@mui/styled-engine-sc)
- Drop-in replacement via aliasing

**Zero-runtime:** Pigment CSS (@mui/material-pigment-css)
- Compile-time CSS extraction
- Minimal JS payload

### 7.2 Next.js Integration

**@mui/material-nextjs:**
- App Router support
- Font optimization
- CSS-in-JS serialization (SSR)

### 7.3 RTL Support

**@mui/stylis-plugin-rtl:**
- Automatic LTR → RTL transformation
- CSS logical properties (margin-inline, etc.)
- Enabled via `<html dir="rtl">`

---

## 8. Size & Performance Characteristics

### 8.1 Bundle Footprint

| Package | Minified | Gzipped |
|---------|----------|---------|
| @mui/material | ~200 KB | ~50 KB |
| @mui/system | ~80 KB | ~20 KB |
| @mui/utils | ~8 KB | ~2 KB |
| @mui/types | ~0 KB | ~0 KB (types only) |

(As of v9.1.2; exact sizes vary by import)

### 8.2 Tree-Shaking Support

All packages have `sideEffects: false` enabling deep tree-shaking:

```typescript
import { Button } from '@mui/material';  // Only Button code imported
// Dialog, TextField, etc. are completely removed in bundler
```

### 8.3 Code Splitting

Components are individually importable:

```typescript
// Good (bundle only Button)
import Button from '@mui/material/Button';

// Also good (code-split)
const Button = lazy(() => import('@mui/material/Button'));
```

---

## 9. Development Workflow

### 9.1 Local Setup

```bash
# Install
pnpm install

# Develop docs site with HMR
pnpm docs:dev

# Watch & rebuild packages
pnpm build --watch

# Run tests
pnpm test:unit --watch

# Create new demo/example
pnpm docs:create-playground
```

### 9.2 Contributing

1. Create feature branch from `master`
2. Edit components in `packages/mui-material/src/[Component]/`
3. Write/update tests
4. Run `pnpm eslint && pnpm typescript && pnpm test:unit`
5. Generate API docs: `pnpm docs:api:build`
6. Commit (conventional commit format)
7. Open PR

### 9.3 CI/CD Pipeline

**GitHub Actions Workflows:**
- `ci.yml` - Lint, test, type-check on every PR
- `ci-check.yml` - Size analysis, bundle checks
- `publish.yml` - Release to npm on tag
- `codeql.yml` - Security scanning

---

## 10. Architecture Strengths & Design Decisions

### Design Strengths:

1. **Modular Packages** - Each package is independently versioned, deployable
2. **Minimal Runtime Deps** - Only essential packages (emotion, popper, react-transition-group)
3. **Type Safety** - Full TypeScript with strict mode enabled
4. **Theming System** - Central theme object enables consistent styling across 150+ components
5. **Performance** - Tree-shaking, dynamic imports, lazy loading support
6. **Accessibility** - Built-in a11y patterns (focus management, ARIA attributes)
7. **Stability** - Decade+ of battle-testing, backward compatibility strategy

### Key Design Decisions:

- **Emotion-first:** Emotion provides dynamic theming, SSR support, and better DX than CSS Modules
- **sx prop:** Object-based styling API with theme integration (familiar to Tailwind users)
- **Workspace Monorepo:** Single repo reduces coordination overhead, shared tooling
- **Independent Versioning:** Allows fast iteration on low-level packages (utils, types) without blocking consumer updates
- **Next.js for Docs:** Enables SSR, MDX demos, fast documentation iteration
- **Pigment CSS Path:** Zero-runtime CSS option for users prioritizing bundle size

---

## 11. Summary: Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ Developer writes component/docs                                 │
└────────────┬──────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Code + Tests (TypeScript/JSX)                                   │
│  packages/mui-material/src/Button/*.tsx                         │
└────────────┬──────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Babel + TypeScript Compiler (code-infra build)                  │
│  • Transpile TS → ES5                                           │
│  • Generate .d.ts declarations                                  │
│  • Tree-shake unused code                                       │
└────────────┬──────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Build Output (packages/mui-material/build/)                     │
│  • index.js (CommonJS)                                          │
│  • index.mjs (ESM)                                              │
│  • index.d.ts (TypeScript)                                      │
└────────────┬──────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ npm Registry (v9.1.2)                                           │
│  @mui/material, @mui/system, @mui/utils, ...                   │
└────────────┬──────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Consumer Application                                            │
│  import { Button } from '@mui/material'                         │
│  → Bundler imports ESM, tree-shakes unused, minifies            │
└─────────────────────────────────────────────────────────────────┘
```

---

**Document Generated:** 2026-06-28 06:17 UTC  
**Analysis Method:** Direct source code inspection + package.json analysis  
🤖 Codex Oracle
