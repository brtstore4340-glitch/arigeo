# MARCUZ Component Library Documentation

A comprehensive, production-ready React component library built with TypeScript, Tailwind CSS, and Framer Motion animations. All components are fully responsive, accessible (WCAG 2.1 AA), and mobile-optimized.

## Component Architecture

```
src/components/
├── primitives/          # 10 base building blocks
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── IconWrapper.tsx
│   ├── Link.tsx
│   ├── Image.tsx
│   ├── Container.tsx
│   ├── Section.tsx
│   ├── Spacer.tsx
│   └── index.ts
├── sections/            # 13 domain-specific components
│   ├── HeroSection.tsx
│   ├── ClientCard.tsx
│   ├── ProblemCard.tsx
│   ├── BeliefCard.tsx
│   ├── OutcomeCard.tsx
│   ├── CaseStudyCard.tsx
│   ├── MethodologyTimeline.tsx
│   ├── MethodologyStageCard.tsx
│   ├── InsightsGrid.tsx
│   ├── ArticleCard.tsx
│   ├── DiscoveryForm.tsx
│   ├── TransformationDiagram.tsx
│   ├── TestimonialCard.tsx
│   └── index.ts
├── ui/                  # 3 app-level components
│   ├── Modal.tsx
│   ├── NavigationBar.tsx
│   ├── FooterRefactored.tsx
│   └── index.ts
└── index.ts            # Main export file

Total: 26 components
```

## Primitives (10 base components)

### Button
Versatile button component with multiple variants and states.
```tsx
<Button
  label="Click Me"
  variant="primary" // 'primary' | 'secondary' | 'ghost'
  size="md" // 'sm' | 'md' | 'lg'
  onClick={() => console.log('clicked')}
  loading={false}
  disabled={false}
  icon={<Icon />}
/>
```
**Features:** Multiple variants, loading state, icon support, disabled state, focus outline, hover animation

### Input
Form input component with validation and error handling.
```tsx
<Input
  label="Email"
  name="email"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={handleChange}
  error={errors.email}
  required
  variant="input" // 'input' | 'textarea'
  rows={4}
/>
```
**Features:** Validation, error messages, accessibility labels, focus states, textarea support

### Card
Container component with rounded corners, border, and shadow.
```tsx
<Card hoverable shadow="md" className="p-6">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```
**Features:** Hover effects, customizable shadow, responsive, border styling

### Badge
Small label component for categorization or status.
```tsx
<Badge
  text="Featured"
  variant="primary" // 'primary' | 'secondary' | 'accent'
/>
```
**Features:** Pill-shaped, uppercase text, multiple variants, minimal padding

### IconWrapper
Consistent sizing and color for icons.
```tsx
<IconWrapper
  icon={<SVGIcon />}
  size={40}
  color="var(--color-burgundy)"
  ariaLabel="Descriptive label"
/>
```
**Features:** Multiple sizes (32, 40, 48), color control, accessibility

### Link
Next.js Link wrapper with styling and external link handling.
```tsx
<Link
  href="/about"
  label="About Us"
  external={false}
  icon={<ArrowIcon />}
/>
```
**Features:** External link support (target="_blank"), icon support, hover animation

### Image
Optimized image component with responsive sizing.
```tsx
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority
  objectFit="cover"
/>
```
**Features:** Blur placeholder, responsive sizing, Next.js Image optimization

### Container
Responsive wrapper with max-width and centered alignment.
```tsx
<Container maxWidth="xl" className="py-8">
  Content centered in container
</Container>
```
**Features:** Responsive padding, max-width constraining, center alignment

### Section
Page section container with standardized padding and animations.
```tsx
<Section
  title="Our Services"
  intro="World-class solutions for modern challenges"
  bgColor="cream"
  id="services"
>
  Section content with automatic entrance animations
</Section>
```
**Features:** Title/intro typography, background colors, animated entrance, responsive padding

### Spacer
Flexible spacing element for layout control.
```tsx
<Spacer size="lg" direction="vertical" />
<Spacer size="md" direction="horizontal" />
```
**Features:** Multiple size options (xs to 3xl), vertical/horizontal, semantic HTML

---

## Section Components (13 domain-specific)

