"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ModuleTabs({ items }: { items: ReadonlyArray<{ href: string; label: string }> }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Sous-navigation">
      {items.map((item, index) => {
        const active =
          index === 0
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium ${
              active ? "bg-green text-white" : "border border-line bg-white hover:bg-paper-2"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
