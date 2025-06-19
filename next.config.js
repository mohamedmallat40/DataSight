/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  typescript: {
    // !! WARNING: This disables type-checking during production builds !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
