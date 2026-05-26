import Image from "next/image";
import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { telUrl, whatsappUrl } from "@/lib/url";
import { TrustBar } from "./TrustBar";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
  showTrustBar?: boolean;
};

export function Hero({
  eyebrow,
  title,
  subtitle,
  ctaLabel = "احصل على عرض سعر",
  ctaHref = "/contact",
  showTrustBar = true,
}: Props) {
  return (
    <section className="relative isolate overflow-hidden text-white">
      <Image
        src="/imgs/insulation-hero.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover -z-20"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-l from-navy-900/90 via-navy-900/80 to-navy-900/95" />

      <div className="container-page py-20 md:py-28 lg:py-32">
        <div className="max-w-3xl">
          {eyebrow && (
            <span className="inline-block rounded-full bg-gold-500/15 text-gold-300 px-3 py-1 text-xs font-bold mb-5">
              {eyebrow}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            {title}
          </h1>
          <p className="mt-5 text-lg md:text-xl text-navy-100 leading-relaxed">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3.5 text-base font-bold text-navy-900 hover:bg-gold-400 transition-colors"
            >
              {ctaLabel}
            </Link>
            <a
              href={telUrl}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-6 py-3.5 text-base font-bold text-white hover:bg-white/20 transition-colors"
            >
              <Phone className="h-5 w-5" aria-hidden />
              اتصل الآن
            </a>
            <a
              href={whatsappUrl("مرحباً، عندي استفسار عن خدمات العزل")}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-base font-bold text-white hover:bg-[#1ebd5b] transition-colors"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              واتساب
            </a>
          </div>
        </div>

        {showTrustBar && (
          <div className="mt-12">
            <TrustBar />
          </div>
        )}
      </div>
    </section>
  );
}
