import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page section-y text-center">
      <div className="text-7xl font-extrabold text-gold-500">404</div>
      <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-navy-900">
        الصفحة غير موجودة
      </h1>
      <p className="mt-3 max-w-xl mx-auto text-navy-700">
        الرابط الذي طلبته غير صحيح أو تمت إزالته. يمكنك العودة للصفحة الرئيسية أو
        تصفح خدماتنا.
      </p>
      <div className="mt-6 flex justify-center gap-3 flex-wrap">
        <Link
          href="/"
          className="rounded-full bg-gold-500 px-6 py-3 text-base font-bold text-navy-900 hover:bg-gold-400"
        >
          الصفحة الرئيسية
        </Link>
        <Link
          href="/services"
          className="rounded-full bg-navy-100 px-6 py-3 text-base font-bold text-navy-900 hover:bg-navy-200"
        >
          خدماتنا
        </Link>
      </div>
    </section>
  );
}
