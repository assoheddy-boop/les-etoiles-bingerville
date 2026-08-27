/** Décorations flottantes — page d’accueil (pastel, tout-petits). */
export function HomeSky() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <span className="home-blob home-blob-sky absolute -left-16 top-12 h-56 w-56 rounded-full opacity-70" />
      <span className="home-blob home-blob-mint absolute right-[-4rem] top-24 h-72 w-72 rounded-full opacity-60" />
      <span className="home-blob home-blob-peach absolute bottom-20 left-[15%] h-40 w-40 rounded-full opacity-50" />
      <span className="home-star animate-float absolute left-[12%] top-[18%] text-2xl text-gold/80">★</span>
      <span className="home-star animate-float-delay absolute right-[18%] top-[22%] text-xl text-coral/70">✦</span>
      <span className="home-star animate-float-slow absolute right-[28%] top-[55%] text-3xl text-sky/80">★</span>
      <span className="home-cloud animate-drift absolute left-[8%] bottom-[28%] text-4xl opacity-40">☁️</span>
      <span className="home-cloud animate-drift-reverse absolute right-[10%] bottom-[35%] text-3xl opacity-35">☁️</span>
    </div>
  );
}
