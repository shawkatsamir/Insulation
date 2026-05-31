/**
 * Studio layout — overrides the site's RTL/Arabic direction so the Sanity
 * Studio renders correctly. We can't override `<html dir>` from a sub-layout,
 * but wrapping the Studio in a `dir="ltr"` div is enough for Sanity's UI to
 * inherit the right text direction.
 *
 * We also re-export Sanity's recommended metadata/viewport here (instead of
 * the page) because the Studio page is a client component, and Next.js only
 * allows these exports from server components.
 */
export { metadata, viewport } from "next-sanity/studio";

export default function StudioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div dir="ltr" lang="en" style={{ minHeight: "100vh" }}>
      {children}
    </div>
  );
}
