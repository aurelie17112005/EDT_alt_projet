# ✅ Checklist de Déploiement

Utilisez cette checklist pour déployer votre projet EDT Alt en ligne.

## 🎯 Avant de Commencer

- [ ] J'ai un compte GitHub
- [ ] J'ai accès au repository `aurelie17112005/EDT_alt_projet`
- [ ] J'ai lu le fichier `DEPLOYMENT.md`

## 📦 Étape 1: Backend sur Render

### Configuration initiale
- [ ] Créer un compte sur [render.com](https://render.com)
- [ ] Connecter le compte GitHub à Render

### Base de données PostgreSQL
- [ ] Créer une nouvelle base PostgreSQL sur Render
- [ ] Choisir le plan Free
- [ ] Choisir la région Frankfurt (ou plus proche)
- [ ] Nommer la base: `edt-db`
- [ ] Copier l'URL de connexion (Internal Database URL)

### Service Backend
- [ ] Créer un nouveau Web Service sur Render
- [ ] Connecter au repository GitHub
- [ ] Configuration:
  - [ ] Name: `edt-backend`
  - [ ] Region: Frankfurt
  - [ ] Branch: `main`
  - [ ] Root Directory: `backend`
  - [ ] Runtime: Node
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
  - [ ] Plan: Free

### Variables d'environnement Backend
- [ ] `NODE_ENV` = `production`
- [ ] `DATABASE_URL` = (lier à la base de données créée)
- [ ] `JWT_SECRET` = (générer un secret aléatoire)
- [ ] `SESSION_SECRET` = (générer un secret aléatoire)
- [ ] `CAS_SERVICE_URL` = `https://[votre-backend].onrender.com/api/auth/login-cas`
- [ ] `CAS_URL` = `https://auth.univ-fcomte.fr/`
- [ ] `FRONTEND_URL` = (à remplir après avoir déployé le frontend)

### Vérification Backend
- [ ] Le déploiement est terminé avec succès
- [ ] Tester l'URL: `https://[votre-backend].onrender.com/`
- [ ] Devrait afficher: "Backend opérationnel ✔️"
- [ ] Noter l'URL complète du backend pour l'étape suivante

## 🎨 Étape 2: Frontend sur Vercel

### Configuration initiale
- [ ] Créer un compte sur [vercel.com](https://vercel.com)
- [ ] Connecter le compte GitHub à Vercel

### Déploiement Frontend
- [ ] Cliquer sur "New Project"
- [ ] Importer le repository `aurelie17112005/EDT_alt_projet`
- [ ] Configuration:
  - [ ] Framework Preset: Vue.js
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
  - [ ] Install Command: `npm install`

### Variables d'environnement Frontend
- [ ] `VUE_APP_API_URL` = `https://[votre-backend].onrender.com`

### Vérification Frontend
- [ ] Le déploiement est terminé avec succès
- [ ] L'application s'ouvre sans erreur
- [ ] Noter l'URL complète du frontend

## 🔄 Étape 3: Finalisation

### Mise à jour Backend CORS
- [ ] Retourner sur Render dashboard
- [ ] Ajouter/Mettre à jour la variable d'environnement:
  - `FRONTEND_URL` = `https://[votre-frontend].vercel.app`
- [ ] Redéployer le backend (bouton "Manual Deploy")

### Tests Finaux
- [ ] Ouvrir le frontend dans un navigateur
- [ ] Tester la connexion utilisateur
- [ ] Vérifier que les requêtes API fonctionnent
- [ ] Tester la génération de QR codes
- [ ] Tester l'émargement

### Documentation
- [ ] Noter les URLs dans un endroit sûr:
  - Backend: `https://[votre-backend].onrender.com`
  - Frontend: `https://[votre-frontend].vercel.app`
  - Database: (credentials Render)

## 🚨 Dépannage

Si quelque chose ne fonctionne pas:

1. **Backend ne démarre pas**
   - [ ] Vérifier les logs dans Render dashboard
   - [ ] Vérifier que toutes les variables d'environnement sont définies
   - [ ] Vérifier que DATABASE_URL est correct

2. **Frontend ne se connecte pas au backend**
   - [ ] Vérifier VUE_APP_API_URL dans Vercel
   - [ ] Vérifier CORS dans le backend (voir logs Render)
   - [ ] Ouvrir la console du navigateur pour voir les erreurs

3. **Erreurs de base de données**
   - [ ] Vérifier que la base PostgreSQL est active sur Render
   - [ ] Vérifier la connexion DATABASE_URL

4. **Le site est lent / ne répond pas**
   - [ ] Normal pour le plan Free de Render (réveil après 15 min d'inactivité)
   - [ ] Le premier chargement peut prendre 30-60 secondes

## 📝 Notes Importantes

⚠️ **Plan Gratuit Render**: Le backend s'endort après 15 minutes d'inactivité. Le premier accès après inactivité prendra 30-60 secondes.

⚠️ **Sécurité**: N'oubliez pas de changer TOUS les secrets (JWT_SECRET, SESSION_SECRET, etc.)

⚠️ **Mises à jour**: Chaque push sur la branche `main` redéploiera automatiquement le backend sur Render et le frontend sur Vercel.

## ✅ Projet Déployé!

Félicitations! Votre projet est maintenant en ligne! 🎉

- Frontend: ________________
- Backend: ________________

Pour des détails supplémentaires, consultez `DEPLOYMENT.md`.
