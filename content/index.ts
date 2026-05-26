import { services, getService } from "./services";
import {
  cities,
  getCity,
  topLevelCities,
  makkahNeighborhoods,
} from "./cities";
import {
  cityServiceOverrides,
  getCityServiceOverride,
} from "./city-service-overrides";
import { business } from "./business";
import { reviews } from "./reviews";
import type { City, Service, CityServiceOverride } from "./schema";

export {
  services,
  getService,
  cities,
  getCity,
  topLevelCities,
  makkahNeighborhoods,
  cityServiceOverrides,
  getCityServiceOverride,
  business,
  reviews,
};

export type { City, Service, CityServiceOverride };

/**
 * Resolved page data for /[city]/[service]: prefers a hand-written
 * override, falls back to a templated combo built from the city's local
 * context + the service's default copy. Returns null if the slugs don't
 * match a real city or service.
 */
export type CityServicePage = {
  city: City;
  service: Service;
  intro: string;
  faqs: { q: string; a: string }[];
  isOverride: boolean;
  localContext: string;
};

export function getCityServicePage(
  citySlug: string,
  serviceSlug: string,
): CityServicePage | null {
  const city = getCity(citySlug);
  const service = getService(serviceSlug);
  if (!city || !service) return null;

  const override = getCityServiceOverride(citySlug, serviceSlug);

  if (override) {
    return {
      city,
      service,
      intro: override.intro,
      faqs: override.faqs,
      isOverride: true,
      localContext: override.localContext,
    };
  }

  // Templated fallback — mixes service.defaultIntro with city.localContext.
  // SEO-acceptable, but a hand-written override always ranks better.
  const intro = `${service.defaultIntro}\n\n${city.localContext}`;
  return {
    city,
    service,
    intro,
    faqs: service.defaultFAQs,
    isOverride: false,
    localContext: city.localContext,
  };
}

export function getAllCityServiceCombos(): {
  citySlug: string;
  serviceSlug: string;
}[] {
  const combos: { citySlug: string; serviceSlug: string }[] = [];
  for (const c of cities) {
    for (const s of services) {
      combos.push({ citySlug: c.slug, serviceSlug: s.slug });
    }
  }
  return combos;
}
