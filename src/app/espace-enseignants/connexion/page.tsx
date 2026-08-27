import { DemoHints } from "@/components/layout/DemoHints";
import { Container, PageHero } from "@/components/ui/Page";
import { teacherDemoHint } from "@/lib/demo-accounts";
import { TeacherLoginForm } from "./form";

export const dynamic = "force-dynamic";

export default function TeacherConnexionPage() {
  return (
    <>
      <PageHero
        kicker="Équipe pédagogique"
        title="Connexion enseignants"
        lead="Appel, devoirs, notes et messages aux familles — pour Groupe scolaire Les Étoiles de Bingerville uniquement."
      />
      <Container className="max-w-md py-12">
        <TeacherLoginForm />
        <DemoHints>
          Compte de démonstration : <strong>{teacherDemoHint.email}</strong> · mot de passe{" "}
          <strong>{teacherDemoHint.password}</strong>
        </DemoHints>
      </Container>
    </>
  );
}
