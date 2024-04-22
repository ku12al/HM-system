const express = require('express');
const { check } = require('express-validator');
const { hostelRegister } = require('../controller/hostelController');
const router = express.Router();

router.post("/hostelregister",[
      check('hostelname', "hostelname is required").not().isEmpty(),
      check('location', "location is required").not().isEmpty(),
], hostelRegister)

module.exports = router