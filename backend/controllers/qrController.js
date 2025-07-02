// controllers/qrController.js

const jwt = require('jsonwebtoken');
const qrcode = require('qrcode');
const Session = require('../models/Session');        // import direct
const Attendance = require('../models/Attendance');  // import direct

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';
const QR_CODE_EXPIRATION = 10 * 60; // 5 minutes en secondes

// Génération du QR Code
exports.generateQRCode = async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    return res.status(400).json({ message: 'Session ID requis' });
  }

  try {
    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session introuvable' });
    }

    // Créer le token
    const token = jwt.sign({ sessionId }, SECRET_KEY, { expiresIn: QR_CODE_EXPIRATION });
    // Générer l'image DataURL
    const qrCodeUrl = await qrcode.toDataURL(token);
    // Calcul de l'expiration
    const expiry = Date.now() + QR_CODE_EXPIRATION * 1000;

    res.json({ token, qrCodeUrl, expiry });
  } catch (error) {
    console.error('Erreur QR génération:', error);
    res.status(500).json({ message: 'Erreur lors de la génération du QR code' });
  }
};



// Scan du QR Code et enregistrement de la présence
exports.scanQRCode = async (req, res) => {
  const { token, studentId } = req.body;
  if (!token || !studentId) {
    return res.status(400).json({ message: 'Token et ID étudiant requis' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const sessionId = decoded.sessionId;

    const attendance = await Attendance.create({
      sessionId,
      studentId,
      timestamp: new Date(),
      // si ton modèle Attendance n'a pas de champ `mode`, supprime-le
      mode: 'QR'
    });

    res.json({ message: 'Présence enregistrée', attendance });
  } catch (error) {
    console.error('Erreur scan QR:', error);
    res.status(400).json({ message: 'QR Code invalide ou expiré' });
  }
};
