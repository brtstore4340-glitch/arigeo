import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Logo from "@/components/Logo";

type SocialItem = {
  key: "linkedin" | "instagram" | "youtube" | "facebook";
  label: string;
  href: string | null;
  path: string;
  viewBox?: string;
};

const socialItems: SocialItem[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    href: null,
    path: "M20.447 20.452h-3.554V14.87c0-1.33-.026-3.04-1.852-3.04-1.853 0-2.136 1.446-2.136 2.94v5.682H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.266 2.37 4.266 5.455zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM7.119 20.452H3.555V9H7.12zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z",
  },
  {
    key: "instagram",
    label: "Instagram",
    href: null,
    path: "M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2H7.75zm0 1.8h8.5a3.95 3.95 0 0 1 3.95 3.95v8.5a3.95 3.95 0 0 1-3.95 3.95h-8.5a3.95 3.95 0 0 1-3.95-3.95v-8.5A3.95 3.95 0 0 1 7.75 3.8zM17.25 5.25a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 6.5A5.5 5.5 0 1 0 17.5 12 5.5 5.5 0 0 0 12 6.5zm0 1.8A3.7 3.7 0 1 1 8.3 12 3.7 3.7 0 0 1 12 8.3z",
  },
  {
    key: "youtube",
    label: "YouTube",
    href: null,
    path: "M23.498 6.186a2.99 2.99 0 0 0-2.103-2.117C19.541 3.57 12 3.57 12 3.57s-7.541 0-9.395.5A2.99 2.99 0 0 0 .502 6.186C0 8.054 0 12 0 12s0 3.946.502 5.814a2.99 2.99 0 0 0 2.103 2.117c1.854.499 9.395.499 9.395.499s7.541 0 9.395-.499a2.99 2.99 0 0 0 2.103-2.117C24 15.946 24 12 24 12s0-3.946-.502-5.814zM9.6 15.57V8.43L15.84 12 9.6 15.57z",
  },
  {
    key: "facebook",
    label: "Facebook",
    href: null,
    path: "M13.135 22v-8.034h2.714l.406-3.13h-3.12V8.84c0-.907.252-1.525 1.553-1.525h1.659V4.513c-.287-.038-1.272-.123-2.418-.123-2.39 0-4.028 1.46-4.028 4.142v2.304H8.196v3.13h2.705V22z",
  },
];

function SocialIcon({ path, label, viewBox = "0 0 24 24" }: { path: string; label: string; viewBox?: string }) {
  return (
    <svg viewBox={viewBox} aria-hidden="true" focusable="false">
      <title>{label}</title>
      <path d={path} fill="currentColor" />
    </svg>
  );
}

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
          <div className="socials">
            {socialItems.map((item) =>
              item.href ? (
                <a
                  href={item.href}
                  key={item.key}
                  className="socials__item"
                  aria-label={item.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon path={item.path} label={item.label} />
                </a>
              ) : (
                <button
                  type="button"
                  key={item.key}
                  className="socials__item socials__item--pending"
                  aria-label={`${item.label} — Awaiting official URL`}
                  title="Awaiting Official URL"
                >
                  <SocialIcon path={item.path} label={item.label} />
                </button>
              )
            )}
          </div>
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
