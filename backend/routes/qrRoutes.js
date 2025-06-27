const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');

// Génération du QR Code
router.post('/generate', qrController.generateQRCode);

// Scan du QR Code
router.post('/scan', qrController.scanQRCode);

module.exports = router;
