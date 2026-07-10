/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  experimental: {
    esmExternals: true,
  },
};

module.exports = nextConfig;
