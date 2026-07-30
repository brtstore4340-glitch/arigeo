# MARCUZ DESIGN SYSTEM

**Status**: Production-Ready Tokens & Components  
**Date**: 2026-07-04  
**Purpose**: Single source of truth for visual design  

---

## 🎨 COLOR TOKENS

### Primary Colors (Core Brand)
```
--color-white: #FFFFFF
--color-black-soft: #1A1A1A
--color-graphite: #4A4A4A
--color-gray-warm: #F5F5F5
--color-gray-medium: #E5E5E5
--color-blue-accent: #2563EB
--color-blue-light: #EFF6FF
```

### Semantic Colors
```
--color-primary: var(--color-blue-accent)
--color-background: var(--color-white)
--color-text-primary: var(--color-black-soft)
--color-text-secondary: var(--color-graphite)
--color-border: var(--color-gray-medium)
--color-hover: rgba(0, 0, 0, 0.05)
--color-focus: var(--color-blue-accent)
```

### Component Colors
```
--button-bg-primary: var(--color-primary)
--button-text-primary: var(--color-white)
--button-bg-hover: #1d4ed8
--button-bg-ghost: transparent
--button-border-ghost: var(--color-border)

--input-bg: var(--color-white)
--input-border: var(--color-border)
--input-border-focus: var(--color-primary)
--input-text: var(--color-text-primary)

--card-bg: var(--color-white)
--card-border: var(--color-gray-medium)
--card-shadow: 0 2px 8px rgba(0, 0, 0, 0.06)

--text-primary: var(--color-text-primary)
--text-secondary: var(--color-text-secondary)
--text-tertiary: var(--color-graphite)
```

---

## 📏 TYPOGRAPHY TOKENS

### Font Families
```
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif
--font-display: "Inter", var(--font-sans)
--font-mono: "Fira Code", monospace
```

### Font Sizes & Scales
```
Display (Hero):
--font-size-display-xl: 56px (desktop), 40px (tablet), 32px (mobile)
--font-size-display-lg: 48px (desktop), 36px (tablet), 28px (mobile)
--font-size-display-md: 40px (desktop), 32px (tablet), 24px (mobile)

Heading:
--font-size-h1: 40px (desktop), 32px (mobile)
--font-size-h2: 32px (desktop), 24px (mobile)
--font-size-h3: 24px (desktop), 20px (mobile)
--font-size-h4: 20px (desktop), 18px (mobile)

Body:
--font-size-lg: 18px
--font-size-base: 16px
--font-size-sm: 14px
--font-size-xs: 12px
```

### Font Weights
```
--font-weight-light: 300
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

### Line Heights
```
--line-height-tight: 1.2
--line-height-normal: 1.6
--line-height-relaxed: 1.8
```

### Letter Spacing
```
--letter-spacing-tight: -0.02em
--letter-spacing-normal: 0
--letter-spacing-wide: 0.02em
```

---

## 📐 SPACING TOKENS (8px base scale)

```
--space-0: 0
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px

Semantic:
--spacing-xs: var(--space-2)
--spacing-sm: var(--space-4)
--spacing-md: var(--space-6)
--spacing-lg: var(--space-8)
--spacing-xl: var(--space-12)
--spacing-2xl: var(--space-16)
--spacing-3xl: var(--space-24)
```

---

## 🎯 BORDER & RADIUS TOKENS

### Border Widths
```
--border-width-thin: 1px
--border-width-medium: 2px
--border-width-thick: 3px
```

### Border Radius
```
--radius-none: 0
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-full: 9999px
```

### Component Radius
```
--button-radius: var(--radius-md)
--input-radius: var(--radius-md)
--card-radius: var(--radius-lg)
--modal-radius: var(--radius-lg)
```

---

## 💫 SHADOW TOKENS

```
Elevation Shadows:
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06)
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08)
--shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.10)
--shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.12)

Focus Shadows:
--shadow-focus: 0 0 0 3px var(--color-blue-light)

Component Shadows:
--card-shadow: var(--shadow-sm)
--modal-shadow: var(--shadow-xl)
--button-shadow-hover: var(--shadow-md)
```

---

## ⏱️ MOTION TOKENS

### Durations
```
--duration-fast: 150ms
--duration-normal: 200ms
--duration-slow: 300ms
--duration-slower: 500ms
```

### Easing Functions
```
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
--ease-linear: linear
```

### Transition Tokens
```
--transition-fast: all var(--duration-fast) var(--ease-out)
--transition-normal: all var(--duration-normal) var(--ease-out)
--transition-slow: all var(--duration-slow) var(--ease-out)

