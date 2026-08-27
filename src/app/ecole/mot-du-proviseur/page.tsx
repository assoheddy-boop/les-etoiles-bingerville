import { Container, EditorialNote, PageHero, Prose } from "@/components/ui/Page";
import { readCms } from "@/lib/cms";
import { paragraphs } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mot de la direction",
};

export default async function MotDuProviseurPage() {
  const cms = await readCms();

  return (
    <>
      <PageHero
        kicker="L’école"
        title={cms.motDuProviseur.title}
        lead={cms.motDuProviseur.authorLabel}
      />
      <Container className="max-w-3xl space-y-6 py-12">
        <EditorialNote>{cms.motDuProviseur.editorialNote}</EditorialNote>
        <Prose>
          {paragraphs(cms.motDuProviseur.body).map((block) => (
            <p key={block.slice(0, 24)} className="whitespace-pre-line">
              {block}
            </p>
          ))}
        </Prose>
      </Container>
    </>
  );
}
