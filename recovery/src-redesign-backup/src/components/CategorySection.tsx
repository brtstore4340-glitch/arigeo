import { useTranslations } from "next-intl";

const ArrowIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="inline-block ml-1">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function CategorySection() {
  const t = useTranslations("Categories");

  const cards = [
    {
      key: "household",
      title: "Household",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      icon: "spray",
    },
    {
      key: "skincare",
      title: "Skincare",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
      icon: "bottle",
    },
  ] as const;

  return (
    <section className="section shell" id="brands">
      <div className="category-grid">
        {cards.map((card) => (
          <article className="category-card" key={card.key}>
            <div className="category-copy">
              <h2>{t(`${card.key}.title`)}</h2>
              <div className="accent-line" />
              <p>{t(`${card.key}.description`)}</p>
              <a href={`/products/${card.key}`}>
                {t(`${card.key}.cta`)} <ArrowIcon size={16} />
              </a>
              <div className="round-icon" aria-hidden="true">
                {card.icon === 'spray' ? '⌁' : '◫'}
              </div>
            </div>
            <div className="category-image" style={{ backgroundImage: `url(${card.image})` }} />
          </article>
        ))}
      </div>
    </section>
  );
}
