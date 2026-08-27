import { DemoHints } from "@/components/layout/DemoHints";
import { Container, PageHero } from "@/components/ui/Page";
import { vigileDemo } from "@/lib/demo-accounts";
import { demoHintsEnabled } from "@/lib/runtime";
import { VigileLoginForm } from "./form";

export const dynamic = "force-dynamic";

export default function VigileConnexionPage() {
  return (
    <>
      <PageHero
        kicker="Poste grille"
        title="Connexion vigile"
        lead="Espace réservé au personnel de la grille. Saisie ou scan du code de sortie — sans accès à la direction."
      />
      <Container className="max-w-md py-12">
        <VigileLoginForm usernamePlaceholder={demoHintsEnabled() ? vigileDemo.username : "Identifiant"} />
        <DemoHints>
          Compte de démonstration : <strong>{vigileDemo.username}</strong> ou{" "}
          <strong>{vigileDemo.aliases[1]}</strong> · mot de passe <strong>{vigileDemo.password}</strong>
        </DemoHints>
      </Container>
    </>
  );
}
