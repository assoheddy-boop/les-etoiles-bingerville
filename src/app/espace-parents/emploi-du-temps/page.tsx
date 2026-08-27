import { TimetableGrid } from "@/components/school/TimetableGrid";
import { Container, PageHero } from "@/components/ui/Page";
import { requireParent } from "@/lib/auth";
import { classTimetable, parentChildView, readSchoolLife } from "@/lib/school-life";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ParentTimetablePage() {
  const session = await requireParent();
  const data = await readSchoolLife();
  const child = parentChildView(session.studentId, data);
  if (!child) notFound();
  const slots = classTimetable(child.classId, data);

  return (
    <>
      <PageHero
        kicker="Emploi du temps"
        title={`Semaine de ${child.studentName}`}
        lead={child.classroom}
      />
      <Container className="py-10">
        <article className="rounded-3xl border border-line bg-white p-6">
          <TimetableGrid
            slots={slots}
            data={data}
            emptyText="L’emploi du temps de la classe n’a pas encore été publié."
          />
        </article>
      </Container>
    </>
  );
}
