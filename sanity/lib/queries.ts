/**
 * GROQ queries for the blog + author + case-study routes.
 *
 * Conventions:
 *  - Use defineQuery for type-safety when TypeGen is wired up later.
 *  - Always project _key on array items (required for React reconciliation
 *    and Visual Editing).
 *  - Use coalesce() in seo block so the consumer never has to null-check.
 *  - Author resolved as nested object so a single fetch carries everything
 *    the byline needs.
 */
import { defineQuery } from "next-sanity";

/* -------------------------------------------------------------------------- */
/*  Shared projections                                                        */
/* -------------------------------------------------------------------------- */

const SEO_PROJECTION = `
  "seo": {
    "title": coalesce(seo.title, title, ""),
    "description": coalesce(seo.description, tldr, ""),
    "ogImage": coalesce(seo.ogImage, heroImage),
    "noIndex": seo.noIndex == true,
    "focusKeyword": seo.focusKeyword,
    "relatedKeywords": seo.relatedKeywords
  }
`;

const AUTHOR_BYLINE_PROJECTION = `
  author->{
    _id,
    name,
    nameLatin,
    role,
    "slug": slug.current,
    photo { ..., alt },
    yearsExperience
  }
`;

const FAQ_PROJECTION = `faq[]{ _key, q, a }`;
const CITATIONS_PROJECTION = `citations[]{ _key, label, url, type }`;

/* -------------------------------------------------------------------------- */
/*  Blog index                                                                */
/* -------------------------------------------------------------------------- */

export const POSTS_INDEX_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && language == $lang]
  | order(coalesce(publishedAt, _createdAt) desc) [$start...$end] {
    _id,
    _type,
    title,
    "slug": slug.current,
    tldr,
    isPillar,
    publishedAt,
    updatedAt,
    heroImage { ..., alt, caption },
    ${AUTHOR_BYLINE_PROJECTION}
  }
`);

export const POSTS_COUNT_QUERY = defineQuery(`
  count(*[_type == "post" && defined(slug.current) && language == $lang])
`);

/* -------------------------------------------------------------------------- */
/*  Post detail                                                               */
/* -------------------------------------------------------------------------- */

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug && language == $lang][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    language,
    tldr,
    isPillar,
    publishedAt,
    updatedAt,
    heroImage { ..., alt, caption },
    body,
    ${FAQ_PROJECTION},
    ${CITATIONS_PROJECTION},
    relatedPosts[]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      tldr,
      heroImage { ..., alt }
    },
    relatedCityServices[]{ _key, citySlug, serviceSlug },
    ${AUTHOR_BYLINE_PROJECTION},
    "authorBio": author->{
      name,
      nameLatin,
      role,
      "slug": slug.current,
      photo { ..., alt },
      bio,
      credentials,
      yearsExperience,
      socialLinks
    },
    ${SEO_PROJECTION}
  }
`);

/* All slugs for static params generation. */
export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]{
    "slug": slug.current,
    language
  }
`);

/* -------------------------------------------------------------------------- */
/*  Author                                                                    */
/* -------------------------------------------------------------------------- */

export const AUTHOR_BY_SLUG_QUERY = defineQuery(`
  *[_type == "author" && slug.current == $slug][0]{
    _id,
    name,
    nameLatin,
    role,
    "slug": slug.current,
    photo { ..., alt },
    bio,
    credentials,
    yearsExperience,
    socialLinks,
    email,
    "posts": *[_type == "post" && references(^._id)]
      | order(coalesce(publishedAt, _createdAt) desc) [0...12] {
        _id,
        title,
        "slug": slug.current,
        tldr,
        publishedAt,
        heroImage { ..., alt }
      }
  }
`);

export const AUTHOR_SLUGS_QUERY = defineQuery(`
  *[_type == "author" && defined(slug.current)]{ "slug": slug.current }
`);

/* -------------------------------------------------------------------------- */
/*  Case study                                                                */
/* -------------------------------------------------------------------------- */

export const CASE_STUDIES_INDEX_QUERY = defineQuery(`
  *[_type == "caseStudy" && defined(slug.current) && language == $lang]
  | order(coalesce(publishedAt, _createdAt) desc) [$start...$end] {
    _id,
    _type,
    title,
    "slug": slug.current,
    tldr,
    publishedAt,
    neighborhood,
    serviceTypeSlug,
    clientType,
    heroImage { ..., alt }
  }
`);

export const CASE_STUDY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "caseStudy" && slug.current == $slug && language == $lang][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    language,
    tldr,
    publishedAt,
    updatedAt,
    clientName,
    clientType,
    neighborhood,
    serviceTypeSlug,
    heroImage { ..., alt, caption },
    problem,
    solution,
    workDetails,
    beforePhotos[]{ _key, ..., alt, caption },
    afterPhotos[]{ _key, ..., alt, caption },
    duration,
    results,
    testimonial,
    ${FAQ_PROJECTION},
    ${CITATIONS_PROJECTION},
    ${AUTHOR_BYLINE_PROJECTION},
    ${SEO_PROJECTION}
  }
`);

export const CASE_STUDY_SLUGS_QUERY = defineQuery(`
  *[_type == "caseStudy" && defined(slug.current)]{
    "slug": slug.current,
    language
  }
`);

/* -------------------------------------------------------------------------- */
/*  Sitemap                                                                   */
/* -------------------------------------------------------------------------- */

export const SITEMAP_URLS_QUERY = defineQuery(`
  *[_type in ["post", "caseStudy", "author"]
    && defined(slug.current)
    && (seo.noIndex != true)]
  {
    _type,
    "slug": slug.current,
    "lastModified": coalesce(updatedAt, publishedAt, _updatedAt)
  }
`);
