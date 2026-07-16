import { useTranslations } from "next-intl";

const ArrowIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="inline-block ml-1">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SprayIcon = () => (
  <svg viewBox="0 0 48 48" width="38" height="38" fill="none" aria-hidden="true">
    <path d="M20 18h10v4l3 6v14a2 2 0 0 1-2 2H19a2 2 0 0 1-2-2V28l3-6v-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M22 18v-6h8M30 12h6M38 9v0M40 13h0M38 17v0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="39" cy="8.5" r="1" fill="currentColor" />
    <circle cx="42" cy="12.5" r="1" fill="currentColor" />
    <circle cx="39" cy="16.5" r="1" fill="currentColor" />
  </svg>
);

const BottlesIcon = () => (
  <svg viewBox="0 0 48 48" width="38" height="38" fill="none" aria-hidden="true">
    <path d="M14 20h9v20a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V20ZM16.5 20v-5h4v5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M18.5 15v-4h0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M29 24h9v16a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V24ZM31.5 24v-4h4v4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export default function CategorySection() {
  const t = useTranslations("Categories");

  const cards = [
    {
      key: "household",
      title: "Household",
      image: "/images/home/household-living-room.png",
      icon: "spray",
    },
    {
      key: "skincare",
      title: "Skincare",
      image: "/images/home/skincare-marble.png",
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
                {card.icon === 'spray' ? <SprayIcon /> : <BottlesIcon />}
              </div>
            </div>
            <div className="category-image" style={{ backgroundImage: `url(${card.image})` }} />
          </article>
        ))}
      </div>
    </section>
  );
}
