const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Import des middlewares correctement séparés
const { requireAuth, requireProf } = require('../middlewares/auth');

// ✅ Validation croisée d’un pair (étudiant connecté)
router.post('/validate-peer',
    requireAuth,
    attendanceController.validatePeer
);

// ✅ Récupération des présences d’une session (prof uniquement)
router.get('/session/:sessionId',
    requireAuth,
    requireProf,
    attendanceController.getAttendanceForSession
);

// ✅ Correction manuelle d’une présence (prof uniquement)
router.put('/:attendanceId',
    requireAuth,
    requireProf,
    attendanceController.updateAttendanceStatus
);
router.post('/manual', requireAuth, attendanceController.manualToggle);
router.post('/toggle', requireAuth, attendanceController.manualToggle);

module.exports = router;
