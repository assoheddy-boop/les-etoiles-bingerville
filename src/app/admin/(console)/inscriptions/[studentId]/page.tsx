import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminFlash, PageIntro } from "@/components/school/AdminUi";
import { InscriptionForm } from "@/components/school/InscriptionForm";
import { enrollmentForStudent } from "@/lib/enrollment";
import { currentYear, readSchoolLife, studentFullName } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function EditInscriptionPage({
  params,
  searchParams,
}: {
  params: Promise<{ studentId: string }>;
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { studentId } = await params;
  const { error, ok } = await searchParams;
  const data = await readSchoolLife();
  const student = data.students.find((row) => row.id === studentId);
  if (!student) notFound();
  const year = currentYear(data);
  const enrollment = enrollmentForStudent(studentId, data);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageIntro
          title={`Fiche d’inscription — ${studentFullName(student)}`}
          lead="Mettre à jour le dossier, cocher les pièces, imprimer les certificats."
        />
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/inscriptions" className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold">
            Liste
          </Link>
          <Link href="/admin/eleves" className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold">
            Élèves
          </Link>
          <Link
            href={`/api/admin/inscriptions/${student.id}/fiche`}
            className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold"
            target="_blank"
          >
            Fiche PDF
          </Link>
          <Link href="/admin/reinscriptions" className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold">
            Réinscription
          </Link>
        </div>
      </div>
      <AdminFlash ok={ok} error={error} />
      <InscriptionForm
        yearLabel={year?.label ?? "—"}
        classes={data.classes}
        parents={data.parents}
        student={student}
        enrollment={enrollment}
      />
    </div>
  );
}
