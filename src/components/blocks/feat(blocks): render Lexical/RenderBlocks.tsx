/* eslint-disable @next/next/no-img-element */
/**
 * RenderBlocks
 * ---------------------------------------------------------------------------
 * Renders the "layout" blocks field that editors arrange by drag & drop inside
 * the Payload admin. There is one entry in BLOCKS per Payload block slug.
 *
 * Contract with the CMS (see docs/CMS-PAGE-BUILDER.md) - every block MAY carry:
 *   style      -> visual tokens: background, padding, width, radius, columns...
 *   animation  -> scroll reveal: type, duration, delay, stagger
 *
 * Unknown block types are skipped on production and shown as a dashed
 * placeholder in development, so adding a new block in the CMS can never break
 * the live site.
 *
 * Plain <img> is used on purpose: block images come from arbitrary CMS hosts and
 * next/image would throw at runtime for any host missing from remotePatterns.
 */

import Link from 'next/link'
import { Fragment, type ReactNode } from 'react'

import Animate, { AnimateNoScriptFallback } from '@/components/Animate'
import {
  colsClass,
  cx,
  gapClass,
  innerClasses,
  sectionClasses,
  styleVars,
  type BlockStyle,
  type StyledBlock,
} from '@/lib/blockStyles'
import { cmsMediaAlt, cmsMediaUrl } from '@/lib/cmsPages'

type B = Record<string, any>

type Ctx = {
  locale?: string
}

/* ------------------------------------------------------------------ helpers */

function asArray(value: unknown): B[] {
  if (Array.isArray(value)) return value as B[]
  if (value && typeof value === 'object') {
    const docs = (value as B).docs
    if (Array.isArray(docs)) return docs as B[]
  }
  return []
}

/** The "style" key is our token group - unless a block uses it for something else. */
function styleOf(b: B): BlockStyle | undefined {
  return b && typeof b.style === 'object' && b.style !== null ? (b.style as BlockStyle) : undefined
}

function levelOf(value: unknown, fallback = 2): number {
  const match = String(value ?? '').match(/[1-6]/)
  return match ? Number(match[0]) : fallback
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value
  }
  return undefined
}

/* ---------------------------------------------------------------- rich text */

type RichNode = {
  type?: string
  tag?: string
  text?: string
  format?: number | string
  url?: string
  newTab?: boolean
  listType?: string
  fields?: B
  children?: RichNode[]
}

/** Lexical keeps inline formats in a bitmask, Slate keeps boolean marks. */
const FORMAT_FLAGS: Record<string, number> = {
  bold: 1,
  italic: 2,
  strikethrough: 4,
  underline: 8,
}

/** Slate / Payload v1 node names mapped onto their Lexical equivalent. */
const RICH_ALIASES: Record<string, string> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  h5: 'heading',
  h6: 'heading',
  ul: 'list',
  ol: 'list',
  li: 'listitem',
  blockquote: 'quote',
  hr: 'horizontalrule',
  'horizontal-rule': 'horizontalrule',
}

function isMarked(node: RichNode, name: string): boolean {
  if ((node as B)[name] === true) return true
  const format = node.format
  if (typeof format === 'string') return format.split(/[\s,]+/).includes(name)
  const flag = FORMAT_FLAGS[name]
  return typeof format === 'number' && !!flag && (format & flag) === flag
}

function richLeaf(node: RichNode, key: string): ReactNode {
  const text = typeof node.text === 'string' ? node.text : ''
  if (!text) return null
  let out: ReactNode = text
  if (isMarked(node, 'bold')) out = <strong>{out}</strong>
  if (isMarked(node, 'italic')) out = <em>{out}</em>
  if (isMarked(node, 'underline')) out = <u>{out}</u>
  if (isMarked(node, 'strikethrough')) out = <s>{out}</s>
  return <Fragment key={key}>{out}</Fragment>
}

/**
 * Renders Lexical (Payload 3) and Slate (Payload 1/2) rich text, keeping
 * headings, lists, quotes, links and inline formatting instead of flattening
 * everything into plain paragraphs.
 */
