# ⚠️ ALERTE SÉCURITÉ - ACTION REQUISE

## Problème détecté

Des identifiants de base de données **étaient stockés dans le fichier `.gitignore`**, ce qui est une grave faille de sécurité. Ces identifiants ont été exposés publiquement dans le repository GitHub.

### Identifiants compromis
- Base de données: `emargement_g5s9`
- Utilisateur: `user1`
- Mot de passe: `vIpFW5nOBaPGl3ej4rRDurnPxkI634CE`
- Serveur: `dpg-d1fafgqli9vc739qloqg-a.frankfurt-postgres.render.com`

## ⚡ Actions immédiates requises

### 1. Révoquer les identifiants compromis
Vous **devez immédiatement** :
1. Vous connecter à votre compte Render
2. Régénérer le mot de passe de la base de données
3. Créer un nouvel utilisateur si possible
4. Mettre à jour vos variables d'environnement

### 2. Nettoyer l'historique Git
Les identifiants sont présents dans l'historique Git. Vous devez :
```bash
# Option 1 : Utiliser BFG Repo-Cleaner
git clone --mirror https://github.com/aurelie17112005/EDT_alt_projet.git
java -jar bfg.jar --delete-files .gitignore EDT_alt_projet.git
cd EDT_alt_projet.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force

# Option 2 : Utiliser git filter-branch (plus lent)
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .gitignore' \
  --prune-empty --tag-name-filter cat -- --all
git push --force --all
```

### 3. Corriger le fichier .gitignore
✅ **FAIT** : Le fichier `.gitignore` a été corrigé et ne contient plus les identifiants.

### 4. Utiliser les variables d'environnement
Les identifiants doivent **TOUJOURS** être stockés dans :
- Le fichier `.env` (qui doit être listé dans `.gitignore`)
- Les variables d'environnement de votre serveur de production
- Un gestionnaire de secrets (comme Render Secrets, AWS Secrets Manager, etc.)

**JAMAIS** dans :
- Le code source
- Les fichiers de configuration versionnés
- Les commentaires
- Le fichier `.gitignore`

## 📋 Checklist de sécurité

- [ ] Révoquer les identifiants compromis
- [ ] Créer de nouveaux identifiants
- [ ] Mettre à jour les variables d'environnement en production
- [ ] Vérifier que `.env` est dans `.gitignore`
- [ ] Nettoyer l'historique Git
- [ ] Scanner le repository avec `git-secrets` ou `truffleHog`
- [ ] Activer les alertes de sécurité GitHub
- [ ] Configurer Dependabot

## 🛡️ Bonnes pratiques de sécurité

### Fichier .env
```bash
# backend/.env
DB_HOST=votre_host
DB_PORT=5432
DB_NAME=votre_base
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe_securise
JWT_SECRET=votre_secret_jwt
SECRET_KEY=votre_secret_key
```

### Configuration en production (Render)
1. Aller dans Dashboard → Service → Environment
2. Ajouter les variables d'environnement
3. Ne jamais les commiter dans le code

### Scanner les secrets avant commit
```bash
# Installer git-secrets
git secrets --install
git secrets --register-aws

# Scanner tout le repository
git secrets --scan
```

## 📚 Resources

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [OWASP Secrets Management](https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_password)
- [Git Secrets Tool](https://github.com/awslabs/git-secrets)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)

---

**Note**: Ce document a été généré automatiquement suite à la détection d'identifiants dans le fichier `.gitignore`. Suivez impérativement les actions ci-dessus pour sécuriser votre application.
