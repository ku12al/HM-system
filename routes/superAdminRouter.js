const express = require('express');
const { registerSuperAdmin, getAllComplaint, loginSuperAdmin, getSuperAdmin } = require('../controller/superadminController');
const router = express.Router();

router.post('/register-super-admin', registerSuperAdmin);
router.get('/getAllComplaints', getAllComplaint);
router.post('/login-super-admin', loginSuperAdmin)
router.get('/getSuperAdmin/:id', getSuperAdmin);


module.exports = router;