/**
 * Build-time content validation.
 * Runs `npm run validate-content` (also as a `prebuild` step).
 *
 * Catches:
 *   - Zod schema violations in the typed content modules (already enforced
 *     at module load time).
 *   - city×service overrides pointing at unknown slugs.
 *   - Coverage report so we know how many combos rely on the templated path.
 *   - Cross-Sanity duplicate-content gate: fetches all published posts and
 *     flags keyword / paragraph overlap that would split SEO signal.
 *
 * The Sanity gate degrades gracefully — if the project is empty, unreachable,
 * or the env vars are missing, it skips with a warning instead of failing
 * the build.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  services,
  cities,
  cityServiceOverrides,
  getCity,
  getService,
} from "../content";

// Load .env.local manually — tsx + Node 18 don't auto-load it, and we'd
// rather not pull in dotenv for one script.
loadEnvFile(resolve(process.cwd(), ".env.local"));

function loadEnvFile(path: string) {
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf-8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

let errors = 0;
let warnings = 0;

const log = (s: string) => process.stdout.write(s + "\n");
const err = (s: string) => {
  process.stderr.write(`[31m  ✗ ${s}[0m\n`);
  errors++;
};
const warn = (s: string) => {
  process.stdout.write(`[33m  ! ${s}[0m\n`);
  warnings++;
};
const ok = (s: string) => process.stdout.write(`[32m  ✓ ${s}[0m\n`);

log("\nValidating content modules…");

ok(`services: ${services.length}`);
ok(`cities + neighborhoods: ${cities.length}`);
ok(`city×service overrides: ${cityServiceOverrides.length}`);

main().catch((e) => {
  process.stderr.write(`[31mUnexpected validator error: ${e}[0m\n`);
  process.exit(1);
});

async function main() {
  /* ------------------------------------------------------------------------ */
  /*  1. Override slug integrity                                              */
  /* ------------------------------------------------------------------------ */

  log("\nChecking override slug integrity…");
  for (const o of cityServiceOverrides) {
    if (!getCity(o.citySlug)) {
      err(`Override references unknown city slug: "${o.citySlug}"`);
    }
    if (!getService(o.serviceSlug)) {
      err(`Override references unknown service slug: "${o.serviceSlug}"`);
    }
  }
  if (errors === 0) ok("all overrides reference real cities and services");

  /* ------------------------------------------------------------------------ */
  /*  2. Coverage report                                                      */
  /* ------------------------------------------------------------------------ */

  const totalCombos = cities.length * services.length;
  const coverage = cityServiceOverrides.length / totalCombos;
  log("\nCoverage report:");
  log(
    `  city×service combinations: ${totalCombos}  |  unique overrides: ${cityServiceOverrides.length}  |  coverage: ${(coverage * 100).toFixed(1)}%`,
  );
  if (coverage < 0.15) {
    warn(
      `Coverage is below 15%. ${totalCombos - cityServiceOverrides.length} combos will fall back to templated content (lower SEO value).`,
    );
  }

  /* ------------------------------------------------------------------------ */
  /*  3. Per-city coverage                                                    */
  /* ------------------------------------------------------------------------ */

  log("\nPer-city coverage:");
  for (const city of cities) {
    const covered = cityServiceOverrides.filter(
      (o) => o.citySlug === city.slug,
    ).length;
    const pct = ((covered / services.length) * 100).toFixed(0);
    if (covered === 0) {
      warn(`${city.name.padEnd(20)} 0 / ${services.length} (0%)`);
    } else {
      log(
        `  ${city.name.padEnd(20)} ${covered} / ${services.length} (${pct}%)`,
      );
    }
  }

  /* ------------------------------------------------------------------------ */
  /*  4. Sanity duplicate-content gate                                        */
  /* ------------------------------------------------------------------------ */

  await runSanityDuplicateGate();

  /* ------------------------------------------------------------------------ */
  /*  Exit                                                                    */
  /* ------------------------------------------------------------------------ */

  log("");
  if (errors > 0) {
    process.stderr.write(
      `[31mContent validation FAILED with ${errors} error(s).[0m\n`,
    );
    process.exit(1);
  }
  log(`[32mContent validation passed.[0m  (${warnings} warning(s))\n`);
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

type SanityPost = {
  _id: string;
  title?: string | null;
  slug?: { current?: string };
  language?: string | null;
  focusKeyword?: string | null;
  relatedKeywords?: string[] | null;
  bodyText?: string | null;
};

/**
 * Loads Sanity client lazily — both because the heavy import isn't needed
 * when the user only runs the script for city×service validation, and so
 * env-var failures stay isolated to the gate.
 */
