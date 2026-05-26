import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, MapPin, ArrowLeft } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ReviewsBlock } from "@/components/ReviewsBlock";
import { CityServiceGrid } from "@/components/CityServiceGrid";
import {
  ServiceJsonLd,
  FAQPageJsonLd,
  BreadcrumbJsonLd,
} from "@/components/JsonLd";
import { ServiceIcon } from "@/components/Icon";
import {
  getCityServicePage,
  getAllCityServiceCombos,
  services,
} from "@/content";
import { pageMetadata } from "@/lib/seo";
import { canonical } from "@/lib/url";

type Params = { city: string; service: string };

// Pre-render every city × service combination at build time.
export function generateStaticParams() {
  return getAllCityServiceCombos().map((c) => ({
    city: c.citySlug,
    service: c.serviceSlug,
  }));
}

// ISR — revalidate every 24h so future content edits flow without a redeploy.
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { city: cRaw, service: sRaw } = await params;
  const page = getCityServicePage(decodeURIComponent(cRaw), decodeURIComponent(sRaw));
  if (!page) return {};
  const { city, service } = page;

  return pageMetadata({
    title: `${service.name} في ${city.name} — ضمان مكتوب وتنفيذ سريع`,
    description: `خدمة ${service.name} الاحترافية في ${city.name}. ${service.tagline}. اتصل اليوم لاستشارة مجانية وعرض سعر مخصص.`,
    path: [city.slug, service.slug],
  });
}

export default async function CityServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { city: cRaw, service: sRaw } = await params;
  const page = getCityServicePage(decodeURIComponent(cRaw), decodeURIComponent(sRaw));
  if (!page) notFound();
  const { city, service, intro, faqs, isOverride, localContext } = page;

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
            <Link
              href={`/areas/${encodeURIComponent(city.slug)}`}
              className="hover:text-gold-400"
            >
              {city.name}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white">{service.shortName}</span>
          </nav>

          <div className="flex items-start gap-5">
            <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500/20 text-gold-400 shrink-0">
              <ServiceIcon iconKey={service.iconKey} className="h-9 w-9" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold">
                {service.name} في {city.name}
              </h1>
              <p className="mt-3 text-lg text-navy-100 max-w-2xl">
                {service.tagline} — خدمة مخصصة لمتطلبات {city.name}.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-gold-500 px-6 py-3 text-base font-bold text-navy-900 hover:bg-gold-400"
            >
              احصل على عرض سعر
            </Link>
            <Link
              href={`/services/${encodeURIComponent(service.slug)}`}
              className="rounded-full bg-white/10 backdrop-blur px-6 py-3 text-base font-bold text-white hover:bg-white/20"
            >
              تفاصيل الخدمة
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO + FEATURES */}
      <section className="container-page section-y">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy-900">
              {service.shortName} في {city.name}
            </h2>
            <p className="mt-4 text-navy-800 leading-relaxed text-lg whitespace-pre-line">
              {intro}
            </p>

            <div className="mt-8 rounded-2xl border-r-4 border-gold-500 bg-gold-50 p-5">
              <div className="flex items-start gap-3">
                <MapPin
                  className="h-5 w-5 text-gold-600 mt-1 shrink-0"
                  aria-hidden
                />
                <div>
                  <h3 className="font-bold text-navy-900">
                    عن منطقة {city.name}
                  </h3>
                  <p className="mt-1 text-navy-700 text-sm leading-relaxed">
                    {localContext}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-navy-100 bg-navy-50 p-6">
            <h3 className="font-extrabold text-navy-900 text-lg">
              مميزات الخدمة
            </h3>
            <ul className="mt-4 space-y-3">
              {service.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-navy-800"
                >
                  <CheckCircle2
                    className="h-5 w-5 mt-0.5 shrink-0 text-gold-500"
                    aria-hidden
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {isOverride && (
              <p className="mt-5 text-[10px] text-navy-400 leading-relaxed">
                تم تخصيص هذه الصفحة بمحتوى مكتوب يدوياً لخدمة {service.shortName} في {city.name}.
              </p>
            )}
          </aside>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page section-y pt-0">
        <header className="max-w-2xl mb-8">
          <span className="text-gold-600 font-bold text-sm">أسئلة شائعة</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-navy-900">
            أسئلة عملاء {city.name} حول {service.shortName}
          </h2>
        </header>
        <FAQAccordion faqs={faqs} />
      </section>

      {/* OTHER SERVICES IN THIS CITY (internal-link surface) */}
      <section className="bg-navy-50">
        <CityServiceGrid
          cities={[city]}
          services={services.filter((s) => s.slug !== service.slug)}
          title={`خدمات أخرى في ${city.name}`}
          mode="byCity"
          fixedCitySlug={city.slug}
        />
      </section>

      <ReviewsBlock />

      <section className="bg-navy-900 text-white">
        <div className="container-page py-14 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold">
            تحتاج {service.shortName} في {city.name}؟
          </h2>
          <p className="mt-3 text-navy-100 max-w-2xl mx-auto">
            فريقنا متاح لزيارة موقعك وتقديم استشارة مجانية وعرض سعر مخصص خلال 24 ساعة.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-base font-bold text-navy-900 hover:bg-gold-400"
          >
            احصل على عرض سعر
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </section>

      <ServiceJsonLd service={service} city={city} />
      <FAQPageJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "الرئيسية", url: canonical() },
          { name: city.name, url: canonical("areas", city.slug) },
          { name: service.name, url: canonical(city.slug, service.slug) },
        ]}
      />
    </>
  );
}

