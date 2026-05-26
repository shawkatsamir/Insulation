import { Star } from "lucide-react";
import { reviews } from "@/content";

export function ReviewsBlock() {
  return (
    <section className="container-page section-y">
      <header className="max-w-2xl mb-10">
        <span className="text-gold-600 font-bold text-sm">
          آراء عملائنا
        </span>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-navy-900">
          عملاؤنا يثقون فينا
        </h2>
        <p className="mt-3 text-navy-700">
          تقييمات حقيقية من عملاء نفذنا لهم أعمال عزل وكشف تسربات في أحياء
          مكة المكرمة والمناطق المحيطة.
        </p>
      </header>

      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {reviews.map((r, i) => (
          <li
            key={i}
            className="rounded-2xl border border-navy-100 bg-white p-6"
          >
            <div className="flex items-center gap-1 text-gold-500" aria-label={`تقييم ${r.rating} من 5`}>
              {Array.from({ length: r.rating }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-current" aria-hidden />
              ))}
            </div>
            <p className="mt-3 text-navy-800 text-sm leading-relaxed">
              {r.body}
            </p>
            <footer className="mt-4 flex items-center justify-between text-xs text-navy-500">
              <span className="font-bold text-navy-900">{r.author}</span>
              {r.city && <span>· {r.city}</span>}
            </footer>
          </li>
        ))}
      </ul>
    </section>
  );
}
