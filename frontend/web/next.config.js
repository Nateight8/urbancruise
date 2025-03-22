/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Disable static generation for error pages since they use contexts not available during SSR
  output: "standalone",
  experimental: {
    // Skip static 404 generation which causes React 19 context issues
    skipTrailingSlashRedirect: true,
    skipMiddlewareUrlNormalize: true,
  },
  // Add other configurations as needed
};

module.exports = nextConfig;
