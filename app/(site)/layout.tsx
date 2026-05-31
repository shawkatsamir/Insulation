import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCallFAB } from "@/components/StickyCallFAB";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import { services } from "@/content";

const SITE_URL = "https://www.insulmakkah.com";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-J3SV4QG95R";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "عوازل مكة | خدمات العزل الحراري والمائي وكشف التسريبات",
    template: "%s | عوازل مكة",
  },
  description:
    "شركة عوازل مكة تقدم خدمات عزل حراري ومائي موثوقة للأسطح، الخزانات، الحمامات، والمسابح، وكشف تسربات المياه بدون تكسير في مكة المكرمة وما حولها.",
  applicationName: "عوازل مكة",
  authors: [{ name: "عوازل مكة" }],
  alternates: {
    canonical: "/",
    languages: { "ar-SA": "/" },
  },
  openGraph: {
    type: "website",
    siteName: "عوازل مكة",
    locale: "ar_SA",
    url: SITE_URL,
    title: "عوازل مكة | خدمات العزل الحراري والمائي وكشف التسريبات",
    description:
      "خدمات عزل حراري ومائي وكشف تسربات بدون تكسير في مكة المكرمة. ضمان شامل وتنفيذ سريع.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@insulmakkah",
    title: "عوازل مكة | خدمات العزل وكشف التسريبات",
    description: "خدمات عزل حراري ومائي وكشف تسربات بدون تكسير في مكة المكرمة.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyCallFAB />
      <LocalBusinessJsonLd services={services} />
      <GoogleAnalytics gaId={GA_ID} />
    </>
  );
}
