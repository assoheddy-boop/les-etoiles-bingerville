import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readCms, writeCms } from "@/lib/cms";
import type { CmsContent } from "@/lib/cms-types";
import { PersistWriteError } from "@/lib/persist";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json(await readCms());
}

export async function PUT(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const patch = (await request.json()) as Partial<CmsContent>;
  const current = await readCms();
  try {
    await writeCms({
      ...current,
      ...patch,
      histoire: { ...current.histoire, ...patch.histoire },
      motDuProviseur: { ...current.motDuProviseur, ...patch.motDuProviseur },
      informations: { ...current.informations, ...patch.informations },
      news: patch.news ?? current.news,
    });
  } catch (error) {
    const message = error instanceof PersistWriteError ? error.message : "Enregistrement impossible.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
