const express = require('express');
const { markPresent, markAbsent, checkAttendance, checkAttendanceAtDate} = require('../controller/attendanceController');
const router = express.Router();

router.post("/mark-present", markPresent);
router.get("/attendence-check", checkAttendance);
router.get("/attendence-check-at-date", checkAttendanceAtDate);
router.post("/mark-absent", markAbsent)


module.exports = router