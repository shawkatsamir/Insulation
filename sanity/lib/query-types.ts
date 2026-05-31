/**
 * Hand-rolled types for the GROQ query results.
 *
 * Why hand-rolled instead of generated types: Sanity TypeGen requires Node 20+
 * to run, but we're constrained to Node 18 by the USB-drive environment. When
 * we eventually upgrade Node, we can run `npx sanity typegen generate` and
 * replace this file with the generated `sanity.types.ts`.
 *
 * Until then, these shapes mirror the projections in `queries.ts` exactly.
 * If you change a projection, update the matching type here.
 */
import type { PortableTextBlock } from "@portabletext/react";

type SanityRef = { _ref?: string; _type?: string };

export type SanityImage = {
  _type?: "image";
  asset?: SanityRef;
  alt?: string;
  caption?: string;
};

export type AuthorByline = {
  _id: string;
  name?: string | null;
  nameLatin?: string | null;
  role?: string | null;
  slug?: string | null;
  photo?: SanityImage | null;
  yearsExperience?: number | null;
};

export type FaqItem = { _key: string; q?: string | null; a?: string | null };

export type Citation = {
  _key: string;
  label?: string | null;
  url?: string | null;
  type?: string | null;
};

export type SocialLink = {
  platform?: string | null;
  url?: string | null;
};

export type CityServiceRef = {
  _key: string;
  citySlug?: string | null;
  serviceSlug?: string | null;
};

export type ResolvedSeo = {
  title: string;
  description: string;
  ogImage?: SanityImage | null;
  noIndex: boolean;
  focusKeyword?: string | null;
  relatedKeywords?: string[] | null;
};

/* -------------------------------------------------------------------------- */
/*  Posts                                                                     */
/* -------------------------------------------------------------------------- */

export type PostCardData = {
  _id: string;
  _type: "post";
  title?: string | null;
  slug?: string | null;
  tldr?: string | null;
  isPillar?: boolean | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  heroImage?: SanityImage | null;
  author?: AuthorByline | null;
};

export type PostDetail = PostCardData & {
  language?: string | null;
  body?: PortableTextBlock[] | null;
  faq?: FaqItem[] | null;
  citations?: Citation[] | null;
  relatedPosts?: RelatedPostRef[] | null;
  relatedCityServices?: CityServiceRef[] | null;
  authorBio?: AuthorDetail | null;
  seo?: ResolvedSeo | null;
};

export type RelatedPostRef = {
  _id: string;
  _type: "post" | "caseStudy";
  title?: string | null;
  slug?: string | null;
  tldr?: string | null;
  heroImage?: SanityImage | null;
};

export type PostSlug = {
  slug?: string | null;
  language?: string | null;
};

/* -------------------------------------------------------------------------- */
/*  Author                                                                    */
/* -------------------------------------------------------------------------- */

export type AuthorDetail = {
  _id?: string;
  name?: string | null;
  nameLatin?: string | null;
  role?: string | null;
  slug?: string | null;
  photo?: SanityImage | null;
  bio?: PortableTextBlock[] | null;
  credentials?: string[] | null;
  yearsExperience?: number | null;
  socialLinks?: SocialLink[] | null;
  email?: string | null;
  posts?: PostCardData[] | null;
};

export type AuthorSlug = { slug?: string | null };

/* -------------------------------------------------------------------------- */
/*  Case study                                                                */
/* -------------------------------------------------------------------------- */

export type CaseStudyCardData = {
  _id: string;
  _type: "caseStudy";
  title?: string | null;
  slug?: string | null;
  tldr?: string | null;
  publishedAt?: string | null;
  neighborhood?: string | null;
  serviceTypeSlug?: string | null;
  clientType?: string | null;
  heroImage?: SanityImage | null;
};

export type CaseStudyDetail = CaseStudyCardData & {
  language?: string | null;
  updatedAt?: string | null;
  clientName?: string | null;
  problem?: string | null;
  solution?: string | null;
  workDetails?: PortableTextBlock[] | null;
  beforePhotos?: SanityImage[] | null;
  afterPhotos?: SanityImage[] | null;
  duration?: string | null;
  results?: string[] | null;
  testimonial?: { quote?: string | null; attribution?: string | null } | null;
  faq?: FaqItem[] | null;
  citations?: Citation[] | null;
  author?: AuthorByline | null;
  seo?: ResolvedSeo | null;
};

export type CaseStudySlug = {
  slug?: string | null;
  language?: string | null;
};

/* -------------------------------------------------------------------------- */
/*  Sitemap                                                                   */
/* -------------------------------------------------------------------------- */

export type SitemapUrl = {
  _type: "post" | "caseStudy" | "author";
  slug?: string | null;
  lastModified?: string | null;
};
