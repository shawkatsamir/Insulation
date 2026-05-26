"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { telUrl } from "@/lib/url";

const nav = [
  { href: "/", label: "الرئيسية" },
  { href: "/services", label: "خدماتنا" },
  { href: "/areas", label: "مناطق العمل" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-navy-900 font-extrabold text-xl"
          aria-label="عوازل مكة — الرئيسية"
        >
          <span
            aria-hidden
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 text-gold-400 text-base"
          >
            ع
          </span>
          عوازل مكة
        </Link>

        <nav
          className="hidden md:flex items-center gap-7 text-sm font-semibold text-navy-700"
          aria-label="القائمة الرئيسية"
        >
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="hover:text-navy-900 transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <a
          href={telUrl}
          className="hidden md:inline-flex items-center gap-2 rounded-full bg-gold-500 px-4 py-2 text-sm font-bold text-navy-900 hover:bg-gold-400 transition-colors"
        >
          <Phone className="h-4 w-4" aria-hidden />
          اتصل بنا
        </a>

        <button
          type="button"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-navy-900"
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="md:hidden border-t border-navy-100 bg-white"
        >
          <nav className="container-page flex flex-col py-3" aria-label="قائمة الجوال">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-semibold text-navy-800 border-b border-navy-50 last:border-0"
              >
                {n.label}
              </Link>
            ))}
            <a
              href={telUrl}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-4 py-3 text-base font-bold text-navy-900"
            >
              <Phone className="h-5 w-5" aria-hidden />
              اتصل بنا الآن
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
