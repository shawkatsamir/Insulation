import { businessSchema, type Business } from "./schema";

const data: Business = {
  name: "عوازل مكة",
  legalName: "شركة عوازل مكة للخدمات الفنية",
  phone: "+966507565754",
  whatsappE164: "966507565754",
  email: "info@insulmakkah.com",
  url: "https://www.insulmakkah.com",
  address: {
    streetAddress: "مكة المكرمة",
    addressLocality: "مكة المكرمة",
    addressRegion: "مكة",
    addressCountry: "SA",
  },
  openingHours: "Mo-Su 08:00-18:00",
  priceRange: "$$",
  rating: { value: 4.8, count: 150 },
  social: {
    facebook: "https://www.facebook.com/insulmakkah",
    instagram: "https://www.instagram.com/insulmakkah",
  },
};

export const business: Business = businessSchema.parse(data);
