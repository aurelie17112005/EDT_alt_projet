// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const adminController = require('../controllers/adminController');

router.use(requireAuth);

router.get('/users',                   adminController.getAllUsers);
router.post('/users',                  adminController.createUser);
router.put('/users/:ldapId',           adminController.updateUser);   // ← :ldapId
router.delete('/users/:ldapId',        adminController.deleteUser);

router.get('/exports/:date',           adminController.getDailyExport);

module.exports = router;
