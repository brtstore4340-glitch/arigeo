"use client";

import { useEffect, useRef } from "react";
import Splide from "@splidejs/splide";
import "@splidejs/splide/css";
import Link from "next/link";
import styles from "./news-carousel.module.css";

type NewsCard = {
  id: string;
  href: string;
  category: string;
  categoryColor: string;
  title: string;
  description: string;
  image: string | null;
  alt: string;
  date?: string;
};

const defaultCards: NewsCard[] = [
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

function fillMissingCards(cards: NewsCard[]): NewsCard[] {
  const result = [...cards];
  let counter = 0;
  while (result.length < 5) {
    result.push({
      id: `coming-soon-${counter}`,
      category: "COMING SOON",
      categoryColor: "#999999",
      title: "Coming Soon",
      description: "New content coming soon",
      image: null,
      alt: "Coming soon",
      href: "#",
    });
    counter++;
  }
  return result.slice(0, 5);
}

const newsCards = fillMissingCards(defaultCards);

export default function NewsCarousel() {
  const splideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!splideRef.current) return undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const splide: any = new Splide(splideRef.current, {
      type: "loop",
      perPage: 1,
      autoplay: true,
      interval: 6000,
      pauseOnHover: true,
      arrows: true,
      pagination: true,
      speed: 900,
      rewind: false,
    });

    splide.mount();

    return () => {
      splide.destroy();
    };
  }, []);

  return (
    <section className={styles.section} aria-label="News and stories carousel">
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

        {/* Splide Carousel */}
        <div ref={splideRef} className={`splide ${styles.carousel}`}>
          <div className="splide__track">
            <ul className="splide__list">
              {newsCards.map((card) => (
                <li key={card.id} className="splide__slide">
                  <article className={styles.slide}>
                    {/* Image with slow pan animation */}
                    {card.image ? (
                      <div className={styles.slideImage}>
                        <img
                          src={card.image}
                          alt={card.alt}
                          className={styles.image}
                        />
                      </div>
                    ) : (
                      <div className={styles.comingCard}>
                        <span>{card.title}</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className={styles.slideContent}>
                      <div
                        className={styles.badge}
                        style={{ backgroundColor: card.categoryColor }}
                      >
                        {card.category}
                      </div>
                      <h3 className={styles.slideTitle}>{card.title}</h3>
                      <p className={styles.slideDescription}>{card.description}</p>
                      {card.date && <span className={styles.slideDate}>{card.date}</span>}
                      {card.href !== "#" && (
                        <Link href={card.href} className={styles.slideLink}>
                          Read article
                          <span aria-hidden="true">→</span>
                        </Link>
                      )}
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>

          {/* Controls */}
          <div className={styles.splideControls}>
            <button
              className="splide__arrow splide__arrow--prev"
              type="button"
              aria-label="Previous slide"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>

            <div className="splide__pagination" />

            <button
              className="splide__arrow splide__arrow--next"
              type="button"
              aria-label="Next slide"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              className="splide__toggle"
              type="button"
              aria-label="Toggle autoplay"
            >
              <span className="splide__toggle__play">▶</span>
              <span className="splide__toggle__pause">⏸</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
