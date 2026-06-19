import { createClient } from "@/lib/supabase-server";
import { Article } from "@/lib/types";
import { BreakingTicker } from "@/components/breaking-ticker";
import { FeatureCard, ListCard } from "@/components/article-card";

export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(30);

  const list = (articles ?? []) as Article[];
  const breaking = list.filter((a) => a.is_breaking);
  const featured = list.filter((a) => a.is_featured);
  const hero = featured[0] ?? list[0];
  const secondary = list.filter((a) => a.id !== hero?.id).slice(0, 4);
  const mostViewed = [...list].sort((a, b) => b.views - a.views).slice(0, 6);

  if (!list.length) {
    return (
      <div className="rounded border border-dashed border-neutral-300 p-12 text-center text-neutral-500 dark:border-neutral-700">
        No published articles yet. Add one from the{" "}
        <a href="/admin" className="text-masthead underline">
          admin panel
        </a>
        .
      </div>
    );
  }

  return (
    <>
      <BreakingTicker items={breaking} />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Hero + secondary */}
        <div className="lg:col-span-2">
          {hero && <FeatureCard a={hero} />}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {secondary.map((a) => (
              <ListCard key={a.id} a={a} />
            ))}
          </div>
        </div>

        {/* Most viewed rail */}
        <aside>
          <h2 className="mb-2 border-b-2 border-masthead pb-1 font-head text-lg font-bold">
            Most Viewed
          </h2>
          <ol className="space-y-1">
            {mostViewed.map((a, i) => (
              <li key={a.id} className="flex gap-3 py-2">
                <span className="font-head text-2xl font-bold text-masthead">
                  {i + 1}
                </span>
                <a
                  href={`/article/${a.slug}`}
                  className="font-head text-sm font-semibold leading-snug hover:underline"
                >
                  {a.title}
                </a>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      {/* Latest feed */}
      <section className="mt-12">
        <h2 className="mb-4 border-b-2 border-ink pb-1 font-head text-xl font-bold dark:border-neutral-600">
          Latest News
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.slice(0, 9).map((a) => (
            <FeatureCard key={a.id} a={a} />
          ))}
        </div>
      </section>
    </>
  );
}
