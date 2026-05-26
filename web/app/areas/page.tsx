import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowLeft } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { topLevelCities, makkahNeighborhoods } from "@/content";
import { pageMetadata } from "@/lib/seo";
import { canonical } from "@/lib/url";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "مناطق العمل — خدمات العزل في مكة وما حولها",
    description:
      "نخدم مكة المكرمة وكل أحيائها، إضافة إلى النورية، الجموم، هدا الشام، جدة، وبحرة. اختر منطقتك للاطلاع على تفاصيل الخدمة المخصصة لها.",
    path: ["areas"],
  });
}

function CityCard({
  slug,
  name,
  hint,
}: {
  slug: string;
  name: string;
  hint?: string;
}) {
  return (
    <Link
      href={`/areas/${encodeURIComponent(slug)}`}
      className="group flex items-start justify-between gap-3 rounded-xl border border-navy-100 bg-white p-5 hover:border-gold-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        <MapPin className="h-5 w-5 text-gold-500 mt-0.5 shrink-0" aria-hidden />
        <div>
          <h3 className="font-bold text-navy-900">{name}</h3>
          {hint && <p className="mt-1 text-xs text-navy-600">{hint}</p>}
        </div>
      </div>
      <ArrowLeft
        className="h-4 w-4 text-navy-400 group-hover:text-gold-600 transition-transform group-hover:-translate-x-1"
        aria-hidden
      />
    </Link>
  );
}

export default function CitiesIndex() {
  return (
    <>
      <section className="bg-navy-900 text-white">
        <div className="container-page py-16 md:py-20">
          <span className="text-gold-400 font-bold text-sm">مناطق العمل</span>
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold">
            نخدم مكة المكرمة وما حولها
          </h1>
          <p className="mt-3 max-w-2xl text-navy-100">
            فرقنا تعمل في كل أحياء مكة، إضافة للمناطق المحيطة، مع فهم عميق
            للظروف المناخية والمعمارية لكل منطقة.
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        <h2 className="text-2xl md:text-3xl font-extrabold text-navy-900 mb-6">
          المدن الرئيسية
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topLevelCities.map((c) => (
            <CityCard key={c.slug} slug={c.slug} name={c.name} />
          ))}
        </div>

        <h2 className="mt-14 text-2xl md:text-3xl font-extrabold text-navy-900 mb-6">
          أحياء مكة المكرمة
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {makkahNeighborhoods.map((c) => (
            <CityCard key={c.slug} slug={c.slug} name={c.name} hint="حي بمكة المكرمة" />
          ))}
        </div>
      </section>

      <BreadcrumbJsonLd
        items={[
          { name: "الرئيسية", url: canonical() },
          { name: "مناطق العمل", url: canonical("areas") },
        ]}
      />
    </>
  );
}
