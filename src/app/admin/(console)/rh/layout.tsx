import { ModuleTabs } from "@/components/school/ModuleTabs";
import { hrAdminNav } from "@/lib/hr";

export default function AdminRhLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <ModuleTabs items={hrAdminNav} />
      {children}
    </div>
  );
}
