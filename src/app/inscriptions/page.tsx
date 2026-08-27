import { ContactForm } from "@/components/forms/ContactForm";
import { Container, PageHero } from "@/components/ui/Page";
import { school, whatsappUrl } from "@/lib/school";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscriptions",
  description:
    "Demande d'inscription au Groupe scolaire Les Étoiles de Bingerville — garderie, maternelle et primaire. Pas de paiement en ligne pour l'instant.",
};

export default function InscriptionsPage() {
  return (
    <>
      <PageHero
        kicker="Rejoindre Les Étoiles"
        title="Demander une inscription"
        lead="Une démarche simple et rassurante : vous nous écrivez, le secrétariat vous rappelle, puis le dossier se finalise sur place — sans paiement en ligne pour l'instant."
      />
      <Container className="grid gap-10 py-12 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-coral/30 bg-peach/30 px-5 py-4 text-sm text-ink/90">
            <p className="font-semibold text-green-deep">Pas de paiement en ligne pour l&apos;instant</p>
            <p className="mt-2">
              Le formulaire sert à transmettre votre demande. Les frais d&apos;inscription et de scolarité se
              règlent auprès du secrétariat, une fois votre dossier validé. L&apos;espace parents servira aux
              paiements en ligne dès que la direction activera cette option.
            </p>
          </div>

          <ol className="space-y-4">
            {[
              "Remplissez le formulaire ci-contre ou écrivez-nous sur WhatsApp.",
              "Le secrétariat vous contacte pour confirmer le cycle souhaité (garderie, maternelle ou primaire). Objectif : réponse sous 24 h les jours ouvrés.",
              "Vous déposez les pièces au campus d'Adjamé-Bingerville et finalisez l'inscription avec l'équipe.",
              "Après inscription, l'espace parents permet de suivre la scolarité (notes, devoirs, cantine).",
            ].map((step, index) => (
              <li key={step} className="flex gap-4 rounded-2xl border border-line bg-white p-4">
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
              <li>Photos d&apos;identité</li>
              <li>Carnet de vaccination (maternelle)</li>
              <li>Bulletins de l&apos;année précédente (primaire)</li>
              <li>Pièce d&apos;identité du parent</li>
            </ul>
            <p className="mt-4 text-sm text-muted">
              Les tarifs officiels seront publiés dès validation par la direction. En attendant, contactez le
              secrétariat : {school.phones[0].display} ou {school.email}.
            </p>
            <a
              href={whatsappUrl(
                "Bonjour, je souhaite inscrire un enfant au Groupe scolaire Les Étoiles de Bingerville.",
              )}
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
