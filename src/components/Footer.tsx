import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Logo from "@/components/Logo";

export default function Footer() {
  const t = useTranslations("Footer");

  const columns = [
    { key: "about", links: ["Our Company", "Our Philosophy", "Leadership", "Milestones", "Locations"] },
    { key: "brands", links: ["Household", "Skincare", "Brand Portfolio"] },
    { key: "innovation", links: ["R&D", "Technology", "Quality Assurance"] },
    { key: "sustainability", links: ["Our Approach", "Environment", "Social", "Governance"] },
    { key: "careers", links: ["Why ARIGEO", "Open Positions", "Life at ARIGEO"] },
    { key: "contact", links: ["Get in Touch", "Media Inquiries", "Partners"] },
  ] as const;

  return (
    <footer className="footer">
      <div className="shell footer-main">
        <div className="footer-brand">
          <Link className="brand" href="/" aria-label="ARIGEO home">
            <Logo className="h-9 w-[176px] sm:h-10 sm:w-[196px]" />
          </Link>
          <p>{t("description")}</p>
        </div>

        {columns.map((col) => (
          <nav key={col.key} aria-label={t(`columns.${col.key}`)} className="footer-column">
            <h3>{t(`columns.${col.key}`)}</h3>
            {col.links.map((_, i) => (
              <Link
                key={i}
                href={`/${col.key}`}
              >
                {t(`links.${col.key}.${i}`)}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="footer-bottom">
        <div className="shell">
          <p>© {new Date().getFullYear()} {t("rights")}</p>
          <div>
            <Link href="/terms">{t("terms")}</Link>
            <Link href="/privacy">{t("privacy")}</Link>
            <Link href="/sitemap">{t("sitemap")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
