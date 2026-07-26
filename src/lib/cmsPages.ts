/**
 * CMS page-builder data access
 * ---------------------------------------------------------------------------
 * Reads the Payload "pages" and "sections" collections - both of which expose
 * a blocks field called "layout" that editors arrange by drag & drop in the
 * Payload admin.
 *
 * Every helper fails soft: on a network error, a 4xx (access control) or a 5xx
 * it logs a warning and returns null / an empty array so the existing
 * statically rendered pages keep working.
 *
 * See docs/CMS-PAGE-BUILDER.md for the CMS-side field configuration.
 */

import type { StyledBlock } from './blockStyles'

export type CmsSite = 'arigeo' | 'captain-maid'

export type CmsSeo = {
  title?: string | null
  description?: string | null
  image?: unknown
}

export type CmsPage = {
  id: string
  title?: string | null
  slug?: string | null
  site?: CmsSite | null
  status?: string | null
  seo?: CmsSeo | null
  layout?: StyledBlock[] | null
  updatedAt?: string | null
}

export type CmsSection = {
  id: string
  key?: string | null
  title?: string | null
  site?: CmsSite | null
  layout?: StyledBlock[] | null
}

type PayloadList<T> = {
  docs?: T[]
  totalDocs?: number
}

const RAW_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://cms-arigeo.vercel.app'

export const CMS_URL = RAW_URL.replace(/\/+$/, '')

export const CMS_SITE: CmsSite =
  process.env.NEXT_PUBLIC_CMS_SITE === 'captain-maid' ? 'captain-maid' : 'arigeo'

const REVALIDATE = Number(process.env.NEXT_PUBLIC_CMS_REVALIDATE || 60)

/** Normalises "", "/", "index" and "home" to the canonical home slug. */
export function normalizeSlug(input?: string | string[] | null): string {
  const raw = Array.isArray(input) ? input.join('/') : input || ''
  const trimmed = raw.replace(/^\/+|\/+$/g, '')
  if (!trimmed || trimmed === 'index' || trimmed === 'home') return 'home'
  return trimmed
}

async function cmsList<T>(
  collection: string,
  params: Record<string, string>,
): Promise<T[]> {
  let url: URL
  try {
    url = new URL(CMS_URL + '/api/' + collection)
  } catch {
    console.warn('[cms] invalid NEXT_PUBLIC_CMS_URL:', RAW_URL)
    return []
  }

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      next: { revalidate: REVALIDATE },
    })

    if (!res.ok) {
      console.warn(
        '[cms] ' + collection + ' responded ' + res.status +
          (res.status === 403
            ? ' - collection is not publicly readable, see docs/CMS-PAGE-BUILDER.md'
            : ''),
      )
      return []
    }

    const json = (await res.json()) as PayloadList<T>
    return Array.isArray(json.docs) ? json.docs : []
  } catch (error) {
    console.warn('[cms] ' + collection + ' request failed:', error)
    return []
  }
}

/** One published page for a site, including its drag-and-drop layout. */
export async function getCmsPage(
  slug?: string | string[] | null,
  site: CmsSite = CMS_SITE,
): Promise<CmsPage | null> {
  const docs = await cmsList<CmsPage>('pages', {
    'where[slug][equals]': normalizeSlug(slug),
    'where[site][equals]': site,
    depth: '2',
    limit: '1',
  })
  return docs[0] || null
}

/** Every page slug for a site - used by generateStaticParams(). */
export async function getCmsPageSlugs(site: CmsSite = CMS_SITE): Promise<string[]> {
  const docs = await cmsList<CmsPage>('pages', {
    'where[site][equals]': site,
    depth: '0',
    limit: '200',
  })
  return docs
    .map((doc) => (doc.slug || '').replace(/^\/+|\/+$/g, ''))
    .filter((slug) => slug.length > 0 && slug !== 'home')
}

/**
 * A reusable section (header strip, promo band, footer CTA...) referenced by
 * key so the same layout can be shared across pages.
 */
export async function getCmsSection(
  key: string,
  site: CmsSite = CMS_SITE,
): Promise<CmsSection | null> {
  const docs = await cmsList<CmsSection>('sections', {
    'where[key][equals]': key,
    'where[site][equals]': site,
    depth: '2',
    limit: '1',
  })
  return docs[0] || null
}

/** Resolves a Payload upload/relationship value down to a usable image URL. */
export function cmsMediaUrl(value: unknown): string | null {
  if (!value) return null
  if (typeof value === 'string') {
    return value.startsWith('http') ? value : CMS_URL + value
  }
  if (typeof value === 'object') {
    const media = value as { url?: string | null; filename?: string | null }
    if (media.url) {
      return media.url.startsWith('http') ? media.url : CMS_URL + media.url
    }
    if (media.filename) return CMS_URL + '/media/' + media.filename
  }
  return null
}

/** Alt text helper for Payload upload fields. */
export function cmsMediaAlt(value: unknown, fallback = ''): string {
  if (value && typeof value === 'object') {
    const media = value as { alt?: string | null }
    if (media.alt) return media.alt
  }
  return fallback
}
