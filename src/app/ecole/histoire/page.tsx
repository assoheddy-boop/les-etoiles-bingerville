import { Container, EditorialNote, PageHero, Prose } from "@/components/ui/Page";
import { readCms } from "@/lib/cms";
import { paragraphs } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notre histoire",
};

export default async function HistoirePage() {
  const cms = await readCms();

  return (
    <>
      <PageHero kicker="L’école" title={cms.histoire.title} lead="Bingerville, depuis 2018." />
      <Container className="max-w-3xl space-y-6 py-12">
        <EditorialNote>{cms.histoire.editorialNote}</EditorialNote>
        <Prose>
          {paragraphs(cms.histoire.body).map((block) => (
            <p key={block.slice(0, 24)}>{block}</p>
          ))}
        </Prose>
      </Container>
    </>
  );
}
