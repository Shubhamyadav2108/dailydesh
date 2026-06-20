import { createClient } from "@/lib/supabase-server";
import { Article, Category } from "@/lib/types";
import { ArticleEditor } from "@/components/article-editor";
import { redirect, notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (!article) notFound();

  return (
    <ArticleEditor
      categories={(categories ?? []) as Category[]}
      article={article as Article}
    />
  );
}