function richNode(node: RichNode | null | undefined, key: string, ctx: Ctx): ReactNode {
  if (!node) return null
  if (typeof node.text === 'string' && !Array.isArray(node.children)) return richLeaf(node, key)

  const raw = String(node.type ?? 'paragraph')
  const type = RICH_ALIASES[raw] ?? raw
  const tag = String(node.tag ?? raw)

  if (type === 'linebreak') return <br key={key} />
  if (type === 'horizontalrule') return <hr key={key} className="my-8 border-current/20" />

  const kids = (Array.isArray(node.children) ? node.children : []).map((child, i) =>
    richNode(child, key + '-' + i, ctx),
  )
  const empty = !kids.some(Boolean)

  switch (type) {
    case 'root':
      return <Fragment key={key}>{kids}</Fragment>

    case 'heading': {
      const level = Math.min(Math.max(levelOf(tag, 3), 2), 6)
      const Tag = ('h' + level) as any
      return (
        <Tag key={key} className={cx('mt-8 font-semibold tracking-tight', HEADING_SIZE[level])}>
          {kids}
        </Tag>
      )
    }

    case 'list':
      return tag === 'ol' || node.listType === 'number' ? (
        <ol key={key} className="list-decimal space-y-2 pl-6">
          {kids}
        </ol>
      ) : (
        <ul key={key} className="list-disc space-y-2 pl-6">
          {kids}
        </ul>
      )

    case 'listitem':
      return <li key={key}>{kids}</li>

    case 'quote':
      return (
        <blockquote key={key} className="border-l-2 border-current/25 pl-5 italic">
          {kids}
        </blockquote>
      )

    case 'link':
    case 'autolink': {
      const fields = (node.fields || {}) as B
      const href = withLocale(String(node.url ?? fields.url ?? '#'), ctx.locale)
      const external = /^(https?:|mailto:|tel:)/i.test(href)
      const newTab = Boolean(node.newTab ?? fields.newTab)
      return (
        <a
          key={key}
          href={href}
          className="underline underline-offset-2 hover:opacity-70"
          target={newTab ? '_blank' : undefined}
          rel={newTab || external ? 'noopener noreferrer' : undefined}
        >
          {kids}
        </a>
      )
    }

    case 'paragraph':
    default:
      return empty ? null : <p key={key}>{kids}</p>
  }
}

/** Accepts a Lexical root object, a Slate node array or a plain string. */
function renderRichText(value: unknown, ctx: Ctx): ReactNode {
  if (!value) return null

  if (typeof value === 'string') {
    const parts = value
      .split(/\n{2,}/)
      .map((part) => part.trim())
      .filter(Boolean)
    if (!parts.length) return null
    return (
      <>
        {parts.map((part, i) => (
          <p key={i}>{part}</p>
        ))}
      </>
    )
  }

  if (Array.isArray(value)) {
    return <>{(value as RichNode[]).map((node, i) => richNode(node, 'n-' + i, ctx))}</>
  }

  const root = (value as B)?.root
  return root ? richNode(root as RichNode, 'root', ctx) : null
}

/** Keeps CMS-authored internal links inside the current next-intl locale. */
function withLocale(href: string, locale?: string): string {
  if (!href) return '#'
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) return href
  if (!locale) return href
  const clean = href.startsWith('/') ? href : '/' + href
  if (clean === '/' + locale || clean.startsWith('/' + locale + '/')) return clean
  return '/' + locale + clean
}

function toEmbedUrl(url: string): string | null {
  if (!url) return null
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/)
  if (youtube) return 'https://www.youtube-nocookie.com/embed/' + youtube[1]
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return 'https://player.vimeo.com/video/' + vimeo[1]
  return null
}

const HEIGHTS: Record<string, string> = {
  xs: '16px',
  sm: '32px',
  md: '64px',
  lg: '96px',
  xl: '144px',
}

function heightOf(value: unknown): string {
  if (typeof value === 'number' && value > 0) return value + 'px'
  const key = String(value ?? 'md')
  if (HEIGHTS[key]) return HEIGHTS[key]
  return /^\d+(px|rem|vh|%)?$/.test(key) ? (/\d$/.test(key) ? key + 'px' : key) : HEIGHTS.md
}

const ASPECT: Record<string, string> = {
  auto: '',
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
  portrait: 'aspect-[3/4]',
  card: 'aspect-[4/3]',
}

const HEADING_SIZE: Record<number, string> = {
  1: 'text-4xl sm:text-5xl lg:text-6xl',
  2: 'text-3xl sm:text-4xl',
  3: 'text-2xl sm:text-3xl',
  4: 'text-xl',
  5: 'text-lg',
  6: 'text-base',
}

