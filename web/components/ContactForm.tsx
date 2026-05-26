"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { submitContactForm, type ContactFormInput } from "@/app/actions/contact";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormInput>();
  const [state, setState] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(data: ContactFormInput) {
    setState("submitting");
    setError(null);
    const result = await submitContactForm(data);
    if (result.ok) {
      setState("ok");
      reset();
    } else {
      setState("error");
      setError(result.error ?? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
      aria-live="polite"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-bold text-navy-900 mb-1.5">
          الاسم
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          {...register("name", { required: "الاسم مطلوب" })}
          className="w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-300"
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-bold text-navy-900 mb-1.5">
          رقم الجوال
        </label>
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          dir="ltr"
          autoComplete="tel"
          {...register("phone", {
            required: "رقم الجوال مطلوب",
            pattern: {
              value: /^[0-9+\s-]{8,16}$/,
              message: "رقم جوال غير صحيح",
            },
          })}
          className="w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-navy-900 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-300"
          aria-invalid={!!errors.phone}
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-bold text-navy-900 mb-1.5">
          المنطقة / الحي
        </label>
        <input
          id="city"
          type="text"
          {...register("city")}
          className="w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-navy-900 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-300"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-bold text-navy-900 mb-1.5">
          تفاصيل الخدمة المطلوبة
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message", { required: "يرجى ذكر تفاصيل الخدمة" })}
          className="w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-300"
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-base font-bold text-navy-900 hover:bg-gold-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {state === "submitting" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            جاري الإرسال…
          </>
        ) : (
          "إرسال الطلب"
        )}
      </button>

      {state === "ok" && (
        <div className="flex items-start gap-3 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-800 text-sm">
          <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" aria-hidden />
          <span>
            تم استلام طلبك بنجاح. سيتواصل معك أحد ممثلينا خلال ساعات قليلة.
          </span>
        </div>
      )}
      {state === "error" && error && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-800 text-sm">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" aria-hidden />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}
