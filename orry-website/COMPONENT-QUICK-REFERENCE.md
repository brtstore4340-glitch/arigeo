# Component Library - Quick Reference

## Import Patterns

### Import Everything
```typescript
import * as C from '@/components';

<C.Button label="Click" />
<C.HeroSection headline="Welcome" />
<C.Modal isOpen={true} />
```

### Import by Category
```typescript
import { Button, Input, Card, Badge } from '@/components';
import { HeroSection, ClientCard, CaseStudyCard } from '@/components';
import { Modal, NavigationBar } from '@/components';
```

### Import Specific Component
```typescript
import { Button } from '@/components/primitives';
import { HeroSection } from '@/components/sections';
import { Modal } from '@/components/ui';
```

---

## Primitives Quick Guide

### Button
```tsx
<Button label="Click Me" variant="primary" size="lg" />
```

### Input
```tsx
<Input 
  label="Email" 
  type="email" 
  error={errors.email}
  onChange={handleChange}
/>
```

### Card
```tsx
<Card hoverable>Content here</Card>
```

### Badge
```tsx
<Badge text="Featured" variant="primary" />
```

### Link
```tsx
<Link href="/about" label="About Us" external={false} />
```

### Container
```tsx
<Container maxWidth="xl">Centered content</Container>
```

### Section
```tsx
<Section title="Title" intro="Intro text">
  Section content
</Section>
```

### Spacer
```tsx
<Spacer size="lg" direction="vertical" />
```

---

## Sections Quick Guide

### HeroSection
```tsx
<HeroSection
  headline="Welcome"
  subheading="Subtitle"
  body="Description"
  ctas={[{ label: 'Start', variant: 'primary' }]}
/>
```

### Grid Layouts
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <ClientCard logo="/logo.png" name="Client" />
  <ProblemCard icon="🎯" headline="Problem" description="..." />
  <OutcomeCard icon="✓" headline="Result" description="..." />
</div>
```

### Forms
```tsx
<DiscoveryForm 
  onSubmit={handleSubmit}
  isLoading={loading}
/>
```

### Articles
```tsx
<InsightsGrid
  featuredArticle={featured}
  articles={articles}
  categories={['Tech', 'Design']}
/>
```

### Timeline
```tsx
<MethodologyTimeline stages={stages} />
```

---

## UI Components Quick Guide

### Modal
```tsx
const [open, setOpen] = useState(false);

<Modal 
  isOpen={open} 
  onClose={() => setOpen(false)}
  title="Confirm"
>
  Modal content
</Modal>
```

### NavigationBar
```tsx
<NavigationBar
  items={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' }
  ]}
  currentPath={pathname}
/>
```

### Footer
```tsx
<FooterRefactored
  company={{ name: 'Company', tagline: 'Tagline' }}
  columns={[
    {
      title: 'Links',
      links: [
        { label: 'Home', href: '/' }
      ]
    }
  ]}
/>
```

---

## Common Props

### All Components
```typescript
className?: string;   // Additional Tailwind classes
```

### Interactive Components (Button, Link, Card)
```typescript
onClick?: () => void;
disabled?: boolean;
loading?: boolean;
```

### Form Components (Input)
```typescript
value?: string;
onChange?: (e: React.ChangeEvent) => void;
onBlur?: () => void;
error?: string;
required?: boolean;
```

### Container Components (Section, Card)
```typescript
children: React.ReactNode;
className?: string;
bgColor?: 'white' | 'cream' | 'gray';
```

---

## CSS Variables (Theme)

Update these in your global styles:

```css
:root {
  --color-burgundy: #8b4654;      /* Primary brand */
  --color-cream: #f5f3f0;          /* Background */
  --color-gold: #c9a561;           /* Accent */
  --color-border: #d1d5db;         /* Borders */
  --color-text: #1f2937;           /* Text primary */
  --color-text-secondary: #6b7280; /* Text secondary */
}
```

---

## Responsive Classes (Tailwind)

All components support Tailwind responsive prefixes:

```tsx
{/* Mobile: 100%, Tablet: 50%, Desktop: 33% */}
<div className="w-full md:w-1/2 lg:w-1/3">
  Content
</div>
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## Animation Library (Framer Motion)

All components use Framer Motion for smooth animations:

- Fade in on page load
- Slide animations on scroll
- Hover scale effects
- Loading spinners
- Transitions between states

All animations respect `prefers-reduced-motion` for accessibility.

---

## Accessibility Features

All components include:
- Semantic HTML
- ARIA labels
- Focus management
- Keyboard navigation
- Color contrast (4.5:1+)
- Touch targets (44px minimum)

---

## Performance Tips

1. **Use Suspense for lazy loading**
   ```tsx
   <Suspense fallback={<Loading />}>
     <HeroSection {...props} />
   </Suspense>
   ```

2. **Memoize components**
   ```tsx
   export const MemoizedCard = React.memo(Card);
   ```

3. **Lazy load sections**
   ```tsx
   <Section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
     Content loads when visible
   </Section>
   ```

---

## Troubleshooting

### Animation not smooth
- Check Framer Motion version
- Verify GPU acceleration enabled
- Check for too many simultaneous animations

### Responsive not working
- Ensure Tailwind is properly configured
- Check breakpoint prefixes match config
- Use mobile-first approach

### Accessibility issues
- Verify ARIA labels present
- Test with keyboard navigation
- Use screen reader for testing
- Check color contrast with tools

### TypeScript errors
- Import types from component file
- Verify prop interfaces match usage
- Check forward ref setup

---

## Component Checklist for New Pages

- [ ] Import NavigationBar at top
- [ ] Import HeroSection for intro
- [ ] Use Section components for content
- [ ] Add DiscoveryForm for CTA
- [ ] Import FooterRefactored at bottom
- [ ] Style with Tailwind classes
- [ ] Test responsive design
- [ ] Verify accessibility
- [ ] Check animations

---

## Links

- Main Documentation: `/orry-website/COMPONENTS.md`
- Status Report: `/orry-website/COMPONENT-LIBRARY-STATUS.md`
- Components Directory: `/orry-website/src/components/`

---

## Support

For questions about components:
1. Check COMPONENTS.md for detailed docs
2. Review JSDoc comments in source files
3. Check TypeScript interfaces for props
4. Test in browser with React DevTools

---

Last Updated: 2026-07-04
