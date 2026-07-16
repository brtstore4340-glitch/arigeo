import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface ProductDetailProps {
  params: { slug: string }
}

// Sample product data (in production, fetch from database/API)
const productDatabase: Record<
  string,
  {
    name: string
    category: string
    price: number
    rating: { score: number; count: number }
    emoji: string
    benefits: string[]
    features: Array<{ icon: string; title: string; description: string }>
    description: string
    specs: Record<string, string>
    usage: string[]
    warnings: string[]
    faqs: Array<{ q: string; a: string }>
  }
> = {
  'all-surface-floor-cleaner': {
    name: 'All-Surface Floor Cleaner',
    category: 'Floor Care',
    price: 199,
    rating: { score: 4.8, count: 342 },
    emoji: '🧹',
    benefits: [
      'Cleans all floor types (tile, marble, wood, concrete)',
      'Fresh lemongrass essential oil scent',
      'Non-toxic, safe for children and pets',
      'Biodegradable formula, eco-conscious packaging',
    ],
    features: [
      {
        icon: '💪',
        title: 'Powerful Formula',
        description: 'Cuts through dirt and grime in one wipe without harsh chemicals',
      },
      {
        icon: '🌿',
        title: 'Family-Safe',
        description: 'Non-toxic, hypoallergenic, safe for pets and sensitive skin',
      },
      {
        icon: '🌍',
        title: 'Eco-Conscious',
        description: 'Biodegradable, recyclable packaging made from recycled plastic',
      },
    ],
    description:
      'All-Surface Floor Cleaner is designed for Thai homes. Our climate—hot, humid, and demanding—requires a cleaning product that\'s both powerful and safe. This cleaner cuts through dirt, grime, and footprints on tile, marble, wood, and concrete, leaving your floors fresh and streak-free in one wipe.\n\nWhether you\'re cleaning after a tropical rainstorm tracked dirt indoors or just keeping your home pristine, one bottle handles every floor in your home.',
    specs: {
      Size: '750 mL',
      'Active Ingredients': 'Plant-based surfactants, essential oils',
      'Safe for': 'Tile, marble, wood, concrete, linoleum',
      'pH Level': '11.2',
      Scent: 'Lemongrass',
      Storage: 'Cool, dry place (shelf life: 2 years)',
    },
    usage: [
      'Dilute 1 part cleaner to 3 parts water (adjust for soiled floors)',
      'Apply to floor with mop or cloth',
      'Wipe clean with damp cloth',
      'Allow to air dry (2–3 minutes)',
      'Enjoy sparkling, fresh floors',
    ],
    warnings: [
      'Keep out of reach of children',
      'Do not mix with other cleaners (especially bleach)',
      'Use in well-ventilated areas',
      'If ingested, call Poison Control immediately',
      'For external use only',
    ],
    faqs: [
      {
        q: 'How often should I use this?',
        a: 'For daily cleaning, dilute with 3 parts water. For deep cleaning (weekly), use a stronger concentration (1:2 ratio).',
      },
      {
        q: 'Can I use this on outdoor tiles?',
        a: 'Yes! The formula works on both indoor and outdoor tiled surfaces. Ensure proper ventilation when using outdoors.',
      },
      {
        q: 'Is it safe for pets and babies?',
        a: 'Absolutely. The formula is non-toxic and hypoallergenic. Ensure the floor is dry before allowing pets or babies to play on it.',
      },
      {
        q: 'Does it leave a residue?',
        a: 'No. When used correctly (with proper dilution), it leaves no residue. Always wipe with a damp cloth after cleaning.',
      },
      {
        q: 'What\'s the shelf life?',
        a: 'Unopened bottles last 2 years when stored in a cool, dry place. After opening, use within 1 year for best results.',
      },
    ],
  },
}

export async function generateMetadata({ params }: ProductDetailProps): Promise<Metadata> {
  const product = productDatabase[params.slug]
  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: `${product.name} | Captain Maid`,
    description: `Buy ${product.name} on Captain Maid. ฿${product.price}. ${product.benefits[0]}`,
    keywords: `${product.name}, ${product.category}, buy, price, Thailand`,
    openGraph: {
      title: product.name,
      description: product.benefits[0],
      type: 'product',
    },
  }
}

