require('dotenv').config(); // charge les variables d'environnement en premier

const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT;

// Connexion à PostgreSQL via Sequelize
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connecté à PostgreSQL');

    // Synchroniser les modèles (optionnel, à adapter en prod)
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Serveur en écoute sur ${PORT}`);
    });
  })
  .catch(err => {
      console.log(`🚀 Serveur en écoute sur http://localhost:${PORT}`);
});
