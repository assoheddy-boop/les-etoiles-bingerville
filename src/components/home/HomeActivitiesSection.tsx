import Image from "next/image";
import { Container } from "@/components/ui/Page";
import { homeActivities, homeActivitiesSection } from "@/lib/home-activities";

const floatingDecor = [
  { emoji: "🧸", className: "left-[4%] top-[8%] animate-float text-2xl opacity-50" },
  { emoji: "🌈", className: "right-[6%] top-[12%] animate-float-delay text-3xl opacity-45" },
  { emoji: "⭐", className: "left-[10%] bottom-[18%] animate-float-slow text-xl opacity-40" },
  { emoji: "🎈", className: "right-[12%] bottom-[22%] animate-float text-2xl opacity-40" },
];

export function HomeActivitiesSection() {
  const { eyebrow, title, subtitle, note, cycles, closing } = homeActivitiesSection;

  return (
    <section
      id="activites"
      className="home-activities-section relative scroll-mt-24 overflow-hidden py-16 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <span className="home-blob home-blob-lavender absolute -left-20 top-10 h-64 w-64 rounded-full opacity-60" />
        <span className="home-blob home-blob-peach absolute -right-16 top-1/3 h-72 w-72 rounded-full opacity-50" />
        <span className="home-blob home-blob-mint absolute bottom-8 left-1/3 h-48 w-48 rounded-full opacity-45" />
        {floatingDecor.map((item) => (
          <span key={item.emoji} className={`absolute ${item.className}`} aria-hidden>
            {item.emoji}
          </span>
        ))}
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">{eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl text-green-deep md:text-4xl lg:text-[2.75rem]">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{subtitle}</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {cycles.map((cycle, i) => (
              <span
                key={cycle}
                className="home-activities-cycle animate-fade-up-stagger inline-flex items-center gap-1.5 rounded-full border border-line bg-white/80 px-4 py-1.5 text-sm font-semibold text-green-deep shadow-sm backdrop-blur-sm"
                style={{ animationDelay: `${0.08 + i * 0.06}s` }}
              >
                {cycle === "Garderie" && "🧸"}
                {cycle === "Maternelle" && "🌈"}
                {cycle === "Primaire" && "📚"}
                {cycle}
              </span>
            ))}
          </div>

          <p
            className="home-activities-note animate-fade-up-stagger mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-peach/70 via-lavender/50 to-mint/60 px-5 py-2 text-sm font-semibold text-green-deep shadow-sm"
            style={{ animationDelay: "0.28s" }}
          >
            <span aria-hidden>✨</span>
            {note}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-5">
          {homeActivities.map((activity, i) => (
            <article
              key={activity.slug}
              className={`home-activity-card group animate-fade-up-stagger overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br ${activity.tint} shadow-sm`}
              style={{ animationDelay: `${0.15 + i * 0.09}s` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {activity.image ? (
                  <Image
                    src={activity.image.src}
                    alt={activity.image.alt}
                    fill
                    className="object-cover transition duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-mint/60 to-sky/50">
                    <span className="text-6xl">{activity.emoji}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-green-deep/30 via-transparent to-white/10" />
                <span className="absolute left-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 text-2xl shadow-md backdrop-blur-sm transition group-hover:scale-110">
                  {activity.emoji}
                </span>
              </div>
              <div className="bg-white/92 p-5 backdrop-blur-sm md:p-6">
                <h3 className="font-display text-xl text-green-deep md:text-2xl">{activity.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/80 md:text-[0.95rem]">
                  {activity.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div
          className="home-activities-closing animate-fade-up-stagger mt-14 overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-br from-lavender/50 via-peach/40 to-mint/50 p-8 text-center shadow-md md:mt-16 md:p-12"
          style={{ animationDelay: "0.72s" }}
        >
          <span className="inline-block text-4xl md:text-5xl" aria-hidden>
            ✨
          </span>
          <h3 className="mt-3 font-display text-2xl text-green-deep md:text-3xl">{closing.title}</h3>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink/85 md:text-lg">
            {closing.text}
          </p>
        </div>
      </Container>
    </section>
  );
}
