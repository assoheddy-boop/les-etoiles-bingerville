import Link from "next/link";
import { AdminFlash, PageIntro } from "@/components/school/AdminUi";
import { InscriptionForm } from "@/components/school/InscriptionForm";
import { readInbox } from "@/lib/cms";
import { currentYear, readSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function NouvelleInscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    inboxId?: string;
    enrollmentStatus?: string;
    classId?: string;
  }>;
}) {
  const { error, inboxId, enrollmentStatus, classId } = await searchParams;
  const data = await readSchoolLife();
  const year = currentYear(data);
  const inbox = inboxId ? (await readInbox()).find((item) => item.id === inboxId) : undefined;
  const cycleClass = classId || data.classes.find((item) => item.cycle === inbox?.cycle)?.id;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageIntro
          title="Inscription"
          lead="Fiche secrétariat : année, effectif, identité, famille, pièces du dossier."
        />
        <Link href="/admin/inscriptions" className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold">
          Liste
        </Link>
      </div>
      <AdminFlash error={error} />
      {inbox ? (
        <p className="rounded-2xl border border-green/20 bg-green-soft px-4 py-3 text-sm">
          Demande web de <strong>{inbox.name}</strong>
          {inbox.cycle ? ` · ${inbox.cycle}` : ""} : {inbox.message}
        </p>
      ) : null}
      <InscriptionForm
        yearLabel={year?.label ?? "—"}
        classes={data.classes}
        parents={data.parents}
        prefill={{
          inboxId,
          guardianName: inbox?.name,
          guardianPhone: inbox?.phone,
          contactEmail: inbox?.email,
          classId: cycleClass,
          enrollmentStatus: enrollmentStatus || "NOUVEAU",
        }}
      />
    </div>
  );
}
