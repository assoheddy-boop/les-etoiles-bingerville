"use client";

import { useState } from "react";

const cycles = ["Maternelle", "Primaire", "Secondaire", "Je ne sais pas encore"];

export function ContactForm({ kind }: { kind: "contact" | "inscription" }) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    setHint("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const endpoint = kind === "inscription" ? "/api/inscriptions" : "/api/contact";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
      hint?: string;
    } | null;
    if (!response.ok) {
      setError(payload?.error || "Envoi impossible. Appelez-nous ou utilisez WhatsApp.");
      setStatus("error");
      return;
    }
    form.reset();
    setHint(
      payload?.hint ||
        "Enregistré, l’école vous recontacte. En urgence : contactez le secrétariat (WhatsApp à confirmer).",
    );
    setStatus("ok");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-line bg-white p-4 shadow-sm sm:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Nom du parent
          <input
            required
            name="name"
            autoComplete="name"
            className="w-full min-h-11 rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Téléphone
          <input
            required
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="07 …"
            className="w-full min-h-11 rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
          />
        </label>
      </div>
      <label className="grid gap-1 text-sm font-medium">
        E-mail (facultatif)
        <input
          name="email"
          type="email"
          autoComplete="email"
          className="w-full min-h-11 rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Cycle souhaité
        <select name="cycle" className="w-full min-h-11 rounded-xl border border-line bg-paper px-3 py-2.5 font-normal" defaultValue="">
          <option value="" disabled>
            Choisir
          </option>
          {cycles.map((cycle) => (
            <option key={cycle}>{cycle}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Message
        <textarea
          required
          name="message"
          rows={5}
          placeholder={
            kind === "inscription"
              ? "Âge de l’enfant, classe visée, rentrée souhaitée…"
              : "Votre question"
          }
          className="w-full min-h-11 rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full min-h-12 rounded-full bg-green px-5 py-3 font-semibold text-white hover:bg-green-deep disabled:opacity-60"
      >
        {status === "sending"
          ? "Envoi…"
          : kind === "inscription"
            ? "Envoyer la demande"
            : "Envoyer le message"}
      </button>
      {status === "ok" ? <p className="text-sm text-green">{hint}</p> : null}
      {status === "error" ? <p className="text-sm text-terracotta">{error}</p> : null}
      <p className="text-xs text-muted">
        La demande est toujours enregistrée pour le secrétariat, même si l’e-mail automatique n’est pas configuré.
      </p>
    </form>
  );
}
