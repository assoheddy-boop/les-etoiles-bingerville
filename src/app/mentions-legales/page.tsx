import Link from "next/link";
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

          <h2 className="font-display text-2xl text-green-deep">Données personnelles et confidentialité</h2>
          <p>
            Pour le détail des traitements, voir la{" "}
            <Link href="/politique-confidentialite" className="font-semibold text-green hover:underline">
              politique de confidentialité
            </Link>
            . Résumé :
          </p>
          <p>
            Les informations collectées via les formulaires (inscription, contact, messages) sont
            traitées par {school.legalName} pour la gestion scolaire, la relation avec les familles
            et l’administration de l’établissement (suivi des élèves, facturation, communication).
            Elles ne sont pas vendues à des tiers.
          </p>
          <p>
            Les données sont hébergées sur des serveurs sécurisés (Vercel). Les fichiers
            administratifs persistants sont stockés dans un espace Blob privé lié au projet. Les
            cookies de session permettent l’accès aux espaces parents, enseignants et administration ;
            ils ne servent pas à du ciblage publicitaire.
          </p>
          <p>
            Conformément au droit ivoirien et aux bonnes pratiques RGPD, vous pouvez demander
            l’accès, la rectification ou la suppression de vos données en écrivant à{" "}
            <a href={`mailto:${school.email}`} className="font-semibold text-green hover:underline">
              {school.email}
            </a>
            . Une réponse est visée sous 30 jours.
          </p>
          <p>
            Pour les mineurs, les données sont fournies par les parents ou représentants légaux.
            Les photos d’élèves ne sont publiées sur ce site qu’avec l’accord de la direction.
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