const BTN_VARIANT: Record<string, string> = {
  primary: 'bg-emerald-600 text-white hover:bg-emerald-700',
  secondary: 'bg-slate-900 text-white hover:bg-slate-800',
  outline: 'border border-current hover:bg-black/5',
  ghost: 'hover:bg-black/5',
  light: 'bg-white text-slate-900 hover:bg-slate-100',
  link: 'underline underline-offset-4 hover:opacity-70',
}

const BTN_SIZE: Record<string, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

const DIVIDER_STYLE: Record<string, string> = {
  solid: 'border-t border-current/20',
  dashed: 'border-t border-dashed border-current/30',
  dotted: 'border-t border-dotted border-current/30',
  thick: 'border-t-2 border-current/25',
}

const DIVIDER_WIDTH: Record<string, string> = {
  full: 'w-full',
  half: 'w-1/2',
  short: 'w-24',
}

/* --------------------------------------------------------------- primitives */

function Eyebrow({ text }: { text?: unknown }) {
  if (typeof text !== 'string' || !text.trim()) return null
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] opacity-70">{text}</p>
  )
}

function Title({
  text,
  level = 2,
  className,
}: {
  text?: unknown
  level?: number
  className?: string
}) {
  if (typeof text !== 'string' || !text.trim()) return null
  const safeLevel = Math.min(Math.max(level, 1), 6)
  const Tag = ('h' + safeLevel) as any
  return (
    <Tag className={cx('font-semibold tracking-tight', HEADING_SIZE[safeLevel], className)}>
      {text}
    </Tag>
  )
}

function Prose({
  value,
  className,
  ctx,
}: {
  value?: unknown
  className?: string
  ctx?: Ctx
}) {
  const body = renderRichText(value, ctx || {})
  if (!body) return null
  return (
    <div
      className={cx(
        'space-y-4 leading-relaxed opacity-90 [&_h2]:opacity-100 [&_h3]:opacity-100',
        className,
      )}
    >
      {body}
    </div>
  )
}

function Cta({ item, ctx }: { item: B; ctx: Ctx }) {
  const label = firstString(item?.label, item?.text, item?.title, item?.linkLabel)
  const rawHref = firstString(item?.href, item?.url, item?.link, item?.slug) || '#'
  if (!label) return null

  const href = withLocale(rawHref, ctx.locale)
  const className = cx(
    'inline-flex items-center justify-center rounded-full font-semibold transition-colors',
    BTN_VARIANT[String(item?.variant || 'primary')] || BTN_VARIANT.primary,
    BTN_SIZE[String(item?.size || 'md')] || BTN_SIZE.md,
  )

  if (/^(https?:|mailto:|tel:)/i.test(href)) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    )
  }
  return (
    <Link className={className} href={href}>
      {label}
    </Link>
  )
}

function CtaRow({
  items,
  ctx,
  align,
  className,
}: {
  items?: unknown
  ctx: Ctx
  align?: string
  className?: string
}) {
  const list = asArray(items)
  if (!list.length) return null
  return (
    <div
      className={cx(
        'flex flex-wrap gap-3',
        align === 'center' && 'justify-center',
        align === 'right' && 'justify-end',
        className || 'mt-8',
      )}
    >
      {list.map((item, i) => (
        <Cta key={i} item={item} ctx={ctx} />
      ))}
    </div>
  )
}

function Media({
  value,
  alt,
  aspect,
  className,
  rounded = 'rounded-xl',
}: {
  value?: unknown
  alt?: unknown
  aspect?: unknown
  className?: string
  rounded?: string
}) {
  const src = cmsMediaUrl(value)
  if (!src) return null
  const ratio = ASPECT[String(aspect ?? 'auto')] ?? ''
  return (
    <div className={cx('overflow-hidden bg-slate-100', rounded, ratio, className)}>
      <img
        src={src}
        alt={cmsMediaAlt(value, typeof alt === 'string' ? alt : '')}
        loading="lazy"
        decoding="async"
        className={cx('h-full w-full', ratio ? 'object-cover' : 'object-contain')}
      />
    </div>
  )
}

type ItemVariant = 'card' | 'plain' | 'stat' | 'logo'

