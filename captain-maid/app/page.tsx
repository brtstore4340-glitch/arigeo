import { HeroSection } from '@/components/HeroSection'
import { FeaturedProducts } from '@/components/FeaturedProducts'
import { CleaningTipsGrid } from '@/components/CleaningTipsGrid'
import { BrandStory } from '@/components/BrandStory'

export const metadata = {
  title: 'Captain Maid | Clean Homes, Happy Lives',
  description:
    'Trusted cleaning solutions for Thai families. Safe, effective, and kind to your home. Shop our bestselling floor, kitchen, and specialty cleaners.',
  keywords:
    'cleaning products, household cleaning, Thai cleaning, eco-friendly, floor cleaner, glass cleaner',
  openGraph: {
    title: 'Captain Maid | Clean Homes, Happy Lives',
    description: 'Trusted cleaning solutions for Thai families',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Captain Maid – Clean Homes, Happy Lives',
      },
    ],
  },
}

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Cleaning Tips */}
      <CleaningTipsGrid />

      {/* Brand Story */}
      <BrandStory />

      {/* Structured Data - BreadcrumbList */}
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
            ],
          }),
        }}
      />
    </>
  )
}
