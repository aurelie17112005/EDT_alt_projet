const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const auth = require('../middlewares/auth');

router.get('/generate/:sessionId', auth, pdfController.generatePdf);

module.exports = router;
