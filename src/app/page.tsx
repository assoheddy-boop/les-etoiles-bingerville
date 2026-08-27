import Image from "next/image";
import Link from "next/link";
import { FacebookPageEmbed } from "@/components/home/FacebookPageEmbed";
import { HomeFacebookGallery } from "@/components/home/HomeFacebookGallery";
import { HomeSky } from "@/components/home/HomeSky";
import { Container } from "@/components/ui/Page";
import { HomeActivitiesSection } from "@/components/home/HomeActivitiesSection";
import { campusEntranceImage, heroImage } from "@/lib/activities";
import { publishedNews } from "@/lib/cms";
import { facebookMotto } from "@/lib/facebook-gallery";
import { menApprovals, school } from "@/lib/school";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

const cycles = [
  {
    href: "/cycles/garderie",
    emoji: "🧸",
    title: "Garderie",
    name: "Les tout-petits",
    text: "Dès 3 mois : jeux doux, repas, repos et premiers liens en toute sécurité.",
    tint: "from-sky/40 to-mint/30",
  },
  {
    href: "/cycles/maternelle",
    emoji: "🌈",
    title: "Maternelle",
    name: "Petite, moyenne, grande",
    text: "Éveil, langage, motricité et vie en groupe — chaque jour une petite découverte.",
    tint: "from-lavender/50 to-peach/40",
  },
  {
    href: "/cycles/primaire",
    emoji: "📚",
    title: "Primaire",
    name: "Du CP au CM2",
    text: "Lire, compter, raisonner et grandir avec confiance, du CP1 au CM2.",
    tint: "from-mint/40 to-green-soft",
  },
];

const values = [
  {
    emoji: "🤗",
    title: "Bienveillance",
    text: "Chaque enfant est accueilli par son nom. On écoute, on rassure, on accompagne sans précipiter.",
  },
  {
    emoji: "🌱",
    title: "Éveil joyeux",
    text: "Jeux, ateliers, langues et sciences : on apprend en faisant, avec le sourire et la curiosité.",
  },
  {
    emoji: "👨‍👩‍👧",
    title: "Familles partenaires",
    text: "Parents informés, joignables et associés. Une école de quartier, une équipe qui répond.",
  },
];

const dayRhythm = [
  { time: "7h30", emoji: "☀️", label: "Accueil chaleureux", detail: "Bonjour, câlin, rituel du matin et jeux libres." },
  { time: "10h", emoji: "🎨", label: "Ateliers & jeux", detail: "Peinture, motricité, langage, musique ou sortie." },
  { time: "12h", emoji: "🍎", label: "Repas & repos", detail: "Cantine ou collation, puis temps calme adapté à l’âge." },
  { time: "15h", emoji: "🏃", label: "Jeux & activités", detail: "Cour, natation, anglais, danse — selon le cycle." },
  { time: "16h30", emoji: "🌙", label: "Au revoir", detail: "Retour serein aux familles, avec le sourire." },
];

const voices = [
  {
    quote: "Mon bébé s’adapte bien : on sent la douceur dès l’accueil en garderie.",
    author: "Une maman, garderie",
  },
  {
    quote: "En maternelle, elle ose parler, dessiner, jouer avec les autres. Elle adore venir.",
    author: "Un papa, maternelle",
  },
  {
    quote: "Au primaire, les devoirs sont clairs et l’équipe répond vite sur WhatsApp.",
    author: "Une famille Les Étoiles",
  },
];

