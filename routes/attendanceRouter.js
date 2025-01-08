const express = require('express');
const { markPresent, markAbsent, checkAttendance, checkAttendanceAtDate, checkAttendanceByStudent} = require('../controller/attendanceController');
const router = express.Router();

router.post("/mark-present", markPresent);
router.get("/attendence-check", checkAttendance);
router.get("/attendence-check-at-date", checkAttendanceAtDate);
router.post("/mark-absent", markAbsent)
router.get("/attendence-by-student", checkAttendanceByStudent)


module.exports = router