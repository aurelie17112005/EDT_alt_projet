const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/SessionController');
const auth = require('../middlewares/auth');

// Route corrigée pour matcher le frontend
// routes/sessionRoutes.js
router.get('/teacher', auth, sessionController.getTeacherSessions);

module.exports = router;