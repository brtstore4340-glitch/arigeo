/**
 * Performance monitoring for Core Web Vitals
 * Tracks LCP, FID, CLS metrics for optimization
 */

export interface WebVital {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta?: number
}

export interface PerformanceMetrics {
  lcp: WebVital
  fid: WebVital
  cls: WebVital
  timestamp: number
}

/**
 * LCP (Largest Contentful Paint) thresholds
 * Good: < 2.5s, Needs Improvement: 2.5-4s, Poor: > 4s
 */
export function getLCPRating(value: number): WebVital['rating'] {
  if (value < 2500) return 'good'
  if (value < 4000) return 'needs-improvement'
  return 'poor'
}

/**
 * FID (First Input Delay) thresholds
 * Good: < 100ms, Needs Improvement: 100-300ms, Poor: > 300ms
 */
export function getFIDRating(value: number): WebVital['rating'] {
  if (value < 100) return 'good'
  if (value < 300) return 'needs-improvement'
  return 'poor'
}

/**
 * CLS (Cumulative Layout Shift) thresholds
 * Good: < 0.1, Needs Improvement: 0.1-0.25, Poor: > 0.25
 */
export function getCLSRating(value: number): WebVital['rating'] {
  if (value < 0.1) return 'good'
  if (value < 0.25) return 'needs-improvement'
  return 'poor'
}

/**
 * Core Web Vitals thresholds for Google
 */
export const cwvThresholds = {
  lcp: {
    good: 2500,
    needsImprovement: 4000,
    description: 'Largest Contentful Paint (LCP)',
    unit: 'ms',
    target: '< 2.5s for 75% of page loads',
  },
  fid: {
    good: 100,
    needsImprovement: 300,
    description: 'First Input Delay (FID)',
    unit: 'ms',
    target: '< 100ms for 75% of page loads',
  },
  cls: {
    good: 0.1,
    needsImprovement: 0.25,
    description: 'Cumulative Layout Shift (CLS)',
    unit: 'score',
    target: '< 0.1 for 75% of page loads',
  },
}

/**
 * Image optimization impact on Core Web Vitals
 */
export const imageOptimizationImpact = {
  lcp: {
    impact: 'High',
    description: 'Largest images often determine LCP. WebP reduces file size 25-35%',
    optimization: [
      'Lazy load below-fold images',
      'Use modern formats (WebP, AVIF)',
      'Provide responsive sizes',
      'Preload critical images',
    ],
  },
  fid: {
    impact: 'Low (direct)',
    description: 'FID driven by JavaScript, not images. Smaller images → faster JS',
    optimization: [
      'Reduce bundle size (smaller image libs)',
      'Defer non-critical scripts',
      'Use Web Workers for heavy tasks',
    ],
  },
  cls: {
    impact: 'High',
    description: 'Images without fixed dimensions cause layout shift. Always set width/height',
    optimization: [
      'Always set width and height on images',
      'Use aspect ratio boxes for media',
      'Avoid dynamic content above fold',
      'Preload fonts to avoid FOUT/FOIT',
    ],
  },
}

/**
 * Performance audit checklist
 */
export const performanceAuditChecklist = [
  'Run Lighthouse audit (target 90+)',
  'Check LCP (< 2.5s)',
  'Check FID (< 100ms)',
  'Check CLS (< 0.1)',
  'Test on Slow 3G network',
  'Verify images are WebP with PNG fallback',
  'Confirm all images have dimensions (prevent CLS)',
  'Check lazy loading on below-fold images',
  'Verify fonts load without blocking render',
  'Audit JavaScript bundle size',
  'Test on mobile device (real hardware preferred)',
  'Monitor real user metrics with web-vitals library',
  'Set up performance budgets',
  'Review image file sizes (target < 50KB per image)',
]

/**
 * Lighthouse score thresholds
 */
export const lighthouseThresholds = {
  excellent: 90,
  good: 80,
  needsImprovement: 70,
  poor: 0,
}

/**
 * Expected file sizes after optimization
 */
export const targetFileSizes = {
  heroImage: {
    webp: '40-60 KB',
    png: '80-120 KB',
    target: 'Use WebP as primary',
  },
  productImage: {
    webp: '25-40 KB',
    png: '50-80 KB',
    target: 'Use WebP as primary',
  },
  blogImage: {
    webp: '30-50 KB',
    png: '60-100 KB',
    target: 'Use WebP as primary',
  },
  maxTotalImages: '200-300 KB (entire page)',
}

/**
 * Optimization recommendations by metric
 */
export const optimizationGuide = {
  lcpOptimization: {
    priority: 'Critical',
    steps: [
      '1. Identify the largest image on the page',
      '2. Check if it\'s being lazy loaded (should be preloaded)',
      '3. Convert to WebP format (25-35% smaller)',
      '4. Generate responsive sizes for each breakpoint',
      '5. Add priority={true} to Next.js Image component',
      '6. Test with DevTools (Network throttling) to confirm < 2.5s',
    ],
  },
  clsOptimization: {
    priority: 'Critical',
    steps: [
      '1. Add width and height to all images',
      '2. Use aspect-ratio CSS for media containers',
      '3. Reserve space for ads/dynamic content',
      '4. Preload critical fonts',
      '5. Use font-display: swap for Google Fonts',
      '6. Test with DevTools Performance tab (Layout Shifts)',
    ],
  },
  fidOptimization: {
    priority: 'High',
    steps: [
      '1. Audit JavaScript bundle size (target: < 200 KB)',
      '2. Code split with dynamic imports',
      '3. Defer non-critical JavaScript',
      '4. Use Web Workers for heavy computations',
      '5. Minimize main thread work',
      '6. Profile with DevTools Performance tab',
    ],
  },
}

/**
 * Web Vitals measurement utilities
 * Use in pages/components for real user monitoring
 */
export const webVitalsSetup = `
// Add to app/layout.tsx or use web-vitals package
import { onCLS, onFID, onLCP } from 'web-vitals'

export function reportWebVitals() {
  onCLS(metric => console.log('CLS:', metric.value))
  onFID(metric => console.log('FID:', metric.value))
  onLCP(metric => console.log('LCP:', metric.value))

  // Optional: Send to analytics
  // sendToAnalytics(metric)
}

// Call in useEffect:
useEffect(() => {
  reportWebVitals()
}, [])
`
