require('dotenv').config(); // charge les variables d'environnement en premier

const app = require('./app');
const sequelize = require('./config/database');

// Render injecte PORT automatiquement, mais on met un fallback pour le dev
const PORT = process.env.PORT || 3000;

// Connexion à PostgreSQL via Sequelize
sequelize.authenticate()
    .then(() => {
        console.log('✅ Connecté à PostgreSQL');

        // Synchroniser les modèles (attention en production)
        return sequelize.sync();
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Serveur en écoute sur http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Erreur lors du démarrage du serveur :', err);
    });
