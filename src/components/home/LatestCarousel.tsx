"use client";

/**
 * LatestCarousel
 * Horizontal card carousel for cross-linking key pages
 *
 * Design System Spec:
 * - Image card, category label, title, black circular prev/next + dot pagination
 * - Kao-style flat borders, zero radius
 */

interface CarouselItem {
  id: string;
  image?: string;
  category: string;
  title: string;
  href: string;
}

interface Props {
  heading?: string;
  items?: CarouselItem[];
}

export default function LatestCarousel({ heading = "Latest", items = [] }: Props) {
  return (
    <section className="latest-carousel">
      <h2>{heading}</h2>
      <div className="carousel-track">
        {items.length === 0 ? (
          <p>CONTENT REQUIRED — Latest items pending</p>
        ) : (
          items.map((item) => (
            <article key={item.id} className="carousel-card">
              {item.image && <img src={item.image} alt={item.title} />}
              <span className="category">{item.category}</span>
              <h3>{item.title}</h3>
              <a href={item.href}>Read more →</a>
            </article>
          ))
        )}
      </div>
      {/* TODO: Implement circular prev/next buttons + dot pagination */}
    </section>
  );
}
