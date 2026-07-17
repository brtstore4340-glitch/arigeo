---
name: 0617-testing
description: 
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-15
  source: fleet-memory
---

# Material-UI Testing & Quality Practices

**📖 Analysis Date**: June 28, 2026 | **Source**: Material-UI v9.1.2 | **Framework**: Vitest + jsdom/browser  
**🤖 Codex Oracle** — Making invisible testing patterns visible

---

## 1. Test Structure & Organization

### Directory Layout

```
packages/mui-material/
├── src/
│   ├── Button/
│   │   ├── Button.tsx          # Component
│   │   └── Button.test.js      # Unit test (co-located)
│   ├── TextField/
│   │   ├── TextField.tsx
│   │   └── TextField.test.js
│   └── [100+ components]
├── test/
│   ├── describeConformance.ts      # Test utility - conformance tests
│   ├── describeTransitionConformance.tsx # Test utility - transition lifecycle
│   ├── ripple.ts                   # Test utility - ripple effect testing
│   ├── integration/                # Integration tests
│   │   ├── Menu.test.js
│   │   ├── Dialog.test.js
│   │   ├── Select.test.js
│   │   ├── Tooltip.test.js
│   │   └── [11+ integration tests]
│   └── typescript/                 # TypeScript validation tests
```

### Test Categories

| Category | Location | Focus | Example |
|----------|----------|-------|---------|
| **Unit Tests** | `src/Component/Component.test.js` | Individual component behavior | Button styling, props handling |
| **Integration Tests** | `test/integration/*.test.js` | Multi-component workflows | Menu focus management, Form submission |
| **Conformance Tests** | Embedded in unit tests | Component API consistency | Ref forwarding, classes structure |
| **TypeScript Tests** | `test/typescript/` | Type safety & augmentation | Module augmentation, PropTypes |

---

## 2. Test Conventions & Naming Patterns

### File Naming
- **Component test**: `ComponentName.test.js`
- **Integration test**: `ComponentName.test.js` (in `/test/integration/`)
- **Conformance helper**: Named as utility (e.g., `describeConformance`)

### Test Block Naming (Patterns from codebase)

```javascript
// Top-level describe block uses component JSX
describe('<Button />', () => { ... })
describe('<TextField />', () => { ... })

// Nested describe blocks for feature groupings
describe('prop: loading', () => { ... })
describe('with a label', () => { ... })
describe('Emotion compatibility', () => { ... })
describe('server-side', () => { ... })

// Test names are descriptive
it('should render with the root, text, and colorPrimary classes but no others', () => { ... })
it('warns for custom non-button components when nativeButton is omitted', () => { ... })
it('does not warn for intrinsic non-button components when nativeButton is omitted', () => { ... })
```

### Selective Test Execution

```javascript
// Skip condition (JSDOM-specific)
it.skipIf(isJsdom())('aligns its text baseline when start-side icons are present', () => { ... })

// Conditional describe blocks
describe.skipIf(!isJsdom())('server-side', () => { ... })

// Skip condition can use custom checks
it.skipIf(someCondition)('description', () => { ... })
```

---

## 3. Test Utilities & Helpers

### Core Testing Library Stack

```javascript
// From '@mui/internal-test-utils'
import {
  createRenderer,           // Creates render context with fake timers, etc.
  screen,                   // DOM Testing Library - element queries
  fireEvent,                // Event simulation
  act,                       // React act() wrapper
  simulateKeyboardDevice,   // Keyboard event simulation
  within,                   // Scoped queries
  isJsdom,                  // Environment detection
  programmaticFocusTriggersFocusVisible,
} from '@mui/internal-test-utils';

// From 'chai' (assertion library)
import { expect } from 'chai';

// From 'sinon' (mocking library)
import { spy } from 'sinon';
```

### Material-UI Custom Test Utilities

#### `describeConformance()`
Shared conformance test suite for all Material-UI components.

**File**: `/packages/mui-material/test/describeConformance.ts`

```typescript
export default function describeConformance(
  minimalElement: React.ReactElement<unknown>,
  getOptions: () => ConformanceOptions,
)
```

