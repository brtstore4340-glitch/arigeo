"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
];

const CARDS_PER_PAGE = 2;

export default function NewsSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const trackRef = useRef<HTMLUListElement>(null);

  const maxPages = Math.ceil(newsCards.length / CARDS_PER_PAGE);
  const translateX = -(currentPage * (100 / Math.ceil(newsCards.length / CARDS_PER_PAGE)));

  const handlePrev = useCallback(() => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : maxPages - 1));
  }, [maxPages]);

  const handleNext = useCallback(() => {
    setCurrentPage((prev) => (prev < maxPages - 1 ? prev + 1 : 0));
  }, [maxPages]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    if (!isPlaying || maxPages <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentPage((prev) => (prev < maxPages - 1 ? prev + 1 : 0));
    }, 5200);

    return () => window.clearInterval(timer);
  }, [isPlaying, maxPages]);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Latest</h2>

      <div className={styles.carousel}>
        <ul
          id="news-section-track"
          ref={trackRef}
          className={styles.track}
          style={{ transform: `translateX(${translateX}%)` }}
        >
          {newsCards.map((card, idx) => (
            <li key={idx} id={`news-section-slide-${idx + 1}`} className={styles.slide}>
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
                <a href={card.href} className={styles.card}>
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
                    <a href={card.href} className={styles.readMore}>Read more informations.</a>
                  </div>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.controls}>
        <div className={`${styles.arrows} ${styles.arrowsLtr}`}>
          <button
            type="button"
            onClick={handlePrev}
            className={`${styles.navButton} ${styles.prevButton}`}
            disabled={currentPage === 0}
            aria-label="Go to previous slide"
            aria-controls="news-section-track"
          >
            Previous
          </button>
        </div>

        <ul className={styles.pagination} role="tablist" aria-label="Select a slide to show">
          {Array.from({ length: maxPages }).map((_, idx) => (
            <li key={idx} role="presentation">
              <button
                type="button"
                role="tab"
                onClick={() => goToPage(idx)}
                className={`${styles.dot} ${
                  idx === currentPage ? styles.dotActive : ""
                }`}
                aria-controls={`news-section-slide-${idx + 1}`}
                aria-label={`Go to page ${idx + 1}`}
                aria-selected={idx === currentPage}
                tabIndex={idx === currentPage ? 0 : -1}
              />
            </li>
          ))}
        </ul>

        <div className={styles.arrows}>
          <button
            type="button"
            onClick={handleNext}
            className={`${styles.navButton} ${styles.nextButton}`}
            disabled={currentPage === maxPages - 1}
            aria-label="Next slide"
            aria-controls="news-section-track"
          >
            Next
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsPlaying((current) => !current)}
          className={`${styles.toggle} ${isPlaying ? styles.toggleActive : ""}`}
          aria-controls="news-section-track"
          aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
          aria-pressed={isPlaying}
        >
          <span className={styles.togglePlay}>Play</span>
          <span className={styles.togglePause}>Pause</span>
        </button>
      </div>
    </section>
  );
}
