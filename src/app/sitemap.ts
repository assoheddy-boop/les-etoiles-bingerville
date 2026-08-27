import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const paths = [
  "/",
  "/ecole",
  "/ecole/histoire",
  "/ecole/mot-du-proviseur",
  "/ecole/agrements",
  "/cycles",
  "/cycles/maternelle",
  "/cycles/primaire",
  "/cycles/secondaire",
  "/activites",
  "/informations",
  "/informations/objets-perdus",
  "/inscriptions",
  "/actualites",
  "/contact",
  "/mentions-legales",
  "/connexion",
  "/espace-enseignants/connexion",
  "/espace-vigile/connexion",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