--transition-colors: color, background-color, border-color var(--duration-normal) var(--ease-out)
--transition-transform: transform var(--duration-normal) var(--ease-out)
--transition-opacity: opacity var(--duration-normal) var(--ease-out)
```

### Animations
```
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(16px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(-8px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

### Reduced Motion Support
```
@media (prefers-reduced-motion: reduce) {
  * {
    --duration-fast: 0ms !important;
    --duration-normal: 0ms !important;
    --duration-slow: 0ms !important;
    --duration-slower: 0ms !important;
    animation: none !important;
  }
}
```

---

## 📦 COMPONENT TOKENS

### Button Component
```
Button Base:
--button-padding-inline: var(--space-4)
--button-padding-block: var(--space-2)
--button-height: 44px (min touch target)
--button-radius: var(--radius-md)
--button-font-size: var(--font-size-base)
--button-font-weight: var(--font-weight-semibold)
--button-transition: var(--transition-normal)

Button States:
--button-bg-primary: var(--color-primary)
--button-text-primary: var(--color-white)
--button-bg-primary-hover: #1d4ed8
--button-bg-primary-active: #1e40af
--button-border-primary-focus: var(--color-blue-accent)

Button Secondary:
--button-bg-secondary: var(--color-gray-warm)
--button-text-secondary: var(--color-text-primary)
--button-bg-secondary-hover: var(--color-gray-medium)

Button Ghost:
--button-bg-ghost: transparent
--button-text-ghost: var(--color-primary)
--button-border-ghost: var(--color-border)
--button-bg-ghost-hover: var(--color-gray-warm)
```

### Input Component
```
--input-height: 40px
--input-padding-inline: var(--space-3)
--input-padding-block: var(--space-2)
--input-font-size: var(--font-size-base)
--input-border: 1px solid var(--color-border)
--input-border-focus: 2px solid var(--color-primary)
--input-radius: var(--radius-md)
--input-bg: var(--color-white)
--input-text: var(--color-text-primary)
--input-placeholder: var(--color-graphite)
--input-shadow-focus: var(--shadow-focus)
```

### Card Component
```
--card-bg: var(--color-white)
--card-border: 1px solid var(--color-gray-medium)
--card-border-radius: var(--radius-lg)
--card-padding: var(--space-6)
--card-shadow: var(--shadow-sm)
--card-shadow-hover: var(--shadow-md)
--card-transition: var(--transition-normal)
```

### Section Component
```
--section-padding-block: var(--space-24) (desktop), var(--space-12) (mobile)
--section-padding-inline: var(--spacing-xl)
--section-max-width: 1200px
--section-gap: var(--space-16)
```

---

## ♿ ACCESSIBILITY TOKENS

### Focus States
```
--focus-outline: 2px solid var(--color-primary)
--focus-outline-offset: 2px
```

### Contrast Ratios
```
Text on Light:
--text-primary: #1A1A1A (14:1 contrast on white)
--text-secondary: #4A4A4A (7:1 contrast on white)

Interactive Elements:
--color-primary: #2563EB (4.5:1 contrast on white)
```

### High Contrast Mode
```
@media (prefers-contrast: more) {
  --color-primary: #0043E6
  --text-primary: #000000
  --card-border: 2px solid var(--color-text-primary)
}
```

---

## 📱 RESPONSIVE BREAKPOINTS

```
--breakpoint-mobile: 640px
--breakpoint-tablet: 768px
--breakpoint-desktop: 1024px
--breakpoint-wide: 1280px
--breakpoint-ultra: 1536px
```

---

## 🔗 CSS LOGICAL PROPERTIES (RTL Support)

```
/* Use logical properties for automatic RTL support */
--margin-start: margin-inline-start
--margin-end: margin-inline-end
--padding-start: padding-inline-start
--padding-end: padding-inline-end
--text-align-start: text-align: start
--text-align-end: text-align: end
```

---

## 📊 GRID & LAYOUT

### Container Queries
```
--container-sm: 300px
--container-md: 600px
--container-lg: 900px
--container-xl: 1200px
```

### Grid
```
--grid-cols-mobile: 1
--grid-cols-tablet: 2
--grid-cols-desktop: 3
--grid-gap: var(--space-6)
```

---

## 🎯 IMPLEMENTATION

### CSS Variables File Structure
```
:root {
  /* Colors */
  --color-white: #FFFFFF;
  --color-black-soft: #1A1A1A;
  /* ... all color tokens ... */
  
  /* Typography */
  --font-sans: ...;
  --font-size-base: 16px;
  /* ... all typography tokens ... */
  
  /* Spacing */
  --space-0: 0;
  --space-1: 4px;
  /* ... all spacing tokens ... */
  
  /* Motion */
  --duration-fast: 150ms;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  /* ... all motion tokens ... */
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    /* ... zero out all motion ... */
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Future: dark mode overrides */
  }
}
```

---

## ✅ TOKEN CHECKLIST

- [x] Color system (primitive + semantic + component)
- [x] Typography system (sizes + weights + line-heights)
- [x] Spacing scale (8px base)
- [x] Border & radius tokens
- [x] Shadow elevation system
- [x] Motion & animation tokens
- [x] Component-specific tokens
- [x] Accessibility tokens
- [x] Responsive breakpoints
- [x] RTL support (logical properties)

**Status**: Ready for implementation in Next.js
