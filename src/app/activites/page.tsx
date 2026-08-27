import Image from "next/image";
import Link from "next/link";
import { Container, PageHero } from "@/components/ui/Page";
import { activities } from "@/lib/activities";
import { school } from "@/lib/school";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activités",
  description: `Natation, robotique, anglais, cuisine et danse aux ${school.name}, Bingerville — Adjamé.`,
};

export default function ActivitesPage() {
  return (
    <>
      <PageHero
        kicker="Apprendre autrement"
        title="Nos activités phares"
        lead="Cinq ateliers pour grandir ensemble : le corps, la créativité, la langue, le goût et l’expression."
      />
      <Container className="space-y-10 py-12">
        {activities.map((activity, index) => (
          <article
            key={activity.slug}
            id={activity.slug}
            className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm md:grid md:grid-cols-2 md:items-stretch"
          >
            <div className={`relative min-h-[16rem] ${index % 2 === 1 ? "md:order-2" : ""}`}>
              <Image
                src={activity.image}
                alt={activity.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
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
            <p className="mt-2 text-white/80">Inscriptions ouvertes — Bingerville, Adjamé.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/inscriptions" className="inline-flex min-h-12 items-center justify-center rounded-full bg-terracotta px-5 py-3 font-semibold">
              Demander une inscription
            </Link>
            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 py-3 font-semibold text-green-deep">
              Nous contacter
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
