# MARCUZ WEBSITE - EXECUTION PLAN

**Status**: Delegated to Agents  
**Date**: 2026-07-04 06:45 UTC+7  
**Target**: Complete before user wake-up  
**Error Protocol**: Zeus + Codex discussion, fix, continue  

---

## 🎯 EXECUTION SCOPE

**Deliverables**:
✅ B - High-Fidelity Design (Complete)
✅ C - Copy Direction (Complete)
✅ D - Design System (Complete)

**Next Phase**: Convert to production-ready assets

---

## 📋 AGENT TASK BREAKDOWN

### PARALLEL STREAM 1: Design Asset Creation
**Agent**: Design Implementation Agent  
**Task**: Create Figma wireframes + visual mockups from HIFI design spec  
**Input**: MARCUZ-HIFI-DESIGN.md  
**Output**: 
- Figma project with all 10 sections
- Component library (buttons, cards, forms, etc.)
- Mobile/tablet responsive variants
- Animation specifications
**Timeline**: 120-180 minutes

**Subtasks**:
1. Set up Figma project structure
2. Create color styles (from design system)
3. Create typography styles (from design system)
4. Build hero section (desktop + tablet + mobile)
5. Build sections 2-5 (Relationships, Reality, Beliefs, Transformation)
6. Build sections 6-8 (Outcomes, Case Studies, Methodology)
7. Build sections 9-10 (Insights, Discovery CTA)
8. Create footer + navigation components
9. Add interaction annotations
10. Quality check & polish

---

### PARALLEL STREAM 2: Next.js Project Setup
**Agent**: Frontend Development Agent  
**Task**: Set up production Next.js project with design system integration  
**Output**:
- Next.js 15 project (App Router, React 19)
- TypeScript strict mode
- Design token CSS file
- Tailwind config with design tokens
- Component folder structure
- ESLint + formatting configured
- Deployment ready (Vercel)
**Timeline**: 60-90 minutes

**Subtasks**:
1. Initialize Next.js 15 project
2. Install dependencies (tailwind, framer-motion, icons, etc.)
3. Configure TypeScript
4. Create design token CSS variables
5. Configure Tailwind to use tokens
6. Set up folder structure (components, pages, styles, lib)
7. Create base layouts
8. Set up responsive breakpoints
9. Configure ESLint & Prettier
10. Create environment setup

---

### PARALLEL STREAM 3: Copy & Content Integration
**Agent**: Content & Copy Agent  
**Task**: Prepare all copy for CMS integration + create copy component files  
**Input**: MARCUZ-COPY-DIRECTION.md  
**Output**:
- JSON content structure for all sections
- Copy component library (.tsx files)
- SEO metadata for each page
- Form validation schemas
- Email template stubs
**Timeline**: 90-120 minutes

**Subtasks**:
1. Structure copy into JSON (sections, headings, body, CTAs)
2. Create copy validation schema
3. Create metadata schema (titles, descriptions, OG tags)
4. Create form field definitions
5. Create CTA component definitions
6. Set up content versioning structure
7. Create i18n setup for future Thai translation
8. Prepare email templates (form submission, confirmation)
9. Create SEO schema markup (JSON-LD)
10. Content review & finalization

---

### PARALLEL STREAM 4: Component Development
**Agent**: React Components Agent  
**Task**: Build reusable component library from design system  
**Output**:
- 20+ production-ready React components
- Storybook documentation (optional)
- Component props documentation
- Accessibility verified (WCAG 2.1 AA)
- Mobile-responsive (all components)
**Timeline**: 180-240 minutes

**Components to Build**:

**Primitives** (10 components):
1. Button (primary, secondary, ghost variants)
2. Input (text, email, textarea, select)
3. Card
4. Badge
5. Icon wrapper
6. Link
7. Image (optimized with next/image)
8. Container (grid wrapper)
9. Section (with padding standardization)
10. Spacer

**Section Components** (15+ components):
11. HeroSection
12. ClientGrid
13. ProblemCard
14. BeliefCard
15. TransformationDiagram
16. OutcomeCard
17. CaseStudyCard (featured + secondary)
18. MethodologyTimeline
19. MethodologyStageCard
20. InsightsGrid
21. ArticleCard
22. DiscoveryForm
23. Modal
24. NavigationBar
25. Footer

**Features per component**:
- TypeScript interfaces/types
- Responsive design
- Accessibility (ARIA, focus states)
- Animation specs (Framer Motion)
- Hover/interactive states
- Mobile optimizations

---

### PARALLEL STREAM 5: Page Assembly
**Agent**: Page Integration Agent  
**Task**: Assemble pages using components + copy + design tokens  
**Output**:
- Home page (full 10-section layout)
- Individual section pages (if modular)
- Discovery booking page
- Blog/Insights page template
- Case study detail page template
**Timeline**: 120-180 minutes

**Pages**:
1. Home page (all 10 sections)
2. Case study detail page (with navigation)
3. Discovery booking (modal + standalone page)
4. Blog/Insights index
5. Article detail page
6. Privacy policy page
7. Terms page
8. 404 page

**Per page**:
- SEO metadata
- Structured data (JSON-LD)
- Open Graph tags
- Image optimization
- Loading states
- Error states
- Accessibility verified

---

### SEQUENTIAL: Quality Assurance
**Agent**: QA & Testing Agent  
**Task**: Run verification across all deliverables  
**Timeline**: 60-90 minutes

