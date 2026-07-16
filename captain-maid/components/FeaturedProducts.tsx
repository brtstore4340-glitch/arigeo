import { ProductCard } from './ProductCard'

const featuredProducts = [
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

export function FeaturedProducts() {
  return (
    <section id="products" className="section-spacing">
      <div className="container-safe">
        <h2 className="text-4xl font-serif font-bold mb-2xl text-captain-blue">Our Best Sellers</h2>

        <div className="space-y-2xl">
          {/* Product 1: Image Left, Text Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
            <div>
              <ProductCard {...featuredProducts[0]} />
            </div>
            <div className="space-y-md">
              <div className="prose prose-text">
                <h3 className="text-2xl font-serif font-bold text-captain-text mb-md">
                  Why Choose Floor Cleaner?
                </h3>
                <ul className="space-y-sm text-captain-neutral">
                  <li className="flex gap-sm">
                    <span className="text-captain-blue font-bold">✓</span>
                    <span>Works on all floor types (tile, marble, wood, concrete)</span>
                  </li>
                  <li className="flex gap-sm">
                    <span className="text-captain-blue font-bold">✓</span>
                    <span>Fresh lemongrass essential oil scent</span>
                  </li>
                  <li className="flex gap-sm">
                    <span className="text-captain-blue font-bold">✓</span>
                    <span>Non-toxic, safe for children and pets</span>
                  </li>
                  <li className="flex gap-sm">
                    <span className="text-captain-blue font-bold">✓</span>
                    <span>Biodegradable formula, eco-conscious packaging</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Product 2: Image Right, Text Left */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center md:auto-cols-fr md:grid-flow-dense">
            <div className="space-y-md md:order-2">
              <div className="prose prose-text">
                <h3 className="text-2xl font-serif font-bold text-captain-text mb-md">
                  Crystal Clear Brilliance
                </h3>
                <ul className="space-y-sm text-captain-neutral">
                  <li className="flex gap-sm">
                    <span className="text-captain-blue font-bold">✓</span>
                    <span>Streak-free shine guaranteed</span>
                  </li>
                  <li className="flex gap-sm">
                    <span className="text-captain-blue font-bold">✓</span>
                    <span>Works on glass, mirrors, stainless steel</span>
                  </li>
                  <li className="flex gap-sm">
                    <span className="text-captain-blue font-bold">✓</span>
                    <span>Subtle lavender scent (not overpowering)</span>
                  </li>
                  <li className="flex gap-sm">
                    <span className="text-captain-blue font-bold">✓</span>
                    <span>Dries fast, no smudges or fingerprints</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:order-1">
              <ProductCard {...featuredProducts[1]} />
            </div>
          </div>

          {/* Product 3: Image Left, Text Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
            <div>
              <ProductCard {...featuredProducts[2]} />
            </div>
            <div className="space-y-md">
              <div className="prose prose-text">
                <h3 className="text-2xl font-serif font-bold text-captain-text mb-md">
                  Freshness Without Damage
                </h3>
                <ul className="space-y-sm text-captain-neutral">
                  <li className="flex gap-sm">
                    <span className="text-captain-blue font-bold">✓</span>
                    <span>Removes stubborn odors from fabric</span>
                  </li>
                  <li className="flex gap-sm">
                    <span className="text-captain-blue font-bold">✓</span>
                    <span>Gentle formula won't damage delicate fabrics</span>
                  </li>
                  <li className="flex gap-sm">
                    <span className="text-captain-blue font-bold">✓</span>
                    <span>Works on sofas, carpets, mattresses, curtains</span>
                  </li>
                  <li className="flex gap-sm">
                    <span className="text-captain-blue font-bold">✓</span>
                    <span>Long-lasting freshness (lasts up to 2 weeks)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-2xl">
          <a
            href="/products"
            className="btn-primary inline-flex items-center gap-sm px-lg py-md bg-captain-yellow text-captain-text rounded-sm font-semibold hover:bg-captain-blue hover:text-white"
          >
            View All Products →
          </a>
        </div>
      </div>
    </section>
  )
}
