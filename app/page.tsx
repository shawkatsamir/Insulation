import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CityServiceGrid } from "@/components/CityServiceGrid";
import { ReviewsBlock } from "@/components/ReviewsBlock";
import { FAQPageJsonLd } from "@/components/JsonLd";
import { services, topLevelCities } from "@/content";

const homepageFaqs = [
  {
    q: "ما المناطق التي تخدمونها؟",
    a: "نقدم خدمات العزل وكشف التسربات في جميع أحياء مكة المكرمة، إضافة إلى النورية، الجموم، هدا الشام، جدة، وبحرة، مع تغطية لأكثر من 15 حياً داخل مكة منها العزيزية، النسيم، الكعكية، الشرائع، والعوالي.",
  },
  {
    q: "ما الضمان الذي تقدمونه؟",
    a: "نقدم ضماناً تنفيذياً مكتوباً يصل إلى 10 سنوات على أعمال العزل، مع زيارات صيانة دورية مجانية خلال فترة الضمان للتأكد من سلامة العزل.",
  },
  {
    q: "هل أعمالكم تشمل عقود الفنادق والمنشآت؟",
    a: "نعم، لدينا عقود صيانة سنوية مع عدة فنادق ومجمعات سكنية بأسعار خاصة، مع فرق متخصصة في الاستجابة السريعة لتجنب أي تعطل لأعمال الضيافة.",
  },
  {
    q: "كم تستغرق عملية العزل؟",
    a: "تختلف المدة حسب نوع العمل: عزل الأسطح من يوم إلى 3 أيام، عزل الحمامات من يوم إلى يومين، عزل الخزانات من 2 إلى 5 أيام، وكشف التسربات في ساعات.",
  },
];

export default function Home() {
  return (
    <>
      <Hero
        eyebrow="عزل احترافي · ضمان مكتوب"
        title={
          <>
            عوازل مكة —{" "}
            <span className="text-gold-400">
              حماية موثوقة لمنزلك من الحرارة والتسربات
            </span>
          </>
        }
        subtitle="خبرة تتجاوز 15 سنة في عزل الأسطح، الخزانات، الحمامات، والمسابح، وكشف تسربات المياه بدون تكسير. خدمة لكل أحياء مكة المكرمة والمناطق المحيطة."
      />

      {/* SERVICES */}
      <section id="services" className="container-page section-y">
        <header className="max-w-2xl mb-12">
          <span className="text-gold-600 font-bold text-sm">خدماتنا المتميزة</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-navy-900">
            حلول شاملة لجميع أنواع العزل وكشف التسريبات
          </h2>
          <p className="mt-3 text-navy-700">
            نقدم مجموعة متكاملة من الخدمات المتخصصة باستخدام أحدث التقنيات والمعدات،
            مع ضمان تنفيذي مكتوب وفريق فني مؤهل.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </section>

      {/* AREAS SERVED */}
      <section className="bg-navy-50">
        <CityServiceGrid
          cities={topLevelCities}
          services={services.slice(0, 6)}
          title="نخدم كل أحياء مكة والمناطق المحيطة"
        />
      </section>

      {/* REVIEWS */}
      <ReviewsBlock />

      {/* FAQ */}
      <section className="container-page section-y">
        <header className="max-w-2xl mb-8">
          <span className="text-gold-600 font-bold text-sm">أسئلة شائعة</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-navy-900">
            إجابات للأسئلة الأكثر تكراراً
          </h2>
        </header>
        <FAQAccordion faqs={homepageFaqs} />
        <FAQPageJsonLd faqs={homepageFaqs} />
      </section>

      {/* CTA STRIP */}
      <section className="bg-navy-900 text-white">
        <div className="container-page py-14 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            احصل على استشارة وعرض سعر مجاني
          </h2>
          <p className="mt-3 text-navy-100 max-w-2xl mx-auto">
            تواصل معنا اليوم وفريقنا سيزور موقعك لمعاينة فعلية ووضع خطة عزل مخصصة لمتطلبات منزلك أو منشأتك.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-base font-bold text-navy-900 hover:bg-gold-400 transition-colors"
          >
            احصل على عرض سعر
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
