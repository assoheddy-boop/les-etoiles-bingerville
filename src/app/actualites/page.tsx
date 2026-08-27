import Link from "next/link";
import { Container, PageHero } from "@/components/ui/Page";
import { publishedNews } from "@/lib/cms";
import { formatDateFr } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Actualités" };

export default async function ActualitesPage() {
  const news = await publishedNews();

  return (
    <>
      <PageHero
        kicker="Vie scolaire"
        title="Actualités & communiqués"
        lead="Les informations de rentrée, les notes aux familles et la vie du campus."
      />
      <Container className="grid gap-4 py-12 md:grid-cols-2">
        {news.map((item) => (
          <Link
            key={item.id}
            href={`/actualites/${item.slug}`}
            className="rounded-3xl border border-line bg-white p-6 hover:border-green/40"
          >
            <p className="text-xs uppercase tracking-wider text-muted">{formatDateFr(item.publishedAt)}</p>
            <h2 className="mt-2 font-display text-2xl text-green-deep">{item.title}</h2>
            <p className="mt-3 text-muted">{item.excerpt}</p>
          </Link>
        ))}
      </Container>
    </>
  );
}
