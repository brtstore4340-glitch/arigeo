// Typed local content adapter for brand pages (Payload-CMS-ready contract).
// Copy lives in src/messages/{en,th}.json under "Brands" — this file only
// maps canonical slugs to message keys, foundations, and approved imagery.

export type BrandSlug = "captain-maid" | "genuleaf" | "ceratory";
export type Foundation = "household" | "skincare";

export type Brand = {
  slug: BrandSlug;
  /** Key inside the "Brands" messages namespace */
  messagesKey: "captainMaid" | "genuLeaf" | "ceraTory";
  foundation: Foundation;
  /** Approved image path under /public, or null when no approved asset exists yet */
  image: string | null;
  /** True while product/category data is placeholder pending approval */
  placeholderData: boolean;
  categoryCount: number;
};

export const brands: Brand[] = [
  {
    slug: "captain-maid",
    messagesKey: "captainMaid",
    foundation: "household",
    image: "/images/home/household-living-room.png",
    placeholderData: false,
    categoryCount: 6
  },
  {
    slug: "genuleaf",
    messagesKey: "genuLeaf",
    foundation: "skincare",
    image: "/images/home/skincare-marble.png",
    placeholderData: true,
    categoryCount: 4
  },
  {
    slug: "ceratory",
    messagesKey: "ceraTory",
    foundation: "skincare",
    image: null,
    placeholderData: true,
    categoryCount: 3
  }
];

export const brandSlugs = brands.map((b) => b.slug);

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}
