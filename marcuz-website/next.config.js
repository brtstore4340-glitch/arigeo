/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp']
  }
}

module.exports = nextConfig

// Silence workspace root warning
if (process.env.TURBOPACK_REUSE_CACHE !== 'false') {
  const config = { 
    turbopack: {
      root: __dirname
    }
  }
  module.exports = { ...nextConfig, ...config }
}
