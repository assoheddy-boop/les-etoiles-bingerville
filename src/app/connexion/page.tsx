import Link from "next/link";
import { DemoHints } from "@/components/layout/DemoHints";
import { Container, PageHero } from "@/components/ui/Page";
import { ParentLoginForm } from "./form";

export const dynamic = "force-dynamic";

export default function ConnexionPage() {
  return (
    <>
      <PageHero
        kicker="Familles déjà inscrites"
        title="Connexion à l’espace parents"
        lead="Saisissez le matricule de l’élève et le mot de passe communiqués par l’école. Aucune recherche publique d’élève."
      />
      <Container className="max-w-md py-12">
        <ParentLoginForm />
        <DemoHints>
          Comptes de démonstration : matricule <strong>ETOILES-DEMO-001</strong> (Ama, maternelle) ou{" "}
          <strong>ETOILES-DEMO-002</strong> (Marc, primaire), mot de passe <strong>Parent2026!</strong>
        </DemoHints>
        <p className="mt-3 text-center text-sm text-muted">
          Vous enseignez à Les Étoiles ?{" "}
          <Link href="/espace-enseignants/connexion" className="font-semibold text-green hover:underline">
            Espace enseignants
          </Link>
        </p>
      </Container>
    </>
  );
}
