/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    formats: ['image/avif', 'image/webp']
  },
  turbopack: {
    root: __dirname
  }
}

module.exports = nextConfig