async function runSanityDuplicateGate() {
  log("\nDuplicate-content gate (Sanity posts)…");

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) {
    warn(
      "NEXT_PUBLIC_SANITY_PROJECT_ID/DATASET not set — skipping duplicate-content gate.",
    );
    return;
  }

  let posts: SanityPost[];
  try {
    const { createClient } = await import("@sanity/client");
    const client = createClient({
      projectId,
      dataset,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-26",
      useCdn: false,
      token: process.env.SANITY_API_READ_TOKEN,
    });
    posts = (await client.fetch(
      `*[_type == "post" && defined(slug.current)]{
        _id,
        title,
        slug,
        language,
        "focusKeyword": seo.focusKeyword,
        "relatedKeywords": seo.relatedKeywords,
        "bodyText": pt::text(body)
      }`,
    )) as SanityPost[];
  } catch (e) {
    warn(
      `Could not reach Sanity (${e instanceof Error ? e.message : String(e)}). Skipping gate.`,
    );
    return;
  }

  if (!posts || posts.length === 0) {
    ok("no published posts yet — nothing to deduplicate");
    return;
  }
  ok(`fetched ${posts.length} post(s) from Sanity`);

  /* ---- 4a. Keyword cannibalization ---- */
  const keywordToPosts = new Map<string, { id: string; title: string }[]>();
  for (const p of posts) {
    const keywords = [p.focusKeyword, ...(p.relatedKeywords ?? [])]
      .filter((k): k is string => !!k)
      .map((k) => k.trim().toLowerCase());
    const unique = new Set(keywords);
    for (const k of unique) {
      const list = keywordToPosts.get(k) ?? [];
      list.push({ id: p._id, title: p.title ?? "(untitled)" });
      keywordToPosts.set(k, list);
    }
  }

  // Count: how many keywords does post X share with post Y?
  const overlap = new Map<string, number>();
  for (const [, list] of keywordToPosts) {
    if (list.length < 2) continue;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const key = [list[i].id, list[j].id].sort().join("|");
        overlap.set(key, (overlap.get(key) ?? 0) + 1);
      }
    }
  }

  const cannibalPairs = [...overlap.entries()].filter(([, n]) => n >= 3);
  if (cannibalPairs.length > 0) {
    for (const [pair, n] of cannibalPairs) {
      const [a, b] = pair.split("|");
      const ta = posts.find((p) => p._id === a)?.title;
      const tb = posts.find((p) => p._id === b)?.title;
      err(
        `Keyword cannibalization (${n} shared keywords): "${ta}" ⇄ "${tb}". Merge, canonical, or differentiate.`,
      );
    }
  } else {
    ok("no keyword cannibalization detected");
  }

  /* ---- 4b. Paragraph cannibalization ---- */
  // Split each post's plain-text body into normalized paragraphs and hash each.
  // Two posts sharing ≥3 paragraph hashes is a strong duplicate-content signal.
  const paragraphToPosts = new Map<string, Set<string>>();
  for (const p of posts) {
    const text = p.bodyText ?? "";
    const paragraphs = text
      .split(/\n+/)
      .map((s) => s.replace(/\s+/g, " ").trim())
      .filter((s) => s.length >= 80); // ignore short lines (headings, captions)
    const unique = new Set(paragraphs.map(hash));
    for (const h of unique) {
      const set = paragraphToPosts.get(h) ?? new Set<string>();
      set.add(p._id);
      paragraphToPosts.set(h, set);
    }
  }

  const pOverlap = new Map<string, number>();
  for (const [, ids] of paragraphToPosts) {
    if (ids.size < 2) continue;
    const arr = [...ids];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const key = [arr[i], arr[j]].sort().join("|");
        pOverlap.set(key, (pOverlap.get(key) ?? 0) + 1);
      }
    }
  }

  const paragraphPairs = [...pOverlap.entries()].filter(([, n]) => n >= 3);
  if (paragraphPairs.length > 0) {
    for (const [pair, n] of paragraphPairs) {
      const [a, b] = pair.split("|");
      const ta = posts.find((p) => p._id === a)?.title;
      const tb = posts.find((p) => p._id === b)?.title;
      err(
        `Paragraph cannibalization (${n} identical paragraphs): "${ta}" ⇄ "${tb}". Rewrite shared sections.`,
      );
    }
  } else {
    ok("no paragraph cannibalization detected");
  }
}

/** Tiny, deterministic non-crypto hash (djb2) used for paragraph identity. */
function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return h.toString(36);
}
