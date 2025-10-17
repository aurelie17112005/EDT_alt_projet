# 🚀 Guide Rapide - Déploiement en 30 Minutes

## 📋 Ce dont vous avez besoin

- [ ] Un compte GitHub (vous l'avez déjà! ✅)
- [ ] Un compte [Render](https://render.com) (gratuit)
- [ ] Un compte [Vercel](https://vercel.com) (gratuit)
- [ ] 30 minutes de votre temps

## ⚡ Démarrage Ultra-Rapide

### 🔵 Étape 1: Backend (15 min)

1. **Allez sur [render.com](https://render.com)** → Sign Up avec GitHub

2. **Créez une base de données**:
   - New + → PostgreSQL
   - Name: `edt-db`
   - Region: Frankfurt
   - Plan: Free
   - Create Database
   - ⚠️ **Copiez l'Internal Database URL**

3. **Créez le backend**:
   - New + → Web Service
   - Connect Repository → Sélectionnez ce repo
   - Name: `edt-backend`
   - Region: Frankfurt
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Plan: Free

4. **Variables d'environnement** (dans l'onglet Environment):
   ```
   NODE_ENV = production
   DATABASE_URL = [Collez l'URL de la DB]
   JWT_SECRET = [Cliquez "Generate" ou mettez un mot de passe fort]
   SESSION_SECRET = [Cliquez "Generate" ou mettez un mot de passe fort]
   CAS_SERVICE_URL = https://[votre-backend].onrender.com/api/auth/login-cas
   CAS_URL = https://auth.univ-fcomte.fr/
   ```

5. **Create Web Service** → Attendez le déploiement (5 min)

6. ⚠️ **Notez l'URL**: `https://[votre-backend].onrender.com`

### 🟢 Étape 2: Frontend (10 min)

1. **Allez sur [vercel.com](https://vercel.com)** → Sign Up avec GitHub

2. **New Project** → Import Repository → Sélectionnez ce repo

3. **Configuration**:
   - Framework: Vue.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables**:
   ```
   VUE_APP_API_URL = https://[votre-backend].onrender.com
   ```

5. **Deploy** → Attendez le déploiement (3 min)

6. ⚠️ **Notez l'URL**: `https://[votre-projet].vercel.app`

### 🟣 Étape 3: Connexion (5 min)

1. **Retournez sur Render** → Votre backend → Environment

2. **Ajoutez une variable**:
   ```
   FRONTEND_URL = https://[votre-projet].vercel.app
   ```

3. **Manual Deploy** → Latest Commit

4. **Testez**: Ouvrez `https://[votre-projet].vercel.app`

## ✅ Vérification

Votre projet devrait maintenant fonctionner!

- [ ] Frontend s'ouvre sans erreur
- [ ] Pas d'erreurs CORS dans la console (F12)
- [ ] Les pages se chargent correctement

## 🆘 Problème?

### Le backend ne répond pas
⏰ **Normal!** Le plan Free s'endort après 15 min. Attendez 30-60 secondes.

### Erreur CORS
🔧 Vérifiez que `FRONTEND_URL` est bien configuré sur Render et redéployez.

### Frontend blanc/vide
🔍 Ouvrez la console (F12) et regardez les erreurs. Vérifiez `VUE_APP_API_URL`.

### Plus d'aide
📚 Consultez [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) pour tous les problèmes!

## 🎯 URLs à Sauvegarder

Notez vos URLs ici:

```
Frontend Vercel: _________________________________
Backend Render:  _________________________________
Database Render: _________________________________
```

## 📚 Documentation Complète

Pour plus de détails, consultez:

- **Guide Complet**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Checklist Détaillée**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Dépannage**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## 🎉 Félicitations!

Votre projet est maintenant en ligne! 🚀

Partagez votre URL et profitez de votre application web!

---

⚠️ **Note**: Les plans gratuits ont des limitations (sleep après 15 min pour le backend). Pour une utilisation intensive, considérez les plans payants (~34€/mois).
