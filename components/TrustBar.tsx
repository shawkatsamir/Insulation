import { Star, ShieldCheck, Award, Clock } from "lucide-react";
import { business } from "@/content";

export function TrustBar() {
  const items = [
    {
      icon: Star,
      title: `${business.rating.value} / 5`,
      sub: `${business.rating.count} تقييم`,
    },
    { icon: Award, title: "+15 سنة", sub: "خبرة ميدانية" },
    { icon: ShieldCheck, title: "ضمان شامل", sub: "حتى 10 سنوات" },
    { icon: Clock, title: "خدمة 24/7", sub: "استجابة طوارئ" },
  ];

  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((it) => (
        <li
          key={it.title}
          className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur"
        >
          <it.icon
            className="h-6 w-6 shrink-0 text-gold-400"
            aria-hidden
            strokeWidth={1.75}
          />
          <div className="leading-tight">
            <div className="font-bold text-white text-sm">{it.title}</div>
            <div className="text-xs text-navy-100">{it.sub}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
