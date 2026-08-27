"use client";

import { useEffect, useState } from "react";

type News = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  publishedAt: string;
  status: "draft" | "published";
};

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [status, setStatus] = useState("");

  async function load() {
    const cms = await fetch("/api/cms").then((res) => res.json());
    setNews(cms.news ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function publish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/cms/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setStatus(response.ok ? "Actualité publiée." : "Publication impossible.");
    if (response.ok) {
      form.reset();
      load();
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={publish} className="space-y-3 rounded-3xl border border-line bg-white p-6">
        <h1 className="font-display text-3xl text-green-deep">Nouvelle actualité</h1>
        <input name="title" required placeholder="Titre" className="w-full rounded-xl border border-line px-3 py-2" />
        <input name="excerpt" required placeholder="Chapeau" className="w-full rounded-xl border border-line px-3 py-2" />
        <textarea name="body" required rows={8} placeholder="Texte" className="w-full rounded-xl border border-line px-3 py-2" />
        <button className="rounded-full bg-green px-5 py-3 font-semibold text-white">Publier</button>
        {status ? <p className="text-sm text-green">{status}</p> : null}
      </form>
      <div className="space-y-3">
        <h2 className="font-display text-2xl text-green-deep">Déjà en ligne</h2>
        {news.map((item) => (
          <article key={item.id} className="rounded-2xl border border-line bg-white p-4">
            <p className="text-xs text-muted">
              {item.publishedAt} · {item.status}
            </p>
            <h3 className="font-medium">{item.title}</h3>
          </article>
        ))}
      </div>
    </div>
  );
}
