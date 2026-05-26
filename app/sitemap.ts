import type { MetadataRoute } from "next";
import { services, cities } from "@/content";
import { SITE_URL } from "@/lib/url";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (...segments: string[]) =>
    SITE_URL + "/" + segments.map((s) => encodeURIComponent(s)).join("/");

  const staticUrls: MetadataRoute.Sitemap = [
    { url: SITE_URL + "/", lastModified: now, priority: 1, changeFrequency: "weekly" },
    { url: url("services"), lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: url("areas"), lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: url("about"), lastModified: now, priority: 0.4, changeFrequency: "yearly" },
    { url: url("contact"), lastModified: now, priority: 0.5, changeFrequency: "yearly" },
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

  return [...staticUrls, ...serviceUrls, ...cityUrls, ...comboUrls];
}
