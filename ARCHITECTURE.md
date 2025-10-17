# 🏗️ Architecture de Déploiement

## Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                         INTERNET                            │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┴───────────────────┐
        │                                      │
        ▼                                      ▼
┌───────────────┐                    ┌──────────────────┐
│   FRONTEND    │                    │     BACKEND      │
│   (Vercel)    │◄──────────────────►│    (Render)      │
│               │      API Calls     │                  │
│  Vue.js App   │                    │  Express Server  │
│  Static Files │                    │  Node.js         │
└───────────────┘                    └────────┬─────────┘
                                              │
                                              ▼
                                    ┌──────────────────┐
                                    │    DATABASE      │
                                    │  (PostgreSQL)    │
                                    │   on Render      │
                                    └──────────────────┘
```

## Composants Détaillés

### 🎨 Frontend (Vercel)

**Technologie**: Vue.js 2 + Vuetify
**URL**: `https://[votre-projet].vercel.app`

**Responsabilités**:
- Interface utilisateur (Vue.js + Vuetify)
- Routage client-side (Vue Router)
- Gestion d'état (Vuex)
- Génération de QR codes
- Scanner de QR codes

**Fichiers déployés**:
```
dist/
├── index.html
├── css/
│   └── [fichiers CSS compilés]
├── js/
│   └── [fichiers JS compilés]
└── favicon.ico
```

**Variables d'environnement**:
- `VUE_APP_API_URL`: URL du backend Render

**Caractéristiques**:
- ✅ CDN global
- ✅ HTTPS automatique
- ✅ Déploiement automatique sur push
- ✅ Redéploiements instantanés
- ✅ Gratuit (avec limitations)

### 🔧 Backend (Render)

**Technologie**: Node.js + Express
**URL**: `https://[votre-backend].onrender.com`

**Responsabilités**:
- API REST
- Authentification (JWT + CAS)
- Gestion des sessions
- Logique métier
- Génération de PDFs
- Génération de QR codes backend

**Structure**:
```
backend/
├── server.js         # Point d'entrée
├── app.js           # Configuration Express
├── config/          # Configuration (DB, auth)
├── controllers/     # Logique métier
├── models/          # Modèles Sequelize
├── routes/          # Routes API
└── middlewares/     # Middlewares (auth, etc)
```

**Variables d'environnement**:
- `NODE_ENV`: production
- `DATABASE_URL`: Connexion PostgreSQL
- `JWT_SECRET`: Secret pour JWT
- `SESSION_SECRET`: Secret pour sessions
- `CAS_SERVICE_URL`: URL callback CAS
- `CAS_URL`: URL du serveur CAS
- `FRONTEND_URL`: URL du frontend (CORS)

**Caractéristiques**:
- ✅ HTTPS automatique
- ✅ Déploiement automatique sur push
- ⚠️ Sleep après 15 min d'inactivité (plan Free)
- ⚠️ Cold start: 30-60 secondes
- ✅ Gratuit (avec limitations)

### 🗄️ Base de Données (PostgreSQL sur Render)

**Technologie**: PostgreSQL
**Connexion**: Via `DATABASE_URL`

**Tables principales**:
```
users           # Utilisateurs
groups          # Groupes/Classes
sessions        # Sessions d'émargement
attendances     # Émargements
qrcodes         # Codes QR générés
session         # Sessions Express (cookies)
```

**ORM**: Sequelize
- Migrations automatiques via `sequelize.sync()`
- Modèles définis dans `backend/models/`

**Caractéristiques**:
- ✅ SSL/TLS automatique
- ✅ Backups automatiques (plans payants)
- ⚠️ 1 GB de stockage (plan Free)
- ✅ Gratuit (avec limitations)

## Flux de Données

### 🔐 Authentification

```
1. Utilisateur → Frontend: Clic sur "Se connecter"
2. Frontend → Backend: POST /auth/login
3. Backend → CAS Server: Redirection CAS
4. CAS Server → Backend: Callback avec token
5. Backend → Database: Créer/Récupérer utilisateur
6. Backend → Frontend: JWT + Cookie session
7. Frontend: Stocker JWT, rediriger vers dashboard
```

### 📝 Émargement

```
1. Enseignant → Frontend: Créer session
2. Frontend → Backend: POST /api/sessions
3. Backend → Database: Créer session
4. Backend → Frontend: Session + QR Code
5. Étudiant → Frontend: Scanner QR Code
6. Frontend → Backend: POST /api/attendances
7. Backend → Database: Enregistrer émargement
8. Backend → Frontend: Confirmation
```

### 📊 Consultation

```
1. Utilisateur → Frontend: Voir émargements
2. Frontend → Backend: GET /api/attendances
3. Backend → Database: Query émargements
4. Backend → Frontend: Liste émargements
5. Frontend: Affichage tableau/graphique
```

## Sécurité

### 🔒 Couche Transport
- **HTTPS partout**: Render et Vercel fournissent SSL/TLS automatique
- **HSTS**: Headers de sécurité configurés
- **Secure Cookies**: `secure: true` en production

