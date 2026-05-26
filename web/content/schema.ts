import { z } from "zod";

/**
 * These schemas mirror the eventual Sanity document types 1:1.
 * When the blog/Sanity phase lands, swap the JSON data source for `client.fetch`
 * with matching GROQ projections — the consumers don't change.
 */

const slugRegex = /^[ء-ي0-9-]+$/;

export const slugSchema = z
  .string()
  .min(1)
  .regex(slugRegex, "Slug must be Arabic letters, digits, or hyphens.");

export const faqItemSchema = z.object({
  q: z.string().min(8),
  a: z.string().min(20),
});

export const reviewSchema = z.object({
  author: z.string().min(2),
  rating: z.number().int().min(1).max(5),
  body: z.string().min(20),
  city: slugSchema.optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const serviceSchema = z.object({
  slug: slugSchema,
  name: z.string().min(2),
  shortName: z.string().min(2),
  tagline: z.string().min(10),
  description: z.string().min(60),
  features: z.array(z.string().min(4)).min(3).max(8),
  iconKey: z.enum([
    "roof",
    "tank",
    "bath",
    "leak",
    "wrench",
    "thermal",
    "water",
    "foam",
    "pool",
  ]),
  // Sources used by city×service overrides as boilerplate fallbacks.
  defaultIntro: z.string().min(120),
  defaultFAQs: z.array(faqItemSchema).min(3),
  image: z.string().startsWith("/").optional(),
});

export const citySchema = z.object({
  slug: slugSchema,
  name: z.string().min(2),
  // Parent city for neighborhoods (e.g., 'مكة'); top-level cities omit this.
  parent: slugSchema.optional(),
  isNeighborhood: z.boolean().default(false),
  // 1-3 short sentences about landmarks, climate, or building stock —
  // injected into every city×service page so each combo has genuinely
  // unique copy that justifies a separate URL to Google.
  localContext: z.string().min(60),
  // Optional facts the page generator can interpolate into copy.
  population: z.number().int().positive().optional(),
  coords: z
    .object({ lat: z.number(), lng: z.number() })
    .optional(),
});

export const cityServiceOverrideSchema = z.object({
  citySlug: slugSchema,
  serviceSlug: slugSchema,
  // ≥550-char unique intro — the build-time uniqueness gate.
  // Char count works better than word count for Arabic, which has fewer
  // but longer words than English. 550 chars ≈ 80–100 Arabic words ≈
  // 120–150 English-equivalent words, plenty to look "substantively unique"
  // to search engines.
  intro: z.string().refine(
    (s) => s.length >= 550,
    "Intro must be at least 550 characters to avoid duplicate-content risk.",
  ),
  // Required to enforce locally-grounded content.
  localContext: z.string().min(40),
  faqs: z.array(faqItemSchema).min(3),
  // Optional ordered list of subsections beyond the intro/FAQs.
  bullets: z.array(z.string().min(10)).optional(),
});

export const businessSchema = z.object({
  name: z.string(),
  legalName: z.string(),
  phone: z.string().regex(/^\+\d{6,}$/),
  whatsappE164: z.string().regex(/^\d{6,}$/),
  email: z.string().email(),
  url: z.string().url(),
  address: z.object({
    streetAddress: z.string(),
    addressLocality: z.string(),
    addressRegion: z.string(),
    addressCountry: z.string().length(2),
  }),
  openingHours: z.string(),
  priceRange: z.string(),
  rating: z.object({
    value: z.number().min(1).max(5),
    count: z.number().int().positive(),
  }),
  social: z.object({
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    twitter: z.string().url().optional(),
  }),
});

export type Slug = z.infer<typeof slugSchema>;
export type FAQItem = z.infer<typeof faqItemSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type City = z.infer<typeof citySchema>;
export type CityServiceOverride = z.infer<typeof cityServiceOverrideSchema>;
export type Business = z.infer<typeof businessSchema>;
