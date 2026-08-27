import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Page";
import { activities, campusEntranceImage, heroImage } from "@/lib/activities";
import { publishedNews } from "@/lib/cms";
import { menApprovals, school } from "@/lib/school";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

const cycles = [
  {
    href: "/cycles/maternelle",
    title: "Maternelle",
    name: "Maternelle Les Étoiles",
    text: "Éveil, langage, motricité et premiers apprentissages dans un cadre sécurisé.",
  },
  {
    href: "/cycles/primaire",
    title: "Primaire",
    name: "Primaire Les Étoiles",
    text: "Du CP au CM2 : lecture, calcul, civisme et suivi régulier des familles.",
  },
  {
    href: "/cycles/secondaire",
    title: "Secondaire",
    name: "Non proposé pour l’instant",
    text: "L’objet social de l’établissement est le préscolaire et le primaire. Un collège n’est pas annoncé.",
  },
];

const values = [
  {
    title: "Pédagogie innovante",
    text: "On apprend autrement : ateliers, projets, langues et sciences. L’enfant fait, expérimente, comprend — il n’empile pas seulement des leçons.",
  },
  {
    title: "Accompagnement",
    text: "Chaque élève est suivi. Les familles sont informées, écoutées, associées. Un campus de quartier, une exigence claire, une équipe joignable.",
  },
  {
    title: "Grandir ensemble",
    text: "Natation, robotique, anglais, cuisine, danse : des activités qui construisent le caractère autant que les savoirs, dans l’esprit des Étoiles.",
  },
];

const voices = [
  {
    quote:
      "Enfin une école où mon enfant n’est pas un numéro. On sent l’accompagnement, au quotidien.",
    author: "Une maman, maternelle",
  },
  {
    quote: "La robotique et l’anglais ont changé sa façon d’apprendre. Il rentre fier.",
    author: "Un papa, primaire",
  },
  {
    quote: "Une équipe joignable, un campus à Adjamé-Bingerville, et des activités qui donnent envie.",
    author: "Une famille Les Étoiles",
  },
];

