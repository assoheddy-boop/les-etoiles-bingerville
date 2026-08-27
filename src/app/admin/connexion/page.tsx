import { DemoHints } from "@/components/layout/DemoHints";
import { adminDemo, staffDemoAccounts } from "@/lib/demo-accounts";
import { demoHintsEnabled } from "@/lib/runtime";
import { AdminLoginForm } from "./form";

export const dynamic = "force-dynamic";

export default function AdminConnexionPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl text-green-deep">Administration</h1>
      <p className="mt-2 text-muted">Espace interne pour publier l’histoire, le mot de la direction et les actualités.</p>
      <AdminLoginForm usernamePlaceholder={demoHintsEnabled() ? adminDemo.username : "Identifiant"} />
      <DemoHints>
        Compte fondateur : identifiant <strong>{adminDemo.username}</strong> · mot de passe{" "}
        <strong>{adminDemo.password}</strong>
        <span className="mt-2 block">
          Comptes extra (démo locale) :{" "}
          {staffDemoAccounts.map((row) => (
            <span key={row.username}>
              <strong>{row.username}</strong> / {row.password} ({row.staffRole})
              {row !== staffDemoAccounts[staffDemoAccounts.length - 1] ? " · " : ""}
            </span>
          ))}
        </span>
      </DemoHints>
    </div>
  );
}
