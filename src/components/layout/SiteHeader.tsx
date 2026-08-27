"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { espacesNav, hideSiteChrome, inscriptionCta, isEspacesActive, isNavItemActive, mainNav } from "@/lib/nav";
import { Logo } from "./Logo";

function Chevron() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3 opacity-60" aria-hidden>
      <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (hideSiteChrome(pathname)) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 md:px-6">
        <Logo />
        <nav className="hidden items-center lg:flex" aria-label="Navigation principale">
          {mainNav.map((link) => (
            <div key={link.label} className="relative group">
              <Link
                href={link.href}
                className={`inline-flex min-h-11 items-center gap-1 rounded-full px-2.5 text-sm font-medium transition ${
                  isNavItemActive(pathname, link)
                    ? "bg-green-soft text-green-deep"
                    : "text-ink/80 hover:bg-paper-2"
                }`}
              >
                {link.label}
                {link.children ? <Chevron /> : null}
              </Link>
              {link.children ? (
                <div className="invisible absolute left-0 top-full z-50 pt-1 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="min-w-56 rounded-2xl border border-line bg-white py-2 shadow-lg">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-4 py-2.5 text-sm hover:bg-paper-2 ${
                          pathname === child.href ? "font-semibold text-green-deep" : "text-ink/80"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href={inscriptionCta.href}
            className="hidden min-h-11 items-center rounded-full bg-terracotta px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#a84d0e] md:inline-flex"
          >
            {inscriptionCta.label}
          </Link>
          <div className="relative hidden group md:block">
            <button
              type="button"
              className={`inline-flex min-h-11 items-center gap-1 rounded-full border px-3 text-sm font-semibold ${
                isEspacesActive(pathname)
                  ? "border-green bg-green-soft text-green-deep"
                  : "border-green text-green-deep hover:bg-green-soft"
              }`}
              aria-haspopup="true"
            >
              Espaces
              <Chevron />
            </button>
            <div className="invisible absolute right-0 top-full z-50 pt-1 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="min-w-48 rounded-2xl border border-line bg-white py-2 shadow-lg">
                {espacesNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2.5 text-sm text-ink/80 hover:bg-paper-2"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-4 bg-ink" />
            </span>
          </button>
        </div>
      </div>
      {open ? (
        <div id="menu-mobile" className="max-h-[min(80vh,40rem)] overflow-y-auto border-t border-line bg-white px-4 py-4 lg:hidden">
          <nav className="grid gap-5" aria-label="Menu mobile">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-xl px-3 font-medium hover:bg-paper-2"
            >
              Accueil
            </Link>
            {mainNav
              .filter((link) => link.href !== "/")
              .map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted">{link.label}</p>
                    <div className="mt-1 grid gap-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="flex min-h-11 items-center rounded-xl px-3 text-sm hover:bg-paper-2"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center rounded-xl px-3 font-medium hover:bg-paper-2"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted">Espaces</p>
              <div className="mt-1 grid gap-1">
                {espacesNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center rounded-xl px-3 text-sm hover:bg-paper-2"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href={inscriptionCta.href}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center justify-center rounded-xl bg-terracotta px-3 font-semibold text-white"
            >
              {inscriptionCta.label}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
