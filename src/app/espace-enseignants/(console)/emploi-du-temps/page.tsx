import { TimetableGrid } from "@/components/school/TimetableGrid";
import { requireTeacher } from "@/lib/auth";
import { readSchoolLife, teacherTimetable } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function TeacherTimetablePage() {
  const session = await requireTeacher();
  const data = await readSchoolLife();
  const slots = teacherTimetable(session.teacherId, data);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-green-deep">Mon emploi du temps</h1>
        <p className="mt-2 text-muted">Cours qui vous sont attribués. La direction pose la grille dans l’admin.</p>
      </div>
      <article className="rounded-3xl border border-line bg-white p-6">
        <TimetableGrid
          slots={slots}
          data={data}
          emptyText="Aucun créneau pour vous. Demandez à la direction d’ajouter vos cours."
        />
      </article>
    </div>
  );
}
