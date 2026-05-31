import {
  PortableText as PortableTextRoot,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Renderer for Sanity Portable Text used by post bodies, author bios,
 * and case-study work details. Custom serializers handle:
 *  - h2 / h3 with anchor ids (for table-of-contents + deep links)
 *  - blockquotes with the brand callout style
 *  - inline images via next/image
 *  - external + internal link marks
 */

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]/gu, "");
}

function flattenChildren(children: any): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(flattenChildren).join("");
  if (children && typeof children === "object" && "props" in children) {
    return flattenChildren((children as any).props?.children);
  }
  return "";
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => {
      const id = slugify(flattenChildren(children));
      return (
        <h2 id={id} className="mt-12 mb-4 text-2xl md:text-3xl font-extrabold text-navy-900">
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = slugify(flattenChildren(children));
      return (
        <h3 id={id} className="mt-8 mb-3 text-xl md:text-2xl font-bold text-navy-900">
          {children}
        </h3>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-r-4 border-gold-500 bg-gold-50 px-5 py-4 text-navy-800 italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="my-4 text-navy-800 leading-relaxed">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 mr-5 list-disc space-y-1.5 text-navy-800">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 mr-5 list-decimal space-y-1.5 text-navy-800">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-navy-900">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener nofollow"
        className="text-navy-900 underline decoration-gold-400 underline-offset-2 hover:decoration-gold-600"
      >
        {children}
      </a>
    ),
    internalLink: ({ value, children }) => {
      const ref = value?.reference;
      if (!ref?.slug?.current) return <>{children}</>;
      const href =
        ref._type === "author"
          ? `/author/${ref.slug.current}`
          : ref._type === "caseStudy"
            ? `/case-study/${ref.slug.current}`
            : `/blog/${ref.slug.current}`;
      return (
        <Link
          href={href}
          className="text-navy-900 underline decoration-gold-400 underline-offset-2 hover:decoration-gold-600"
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlFor(value).width(1200).fit("max").auto("format").url();
      const alt = value.alt ?? "";
      return (
        <figure className="my-8">
          <Image
            src={url}
            alt={alt}
            width={1200}
            height={Math.round(1200 / 1.6)}
            className="rounded-2xl border border-navy-100"
            sizes="(min-width: 1024px) 768px, 100vw"
          />
          {value.caption && (
            <figcaption className="mt-2 text-sm text-navy-500 text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export function PortableText({ value }: { value?: PortableTextBlock[] | null }) {
  if (!value || value.length === 0) return null;
  return (
    <div className="prose-content">
      <PortableTextRoot value={value} components={components} />
    </div>
  );
}
