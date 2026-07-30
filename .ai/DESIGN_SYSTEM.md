# 🎨 Design System & Tokens

**Purpose**: Single source of truth for all design decisions (colors, typography, spacing, etc.).

**Usage**: Reference this file when building UIs. Use CSS variables and Tailwind tokens derived from these definitions.

---

## 📋 Overview

Design tokens are the atomic values used to build UI. They ensure consistency across all products.

| Category | Purpose | Example |
|----------|---------|---------|
| **Colors** | Brand, semantic, feedback | `--color-primary-500` |
| **Typography** | Fonts, sizes, weights, line-height | `--font-size-lg` |
| **Spacing** | Padding, margin, gaps | `--space-4` |
| **Radius** | Border radius | `--radius-md` |
| **Shadows** | Depth, elevation | `--shadow-md` |
| **Animation** | Duration, easing | `--duration-normal`, `--ease-out` |
| **Z-index** | Stacking order | `--z-modal` |
| **Breakpoints** | Responsive design | `--breakpoint-tablet` |

---

## 🎨 Color Tokens

### Primary Colors (Brand)
```css
--color-primary-50:  #f0f4ff;
--color-primary-100: #e6ecff;
--color-primary-200: #d1dffe;
--color-primary-300: #b3d4ff;
--color-primary-400: #7ab5ff;
--color-primary-500: #2563eb;  /* Primary */
--color-primary-600: #1d4ed8;
--color-primary-700: #1e40af;
--color-primary-800: #1e3a8a;
--color-primary-900: #172554;
```

### Secondary Colors (Accent)
```css
--color-secondary-50:  #f5f3ff;
--color-secondary-100: #ede9fe;
--color-secondary-500: #8b5cf6;  /* Secondary */
--color-secondary-900: #4c1d95;
```

### Semantic Colors
```css
/* Success */
--color-success-50:  #f0fdf4;
--color-success-100: #dcfce7;
--color-success-500: #16a34a;
--color-success-900: #14532d;

/* Warning */
--color-warning-50:  #fffbeb;
--color-warning-100: #fef3c7;
--color-warning-500: #f59e0b;
--color-warning-900: #78350f;

/* Error */
--color-error-50:  #fef2f2;
--color-error-100: #fee2e2;
--color-error-500: #dc2626;
--color-error-900: #7f1d1d;

/* Info */
--color-info-50:  #f0f9ff;
--color-info-100: #e0f2fe;
--color-info-500: #0284c7;
--color-info-900: #082f49;
```

### Neutral Colors (Text, Backgrounds)
```css
--color-gray-0:    #ffffff;
--color-gray-50:   #f9fafb;
--color-gray-100:  #f3f4f6;
--color-gray-200:  #e5e7eb;
--color-gray-300:  #d1d5db;
--color-gray-400:  #9ca3af;
--color-gray-500:  #6b7280;
--color-gray-600:  #4b5563;
--color-gray-700:  #374151;
--color-gray-800:  #1f2937;
--color-gray-900:  #111827;
--color-gray-1000: #000000;
```

### Usage
```css
/* Backgrounds */
--color-bg-primary: var(--color-gray-0);      /* Light bg */
--color-bg-secondary: var(--color-gray-50);   /* Card bg */
--color-bg-tertiary: var(--color-gray-100);   /* Hover bg */

/* Text */
--color-text-primary: var(--color-gray-900);    /* Main text */
--color-text-secondary: var(--color-gray-600);  /* Subtext */
--color-text-tertiary: var(--color-gray-500);   /* Weak text */
--color-text-inverse: var(--color-gray-0);      /* On dark bg */

/* Borders */
--color-border-light: var(--color-gray-200);
--color-border-base: var(--color-gray-300);
--color-border-dark: var(--color-gray-400);
```

### Dark Mode
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: var(--color-gray-900);
    --color-bg-secondary: var(--color-gray-800);
    --color-bg-tertiary: var(--color-gray-700);
    --color-text-primary: var(--color-gray-100);
    --color-text-secondary: var(--color-gray-400);
    --color-text-tertiary: var(--color-gray-500);
  }
}
```

---

## 🔤 Typography Tokens

### Fonts
```css
--font-family-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
--font-family-serif: Georgia, serif;
--font-family-mono: "Courier New", monospace;
```

### Font Sizes (Modular Scale 1.125x)
```css
--font-size-xs:   0.75rem;    /* 12px */
--font-size-sm:   0.875rem;   /* 14px */
--font-size-base: 1rem;       /* 16px */
--font-size-lg:   1.125rem;   /* 18px */
--font-size-xl:   1.25rem;    /* 20px */
--font-size-2xl:  1.5rem;     /* 24px */
--font-size-3xl:  1.875rem;   /* 30px */
--font-size-4xl:  2.25rem;    /* 36px */
```

### Font Weights
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Line Heights
```css
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
--line-height-loose: 2;
```

### Letter Spacing
```css
--letter-spacing-tight: -0.02em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.05em;
```

### Text Styles (Semantic)
```css
/* Headings */
--text-h1: {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
}

