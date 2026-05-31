import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft, BookOpen, ExternalLink } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  POST_BY_SLUG_QUERY,
  POST_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import type { PostDetail, PostSlug } from "@/sanity/lib/query-types";
import { PortableText } from "@/components/PortableText";
import { PostCard } from "@/components/PostCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { ArticleJsonLd } from "@/components/JsonLdSanity";
import { getCity, getService } from "@/content";
import { pageMetadata } from "@/lib/seo";
import { canonical } from "@/lib/url";

const DEFAULT_LANG = "ar";
// ISR — revalidate hourly; webhook on publish invalidates the `post:[slug]` tag.
export const revalidate = 3600;

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = (await client
    .withConfig({ useCdn: false })
    .fetch(POST_SLUGS_QUERY)) as PostSlug[] | null;
  return (slugs ?? [])
    .filter((s) => s.slug && s.language === DEFAULT_LANG)
    .map((s) => ({ slug: s.slug as string }));
}

/**
 * Next.js hands the dynamic `[slug]` segment to us *percent-encoded* for
 * non-ASCII (Arabic) slugs. Our `slug.current` values are stored decoded, so we
 * must decodeURIComponent before querying or every post 404s. decodeURIComponent
 * can throw on a malformed `%` sequence, so we fall back to the raw value.
 */
function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

