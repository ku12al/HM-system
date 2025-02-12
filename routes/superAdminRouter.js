const express = require('express');
const { registerSuperAdmin, getAllComplaint, loginSuperAdmin } = require('../controller/superadminController');
const router = express.Router();

router.post('/register-super-admin', registerSuperAdmin);
router.get('/getAllComplaints', getAllComplaint);
router.post('/login-super-admin', loginSuperAdmin)


module.exports = router;