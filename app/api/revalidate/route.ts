/**
 * Sanity webhook receiver — invalidates Next.js cache tags so the site picks
 * up content edits within seconds instead of waiting for the ISR window.
 *
 * Webhook configuration in Sanity Manage:
 *   URL:        https://www.insulmakkah.com/api/revalidate
 *   Trigger:    Create, Update, Delete
 *   Filter:     _type in ["post", "caseStudy", "author"]
 *   Projection: { "tags": [_type, _type + ":" + slug.current] }
 *   Secret:     value of SANITY_REVALIDATE_SECRET
 */
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type Payload = { tags?: string[] };

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<Payload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      // Pass true to add a small delay so Sanity's CDN is up to date before
      // we revalidate.
      true,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 },
      );
    }

    if (!Array.isArray(body?.tags) || body.tags.length === 0) {
      return NextResponse.json(
        { error: "Webhook payload must include a `tags` array" },
        { status: 400 },
      );
    }

    for (const tag of body.tags) {
      if (typeof tag === "string" && tag.length > 0) {
        revalidateTag(tag);
      }
    }

    return NextResponse.json({ revalidated: body.tags, when: Date.now() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
