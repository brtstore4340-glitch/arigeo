import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getLocaleContent, supportedLocales } from '@/lib/siteData'

const resolveLocale = (locale) => (supportedLocales.includes(locale) ? locale : 'en')

export default function Newsletter() {
  const { locale: routeLocale } = useParams()
  const locale = resolveLocale(routeLocale)
  const copy = getLocaleContent(locale).newsletter
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="bg-white px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[1440px] rounded-[28px] bg-[linear-gradient(180deg,#f8f8f6_0%,#f2f0eb_100%)] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        {submitted ? (
          <div className="grid gap-2 text-left sm:text-center">
            <h2 className="text-[clamp(1.8rem,2.6vw,2.7rem)] font-black tracking-[-0.05em] text-black">
              {copy.successTitle}
            </h2>
            <p className="text-[1rem] leading-7 text-black/72">{copy.successBody}</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <h2 className="text-[clamp(1.8rem,2.6vw,2.7rem)] font-black tracking-[-0.05em] text-black">
                {copy.title}
              </h2>
              <p className="mt-3 max-w-[40rem] text-[1rem] leading-7 text-black/72">
                {copy.description}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[1fr_auto] lg:justify-self-end lg:min-w-[36rem]">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={copy.placeholder}
                className="h-14 rounded-2xl border border-black/10 bg-white px-5 text-[1rem] text-black outline-none transition placeholder:text-black/40 focus:border-[#df0c0c]"
              />
              <button
                type="submit"
                className="h-14 rounded-2xl bg-[#df0c0c] px-7 text-[0.98rem] font-semibold text-white transition hover:bg-[#c90808]"
              >
                {copy.cta}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}
