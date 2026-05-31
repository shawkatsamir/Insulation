import { ImagesIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Case study — the "what no one else has" content type. Every case study is
 * fundamentally non-duplicate because it documents real work for a specific
 * (anonymous or named) customer.
 *
 * Designed around the AEO format: problem → solution → result → photos →
 * testimonial. Surfaces as Article + ImageGallery + Review JSON-LD.
 */
export const caseStudyType = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  icon: ImagesIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "results", title: "Results & proof" },
    { name: "seo", title: "SEO & social" },
    { name: "meta", title: "Metadata" },
  ],
  fields: [
    // -------- Metadata --------
    defineField({
      name: "language",
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
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "meta",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Last updated",
      type: "datetime",
      group: "meta",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      group: "meta",
      to: [{ type: "author" }],
      validation: (r) => r.required(),
    }),

    // -------- Project details --------
    defineField({
      name: "title",
      title: "Title (H1)",
      type: "string",
      group: "content",
      validation: (r) => r.required().min(15).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tldr",
      title: "TLDR / Quick summary",
      description:
        "40–60 word summary of the project — surfaces in AI Overviews and case-study cards.",
      type: "text",
      rows: 3,
      group: "content",
      validation: (r) => r.required().min(150).max(500),
    }),
    defineField({
      name: "clientName",
      title: "Client name (optional)",
      description:
        "Leave blank to keep anonymous (we'll show \"Private client\" on the page).",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "clientType",
      title: "Property type",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Villa", value: "villa" },
          { title: "Apartment building", value: "apartment-building" },
          { title: "Hotel", value: "hotel" },
          { title: "Mosque", value: "mosque" },
          { title: "School", value: "school" },
          { title: "Commercial", value: "commercial" },
          { title: "Industrial", value: "industrial" },
        ],
        layout: "dropdown",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "neighborhood",
      title: "Neighborhood / city slug",
      description:
        "Slug matching a city in content/cities.ts (e.g., 'العزيزية', 'مكة', 'الجموم').",
      type: "string",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "serviceTypeSlug",
      title: "Service slug",
      description:
        "Slug matching a service in content/services.ts (e.g., 'عزل-اسطح').",
      type: "string",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          validation: (r) => r.required().min(10),
        }),
        defineField({ name: "caption", type: "string" }),
      ],
      validation: (r) => r.required(),
    }),

    // -------- Problem / Solution / Result narrative --------
    defineField({
      name: "problem",
      title: "The problem",
      description:
        "What the client was facing before we arrived. 1–3 paragraphs.",
      type: "text",
      rows: 5,
      group: "content",
      validation: (r) => r.required().min(150),
    }),
    defineField({
      name: "solution",
      title: "Our solution",
      description: "What we proposed and why. 1–3 paragraphs.",
      type: "text",
      rows: 5,
      group: "content",
      validation: (r) => r.required().min(150),
    }),
    defineField({
      name: "workDetails",
      title: "Work details (rich text)",
      description:
        "Step-by-step description of the work, materials, techniques. This is where you demonstrate expertise.",
      type: "richText",
      group: "content",
    }),

    // -------- Results & proof --------
    defineField({
      name: "beforePhotos",
      title: "Before photos",
      type: "array",
      group: "results",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({ name: "caption", type: "string" }),
          ],
        },
      ],
      validation: (r) =>
        r.min(1).error("At least one before photo required for proof."),
    }),
    defineField({
      name: "afterPhotos",
      title: "After photos",
      type: "array",
      group: "results",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({ name: "caption", type: "string" }),
          ],
        },
      ],
      validation: (r) =>
        r.min(1).error("At least one after photo required for proof."),
    }),
    defineField({
      name: "duration",
      title: "Project duration",
      description: "e.g., \"3 days\", \"يومان\".",
      type: "string",
      group: "results",
    }),
    defineField({
      name: "results",
      title: "Measurable results",
      description:
        "Bullet list of concrete outcomes (e.g., \"خفض درجة حرارة السطح من 65°C إلى 38°C\").",
      type: "array",
      of: [{ type: "string" }],
      group: "results",
    }),
    defineField({
      name: "testimonial",
      title: "Client testimonial",
      type: "object",
      group: "results",
      fields: [
        defineField({
          name: "quote",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "attribution",
          type: "string",
          description: "e.g., \"أبو محمد، صاحب الفيلا\".",
        }),
      ],
    }),

    // -------- Trust signals --------
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      group: "content",
      of: [{ type: "faq" }],
      validation: (r) =>
        r.min(2).warning("2+ FAQs strengthen AI Overview pickup."),
    }),
    defineField({
      name: "citations",
      title: "Citations",
      type: "array",
      group: "content",
      of: [{ type: "citation" }],
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
  ],
  preview: {
    select: {
      title: "title",
      city: "neighborhood",
      service: "serviceTypeSlug",
      media: "heroImage",
    },
    prepare: ({ title, city, service, media }) => ({
      title,
      subtitle: `${service} · ${city}`,
      media,
    }),
  },
});
