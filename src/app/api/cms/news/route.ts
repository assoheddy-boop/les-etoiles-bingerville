import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readCms, writeCms } from "@/lib/cms";
import { PersistWriteError } from "@/lib/persist";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = (await request.json()) as { title?: string; excerpt?: string; body?: string };
  if (!body.title || !body.excerpt || !body.body) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }
  const cms = await readCms();
  const slug = slugify(body.title) || `actu-${Date.now()}`;
  cms.news.unshift({
    id: crypto.randomUUID(),
    slug,
    title: body.title,
    excerpt: body.excerpt,
    body: body.body,
    publishedAt: new Date().toISOString().slice(0, 10),
    status: "published",
  });
  try {
    await writeCms(cms);
  } catch (error) {
    const message = error instanceof PersistWriteError ? error.message : "Publication impossible.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
  return NextResponse.json({ ok: true, slug });
}
