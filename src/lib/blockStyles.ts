/**
 * Block style + animation resolver
 * ---------------------------------------------------------------------------
 * Translates the \`style\` and \`animation\` field groups that editors fill in
 * inside the Payload page builder into real Tailwind classes / inline CSS.
 *
 * See docs/CMS-PAGE-BUILDER.md for the matching Payload field config.
 *
 * IMPORTANT: every Tailwind class is written out as a literal string so the
 * JIT compiler can see it. Never build class names by concatenation here.
 *
 * Zero runtime dependencies -> safe to import from Server Components.
 */

export type BlockStyle = {
  bg?: string
  bgColor?: string
  text?: string
  textColor?: string
  paddingY?: string
  paddingX?: string
  maxWidth?: string
  align?: string
  radius?: string
  shadow?: string
  border?: string
  gap?: string
  columns?: string
  minHeight?: string
  className?: string
}

export type BlockAnimation = {
  type?: string
  duration?: number
  delay?: number
  stagger?: number
  once?: boolean
}

export type StyledBlock = {
  id?: string
  blockType?: string
  blockName?: string
  style?: BlockStyle | null
  animation?: BlockAnimation | null
  [key: string]: unknown
}

/* ------------------------------------------------------------------ tokens */

const BG: Record<string, string> = {
  none: '',
  white: 'bg-white',
  light: 'bg-slate-50',
  muted: 'bg-slate-100',
  dark: 'bg-slate-900',
  brand: 'bg-emerald-600',
  brandSoft: 'bg-emerald-50',
  gradient: 'bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900',
  gradientSoft: 'bg-gradient-to-b from-slate-50 to-white',
}

const TEXT: Record<string, string> = {
  default: 'text-slate-900',
  muted: 'text-slate-600',
  invert: 'text-white',
  brand: 'text-emerald-700',
}

const PAD_Y: Record<string, string> = {
  none: 'py-0',
  xs: 'py-4',
  sm: 'py-8',
  md: 'py-14',
  lg: 'py-20',
  xl: 'py-28',
}

const PAD_X: Record<string, string> = {
  none: 'px-0',
  sm: 'px-4',
  md: 'px-6',
  lg: 'px-10',
}

const MAX_W: Record<string, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-none',
}

const ALIGN_TEXT: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const ALIGN_BOX: Record<string, string> = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto',
}

const RADIUS: Record<string, string> = {
  none: 'rounded-none',
  sm: 'rounded-md',
  md: 'rounded-xl',
  lg: 'rounded-3xl',
  full: 'rounded-full',
}

const SHADOW: Record<string, string> = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-xl',
}

const BORDER: Record<string, string> = {
  none: '',
  thin: 'border border-slate-200',
  thick: 'border-2 border-slate-300',
  brand: 'border border-emerald-500',
}

const GAP: Record<string, string> = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-10',
  xl: 'gap-16',
}

const COLS: Record<string, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  '5': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  '6': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
}

const MIN_H: Record<string, string> = {
  auto: '',
  sm: 'min-h-[320px]',
  md: 'min-h-[480px]',
  lg: 'min-h-[640px]',
  screen: 'min-h-screen',
}

/* ----------------------------------------------------------------- helpers */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
}

function pick(map: Record<string, string>, key: string | undefined, fallback = ''): string {
  if (!key) return fallback
  return key in map ? map[key] : fallback
}

/** Classes for the outer <section> wrapper of a block. */
export function sectionClasses(style?: BlockStyle | null, extra = ''): string {
  const s = style || {}
  return cx(
    'relative w-full',
    pick(BG, s.bg),
    pick(TEXT, s.text, 'text-slate-900'),
    pick(PAD_Y, s.paddingY, 'py-14'),
    pick(MIN_H, s.minHeight),
    extra,
    s.className || '',
  )
}

/** Classes for the centred inner container of a block. */
export function innerClasses(style?: BlockStyle | null, extra = ''): string {
  const s = style || {}
  return cx(
    'w-full',
    pick(MAX_W, s.maxWidth, 'max-w-6xl'),
    pick(PAD_X, s.paddingX, 'px-6'),
    pick(ALIGN_BOX, s.align, 'mx-auto'),
    pick(ALIGN_TEXT, s.align),
    pick(RADIUS, s.radius),
    pick(SHADOW, s.shadow),
    pick(BORDER, s.border),
    extra,
  )
}

export function gapClass(style?: BlockStyle | null, fallback = 'gap-6'): string {
  return pick(GAP, style?.gap, fallback)
}

export function colsClass(count?: string | number | null, fallback = '3'): string {
  const key = String(count ?? fallback)
  return pick(COLS, key, COLS[fallback])
}

export function alignClass(style?: BlockStyle | null): string {
  return pick(ALIGN_TEXT, style?.align, 'text-left')
}

/**
 * Free-form colour overrides. Editors may type any hex/rgb value; we push it
 * through inline styles because Tailwind cannot generate arbitrary values at
 * runtime.
 */
export function styleVars(style?: BlockStyle | null): Record<string, string> {
  const out: Record<string, string> = {}
  const s = style || {}
  if (s.bgColor) out.backgroundColor = s.bgColor
  if (s.textColor) out.color = s.textColor
  return out
}

/* --------------------------------------------------------------- animation */

export const ANIMATION_TYPES = [
  'none',
  'fade',
  'fade-up',
  'fade-down',
  'fade-left',
  'fade-right',
  'zoom-in',
  'zoom-out',
  'blur-in',
  'rise',
] as const

export type AnimationType = (typeof ANIMATION_TYPES)[number]

export function normalizeAnimation(animation?: BlockAnimation | null): Required<BlockAnimation> {
  const a = animation || {}
  const type = (a.type && (ANIMATION_TYPES as readonly string[]).includes(a.type) ? a.type : 'none') as string
  return {
    type,
    duration: typeof a.duration === 'number' && a.duration > 0 ? a.duration : 600,
    delay: typeof a.delay === 'number' && a.delay >= 0 ? a.delay : 0,
    stagger: typeof a.stagger === 'number' && a.stagger >= 0 ? a.stagger : 0,
    once: a.once !== false,
  }
}
