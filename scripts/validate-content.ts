/**
 * Build-time content validation.
 * Runs `npm run validate-content` (also as a `prebuild` step).
 *
 * Catches:
 *   - Zod schema violations (already enforced at module load time).
 *   - Overrides pointing at unknown city/service slugs.
 *   - Reports coverage so we know how many combos still rely on the
 *     templated fallback (lower-SEO path).
 */
import {
  services,
  cities,
  cityServiceOverrides,
  getCity,
  getService,
} from "../content";

let errors = 0;
let warnings = 0;

const log = (s: string) => process.stdout.write(s + "\n");
const err = (s: string) => {
  process.stderr.write(`[31m  ✗ ${s}[0m\n`);
  errors++;
};
const warn = (s: string) => {
  process.stdout.write(`[33m  ! ${s}[0m\n`);
  warnings++;
};
const ok = (s: string) => process.stdout.write(`[32m  ✓ ${s}[0m\n`);

log("\nValidating content modules…");

ok(`services: ${services.length}`);
ok(`cities + neighborhoods: ${cities.length}`);
ok(`city×service overrides: ${cityServiceOverrides.length}`);

// 1. Override slug integrity.
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

// 2. Coverage report.
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

// 3. Per-city coverage.
log("\nPer-city coverage:");
for (const city of cities) {
  const covered = cityServiceOverrides.filter(
    (o) => o.citySlug === city.slug,
  ).length;
  const pct = ((covered / services.length) * 100).toFixed(0);
  if (covered === 0) {
    warn(`${city.name.padEnd(20)} 0 / ${services.length} (0%)`);
  } else {
    log(`  ${city.name.padEnd(20)} ${covered} / ${services.length} (${pct}%)`);
  }
}

log("");
if (errors > 0) {
  process.stderr.write(`[31mContent validation FAILED with ${errors} error(s).[0m\n`);
  process.exit(1);
}
log(`[32mContent validation passed.[0m  (${warnings} warning(s))\n`);