export default async function HomePage() {
  const news = (await publishedNews()).slice(0, 3);

  return (
    <>
      <section className="relative min-h-[70vh] overflow-hidden bg-green-deep text-white md:min-h-[78vh]">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority
          className="object-cover object-[center_42%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-deep/92 via-green-deep/72 to-green-deep/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-deep/80 via-transparent to-black/25" />

        <Container className="relative grid gap-10 py-16 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f6e4d4]">
              {school.name} · Bingerville · Adjamé-Bingerville
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-3xl leading-[1.12] sm:text-4xl md:text-6xl">
              Grandir, briller, exceller
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">{school.tagline}</p>
            <p className="mt-3 max-w-xl text-white/75">
              Garderie, maternelle et primaire à Adjamé-Bingerville. Les agréments MEN seront
              publiés dès confirmation. Un campus de quartier, une exigence claire, et des espaces
              numériques pour les familles et les enseignants.
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <a
                href="#activites"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-terracotta px-6 py-3 font-semibold text-white shadow-lg shadow-black/20 hover:bg-[#8e1629]"
              >
                Découvrir nos activités
              </a>
              <Link
                href="/inscriptions"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-green-deep hover:bg-paper"
              >
                Demander une inscription
              </Link>
              <Link
                href="/connexion"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/80 px-6 py-3 font-semibold text-white hover:bg-white/10"
              >
                Espace parents
              </Link>
              <Link
                href="/espace-enseignants/connexion"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/50 px-6 py-3 font-semibold text-white hover:bg-white/10"
              >
                Espace enseignants
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur-md">
            <p className="text-sm uppercase tracking-widest text-white/70">Agréments MEN</p>
            <ul className="mt-4 space-y-4">
              {menApprovals.map((item) => (
                <li key={item.cycle} className="rounded-2xl bg-white/10 p-4">
                  <p className="font-display text-xl">{item.cycle}</p>
                  <p className="text-sm text-white/80">{item.schoolName}</p>
                  <p className="mt-1 text-sm text-[#f6e4d4]">
                    {item.decision} · {item.date}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-white/70">{school.address}</p>
          </div>
        </Container>
      </section>

      <section id="activites" className="scroll-mt-24 py-16 md:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                Vie de l’école
              </p>
              <h2 className="mt-2 font-display text-3xl text-green-deep md:text-4xl">
                Activités phares
              </h2>
              <p className="mt-3 text-muted">
                Au-delà des programmes, Les Étoiles ouvre des ateliers qui forment le corps, l’esprit et le
                goût d’apprendre ensemble.
              </p>
            </div>
            <Link href="/activites" className="font-semibold text-green hover:underline">
              Voir toutes les activités
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <Link
                key={activity.slug}
                href={`/activites#${activity.slug}`}
                className="group overflow-hidden rounded-3xl border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:border-green/30 hover:shadow-md sm:last:col-span-2 lg:last:col-span-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={activity.image}
                    alt={activity.imageAlt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span className="absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 text-2xl shadow-sm">
                    {activity.emoji}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-2xl text-green-deep">{activity.title}</h3>
                  <p className="mt-2 text-ink/80">{activity.punchline}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper-2 py-16 md:py-20">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
            Témoignages & valeurs
          </p>
          <h2 className="mt-2 max-w-2xl font-display text-3xl text-green-deep md:text-4xl">
            Une pédagogie qui prend l’enfant au sérieux
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-3xl border border-line bg-white p-6 shadow-sm"
              >
                <h3 className="font-display text-2xl text-green-deep">{value.title}</h3>
                <p className="mt-3 text-muted">{value.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {voices.map((voice) => (
              <blockquote
                key={voice.author}
                className="rounded-3xl bg-green-deep px-6 py-7 text-white"
              >
                <p className="font-display text-xl leading-snug">« {voice.quote} »</p>
                <footer className="mt-4 text-sm text-[#f6e4d4]">{voice.author}</footer>
              </blockquote>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">L’école</p>
              <h2 className="mt-2 font-display text-3xl text-green-deep md:text-4xl">
                Trois cycles, un même campus
              </h2>
            </div>
            <Link href="/cycles" className="font-semibold text-green hover:underline">
              Voir les cycles
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {cycles.map((cycle) => (
              <Link
                key={cycle.href}
                href={cycle.href}
                className="rounded-3xl border border-line bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-green/30"
              >
                <p className="text-sm text-terracotta">{cycle.title}</p>
                <h3 className="mt-1 font-display text-2xl text-green-deep">{cycle.name}</h3>
                <p className="mt-3 text-muted">{cycle.text}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper-2 py-14">
        <Container className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-3xl text-green-deep">Pourquoi les familles choisissent Les Étoiles</h2>
            <ul className="mt-6 grid gap-4">
              {[
                "Agréments MEN : numéros à confirmer auprès de la direction — pas de numéros inventés.",
                "Un campus à Adjamé-Bingerville : garderie au CM2, 16 classes, cantine et terrain de sport.",
                "Parcours clair : visiter, demander une inscription, puis payer scolarité et cantine.",
                "Une équipe joignable : téléphone, e-mail, WhatsApp et formulaire.",
              ].map((item) => (
                <li key={item} className="rounded-2xl bg-white px-4 py-3 text-ink/90">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-gold bg-white">
            <div className="relative aspect-[16/10]">
              <Image
                src={campusEntranceImage.src}
                alt={campusEntranceImage.alt}
                fill
                className="object-cover object-[center_40%]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-8">
              <p className="font-display text-2xl text-green-deep">Adjamé-Bingerville</p>
              <p className="mt-3 text-muted">
                Le campus tel qu’il a été présenté à la notabilité en septembre 2023. L’histoire de
                l’école et le cadre légal restent en un clic.
              </p>
              <Link href="/ecole/histoire" className="mt-6 inline-block font-semibold text-terracotta hover:underline">
                Lire notre histoire
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-green-deep">Actualités</h2>
            <Link href="/actualites" className="font-semibold text-green hover:underline">
              Tout voir
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/actualites/${item.slug}`}
                className="rounded-3xl border border-line bg-white p-6 hover:border-green/30"
              >
                <p className="text-xs uppercase tracking-wider text-muted">{formatDateFr(item.publishedAt)}</p>
                <h3 className="mt-2 font-display text-xl text-green-deep">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <h2 className="font-display text-3xl text-green-deep">Espaces numériques</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Comme un EduConnect d’école unique : les parents voient le suivi de l’enfant, les
            enseignants font l’appel et publient les devoirs, le vigile valide les sorties à la
            grille, la direction a une vue légère.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/connexion",
                title: "Parents",
                text: "Paiements, notes, absences, devoirs, bulletins et messages à l’enseignant.",
              },
              {
                href: "/espace-enseignants/connexion",
                title: "Enseignants",
                text: "Appel du jour, devoirs, notes et contact avec les familles.",
              },
              {
                href: "/espace-vigile/connexion",
                title: "Vigile",
                text: "Validation des sorties à la grille — scan ou saisie du code du jour.",
              },
              {
                href: "/admin/connexion",
                title: "Direction",
                text: "Contenu du site, demandes d’inscription et synthèse de la vie scolaire.",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-3xl border border-line bg-white p-6 hover:border-green/30"
              >
                <h3 className="font-display text-2xl text-green-deep">{item.title}</h3>
                <p className="mt-2 text-muted">{item.text}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-16">
        <Container className="grid gap-6 rounded-[2rem] bg-green px-4 py-8 text-white sm:px-6 md:grid-cols-2 md:items-center md:px-10 md:py-10">
          <div>
            <h2 className="font-display text-3xl">Venir nous voir</h2>
            <p className="mt-3 text-white/85">{school.address}</p>
            <p className="mt-2 text-white/75">{school.hours}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 py-3 font-semibold text-green-deep">
              Contact & plan d’accès
            </Link>
            <a
              href={school.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white px-5 py-3 font-semibold"
            >
              Ouvrir la carte
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
