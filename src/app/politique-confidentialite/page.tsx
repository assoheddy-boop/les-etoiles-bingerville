import Link from "next/link";
import { Container, PageHero, Prose } from "@/components/ui/Page";
import { school } from "@/lib/school";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Comment ${school.shortName} traite les données personnelles des familles et visiteurs du site.`,
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <PageHero
        kicker="Données personnelles"
        title="Politique de confidentialité"
        lead={`${school.legalName} — informations sur la collecte et l’usage des données sur ce site.`}
      />
      <Container className="max-w-3xl py-12">
        <Prose>
          <p className="text-muted">
            Cette page décrit de manière simple comment nous traitons les informations que vous nous
            communiquez. Elle complète les{" "}
            <Link href="/mentions-legales" className="font-semibold text-green hover:underline">
              mentions légales
            </Link>
            .
          </p>

          <h2 className="font-display text-2xl text-green-deep">Responsable du traitement</h2>
          <p>
            {school.legalName}
            <br />
            {school.address}
            <br />
            Contact :{" "}
            <a href={`mailto:${school.email}`} className="font-semibold text-green hover:underline">
              {school.email}
            </a>{" "}
            ·{" "}
            <a href={school.phones[0].href} className="font-semibold text-green hover:underline">
              {school.phones[0].display}
            </a>
          </p>

          <h2 className="font-display text-2xl text-green-deep">Données collectées</h2>
          <p>Nous pouvons traiter notamment :</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Identité et coordonnées (nom, téléphone, e-mail) via les formulaires contact et inscription</li>
            <li>Informations relatives à l’élève (cycle, classe, messages à l’école)</li>
            <li>Données de connexion aux espaces parents, enseignants ou administration (cookies de session)</li>
            <li>Échanges via la messagerie interne de l’espace parents</li>
          </ul>
          <p>
            Nous ne vendons pas vos données à des tiers. Aucune publicité ciblée n’est diffusée via ce site.
          </p>

          <h2 className="font-display text-2xl text-green-deep">Finalités</h2>
          <p>Les données servent à :</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Répondre aux demandes de renseignements et d’inscription</li>
            <li>Gérer la scolarité, la facturation et la communication école–familles</li>
            <li>Permettre l’accès sécurisé aux espaces en ligne (parents, enseignants, direction)</li>
            <li>Assurer la sécurité des sorties d’élèves (codes / QR du jour)</li>
          </ul>

          <h2 className="font-display text-2xl text-green-deep">Hébergement et sécurité</h2>
          <p>
            Le site est hébergé par Vercel. Les fichiers administratifs persistants sont stockés dans un
            espace Blob privé lié au projet. Les e-mails transactionnels (accusés, notifications) passent par
            Resend lorsque le service est configuré.
          </p>
          <p>
            Les cookies de session sont nécessaires pour maintenir votre connexion ; ils ne sont pas utilisés
            pour du suivi publicitaire.
          </p>

          <h2 className="font-display text-2xl text-green-deep">Durée de conservation</h2>
          <p>
            Les données sont conservées pendant la durée nécessaire à la relation scolaire et aux obligations
            légales applicables en Côte d’Ivoire. Les demandes non abouties (contact, pré-inscription) peuvent
            être archivées ou supprimées sur demande après traitement par le secrétariat.
          </p>

          <h2 className="font-display text-2xl text-green-deep">Vos droits</h2>
          <p>
            Conformément au droit ivoirien et aux bonnes pratiques en matière de protection des données, vous
            pouvez demander l’accès, la rectification ou la suppression de vos informations en écrivant à{" "}
            <a href={`mailto:${school.email}`} className="font-semibold text-green hover:underline">
              {school.email}
            </a>
            . Nous visons une réponse sous 30 jours.
          </p>
          <p>
            Pour les mineurs, les données sont fournies par les parents ou représentants légaux. Les photos
            d’élèves ne sont publiées sur ce site qu’avec l’accord de la direction.
          </p>

          <h2 className="font-display text-2xl text-green-deep">Modifications</h2>
          <p>
            Cette politique peut être mise à jour pour refléter l’évolution du site ou de la réglementation.
            La date de dernière mise à jour est indiquée ci-dessous.
          </p>
          <p className="text-sm text-muted">Dernière mise à jour : août 2026.</p>
        </Prose>
      </Container>
    </>
  );
}
