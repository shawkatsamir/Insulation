import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, ArrowLeft } from "lucide-react";
import { client } from "@/sanity/lib/client";
import {
  postsIndexQuery,
  POSTS_COUNT_QUERY,
} from "@/sanity/lib/queries";
import type { PostCardData } from "@/sanity/lib/query-types";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { PostCard } from "@/components/PostCard";
import { pageMetadata } from "@/lib/seo";
import { canonical } from "@/lib/url";

const PAGE_SIZE = 12;
const DEFAULT_LANG = "ar";

// Revalidate the blog index hourly; webhook invalidation also covered by the
// 'post' tag in app/api/revalidate/route.ts.
export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "المدونة — أدلة العزل وكشف التسريبات في مكة المكرمة",
    description:
      "مقالات وأدلة متخصصة من فريق عوازل مكة عن العزل الحراري والمائي، عزل الأسطح والخزانات والمسابح، وكشف التسريبات بدون تكسير.",
    path: ["blog"],
  });
}

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const [posts, total] = (await Promise.all([
    client.fetch(
      postsIndexQuery(start, end),
      { lang: DEFAULT_LANG },
      { next: { tags: ["post"] } },
    ),
    client.fetch(
      POSTS_COUNT_QUERY,
      { lang: DEFAULT_LANG },
      { next: { tags: ["post"] } },
    ),
  ])) as [PostCardData[] | null, number | null];

  const totalPages = Math.max(1, Math.ceil((total ?? 0) / PAGE_SIZE));
  const hasPosts = (posts ?? []).length > 0;

  return (
    <>
      <section className="bg-navy-900 text-white">
        <div className="container-page py-16 md:py-20">
          <span className="text-gold-400 font-bold text-sm">المدونة</span>
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold">
            أدلة العزل وكشف التسريبات
          </h1>
          <p className="mt-3 max-w-2xl text-navy-100">
            مقالات تقنية مبنية على خبرة ميدانية في مكة المكرمة وما حولها — من
            عزل الأسطح والخزانات إلى كشف التسربات بدون تكسير.
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        {hasPosts ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts!.map((p) => (
                <PostCard
                  key={p._id}
                  href={`/blog/${p.slug}`}
                  title={p.title ?? ""}
                  tldr={p.tldr}
                  publishedAt={p.publishedAt}
                  heroImage={p.heroImage}
                  author={p.author}
                  isPillar={!!p.isPillar}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination current={page} total={totalPages} />
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </section>

      <BreadcrumbJsonLd
        items={[
          { name: "الرئيسية", url: canonical() },
          { name: "المدونة", url: canonical("blog") },
        ]}
      />
    </>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <Newspaper className="mx-auto h-12 w-12 text-gold-500" aria-hidden />
      <h2 className="mt-5 text-2xl md:text-3xl font-extrabold text-navy-900">
        المدونة قادمة قريباً
      </h2>
      <p className="mt-3 max-w-xl mx-auto text-navy-700">
        نعمل على إعداد محتوى متخصص يساعدك على فهم خيارات العزل والصيانة في
        مكة المكرمة. تابعنا قريباً.
      </p>
      <Link
        href="/services"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-base font-bold text-navy-900 hover:bg-gold-400"
      >
        تصفح خدماتنا
        <ArrowLeft className="h-5 w-5" aria-hidden />
      </Link>
    </div>
  );
}

function Pagination({ current, total }: { current: number; total: number }) {
  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="ترقيم الصفحات">
      {current > 1 && (
        <Link
          href={current - 1 === 1 ? "/blog" : `/blog?page=${current - 1}`}
          className="rounded-lg border border-navy-200 px-4 py-2 text-sm font-bold text-navy-900 hover:bg-navy-50"
        >
          السابق
        </Link>
      )}
      <span className="px-3 text-sm text-navy-600">
        صفحة {current} من {total}
      </span>
      {current < total && (
        <Link
          href={`/blog?page=${current + 1}`}
          className="rounded-lg border border-navy-200 px-4 py-2 text-sm font-bold text-navy-900 hover:bg-navy-50"
        >
          التالي
        </Link>
      )}
    </nav>
  );
}
