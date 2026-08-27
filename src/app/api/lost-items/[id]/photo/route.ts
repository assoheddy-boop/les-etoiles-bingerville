import { NextResponse } from "next/server";
import { mimeFromLostItemPhoto, readLostItemPhoto } from "@/lib/lost-item-photos";
import { readSchoolLife } from "@/lib/school-life";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const data = await readSchoolLife();
  const item = data.lostItems.find((row) => row.id === id);
  if (!item?.photo || item.photo.startsWith("/")) {
    return NextResponse.json({ error: "Photo introuvable." }, { status: 404 });
  }
  const bytes = await readLostItemPhoto(item.photo);
  if (!bytes) {
    return NextResponse.json({ error: "Fichier absent du serveur." }, { status: 404 });
  }
  return new NextResponse(bytes as BodyInit, {
    headers: {
      "Content-Type": mimeFromLostItemPhoto(item.photo),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
