const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const groupController = require('../controllers/groupController');

router.get('/', requireAuth, groupController.listGroups);
router.get('/:id/students', requireAuth, groupController.getStudentsByGroup);

module.exports = router;
