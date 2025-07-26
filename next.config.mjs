/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ['@iconify/react', 'framer-motion'],
  },
  turbopack: {
    resolveAlias: {
      '@': './src',
      '#': '.',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
