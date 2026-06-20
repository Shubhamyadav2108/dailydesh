import { createClient } from "@/lib/supabase-server";
import { Category } from "@/lib/types";
import { ArticleEditor } from "@/components/article-editor";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return <ArticleEditor categories={(categories ?? []) as Category[]} />;
}
