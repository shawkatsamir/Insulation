import type { Metadata } from "next";
import { canonical } from "./url";

type Args = {
  title: string;
  description: string;
  path: string[]; // path segments after the root
  image?: string;
};

/**
 * Per-page metadata builder. Use in every page's `generateMetadata`.
 * The root layout already provides defaults (OG site name, twitter handle, etc.);
 * this helper only supplies the per-page differences.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: Args): Metadata {
  const url = canonical(...path);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { "ar-SA": url },
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
