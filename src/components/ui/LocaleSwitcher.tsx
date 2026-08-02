"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LocaleSwitcher() {
  const locale = useLocale() as "th" | "en";
  const pathname = usePathname();

  const toggleLocale = locale === "en" ? "th" : "en";
  const toggleLabel = locale === "en" ? "ไทย" : "EN";

  const togglePath = pathname.replace(/^\/(en|th)/, `/${toggleLocale}`);

  return (
    <Link
      href={togglePath}
      aria-label={`Switch to ${toggleLocale.toUpperCase()}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 44,
        padding: "0 12px",
        fontSize: 13,
        fontWeight: 700,
        textDecoration: "none",
        color: "currentColor",
        textTransform: locale === "en" ? "uppercase" : "none",
        transition: "opacity 200ms ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.opacity = "0.6";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
      }}
    >
      {toggleLabel}
    </Link>
  );
}