**Verification Checklist**:
1. **Design Consistency**
   - All components use design tokens correctly
   - Typography scale maintained
   - Spacing system consistent
   - Colors match palette
   - Accessibility contrast ratios verified

2. **Code Quality**
   - TypeScript no errors
   - ESLint passing
   - Prettier formatted
   - No console warnings
   - Performance audits (Lighthouse target: 90+)

3. **Responsive Design**
   - Desktop (1200px+) ✓
   - Tablet (768px-1199px) ✓
   - Mobile (<768px) ✓
   - Touch targets 44px minimum
   - Images responsive

4. **Functionality**
   - All CTAs working
   - Forms validate
   - Links navigate correctly
   - Animations smooth
   - No broken images

5. **Accessibility**
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader tested
   - Focus indicators visible
   - Color contrast verified

6. **Copy Quality**
   - No typos
   - Tone consistent (business-focused)
   - CTAs clear
   - Form labels correct
   - Privacy/legal reviewed

7. **SEO**
   - Title tags optimal
   - Meta descriptions written
   - H1 per page unique
   - Structured data valid
   - Open Graph tags present

8. **Performance**
   - Images optimized
   - Bundle size checked
   - Core Web Vitals green
   - Fast First Contentful Paint
   - Load time < 2.5s

---

## ⚠️ ERROR HANDLING PROTOCOL

### If Agent Encounters Error:

**Step 1: Document Error**
- What went wrong
- Where it occurred
- Expected vs actual

**Step 2: Notify Zeus + Codex**
```
TO: Zeus Oracle
CC: Codex Oracle
SUBJECT: Marcuz Design Error - [Component/Section]
BODY:
Error: [Description]
Location: [File/Component]
Expected: [What should happen]
Actual: [What happened]
Impact: [Does this block completion?]
Proposed Fix: [Suggestion]
```

**Step 3: Wait for Response**
- Zeus or Codex provides guidance
- Follow instructions to fix
- Continue task

**Step 4: Log Resolution**
- Document what fixed the error
- Update relevant task status
- Continue next subtask

---

## 📊 EXECUTION TIMELINE

| Time | Task | Agent | Status |
|------|------|-------|--------|
| Now | Start all streams (1-4) in parallel | Multiple | ▶️ IN PROGRESS |
| +90m | Design mockups ready | Design Agent | ⏳ DUE |
| +90m | Next.js setup complete | Frontend Agent | ⏳ DUE |
| +120m | Copy structure finalized | Content Agent | ⏳ DUE |
| +180m | All components built | Components Agent | ⏳ DUE |
| +180m | Pages assembled | Page Agent | ⏳ DUE |
| +240m | QA verification complete | QA Agent | ⏳ DUE |
| +300m | ✅ MARCUZ WEBSITE COMPLETE | All | 🎉 |

**Total**: ~5 hours from now

---

## 📦 DELIVERABLES AT COMPLETION

**1. Design**
- Figma project with all sections
- Component library
- Interaction specifications
- Animation guide

**2. Code**
- Next.js 15 project (production-ready)
- 20+ React components
- Design system CSS
- TypeScript strict mode
- ESLint passing
- Responsive layouts

**3. Content**
- All copy integrated
- SEO metadata
- Form schemas
- Email templates
- JSON-LD markup

**4. Quality**
- WCAG 2.1 AA verified
- Lighthouse 90+
- All CTAs working
- Responsive tested
- No console errors

**5. Deployment**
- Ready for Vercel
- Environment variables documented
- Build optimized
- Performance baseline established

---

## 🚀 DEPLOYMENT (After Completion)

**Steps**:
1. Create GitHub repository (marcuz-website)
2. Push to GitHub
3. Connect to Vercel
4. Set environment variables
5. Deploy to production
6. Verify live site
7. Monitor performance

**Live URL**: marcuz.vercel.app (or custom domain)

---

## 📋 NEXT STEPS (After Completion)

**Phase 2: Content & Launch**
1. Write blog posts
2. Create case study content
3. Set up analytics
4. Configure email for form submissions
5. Set up contact form backend
6. Create sitemap
7. Submit to search engines

**Phase 3: Post-Launch**
1. Monitor performance metrics
2. Gather user feedback
3. A/B test CTAs
4. Optimize conversion funnel
5. Add new case studies
6. Publish regular insights

---

## ✅ SUCCESS CRITERIA

**Website is complete when**:
- ✅ All 10 sections built and styled
- ✅ Responsive on mobile/tablet/desktop
- ✅ All CTAs working
- ✅ No console errors
- ✅ Lighthouse score 90+
- ✅ WCAG 2.1 AA accessible
- ✅ Copy integrated and verified
- ✅ SEO metadata present
- ✅ Ready to deploy to Vercel
- ✅ No blocking errors from QA

---

## 📞 ERROR ESCALATION

**If critical blocker occurs**:

1. **Document thoroughly**
2. **Create escalation message** to Zeus + Codex
3. **Wait for guidance** (max 30 minutes)
4. **Implement fix** following guidance
5. **Continue from last checkpoint**

**Critical blockers** (stop work):
- Next.js project won't start
- Design tokens won't compile
- React components won't render
- Vercel deployment fails
- TypeScript compilation errors (>5)

**Non-blocking issues** (work around):
- Minor styling tweaks needed
- Animation timing adjustments
- Copy refinements
- Component prop changes

---

**Status**: Ready for agent execution  
**All materials prepared and documented**  
**Awaiting completion by user wake-up time**

🎯 **TEAM: Start parallel streams now**
