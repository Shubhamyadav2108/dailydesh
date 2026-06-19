import { createClient } from "@/lib/supabase-server";
import { Article } from "@/lib/types";
import { FeatureCard } from "@/components/article-card";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.charAt(0).toUpperCase() + slug.slice(1);
  return { title: `${name} News — Samachar` };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) notFound();

  const { data: articles } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .eq("category_id", category.id)
    .order("published_at", { ascending: false });

  const list = (articles ?? []) as Article[];

  return (
    <>
      <h1 className="mb-6 border-b-4 border-masthead pb-2 font-head text-4xl font-extrabold">
        {category.name}
      </h1>
      {list.length === 0 ? (
        <p className="text-neutral-500">No articles in this category yet.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <FeatureCard key={a.id} a={a} />
          ))}
        </div>
      )}
    </>
  );
}
