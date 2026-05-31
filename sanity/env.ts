/**
 * Centralised Sanity env loader. Throws early if a required value is missing
 * so we fail fast at build time rather than silently rendering empty data.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Set it in .env.local.`,
    );
  }
  return value;
}

export const projectId = required(
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
);

export const dataset = required(
  "NEXT_PUBLIC_SANITY_DATASET",
  process.env.NEXT_PUBLIC_SANITY_DATASET,
);

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-26";

// Optional — only used for draft mode and Live Content API.
export const readToken = process.env.SANITY_API_READ_TOKEN;
