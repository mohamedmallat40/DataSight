/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Enable standalone build for Docker
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['react-leaflet'],
  // Standalone output allows proper Docker deployment
  // Landing page (index.tsx) uses getStaticProps for SEO
  // Other pages are server-rendered dynamically
};

module.exports = nextConfig;
