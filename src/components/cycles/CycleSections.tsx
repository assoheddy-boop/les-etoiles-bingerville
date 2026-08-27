type RhythmStep = {
  time: string;
  emoji: string;
  label: string;
  detail: string;
};

export function CycleRhythm({ title, steps }: { title: string; steps: RhythmStep[] }) {
  return (
    <section className="rounded-[2rem] border border-line bg-gradient-to-b from-paper-2 to-paper p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">Quotidien</p>
      <h2 className="mt-2 font-display text-2xl text-green-deep md:text-3xl">{title}</h2>
      <ol className="mt-6 grid gap-3 sm:grid-cols-2">
        {steps.map((step) => (
          <li
            key={step.time + step.label}
            className="flex gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm"
          >
            <span className="text-2xl" aria-hidden>
              {step.emoji}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-coral">{step.time}</p>
              <p className="font-display text-lg text-green-deep">{step.label}</p>
              <p className="mt-1 text-sm text-muted">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function CycleExpectations({
  title,
  items,
  tint = "from-mint/30 to-sky/20",
}: {
  title: string;
  items: string[];
  tint?: string;
}) {
  return (
    <section className={`rounded-[2rem] border border-line bg-gradient-to-br ${tint} p-6 md:p-8`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">Pour les familles</p>
      <h2 className="mt-2 font-display text-2xl text-green-deep md:text-3xl">{title}</h2>
      <ul className="mt-5 grid gap-3">
        {items.map((item) => (
          <li
            key={item.slice(0, 40)}
            className="flex gap-3 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-ink/90"
          >
            <span className="text-coral" aria-hidden>
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
