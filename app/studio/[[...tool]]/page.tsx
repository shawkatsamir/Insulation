"use client";

/**
 * Embedded Sanity Studio mounted at /studio.
 *
 * Marked as a client component because the imported Sanity config contains
 * plugin functions (structureTool, visionTool) that can't be serialised
 * across the RSC boundary. Studio routes are interactive anyway, so making
 * the whole page client-only has no real downside.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
