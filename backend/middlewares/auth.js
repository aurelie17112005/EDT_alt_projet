const jwt = require('jsonwebtoken');
const config = require('../config/auth');

module.exports = (req, res, next) => {
  // 1. Vérifier le header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentification requise' });
  }

  // 2. Extraire le token
  const token = authHeader.split(' ')[1];

  try {
    // 3. Vérifier le token
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};