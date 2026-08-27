import { notFound } from "next/navigation";
import { Container, PageHero, Prose } from "@/components/ui/Page";
import { newsBySlug } from "@/lib/cms";
import { formatDateFr, paragraphs } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await newsBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <PageHero kicker={formatDateFr(article.publishedAt)} title={article.title} lead={article.excerpt} />
      <Container className="max-w-3xl py-12">
        <Prose>
          {paragraphs(article.body).map((block) => (
            <p key={block.slice(0, 32)}>{block}</p>
          ))}
        </Prose>
      </Container>
    </>
  );
}
