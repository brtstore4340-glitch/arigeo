import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="inline-block ml-1">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FeatureIcon = ({ type }: { type: string }) => {
  if (type === 'flask') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" className="w-[58px] h-[58px]">
        <path d="M18 6h12M21 6v11L10 36a4 4 0 0 0 3.5 6h21a4 4 0 0 0 3.5-6L27 17V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 31h16M21 25h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === 'globe') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" className="w-[58px] h-[58px]">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
        <path d="M6 24h36M24 6c5 5 8 11 8 18s-3 13-8 18M24 6c-5 5-8 11-8 18s3 13 8 18" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" className="w-[58px] h-[58px]">
      <path d="M24 41S7 31 7 18.5C7 12 11.8 8 17.2 8c3.6 0 6 2 6.8 4 .8-2 3.2-4 6.8-4C36.2 8 41 12 41 18.5 41 31 24 41 24 41Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default function ValuesSection() {
  const t = useTranslations("Values");

  const items = [
    { key: "innovation", icon: "flask" },
    { key: "sustainability", icon: "globe" },
    { key: "safety", icon: "heart" },
  ] as const;

  return (
    <section className="section section-tight shell" id="innovation">
      <div className="feature-panel">
        {items.map((item) => (
          <article className="feature-item" key={item.key}>
            <div className="feature-icon">
              <FeatureIcon type={item.icon} />
            </div>
            <div>
              <h3>{t(`${item.key}.title`)}</h3>
              <p>{t(`${item.key}.description`)}</p>
              <Link href={`/${item.key}`} aria-label={`Learn more about ${t(`${item.key}.title`)}`}>
                <ArrowIcon />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
