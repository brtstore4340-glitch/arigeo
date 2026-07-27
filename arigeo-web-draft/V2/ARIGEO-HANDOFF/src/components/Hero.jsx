import { ArrowRight } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { getLocaleContent, supportedLocales } from '@/lib/siteData'

const resolveLocale = (locale) => (supportedLocales.includes(locale) ? locale : 'en')

export default function Hero() {
  const { locale: routeLocale } = useParams()
  const locale = resolveLocale(routeLocale)
  const copy = getLocaleContent(locale).hero

  return (
    <section id="about" className="overflow-hidden bg-white">
      <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-[1440px] grid-cols-1 items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[42%_58%] lg:px-10 lg:py-14">
        <div className="max-w-[560px]">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#df0c0c]">
            {copy.eyebrow}
          </p>

          <h1 className="text-[clamp(2.9rem,6vw,5.2rem)] font-black leading-[0.92] tracking-[-0.07em] text-black">
            <span className="block">{copy.title[0]}</span>
            <span className="block">{copy.title[1]}</span>
            <span className="mt-3 block text-[#df0c0c]">{copy.emphasis[0]}</span>
            <span className="block text-[#df0c0c]">{copy.emphasis[1]}</span>
          </h1>

          <p className="mt-8 max-w-[31rem] text-[1.05rem] leading-8 text-black/78">
            {copy.body}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={`/${locale}#brands`}
              className="inline-flex items-center gap-3 rounded-full bg-[#df0c0c] px-7 py-4 text-[0.98rem] font-semibold text-white transition hover:bg-[#c90808]"
            >
              {copy.cta}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="relative min-h-[520px] lg:min-h-[760px]">
          <div className="absolute inset-y-0 right-[-2%] top-6 hidden h-[520px] w-[520px] rounded-full bg-[#df0c0c] lg:block xl:h-[640px] xl:w-[640px]" />
          <div className="relative h-full overflow-hidden rounded-[32px] bg-[#f8f6f2] shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
            <img
              src={copy.image}
              alt={copy.alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-3 lg:bottom-6 lg:left-0">
            <span className="h-1.5 w-8 rounded-full bg-[#df0c0c]" aria-hidden="true" />
            <span className="h-1.5 w-8 rounded-full bg-black/25" aria-hidden="true" />
            <span className="h-1.5 w-8 rounded-full bg-black/25" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
