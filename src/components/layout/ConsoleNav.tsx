"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ConsoleGroup, ConsoleLink } from "@/lib/nav";

function isConsoleHome(href: string) {
  return (
    href === "/admin" ||
    href === "/espace-parents" ||
    href === "/espace-enseignants" ||
    href === "/super-admin"
  );
}

function isActive(pathname: string, href: string) {
  if (isConsoleHome(href)) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isGroupActive(pathname: string, group: ConsoleGroup) {
  return group.links.some((link) => isActive(pathname, link.href));
}

function allLinks(groups: ConsoleGroup[]) {
  return groups.flatMap((group) => group.links);
}

function groupBadge(group: ConsoleGroup) {
  return group.links.reduce((sum, link) => sum + (link.badge ?? 0), 0);
}

function shouldUseDropdowns(groups: ConsoleGroup[]) {
  const links = allLinks(groups);
  return groups.length > 3 || links.length > 12;
}

function Chevron() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3 opacity-70" aria-hidden>
      <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function Badge({ count, className = "ml-1" }: { count?: number; className?: string }) {
  if (!count) return null;
  return (
    <span className={`rounded-full bg-terracotta px-1.5 py-0.5 text-[0.65rem] text-white ${className}`}>
      {count}
    </span>
  );
}

function LeafLink({
  link,
  pathname,
  className,
  activeClass,
  idleClass,
}: {
  link: ConsoleLink;
  pathname: string;
  className: string;
  activeClass: string;
  idleClass: string;
}) {
  return (
    <Link href={link.href} className={`${className} ${isActive(pathname, link.href) ? activeClass : idleClass}`}>
      {link.label}
      <Badge count={link.badge} />
    </Link>
  );
}

export function ConsoleNav({
  title,
  subtitle,
  groups,
  logoutNext,
  variant = "dark",
  homeHref = "/",
}: {
  title: string;
  subtitle?: string;
  groups: ConsoleGroup[];
  logoutNext: string;
  variant?: "dark" | "light";
  homeHref?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const links = allLinks(groups);
  const groupedDesktop = shouldUseDropdowns(groups);

  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    if (!openMenu) return;
    function onPointerDown(event: PointerEvent) {
      if (desktopNavRef.current && !desktopNavRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  const dark = variant === "dark";
  const bar = dark ? "border-line bg-green-deep text-white" : "border-line bg-white text-ink";
  const hover = dark ? "hover:bg-white/10" : "hover:bg-paper-2";
  const active = dark ? "bg-white/15 font-semibold" : "bg-green-soft font-semibold text-green-deep";
  const muted = dark ? "text-white/70" : "text-muted";
  const panel = dark ? "border-white/15 bg-green-deep" : "border-line bg-white";

  return (
    <div className={`border-b print:hidden ${bar}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="min-w-0">
          <p className="font-display text-lg leading-tight md:text-xl">{title}</p>
          {subtitle ? <p className={`truncate text-xs ${muted}`}>{subtitle}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={homeHref}
            className={`hidden min-h-11 items-center rounded-full px-3 text-sm font-medium lg:inline-flex ${hover}`}
          >
            Site
          </Link>
          <form action="/api/auth/logout" method="post" className="hidden lg:block">
            <input type="hidden" name="next" value={logoutNext} />
            <button className={`min-h-11 rounded-full px-3 text-sm ${hover}`}>Déconnexion</button>
          </form>
          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border lg:hidden ${
              dark ? "border-white/30" : "border-line"
            }`}
            aria-expanded={open}
            aria-controls="console-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu de l’espace</span>
            <span className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-5 ${dark ? "bg-white" : "bg-ink"}`} />
              <span className={`block h-0.5 w-5 ${dark ? "bg-white" : "bg-ink"}`} />
              <span className={`block h-0.5 w-4 ${dark ? "bg-white" : "bg-ink"}`} />
            </span>
          </button>
        </div>
      </div>

      <nav
        ref={desktopNavRef}
        className="hidden max-w-6xl flex-nowrap items-center gap-0.5 overflow-visible px-4 pb-3 lg:mx-auto lg:flex lg:px-6"
        aria-label="Navigation de l’espace"
      >
        {groupedDesktop
          ? groups.map((group, index) => {
              if (group.links.length === 1) {
                const link = group.links[0];
                return (
                  <LeafLink
                    key={link.href}
                    link={{ ...link, label: group.title }}
                    pathname={pathname}
                    className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-3 text-sm"
                    activeClass={active}
                    idleClass={hover}
                  />
                );
              }

              const expanded = openMenu === group.title;
              const groupOn = isGroupActive(pathname, group);
              const alignEnd = index >= groups.length - 2;
              const badge = groupBadge(group);

              return (
                <div
                  key={group.title}
                  className="relative shrink-0"
                  onMouseEnter={() => setOpenMenu(group.title)}
                  onMouseLeave={() => setOpenMenu(null)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setOpenMenu(null);
                    }
                  }}
                >
                  <button
                    type="button"
                    className={`inline-flex min-h-11 items-center gap-1 whitespace-nowrap rounded-full px-3 text-sm ${
                      groupOn ? active : hover
                    }`}
                    aria-expanded={expanded}
                    aria-haspopup="true"
                    onClick={() => setOpenMenu(expanded ? null : group.title)}
                  >
                    {group.title}
                    <Badge count={badge || undefined} />
                    <Chevron />
                  </button>
                  {expanded ? (
                    <div className={`absolute top-full z-50 pt-1 ${alignEnd ? "right-0" : "left-0"}`}>
                      <div className="min-w-56 rounded-2xl border border-line bg-paper py-1.5 text-ink shadow-lg">
                        {group.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={`flex min-h-11 items-center justify-between px-4 text-sm hover:bg-paper-2 ${
                              isActive(pathname, link.href) ? "font-semibold text-green-deep" : "text-ink/80"
                            }`}
                          >
                            <span>{link.label}</span>
                            <Badge count={link.badge} className="ml-3" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })
          : links.map((link) => (
              <LeafLink
                key={link.href}
                link={link}
                pathname={pathname}
                className="inline-flex min-h-11 items-center rounded-full px-3 text-sm"
                activeClass={active}
                idleClass={hover}
              />
            ))}
      </nav>

      {open ? (
        <div id="console-menu" className={`border-t px-4 py-4 lg:hidden ${panel}`}>
          <div className="grid gap-5">
            {groups.map((group) =>
              group.links.length === 1 ? (
                <Link
                  key={group.links[0].href}
                  href={group.links[0].href}
                  className={`flex min-h-11 items-center justify-between rounded-xl px-3 text-sm ${
                    isActive(pathname, group.links[0].href) ? active : hover
                  }`}
                >
                  <span>{group.links[0].label}</span>
                  <Badge count={group.links[0].badge} className="" />
                </Link>
              ) : (
                <div key={group.title}>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${muted}`}>{group.title}</p>
                  <div className="mt-2 grid gap-1">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex min-h-11 items-center justify-between rounded-xl px-3 text-sm ${
                          isActive(pathname, link.href) ? active : hover
                        }`}
                      >
                        <span>{link.label}</span>
                        <Badge count={link.badge} className="" />
                      </Link>
                    ))}
                  </div>
                </div>
              ),
            )}
            <Link href={homeHref} className={`flex min-h-11 items-center rounded-xl px-3 text-sm ${hover}`}>
              Retour au site
            </Link>
            <form action="/api/auth/logout" method="post">
              <input type="hidden" name="next" value={logoutNext} />
              <button className={`flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm ${hover}`}>
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
