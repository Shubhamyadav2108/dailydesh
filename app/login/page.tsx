"use client";

import { createClient } from "@/lib/supabase-browser";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [msg, setMsg] = useState("");

  async function submit() {
    setMsg("");
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      setMsg(error ? error.message : "Account created. You can now sign in.");
      if (!error) setMode("login");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMsg(error.message);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-sm py-12">
      <h1 className="mb-6 font-head text-3xl font-bold">
        {mode === "login" ? "Sign in" : "Create account"}
      </h1>
      <div className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 dark:border-neutral-700"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 dark:border-neutral-700"
        />
        <button
          onClick={submit}
          className="w-full rounded bg-masthead py-2 font-medium text-white hover:opacity-90"
        >
          {mode === "login" ? "Sign in" : "Sign up"}
        </button>
      </div>
      {msg && <p className="mt-3 text-sm text-masthead">{msg}</p>}
      <button
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="mt-4 text-sm text-neutral-500 underline"
      >
        {mode === "login"
          ? "Need an account? Sign up"
          : "Have an account? Sign in"}
      </button>
      <p className="mt-6 text-xs text-neutral-400">
        Note: only emails added to the <code>admins</code> table can publish.
      </p>
    </div>
  );
}
