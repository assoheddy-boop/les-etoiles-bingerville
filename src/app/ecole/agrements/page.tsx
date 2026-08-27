import { Container, PageHero } from "@/components/ui/Page";
import { menApprovals, school } from "@/lib/school";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agréments MEN",
};

export default function AgrementsPage() {
  return (
    <>
      <PageHero
        kicker="Documents officiels"
        title="Agréments du Ministère de l’Éducation nationale"
        lead="Les familles peuvent vérifier le cadre légal de l’établissement. Les copies des décisions sont consultables au secrétariat."
      />
      <Container className="grid gap-6 py-12 md:grid-cols-2">
        {menApprovals.map((item) => (
          <article key={item.cycle} className="rounded-3xl border border-line bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">{item.cycle}</p>
            <h2 className="mt-2 font-display text-2xl text-green-deep">{item.schoolName}</h2>
            <p className="mt-4 text-lg">{item.decision}</p>
            <p className="text-muted">{item.date}</p>
          </article>
        ))}
        <article className="rounded-3xl border border-dashed border-gold bg-paper-2 p-8 md:col-span-2">
          <h2 className="font-display text-2xl text-green-deep">Secondaire</h2>
          <p className="mt-3 text-muted">
            Pas d’ouverture collège annoncée. L’établissement est préscolaire et primaire. Adresse :{" "}
            {school.address}
          </p>
        </article>
      </Container>
    </>
  );
}
