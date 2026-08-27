export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-4 md:px-6 ${className}`}>{children}</div>;
}

export function PageHero({
  kicker,
  title,
  lead,
}: {
  kicker?: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="border-b border-line bg-[linear-gradient(180deg,#f3ebe0_0%,#fbf7f1_100%)] py-8 md:py-16">
      <Container>
        {kicker ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">{kicker}</p>
        ) : null}
        <h1 className="mt-2 max-w-3xl font-display text-3xl text-green-deep sm:text-4xl md:text-5xl">{title}</h1>
        {lead ? <p className="mt-4 max-w-2xl text-lg text-muted">{lead}</p> : null}
      </Container>
    </section>
  );
}

export function EditorialNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-gold/50 bg-terracotta-soft/40 px-4 py-3 text-sm text-muted">
      {children}
    </p>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4 text-base leading-relaxed text-ink/90 md:text-lg">{children}</div>;
}
