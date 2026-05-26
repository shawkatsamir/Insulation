import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { CityServiceGrid } from "@/components/CityServiceGrid";
import { ReviewsBlock } from "@/components/ReviewsBlock";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { cities, services, getCity } from "@/content";
import { pageMetadata } from "@/lib/seo";
import { canonical } from "@/lib/url";

type Params = { city: string };

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCity(decodeURIComponent(slug));
  if (!city) return {};
  return pageMetadata({
    title: `خدمات العزل في ${city.name} — عوازل مكة`,
    description: `خدمات عزل حراري ومائي، عزل خزانات، عزل حمامات، وكشف تسربات بدون تكسير في ${city.name}. ضمان مكتوب وتنفيذ سريع.`,
    path: ["areas", city.slug],
  });
}

export default async function CityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { city: slug } = await params;
  const city = getCity(decodeURIComponent(slug));
  if (!city) notFound();

  return (
    <>
      <section className="bg-navy-900 text-white">
        <div className="container-page py-16 md:py-20">
          <nav
            className="text-xs text-navy-200 mb-4 flex flex-wrap gap-2"
            aria-label="مسار التنقل"
          >
            <Link href="/" className="hover:text-gold-400">الرئيسية</Link>
            <span aria-hidden>/</span>
            <Link href="/areas" className="hover:text-gold-400">المناطق</Link>
            <span aria-hidden>/</span>
            <span className="text-white">{city.name}</span>
          </nav>

          <div className="flex items-start gap-4">
            <MapPin className="h-8 w-8 text-gold-400 mt-2 shrink-0" aria-hidden />
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold">
                خدمات العزل في {city.name}
              </h1>
              <p className="mt-3 text-lg text-navy-100 max-w-2xl">
                {city.localContext}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-50">
        <CityServiceGrid
          cities={[city]}
          services={services}
          title={`خدماتنا المتوفرة في ${city.name}`}
          mode="byCity"
          fixedCitySlug={city.slug}
        />
      </section>

      <ReviewsBlock />

      <BreadcrumbJsonLd
        items={[
          { name: "الرئيسية", url: canonical() },
          { name: "المناطق", url: canonical("areas") },
          { name: city.name, url: canonical("areas", city.slug) },
        ]}
      />
    </>
  );
}
