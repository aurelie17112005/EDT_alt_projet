const express = require('express');
const router = express.Router();
const {requireAuth} = require('../middlewares/auth');
const pdfController = require('../controllers/pdfController');

// ✅ Nouvelle route : Génération de la fiche par groupe + date
router.get('/generate-daily/:date/:groupId', requireAuth, pdfController.generateDailyPdf);

module.exports = router;
