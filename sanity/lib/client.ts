import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // useCdn=true for fast public reads with edge caching; flip to false at the
  // call site when you need fresh data (e.g., generateStaticParams).
  useCdn: true,
  perspective: "published",
});
