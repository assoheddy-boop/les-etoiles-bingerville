import { ContactForm } from "@/components/forms/ContactForm";
import { Container, PageHero } from "@/components/ui/Page";
import { school, whatsappUrl } from "@/lib/school";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscriptions",
};

export default function InscriptionsPage() {
  return (
    <>
      <PageHero
        kicker="Rejoindre Les Étoiles"
        title="Demander une inscription"
        lead="Procédure simple : vous nous écrivez, le secrétariat rappelle, puis le dossier se finalise à l’école."
      />
      <Container className="grid gap-10 py-12 lg:grid-cols-2">
        <div className="space-y-6">
          <ol className="space-y-4">
            {[
              "Remplissez le formulaire ou écrivez sur WhatsApp.",
              "Le secrétariat vous contacte (objectif : 24 h les jours ouvrés).",
              "Vous déposez les pièces au campus d’Adjamé-Bingerville.",
              "Après inscription, l’espace parents sert à la scolarité et à la cantine.",
            ].map((step, index) => (
              <li key={step} className="flex gap-4 rounded-2xl bg-white p-4 border border-line">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="rounded-3xl bg-paper-2 p-6">
            <h2 className="font-display text-2xl text-green-deep">Pièces souvent demandées</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
              <li>Extrait de naissance</li>
              <li>Photos d’identité</li>
              <li>Carnet de vaccination (maternelle)</li>
              <li>Bulletins de l’année précédente (primaire)</li>
              <li>Pièce d’identité du parent</li>
            </ul>
            <p className="mt-4 text-sm text-muted">
              Les tarifs officiels seront publiés dès validation par la direction. En attendant,
              contactez-nous : {school.phones[0].display}.
            </p>
            <a
              href={whatsappUrl("Bonjour, je souhaite inscrire un enfant au Groupe scolaire Les Étoiles de Bingerville.")}
              className="mt-4 inline-flex font-semibold text-green hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp inscription
            </a>
          </div>
        </div>
        <ContactForm kind="inscription" />
      </Container>
    </>
  );
}
