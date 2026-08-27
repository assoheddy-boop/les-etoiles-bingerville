# Mise en production — Les Étoiles de Bingerville

> **Configuration Vercel / Resend / DNS / clés API** — à faire en dernier moment par le client (voir sections ci-dessous). Le code et le contenu du site peuvent être déployés sans ces éléments.

Site : https://les-etoiles-bingerville.vercel.app  
Projet Vercel : `assoheddy-boops-projects/les-etoiles-bingerville`

## Variables d’environnement (Vercel → Production)

| Variable | Statut |
|----------|--------|
| `SESSION_SECRET` | Défini (32+ caractères) |
| `BLOB_READ_WRITE_TOKEN` | Défini (store `les-etoiles-bingerville-production`) |
| `SUPERADMIN_PASSWORD` | Défini sur Vercel |
| `PAYMENTS_DEMO_MODE` | `false` |
| `ETOILES_DEMO_HINTS` | `false` |
| `EMAIL_TO_SCHOOL` | `letoiles67@gmail.com` |
| `RESEND_API_KEY` | **Non configuré** — voir section Resend |
| `EMAIL_FROM` | **Non configuré** — requis avec Resend |
| `ANTHROPIC_API_KEY` | Optionnel — chat `/api/ai` (sinon HTTP 503) |

Sans `RESEND_API_KEY` : contact et inscriptions sont **quand même enregistrés** (Blob + inbox admin `/admin/demandes`). L’UI indique que l’e-mail peut être retardé. La carte **E-mails** dans `/admin` et `/super-admin` affiche « Non configuré ».

## Resend (e-mails transactionnels)

### État actuel

- Aucune clé réutilisable trouvée sur le projet ECEME (`.env.local` sans `RESEND_*`, pas de `.env` commité).
- Configuration Vercel à faire manuellement (dashboard ou `vercel env add` après `vercel login`).

### Étapes exactes

1. Créer un compte sur [resend.com](https://resend.com) (ou réutiliser un compte école).
2. **Domaine d’envoi** (recommandé prod) :
   - Resend → Domains → Add domain (ex. `letoilesbingerville.ci` ou sous-domaine `mail.letoilesbingerville.ci`)
   - Ajouter les enregistrements DNS (SPF, DKIM) fournis par Resend
   - Attendre la vérification
3. **Clé API** : Resend → API Keys → Create → copier la clé `re_…`
4. **Vercel** → projet `les-etoiles-bingerville` → Settings → Environment Variables → Production :
   - `RESEND_API_KEY` = `re_…`
   - `EMAIL_FROM` = `Les Étoiles <noreply@votredomaine.ci>` (domaine vérifié)
5. **Test seulement** (sans domaine) : `EMAIL_FROM=onboarding@resend.dev` — les e-mails partent **uniquement** vers l’adresse du compte Resend, pas vers les familles.
6. Redéployer (ou attendre le redeploy auto).
7. Vérifier : `/admin` → carte « E-mails » = **Configuré** ; envoyer un message test via `/contact`.

### Routes qui envoient si Resend est configuré

- `POST /api/contact` et `POST /api/inscriptions` → secrétariat + accusé famille
- Notifications internes : messages, devoirs, module parents, paiements espèces validés, codes sortie (`src/lib/email-notify.ts`)

## Démarrage direction (SuperAdmin)

Résumé — détail pilote : **[PILOT.md](./PILOT.md)**

1. **Connexion SuperAdmin** — https://les-etoiles-bingerville.vercel.app/super-admin/connexion  
   E-mail : `assoheddy@gmail.com` · mot de passe : `SUPERADMIN_PASSWORD` sur Vercel.

2. **Activer l’espace parents** — `/super-admin/parents-modules` (`moduleParentsActive` par famille).

3. **Comptes parents** — `/admin` → élèves / parents / demandes. Comptes démo `ETOILES-DEMO-001` / `002` : **démo uniquement**.

4. **Paiements espèces** — `/super-admin/parents-finances` (validation SuperAdmin après saisie secrétariat).

5. **E-mails** — carte « E-mails » sur `/admin` ou `/super-admin`.

## Domaine personnalisé `letoilesbingerville.ci`

Documentation DNS uniquement — le domaine n’est pas encore branché sur Vercel au moment de cette note.

1. Vercel → projet `les-etoiles-bingerville` → **Settings** → **Domains** → Add `letoilesbingerville.ci` et `www.letoilesbingerville.ci`.
2. Chez le registrar (où le `.ci` est enregistré), créer les enregistrements indiqués par Vercel :

| Type | Nom | Valeur (exemple Vercel) |
|------|-----|-------------------------|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

3. Si Resend utilise le même domaine, ajouter aussi les enregistrements SPF/DKIM Resend (section Domains Resend) — pas de conflit si sous-domaine dédié (`mail.`).
4. Attendre propagation DNS (quelques minutes à 48 h), puis **Refresh** dans Vercel jusqu’à certificat SSL actif.
5. Mettre à jour `NEXT_PUBLIC_SITE_URL` sur Vercel vers `https://letoilesbingerville.ci` et redéployer.

## Assistant IA (optionnel)

- Variable : `ANTHROPIC_API_KEY` (serveur uniquement, voir `.env.example`).
- Sans clé : le chat affiche « Assistant non configuré » (`/api/ai` → 503).
- Ne jamais exposer en `NEXT_PUBLIC_*`.

## Paiements en ligne

Non disponibles. Les pages `/espace-parents/paiements` orientent vers le secrétariat. Ne pas activer `PAYMENTS_DEMO_MODE` en production.

## Actions restantes côté école

- Confirmer le numéro fixe (actuellement « À confirmer » dans `school.ts`)
- Fournir les agréments MENA / DEEP (placeholders sur `/ecole/agrements`)
- Configurer Resend + domaine d’envoi (voir ci-dessus)
- Brancher `letoilesbingerville.ci` sur Vercel (DNS)
- Valider photos, tarifs et contenus CMS avec la direction
