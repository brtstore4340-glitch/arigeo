import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard'

export const metadata: Metadata = {
  title: 'Our Products | Captain Maid',
  description:
    'Browse our complete range of household cleaning products. Floor cleaners, glass cleaners, and specialty care solutions for Thai families.',
  keywords: 'cleaning products, shop, buy, floor cleaner, glass cleaner, fabric freshener',
  openGraph: {
    title: 'Our Products | Captain Maid',
    description: 'Browse our complete range of household cleaning products',
    type: 'website',
  },
}

const allProducts = [
  {
    id: 'floor-cleaner-001',
    slug: 'all-surface-floor-cleaner',
    name: 'All-Surface Floor Cleaner',
    category: 'Floor Care',
    price: 199,
    tagline: 'Cleans tile, marble, and wood floors in one go. Fresh lemongrass scent. Safe for kids and pets.',
    emoji: '🧹',
  },
  {
    id: 'glass-cleaner-001',
    slug: 'glass-surface-cleaner',
    name: 'Powerful Glass & Surface Cleaner',
    category: 'Kitchen & Bath',
    price: 179,
    tagline: 'Streak-free shine on windows, mirrors, and countertops. Leaves a subtle lavender scent behind.',
    emoji: '✨',
  },
  {
    id: 'fabric-freshener-001',
    slug: 'fabric-upholstery-freshener',
    name: 'Gentle Fabric & Upholstery Freshener',
    category: 'Specialty Care',
    price: 249,
    tagline: 'Removes odors from sofas, carpets, and mattresses. Gentle formula safe for all fabrics.',
    emoji: '🧤',
  },
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-captain-cream dark:bg-captain-cream-dark pt-24">
      <div className="container-safe">
        {/* Page Header */}
        <div className="mb-2xl py-xl">
          <h1 className="text-5xl font-serif font-bold mb-md text-captain-blue">Our Products</h1>
          <p className="text-xl text-captain-neutral max-prose">
            Discover our complete range of cleaning solutions designed for Thai families. Each product is
            carefully formulated to be powerful yet gentle, effective yet responsible.
          </p>
        </div>

        {/* Filter & Sort (Placeholder for future expansion) */}
        <div className="mb-2xl pb-xl border-b border-captain-light flex flex-col md:flex-row justify-between items-start md:items-center gap-lg">
          <div className="flex gap-md">
            <button className="px-md py-sm bg-captain-blue text-white rounded-sm font-medium hover:bg-captain-blue-dark transition-colors">
              All Products
            </button>
            <button className="px-md py-sm bg-white text-captain-text border border-captain-light rounded-sm font-medium hover:bg-captain-light transition-colors">
              Floor Care
            </button>
            <button className="px-md py-sm bg-white text-captain-text border border-captain-light rounded-sm font-medium hover:bg-captain-light transition-colors">
              Kitchen & Bath
            </button>
            <button className="px-md py-sm bg-white text-captain-text border border-captain-light rounded-sm font-medium hover:bg-captain-light transition-colors">
              Specialty
            </button>
          </div>
          <div className="text-sm text-captain-neutral">
            Showing {allProducts.length} products
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2xl mb-2xl">
          {allProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Empty State Message */}
        <div className="text-center py-2xl">
          <p className="text-captain-neutral mb-lg">
            More products coming soon. Subscribe to our newsletter for updates.
          </p>
          <button className="px-lg py-md bg-captain-yellow text-captain-text rounded-sm font-semibold hover:bg-captain-blue hover:text-white transition-all">
            Subscribe to Newsletter
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
                name: 'Products',
                item: 'https://captain-maid.vercel.app/products',
              },
            ],
          }),
        }}
      />
    </div>
  )
}
