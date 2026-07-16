import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { TipCard } from '@/components/TipCard'

interface BlogPostProps {
  params: { slug: string }
}

// Sample blog posts (in production, fetch from database/CMS)
const blogDatabase: Record<
  string,
  {
    title: string
    excerpt: string
    category: string
    emoji: string
    date: string
    author: string
    readTime: string
    content: string
  }
> = {
  'natural-ingredients-homemade-cleaners': {
    title: '5 Natural Ingredients for Homemade Cleaners',
    excerpt:
      'Lemon, vinegar, baking soda, and more. Learn how to make your own cleaning solutions from pantry staples.',
    category: 'Eco-Friendly',
    emoji: '🪴',
    date: '2024-07-15',
    author: 'Captain Maid',
    readTime: '5 min read',
    content: `# 5 Natural Ingredients for Homemade Cleaners

You probably have everything you need to make effective, natural cleaning solutions right in your kitchen. Here are five simple ingredients that can replace most of your store-bought cleaners.

## 1. Lemon Juice

Lemons are nature's degreaser. The citric acid cuts through grease and grime while leaving a fresh scent.

**Best for**: Kitchen counters, glass, degreasing
**Dilution**: Mix juice of 1 lemon with 2 cups water

## 2. White Vinegar

Vinegar is the cleaning superstar. Its acidity dissolves mineral deposits and kills many bacteria.

**Best for**: Window, mirrors, tile grout, limescale
**Caution**: Don't mix with bleach or baking soda (creates toxic gas)

## 3. Baking Soda

Baking soda is a mild abrasive and deodorizer that's safe for all surfaces.

**Best for**: Scrubbing, odor removal, carpet freshening
**Application**: Sprinkle directly or make paste with water

## 4. Essential Oils

These add fragrance and antibacterial properties to homemade cleaners.

**Best for**: Adding scent, antimicrobial boost
**Recommendation**: Tea tree, lavender, or lemon oils (10-15 drops per liter)

## 5. Castile Soap

This plant-based soap is gentle but effective, cutting through dirt and grease.

**Best for**: General cleaning, floor washing
**Dilution**: 1/4 cup per gallon of water

## Simple Recipes

### All-Purpose Cleaner
- 2 cups water
- 2 tablespoons white vinegar
- 1/2 teaspoon castile soap
- 10 drops lemon essential oil

### Baking Soda Scrub
- 3 tablespoons baking soda
- 1 tablespoon water
- 2 drops tea tree oil

Mix into paste. Use on tough stains.

---

Start with these natural ingredients and discover you don't need harsh chemicals for a clean home.`,
  },
  'keeping-home-safe-kids-pets': {
    title: 'Keeping Your Home Safe for Kids & Pets',
    excerpt:
      'Choose non-toxic cleaners and create a cleaning routine that works with family life, not against it.',
    category: 'Family Care',
    emoji: '👨‍👩‍👧‍👦',
    date: '2024-07-10',
    author: 'Captain Maid',
    readTime: '7 min read',
    content: `# Keeping Your Home Safe for Kids & Pets

A clean home and a safe home don't have to be mutually exclusive. With the right approach, you can maintain a pristine living space while protecting your children and pets.

## Choose Non-Toxic Cleaners

The first step is selecting cleaning products that are genuinely safe for families.

**Look for**:
- Natural ingredients
- No harmful fumes
- Pet-safe formulations
- Certifications (e.g., Ecocert, Green Seal)

## Safe Storage Practices

Even natural cleaners should be stored securely.

**Best practices**:
- Store all cleaners in high cabinets
- Use child-proof locks
- Keep original labels
- Store away from medications
- Never transfer to food containers

## Room-by-Room Safety Tips

### Kitchen
- Clean immediately after meals
- Store cleaning products away from food
- Wipe down surfaces before kids eat

### Bathroom
- Keep cleaning supplies locked away
- Ensure ventilation when cleaning
- Don't leave puddles on floors

### Living Areas
- Vacuum regularly (less dust = safer)
- Air out rooms after cleaning
- Use pet-safe floor cleaners

## Creating a Routine Kids Can Help With

Involve children safely in cleaning:
- Age 3-5: Wipe surfaces with water
- Age 6-8: Help with dusting
- Age 9-11: More complex tasks with supervision

---

Safety and cleanliness work together when you choose the right products.`,
  },
  'monthly-deep-clean-checklist': {
    title: 'Monthly Deep Clean Checklist for Your Home',
    excerpt: 'A room-by-room guide to deep cleaning. Perfect for a weekend project or spring cleaning season.',
    category: 'Deep Clean',
    emoji: '🧼',
    date: '2024-07-05',
    author: 'Captain Maid',
    readTime: '10 min read',
    content: `# Monthly Deep Clean Checklist for Your Home

Deep cleaning beyond your daily routine keeps your home fresh and prevents buildup. Use this checklist once a month to tackle everything thoroughly.

## Bedroom

- [ ] Wash bed sheets and pillowcases
- [ ] Vacuum under bed
- [ ] Wipe down ceiling fans
- [ ] Clean closet shelves
- [ ] Dust ceiling corners and light fixtures
- [ ] Wash windows (inside and sills)
- [ ] Vacuum/wipe baseboards

## Kitchen

- [ ] Clean inside refrigerator
- [ ] Wipe down appliances (inside and out)
- [ ] Degrease stovetop and range hood
- [ ] Wash light fixtures
- [ ] Wipe cabinet interiors
- [ ] Clean oven
- [ ] Mop under furniture

## Bathroom

- [ ] Scrub grout lines
- [ ] Clean inside shower/tub caddy
- [ ] Wash bath mat
- [ ] Wipe down light fixtures and ventilation
- [ ] Clean exhaust fan
- [ ] Organize under-sink cabinet
- [ ] Disinfect trash bin

## Living Areas

- [ ] Dust furniture undersides
- [ ] Wipe ceiling corners (spider webs)
- [ ] Clean air vents
- [ ] Wash/flip cushion covers
- [ ] Baseboards and door frames
- [ ] Windows and sills
- [ ] Deep vacuum carpet

## Entry & Laundry

- [ ] Wash entryway floor thoroughly
- [ ] Clean closet
- [ ] Wipe down washer/dryer exterior
- [ ] Check dryer vent hose
- [ ] Organize laundry shelves

---

Set a recurring monthly reminder. You'll notice the difference in how fresh your home feels.`,
  },
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const post = blogDatabase[params.slug]
  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: `${post.title} | Captain Maid Blog`,
    description: post.excerpt,
    keywords: `${post.category}, cleaning tips, home care, ${post.title}`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

const relatedArticles = [
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

export default function BlogPostPage({ params }: BlogPostProps) {
  const post = blogDatabase[params.slug]

  if (!post) {
    return (
      <div className="min-h-screen bg-captain-cream dark:bg-captain-cream-dark pt-24 flex items-center justify-center">
        <div className="container-safe text-center">
          <h1 className="text-4xl font-serif font-bold mb-md text-captain-text">Post Not Found</h1>
          <p className="text-lg text-captain-neutral mb-xl">Sorry, we couldn't find that article.</p>
          <Link href="/blog" className="btn-primary inline-flex items-center gap-sm px-lg py-md bg-captain-yellow text-captain-text rounded-sm font-semibold hover:bg-captain-blue hover:text-white">
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-captain-cream dark:bg-captain-cream-dark pt-24">
      <div className="container-safe">
        {/* Breadcrumb */}
        <Link href="/blog" className="inline-flex items-center gap-sm text-captain-blue hover:text-captain-blue-dark mb-2xl">
          <ChevronLeft size={20} />
          Back to Blog
        </Link>

        {/* Hero Image */}
        <div className="w-full aspect-video bg-gradient-to-br from-captain-light to-captain-light/50 rounded-sm flex items-center justify-center text-9xl mb-2xl">
          {post.emoji}
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-lg mb-lg text-sm text-captain-neutral">
          <span className="inline-block px-sm py-xs bg-captain-blue text-white rounded text-xs font-semibold uppercase">
            {post.category}
          </span>
          <span>{new Date(post.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>•</span>
          <span>{post.readTime}</span>
          <span>•</span>
          <span>By {post.author}</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-serif font-bold mb-2xl text-captain-text">{post.title}</h1>

        {/* Content */}
        <div className="max-prose prose prose-text mb-2xl">
          <div
            className="text-lg text-captain-neutral leading-relaxed space-y-lg"
            dangerouslySetInnerHTML={{
              __html: post.content
                .split('\n\n')
                .map((paragraph) => {
                  if (paragraph.startsWith('#')) {
                    const level = paragraph.match(/^#+/)[0].length
                    const text = paragraph.replace(/^#+\s/, '')
                    return `<h${level} class="font-serif font-bold text-captain-text mt-xl mb-md ${
                      level === 2 ? 'text-3xl' : level === 3 ? 'text-2xl' : 'text-xl'
                    }">${text}</h${level}>`
                  }
                  if (paragraph.startsWith('- [')) {
                    // Checkbox list
                    const items = paragraph.split('\n').map((item) =>
                      item.replace('- [', '<li><input type="checkbox" disabled>').replace(']', '</li>')
                    )
                    return `<ul class="list-none space-y-sm">${items.join('')}</ul>`
                  }
                  if (paragraph.startsWith('- ')) {
                    // Regular list
                    const items = paragraph
                      .split('\n')
                      .map((item) => `<li>${item.replace('- ', '')}</li>`)
                    return `<ul class="list-disc list-inside space-y-sm">${items.join('')}</ul>`
                  }
                  return `<p>${paragraph}</p>`
                })
                .join(''),
            }}
          />
        </div>

        {/* Newsletter CTA */}
        <div className="bg-captain-light rounded-sm p-xl my-2xl text-center">
          <h3 className="text-2xl font-serif font-bold mb-md text-captain-text">
            Get More Cleaning Tips
          </h3>
          <p className="text-captain-neutral mb-lg">Subscribe to our newsletter for weekly cleaning advice.</p>
          <div className="flex gap-md justify-center">
            <input
              type="email"
              placeholder="Your email"
              className="px-md py-sm border border-captain-neutral rounded-sm flex-1 max-w-xs"
            />
            <button className="px-lg py-sm bg-captain-yellow text-captain-text rounded-sm font-semibold hover:bg-captain-blue hover:text-white transition-all">
              Subscribe
            </button>
          </div>
        </div>

        {/* Related Articles */}
        <div className="my-2xl py-2xl border-t border-captain-light">
          <h2 className="text-3xl font-serif font-bold mb-lg text-captain-blue">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {relatedArticles.map((article) => (
              <TipCard key={article.slug} {...article} />
            ))}
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: { '@type': 'Person', name: post.author },
          }),
        }}
      />
    </div>
  )
}
