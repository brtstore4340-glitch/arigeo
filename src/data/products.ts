// Typed local content adapter for product pages (Payload-CMS-ready contract).
//
// This file defines the canonical product structure. All copy lives in
// src/messages/{en,th}.json under "Products" namespace — this file only
// maps product slugs to message keys, canonical metadata, and approved imagery.
//
// RULES:
// - No fabricated prices, availability, ratings, or reviews
// - All factual claims (ingredients, safety, quality) must be approved before use
// - Missing data marked with placeholderData: true and rendered as CONTENT REQUIRED gate
// - Related products use documented rules, not arbitrary AI selection

export type ProductBrand = "captain-maid" | "genuleaf" | "ceratory";
export type ProductCategory =
  | "household-cleaning"
  | "skincare-cleansing"
  | "skincare-treatment"
  | "skincare-targeted";

export type ProductSize = {
  value: number;
  unit: "ml" | "g" | "oz" | "count";
  label: string; // e.g., "100ml", "50g", "1.7oz"
};

export type Product = {
  // Canonical identifier
  slug: string; // kebab-case, unique: "captain-maid-floor-cleaner-floral"

  // Message key mapping (copy lives in messages, not here)
  messagesKey: string; // nested key path: "captainMaid.floorCleaner.floral"

  // Brand & categorization
  brand: ProductBrand;
  category: ProductCategory;

  // Visible metadata
  name?: string; // fallback name (prefer copy from messages)
  shortBenefit?: string; // one-liner: "All floors, safely cleaned" (prefer from messages)

  // Imagery
  image: string | null; // approved image path under /public, or null if not approved yet
  imageAlt?: string; // alt text for accessibility

  // Product variants / sizing
  sizes: ProductSize[];
  defaultSizeIndex?: number; // which size to show by default

  // Pricing (APPROVED VALUES ONLY)
  price: number | null; // null = awaiting approval, 0 = price TBD, >0 = approved price
  currency?: "USD" | "THB" | "SGD"; // default: based on locale

  // Availability (APPROVED VALUES ONLY)
  inStock: boolean | null; // null = unknown/pending, true = available, false = out of stock
  availableRegions?: ProductBrand[]; // which markets carry this product

  // Performance metrics (APPROVED VALUES ONLY)
  rating: number | null; // null = no rating yet, 0-5 scale, only if verified
  reviewCount: number | null; // null = no reviews yet
  // NOTE: Never fabricate ratings or review counts

  // Content flags
  placeholderData: boolean; // true = CONTENT REQUIRED gate shown on pages
  factualGates?: {
    ingredients?: boolean; // true = ingredients list behind content gate
    safetyInfo?: boolean; // true = safety claims behind content gate
    qualityProofs?: boolean; // true = quality claims behind content gate
  };

  // Related products (documented selection rule, not arbitrary)
  relatedProductSlugs?: string[]; // max 3-4, curated per defined rules
  relatedRule?: string; // e.g., "same-brand-same-concern", "same-category", "often-bought-together"
};

/**
 * CAPTAIN MAID — Household cleaning
 * 6 core products across 3 scents (Floor Cleaner only) + Kitchen/Bathroom/Glass
 */

export const captainMaidFloorCleanerFloral: Product = {
  slug: "captain-maid-floor-cleaner-floral-passionate",
  messagesKey: "captainMaid.floorCleanerFloral",
  brand: "captain-maid",
  category: "household-cleaning",
  image: "/images/products/captain-maid-floor-cleaner-floral.png",
  imageAlt: "Captain Maid Floor Cleaner Floral Passionate 900ml",
  sizes: [{ value: 900, unit: "ml", label: "900ml" }],
  defaultSizeIndex: 0,
  price: null, // TODO: pending approval
  inStock: null, // TODO: pending approval
  rating: null, // no fabricated ratings
  reviewCount: null,
  placeholderData: true,
  factualGates: {
    ingredients: true,
    safetyInfo: true,
    qualityProofs: true,
  },
  relatedProductSlugs: [
    "captain-maid-floor-cleaner-lavender",
    "captain-maid-floor-cleaner-tea-tree",
  ],
  relatedRule: "same-product-different-scent",
};

export const captainMaidFloorCleanerLavender: Product = {
  slug: "captain-maid-floor-cleaner-lavender-kerry",
  messagesKey: "captainMaid.floorCleanerLavender",
  brand: "captain-maid",
  category: "household-cleaning",
  image: "/images/products/captain-maid-floor-cleaner-lavender.png",
  imageAlt: "Captain Maid Floor Cleaner Lavender Kerry 900ml",
  sizes: [{ value: 900, unit: "ml", label: "900ml" }],
  defaultSizeIndex: 0,
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
  relatedProductSlugs: [
    "captain-maid-floor-cleaner-floral-passionate",
    "captain-maid-floor-cleaner-tea-tree",
  ],
  relatedRule: "same-product-different-scent",
};

export const captainMaidFloorCleanerTeaTree: Product = {
  slug: "captain-maid-floor-cleaner-tea-tree-flash",
  messagesKey: "captainMaid.floorCleanerTeaTree",
  brand: "captain-maid",
  category: "household-cleaning",
  image: "/images/products/captain-maid-floor-cleaner-tea-tree.png",
  imageAlt: "Captain Maid Floor Cleaner Tea Tree Flash 900ml",
  sizes: [{ value: 900, unit: "ml", label: "900ml" }],
  defaultSizeIndex: 0,
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
  relatedProductSlugs: [
    "captain-maid-floor-cleaner-floral-passionate",
    "captain-maid-floor-cleaner-lavender",
  ],
  relatedRule: "same-product-different-scent",
};

