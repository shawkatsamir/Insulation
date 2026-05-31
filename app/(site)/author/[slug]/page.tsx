import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, Briefcase, Mail, ExternalLink } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  AUTHOR_BY_SLUG_QUERY,
  AUTHOR_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import type { AuthorDetail, AuthorSlug } from "@/sanity/lib/query-types";
import { PortableText } from "@/components/PortableText";
import { PostCard } from "@/components/PostCard";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { PersonJsonLd } from "@/components/JsonLdSanity";
import { pageMetadata } from "@/lib/seo";
import { canonical, SITE_URL } from "@/lib/url";

export const revalidate = 3600;

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = (await client
    .withConfig({ useCdn: false })
    .fetch(AUTHOR_SLUGS_QUERY)) as AuthorSlug[] | null;
  return (slugs ?? [])
    .filter((s) => s.slug)
    .map((s) => ({ slug: s.slug as string }));
}

async function fetchAuthor(slug: string): Promise<AuthorDetail | null> {
  return (await client.fetch(
    AUTHOR_BY_SLUG_QUERY,
    { slug },
    { next: { tags: [`author:${slug}`, "author"] } },
  )) as AuthorDetail | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await fetchAuthor(slug);
  if (!author) return {};
  return pageMetadata({
    title: `${author.name} — كاتب في مدونة عوازل مكة`,
    description: `${author.name}, ${author.role ?? ""}. ${author.yearsExperience ? `${author.yearsExperience} سنة خبرة. ` : ""}مقالات في العزل الحراري والمائي وكشف التسريبات.`,
    path: ["author", slug],
  });
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const author = await fetchAuthor(slug);
  if (!author) notFound();

  const photoUrl = author.photo?.asset
    ? urlFor(author.photo as Parameters<typeof urlFor>[0])
        .width(240)
        .height(240)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  const url = `${SITE_URL}/author/${slug}`;

  return (
    <>
      {/* Profile header */}
      <section className="bg-navy-900 text-white">
        <div className="container-page py-14 md:py-20">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {photoUrl && (
              <Image
                src={photoUrl}
                alt={author.photo?.alt ?? author.name ?? ""}
                width={160}
                height={160}
                priority
                className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-gold-400 shrink-0"
              />
            )}
            <div>
              <span className="text-gold-400 font-bold text-sm">كاتب</span>
              <h1 className="mt-2 text-3xl md:text-5xl font-extrabold">
                {author.name}
              </h1>
              {author.role && (
                <p className="mt-2 text-lg text-navy-100">{author.role}</p>
              )}

              <div className="mt-5 flex flex-wrap gap-4 text-sm">
                {author.yearsExperience != null && (
                  <span className="flex items-center gap-1.5 text-navy-100">
                    <Briefcase className="h-4 w-4 text-gold-400" aria-hidden />
                    {author.yearsExperience} سنة خبرة
                  </span>
                )}
                {author.email && (
                  <a
                    href={`mailto:${author.email}`}
                    className="flex items-center gap-1.5 text-navy-100 hover:text-gold-400"
                  >
                    <Mail className="h-4 w-4 text-gold-400" aria-hidden />
                    {author.email}
                  </a>
                )}
                {(author.socialLinks ?? []).map((s, i) => (
                  s?.url && (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-1.5 text-navy-100 hover:text-gold-400"
                    >
                      <ExternalLink className="h-4 w-4 text-gold-400" aria-hidden />
                      {s.platform}
                    </a>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio + credentials */}
      <section className="container-page section-y">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy-900 mb-4">
              السيرة المهنية
            </h2>
            {author.bio ? (
              <PortableText value={author.bio} />
            ) : (
              <p className="text-navy-600">لم تتم إضافة السيرة بعد.</p>
            )}
          </div>
          {author.credentials && author.credentials.length > 0 && (
            <aside className="rounded-2xl border border-navy-100 bg-navy-50 p-6">
              <h3 className="text-lg font-extrabold text-navy-900 flex items-center gap-2">
                <Award className="h-5 w-5 text-gold-500" aria-hidden />
                الشهادات والمؤهلات
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-navy-800">
                {author.credentials.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span aria-hidden className="text-gold-500 mt-1">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </section>

      {/* Posts by this author */}
      {author.posts && author.posts.length > 0 && (
        <section className="bg-navy-50">
          <div className="container-page section-y">
            <header className="mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-navy-900">
                مقالات {author.name}
              </h2>
            </header>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {author.posts.map((p) => (
                <PostCard
                  key={p._id}
                  href={`/blog/${p.slug}`}
                  title={p.title ?? ""}
                  tldr={p.tldr}
                  publishedAt={p.publishedAt}
                  heroImage={p.heroImage}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <PersonJsonLd author={author} url={url} />
      <BreadcrumbJsonLd
        items={[
          { name: "الرئيسية", url: canonical() },
          { name: "المدونة", url: canonical("blog") },
          { name: author.name ?? "", url },
        ]}
      />
    </>
  );
}
