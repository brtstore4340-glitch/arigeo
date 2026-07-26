/**
 * ARIGEO CMS adapter
 * ------------------
 * Thin, typed client for the Payload CMS REST API that powers arigeo.vercel.app.
 *
 * The frontend previously rendered from static files in \`src/data/*\`. This module
 * lets pages fetch live content from the CMS instead, while mapping every CMS
 * document back to the existing \`Product\` / brand shapes so callers don't change.
 *
 * Required env var (see .env.example and WIRING.md):
 *   NEXT_PUBLIC_CMS_URL = https://cms-arigeo.vercel.app
 *
 * The CMS must also allow this site's origin via PAYLOAD_CORS_ORIGIN /
 * PAYLOAD_CSRF_ORIGIN (set on the CMS Vercel project). See WIRING.md.
 */

import type { Product, ProductBrand, ProductType } from '@/types/product'

const CMS_URL = (
  process.env.NEXT_PUBLIC_CMS_URL ?? 'https://cms-arigeo.vercel.app'
).replace(/\/$/, '')

/** Revalidate CMS data every 5 minutes by default (ISR-friendly). */
const DEFAULT_REVALIDATE = 300

type PayloadList<T> = {
  docs: T[]
  totalDocs: number
  page: number
  totalPages: number
  hasNextPage: boolean
}

async function cmsFetch<T>(
  path: string,
  { revalidate = DEFAULT_REVALIDATE }: { revalidate?: number } = {},
): Promise<T | null> {
  const url = `${CMS_URL}/api/${path.replace(/^//, '')}`
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate },
    })
    if (!res.ok) {
      console.error(`[cms] ${res.status} ${res.statusText} for ${url}`)
      return null
    }
    return (await res.json()) as T
  } catch (err) {
    console.error(`[cms] request failed for ${url}`, err)
    return null
  }
}

/* ---------------------------------------------------------------- mappers -- */

const BRAND_SLUGS = ['captain-maid', 'genuleaf', 'ceratory'] as const

function toBrand(slug: unknown): ProductBrand {
  return (BRAND_SLUGS as readonly string[]).includes(slug as string)
    ? (slug as ProductBrand)
    : 'captain-maid'
}

function toProductType(value: unknown): ProductType {
  const allowed: ProductType[] = ['liquid', 'cream', 'gel', 'powder', 'spray', 'solid']
  return allowed.includes(value as ProductType) ? (value as ProductType) : 'liquid'
}

/** Resolve a CMS media/relation object (or id) to an absolute image URL. */
function toImageUrl(media: unknown): string {
  if (!media || typeof media !== 'object') return ''
  const m = media as { url?: string }
  if (!m.url) return ''
  return m.url.startsWith('http') ? m.url : `${CMS_URL}${m.url}`
}

function relSlug(rel: unknown): string {
  if (rel && typeof rel === 'object' && 'slug' in rel) {
    return String((rel as { slug?: string }).slug ?? '')
  }
  return ''
}

/** Map a raw Payload `products` doc to the frontend `Product` interface. */
export function mapCmsProduct(doc: Record<string, any>): Product {
  const images: any[] = Array.isArray(doc.images) ? doc.images : []
  const gallery = images.map((i) => toImageUrl(i?.image ?? i)).filter(Boolean)

  return {
    slug: String(doc.slug ?? ''),
    nameEn: String(doc.name ?? ''),
    nameTh: String(doc.name ?? ''),
    descriptionEn: String(doc.intro ?? ''),
    descriptionTh: String(doc.intro ?? ''),
    brand: toBrand(relSlug(doc.brand)),
    category: relSlug(doc.category),
    concern: 'household',
    type: toProductType(doc.productType),
    size: '',
    benefit: Array.isArray(doc.keyBenefits) && doc.keyBenefits[0]
      ? String(doc.keyBenefits[0]?.benefit ?? doc.keyBenefits[0])
      : '',
    imageUrl: gallery[0] ?? '',
    galleryUrls: gallery,
    usageInstructions: String(doc.usage ?? ''),
    ingredients: '',
    safetyInfo: String(doc.safetyRemark ?? ''),
    qualityClaims: '',
    collections: [],
    launchDate: String(doc.createdAt ?? ''),
    isFeatured: false,
  }
}

/* --------------------------------------------------------------- queries --- */

/** Fetch all published products from the CMS, mapped to `Product`. */
export async function getProducts(): Promise<Product[]> {
  const data = await cmsFetch<PayloadList<Record<string, any>>>(
    'products?limit=100&depth=1&where[_status][equals]=published',
  )
  if (!data?.docs) return []
  return data.docs.map(mapCmsProduct)
}

/** Fetch a single product by slug, or null if not found. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const data = await cmsFetch<PayloadList<Record<string, any>>>(
    `products?limit=1&depth=1&where[slug][equals]=${encodeURIComponent(slug)}`,
  )
  const doc = data?.docs?.[0]
  return doc ? mapCmsProduct(doc) : null
}

export type CmsBrand = {
  slug: string
  name: string
  segment: string
  tagline: string
  logoUrl: string
}

/** Fetch all brands from the CMS. */
export async function getBrands(): Promise<CmsBrand[]> {
  const data = await cmsFetch<PayloadList<Record<string, any>>>('brands?limit=50&depth=1')
  if (!data?.docs) return []
  return data.docs.map((doc) => ({
    slug: String(doc.slug ?? ''),
    name: String(doc.name ?? ''),
    segment: String(doc.segment ?? ''),
    tagline: String(doc.tagline ?? ''),
    logoUrl: toImageUrl(doc.visualIdentity?.logo),
  }))
}
