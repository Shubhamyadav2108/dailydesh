import { Article } from "@/lib/types";
import Link from "next/link";

export function BreakingTicker({ items }: { items: Article[] }) {
  if (!items.length) return null;
  const doubled = [...items, ...items];

  return (
    <div className="mb-8 flex items-stretch overflow-hidden rounded border border-ink dark:border-neutral-700">
      <div className="flex shrink-0 items-center bg-masthead px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">
        Breaking
      </div>
      <div className="relative flex-1 overflow-hidden py-2">
        <div className="animate-ticker flex w-max gap-12 whitespace-nowrap px-4">
          {doubled.map((a, i) => (
            <Link
              key={i}
              href={`/article/${a.slug}`}
              className="text-sm font-medium hover:text-masthead"
            >
              {a.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
