"use client";

/**
 * BrandCarouselSection
 * Showcase ARIGEO sub-brands
 *
 * Design System Spec:
 * - 3-column grid on desktop
 * - Brand logo, name, category
 * - Kao-style flat borders, zero radius
 */

interface Brand {
  id: string;
  name: string;
  icon: string;
  category: string;
  href: string;
  pending?: boolean;
}

const brands: Brand[] = [
  {
    id: "captain-maid",
    name: "Captain-Maid",
    icon: "🧹",
    category: "Hygiene Living Care",
    href: "https://captain-maid.com",
  },
  {
    id: "genuleaf",
    name: "GenuLeaf",
    icon: "🌿",
    category: "Health Beauty Care",
    pending: true,
  },
  {
    id: "ceratory",
    name: "CeraTory",
    icon: "💙",
    category: "Health Beauty Care",
    pending: true,
  },
];

export default function BrandCarouselSection() {
  return (
    <section className="brand-carousel-section">
      <div className="brand-carousel-container">
        {/* Section Title */}
        <div className="brand-carousel-header">
          <h2 className="brand-carousel-title">Our Brands</h2>
          <p className="brand-carousel-subtitle">
            Trusted brands that deliver quality and innovation
          </p>
        </div>

        {/* Brand Grid */}
        <div className="brand-carousel-grid">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="brand-tile"
              data-brand-id={brand.id}
            >
              <div className="brand-icon">{brand.icon}</div>
              <h3 className="brand-name">{brand.name}</h3>
              <p className="brand-category">{brand.category}</p>

              {brand.pending ? (
                <p className="brand-pending">
                  Coming soon
                </p>
              ) : (
                <a
                  href={brand.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brand-link"
                >
                  Visit Brand →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
