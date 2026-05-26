import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { City, Service } from "@/content/schema";

type Props = {
  cities: City[];
  services: Service[];
  title?: string;
  // If set, link uses this slug as the service and varies the city. If 'cities' mode, vice versa.
  // The default behavior renders the full matrix as a compact link list (best for SEO crawl depth).
  mode?: "matrix" | "byService" | "byCity";
  fixedServiceSlug?: string;
  fixedCitySlug?: string;
};

export function CityServiceGrid({
  cities,
  services,
  title = "خدماتنا في جميع المناطق",
  mode = "matrix",
  fixedServiceSlug,
  fixedCitySlug,
}: Props) {
  return (
    <section className="container-page section-y">
      <h2 className="text-2xl md:text-3xl font-extrabold text-navy-900 mb-2">
        {title}
      </h2>
      <p className="text-navy-700 mb-8 max-w-2xl">
        نقدم خدمات العزل وكشف التسربات في كل أحياء مكة المكرمة وما حولها — اختر منطقتك للاطلاع على تفاصيل الخدمة المخصصة لها.
      </p>

      {mode === "matrix" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) =>
            services.map((service) => (
              <Link
                key={`${city.slug}-${service.slug}`}
                href={`/${encodeURIComponent(city.slug)}/${encodeURIComponent(service.slug)}`}
                className="group flex items-center justify-between rounded-lg border border-navy-100 bg-white px-4 py-3 text-sm hover:border-gold-300 hover:bg-gold-50 transition-colors"
              >
                <span className="text-navy-800 font-medium">
                  <strong className="text-navy-900">{service.shortName}</strong>{" "}
                  في {city.name}
                </span>
                <ArrowLeft
                  className="h-4 w-4 text-navy-400 group-hover:text-gold-600 transition-colors group-hover:-translate-x-1"
                  aria-hidden
                />
              </Link>
            )),
          )}
        </div>
      )}

      {mode === "byService" && fixedServiceSlug && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <li key={city.slug}>
              <Link
                href={`/${encodeURIComponent(city.slug)}/${encodeURIComponent(fixedServiceSlug)}`}
                className="group flex items-center justify-between rounded-lg border border-navy-100 bg-white px-4 py-3 text-sm hover:border-gold-300 hover:bg-gold-50 transition-colors"
              >
                <span className="text-navy-800 font-medium">
                  الخدمة في <strong className="text-navy-900">{city.name}</strong>
                </span>
                <ArrowLeft
                  className="h-4 w-4 text-navy-400 group-hover:text-gold-600 transition-colors group-hover:-translate-x-1"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {mode === "byCity" && fixedCitySlug && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.slug}>
              <Link
                href={`/${encodeURIComponent(fixedCitySlug)}/${encodeURIComponent(service.slug)}`}
                className="group flex items-center justify-between rounded-lg border border-navy-100 bg-white px-4 py-3 text-sm hover:border-gold-300 hover:bg-gold-50 transition-colors"
              >
                <span className="text-navy-800 font-medium">
                  <strong className="text-navy-900">{service.shortName}</strong>
                </span>
                <ArrowLeft
                  className="h-4 w-4 text-navy-400 group-hover:text-gold-600 transition-colors group-hover:-translate-x-1"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
