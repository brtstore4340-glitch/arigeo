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

const defaultItems: CarouselItem[] = [
  {
    id: "products-1",
    image: "/images/products/product-lifestyle-1.png",
    category: "Products",
    title: "New Product Line Launch",
    href: "/products",
  },
  {
    id: "wellness-1",
    image: "/images/lifestyle/wellness-morning-1.png",
    category: "Wellness",
    title: "Daily Wellness Routine",
    href: "/about",
  },
  {
    id: "lifestyle-1",
    image: "/images/lifestyle/family-kitchen-1.png",
    category: "Lifestyle",
    title: "Family Care Excellence",
    href: "/products",
  },
];

export default function LatestCarousel({ heading = "Latest", items = defaultItems }: Props) {
  return (
    <section className="latest-carousel">
      <h2>{heading}</h2>
      <div className="carousel-track">
        {items.map((item) => (
          <article key={item.id} className="carousel-card">
            {item.image && <img src={item.image} alt={item.title} style={{width: '100%', height: '240px', objectFit: 'cover', marginBottom: '1rem'}} />}
            <span className="category">{item.category}</span>
            <h3>{item.title}</h3>
            <a href={item.href}>Read more →</a>
          </article>
        ))}
      </div>
    </section>
  );
}
