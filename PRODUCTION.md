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
| `RESEND_API_KEY` | Configuré (Production, sensible) |
| `EMAIL_FROM` | `Les Étoiles <onboarding@resend.dev>` (test — voir domaine ci-dessous) |
| `ANTHROPIC_API_KEY` | Optionnel — chat `/api/ai` (sinon HTTP 503) |

Contact et inscriptions sont enregistrés (Blob + inbox admin `/admin/demandes`) **et** les e-mails partent si Resend est configuré. La carte **E-mails** dans `/admin` et `/super-admin` affiche « Configuré » lorsque `RESEND_API_KEY` + `EMAIL_FROM` sont posés.

## Resend (e-mails transactionnels)

### État actuel (27 août 2026)

- **Configuré** : `RESEND_API_KEY` + `EMAIL_FROM` (`onboarding@resend.dev`) sur Vercel Production, redéployé.
- `EMAIL_TO_SCHOOL` = `letoiles67@gmail.com` sur Vercel.
- **Limite test** : avec `onboarding@resend.dev`, Resend ne livre qu’à l’e-mail du compte Resend — pas à `letoiles67@gmail.com` tant qu’un domaine n’est pas vérifié.
- **Prochaine étape prod** : vérifier un domaine (`letoilesbingerville.ci`) et passer `EMAIL_FROM` à `Les Étoiles <noreply@letoilesbingerville.ci>`.

### Étapes exactes

1. Créer un compte sur [resend.com/signup](https://resend.com/signup) (gratuit : 3 000 e-mails/mois, 100/jour, sans CB).
2. **Clé API** : Resend → API Keys → Create → permission **Sending access** → copier `re_…`.
3. **Domaine d’envoi** (recommandé prod) :
   - Resend → Domains → Add domain (ex. `letoilesbingerville.ci` ou sous-domaine `mail.letoilesbingerville.ci`)
   - Ajouter les enregistrements DNS (SPF, DKIM) fournis par Resend
   - Attendre la vérification
4. **Vercel** → projet `les-etoiles-bingerville` → Settings → Environment Variables → **Production** :
   - `RESEND_API_KEY` = `re_…` (sensible)
   - `EMAIL_FROM` = `Les Étoiles <noreply@letoilesbingerville.ci>` (domaine vérifié) **ou** pour test immédiat : `Les Étoiles <onboarding@resend.dev>`
5. **Test sans domaine** : avec `onboarding@resend.dev`, Resend ne livre qu’à l’e-mail du compte Resend — **pas** à `letoiles67@gmail.com` tant que le domaine n’est pas vérifié. Pour tester vers le secrétariat, vérifier un domaine ou créer le compte Resend avec `letoiles67@gmail.com`.
6. Redéployer production (Deployments → Redeploy).
7. Vérifier : `/admin` → carte « E-mails » = **Configuré** ; formulaire test sur `/contact`.

**CLI** (après `vercel login`) :

```powershell
cd C:\Users\assoh\Projects\les-etoiles-bingerville
$env:NODE_OPTIONS="--use-system-ca"
npx vercel env add RESEND_API_KEY production --sensitive --value "re_..." --yes
npx vercel env add EMAIL_FROM production --value "Les Étoiles <onboarding@resend.dev>" --yes
npx vercel --prod
```

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
