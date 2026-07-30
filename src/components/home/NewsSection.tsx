"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
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

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Latest</h2>

      <div className={styles.carousel}>
        <ul
          ref={trackRef}
          className={styles.track}
          style={{ transform: `translateX(${translateX}%)` }}
        >
          {newsCards.map((card, idx) => (
            <li key={idx} className={styles.slide}>
              {card.comingSoon ? (
                <div className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <div className={styles.comingSoon}>
                      <span>Coming Soon</span>
                    </div>
                  </div>
                  <div className={styles.content}>
                    <span className={styles.category}>{card.category}</span>
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
                  </div>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          onClick={handlePrev}
          className={styles.navButton}
          disabled={currentPage === 0}
          aria-label="Previous"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 5l-7 7 7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <ol className={styles.pagination}>
          {Array.from({ length: maxPages }).map((_, idx) => (
            <li key={idx}>
              <button
                type="button"
                onClick={() => goToPage(idx)}
                className={`${styles.dot} ${
                  idx === currentPage ? styles.dotActive : ""
                }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={handleNext}
          className={styles.navButton}
          disabled={currentPage === maxPages - 1}
          aria-label="Next"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
