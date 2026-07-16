# ARIGEO Product Contract Guide

## Overview

`src/data/products.ts` defines the canonical product structure for Phase 5 (Product Discovery & Detail pages). This guide explains:
1. What each field means
2. What data is real vs. placeholder
3. How to fill in missing data
4. Content gating rules
5. Related product selection rules

---

## Product Type Structure

```typescript
export type Product = {
  // Canonical identifier
  slug: string;                // unique kebab-case key
  messagesKey: string;         // path to copy in messages JSON

  // Brand & categorization
  brand: ProductBrand;         // "captain-maid" | "genuleaf" | "ceratory"
  category: ProductCategory;   // household-cleaning, skincare-*, etc.

  // Visible metadata
  name?: string;               // fallback (prefer messages)
  shortBenefit?: string;       // one-liner (prefer messages)

  // Imagery
  image: string | null;        // /public path or null if pending
  imageAlt?: string;           // accessibility text

  // Product variants / sizing
  sizes: ProductSize[];        // array of size options
  defaultSizeIndex?: number;   // which size shows by default

  // Pricing (APPROVED VALUES ONLY)
  price: number | null;        // null = TBD, 0 = price pending, >0 = approved
  currency?: string;           // USD, THB, SGD, etc.

  // Availability (APPROVED VALUES ONLY)
  inStock: boolean | null;     // null = unknown, true = available, false = out
  availableRegions?: string[]; // which markets

  // Performance metrics (APPROVED VALUES ONLY — NEVER FABRICATE)
  rating: number | null;       // null = no rating, 0-5 scale if verified
  reviewCount: number | null;  // null = no reviews (never fabricate)

  // Content flags
  placeholderData: boolean;    // true = CONTENT REQUIRED gate shown
  factualGates?: {             // granular content gating
    ingredients?: boolean;     // true = behind content gate
    safetyInfo?: boolean;
    qualityProofs?: boolean;
  };

  // Related products
  relatedProductSlugs?: string[];  // max 3-4, curated per rule
  relatedRule?: string;            // documented selection rule
};
```

---

## Field-by-Field Guide

### `slug` (Required, Immutable)
**Format**: kebab-case, globally unique  
**Examples**:
- `captain-maid-floor-cleaner-floral-passionate`
- `genuleaf-cleanser-daily`
- `ceratory-barrier-cream-intensive`

**Rules**:
- Must be unique across all products
- Cannot change after launch (used in URLs)
- Include scent/variant in slug if product has variants

### `messagesKey` (Required)
**Format**: dot-notation path to copy in `src/messages/{en,th}.json`  
**Examples**:
- `captainMaid.floorCleanerFloral`
- `genuLeaf.cleansing.daily`
- `ceraTory.barrierCare.intensive`

**In messages JSON**:
```json
{
  "Products": {
    "captainMaid": {
      "floorCleanerFloral": {
        "name": "Floor Cleaner — Floral Passionate",
        "shortBenefit": "All floors, naturally fresh",
        "overview": "Gently cleans all floor types...",
        "usage": "Dilute 1 part...",
        "keyIngredients": "Nature-derived surfactants...",
        "safetyInfo": "Safe for homes with children...",
        "qualityProofs": "Tested against common stains..."
      }
    }
  }
}
```

### `brand` (Required)
**Type**: `"captain-maid" | "genuleaf" | "ceratory"`

### `category` (Required)
**Type**: 
- `"household-cleaning"` — Captain Maid products
- `"skincare-cleansing"` — Face wash, cleansers
- `"skincare-treatment"` — Serums, essences, toners
- `"skincare-targeted"` — Spot treatments, barrier creams

### `image` (Recommended)
**Value**: Absolute path under `/public` or `null`  
**Examples**:
- `/images/products/captain-maid-floor-cleaner-floral.png`
- `/images/products/genuleaf-cleanser-daily.png`
- `null` (if image not approved yet)

**Process**:
1. Brand provides approved product photo
2. Designer crops/sizes to 1:1 or 16:9 (specify which)
3. File uploaded to `/public/images/products/`
4. Path added to `image` field
5. `imageAlt` populated with descriptive text

### `sizes` (Required)
**Type**: Array of `{ value: number, unit: string, label: string }`

**Examples**:
```typescript
// Single size
sizes: [{ value: 900, unit: "ml", label: "900ml" }]

// Multiple options
sizes: [
  { value: 100, unit: "ml", label: "100ml (travel)" },
  { value: 500, unit: "ml", label: "500ml (refill)" },
  { value: 1000, unit: "ml", label: "1L (value)" }
]
```

**Units**: `"ml"` | `"g"` | `"oz"` | `"count"` (sheets, pads, etc.)

### `price` (Pricing Approval Required)
**Values**:
- `null` — Price TBD, awaiting approval (shows "Price upon request")
- `0` — Price pending (shows "Price coming soon")
- `> 0` — Approved price (shows "$99.99" or "฿3,490")