export const captainMaidBathroomCleaner: Product = {
  slug: "captain-maid-bathroom-cleaner-fresh-air",
  messagesKey: "captainMaid.bathroomCleaner",
  brand: "captain-maid",
  category: "household-cleaning",
  image: "/images/products/captain-maid-bathroom-cleaner.png",
  imageAlt: "Captain Maid Bathroom Cleaner Fresh Air",
  sizes: [{ value: 900, unit: "ml", label: "900ml" }],
  defaultSizeIndex: 0,
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
  relatedProductSlugs: [
    "captain-maid-kitchen-cleaner",
    "captain-maid-glass-cleaner",
  ],
  relatedRule: "same-brand-complementary-category",
};

export const captainMaidKitchenCleaner: Product = {
  slug: "captain-maid-kitchen-cleaner-citrus-express",
  messagesKey: "captainMaid.kitchenCleaner",
  brand: "captain-maid",
  category: "household-cleaning",
  image: "/images/products/captain-maid-kitchen-cleaner.png",
  imageAlt: "Captain Maid Kitchen Cleaner Citrus Express",
  sizes: [{ value: 900, unit: "ml", label: "900ml" }],
  defaultSizeIndex: 0,
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
  relatedProductSlugs: [
    "captain-maid-bathroom-cleaner-fresh-air",
    "captain-maid-glass-cleaner",
  ],
  relatedRule: "same-brand-complementary-category",
};

export const captainMaidGlassCleaner: Product = {
  slug: "captain-maid-glass-cleaner-fruity-fresh",
  messagesKey: "captainMaid.glassCleaner",
  brand: "captain-maid",
  category: "household-cleaning",
  image: "/images/products/captain-maid-glass-cleaner.png",
  imageAlt: "Captain Maid Glass Cleaner Fruity Fresh",
  sizes: [{ value: 750, unit: "ml", label: "750ml" }],
  defaultSizeIndex: 0,
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
  relatedProductSlugs: [
    "captain-maid-bathroom-cleaner-fresh-air",
    "captain-maid-kitchen-cleaner",
  ],
  relatedRule: "same-brand-complementary-category",
};

/**
 * GENULEAF — Skincare (4 categories: Cleansing, Brightening, Soothing, Barrier Repair)
 * PLACEHOLDER: Awaiting product specifications from brand
 */

export const genuLeafCleansingProduct: Product = {
  slug: "genuleaf-cleanser-placeholder",
  messagesKey: "genuLeaf.cleansing.placeholder",
  brand: "genuleaf",
  category: "skincare-cleansing",
  image: null, // awaiting approved image
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

export const genuLeafBrighteningProduct: Product = {
  slug: "genuleaf-brightening-placeholder",
  messagesKey: "genuLeaf.brightening.placeholder",
  brand: "genuleaf",
  category: "skincare-treatment",
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

export const genuLeafSoothingProduct: Product = {
  slug: "genuleaf-soothing-placeholder",
  messagesKey: "genuLeaf.soothing.placeholder",
  brand: "genuleaf",
  category: "skincare-targeted",
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

export const genuLeafBarrierRepairProduct: Product = {
  slug: "genuleaf-barrier-repair-placeholder",
  messagesKey: "genuLeaf.barrierRepair.placeholder",
  brand: "genuleaf",
  category: "skincare-treatment",
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

/**
 * CERATORY — Derma-skincare (3 categories: Barrier Care, Acne Care)
 * PLACEHOLDER: Awaiting product specifications from brand
 */

export const ceraToryBarrierCareProduct: Product = {
  slug: "ceratory-barrier-care-placeholder",
  messagesKey: "ceraTory.barrierCare.placeholder",
  brand: "ceratory",
  category: "skincare-targeted",
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

export const ceraToryAcneCareProduct: Product = {
  slug: "ceratory-acne-care-placeholder",
  messagesKey: "ceraTory.acneCare.placeholder",
  brand: "ceratory",
  category: "skincare-targeted",
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

/**
 * Master product registry
 */

export const products: Product[] = [
  // Captain Maid (6 products)
  captainMaidFloorCleanerFloral,
  captainMaidFloorCleanerLavender,
  captainMaidFloorCleanerTeaTree,
  captainMaidBathroomCleaner,
  captainMaidKitchenCleaner,
  captainMaidGlassCleaner,

  // GenuLeaf (4 products)
  genuLeafCleansingProduct,
  genuLeafBrighteningProduct,
  genuLeafSoothingProduct,
  genuLeafBarrierRepairProduct,

  // CeraTory (2 products)
  ceraToryBarrierCareProduct,
  ceraToryAcneCareProduct,
];

export const productSlugs = products.map((p) => p.slug);

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByBrand(brand: ProductBrand): Product[] {
  return products.filter((p) => p.brand === brand);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

/**
 * CONTENT GATING
 *
 * Use placeholderData and factualGates to render CONTENT REQUIRED warnings
 * on product pages when real data is not yet approved.
 *
 * Example:
 *   {product.placeholderData && (
 *     <ContentRequiredWarning>
 *       Real product data pending approval
 *     </ContentRequiredWarning>
 *   )}
 *
 *   {product.factualGates?.ingredients && (
 *     <GatedSection title="Ingredients">
 *       <ContentRequiredWarning>
 *         Full ingredient list awaiting approval
 *       </ContentRequiredWarning>
 *     </GatedSection>
 *   )}
 */