async function fetchPost(slug: string): Promise<PostDetail | null> {
  const decoded = decodeSlug(slug);
  return (await client.fetch(
    POST_BY_SLUG_QUERY,
    { slug: decoded, lang: DEFAULT_LANG },
    { next: { tags: [`post:${decoded}`, "post"] } },
  )) as PostDetail | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) return {};
  // Guard on .asset, not bare truthiness: the SEO projection coalesces ogImage
  // to heroImage, and an image object can carry alt/caption metadata with NO
  // uploaded asset. urlFor().url() throws "Unable to resolve image URL from
  // source" on an asset-less object, which crashes the prerender.
  const ogImage = post.seo?.ogImage?.asset
    ? urlFor(post.seo.ogImage as Parameters<typeof urlFor>[0])
        .width(1200)
        .height(630)
        .fit("crop")
        .auto("format")
        .url()
    : undefined;
  return pageMetadata({
    title: post.seo?.title || post.title || "",
    description:
      post.seo?.description ||
      post.tldr ||
      "مقال من مدونة عوازل مكة عن خدمات العزل وكشف التسريبات في مكة المكرمة.",
    // Build the canonical from the stored slug (slug.current, decoded), NOT the
    // URL param — params.slug arrives percent-encoded, and canonical() encodes
    // again, producing a double-encoded URL that mismatches the sitemap and
    // breaks Google indexing.
    path: ["blog", post.slug ?? decodeSlug(slug)],
    image: ogImage,
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) notFound();

  const heroUrl = post.heroImage?.asset
    ? urlFor(post.heroImage as Parameters<typeof urlFor>[0])
        .width(1600)
        .height(900)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  const authorPhotoUrl = post.author?.photo?.asset
    ? urlFor(post.author.photo as Parameters<typeof urlFor>[0])
        .width(96)
        .height(96)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  const url = canonical("blog", post.slug ?? decodeSlug(slug));

  return (
    <>
      {/* HERO */}
      <section className="bg-navy-900 text-white">
        <div className="container-page py-12 md:py-16">
          <nav
            className="text-xs text-navy-200 mb-4 flex flex-wrap gap-2"
            aria-label="مسار التنقل"
          >
            <Link href="/" className="hover:text-gold-400">الرئيسية</Link>
            <span aria-hidden>/</span>
            <Link href="/blog" className="hover:text-gold-400">المدونة</Link>
            <span aria-hidden>/</span>
            <span className="text-white">{post.title}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl">
            {post.title}
          </h1>

          {/* Byline */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-navy-100">
            {post.author && (
              <Link
                href={`/author/${post.author.slug}`}
                className="flex items-center gap-3 hover:text-gold-400 transition-colors"
              >
                {authorPhotoUrl && (
                  <Image
                    src={authorPhotoUrl}
                    alt={post.author.photo?.alt ?? post.author.name ?? ""}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-gold-400"
                  />
                )}
                <span>
                  <span className="block font-bold text-white">
                    {post.author.name}
                  </span>
                  {post.author.role && (
                    <span className="block text-xs text-navy-200">
                      {post.author.role}
                    </span>
                  )}
                </span>
              </Link>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" aria-hidden />
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </span>
            )}
            {post.updatedAt && post.updatedAt !== post.publishedAt && (
              <span className="text-xs text-navy-300">
                · آخر تحديث{" "}
                {new Date(post.updatedAt).toLocaleDateString("ar-SA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* HERO IMAGE */}
      {heroUrl && (
        <div className="container-page -mt-6 md:-mt-10 relative z-10">
          <figure className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-lg">
            <Image
              src={heroUrl}
              alt={post.heroImage?.alt ?? post.title ?? ""}
              width={1600}
              height={900}
              priority
              sizes="(min-width: 1024px) 1200px, 100vw"
              className="w-full h-auto"
            />
            {post.heroImage?.caption && (
              <figcaption className="px-4 py-3 text-sm text-navy-600 bg-navy-50 text-center">
                {post.heroImage.caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}

      {/* BODY */}
      <article className="container-page section-y pt-10">
        <div className="mx-auto max-w-3xl">
          {/* TLDR */}
          {post.tldr && (
            <aside
              className="mb-8 rounded-2xl border border-gold-300 bg-gold-50 p-5"
              aria-label="ملخص سريع"
            >
              <div className="flex items-center gap-2 text-gold-700 text-xs font-bold uppercase tracking-wider mb-2">
                <BookOpen className="h-4 w-4" aria-hidden />
                ملخص سريع
              </div>
              <p className="text-navy-900 leading-relaxed">{post.tldr}</p>
            </aside>
          )}

          {/* Body */}
          <PortableText value={post.body} />

          {/* Citations */}
          {post.citations && post.citations.length > 0 && (
            <section className="mt-12 rounded-2xl border border-navy-100 bg-navy-50 p-6">
              <h2 className="text-xl font-extrabold text-navy-900 mb-4">
                المصادر والمراجع
              </h2>
              <ul className="space-y-2 text-sm">
                {post.citations.map((c) => (
                  <li key={c._key} className="flex items-start gap-2">
                    <ExternalLink
                      className="h-4 w-4 mt-1 shrink-0 text-gold-500"
                      aria-hidden
                    />
                    <a
                      href={c.url!}
                      target="_blank"
                      rel="noopener nofollow"
                      className="text-navy-800 hover:text-navy-900 underline decoration-gold-400 underline-offset-2"
                    >
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>

      {/* FAQ */}
      {post.faq && post.faq.length > 0 && (
        <section className="container-page section-y pt-0">
          <div className="mx-auto max-w-3xl">
            <header className="mb-8">
              <span className="text-gold-600 font-bold text-sm">أسئلة شائعة</span>
              <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-navy-900">
                أسئلة شائعة حول الموضوع
              </h2>
            </header>
            <FAQAccordion
              faqs={post.faq
                .filter((f) => f.q && f.a)
                .map((f) => ({ q: f.q as string, a: f.a as string }))}
            />
          </div>
        </section>
      )}

      {/* RELATED CITY × SERVICE */}
      {post.relatedCityServices && post.relatedCityServices.length > 0 && (
        <section className="bg-navy-50">
          <div className="container-page section-y">
            <header className="max-w-2xl mb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-navy-900">
                خدمات قد تهمك
              </h2>
            </header>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {post.relatedCityServices.map((rc) => {
                const city = getCity(rc.citySlug ?? "");
                const service = getService(rc.serviceSlug ?? "");
                if (!city || !service) return null;
                return (
                  <Link
                    key={rc._key}
                    href={`/${encodeURIComponent(rc.citySlug!)}/${encodeURIComponent(rc.serviceSlug!)}`}
                    className="group flex items-center justify-between rounded-lg border border-navy-100 bg-white px-4 py-3 text-sm hover:border-gold-300 hover:bg-gold-50 transition-colors"
                  >
                    <span className="text-navy-800 font-medium">
                      <strong className="text-navy-900">
                        {service.shortName}
                      </strong>{" "}
                      في {city.name}
                    </span>
                    <ArrowLeft
                      className="h-4 w-4 text-navy-400 group-hover:text-gold-600 transition-colors group-hover:-translate-x-1"
                      aria-hidden
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* RELATED POSTS */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <section className="container-page section-y">
          <header className="max-w-2xl mb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy-900">
              مقالات ذات صلة
            </h2>
          </header>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {post.relatedPosts.map((rp) => (
              <PostCard
                key={rp._id}
                href={
                  rp._type === "caseStudy"
                    ? `/case-study/${rp.slug}`
                    : `/blog/${rp.slug}`
                }
                title={rp.title ?? ""}
                tldr={rp.tldr}
                heroImage={rp.heroImage}
                size="compact"
              />
            ))}
          </div>
        </section>
      )}

      {/* AUTHOR BIO */}
      {post.authorBio && (
        <section className="bg-navy-50">
          <div className="container-page section-y">
            <div className="mx-auto max-w-3xl rounded-2xl border border-navy-100 bg-white p-6 md:p-8">
              <div className="flex flex-col sm:flex-row gap-5">
                {authorPhotoUrl && (
                  <Image
                    src={authorPhotoUrl}
                    alt={post.authorBio.photo?.alt ?? post.authorBio.name ?? ""}
                    width={96}
                    height={96}
                    className="h-20 w-20 rounded-full border-2 border-gold-400 shrink-0"
                  />
                )}
                <div>
                  <div className="text-xs text-navy-500 font-bold uppercase tracking-wider mb-1">
                    عن كاتب المقال
                  </div>
                  <h3 className="text-xl font-extrabold text-navy-900">
                    {post.authorBio.name}
                  </h3>
                  {post.authorBio.role && (
                    <p className="text-sm text-navy-600">
                      {post.authorBio.role}
                    </p>
                  )}
                  {post.authorBio.bio && (
                    <div className="mt-3 text-sm">
                      <PortableText value={post.authorBio.bio} />
                    </div>
                  )}
                  <Link
                    href={`/author/${post.authorBio.slug}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-navy-900 hover:text-gold-600"
                  >
                    عرض جميع المقالات
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <ArticleJsonLd post={post} url={url} />
      {post.faq && post.faq.length > 0 && (
        <FAQPageJsonLd
          faqs={post.faq
            .filter((f) => f.q && f.a)
            .map((f) => ({ q: f.q as string, a: f.a as string }))}
        />
      )}
      <BreadcrumbJsonLd
        items={[
          { name: "الرئيسية", url: canonical() },
          { name: "المدونة", url: canonical("blog") },
          { name: post.title ?? "", url },
        ]}
      />
    </>
  );
}
