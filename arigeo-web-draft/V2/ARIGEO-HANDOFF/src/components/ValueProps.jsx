import { ArrowRight, FlaskConical, Globe, Heart } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { getLocaleContent, supportedLocales } from '@/lib/siteData'

const resolveLocale = (locale) => (supportedLocales.includes(locale) ? locale : 'en')

const icons = [FlaskConical, Globe, Heart]

export default function ValueProps() {
  const { locale: routeLocale } = useParams()
  const locale = resolveLocale(routeLocale)
  const { values } = getLocaleContent(locale)

  return (
    <section id="innovation" className="bg-white px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1440px] rounded-[28px] border border-black/8 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
        <div className="grid grid-cols-1 divide-y divide-black/8 md:grid-cols-3 md:divide-x md:divide-y-0">
          {values.map((value, index) => {
            const Icon = icons[index]
            return (
              <article key={value.title} className="flex h-full flex-col p-7 text-left sm:p-8 lg:p-10">
                <Icon className="h-9 w-9 text-[#df0c0c]" strokeWidth={1.7} aria-hidden="true" />
                <h3 className="mt-6 max-w-[14rem] text-[1.35rem] font-black leading-tight tracking-[-0.04em] text-black">
                  {value.title}
                </h3>
                <p className="mt-4 max-w-[18rem] text-[0.98rem] leading-7 text-black/72">
                  {value.description}
                </p>
                <a
                  href={`/${locale}#contact`}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-black transition hover:text-[#df0c0c]"
                >
                  <span className="sr-only">Learn more about {value.title}</span>
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
