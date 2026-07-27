import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getLocaleContent, supportedLocales } from '@/lib/siteData'

const resolveLocale = (locale) => (supportedLocales.includes(locale) ? locale : 'en')

const socials = [
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Youtube, label: 'YouTube' },
  { icon: Facebook, label: 'Facebook' },
]

export default function Footer() {
  const { locale: routeLocale } = useParams()
  const locale = resolveLocale(routeLocale)
  const copy = getLocaleContent(locale)

  return (
    <footer id="careers" className="bg-white px-4 pb-0 pt-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 pb-10 lg:grid-cols-[1.2fr_1.8fr] lg:gap-12">
          <div className="max-w-[22rem]">
            <Link
              to={`/${locale}`}
              className="flex items-center gap-1.5 text-[1.9rem] font-black tracking-[-0.06em] leading-none text-black"
            >
              <span>ARIGE</span>
              <span className="mt-[0.15rem] inline-flex h-4 w-4 rounded-full bg-[#df0c0c]" aria-hidden="true" />
            </Link>
            <p className="mt-5 text-[0.98rem] leading-7 text-black/72">{copy.footerIntro}</p>
            <div className="mt-6 flex gap-3">
              {socials.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black transition hover:border-[#df0c0c] hover:text-[#df0c0c]"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 xl:grid-cols-6">
            {copy.footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-black">{column.title}</h3>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href={`/${locale}#about`} className="text-[0.96rem] text-black/68 transition hover:text-[#df0c0c]">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-black/8 bg-black px-4 py-4 text-white sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 text-sm text-white/82 md:flex-row md:items-center md:justify-between">
          <p>© 2024 ARIGEO Co., Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            {copy.legalLinks.map((link, index) => (
              <div key={link} className="flex items-center gap-4">
                {index > 0 && <span className="hidden h-4 w-px bg-white/20 md:inline-block" aria-hidden="true" />}
                <a href="#" className="transition hover:text-white">
                  {link}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
