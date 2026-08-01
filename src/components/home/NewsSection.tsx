"use client";

import { useEffect, useRef, useState } from "react";
import { Tag } from "@/components/ui/Tag";
import styles from "./news-section.module.css";

type NewsCard = {
  href?: string;
  category: string;
  title: string;
  image?: string;
  alt?: string;
  comingSoon?: boolean;
};

const newsCards: NewsCard[] = [
  {
    href: "/about",
    category: "About us",
    title: "Get to know ARIGEO",
    image: "/images/home/news-corporate-building.png",
    alt: "Get to know ARIGEO",
  },
  {
    href: "/products",
    category: "Products",
    title: "Products for everyday care",
    image: "/images/home/news-product-handwash.png",
    alt: "Products for everyday care",
  },
  {
    href: "/innovation",
    category: "Innovation",
    title: "Innovation starts with people",
    image: "/images/home/news-lifestyle-couple.png",
    alt: "Innovation starts with people",
  },
  {
    href: "/brands",
    category: "Our brands",
    title: "Brands you can trust",
    image: "/images/home/hero-products.png",
    alt: "Brands you can trust",
  },
  {
    category: "Coming Soon",
    title: "More stories coming soon",
    comingSoon: true,
  },
  {
    category: "Coming Soon",
    title: "Product highlights coming soon",
    comingSoon: true,
  },
  {
    category: "Coming Soon",
    title: "Brand stories coming soon",
    comingSoon: true,
  },
  {
    category: "Coming Soon",
    title: "Sustainability updates coming soon",
    comingSoon: true,
  },
];

export default function NewsSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  const scrollCards = (direction: "previous" | "next") => {
    setIsPaused(true);
    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
    }

    const carousel = carouselRef.current;

    if (!carousel) return;

    carousel.scrollBy({
      left: direction === "next" ? carousel.clientWidth * 0.82 : carousel.clientWidth * -0.82,
      behavior: "smooth",
    });

    resumeTimerRef.current = window.setTimeout(() => {
      setIsPaused(false);
    }, 2200);
  };

  const renderCard = (card: NewsCard, idx: number, duplicate = false) => (
    <li
      key={`${duplicate ? "duplicate" : "primary"}-${idx}`}
      id={duplicate ? undefined : `news-section-slide-${idx + 1}`}
      className={styles.slide}
      aria-hidden={duplicate}
    >
      {card.comingSoon ? (
        <div className={styles.card}>
          <div className={styles.imageWrapper}>
            <div className={styles.comingSoon}>
              <span>Coming Soon</span>
            </div>
          </div>
          <div className={styles.content}>
            <Tag tone="brand">{card.category}</Tag>
            <h3 className={styles.title}>{card.title}</h3>
          </div>
        </div>
      ) : (
        <a href={card.href} className={styles.card} tabIndex={duplicate ? -1 : undefined}>
          <div className={styles.imageWrapper}>
            <img
              src={card.image}
              alt={card.alt}
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <span className={styles.category}>{card.category}</span>
            <h3 className={styles.title}>{card.title}</h3>
            <span className={styles.readMore}>Read more informations.</span>
          </div>
        </a>
      )}
    </li>
  );

  return (
    <section
      className={`${styles.section} ${isPaused ? styles.paused : ""}`}
      aria-label="Latest news"
    >
      <h2 className={styles.heading}>Latest</h2>

      <div
        ref={carouselRef}
        className={styles.carousel}
        onPointerEnter={() => setIsPaused(true)}
        onPointerLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        <ul
          id="news-section-track"
          className={styles.track}
          aria-label="Latest news and stories"
        >
          {newsCards.map((card, idx) => renderCard(card, idx))}
          {newsCards.map((card, idx) => renderCard(card, idx, true))}
        </ul>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          onClick={() => scrollCards("previous")}
          className={`${styles.navButton} ${styles.prevButton}`}
          aria-label="Scroll latest news left"
          aria-controls="news-section-track"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => scrollCards("next")}
          className={`${styles.navButton} ${styles.nextButton}`}
          aria-label="Scroll latest news right"
          aria-controls="news-section-track"
        >
          Next
        </button>
      </div>
    </section>
  );
}
