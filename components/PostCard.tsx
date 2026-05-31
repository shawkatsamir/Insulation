import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

type Props = {
  href: string;
  title: string;
  tldr?: string | null;
  publishedAt?: string | null;
  heroImage?: {
    asset?: { _ref?: string } | null;
    alt?: string | null;
  } | null;
  author?: {
    name?: string | null;
    photo?: { alt?: string | null } | null;
  } | null;
  isPillar?: boolean | null;
  size?: "default" | "compact";
};

export function PostCard({
  href,
  title,
  tldr,
  publishedAt,
  heroImage,
  author,
  isPillar,
  size = "default",
}: Props) {
  const imgUrl = heroImage?.asset
    ? urlFor(heroImage as Parameters<typeof urlFor>[0])
        .width(800)
        .height(450)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white transition-all hover:border-gold-300 hover:shadow-xl"
    >
      <div className="relative aspect-[16/9] bg-navy-50">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={heroImage?.alt ?? title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-navy-300">
            <span className="text-sm">لا توجد صورة</span>
          </div>
        )}
        {isPillar && (
          <span className="absolute top-3 right-3 rounded-full bg-gold-500 px-2.5 py-1 text-xs font-bold text-navy-900">
            دليل شامل
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col ${size === "compact" ? "p-4" : "p-5"}`}>
        <h3 className="text-lg md:text-xl font-extrabold text-navy-900 group-hover:text-gold-600 transition-colors">
          {title}
        </h3>
        {tldr && (
          <p className="mt-2 text-sm text-navy-700 line-clamp-3 leading-relaxed">
            {tldr}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center gap-4 text-xs text-navy-500">
          {author?.name && (
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" aria-hidden />
              {author.name}
            </span>
          )}
          {publishedAt && (
            <time
              dateTime={publishedAt}
              className="flex items-center gap-1.5"
            >
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              {new Date(publishedAt).toLocaleDateString("ar-SA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
        </div>
      </div>
    </Link>
  );
}
