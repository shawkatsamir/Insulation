import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, ArrowLeft } from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "المدونة — قريباً",
    description:
      "مدونة عوازل مكة — مقالات وأدلة متخصصة عن العزل وكشف التسريبات قادمة قريباً.",
    path: ["blog"],
  });
}

export default function BlogPlaceholder() {
  return (
    <section className="container-page section-y text-center">
      <Newspaper className="mx-auto h-12 w-12 text-gold-500" aria-hidden />
      <h1 className="mt-5 text-3xl md:text-4xl font-extrabold text-navy-900">
        المدونة قادمة قريباً
      </h1>
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
    </section>
  );
}
