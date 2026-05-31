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
    // Sanity serves all assets from cdn.sanity.io under /images/<projectId>/...
    // next/image rejects any src whose hostname isn't whitelisted here, which
    // is what threw "Invalid src prop ... hostname is not configured".
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },

  // 301 redirects from legacy static URLs to preserve link equity.
  //
  // The 6 "Best X in Makkah" posts (legacy posts 5–10) are direct duplicates
  // of the new city×service landing pages. Redirecting them prevents the
  // duplicate-content cannibalization Phase 7 of the plan called out.
  //
  // Arabic destination paths are passed as raw UTF-8 — Next encodes them
  // correctly into the Location header at request time.
  async redirects() {
    return [
      // Old homepage / blog entry points
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/blog.html", destination: "/blog", permanent: true },

      // Legacy "Best X in Makkah" posts → city×service pages
      {
        source: "/blog/best-waterproofing-company-makkah",
        destination: "/مكة/عزل-مائي",
        permanent: true,
      },
      {
        source: "/blog/best-thermal-insulation-company-makkah",
        destination: "/مكة/عزل-حراري",
        permanent: true,
      },
      {
        source: "/blog/best-roof-insulation-solutions-makkah",
        destination: "/مكة/عزل-اسطح",
        permanent: true,
      },
      {
        source: "/blog/best-tank-insulation-solutions-makkah",
        destination: "/مكة/عزل-خزانات",
        permanent: true,
      },
      {
        source: "/blog/best-kitchen-and-bathroom-insulation-makkah",
        destination: "/مكة/عزل-حمامات-مطابخ",
        permanent: true,
      },
      {
        source: "/blog/best-swimming-pool-insulation-makkah",
        destination: "/مكة/عزل-مسابح",
        permanent: true,
      },

      // Legacy static-build URLs from the old build.js pipeline.
      // Posts 5-10 had AR + EN variants at /posts/N_lang.html → city×service pages.
      { source: "/posts/5_ar.html", destination: "/مكة/عزل-مائي", permanent: true },
      { source: "/posts/5_en.html", destination: "/مكة/عزل-مائي", permanent: true },
      { source: "/posts/6_ar.html", destination: "/مكة/عزل-حراري", permanent: true },
      { source: "/posts/6_en.html", destination: "/مكة/عزل-حراري", permanent: true },
      { source: "/posts/7_ar.html", destination: "/مكة/عزل-اسطح", permanent: true },
      { source: "/posts/7_en.html", destination: "/مكة/عزل-اسطح", permanent: true },
      { source: "/posts/8_ar.html", destination: "/مكة/عزل-خزانات", permanent: true },
      { source: "/posts/8_en.html", destination: "/مكة/عزل-خزانات", permanent: true },
      { source: "/posts/9_ar.html", destination: "/مكة/عزل-حمامات-مطابخ", permanent: true },
      { source: "/posts/9_en.html", destination: "/مكة/عزل-حمامات-مطابخ", permanent: true },
      { source: "/posts/10_ar.html", destination: "/مكة/عزل-مسابح", permanent: true },
      { source: "/posts/10_en.html", destination: "/مكة/عزل-مسابح", permanent: true },

      // Posts 1–4 are pillar guides being rewritten; their new slugs don't
      // exist yet, so redirect to the blog index as a graceful fallback. Once
      // the rewrites publish, swap these for direct slug-to-slug mappings.
      { source: "/posts/:id(1|2|3|4)_:lang(ar|en).html", destination: "/blog", permanent: true },
    ];
  },

  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
