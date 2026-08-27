import Link from "next/link";
import { Container, PageHero } from "@/components/ui/Page";
import { readCms } from "@/lib/cms";
import { school } from "@/lib/school";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Informations",
  description: `Horaires, cantine, transport et frais — ${school.name}, Bingerville.`,
};

export default async function InformationsPage() {
  const cms = await readCms();

  return (
    <>
      <PageHero kicker="Pratique" title={cms.informations.title} lead={cms.informations.intro} />
      <Container className="grid gap-4 py-12 md:grid-cols-2">
          {cms.informations.items.map((item) => (
          <article key={item.title} className="rounded-3xl border border-line bg-white p-6">
            <h2 className="font-display text-2xl text-green-deep">{item.title}</h2>
            <p className="mt-3 text-muted">{item.body}</p>
          </article>
        ))}
        <article className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-2xl text-green-deep">Objets perdus</h2>
          <p className="mt-3 text-muted">Tableau des objets trouvés sur les campus. Les familles connectées peuvent signaler « c’est à nous ».</p>
          <Link href="/informations/objets-perdus" className="mt-4 inline-block font-semibold text-green-deep underline">
            Voir le tableau
          </Link>
        </article>
      </Container>
    </>
  );
}
