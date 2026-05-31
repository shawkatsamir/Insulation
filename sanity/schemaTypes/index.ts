import type { SchemaTypeDefinition } from "sanity";

// Reusable objects
import { seoType } from "./objects/seo";
import { faqType } from "./objects/faq";
import { citationType } from "./objects/citation";
import { richTextType } from "./objects/richText";

// Documents
import { authorType } from "./documents/author";
import { postType } from "./documents/post";
import { contentBriefType } from "./documents/contentBrief";
import { caseStudyType } from "./documents/caseStudy";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Objects first (depended on by documents)
    seoType,
    faqType,
    citationType,
    richTextType,
    // Documents
    authorType,
    postType,
    contentBriefType,
    caseStudyType,
  ],
};
