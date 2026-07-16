"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, Menu, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import Logo from "@/components/Logo";

type NavKey = "about" | "brands" | "products" | "innovation" | "sustainability" | "news" | "careers" | "contact";

type NavItem = {
  key: NavKey;
  href: string;
};

const navItems: NavItem[] = [
  { key: "about", href: "/about" },
  { key: "brands", href: "/brands" },
  { key: "products", href: "/products" },
  { key: "innovation", href: "/innovation" },
  { key: "sustainability", href: "/sustainability" },
  { key: "news", href: "/newsroom" },
  { key: "careers", href: "/careers" },
  { key: "contact", href: "/contact" },
];

const SCROLL_DELTA_THRESHOLD = 10;
const TOP_THRESHOLD = 12;
const REVEAL_THRESHOLD = 72;

export default function Header() {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [isInteractionActive, setIsInteractionActive] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setIsInteractionActive(false);
    requestAnimationFrame(() => mobileToggleRef.current?.focus());
  };

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "th" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener?.("change", update);

    return () => mediaQuery.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (mobileOpen) setIsHeaderVisible(true);

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    lastScrollY.current = window.scrollY;
    setIsAtTop(window.scrollY <= TOP_THRESHOLD);

    const hero = document.getElementById("hero");
    if (!hero || !("IntersectionObserver" in window)) {
      setIsHeroInView(window.scrollY <= TOP_THRESHOLD);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroInView(entry?.isIntersecting ?? false),
      {
        threshold: [0.15, 0.25, 0.4, 0.6],
        rootMargin: "0px 0px -18% 0px",
      }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;
        const atTop = currentY <= TOP_THRESHOLD;
        const heroVisible = isHeroInView;
        const interactive = mobileOpen || isInteractionActive;

        if (atTop !== isAtTop) setIsAtTop(atTop);

        if (interactive) {
          if (!isHeaderVisible) setIsHeaderVisible(true);
          lastScrollY.current = currentY;
          ticking.current = false;
          return;
        }

        if (atTop || heroVisible) {
          if (!isHeaderVisible) setIsHeaderVisible(true);
          lastScrollY.current = currentY;
          ticking.current = false;
          return;
        }

        if (Math.abs(delta) >= SCROLL_DELTA_THRESHOLD) {
          if (delta > 0 && currentY > REVEAL_THRESHOLD) {
            if (isHeaderVisible) setIsHeaderVisible(false);
          } else if (delta < 0) {
            if (!isHeaderVisible) setIsHeaderVisible(true);
          }
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAtTop, isHeaderVisible, isHeroInView, isInteractionActive, mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileMenu();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const isSolidHeader = mobileOpen || !isHeroInView || !isAtTop;
  const headerClassName = [
    "site-header",
    "site-header--motion",
    isSolidHeader ? "site-header--solid" : "site-header--hero",
    isHeaderVisible ? "site-header--visible" : "site-header--hidden",
    prefersReducedMotion ? "site-header--reduced-motion" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header
      className={headerClassName}
      onFocusCapture={() => setIsInteractionActive(true)}
      onBlurCapture={(event) => {
        if (mobileOpen) return;
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsInteractionActive(false);
        }
      }}
    >
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="ARIGEO home">
          <Logo className="brand-logo h-9 w-auto sm:h-10" />
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.key} href={item.href}>
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button onClick={toggleLanguage} className="ghost-btn language" type="button">
            <Globe size={18} /> {t("language")} <span>⌄</span>
          </button>
          <button className="icon-btn" aria-label="Search" type="button">
            <Search size={20} />
          </button>
          <button
            ref={mobileToggleRef}
            className="lg:hidden icon-btn"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-primary-nav"
            aria-haspopup="menu"
            type="button"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav id="mobile-primary-nav" className="mobile-nav lg:hidden" aria-label="Mobile primary navigation">
          <ul className="mobile-nav__list">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link href={item.href} onClick={closeMobileMenu} className="mobile-nav__link">
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
