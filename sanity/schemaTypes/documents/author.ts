import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Author document — the foundation of E-E-A-T on the blog.
 *
 * Critical for Google ranking: every author must be a real person with a
 * verifiable bio, photo, credentials, and ideally a LinkedIn link. Generic
 * team bylines (like the legacy posts' "فريق عوازل مكة") rank poorly because
 * Google can't tie expertise to a real human.
 *
 * The author has its own public page at /author/[slug] which the post byline
 * links to. That page surfaces the credentials, social links, and posts they
 * authored — a strong EEAT signal.
 */
export const authorType = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Full name (Arabic)",
      description: "Real name. Will appear on every post byline.",
      type: "string",
      validation: (r) => r.required().min(3),
    }),
    defineField({
      name: "nameLatin",
      title: "Full name (Latin transliteration)",
      description: "For Google Knowledge Panel + structured data.",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description: "URL: /author/[slug]. Use Latin chars (e.g., 'ahmed-al-omari').",
      type: "slug",
      options: { source: "nameLatin", maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "role",
      title: "Role / title",
      description:
        "e.g., \"مهندس عزل ميداني\" or \"رئيس قسم العزل الحراري\". Specific is better than generic.",
      type: "string",
      validation: (r) => r.required().min(5),
    }),
    defineField({
      name: "photo",
      title: "Profile photo",
      description: "Real photo — not a logo or stock avatar.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (r) => r.required(),
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "bio",
      title: "Short bio",
      description:
        "100–300 words covering experience, specialisations, and notable projects. Surfaces on /author/[slug] and at the end of each post.",
      type: "richText",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "credentials",
      title: "Credentials",
      description:
        "Certifications, years of experience, professional licences (e.g., SCE registration), notable training.",
      type: "array",
      of: [{ type: "string" }],
      validation: (r) =>
        r.min(1).error("Add at least one credential for EEAT credibility."),
    }),
    defineField({
      name: "yearsExperience",
      title: "Years of experience",
      type: "number",
      validation: (r) => r.min(0).integer(),
    }),
    defineField({
      name: "socialLinks",
      title: "Social / professional links",
      description: "LinkedIn is the strongest signal — add it if available.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              options: {
                list: ["LinkedIn", "X / Twitter", "Instagram", "YouTube", "Website"],
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "url",
              type: "url",
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        },
      ],
    }),
    defineField({
      name: "email",
      title: "Public email",
      type: "string",
      validation: (r) => r.email(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
