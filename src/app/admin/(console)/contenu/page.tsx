"use client";

import { useEffect, useState } from "react";

type Cms = {
  histoire: { title: string; body: string; editorialNote: string };
  motDuProviseur: { title: string; authorLabel: string; body: string; editorialNote: string };
};

export default function ContenuAdminPage() {
  const [cms, setCms] = useState<Cms | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/cms")
      .then((res) => res.json())
      .then(setCms);
  }, []);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cms) return;
    const form = new FormData(event.currentTarget);
    const next = {
      ...cms,
      histoire: {
        ...cms.histoire,
        title: String(form.get("histoireTitle")),
        body: String(form.get("histoireBody")),
      },
      motDuProviseur: {
        ...cms.motDuProviseur,
        title: String(form.get("motTitle")),
        authorLabel: String(form.get("motAuthor")),
        body: String(form.get("motBody")),
      },
    };
    const response = await fetch("/api/cms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setStatus(response.ok ? "Enregistré. Les pages publiques sont à jour." : "Enregistrement impossible.");
  }

  if (!cms) return <p>Chargement…</p>;

  return (
    <form onSubmit={save} className="space-y-8">
      <h1 className="font-display text-3xl text-green-deep">Histoire & mot de la direction</h1>
      <section className="space-y-3 rounded-3xl border border-line bg-white p-6">
        <h2 className="font-display text-xl">Notre histoire</h2>
        <label className="grid gap-1 text-sm font-medium">
          Titre
          <input name="histoireTitle" defaultValue={cms.histoire.title} className="rounded-xl border border-line px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Texte
          <textarea name="histoireBody" rows={10} defaultValue={cms.histoire.body} className="rounded-xl border border-line px-3 py-2" />
        </label>
      </section>
      <section className="space-y-3 rounded-3xl border border-line bg-white p-6">
        <h2 className="font-display text-xl">Mot de la direction</h2>
        <label className="grid gap-1 text-sm font-medium">
          Titre
          <input name="motTitle" defaultValue={cms.motDuProviseur.title} className="rounded-xl border border-line px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Signature
          <input name="motAuthor" defaultValue={cms.motDuProviseur.authorLabel} className="rounded-xl border border-line px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Texte
          <textarea name="motBody" rows={10} defaultValue={cms.motDuProviseur.body} className="rounded-xl border border-line px-3 py-2" />
        </label>
      </section>
      <button className="rounded-full bg-green px-6 py-3 font-semibold text-white">Enregistrer</button>
      {status ? <p className="text-sm text-green">{status}</p> : null}
    </form>
  );
}
