import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";

const ArrowIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="inline-block ml-1">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function NewsSection() {
  const t = useTranslations("News");
  const locale = useLocale();
  const keys = ["1", "2", "3", "4"] as const;

  const images = [
    "/images/home/news-corporate-building.png",
    "/images/home/news-product-handwash.png",
    "/images/home/news-sustainability-globe.png",
    "/images/home/news-lifestyle-couple.png",
  ];

  const links = [
    `/${locale}/newsroom/arigeo-launches-innovation-initiative`,
    `/${locale}/newsroom/sustainability-milestone`,
    `/${locale}/newsroom/captain-maid-expansion`,
    `/${locale}/newsroom`,
  ] as const;

  return (
    <section className="section shell" id="newsroom">
      <div className="section-heading">
        <h2>{t("title")}</h2>
        <Link href={`/${locale}/newsroom`}>
          {t("viewAll")} <ArrowIcon size={16} />
        </Link>
      </div>
      <div className="news-grid">
        {keys.map((key, i) => (
          <article className="news-card" key={key}>
            <div className="news-image" style={{ backgroundImage: `url(${images[i]})` }} />
            <div className="news-body">
              <div className="news-meta">
                <span>{t(`articles.${key}.category`)}</span>
                <time>{t(`articles.${key}.date`)}</time>
              </div>
              <h3 className="line-clamp-3">{t(`articles.${key}.title`)}</h3>
              <Link href={links[i]} aria-label={`Read: ${t(`articles.${key}.title`)}`}>
                <ArrowIcon />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
