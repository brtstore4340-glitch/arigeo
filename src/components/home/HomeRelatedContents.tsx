"use client";

/**
 * HomeRelatedContents
 * 3-card cross-link grid (Products/Innovation/Contact)
 *
 * Design System Spec:
 * - Round icon badge, bold title, body copy, "Read more" link
 * - Cards lift and border-tint red on hover
 * - Flat borders, zero radius
 */

interface ContentCard {
  id: string;
  icon?: string;
  title: string;
  description: string;
  href: string;
}

const defaultItems: ContentCard[] = [
  {
    id: "products",
    title: "Our Products",
    description: "Explore our complete range of household care and skincare solutions.",
    href: "/products",
  },
  {
    id: "innovation",
    title: "Innovation",
    description: "Discover how we're advancing research and technology in everyday care.",
    href: "/innovation",
  },
  {
    id: "contact",
    title: "Get in Touch",
    description: "Have questions? We'd love to hear from you.",
    href: "/contact",
  },
];

interface Props {
  items?: ContentCard[];
}

export default function HomeRelatedContents({ items = defaultItems }: Props) {
  return (
    <section className="home-related-contents">
      <div className="content-grid">
        {items.map((item) => (
          <a key={item.id} href={item.href} className="content-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