**Usage**:
```javascript
describeConformance(<Button startIcon="icon">Conformance?</Button>, () => ({
  classes,                              // CSS class name references
  inheritComponent: ButtonBase,         // Base component reference
  render,                              // Render function
  refInstanceof: window.HTMLButtonElement,
  muiName: 'MuiButton',               // Component name
  testDeepOverrides: {                 // Test slot customization
    slotName: 'startIcon',
    slotClassName: classes.startIcon
  },
  testVariantProps: { variant: 'contained', fullWidth: true },
  testStateOverrides: { prop: 'size', value: 'small', styleKey: 'sizeSmall' },
}));
```

**What it tests**:
- Component renders without error
- Ref forwarding works correctly
- All CSS classes apply as expected
- Props override works
- Variant and state combinations
- Slot/component prop customization

#### `describeTransitionConformance()`
Lifecycle and timing tests for transition components (Slide, Zoom, Fade, etc).

**File**: `/packages/mui-material/test/describeTransitionConformance.tsx`

**Tests lifecycle callbacks**:
- `onEnter` → `onEntering` → `onEntered`
- `onExit` → `onExiting` → `onExited`
- `addEndListener` support
- Timeout from props vs. theme
- Browser computed styles for animations

#### `ripple.*` Utilities
Testing Material Design ripple effects (touch feedback).

**File**: `/packages/mui-material/test/ripple.ts`

```javascript
export async function startTouch(node: Element, options?: any)
export async function stopTouch(node: Element)
export async function startFocus(node: HTMLElement)
export async function stopFocus(node: HTMLElement)
```

**Usage**:
```javascript
it('should have a ripple', async () => {
  render(<Button TouchRippleProps={{ className: 'touch-ripple' }}>Hello</Button>);
  const button = screen.getByRole('button');
  
  await ripple.startTouch(button);
  expect(button.querySelector('.touch-ripple')).not.to.equal(null);
});
```

#### `createRenderer()`
Factory that creates render context with optional fake timers.

```javascript
const { render, renderToString } = createRenderer();
const { clock, render } = createRenderer({ clock: 'fake' });
const { render: renderRealTime } = createRenderer();

// Available properties:
// - render(element): Renders component in jsdom
// - renderToString(element): SSR render
// - clock: Fake timer controls (advance, tick, restore)
// - setProps(newProps): Update component props (useful for transition tests)
```

---

## 4. Mocking Strategies & Fixtures

### Spy/Mock Pattern

```javascript
// Spy on console.error for warning detection
const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

it('warns for custom non-button components when nativeButton is omitted', () => {
  render(<Button component={StyledSpan}>Hello World</Button>);
  
  // Verify warning was called
  expectWarningWithFragments(errorSpy, ['nativebutton={false}', 'non-<button>']);
  errorSpy.mockRestore();
});
```

### Helper Functions for Repeated Logic

```javascript
function getWarningMessages(errorSpy) {
  return errorSpy.mock.calls.map((call) =>
    String(call[0]).replace(/\s+/g, ' ').trim().toLowerCase(),
  );
}

function expectWarningWithFragments(errorSpy, fragments) {
  const messages = getWarningMessages(errorSpy);
  expect(messages.length).to.be.greaterThanOrEqual(1);
  expect(
    messages.some((message) =>
      fragments.every((fragment) => message.includes(fragment.toLowerCase())),
    ),
  ).to.equal(true);
}
```

### Component Test Fixtures

```javascript
// Define test wrapper components inline
function TestComponent(props) {
  const { children, className, 'data-testid': testId } = props;
  return (
    <div className={className} data-testid={testId ?? 'custom'}>
      {typeof children === 'function' ? children({}) : children}
    </div>
  );
}

function TestFormControl(props) {
  const { children, error, ...other } = props;
  return (
    <FormControl data-testid={'custom'} {...other}>
      {children}
    </FormControl>
  );
}

// Use in tests via slots
describeConformance(
  <TextField select><option>A</option></TextField>,
  () => ({
    slots: {
      select: {
        testWithComponent: TestComponent,
        testWithElement: null,
      },
    },
  }),
);
```

