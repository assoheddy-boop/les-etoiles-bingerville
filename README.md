# Groupe scolaire Les Étoiles de Bingerville

Site public et espaces (parents, enseignants, vigile, direction, SuperAdmin) pour le **Groupe scolaire Les Étoiles de Bingerville** — Adjamé-Bingerville, Côte d’Ivoire.

Slogan (inventé, aucun slogan officiel trouvé) : **Grandir, briller, exceller.**

Couleurs alignées sur l’enseigne photographiée en 2023 : bleu marine, rouge « Les Étoiles », vert de bordure, fond beige.

## Lancer en local

```bash
cd C:\Users\assoh\Projects\les-etoiles-bingerville
copy .env.example .env.local
npm install
npm run dev
```

Ouvrir [http://localhost:3001](http://localhost:3001) (port 3001 pour ne pas croiser ECEME sur 3000).

`NEXT_PUBLIC_SITE_URL` (prod) : `https://les-etoiles-bingerville.vercel.app`

## Production

Voir **[PRODUCTION.md](./PRODUCTION.md)** : variables Vercel, Resend, domaine DNS, paiements espèces.  
Pilote premières familles : **[PILOT.md](./PILOT.md)**.

## Comptes de démonstration (ne pas utiliser en production)

> **Démo uniquement** — ces matricules servent aux tests et démos. Ne les attribuez pas à de vraies familles. En production, `ETOILES_DEMO_HINTS=false` masque les identifiants sur `/connexion`.

**Parent (démo)**
- Matricule `ETOILES-DEMO-001` (Aïcha Coulibaly) ou `ETOILES-DEMO-002` (Koffi N’Guessan)
- Mot de passe `Parent2026!`

**Admin** — `admin` / `Direction2026!`  
**Enseignant** — `enseignant@lesetoiles.ci` / `Enseignant2026!`  
**SuperAdmin** — `assoheddy@gmail.com` / `SuperAdmin2026!`

## À valider avec l’école

- Téléphone / WhatsApp (placeholder)
- E-mail secrétariat réel
- Numéros d’agrément MENA / DEEP
- Page Facebook / site officiel (aucun trouvé publiquement)
- Photos de façade et de cour plus récentes, avec autorisation

## Coordonnées (sources publiques)

- Adresse : Bingerville, quartier Adjamé-Bingerville, lots 1359-1362, ilot 32
- BP : 01 BP 4772 Abidjan 01
- RCCM : CI-ABJ-03-2021-B12-05532
- Directrice : Mme Koné — Gérant : Lacina Koné
