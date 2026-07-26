'use client'

/**
 * <Animate />
 * ---------------------------------------------------------------------------
 * Scroll-triggered reveal wrapper used by the CMS block renderer.
 *
 * Editors pick the effect inside Payload (animation.type / duration / delay /
 * stagger); this component turns that choice into a GPU-friendly CSS
 * transition. No animation library is required.
 *
 * Accessibility: respects prefers-reduced-motion and degrades to "always
 * visible" when IntersectionObserver is unavailable.
 */

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ElementType, ReactNode } from 'react'
import { normalizeAnimation, type BlockAnimation } from '@/lib/blockStyles'

const HIDDEN: Record<string, CSSProperties> = {
  none: {},
  fade: { opacity: 0 },
  'fade-up': { opacity: 0, transform: 'translate3d(0, 28px, 0)' },
  'fade-down': { opacity: 0, transform: 'translate3d(0, -28px, 0)' },
  'fade-left': { opacity: 0, transform: 'translate3d(-32px, 0, 0)' },
  'fade-right': { opacity: 0, transform: 'translate3d(32px, 0, 0)' },
  'zoom-in': { opacity: 0, transform: 'scale(0.92)' },
  'zoom-out': { opacity: 0, transform: 'scale(1.08)' },
  'blur-in': { opacity: 0, filter: 'blur(10px)' },
  rise: { opacity: 0, transform: 'translate3d(0, 56px, 0) scale(0.98)' },
}

const SHOWN: CSSProperties = { opacity: 1, transform: 'none', filter: 'none' }

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export type AnimateProps = {
  children: ReactNode
  /** Animation group coming straight from the CMS block. */
  animation?: BlockAnimation | null
  /** Position in a list - multiplied by animation.stagger. */
  index?: number
  as?: ElementType
  className?: string
  style?: CSSProperties
  threshold?: number
}

export default function Animate({
  children,
  animation,
  index = 0,
  as = 'div',
  className,
  style,
  threshold = 0.15,
}: AnimateProps) {
  const { type, duration, delay, stagger, once } = normalizeAnimation(animation)
  const enabled = type !== 'none'

  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(!enabled)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) {
      setReduced(true)
      setVisible(true)
      return
    }

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.disconnect()
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled, once, threshold])

  const Tag = as as ElementType
  const totalDelay = delay + stagger * index

  const motion: CSSProperties =
    !enabled || reduced
      ? {}
      : {
          transitionProperty: 'opacity, transform, filter',
          transitionDuration: duration + 'ms',
          transitionTimingFunction: EASE,
          transitionDelay: totalDelay + 'ms',
          willChange: 'opacity, transform',
          ...(visible ? SHOWN : HIDDEN[type] || {}),
        }

  return (
    <Tag
      ref={ref as never}
      data-animate={type}
      data-visible={visible ? 'true' : 'false'}
      className={className}
      style={{ ...style, ...motion }}
    >
      {children}
    </Tag>
  )
}

/**
 * Drop this once per page (the block renderer already does) so that content
 * stays readable if JavaScript never runs.
 */
export function AnimateNoScriptFallback() {
  return (
    <noscript>
      <style
        dangerouslySetInnerHTML={{
          __html:
            '[data-animate]{opacity:1 !important;transform:none !important;filter:none !important}',
        }}
      />
    </noscript>
  )
}