### Theme Provider Mocking

```javascript
import { ThemeProvider, createTheme } from '@mui/material/styles';

it('disables ripple when theme has defaultProps', () => {
  const theme = createTheme({
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
    },
  });
  
  const { container } = render(
    <ThemeProvider theme={theme}>
      <Button>Disabled ripple</Button>
    </ThemeProvider>,
  );
  
  expect(container.firstChild.querySelector('.ripple-root')).to.equal(null);
});
```

---

## 5. Coverage Approach & Tools

### Configuration

**File**: `/vitest.config.mts`

```typescript
export default defineConfig({
  test: {
    projects: [
      '{docs,packages{-internal,}/*}/vitest.config.browser.mts',  // Browser tests
      '{docs,packages{-internal,}/*}/vitest.config.mts',          // Node/jsdom tests
    ],
    sequence: {
      hooks: 'list',
    },
    coverage: {
      provider: 'v8',                    // V8 coverage engine
      reporter: process.env.CI ? ['lcovonly'] : ['text'],
      reportsDirectory: path.resolve(MONOREPO_ROOT, 'coverage'),
      include: ['packages/*/src/**/*.{mts,ts,tsx,mjs,js,jsx}'],
      exclude: [
        '**/*.d.ts',
        '**/__fixtures__/**',
        'packages/mui-icons-material/src/**',  // Excluded (too many)
        'packages/mui-codemod/src/**/{test-cases,*.test}/**',
        '**/{postcss,vitest}.config.*',
      ],
    },
  },
});
```

### Run Commands

```bash
# Run all tests (Node + Browser)
pnpm test

# Run only node/jsdom tests
TEST_SCOPE=node vitest

# Run only browser tests
TEST_SCOPE=browser vitest

# With coverage
vitest --coverage

# Run specific package tests
pnpm --workspace-root test:unit --project "*:@mui/material"
```

### Test Environments

| Environment | Use Case | Config |
|-------------|----------|--------|
| **jsdom** | DOM APIs, React rendering | `vitest.config.mts` with `jsdom: true` |
| **node** | Logic, utilities (no DOM) | Default `vitest.config.mts` |
| **browser** | Real browser, paint, layout | `vitest.config.browser.mts` + Playwright |

### Coverage Gaps & Strategy

**Not measured**:
- Icon components (`mui-icons-material`) — 5000+ auto-generated files
- Codemod test cases — transformation examples, not actual tests

**V8 provider advantages**:
- Native Node.js integration
- Fast execution
- LCOV output for CI

---

## 6. Testing Patterns for Components

### Pattern 1: Class Name Verification

```javascript
it('should render with the root, text, and colorPrimary classes but no others', () => {
  render(<Button>Hello World</Button>);
  const button = screen.getByRole('button');

  // Positive assertions
  expect(button).to.have.class(classes.root);
  expect(button).to.have.class(classes.text);
  expect(button).to.have.class(classes.colorPrimary);
  
  // Negative assertions
  expect(button).not.to.have.class(classes.colorSecondary);
  expect(button).not.to.have.class(classes.outlined);
  expect(button).not.to.have.class(classes.contained);
});
```

### Pattern 2: Prop Combinations

```javascript
// Test variant + color combinations systematically
const colorVariants = ['primary', 'secondary', 'success', 'error', 'info', 'warning'];

colorVariants.forEach(color => {
  it(`should render a text ${color} button`, () => {
    render(<Button color={color}>Hello World</Button>);
    const button = screen.getByRole('button');
    
    expect(button).to.have.class(classes.root);
    expect(button).to.have.class(classes.text);
    expect(button).to.have.class(classes[`color${capitalize(color)}`]);
  });
});
```

### Pattern 3: Keyboard & Focus Testing

```javascript
it('changes focus according to keyboard navigation', async () => {
  render(<ButtonMenu />);
  
  const button = screen.getByRole('button', { name: 'open menu' });
  await act(async () => {
    button.focus();
    button.click();
  });
  
  const menuitems = screen.getAllByRole('menuitem');
  
  fireEvent.keyDown(menuitems[0], { key: 'ArrowDown' });
  expect(menuitems[1]).toHaveFocus();
  
  fireEvent.keyDown(menuitems[1], { key: 'ArrowUp' });
  expect(menuitems[0]).toHaveFocus();
});
```

