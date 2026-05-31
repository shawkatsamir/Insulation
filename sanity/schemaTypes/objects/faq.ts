import { HelpCircleIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Reusable FAQ entry. Used by post.faq, caseStudy.faq, and can be inlined on
 * marketing pages. Emitted as FAQPage JSON-LD on the frontend.
 *
 * Validation enforces the AEO format: question + standalone, fact-dense answer
 * that makes sense out of context. Short marketing-style answers get rejected.
 */
export const faqType = defineType({
  name: "faq",
  title: "FAQ entry",
  type: "object",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "q",
      title: "Question",
      type: "string",
      validation: (r) =>
        r
          .required()
          .min(8)
          .error("Question must be at least 8 characters."),
    }),
    defineField({
      name: "a",
      title: "Answer",
      description:
        "1–3 sentence answer that makes sense out of context. Cite a fact or number when possible — this is what AI Overviews surface.",
      type: "text",
      rows: 4,
      validation: (r) =>
        r
          .required()
          .min(30)
          .error("Answer must be substantive (≥30 chars) to rank in AI Overviews."),
    }),
  ],
  preview: {
    select: { title: "q", subtitle: "a" },
  },
});
