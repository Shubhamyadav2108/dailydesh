import { createClient } from "@/lib/supabase-server";
import { Article } from "@/lib/types";
import { ListCard } from "@/components/article-card";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

function readingTime(body: string) {
  return Math.max(1, Math.round(body.trim().split(/\s+/).length / 200));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("title, excerpt, cover_image")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Daily Desh — डेली देश" };
  return {
    title: `${data.title} — Daily Desh`,
    description: data.excerpt ?? undefined,
    openGraph: {
      title: data.title,
      description: data.excerpt ?? undefined,
      images: data.cover_image ? [data.cover_image] : undefined,
      type: "article",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) notFound();
  const a = article as Article;

  // increment view count (fire and forget)
  await supabase
    .from("articles")
    .update({ views: a.views + 1 })
    .eq("id", a.id);

  const { data: related } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .eq("category_id", a.category_id)
    .neq("id", a.id)
    .limit(4);

  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    image: a.cover_image ? [a.cover_image] : undefined,
    datePublished: a.published_at,
    author: { "@type": "Person", name: a.author_name },
  };

  return (
    <article className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* breadcrumbs */}
      <nav className="mb-4 text-sm text-neutral-500">
        <Link href="/" className="hover:text-masthead">
          होम
        </Link>
        {a.category && (
          <>
            {" / "}
            <Link
              href={`/category/${a.category.slug}`}
              className="hover:text-masthead"
            >
              {a.category.name}
            </Link>
          </>
        )}
      </nav>

      {a.category && (
        <span className="text-sm font-bold uppercase tracking-wide text-masthead">
          {a.category.name}
        </span>
      )}
      <h1 className="mb-3 mt-1 font-head text-3xl font-extrabold leading-tight sm:text-4xl">
        {a.title}
      </h1>
      <p className="mb-6 text-sm text-neutral-500">
        {a.author_name} ·{" "}
        {a.published_at &&
          new Date(a.published_at).toLocaleDateString("hi-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
        · {readingTime(a.body)} मिनट पढ़ें · {a.views} बार देखा गया
      </p>

      {a.cover_image && (
        <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded">
          <Image
            src={a.cover_image}
            alt={a.title}
            fill
            sizes="(max-width:768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose-news text-lg">
        {a.body.split("\n").filter(Boolean).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* share */}
      <div className="mt-8 flex gap-3 border-t border-neutral-200 pt-6 text-sm dark:border-neutral-800">
        <span className="font-semibold">शेयर करें:</span>
        <a
          className="hover:text-masthead"
          target="_blank"
          href={`https://wa.me/?text=${encodeURIComponent(a.title)}`}
        >
          WhatsApp
        </a>
        <a
          className="hover:text-masthead"
          target="_blank"
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(a.title)}`}
        >
          X
        </a>
      </div>

      {related && related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-2 border-b-2 border-masthead pb-1 font-head text-lg font-bold">
            संबंधित ख़बरें
          </h2>
          {(related as Article[]).map((r) => (
            <ListCard key={r.id} a={r} />
          ))}
        </section>
      )}
    </article>
  );
}
