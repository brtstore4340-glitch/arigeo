"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Globe, Menu, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import Logo from "@/components/Logo";
import { brands } from "@/data/brands";

type NavKey =
  | "about"
  | "brands"
  | "products"
  | "innovation"
  | "sustainability"
  | "news"
  | "careers"
  | "contact";

type DropdownEntry = {
  href: string;
  label: string;
  detail?: string;
};

type DropdownGroup = {
  heading: string;
  entries: DropdownEntry[];
};

type NavItem = {
  key: NavKey;
  href: string;
  dropdownGroups?: DropdownGroup[];
};

const TOP_THRESHOLD = 16;
const SCROLL_VISIBILITY_THRESHOLD = 56;
const SCROLL_HIDE_OFFSET = 72;
const DROPDOWN_CLOSE_DELAY = 160;

export default function Header() {
  const t = useTranslations("Navigation");
  const brandMessages = useTranslations("Brands");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<NavKey | null>(null);
  const [openMobileMenu, setOpenMobileMenu] = useState<NavKey | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const lastScrollY = useRef(0);
  const lastVisibilitySwitchY = useRef(0);
  const ticking = useRef(false);
  const visibilityRef = useRef(true);
  const desktopCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);
  const desktopDropdownId = useId();

  const brandEntries = brands.map((brand) => ({
    href: `/brands/${brand.slug}`,
    label: brandMessages(`${brand.messagesKey}.name`),
    detail:
      brand.foundation === "household"
        ? locale === "th"
          ? "กลุ่มผลิตภัณฑ์ในบ้าน"
          : "Household care"
        : locale === "th"
          ? "กลุ่มสกินแคร์"
          : "Skincare",
  }));

  const navItems: NavItem[] = [
    { key: "about", href: "/about" },
    {
      key: "brands",
      href: "/brands",
      dropdownGroups: [
        {
          heading: locale === "th" ? "แบรนด์" : "Brands",
          entries: brandEntries,
        },
      ],
    },
    { key: "products", href: "/products" },
    { key: "innovation", href: "/innovation" },
    { key: "sustainability", href: "/sustainability" },
    { key: "news", href: "/newsroom" },
    { key: "careers", href: "/careers" },
    { key: "contact", href: "/contact" },
  ];

  const closeDesktopMenu = () => {
    if (desktopCloseTimer.current) {
      clearTimeout(desktopCloseTimer.current);
      desktopCloseTimer.current = null;
    }
    setOpenDesktopMenu(null);
  };

  const scheduleDesktopClose = () => {
    if (desktopCloseTimer.current) clearTimeout(desktopCloseTimer.current);
    desktopCloseTimer.current = setTimeout(() => {
      setOpenDesktopMenu(null);
      desktopCloseTimer.current = null;
    }, DROPDOWN_CLOSE_DELAY);
  };

  const openDesktopMenuNow = (key: NavKey) => {
    if (desktopCloseTimer.current) {
      clearTimeout(desktopCloseTimer.current);
      desktopCloseTimer.current = null;
    }
    setOpenDesktopMenu(key);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setOpenMobileMenu(null);
    requestAnimationFrame(() => mobileToggleRef.current?.focus());
  };

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "th" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia("(min-width: 1025px)");

    const handleMotionChange = () => setPrefersReducedMotion(reduceMotionQuery.matches);
    const handleViewportChange = () => setIsDesktopViewport(desktopQuery.matches);

    handleMotionChange();
    handleViewportChange();

    reduceMotionQuery.addEventListener?.("change", handleMotionChange);
    desktopQuery.addEventListener?.("change", handleViewportChange);

    return () => {
      reduceMotionQuery.removeEventListener?.("change", handleMotionChange);
      desktopQuery.removeEventListener?.("change", handleViewportChange);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (mobileOpen) {
      setIsHeaderVisible(true);
      visibilityRef.current = true;
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMobileMenu(null);
    closeDesktopMenu();
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentY = window.scrollY;
    lastScrollY.current = currentY;
    lastVisibilitySwitchY.current = currentY;
    setIsAtTop(currentY <= TOP_THRESHOLD);

    const hero = document.getElementById("hero");
    if (!hero || !("IntersectionObserver" in window)) {
      setIsHeroInView(currentY <= TOP_THRESHOLD);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroInView(entry?.isIntersecting ?? false),
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: "0px 0px -12% 0px",
      }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    visibilityRef.current = isHeaderVisible;
  }, [isHeaderVisible]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;
        const direction = delta > 0 ? "down" : delta < 0 ? "up" : "still";
        const hasMovedEnough = Math.abs(currentY - lastVisibilitySwitchY.current) >= SCROLL_VISIBILITY_THRESHOLD;
        const atTop = currentY <= TOP_THRESHOLD;

        if (atTop !== isAtTop) setIsAtTop(atTop);

        if (prefersReducedMotion || mobileOpen || openDesktopMenu) {
          if (!visibilityRef.current) {
            visibilityRef.current = true;
            setIsHeaderVisible(true);
          }
          lastScrollY.current = currentY;
          lastVisibilitySwitchY.current = currentY;
          ticking.current = false;
          return;
        }

        if (atTop || isHeroInView) {
          if (!visibilityRef.current) {
            visibilityRef.current = true;
            setIsHeaderVisible(true);
          }
          lastScrollY.current = currentY;
          lastVisibilitySwitchY.current = currentY;
          ticking.current = false;
          return;
        }

        if (direction === "down" && currentY > SCROLL_HIDE_OFFSET && hasMovedEnough) {
          if (visibilityRef.current) {
            visibilityRef.current = false;
            setIsHeaderVisible(false);
            lastVisibilitySwitchY.current = currentY;
          }
        } else if (direction === "up" && hasMovedEnough) {
          if (!visibilityRef.current) {
            visibilityRef.current = true;
            setIsHeaderVisible(true);
            lastVisibilitySwitchY.current = currentY;
          }
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAtTop, isHeroInView, mobileOpen, openDesktopMenu, prefersReducedMotion]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        closeDesktopMenu();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDesktopMenu();
        if (mobileOpen) closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (isDesktopViewport) {
      setMobileOpen(false);
      setOpenMobileMenu(null);
    } else {
      closeDesktopMenu();
    }
  }, [isDesktopViewport]);

  useEffect(() => {
    return () => {
      if (desktopCloseTimer.current) clearTimeout(desktopCloseTimer.current);
    };
  }, []);

  const isSolidHeader = mobileOpen || openDesktopMenu !== null || !isHeroInView || !isAtTop;
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
      ref={headerRef}
      className={headerClassName}
      onBlurCapture={(event) => {
        if (mobileOpen) return;
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          closeDesktopMenu();
        }
      }}
    >
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="ARIGEO home">
          <Logo className="brand-logo h-9 w-[176px] sm:h-10 sm:w-[196px]" priority />
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <ul className="desktop-nav__list">
            {navItems.map((item) => {
              const hasDropdown = Boolean(item.dropdownGroups?.length);
              const isOpen = openDesktopMenu === item.key;
              const isCurrent =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`)) ||
                (item.key === "brands" && pathname.startsWith("/brands/"));

              return (
                <li
                  key={item.key}
                  className={[
                    "desktop-nav__item",
                    isCurrent || isOpen ? "desktop-nav__item--active" : "",
                    hasDropdown ? "desktop-nav__item--has-dropdown" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onMouseEnter={() => hasDropdown && openDesktopMenuNow(item.key)}
                  onMouseLeave={() => hasDropdown && scheduleDesktopClose()}
                  onFocus={() => hasDropdown && openDesktopMenuNow(item.key)}
                >
                  <div className="desktop-nav__trigger-wrap">
                    <Link href={item.href} className="desktop-nav__link">
                      {t(item.key)}
                    </Link>
                    {hasDropdown && (
                      <button
                        type="button"
                        className="desktop-nav__chevron"
                        aria-expanded={isOpen}
                        aria-controls={`${desktopDropdownId}-${item.key}`}
                        aria-label={`${t(item.key)} menu`}
                        onClick={(event) => {
                          event.preventDefault();
                          setOpenDesktopMenu((current) => (current === item.key ? null : item.key));
                        }}
                      >
                        <ChevronDown size={15} />
                      </button>
                    )}
                  </div>

                  {hasDropdown && (
                    <div
                      id={`${desktopDropdownId}-${item.key}`}
                      className={[
                        "desktop-dropdown",
                        isOpen ? "desktop-dropdown--open" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onMouseEnter={() => openDesktopMenuNow(item.key)}
                      onMouseLeave={scheduleDesktopClose}
                    >
                      <div className="desktop-dropdown__panel">
                        {item.dropdownGroups?.map((group) => (
                          <div className="desktop-dropdown__group" key={group.heading}>
                            <p className="desktop-dropdown__heading">{group.heading}</p>
                            <div className="desktop-dropdown__entries">
                              {group.entries.map((entry) => (
                                <Link
                                  key={entry.href}
                                  href={entry.href}
                                  className="desktop-dropdown__entry"
                                  onClick={() => setOpenDesktopMenu(null)}
                                >
                                  <span className="desktop-dropdown__label">{entry.label}</span>
                                  {entry.detail ? (
                                    <span className="desktop-dropdown__detail">{entry.detail}</span>
                                  ) : null}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
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
            {navItems.map((item) => {
              const hasDropdown = Boolean(item.dropdownGroups?.length);
              const isOpen = openMobileMenu === item.key;

              return (
                <li key={item.key} className="mobile-nav__item">
                  {hasDropdown ? (
                    <>
                      <button
                        type="button"
                        className="mobile-nav__accordion-trigger"
                        aria-expanded={isOpen}
                        aria-controls={`mobile-group-${item.key}`}
                        onClick={() =>
                          setOpenMobileMenu((current) => (current === item.key ? null : item.key))
                        }
                      >
                        <span>{t(item.key)}</span>
                        <ChevronDown
                          size={18}
                          className={isOpen ? "mobile-nav__chevron mobile-nav__chevron--open" : "mobile-nav__chevron"}
                        />
                      </button>
                      <div
                        id={`mobile-group-${item.key}`}
                        className={isOpen ? "mobile-nav__accordion mobile-nav__accordion--open" : "mobile-nav__accordion"}
                      >
                        <div className="mobile-nav__accordion-inner">
                          {item.dropdownGroups?.flatMap((group) =>
                            group.entries.map((entry) => (
                              <Link
                                key={entry.href}
                                href={entry.href}
                                onClick={closeMobileMenu}
                                className="mobile-nav__sublink"
                              >
                                <span>{entry.label}</span>
                                {entry.detail ? <small>{entry.detail}</small> : null}
                              </Link>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link href={item.href} onClick={closeMobileMenu} className="mobile-nav__link">
                      {t(item.key)}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
