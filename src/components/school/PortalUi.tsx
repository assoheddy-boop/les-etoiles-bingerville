import Link from "next/link";

export function Flash({ ok, error, okText, errorText }: { ok?: string; error?: string; okText: string; errorText: string }) {
  if (ok) {
    return (
      <p className="rounded-2xl bg-green-soft px-4 py-3 text-sm font-medium text-green-deep">{okText}</p>
    );
  }
  if (error) {
    return <p className="rounded-2xl bg-terracotta-soft px-4 py-3 text-sm text-terracotta">{errorText}</p>;
  }
  return null;
}

export function ModuleCard({
  href,
  title,
  hint,
  value,
}: {
  href: string;
  title: string;
  hint: string;
  value?: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-green/30 sm:p-6"
    >
      {value ? <p className="text-sm font-semibold text-terracotta">{value}</p> : null}
      <h2 className="mt-1 font-display text-xl text-green-deep sm:text-2xl">{title}</h2>
      <p className="mt-2 text-sm text-muted">{hint}</p>
    </Link>
  );
}
