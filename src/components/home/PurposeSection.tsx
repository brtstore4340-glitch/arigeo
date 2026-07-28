"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./purpose-section.module.css";

/**
 * PurposeSection (REDESIGN 2026-07-28)
 * Kao-style asymmetric "Purpose" grid
 *
 * Design System Spec:
 * - 4 half-width cards in 2×2 bordered grid (no gap, no radius)
 * - Rotating soft tints: green/blue/gray/white with photos + copy + circular arrow
 * - 1 full-width dark image card (Sustainability) with overlay copy
 * - Card tints: green (#eef6f1), blue (#eef3f8), gray (#f4f4f5)
 * - Flat borders, zero radius (Kao-style)
 */

type PurposeCard = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  link: string;
  linkText: string;
};

const purposeCards: PurposeCard[] = [
  {
    id: "about",
    title: "About ARIGEO",
    description:
      "CONTENT REQUIRED — About copy pending corporate approval",
    imageUrl: "/images/home/purpose-about.png",
    imageAlt: "About ARIGEO",
    link: "/about",
    linkText: "Learn more",
  },
  {
    id: "sustainability",
    title: "Sustainability",
    description:
      "CONTENT REQUIRED — Sustainability copy pending corporate approval",
    imageUrl: "/images/home/purpose-sustainability-alt.jpg",
    imageAlt: "Sustainability",
    link: "/sustainability",
    linkText: "Learn more",
  },
  {
    id: "innovation",
    title: "Innovation",
    description:
      "CONTENT REQUIRED — Innovation copy pending corporate approval",
    imageUrl: "/images/home/purpose-innovation.png",
    imageAlt: "Innovation",
    link: "/innovation",
    linkText: "Learn more",
  },
  {
    id: "brands",
    title: "Our Brands",
    description:
      "CONTENT REQUIRED — Brands copy pending corporate approval",
    imageUrl: "/images/home/purpose-brands.png",
    imageAlt: "Our Brands",
    link: "/brands",
    linkText: "Learn more",
  },
];

export default function PurposeSection() {
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.getAttribute("data-card-id");
            if (cardId) {
              setVisibleCards((prev) => new Set(prev).add(cardId));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(cardRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>สำเร็จการศึกษาและการพัฒนา</h2>

        <div className={styles.gridContainer}>
          {purposeCards.map((card, idx) => (
            <div
              key={card.id}
              ref={(el) => {
                if (el) cardRefs.current[card.id] = el;
              }}
              data-card-id={card.id}
              className={`${styles.card} ${
                visibleCards.has(card.id) ? styles.visible : ""
              }`}
            >
              <div className={styles.imageWrapper}>
                <div className={styles.imagePlaceholder}>
                  <img
                    src={card.imageUrl}
                    alt={card.imageAlt}
                    className={styles.image}
                    loading="lazy"
                  />
                </div>
              </div>

              <div className={styles.content}>
                <div className={styles.textBlock}>
                  <h3 className={styles.title}>{card.title}</h3>
                  <p className={styles.description}>{card.description}</p>
                </div>

                <div className={styles.linkBlock}>
                  <a href={card.link} className={styles.link}>
                    <span className={styles.linkIcon}>→</span>
                    <span className={styles.linkText}>{card.linkText}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
