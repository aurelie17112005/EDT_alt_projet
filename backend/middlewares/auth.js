const jwt = require('jsonwebtoken');
const config = require('../config/auth');

// Middleware d'authentification par JWT
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authentification requise',
      details: 'Token Bearer manquant dans les headers'
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      error: 'Authentification requise',
      details: 'Token non fourni'
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    if (!decoded.ldapId) {
      return res.status(401).json({
        error: 'Token invalide',
        details: 'Le token ne contient pas de ldapId'
      });
    }

    req.user = {
      ldapId: decoded.ldapId,
      role: decoded.role || 'student'
    };

    console.log(`Utilisateur authentifié: ${req.user.ldapId} (${req.user.role})`);

    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error.message);
    const errorMessage = error.name === 'TokenExpiredError'
        ? 'Token expiré'
        : 'Token invalide';

    return res.status(401).json({ error: errorMessage });
  }
}

// Middleware pour restreindre aux profs
function requireProf(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  if (req.user.role !== 'teacher') {
    return res.status(403).json({ error: 'Accès réservé aux professeurs' });
  }

  next();
}

module.exports = {
  requireAuth,
  requireProf
};
