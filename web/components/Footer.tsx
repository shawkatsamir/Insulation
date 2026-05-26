import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { business } from "@/content";
import { services, topLevelCities } from "@/content";
import { telUrl, whatsappUrl } from "@/lib/url";

export function Footer() {
  return (
    <footer className="mt-auto bg-navy-900 text-navy-100">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div>
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-extrabold text-xl"
          >
            <span
              aria-hidden
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 text-navy-900"
            >
              ع
            </span>
            عوازل مكة
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-navy-200">
            خدمات عزل حراري ومائي وكشف تسربات بدون تكسير في مكة المكرمة وما حولها، بضمان مكتوب وفريق متخصص.
          </p>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">خدماتنا</h3>
          <ul className="space-y-2 text-sm">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="hover:text-gold-400 transition-colors"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">مناطق العمل</h3>
          <ul className="space-y-2 text-sm">
            {topLevelCities.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/areas/${c.slug}`}
                  className="hover:text-gold-400 transition-colors"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">تواصل</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={telUrl}
                className="flex items-center gap-2 hover:text-gold-400 transition-colors"
              >
                <Phone className="h-4 w-4" aria-hidden />
                <span dir="ltr">{business.phone}</span>
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl("مرحباً، عندي استفسار عن خدمات العزل")}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-2 hover:text-gold-400 transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.413c-.003 6.555-5.338 11.89-11.893 11.89a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                واتساب
              </a>
            </li>
            <li>
              <a
                href={`mailto:${business.email}`}
                className="flex items-center gap-2 hover:text-gold-400 transition-colors"
              >
                <Mail className="h-4 w-4" aria-hidden />
                {business.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden />
              {business.address.addressLocality}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-800">
        <div className="container-page py-5 text-center text-xs text-navy-300">
          © {new Date().getFullYear()} {business.legalName} · جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}
