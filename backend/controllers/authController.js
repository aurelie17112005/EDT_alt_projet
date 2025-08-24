// authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/auth');
const { Op } = require('sequelize');

exports.register = async (req, res) => {
  try {
    const { ldapId, email, password, role } = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { ldapId },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'L\'utilisateur existe déjà' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      ldapId,
      email,
      password: hashedPassword,
      role: role || 'student',
    });

    const token = jwt.sign({ ldapId: newUser.ldapId, role: newUser.role }, config.jwtSecret, { expiresIn: '1h' });

    res.status(201).json({
      message: 'Inscription réussie',
      user: { id: newUser.id, ldapId: newUser.ldapId, email: newUser.email, role: newUser.role },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.login = async (req, res) => {
  try {
    const { ldapId, password } = req.body;

    console.log('📥 Requête de login reçue :', req.body);

    if (!ldapId || !password) {
      console.warn('⚠️ Identifiants manquants');
      return res.status(400).json({ error: 'Identifiants requis' });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { ldapId },
          { email: ldapId }
        ]
      }
    });

    if (!user) {
      console.warn(`❌ Utilisateur introuvable pour ldapId/email : ${ldapId}`);
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    console.log('🔍 Utilisateur trouvé :', {
      id: user.id,
      ldapId: user.ldapId,
      email: user.email,
      role: user.role
    });

    console.log('🔑 Hash du mot de passe en base :', user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log('🔐 Résultat de bcrypt.compare :', isPasswordValid);

    if (!isPasswordValid) {
      console.warn('❌ Mot de passe invalide');
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { ldapId: user.ldapId, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn || '1h' }
    );

    console.log('✅ Connexion réussie. JWT généré.');

    res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        ldapId: user.ldapId,
        email: user.email,
        role: user.role
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// logout et autres fonctions : inchangées

exports.logout = (req, res) => {
  req.logout?.(); // Pour Passport
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('https://auth.univ-fcomte.fr/logout'); // Remplace par ton URL CAS si nécessaire
  });
};

exports.handleCasLogin = async (req, res) => {
  try {
    if (!req.session.cas_user) {
      return res.status(401).redirect('http://localhost:8081/login?error=cas_auth_failed');
    }

    const ldapId = req.session.cas_user;
    let user = await User.findOne({ where: { ldapId } });

    if (!user) {
      user = await User.create({ ldapId, role: 'student' });
    }

    const token = jwt.sign(
      { ldapId: user.ldapId, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    const redirectUrl = req.query.redirect
      ? `http://localhost:8081${req.query.redirect}?cas_token=${token}`
      : `http://localhost:8081/?cas_token=${token}`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error('CAS login error:', error);
    res.redirect('http://localhost:8081/login?error=cas_error');
  }
};

exports.getCasUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Non autorisé' });

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
