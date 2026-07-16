/**
 * Image optimization utilities for Core Web Vitals
 * Handles responsive images, WebP fallbacks, and lazy loading
 */

export interface ImageConfig {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
  quality?: number
}

/**
 * Generate srcset for responsive images
 * Provides multiple density targets for different screen sizes
 */
export function generateSrcSet(basePath: string, format: 'webp' | 'jpg' = 'webp'): string {
  const ext = format === 'webp' ? '.webp' : '.jpg'
  const sizes = [320, 640, 960, 1280, 1920]

  return sizes
    .map((size) => {
      const fileName = basePath.replace(/\.\w+$/, `@${size}w${ext}`)
      return `${fileName} ${size}w`
    })
    .join(', ')
}

/**
 * Get responsive image sizes attribute for different breakpoints
 */
export function getResponsiveSizes(): string {
  return `
    (max-width: 640px) 320px,
    (max-width: 1024px) 640px,
    (max-width: 1280px) 960px,
    1280px
  `.trim()
}

/**
 * Calculate image dimensions maintaining aspect ratio
 */
export function calculateImageDimensions(
  width: number,
  height: number,
  maxWidth: number
): { width: number; height: number } {
  const aspectRatio = width / height
  const calculatedWidth = Math.min(width, maxWidth)
  const calculatedHeight = Math.round(calculatedWidth / aspectRatio)

  return {
    width: calculatedWidth,
    height: calculatedHeight,
  }
}

/**
 * Recommended image sizes for different use cases
 */
export const imageSizes = {
  hero: {
    width: 1200,
    height: 630,
    description: 'Full-width hero section',
  },
  productDetail: {
    width: 600,
    height: 400,
    description: 'Product detail page image',
  },
  productCard: {
    width: 400,
    height: 300,
    description: 'Product grid card',
  },
  blogFeature: {
    width: 800,
    height: 400,
    description: 'Blog featured image',
  },
  thumbnail: {
    width: 200,
    height: 200,
    description: 'Small thumbnail',
  },
}

/**
 * Image quality recommendations for different formats
 */
export const qualitySettings = {
  webp: {
    high: 90,
    medium: 80,
    low: 70,
  },
  jpg: {
    high: 85,
    medium: 75,
    low: 65,
  },
  avif: {
    high: 85,
    medium: 75,
    low: 65,
  },
}

/**
 * Get image srcset string for Next.js Image component
 * Format: "path 1x, path 2x, path 3x"
 */
export function getDensitySrcSet(basePath: string): string {
  const formats = ['1x', '2x', '3x']
  return formats
    .map((density) => {
      const fileName = basePath.replace(/\.\w+$/, `@${density}${basePath.match(/\.\w+$/)?.[0] || '.jpg'}`)
      return `${fileName} ${density}`
    })
    .join(', ')
}

/**
 * Lazy loading configuration
 * Helps with CLS and performance
 */
export const lazyLoadConfig = {
  // Only lazy load images below the fold
  priority: false,
  // Use blur placeholder to improve perceived performance
  placeholder: 'blur' as const,
  // Preload critical images above the fold
  priority_images: ['hero', 'featured-product'],
}

/**
 * Image optimization checklist for deployment
 */
export const optimizationChecklist = [
  '✓ Convert all images to WebP format',
  '✓ Provide PNG fallback for unsupported browsers',
  '✓ Generate responsive sizes (1x, 2x, 3x density)',
  '✓ Optimize quality settings (80-90 for WebP, 75-85 for JPG)',
  '✓ Use Next.js Image component for automatic optimization',
  '✓ Lazy load below-fold images',
  '✓ Priority load above-fold images',
  '✓ Add blur placeholders for perceived performance',
  '✓ Test with Lighthouse (target: 90+)',
  '✓ Monitor Core Web Vitals (LCP, CLS, FID)',
]

/**
 * Image migration guide for when you add real images
 */
export const imageMigrationGuide = `
# Image Migration Guide

## Step 1: Prepare Images
- Product images: 600x400px (3:2 ratio) + 500x400px for cards
- Blog images: 800x400px (2:1 ratio)
- Hero images: 1200x630px
- All formats: WebP (primary) + PNG/JPG (fallback)

## Step 2: Optimize
Use ImageOptim, Squoosh, or similar:
- WebP: quality 80-90
- PNG: quality 75-85
- Target file size: 30-50KB per image

## Step 3: Generate Responsive Sizes
Create 1x, 2x, 3x versions:
- Use the generateSrcSet() function
- Place in public/products/ or public/blog/

## Step 4: Update Product/Blog Data
Add image field to lib/products.ts and lib/blog.ts:
\`\`\`
image: '/products/product-name.webp',
\`\`\`

## Step 5: Test Performance
- Run Lighthouse (target 90+)
- Check Core Web Vitals
- Test on slow 3G connection
- Monitor LCP (< 2.5s), CLS (< 0.1), FID (< 100ms)
`
