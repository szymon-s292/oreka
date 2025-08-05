import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['dev.oreka-eg.pl'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bucket.oreka-eg.pl',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      { source: '/artykuły', destination: '/articles' },
      { source: '/kategorie', destination: '/categories' },
      { source: '/projekty', destination: '/projects' },

      { source: '/artykuły/:id', destination: '/articles/:id' },
      { source: '/kategorie/:id', destination: '/categories/:id' },
      { source: '/projekty/:id', destination: '/projects/:id' },
    ];
  },
};

export default nextConfig;