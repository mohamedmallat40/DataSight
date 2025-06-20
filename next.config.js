/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  i18n: {
    locales: ["en", "fr", "ar", "nl"],
    defaultLocale: "en",
  },
};

module.exports = nextConfig;
