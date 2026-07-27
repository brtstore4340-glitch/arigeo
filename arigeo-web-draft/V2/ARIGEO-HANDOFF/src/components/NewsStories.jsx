import { ArrowRight } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { getLocaleContent, supportedLocales } from '@/lib/siteData'

const resolveLocale = (locale) => (supportedLocales.includes(locale) ? locale : 'en')

export default function NewsStories() {
  const { locale: routeLocale } = useParams()
  const locale = resolveLocale(routeLocale)
  const { news } = getLocaleContent(locale)

  return (
    <section id="news" className="bg-white px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#df0c0c]">Insights & News</p>
            <h2 className="text-[clamp(2rem,3vw,2.8rem)] font-black tracking-[-0.05em] text-black">
              News & Stories
            </h2>
          </div>
          <a href={`/${locale}#news`} className="hidden items-center gap-2 text-sm font-semibold text-[#df0c0c] sm:inline-flex">
            View all news
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {news.map((article) => (
            <article
              key={article.title}
              className="group overflow-hidden rounded-[24px] border border-black/8 bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
            >
              <div className="aspect-[1.08] overflow-hidden bg-black/[0.03]">
                <img
                  src={article.image}
                  alt={article.alt}
                  className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex min-h-[220px] flex-col p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-black/52">
                  <span>{article.category}</span>
                  <span>{article.date}</span>
                </div>
                <h3 className="text-[1.15rem] font-black leading-snug tracking-[-0.03em] text-black">
                  {article.title}
                </h3>
                <div className="mt-auto pt-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black transition group-hover:border-[#df0c0c] group-hover:text-[#df0c0c]">
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
