const express = require('express');
const { check } = require('express-validator');
const { leaveRequest, approveLeave, getLeaveDetails, getAllLeaveDetails, outingRequest, declineLeave} = require('../controller/leaveController');
const router = express.Router();

router.post("/leave-request",leaveRequest);
router.post('/approve-leave/:id', approveLeave);
router.get('/leave-details/:id', getLeaveDetails);
router.get('/leave-all-details', getAllLeaveDetails)
router.post('/outing-request', outingRequest);
router.post('/decline-leave/:id', declineLeave);

module.exports = router