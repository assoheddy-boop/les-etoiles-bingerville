# Mise en production — Les Étoiles de Bingerville

Site : https://les-etoiles-bingerville.vercel.app  
Projet Vercel : `assoheddy-boops-projects/les-etoiles-bingerville`

## Variables d’environnement (Vercel → Production)

| Variable | Statut attendu |
|----------|----------------|
| `SESSION_SECRET` | Défini (32+ caractères) |
| `BLOB_READ_WRITE_TOKEN` | Défini (store `les-etoiles-bingerville-production`) |
| `SUPERADMIN_PASSWORD` | **À définir** — mot de passe fort, voir `SUPERADMIN_PASSWORD.local.txt` (local, ne pas committer) |
| `PAYMENTS_DEMO_MODE` | `false` |
| `ETOILES_DEMO_HINTS` | `false` |
| `EMAIL_TO_SCHOOL` | `letoiles67@gmail.com` |
| `RESEND_API_KEY` | **À créer** (aucune clé réutilisable trouvée sur ECEME) |
| `EMAIL_FROM` | Obligatoire avec Resend — domaine vérifié ou `onboarding@resend.dev` (test, livré au compte Resend uniquement) |

Sans `RESEND_API_KEY` : contact et inscriptions sont **quand même enregistrés** (Blob + inbox admin). L’UI indique que l’e-mail peut être retardé.

Sans `SUPERADMIN_PASSWORD` : repli sur le hash `SuperAdmin2026!` — **insécurisé en production**.

## Démarrage direction (SuperAdmin)

1. **Connexion SuperAdmin** — https://les-etoiles-bingerville.vercel.app/super-admin/connexion  
   E-mail : `assoheddy@gmail.com`  
   Mot de passe : celui défini dans `SUPERADMIN_PASSWORD` sur Vercel (voir fichier local généré).

2. **Activer l’espace parents par famille** — `/super-admin/parents-modules`  
   Chaque parent a un drapeau `moduleParentsActive` (désactivé par défaut pour les nouveaux). Activer famille par famille après inscription réelle.

3. **Créer les comptes parents** — console direction `/admin` → élèves / inscriptions, ou import selon procédure établie. Les comptes démo `ETOILES-DEMO-001` / `002` restent actifs tant qu’on ne les désactive pas.

4. **File d’attente paiements espèces** — `/super-admin/parents-finances`  
   Le secrétariat enregistre un paiement espèces ; le SuperAdmin valide. **Aucun PSP en ligne** (Wave / Orange Money / CinetPay non branchés).

5. **Vérifier les e-mails** — `/admin` (carte « E-mails ») : Resend doit afficher « Configuré » une fois les clés posées.

## Paiements en ligne

Non disponibles. Les pages `/espace-parents/paiements` et le site public indiquent « bientôt disponible » ou orientent vers le secrétariat. Ne pas activer `PAYMENTS_DEMO_MODE` en production.

## Actions restantes côté école

- Confirmer le numéro fixe (actuellement « À confirmer » dans `school.ts`)
- Fournir les agréments MENA / DEEP (placeholders dans le site)
- Créer un compte [Resend](https://resend.com), vérifier un domaine d’envoi, ajouter `RESEND_API_KEY` + `EMAIL_FROM` sur Vercel
- Enregistrer `SUPERADMIN_PASSWORD` sur Vercel et supprimer `SUPERADMIN_PASSWORD.local.txt`
- Valider photos, tarifs et contenus CMS avec la direction
