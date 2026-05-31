import type { MetadataRoute } from "next";
import { services, cities } from "@/content";
import { SITE_URL } from "@/lib/url";
import { client } from "@/sanity/lib/client";
import { SITEMAP_URLS_QUERY } from "@/sanity/lib/queries";
import type { SitemapUrl } from "@/sanity/lib/query-types";

const url = (...segments: string[]) =>
  SITE_URL + "/" + segments.map((s) => encodeURIComponent(s)).join("/");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static + city/service URLs (driven by the typed content modules).
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: SITE_URL + "/",
      lastModified: now,
      priority: 1,
      changeFrequency: "weekly",
    },
    {
      url: url("services"),
      lastModified: now,
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      url: url("areas"),
      lastModified: now,
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      url: url("blog"),
      lastModified: now,
      priority: 0.7,
      changeFrequency: "weekly",
    },
    {
      url: url("about"),
      lastModified: now,
      priority: 0.4,
      changeFrequency: "yearly",
    },
    {
      url: url("contact"),
      lastModified: now,
      priority: 0.5,
      changeFrequency: "yearly",
    },
  ];

  const serviceUrls = services.map((s) => ({
    url: url("services", s.slug),
    lastModified: now,
    priority: 0.9,
    changeFrequency: "monthly" as const,
  }));

  const cityUrls = cities.map((c) => ({
    url: url("areas", c.slug),
    lastModified: now,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const comboUrls: MetadataRoute.Sitemap = [];
  for (const c of cities) {
    for (const s of services) {
      comboUrls.push({
        url: url(c.slug, s.slug),
        lastModified: now,
        priority: 0.7,
        changeFrequency: "monthly",
      });
    }
  }

  // Sanity-backed URLs (posts, case studies, authors). Sitemap build still
  // succeeds if the Sanity fetch fails (no published content yet, project
  // unreachable, etc.) — we just emit the static portion.
  let sanityUrls: MetadataRoute.Sitemap = [];
  try {
    const docs = (await client
      .withConfig({ useCdn: false })
      .fetch(SITEMAP_URLS_QUERY)) as SitemapUrl[] | null;
    sanityUrls = (docs ?? [])
      .filter((d) => d.slug)
      .map((d) => {
        const path =
          d._type === "post"
            ? ["blog", d.slug as string]
            : d._type === "caseStudy"
              ? ["case-study", d.slug as string]
              : d._type === "author"
                ? ["author", d.slug as string]
                : [];
        return {
          url: url(...path),
          lastModified: d.lastModified ? new Date(d.lastModified) : now,
          priority:
            d._type === "post" ? 0.8 : d._type === "caseStudy" ? 0.7 : 0.5,
          changeFrequency: "monthly" as const,
        };
      });
  } catch (err) {
    console.warn("sitemap: Sanity fetch failed, skipping CMS URLs", err);
  }

  return [
    ...staticUrls,
    ...serviceUrls,
    ...cityUrls,
    ...comboUrls,
    ...sanityUrls,
  ];
}
