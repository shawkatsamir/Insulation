import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

/** `urlFor(image).width(800).fit('max').auto('format').url()` */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