### HeroSection
Full-width hero section with headline, CTAs, and optional image.
```tsx
<HeroSection
  headline="Welcome to MARCUZ"
  subheading="Premium solutions for modern challenges"
  body="Discover how we transform businesses..."
  ctas={[
    { label: 'Get Started', variant: 'primary' },
    { label: 'Learn More', variant: 'secondary' }
  ]}
  socialProof="Trusted by 500+ companies"
  image={{ src: '/hero.jpg', alt: 'Hero image' }}
/>
```
**Features:** Parallax animations, staggered text, responsive CTAs, social proof

### ClientCard
Card displaying client/partner information.
```tsx
<ClientCard
  logo="/logo.png"
  name="Partner Name"
  role="Industry Leader"
  status="Featured"
/>
```
**Features:** Centered logo, hover lift effect, responsive grid support

### ProblemCard
Card highlighting a problem with icon and description.
```tsx
<ProblemCard
  icon="🎯"
  headline="Challenge"
  description="The problem statement"
  impact="Impact metric"
/>
```
**Features:** Icon/text layout, equal height in grid, hover border accent

### BeliefCard
Large text card expressing brand belief.
```tsx
<BeliefCard
  headline="Our Belief"
  description="Long form belief statement about the brand..."
/>
```
**Features:** Centered layout, large typography, hover effects

### OutcomeCard
Card showcasing positive outcomes with bullet points.
```tsx
<OutcomeCard
  icon="✓"
  headline="Result"
  description="How this benefits you"
  examples={[
    '50% improvement in efficiency',
    'Better ROI',
    'Scalable solution'
  ]}
/>
```
**Features:** Icon + text + bullet list, min-height for grid consistency

### CaseStudyCard
Detailed case study with featured and compact variants.
```tsx
<CaseStudyCard
  client="Company Name"
  headline="Project Success"
  sections={{
    challenge: { title: 'Challenge', content: '...' },
    thinking: { title: 'Thinking', content: '...' },
    approach: { title: 'Approach', content: '...' },
    solution: { title: 'Solution', content: '...' },
    outcome: { title: 'Outcome', content: '...' }
  }}
  cta={{ label: 'View Case Study' }}
  featured={true}
  image="/case-study.jpg"
/>
```
**Features:** Featured/compact variants, responsive grid, CTA button

### MethodologyTimeline
Timeline layout for methodology stages.
```tsx
<MethodologyTimeline
  stages={[
    {
      number: 1,
      title: 'Discovery',
      duration: '2 weeks',
      purpose: 'Understanding needs',
      content: ['Research', 'Interviews', 'Analysis'],
      humanCentered: true
    },
    // ... more stages
  ]}
/>
```
**Features:** Horizontal desktop / vertical mobile, connecting lines, numbered stages

### MethodologyStageCard
Individual stage in methodology timeline.
```tsx
<MethodologyStageCard
  number={1}
  title="Stage Name"
  duration="2 weeks"
  purpose="Stage purpose"
  content={['Item 1', 'Item 2']}
  humanCentered={true}
/>
```
**Features:** Numbered circle, thick border, hover effects

### InsightsGrid
Featured article + grid with category filters.
```tsx
<InsightsGrid
  featuredArticle={{
    id: '1',
    image: '/featured.jpg',
    category: 'Technology',
    title: 'Latest Insights',
    excerpt: 'Read about...',
    readMoreHref: '/blog/1'
  }}
  articles={[/* article array */]}
  categories={['Technology', 'Business', 'Design']}
  onFilterChange={(category) => console.log(category)}
/>
```
**Features:** Featured image layout, category filter pills, animated transitions

### ArticleCard
Blog/article card with image and excerpt.
```tsx
<ArticleCard
  image="/blog-post.jpg"
  category="Technology"
  title="Article Title"
  excerpt="Short summary..."
  readMoreHref="/blog/post-slug"
/>
```
**Features:** Equal height in grid, hover lift effect, category badge

### DiscoveryForm
Multi-field form with validation and loading state.
```tsx
<DiscoveryForm
  onSubmit={async (data) => {
    // Handle form submission
    await submitForm(data);
  }}
  isLoading={loading}
/>
```
**Features:** Real-time validation, success message, phone/email fields, accessibility

### TransformationDiagram
Before/After comparison layout.
```tsx
<TransformationDiagram
  beforeItems={[
    { title: 'Manual Processes', icon: '⚙️' },
    { title: 'Time-consuming', icon: '⏱️' }
  ]}
  afterItems={[
    { title: 'Automated', icon: '✓' },
    { title: 'Efficient', icon: '⚡' }
  ]}
  transitionText="Transform"
/>
```
**Features:** Responsive stacking, animated arrow, centered layout