export default async function HomePage() {
  const news = (await publishedNews()).slice(0, 3);

  return (
    <>
      {/* 1. Hero immersif */}
      <section className="relative min-h-[78vh] overflow-hidden bg-gradient-to-br from-sky/30 via-paper to-peach/40 md:min-h-[85vh]">
        <HomeSky />
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority
          className="object-cover object-[center_42%] opacity-40 mix-blend-soft-light"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/70 to-transparent" />

        <Container className="relative grid gap-10 py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-20">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-green-deep shadow-sm">
              <span className="animate-gentle-pulse">★</span>
              {school.educationLevels} · Bingerville
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-peach/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-green-deep">
              {facebookMotto}
            </p>
            <h1 className="mt-5 max-w-2xl font-display text-3xl leading-[1.1] text-green-deep sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              Un lieu doux pour grandir,{" "}
              <span className="text-coral">briller</span> et s&apos;épanouir
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink/85">
              {school.tagline} De la garderie au CM2, Les Étoiles accueille les tout-petits et les
              enfants dans un campus chaleureux à Adjamé-Bingerville.
            </p>
            <p className="mt-2 max-w-xl text-muted">
              Jeux, routines rassurantes, ateliers joyeux et espaces numériques pour les familles —
              sans stress, avec une équipe bienveillante.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#cycles"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-coral px-6 py-3 font-semibold text-white shadow-md shadow-coral/25 transition hover:bg-coral-deep hover:shadow-lg"
              >
                Nos trois parcours
              </a>
              <Link
                href="/inscriptions"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-green-deep px-6 py-3 font-semibold text-white shadow-md transition hover:bg-green"
              >
                Demander une inscription
              </Link>
              <Link
                href="/connexion"
                className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-green-deep/20 bg-white/90 px-6 py-3 font-semibold text-green-deep hover:bg-green-soft"
              >
                Espace parents
              </Link>
            </div>
          </div>

          <div className="animate-fade-up-delay rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-lg shadow-sky/10 backdrop-blur-md">
            <p className="text-sm font-semibold uppercase tracking-widest text-coral">Nos parcours</p>
            <ul className="mt-4 space-y-3">
              {cycles.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className={`flex items-center gap-3 rounded-2xl bg-gradient-to-r ${c.tint} p-4 transition hover:shadow-md`}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                      {c.emoji}
                    </span>
                    <div>
                      <p className="font-display text-lg text-green-deep">{c.title}</p>
                      <p className="text-sm text-muted">{c.name}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">{school.address}</p>
          </div>
        </Container>
      </section>

      <HomeFacebookGallery />

      {/* 2. Trois cycles */}
      <section id="cycles" className="scroll-mt-24 py-16 md:py-20">
        <Container>
          <div className="max-w-2xl animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">Nos parcours</p>
            <h2 className="mt-2 font-display text-3xl text-green-deep md:text-4xl">
              Garderie, maternelle et primaire
            </h2>
            <p className="mt-3 text-muted">
              Un seul campus, trois étapes pour accompagner l&apos;enfant de ses premiers mois jusqu&apos;au
              CM2 — avec la même exigence bienveillante.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {cycles.map((cycle, i) => (
              <Link
                key={cycle.href}
                href={cycle.href}
                className={`home-card-hover rounded-3xl border border-line bg-gradient-to-br ${cycle.tint} p-6`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="text-4xl">{cycle.emoji}</span>
                <p className="mt-4 text-sm font-semibold text-coral">{cycle.title}</p>
                <h3 className="mt-1 font-display text-2xl text-green-deep">{cycle.name}</h3>
                <p className="mt-3 text-ink/80">{cycle.text}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-green-deep">
                  En savoir plus →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Une journée type */}
      <section className="bg-gradient-to-b from-paper-2 to-paper py-16 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">Quotidien</p>
            <h2 className="mt-2 font-display text-3xl text-green-deep md:text-4xl">
              Une journée à Les Étoiles
            </h2>
            <p className="mt-3 text-muted">
              Des routines claires et douces : les enfants savent ce qui les attend, les parents sont
              rassurés.
            </p>
          </div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {dayRhythm.map((step, i) => (
              <li
                key={step.time}
                className="home-card-hover rounded-3xl border border-line bg-white p-5 text-center shadow-sm"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <span className="text-3xl">{step.emoji}</span>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-coral">{step.time}</p>
                <p className="mt-1 font-display text-lg text-green-deep">{step.label}</p>
                <p className="mt-2 text-sm text-muted">{step.detail}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <HomeActivitiesSection />

      {/* 5. Valeurs + témoignages */}
      <section className="bg-gradient-to-br from-lavender/30 via-paper-2 to-mint/20 py-16 md:py-20">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">Nos valeurs</p>
          <h2 className="mt-2 max-w-2xl font-display text-3xl text-green-deep md:text-4xl">
            Prendre l&apos;enfant au sérieux, avec douceur
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.title}
                className="home-card-hover rounded-3xl border border-line bg-white p-6 shadow-sm"
              >
                <span className="text-3xl">{value.emoji}</span>
                <h3 className="mt-3 font-display text-2xl text-green-deep">{value.title}</h3>
                <p className="mt-3 text-muted">{value.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {voices.map((voice) => (
              <blockquote
                key={voice.author}
                className="rounded-3xl bg-green-deep px-6 py-7 text-white shadow-md"
              >
                <p className="font-display text-xl leading-snug">« {voice.quote} »</p>
                <footer className="mt-4 text-sm text-sky/90">{voice.author}</footer>
              </blockquote>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. Pourquoi nous */}
      <section className="py-14">
        <Container className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-3xl text-green-deep">
              Pourquoi les familles choisissent Les Étoiles
            </h2>
            <ul className="mt-6 grid gap-3">
              {[
                "Garderie, maternelle et primaire sur un même campus à Adjamé-Bingerville.",
                "Classes à effectif maîtrisé — environ 25 enfants, un élève par table.",
                "Cantine, terrain de sport, salle multimédia et espace de jeux.",
                "Équipe joignable : téléphone, e-mail, WhatsApp et formulaire en ligne.",
                "Agréments MEN : numéros publiés dès confirmation par la direction.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-ink/90"
                >
                  <span className="text-coral">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-lg shadow-sky/10">
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
              <p className="font-display text-2xl text-green-deep">Notre campus</p>
              <p className="mt-3 text-muted">
                16 classes, cantine, cour de jeux et terrain de sport. Un cadre pensé pour les
                tout-petits et les enfants du primaire.
              </p>
              <Link
                href="/ecole/histoire"
                className="mt-6 inline-block font-semibold text-coral hover:underline"
              >
                Notre histoire
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Agréments */}
      <section className="bg-paper-2 py-12">
        <Container>
          <h2 className="font-display text-2xl text-green-deep">Agréments & cadre légal</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {menApprovals.map((item) => (
              <div key={item.cycle} className="rounded-2xl border border-line bg-white p-5">
                <p className="font-display text-xl text-green-deep">{item.cycle}</p>
                <p className="text-sm text-muted">{item.schoolName}</p>
                <p className="mt-2 text-sm text-coral">{item.decision} · {item.date}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <FacebookPageEmbed />

      {/* 8. Actualités */}
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
                className="home-card-hover rounded-3xl border border-line bg-white p-6"
              >
                <p className="text-xs uppercase tracking-wider text-muted">
                  {formatDateFr(item.publishedAt)}
                </p>
                <h3 className="mt-2 font-display text-xl text-green-deep">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 9. Espaces numériques — texte allégé */}
      <section className="pb-16">
        <Container>
          <h2 className="font-display text-3xl text-green-deep">Espaces numériques</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Parents, enseignants et direction : chacun a son espace pour suivre la vie scolaire au
            quotidien.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/connexion",
                emoji: "👨‍👩‍👧",
                title: "Parents",
                text: "Notes, devoirs, bulletins, messages et paiements.",
              },
              {
                href: "/espace-enseignants/connexion",
                emoji: "👩‍🏫",
                title: "Enseignants",
                text: "Appel, devoirs, notes et contact avec les familles.",
              },
              {
                href: "/espace-vigile/connexion",
                emoji: "🛡️",
                title: "Vigile",
                text: "Validation des sorties à la grille.",
              },
              {
                href: "/admin/connexion",
                emoji: "🏫",
                title: "Direction",
                text: "Vie scolaire, inscriptions et contenu du site.",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="home-card-hover rounded-3xl border border-line bg-white p-6"
              >
                <span className="text-2xl">{item.emoji}</span>
                <h3 className="mt-3 font-display text-2xl text-green-deep">{item.title}</h3>
                <p className="mt-2 text-muted">{item.text}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 10. CTA visite */}
      <section className="pb-16">
        <Container
          className="grid gap-6 rounded-[2rem] bg-gradient-to-br from-green-deep via-green to-sky px-4 py-10 text-white sm:px-6 md:grid-cols-2 md:items-center md:px-10"
        >
          <div>
            <h2 className="font-display text-3xl">Venez nous rencontrer</h2>
            <p className="mt-3 text-white/90">{school.address}</p>
            <p className="mt-2 text-white/80">{school.hours}</p>
            <p className="mt-4 text-sm text-white/75">
              Une visite permet de voir les classes, poser vos questions et sentir l&apos;ambiance.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 py-3 font-semibold text-green-deep shadow-md"
            >
              Contact & plan d&apos;accès
            </Link>
            <Link
              href="/inscriptions"
              className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-white/80 px-5 py-3 font-semibold hover:bg-white/10"
            >
              Demander une inscription
            </Link>
            <a
              href={school.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/50 px-5 py-3 font-semibold"
            >
              Ouvrir la carte
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
