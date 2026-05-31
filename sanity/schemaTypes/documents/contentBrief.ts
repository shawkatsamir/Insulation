import { ClipboardIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Editorial brief — produced in Phase A & B of the content workflow.
 *
 * Internal-only document, never published as a public page. It captures the
 * keyword research and editorial decisions BEFORE a draft is written, so the
 * draft itself is a focused execution task instead of an open-ended writing
 * session. Status field drives the editorial Kanban.
 */
export const contentBriefType = defineType({
  name: "contentBrief",
  title: "Content brief",
  type: "document",
  icon: ClipboardIcon,
  groups: [
    { name: "research", title: "Research", default: true },
    { name: "structure", title: "Structure" },
    { name: "status", title: "Status & assignment" },
  ],
  fields: [
    // -------- Status (top of form for fast scanning) --------
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "status",
      options: {
        list: [
          { title: "💡 Idea", value: "idea" },
          { title: "🔍 Researched", value: "researched" },
          { title: "📝 Ready for draft", value: "ready-for-draft" },
          { title: "✍️ In draft", value: "in-draft" },
          { title: "👀 Ready for review", value: "ready-for-review" },
          { title: "✅ Published", value: "published" },
          { title: "🗄️ Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "idea",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "assignedTo",
      title: "Assigned author",
      type: "reference",
      group: "status",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "linkedPost",
      title: "Resulting post",
      description: "Set when a draft post is created from this brief.",
      type: "reference",
      group: "status",
      to: [{ type: "post" }, { type: "caseStudy" }],
    }),
    defineField({
      name: "dueDate",
      title: "Target publish date",
      type: "date",
      group: "status",
    }),

    // -------- Research --------
    defineField({
      name: "title",
      title: "Working title",
      type: "string",
      group: "research",
      validation: (r) => r.required().min(5),
    }),
    defineField({
      name: "primaryKeyword",
      title: "Primary keyword (Arabic)",
      description: "The single query this post targets.",
      type: "string",
      group: "research",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "secondaryKeywords",
      title: "Secondary keywords",
      description: "3–5 related queries that share intent.",
      type: "array",
      group: "research",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      validation: (r) => r.max(5),
    }),
    defineField({
      name: "intent",
      title: "Search intent",
      type: "string",
      group: "research",
      options: {
        list: [
          { title: "Informational (learn)", value: "informational" },
          { title: "Commercial (compare)", value: "commercial" },
          { title: "Navigational (find a brand)", value: "navigational" },
          { title: "Transactional (buy/hire)", value: "transactional" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "monthlyVolume",
      title: "Estimated monthly volume",
      type: "number",
      group: "research",
    }),
    defineField({
      name: "competitorUrls",
      title: "Top 3 competing URLs",
      description: "Currently ranking pages for the primary keyword.",
      type: "array",
      group: "research",
      of: [{ type: "url" }],
      validation: (r) => r.max(5),
    }),
    defineField({
      name: "gapExploit",
      title: "The gap we exploit",
      description:
        "What do the competing URLs miss? Original data? Local angle? Recency? This is the one-sentence reason this post will rank above them.",
      type: "text",
      group: "research",
      rows: 3,
    }),

    // -------- Structure --------
    defineField({
      name: "audiencePersona",
      title: "Audience persona",
      description:
        "Who specifically is reading this? (e.g., \"Makkah villa owner with a 6-year-old roof showing rain stains, comparing 2-3 contractors.\")",
      type: "text",
      group: "structure",
      rows: 3,
    }),
    defineField({
      name: "structureType",
      title: "Structure type",
      type: "string",
      group: "structure",
      options: {
        list: [
          { title: "Pillar guide", value: "pillar" },
          { title: "Case study", value: "case-study" },
          { title: "Explainer", value: "explainer" },
          { title: "Comparison", value: "comparison" },
          { title: "News / update", value: "news" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "targetWordCount",
      title: "Target word count",
      description: "1500 for explainers, 2500+ for pillars.",
      type: "number",
      group: "structure",
      initialValue: 1500,
    }),
    defineField({
      name: "tldrTarget",
      title: "Draft TLDR (40–60 words)",
      description:
        "Write the TLDR as part of the brief. Forces clarity on what the post is actually about.",
      type: "text",
      group: "structure",
      rows: 3,
    }),
    defineField({
      name: "internalLinksToSeed",
      title: "Internal links to seed",
      description: "Posts and case studies this post should link to.",
      type: "array",
      group: "structure",
      of: [
        {
          type: "reference",
          to: [{ type: "post" }, { type: "caseStudy" }],
        },
      ],
    }),
    defineField({
      name: "relatedCityServices",
      title: "City × service pages to link out to",
      type: "array",
      group: "structure",
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
            prepare: ({ city, service }) => ({ title: `/${city}/${service}` }),
          },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Status",
      name: "statusGroup",
      by: [{ field: "status", direction: "asc" }],
    },
    {
      title: "Due date",
      name: "dueAsc",
      by: [{ field: "dueDate", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      assignee: "assignedTo.name",
      due: "dueDate",
    },
    prepare: ({ title, status, assignee, due }) => ({
      title: `${title || "Untitled brief"}`,
      subtitle: [status, assignee, due].filter(Boolean).join(" · "),
    }),
  },
});