### Pattern 4: Accessibility & Computed Styles

```javascript
it('aligns its text baseline when start-side icons are present', () => {
  // Skip in jsdom (no computed layout)
  // Only run in real browser with Playwright
  
  render(
    <Button startIcon={<TestIcon />}>
      <span><BaselineMarker data-testid="button-baseline" /></span>
    </Button>,
  );
  
  const labelBaseline = screen.getByTestId('label-baseline').getBoundingClientRect().top;
  const buttonBaseline = screen.getByTestId('button-baseline').getBoundingClientRect().top;
  
  expect(Math.abs(buttonBaseline - labelBaseline)).to.be.lessThan(1);
});
```

### Pattern 5: Integration Test with State

```javascript
function ButtonMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  return (
    <>
      <Button onClick={(e) => setAnchorEl(e.currentTarget)}>Open</Button>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {/* menu items */}
      </Menu>
    </>
  );
}

describe('<Menu /> integration', () => {
  const { clock, render } = createRenderer({ clock: 'fake' });
  
  it('should focus the first item on open', async () => {
    render(<ButtonMenu />);
    
    const button = screen.getByRole('button');
    await act(async () => {
      button.focus();
      button.click();
    });
    
    expect(screen.getAllByRole('menuitem')[0]).toHaveFocus();
  });
});
```

### Pattern 6: Testing Disabled/Loading States

```javascript
describe('prop: loading', () => {
  it('disables the button', () => {
    render(<Button loading />);
    const button = screen.getByRole('button');
    
    expect(button).to.have.property('tabIndex', -1);
    expect(button).to.have.property('disabled', true);
  });
  
  it('cannot be enabled while loading', () => {
    render(<Button disabled={false} loading />);
    expect(screen.getByRole('button')).to.have.property('disabled', true);
  });
  
  it('renders a progressbar that is labelled by the button', () => {
    render(<Button loading>Submit</Button>);
    
    const button = screen.getByRole('button');
    const progressbar = within(button).getByRole('progressbar');
    
    expect(progressbar).toHaveAccessibleName('Submit');
  });
});
```

### Pattern 7: CSS-in-JS / Emotion Integration

```javascript
import { ClassNames } from '@emotion/react';

it('classes.root should overwrite builtin styles', () => {
  const color = 'rgb(255, 192, 204)';
  
  render(
    <ClassNames>
      {({ css }) => (
        <Button color="primary" classes={{ root: css({ color }) }}>
          This text should be pink
        </Button>
      )}
    </ClassNames>,
  );
  
  const button = screen.getByRole('button');
  expect(getComputedStyle(button).color).to.equal(color);
});
```

### Pattern 8: SSR / String Rendering

```javascript
describe.skipIf(!isJsdom())('server-side', () => {
  it('should server-side render', () => {
    // Only runs in jsdom (SSR test environment)
    const { container } = renderToString(<Button>Hello World</Button>);
    expect(container.firstChild).to.have.text('Hello World');
  });
});
```

---

## 7. Testing Best Practices Observed

### Do's ✅
- **Co-locate tests** with components (`Button.tsx` + `Button.test.js` in same dir)
- **Use semantic queries** (`screen.getByRole()`, `getByTestId()`) not DOM selectors
- **Test behavior** not implementation (click events, not internal state)
- **Use `act()`** wrapper around state changes and events
- **Test accessibility** with roles, labels, and computed properties
- **Parametrize prop combinations** to avoid test duplication
- **Mock only at integration boundaries** (theme, console, external APIs)
- **Use `describeConformance`** to ensure component API consistency
- **Skip jsdom-incompatible tests** with `it.skipIf(isJsdom())`
- **Test both jsdom and browser environments** for critical features

