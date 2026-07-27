import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ChevronDown, Menu, Search, X } from 'lucide-react'
import { getLocaleContent, supportedLocales } from '@/lib/siteData'

const resolveLocale = (locale) => (supportedLocales.includes(locale) ? locale : 'en')

export default function Navigation() {
  const { locale: routeLocale } = useParams()
  const locale = resolveLocale(routeLocale)
  const copy = getLocaleContent(locale)
  const { pathname, hash } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname, hash])

  useEffect(() => {
    setMobileOpen(false)
  }, [locale, pathname])

  return (
    <header
      className={`sticky top-0 z-50 border-b border-black/8 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 ${
        scrolled ? 'shadow-[0_2px_16px_rgba(17,17,17,0.04)]' : ''
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <Link to={`/${locale}`} className="flex items-center gap-1.5 text-[1.9rem] font-black tracking-[-0.06em] leading-none text-black">
          <span>ARIGE</span>
          <span className="mt-[0.15rem] inline-flex h-4 w-4 rounded-full bg-[#df0c0c]" aria-hidden="true" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 xl:flex">
          {copy.navLinks.map((link) => (
            <a
              key={link.label}
              href={`/${locale}${link.href}`}
              className="text-[0.92rem] font-medium tracking-[-0.01em] text-black/85 transition hover:text-[#df0c0c]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-3 pr-3 text-[0.9rem] text-black/80 md:flex">
            <div className="h-6 w-px bg-black/15" aria-hidden="true" />
            <Link
              to={`/${locale === 'en' ? 'th' : 'en'}`}
              className="inline-flex items-center gap-2 whitespace-nowrap font-medium transition hover:text-[#df0c0c]"
              aria-label={`Switch to ${copy.altLanguageShort}`}
            >
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-black/20 text-[0.55rem] leading-none">
                {copy.languageShort}
              </span>
              {copy.languageLabel}
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black transition hover:border-[#df0c0c] hover:text-[#df0c0c]"
            aria-label="Search"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black transition hover:border-[#df0c0c] hover:text-[#df0c0c] xl:hidden"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-black/10 bg-white xl:hidden">
          <div className="mx-auto grid max-w-[1440px] gap-2 px-4 py-4 sm:px-6">
            {copy.navLinks.map((link) => (
              <a
                key={link.label}
                href={`/${locale}${link.href}`}
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-medium text-black transition hover:bg-black/5 hover:text-[#df0c0c]"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex items-center justify-between rounded-2xl bg-black/[0.03] px-4 py-3 text-sm font-medium text-black/70">
              <span>{copy.languageLabel}</span>
              <Link to={`/${locale === 'en' ? 'th' : 'en'}`}>{copy.altLanguageShort}</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
