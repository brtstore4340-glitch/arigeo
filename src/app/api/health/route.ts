/**
 * Health check endpoint for production monitoring.
 * Verifies CMS connectivity and returns system status.
 * GET /api/health
 */

export const dynamic = 'force-dynamic'

export async function GET() {
  const CMS_URL = (process.env.NEXT_PUBLIC_CMS_URL ?? 'https://cms-arigeo.vercel.app').replace(/\/$/, '')

  const checks = {
    cmsUrl: CMS_URL,
    cmsConnectivity: 'checking',
    timestamp: new Date().toISOString(),
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    try {
      const res = await fetch(`${CMS_URL}/api/brands?limit=1`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      })

      clearTimeout(timeout)

      checks.cmsConnectivity = res.ok ? 'ok' : `error_${res.status}`
    } finally {
      clearTimeout(timeout)
    }
  } catch (err) {
    checks.cmsConnectivity = err instanceof Error && err.name === 'AbortError' ? 'timeout' : 'unreachable'
  }

  const allHealthy = checks.cmsConnectivity === 'ok'
  const statusCode = allHealthy ? 200 : 503

  return Response.json(checks, { status: statusCode })
}
