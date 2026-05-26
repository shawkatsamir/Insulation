import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Pin the workspace root — the legacy static site at the parent dir has its
  // own package-lock.json which otherwise confuses Next's file tracing.
  outputFileTracingRoot: path.join(__dirname),

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920],
  },

  // 301 redirects from legacy static URLs to preserve link equity.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/blog.html", destination: "/blog", permanent: true },
    ];
  },

  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
