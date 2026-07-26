import type { ReactNode } from 'react'

import { AnimateNoScriptFallback } from '@/components/Animate'
import { BlockList } from '@/components/blocks/RenderBlocks'
import { getCmsSection, type CmsSite } from '@/lib/cmsPages'

/**
 * <CmsSection />
 * ---------------------------------------------------------------------------
 * Renders a reusable CMS "section" (promo band, footer CTA, notice strip...)
 * inside a hand-written route, so editors can change it without a deploy.
 *
 * Full CMS pages do not need this component - they are served by the catch-all
 * route at src/app/[locale]/[...slug]/page.tsx. Use CmsSection only to inject
 * editor-controlled blocks into a page that already exists in code.
 *
 * Fails soft by design: if the section is missing, still a draft, empty, or the
 * CMS is unreachable, the optional fallback is rendered instead (nothing by
 * default) and the surrounding page keeps working.
 *
 * See docs/CMS-PAGE-BUILDER.md for the CMS-side field configuration.
 */

export type CmsSectionProps = {
  /** The "key" field of the Payload sections document, e.g. home-promo. */
  sectionKey: string
  /** Active next-intl locale, used to keep CMS links inside the locale. */
  locale?: string
  /** Defaults to NEXT_PUBLIC_CMS_SITE (arigeo). */
  site?: CmsSite
  className?: string
  /** Rendered when the section has no publishable blocks. */
  fallback?: ReactNode
}

export default async function CmsSection({
  sectionKey,
  locale,
  site,
  className,
  fallback = null,
}: CmsSectionProps) {
  if (!sectionKey) return <>{fallback}</>

  const section = await getCmsSection(sectionKey, site)
  const layout = section?.layout
  const blocks = Array.isArray(layout) ? layout : []

  if (!blocks.length) return <>{fallback}</>

  return (
    <>
      <AnimateNoScriptFallback />
      <BlockList blocks={blocks} locale={locale} className={className} />
    </>
  )
}
