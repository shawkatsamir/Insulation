import { business } from "@/content";
import type { City, Service, FAQItem } from "@/content/schema";

/* eslint-disable @typescript-eslint/no-explicit-any */

function Script({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessJsonLd({ services }: { services: Service[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    legalName: business.legalName,
    image: `${business.url}/imgs/insulation-hero.webp`,
    description:
      "شركة عوازل مكة تقدم خدمات عزل حراري ومائي موثوقة للأسطح والخزانات والمسابح وكشف تسربات بدون تكسير في مكة المكرمة وما حولها.",
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.addressLocality,
      addressRegion: business.address.addressRegion,
      addressCountry: business.address.addressCountry,
    },
    telephone: business.phone,
    email: business.email,
    url: business.url,
    openingHours: business.openingHours,
    priceRange: business.priceRange,
    sameAs: Object.values(business.social).filter(Boolean),
    serviceType: services.map((s) => s.name),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.rating.value,
      reviewCount: business.rating.count,
    },
  };
  return <Script data={data} />;
}

export function ServiceJsonLd({
  service,
  city,
}: {
  service: Service;
  city?: City;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.name,
    provider: {
      "@type": "LocalBusiness",
      name: business.name,
      telephone: business.phone,
      url: business.url,
    },
    areaServed: city
      ? { "@type": "City", name: city.name }
      : business.address.addressRegion,
    name: city ? `${service.name} في ${city.name}` : service.name,
    description: service.description,
  };
  return <Script data={data} />;
}

export function FAQPageJsonLd({ faqs }: { faqs: FAQItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return <Script data={data} />;
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <Script data={data} />;
}
