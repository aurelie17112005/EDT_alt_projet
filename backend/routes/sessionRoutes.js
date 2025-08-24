const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/SessionController');
const { requireAuth } = require('../middlewares/auth');

// Route corrigée pour matcher le frontend
// routes/sessionRoutes.js
router.get('/teacher', requireAuth, sessionController.getTeacherSessions);
router.get('/daily', requireAuth, sessionController.getDailySessions);

module.exports = router;