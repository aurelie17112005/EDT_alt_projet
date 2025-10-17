# 🔧 Guide de Dépannage - Problèmes Courants

## 🚨 Problèmes Backend (Render)

### Le backend ne démarre pas

**Symptômes**: Le déploiement échoue sur Render, logs montrent des erreurs

**Solutions**:
1. Vérifier les logs dans Render Dashboard > Votre service > Logs
2. Vérifier que toutes les variables d'environnement sont définies:
   ```
   DATABASE_URL
   JWT_SECRET
   SESSION_SECRET
   NODE_ENV=production
   ```
3. Vérifier que la base de données PostgreSQL est active
4. Essayer un redéploiement manuel (bouton "Manual Deploy")

### Erreur: "Cannot connect to database"

**Symptômes**: Le backend démarre mais ne peut pas se connecter à la base

**Solutions**:
1. Vérifier que DATABASE_URL est correctement lié à votre base Render
2. Vérifier que la base de données est active (vert dans Render dashboard)
3. S'assurer que le dialectOptions.ssl est configuré à `require: true` en production

### Le backend répond 502 ou 503

**Symptômes**: Erreur 502 Bad Gateway ou 503 Service Unavailable

**Solutions**:
1. **Plan Gratuit**: C'est normal! Le service s'endort après 15 min d'inactivité
2. Attendre 30-60 secondes que le service se réveille
3. Rafraîchir la page
4. Si l'erreur persiste, vérifier les logs Render

### CORS Errors

**Symptômes**: Frontend ne peut pas accéder au backend, erreurs CORS dans la console

**Solutions**:
1. Vérifier que FRONTEND_URL est défini dans les variables d'environnement Render
2. Vérifier que l'URL correspond exactement à votre frontend Vercel
3. Vérifier le fichier `backend/app.js` - la configuration CORS doit inclure votre URL
4. Redéployer le backend après modification des variables

## 🎨 Problèmes Frontend (Vercel)

### Le build échoue sur Vercel

**Symptômes**: Déploiement échoue, erreurs de compilation

**Solutions**:
1. Vérifier les logs de build dans Vercel Dashboard
2. Tester le build localement: `cd frontend && npm run build`
3. Vérifier que VUE_APP_API_URL est bien défini dans les variables d'environnement
4. S'assurer que toutes les dépendances sont dans `package.json`

### Le frontend se charge mais est vide/blanc

**Symptômes**: Page blanche, pas d'erreurs visibles

**Solutions**:
1. Ouvrir la console du navigateur (F12)
2. Vérifier les erreurs JavaScript
3. Vérifier que VUE_APP_API_URL pointe vers le bon backend
4. Vérifier le Network tab pour voir si les requêtes échouent
5. Essayer en navigation privée (cache)

### Erreur 404 sur les routes Vue

**Symptômes**: Les routes Vue (ex: /admin, /sessions) donnent une erreur 404

**Solutions**:
1. Vérifier que `vercel.json` existe et contient la bonne configuration
2. Le fichier doit avoir:
   ```json
   {
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ]
   }
   ```
3. Redéployer après modification

### Le frontend ne peut pas se connecter au backend

**Symptômes**: Erreurs de connexion API, timeouts

