"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { school, whatsappUrl } from "@/lib/school";
import { footerGroups, hideSiteChrome, inscriptionCta } from "@/lib/nav";
import { Logo } from "./Logo";

export function SiteFooter() {
  const pathname = usePathname();
  if (hideSiteChrome(pathname)) return null;

  const mobile = school.phones[0];

  return (
    <footer className="mt-12 border-t border-line bg-green-deep text-white md:mt-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-2 md:gap-10 md:py-12 lg:grid-cols-4 md:px-6">
        <div>
          <div className="rounded-2xl bg-white/95 p-3 text-green-deep">
            <Logo />
          </div>
          <p className="mt-4 text-sm font-medium text-[#f6e4d4]">Abidjan · Bingerville · Adjamé</p>
          <p className="mt-2 max-w-sm text-sm text-white/80">{school.address}</p>
          <a href={mobile.href} className="mt-3 inline-flex min-h-11 items-center text-lg font-semibold hover:underline">
            {mobile.display}
          </a>
          <a
            href={`mailto:${school.email}`}
            className="mt-2 block text-sm text-white/85 hover:underline"
          >
            {school.email}
          </a>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={inscriptionCta.href}
              className="inline-flex min-h-11 items-center rounded-full bg-terracotta px-4 text-sm font-semibold"
            >
              Inscriptions
            </Link>
            <a
              href={whatsappUrl()}
              className="inline-flex min-h-11 items-center rounded-full bg-white/15 px-4 text-sm font-semibold hover:bg-white/25"
              rel="noreferrer"
              target="_blank"
            >
              WhatsApp
            </a>
            {school.facebook ? (
              <a
                href={school.facebook}
                className="inline-flex min-h-11 items-center rounded-full bg-white/15 px-4 text-sm font-semibold hover:bg-white/25"
                rel="noreferrer"
                target="_blank"
              >
                Facebook
              </a>
            ) : null}
          </div>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title} className={group.title === "Espaces" ? "" : "hidden md:block"}>
            <h2 className="font-display text-lg">{group.title}</h2>
            <ul className="mt-3 grid gap-1 text-sm text-white/85">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-10 items-center hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-between gap-2 border-t border-white/15 px-4 py-4 text-center text-xs text-white/65 sm:flex-row sm:text-left md:px-6">
        <p>
          © {new Date().getFullYear()} {school.legalName} — Abidjan, Bingerville, Adjamé.
        </p>
        <Link href="/mentions-legales" className="inline-flex min-h-10 items-center hover:text-white hover:underline">
          Mentions légales
        </Link>
      </div>
    </footer>
  );
}
