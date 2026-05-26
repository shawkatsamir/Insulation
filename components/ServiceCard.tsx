import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import type { Service } from "@/content/schema";
import { ServiceIcon } from "./Icon";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group relative flex flex-col rounded-2xl border border-navy-100 bg-white p-6 transition-all hover:border-gold-300 hover:shadow-xl hover:-translate-y-0.5">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-navy-900 group-hover:bg-gold-500 group-hover:text-navy-900 transition-colors">
        <ServiceIcon iconKey={service.iconKey} className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-extrabold text-navy-900">{service.name}</h3>
      <p className="mt-2 text-navy-700 text-sm leading-relaxed">
        {service.tagline}
      </p>
      <ul className="mt-4 space-y-2 text-sm text-navy-800">
        {service.features.slice(0, 4).map((f) => (
          <li key={f} className="flex items-start gap-2">
            <CheckCircle2
              className="h-4 w-4 mt-0.5 shrink-0 text-gold-500"
              aria-hidden
              strokeWidth={2}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={`/services/${service.slug}`}
        className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-navy-900 hover:text-gold-600 transition-colors"
        aria-label={`اعرف المزيد عن ${service.name}`}
      >
        اعرف المزيد
        <ArrowLeft
          className="h-4 w-4 transition-transform group-hover:-translate-x-1"
          aria-hidden
        />
      </Link>
    </article>
  );
}
