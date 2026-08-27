import { ModuleTabs } from "@/components/school/ModuleTabs";
import { comptaAdminNav } from "@/lib/accounting";

export default function AdminComptaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <ModuleTabs items={comptaAdminNav} />
      {children}
    </div>
  );
}
