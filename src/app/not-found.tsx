import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-sm uppercase tracking-widest text-terracotta">Erreur 404</p>
      <h1 className="mt-2 font-display text-4xl text-green-deep">Page introuvable</h1>
      <p className="mt-4 text-muted">Cette adresse n’existe pas sur le nouveau site des Les Étoiles.</p>
      <Link href="/" className="mt-6 inline-flex rounded-full bg-green px-5 py-3 font-semibold text-white">
        Retour à l’accueil
      </Link>
    </div>
  );
}