--text-h2: {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

/* Body */
--text-body-lg: {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

--text-body-base: {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

--text-body-sm: {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

/* Captions */
--text-caption: {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-wide);
}
```

---

## 📏 Spacing Tokens

### Base Unit
Base unit is **0.25rem (4px)** or **1rem (16px)** depending on scale.

```css
/* Small scale (0.25rem base) */
--space-1:  0.25rem;   /* 4px */
--space-2:  0.5rem;    /* 8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-5:  1.25rem;   /* 20px */
--space-6:  1.5rem;    /* 24px */
--space-8:  2rem;      /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
--space-32: 8rem;      /* 128px */
```

### Usage
```css
/* Padding */
padding: var(--space-4);       /* 16px all sides */
padding-inline: var(--space-8); /* 32px left/right */

/* Margin */
margin-bottom: var(--space-2); /* 8px below */

/* Gap (flexbox/grid) */
gap: var(--space-4);           /* 16px between items */
```

---

## 🎯 Border Radius Tokens

```css
--radius-none: 0;
--radius-sm:   0.25rem;   /* 4px - subtle rounding */
--radius-md:   0.5rem;    /* 8px - standard rounding */
--radius-lg:   1rem;      /* 16px - prominent rounding */
--radius-full: 9999px;    /* Fully rounded (pills, circles) */
```

### Usage
```css
button {
  border-radius: var(--radius-md);  /* 8px */
}

.pill {
  border-radius: var(--radius-full);  /* Fully rounded */
}
```

---

## 🌑 Shadow Tokens

```css
--shadow-none:  none;

/* Subtle shadows (cards, overlays) */
--shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1);

/* Deep shadows (modals, dropdowns) */
--shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Dark mode shadows (slightly deeper) */
@media (prefers-color-scheme: dark) {
  --shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.4);
}
```

### Usage
```css
.card {
  box-shadow: var(--shadow-md);  /* Card elevation */
}

.modal {
  box-shadow: var(--shadow-2xl);  /* Modal depth */
}
```

---

## ⏱️ Animation Tokens

### Durations
```css
--duration-fast:   150ms;   /* Micro-interactions */
--duration-normal: 250ms;   /* Standard animations */
--duration-slow:   350ms;   /* Entrance animations */
--duration-slower: 500ms;   /* Long animations */
```

### Easing Functions
```css
--ease-in:        cubic-bezier(0.4, 0, 1, 1);       /* Slow start */
--ease-out:       cubic-bezier(0, 0, 0.2, 1);       /* Slow end (default) */
--ease-in-out:    cubic-bezier(0.4, 0, 0.2, 1);     /* Slow start & end */
--ease-linear:    linear;                            /* Constant speed */
```

### Transitions
```css
--transition-fast:   var(--duration-fast) var(--ease-out);
--transition-normal: var(--duration-normal) var(--ease-out);
--transition-slow:   var(--duration-slow) var(--ease-out);
```

### Usage
```css
button {
  transition: background-color var(--transition-fast);
}

button:hover {
  background-color: var(--color-primary-600);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal {
  animation: slideIn var(--transition-slow);
}
```

---

## 📦 Z-Index Tokens

```css
/* Organized stacking context */
--z-dropdown:       1000;   /* Dropdowns, tooltips */
--z-sticky:         1020;   /* Sticky headers */
--z-fixed:          1030;   /* Fixed navigation */
--z-modal-backdrop: 1040;   /* Modal background */
--z-modal:          1050;   /* Modals, dialogs */
--z-popover:        1060;   /* Popovers, notifications */
--z-tooltip:        1070;   /* Tooltips (always on top) */
```

### Usage
```css
.dropdown {
  z-index: var(--z-dropdown);
}

.modal {
  z-index: var(--z-modal);
}

.modal::backdrop {
  z-index: var(--z-modal-backdrop);
}
```

---

## 📱 Responsive Breakpoints

```css
--breakpoint-mobile:  640px;   /* Small phones */
--breakpoint-tablet:  1024px;  /* Tablets, large phones */
--breakpoint-desktop: 1280px;  /* Desktops */
```

### Usage (Mobile-First)
```css
/* Mobile first */
.container {
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: var(--breakpoint-tablet)) {
  .container {
    padding: 2rem;
  }
}

/* Desktop and up */
@media (min-width: var(--breakpoint-desktop)) {
  .container {
    max-width: 1280px;
  }
}
```

---

## 📦 Container & Layout

```css
--container-width: 1280px;     /* Max width for content */
--container-padding: 1rem;     /* Default padding on mobile */
--container-padding-lg: 2rem;  /* Padding on larger screens */
--grid-cols: 12;               /* Grid columns */
--grid-gap: var(--space-4);    /* Gap between grid items */
```

---

## 🎯 Component-Specific Tokens

### Button
```css
--button-height-sm: 32px;
--button-height-md: 40px;
--button-height-lg: 48px;
--button-padding-x: var(--space-4);
--button-padding-y: var(--space-2);
--button-radius: var(--radius-md);
--button-transition: var(--transition-fast);
```

### Input
```css
--input-height: 40px;
--input-padding: var(--space-3) var(--space-4);
--input-radius: var(--radius-md);
--input-border-width: 1px;
--input-border-color: var(--color-border-base);
--input-focus-ring-width: 2px;
--input-focus-ring-color: var(--color-primary-500);
```

### Card
```css
--card-padding: var(--space-6);
--card-radius: var(--radius-lg);
--card-shadow: var(--shadow-md);
--card-border: 1px solid var(--color-border-light);
```

---

## ✅ Implementation Checklist

- [ ] All colors use token variables, never hardcoded hex
- [ ] All spacing uses token variables
- [ ] All typography uses font-size/weight tokens
- [ ] All border-radius uses radius tokens
- [ ] All shadows use shadow tokens
- [ ] All animations use duration/easing tokens
- [ ] Z-index follows token hierarchy
- [ ] Responsive breakpoints use token values
- [ ] Dark mode supported for all colors
- [ ] Contrast ratios meet WCAG AA minimum

---

**Version**: 1.0  
**Last Updated**: 2026-07-21  
**Authority**: Omega Design Director
