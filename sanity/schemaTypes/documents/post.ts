import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Blog post — the workhorse document for everything that's NOT a city×service
 * landing page. Schema fields are designed to enforce the 11-element ranking
 * structure from Phase C of the content workflow.
 *
 * Fields the legacy posts had but we're intentionally omitting:
 *  - `whyChooseUs` — salesy section; doesn't rank. CTAs belong in components.
 *  - `localKeywords` array — was keyword-stuffed identically across posts.
 *    Replaced by `seo.focusKeyword` + `seo.relatedKeywords` which feed the
 *    duplicate-content gate.
 */
export const postType = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO & social" },
    { name: "meta", title: "Metadata" },
  ],
  fields: [
    // -------- Metadata --------
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      group: "meta",
      options: {
        list: [
          { title: "Arabic", value: "ar" },
          { title: "English", value: "en" },
        ],
        layout: "radio",
      },
      initialValue: "ar",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "isPillar",
      title: "Pillar post?",
      description:
        "Pillar posts are the hub of a topic cluster. Other posts link to them. Use sparingly — 1–3 per topic.",
      type: "boolean",
      group: "meta",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "meta",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Last updated",
      description:
        "Bump this when you refresh the post quarterly. Surfaces on the byline and in JSON-LD as dateModified.",
      type: "datetime",
      group: "meta",
    }),

    // -------- Content --------
    defineField({
      name: "title",
      title: "Title (H1)",
      description:
        "Arabic post title. Should contain the primary keyword naturally.",
      type: "string",
      group: "content",
      validation: (r) =>
        r
          .required()
          .min(15)
          .max(100)
          .warning("Aim for 40–70 chars for best SERP display."),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description:
        "URL: /blog/[slug]. Use Arabic letters + hyphens (e.g., 'دليل-عزل-الاسطح-مكة').",
      type: "slug",
      group: "content",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/[\s_]+/g, "-")
            .replace(/-+/g, "-"),
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tldr",
      title: "TLDR / Quick answer",
      description:
        "40–60 word standalone answer to the search query. THIS is what Google's AI Overviews surface. Make it count.",
      type: "text",
      rows: 3,
      group: "content",
      validation: (r) =>
        r
          .required()
          .min(150)
          .max(500)
          .error("TLDR must be 150–500 chars (~40–80 Arabic words)."),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      description:
        "Original photo from real work. No stock photography — Google's image search rewards uniqueness.",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text (Arabic, describe what's in the photo)",
          validation: (r) =>
            r
              .required()
              .min(10)
              .error("Alt text is required and must be descriptive."),
        }),
        defineField({
          name: "caption",
          type: "string",
          title: "Caption (shown under image)",
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      description:
        "Named human with a real bio. Powers the E-E-A-T byline + Person JSON-LD.",
      type: "reference",
      group: "content",
      to: [{ type: "author" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "brief",
      title: "Source brief",
      description:
        "Link to the contentBrief that produced this post (for traceability).",
      type: "reference",
      group: "meta",
      to: [{ type: "contentBrief" }],
    }),
    defineField({
      name: "body",
      title: "Body",
      description:
        "Use H2 sections that each answer a People-Also-Ask question. First sentence of each section should restate the H2 as a complete answer (passage ranking).",
      type: "richText",
      group: "content",
      validation: (r) => r.required(),
    }),

    // -------- Trust signals --------
    defineField({
      name: "faq",
      title: "FAQ",
      description:
        "Minimum 3 Q&A pairs. Each answer must stand alone (read out of context). Emitted as FAQPage JSON-LD.",
      type: "array",
      group: "content",
      of: [{ type: "faq" }],
      validation: (r) =>
        r
          .min(3)
          .max(10)
          .error("FAQ must have 3–10 entries (AEO sweet spot)."),
    }),
    defineField({
      name: "citations",
      title: "External citations",
      description:
        "Minimum 2 authoritative sources. Government standards, manufacturer datasheets, and academic research carry the most weight.",
      type: "array",
      group: "content",
      of: [{ type: "citation" }],
      validation: (r) =>
        r
          .min(2)
          .error("At least 2 external citations required for EEAT credibility."),
    }),

    // -------- Internal linking --------
    defineField({
      name: "relatedPosts",
      title: "Related posts",
      description: "1–3 related posts. Strengthens the topical cluster.",
      type: "array",
      group: "content",
      of: [
        {
          type: "reference",
          to: [{ type: "post" }, { type: "caseStudy" }],
        },
      ],
      validation: (r) => r.max(3),
    }),
    defineField({
      name: "relatedCityServices",
      title: "Related city × service pages",
      description:
        "Slug pairs (e.g., 'مكة/عزل-اسطح') to link this post out to high-intent landing pages. 2–3 ideal.",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "citySlug",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "serviceSlug",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { city: "citySlug", service: "serviceSlug" },
            prepare: ({ city, service }) => ({
              title: `/${city}/${service}`,
            }),
          },
        },
      ],
      validation: (r) => r.max(5),
    }),

    // -------- SEO --------
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  orderings: [
    {
      title: "Published (newest first)",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Updated (newest first)",
      name: "updatedDesc",
      by: [{ field: "updatedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "heroImage",
      lang: "language",
      pillar: "isPillar",
    },
    prepare: ({ title, author, media, lang, pillar }) => ({
      title: pillar ? `📌 ${title}` : title,
      subtitle: [lang?.toUpperCase(), author].filter(Boolean).join(" · "),
      media,
    }),
  },
});
