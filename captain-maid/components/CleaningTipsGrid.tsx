import Link from 'next/link'
import { TipCard } from './TipCard'

const tipArticles = [
  {
    slug: 'natural-ingredients-homemade-cleaners',
    emoji: '🪴',
    category: 'Eco-Friendly',
    title: '5 Natural Ingredients for Homemade Cleaners',
    excerpt:
      'Lemon, vinegar, baking soda, and more. Learn how to make your own cleaning solutions from pantry staples.',
    readTime: '5 min read',
  },
  {
    slug: 'keeping-home-safe-kids-pets',
    emoji: '👨‍👩‍👧‍👦',
    category: 'Family Care',
    title: 'Keeping Your Home Safe for Kids & Pets',
    excerpt:
      'Choose non-toxic cleaners and create a cleaning routine that works with family life, not against it.',
    readTime: '7 min read',
  },
  {
    slug: 'monthly-deep-clean-checklist',
    emoji: '🧼',
    category: 'Deep Clean',
    title: 'Monthly Deep Clean Checklist for Your Home',
    excerpt:
      'A room-by-room guide to deep cleaning. Perfect for a weekend project or spring cleaning season.',
    readTime: '10 min read',
  },
]

export function CleaningTipsGrid() {
  return (
    <section id="tips" className="section-spacing">
      <div className="container-safe">
        <div className="mb-2xl">
          <h2 className="text-4xl font-serif font-bold mb-md text-captain-blue">
            Cleaning Tips & Solutions
          </h2>
          <p className="text-lg text-captain-neutral max-prose">
            Expert advice for a cleaner, healthier home. From eco-friendly hacks to deep-cleaning strategies.
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-2xl">
          {tipArticles.map((tip) => (
            <TipCard key={tip.slug} {...tip} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link
            href="/blog"
            className="btn-primary inline-flex items-center gap-sm px-lg py-md bg-captain-yellow text-captain-text rounded-sm font-semibold hover:bg-captain-blue hover:text-white"
          >
            View All Articles →
          </Link>
        </div>
      </div>
    </section>
  )
}
