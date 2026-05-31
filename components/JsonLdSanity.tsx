import { business } from "@/content";
import { urlFor } from "@/sanity/lib/image";
import { SITE_URL } from "@/lib/url";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Sanity-aware JSON-LD emitters. Kept separate from components/JsonLd.tsx
 * because these depend on the Sanity image builder and the dynamic shape
 * of fetched documents.
 */

function Script({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type Img =
  | { asset?: { _ref?: string } | null; alt?: string | null }
  | null
  | undefined;
function imgUrl(img: Img, w = 1200): string | undefined {
  if (!img?.asset) return undefined;
  return urlFor(img as any).width(w).fit("max").auto("format").url();
}

export function ArticleJsonLd({
  post,
  url,
}: {
  post: {
    title?: string | null;
    tldr?: string | null;
    publishedAt?: string | null;
    updatedAt?: string | null;
    heroImage?: Img;
    author?: {
      name?: string | null;
      slug?: string | null;
      nameLatin?: string | null;
    } | null;
  };
  url: string;
}) {
  const data: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.tldr,
    image: imgUrl(post.heroImage) ?? `${business.url}/imgs/insulation-hero.webp`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    publisher: {
      "@type": "Organization",
      name: business.name,
      logo: { "@type": "ImageObject", url: `${business.url}/favicon/web-app-manifest-512x512.png` },
    },
  };
  if (post.author?.name) {
    data.author = {
      "@type": "Person",
      name: post.author.name,
      ...(post.author.nameLatin ? { alternateName: post.author.nameLatin } : {}),
      ...(post.author.slug ? { url: `${SITE_URL}/author/${post.author.slug}` } : {}),
    };
  }
  return <Script data={data} />;
}

export function PersonJsonLd({
  author,
  url,
}: {
  author: {
    name?: string | null;
    nameLatin?: string | null;
    role?: string | null;
    photo?: Img;
    socialLinks?: { platform?: string | null; url?: string | null }[] | null;
    yearsExperience?: number | null;
  };
  url: string;
}) {
  const data: any = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    ...(author.nameLatin ? { alternateName: author.nameLatin } : {}),
    jobTitle: author.role,
    image: imgUrl(author.photo, 600),
    url,
    worksFor: { "@type": "Organization", name: business.name, url: business.url },
    sameAs: (author.socialLinks ?? [])
      .map((s) => s?.url)
      .filter(Boolean),
  };
  return <Script data={data} />;
}
