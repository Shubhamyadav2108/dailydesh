import { createClient } from "@/lib/supabase-server";
import { Article } from "@/lib/types";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminList } from "./admin-list";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // RLS lets admins read drafts too; check admin status
  const { data: isAdminRow } = await supabase
    .from("admins")
    .select("email")
    .eq("email", user.email)
    .maybeSingle();

  if (!isAdminRow) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <h1 className="font-head text-2xl font-bold">Not authorised</h1>
        <p className="mt-2 text-neutral-500">
          Your email ({user.email}) isn&apos;t in the admins list. Add it in
          Supabase, then refresh.
        </p>
      </div>
    );
  }

  const { data: articles } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-head text-3xl font-bold">Dashboard</h1>
        <Link
          href="/admin/new"
          className="rounded bg-masthead px-4 py-2 font-medium text-white hover:opacity-90"
        >
          + New article
        </Link>
      </div>
      <AdminList articles={(articles ?? []) as Article[]} />
    </div>
  );
}