### Don'ts ❌
- **Avoid snapshot testing** (not used in Material-UI codebase)
- **Don't test implementation details** (internal state, function calls)
- **Don't mock at the component level** (use real components when possible)
- **Don't hardcode timeouts** (use fake timers via `createRenderer({ clock: 'fake' })`)
- **Don't skip critical tests** (use conditional skips carefully)

---

## 8. Key Test Configuration Details

### Vitest Shared Config Highlights

**File**: `/vitest.shared.mts`

```typescript
// Transforms .js files as JSX automatically
function forceJsxForJsFiles(): Plugin { ... }

// Environment detection
function getVitestEnvironment(fileName: string): 'browser' | 'node' {
  if (basename.includes('.browser.')) return 'browser';
  return 'node';
}

// Fake timers include performance.now
fakeTimers: {
  toFake: [...configDefaults.fakeTimers.toFake, 'performance'],
}

// Browser testing with Playwright
browser: {
  provider: playwright({
    launchOptions: { ignoreDefaultArgs: [...] }
  }),
  headless: true,
  viewport: { width: 1024, height: 896 },
  instances: [{ browser: 'chromium' }],
}
```

### Setup File

**File**: `/test/setupVitest.ts`

```typescript
import setupVitest from '@mui/internal-test-utils/setupVitest';
setupVitest({ emotion: true });

// Firefox-specific workaround for focus() method
if (isFirefox && !isJsdom) {
  Object.defineProperty(HTMLElement.prototype, 'focus', {
    configurable: true,
    value: function focusWithoutArguments() {
      originalFocus.call(this); // Always without arguments
    },
  });
}
```

---

## 9. Dependencies & Tool Stack

### Test Framework & Runners
- **Vitest** — Fast unit test runner (Jest-compatible)
- **jsdom** — DOM emulation for Node.js
- **@vitest/browser-playwright** — Real browser testing

### Testing Libraries
- **@testing-library/react** (via `@mui/internal-test-utils`)
  - `screen` — Accessible element queries
  - `fireEvent` — Event simulation
  - `act()` — React batching wrapper
  - `within()` — Scoped queries

### Assertions & Mocking
- **chai** — BDD-style assertions (`expect().to.equal()`)
- **sinon** — Spies and mocks (`spy()`, `stub()`)
- **@emotion/react** — CSS-in-JS testing via `ClassNames` component

### Custom Test Utils
- **@mui/internal-test-utils**
  - `createRenderer()` — Test environment factory
  - `describeConformance()` — Component API testing
  - `describeTransitionConformance()` — Transition testing
  - `ripple.*` — Touch ripple testing

### Environment & Config
- **React 19.x** — Target library being tested
- **TypeScript** — Type checking for tests
- **Vitest Workspaces** — Multi-package test coordination

---

## 10. Summary: Material-UI's Testing Philosophy

| Aspect | Approach |
|--------|----------|
| **Organization** | Co-locate unit tests; integrate tests in `/test/integration/` |
| **Coverage** | Systematic prop combinations; accessibility; jsdom + browser |
| **Utilities** | `describeConformance()` ensures API consistency across 100+ components |
| **Patterns** | Focus on behavior, accessibility, keyboard nav, state transitions |
| **Mocking** | Minimal (theme + console); prefer real components & events |
| **Environments** | Dual-run jsdom (fast) + Playwright browser (accurate) |
| **Tools** | Vitest (runner) + chai (assertions) + sinon (spies) + testing-library (queries) |
| **Quality Gates** | V8 coverage, CI integration, skip conditions for browser-only tests |

---

## Resources

- **Codebase Locations**:
  - Components & unit tests: `/packages/mui-material/src/*/`
  - Integration tests: `/packages/mui-material/test/integration/`
  - Test utilities: `/packages/mui-material/test/` & `/packages-internal/test-utils/`
  - Vitest config: `/vitest.config.mts`, `/vitest.shared.mts`

- **Key Files**:
  - `describeConformance.ts` — Material-UI's signature testing utility
  - `Button.test.js` — Reference: comprehensive component test
  - `Menu.test.js` — Reference: integration test with stateful components
  - `setupVitest.ts` — Global test setup & environment fixes

---

🤖 *Codex Oracle — Mapping the invisible patterns of quality assurance*
