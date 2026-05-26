import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CityServiceGrid } from "@/components/CityServiceGrid";
import { ReviewsBlock } from "@/components/ReviewsBlock";
import {
  ServiceJsonLd,
  FAQPageJsonLd,
  BreadcrumbJsonLd,
} from "@/components/JsonLd";
import { ServiceIcon } from "@/components/Icon";
import { services, cities, getService } from "@/content";
import { pageMetadata } from "@/lib/seo";
import { canonical } from "@/lib/url";

type Params = { service: string };

export function generateStaticParams() {
  return services.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { service: slug } = await params;
  const service = getService(decodeURIComponent(slug));
  if (!service) return {};
  return pageMetadata({
    title: `${service.name} في مكة المكرمة — خدمات احترافية بضمان`,
    description: service.description,
    path: ["services", service.slug],
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { service: slug } = await params;
  const service = getService(decodeURIComponent(slug));
  if (!service) notFound();

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
            <Link href="/services" className="hover:text-gold-400">الخدمات</Link>
            <span aria-hidden>/</span>
            <span className="text-white">{service.shortName}</span>
          </nav>

          <div className="flex items-start gap-5">
            <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500/20 text-gold-400 shrink-0">
              <ServiceIcon iconKey={service.iconKey} className="h-9 w-9" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold">
                {service.name}
              </h1>
              <p className="mt-3 text-lg text-navy-100 max-w-2xl">
                {service.tagline}
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
              href="/services"
              className="rounded-full bg-white/10 backdrop-blur px-6 py-3 text-base font-bold text-white hover:bg-white/20"
            >
              كل الخدمات
            </Link>
          </div>
        </div>
      </section>

      {/* DETAILS + FEATURES */}
      <section className="container-page section-y">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy-900">
              عن خدمة {service.name}
            </h2>
            <p className="mt-4 text-navy-800 leading-relaxed text-lg whitespace-pre-line">
              {service.defaultIntro}
            </p>
            <p className="mt-4 text-navy-700 leading-relaxed">
              {service.description}
            </p>
          </div>
          <aside className="rounded-2xl border border-navy-100 bg-navy-50 p-6">
            <h3 className="font-extrabold text-navy-900 text-lg">مميزات الخدمة</h3>
            <ul className="mt-4 space-y-3">
              {service.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-navy-800">
                  <CheckCircle2
                    className="h-5 w-5 mt-0.5 shrink-0 text-gold-500"
                    aria-hidden
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* CITY MATRIX (internal-link grid for SEO) */}
      <section className="bg-navy-50">
        <CityServiceGrid
          cities={cities}
          services={[service]}
          title={`${service.name} في كل المناطق`}
          mode="byService"
          fixedServiceSlug={service.slug}
        />
      </section>

      <ReviewsBlock />

      <section className="container-page section-y">
        <header className="max-w-2xl mb-8">
          <span className="text-gold-600 font-bold text-sm">أسئلة شائعة</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-navy-900">
            أسئلة العملاء حول {service.shortName}
          </h2>
        </header>
        <FAQAccordion faqs={service.defaultFAQs} />
      </section>

      <section className="bg-navy-900 text-white">
        <div className="container-page py-14 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold">
            جاهز لتنفيذ {service.shortName} في منزلك أو منشأتك؟
          </h2>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-base font-bold text-navy-900 hover:bg-gold-400"
          >
            احصل على عرض سعر
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </section>

      <ServiceJsonLd service={service} />
      <FAQPageJsonLd faqs={service.defaultFAQs} />
      <BreadcrumbJsonLd
        items={[
          { name: "الرئيسية", url: canonical() },
          { name: "الخدمات", url: canonical("services") },
          { name: service.name, url: canonical("services", service.slug) },
        ]}
      />
    </>
  );
}
