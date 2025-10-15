# EDT Alt - Système de gestion de présence

## Description

Application de gestion des présences étudiantes via QR Code et génération de documents.

## Fonctionnalités

### ✅ Génération d'images

Le système peut générer plusieurs types d'images et de documents :

#### 1. **QR Codes**
- Génération de QR codes dynamiques pour les séances de cours
- Format : base64 data URL (image PNG)
- Durée de validité : 10 minutes
- Utilisé pour l'émargement des étudiants
- Endpoint : `POST /api/qrcode/generate`

#### 2. **Documents PDF**
- Génération de fiches d'émargement journalières
- Format : PDF (via PDFKit)
- Contenu : liste des étudiants, séances du jour, statut de présence
- Endpoint : `GET /api/pdf/generate-daily/:date/:groupId`

### Autres fonctionnalités
- Authentification des utilisateurs (enseignants, étudiants, admin)
- Gestion des séances de cours
- Suivi des présences
- Interface Vue.js avec Vuetify

## Technologies utilisées

### Backend
- Node.js / Express
- PostgreSQL / Sequelize
- JWT pour l'authentification
- `qrcode` pour la génération de QR codes
- `pdfkit` pour la génération de PDF

### Frontend
- Vue.js 2
- Vuetify 2
- Axios
- Vue Router / Vuex

## Installation

```bash
# Installer les dépendances
npm run install:all

# Construire le frontend
npm run build

# Démarrer le serveur
npm start
```

## Configuration

Créer un fichier `.env` dans le dossier `backend/` :

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=votre_base
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
JWT_SECRET=votre_secret_jwt
SECRET_KEY=votre_secret_key
```

## Développement

```bash
# Frontend
cd frontend
npm run start

# Backend
cd backend
npm run dev
```