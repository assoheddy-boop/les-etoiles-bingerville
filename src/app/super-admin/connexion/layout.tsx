import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSuperAdminSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Connexion SuperAdmin",
  description: "Accès SuperAdmin Les Étoiles.",
};

export default async function SuperAdminConnexionLayout({ children }: { children: React.ReactNode }) {
  const session = await getSuperAdminSession();
  if (session) redirect("/super-admin");
  return children;
}
