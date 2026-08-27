import Link from "next/link";

export function SubNav({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav className="border-b border-line bg-white" aria-label="Sous-navigation">
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 md:px-6">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full bg-paper-2 px-4 py-2.5 text-sm font-medium text-green-deep hover:bg-green-soft"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
