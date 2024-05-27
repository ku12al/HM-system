const express = require('express');
const { check } = require('express-validator');
const { leaveRequest, approveLeave, getLeaveDetails } = require('../controller/leaveController');
const router = express.Router();

router.post("/leave-request",leaveRequest);

router.post('/approve-leave', approveLeave);
router.get('/leave-details/:erpid', getLeaveDetails);

module.exports = router