# EDT Alt Projet

Application de gestion d'emploi du temps et d'émargement avec QR Code.

## ⚡ Déploiement Rapide (30 minutes)

**Vous voulez déployer rapidement?** 
👉 Suivez le **[Guide Rapide de Déploiement](./QUICKSTART.md)** (30 minutes)

Pour plus de détails, consultez le **[Guide Complet](./DEPLOYMENT.md)**.

## 🚀 Déploiement en Ligne

Pour déployer ce projet en ligne (Render + Vercel ou GitHub Pages), consultez:

- **[Guide Rapide - 30 min](./QUICKSTART.md)** ⚡ - Démarrage ultra-rapide
- **[Guide Complet](./DEPLOYMENT.md)** 📚 - Instructions détaillées
- **[Checklist](./DEPLOYMENT_CHECKLIST.md)** ✅ - Étape par étape
- **[Architecture](./ARCHITECTURE.md)** 🏗️ - Comprendre le système

## 📦 Installation Locale

### Prérequis
- Node.js (v14+)
- PostgreSQL
- npm ou yarn

### Installation
```bash
# Installer toutes les dépendances (frontend + backend)
npm run install:all

# Ou séparément:
npm run install:frontend
npm run install:backend
```

### Configuration
1. Copiez les fichiers d'exemple:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Configurez vos variables d'environnement dans les fichiers `.env`

### Lancement
```bash
# Backend (port 3000)
cd backend
npm start

# Frontend (port 8081) - dans un autre terminal
cd frontend
npm run serve
```

### Build Production
```bash
# Construire le frontend et le copier dans backend/public
npm run build
```

## 🏗️ Architecture

- **Frontend**: Vue.js 2 + Vuetify
- **Backend**: Node.js + Express
- **Base de données**: PostgreSQL (avec Sequelize ORM)
- **Authentification**: JWT + CAS

## 📝 Scripts Disponibles

- `npm run install:all` - Installe toutes les dépendances
- `npm run build` - Construit le frontend pour la production
- `npm run start` - Démarre le backend en production

## 🔗 Liens Utiles

- **[Guide de Déploiement](./DEPLOYMENT.md)** - Instructions complètes pour déployer en ligne
- **[Checklist de Déploiement](./DEPLOYMENT_CHECKLIST.md)** - Liste de vérification étape par étape
- **[Architecture](./ARCHITECTURE.md)** - Diagrammes et explications de l'architecture
- **[Guide de Dépannage](./TROUBLESHOOTING.md)** - Solutions aux problèmes courants
- Frontend: Vue.js + Vuetify
- Backend: Express.js + PostgreSQL

## 🛠️ Technologies

- **Frontend**: Vue.js 2, Vuetify, Vue Router, Vuex
- **Backend**: Node.js, Express, Sequelize ORM
- **Base de données**: PostgreSQL
- **Authentification**: JWT + Passport (CAS support)
- **Autres**: QRCode generation, PDF generation

## 🌐 Plateformes de Déploiement

- **Backend**: Render.com (Plan gratuit disponible)
- **Frontend**: Vercel (Plan gratuit disponible)
- **Base de données**: PostgreSQL sur Render (Plan gratuit disponible)

## 📞 Support

Pour toute question ou problème:
1. Consultez le [Guide de Dépannage](./TROUBLESHOOTING.md)
2. Vérifiez les issues existantes sur GitHub
3. Ouvrez une nouvelle issue avec les détails du problème