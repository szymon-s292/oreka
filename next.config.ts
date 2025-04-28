import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'oreka-eg.pl',
        port: '80',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'oreka-eg.pl',
        port: '443',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
