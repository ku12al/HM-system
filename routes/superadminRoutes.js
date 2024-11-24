const express = require('express');
const router = express.Router();
const {getAllComplaints} = require('../controller/superadminController')

router.get('/getAllComplaints', getAllComplaints);
module.exports = router;

