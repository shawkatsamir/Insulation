import type { Metadata } from "next";
import { ServiceCard } from "@/components/ServiceCard";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { services } from "@/content";
import { pageMetadata } from "@/lib/seo";
import { canonical } from "@/lib/url";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "خدماتنا — عوازل مكة المكرمة",
    description:
      "تعرف على خدمات شركة عوازل مكة الشاملة: عزل الأسطح، الخزانات، الحمامات، المسابح، كشف التسربات بدون تكسير، الصيانة، العزل الحراري والمائي، وعزل الفوم.",
    path: ["services"],
  });
}

export default function ServicesIndex() {
  return (
    <>
      <section className="bg-navy-900 text-white">
        <div className="container-page py-16 md:py-20">
          <span className="text-gold-400 font-bold text-sm">خدمات متخصصة</span>
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold">
            خدمات العزل وكشف التسريبات
          </h1>
          <p className="mt-3 max-w-2xl text-navy-100">
            تسع خدمات متكاملة لحماية منزلك ومنشأتك من الحرارة والتسربات،
            بضمان مكتوب يصل إلى 10 سنوات.
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </section>

      <BreadcrumbJsonLd
        items={[
          { name: "الرئيسية", url: canonical() },
          { name: "خدماتنا", url: canonical("services") },
        ]}
      />
    </>
  );
}
