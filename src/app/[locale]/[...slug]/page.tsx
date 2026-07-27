import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import RenderBlocks from '@/components/blocks/RenderBlocks'
import { getCmsPage, normalizeSlug } from '@/lib/cmsPages'

/**
 * CMS page-builder catch-all route
 * ---------------------------------------------------------------------------
 * Any URL that is not already handled by a hand-written route falls through to
 * here and is resolved against the Payload "pages" collection for this site.
 *
 * Existing static routes (/products, /brands, /newsroom, ...) always win, so
 * this file is purely additive: editors can publish new pages in the CMS and
 * they appear on the site without a code change.
 */

type RouteParams = {
  locale: string
  slug?: string[]
}

type PageProps = {
  params: Promise<RouteParams> | RouteParams
}

/** CMS-authored pages are revalidated every minute. */
export const revalidate = 60

async function resolveParams(params: PageProps['params']): Promise<RouteParams> {
  return await params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await resolveParams(params)
  const page = await getCmsPage(slug, undefined, locale)
  if (!page) return {}

  const title = page.seo?.title || page.title || undefined
  const description = page.seo?.description || undefined
  const path = normalizeSlug(slug)
  const canonical = '/' + locale + (path === 'home' ? '' : '/' + path)

  return {
    title: title || undefined,
    description: description || undefined,
    alternates: { canonical },
    openGraph: title ? { title, description: description || undefined, url: canonical } : undefined,
  }
}

export default async function CmsBuilderPage({ params }: PageProps) {
  const { locale, slug } = await resolveParams(params)
  const page = await getCmsPage(slug, undefined, locale)

  if (!page || !Array.isArray(page.layout) || page.layout.length === 0) {
    notFound()
  }

  return (
    <main className="min-w-0">
      <RenderBlocks blocks={page.layout} locale={locale} />
    </main>
  )
}
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import RenderBlocks from '@/components/blocks/RenderBlocks'
import { getCmsPage, normalizeSlug } from '@/lib/cmsPages'

/**
 * CMS page-builder catch-all route
 * ---------------------------------------------------------------------------
 * Any URL that is not already handled by a hand-written route falls through to
 * here and is resolved against the Payload "pages" collection for this site.
 *
 * Existing static routes (/products, /brands, /newsroom, ...) always win, so
 * this file is purely additive: editors can publish new pages in the CMS and
 * they appear on the site without a code change.
 */

type RouteParams = {
  locale: string
  slug?: string[]
}

type PageProps = {
  params: Promise<RouteParams> | RouteParams
}

/** CMS-authored pages are revalidated every minute. */
export const revalidate = 60

async function resolveParams(params: PageProps['params']): Promise<RouteParams> {
  return await params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await resolveParams(params)
  const page = await getCmsPage(slug)
  if (!page) return {}

  const title = page.seo?.title || page.title || undefined
  const description = page.seo?.description || undefined
  const path = normalizeSlug(slug)
  const canonical = '/' + locale + (path === 'home' ? '' : '/' + path)

  return {
    title: title || undefined,
    description: description || undefined,
    alternates: { canonical },
    openGraph: title ? { title, description: description || undefined, url: canonical } : undefined,
  }
}

export default async function CmsBuilderPage({ params }: PageProps) {
  const { locale, slug } = await resolveParams(params)
  const page = await getCmsPage(slug)

  if (!page || !Array.isArray(page.layout) || page.layout.length === 0) {
    notFound()
  }

  return (
    <main className="min-w-0">
      <RenderBlocks blocks={page.layout} locale={locale} />
    </main>
  )
}
