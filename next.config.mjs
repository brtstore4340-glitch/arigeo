import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow product / brand images served by the Payload CMS and its
    // Vercel Blob storage so <Image> can optimise remote CMS assets.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms-arigeo.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
