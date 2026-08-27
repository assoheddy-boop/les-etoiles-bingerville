import { NextResponse } from "next/server";
import { getTeacherSession } from "@/lib/auth";
import { saveLostItemPhoto } from "@/lib/lost-item-photos";
import { addLostItem, readSchoolLife, teacherActorId, todayISO, writeSchoolLife } from "@/lib/school-life";

export async function POST(request: Request) {
  const session = await getTeacherSession();
  if (!session) {
    return NextResponse.redirect(new URL("/espace-enseignants/connexion", request.url), 303);
  }

  const form = await request.formData();
  const description = String(form.get("description") || "").trim();
  const place = String(form.get("place") || "").trim();
  if (!description || !place) {
    return NextResponse.redirect(new URL("/espace-enseignants/objets-perdus?error=missing", request.url), 303);
  }

  const data = await readSchoolLife();
  const item = addLostItem(data, {
    description,
    place,
    foundAt: String(form.get("foundAt") || "").trim() || todayISO(),
    recordedBy: teacherActorId(session.teacherId),
  });

  const file = form.get("photo");
  if (file instanceof File && file.size > 0) {
    try {
      const storedName = await saveLostItemPhoto(item.id, file);
      if (storedName) item.photo = storedName;
    } catch (error) {
      const message = error instanceof Error ? error.message : "file";
      return NextResponse.redirect(new URL(`/espace-enseignants/objets-perdus?error=${message}`, request.url), 303);
    }
  }

  await writeSchoolLife(data);
  return NextResponse.redirect(new URL("/espace-enseignants/objets-perdus?ok=1", request.url), 303);
}
