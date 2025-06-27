// authRoutes.js

const express = require('express');
const router = express.Router();
const passport = require('../middlewares/passport');
const authController = require('../controllers/authController');

// Route pour l'inscription des utilisateurs
router.post('/register', authController.register);

// Route pour la connexion classique (login)
router.post('/login', authController.login);

// Routes CAS
router.get('/cas', passport.authenticate('cas'));
router.get('/cas/callback', passport.authenticate('cas', { failureRedirect: '/login' }), authController.handleCasLogin);

// Route logout
router.get('/logout', authController.logout);
router.post('/login', (req, res) => res.send('Test login route'));

module.exports = router;
