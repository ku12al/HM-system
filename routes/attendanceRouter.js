const express = require('express');
const { check } = require('express-validator');
const { markAttendance } = require('../controller/attendanceController');
const router = express.Router();

router.post("/markattendance", [
      check('roomNumber', "roomNumber is required").not().isEmpty(),
      check('student', "student is required").not().isEmpty(),
      check('status', "status is required").not().isEmpty()
], markAttendance)

module.exports = router