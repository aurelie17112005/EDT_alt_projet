const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const { requireAuth } = require('../middlewares/auth');

// Protéger la génération mais pas le scan (fait par les étudiants)
router.post('/generate', requireAuth, qrController.generateQRCode);
router.post('/scan', qrController.scanQRCode);

module.exports = router;