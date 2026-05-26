import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  Users,
  Wrench,
  ArrowLeft,
} from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { canonical } from "@/lib/url";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "من نحن — عوازل مكة المكرمة",
    description:
      "عوازل مكة شركة سعودية متخصصة في خدمات العزل وكشف التسريبات، بخبرة تتجاوز 15 سنة وفرق فنية متخصصة في كل أحياء مكة وما حولها.",
    path: ["about"],
  });
}

const stats = [
  { icon: Award, value: "+15", label: "سنة خبرة" },
  { icon: Users, value: "+1500", label: "مشروع منفذ" },
  { icon: Wrench, value: "+9", label: "خدمات متخصصة" },
  { icon: ShieldCheck, value: "10", label: "سنوات ضمان" },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-navy-900 text-white">
        <div className="container-page py-16 md:py-20">
          <span className="text-gold-400 font-bold text-sm">من نحن</span>
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold">
            عوازل مكة — شركاؤك في حماية المباني
          </h1>
          <p className="mt-3 max-w-2xl text-navy-100">
            شركة سعودية متخصصة في خدمات العزل وكشف التسريبات، تخدم مكة المكرمة وما حولها منذ أكثر من 15 سنة بفريق فني محترف ومعدات حديثة.
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-navy-100 bg-white p-5 text-center"
            >
              <s.icon className="mx-auto h-7 w-7 text-gold-500" aria-hidden />
              <div className="mt-3 text-3xl font-extrabold text-navy-900">{s.value}</div>
              <div className="text-sm text-navy-700">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy-900">
              قصتنا
            </h2>
            <p className="mt-4 text-navy-800 leading-relaxed">
              بدأت عوازل مكة كفريق صغير متخصص في عزل الأسطح، ثم توسعت خدماتنا
              لتشمل كل احتياجات العزل وكشف التسربات في المباني السكنية والتجارية
              والفنادق المحيطة بالحرم. ميزتنا الأساسية هي الفهم العميق للظروف
              المناخية الخاصة بمكة المكرمة — من تفاوت الحرارة الحاد إلى أمطار
              الموسم المفاجئة — مما يجعل اختيارنا للمواد والتقنيات أكثر دقة من
              الشركات العامة.
            </p>
            <p className="mt-3 text-navy-800 leading-relaxed">
              نعمل اليوم في كل أحياء مكة المكرمة، إضافة إلى النورية، الجموم، هدا
              الشام، جدة، وبحرة، مع عقود صيانة سنوية لعدد من الفنادق والمجمعات
              السكنية الكبيرة.
            </p>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy-900">
              لماذا نحن
            </h2>
            <ul className="mt-4 space-y-4">
              {[
                {
                  t: "مواد معتمدة عالمياً",
                  d: "نستخدم مواد عزل من علامات تجارية معتمدة من هيئة المواصفات السعودية والهيئة العامة للغذاء والدواء.",
                },
                {
                  t: "ضمان مكتوب",
                  d: "كل عمل عزل يأتي مع ضمان مكتوب يصل إلى 10 سنوات، مع زيارات صيانة دورية مجانية خلال فترة الضمان.",
                },
                {
                  t: "فرق متخصصة",
                  d: "كل خدمة لها فريق متخصص — فريق الأسطح غير فريق الخزانات غير فريق كشف التسربات — بضمان جودة أعلى.",
                },
                {
                  t: "أسعار شفافة",
                  d: "نقدم عرض سعر مفصل قبل بدء العمل بدون رسوم خفية، مع خيارات متعددة تناسب جميع الميزانيات.",
                },
              ].map((it) => (
                <li
                  key={it.t}
                  className="rounded-xl border border-navy-100 bg-white p-4"
                >
                  <h3 className="font-bold text-navy-900">{it.t}</h3>
                  <p className="mt-1 text-sm text-navy-700">{it.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-navy-900 text-white">
        <div className="container-page py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold">
            هل تحتاج خدمة عزل أو كشف تسربات؟
          </h2>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-base font-bold text-navy-900 hover:bg-gold-400"
          >
            احصل على عرض سعر
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </section>

      <BreadcrumbJsonLd
        items={[
          { name: "الرئيسية", url: canonical() },
          { name: "من نحن", url: canonical("about") },
        ]}
      />
    </>
  );
}
