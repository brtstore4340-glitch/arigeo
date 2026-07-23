# 💻 Implementation Rules

**Applies to**: All code implementation by Claude Code, Codex, Hermes, and frontend agents.

**Principle**: Code is read more often than written. Optimize for clarity, performance, and maintainability.

---

## 🚫 Never

- ❌ Rewrite unrelated code
- ❌ Modify files you don't understand
- ❌ Introduce breaking changes
- ❌ Hardcode content that belongs in CMS/config
- ❌ Use inline styles (use CSS variables + Tailwind)
- ❌ Create duplicate components
- ❌ Ignore TypeScript strict mode
- ❌ Skip linting/formatting
- ❌ Commit unformatted code
- ❌ Use `any` in TypeScript
- ❌ Leave console.logs in production code
- ❌ Hardcode API endpoints
- ❌ Skip accessibility testing
- ❌ Commit without running tests
- ❌ Use non-semantic HTML (`<div>` for buttons)

---

## ✅ Always

- ✅ Modify **only the minimum required files**
- ✅ Preserve existing architecture
- ✅ Reuse existing components first
- ✅ Prefer composition over duplication
- ✅ Respect TypeScript strict mode
- ✅ Follow ESLint configuration
- ✅ Follow Prettier formatting
- ✅ Use semantic HTML (`<button>`, `<nav>`, `<header>`)
- ✅ Use CSS variables for tokens
- ✅ Prefer Tailwind utility classes
- ✅ Optimize bundle size
- ✅ Keep components under 250 lines (split larger ones)
- ✅ Use server components where possible (avoid unnecessary client components)
- ✅ Support localization in all content
- ✅ Ensure responsive design (desktop, tablet, mobile)
- ✅ Test on multiple devices (no layout shift)
- ✅ Run all tests before committing
- ✅ Write tests for new functionality
- ✅ Document complex logic with comments
- ✅ Use meaningful variable/function names

---

## 🏗️ Architecture

### Component Naming
```typescript
// ✅ Good
export function UserProfileCard({ user }: Props) { }
export function SubmitButton({ onClick }: Props) { }

// ❌ Bad
export function Card({ data }: Props) { }
export function Btn({ click }: Props) { }
```

### File Organization
```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   ├── features/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── KPICard.tsx
│   │   │   ├── FilterBar.tsx
├── hooks/
│   ├── useUser.ts
│   ├── useFetch.ts
├── types/
│   ├── user.ts
│   ├── api.ts
├── styles/
│   ├── globals.css (CSS variables)
│   ├── tokens.css
├── utils/
│   ├── format.ts
│   ├── api.ts
```

### Component Structure
```typescript
// ✅ Good structure
import { FC } from 'react';
import { Button } from '@/components/common/Button';
import styles from './MyComponent.module.css';

interface Props {
  title: string;
  onClick?: () => void;
}

export const MyComponent: FC<Props> = ({ title, onClick }) => {
  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Button onClick={onClick}>Click me</Button>
    </div>
  );
};
```

---

## 🎨 CSS & Styling

### CSS Variables (Must Use)
```css
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-success: #16a34a;
  --color-error: #dc2626;
  
  /* Typography */
  --font-family-sans: system-ui, sans-serif;
  --font-size-base: 1rem;
  --line-height-normal: 1.5;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  
  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-normal: 250ms ease-out;
}
```

### Tailwind Usage
```html
<!-- ✅ Good: Use utility classes -->
<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
  Click me
</button>

<!-- ❌ Bad: Inline styles -->
<button style="padding: 8px 16px; background-color: #2563eb; color: white;">
  Click me
</button>
```

### Dark Mode
```css
/* Always support dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text: #e5e7eb;
    --color-bg: #1f2937;
  }
}
```

---

## 🔤 Typography

### Font Sizes (Use Scale)
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
```

### Line Heights
```css
--line-height-tight: 1.25;  /* Headings */
--line-height-normal: 1.5;  /* Body text */
--line-height-loose: 1.75;  /* Lists, special text */
```

### Font Weights (Use Strategically)
```css
font-weight: 400;  /* Regular body text */
font-weight: 500;  /* Medium emphasis (labels) */
font-weight: 600;  /* Semibold (headings, strong) */
font-weight: 700;  /* Bold (headings only) */
```

---

## ♿ Accessibility (WCAG 2.2)

### Color Contrast
```css
/* Minimum WCAG AA */
/* Body text: 4.5:1 ratio */
/* Large text (18pt+): 3:1 ratio */
color: #333;           /* Foreground on white: 12:1 ✅ */
color: #767676;        /* Foreground on white: 4.5:1 ✅ */
```

### Focus Indicators
```css
/* Always visible focus states */
button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Not display: none or invisible */
/* Not outline: none */
```

### Semantic HTML
```html
<!-- ✅ Good -->
<nav>Navigation</nav>
<header>Header</header>
<main>Main content</main>
<article>Article</article>
<button>Click me</button>  <!-- Never div with click -->
<input type="text" />       <!-- Never div with typing -->

<!-- ❌ Bad -->
<div onClick={handleClick}>Click me</div>  <!-- Not accessible -->
```

### ARIA Labels
```jsx
/* When content is not text */
<button aria-label="Close menu">×</button>

