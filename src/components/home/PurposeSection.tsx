"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./purpose-section.module.css";

/**
 * PurposeSection (CORRECTED 2026-07-28)
 * Vertical card layout: 2x2 grid + 1 full-width card
 * Image top (full width), text below
 *
 * Design System Spec:
 * - 2×2 grid of vertical cards (image top, text below)
 * - 1 full-width vertical card at bottom
 * - Flat borders, zero radius
 * - Circular arrow link button
 */

type PurposeCard = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  link: string;
  fullWidth?: boolean;
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
  },
  {
    id: "innovation",
    title: "Innovation",
    description:
      "CONTENT REQUIRED — Innovation copy pending corporate approval",
    imageUrl: "/images/home/purpose-innovation.png",
    imageAlt: "Innovation",
    link: "/innovation",
  },
  {
    id: "brands",
    title: "Our Brands",
    description:
      "CONTENT REQUIRED — Brands copy pending corporate approval",
    imageUrl: "/images/home/purpose-brands.png",
    imageAlt: "Our Brands",
    link: "/brands",
  },
  {
    id: "vision",
    title: "Our Vision",
    description:
      "CONTENT REQUIRED — Vision and future direction copy pending corporate approval",
    imageUrl: "/images/home/hero-lifestyle-about-us.png",
    imageAlt: "Our Vision",
    link: "/vision",
  },
  {
    id: "sustainability",
    title: "Sustainability",
    description:
      "CONTENT REQUIRED — Sustainability copy pending corporate approval",
    imageUrl: "/images/home/purpose-sustainability-alt.jpg",
    imageAlt: "Sustainability",
    link: "/sustainability",
    fullWidth: true,
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
        <h2 className={styles.sectionTitle}>Our Purpose & Values</h2>

        {/* 2x2 Grid - Vertical Cards */}
        <div className={styles.gridContainer}>
          {purposeCards.slice(0, 4).map((card) => (
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
                <img
                  src={card.imageUrl}
                  alt={card.imageAlt}
                  className={styles.image}
                  loading="lazy"
                />
              </div>

              <div className={styles.content}>
                <div>
                  <h3 className={styles.title}>{card.title}</h3>
                  <p className={styles.description}>{card.description}</p>
                </div>
                <a href={card.link} className={styles.link} aria-label={card.title}>
                  <svg viewBox="0 0 24 24" width="27" height="27" aria-hidden="true">
                    <polygon points="6,2.5 21.5,12 6,21.5" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Full-width Card */}
        <div
          ref={(el) => {
            if (el) cardRefs.current["vision"] = el;
          }}
          data-card-id="vision"
          className={`${styles.card} ${styles.fullWidthCard} ${
            visibleCards.has("vision") ? styles.visible : ""
          }`}
        >
          <div className={styles.imageWrapper}>
            <img
              src={purposeCards[4].imageUrl}
              alt={purposeCards[4].imageAlt}
              className={styles.image}
              loading="lazy"
            />
          </div>

          <div className={styles.content}>
            <div>
              <h3 className={styles.title}>{purposeCards[4].title}</h3>
              <p className={styles.description}>{purposeCards[4].description}</p>
            </div>
            <a href={purposeCards[4].link} className={styles.link} aria-label={purposeCards[4].title}>
              <svg viewBox="0 0 24 24" width="27" height="27" aria-hidden="true">
                <polygon points="6,2.5 21.5,12 6,21.5" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