function ItemGrid({
  b,
  ctx,
  items,
  cols = '3',
  variant = 'plain',
  hrefBase,
}: {
  b: B
  ctx: Ctx
  items: B[]
  cols?: string
  variant?: ItemVariant
  hrefBase?: string
}) {
  if (!items.length) return null
  const style = styleOf(b)

  return (
    <div
      className={cx(
        'grid',
        colsClass(style?.columns ?? b.columns ?? cols, cols),
        gapClass(style, variant === 'logo' ? 'gap-8' : 'gap-6'),
      )}
    >
      {items.map((item, i) => {
        const href = hrefBase
          ? withLocale(hrefBase + String(item?.slug ?? item?.id ?? ''), ctx.locale)
          : undefined

        const body = (
          <>
            {variant === 'stat' ? (
              <>
                <div className="text-4xl font-bold tracking-tight">
                  {firstString(item?.value, item?.number, item?.stat, item?.count) ?? ''}
                </div>
                <div className="mt-2 text-sm opacity-70">
                  {firstString(item?.label, item?.title, item?.caption) ?? ''}
                </div>
              </>
            ) : (
              <>
                <Media
                  value={item?.image ?? item?.media ?? item?.logo ?? item?.photo}
                  alt={item?.title ?? item?.name}
                  aspect={variant === 'logo' ? 'auto' : (item?.aspect ?? 'card')}
                  className={variant === 'logo' ? 'mb-0 h-16 bg-transparent' : 'mb-4'}
                  rounded={variant === 'logo' ? 'rounded-none' : 'rounded-xl'}
                />
                {typeof item?.icon === 'string' && item.icon.length <= 4 ? (
                  <div className="mb-3 text-2xl">{item.icon}</div>
                ) : null}
                <Title text={firstString(item?.title, item?.heading, item?.name)} level={4} />
                <Prose
                  value={item?.text ?? item?.description ?? item?.richText ?? item?.excerpt}
                  className="mt-2 text-sm"
                />
                {item?.date ? (
                  <p className="mt-3 text-xs uppercase tracking-wider opacity-60">
                    {String(item.date).slice(0, 10)}
                  </p>
                ) : null}
                {!href ? (
                  <CtaRow items={item?.links ?? item?.link} ctx={ctx} className="mt-4" />
                ) : null}
              </>
            )}
          </>
        )

        const shell = (
          <Animate
            key={i}
            animation={b.animation}
            index={i}
            className={cx(
              'min-w-0',
              variant === 'card' &&
                'rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm transition-shadow hover:shadow-md',
              variant === 'logo' && 'flex items-center justify-center',
            )}
          >
            {body}
          </Animate>
        )

        if (!href) return shell
        return (
          <Link key={i} href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
            {shell}
          </Link>
        )
      })}
    </div>
  )
}

function BlockHeader({ b, ctx, level = 2 }: { b: B; ctx: Ctx; level?: number }) {
  const heading = firstString(b.heading, b.title, b.headline)
  const sub = b.subheading ?? b.subtitle ?? b.description ?? b.intro
  if (!heading && !sub && !b.eyebrow) return null
  return (
    <div className="mb-10 max-w-3xl">
      <Eyebrow text={b.eyebrow ?? b.kicker} />
      <Title text={heading} level={level} />
      <Prose value={sub} className="mt-4" />
      <CtaRow items={b.links} ctx={ctx} className="mt-6" />
    </div>
  )
}

/* ------------------------------------------------------------------- blocks */

