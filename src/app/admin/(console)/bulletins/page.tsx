import { Card, PageIntro } from "@/components/school/AdminUi";
import { classLabel, readSchoolLife, studentFullName } from "@/lib/school-life";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBulletinsPage() {
  const data = await readSchoolLife();

  return (
    <div className="space-y-6">
      <PageIntro
        title="Bulletins"
        lead="Téléchargement des bulletins MENET-FP (logo Les Étoiles, coefficients, signatures). Les familles les retrouvent aussi dans l’espace parents."
      />
      {data.bulletins.map((item) => {
        const student = data.students.find((row) => row.id === item.studentId);
        return (
          <Card key={item.id} title={`${student ? studentFullName(student) : item.studentId} · ${item.period}`}>
            <p className="text-sm text-muted">
              {student ? classLabel(student.classId, data) : ""} · Moyenne {item.average}/20 · publié le{" "}
              {formatDateFr(item.createdAt)}
            </p>
            <p className="mt-2 text-sm">{item.comment}</p>
            <a
              href={`/api/admin/bulletins/${item.id}/pdf`}
              className="mt-4 inline-flex rounded-full bg-green px-5 py-2.5 font-semibold text-white hover:bg-green-deep"
            >
              Télécharger le PDF
            </a>
          </Card>
        );
      })}
    </div>
  );
}
