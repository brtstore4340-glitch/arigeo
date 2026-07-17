'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HeroSlide {
  id: number
  headline: string
  subheading: string
  ctaText: string
  ctaHref: string
  bgColor?: string
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    headline: 'Clean Homes, Happy Lives',
    subheading: 'Trusted cleaning solutions for Thai families. Safe, effective, and kind to your home.',
    ctaText: 'Discover Our Products',
    ctaHref: '/products',
  },
  {
    id: 2,
    headline: 'Powerful Yet Gentle',
    subheading: 'Formulated for Thai climate. One product handles all your cleaning needs.',
    ctaText: 'Shop Now',
    ctaHref: '/products',
  },
  {
    id: 3,
    headline: 'Safe for Kids & Pets',
    subheading: 'Non-toxic, hypoallergenic, and family-approved cleaning that actually works.',
    ctaText: 'Learn More',
    ctaHref: '/about',
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setAutoplay(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setAutoplay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setAutoplay(false)
  }

  const slide = heroSlides[currentSlide]

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-captain-blue to-captain-blue-dark text-white overflow-hidden pt-16">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='2' fill='white'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 container-safe text-center max-w-2xl px-lg">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-md leading-tight">
          {slide.headline}
        </h1>
        <p className="text-xl md:text-2xl mb-xl text-white/95 leading-relaxed max-prose">
          {slide.subheading}
        </p>
        <Link
          href={slide.ctaHref}
          className="btn-primary inline-flex items-center gap-sm px-lg py-md bg-captain-yellow text-captain-text rounded-sm font-semibold hover:bg-white transition-all duration-200 text-lg"
        >
          {slide.ctaText} →
        </Link>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-lg left-0 right-0 z-20">
        <div className="container-safe">
          {/* Slide Indicators */}
          <div className="flex justify-center gap-md mb-lg">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-captain-yellow w-8'
                    : 'bg-white/40 w-2 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentSlide}
              />
            ))}
          </div>

          {/* Arrow Buttons */}
          <div className="flex justify-center gap-md">
            <button
              onClick={prevSlide}
              className="p-md bg-white/10 hover:bg-white/20 rounded-sm transition-all text-white"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="p-md bg-white/10 hover:bg-white/20 rounded-sm transition-all text-white"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Slide Counter */}
          <div className="text-center mt-md text-white/70 text-sm">
            {currentSlide + 1} / {heroSlides.length}
          </div>
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
            ],
          }),
        }}
      />
    </section>
  )
}
