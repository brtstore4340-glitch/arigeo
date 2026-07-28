"use client";

import Link from "next/link";
import styles from "./brands-section.module.css";

type Brand = {
  id: string;
  logo: string;
};

const brands: Brand[] = [
  { id: "captain-maid", logo: "🧹" },
  { id: "genuleaf", logo: "🌿" },
  { id: "ceratory", logo: "💙" },
];

export default function BrandsSection() {
  return (
    <section
      className={styles.section}
      aria-labelledby="brands-heading"
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Our Brands</span>
          <h2 id="brands-heading" className={styles.title}>
            Discover ARIGEO's
            <br />
            Premium Brands
          </h2>
          <p className={styles.subtitle}>
            Each brand is crafted with science and care for specific needs
          </p>
        </div>

        {/* Brands Grid - Logo Only */}
        <div className={styles.brandsGrid}>
          {brands.map((brand) => (
            <div key={brand.id} className={styles.brandCard}>
              <div className={styles.logoWrapper}>
                <span className={styles.logo}>{brand.logo}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Link to Captain-Maid */}
        <div className={styles.ctaSection}>
          <h3 className={styles.ctaTitle}>Explore Our Products</h3>
          <p className={styles.ctaDescription}>
            Visit Captain-Maid for our complete range of household care solutions
          </p>
          <a href="https://captain-maid.com" target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
            Go to Captain-Maid
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
