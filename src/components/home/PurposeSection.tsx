"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./purpose-section.module.css";

/**
 * PurposeSection (REDESIGN 2026-07-28)
 * Horizontal card layout: 2x2 grid + 1 full-width card
 * Image left, text right
 *
 * Design System Spec:
 * - 2×2 grid of horizontal cards (image 40%, text 60%)
 * - 1 full-width horizontal card at bottom
 * - Flat borders, zero radius
 * - "อ่านต่อ" (Read more) link
 */

type PurposeCard = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  link: string;
  linkText: string;
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
    linkText: "อ่านต่อ",
  },
  {
    id: "sustainability",
    title: "Sustainability",
    description:
      "CONTENT REQUIRED — Sustainability copy pending corporate approval",
    imageUrl: "/images/home/purpose-sustainability-alt.jpg",
    imageAlt: "Sustainability",
    link: "/sustainability",
    linkText: "อ่านต่อ",
  },
  {
    id: "innovation",
    title: "Innovation",
    description:
      "CONTENT REQUIRED — Innovation copy pending corporate approval",
    imageUrl: "/images/home/purpose-innovation.png",
    imageAlt: "Innovation",
    link: "/innovation",
    linkText: "อ่านต่อ",
  },
  {
    id: "brands",
    title: "Our Brands",
    description:
      "CONTENT REQUIRED — Brands copy pending corporate approval",
    imageUrl: "/images/home/purpose-brands.png",
    imageAlt: "Our Brands",
    link: "/brands",
    linkText: "อ่านต่อ",
  },
  {
    id: "vision",
    title: "Our Vision",
    description:
      "CONTENT REQUIRED — Vision and future direction copy pending corporate approval",
    imageUrl: "/images/home/hero-lifestyle-about-us.png",
    imageAlt: "Our Vision",
    link: "/vision",
    linkText: "อ่านต่อ",
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

        {/* 2x2 Grid */}
        <div className={styles.gridContainer}>
          {purposeCards.slice(0, 4).map((card) => (
            <div
              key={card.id}
              ref={(el) => {
                if (el) cardRefs.current[card.id] = el;
              }}
              data-card-id={card.id}
              className={`${styles.card} ${styles.horizontalCard} ${
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
                <h3 className={styles.title}>{card.title}</h3>
                <p className={styles.description}>{card.description}</p>
                <a href={card.link} className={styles.link}>
                  {card.linkText}
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
            <h3 className={styles.title}>{purposeCards[4].title}</h3>
            <p className={styles.description}>{purposeCards[4].description}</p>
            <a href={purposeCards[4].link} className={styles.link}>
              {purposeCards[4].linkText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
