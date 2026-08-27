import { NextResponse } from "next/server";
import { getAdminSession, staffRoleOf } from "@/lib/auth";
import { formInt, formText, withAdminMutate } from "@/lib/admin-api";
import { canToggleTeacherControl, DEFAULT_NO_MESSAGE_DAYS } from "@/lib/teacher-control";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.redirect(new URL("/admin/connexion", request.url), 303);
  }
  if (!canToggleTeacherControl(staffRoleOf(session))) {
    return NextResponse.redirect(new URL("/admin/controle-enseignants?error=forbidden", request.url), 303);
  }
  return withAdminMutate(request, "/admin/controle-enseignants/parametres", (data, form) => {
    const enabled = formText(form, "enabled") === "1";
    const days = formInt(form, "noMessageDays");
    data.teacherControlEnabled = enabled;
    data.teacherControlNoMessageDays = Number.isFinite(days) && days > 0 ? days : DEFAULT_NO_MESSAGE_DAYS;
    return "/admin/controle-enseignants/parametres?ok=1";
  });
}
