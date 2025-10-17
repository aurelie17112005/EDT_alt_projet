# EDT Alt Projet

Application de gestion d'emploi du temps et d'émargement avec QR Code.

## 🚀 Déploiement en Ligne

Pour déployer ce projet en ligne (Render + Vercel ou GitHub Pages), consultez le guide complet:

👉 **[Guide de Déploiement](./DEPLOYMENT.md)**

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

- [Guide de Déploiement](./DEPLOYMENT.md) - Instructions complètes pour déployer en ligne
- Frontend: Vue.js + Vuetify
- Backend: Express.js + PostgreSQL