### 🛡️ Authentification
- **JWT**: Tokens signés pour l'authentification
- **Sessions**: Stockées en PostgreSQL (pas en mémoire)
- **CAS**: Support de l'authentification universitaire
- **Bcrypt**: Hachage des mots de passe (si applicable)

### 🚪 CORS
- **Whitelist**: Seuls les domaines autorisés peuvent accéder à l'API
- **Credentials**: Support des cookies cross-origin
- **Methods**: GET, POST, PUT, DELETE uniquement

### 🔐 Secrets
- **Variables d'environnement**: Jamais commités dans Git
- **Generate Values**: Render peut générer des secrets aléatoires
- **Rotation**: Facile via les dashboards Render/Vercel

## Performance

### ⚡ Frontend
- **CDN**: Distribution mondiale via Vercel Edge Network
- **Compression**: Gzip/Brotli automatique
- **Caching**: Headers optimisés
- **Code Splitting**: Vue Router lazy loading

### 🚀 Backend
- **Connection Pooling**: PostgreSQL pool configuré
- **Compression**: Express compression middleware
- **Caching**: Sessions en base (pas recalculées)

### ⏱️ Limitations (Plans Gratuits)
- **Backend Cold Start**: 30-60s après 15 min d'inactivité
- **Database**: Ressources partagées
- **Concurrent Connections**: Limitées
- **Build Minutes**: Limités (Vercel)

## Monitoring

### 📊 Métriques Disponibles

**Render**:
- Logs en temps réel
- CPU/Memory usage
- Request metrics
- Deploy history

**Vercel**:
- Build logs
- Deploy history
- Analytics (plan Pro)
- Error tracking (via Sentry)

**Base de données**:
- Connection stats
- Query performance (pgAdmin)
- Storage usage

### 🔔 Alertes

**Render**:
- Deploy success/failure (email)
- Service down (email)

**Vercel**:
- Deploy success/failure (email)
- Build errors (dashboard)

## Coûts

### 💰 Plans Gratuits

| Service | Plan | Limitations |
|---------|------|-------------|
| Render Backend | Free | Sleep après 15 min, 750h/mois |
| Render Database | Free | 1 GB, connexions limitées |
| Vercel Frontend | Hobby | 100 GB bandwidth, builds illimités |

**Total mensuel**: 0€ avec les limitations

### 💎 Upgrade Recommandé (Production)

| Service | Plan | Prix/mois | Avantages |
|---------|------|-----------|-----------|
| Render Backend | Starter | ~7€ | Toujours actif, plus de ressources |
| Render Database | Starter | ~7€ | 10 GB, meilleures performances |
| Vercel Frontend | Pro | ~20€ | Plus de bandwidth, analytics |

**Total mensuel**: ~34€ pour une vraie production

## Scalabilité

### 🔄 Scaling Horizontal

**Impossible sur plans gratuits**, mais sur plans payants:
- Multiple instances backend
- Load balancing automatique
- Database replicas

### 📈 Scaling Vertical

**Possible via upgrade**:
- Plus de CPU/RAM
- Plus de connexions DB
- Plus de stockage

### 🌍 Scaling Géographique

**Vercel**: Multi-région automatique (CDN)
**Render**: Choisir la région la plus proche des utilisateurs

## Maintenance

### 🔄 Mises à Jour

**Automatique**:
- Push sur `main` → Déploiement auto
- Zéro downtime pour le frontend
- ~30s downtime pour le backend (plan Free)

**Rollback**:
- Render: bouton "Rollback" dans dashboard
- Vercel: Sélectionner un deployment précédent

### 🗑️ Nettoyage

**Régulier**:
- Nettoyer les anciennes sessions expirées
- Archiver les vieilles données
- Monitorer l'utilisation du stockage

### 🔧 Troubleshooting

Voir [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) pour:
- Problèmes courants
- Solutions détaillées
- Logs et debugging

## Environnements

### 🔨 Développement (Local)

```
Frontend: http://localhost:8081
Backend: http://localhost:3000
Database: localhost:5432
```

### 🚀 Production (Cloud)

```
Frontend: https://[projet].vercel.app
Backend: https://[backend].onrender.com
Database: PostgreSQL on Render (internal)
```

### 🧪 Staging (Optionnel)

Créer des branches Git séparées:
- `main` → Production
- `staging` → Preview deployments (automatique sur Vercel)

## Backup & Recovery

### 💾 Backup

**Base de données**:
- Plans payants: Backups automatiques quotidiens
- Plan Free: Backup manuel via pg_dump

**Code**:
- Git repository = backup
- Tags pour les versions importantes

### 🔄 Recovery

1. **Code**: `git checkout` vers version stable
2. **Database**: Restore depuis backup Render
3. **Redeploy**: Push ou manual deploy

## Conclusion

Cette architecture offre:
- ✅ Déploiement simple et rapide
- ✅ Coûts réduits (gratuit possible)
- ✅ Scalabilité future
- ✅ Maintenance facilitée
- ✅ Monitoring intégré

Pour déployer, suivez: [DEPLOYMENT.md](./DEPLOYMENT.md)
