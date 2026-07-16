import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | Frequently Asked Questions | Captain Maid',
  description: 'Answers to common questions about Captain Maid products, usage, shipping, and safety.',
  openGraph: {
    title: 'FAQ | Captain Maid',
    description: 'Frequently asked questions about our cleaning products',
    type: 'website',
  },
}

const faqCategories = [
  {
    category: 'Products',
    questions: [
      {
        q: 'What are your products made from?',
        a: 'All Captain Maid products are formulated with plant-based surfactants, essential oils, and natural ingredients. We avoid harsh chemicals like bleach, ammonia, and phosphates.',
      },
      {
        q: 'Are your products eco-friendly?',
        a: 'Yes! Our formulas are biodegradable and our packaging is made from recycled plastic. We\'re committed to sustainability without compromising cleaning power.',
      },
      {
        q: 'Do you test on animals?',
        a: 'Absolutely not. We\'re a cruelty-free company. All our products are tested using alternative methods.',
      },
      {
        q: 'What scents do you offer?',
        a: 'We currently offer Lemongrass, Lavender, and Unscented formulations. We\'re developing more options based on customer feedback.',
      },
    ],
  },
  {
    category: 'Usage & Safety',
    questions: [
      {
        q: 'Are your products safe for children?',
        a: 'Our products are non-toxic and hypoallergenic. However, they should still be stored safely away from children. Always ensure surfaces are completely dry before children play on them.',
      },
      {
        q: 'Can I use these products on all surfaces?',
        a: 'Each product is designed for specific surfaces. Our Floor Cleaner works on tile, marble, wood, and concrete. Check product labels for specific surface recommendations.',
      },
      {
        q: 'What should I do if my child ingests the product?',
        a: 'Call Poison Control immediately (1300-222-800 in Thailand) or seek medical attention. Have the product label available when you call.',
      },
      {
        q: 'Can I mix different cleaners?',
        a: 'No! Never mix cleaning products, especially bleach-based cleaners with other products as this can create toxic fumes. Use one product at a time.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    questions: [
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping typically takes 2-3 business days within Thailand. Express options available. You\'ll receive tracking information via email.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Currently, we ship within Thailand. International shipping options are coming soon. Subscribe to our newsletter for updates.',
      },
      {
        q: 'What\'s your return policy?',
        a: 'We offer a 30-day money-back guarantee if you\'re not satisfied. Products must be unused and in original packaging.',
      },
      {
        q: 'Are there shipping costs?',
        a: 'Free shipping on orders over ฿500. Orders under ฿500 have a flat shipping fee of ฿49.',
      },
    ],
  },
  {
    category: 'Sustainability',
    questions: [
      {
        q: 'How are your bottles recycled?',
        a: 'Our plastic bottles are made from 50% recycled material. After use, simply rinse and place in your local recycling bin.',
      },
      {
        q: 'Do you offer refills?',
        a: 'Yes! We\'re developing a refill program. Sign up on our website to be notified when it launches.',
      },
      {
        q: 'What are your environmental goals?',
        a: 'By 2026, we aim to be 100% carbon neutral. We\'re working toward zero plastic waste in our operations.',
      },
      {
        q: 'How can I reduce cleaning product waste?',
        a: 'Use proper dilution (follow label instructions), store safely, and use only what you need. Proper usage = less waste.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-captain-cream dark:bg-captain-cream-dark pt-24">
      <div className="container-safe">
        {/* Page Header */}
        <div className="mb-2xl py-xl text-center">
          <h1 className="text-5xl font-serif font-bold mb-md text-captain-blue">Frequently Asked Questions</h1>
          <p className="text-xl text-captain-neutral max-prose mx-auto">
            Answers to common questions about Captain Maid products, usage, and shipping.
          </p>
        </div>

        {/* Search (Placeholder) */}
        <div className="mb-2xl">
          <input
            type="text"
            placeholder="Search FAQs..."
            className="w-full px-lg py-md border border-captain-light rounded-sm focus:outline-none focus:ring-2 focus:ring-captain-blue"
          />
        </div>

        {/* FAQ Sections */}
        {faqCategories.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-2xl">
            <h2 className="text-3xl font-serif font-bold mb-lg text-captain-blue">{section.category}</h2>

            <div className="space-y-md">
              {section.questions.map((item, itemIndex) => (
                <details key={itemIndex} className="bg-white dark:bg-captain-cream-dark rounded-sm border border-captain-light overflow-hidden group cursor-pointer hover:border-captain-blue transition-colors">
                  <summary className="flex items-center justify-between p-lg font-semibold text-captain-text hover:bg-captain-light/50 transition-colors">
                    <span className="text-lg">{item.q}</span>
                    <span className="text-captain-blue group-open:rotate-180 transition-transform">▼</span>
                  </summary>

                  <div className="px-lg pb-lg pt-0 text-captain-neutral leading-relaxed bg-captain-light/30 border-t border-captain-light">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Still Have Questions */}
        <div className="bg-captain-light rounded-sm p-2xl text-center my-2xl">
          <h2 className="text-3xl font-serif font-bold mb-md text-captain-text">Can't find your answer?</h2>
          <p className="text-lg text-captain-neutral mb-lg">
            We're here to help! Contact our support team and we'll get back to you within 24 hours.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-sm px-lg py-md bg-captain-yellow text-captain-text rounded-sm font-semibold hover:bg-captain-blue hover:text-white transition-all"
          >
            Contact Support →
          </a>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqCategories.flatMap((section) =>
              section.questions.map((q) => ({
                '@type': 'Question',
                name: q.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: q.a,
                },
              }))
            ),
          }),
        }}
      />
    </div>
  )
}