**Rules**:
- ❌ NEVER fabricate or estimate
- ❌ NEVER use aspirational pricing
- ✅ Only use approved pricing from finance/product team
- ✅ Include currency (default: based on locale)

**Approval Process**:
1. Product manager provides approved price
2. Finance validates pricing
3. Price entered into products.ts
4. `placeholderData: false` only when ALL fields approved

### `inStock` & `availableRegions` (Availability Approval Required)
**Values**:
- `inStock: null` — Availability unknown (shows "Check availability")
- `inStock: true` — In stock (shows "In stock")
- `inStock: false` — Out of stock (shows "Currently unavailable")

**Example**:
```typescript
inStock: true,
availableRegions: ["captain-maid", "genuleaf", "ceratory"] // brands/markets that carry it
```

**Rules**:
- ❌ NEVER guess or assume availability
- ✅ Only use approved stock status
- ✅ Update when inventory changes

### `rating` & `reviewCount` (Ratings Approval Required)
**Rules** (CRITICAL):
- ❌ NEVER fabricate ratings
- ❌ NEVER make up review counts
- ✅ Only use verified aggregated ratings
- ✅ Only populate if rating aggregated from official sources (e.g., Trustpilot, Google, official website)

**Values**:
- `rating: null, reviewCount: null` — No public rating yet (don't show rating section)
- `rating: 4.5, reviewCount: 127` — Verified rating with count

**Never populate until**: Official sources confirm real ratings exist.

### `placeholderData` (Content Gate Flag)
**Type**: `boolean`

**When `true`**:
- CONTENT REQUIRED warning shown on product pages
- Product can render but with prominent "pending approval" gate
- Prevents accidental publication of incomplete data

**When `false`**:
- All fields (name, copy, price, images, ratings) are approved
- Product renders normally, no warnings
- Safe to publish

**Transition**:
```typescript
// BEFORE approval
{
  slug: "...",
  placeholderData: true,
  price: null,
  image: null,
  rating: null,
  factualGates: { ingredients: true, safetyInfo: true, qualityProofs: true }
}

// AFTER all fields approved
{
  slug: "...",
  placeholderData: false,
  price: 29.99,
  image: "/images/products/...",
  rating: 4.5,
  reviewCount: 84,
  factualGates: {} // all gates removed
}
```

### `factualGates` (Granular Content Gating)
**Use when**: One section needs approval while others don't.

**Example scenario**:
- Product name, imagery, pricing: ✅ approved
- Ingredients list: ⏳ pending from R&D
- Safety claims: ⏳ pending from compliance

```typescript
{
  slug: "...",
  placeholderData: false, // product itself is approved
  factualGates: {
    ingredients: true,     // behind gate
    safetyInfo: true,      // behind gate
    qualityProofs: false   // not gated, approved
  }
}
```

**Render logic**:
```jsx
{/* In product detail page */}
{product.factualGates?.ingredients && (
  <GatedSection title="Key Ingredients">
    <ContentRequiredWarning>
      Detailed ingredient list awaiting brand approval
    </ContentRequiredWarning>
  </GatedSection>
)}

{!product.factualGates?.qualityProofs && (
  <Section title="Quality Proofs">
    {/* Render approved content from messages */}
  </Section>
)}
```

### `relatedProductSlugs` & `relatedRule` (Curation)
**Purpose**: Suggest related products (max 3-4) with documented selection rule.

**Rules** (not arbitrary AI selection):
- `same-product-different-scent` — Other scents of same formula
- `same-brand-complementary-category` — Different Captain Maid cleaners
- `same-brand-same-concern` — GenuLeaf brightening products
- `often-bought-together` — Products commonly purchased as set

**Example**:
```typescript
{
  slug: "captain-maid-floor-cleaner-floral-passionate",
  relatedProductSlugs: [
    "captain-maid-floor-cleaner-lavender-kerry",
    "captain-maid-floor-cleaner-tea-tree-flash"
  ],
  relatedRule: "same-product-different-scent"
}
```

**Rules must be documented** so:
1. Content team understands why products are related
2. Future updates maintain consistency
3. Curation isn't arbitrary

---

## Content Gating on Product Pages

### Full Page Gate
**When**: `placeholderData: true`

```jsx
{product.placeholderData && (
  <WarningBox tone="warning">
    <Icon name="alert" />
    <p>
      This product data is pending final approval.
      <Link href="/contact">Contact us</Link> for availability.
    </p>
  </WarningBox>
)}
```

### Section-Level Gate
**When**: `factualGates.ingredients: true`

```jsx
{product.factualGates?.ingredients ? (
  <GatedSection>
    <WarningBox tone="info">
      <p>Detailed ingredient information coming soon</p>
    </WarningBox>
  </GatedSection>
) : (
  <Section title="Key Ingredients">
    <RichText content={t(`${product.messagesKey}.keyIngredients`)} />
  </Section>
)}
```

---

## Approval Workflow

### Stage 1: Product Definition (NOW)
✅ **Done**: `products.ts` template created with all Captain Maid products + GenuLeaf/CeraTory placeholders

**Input needed**:
- [ ] Brand specifies product line scope (how many products per brand?)
- [ ] Product manager provides canonical product list
- [ ] Designer identifies which product images are approved

### Stage 2: Content & Copy (PENDING)
**Input needed**:
- [ ] Product names, descriptions, benefits (TH/EN)
- [ ] Usage instructions
- [ ] Key ingredients or technology
- [ ] Safety information
- [ ] Quality claims / proof points
- [ ] All copy in `src/messages/{en,th}.json` under Products namespace

### Stage 3: Pricing & Availability (PENDING)
**Input needed**:
- [ ] Finance approves prices for each product
- [ ] Marketing confirms which regions each product is sold
- [ ] Inventory confirms in-stock status

### Stage 4: Imagery (PENDING)
**Input needed**:
- [ ] Approved product photos for each SKU
- [ ] Alt text for accessibility
- [ ] Uploaded to `/public/images/products/`

### Stage 5: Ratings (OPTIONAL)
**Input needed** (if available):
- [ ] Aggregated product ratings from official sources
- [ ] Verified review counts
- [ ] Only populate if ratings genuinely exist

### Stage 6: Validation & Gate Removal
**Steps**:
1. All fields filled in products.ts
2. All copy in messages JSON verified
3. Product manager reviews for accuracy
4. Set `placeholderData: false` on approved products
5. Remove `factualGates` entries
6. Ready for Phase 5 development

---

## Example: Transitioning a Product from Placeholder to Approved

### Before (Awaiting Data)
```typescript
export const genuLeafCleansingProduct: Product = {
  slug: "genuleaf-cleanser-placeholder",
  messagesKey: "genuLeaf.cleansing.placeholder",
  brand: "genuleaf",
  category: "skincare-cleansing",
  image: null,
  sizes: [{ value: 0, unit: "ml", label: "TBD" }],
  price: null,
  inStock: null,
  rating: null,
  reviewCount: null,
  placeholderData: true,
  factualGates: {
    ingredients: true,
    safetyInfo: true,
    qualityProofs: true,
  },
};
```

### After (All Approved)
```typescript
export const genuLeafCleanserDaily: Product = {
  slug: "genuleaf-cleanser-daily",
  messagesKey: "genuLeaf.cleanser.daily",
  brand: "genuleaf",
  category: "skincare-cleansing",
  image: "/images/products/genuleaf-cleanser-daily.png",
  imageAlt: "GenuLeaf Daily Cleanser 150ml bottle",
  sizes: [
    { value: 150, unit: "ml", label: "150ml" },
    { value: 500, unit: "ml", label: "500ml (refill)" }
  ],
  defaultSizeIndex: 0,
  price: 34.99,
  currency: "USD",
  inStock: true,
  availableRegions: ["genuleaf", "captain-maid"],
  rating: 4.6,
  reviewCount: 287,
  placeholderData: false,
  // factualGates removed — all content approved
  relatedProductSlugs: [
    "genuleaf-toner-brightening",
    "genuleaf-essence-soothing"
  ],
  relatedRule: "same-brand-complementary-category",
};
```

---

## Checklist for Unblocking Phase 5

- [ ] Captain Maid product data provided (6 products)
  - [ ] Names, descriptions, benefits (TH/EN)
  - [ ] Approved pricing
  - [ ] Stock status
  - [ ] Product images uploaded and paths updated
  - [ ] Key ingredients, safety info, quality claims

- [ ] GenuLeaf product data provided (4 products)
  - [ ] Names, descriptions, benefits (TH/EN)
  - [ ] Approved pricing
  - [ ] Stock status
  - [ ] Product images
  - [ ] Technical information, safety info, efficacy claims

- [ ] CeraTory product data provided (2-3 products)
  - [ ] Names, descriptions, benefits (TH/EN)
  - [ ] Approved pricing
  - [ ] Stock status
  - [ ] Product images
  - [ ] Dermatological information, safety info, clinical data

- [ ] All copy added to `src/messages/{en,th}.json`

- [ ] All data validated by product managers

- [ ] `placeholderData` flags updated to `false` when sections are approved

- [ ] Phase 5 product pages ready to build

---

## Questions?

Contact product/marketing teams for:
- Missing product data
- Pricing approvals
- Copy revisions
- Image assets

Contact engineering for:
- Technical implementation questions
- Message key structure
- Schema clarifications

---

**Template created**: 2026-07-16  
**Status**: Ready for product data input  
**Next step**: Brands provide product specifications
