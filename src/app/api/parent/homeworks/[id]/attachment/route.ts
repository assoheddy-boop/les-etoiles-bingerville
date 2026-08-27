import { NextResponse } from "next/server";
import { getParentSession } from "@/lib/auth";
import { contentDisposition, mimeFromFilename, readHomeworkAttachment } from "@/lib/homework-files";
import { parentPortalAllowed } from "@/lib/module-control";
import { homeworksForStudent, readSchoolLife } from "@/lib/school-life";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getParentSession();
  if (!session) {
    return NextResponse.redirect(new URL("/connexion", _request.url));
  }
  const { id } = await context.params;
  const data = await readSchoolLife();
  if (!parentPortalAllowed(data, session.studentId)) {
    return NextResponse.json({ error: "Module parents désactivé" }, { status: 403 });
  }
  const homework = homeworksForStudent(session.studentId, data).find((row) => row.id === id);
  if (!homework?.attachment) {
    return NextResponse.json({ error: "Pièce jointe introuvable." }, { status: 404 });
  }
  const bytes = await readHomeworkAttachment(homework.attachment);
  if (!bytes) {
    return NextResponse.json({ error: "Fichier absent du serveur." }, { status: 404 });
  }
  const filename = homework.attachmentName || homework.attachment;
  return new NextResponse(bytes as BodyInit, {
    headers: {
      "Content-Type": mimeFromFilename(filename),
      "Content-Disposition": contentDisposition(filename),
      "Cache-Control": "private, no-store",
    },
  });
}