/* For icons without text */
<Icon aria-label="Search" />

/* For form fields */
<input aria-label="Search products" />
```

### Keyboard Navigation
```jsx
/* All interactive elements must be keyboard accessible */
<button onClick={handleClick}>Submit</button>  /* Native keyboard nav */
<a href="/page">Link</a>                        /* Native keyboard nav */

/* Tab order logical (left-to-right, top-to-bottom) */
/* Use tabIndex only when necessary (rarely) */
```

---

## 🚀 Performance

### Image Optimization
```jsx
/* ✅ Good: Optimized image */
<img 
  src="image.webp" 
  alt="Description"
  width="800"
  height="600"
  loading="lazy"
/>

/* Use Next.js Image component if available */
<Image src={img} alt="desc" width={800} height={600} />
```

### Bundle Size
```javascript
// ✅ Good: Tree-shakeable import
import { Button } from '@/components/Button';

// ❌ Bad: Import entire library
import * as Components from '@/components';
```

### Avoid Unnecessary JavaScript
```jsx
/* ✅ Good: Use CSS for simple interactions */
.button:hover { opacity: 0.8; }

/* ❌ Bad: JavaScript for hover effect */
useEffect(() => { /* hover logic */ }, [])
```

### Code Splitting
```jsx
/* ✅ Good: Lazy load non-critical components */
const Modal = lazy(() => import('./Modal'));

/* ❌ Bad: Load everything upfront */
import Modal from './Modal';
```

---

## 🧪 Testing

### Unit Tests
```typescript
/* Test component behavior */
describe('Button', () => {
  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Accessibility Tests
```typescript
/* Use jest-axe for a11y testing */
it('has no accessibility violations', async () => {
  const { container } = render(<Button>Click</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 📝 TypeScript

### Strict Mode Required
```typescript
/* tsconfig.json */
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### Type Definitions
```typescript
/* ✅ Good: Explicit types */
interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

/* ❌ Bad: Using any */
interface ButtonProps {
  onClick?: any;
  children: any;
}
```

### Avoid `any`
```typescript
/* ✅ Good: Use unknown with type guard */
function handleData(data: unknown) {
  if (typeof data === 'string') {
    console.log(data.toUpperCase());
  }
}

/* ❌ Bad */
function handleData(data: any) {
  console.log(data.toUpperCase());
}
```

---

## 📱 Responsive Design

### Mobile-First Approach
```css
/* ✅ Good: Start mobile, enhance for larger screens */
.container {
  padding: 1rem;  /* Mobile */
}

@media (min-width: 640px) {
  .container {
    padding: 2rem;  /* Tablet+ */
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 4rem;  /* Desktop */
  }
}

/* ❌ Bad: Desktop-first */
.container { padding: 4rem; }
@media (max-width: 1024px) { .container { padding: 2rem; } }
```

### No Layout Shift
```css
/* ✅ Good: Reserve space for dynamic content */
.loading-placeholder {
  min-height: 200px;  /* Prevents shift when content loads */
}

/* ✅ Good: Use aspect-ratio for images */
img {
  aspect-ratio: 16 / 9;
}

/* ❌ Bad: Content causes layout shift */
.content { /* No height specified */ }
```

### Touch Targets
```css
/* Minimum 44×44px for touch targets */
button {
  min-width: 44px;
  min-height: 44px;
  padding: 0.75rem 1rem;  /* At least 44×44px */
}
```

---

## 🌐 Localization

### Never Hardcode Strings
```jsx
/* ✅ Good: Use i18n */
import { useTranslation } from 'react-i18next';

export function Button() {
  const { t } = useTranslation();
  return <button>{t('common.submit')}</button>;
}

/* ❌ Bad: Hardcoded strings */
export function Button() {
  return <button>Submit</button>;  /* Not translatable */
}
```

### Support RTL
```css
/* ✅ Good: Use logical properties */
margin-inline-start: 1rem;  /* Works for LTR and RTL */
text-align: start;          /* Adapts to document direction */

/* ❌ Bad: Physical properties */
margin-left: 1rem;          /* Breaks in RTL */
text-align: left;           /* Wrong direction in RTL */
```

---

## 🔒 Security

### XSS Prevention
```jsx
/* ✅ Good: React escapes by default */
<div>{userInput}</div>  /* Safe */

/* ❌ Bad: dangerouslySetInnerHTML */
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### Environment Variables
```javascript
/* ✅ Good: Use environment variables */
const API_URL = process.env.REACT_APP_API_URL;

/* ❌ Bad: Hardcode sensitive URLs */
const API_URL = 'https://api.example.com/secret-key';
```

---

## 📋 Commit & CI

### Pre-Commit Checks
```bash
npm run type-check   /* TypeScript */
npm run lint         /* ESLint */
npm run test         /* Tests */
npm run build        /* Build */
```

### Commit Message Format
```
type: brief description

- More detail if needed
- Explain the why, not the what

Fixes #123
```

---

**Version**: 1.0  
**Last Updated**: 2026-07-21  
**Authority**: Omega + Aris (Quality Gate)
