"use client";

import { useTranslations } from "next-intl";

/**
 * BrandCarouselSection
 * Showcase ARIGEO sub-brands - logo only
 *
 * Design System Spec:
 * - 3-column row (one row, all 3 brands visible)
 * - Logo only, no text
 * - Flat borders, zero radius
 */

interface Brand {
  id: string;
  name: string;
  logo: string;
  href?: string;
  pending?: boolean;
}

const brands: Brand[] = [
  {
    id: "captain-maid",
    name: "Captain-Maid",
    logo: "/images/brands/captain-maid.png",
    href: "https://captain-maid.com",
  },
  {
    id: "genuleaf",
    name: "GenuLeaf",
    logo: "/images/brands/genuleaf.png",
    pending: true,
  },
  {
    id: "ceratory",
    name: "CeraTory",
    logo: "/images/brands/ceratory.png",
    pending: true,
  },
];

export default function BrandCarouselSection() {
  const t = useTranslations();

  return (
    <section className="brand-carousel-section">
      <div className="brand-carousel-container">
        {/* Section Title */}
        <div className="brand-carousel-header">
          <h2 className="brand-carousel-title">{t("brands.title")}</h2>
          <p className="brand-carousel-subtitle">
            Trusted brands that deliver quality and innovation
          </p>
        </div>

        {/* Brand Grid - 3 columns (one row) */}
        <div className="brand-carousel-grid">
          {brands.map((brand) =>
            brand.pending ? (
              <div
                key={brand.id}
                className="brand-tile"
                data-brand-id={brand.id}
              >
                <div className="brand-logo-wrapper">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="brand-logo"
                  />
                </div>
              </div>
            ) : (
              <a
                key={brand.id}
                href={brand.href}
                target="_blank"
                rel="noopener noreferrer"
                className="brand-tile brand-link"
                data-brand-id={brand.id}
                aria-label={brand.name}
              >
                <div className="brand-logo-wrapper">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="brand-logo"
                  />
                </div>
              </a>
            )
          )}
        </div>
      </div>
    </section>
  );
}
