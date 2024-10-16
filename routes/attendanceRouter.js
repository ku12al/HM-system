const express = require('express');
const { markPresent, markAbsent, checkAttendance} = require('../controller/attendanceController');
const router = express.Router();

router.post("/mark-present", markPresent);
router.get("/attendence-check", checkAttendance);
router.post("/mark-absent", markAbsent)


module.exports = router