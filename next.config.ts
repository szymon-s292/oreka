import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['oreka-eg.pl'],
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'oreka-eg.pl',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'oreka-eg.pl',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;