import { LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * External citation. The minimum-2-citations rule in the post schema (Phase C
 * step 7 of the workflow) is what gives our content its E-E-A-T edge over the
 * legacy posts. Always link to authoritative sources, never to competitors.
 */
export const citationType = defineType({
  name: "citation",
  title: "Citation",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "label",
      title: "Source label",
      description:
        "Short descriptive name shown in the article (e.g., \"كود البناء السعودي 2018\").",
      type: "string",
      validation: (r) => r.required().min(3),
    }),
    defineField({
      name: "url",
      title: "Source URL",
      type: "url",
      validation: (r) =>
        r
          .required()
          .uri({ scheme: ["http", "https"] })
          .error("Must be a valid http(s) URL."),
    }),
    defineField({
      name: "type",
      title: "Source type",
      description: "Helps the duplicate-content validator weight source authority.",
      type: "string",
      options: {
        list: [
          { title: "Government / Standards", value: "government" },
          { title: "Manufacturer datasheet", value: "manufacturer" },
          { title: "Academic / Research", value: "research" },
          { title: "Industry news", value: "news" },
          { title: "Technical manual", value: "manual" },
        ],
        layout: "radio",
      },
      initialValue: "manufacturer",
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "url" },
  },
});
