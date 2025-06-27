const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const auth = require('../middlewares/auth');

router.post('/validate-peer', 
  auth,
  attendanceController.validatePeer
);

router.get('/session/:sessionId',
  auth,
  attendanceController.getAttendanceForSession
);

module.exports = router;