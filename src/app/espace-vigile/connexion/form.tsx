"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { school } from "@/lib/school";
import { loginErrorFromSearchParams, readLoginErrorMessage } from "@/lib/login-messages";

export function VigileLoginForm({ usernamePlaceholder }: { usernamePlaceholder?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const message = loginErrorFromSearchParams(
      new URLSearchParams(window.location.search),
      "Identifiant ou mot de passe incorrect. Contactez la direction.",
    );
    if (message) setError(message);
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/vigile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.get("username"),
        password: form.get("password"),
      }),
    });
    if (!response.ok) {
      setError(
        await readLoginErrorMessage(response, "Identifiant ou mot de passe incorrect. Contactez la direction."),
      );
      setPending(false);
      return;
    }
    router.push("/espace-vigile");
    router.refresh();
  }

  return (
    <form
      action="/api/auth/vigile"
      method="post"
      onSubmit={onSubmit}
      className="space-y-4 rounded-3xl border border-line bg-white p-6 shadow-sm"
    >
      <label className="grid gap-1 text-sm font-medium">
        Identifiant
        <input
          required
          name="username"
          type="text"
          inputMode="text"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder={usernamePlaceholder || "Identifiant"}
          className="rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Mot de passe
        <input
          required
          name="password"
          type="password"
          autoComplete="current-password"
          className="rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
        />
      </label>
      <button
        disabled={pending}
        className="w-full rounded-full bg-green px-5 py-3 font-semibold text-white hover:bg-green-deep disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Entrer à la grille"}
      </button>
      {error ? <p className="text-sm text-terracotta">{error}</p> : null}
      <p className="text-sm text-muted">Accès réservé au poste grille. Secrétariat : {school.phones[0].display}.</p>
    </form>
  );
}
