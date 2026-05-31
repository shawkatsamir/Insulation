import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * The body Portable Text format used by post.body and caseStudy.workDetails.
 *
 * Carefully limited:
 *  - H2 + H3 only (H1 is the page title; H4+ rarely useful for SEO).
 *  - External link mark uses target=_blank rel=noopener at render time.
 *  - Internal link mark references other Sanity docs so links update if slugs
 *    change. The renderer is responsible for resolving the URL.
 *  - Inline images require alt + caption — enforces accessibility + EEAT.
 */
export const richTextType = defineType({
  name: "richText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "External link",
            fields: [
              defineField({
                name: "href",
                type: "url",
                validation: (r) =>
                  r.required().uri({ scheme: ["http", "https", "mailto", "tel"] }),
              }),
            ],
          },
          {
            name: "internalLink",
            type: "object",
            title: "Internal link",
            fields: [
              defineField({
                name: "reference",
                type: "reference",
                to: [{ type: "post" }, { type: "caseStudy" }, { type: "author" }],
                validation: (r) => r.required(),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text (required for accessibility + SEO)",
          type: "string",
          validation: (r) =>
            r.required().error("Alt text is required for every image."),
        }),
        defineField({
          name: "caption",
          title: "Caption (optional, shown below image)",
          type: "string",
        }),
      ],
    }),
  ],
});
