"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./news-carousel.module.css";

type NewsCard = {
  id: string;
  href: string;
  category: string;
  categoryColor: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  date?: string;
};

const newsCards: NewsCard[] = [
  {
    id: "news-1",
    href: "/about",
    category: "About Us",
    categoryColor: "#d50306",
    title: "Get to know ARIGEO",
    description: "Learn about our mission to deliver quality health, science, and household solutions",
    image: "/images/team/team-culture-1.png",
    alt: "ARIGEO team and mission",
    date: "2026-07-27",
  },
  {
    id: "news-2",
    href: "/products",
    category: "Products",
    categoryColor: "#0066cc",
    title: "Products for everyday care",
    description: "Discover our complete range of household and skincare solutions",
    image: "/images/lifestyle/family-kitchen-1.png",
    alt: "ARIGEO household products",
    date: "2026-07-25",
  },
  {
    id: "news-3",
    href: "/innovation",
    category: "Innovation",
    categoryColor: "#008000",
    title: "Innovation starts with people",
    description: "Our research and development drives sustainable solutions",
    image: "/images/team/team-collaboration-1.png",
    alt: "ARIGEO innovation lab",
    date: "2026-07-22",
  },
  {
    id: "news-4",
    href: "/brands",
    category: "Our Brands",
    categoryColor: "#ff6b00",
    title: "Brands you can trust",
    description: "Captain-Maid, Genuleaf, and Ceratory - trusted by families",
    image: "/images/products/beauty-skincare-1.png",
    alt: "ARIGEO brands",
    date: "2026-07-20",
  },
  {
    id: "news-5",
    href: "/sustainability",
    category: "Sustainability",
    categoryColor: "#00cc88",
    title: "Growing responsibly for the planet",
    description: "Our commitment to sustainable and eco-friendly practices",
    image: "/images/lifestyle/wellness-fitness-1.png",
    alt: "Sustainability commitment",
    date: "2026-07-18",
  },
];

export default function NewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (!isAutoPlay) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsCards.length);
    }, 6000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlay]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlay(true), 10000);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % newsCards.length);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + newsCards.length) % newsCards.length);
  }, [currentIndex, goToSlide]);

  const currentCard = newsCards[currentIndex];

  return (
    <section
      ref={containerRef}
      className={`${styles.section} ${inView ? styles.visible : ""}`}
      aria-label="News and stories carousel"
    >
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <span className={styles.label}>NEWSROOM</span>
            <h2 className={styles.title}>News & Stories</h2>
          </div>
          <Link href="/newsroom" className={styles.viewAllLink}>
            View all news
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Carousel */}
        <div className={styles.carousel}>
          {/* Slides */}
          <div className={styles.slideTrack}>
            {newsCards.map((card, idx) => (
              <article
                key={card.id}
                className={`${styles.slide} ${idx === currentIndex ? styles.active : ""}`}
                aria-hidden={idx !== currentIndex}
              >
                {/* Image */}
                <div className={styles.slideImage}>
                  <img
                    src={card.image}
                    alt={card.alt}
                    className={styles.image}
                    loading={idx === currentIndex ? "eager" : "lazy"}
                  />
                </div>

                {/* Content */}
                <div className={styles.slideContent}>
                  <div className={styles.badge} style={{ backgroundColor: card.categoryColor }}>
                    {card.category}
                  </div>
                  <h3 className={styles.slideTitle}>{card.title}</h3>
                  <p className={styles.slideDescription}>{card.description}</p>
                  {card.date && <span className={styles.slideDate}>{card.date}</span>}
                  <Link href={card.href} className={styles.slideLink}>
                    Read article
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Navigation */}
          <div className={styles.controls}>
            {/* Previous Button */}
            <button
              type="button"
              onClick={prevSlide}
              className={styles.navButton}
              aria-label="Previous slide"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>

            {/* Dots */}
            <ol className={styles.dots} aria-label="Slide indicators">
              {newsCards.map((_, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`${styles.dot} ${idx === currentIndex ? styles.active : ""}`}
                    aria-label={`Go to slide ${idx + 1}`}
                    aria-current={idx === currentIndex ? "page" : undefined}
                  />
                </li>
              ))}
            </ol>

            {/* Next Button */}
            <button
              type="button"
              onClick={nextSlide}
              className={styles.navButton}
              aria-label="Next slide"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Play/Pause */}
          <button
            type="button"
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={styles.playButton}
            aria-label={isAutoPlay ? "Pause carousel" : "Play carousel"}
            title={isAutoPlay ? "Pause" : "Play"}
          >
            {isAutoPlay ? "⏸" : "▶"}
          </button>
        </div>
      </div>
    </section>
  );
}
