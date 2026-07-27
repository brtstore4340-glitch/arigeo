import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const ArrowIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="inline-block ml-1">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function NewsSection() {
  const t = useTranslations("News");
  const keys = ["1", "2", "3", "4"] as const;

  const images = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80",
  ];

  return (
    <section className="section shell" id="newsroom">
      <div className="section-heading">
        <h2>{t("title")}</h2>
        <Link href="/news">
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
              <Link href={`/news/${key}`} aria-label={`Read: ${t(`articles.${key}.title`)}`}>
                <ArrowIcon />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
