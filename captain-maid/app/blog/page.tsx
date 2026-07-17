import type { Metadata } from 'next'
import { TipCard } from '@/components/TipCard'

export const metadata: Metadata = {
  title: 'Blog | Cleaning Tips & Solutions | Captain Maid',
  description:
    'Expert cleaning advice and home care tips from Captain Maid. Learn natural cleaning methods, deep cleaning strategies, and family-safe solutions.',
  keywords: 'cleaning tips, cleaning advice, blog, household cleaning, home care',
  openGraph: {
    title: 'Blog | Cleaning Tips & Solutions | Captain Maid',
    description: 'Expert cleaning advice and home care tips',
    type: 'website',
  },
}

const blogArticles = [
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
  {
    slug: 'thai-tile-floor-cleaning',
    emoji: '🏠',
    category: 'Floor Care',
    title: 'How to Clean Thai Tile Floors in Hot, Humid Weather',
    excerpt: 'Special tips for maintaining tile floors in Southeast Asia\'s unique climate.',
    readTime: '6 min read',
  },
  {
    slug: 'bathroom-mold-prevention',
    emoji: '🚿',
    category: 'Bathroom',
    title: 'Preventing Mold & Mildew in Thai Bathrooms',
    excerpt: 'Combat humidity-related bathroom problems with these proven prevention strategies.',
    readTime: '8 min read',
  },
  {
    slug: 'sustainable-cleaning',
    emoji: '♻️',
    category: 'Sustainability',
    title: 'Sustainable Cleaning: Reduce Waste, Keep Your Home Clean',
    excerpt: 'Make environmentally conscious choices without sacrificing cleaning power.',
    readTime: '7 min read',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-captain-cream dark:bg-captain-cream-dark pt-24">
      <div className="container-safe">
        {/* Page Header */}
        <div className="mb-2xl py-xl">
          <h1 className="text-5xl font-serif font-bold mb-md text-captain-blue">Cleaning Tips & Solutions</h1>
          <p className="text-xl text-captain-neutral max-prose">
            Expert advice for a cleaner, healthier home. From eco-friendly hacks to deep-cleaning strategies,
            we help you keep your home fresh and family-safe.
          </p>
        </div>

        {/* Featured Article */}
        <div className="mb-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl bg-captain-light rounded-sm overflow-hidden">
            {/* Image */}
            <div className="aspect-video bg-gradient-to-br from-captain-blue to-captain-yellow flex items-center justify-center text-8xl">
              {blogArticles[0].emoji}
            </div>

            {/* Content */}
            <div className="p-xl flex flex-col justify-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-captain-blue mb-sm inline-block">
                {blogArticles[0].category}
              </span>
              <h2 className="text-3xl font-serif font-bold mb-md text-captain-text">
                {blogArticles[0].title}
              </h2>
              <p className="text-lg text-captain-neutral mb-lg leading-relaxed">
                {blogArticles[0].excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-captain-neutral">{blogArticles[0].readTime}</span>
                <a
                  href={`/blog/${blogArticles[0].slug}`}
                  className="text-captain-blue font-semibold hover:text-captain-blue-dark"
                >
                  Read Article →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter (Placeholder) */}
        <div className="mb-2xl pb-xl border-b border-captain-light flex flex-wrap gap-md">
          <button className="px-md py-sm bg-captain-blue text-white rounded-sm font-medium hover:bg-captain-blue-dark transition-colors">
            All Articles
          </button>
          <button className="px-md py-sm bg-white text-captain-text border border-captain-light rounded-sm font-medium hover:bg-captain-light transition-colors">
            Eco-Friendly
          </button>
          <button className="px-md py-sm bg-white text-captain-text border border-captain-light rounded-sm font-medium hover:bg-captain-light transition-colors">
            Family Care
          </button>
          <button className="px-md py-sm bg-white text-captain-text border border-captain-light rounded-sm font-medium hover:bg-captain-light transition-colors">
            Deep Clean
          </button>
          <button className="px-md py-sm bg-white text-captain-text border border-captain-light rounded-sm font-medium hover:bg-captain-light transition-colors">
            Floor Care
          </button>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg mb-2xl">
          {blogArticles.slice(1).map((article) => (
            <TipCard key={article.slug} {...article} />
          ))}
        </div>

        {/* Pagination */}
        <div className="text-center py-2xl border-t border-captain-light">
          <p className="text-captain-neutral mb-lg">Showing {blogArticles.length} of 12 articles</p>
          <button className="px-lg py-md bg-captain-yellow text-captain-text rounded-sm font-semibold hover:bg-captain-blue hover:text-white transition-all">
            Load More Articles
          </button>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://captain-maid.vercel.app',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: 'https://captain-maid.vercel.app/blog',
              },
            ],
          }),
        }}
      />
    </div>
  )
}
