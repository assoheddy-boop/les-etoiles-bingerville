import Link from "next/link";
import { school } from "@/lib/school";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-2 text-green-deep sm:gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky to-mint text-white shadow-sm sm:h-11 sm:w-11">
        <svg viewBox="0 0 40 40" className="h-7 w-7" aria-hidden>
          <polygon
            points="20,5 23.8,16.2 35.5,16.2 26.1,23.1 29.7,34.5 20,27.6 10.3,34.5 13.9,23.1 4.5,16.2 16.2,16.2"
            fill="#e8b84a"
          />
        </svg>
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-display text-base font-semibold tracking-tight sm:text-lg">{school.shortName}</span>
        {!compact ? (
          <span className="hidden text-xs text-muted sm:block">Bingerville · Adjamé-Bingerville</span>
        ) : null}
      </span>
    </Link>
  );
}
