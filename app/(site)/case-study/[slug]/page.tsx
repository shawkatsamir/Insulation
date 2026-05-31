import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Clock, CheckCircle2, Quote, ArrowLeft } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  CASE_STUDY_BY_SLUG_QUERY,
  CASE_STUDY_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import type {
  CaseStudyDetail,
  CaseStudySlug,
} from "@/sanity/lib/query-types";
import { PortableText } from "@/components/PortableText";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { ArticleJsonLd } from "@/components/JsonLdSanity";
import { getCity, getService } from "@/content";
import { pageMetadata } from "@/lib/seo";
import { canonical } from "@/lib/url";

const DEFAULT_LANG = "ar";
export const revalidate = 3600;

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = (await client
    .withConfig({ useCdn: false })
    .fetch(CASE_STUDY_SLUGS_QUERY)) as CaseStudySlug[] | null;
  return (slugs ?? [])
    .filter((s) => s.slug && s.language === DEFAULT_LANG)
    .map((s) => ({ slug: s.slug as string }));
}

// Next hands non-ASCII (Arabic) dynamic segments to us percent-encoded, but
// slug.current is stored decoded — decode before querying or every doc 404s.
function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

async function fetchCaseStudy(slug: string): Promise<CaseStudyDetail | null> {
  const decoded = decodeSlug(slug);
  return (await client.fetch(
    CASE_STUDY_BY_SLUG_QUERY,
    { slug: decoded, lang: DEFAULT_LANG },
    { next: { tags: [`caseStudy:${decoded}`, "caseStudy"] } },
  )) as CaseStudyDetail | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = await fetchCaseStudy(slug);
  if (!cs) return {};
  const ogImage = cs.seo?.ogImage
    ? urlFor(cs.seo.ogImage as Parameters<typeof urlFor>[0])
        .width(1200)
        .height(630)
        .fit("crop")
        .auto("format")
        .url()
    : undefined;
  return pageMetadata({
    title: cs.seo?.title || cs.title || "",
    description: cs.seo?.description || cs.tldr || "",
    path: ["case-study", slug],
    image: ogImage,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const cs = await fetchCaseStudy(slug);
  if (!cs) notFound();

  const heroUrl = cs.heroImage?.asset
    ? urlFor(cs.heroImage as Parameters<typeof urlFor>[0])
        .width(1600)
        .height(900)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  const city = cs.neighborhood ? getCity(cs.neighborhood) : null;
  const service = cs.serviceTypeSlug ? getService(cs.serviceTypeSlug) : null;
  const url = canonical("case-study", slug);

  return (
    <>
      <section className="bg-navy-900 text-white">
        <div className="container-page py-12 md:py-16">
          <nav
            className="text-xs text-navy-200 mb-4 flex flex-wrap gap-2"
            aria-label="مسار التنقل"
          >
            <Link href="/" className="hover:text-gold-400">الرئيسية</Link>
            <span aria-hidden>/</span>
            <Link href="/blog" className="hover:text-gold-400">حالات الدراسة</Link>
            <span aria-hidden>/</span>
            <span className="text-white">{cs.title}</span>
          </nav>

          <span className="text-gold-400 font-bold text-sm">حالة دراسية</span>
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl">
            {cs.title}
          </h1>

          <div className="mt-5 flex flex-wrap gap-4 text-sm text-navy-100">
            {city && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gold-400" aria-hidden />
                {city.name}
              </span>
            )}
            {service && <span>{service.name}</span>}
            {cs.duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-gold-400" aria-hidden />
                {cs.duration}
              </span>
            )}
            {cs.publishedAt && (
              <time
                dateTime={cs.publishedAt}
                className="flex items-center gap-1.5"
              >
                <Calendar className="h-4 w-4 text-gold-400" aria-hidden />
                {new Date(cs.publishedAt).toLocaleDateString("ar-SA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>
        </div>
      </section>

      {heroUrl && (
        <div className="container-page -mt-6 md:-mt-10 relative z-10">
          <figure className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-lg">
            <Image
              src={heroUrl}
              alt={cs.heroImage?.alt ?? cs.title ?? ""}
              width={1600}
              height={900}
              priority
              sizes="(min-width: 1024px) 1200px, 100vw"
              className="w-full h-auto"
            />
          </figure>
        </div>
      )}

      <article className="container-page section-y pt-10">
        <div className="mx-auto max-w-3xl">
          {cs.tldr && (
            <aside className="mb-8 rounded-2xl border border-gold-300 bg-gold-50 p-5">
              <p className="text-navy-900 leading-relaxed">{cs.tldr}</p>
            </aside>
          )}

          {cs.problem && (
            <section>
              <h2 className="mt-8 mb-3 text-2xl md:text-3xl font-extrabold text-navy-900">
                المشكلة
              </h2>
              <p className="text-navy-800 leading-relaxed whitespace-pre-line">
                {cs.problem}
              </p>
            </section>
          )}

          {cs.solution && (
            <section>
              <h2 className="mt-8 mb-3 text-2xl md:text-3xl font-extrabold text-navy-900">
                الحل
              </h2>
              <p className="text-navy-800 leading-relaxed whitespace-pre-line">
                {cs.solution}
              </p>
            </section>
          )}

          {cs.workDetails && (
            <section className="mt-8">
              <h2 className="mb-3 text-2xl md:text-3xl font-extrabold text-navy-900">
                تفاصيل العمل
              </h2>
              <PortableText value={cs.workDetails} />
            </section>
          )}

          {/* Before / After */}
          {(cs.beforePhotos?.length || cs.afterPhotos?.length) && (
            <section className="mt-10">
              <h2 className="mb-4 text-2xl md:text-3xl font-extrabold text-navy-900">
                قبل وبعد
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <PhotoColumn
                  title="قبل"
                  photos={cs.beforePhotos ?? []}
                  tint="bg-red-50 border-red-200"
                />
                <PhotoColumn
                  title="بعد"
                  photos={cs.afterPhotos ?? []}
                  tint="bg-green-50 border-green-200"
                />
              </div>
            </section>
          )}

          {/* Results */}
          {cs.results && cs.results.length > 0 && (
            <section className="mt-10 rounded-2xl border border-navy-100 bg-navy-50 p-6">
              <h2 className="text-xl font-extrabold text-navy-900 mb-4">
                النتائج
              </h2>
              <ul className="space-y-2 text-sm text-navy-800">
                {cs.results.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2
                      className="h-5 w-5 mt-0.5 shrink-0 text-green-600"
                      aria-hidden
                    />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Testimonial */}
          {cs.testimonial?.quote && (
            <blockquote className="mt-10 rounded-2xl border-r-4 border-gold-500 bg-white p-6">
              <Quote className="h-8 w-8 text-gold-400" aria-hidden />
              <p className="mt-3 text-lg text-navy-900 italic">
                «{cs.testimonial.quote}»
              </p>
              {cs.testimonial.attribution && (
                <footer className="mt-3 text-sm text-navy-600 font-bold">
                  — {cs.testimonial.attribution}
                </footer>
              )}
            </blockquote>
          )}
        </div>
      </article>

      {/* FAQ */}
      {cs.faq && cs.faq.length > 0 && (
        <section className="container-page section-y pt-0">
          <div className="mx-auto max-w-3xl">
            <header className="mb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-navy-900">
                أسئلة شائعة
              </h2>
            </header>
            <FAQAccordion
              faqs={cs.faq
                .filter((f) => f.q && f.a)
                .map((f) => ({ q: f.q as string, a: f.a as string }))}
            />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-navy-900 text-white">
        <div className="container-page py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold">
            تحتاج نفس الخدمة لمنزلك؟
          </h2>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-base font-bold text-navy-900 hover:bg-gold-400"
          >
            احصل على عرض سعر
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </section>

      <ArticleJsonLd post={cs} url={url} />
      {cs.faq && cs.faq.length > 0 && (
        <FAQPageJsonLd
          faqs={cs.faq
            .filter((f) => f.q && f.a)
            .map((f) => ({ q: f.q as string, a: f.a as string }))}
        />
      )}
      <BreadcrumbJsonLd
        items={[
          { name: "الرئيسية", url: canonical() },
          { name: "المدونة", url: canonical("blog") },
          { name: cs.title ?? "", url },
        ]}
      />
    </>
  );
}

function PhotoColumn({
  title,
  photos,
  tint,
}: {
  title: string;
  photos: { _key?: string; alt?: string; caption?: string; asset?: { _ref?: string } }[];
  tint: string;
}) {
  if (!photos || photos.length === 0) return null;
  return (
    <div className={`rounded-2xl border p-4 ${tint}`}>
      <h3 className="text-lg font-extrabold text-navy-900 mb-3">{title}</h3>
      <div className="grid gap-3">
        {photos.map((p) => {
          const u = p.asset
            ? urlFor(p as Parameters<typeof urlFor>[0])
                .width(800)
                .height(600)
                .fit("crop")
                .auto("format")
                .url()
            : null;
          return u ? (
            <figure key={p._key} className="overflow-hidden rounded-lg">
              <Image
                src={u}
                alt={p.alt ?? ""}
                width={800}
                height={600}
                sizes="(min-width: 768px) 400px, 100vw"
                className="w-full h-auto"
              />
              {p.caption && (
                <figcaption className="mt-1 text-xs text-navy-600">
                  {p.caption}
                </figcaption>
              )}
            </figure>
          ) : null;
        })}
      </div>
    </div>
  );
}
