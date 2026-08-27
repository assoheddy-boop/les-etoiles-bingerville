import { SubNav } from "@/components/layout/SubNav";

const items = [
  { href: "/ecole", label: "Qui sommes-nous ?" },
  { href: "/ecole/histoire", label: "Notre histoire" },
  { href: "/ecole/mot-du-proviseur", label: "Mot de la direction" },
  { href: "/ecole/agrements", label: "Agréments MEN" },
];

export default function EcoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SubNav items={items} />
      {children}
    </>
  );
}
