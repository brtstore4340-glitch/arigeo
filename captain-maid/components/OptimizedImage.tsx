/**
 * OptimizedImage component
 * Handles responsive, lazy-loaded images with WebP support
 * Prevents CLS with aspect ratio, preloads above-fold images
 */

import Image from 'next/image'
import { getResponsiveSizes } from '@/lib/image-utils'

export interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  aspectRatio?: number
  priority?: boolean
  className?: string
  lazy?: boolean
}

/**
 * High-performance image component
 * Features:
 * - WebP with PNG fallback
 * - Automatic responsive sizing
 * - Lazy loading (disabled for above-fold)
 * - No CLS (includes aspect ratio)
 * - Blur placeholder for perceived performance
 */
export default function OptimizedImage({
  src,
  alt,
  width = 600,
  height = 400,
  aspectRatio,
  priority = false,
  className = '',
  lazy = true,
}: OptimizedImageProps) {
  // Calculate aspect ratio if not provided
  const ratio = aspectRatio || (width && height ? width / height : undefined)
  const shouldLazyLoad = !priority && lazy

  return (
    <div
      className={`relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 ${className}`}
      style={
        ratio
          ? {
              aspectRatio: ratio.toString(),
              width: '100%',
              height: 'auto',
            }
          : undefined
      }
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={shouldLazyLoad ? 'lazy' : 'eager'}
        placeholder="blur"
        blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f5f2ed' width='400' height='300'/%3E%3C/svg%3E"
        sizes={getResponsiveSizes()}
        className="h-full w-full object-cover"
        quality={85}
      />
    </div>
  )
}

/**
 * Usage Examples
 *
 * // Above-fold hero image (preloaded)
 * <OptimizedImage
 *   src="/images/hero.webp"
 *   alt="Hero section"
 *   width={1200}
 *   height={630}
 *   priority={true}
 *   className="w-full"
 * />
 *
 * // Product image (lazy loaded)
 * <OptimizedImage
 *   src="/products/floor-cleaner.webp"
 *   alt="Floor cleaner product"
 *   width={600}
 *   height={400}
 *   priority={false}
 * />
 *
 * // Blog featured image with custom aspect ratio
 * <OptimizedImage
 *   src="/blog/featured.webp"
 *   alt="Blog article"
 *   width={800}
 *   height={400}
 *   aspectRatio={2}
 * />
 */
