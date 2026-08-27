import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion enseignants",
  description: "Espace enseignants des Les Étoiles — appel, devoirs, notes et messages aux familles.",
};

export default function TeacherConnexionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
