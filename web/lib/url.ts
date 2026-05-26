import { business } from "@/content";

export const SITE_URL = "https://www.insulmakkah.com";

/** Builds a percent-encoded URL path for Arabic slugs. */
export function pathFor(...segments: string[]): string {
  return "/" + segments.map((s) => encodeURIComponent(s)).join("/");
}

/** Absolute canonical URL for use in metadata. */
export function canonical(...segments: string[]): string {
  return SITE_URL + pathFor(...segments);
}

/** tel: link */
export const telUrl = `tel:${business.phone}`;

/** WhatsApp deep link with optional prefilled message. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${business.whatsappE164}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
