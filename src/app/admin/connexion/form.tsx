"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginErrorFromSearchParams, readLoginErrorMessage } from "@/lib/login-messages";

export function AdminLoginForm({
  usernamePlaceholder,
  action = "/api/auth/admin",
  defaultNext = "/admin",
}: {
  usernamePlaceholder?: string;
  action?: string;
  defaultNext?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const message = loginErrorFromSearchParams(
      new URLSearchParams(window.location.search),
      "Identifiants incorrects.",
    );
    if (message) setError(message);
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch(action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.get("username"),
        password: form.get("password"),
      }),
    });
    if (!response.ok) {
      setError(await readLoginErrorMessage(response, "Identifiants incorrects."));
      setPending(false);
      return;
    }
    const data = (await response.json()) as { next?: string };
    const next = typeof data.next === "string" && data.next.startsWith("/") ? data.next : defaultNext;
    router.push(next);
    router.refresh();
  }

  return (
    <form action={action} method="post" onSubmit={onSubmit} className="mt-8 space-y-4 rounded-3xl border border-line bg-white p-6">
      <label className="grid gap-1 text-sm font-medium">
        Identifiant
        <input
          name="username"
          type="text"
          inputMode="text"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          placeholder={usernamePlaceholder || "Identifiant"}
          className="rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Mot de passe
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
        />
      </label>
      <button
        disabled={pending}
        className="w-full rounded-full bg-green px-5 py-3 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Entrer"}
      </button>
      {error ? <p className="text-sm text-terracotta">{error}</p> : null}
    </form>
  );
}
