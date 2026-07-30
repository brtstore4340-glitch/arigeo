"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./branded-card-section.module.css";

type BrandedCard = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  linkText: string;
  link: string;
};

const brandedCards: BrandedCard[] = [
  {
    id: "brands",
    title: "Our Brands",
    description:
      "Our brands help people make practical, reliable choices for cleaner homes and healthier daily routines.",
    imageUrl: "/images/home/purpose-brands.png",
    imageAlt: "Our Brands",
    linkText: "Read more",
    link: "/brands",
  },
  {
    id: "sustainability",
    title: "Sustainability",
    description:
      "We are committed to creating products and services that contribute to a better society and environment.",
    imageUrl: "/images/home/news-sustainability-globe.png",
    imageAlt: "Sustainability",
    linkText: "Read more",
    link: "/sustainability",
  },
  {
    id: "innovation",
    title: "Innovation",
    description:
      "Our commitment to innovation drives us to develop products that anticipate and meet customer needs.",
    imageUrl: "/images/home/news-lifestyle-couple.png",
    imageAlt: "Innovation",
    linkText: "Read more",
    link: "/innovation",
  },
  {
    id: "about",
    title: "About ARIGEO",
    description:
      "We create high-quality, sustainable products and services that enhance the lives of people everywhere.",
    imageUrl: "/images/home/news-corporate-building.png",
    imageAlt: "About ARIGEO",
    linkText: "Read more",
    link: "/about",
  },
];

export default function BrandedCardSection() {
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
      { threshold: 0.15 }
    );

    Object.values(cardRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.gridContainer}>
          {brandedCards.map((card) => (
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
                <div className={styles.textBlock}>
                  <h3 className={styles.title}>{card.title}</h3>
                  <p className={styles.description}>{card.description}</p>
                </div>

                <a href={card.link} className={styles.link}>
                  <span className={styles.linkIcon} aria-hidden="true" />
                  <span className={styles.linkText}>{card.linkText}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
