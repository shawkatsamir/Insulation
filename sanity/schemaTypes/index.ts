import type { SchemaTypeDefinition } from "sanity";

/**
 * Schema entry point.
 *
 * Empty for now — we'll add `documents/`, `objects/`, and `blocks/` here when
 * the content phase starts. Keep this file as the single registration surface
 * so we never have to touch sanity.config.ts to add a new type.
 */
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [],
};
