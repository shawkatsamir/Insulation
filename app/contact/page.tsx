import type { Metadata } from "next";
import { Phone, Mail, MessageCircle, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { business } from "@/content";
import { telUrl, whatsappUrl, canonical } from "@/lib/url";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "تواصل معنا — عوازل مكة المكرمة",
    description:
      "احصل على استشارة مجانية وعرض سعر مخصص لخدمات العزل وكشف التسريبات في مكة المكرمة. اتصال مباشر، واتساب، أو نموذج طلب الخدمة.",
    path: ["contact"],
  });
}

export default function ContactPage() {
  return (
    <>
      <section className="bg-navy-900 text-white">
        <div className="container-page py-16 md:py-20">
          <span className="text-gold-400 font-bold text-sm">تواصل معنا</span>
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold">
            احصل على استشارة وعرض سعر مجاني
          </h1>
          <p className="mt-3 max-w-2xl text-navy-100">
            فريقنا متاح للرد على استفساراتك وزيارة موقعك خلال 24 ساعة. اختر طريقة التواصل الأنسب لك.
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3 rounded-2xl border border-navy-100 bg-white p-6 md:p-8">
            <h2 className="text-2xl font-extrabold text-navy-900 mb-1">
              نموذج طلب الخدمة
            </h2>
            <p className="text-navy-700 text-sm mb-6">
              املأ النموذج وسنتواصل معك خلال ساعات قليلة.
            </p>
            <ContactForm />
          </div>

          <aside className="lg:col-span-2 space-y-4">
            <a
              href={telUrl}
              className="block rounded-2xl border border-navy-100 bg-white p-5 hover:border-gold-300 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                  <Phone className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <div className="font-bold text-navy-900">اتصال مباشر</div>
                  <div dir="ltr" className="text-navy-700 text-sm">{business.phone}</div>
                </div>
              </div>
            </a>

            <a
              href={whatsappUrl("مرحباً، عندي استفسار عن خدمات العزل")}
              target="_blank"
              rel="noopener"
              className="block rounded-2xl border border-navy-100 bg-white p-5 hover:border-[#25D366] hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366] text-white">
                  <MessageCircle className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <div className="font-bold text-navy-900">واتساب</div>
                  <div className="text-navy-700 text-sm">رد سريع خلال دقائق</div>
                </div>
              </div>
            </a>

            <a
              href={`mailto:${business.email}`}
              className="block rounded-2xl border border-navy-100 bg-white p-5 hover:border-gold-300 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-900">
                  <Mail className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <div className="font-bold text-navy-900">البريد الإلكتروني</div>
                  <div className="text-navy-700 text-sm">{business.email}</div>
                </div>
              </div>
            </a>

            <div className="rounded-2xl border border-navy-100 bg-navy-50 p-5">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold-500 mt-1" aria-hidden />
                <div>
                  <div className="font-bold text-navy-900">مقرنا</div>
                  <div className="text-navy-700 text-sm">
                    {business.address.addressLocality} — نخدم كل أحيائها والمناطق المحيطة.
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-3">
                <Clock className="h-5 w-5 text-gold-500 mt-1" aria-hidden />
                <div className="text-navy-700 text-sm">
                  ساعات العمل: السبت — الخميس، 8 صباحاً — 6 مساءً.
                  خدمة طوارئ على مدار الساعة.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <BreadcrumbJsonLd
        items={[
          { name: "الرئيسية", url: canonical() },
          { name: "contact", url: canonical("contact") },
        ]}
      />
    </>
  );
}
