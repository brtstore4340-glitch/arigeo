import * as React from 'react'
import { cn } from '@/lib/utils'

const FALLBACK_IMAGE_URL =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-label="Image placeholder">
      <rect width="1200" height="800" fill="#f3f4f6"/>
      <rect x="104" y="96" width="992" height="608" rx="36" fill="#e5e7eb"/>
      <path d="M190 572l164-174 132 132 112-118 140 140 216-220 156 160v140H190z" fill="#d1d5db"/>
      <circle cx="372" cy="268" r="56" fill="#cbd5e1"/>
    </svg>
  `)

const Image = React.forwardRef(
  (
    {
      src,
      alt = '',
      fittingType = 'fill',
      className,
      style,
      loading = 'lazy',
      decoding = 'async',
      ...props
    },
    ref
  ) => {
    const [currentSrc, setCurrentSrc] = React.useState(src || FALLBACK_IMAGE_URL)

    React.useEffect(() => {
      setCurrentSrc(src || FALLBACK_IMAGE_URL)
    }, [src])

    return (
      <img
        ref={ref}
        src={currentSrc}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onError={() => setCurrentSrc(FALLBACK_IMAGE_URL)}
        className={cn(
          'block h-auto w-full',
          fittingType === 'fit' ? 'object-contain' : 'object-cover',
          className
        )}
        style={style}
        {...props}
      />
    )
  }
)
Image.displayName = 'Image'

export { Image }