const BLOCKS: Record<string, (b: B, ctx: Ctx) => ReactNode> = {
  heading: (b) => (
    <>
      <Eyebrow text={b.eyebrow} />
      <Title text={firstString(b.text, b.title, b.heading)} level={levelOf(b.level, 2)} />
      <Prose value={b.subheading ?? b.description} className="mt-4" />
    </>
  ),

  richTextSection: (b) => <Prose value={b.content ?? b.richText ?? b.text} className="max-w-3xl" />,

  image: (b) => (
    <figure>
      <Media value={b.image ?? b.media} alt={b.alt ?? b.caption} aspect={b.aspect ?? 'auto'} />
      {typeof b.caption === 'string' && b.caption ? (
        <figcaption className="mt-3 text-sm opacity-70">{b.caption}</figcaption>
      ) : null}
    </figure>
  ),

  video: (b) => {
    const url = firstString(b.url, b.src, b.embedUrl) || ''
    const embed = toEmbedUrl(url)
    return (
      <div className="aspect-video overflow-hidden rounded-xl bg-black">
        {embed ? (
          <iframe
            src={embed}
            title={firstString(b.title) || 'Video'}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : url ? (
          <video className="h-full w-full" controls preload="metadata" src={url} />
        ) : null}
      </div>
    )
  },

  columns: (b, ctx) => {
    const columns = asArray(b.columns)
    if (!columns.length) return null
    return (
      <div
        className={cx(
          'grid',
          colsClass(styleOf(b)?.columns ?? columns.length, '2'),
          gapClass(styleOf(b)),
        )}
      >
        {columns.map((column, i) => (
          <Animate key={i} animation={b.animation} index={i} className="min-w-0">
            <Media value={column?.image ?? column?.media} alt={column?.title} aspect={column?.aspect ?? 'auto'} className="mb-4" />
            <Title text={column?.title ?? column?.heading} level={3} />
            <Prose value={column?.richText ?? column?.content ?? column?.text} className="mt-3" />
            <CtaRow items={column?.links ?? column?.link} ctx={ctx} className="mt-5" />
          </Animate>
        ))}
      </div>
    )
  },

  spacer: (b) => <div aria-hidden="true" style={{ height: heightOf(b.height ?? b.size) }} />,

  divider: (b) => {
    const lineStyle = firstString(b.lineStyle, typeof b.style === 'string' ? b.style : undefined) || 'solid'
    const width = firstString(b.width) || 'full'
    return (
      <hr
        className={cx(
          'mx-auto border-0',
          DIVIDER_STYLE[lineStyle] || DIVIDER_STYLE.solid,
          DIVIDER_WIDTH[width] || DIVIDER_WIDTH.full,
        )}
        style={{ marginTop: heightOf(b.space ?? 'sm'), marginBottom: heightOf(b.space ?? 'sm') }}
      />
    )
  },

  container: (b, ctx) => (
    <BlockList blocks={(b.blocks ?? b.layout ?? b.content) as StyledBlock[]} locale={ctx.locale} />
  ),

  button: (b, ctx) => <CtaRow items={[b]} ctx={ctx} align={styleOf(b)?.align} className="mt-0" />,

  hero: (b, ctx) => {
    const background = cmsMediaUrl(b.backgroundImage ?? b.background ?? b.image ?? b.media)
    return (
      <div className="relative isolate overflow-hidden rounded-3xl">
        {background ? (
          <>
            <img
              src={background}
              alt={cmsMediaAlt(b.backgroundImage ?? b.image, '')}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/50" />
          </>
        ) : null}
        <div className={cx('relative px-6 py-20 sm:px-12 sm:py-28', background && 'text-white')}>
          <Eyebrow text={b.eyebrow ?? b.kicker} />
          <Title text={firstString(b.heading, b.title, b.headline)} level={levelOf(b.level, 1)} className="max-w-4xl" />
          <Prose value={b.subheading ?? b.subtitle ?? b.text} className="mt-5 max-w-2xl text-lg" />
          <CtaRow
            items={
              asArray(b.links).length
                ? b.links
                : asArray(b.buttons).length
                  ? b.buttons
                  : firstString(b.ctaText, b.ctaLabel)
                    ? [{ label: firstString(b.ctaText, b.ctaLabel), href: firstString(b.ctaHref, b.ctaLink, b.ctaUrl) }]
                    : []
            }
            ctx={ctx}
            align={styleOf(b)?.align}
          />
        </div>
      </div>
    )
  },

  featureSplit: (b, ctx) => {
    const reverse = Boolean(b.reverse || b.imagePosition === 'left' || b.mediaPosition === 'left')
    return (
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className={cx('min-w-0', reverse && 'md:order-2')}>
          <Eyebrow text={b.eyebrow} />
          <Title text={firstString(b.heading, b.title)} level={2} />
          <Prose value={b.text ?? b.richText ?? b.description} className="mt-4" />
          <CtaRow items={b.links ?? b.link} ctx={ctx} />
        </div>
        <Animate animation={b.animation} className={cx('min-w-0', reverse && 'md:order-1')}>
          <Media value={b.image ?? b.media} alt={b.heading} aspect={b.aspect ?? 'card'} rounded="rounded-3xl" />
        </Animate>
      </div>
    )
  },

  ctaBanner: (b, ctx) => (
    <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <Eyebrow text={b.eyebrow} />
        <Title text={firstString(b.heading, b.title)} level={2} />
        <Prose value={b.text ?? b.description} className="mt-3" />
      </div>
      <CtaRow
        items={
          asArray(b.links).length
            ? b.links
            : firstString(b.buttonLabel, b.ctaText)
              ? [{ label: firstString(b.buttonLabel, b.ctaText), href: firstString(b.buttonHref, b.ctaHref) }]
              : []
        }
        ctx={ctx}
        className="mt-0 shrink-0"
      />
    </div>
  ),

  faq: (b, ctx) => {
    const items = asArray(b.items ?? b.faqs ?? b.questions)
    return (
      <>
        <BlockHeader b={b} ctx={ctx} />
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {items.map((item, i) => (
            <Animate key={i} animation={b.animation} index={i} as="details" className="group py-5">
              <summary className="cursor-pointer list-none text-lg font-medium marker:hidden">
                {firstString(item?.question, item?.title) ?? ''}
              </summary>
              <Prose value={item?.answer ?? item?.text ?? item?.richText} className="mt-3 text-sm" />
            </Animate>
          ))}
        </div>
      </>
    )
  },

  gallery: (b, ctx) => {
    const images = asArray(b.images ?? b.items ?? b.media)
    return (
      <>
        <BlockHeader b={b} ctx={ctx} />
        <div className={cx('grid', colsClass(styleOf(b)?.columns ?? b.columns ?? '3', '3'), gapClass(styleOf(b), 'gap-4'))}>
          {images.map((item, i) => (
            <Animate key={i} animation={b.animation} index={i}>
              <Media value={item?.image ?? item?.media ?? item} alt={item?.alt ?? item?.caption} aspect={b.aspect ?? 'square'} />
            </Animate>
          ))}
        </div>
      </>
    )
  },

  testimonialCarousel: (b, ctx) => {
    const items = asArray(b.testimonials ?? b.items)
    if (!items.length) return null
    return (
      <>
        <BlockHeader b={b} ctx={ctx} />
        <div className="-mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto px-2 pb-4">
          {items.map((item, i) => (
            <Animate
              key={i}
              animation={b.animation}
              index={i}
              className="min-w-[280px] max-w-sm shrink-0 snap-start rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm"
            >
              <Prose value={item?.quote ?? item?.text ?? item?.richText} className="text-sm italic" />
              <div className="mt-5 flex items-center gap-3">
                <Media value={item?.avatar ?? item?.image} alt={item?.name} aspect="square" className="h-10 w-10 shrink-0" rounded="rounded-full" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{firstString(item?.name, item?.author) ?? ''}</p>
                  <p className="truncate text-xs opacity-60">{firstString(item?.role, item?.company) ?? ''}</p>
                </div>
              </div>
            </Animate>
          ))}
        </div>
      </>
    )
  },

  newsletterSignup: (b, ctx) => (
    <div className="max-w-xl">
      <BlockHeader b={b} ctx={ctx} level={3} />
      <form className="flex flex-col gap-3 sm:flex-row" action={firstString(b.action) || '#'} method="post">
        <input
          type="email"
          name="email"
          required
          placeholder={firstString(b.placeholder) || 'you@company.com'}
          className="min-w-0 flex-1 rounded-full border border-slate-300 px-5 py-3 text-sm outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          {firstString(b.buttonLabel, b.submitLabel) || 'Subscribe'}
        </button>
      </form>
      <Prose value={b.note ?? b.disclaimer} className="mt-3 text-xs" />
    </div>
  ),

  socialLinks: (b, ctx) => (
    <CtaRow items={b.links ?? b.items} ctx={ctx} className="mt-0" align={styleOf(b)?.align} />
  ),

  contactInfo: (b) => (
    <dl className="grid gap-6 sm:grid-cols-3">
      {asArray(b.items).length
        ? asArray(b.items).map((item, i) => (
            <div key={i}>
              <dt className="text-xs font-semibold uppercase tracking-wider opacity-60">
                {firstString(item?.label, item?.title) ?? ''}
              </dt>
              <dd className="mt-1 text-sm">{firstString(item?.value, item?.text) ?? ''}</dd>
            </div>
          ))
        : (
            [
              ['Address', firstString(b.address)],
              ['Phone', firstString(b.phone)],
              ['Email', firstString(b.email)],
            ] as Array<[string, string | undefined]>
          )
            .filter(([, value]) => Boolean(value))
            .map(([label, value], i) => (
              <div key={i}>
                <dt className="text-xs font-semibold uppercase tracking-wider opacity-60">{label}</dt>
                <dd className="mt-1 text-sm">{value}</dd>
              </div>
            ))}
    </dl>
  ),

  map: (b) => {
    const src = firstString(b.embedUrl, b.url, b.src)
    if (!src) return null
    return (
      <div className="aspect-video overflow-hidden rounded-2xl border border-slate-200">
        <iframe src={src} title={firstString(b.title) || 'Map'} className="h-full w-full" loading="lazy" />
      </div>
    )
  },

  anchorNav: (b) => {
    const items = asArray(b.items ?? b.links)
    if (!items.length) return null
    return (
      <nav className="flex flex-wrap gap-2 text-sm">
        {items.map((item, i) => (
          <a
            key={i}
            href={'#' + String(item?.anchor ?? item?.id ?? '').replace(/^#/, '')}
            className="rounded-full border border-slate-300 px-4 py-2 transition-colors hover:bg-slate-100"
          >
            {firstString(item?.label, item?.title) ?? ''}
          </a>
        ))}
      </nav>
    )
  },

  breadcrumb: (b, ctx) => {
    const items = asArray(b.items)
    if (!items.length) return null
    return (
      <nav aria-label="Breadcrumb" className="text-sm opacity-70">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              {i > 0 ? <span aria-hidden="true">/</span> : null}
              {firstString(item?.href, item?.url) ? (
                <Link href={withLocale(firstString(item?.href, item?.url) as string, ctx.locale)} className="hover:underline">
                  {firstString(item?.label, item?.title) ?? ''}
                </Link>
              ) : (
                <span>{firstString(item?.label, item?.title) ?? ''}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    )
  },

  customHtml: (b) => {
    const html = firstString(b.html, b.code)
    if (!html) return null
    // First-party CMS content authored by trusted editors only.
    return <div className="cms-custom-html" dangerouslySetInnerHTML={{ __html: html }} />
  },
}

/* ------------------------------------------------- collection-driven grids */

BLOCKS.productGrid = (b, ctx) => (
  <>
    <BlockHeader b={b} ctx={ctx} />
    <ItemGrid b={b} ctx={ctx} items={asArray(b.products ?? b.items)} cols="4" variant="card" hrefBase="/products/" />
  </>
)

BLOCKS.newsGrid = (b, ctx) => (
  <>
    <BlockHeader b={b} ctx={ctx} />
    <ItemGrid b={b} ctx={ctx} items={asArray(b.posts ?? b.items ?? b.news)} cols="3" variant="card" hrefBase="/newsroom/" />
  </>
)

BLOCKS.brandGrid = (b, ctx) => (
  <>
    <BlockHeader b={b} ctx={ctx} />
    <ItemGrid b={b} ctx={ctx} items={asArray(b.brands ?? b.items)} cols="4" variant="card" hrefBase="/brands/" />
  </>
)

BLOCKS.solutionGrid = (b, ctx) => (
  <>
    <BlockHeader b={b} ctx={ctx} />
    <ItemGrid b={b} ctx={ctx} items={asArray(b.solutions ?? b.items)} cols="3" variant="card" />
  </>
)

BLOCKS.categoryCards = (b, ctx) => (
  <>
    <BlockHeader b={b} ctx={ctx} />
    <ItemGrid b={b} ctx={ctx} items={asArray(b.categories ?? b.items ?? b.cards)} cols="3" variant="card" />
  </>
)

BLOCKS.featureGrid = (b, ctx) => (
  <>
    <BlockHeader b={b} ctx={ctx} />
    <ItemGrid b={b} ctx={ctx} items={asArray(b.features ?? b.items)} cols="3" variant="card" />
  </>
)

BLOCKS.valueProps = (b, ctx) => (
  <>
    <BlockHeader b={b} ctx={ctx} />
    <ItemGrid b={b} ctx={ctx} items={asArray(b.items ?? b.values)} cols="3" variant="plain" />
  </>
)

BLOCKS.trustStats = (b, ctx) => (
  <>
    <BlockHeader b={b} ctx={ctx} />
    <ItemGrid b={b} ctx={ctx} items={asArray(b.stats ?? b.items)} cols="4" variant="stat" />
  </>
)

BLOCKS.logoCloud = (b, ctx) => (
  <>
    <BlockHeader b={b} ctx={ctx} level={3} />
    <ItemGrid b={b} ctx={ctx} items={asArray(b.logos ?? b.items)} cols="5" variant="logo" />
  </>
)

BLOCKS.relatedContent = (b, ctx) => (
  <>
    <BlockHeader b={b} ctx={ctx} level={3} />
    <ItemGrid b={b} ctx={ctx} items={asArray(b.items ?? b.docs ?? b.related)} cols="3" variant="card" />
  </>
)

/* Payload slugs that behave exactly like an existing renderer. */
const ALIASES: Record<string, string> = {
  richText: 'richTextSection',
  text: 'richTextSection',
  content: 'richTextSection',
  newsFeed: 'newsGrid',
  news: 'newsGrid',
  posts: 'newsGrid',
  products: 'productGrid',
  stats: 'trustStats',
  statsBand: 'trustStats',
  testimonials: 'testimonialCarousel',
  quote: 'testimonialCarousel',
  cta: 'ctaBanner',
  callToAction: 'ctaBanner',
  banner: 'ctaBanner',
  media: 'image',
  imageBlock: 'image',
  accordion: 'faq',
  faqs: 'faq',
  split: 'featureSplit',
  imageText: 'featureSplit',
  features: 'featureGrid',
  brands: 'brandGrid',
  solutions: 'solutionGrid',
  categories: 'categoryCards',
  newsletter: 'newsletterSignup',
  html: 'customHtml',
  embed: 'customHtml',
  section: 'container',
  group: 'container',
}

for (const [alias, target] of Object.entries(ALIASES)) {
  if (!BLOCKS[alias] && BLOCKS[target]) BLOCKS[alias] = BLOCKS[target]
}

/** Every block slug this frontend can render - handy for CMS-side validation. */
export const SUPPORTED_BLOCKS: string[] = Object.keys(BLOCKS).sort()

/* -------------------------------------------------------------------- shell */

const BARE_BLOCKS = new Set(['spacer', 'divider', 'anchorNav', 'breadcrumb'])

function BlockShell({ block, index, ctx }: { block: StyledBlock; index: number; ctx: Ctx }) {
  const b = block as B
  const type = String(b?.blockType ?? '')
  const render = BLOCKS[type]

  if (!render) {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <div className="mx-6 my-4 rounded-lg border-2 border-dashed border-amber-400 bg-amber-50 p-4 text-sm text-amber-900">
          Unmapped CMS block: <strong>{type || 'unknown'}</strong>
        </div>
      )
    }
    return null
  }

  const style = styleOf(b)
  const resolved: BlockStyle | undefined = BARE_BLOCKS.has(type)
    ? { ...(style || {}), paddingY: style?.paddingY ?? 'sm' }
    : style

  return (
    <Animate
      as="section"
      animation={b.animation}
      index={index}
      className={sectionClasses(resolved)}
      style={styleVars(resolved)}
    >
      <div className={innerClasses(resolved)}>{render(b, ctx)}</div>
    </Animate>
  )
}

export type BlockListProps = {
  blocks?: StyledBlock[] | null
  locale?: string
  className?: string
}

/** Renders a list of blocks without re-emitting the no-script fallback. */
export function BlockList({ blocks, locale, className }: BlockListProps) {
  const list = Array.isArray(blocks) ? blocks : []
  if (!list.length) return null
  const ctx: Ctx = { locale }
  return (
    <div className={className}>
      {list.map((block, i) => (
        <BlockShell
          key={String((block as B)?.id ?? (block as B)?.blockType ?? 'block') + '-' + i}
          block={block}
          index={i}
          ctx={ctx}
        />
      ))}
    </div>
  )
}

/**
 * Top-level entry point. Drop this into any page and hand it the "layout"
 * array coming from Payload.
 */
export default function RenderBlocks({ blocks, locale, className }: BlockListProps) {
  const list = Array.isArray(blocks) ? blocks : []
  if (!list.length) return null
  return (
    <>
      <AnimateNoScriptFallback />
      <BlockList blocks={list} locale={locale} className={className} />
    </>
  )
}
