"use client";

/**
 * BrandsIndex
 * Full /brands page recreation
 *
 * Design System Spec:
 * - Full-bleed hero photo + blush-topped title panel
 * - "All / Hygiene Living Care / Health Beauty Care" radio filter
 * - Two bordered-heading brand-tile grids (no gap, no radius - Kao-style)
 * - Captain Maid links out (real logo)
 * - GenuLeaf/CeraTory show logos with "Product details under verification" pending state
 */

interface Brand {
  id: string;
  name: string;
  logo: string;
  category: string;
  href?: string;
  pending?: boolean;
}

const brands: Brand[] = [
  {
    id: "captain-maid",
    name: "Captain-Maid",
    logo: "🧹",
    category: "Hygiene Living Care",
    href: "https://captain-maid.com",
  },
  {
    id: "genuleaf",
    name: "GenuLeaf",
    logo: "🌿",
    category: "Health Beauty Care",
    pending: true,
  },
  {
    id: "ceratory",
    name: "CeraTory",
    logo: "💙",
    category: "Health Beauty Care",
    pending: true,
  },
];

export default function BrandsIndex() {
  return (
    <section className="brands-index">
      <div className="brands-hero">
        {/* TODO: Add hero image */}
        <div className="hero-content">
          <h1>Our Brands</h1>
          <p>CONTENT REQUIRED — Brand overview copy pending corporate approval</p>
        </div>
      </div>

      {/* Filter */}
      <div className="brands-filter">
        <label>
          <input type="radio" name="category" value="all" defaultChecked />
          All
        </label>
        <label>
          <input type="radio" name="category" value="household" />
          Hygiene Living Care
        </label>
        <label>
          <input type="radio" name="category" value="skincare" />
          Health Beauty Care
        </label>
      </div>

      {/* Brand Tiles */}
      <div className="brands-grid">
        {brands.map((brand) => (
          <article key={brand.id} className="brand-tile">
            <div className="brand-logo">{brand.logo}</div>
            <h3>{brand.name}</h3>
            <p className="brand-category">{brand.category}</p>
            {brand.pending ? (
              <p className="pending-state">Product details under verification</p>
            ) : (
              <a href={brand.href} target="_blank" rel="noopener noreferrer">
                Visit Brand →
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
