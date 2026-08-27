import { Card } from "@/components/school/AdminUi";
import { emailStatus } from "@/lib/email";

export function EmailStatusCard() {
  const status = emailStatus();
  return (
    <Card title="E-mails">
      <p className={`text-2xl font-semibold ${status.configured ? "text-green-deep" : "text-terracotta"}`}>
        {status.configured ? "Configuré" : "Non configuré"}
      </p>
      <p className="mt-1 text-sm text-muted">
        Resend {status.hasApiKey ? "présent" : "absent"}
        {" · "}
        expéditeur {status.hasFrom ? "défini" : "manquant"}
      </p>
      {!status.configured ? (
        <p className="mt-2 text-xs text-muted">
          Sans clé, les demandes sont quand même enregistrées. Posez RESEND_API_KEY et EMAIL_FROM sur Vercel.
        </p>
      ) : null}
    </Card>
  );
}