### TestimonialCard
Customer testimonial with rating and author info.
```tsx
<TestimonialCard
  quote="This product changed how we work..."
  author="Jane Doe"
  role="CEO at Company"
  image="/profile.jpg"
  rating={5}
/>
```
**Features:** Star rating, author image, responsive, hover effects

---

## UI Components (3 app-level)

### Modal
Accessible modal dialog with focus trap.
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  closeButtonAriaLabel="Close dialog"
>
  <p>Are you sure?</p>
  <Button label="Confirm" onClick={handleConfirm} />
</Modal>
```
**Features:** Backdrop blur, fade animation, focus trap, ESC key closes

### NavigationBar
Sticky navigation with mobile menu.
```tsx
<NavigationBar
  items={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' }
  ]}
  currentPath="/about"
  logo={<span>MARCUZ</span>}
  logoHref="/"
/>
```
**Features:** Sticky positioning, hamburger menu on mobile, active state

### FooterRefactored
Multi-column footer with social links.
```tsx
<FooterRefactored
  company={{
    name: 'MARCUZ',
    tagline: 'Premium solutions'
  }}
  columns={[
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' }
      ]
    }
  ]}
  social={[
    { icon: <FacebookIcon />, href: 'https://facebook.com', label: 'Facebook' }
  ]}
  copyright="© 2026 MARCUZ. All rights reserved."
/>
```
**Features:** Responsive grid, dark background, social links, animations

---

## Global Features

### Animations
All components use Framer Motion for smooth animations:
- **FadeIn:** opacity 0 to 1 (300ms)
- **SlideUp:** translateY 16px to 0 + opacity (300ms)
- **SlideDown:** translateY -12px to 0 + opacity (300ms)
- **ScaleIn:** scale 0.95 to 1 + opacity (300ms)
- **Pulse:** scale 1 to 1.05, infinite
- Respects `prefers-reduced-motion` preference

### Accessibility
- Min contrast ratio: 4.5:1 for text
- Min touch target: 44px
- Focus visible: 2px outline + shadow
- Semantic HTML throughout
- ARIA labels where appropriate
- Color not sole indicator
- Proper form labels

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible layouts with grid/flex
- Responsive padding/margins
- Touch-optimized for mobile

### Color System
Uses CSS variables for theming:
```css
--color-burgundy      /* Primary brand color */
--color-cream         /* Background/light color */
--color-gold          /* Accent color */
--color-border        /* Border color */
--color-text          /* Primary text */
--color-text-secondary /* Secondary text */
```

### TypeScript Support
- Full TypeScript interfaces for all components
- Typed props with JSDoc comments
- Forward refs where applicable
- Strict type checking

---

## Usage Examples

### Basic Page Structure
```tsx
import {
  NavigationBar,
  HeroSection,
  Section,
  ClientCard,
  DiscoveryForm,
  FooterRefactored,
  Container
} from '@/components';

export default function Home() {
  return (
    <>
      <NavigationBar
        items={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' }
        ]}
      />

      <HeroSection
        headline="Welcome"
        subheading="Premium Solutions"
        body="Discover excellence..."
        ctas={[{ label: 'Get Started', variant: 'primary' }]}
      />

      <Section title="Clients" bgColor="cream">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ClientCard logo="/logo1.png" name="Client 1" />
            <ClientCard logo="/logo2.png" name="Client 2" />
            <ClientCard logo="/logo3.png" name="Client 3" />
          </div>
        </Container>
      </Section>

      <DiscoveryForm onSubmit={handleSubmit} />

      <FooterRefactored
        company={{ name: 'MARCUZ', tagline: 'Excellence' }}
        columns={[]}
      />
    </>
  );
}
```

---

## Quality Checklist

- [x] All components TypeScript compiled
- [x] ESLint passing
- [x] Responsive on mobile/tablet/desktop
- [x] Framer Motion animations smooth
- [x] Accessibility tested (WCAG 2.1 AA)
- [x] No console warnings
- [x] Touch targets 44px minimum
- [x] Proper focus management
- [x] Semantic HTML
- [x] Mobile-optimized

---

## File Organization

Each component file follows this structure:
1. Imports (React, Framer Motion, dependencies)
2. TypeScript interface definition
3. JSDoc component documentation
4. Component implementation
5. displayName assignment
6. Export statement

## Dependencies

- React 18+
- Next.js 13+
- TypeScript 5+
- Tailwind CSS 3+
- Framer Motion 10+

---

Generated: 2026-07-04
Version: 1.0
