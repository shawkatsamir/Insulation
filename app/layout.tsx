import type { Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b2545",
};

/**
 * Root layout — intentionally minimal so that /studio and the marketing site
 * can each set their own `dir`, chrome, and analytics independently.
 *
 * The marketing site's metadata, JSON-LD, Header/Footer, and GA live in
 * `app/(site)/layout.tsx`. The Studio gets its own minimal wrapper at
 * `app/studio/[[...tool]]/layout.tsx`.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">{children}</body>
    </html>
  );
}
