# Vérification du domaine Resend — Les Étoiles de Bingerville

Guide pas à pas pour envoyer des e-mails depuis `letoilesbingerville.ci` (ou un sous-domaine dédié) vers `letoiles67@gmail.com` et les familles.

## Contexte

| État | Détail |
|------|--------|
| **Actuel** | `RESEND_API_KEY` + `EMAIL_FROM=Les Étoiles <onboarding@resend.dev>` sur Vercel |
| **Limite test** | `onboarding@resend.dev` ne livre qu’à l’e-mail du compte Resend |
| **Objectif** | `Les Étoiles <noreply@letoilesbingerville.ci>` → livraison vers toutes les adresses |

## Étape 1 — Choisir le domaine d’envoi

Deux options courantes :

| Option | Domaine Resend | Avantage |
|--------|----------------|----------|
| **A (recommandé)** | `mail.letoilesbingerville.ci` | SPF/DKIM isolés ; le site reste sur la racine |
| **B** | `letoilesbingerville.ci` | Une seule zone DNS ; mêmes enregistrements que Vercel + Resend |

Pour l’option A, ajoutez dans Resend le domaine **`mail.letoilesbingerville.ci`**.  
L’expéditeur sera alors : `Les Étoiles <noreply@mail.letoilesbingerville.ci>`.

## Étape 2 — Ajouter le domaine dans Resend

1. Connexion : [resend.com/domains](https://resend.com/domains)
2. **Add domain** → saisir `mail.letoilesbingerville.ci` (ou `letoilesbingerville.ci`)
3. Resend affiche les enregistrements DNS à créer chez le registrar (où le `.ci` est géré)

### Modèle d’enregistrements (exemple — valeurs exactes dans le dashboard Resend)

| Type | Nom / Host | Valeur (exemple) | Usage |
|------|------------|------------------|-------|
| `TXT` | `@` ou `mail` | `v=spf1 include:amazonses.com ~all` | SPF (Resend fournit la valeur exacte) |
| `CNAME` | `resend._domainkey` ou `resend._domainkey.mail` | `…dkim.amazonses.com` | DKIM 1 |
| `CNAME` | `resend2._domainkey` | `…dkim.amazonses.com` | DKIM 2 |
| `TXT` | `_dmarc` | `v=DMARC1; p=none;` | DMARC (optionnel au début) |

> **Important** : copiez les valeurs **exactes** affichées par Resend. Le tableau ci-dessus est un modèle ; les noms d’hôtes varient selon racine vs sous-domaine.

## Étape 3 — Créer les enregistrements DNS

1. Ouvrir le panneau DNS du registrar (NIC.ci, OVH, Cloudflare, etc.)
2. Créer chaque enregistrement SPF / DKIM / DMARC fourni par Resend
3. Si le site Vercel utilise déjà `letoilesbingerville.ci` sur la même zone :
   - **Ne supprimez pas** les enregistrements Vercel (`A` / `CNAME` pour `@` et `www`)
   - Ajoutez uniquement les enregistrements Resend (souvent sur `mail.` si option A)

## Étape 4 — Vérifier dans Resend

1. Resend → Domains → **Verify**
2. Attendre la propagation (5 min à 48 h)
3. Statut **Verified** = prêt à envoyer

## Étape 5 — Mettre à jour Vercel

Vercel → projet `les-etoiles-bingerville` → **Settings** → **Environment Variables** → **Production** :

```
EMAIL_FROM=Les Étoiles <noreply@mail.letoilesbingerville.ci>
```

(Remplacez par l’adresse exacte sur le domaine vérifié.)

Puis **Deployments** → **Redeploy** la dernière production.

### CLI (optionnel)

```powershell
cd C:\Users\assoh\Projects\les-etoiles-bingerville
$env:NODE_OPTIONS="--use-system-ca"
npx vercel env rm EMAIL_FROM production --yes
npx vercel env add EMAIL_FROM production --value "Les Étoiles <noreply@mail.letoilesbingerville.ci>" --yes
npx vercel --prod
```

## Étape 6 — Tests

1. `/admin` → carte **E-mails** = **Configuré** (expéditeur affiché)
2. Formulaire `/contact` avec une adresse de test
3. Vérifier réception sur `letoiles67@gmail.com` **et** sur une boîte externe (Gmail perso)
4. Resend → **Logs** : statut `delivered` ou erreur explicite

## Format `EMAIL_FROM`

Le code accepte :

- `Les Étoiles <noreply@mail.letoilesbingerville.ci>` (recommandé)
- `noreply@mail.letoilesbingerville.ci` (nom d’affichage « Les Étoiles » ajouté automatiquement)

Voir `src/lib/email.ts` (`parseEmailFrom` / `normalizeEmailFrom`).

## Dépannage

| Symptôme | Piste |
|----------|-------|
| Domaine « Pending » longtemps | Vérifier les CNAME DKIM (pas de typo, pas de proxy Cloudflare orange sur les CNAME Resend) |
| E-mail non reçu sur `letoiles67@gmail.com` | Normal tant que `onboarding@resend.dev` est l’expéditeur — vérifier le domaine |
| Carte admin « Non configuré » | `RESEND_API_KEY` ou `EMAIL_FROM` manquant / invalide |
| `550` / domaine non vérifié | `EMAIL_FROM` doit utiliser le domaine **Verified** dans Resend |

## Voir aussi

- [PRODUCTION.md](./PRODUCTION.md) — variables Vercel complètes
- [PILOT.md](./PILOT.md) — démarrage direction et familles pilotes
