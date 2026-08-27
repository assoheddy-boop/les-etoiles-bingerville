import { Container, PageHero, Prose } from "@/components/ui/Page";
import { school } from "@/lib/school";
import { siteUrl } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site ${school.name}.`,
};

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHero
        kicker="Informations légales"
        title="Mentions légales"
        lead={`${school.legalName} — Abidjan, Bingerville, Adjamé.`}
      />
      <Container className="max-w-3xl py-12">
        <Prose>
          <h2 className="font-display text-2xl text-green-deep">Éditeur du site</h2>
          <p>
            {school.legalName}
            <br />
            {school.address}
            <br />
            {school.bp}
          </p>
          <p>
            Téléphone :{" "}
            <a href={school.phones[0].href} className="font-semibold text-green hover:underline">
              {school.phones[0].display}
            </a>
            <br />
            E-mail :{" "}
            <a href={`mailto:${school.email}`} className="font-semibold text-green hover:underline">
              {school.email}
            </a>
          </p>

          <h2 className="font-display text-2xl text-green-deep">Hébergement</h2>
          <p>
            Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
            Adresse publique actuelle : {siteUrl.replace(/^https?:\/\//, "")}.
          </p>

          <h2 className="font-display text-2xl text-green-deep">Propriété intellectuelle</h2>
          <p>
            Les textes, marques et éléments graphiques de ce site sont la propriété de {school.legalName},
            sauf mention contraire. Toute reproduction non autorisée est interdite.
          </p>

          <h2 className="font-display text-2xl text-green-deep">Données personnelles</h2>
          <p>
            Les informations collectées via les formulaires (inscription, contact) sont destinées
            exclusivement à la gestion de la relation avec les familles et à l’administration de
            l’établissement. Pour toute question, écrivez à {school.email}.
          </p>

          <h2 className="font-display text-2xl text-green-deep">Crédits photographiques</h2>
          <p>
            La photo d’enseigne (septembre 2023) provient de FratMat / Fraternité Matin, dans le cadre
            de la présentation du campus à la notabilité d’Adjamé-Bingerville. Les autres photographies
            illustratives viennent d’Unsplash et de Pexels (licences libres) : enfants africains en
            milieu scolaire, ou scènes d’activités sans identifier les élèves de l’établissement.
          </p>
        </Prose>
      </Container>
    </>
  );
}
