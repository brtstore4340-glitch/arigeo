import Link from 'next/link'

interface TipCardProps {
  slug: string
  emoji: string
  category: string
  title: string
  excerpt: string
  readTime: string
}

export function TipCard({ slug, emoji, category, title, excerpt, readTime }: TipCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col h-full bg-captain-light rounded-sm overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border border-captain-light hover:border-captain-blue"
    >
      {/* Image Background */}
      <div className="h-48 bg-gradient-to-br from-captain-blue to-captain-yellow flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">
        {emoji}
      </div>

      {/* Content */}
      <div className="p-lg flex flex-col flex-grow">
        {/* Category Label */}
        <span className="text-xs font-semibold uppercase tracking-wider text-captain-blue mb-sm inline-block">
          {category}
        </span>

        {/* Title */}
        <h3 className="text-lg font-serif font-bold mb-md text-captain-text group-hover:text-captain-blue transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-captain-neutral leading-relaxed mb-md flex-grow line-clamp-2">
          {excerpt}
        </p>

        {/* Read Time */}
        <div className="text-xs font-mono text-captain-neutral border-t border-captain-light pt-md">
          {readTime}
        </div>
      </div>
    </Link>
  )
}
