import Link from 'next/link'

interface ProductCardProps {
  id: string
  slug: string
  name: string
  category: string
  price: number
  tagline: string
  emoji: string
  image?: string
}

export function ProductCard({ slug, name, category, price, tagline, emoji }: ProductCardProps) {
  return (
    <div className="group flex flex-col h-full">
      {/* Product Image/Emoji */}
      <div className="relative bg-gradient-to-br from-captain-light to-captain-light/50 rounded-sm aspect-video flex items-center justify-center overflow-hidden mb-lg hover:shadow-md transition-shadow">
        <span className="text-6xl">{emoji}</span>
      </div>

      {/* Product Label */}
      <span className="text-xs font-semibold uppercase tracking-wider text-captain-blue mb-sm inline-block">
        {category}
      </span>

      {/* Product Name */}
      <h3 className="text-xl font-serif font-bold mb-md text-captain-text group-hover:text-captain-blue transition-colors">
        {name}
      </h3>

      {/* Tagline */}
      <p className="text-sm leading-relaxed text-captain-neutral mb-lg flex-grow">
        {tagline}
      </p>

      {/* Price */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-captain-text">฿{price}</span>
        <Link
          href={`/products/${slug}`}
          className="px-md py-sm bg-captain-yellow text-captain-text rounded-sm font-semibold hover:bg-captain-blue hover:text-white transition-all text-sm"
        >
          Learn More
        </Link>
      </div>
    </div>
  )
}
