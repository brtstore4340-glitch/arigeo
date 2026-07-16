// Product data contract for ARIGEO discovery and detail pages
// Extends brand-specific product categories from Brands.*.categories in messages

export type ProductBrand = 'captain-maid' | 'genuleaf' | 'ceratory';
export type ProductCategory = string; // Brand-specific categories (e.g., "floor-cleaner", "skincare")
export type ProductConcern = 'cleaning' | 'skincare' | 'household';
export type ProductType = 'liquid' | 'cream' | 'gel' | 'powder' | 'spray' | 'solid';
export type CollectionTag = string; // e.g., "essentials", "premium", "new-launch"

export interface Product {
  id: string;
  slug: string; // URL-safe identifier

  // Core identity
  nameEn: string;
  nameTh: string;
  descriptionEn: string;
  descriptionTh: string;

  // Classification
  brand: ProductBrand;
  category: ProductCategory; // Must match Brands.*.categories entries
  concern: ProductConcern;
  type: ProductType;

  // Attributes
  size?: string; // e.g., "500ml", "50ml"
  benefit: string; // Key benefit or key ingredient

  // Media
  imageUrl?: string; // Primary product image
  galleryUrls?: string[]; // Additional product images

  // Content (CONTENT REQUIRED for production)
  usageInstructions?: string;
  ingredients?: string[];
  safetyInfo?: string;
  qualityClaims?: string[];

  // Metadata
  collections?: CollectionTag[];
  launchDate?: string; // ISO 8601 format
  isFeatured?: boolean;
}

export interface ProductFilter {
  brand?: ProductBrand;
  category?: ProductCategory;
  concern?: ProductConcern;
  type?: ProductType;
  collection?: CollectionTag;
}

export interface ProductCardProps {
  product: Product;
  locale: 'en' | 'th';
}

export interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
  locale: 'en' | 'th';
}
