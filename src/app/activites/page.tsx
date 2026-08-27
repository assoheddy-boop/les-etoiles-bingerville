import Image from "next/image";
import Link from "next/link";
import { Container, PageHero } from "@/components/ui/Page";
import { activities } from "@/lib/activities";
import { homeActivitiesSection } from "@/lib/home-activities";
import { school } from "@/lib/school";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activités",
  description: `Éveil, créativité, sport et nature au ${school.name} — garderie, maternelle et primaire à Bingerville.`,
};

export default function ActivitesPage() {
  return (
    <>
      <PageHero
        kicker="Vie de l'école"
        title="Nos activités au quotidien"
        lead="Huit thèmes pour grandir en s'amusant — les mêmes que sur la page d'accueil, avec un peu plus de détail."
      />
      <Container className="space-y-10 py-12">
        <p className="max-w-3xl rounded-2xl border border-line bg-gradient-to-r from-peach/40 via-lavender/30 to-mint/30 px-5 py-4 text-ink/90">
          Les activités présentées ici correspondent à la section « {homeActivitiesSection.title} » de
          l&apos;accueil. Elles s&apos;adaptent à l&apos;âge des enfants (garderie, maternelle, primaire) et
          peuvent varier selon la semaine et les projets de classe.
        </p>

        {activities.map((activity, index) => (
          <article
            key={activity.slug}
            id={activity.slug}
            className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm md:grid md:grid-cols-2 md:items-stretch"
          >
            <div
              className={`relative min-h-[14rem] bg-gradient-to-br ${activity.tint} ${index % 2 === 1 ? "md:order-2" : ""}`}
            >
              {activity.image ? (
                <Image
                  src={activity.image}
                  alt={activity.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full min-h-[14rem] items-center justify-center">
                  <span className="text-6xl" aria-hidden>
                    {activity.emoji}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10">
              <p className="text-3xl" aria-hidden>
                {activity.emoji}
              </p>
              <h2 className="mt-3 font-display text-3xl text-green-deep">{activity.title}</h2>
              <p className="mt-2 text-lg font-medium text-terracotta">{activity.punchline}</p>
              <p className="mt-4 text-muted">{activity.details}</p>
            </div>
          </article>
        ))}

        <div className="flex flex-col gap-3 rounded-[2rem] bg-green-deep px-4 py-8 text-white sm:px-6 md:flex-row md:flex-wrap md:items-center md:justify-between md:px-10">
          <div>
            <p className="font-display text-2xl">Prêt à visiter le campus ?</p>
            <p className="mt-2 text-white/80">
              Inscriptions ouvertes — Bingerville, Adjamé-Bingerville.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/inscriptions"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-terracotta px-5 py-3 font-semibold"
            >
              Demander une inscription
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 py-3 font-semibold text-green-deep"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
