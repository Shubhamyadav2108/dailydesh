import { Article } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

function readingTime(body: string) {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function FeatureCard({ a }: { a: Article }) {
  return (
    <Link href={`/article/${a.slug}`} className="group block">
      <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded">
        {a.cover_image && (
          <Image
            src={a.cover_image}
            alt={a.title}
            fill
            sizes="(max-width:768px) 100vw, 66vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      {a.category && (
        <span className="text-xs font-bold uppercase tracking-wide text-masthead">
          {a.category.name}
        </span>
      )}
      <h2 className="font-head text-2xl font-bold leading-tight group-hover:underline sm:text-3xl">
        {a.title}
      </h2>
      {a.excerpt && (
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          {a.excerpt}
        </p>
      )}
      <p className="mt-2 text-xs text-neutral-500">
        {a.author_name} · {readingTime(a.body)} min read
      </p>
    </Link>
  );
}

export function ListCard({ a }: { a: Article }) {
  return (
    <Link
      href={`/article/${a.slug}`}
      className="group flex gap-3 border-b border-neutral-200 py-3 dark:border-neutral-800"
    >
      {a.cover_image && (
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded">
          <Image
            src={a.cover_image}
            alt={a.title}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>
      )}
      <div>
        {a.category && (
          <span className="text-[11px] font-bold uppercase tracking-wide text-masthead">
            {a.category.name}
          </span>
        )}
        <h3 className="font-head text-base font-semibold leading-snug group-hover:underline">
          {a.title}
        </h3>
      </div>
    </Link>
  );
}
