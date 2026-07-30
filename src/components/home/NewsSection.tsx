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

export default function NewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsCards.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const translateX = -(currentIndex * (100 / newsCards.length));

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
    </section>
  );
}
