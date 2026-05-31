import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Reusable SEO object. Spread into every document type that has a public URL.
 *
 * Frontend pattern: GROQ uses coalesce() so `seo.title` is never null —
 * it's either the override, the document's title, or empty. See plan §SEO.
 *
 * focusKeyword + relatedKeywords drive the build-time duplicate-content gate
 * in scripts/validate-content.ts (Phase D of the workflow).
 */
export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  icon: CogIcon,
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "SEO Title (override)",
      description: "Overrides the document title in <title> if provided. ~60 chars max.",
      type: "string",
      validation: (r) => r.max(70).warning("Over 70 chars may get truncated in SERPs."),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      description: "1–2 sentence summary shown in SERPs. ~155 chars max.",
      type: "text",
      rows: 3,
      validation: (r) =>
        r.max(170).warning("Over 170 chars may get truncated in SERPs."),
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      description: "1200×630 recommended. Falls back to the hero image if empty.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      description: "Sets robots: noindex. Use sparingly.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "focusKeyword",
      title: "Primary focus keyword",
      description:
        "The main query this page targets (Arabic). Used by the duplicate-content gate to flag cannibalization.",
      type: "string",
    }),
    defineField({
      name: "relatedKeywords",
      title: "Secondary keywords",
      description: "3–5 related queries this page also targets.",
      type: "array",
      of: [{ type: "string" }],
      validation: (r) =>
        r.max(5).warning("Stay focused — more than 5 dilutes intent."),
      options: { layout: "tags" },
    }),
  ],
});
