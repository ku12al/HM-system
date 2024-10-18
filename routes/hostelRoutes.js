const express = require('express');
const { check } = require('express-validator');
const { hostelRegister, getAllStudent } = require('../controller/hostelController');
const router = express.Router();

router.post("/hostelregister",[
      check('hostelname', "hostelname is required").not().isEmpty(),
      check('location', "location is required").not().isEmpty(),
], hostelRegister)


router.post("/get-all-student",[
      check('hostel', 'Hostel is required').not().isEmpty()
], getAllStudent)

module.exports = router