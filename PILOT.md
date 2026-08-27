# Pilote — premières familles réelles (3 à 5)

Guide technique pour activer les premières familles sur https://les-etoiles-bingerville.vercel.app  
Voir aussi [PRODUCTION.md](./PRODUCTION.md) pour les variables Vercel.

## Prérequis

- `SUPERADMIN_PASSWORD` défini sur Vercel (production)
- `BLOB_READ_WRITE_TOKEN` actif (données persistées)
- Comptes **démo** (`ETOILES-DEMO-001` / `002`) : à ne pas confondre avec de vraies familles — voir [README](./README.md)

## 1. Connexion SuperAdmin

1. Ouvrir https://les-etoiles-bingerville.vercel.app/super-admin/connexion
2. E-mail : `assoheddy@gmail.com`
3. Mot de passe : valeur de `SUPERADMIN_PASSWORD` sur Vercel (pas le hash de secours local)

## 2. Activer l’espace parents (famille par famille)

1. Aller sur `/super-admin/parents-modules`
2. Repérer la famille inscrite (après création côté direction)
3. Activer le drapeau **moduleParentsActive** pour cette famille uniquement
4. Tant que le drapeau est off, la famille voit un message « accès non activé » à la connexion

Les démos `ETOILES-DEMO-001` et `ETOILES-DEMO-002` restent actives par défaut — désactivez-les si vous ne voulez plus les exposer.

## 3. Créer les comptes parents (direction)

1. Connexion admin : `/admin/connexion` (`admin` / mot de passe direction)
2. **Inscription** : traiter la demande depuis `/admin/demandes` ou créer une fiche élève
3. **Compte parent** : `/admin/parents` — créer le parent, lier l’élève, noter le **matricule** et le **mot de passe** communiqués à la famille
4. Ne pas réutiliser les matricules `ETOILES-DEMO-*` pour de vrais élèves

## 4. Paiements espèces (sans PSP en ligne)

1. Le secrétariat enregistre un paiement espèces (API secrétariat / console selon procédure interne)
2. SuperAdmin : `/super-admin/parents-finances` — valider le paiement en file d’attente
3. Après validation, les échéances parent peuvent passer à « payé » selon la logique compta

**Aucun** Wave / Orange Money / CinetPay tant que les clés ne sont pas configurées.

## 5. Vérifications

| Élément | Où vérifier |
|---------|-------------|
| E-mails Resend | `/admin` ou `/super-admin` — carte « E-mails » (Configuré / Non configuré) |
| Demande contact/inscription | `/admin/demandes` |
| Module parents | `/super-admin/parents-modules` |
| Paiements espèces | `/super-admin/parents-finances` |

## 6. Checklist avant d’ouvrir à une 4ᵉ / 5ᵉ famille

- [ ] Matricule et mot de passe parent testés en navigation privée
- [ ] `moduleParentsActive` activé pour la bonne famille
- [ ] Pas de confusion avec les comptes démo sur la page `/connexion` (`ETOILES_DEMO_HINTS=false` en prod)
- [ ] Famille informée : paiement en ligne indisponible, secrétariat pour les règlements
