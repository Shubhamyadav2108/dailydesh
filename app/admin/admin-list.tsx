"use client";

import { createClient } from "@/lib/supabase-browser";
import { Article } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminList({ articles }: { articles: Article[] }) {
  const supabase = createClient();
  const router = useRouter();

  async function remove(id: string) {
    if (!confirm("Delete this article?")) return;
    await supabase.from("articles").delete().eq("id", id);
    router.refresh();
  }

  async function togglePublish(a: Article) {
    const next = a.status === "published" ? "draft" : "published";
    await supabase
      .from("articles")
      .update({
        status: next,
        published_at: next === "published" ? new Date().toISOString() : null,
      })
      .eq("id", a.id);
    router.refresh();
  }

  if (!articles.length)
    return <p className="text-neutral-500">No articles yet. Create one.</p>;

  return (
    <div className="overflow-x-auto rounded border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-sm">
        <thead className="bg-neutral-100 text-left dark:bg-neutral-900">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Status</th>
            <th className="p-3">Views</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr
              key={a.id}
              className="border-t border-neutral-200 dark:border-neutral-800"
            >
              <td className="p-3 font-medium">{a.title}</td>
              <td className="p-3 text-neutral-500">{a.category?.name ?? "—"}</td>
              <td className="p-3">
                <span
                  className={
                    a.status === "published"
                      ? "text-green-600"
                      : "text-amber-600"
                  }
                >
                  {a.status}
                </span>
              </td>
              <td className="p-3">{a.views}</td>
              <td className="flex gap-3 p-3">
                <button
                  onClick={() => togglePublish(a)}
                  className="text-masthead hover:underline"
                >
                  {a.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <Link
                  href={`/admin/${a.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => remove(a.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