export default function ProductDetailPage({ params }: ProductDetailProps) {
  const product = productDatabase[params.slug]

  if (!product) {
    return (
      <div className="min-h-screen bg-captain-cream dark:bg-captain-cream-dark pt-24 flex items-center justify-center">
        <div className="container-safe text-center">
          <h1 className="text-4xl font-serif font-bold mb-md text-captain-text">Product Not Found</h1>
          <p className="text-lg text-captain-neutral mb-xl">Sorry, we couldn't find that product.</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-sm px-lg py-md bg-captain-yellow text-captain-text rounded-sm font-semibold hover:bg-captain-blue hover:text-white">
            ← Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-captain-cream dark:bg-captain-cream-dark pt-24">
      <div className="container-safe">
        {/* Breadcrumb */}
        <Link
          href="/products"
          className="inline-flex items-center gap-sm text-captain-blue hover:text-captain-blue-dark mb-2xl"
        >
          <ChevronLeft size={20} />
          Back to Products
        </Link>

        {/* Product Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2xl mb-2xl">
          {/* Image */}
          <div className="bg-gradient-to-br from-captain-light to-captain-light/50 rounded-sm aspect-square flex items-center justify-center text-9xl">
            {product.emoji}
          </div>

          {/* Product Info */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-captain-blue mb-md inline-block">
              {product.category}
            </span>
            <h1 className="text-4xl font-serif font-bold mb-lg text-captain-text">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-md mb-lg">
              <span className="text-2xl font-bold text-captain-text">⭐ {product.rating.score}</span>
              <span className="text-sm text-captain-neutral">({product.rating.count} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-lg pb-lg border-b border-captain-light">
              <span className="text-4xl font-bold text-captain-text">฿{product.price}</span>
              <p className="text-sm text-captain-neutral mt-sm">Free shipping on orders over ฿500</p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-md mb-2xl">
              <button className="w-full px-lg py-md bg-captain-yellow text-captain-text rounded-sm font-semibold hover:bg-captain-blue hover:text-white transition-all text-lg">
                Add to Cart
              </button>
              <button className="w-full px-lg py-md bg-white border-2 border-captain-blue text-captain-blue rounded-sm font-semibold hover:bg-captain-blue hover:text-white transition-all">
                ♡ Add to Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Quick Benefits */}
        <div className="bg-captain-light rounded-sm p-xl mb-2xl">
          <h3 className="text-xl font-serif font-bold mb-lg text-captain-text">Quick Benefits</h3>
          <ul className="space-y-md">
            {product.benefits.map((benefit, i) => (
              <li key={i} className="flex gap-md items-start">
                <span className="text-captain-blue font-bold text-lg">✓</span>
                <span className="text-captain-neutral">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Full Description */}
        <div className="mb-2xl">
          <h2 className="text-3xl font-serif font-bold mb-lg text-captain-blue">About This Product</h2>
          <p className="text-lg text-captain-neutral leading-relaxed whitespace-pre-line max-prose">
            {product.description}
          </p>
        </div>

        {/* Features */}
        <div className="mb-2xl">
          <h2 className="text-3xl font-serif font-bold mb-lg text-captain-blue">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {product.features.map((feature, i) => (
              <div key={i} className="bg-captain-light rounded-sm p-lg">
                <div className="text-4xl mb-md">{feature.icon}</div>
                <h3 className="text-lg font-serif font-bold mb-md text-captain-text">{feature.title}</h3>
                <p className="text-captain-neutral">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-captain-light rounded-sm p-xl mb-2xl">
          <h2 className="text-3xl font-serif font-bold mb-lg text-captain-blue">How to Use</h2>
          <ol className="space-y-md">
            {product.usage.map((step, i) => (
              <li key={i} className="flex gap-md items-start">
                <span className="text-lg font-bold text-captain-blue min-w-[2rem]">{i + 1}.</span>
                <span className="text-captain-neutral pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Specifications */}
        <div className="mb-2xl">
          <h2 className="text-3xl font-serif font-bold mb-lg text-captain-blue">Specifications</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <tbody>
                {Object.entries(product.specs).map(([key, value]) => (
                  <tr key={key} className="border-b border-captain-light hover:bg-captain-light/50 transition-colors">
                    <td className="py-md px-lg font-semibold text-captain-text w-1/3">{key}</td>
                    <td className="py-md px-lg text-captain-neutral">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Safety & Warnings */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-captain-warning rounded-sm p-xl mb-2xl">
          <h2 className="text-3xl font-serif font-bold mb-lg text-captain-warning">Safety & Warnings</h2>
          <ul className="space-y-md">
            {product.warnings.map((warning, i) => (
              <li key={i} className="flex gap-md items-start">
                <span className="text-captain-warning font-bold text-lg">⚠️</span>
                <span className="text-captain-neutral">{warning}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div className="mb-2xl">
          <h2 className="text-3xl font-serif font-bold mb-lg text-captain-blue">Frequently Asked Questions</h2>
          <div className="space-y-md">
            {product.faqs.map((faq, i) => (
              <details key={i} className="bg-captain-light rounded-sm p-lg cursor-pointer group">
                <summary className="font-semibold text-captain-text flex items-center justify-between">
                  {faq.q}
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-captain-neutral mt-md">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-2xl py-2xl border-t border-captain-light">
          <h2 className="text-3xl font-serif font-bold mb-lg text-captain-blue">Related Products</h2>
          <p className="text-captain-neutral">Similar products coming soon.</p>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description.split('\n')[0],
            brand: { '@type': 'Brand', name: 'Captain Maid' },
            price: product.price,
            priceCurrency: 'THB',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: product.rating.score,
              reviewCount: product.rating.count,
            },
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'THB',
              availability: 'https://schema.org/InStock',
            },
          }),
        }}
      />
    </div>
  )
}
