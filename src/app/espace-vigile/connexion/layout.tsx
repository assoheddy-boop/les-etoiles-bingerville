import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getVigileSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Connexion vigile",
  description: "Espace vigile des Les Étoiles — validation des sorties à la grille.",
};

export default async function VigileConnexionLayout({ children }: { children: React.ReactNode }) {
  const session = await getVigileSession();
  if (session) redirect("/espace-vigile");
  return children;
}