**Solutions**:
1. Vérifier que VUE_APP_API_URL est correct (avec https://)
2. Vérifier que le backend est en ligne (tester l'URL directement)
3. Vérifier les CORS (voir section Backend)
4. Ouvrir Network tab dans DevTools pour voir les requêtes

## 🗄️ Problèmes Base de Données

### Erreur: "relation does not exist"

**Symptômes**: Erreurs mentionnant des tables manquantes

**Solutions**:
1. Les tables ne sont pas créées. Sequelize devrait les créer automatiquement
2. Vérifier les logs backend pour voir si `sequelize.sync()` s'exécute
3. Vérifier les permissions de l'utilisateur de la base
4. En dernier recours, recréer la base de données

### Base de données pleine

**Symptômes**: Erreurs d'espace disque

**Solutions**:
1. Le plan Free de Render a une limite de 1 GB
2. Nettoyer les anciennes sessions: se connecter à la base et exécuter:
   ```sql
   DELETE FROM session WHERE expire < NOW();
   ```
3. Considérer un upgrade du plan

### Connexion lente à la base

**Symptômes**: Requêtes très lentes

**Solutions**:
1. Normal pour le plan Free (base partagée)
2. Vérifier qu'il n'y a pas trop de données
3. Ajouter des index si nécessaire
4. Considérer un upgrade du plan

## 🔐 Problèmes d'Authentification

### Impossible de se connecter

**Symptômes**: Login échoue, pas de session

**Solutions**:
1. Vérifier que SESSION_SECRET est défini
2. Vérifier que JWT_SECRET est défini
3. Vérifier les cookies (console DevTools > Application > Cookies)
4. Vérifier que `secure: true` est bien configuré en production
5. Vérifier que sameSite est à 'none' en production

### CAS ne fonctionne pas

**Symptômes**: Erreur lors de l'authentification CAS

**Solutions**:
1. Vérifier CAS_SERVICE_URL pointe vers le bon backend
2. Vérifier CAS_URL (https://auth.univ-fcomte.fr/)
3. S'assurer que l'URL est accessible depuis l'extérieur

### Session expire trop vite

**Symptômes**: Déconnexion fréquente

**Solutions**:
1. Vérifier `maxAge` dans la configuration session
2. Par défaut: 7 jours (configurable dans `backend/app.js`)
3. Vérifier que la table session existe dans PostgreSQL

## 🌐 Problèmes Réseau

### Erreur: "net::ERR_CONNECTION_REFUSED"

**Symptômes**: Impossible de se connecter au backend

**Solutions**:
1. Le backend est éteint (plan Free Render)
2. Attendre qu'il se réveille (30-60 secondes)
3. Vérifier l'URL du backend

### Requêtes très lentes

**Symptômes**: Chargements qui prennent plusieurs secondes

**Solutions**:
1. **Normal pour le plan Free**:
   - Backend Render: réveil = 30-60s
   - Base de données: ressources partagées
2. Pour améliorer:
   - Upgrade vers un plan payant
   - Utiliser un CDN pour les assets statiques
   - Optimiser les requêtes base de données

### Timeout errors

**Symptômes**: Les requêtes timeout après 30 secondes

**Solutions**:
1. Render Free a un timeout de 30 secondes
2. Optimiser les requêtes longues
3. Ajouter de la pagination
4. Utiliser des background jobs pour les tâches longues

## 📱 Problèmes Mobile/Cross-Browser

### L'application ne fonctionne pas sur mobile

**Solutions**:
1. Vérifier la console mobile (via USB debugging)
2. Tester sur plusieurs navigateurs
3. Vérifier les media queries CSS
4. Vérifier Vuetify responsive breakpoints

### Différences entre navigateurs

**Solutions**:
1. Tester sur Chrome, Firefox, Safari
2. Vérifier la compatibilité des features utilisées
3. Utiliser les polyfills si nécessaire

## 🔄 Redéploiement

### Comment redéployer après un changement?

**Backend (Render)**:
1. Push sur GitHub branche `main`
2. Render redéploie automatiquement
3. Ou: bouton "Manual Deploy" dans Render dashboard

**Frontend (Vercel)**:
1. Push sur GitHub branche `main`
2. Vercel redéploie automatiquement
3. Ou: bouton "Redeploy" dans Vercel dashboard

### Les changements ne sont pas visibles

**Solutions**:
1. Attendre la fin du déploiement (check logs)
2. Vider le cache du navigateur (Ctrl+Shift+R)
3. Essayer en navigation privée
4. Vérifier que le bon commit est déployé

## 📊 Monitoring et Logs

### Comment voir les logs?

**Backend**:
- Render Dashboard > Votre service > Logs
- Logs en temps réel pendant le déploiement

**Frontend**:
- Vercel Dashboard > Votre projet > Deployments > (cliquer sur un deployment) > Build Logs
- Console du navigateur pour les erreurs frontend

### Activer le mode debug

**Backend**:
Ajouter dans les variables d'environnement Render:
```
DEBUG=*
```

**Frontend**:
Ouvrir DevTools (F12) > Console

## 🆘 Besoin d'Aide Supplémentaire?

1. **Documentation officielle**:
   - [Render Docs](https://render.com/docs)
   - [Vercel Docs](https://vercel.com/docs)
   - [Vue.js Docs](https://v2.vuejs.org/)

2. **Support des plateformes**:
   - Render: support@render.com
   - Vercel: support@vercel.com

3. **Issues GitHub**:
   - Ouvrir une issue sur le repository avec:
     - Description du problème
     - Logs d'erreur
     - Étapes pour reproduire
     - Capture d'écran si applicable

4. **Ressources communautaires**:
   - Stack Overflow
   - Discord Vue.js
   - Forums Render/Vercel

---

💡 **Conseil**: Gardez toujours une copie locale fonctionnelle pour tester les changements avant de déployer!
