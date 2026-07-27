import { ArrowRight } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { getLocaleContent, supportedLocales } from '@/lib/siteData'

const resolveLocale = (locale) => (supportedLocales.includes(locale) ? locale : 'en')

export default function ContentSplit() {
  const { locale: routeLocale } = useParams()
  const locale = resolveLocale(routeLocale)
  const { gateways } = getLocaleContent(locale)

  return (
    <section id="brands" className="bg-white px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        {gateways.map((card) => (
          <article
            key={card.title}
            className="group relative min-h-[340px] overflow-hidden rounded-[28px] border border-black/6 bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)]"
          >
            <img
              src={card.image}
              alt={card.alt}
              className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/86 via-44% to-white/0" />
            <div className="absolute inset-0 flex items-end">
              <div className="flex h-full w-full flex-col justify-between p-6 sm:p-8 lg:p-10">
                <div className="max-w-[16rem]">
                  <div className="mb-4 h-1 w-10 rounded-full bg-[#df0c0c]" aria-hidden="true" />
                  <h2 className="text-[clamp(2rem,3vw,3rem)] font-black tracking-[-0.05em] text-black">
                    {card.title}
                  </h2>
                  <p className="mt-4 max-w-[15rem] text-[1rem] leading-7 text-black/72">
                    {card.description}
                  </p>
                  <a
                    href={`/${locale}#brands`}
                    className="mt-7 inline-flex items-center gap-3 text-[0.95rem] font-semibold text-[#df0c0c] transition group-hover:gap-4"
                  >
                    {card.cta}
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </a>
                </div>

                <div className="flex items-end">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#df0c0c]/35 bg-white/80 text-[0.82rem] font-bold text-[#df0c0c] shadow-sm backdrop-blur-sm">
                    {card.icon}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
