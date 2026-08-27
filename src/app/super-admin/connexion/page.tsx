import { DemoHints } from "@/components/layout/DemoHints";
import { superAdminDemo } from "@/lib/demo-accounts";
import { demoHintsEnabled } from "@/lib/runtime";
import { AdminLoginForm } from "@/app/admin/connexion/form";

export const dynamic = "force-dynamic";

export default function SuperAdminConnexionPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl text-green-deep">SuperAdmin Les Étoiles</h1>
      <p className="mt-2 text-muted">Pilotage des modules, finances espèces et espaces. Accès nominatif.</p>
      <AdminLoginForm
        usernamePlaceholder={demoHintsEnabled() ? superAdminDemo.email : "E-mail"}
        action="/api/auth/superadmin"
        defaultNext="/super-admin"
      />
      <DemoHints>
        Compte SuperAdmin local : e-mail <strong>{superAdminDemo.email}</strong> · mot de passe{" "}
        <strong>{superAdminDemo.password}</strong>
        <span className="mt-2 block">Non affiché en production (ETOILES_DEMO_HINTS).</span>
      </DemoHints>
    </div>
  );
}
