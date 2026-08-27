import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getVigileSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Connexion direction",
  description: "Espace direction des Les Étoiles.",
};

export default async function AdminConnexionLayout({ children }: { children: React.ReactNode }) {
  const vigile = await getVigileSession();
  if (vigile) redirect("/espace-vigile");
  return children;
}
