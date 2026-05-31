import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Sanity Studio + styled-components misbehave when webpack tries to bundle
  // them for the server build (createContext is called at module init in a
  // way that breaks SSR). Letting Node resolve them directly fixes it.
  serverExternalPackages: ["sanity", "@sanity/vision", "styled-components"],

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
