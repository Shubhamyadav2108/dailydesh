"use client";

import { createClient } from "@/lib/supabase-browser";
import { Article, Category } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ArticleEditor({
  categories,
  article,
}: {
  categories: Category[];
  article?: Article;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [f, setF] = useState({
    title: article?.title ?? "",
    excerpt: article?.excerpt ?? "",
    body: article?.body ?? "",
    cover_image: article?.cover_image ?? "",
    category_id: article?.category_id ?? categories[0]?.id ?? "",
    author_name: article?.author_name ?? "Staff Reporter",
    is_breaking: article?.is_breaking ?? false,
    is_featured: article?.is_featured ?? false,
    status: article?.status ?? "draft",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((p) => ({ ...p, [k]: v }));
  }

  async function save() {
    setSaving(true);
    setErr("");
    const payload = {
      ...f,
      slug: article?.slug ?? slugify(f.title),
      published_at:
        f.status === "published"
          ? article?.published_at ?? new Date().toISOString()
          : null,
    };

    const res = article
      ? await supabase.from("articles").update(payload).eq("id", article.id)
      : await supabase.from("articles").insert(payload);

    setSaving(false);
    if (res.error) {
      setErr(res.error.message);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  const input =
    "w-full rounded border border-neutral-300 bg-transparent px-3 py-2 dark:border-neutral-700";

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="font-head text-3xl font-bold">
        {article ? "ख़बर संपादित करें" : "नई ख़बर"}
      </h1>

      <input
        className={input}
        placeholder="शीर्षक (हेडलाइन)"
        value={f.title}
        onChange={(e) => set("title", e.target.value)}
      />
      <textarea
        className={input}
        placeholder="सारांश (एक पंक्ति का सार)"
        rows={2}
        value={f.excerpt ?? ""}
        onChange={(e) => set("excerpt", e.target.value)}
      />
      <textarea
        className={`${input} font-body`}
        placeholder="मुख्य ख़बर — हर पैराग्राफ़ नई पंक्ति में"
        rows={12}
        value={f.body}
        onChange={(e) => set("body", e.target.value)}
      />
      <input
        className={input}
        placeholder="कवर इमेज URL"
        value={f.cover_image ?? ""}
        onChange={(e) => set("cover_image", e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        <select
          className={input}
          value={f.category_id ?? ""}
          onChange={(e) => set("category_id", e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          className={input}
          placeholder="लेखक"
          value={f.author_name}
          onChange={(e) => set("author_name", e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={f.is_breaking}
            onChange={(e) => set("is_breaking", e.target.checked)}
          />
          ब्रेकिंग न्यूज़
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={f.is_featured}
            onChange={(e) => set("is_featured", e.target.checked)}
          />
          फ़ीचर्ड (होमपेज हीरो)
        </label>
        <label className="flex items-center gap-2">
          स्थिति:
          <select
            className="rounded border border-neutral-300 bg-transparent px-2 py-1 dark:border-neutral-700"
            value={f.status}
            onChange={(e) =>
              set("status", e.target.value as "draft" | "published")
            }
          >
            <option value="draft">ड्राफ़्ट</option>
            <option value="published">प्रकाशित</option>
          </select>
        </label>
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <div className="flex gap-3">
        <button
          onClick={save}
          disabled={saving || !f.title}
          className="rounded bg-masthead px-5 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "सहेजा जा रहा है…" : "सहेजें"}
        </button>
        <button
          onClick={() => router.push("/admin")}
          className="rounded border border-neutral-300 px-5 py-2 dark:border-neutral-700"
        >
          रद्द करें
        </button>
      </div>
    </div>
  );
}
