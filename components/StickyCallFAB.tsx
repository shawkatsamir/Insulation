"use client";

import { useState } from "react";
import { Phone, MessageCircle, X } from "lucide-react";
import { telUrl, whatsappUrl } from "@/lib/url";

export function StickyCallFAB() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden fixed bottom-5 left-5 z-50">
      {open && (
        <div className="mb-3 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2">
          <a
            href={telUrl}
            className="flex items-center gap-3 rounded-full bg-navy-900 px-5 py-3 text-white shadow-lg shadow-navy-900/30 font-bold"
          >
            <Phone className="h-5 w-5" aria-hidden />
            اتصل الآن
          </a>
          <a
            href={whatsappUrl("مرحباً، عندي استفسار عن خدمات العزل")}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-3 rounded-full bg-[#25D366] px-5 py-3 text-white shadow-lg shadow-[#25D366]/30 font-bold"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            واتساب
          </a>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "إغلاق خيارات التواصل" : "خيارات التواصل السريع"}
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-navy-900 shadow-xl shadow-gold-500/40 hover:bg-gold-400 active:scale-95 transition"
      >
        {open ? <X className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
      </button>
    </div>
  );
}
