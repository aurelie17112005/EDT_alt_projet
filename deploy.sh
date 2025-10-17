#!/bin/bash

# Script de déploiement rapide pour EDT Alt Projet
# Ce script vous guide à travers les étapes de déploiement

echo "======================================"
echo "EDT Alt - Script de Déploiement"
echo "======================================"
echo ""

# Vérification des prérequis
echo "📋 Vérification des prérequis..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Node.js $(node --version) détecté"
echo "✅ npm $(npm --version) détecté"
echo ""

# Installation des dépendances
echo "📦 Installation des dépendances..."
echo "   Backend..."
cd backend && npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances backend"
    exit 1
fi
cd ..

echo "   Frontend..."
cd frontend && npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances frontend"
    exit 1
fi
cd ..

echo "✅ Dépendances installées avec succès"
echo ""

# Vérification des fichiers .env
echo "🔧 Vérification de la configuration..."
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Le fichier backend/.env n'existe pas"
    echo "   Copie de backend/.env.example vers backend/.env"
    cp backend/.env.example backend/.env
    echo "   ⚠️  IMPORTANT: Éditez backend/.env avec vos propres valeurs"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Le fichier frontend/.env n'existe pas"
    echo "   Copie de frontend/.env.example vers frontend/.env"
    cp frontend/.env.example frontend/.env
    echo "   ⚠️  IMPORTANT: Éditez frontend/.env avec votre URL backend"
fi

echo ""
echo "======================================"
echo "✅ Installation terminée avec succès!"
echo "======================================"
echo ""
echo "📚 Prochaines étapes pour le déploiement:"
echo ""
echo "1. Configuration locale (pour tester):"
echo "   - Configurez PostgreSQL localement"
echo "   - Éditez backend/.env avec vos credentials"
echo "   - Lancez: cd backend && npm start"
echo "   - Lancez: cd frontend && npm run serve"
echo ""
echo "2. Déploiement en ligne (production):"
echo "   Consultez le guide complet: DEPLOYMENT.md"
echo ""
echo "   Résumé rapide:"
echo "   a) Backend sur Render:"
echo "      - Créez un compte sur render.com"
echo "      - Créez une base PostgreSQL"
echo "      - Créez un Web Service pointant vers ce repo"
echo "      - Configurez les variables d'environnement"
echo ""
echo "   b) Frontend sur Vercel:"
echo "      - Créez un compte sur vercel.com"
echo "      - Importez ce repository"
echo "      - Configurez VUE_APP_API_URL avec l'URL de votre backend"
echo "      - Déployez!"
echo ""
echo "📖 Guide détaillé: cat DEPLOYMENT.md"
echo ""
