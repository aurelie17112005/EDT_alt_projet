const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const auth = require('../middlewares/auth');

// Route corrigée pour matcher le frontend
// routes/sessionRoutes.js
router.get('/teacher', auth, sessionController.getTeacherSessions);

module.exports = router;