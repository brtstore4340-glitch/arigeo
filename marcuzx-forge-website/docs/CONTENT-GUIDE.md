# Marcuz Content System Guide

**Created**: 2026-07-04  
**Version**: 1.0.0  
**Status**: Production Ready

This guide explains the content structure, how to use it in components, and how to maintain consistency across the Marcuz website.

---

## Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Core Content Files](#core-content-files)
4. [Usage Examples](#usage-examples)
5. [Validation & Quality](#validation--quality)
6. [Maintenance](#maintenance)

---

## Overview

The Marcuz content system is organized into three layers:

1. **Content Layer** (`/src/content/copy.json`) — All website copy organized hierarchically
2. **Schema Layer** (`/src/lib/schemas.ts`) — Validation schemas and TypeScript types
3. **Constants Layer** (`/src/lib/constants.ts`) — Reusable labels, CTAs, and constants

This structure ensures:
- Single source of truth for all copy
- Type-safe content in React components
- Easy maintenance and updates
- Consistent messaging across pages

---

## File Structure

```
marcuzx-forge-website/
├── src/
│   ├── content/
│   │   └── copy.json                 # All website copy (10 sections)
│   ├── lib/
│   │   ├── schemas.ts               # Zod validation schemas & TypeScript types
│   │   ├── metadata.ts              # SEO metadata & JSON-LD structured data
│   │   ├── formDefinitions.ts       # Form field configurations
│   │   ├── constants.ts             # Reusable labels, CTAs, messages
│   │   └── i18n.ts                  # (Future) Internationalization setup
│   └── email-templates/
│       ├── discovery-confirmation.html   # User confirmation email
│       ├── discovery-notification.html   # Admin notification email
│       └── newsletter-welcome.html       # Newsletter welcome email
└── docs/
    └── CONTENT-GUIDE.md             # This file
```

---

## Core Content Files

### 1. `copy.json` — Complete Content Structure

**Purpose**: Single source of truth for all website copy

**Structure**: 10 main sections + navigation + footer

```typescript
{
  "meta": { /* Project metadata */ },
  "hero": { /* Hero section */ },
  "trustedRelationships": { /* Client logos & intro */ },
  "businessReality": { /* Problems/challenges */ },
  "beliefs": { /* Philosophy/beliefs */ },
  "transformation": { /* Before/after comparison */ },
  "outcomes": { /* Business outcomes */ },
  "caseStudies": { /* Featured + secondary */ },
  "methodology": { /* 5-stage process */ },
  "insights": { /* Knowledge hub */ },
  "discovery": { /* Discovery session CTA */ },
  "navigation": { /* Nav structure */ },
  "footer": { /* Footer content */ }
}
```

**Key Sections**:

#### Hero Section
```json
{
  "headline": "Primary headline",
  "headlineAlternatives": ["Alt 1", "Alt 2", "Alt 3"],
  "subheading": "Supporting subheading",
  "body": "Longer form copy",
  "cta": {
    "primary": "Book a Discovery Session",
    "secondary": "View Our Work"
  },
  "socialProof": "Trusted by ORRY Thailand..."
}
```

#### Trusted Relationships
```json
{
  "headline": "Section title",
  "intro": "Intro copy",
  "clients": [
    {
      "name": "Client Name",
      "role": "What they do",
      "status": "Active partner"
    }
  ]
}
```

#### Business Reality
```json
{
  "headline": "Section title",
  "intro": "Intro copy",
  "problems": [
    {
      "headline": "Problem headline",
      "description": "What this problem means",
      "impact": "Business impact statement"
    }
  ]
}
```

#### Transformation
```json
{
  "beforeState": {
    "headline": "Disconnected",
    "elements": ["Item 1", "Item 2", ...]
  },
  "transitionText": "Through thoughtful design...",
  "afterState": {
    "headline": "Connected",
    "elements": ["Item 1", "Item 2", ...]
  },
  "examples": [
    {
      "industry": "Healthcare",
      "before": "Manual processes...",
      "after": "Automated processes..."
    }
  ]
}
```

#### Outcomes
```json
{
  "outcomes": [
    {
      "headline": "Category headline",
      "description": "Full description",
      "examples": ["Example 1", "Example 2", "Example 3", "Example 4"]
    }
  ]
}
```

#### Methodology (5 Stages)
```json
{
  "stages": [
    {
      "number": 1,
      "name": "Discover",
      "headline": "Understand your business first",
      "duration": "2-4 weeks",
      "purpose": "Clarity",
      "whatHappens": ["Activity 1", "Activity 2", ...],
      "deliverable": "What you get",
      "humanCenteredApproach": "Our philosophy"
    }
  ]
}
```

#### Discovery Session Form
```json
{
  "headline": "Ready to rethink...",
  "subheading": "No pitch. No pressure.",
  "formFields": [
    {
      "name": "fullName",
      "label": "Your name",
      "placeholder": "John Smith",
      "type": "text",
      "required": true
    }
  ],
  "formFields": [
    /* 6 total fields: name, company, email, phone, challenge, preferred time */
  ]
}
```

### 2. `schemas.ts` — Validation & Types

**Purpose**: Validate content and provide TypeScript types

**Key Exports**:

```typescript
// Form validation schemas
DiscoveryFormSchema         // Discovery form validation
NewsletterSignupSchema      // Newsletter signup
ContactFormSchema           // Contact form

// Content validation schemas
ContentSchema               // Validates entire copy.json
HeroContentSchema
BusinessRealitySchema
BeliefsSchema
TransformationSchema
// ... and more

// Types
type DiscoveryFormData
type ContentData
type SeoMetadata

// Utilities
validateContent(data)       // Validates entire content object
```

**Usage Example**:

```typescript
import { DiscoveryFormSchema, validateContent, ContentData } from '@/lib/schemas';

// Validate form submission
const formData = { fullName: 'John', company: 'Acme', ... };
const result = DiscoveryFormSchema.parse(formData); // Throws if invalid

// Validate entire content
import copyData from '@/content/copy.json';
const validation = validateContent(copyData);
if (!validation.valid) {
  console.error('Content validation errors:', validation.errors);
}

// Use types in components
import type { DiscoveryFormData } from '@/lib/schemas';

const handleSubmit = (data: DiscoveryFormData) => {
  // data is fully typed
};
```

### 3. `metadata.ts` — SEO & Structured Data

**Purpose**: SEO metadata for all pages and structured data for search engines

**Key Exports**:

```typescript
siteMetadata                // Global site metadata
pageMetadata               // Per-page metadata
  .home
  .caseStudies
  .insights
  .discovery
  .orryCase

// Schema generators
organizationSchema         // Organization JSON-LD
localBusinessSchema       // Local business info
serviceSchema            // Service details
breadcrumbSchema()       // Dynamic breadcrumbs
articleSchema()          // Blog articles
faqSchema()             // FAQ structured data

// Helpers
generateOpenGraphTags()   // Open Graph meta tags
generateTwitterTags()     // Twitter Card meta tags
generateMetaTags()       // Complete meta tags object
```

**Usage Example**:

```typescript
import { pageMetadata, generateMetaTags } from '@/lib/metadata';

// In Next.js layout/page
export const metadata: Metadata = {
  title: pageMetadata.home.title,
  description: pageMetadata.home.description,
  openGraph: pageMetadata.home.openGraph,
  twitter: pageMetadata.home.twitter,
};

// With Zod validation
import { SeoMetadataSchema } from '@/lib/schemas';

const validated = SeoMetadataSchema.parse(pageMetadata.home);
```

### 4. `formDefinitions.ts` — Form Configuration

**Purpose**: Centralized form field definitions with validation rules

**Key Exports**:

```typescript
discoveryFormDefinition    // Discovery session form
newsletterFormDefinition   // Newsletter signup
contactFormDefinition      // Contact form
inquiryFormDefinition      // Quick inquiry

// Utilities
getFormDefinition(type)    // Get form by type
getFormField(type, name)   // Get specific field
validateFormField()        // Validate single field
```

**Field Structure**:

```typescript
{
  name: "fullName",
  label: "Your name",
  placeholder: "John Smith",
  type: "text",
  required: true,
  validation: {
    minLength: 2,
    maxLength: 100
  },
  accessibility: {
    ariaLabel: "Full name",
    ariaDescription: "Enter your full name",
    ariaRequired: true
  },
  helperText: "Optional guidance"
}
```

**Usage Example**:

```typescript
import { discoveryFormDefinition, validateFormField } from '@/lib/formDefinitions';

// Render form
function DiscoveryForm() {
  return (
    <form>
      {discoveryFormDefinition.fields.map(field => (
        <FormField key={field.name} {...field} />
      ))}
    </form>
  );
}

// Validate on change
const validateName = (value: string) => {
  const nameField = discoveryFormDefinition.fields.find(f => f.name === 'fullName');
  return validateFormField(nameField, value);
};
```

### 5. `constants.ts` — Reusable Labels & Messaging

**Purpose**: Single source of truth for CTAs, validation messages, and UI copy

**Key Exports**:

```typescript
// CTA buttons
CTA.PRIMARY              // "Book a Discovery Session"
CTA.SECONDARY            // "View Our Work"
CTA.DISCOVER            // "Book a Discovery Session"
// ... more CTAs

// Navigation
NAVIGATION.BRAND         // "Marcuz"
NAVIGATION.ITEMS         // Nav menu items
NAVIGATION.CTA_LABEL     // "Book Session"

// Form messages
FORM_MESSAGES.DISCOVERY_SUCCESS_HEADLINE
FORM_MESSAGES.DISCOVERY_SUCCESS_MESSAGE
FORM_MESSAGES.DISCOVERY_ERROR

// Validation messages
VALIDATION_MESSAGES.REQUIRED
VALIDATION_MESSAGES.INVALID_EMAIL
VALIDATION_MESSAGES.MIN_LENGTH(n)

// Contact
CONTACT.EMAIL            // "hello@marcuz.com"
CONTACT.PHONE            // "+66 (2) 123-4567"

// Other
SECTION_TITLES.HERO
SECTION_TITLES.METHODOLOGY
// ... more

// Utilities
getAllCTAs()
getNavigation()
isExternalLink()
```

**Usage Example**:

```typescript
import { CTA, VALIDATION_MESSAGES, CONTACT } from '@/lib/constants';

// In components
<button>{CTA.PRIMARY}</button>
<p>Email: {CONTACT.EMAIL}</p>

// Form validation
if (!email) {
  showError(VALIDATION_MESSAGES.REQUIRED);
}

// Navigation
const nav = getNavigation();
```

---

## Usage Examples

### Example 1: Rendering Hero Section

```typescript
import copyData from '@/content/copy.json';
import { CTA } from '@/lib/constants';

export function HeroSection() {
  const hero = copyData.hero;
  
  return (
    <section className="hero">
      <h1>{hero.headline}</h1>
      <p>{hero.subheading}</p>
      <p>{hero.body}</p>
      <button>{hero.cta.primary}</button>
      <button variant="secondary">{hero.cta.secondary}</button>
      <p className="social-proof">{hero.socialProof}</p>
    </section>
  );
}
```

### Example 2: Rendering Problems with Validation

```typescript
import copyData from '@/content/copy.json';
import { validateContent } from '@/lib/schemas';

export function BusinessRealitySection() {
  // Validate on load
  const validation = validateContent(copyData);
  if (!validation.valid) {
    console.error('Content errors:', validation.errors);
    return <div>Content configuration error</div>;
  }

  const { businessReality } = copyData;

  return (
    <section>
      <h2>{businessReality.headline}</h2>
      <p>{businessReality.intro}</p>
      <div className="problems-grid">
        {businessReality.problems.map((problem, i) => (
          <div key={i} className="problem-card">
            <h3>{problem.headline}</h3>
            <p>{problem.description}</p>
            <p className="impact">"{problem.impact}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Example 3: Discovery Form with Full Validation

```typescript
import { discoveryFormDefinition, validateFormField } from '@/lib/formDefinitions';
import { DiscoveryFormSchema } from '@/lib/schemas';
import { FORM_MESSAGES } from '@/lib/constants';

export function DiscoveryForm() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const field = discoveryFormDefinition.fields.find(f => f.name === name);
    
    // Validate field
    const validation = validateFormField(field, value);
    
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({
      ...prev,
      [name]: validation.valid ? null : validation.error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate entire form
      const validated = DiscoveryFormSchema.parse(formData);
      
      // Submit to API
      const response = await fetch('/api/discovery', {
        method: 'POST',
        body: JSON.stringify(validated)
      });

      if (response.ok) {
        // Show success message
        alert(FORM_MESSAGES.DISCOVERY_SUCCESS_HEADLINE);
      }
    } catch (error) {
      // Show validation errors
      console.error(FORM_MESSAGES.DISCOVERY_ERROR);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {discoveryFormDefinition.fields.map(field => (
        <div key={field.name}>
          <label htmlFor={field.name} className="aria-label">
            {field.label}
            {field.required && <span aria-label={ACCESSIBILITY.REQUIRED_FIELD_INDICATOR}>*</span>}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            onChange={handleChange}
            aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
            aria-invalid={!!errors[field.name]}
            {...field.accessibility}
          />
          {errors[field.name] && (
            <p id={`${field.name}-error`} className="error">
              {errors[field.name]}
            </p>
          )}
          {field.helperText && <p className="helper-text">{field.helperText}</p>}
        </div>
      ))}
      <button type="submit">{discoveryFormDefinition.submitButtonText}</button>
    </form>
  );
}
```

### Example 4: Using SEO Metadata

```typescript
import { pageMetadata, articleSchema } from '@/lib/metadata';
import type { Metadata } from 'next';

// Static metadata
export const metadata: Metadata = {
  title: pageMetadata.caseStudies.title,
  description: pageMetadata.caseStudies.description,
  keywords: pageMetadata.caseStudies.keywords,
  openGraph: pageMetadata.caseStudies.openGraph,
  twitter: pageMetadata.caseStudies.twitter,
};

// Dynamic metadata for articles
export function generateArticleSchema(article) {
  return articleSchema({
    headline: article.title,
    description: article.summary,
    image: article.image,
    datePublished: article.publishedAt,
    author: article.author
  });
}
```

---

## Validation & Quality

### Pre-Deployment Validation Checklist

```bash
# Validate JSON syntax
node -e "require('./src/content/copy.json')"

# Validate against schema
import { validateContent } from '@/lib/schemas';
import copyData from '@/content/copy.json';
const result = validateContent(copyData);
```

### Content Quality Gates

✓ All copy captured from source documents  
✓ No typos or grammatical errors  
✓ All required fields present  
✓ JSON syntax valid  
✓ TypeScript types compile  
✓ All CTAs consistent  
✓ Character limits respected (titles < 60, descriptions < 160)  
✓ Phone numbers formatted correctly  

---

## Maintenance

### Updating Content

1. **Update the copy in `copy.json`**
   - Maintain hierarchy structure
   - Keep field names consistent
   - Run validation

2. **Update constants if needed**
   - Add new CTAs to `CTA` object
   - Update messages in `FORM_MESSAGES`
   - Add new sections if needed

3. **Validate changes**
   ```bash
   npm run validate:content
   ```

4. **Update email templates**
   - Keep variable names consistent
   - Use `{variableName}` format
   - Test rendering in Litmus or similar

### Version Control

Content changes should be tracked in git:

```bash
git add src/content/copy.json
git add src/lib/constants.ts
git commit -m "content: Update hero headline and outcomes"
```

### Testing

```typescript
// Create test file: __tests__/content.test.ts
import { validateContent } from '@/lib/schemas';
import copyData from '@/content/copy.json';

describe('Content Validation', () => {
  it('should validate entire content structure', () => {
    const result = validateContent(copyData);
    expect(result.valid).toBe(true);
  });

  it('should catch missing required fields', () => {
    const invalid = { ...copyData, hero: {} };
    const result = validateContent(invalid);
    expect(result.valid).toBe(false);
  });
});
```

---

## Internationalization (i18n) - Future Setup

The system is designed for future i18n support:

```typescript
// src/lib/i18n.ts (structure for future use)
export const translations = {
  common: {
    navHome: 'Home',
    navWork: 'Work',
    ctaPrimary: 'Book a Discovery Session',
  },
  sections: {
    hero: { ... },
    methodology: { ... },
  },
  forms: {
    discovery: { ... },
    newsletter: { ... },
  },
};

// To add Thai support later:
// 1. Create translations/th.json with same structure
// 2. Add language selector to form definitions
// 3. Update metadata generation for lang attribute
```

---

## Quick Reference

### Copy.json Keys (10 Sections)
1. `hero` — Hero headline, subheading, CTAs
2. `trustedRelationships` — Clients and partners
3. `businessReality` — Problems/challenges
4. `beliefs` — Philosophy/values
5. `transformation` — Before/after journey
6. `outcomes` — Business value categories
7. `caseStudies` — Client success stories
8. `methodology` — 5-stage process
9. `insights` — Knowledge hub categories
10. `discovery` — Discovery session form

### Common File Imports

```typescript
// Content
import copyData from '@/content/copy.json';

// Schemas
import { DiscoveryFormSchema, validateContent } from '@/lib/schemas';
import type { DiscoveryFormData, ContentData } from '@/lib/schemas';

// Metadata
import { pageMetadata, generateMetaTags } from '@/lib/metadata';

// Forms
import { discoveryFormDefinition, validateFormField } from '@/lib/formDefinitions';

// Constants
import { CTA, VALIDATION_MESSAGES, CONTACT } from '@/lib/constants';
```

---

**Last Updated**: 2026-07-04  
**Maintained By**: Content & Copy Agent  
**Status**: Production Ready
