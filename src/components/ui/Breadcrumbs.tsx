"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import styles from "./breadcrumbs.module.css";

export type BreadcrumbItem = {
  label: string;
  href: string;
};

type Props = {
  items: BreadcrumbItem[];
  currentPage?: string;
};

export default function Breadcrumbs({ items, currentPage }: Props) {
  const locale = useLocale();

  return (
    <nav
      className={styles.breadcrumbs}
      aria-label={locale === "th" ? "เส้นทางนำทาง" : "Breadcrumb navigation"}
    >
      <ol className={styles.list}>
        {/* Home */}
        <li className={styles.item}>
          <Link
            href={locale === "th" ? "/th" : "/en"}
            className={styles.link}
          >
            {locale === "th" ? "หน้าแรก" : "Home"}
          </Link>
          <span className={styles.separator} aria-hidden="true">
            /
          </span>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, idx) => (
          <li key={item.href} className={styles.item}>
            <Link href={item.href} className={styles.link}>
              {item.label}
            </Link>
            {idx < items.length - 1 && (
              <span className={styles.separator} aria-hidden="true">
                /
              </span>
            )}
          </li>
        ))}

        {/* Current page */}
        {currentPage && (
          <li className={styles.item}>
            <span className={styles.current} aria-current="page">
              {currentPage}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
}
