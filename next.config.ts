import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",  // <=== enables static exports
  reactStrictMode: true,
  basePath: "/oreka",
};

export default nextConfig;
module.exports = nextConfig;