const express = require('express');
const { check } = require('express-validator');
const { leaveRequest } = require('../controller/leaveController');
const router = express.Router();

router.post("/leaveappli", [
      check('student', "student is required").not().isEmpty(),
      check('hostel', "hostel is required").not().isEmpty(),
      check('title', "title is required").not().isEmpty(),
      check('reason', "reason is required").not().isEmpty(),
], leaveRequest)


module.exports = router