"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./brands-section.module.css";

type Brand = {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  description: string;
  categories: string[];
  href: string;
};

const brands: Brand[] = [
  {
    id: "captain-maid",
    name: "Captain-Maid",
    tagline: "Hygiene Living Care",
    logo: "🧹",
    description:
      "Smart, safe, and effective household care essentials that never compromise on household safety",
    categories: ["Fabric Care", "Surface Cleaning", "Laundry"],
    href: "#captain-maid",
  },
  {
    id: "genuleaf",
    name: "Genuleaf",
    tagline: "Natural Skincare",
    logo: "🌿",
    description: "Thoughtfully formulated skincare for healthy, beautiful skin every day",
    categories: ["Cleansers", "Treatments", "Moisturizers"],
    href: "#genuleaf",
  },
  {
    id: "ceratory",
    name: "Ceratory",
    tagline: "Ceramide Care",
    logo: "💙",
    description: "Barrier-care technology for a healthier complexion and skin resilience",
    categories: ["Barrier Care", "Serums", "Creams"],
    href: "#ceratory",
  },
];

export default function BrandsSection() {
  const [visibleBrands, setVisibleBrands] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);
  const brandRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const brandId = entry.target.getAttribute("data-brand-id");
            if (brandId) {
              setVisibleBrands((prev) => new Set([...prev, brandId]));
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe all brand cards
    brandRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="brands-heading"
    >
      <div className={styles.container}>
        {/* Header */}
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

        {/* Brands Grid */}
        <div className={styles.brandsGrid}>
          {brands.map((brand, idx) => {
            const isVisible = visibleBrands.has(brand.id);

            return (
              <article
                key={brand.id}
                ref={(el) => {
                  if (el) brandRefs.current.set(brand.id, el);
                }}
                data-brand-id={brand.id}
                className={`${styles.brandCard} ${isVisible ? styles.visible : ""}`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Brand Logo */}
                <div className={styles.logoWrapper}>
                  <span className={styles.logo}>{brand.logo}</span>
                </div>

                {/* Brand Info */}
                <div className={styles.brandInfo}>
                  <h3 className={styles.brandName}>{brand.name}</h3>
                  <p className={styles.brandTagline}>{brand.tagline}</p>
                  <p className={styles.brandDescription}>{brand.description}</p>

                  {/* Categories */}
                  <div className={styles.categories}>
                    {brand.categories.map((cat) => (
                      <span key={cat} className={styles.categoryTag}>
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link href={brand.href} className={styles.brandLink}>
                    Explore Brand
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className={styles.ctaSection}>
          <h3 className={styles.ctaTitle}>Start exploring our brands today</h3>
          <p className={styles.ctaDescription}>
            Find products tailored to your household and skincare needs
          </p>
          <Link href="/brands" className={styles.ctaButton}>
            View All Brands
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
