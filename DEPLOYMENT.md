# Guide de Déploiement - EDT Alt Projet

Ce guide vous explique comment déployer votre application fullstack (Vue.js + Node.js/Express + PostgreSQL) en ligne.

## 📋 Architecture de Déploiement

- **Backend**: Render.com (avec base de données PostgreSQL)
- **Frontend**: Vercel ou GitHub Pages
- **Base de données**: PostgreSQL sur Render

## 🚀 Déploiement du Backend sur Render

### Étape 1: Créer un compte Render
1. Allez sur [render.com](https://render.com)
2. Créez un compte gratuit avec votre compte GitHub

### Étape 2: Déployer la base de données PostgreSQL
1. Dans le dashboard Render, cliquez sur "New +"
2. Sélectionnez "PostgreSQL"
3. Configurez:
   - **Name**: `edt-db` (ou autre nom)
   - **Database**: `emargement`
   - **User**: `postgres`
   - **Region**: Frankfurt (ou plus proche de vous)
   - **Plan**: Free
4. Cliquez sur "Create Database"
5. **IMPORTANT**: Notez les informations de connexion (Internal/External Database URL)

### Étape 3: Déployer le backend
1. Dans le dashboard Render, cliquez sur "New +"
2. Sélectionnez "Web Service"
3. Connectez votre repository GitHub `aurelie17112005/EDT_alt_projet`
4. Configurez:
   - **Name**: `edt-backend` (ou autre nom)
   - **Region**: Frankfurt
   - **Branch**: `main` (ou votre branche principale)
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Variables d'environnement** (Section "Environment"):
   ```
   DATABASE_URL = [URL de votre base de données Render]
   JWT_SECRET = votre_secret_jwt_tres_securise_changez_moi
   SESSION_SECRET = votre_secret_session_changez_moi
   CAS_SERVICE_URL = https://votre-backend.onrender.com/api/auth/login-cas
   CAS_URL = https://auth.univ-fcomte.fr/
   DB_HOST = [host de votre DB depuis Render]
   DB_PORT = 5432
   DB_NAME = emargement
   DB_USER = [user de votre DB depuis Render]
   DB_PASSWORD = [password de votre DB depuis Render]
   PORT = 3000
   ```

6. Cliquez sur "Create Web Service"
7. Attendez que le déploiement se termine (5-10 minutes)
8. **Notez l'URL de votre backend**: `https://votre-backend.onrender.com`

### Étape 4: Configuration CORS
Une fois déployé, assurez-vous que le CORS dans `backend/app.js` inclut votre URL frontend:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:8081',
    'https://votre-frontend.vercel.app', // Ajoutez votre URL Vercel
    'https://aurelie17112005.github.io'  // Ou GitHub Pages
  ],
  credentials: true
};
```

## 🎨 Déploiement du Frontend sur Vercel

### Option A: Déploiement via Vercel CLI

1. Installez Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Dans le dossier frontend, créez/modifiez `.env.production`:
   ```
   VUE_APP_API_URL=https://votre-backend.onrender.com
   ```

3. Construisez le frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

4. Déployez sur Vercel:
   ```bash
   vercel --prod
   ```

### Option B: Déploiement via le site Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Créez un compte avec GitHub
3. Cliquez sur "New Project"
4. Importez le repository `aurelie17112005/EDT_alt_projet`
5. Configurez:
   - **Framework Preset**: Vue.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. **Variables d'environnement**:
   ```
   VUE_APP_API_URL = https://votre-backend.onrender.com
   ```

7. Cliquez sur "Deploy"
8. Attendez la fin du déploiement
9. **Notez l'URL de votre frontend**: `https://votre-projet.vercel.app`

## 📦 Option Alternative: GitHub Pages (Frontend uniquement)

Si vous préférez GitHub Pages pour le frontend:

1. Mettez à jour `vue.config.js` avec le bon `publicPath`:
   ```javascript
   publicPath: process.env.NODE_ENV === 'production'
     ? '/EDT_alt_projet/'  // Nom de votre repo
     : '/'
   ```

2. Construisez et déployez:
   ```bash
   cd frontend
   npm install
   npm run build
   npm run deploy
   ```

3. Activez GitHub Pages dans les paramètres du repository:
   - Settings > Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`

## ✅ Vérification du Déploiement

### Backend
Testez votre backend:
```bash
curl https://votre-backend.onrender.com/
# Devrait retourner: "Backend opérationnel ✔️"
```

### Frontend
1. Ouvrez votre URL Vercel ou GitHub Pages
2. Vérifiez que l'application se charge
3. Testez la connexion (si elle échoue, vérifiez les CORS)

## 🔧 Dépannage

### Problème: Le backend ne démarre pas sur Render
- Vérifiez les logs dans le dashboard Render
- Assurez-vous que toutes les variables d'environnement sont définies
- Vérifiez que `DATABASE_URL` est correct

### Problème: Le frontend ne peut pas se connecter au backend
- Vérifiez que `VUE_APP_API_URL` pointe vers le bon backend
- Vérifiez les CORS dans `backend/app.js`
- Ouvrez la console du navigateur pour voir les erreurs

### Problème: Erreur de base de données
- Vérifiez que la base de données PostgreSQL sur Render est active
- Vérifiez les credentials de connexion
- Assurez-vous que `DATABASE_URL` est bien configuré

### Le service Render s'endort (Free Plan)
- Le plan gratuit de Render met en veille les services inactifs après 15 min
- Le premier accès prendra ~30-60 secondes pour réveiller le service
- Solution: upgrade vers un plan payant ou accepter le délai

## 📝 Scripts Utiles

### Déploiement complet depuis la racine
```bash
# Installer toutes les dépendances
npm run install:all

# Construire le frontend
npm run build

# Le backend se déploie automatiquement sur Render à chaque push
```

### Test local avant déploiement
```bash
# Backend
cd backend
npm install
npm start

# Frontend (dans un autre terminal)
cd frontend
npm install
npm run serve
```

## 🔐 Sécurité

⚠️ **IMPORTANT**: Avant de déployer en production:

1. Changez **TOUS** les secrets dans les variables d'environnement
2. N'incluez **JAMAIS** les fichiers `.env` dans Git
3. Utilisez des mots de passe forts pour la base de données
4. Activez HTTPS (Render et Vercel le font automatiquement)
5. Configurez `secure: true` pour les cookies en production

## 📚 Ressources

- [Documentation Render](https://render.com/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [Vue.js Deployment Guide](https://cli.vuejs.org/guide/deployment.html)
- [Express Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

## 🆘 Support

Si vous rencontrez des problèmes:
1. Consultez les logs sur Render/Vercel
2. Vérifiez ce guide étape par étape
3. Ouvrez une issue sur GitHub avec les détails de l'erreur
