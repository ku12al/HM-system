const express = require('express');
const router = express.Router();
const {getAllComplaint} = require('../controller/superadminController')

router.get('/getAllComplaints', getAllComplaint);
module.exports = router;

