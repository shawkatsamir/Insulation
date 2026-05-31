/**
 * Sanity CLI config — only needed by `npx sanity ...` commands
 * (schema deploy, dataset import, etc.). Reads the same env as the Studio.
 */
import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export default defineCliConfig({
  api: { projectId, dataset },
  // Auto-update Studio when new versions are released.
  autoUpdates: true,
});
