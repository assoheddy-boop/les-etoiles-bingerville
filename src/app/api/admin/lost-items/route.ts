import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { saveLostItemPhoto } from "@/lib/lost-item-photos";
import { addLostItem, readSchoolLife, todayISO, writeSchoolLife } from "@/lib/school-life";

function formText(form: FormData, key: string) {
  return String(form.get(key) || "").trim();
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.redirect(new URL("/admin/connexion", request.url), 303);
  }

  const form = await request.formData();
  const action = formText(form, "action") || "create";
  const data = await readSchoolLife();

  try {
    if (action === "claimed") {
      const item = data.lostItems.find((row) => row.id === formText(form, "id"));
      if (!item) throw new Error("missing");
      item.claimed = true;
      item.claimedAt = new Date().toISOString();
      await writeSchoolLife(data);
      return NextResponse.redirect(new URL("/admin/objets-perdus?ok=1", request.url), 303);
    }

    const description = formText(form, "description");
    const place = formText(form, "place");
    if (!description || !place) throw new Error("missing");

    const item = addLostItem(data, {
      description,
      place,
      foundAt: formText(form, "foundAt") || todayISO(),
      recordedBy: "school:secretariat",
    });

    const file = form.get("photo");
    if (file instanceof File && file.size > 0) {
      const storedName = await saveLostItemPhoto(item.id, file);
      if (storedName) item.photo = storedName;
    }

    await writeSchoolLife(data);
    return NextResponse.redirect(new URL("/admin/objets-perdus?ok=1", request.url), 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "error";
    return NextResponse.redirect(new URL(`/admin/objets-perdus?error=${message}`, request.url), 303);
  }
}
