"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { facebookGallery, facebookPageUrl } from "@/lib/facebook-gallery";

export function HomeFacebookGallery() {
  const [active, setActive] = useState(0);
  const items = facebookGallery;

  useEffect(() => {
    if (items.length < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <section className="border-y border-line bg-gradient-to-b from-paper to-sky/20 py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">Sur nos réseaux</p>
            <h2 className="mt-2 font-display text-3xl text-green-deep md:text-4xl">
              La vie de l&apos;école en images
            </h2>
            <p className="mt-3 text-muted">
              Photos publiées sur notre page Facebook officielle — campus, classes et rentrée.
            </p>
          </div>
          <a
            href={facebookPageUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-5 font-semibold text-green-deep shadow-sm hover:border-green/30"
          >
            <span className="text-lg">📘</span>
            Voir sur Facebook
          </a>
        </div>

        {/* Bandeau défilant */}
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-line bg-white/80 shadow-sm">
          <div className="home-marquee-track flex gap-4 py-4">
            {[...items, ...items].map((item, i) => (
              <div
                key={`${item.src}-${i}`}
                className="relative h-36 w-56 shrink-0 overflow-hidden rounded-2xl md:h-44 md:w-72"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="288px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Vitrine principale */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-white shadow-md">
            <div className="relative aspect-[16/10] md:aspect-[16/9]">
              <Image
                src={items[active].src}
                alt={items[active].alt}
                fill
                className="object-cover transition duration-700"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-deep/50 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 font-display text-xl text-white drop-shadow md:text-2xl">
                {items[active].caption ?? items[active].alt}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
            {items.map((item, i) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setActive(i)}
                className={`home-card-hover relative aspect-square overflow-hidden rounded-2xl border-2 transition ${
                  i === active ? "border-coral ring-2 ring-coral/30" : "border-transparent opacity-80 hover:opacity-100"
                }`}
                aria-label={item.caption ?? item.alt}
              >
                <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="120px" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
